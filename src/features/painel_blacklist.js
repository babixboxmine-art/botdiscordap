import {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  UserSelectMenuBuilder, StringSelectMenuBuilder,
  ModalBuilder, TextInputBuilder, TextInputStyle
} from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';
import * as logs from './logs.js';

export async function handleGerenciarBlacklist(interaction) {
  const blacklist = mockDatabase.configs.blacklist || new Set();

  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Blacklist')
    .setDescription(`Total: ${blacklist.size}`);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('btn_add_blacklist').setLabel('Bloquear').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('btn_remover_blacklist').setLabel('Desbloquear').setStyle(ButtonStyle.Success)
  );

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

export async function handleAddBlacklist(interaction) {
  const row = new ActionRowBuilder().addComponents(
    new UserSelectMenuBuilder().setCustomId('select_add_blacklist')
  );

  await interaction.reply({ content: 'Escolha usuário', components: [row], ephemeral: true });
}

export async function handleSelectAddBlacklist(interaction) {
  const userId = interaction.values[0];

  const modal = new ModalBuilder()
    .setCustomId(`modal_blacklist_${userId}`)
    .setTitle('Motivo')
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder().setCustomId('motivo').setLabel('Motivo').setStyle(TextInputStyle.Paragraph)
      )
    );

  await interaction.showModal(modal);
}