import mockDatabase from '../database/mockDatabase.js';

export function validarBlacklist(userId) {
  return mockDatabase.configs.blacklist.has(userId);
}

export function validarCanalConfigurado(tipo) {
  return Boolean(mockDatabase.configs.canais[tipo]);
}

export function validarSaldoSuficiente(userId, valor) {
  const user = mockDatabase.getUser(userId);
  if (!user) return false;
  return user.saldo >= valor;
}

export function calcularRolloverNecessario(userId) {
  const user = mockDatabase.getUser(userId) || {};

  const necessario = user.depositado || 0;
  const completo = user.apostasRoladas || 0;

  return {
    necessario,
    completo,
    faltando: Math.max(0, necessario - completo),
  };
}

export function validarRollover(userId) {
  const { necessario, completo } = calcularRolloverNecessario(userId);
  if (necessario === 0) return true;
  return completo >= necessario;
}

export function detectarPadroSuspeito(userId) {
  const user = mockDatabase.getUser(userId) || {};
  const logs = user.logs || [];

  const agora = Date.now();
  const umDiaAtras = agora - 86400000;

  const logsRecentes = logs.filter(l => new Date(l.data).getTime() > umDiaAtras);

  const alertas = [];

  const depositos = logsRecentes.filter(l => l.tipo === 'deposito').length;
  if (depositos >= 5) {
    alertas.push({ tipo: 'muitos_depositos', severidade: 'media', mensagem: `${depositos} depósitos` });
  }

  const saques = logsRecentes.filter(l => l.tipo === 'saque').length;
  if (saques >= 3) {
    alertas.push({ tipo: 'muitos_saques', severidade: 'alta', mensagem: `${saques} saques` });
  }

  return {
    suspeito: alertas.length > 0,
    alertas,
    pontuacaoRisco: alertas.length,
  };
}

export function validarValorDeposito(valor) {
  const num = Number(valor);
  return !isNaN(num) && num >= 3 && num <= 100000;
}

export function validarValorSaque(valor) {
  const num = Number(valor);
  return !isNaN(num) && num >= 5 && num <= 100000;
}

export function validarChavePix(chave) {
  return chave && chave.trim().length >= 3;
}