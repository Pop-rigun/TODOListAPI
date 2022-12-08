import { TaskList } from '../taskLists/taskList.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToOne(() => TaskList, (taskList) => taskList.task)
  public taskList: TaskList;
}