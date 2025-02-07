const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Cinema store',
        version: '1.0.0',
      },
      servers: [
        {
            url: 'http://localhost:8000/v1/api' 
        }
      ],
    },
    apis: ['./swagger/openApi.yaml'],
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = {
    openApiDoc: openapiSpecification
};