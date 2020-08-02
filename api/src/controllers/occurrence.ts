import express, { Request, Response, Router } from "express";
import { HttpResponseCode } from "../interfaces";
import { requireAuth, handleValidationResult } from "../middleware";
import { queryDateRangeValidator } from "../middleware/validators";
import { OccurrenceService, ScheduleService } from "../services";

export class OccurrenceController {
  constructor(private scheduleService: ScheduleService, private occurrenceService: OccurrenceService) {}

  private configureRouter = (router: Router) => {
    router.use(requireAuth);

    router.get("/", queryDateRangeValidator, handleValidationResult, this.getOccurrences);
  };

  private getOccurrences = async (req: Request, res: Response) => {
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
    res.status(HttpResponseCode.OK).send(resData);
  };

  public router = (): Router => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
