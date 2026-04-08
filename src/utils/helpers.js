/**
 * Helpers gerais do bot
 */

export function formatarMoeda(valor) {
  const num = Number(valor);
  if (isNaN(num)) return 'R$0,00';
  return `R$${num.toFixed(2).replace('.', ',')}`;
}

export function gerarID() {
  // Melhorado para reduzir chance de duplicação
  return (
    Math.random().toString(36).substring(2, 6) +
    Date.now().toString(36).substring(5)
  ).toUpperCase();
}

export function formatarData(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Data inválida';
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
}

export function validarValor(valor, minimo = 0) {
  if (valor === null || valor === undefined || valor === '') return false;
  const num = Number(valor);
  return !isNaN(num) && num >= minimo;
}

export function calcularTaxaAposta(valor) {
  const num = Number(valor);
  const taxaMediador = 0.90;

  const taxaTotal = Number((num + taxaMediador).toFixed(2));

  return {
    taxaTotal,
    taxaMediador,
    valorParaVencedor: num,
  };
}

export function calcularTaxaSaque(valor) {
  const num = Number(valor);
  const taxa = Number((num * 0.05).toFixed(2));

  return {
    valorSacado: num,
    taxa,
    valorLiquido: Number((num - taxa).toFixed(2)),
  };
}