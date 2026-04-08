import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType
} from 'discord.js';

import mockDatabase from '../database/mockDatabase.js';
import * as helpers from '../utils/helpers.js';
import * as validacoes from './validacoes.js';
import * as logs from './logs.js';

export async function handleAbrirModalDeposito(interaction) {
  if (validacoes.validarBlacklist(interaction.user.id)) {
    return interaction.reply({ content: '❌ Você está bloqueado.', ephemeral: true });
  }

  const modal = new ModalBuilder()
    .setCustomId('modal_deposito')
    .setTitle('Depositar');

  const input = new TextInputBuilder()
    .setCustomId('valor_deposito')
    .setLabel('Valor')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(input));

  await interaction.showModal(modal);
}

export async function handleSubmitDeposito(interaction, client) {
  await interaction.deferReply({ ephemeral: true }); // 🔥 ESSENCIAL

  const valor = Number(interaction.fields.getTextInputValue('valor_deposito'));
  const userId = interaction.user.id;

  if (!validacoes.validarValorDeposito(valor)) {
    return interaction.editReply('❌ Valor inválido');
  }

  const depositoId = helpers.gerarID();
  const canalId = mockDatabase.configs.canais.depositos;

  const channel = interaction.guild.channels.cache.get(canalId);
  if (!channel) return interaction.editReply('❌ Canal não encontrado');

  const thread = await channel.threads.create({
    name: `deposito-${depositoId}`,
    type: ChannelType.PrivateThread
  });

  await thread.members.add(userId);

  const embed = new EmbedBuilder()
    .setTitle('Depósito')
    .setDescription(`Usuário: <@${userId}>\nValor: R$${valor}`);

  await thread.send({ embeds: [embed] });

  mockDatabase.updateUser(userId, {
    depositoPendente: { depositoId, valor }
  });

  logs.adicionarLogUsuario(userId, 'deposito', { valor });

  await interaction.editReply(`✅ Criado: <#${thread.id}>`);
}