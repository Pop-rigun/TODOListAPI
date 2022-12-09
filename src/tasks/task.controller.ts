import { TaskService } from './task.service';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../exeptions/exeptions';
import { UserService } from '../users/user.service';
import { TaskListService } from '../taskLists/taskList.service';

const taskService = new TaskService();
const userService = new UserService();
const taskListService = new TaskListService();

export async function taskController(fastify) {
  fastify.route({
    method: 'POST',
    url: '/task/create',
    preHandler: fastify.auth([fastify.JWTverify]),

    schema: {
      description: 'Create new task',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          text: { type: 'string' },
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
        const { title, text, taskListTitle } = request.body;
        const { name } = request.user;
        const permissions = await userService.checkPermissions(
          name,
          taskListTitle,
        );
        if (!permissions.admin && !permissions.create) {
          throw new ForbiddenError();
        }
        const task = await taskService.findByTitle(title);
        if (task) {
          throw new BadRequestError('Task with this name is already exists');
        }
        const taskList = await taskListService.findByTitle(taskListTitle);
        const createInfo = await taskService.create(title, text, taskList);
        return createInfo;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  fastify.route({
    method: 'POST',
    url: '/task/getone',
    preHandler: fastify.auth([fastify.JWTverify]),
    schema: {
      description: 'Get task',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          taskListTitle: { type: 'string' },
        },
      },
    },
    handler: async (request) => {
      try {
        const { title, taskListTitle } = request.body;
        const { name } = request.user;
        const permissions = await userService.checkPermissions(
          name,
          taskListTitle,
        );
        if (!permissions.admin && !permissions.read) {
          throw new ForbiddenError();
        }
        const task = await taskService.findByTitle(title);
        return task;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  fastify.route({
    method: 'POST',
    url: '/task/getallinlist',
    preHandler: fastify.auth([fastify.JWTverify]),
    schema: {
      description: 'get all tasks in list',
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
          description: 'taskList with this title not found',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          description: 'Error while sending getting tasks',
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
        const { taskListTitle } = request.body;
        const { name } = request.user;
        const permissions = await userService.checkPermissions(
          name,
          taskListTitle,
        );
        if (!permissions.admin && !permissions.read) {
          throw new ForbiddenError();
        }
        const taskList = await taskListService.findByTitle(taskListTitle);
        const tasks = await taskService.findAllInList(taskList);
        return tasks;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  fastify.route({
    method: 'PUT',
    url: '/task/update',
    preHandler: fastify.auth([fastify.JWTverify]),
    schema: {
      description: 'Update task',
      body: {
        type: 'object',
        properties: {
          oldTitle: { type: 'string' },
          newTitle: { type: 'string' },
          text: { type: 'string' },
          taskListTitle: { type: 'string' },
        },
      },
      response: {
        404: {
          type: 'object',
          description: 'Task with this title not found',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          description: 'Error while updating task',
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
        const { oldTitle, newTitle, text, taskListTitle } = request.body;
        const { name } = request.user;
        const permissions = await userService.checkPermissions(
          name,
          taskListTitle,
        );
        if (!permissions.admin && !permissions.update) {
          throw new ForbiddenError();
        }
        const oldTask = await taskService.findByTitle(oldTitle);
        if (!oldTask) {
          throw new NotFoundError(oldTitle);
        }
        const newTask = await taskService.findByTitle(newTitle);
        if (newTask) {
          throw new BadRequestError('Task with this name is already exists');
        }
        const createInfo = await taskService.update(newTitle, text, oldTask);
        return createInfo;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  fastify.route({
    method: 'DELETE',
    url: '/task/delete',
    preHandler: fastify.auth([fastify.JWTverify]),
    schema: {
      description: 'Delete Task',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          taskListTitle: { type: 'string' },
        },
      },
      response: {
        404: {
          type: 'object',
          description: 'Task with this titled not found',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          description: 'Error while deleting task',
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
        const { title, taskListTitle } = request.body;
        const { name } = request.user;
        const permissions = await userService.checkPermissions(
          name,
          taskListTitle,
        );
        if (!permissions.admin && !permissions.create) {
          throw new ForbiddenError();
        }
        const task = await taskService.findByTitle(title);
        if (!task) {
          throw new NotFoundError(title);
        }
        const deleteInfo = await taskService.delete(task);
        return deleteInfo;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
}
