import { Task } from './task.entity';
import AppDataSource from '../ormconfig';
import { Repository } from 'typeorm';
import { TaskList } from '../taskLists/taskList.entity';

export class TaskService {
  taskRepository: Repository<Task>;
  constructor() {
    this.taskRepository = AppDataSource.getRepository(Task);
  }
  async create(title: string, text: string, taskList: TaskList) {
    try {
      const taskData = {
        title,
        text,
        taskList,
      };
      const newTask = this.taskRepository.create(taskData);
      await this.taskRepository.save(newTask);
      return newTask;
    } catch (err) {
      console.log(err);
    }
  }
  async findByTitle(title: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: {
          title: title,
        },
      });
      return task;
    } catch (err) {
      console.log(err);
    }
  }
  async findAllInList(taskList: TaskList): Promise<Task[]> {
    try {
      const task = await this.taskRepository.find({
        where: {
          taskList: taskList,
        },
      });
      return task;
    } catch (err) {
      console.log(err);
    }
  }

  async update(title: string, text: string, task: Task) {
    try {
      const updatedTask = await this.taskRepository.update(task, {
        title: title,
        text: text,
      });
      return updatedTask;
    } catch (err) {
      console.log(err);
    }
  }
  async delete(task: Task): Promise<Task> {
    try {
      const deletedTask = this.taskRepository.remove(task);
      return deletedTask;
    } catch (err) {
      console.log(err);
    }
  }
}
