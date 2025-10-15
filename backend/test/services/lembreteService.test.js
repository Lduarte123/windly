// test/services/lembreteService.test.js

const repository = require('../../repositories/lembreteRepository');
const LembreteService = require('../../services/lembreteService');

jest.mock('../../repositories/lembreteRepository');

describe('LembreteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllByUser deve retornar todos os lembretes do usuário', async () => {
    const fakeData = [{ id: 1, title: 'Teste' }];
    repository.findAllByUser.mockResolvedValue(fakeData);

    const result = await LembreteService.getAllByUser(123);

    expect(repository.findAllByUser).toHaveBeenCalledWith(123);
    expect(result).toEqual(fakeData);
  });

  test('getById deve retornar lembrete pelo id', async () => {
    const fakeLembrete = { id: 1, title: 'Teste' };
    repository.findById.mockResolvedValue(fakeLembrete);

    const result = await LembreteService.getById(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeLembrete);
  });

  test('create deve criar um lembrete', async () => {
    const newLembrete = { title: 'Novo lembrete' };
    const createdLembrete = { id: 2, ...newLembrete };
    repository.create.mockResolvedValue(createdLembrete);

    const result = await LembreteService.create(newLembrete);

    expect(repository.create).toHaveBeenCalledWith(newLembrete);
    expect(result).toEqual(createdLembrete);
  });

  test('update deve atualizar um lembrete', async () => {
    const updateData = { title: 'Atualizado' };
    const updatedLembrete = { id: 1, ...updateData };
    repository.update.mockResolvedValue(updatedLembrete);

    const result = await LembreteService.update(1, updateData);

    expect(repository.update).toHaveBeenCalledWith(1, updateData);
    expect(result).toEqual(updatedLembrete);
  });

  test('remove deve deletar um lembrete', async () => {
    repository.remove.mockResolvedValue(true);

    const result = await LembreteService.remove(1);

    expect(repository.remove).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });
});
