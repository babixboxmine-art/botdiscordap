import {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
  UserSelectMenuBuilder
} from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';
import * as logs from './logs.js';

export async function handleAddSaldoMediador(interaction) {
  const row = new ActionRowBuilder().addComponents(
    new UserSelectMenuBuilder().setCustomId('select_mediador_add_saldo')
  );

  await interaction.reply({ content: 'Selecione mediador', components: [row], ephemeral: true });
}

export async function handleSelectMediadorAddSaldo(interaction) {
  const id = interaction.values[0];

  const modal = new ModalBuilder()
    .setCustomId(`modal_add_saldo_mediador_${id}`)
    .setTitle('Adicionar saldo')
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('valor').setLabel('Valor').setStyle(TextInputStyle.Short)
      )
    );

  await interaction.showModal(modal);
}

export async function handleSubmitAddSaldoMediador(interaction, id) {
  const valor = Number(interaction.fields.getTextInputValue('valor'));

  if (!valor || valor <= 0) {
    return interaction.reply({ content: '❌ inválido', ephemeral: true });
  }

  const med = mockDatabase.getMediador(id);
  med.saldo += valor;

  mockDatabase.updateMediador(id, med);

  await logs.registrarLogAuditoria('Saldo mediador', interaction.user.id, `<@${id}>`, `+${valor}`, interaction.client);

  await interaction.reply({ content: `✅ Novo saldo: ${med.saldo}`, ephemeral: true });
}