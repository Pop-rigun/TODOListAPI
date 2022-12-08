import fastify from 'fastify';
import * as dotenv from 'dotenv';
import { config } from './config';
import AppDataSource from './ormconfig';
import { userController } from './users/user.controller';
import  JWTverify  from './middleware/authMiddleware'
import { taskController } from './tasks/task.controller';
import { taskListController } from './taskLists/taskList.controller';

dotenv.config();

const server = fastify({ logger: true });
server.register(require('@fastify/swagger'))

server.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'heat-mat swagger docs',
      description: 'heat-mat swagger docs',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: config.SWAGGER_HOST,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        http: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
      }
      },
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: false,
  exposeRoute: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => console.log(error));

  console.log(config.SWAGGER_HOST);

server.register(require('@fastify/auth'));
//server.register(require('./middleware/authMiddleware'));
server.register(userController);
server.register(taskController);
server.register(taskListController);
  server.decorate('JWTverify', JWTverify)



server
  .listen({ host: '0.0.0.0', port: config.PORT })
  .then(() => console.log('Server started port:', config.PORT))
  .catch(console.error);