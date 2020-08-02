import express, { Request, Response, Router } from "express";
import { HttpResponse } from "../types";
import { requireAuth, handleValidationResult } from "../middleware";
import { queryDateRangeValidator } from "../middleware/validators";
import { IOccurrenceController, IOccurrenceService, IScheduleService } from "../interfaces";

export class OccurrenceController implements IOccurrenceController {
  constructor(private scheduleService: IScheduleService, private occurrenceService: IOccurrenceService) {}

  private configureRouter = (router: Router) => {
    router.use(requireAuth);

    router.get("/", queryDateRangeValidator, handleValidationResult, this.getOccurrences);
  };

  getOccurrences = async (req: Request, res: Response) => {
    const schedules = await this.scheduleService.getSchedules(req.userId);
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
  };

  router = (): Router => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
