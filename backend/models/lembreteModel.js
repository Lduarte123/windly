class Lembrete {
  constructor({ id, usuario_id, titulo, descricao, criado_em }) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.criado_em = criado_em;
  }
}

module.exports = Lembrete;