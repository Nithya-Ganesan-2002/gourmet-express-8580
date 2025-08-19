const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Delivery API',
      version: '1.0.0',
      description: 'Express API for food delivery application',
    },
    tags: [
      { name: 'Health', description: 'Service health checks' },
      { name: 'Database', description: 'Database connectivity and schema info' },
      { name: 'Users', description: 'User accounts and profiles' },
      { name: 'Restaurants', description: 'Restaurants and menus' },
      { name: 'Orders', description: 'Order creation and tracking' },
      { name: 'Cart', description: 'Cart management' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
