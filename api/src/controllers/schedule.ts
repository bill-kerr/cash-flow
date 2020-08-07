import express, { Request, Response, Router } from "express";
import { HttpResponse } from "../types";
import { handleValidationResult, requireAuth } from "../middleware";
import {
  createScheduleValidator,
  updateScheduleValidator,
  queryDateRangeValidator,
  createExceptionByScheduleValidator,
} from "../middleware/validators";
import { IScheduleController, IScheduleService, IExceptionService, IOccurrenceService } from "../interfaces";

export class ScheduleController implements IScheduleController {
  constructor(
    private scheduleService: IScheduleService,
    private exceptionService: IExceptionService,
    private occurrenceService: IOccurrenceService
  ) {}

  private configureRouter = (router: Router) => {
    router.use(requireAuth);

    router.get("/", this.getSchedules);
    router.get("/:id", this.getSchedule);
    router.get("/:id/occurrences", queryDateRangeValidator, handleValidationResult, this.getOccurrences);
    router.get("/:id/exceptions", this.getExceptions);

    router.post("/", createScheduleValidator, handleValidationResult, this.createSchedule);
    router.post("/:id/exceptions", createExceptionByScheduleValidator, handleValidationResult, this.createException);

    router.put("/:id", updateScheduleValidator, handleValidationResult, this.updateSchedule);

    router.delete("/:id", this.deleteSchedule);
  };

  getSchedules = async (req: Request, res: Response) => {
    const schedules = await this.scheduleService.getSchedules(req.userId);

    const resData = {
      object: "list",
      data: schedules,
    };

    res.status(HttpResponse.OK).send(resData);
  };

  getSchedule = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    res.status(HttpResponse.OK).send(schedule);
  };

  getOccurrences = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    const occurrences = await this.occurrenceService.getOccurrencesBySchedule(
      schedule,
      startDate!.toString(),
      endDate!.toString()
    );

    const resData = {
      object: "list",
      data: occurrences,
    };
    res.status(HttpResponse.OK).send(resData);
  };

  getExceptions = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    const exceptions = await this.exceptionService.getExceptionsBySchedule(schedule);

    const resData = {
      object: "list",
      data: exceptions,
    };
    res.status(HttpResponse.OK).send(resData);
  };

  createSchedule = async (req: Request, res: Response) => {
    const data = { ...req.body, userId: req.userId };
    const schedule = await this.scheduleService.createSchedule(data);
    res.status(HttpResponse.CREATED).send(schedule);
  };

  createException = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    const exception = await this.exceptionService.createException({
      ...req.body,
      userId: req.userId,
      schedule: schedule.id,
    });
    res.status(HttpResponse.CREATED).send(exception);
  };

  updateSchedule = async (req: Request, res: Response) => {
    const data = { ...req.body, id: req.params.id, userId: req.userId };
    const schedule = await this.scheduleService.updateSchedule(data);
    res.status(HttpResponse.OK).send(schedule);
  };

  deleteSchedule = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.deleteSchedule(req.params.id, req.userId);
    res.status(HttpResponse.OK).send(schedule);
  };

  router = (): Router => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
