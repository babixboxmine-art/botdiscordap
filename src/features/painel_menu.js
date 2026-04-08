import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';

// SAFE REPLY (evita erro de interaction já respondida)
function safeReply(interaction, data) {
  if (interaction.replied || interaction.deferred) {
    return interaction.followUp(data);
  }
  return interaction.reply(data);
}

// ================= MENU FILAS =================
export async function handleMenuFilas(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#00D4FF')
      .setTitle('🎮 GERENCIADOR DE FILAS')
      .setDescription('Configure e gerencie as filas de apostas')
      .addFields(
        { 
          name: 'Filas Normais', 
          value: `${Array.from(mockDatabase.filas.values()).filter(f => !f.isMisto).length}`, 
          inline: true 
        },
        { 
          name: 'Filas Misto', 
          value: `${Array.from(mockDatabase.filas.values()).filter(f => f.isMisto).length}`, 
          inline: true 
        }
      )
      .setFooter({ text: 'Selecione uma opção abaixo' });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('btn_criar_fila')
          .setLabel('➕ Criar Fila')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('btn_publicar_fila')
          .setLabel('📤 Publicar Fila')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('btn_remover_fila')
          .setLabel('❌ Remover Fila')
          .setStyle(ButtonStyle.Danger)
      );

    const buttons2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('btn_criar_fila_misto')
          .setLabel('➕ Criar Fila Misto')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('btn_publicar_fila_misto')
          .setLabel('📤 Publicar Fila Misto')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('btn_remover_fila_misto')
          .setLabel('❌ Remover Fila Misto')
          .setStyle(ButtonStyle.Danger)
      );

    const buttons3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('btn_voltar_menu_principal')
          .setLabel('⬅️ Voltar')
          .setStyle(ButtonStyle.Danger)
      );

    await safeReply(interaction, {
      embeds: [embed],
      components: [buttons, buttons2, buttons3],
      ephemeral: true,
    });

  } catch (error) {
    console.error('❌ Erro handleMenuFilas:', error);
  }
}

// ================= MENU FILAS MISTO =================
export async function handleMenuFilasMisto(interaction) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setTitle('🎮 GERENCIADOR DE FILAS MISTO')
      .setDescription('Configure e gerencie as filas misto')
      .addFields(
        { 
          name: 'Filas Misto Criadas', 
          value: `${Array.from(mockDatabase.filas.values()).filter(f => f.isMisto).length}`, 
          inline: true 
        }
      )
      .setFooter({ text: 'Selecione uma opção abaixo' });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('btn_criar_fila_misto')
          .setLabel('➕ Criar Fila Misto')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('btn_publicar_fila_misto')
          .setLabel('📤 Publicar Fila Misto')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('btn_remover_fila_misto')
          .setLabel('❌ Remover Fila Misto')
          .setStyle(ButtonStyle.Danger)
      );

    const buttons2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('btn_voltar_menu_principal')
          .setLabel('⬅️ Voltar')
          .setStyle(ButtonStyle.Danger)
      );

    await safeReply(interaction, {
      embeds: [embed],
      components: [buttons, buttons2],
      ephemeral: true,
    });

  } catch (error) {
    console.error('❌ Erro handleMenuFilasMisto:', error);
  }
}