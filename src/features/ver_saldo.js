import { EmbedBuilder } from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';

export async function handleVerSaldo(interaction) {
  try {
    const user = mockDatabase.getUser(interaction.user.id);

    if (!user) {
      return interaction.reply({
        content: '❌ Usuário não encontrado',
        ephemeral: true
      });
    }

    const saldo = Number(user.saldo) || 0;

    const embed = new EmbedBuilder()
      .setColor('#00D4FF')
      .setTitle('💰 Saldo')
      .setDescription(`R$${saldo.toFixed(2)}`);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: '❌ Erro',
      ephemeral: true
    });
  }
}