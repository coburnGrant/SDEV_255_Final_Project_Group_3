const swaggerJsdoc = require('swagger-jsdoc');
const ui = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ivy Tech Course Management API',
      version: '1.0.0',
      description: 'Auto-generated API documentation with Swagger',
    },
    servers: [
      {
        url: 'https://sdev-255-final-project-group-3-backend.onrender.com'
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files with JSDoc comments
};

// Initialize swagger-jsdoc
const spec = swaggerJsdoc(swaggerOptions);

module.exports = {
    spec,
    ui
};