import { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder
} from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';
import * as logs from './logs.js';

export async function handleConfigDonos(interaction) {
  try {
    const donos = mockDatabase.configs.donos || [];

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('👑 GERENCIAR DONOS')
      .setDescription(`Você tem ${donos.length} dono(s) configurado(s)`)
      .addFields({
        name: 'Donos Atuais',
        value: donos.length > 0 ? donos.map(d => `<@${d}>`).join('\n') : 'Nenhum dono configurado'
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('btn_add_dono').setLabel('➕ Adicionar Dono').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('btn_remover_dono').setLabel('❌ Remover Dono').setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

  } catch (error) {
    console.error('❌ Erro ao configurar donos:', error);
  }
}

export async function handleAddDono(interaction) {
  try {
    const row = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId('select_add_dono')
        .setPlaceholder('Escolha um usuário')
    );

    await interaction.reply({
      content: '👑 Selecione o novo dono',
      components: [row],
      ephemeral: true
    });

  } catch (error) {
    console.error('❌ Erro ao adicionar dono:', error);
  }
}

export async function handleSelectAddDono(interaction) {
  try {
    const userId = interaction.values[0];
    const donos = mockDatabase.configs.donos || [];

    if (donos.includes(userId)) {
      return interaction.reply({ content: '❌ Já é dono', ephemeral: true });
    }

    donos.push(userId);
    mockDatabase.configs.donos = donos;

    await logs.registrarLogAuditoria('Adicionar Dono', interaction.user.id, `<@${userId}>`, 'Novo dono', interaction.client);

    await interaction.reply({ content: `✅ <@${userId}> agora é dono`, ephemeral: true });

  } catch (error) {
    console.error(error);
  }
}

export async function handleRemoverDono(interaction) {
  try {
    const donos = mockDatabase.configs.donos || [];

    if (!donos.length) {
      return interaction.reply({ content: '❌ Nenhum dono', ephemeral: true });
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId('select_remover_dono')
      .addOptions(donos.map(d => ({ label: d, value: d })));

    await interaction.reply({
      content: 'Escolha quem remover',
      components: [new ActionRowBuilder().addComponents(select)],
      ephemeral: true
    });

  } catch (error) {
    console.error(error);
  }
}

export async function handleSelectRemoverDono(interaction) {
  try {
    const userId = interaction.values[0];
    const donos = mockDatabase.configs.donos || [];

    mockDatabase.configs.donos = donos.filter(d => d !== userId);

    await logs.registrarLogAuditoria('Remover Dono', interaction.user.id, `<@${userId}>`, 'Removido', interaction.client);

    await interaction.reply({ content: `✅ <@${userId}> removido`, ephemeral: true });

  } catch (error) {
    console.error(error);
  }
}