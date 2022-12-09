import { TaskList } from '../taskLists/taskList.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TaskListPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => TaskList)
  @JoinTable()
  public taskList: TaskList[];

  @ManyToMany(() => User)
  @JoinTable()
  public user: User[];

  @Column({ default: false })
  admin: boolean;

  @Column({ default: false })
  create: boolean;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  update: boolean;

  @Column({ default: false })
  delete: boolean;
}
