import { TaskList } from './taskList.entity';
import AppDataSource from '../ormconfig';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserPermissions } from '../users/userPermissions.entity';

export class TaskListService {
  taskListRepository: Repository<TaskList>;
  userPermissionRepository: Repository<UserPermissions>;
  constructor() {
    this.taskListRepository = AppDataSource.getRepository(TaskList);
    this.userPermissionRepository =
      AppDataSource.getRepository(UserPermissions);
  }
  async create(title: string, user: User): Promise<TaskList> {
    try {
      const taskListData = {
        title,
        user,
      };
      const newTaskList = this.taskListRepository.create(taskListData);
      const createdTaskList = await this.taskListRepository.save(newTaskList);
      const userPermissionsData = {
        user,
        createdTaskList,
        userName: user.name,
        taskListTitle: title,
        admin: true,
      };
      const newPermissions =
        this.userPermissionRepository.create(userPermissionsData);
      await this.userPermissionRepository.save(newPermissions);
      return createdTaskList;
    } catch (err) {
      console.log(err);
    }
  }
  async findByTitle(title: string): Promise<TaskList> {
    try {
      const taskList = await this.taskListRepository.findOne({
        where: {
          title: title,
        },
      });
      return taskList;
    } catch (err) {
      console.log(err);
    }
  }
  async findListsWithPermissions(user: User): Promise<UserPermissions[]> {
    try {
      const premissions = await this.userPermissionRepository.find({
        select: {
          userName: true,
          taskListTitle: true,
          admin: true,
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        where: [
          { user: user, admin: true },
          { user: user, create: true },
          { user: user, read: true },
          { user: user, update: true },
          { user: user, delete: true },
        ],
      });

      return premissions;
    } catch (err) {
      console.log(err);
    }
  }

  async delete(taskList: TaskList): Promise<TaskList> {
    try {
      const deleteTask = await this.taskListRepository.remove(taskList);
      return deleteTask;
    } catch (err) {
      console.log(err);
    }
  }
}
