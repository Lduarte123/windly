const validateUser = (req, res, next) => {
  const { name, email, senha } = req.body;

  if (!name || !email || !senha ) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  next();
};

module.exports = validateUser;
