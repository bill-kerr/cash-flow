import { Entity, Column, BeforeInsert, PrimaryColumn, BaseEntity, ManyToOne, BeforeUpdate, RelationId } from "typeorm";
import { Expose } from "class-transformer";
import { id, getUnixTime } from "../util";
import { Schedule } from "./schedule";

@Entity()
export class Exception extends BaseEntity {
  @Expose()
  object = "exception";

  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  date: string;

  @Column({ name: "occurrence_deleted", default: false, nullable: false })
  occurrenceDeleted: boolean;

  @Column({ name: "current_date", default: null })
  currentDate: string;

  @Column({ type: "decimal", default: null })
  amount: number;

  @Column({ default: null })
  description: string;

  @Column({ name: "user_id", nullable: false })
  userId: string;

  @Expose({ name: "schedule" })
  @RelationId("schedule")
  scheduleId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.exceptions, { onDelete: "CASCADE" })
  schedule: Schedule;

  @Column({ name: "created_at" })
  createdAt: number;

  @Column({ name: "updated_at" })
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
