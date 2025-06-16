const rainService = require('../services/rainService');

exports.createRain = async (req, res) => {
  try {
    const { chuva } = req.body;
    const newRain = await rainService.createRain(chuva);
    res.status(201).json(newRain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRains = async (req, res) => {
  try {
    const rains = await rainService.getAllRains();
    res.status(200).json(rains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRain = async (req, res) => {
  try {
    const { id } = req.params;
    const { chuva } = req.body;
    const updatedRain = await rainService.updateRainById(id, chuva);
    res.status(200).json(updatedRain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRain = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRain = await rainService.deleteRainById(id);
    res.status(200).json({ message: 'Registro de chuva deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLast7Days = async (req, res) => {
  try {
    const data = await rainService.getLast7DaysData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
