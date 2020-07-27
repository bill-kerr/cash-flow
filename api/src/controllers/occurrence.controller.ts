import express, { Request, Response } from "express";
import { HttpResponse } from "../types";
import { requireAuth, handleValidationResult } from "../middleware";
import { queryDateRangeValidator } from "../middleware/validators";
import { occurrenceService } from "../services";

const router = express.Router();

router.get("/", requireAuth, queryDateRangeValidator, handleValidationResult, async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const occurrences = await occurrenceService.getOccurrencesByUser(
    req.currentUserId,
    startDate.toString(),
    endDate.toString()
  );

  const resData = {
    object: "list",
    data: occurrences,
  };
  res.status(HttpResponse.OK).send(resData);
});

export { router as occurrenceRouter };
