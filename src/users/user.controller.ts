import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../exeptions/exeptions';
import { config } from '../config';
import { TaskListService } from '../taskLists/taskList.service';
import jwt from 'jsonwebtoken';

const userService = new UserService();
const taskListService = new TaskListService();

export async function userController(fastify) {
  fastify.post(
    '/user/register',
    {
      schema: {
        description: 'Register new user',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            description: '',
            type: 'object',
            properties: {
              jwtoken: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            description: '',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request) => {
      try {
        const { name, password } = request.body;
        const candidate = await userService.findByName(name);
        if (candidate) {
          throw new BadRequestError(
            `User with name ${name} is already registered`,
          );
        }
        const hashPassword = await bcrypt.hash(password, 5);
        await userService.create(name, hashPassword);
        const jwtoken = jwt.sign({ name }, config.SECRET_KEY);
        return jwtoken;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  );
  fastify.post(
    '/user/login',
    {
      schema: {
        description: 'User login',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            description: '',
            type: 'object',
            properties: {
              jwtoken: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            description: 'User with this id not found',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            description: 'Error while sending email',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request) => {
      try {
        const { name, password } = request.body;
        const user = await userService.findByName(name);
        if (!user) {
          throw new NotFoundError(`User ${name}`);
        }
        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
          throw new BadRequestError('Invalid password');
        }
        const jwtoken = jwt.sign({ name }, config.SECRET_KEY);
        return jwtoken;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  );
  fastify.route({
    method: 'POST',
    url: '/user/givePermissions',
    preHandler: fastify.auth([fastify.JWTverify]),
    schema: {
      description: 'User login',
      body: {
        type: 'object',
        properties: {
          userName: { type: 'string' },
          taskListTitle: { type: 'string' },
          premissions: {
            type: 'object',
            properties: {
              read: { type: 'boolean' },
              write: { type: 'boolean' },
              update: { type: 'boolean' },
              remove: { type: 'boolean' },
            },
          },
        },
      },
      response: {
        200: {
          description: '',
          type: 'object',
          properties: {
            jwtoken: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          description: 'User with this id not found',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          description: 'Error while sending email',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async (request) => {
      try {
        const { userName, taskListTitle, permissions } = request.body;
        const name = request.user;
        const permission = await userService.checkPermissions(
          name,
          taskListTitle,
        );
        if (!permission.admin) {
          throw new ForbiddenError();
        }
        const user = await userService.findByName(userName);
        if (!user) {
          throw new NotFoundError(userName);
        }
        const taskList = await taskListService.findByTitle(taskListTitle);
        if (!taskList) {
          throw new NotFoundError(taskListTitle);
        }
        const givedPermissions = await userService.givePermissions(
          user,
          taskList,
          permissions,
        );
        return givedPermissions;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  fastify.route({
    method: 'GET',
    url: '/user/test',
    security: [
      {
        apiKey: [],
      },
    ],
    preHandler: fastify.auth([fastify.JWTverify]),
    handler: async (request) => {
      try {
        return request.user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
}
