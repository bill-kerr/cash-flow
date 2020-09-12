import { Entity, Column, BeforeInsert, PrimaryColumn, BaseEntity, ManyToOne, BeforeUpdate, RelationId } from 'typeorm';
import { id, getUnixTime } from '../util';
import { Schedule } from './schedule';
import { Expose } from 'class-transformer';

@Entity()
export class Exception extends BaseEntity {
  object = 'exception';

  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  date: string;

  @Column({ default: false, nullable: false })
  occurrenceDeleted: boolean;

  @Column({ default: null })
  currentDate: string;

  @Column({ type: 'integer', default: null })
  amount: number;

  @Column({ default: null })
  description: string;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.exceptions, { onDelete: 'CASCADE', eager: false })
  schedule: Schedule;

  @Expose({ name: 'schedule' })
  @RelationId('schedule')
  scheduleId: string;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;

  @BeforeInsert()
  addId() {
    this.id = id();
  }

  @BeforeInsert()
  addCreatedTimestamp() {
    this.createdAt = getUnixTime();
  }

  @BeforeUpdate()
  @BeforeInsert()
  updateUpdatedTimestamp() {
    this.updatedAt = getUnixTime();
  }
}
