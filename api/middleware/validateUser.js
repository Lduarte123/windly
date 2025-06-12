const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password são obrigatórios' });
  }

  next();
};

module.exports = validateUser;
