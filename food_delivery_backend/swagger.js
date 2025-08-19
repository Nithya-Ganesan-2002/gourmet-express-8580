const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express API',
      version: '1.0.0',
      description: 'A simple Express API documented with Swagger',
    },
    tags: [
      { name: 'Health', description: 'Service health checks' },
      { name: 'Database', description: 'Database connectivity and schema info' },
      { name: 'Users', description: 'User accounts and profiles' },
      { name: 'Restaurants', description: 'Restaurants and menus' },
      { name: 'Orders', description: 'Order creation and tracking' },
    ],
  },
  apis: ['./src/routes/*.js', './src/app.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
