const rainService = require('../services/rainService');
const Rain = require('../models/rainModel');

exports.createRain = async (req, res) => {
  try {
    const { chuva, diasSemChuva } = req.body;
    const newRain = await rainService.createRain({ chuva, diasSemChuva });
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
    const { chuva, diasSemChuva } = req.body;
    const updatedRain = await rainService.updateRainById(id, chuva, diasSemChuva);
    res.status(200).json(updatedRain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRain = async (req, res) => {
  try {
    const { id } = req.params;
    await rainService.deleteRainById(id);
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

exports.resetDiasSemChuva = async (req, res) => {
  try {
    // Busca o último registro
    let last = await Rain.findOne().sort({ data: -1 });
    if (!last) {
      // Se não existir, cria um novo
      last = await Rain.create({
        chuva: false,
        diasSemChuva: [false, false, false, false, false, false, false]
      });
      return res.status(201).json(last);
    }
    // Atualiza o último registro
    last.diasSemChuva = [false, false, false, false, false, false, false];
    await last.save();
    res.status(200).json(last);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};