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

// ================= MODAL =================
export async function handleAbrirModalSaque(interaction) {
  try {
    const userId = interaction.user.id;

    if (validacoes.validarBlacklist(userId)) {
      return interaction.reply({ content: '❌ Você está na blacklist.', ephemeral: true });
    }

    if (!validacoes.validarRollover(userId)) {
      const { necessario, completo, faltando } = validacoes.calcularRolloverNecessario(userId);

      return interaction.reply({
        content: `❌ Rollover incompleto\nDepositado: R$${necessario}\nApostado: R$${completo}\nFalta: R$${faltando}`,
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('modal_saque')
      .setTitle('Solicitar Saque');

    const input = new TextInputBuilder()
      .setCustomId('valor_saque')
      .setLabel('Valor')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    await interaction.showModal(modal);
  } catch (err) {
    console.error(err);
  }
}

// ================= SUBMIT =================
export async function handleSubmitSaque(interaction, client) {
  await interaction.deferReply({ ephemeral: true }); // 🔥 ESSENCIAL

  try {
    const userId = interaction.user.id;
    const valor = Number(interaction.fields.getTextInputValue('valor_saque'));

    if (!validacoes.validarValorSaque(valor)) {
      return interaction.editReply('❌ Valor inválido');
    }

    if (validacoes.validarBlacklist(userId)) {
      return interaction.editReply('❌ Você está na blacklist');
    }

    if (!validacoes.validarRollover(userId)) {
      const { faltando } = validacoes.calcularRolloverNecessario(userId);
      return interaction.editReply(`❌ Falta apostar R$${faltando}`);
    }

    if (!validacoes.validarCanalConfigurado('saques')) {
      return interaction.editReply('❌ Canal não configurado');
    }

    const user = mockDatabase.getUser(userId);
    if (!user) return interaction.editReply('❌ Usuário não encontrado');

    if (!validacoes.validarSaldoSuficiente(userId, valor)) {
      return interaction.editReply(`❌ Saldo: R$${(user.saldo || 0).toFixed(2)}`);
    }

    const saqueId = helpers.gerarID();
    const canalId = mockDatabase.configs.canais.saques;

    const channel = interaction.guild.channels.cache.get(canalId);
    if (!channel) return interaction.editReply('❌ Canal inválido');

    const thread = await channel.threads.create({
      name: `saque-${saqueId}`,
      type: ChannelType.PrivateThread,
    });

    await thread.members.add(userId);

    const donos = mockDatabase.configs.donos || [];
    for (const d of donos) {
      try { await thread.members.add(d); } catch {}
    }

    const { taxa, valorLiquido } = helpers.calcularTaxaSaque(valor);

    const embed = new EmbedBuilder()
      .setTitle('💸 Saque')
      .setDescription(
        `👤 <@${userId}>\n💰 ${valor}\n📉 Taxa: ${taxa}\n💵 Líquido: ${valorLiquido}`
      );

    await thread.send({ embeds: [embed] });

    mockDatabase.updateUser(userId, {
      ...user,
      saquePendente: {
        saqueId,
        valor,
        taxa,
        valorLiquido,
        threadId: thread.id
      }
    });

    logs.adicionarLogUsuario(userId, 'saque', { valor });

    await interaction.editReply(`✅ <#${thread.id}>`);
  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Erro ao sacar');
  }
}

// ================= ADMIN =================
export async function handleConfirmarSaqueAdmin(interaction, saqueId, client) {
  try {
    const donos = mockDatabase.configs.donos || [];

    if (!donos.includes(interaction.user.id)) {
      return interaction.reply({ content: '❌ Sem permissão', ephemeral: true });
    }

    let userId = null;

    for (const [id, user] of mockDatabase.users) {
      if (user.saquePendente?.saqueId === saqueId) {
        userId = id;
        break;
      }
    }

    if (!userId) {
      return interaction.reply({ content: '❌ Não encontrado', ephemeral: true });
    }

    const user = mockDatabase.getUser(userId);
    const { valor, taxa, valorLiquido } = user.saquePendente;

    user.saldo -= valor;
    user.saquePendente = null;

    mockDatabase.updateUser(userId, user);

    await interaction.reply({
      content: `✅ Pago R$${valorLiquido} para <@${userId}>`,
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
  }
}

// ================= CANCELAR =================
export async function handleCancelarSaqueJogador(interaction, saqueId) {
  try {
    const user = mockDatabase.getUser(interaction.user.id);

    if (!user?.saquePendente || user.saquePendente.saqueId !== saqueId) {
      return interaction.reply({ content: '❌ Não encontrado', ephemeral: true });
    }

    user.saquePendente = null;
    mockDatabase.updateUser(interaction.user.id, user);

    await interaction.reply({ content: '❌ Cancelado', ephemeral: true });

  } catch (err) {
    console.error(err);
  }
}