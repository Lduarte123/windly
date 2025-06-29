class CidadeFavorita {
  constructor({ id, nome, usuario_id }) {
    this.id = id;
    this.nome = nome;
    this.usuario_id = usuario_id;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      usuario_id: this.usuario_id,
    };
  }
}

module.exports = CidadeFavorita;