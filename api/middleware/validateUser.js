const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name e email são obrigatórios' });
  }

  next();
};

module.exports = validateUser;
