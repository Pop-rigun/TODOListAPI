import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TaskList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => Task, (task) => task.taskList, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  public task?: Task[];

  @ManyToOne(() => User, (user) => user.taskLists)
  public user: User;
}
