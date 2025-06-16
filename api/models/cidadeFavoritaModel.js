class CidadeFavorita {
  constructor({ id, nome }) {
    this.id = id;
    this.nome = nome;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
    };
  }
}

module.exports = CidadeFavorita;