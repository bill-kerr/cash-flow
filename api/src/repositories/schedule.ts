import { Repository, EntityRepository } from "typeorm";
import { Schedule } from "../entities";

@EntityRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {}
