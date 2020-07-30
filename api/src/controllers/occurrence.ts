import express, { Request, Response, Router } from "express";
import { HttpResponse } from "../types";
import { requireAuth, handleValidationResult } from "../middleware";
import { queryDateRangeValidator } from "../middleware/validators";
import { Controller } from ".";
import { OccurrenceService, ScheduleService } from "../services";

export class OccurrenceController implements Controller {
  constructor(private scheduleService: ScheduleService, private occurrenceService: OccurrenceService) {}

  private configureRouter(router: Router) {
    router.use(requireAuth);

    router.get("/", queryDateRangeValidator, handleValidationResult, this.getOccurrences);
  }

  private async getOccurrences(req: Request, res: Response) {
    const schedules = await this.scheduleService.getSchedules(req.currentUserId);
    const { startDate, endDate } = req.query;
    const occurrences = await this.occurrenceService.getOccurrencesBySchedules(
      schedules,
      startDate!.toString(),
      endDate!.toString()
    );

    const resData = {
      object: "list",
      data: occurrences,
    };
    res.status(HttpResponse.OK).send(resData);
  }

  public router(): Router {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  }
}
