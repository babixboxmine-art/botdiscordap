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

export async function handleCriarFila(interaction) {
  try {
    const modal = new ModalBuilder()
      .setCustomId('modal_criar_fila')
      .setTitle('Criar Nova Fila');

    const inputNome = new TextInputBuilder()
      .setCustomId('fila_nome')
      .setLabel('Nome da Fila')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const inputModo = new TextInputBuilder()
      .setCustomId('fila_modo')
      .setLabel('Modo (Ex: 1v1, 2v2)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const inputModelo = new TextInputBuilder()
      .setCustomId('fila_modelo')
      .setLabel('Modelo')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const inputValores = new TextInputBuilder()
      .setCustomId('fila_valores')
      .setLabel('Valores separados por vírgula')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(inputNome),
      new ActionRowBuilder().addComponents(inputModo),
      new ActionRowBuilder().addComponents(inputModelo),
      new ActionRowBuilder().addComponents(inputValores)
    );

    await interaction.showModal(modal);
  } catch (error) {
    console.error(error);
  }
}

export async function handleSubmitCriarFila(interaction) {
  try {
    const nome = interaction.fields.getTextInputValue('fila_nome');
    const modo = interaction.fields.getTextInputValue('fila_modo');
    const modelo = interaction.fields.getTextInputValue('fila_modelo');
    const valoresStr = interaction.fields.getTextInputValue('fila_valores');

    const valores = valoresStr
      .split(',')
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v) && v > 0);

    if (!valores.length) {
      return interaction.reply({ content: '❌ Nenhum valor válido', ephemeral: true });
    }

    const filaId = helpers.gerarID();

    const fila = {
      filaId,
      nome,
      modo,
      modelo,
      valores,
      jogadores: {},
      messageIds: {}, // ✅ CORREÇÃO
      ativa: true,
    };

    valores.forEach(v => {
      fila.jogadores[v] = [];
    });

    mockDatabase.filas.set(filaId, fila);

    await interaction.reply({
      content: `✅ Fila criada: ${nome}`,
      ephemeral: true
    });

  } catch (error) {
    console.error(error);
  }
}

export async function handleSelectCanalPublicarFila(interaction, filaId) {
  try {
    const canalId = interaction.values[0];
    const fila = mockDatabase.filas.get(filaId);

    if (!fila) return;

    const canal = interaction.guild.channels.cache.get(canalId);
    if (!canal) return;

    for (const valor of fila.valores) {

      // ⚠️ EMBED ORIGINAL NÃO ALTERADA
      const embed = new EmbedBuilder()
        .setColor('#00D4FF')
        .setTitle('🔔 APOSTA ROLANDO')
        .addFields(
          { name: '🎮 Modo', value: `${fila.modo} ${fila.modelo}` },
          { name: '💰 Valor', value: `R$${valor.toFixed(2)}` },
          { name: '👤 Jogadores', value: 'Aguardando Jogadores' }
        )
        .setFooter({ text: `ID: ${filaId} | Valor: R$${valor.toFixed(2)}` });

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`btn_entrar_fila_${filaId}_${valor}`)
          .setLabel('Entrar na Fila')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`btn_sair_fila_${filaId}_${valor}`)
          .setLabel('Sair da Fila')
          .setStyle(ButtonStyle.Danger)
      );

      const msg = await canal.send({ embeds: [embed], components: [buttons] });

      // ✅ CORREÇÃO AQUI
      fila.messageIds[valor] = msg.id;
    }

    mockDatabase.filas.set(filaId, fila);

    await interaction.reply({
      content: '✅ Fila publicada',
      ephemeral: true
    });

  } catch (error) {
    console.error(error);
  }
}

export async function handleEntrarFila(interaction, filaId, valor) {
  try {
    const userId = interaction.user.id;
    const user = mockDatabase.getUser(userId);
    const fila = mockDatabase.filas.get(filaId);

    if (!fila || !user) return;

    if (user.apostaAtiva) {
      return interaction.reply({ content: '❌ Já está em aposta', ephemeral: true });
    }

    // ✅ CONTAGEM CORRIGIDA
    const filasUsuario = new Set();

    for (const f of mockDatabase.filas.values()) {
      for (const lista of Object.values(f.jogadores)) {
        if (Array.isArray(lista) && lista.includes(userId)) {
          filasUsuario.add(f.filaId);
        }
      }
    }

    if (filasUsuario.size >= 3) {
      return interaction.reply({ content: '❌ Limite de filas atingido', ephemeral: true });
    }

    if (!Array.isArray(fila.jogadores[valor])) {
      fila.jogadores[valor] = [];
    }

    if (!fila.jogadores[valor].includes(userId)) {
      fila.jogadores[valor].push(userId);
    }

    mockDatabase.filas.set(filaId, fila);

    await atualizarEmbedFila(interaction, filaId, valor);

    if (fila.jogadores[valor].length === 2) {
      await criarApostaAutomatica(interaction, filaId, valor);
    }

    await interaction.reply({
      content: '✅ Entrou na fila',
      ephemeral: true
    });

  } catch (error) {
    console.error(error);
  }
}

async function atualizarEmbedFila(interaction, filaId, valor) {
  try {
    const fila = mockDatabase.filas.get(filaId);
    if (!fila) return;

    const canal = interaction.channel;
    const messageId = fila.messageIds?.[valor];

    if (!messageId || !canal) return;

    const jogadores = fila.jogadores[valor] || [];

    let texto = 'Aguardando Jogadores';
    if (jogadores.length) {
      texto = jogadores.map(id => `<@${id}>`).join('\n');
    }

    // ⚠️ EMBED ORIGINAL
    const embed = new EmbedBuilder()
      .setColor('#00D4FF')
      .setTitle('🔔 APOSTA ROLANDO')
      .addFields(
        { name: '🎮 Modo', value: `${fila.modo} ${fila.modelo}` },
        { name: '💰 Valor', value: `R$${valor.toFixed(2)}` },
        { name: '👤 Jogadores', value: texto }
      )
      .setFooter({ text: `ID: ${filaId} | Valor: R$${valor.toFixed(2)}` });

    const msg = await canal.messages.fetch(messageId).catch(() => null);
    if (!msg) return;

    await msg.edit({ embeds: [embed] });

  } catch (error) {
    console.error(error);
  }
}

async function criarApostaAutomatica(interaction, filaId, valor) {
  try {
    const fila = mockDatabase.filas.get(filaId);
    if (!fila) return;

    const jogadores = fila.jogadores[valor];
    if (!jogadores || jogadores.length !== 2) return;

    fila.jogadores[valor] = []; // limpa

    mockDatabase.filas.set(filaId, fila);

    console.log('✅ Aposta criada');

  } catch (error) {
    console.error(error);
  }
}