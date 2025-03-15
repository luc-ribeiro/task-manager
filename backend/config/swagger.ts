import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Tarefas',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento de tarefas',
    },
    servers: [
      {
        url: 'http://localhost:9000',
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/types/*.ts'],
};

export const specs = swaggerJsdoc(options); 