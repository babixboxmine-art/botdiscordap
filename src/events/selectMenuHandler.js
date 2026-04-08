import {
  handleSelectCanalDepositos,
  handleSelectCanalSaques,
  handleSelectCanalFilas,
  handleSelectLogDeposito,
  handleSelectLogSaque,
  handleSelectLogAposta,
  handleSelectLogAuditoria,
  handleSelectLogSuspeita,
  handleSelectPixRemover
} from '../features/painel_config.js';

import {
  handleSelectAddDono,
  handleSelectRemoverDono
} from '../features/painel_donos.js';

import {
  handleSelectUsuarioAddSaldo,
  handleSelectUsuarioRemoverSaldo,
  handleSelectUsuarioPerfil
} from '../features/painel_saldos.js';

import {
  handleSelectAddBlacklist,
  handleSelectRemoverBlacklist
} from '../features/painel_blacklist.js';

import {
  handleSelectMediadorAddSaldo,
  handleSelectMediadorRemoverSaldo
} from '../features/painel_mediador_saldo.js';

import {
  handleSelectFilaPublicar,
  handleSelectFilaRemover,
  handleSelectCanalPublicarFila
} from '../features/filas.js';

import {
  handleSelectFilaMistoPublicar,
  handleSelectCanalPublicarFilaMisto
} from '../features/filas_misto.js';

export default {
  name: 'interactionCreate',

  execute: async (interaction) => {
    if (!interaction.isAnySelectMenu()) return;

    try {
      const id = interaction.customId;

      // CONFIG
      if (id === 'select_canal_depositos') return handleSelectCanalDepositos(interaction);
      if (id === 'select_canal_saques') return handleSelectCanalSaques(interaction);
      if (id === 'select_canal_filas') return handleSelectCanalFilas(interaction);

      if (id === 'select_log_deposito') return handleSelectLogDeposito(interaction);
      if (id === 'select_log_saque') return handleSelectLogSaque(interaction);
      if (id === 'select_log_aposta') return handleSelectLogAposta(interaction);
      if (id === 'select_log_auditoria') return handleSelectLogAuditoria(interaction);
      if (id === 'select_log_suspeita') return handleSelectLogSuspeita(interaction);

      if (id === 'select_pix_remover') return handleSelectPixRemover(interaction);

      // DONOS
      if (id === 'select_add_dono') return handleSelectAddDono(interaction);
      if (id === 'select_remover_dono') return handleSelectRemoverDono(interaction);

      // SALDOS
      if (id === 'select_usuario_add_saldo') return handleSelectUsuarioAddSaldo(interaction);
      if (id === 'select_usuario_remover_saldo') return handleSelectUsuarioRemoverSaldo(interaction);
      if (id === 'select_usuario_perfil') return handleSelectUsuarioPerfil(interaction);

      // BLACKLIST
      if (id === 'select_add_blacklist') return handleSelectAddBlacklist(interaction);
      if (id === 'select_remover_blacklist') return handleSelectRemoverBlacklist(interaction);

      // MEDIADOR
      if (id === 'select_mediador_add_saldo') return handleSelectMediadorAddSaldo(interaction);
      if (id === 'select_mediador_remover_saldo') return handleSelectMediadorRemoverSaldo(interaction);

      // FILAS
      if (id === 'select_fila_publicar') return handleSelectFilaPublicar(interaction);
      if (id.startsWith('select_canal_publicar_fila_'))
        return handleSelectCanalPublicarFila(interaction, id.replace('select_canal_publicar_fila_', ''));

      if (id === 'select_fila_remover') return handleSelectFilaRemover(interaction);

      // FILAS MISTO
      if (id === 'select_fila_misto_publicar') return handleSelectFilaMistoPublicar(interaction);
      if (id.startsWith('select_canal_publicar_fila_misto_'))
        return handleSelectCanalPublicarFilaMisto(interaction, id.replace('select_canal_publicar_fila_misto_', ''));

    } catch (err) {
      console.error('❌ SelectMenu:', err);
    }
  },
};