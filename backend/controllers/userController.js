const UserService = require('../services/userService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserService.createUser(name, email, password);
    return res.status(201).json(user);
  } catch (error) {
    if (error.message === 'EMAIL_IN_USE') {
      return res.status(400).json({ error: 'Este email já está sendo utilizado' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await UserService.getUserByEmail(req.query.email);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const user = await UserService.updateUser(id, name, email);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
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
  deleteUser,
};
