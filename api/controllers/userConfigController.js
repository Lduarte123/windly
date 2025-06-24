const service = require('../services/userConfigService');

exports.getConfig = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    let config = await service.getConfig(usuario_id);
    if (!config) {
      config = await service.createConfig(usuario_id);
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar configuração" });
  }
};

exports.updateConfig = async (req, res) => {
  const { usuario_id } = req.params;
  const { temp_unit, pressure_unit, wind_unit, notifications_enabled } = req.body;
  try {
    // Garante que existe config antes de atualizar
    let config = await service.getConfig(usuario_id);
    if (!config) {
      await service.createConfig(usuario_id);
    }
    const updated = await service.updateConfig(usuario_id, { temp_unit, pressure_unit, wind_unit, notifications_enabled });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar configuração" });
  }
};