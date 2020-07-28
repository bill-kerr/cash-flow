import { Entity, Column, BeforeInsert, PrimaryColumn, BaseEntity, OneToMany, BeforeUpdate } from "typeorm";
import { Frequency, DayOfWeek, Month, UpdateScheduleDto } from "../types";
import { id, getUnixTime, merge } from "../util";
import { Exception } from "./exception";

@Entity()
export class Schedule extends BaseEntity {
  object = "schedule";

  @PrimaryColumn()
  id: string;

  @Column({ default: 0, type: "float", nullable: false })
  amount: number;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  startDate: string;

  @Column({ default: null, type: "varchar" })
  endDate: string | null;

  @Column({ nullable: false })
  frequency: Frequency;

  @Column({ default: 1, nullable: false })
  interval: number;

  @Column({ default: null, type: "int" })
  occurrenceCount: number | null;

  @Column({ default: null, type: "varchar" })
  dayOfWeek: DayOfWeek | null;

  @Column({ default: null, type: "varchar" })
  dayOfMonth: number | null;

  @Column({ default: null, type: "varchar" })
  month: Month | null;

  @Column({ nullable: false })
  recurrenceRule: string;

  @Column({ nullable: false })
  userId: string;

  @OneToMany(() => Exception, (exception) => exception.schedule)
  exceptions: Exception[];

  @Column()
  createdAt: number;

  @Column()
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

  update(dto: UpdateScheduleDto) {
    return merge(this, dto);
  }
}
