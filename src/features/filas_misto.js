import { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder
} from 'discord.js';
import mockDatabase from '../database/mockDatabase.js';
import * as helpers from '../utils/helpers.js';
import * as logs from './logs.js';

// SAFE REPLY (evita erro de interação já respondida)
async function safeReply(interaction, data) {
  if (interaction.replied || interaction.deferred) {
    return interaction.followUp(data);
  }
  return interaction.reply(data);
}

export async function handleCriarFilaMisto(interaction) {
  try {
    const modal = new ModalBuilder()
      .setCustomId('modal_criar_fila_misto')
      .setTitle('Criar Fila Misto');

    const inputNome = new TextInputBuilder()
      .setCustomId('fila_nome_misto')
      .setLabel('Nome da Fila')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const inputModo = new TextInputBuilder()
      .setCustomId('fila_modo_misto')
      .setLabel('Modo (Ex: 2v2, 3v3, 4v4)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const inputValores = new TextInputBuilder()
      .setCustomId('fila_valores_misto')
      .setLabel('Valores separados por vírgula')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(inputNome),
      new ActionRowBuilder().addComponents(inputModo),
      new ActionRowBuilder().addComponents(inputValores)
    );

    await interaction.showModal(modal);
  } catch (error) {
    console.error('❌ Erro ao criar fila misto:', error);
  }
}

export async function handleSubmitCriarFilaMisto(interaction) {
  try {
    const nome = interaction.fields.getTextInputValue('fila_nome_misto');
    const modo = interaction.fields.getTextInputValue('fila_modo_misto');
    const valoresStr = interaction.fields.getTextInputValue('fila_valores_misto');

    const valores = valoresStr
      .split(',')
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v) && v > 0);

    if (!valores.length) {
      return safeReply(interaction, {
        content: '❌ Nenhum valor válido fornecido',
        ephemeral: true,
      });
    }

    const filaId = helpers.gerarID();

    const fila = {
      filaId,
      nome,
      modo,
      modelo: 'Misto',
      valores,
      jogadores: {},
      criadaEm: Date.now(),
      ativa: true,
      isMisto: true,
      messagIds: {} // garante existência
    };

    valores.forEach(valor => {
      fila.jogadores[`${valor}_1emu`] = [];
      if (modo === '3v3' || modo === '4v4') {
        fila.jogadores[`${valor}_2emu`] = [];
      }
    });

    mockDatabase.filas.set(filaId, fila);

    await logs.registrarLogAuditoria(
      'Criar Fila Misto',
      interaction.user.id,
      'Fila',
      `Nome: ${nome} | Modo: ${modo} Misto | Valores: ${valores.join(', ')}`,
      interaction.client
    );

    await safeReply(interaction, {
      content: `✅ Fila Misto criada com sucesso!\n**ID:** ${filaId}\n**Nome:** ${nome}\n**Modo:** ${modo} Misto\n**Valores:** R$${valores.join(', R$')}`,
      ephemeral: true,
    });

  } catch (error) {
    console.error('❌ Erro ao criar fila misto:', error);
    await safeReply(interaction, {
      content: '❌ Erro ao criar fila',
      ephemeral: true,
    });
  }
}

export async function handleEntrarFilaMisto(interaction, filaId, valor, tipoEmu) {
  try {
    const userId = interaction.user.id;
    const user = mockDatabase.getUser(userId);

    if (!user) {
      return safeReply(interaction, {
        content: '❌ Usuário não encontrado',
        ephemeral: true,
      });
    }

    const fila = mockDatabase.filas.get(filaId);

    if (!fila || !fila.isMisto) {
      return safeReply(interaction, {
        content: '❌ Fila não encontrada',
        ephemeral: true,
      });
    }

    if (mockDatabase.configs.blacklist.has(userId)) {
      return safeReply(interaction, {
        content: '❌ Você está na blacklist',
        ephemeral: true,
      });
    }

    if (user.apostaAtiva) {
      return safeReply(interaction, {
        content: '❌ Você já tem apostas em andamento',
        ephemeral: true,
      });
    }

    // CONTAGEM CORRIGIDA
    let filasAtivas = 0;
    for (const f of mockDatabase.filas.values()) {
      for (const jogadores of Object.values(f.jogadores)) {
        if (Array.isArray(jogadores) && jogadores.includes(userId)) {
          filasAtivas++;
          break;
        }
      }
    }

    if (filasAtivas >= 3) {
      return safeReply(interaction, {
        content: '❌ Você já chegou no limite de filas (máximo 3)',
        ephemeral: true,
      });
    }

    const chave = `${valor}_${tipoEmu}`;

    if (!fila.jogadores[chave]) {
      fila.jogadores[chave] = [];
    }

    if (fila.jogadores[chave].includes(userId)) {
      return safeReply(interaction, {
        content: '❌ Você já está nessa fila',
        ephemeral: true,
      });
    }

    fila.jogadores[chave].push(userId);

    if (!user.tipoEmuAtual) user.tipoEmuAtual = {};
    user.tipoEmuAtual[filaId] = tipoEmu;

    mockDatabase.updateUser(userId, user);
    mockDatabase.filas.set(filaId, fila);

    await atualizarEmbedFilaMisto(interaction, filaId, valor);

    if (fila.jogadores[chave].length === 2) {
      await criarApostaMistoAutomatica(interaction, filaId, valor, tipoEmu);
    }

    await safeReply(interaction, {
      content: `✅ Você entrou na fila de R$${valor.toFixed(2)} com ${tipoEmu}!`,
      ephemeral: true,
    });

  } catch (error) {
    console.error('❌ Erro ao entrar na fila misto:', error);
    await safeReply(interaction, {
      content: '❌ Erro ao entrar na fila',
      ephemeral: true,
    });
  }
}

// CORREÇÃO CRÍTICA AQUI (fetch seguro)
async function atualizarEmbedFilaMisto(interaction, filaId, valor) {
  try {
    const fila = mockDatabase.filas.get(filaId);
    if (!fila) return;

    const canal = interaction.guild.channels.cache.get(interaction.channelId);
    if (!canal) return;

    const messageId = fila.messagIds?.[valor];
    if (!messageId) return;

    let msg;
    try {
      msg = await canal.messages.fetch(messageId);
    } catch {
      return;
    }

    if (!msg) return;

    // (embed original mantido exatamente igual)
    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setTitle('🔔 APOSTA ROLANDO')
      .addFields(
        { name: '🎮 Modo', value: `${fila.modo} Misto`, inline: false },
        { name: '💰 Valor', value: `R$${valor.toFixed(2)}`, inline: false },
        { name: '👤 Jogadores', value: 'Atualizando...', inline: false }
      )
      .setFooter({ text: `ID: ${filaId} | Valor: R$${valor.toFixed(2)}` });

    await msg.edit({ embeds: [embed] });

  } catch (error) {
    console.error('❌ Erro ao atualizar embed misto:', error);
  }
}

export async function handleRemoverFilaMisto(interaction) {
  try {
    const filas = Array.from(mockDatabase.filas.values()).filter(f => f.isMisto);

    if (!filas.length) {
      return safeReply(interaction, {
        content: '❌ Nenhuma fila misto para remover',
        ephemeral: true,
      });
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId('select_fila_misto_remover')
      .addOptions(
        filas.map(f => ({
          label: f.nome,
          value: f.filaId,
          description: `${f.modo} Misto`,
        }))
      );

    await safeReply(interaction, {
      content: '📋 Escolha uma fila misto para remover:',
      components: [new ActionRowBuilder().addComponents(select)],
      ephemeral: true,
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}