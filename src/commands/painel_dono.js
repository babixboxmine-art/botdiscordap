import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('painel_dono')
    .setDescription('Abre o painel administrativo do dono'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const donos = mockDatabase.configs.donos || [];

      if (!donos.includes(userId)) {
        return interaction.reply({
          content: '❌ Apenas donos podem acessar este painel',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#1f1f1f')
        .setTitle('🔧 PAINEL DO DONO')
        .setDescription('Gerencie todos os aspectos do bot')
        .addFields(
          { name: '💰 Lucro Total', value: `R$${(mockDatabase.configs.lucroTotal || 0).toFixed(2)}`, inline: true },
          { name: '👥 Usuários', value: `${mockDatabase.users.size}`, inline: true },
          { name: '🎮 Apostas', value: `${mockDatabase.apostas.size}`, inline: true }
        );

      const rows = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('btn_menu_config').setLabel('⚙️ Configurações').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('btn_menu_filas').setLabel('🎮 Filas').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('btn_menu_mediadores').setLabel('👨‍⚖️ Mediadores').setStyle(ButtonStyle.Primary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('btn_menu_logs').setLabel('📋 Logs').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('btn_menu_financeiro').setLabel('💰 Financeiro').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('btn_menu_seguranca').setLabel('🔐 Segurança').setStyle(ButtonStyle.Primary)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('btn_menu_ranking').setLabel('🏆 Ranking').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('btn_menu_eventos').setLabel('🎉 Eventos').setStyle(ButtonStyle.Primary)
        )
      ];

      await interaction.reply({
        embeds: [embed],
        components: rows,
        ephemeral: true,
      });

    } catch (error) {
      console.error('❌ Erro em painel_dono:', error);

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Erro ao abrir painel',
          ephemeral: true,
        });
      }
    }
  },
};