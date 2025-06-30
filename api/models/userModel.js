class User {
  constructor({ id, name, email, password, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at,
      // Não incluir password no toJSON para não vazar na resposta
    };
  }
}

module.exports = User;
