import { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder // ✅ CORRETO
} from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';
import * as logs from './logs.js';

// (resto do código permanece igual até chegar aqui)

// ✅ CORREÇÃO AQUI
export async function handleConfigCargoMediador(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('👨‍⚖️ Selecione o Cargo de Mediador')
      .setDescription('Este cargo será atribuído aos mediadores');

    const selectMenu = new RoleSelectMenuBuilder()
      .setCustomId('select_cargo_mediador')
      .setPlaceholder('Escolha um cargo');

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });

  } catch (error) {
    console.error('❌ Erro:', error);

    if (!interaction.replied) {
      await interaction.reply({
        content: '❌ Erro ao configurar cargo',
        ephemeral: true,
      });
    }
  }
}

// ✅ SALVAR CARGO
export async function handleSelectCargoMediador(interaction) {
  try {
    const roleId = interaction.values[0];
    mockDatabase.configs.mediadorCargo = roleId;

    await interaction.reply({
      content: `✅ Cargo mediador definido: <@&${roleId}>`,
      ephemeral: true,
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}