import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('painel_jogador')
    .setDescription('Abre o painel financeiro do jogador'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const user = mockDatabase.getUser(userId);

      const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('💸 PAINEL FINANCEIRO')
        .setDescription('Gerencie seu saldo e movimentações')
        .addFields(
          { name: '💸 **Deposito Mínimo:**', value: 'R$3,00', inline: false },
          { name: '🏦 **Aceitamos:**', value: 'TODOS os bancos', inline: false },
          { name: '💰 **Seu Saldo:**', value: `R$${user.saldo.toFixed(2)}`, inline: false }
        )
        .setFooter({ text: 'Utilize este painel para gerenciar seu dinheiro' });

      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('btn_depositar')
            .setLabel('Depositar')
            .setStyle(ButtonStyle.Success)
            .setEmoji('💵'),
          new ButtonBuilder()
            .setCustomId('btn_sacar')
            .setLabel('Sacar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('💸'),
          new ButtonBuilder()
            .setCustomId('btn_ver_saldo')
            .setLabel('Ver Saldo')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('💰')
        );

      await interaction.reply({
        embeds: [embed],
        components: [buttons],
        ephemeral: true,
      });
    } catch (error) {
      console.error('❌ Erro em painel_jogador:', error);
      await interaction.reply({
        content: '❌ Erro ao abrir painel',
        ephemeral: true,
      });
    }
  },
};