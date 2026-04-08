import { 
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ModalBuilder, TextInputBuilder, TextInputStyle,
  UserSelectMenuBuilder
} from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';
import * as logs from './logs.js';

export async function handleAddSaldoUsuario(interaction) {
  const row = new ActionRowBuilder().addComponents(
    new UserSelectMenuBuilder().setCustomId('select_usuario_add_saldo')
  );

  await interaction.reply({
    content: 'Selecione o usuário',
    components: [row],
    ephemeral: true
  });
}

export async function handleSelectUsuarioAddSaldo(interaction) {
  const userId = interaction.values[0];

  const modal = new ModalBuilder()
    .setCustomId(`modal_add_saldo_${userId}`)
    .setTitle('Adicionar saldo')
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('valor')
          .setLabel('Valor')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      )
    );

  await interaction.showModal(modal);
}

export async function handleSubmitAddSaldo(interaction, userId) {
  const valor = Number(interaction.fields.getTextInputValue('valor'));

  if (!valor || valor <= 0) {
    return interaction.reply({ content: '❌ Valor inválido', ephemeral: true });
  }

  const user = mockDatabase.getUser(userId);
  user.saldo += valor;

  mockDatabase.updateUser(userId, user);

  await logs.registrarLogAuditoria('Add saldo', interaction.user.id, `<@${userId}>`, `+${valor}`, interaction.client);

  await interaction.reply({ content: `✅ Saldo atualizado: R$${user.saldo}`, ephemeral: true });
}