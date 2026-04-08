class MockDatabase {
  constructor() {
    this.users = new Map();
    this.filas = new Map();
    this.apostas = new Map();
    this.mediadores = new Map();
    this.configs = {
      canais: {},
      pixs: [],
      mediadorCargo: null,
      blacklist: new Set(),
      donos: [], // ✅ ADICIONADO
      lucroTotal: 0 // ✅ ADICIONADO
    };
  }

  // ========== USUÁRIOS ==========
  getUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        userId,
        saldo: 0,
        depositado: 0,
        sacado: 0,
        apostas: [],
        vitorias: 0,
        derrotas: 0,
        filas: [],
        criadoEm: Date.now(),
      });
    }
    return this.users.get(userId);
  }

  updateUser(userId, data) {
    const user = this.getUser(userId);
    Object.assign(user, data);
    this.users.set(userId, user);
    return user;
  }

  // ========== FILAS ==========
  getFila(filaId) {
    return this.filas.get(filaId);
  }

  createFila(filaData) {
    const filaId = `fila_${Date.now()}`;
    this.filas.set(filaId, {
      filaId,
      ...filaData,
      jogadores: [],
      criadaEm: Date.now(),
    });
    return filaId;
  }

  // ========== APOSTAS ==========
  createAposta(apostaData) {
    const apostaId = `aposta_${Date.now()}`;
    this.apostas.set(apostaId, {
      apostaId,
      ...apostaData,
      status: 'aguardando_confirmacao',
      criadaEm: Date.now(),
    });
    return apostaId;
  }

  getAposta(apostaId) {
    return this.apostas.get(apostaId);
  }

  updateAposta(apostaId, data) {
    const aposta = this.apostas.get(apostaId);
    if (aposta) {
      Object.assign(aposta, data);
      this.apostas.set(apostaId, aposta);
    }
    return aposta;
  }

  // ========== MEDIADORES ==========
  getMediador(mediadorId) {
    if (!this.mediadores.has(mediadorId)) {
      this.mediadores.set(mediadorId, {
        mediadorId,
        saldo: 0,
        apostas: [],
        nivel: 'iniciante',
        avaliacao: 5,
        criadoEm: Date.now(),
      });
    }
    return this.mediadores.get(mediadorId);
  }

  updateMediador(mediadorId, data) {
    const med = this.getMediador(mediadorId);
    Object.assign(med, data);
    this.mediadores.set(mediadorId, med);
    return med;
  }

  // ========== LIMPAR DADOS ==========
  clearAllData() {
    this.users.clear();
    this.filas.clear();
    this.apostas.clear();
    this.mediadores.clear();
  }
}

export default new MockDatabase();