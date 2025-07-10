const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WindlyAPI',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
    servers: [
      {
        url: 'https://windly-xa9w.onrender.com',
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
        Lembrete: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            usuario_id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Tomar remédio' },
            descricao: { type: 'string', example: 'Tomar remédio às 8h' },
            criado_em: {
              type: 'string',
              format: 'date-time',
              example: '2024-06-12T10:00:00Z',
            },
          },
          required: ['id', 'usuario_id', 'titulo', 'criado_em'],
        },
        CidadeFavorita: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'São Paulo' },
          },
          required: ['id', 'nome'],
        },
        UserConfig: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            usuario_id: { type: 'integer', example: 1 },
            temp_unit: { type: 'string', example: 'C' },
            pressure_unit: { type: 'string', example: 'hPa' },
            wind_unit: { type: 'string', example: 'm/s' },
            notifications_enabled: { type: 'boolean', example: true },
          },
          required: [
            'id',
            'usuario_id',
            'temp_unit',
            'pressure_unit',
            'wind_unit',
            'notifications_enabled',
          ],
        },
      },
    },
  },
  apis: ['./routes/*.js'], // onde estão seus comentários Swagger das rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
