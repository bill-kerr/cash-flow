import express, { Request, Response, Router } from "express";
import { HttpResponse } from "../types";
import { handleValidationResult, requireAuth, requireOwnership } from "../middleware";
import { ExceptionService, ScheduleService, OccurrenceService } from "../services";
import { Schedule } from "../entities";
import {
  createScheduleValidator,
  updateScheduleValidator,
  queryDateRangeValidator,
  createExceptionByScheduleValidator,
} from "../middleware/validators";
import { Controller } from ".";

export class ScheduleController implements Controller {
  constructor(
    private scheduleService: ScheduleService,
    private exceptionService: ExceptionService,
    private occurrenceService: OccurrenceService
  ) {}

  private configureRouter = (router: Router) => {
    router.use(requireAuth);

    router.get("/", this.getSchedules);
    router.get("/:id", requireOwnership(Schedule, "params", "id"), this.getSchedule);
    router.get(
      "/:id/occurrences",
      requireOwnership(Schedule, "params", "id"),
      queryDateRangeValidator,
      handleValidationResult,
      this.getOccurrences
    );
    router.get("/:id/exceptions", requireOwnership(Schedule, "params", "id"), this.getExceptions);

    router.post("/", createScheduleValidator, handleValidationResult, this.createSchedule);
    router.post(
      "/:id/exceptions",
      requireOwnership(Schedule, "params", "id"),
      createExceptionByScheduleValidator,
      handleValidationResult,
      this.createException
    );

    router.put(
      "/:id",
      requireOwnership(Schedule, "params", "id"),
      updateScheduleValidator,
      handleValidationResult,
      this.updateSchedule
    );

    router.delete("/:id", requireOwnership(Schedule, "params", "id"), this.deleteSchedule);
  };

  private getSchedules = async (req: Request, res: Response) => {
    const schedules = await this.scheduleService.getSchedules(req.currentUserId!);

    const resData = {
      object: "list",
      data: schedules,
    };

    res.status(HttpResponse.OK).send(resData);
  };

  private getSchedule = async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedule = await this.scheduleService.getScheduleById(id);
    res.status(HttpResponse.OK).send(schedule);
  };

  private getOccurrences = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const schedule = await this.scheduleService.getScheduleById(id);
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

  private getExceptions = async (req: Request, res: Response) => {
    const scheduleId = req.params.id;
    const exceptions = await this.exceptionService.getExceptionsByScheduleId(scheduleId);

    const resData = {
      object: "list",
      data: exceptions,
    };
    res.status(HttpResponse.OK).send(resData);
  };

  private createSchedule = async (req: Request, res: Response) => {
    const data = { ...req.body, userId: req.currentUserId };
    const schedule = await this.scheduleService.createSchedule(data);
    res.status(HttpResponse.CREATED).send(schedule);
  };

  private createException = async (req: Request, res: Response) => {
    const scheduleId = req.params.id;
    const exception = await this.exceptionService.createException({
      ...req.body,
      userId: req.currentUserId,
      scheduleId,
    });
    res.status(HttpResponse.CREATED).send(exception);
  };

  private updateSchedule = async (req: Request, res: Response) => {
    const data = { ...req.body, id: req.params.id };
    const schedule = await this.scheduleService.updateSchedule(data);
    res.status(HttpResponse.OK).send(schedule);
  };

  private deleteSchedule = async (req: Request, res: Response) => {
    const schedule = await this.scheduleService.deleteSchedule(req.params.id);
    res.status(HttpResponse.OK).send(schedule);
  };

  public router = (): Router => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
