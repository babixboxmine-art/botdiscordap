import { handleSubmitDeposito } from '../features/deposito.js';
import { handleSubmitSaque } from '../features/saque.js';
import { handleSubmitAddPix } from '../features/painel_config.js';

import {
  handleSubmitAddSaldo,
  handleSubmitRemoverSaldo
} from '../features/painel_saldos.js';

import { handleSubmitMotivoBBlacklist } from '../features/painel_blacklist.js';

import {
  handleSubmitAddSaldoMediador,
  handleSubmitRemoverSaldoMediador
} from '../features/painel_mediador_saldo.js';

import { handleSubmitCriarFila } from '../features/filas.js';
import { handleSubmitCriarFilaMisto } from '../features/filas_misto.js';

export default {
  name: 'interactionCreate',

  execute: async (interaction, client) => {
    if (!interaction.isModalSubmit()) return;

    try {
      const id = interaction.customId;

      if (id === 'modal_deposito') return handleSubmitDeposito(interaction, client);
      if (id === 'modal_saque') return handleSubmitSaque(interaction, client);
      if (id === 'modal_add_pix') return handleSubmitAddPix(interaction);

      if (id.startsWith('modal_add_saldo_'))
        return handleSubmitAddSaldo(interaction, id.replace('modal_add_saldo_', ''));

      if (id.startsWith('modal_remover_saldo_'))
        return handleSubmitRemoverSaldo(interaction, id.replace('modal_remover_saldo_', ''));

      if (id.startsWith('modal_motivo_blacklist_'))
        return handleSubmitMotivoBBlacklist(interaction, id.replace('modal_motivo_blacklist_', ''));

      if (id.startsWith('modal_add_saldo_mediador_'))
        return handleSubmitAddSaldoMediador(interaction, id.replace('modal_add_saldo_mediador_', ''));

      if (id.startsWith('modal_remover_saldo_mediador_'))
        return handleSubmitRemoverSaldoMediador(interaction, id.replace('modal_remover_saldo_mediador_', ''));

      if (id === 'modal_criar_fila') return handleSubmitCriarFila(interaction);
      if (id === 'modal_criar_fila_misto') return handleSubmitCriarFilaMisto(interaction);

    } catch (err) {
      console.error('❌ ModalHandler:', err);
    }
  },
};