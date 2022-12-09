import { User } from './user.entity';
import AppDataSource from '../ormconfig';
import { InsertResult, Repository } from 'typeorm';
import { UserPermissions } from './userPermissions.entity';
import { TaskList } from '../taskLists/taskList.entity';
import { PermissionDto } from './dto/premissions.dto';

export class UserService {
  usersRepository: Repository<User>;
  userPermissionsRepository: Repository<UserPermissions>;
  constructor() {
    this.usersRepository = AppDataSource.getRepository(User);
    this.userPermissionsRepository =
      AppDataSource.getRepository(UserPermissions);
  }
  async create(name: string, password: string) {
    try {
      const userData = {
        name,
        password,
      };
      const newUser = this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (err) {
      //console.log(err);
    }
  }
  async findByName(name: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          name: name,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }
  async checkPermissions(
    name: string,
    taskListTitle: string,
  ): Promise<UserPermissions> {
    try {
      const permissions = await this.userPermissionsRepository.findOne({
        where: {
          userName: name,
          taskListTitle: taskListTitle,
        },
      });

      return permissions;
    } catch (err) {
      console.log(err);
    }
  }
  async givePermissions(
    user: User,
    taskList: TaskList,
    premissions: PermissionDto,
  ): Promise<InsertResult> {
    const { create, read, update, remove } = premissions;
    const givedPermissions = await this.userPermissionsRepository.upsert(
      {
        user,
        taskList,
        userName: user.name,
        taskListTitle: taskList.title,
        create,
        read,
        update,
        delete: remove,
      },
      ['create', 'read', 'update', 'delete'],
    );
    return givedPermissions;
  }

  async delete(user: User): Promise<User> {
    try {
      const deleteInfo = await this.usersRepository.remove(user);
      return deleteInfo;
    } catch (err) {
      console.log(err);
    }
  }
}
