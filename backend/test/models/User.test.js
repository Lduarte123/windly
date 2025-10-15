const User = require('../../models/userModel');

describe('User', () => {
  const dadosMock = {
    id: 123,
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    created_at: '2025-10-02T12:00:00Z',
  };

  test('deve instanciar corretamente com os dados fornecidos', () => {
    const user = new User(dadosMock);

    expect(user.id).toBe(dadosMock.id);
    expect(user.name).toBe(dadosMock.name);
    expect(user.email).toBe(dadosMock.email);
    expect(user.password).toBe(dadosMock.password);
    expect(user.created_at).toBe(dadosMock.created_at);
  });

  test('toJSON deve retornar objeto sem a senha', () => {
    const user = new User(dadosMock);

    const resultadoEsperado = {
      id: dadosMock.id,
      name: dadosMock.name,
      email: dadosMock.email,
      created_at: dadosMock.created_at,
    };

    expect(user.toJSON()).toEqual(resultadoEsperado);
  });
});
