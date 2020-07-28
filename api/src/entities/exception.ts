import { Entity, Column, BeforeInsert, PrimaryColumn, BaseEntity, ManyToOne, BeforeUpdate, JoinColumn } from "typeorm";
import { id, getUnixTime, merge } from "../util";
import { Schedule } from "./schedule";
import { UpdateExceptionDto } from "../types";

@Entity()
export class Exception extends BaseEntity {
  object = "exception";

  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  date: string;

  @Column({ default: false, nullable: false })
  occurrenceDeleted: boolean;

  @Column({ default: null })
  currentDate: string;

  @Column({ type: "float", default: null })
  amount: number;

  @Column({ default: null })
  description: string;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.exceptions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "schedule" })
  schedule: Schedule;

  @Column()
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

  update(dto: UpdateExceptionDto) {
    return merge(this, dto);
  }
}
