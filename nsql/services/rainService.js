const Rain = require('../models/rainModel');

const createRain = async (data) => {
  try {
    const newRain = new Rain(data);
    await newRain.save();
    return newRain;
  } catch (error) {
    throw new Error('Erro ao criar o registro de chuva');
  }
};

const getAllRains = async () => {
  try {
    const rains = await Rain.find({});
    return rains;
  } catch (error) {
    throw new Error('Erro ao obter registros de chuva');
  }
};

const updateRainById = async (id, chuva) => {
  try {
    const updatedRain = await Rain.findByIdAndUpdate(id, { chuva }, { new: true });
    if (!updatedRain) throw new Error('Registro não encontrado');
    return updatedRain;
  } catch (error) {
    throw new Error('Erro ao atualizar o registro de chuva');
  }
};

const deleteRainById = async (id) => {
  try {
    const deletedRain = await Rain.findByIdAndDelete(id);
    if (!deletedRain) throw new Error('Registro não encontrado');
    return deletedRain;
  } catch (error) {
    throw new Error('Erro ao deletar o registro de chuva');
  }
};

const getLast7DaysData = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const rains = await Rain.find({ data: { $gte: sevenDaysAgo } });

    const rainCount = rains.filter(rain => rain.chuva).length;
    const noRainCount = rains.filter(rain => !rain.chuva).length;

    return {
      rainCount,
      noRainCount,
      totalDays: rains.length
    };
  } catch (error) {
    throw new Error('Erro ao obter os registros dos últimos 7 dias');
  }
};

module.exports = {
  createRain,
  getAllRains,
  updateRainById,
  deleteRainById,
  getLast7DaysData
};
