const swaggerSpec = require('../../swagger/swaggerConfig');

describe('Swagger Spec', () => {
  test('should generate swagger spec object', () => {
    expect(swaggerSpec).toBeDefined();
  });

  test('should contain openapi version 3.0.0', () => {
    expect(swaggerSpec.openapi).toBe('3.0.0');
  });

  test('should have User schema defined', () => {
    expect(swaggerSpec.components.schemas.User).toBeDefined();
    expect(swaggerSpec.components.schemas.User.type).toBe('object');
  });
});
