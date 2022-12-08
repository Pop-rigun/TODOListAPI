import { TaskService } from './task.service';
import { BadRequestError, BaseError, ForbiddenError, NotFoundError } from '../exeptions/exeptions';
import { UserService } from '../users/user.service';
import { TaskListService } from '../taskLists/taskList.service';

const taskService = new TaskService();
const userService = new UserService();
const taskListService = new TaskListService();

export async function taskController(fastify, opts) {
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
          200: {
            description:
              '',
            type: 'object',
            properties: {
              jwtoken: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            description:
              '',
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
        const { title, text, taskListTitle } = request.body
        const { name } = request.user
        const permissions = await userService.checkPermissions(name, taskListTitle)
        if (!permissions.admin && !permissions.create) {
          throw new ForbiddenError
        }
        const task = await taskService.findByTitle(title)
        if (task) {
          throw new BadRequestError('Task with this name is already exists')
        }
        const taskList = await taskListService.findByTitle(taskListTitle)
        const createInfo = await taskService.create(title,text, taskList)
        return createInfo
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  );
  fastify.route({
    method: 'GET',
    url: '/task/getone',
    preHandler: fastify.auth([fastify.JWTverify]),
      // schema: {
      //   description:
      //     'User login',
      //   body: {
      //     type: 'object',
      //     properties: {
      //       name: { type: 'string' },
      //       password: { type: 'string' },
      //     },
      //   },
      //   response: {
      //      200: {
      //       description:
      //         '',
      //       type: 'object',
      //       properties: {
      //         jwtoken: { type: 'string' },
      //       },
      //     },  
      //     404: {
      //       type: 'object',
      //       description: 'User with this id not found',
      //       properties: {
      //         statusCode: { type: 'number' },
      //         error: { type: 'string' },
      //         message: { type: 'string' },
      //       },
      //     },
      //     400: {
      //       type: 'object',
      //       description: 'Error while sending email',
      //       properties: {
      //         statusCode: { type: 'number' },
      //         error: { type: 'string' },
      //         message: { type: 'string' },
      //       },
      //     },
      //   },
      // },
    handler: async (request) => {
      try {
        const { title, taskListTitle } = request.body
        const { name } = request.user
        const permissions = await userService.checkPermissions(name, taskListTitle)
        if (!permissions.admin && !permissions.read) {
          throw new ForbiddenError
        }
        const task = await taskService.findByTitle(title)
        return task
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  );
  fastify.route({
    method: 'POST',
    url: '/task/getallinlist',
    preHandler: fastify.auth([fastify.JWTverify]),
      schema: {
        description:
          'User login',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
           200: {
            description:
              '',
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
        const { taskListTitle } = request.body
        const { name } = request.user
        const permissions = await userService.checkPermissions(name, taskListTitle)
        if (!permissions.admin && !permissions.read) {
          throw new ForbiddenError
        }
        const taskList = await taskListService.findByTitle(taskListTitle)  
        const tasks = await taskService.findAllInList(taskList)
        return tasks
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  );
  fastify.route({
    method: 'PUT',
    url: '/task/update',
    preHandler: fastify.auth([fastify.JWTverify]),
      schema: {
        description:
          'User login',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
           200: {
            description:
              '',
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
        const { oldTitle, newTitle, text, taskListTitle } = request.body
        const { name } = request.user
        const permissions = await userService.checkPermissions(name, taskListTitle)
        if (!permissions.admin && !permissions.update) {
          throw new ForbiddenError
        }
        const oldTask = await taskService.findByTitle(oldTitle)
        if(!oldTask) {
          throw new NotFoundError(oldTitle)
        }
        const newTask = await taskService.findByTitle(newTitle)
        if(newTask) {
          throw new BadRequestError('Task with this name is already exists')
        }
        const createInfo = await taskService.update(newTitle,text, oldTask)
        return createInfo
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  );
  fastify.route({
    method: 'DELETE',
    url: '/task/delete',
    preHandler: fastify.auth([fastify.JWTverify]),
      schema: {
        description:
          'User login',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
           200: {
            description:
              '',
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
        const { title, taskListTitle } = request.body
        const { name } = request.user
        const permissions = await userService.checkPermissions(name, taskListTitle)
        if (!permissions.admin && !permissions.create) {
          throw new ForbiddenError
        }
        const task = await taskService.findByTitle(title)
        if(!task) {
          throw new NotFoundError(title)
        }
        const deleteInfo = await taskService.delete(task)
        return deleteInfo
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  );
}
