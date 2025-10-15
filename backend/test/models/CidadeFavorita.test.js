const CidadeFavorita = require('../../models/cidadeFavoritaModel');

describe('CidadeFavorita', () => {
  const dadosMock = {
    id: 1,
    nome: 'São Paulo',
    usuario_id: 42
  };

  test('deve instanciar corretamente com os dados fornecidos', () => {
    const cidade = new CidadeFavorita(dadosMock);
    
    expect(cidade.id).toBe(dadosMock.id);
    expect(cidade.nome).toBe(dadosMock.nome);
    expect(cidade.usuario_id).toBe(dadosMock.usuario_id);
  });

  test('toJSON deve retornar o objeto esperado', () => {
    const cidade = new CidadeFavorita(dadosMock);

    const resultadoEsperado = {
      id: 1,
      nome: 'São Paulo',
      usuario_id: 42
    };

    expect(cidade.toJSON()).toEqual(resultadoEsperado);
  });
});
