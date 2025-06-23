const userConfigRepository = require('../repositories/userConfigRepository');

exports.getConfig = async (req, res) => {
  const { usuario_id } = req.params;
  const config = await userConfigRepository.getConfigByUserId(usuario_id);
  if (!config) {
    // Retorna configs padrão se não existir
    return res.json({
      temp_unit: "C",
      pressure_unit: "hPa",
      wind_unit: "m/s",
      notifications_enabled: true
    });
  }
  res.json(config);
};

exports.updateConfig = async (req, res) => {
  const { usuario_id } = req.params;
  const config = req.body;
  const updated = await userConfigRepository.upsertConfig(usuario_id, config);
  res.json(updated);
};