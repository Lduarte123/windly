const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API Node com Swagger',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@example.com' },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-06-12T10:00:00Z',
            },
          },
          required: ['id', 'name', 'email', 'created_at'],
        },
      },
    },
  },
  apis: ['./routes/*.js'], // onde estão seus comentários Swagger das rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
