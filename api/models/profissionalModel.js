class Profissional {
  constructor({ matricula, nome, profissao, salario, setor, cidade, estado }) {
    this.matricula = matricula;
    this.nome = nome;
    this.profissao = profissao;
    this.salario = salario;
    this.setor = setor;
    this.cidade = cidade;
    this.estado = estado;
  }

  // Você pode adicionar métodos auxiliares aqui, se necessário
  toJSON() {
    return {
      matricula: this.matricula,
      nome: this.nome,
      profissao: this.profissao,
      salario: this.salario,
      setor: this.setor,
      cidade: this.cidade,
      estado: this.estado,
    };
  }
}

module.exports = Profissional;
