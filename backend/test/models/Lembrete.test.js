const Lembrete = require('../../models/lembreteModel');

describe('Lembrete', () => {
  const dadosMock = {
    id: 10,
    usuario_id: 5,
    titulo: 'Comprar leite',
    descricao: 'Lembre-se de comprar leite depois do trabalho',
    criado_em: '2025-10-02T10:00:00Z',
  };

  test('deve instanciar corretamente com os dados fornecidos', () => {
    const lembrete = new Lembrete(dadosMock);

    expect(lembrete.id).toBe(dadosMock.id);
    expect(lembrete.usuario_id).toBe(dadosMock.usuario_id);
    expect(lembrete.titulo).toBe(dadosMock.titulo);
    expect(lembrete.descricao).toBe(dadosMock.descricao);
    expect(lembrete.criado_em).toBe(dadosMock.criado_em);
  });
});
