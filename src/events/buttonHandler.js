import { 
  handleAbrirModalDeposito,
  handleConfirmarDepositoJogador,
  handleCancelarDepositoJogador,
  handleAceitarDepositoAdmin,
  handleRecusarDepositoAdmin
} from '../features/deposito.js';

import {
  handleAbrirModalSaque,
  handleConfirmarSaqueAdmin,
  handleCancelarSaqueJogador
} from '../features/saque.js';

import { handleVerSaldo } from '../features/ver_saldo.js';

import {
  mostrarMenuConfig,
  handleConfigCanalDepositos,
  handleConfigCanalSaques,
  handleConfigCanalFilas,
  handleConfigCanalLogs,
  handleConfigLogDeposito,
  handleConfigLogSaque,
  handleConfigLogAposta,
  handleConfigLogAuditoria,
  handleConfigLogSuspeita,
  handleConfigPix,
  handleAddPix,
  handleRemoverPix,
  handleConfigCargoMediador
} from '../features/painel_config.js';

import {
  handleVoltarMenuPrincipal,
  handleMenuFilas,
  handleMenuMediadores,
  handleMenuLogs,
  handleMenuFinanceiro,
  handleMenuSeguranca,
  handleMenuRanking,
  handleMenuEventos,
  handleMenuFilasMisto
} from '../features/painel_menu.js';

import {
  handleConfigDonos,
  handleAddDono,
  handleRemoverDono
} from '../features/painel_donos.js';

import {
  handleAddSaldoUsuario,
  handleRemoverSaldoUsuario,
  handlePerfilUsuario,
  handleVerHistoricoUsuario
} from '../features/painel_saldos.js';

import {
  handleGerenciarBlacklist,
  handleAddBlacklist,
  handleRemoverBlacklist
} from '../features/painel_blacklist.js';

import {
  handleAddSaldoMediador,
  handleRemoverSaldoMediador
} from '../features/painel_mediador_saldo.js';

import {
  handleEntrarFila,
  handleSairFila,
  handleCriarFila,
  handlePublicarFila,
  handleEditarFila,
  handleRemoverFila
} from '../features/filas.js';

import {
  handleEntrarFilaMisto,
  handleSairFilaMisto,
  handleCriarFilaMisto,
  handlePublicarFilaMisto,
  handleRemoverFilaMisto
} from '../features/filas_misto.js';

export default {
  name: 'interactionCreate',

  execute: async (interaction, client) => {
    if (!interaction.isButton()) return;

    try {
      const customId = interaction.customId;

      // ===== JOGADOR =====
      if (customId === 'btn_depositar') return handleAbrirModalDeposito(interaction);
      if (customId === 'btn_sacar') return handleAbrirModalSaque(interaction);
      if (customId === 'btn_ver_saldo') return handleVerSaldo(interaction);

      // ===== DEPÓSITO =====
      if (customId.startsWith('btn_confirmar_deposito_'))
        return handleConfirmarDepositoJogador(interaction, customId.split('_').pop(), client);

      if (customId.startsWith('btn_cancelar_deposito_'))
        return handleCancelarDepositoJogador(interaction, customId.split('_').pop(), client);

      if (customId.startsWith('btn_aceitar_deposito_'))
        return handleAceitarDepositoAdmin(interaction, customId.split('_').pop(), client);

      if (customId.startsWith('btn_recusar_deposito_'))
        return handleRecusarDepositoAdmin(interaction, customId.split('_').pop(), client);

      // ===== SAQUE =====
      if (customId.startsWith('btn_confirmar_saque_'))
        return handleConfirmarSaqueAdmin(interaction, customId.split('_').pop(), client);

      if (customId.startsWith('btn_cancelar_saque_jogador_'))
        return handleCancelarSaqueJogador(interaction, customId.split('_').pop(), client);

      // ===== CONFIG =====
      if (customId === 'btn_menu_config') return mostrarMenuConfig(interaction);
      if (customId === 'btn_config_canal_depositos') return handleConfigCanalDepositos(interaction);
      if (customId === 'btn_config_canal_saques') return handleConfigCanalSaques(interaction);
      if (customId === 'btn_config_canal_filas') return handleConfigCanalFilas(interaction);
      if (customId === 'btn_config_canal_logs') return handleConfigCanalLogs(interaction);

      if (customId === 'btn_config_log_deposito') return handleConfigLogDeposito(interaction);
      if (customId === 'btn_config_log_saque') return handleConfigLogSaque(interaction);
      if (customId === 'btn_config_log_aposta') return handleConfigLogAposta(interaction);
      if (customId === 'btn_config_log_auditoria') return handleConfigLogAuditoria(interaction);
      if (customId === 'btn_config_log_suspeita') return handleConfigLogSuspeita(interaction);

      if (customId === 'btn_config_pix') return handleConfigPix(interaction);
      if (customId === 'btn_add_pix') return handleAddPix(interaction);
      if (customId === 'btn_remover_pix') return handleRemoverPix(interaction);
      if (customId === 'btn_config_cargo_mediador') return handleConfigCargoMediador(interaction);
      if (customId === 'btn_config_donos') return handleConfigDonos(interaction);

      // ===== DONOS =====
      if (customId === 'btn_add_dono') return handleAddDono(interaction);
      if (customId === 'btn_remover_dono') return handleRemoverDono(interaction);

      // ===== MENUS =====
      if (customId === 'btn_voltar_menu_principal') return handleVoltarMenuPrincipal(interaction);
      if (customId === 'btn_menu_filas') return handleMenuFilas(interaction);
      if (customId === 'btn_menu_filas_misto') return handleMenuFilasMisto(interaction);
      if (customId === 'btn_menu_mediadores') return handleMenuMediadores(interaction);
      if (customId === 'btn_menu_logs') return handleMenuLogs(interaction);
      if (customId === 'btn_menu_financeiro') return handleMenuFinanceiro(interaction);
      if (customId === 'btn_menu_seguranca') return handleMenuSeguranca(interaction);

      // ===== SALDO =====
      if (customId === 'btn_add_saldo_usuario') return handleAddSaldoUsuario(interaction);
      if (customId === 'btn_remover_saldo_usuario') return handleRemoverSaldoUsuario(interaction);
      if (customId === 'btn_perfil_usuario') return handlePerfilUsuario(interaction);

      if (customId.startsWith('btn_ver_historico_'))
        return handleVerHistoricoUsuario(interaction, customId.replace('btn_ver_historico_', ''));

      // ===== MEDIADOR =====
      if (customId === 'btn_add_saldo_mediador') return handleAddSaldoMediador(interaction);
      if (customId === 'btn_remover_saldo_mediador') return handleRemoverSaldoMediador(interaction);

      // ===== BLACKLIST =====
      if (customId === 'btn_gerenciar_blacklist') return handleGerenciarBlacklist(interaction);
      if (customId === 'btn_add_blacklist') return handleAddBlacklist(interaction);
      if (customId === 'btn_remover_blacklist') return handleRemoverBlacklist(interaction);

      // ===== FILAS =====
      if (customId.startsWith('btn_entrar_fila_')) {
        const match = customId.match(/btn_entrar_fila_(.+)_(.+)$/);
        if (match) return handleEntrarFila(interaction, match[1], parseFloat(match[2]));
      }

      if (customId.startsWith('btn_sair_fila_')) {
        const match = customId.match(/btn_sair_fila_(.+)_(.+)$/);
        if (match) return handleSairFila(interaction, match[1], parseFloat(match[2]));
      }

      if (customId === 'btn_criar_fila') return handleCriarFila(interaction);
      if (customId === 'btn_publicar_fila') return handlePublicarFila(interaction);
      if (customId === 'btn_editar_fila') return handleEditarFila(interaction);
      if (customId === 'btn_remover_fila') return handleRemoverFila(interaction);

      // ===== FILAS MISTO =====
      if (customId.startsWith('btn_entrar_misto_')) {
        const match = customId.match(/btn_entrar_misto_(.+)_(.+)_(.+)$/);
        if (match) return handleEntrarFilaMisto(interaction, match[1], parseFloat(match[2]), match[3]);
      }

      if (customId.startsWith('btn_sair_misto_')) {
        const match = customId.match(/btn_sair_misto_(.+)_(.+)$/);
        if (match) return handleSairFilaMisto(interaction, match[1], parseFloat(match[2]));
      }

      if (customId === 'btn_criar_fila_misto') return handleCriarFilaMisto(interaction);
      if (customId === 'btn_publicar_fila_misto') return handlePublicarFilaMisto(interaction);
      if (customId === 'btn_remover_fila_misto') return handleRemoverFilaMisto(interaction);

    } catch (err) {
      console.error('❌ ButtonHandler:', err);
    }
  },
};