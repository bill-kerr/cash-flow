import { Entity, Column, BeforeInsert, PrimaryColumn, BaseEntity, OneToMany, BeforeUpdate } from "typeorm";
import { Expose } from "class-transformer";
import { Frequency, DayOfWeek, Month } from "../types";
import { id, getUnixTime } from "../util";
import { Exception } from "./exception";

@Entity()
export class Schedule extends BaseEntity {
  @Expose()
  object = "schedule";

  @PrimaryColumn()
  id: string;

  @Column({ default: 0, type: "decimal", precision: 2, nullable: false })
  amount: number;

  @Column({ nullable: false })
  description: string;

  @Column({ name: "start_date", nullable: false })
  startDate: string;

  @Column({ name: "end_date", default: null })
  endDate: string | null;

  @Column({ nullable: false })
  frequency: Frequency;

  @Column({ default: 1, nullable: false })
  interval: number;

  @Column({ name: "occurrence_count", default: null })
  occurrenceCount: number | null;

  @Column({ name: "day_of_week", default: null })
  dayOfWeek: DayOfWeek | null;

  @Column({ name: "day_of_month", default: null })
  dayOfMonth: number | null;

  @Column({ default: null })
  month: Month | null;

  @Column({ name: "recurrence_rule", nullable: false })
  recurrenceRule: string;

  @Column({ name: "user_id", nullable: false })
  userId: string;

  @OneToMany(() => Exception, (exception) => exception.schedule)
  exceptions: Exception[];

  @Column({ name: "created_at" })
  createdAt: number;

  @Column({ name: "updated_at" })
  updatedAt: number;

  @BeforeInsert()
  generateId() {
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
