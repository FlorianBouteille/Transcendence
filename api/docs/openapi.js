// src/docs/openapi.js
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'My API',
    version: '1.0.0',
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes.js'], // scan route annotations
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
