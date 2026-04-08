import { EmbedBuilder } from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';

function getChannel(client, canalId) {
  const guild = client.guilds.cache.first();
  if (!guild) return null;
  return guild.channels.cache.get(canalId);
}

export async function registrarLogDeposito(userId, valor, depositoId, status, client) {
  const canal = mockDatabase.configs.canais.logs_deposito;
  if (!canal) return;

  const channel = getChannel(client, canal);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('📥 Depósito')
    .setDescription(`Usuário: <@${userId}>\nValor: R$${valor}`);

  await channel.send({ embeds: [embed] });
}

export function adicionarLogUsuario(userId, tipo, dados) {
  const user = mockDatabase.getUser(userId);
  if (!user) return;

  if (!user.logs) user.logs = [];

  user.logs.push({
    tipo,
    data: new Date().toISOString(),
    ...dados
  });

  if (user.logs.length > 100) {
    user.logs = user.logs.slice(-100);
  }

  mockDatabase.updateUser(userId, user);
}