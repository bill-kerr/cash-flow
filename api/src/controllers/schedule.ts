import express, { Request, Response, Router } from "express";
import { handleValidationResult, requireAuth } from "../middleware";
import { ExceptionService, ScheduleService, OccurrenceService } from "../services";
import {
  createScheduleValidator,
  updateScheduleValidator,
  queryDateRangeValidator,
  createExceptionByScheduleValidator,
} from "../middleware/validators";
import { HttpResponseCode, IScheduleController, HttpRequest, HttpResponse } from "../interfaces";
import { Schedule } from "../entities";

export class ScheduleController implements IScheduleController {
  constructor(
    private scheduleService: ScheduleService,
    private exceptionService: ExceptionService,
    private occurrenceService: OccurrenceService
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

  public getSchedules = async (req: HttpRequest): Promise<HttpResponse<Schedule[]>> => {
    const schedules = await this.scheduleService.getSchedules(req.userId);
    return { status: 200, data: schedules };
  };

  private getSchedule = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    res.status(HttpResponseCode.OK).send(schedule);
  };

  private getOccurrences = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    const occurrences = await this.occurrenceService.getOccurrencesBySchedule(
      schedule,
      startDate!.toString(),
      endDate!.toString()
    );

    res.status(HttpResponseCode.OK).send({
      object: "list",
      data: occurrences,
    });
  };

  private getExceptions = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    const exceptions = await this.exceptionService.getExceptionsBySchedule(schedule);

    const resData = {
      object: "list",
      data: exceptions,
    };
    res.status(HttpResponseCode.OK).send(resData);
  };

  private createSchedule = async (req: Request, res: Response) => {
    const data = { ...req.body, userId: req.userId };
    const schedule = await this.scheduleService.createSchedule(data);
    res.status(HttpResponseCode.CREATED).send(schedule);
  };

  private createException = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.getScheduleById(req.params.id, req.userId);
    const exception = await this.exceptionService.createException({
      ...req.body,
      userId: req.userId,
      schedule: schedule.id,
    });
    res.status(HttpResponseCode.CREATED).send(exception);
  };

  private updateSchedule = async (req: Request, res: Response) => {
    const data = { ...req.body, id: req.params.id };
    const schedule = await this.scheduleService.updateSchedule(data);
    res.status(HttpResponseCode.OK).send(schedule);
  };

  private deleteSchedule = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.deleteSchedule(req.params.id, req.userId);
    res.status(HttpResponseCode.OK).send(schedule);
  };

  public router = (): Router => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
