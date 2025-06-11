class ValidateProfissional {
  static validate(req, res, next) {
    const { nome, profissao, salario, setor, cidade, estado } = req.body;

    if (!nome || !profissao || !salario || !setor || !cidade || !estado) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (typeof salario !== 'number' || salario < 0) {
      return res.status(400).json({ error: 'Salário deve ser um número positivo.' });
    }

    if (estado.length !== 2) {
      return res.status(400).json({ error: 'Estado deve ter 2 letras.' });
    }

    next();
  }
}

module.exports = ValidateProfissional;
