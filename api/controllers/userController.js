const userRepository = require('../repositories/userRepository');

// Criar novo usuário
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userRepository.createUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Buscar por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.getUserById(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Buscar por e-mail (login simplificado)
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await userRepository.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Atualizar nome e email
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await userRepository.updateUser(id, name, email);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Deletar
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userRepository.deleteUser(id);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
};
