class ValidateEmpresa {
//se colocar o id na validação vai pedir a validação
  static validate(req, res, next) {
    const { nome, ramo, logradouro, cidade, estado, id } = req.body; //aqui tem que deixar

    // Verifica se todos os campos obrigatórios estão presentes
    if (!nome || !ramo || !logradouro || !cidade || !estado ) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios, incluindo ID.' });
    }

    // Valida o estado para ter exatamente 2 caracteres (UF)
    if (typeof estado !== 'string' || estado.length !== 2) {
      return res.status(400).json({ error: 'Estado deve ter exatamente 2 letras.' });
    }

    // Valida o logradouro para ter um mínimo de 3 caracteres
    if (typeof logradouro !== 'string' || logradouro.length < 3) {
      return res.status(400).json({ error: 'Logradouro deve ter pelo menos 3 caracteres.' });
    }

    next(); //pra proxima função
  }
}

module.exports = ValidateEmpresa;
