import { TaskListService } from './taskList.service';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../exeptions/exeptions';
import { UserService } from '../users/user.service';

const taskListService = new TaskListService();
const userService = new UserService();

export async function taskListController(fastify) {
  fastify.route({
    method: 'POST',
    url: '/taskList/create',
    preHandler: fastify.auth([fastify.JWTverify]),

    schema: {
      description: 'Create new taskList',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
        },
      },
      response: {
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

    handler: async (request) => {
      try {
        const { title } = request.body;
        const { name } = request.user;
        const task = await taskListService.findByTitle(title);
        if (task) {
          throw new BadRequestError(
            'TaskList with this name is already exists',
          );
        }
        const user = await userService.findByName(name);
        const createInfo = await taskListService.create(title, user);
        return createInfo;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  fastify.route({
    method: 'GET',
    url: '/taskList/getall',
    preHandler: fastify.auth([fastify.JWTverify]),
    handler: async (request) => {
      try {
        const { name } = request.user;
        const user = await userService.findByName(name);
        const taskLists = await taskListService.findListsWithPermissions(user);
        return taskLists;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  fastify.route({
    method: 'DELETE',
    url: '/taskList/delete',
    preHandler: fastify.auth([fastify.JWTverify]),
    schema: {
      description: 'TaskList delete',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          password: { type: 'string' },
        },
      },
      response: {
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
          description: 'Error while deleting',
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
        const { title } = request.body;
        const { name } = request.user;
        const permissions = await userService.checkPermissions(name, title);
        if (!permissions.admin) {
          throw new ForbiddenError();
        }
        const taskList = await taskListService.findByTitle(title);
        if (!taskList) {
          throw new NotFoundError(title);
        }
        const deleteInfo = await taskListService.delete(taskList);
        return deleteInfo;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
}
