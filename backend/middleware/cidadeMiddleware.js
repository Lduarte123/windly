validateUsuarioIdInQuery = (req, res, next) => {
  const { usuario_id } = req.query;
  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id é obrigatório.' });
  }
  next();
}

validateUsuarioIdInBody = (req, res, next) => {
  const { usuario_id } = req.body;
  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id é obrigatório.' });
  }
  next();
}

validateNomeAndUsuarioIdInBody = (req, res, next) => {
  const { nome, usuario_id } = req.body;
  if (!nome || !usuario_id) {
    return res.status(400).json({ error: 'Nome e usuario_id são obrigatórios.' });
  }
  next();
}

module.exports = {
  validateUsuarioIdInQuery,
  validateUsuarioIdInBody,
  validateNomeAndUsuarioIdInBody,
};