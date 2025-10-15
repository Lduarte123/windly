// test/services/userConfigService.test.js

const repository = require('../../repositories/userConfigRepository');
const UserConfigService = require('../../services/userConfigService');

jest.mock('../../repositories/userConfigRepository');

describe('UserConfigService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getConfig deve retornar configuração do usuário', async () => {
    const fakeConfig = { theme: 'dark' };
    repository.findByUserId.mockResolvedValue(fakeConfig);

    const result = await UserConfigService.getConfig(1);

    expect(repository.findByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeConfig);
  });

  test('createConfig deve criar configuração para o usuário', async () => {
    const fakeCreatedConfig = { usuario_id: 1, theme: 'default' };
    repository.create.mockResolvedValue(fakeCreatedConfig);

    const result = await UserConfigService.createConfig(1);

    expect(repository.create).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeCreatedConfig);
  });

  test('updateConfig deve atualizar configuração do usuário', async () => {
    const configUpdate = { theme: 'light' };
    const fakeUpdatedConfig = { usuario_id: 1, theme: 'light' };
    repository.update.mockResolvedValue(fakeUpdatedConfig);

    const result = await UserConfigService.updateConfig(1, configUpdate);

    expect(repository.update).toHaveBeenCalledWith(1, configUpdate);
    expect(result).toEqual(fakeUpdatedConfig);
  });
});
