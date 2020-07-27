import express, { Request, Response } from "express";
import { requireAuth, requireOwnership, handleValidationResult } from "../middleware";
import { exceptionService } from "../services";
import { Schedule, Exception } from "../entities";
import { UpdateExceptionDto, CreateExceptionDto, HttpResponse } from "../types";
import {
  createExceptionValidator,
  updateExceptionValidator,
  optionalQueryDateRangeValidator,
} from "../middleware/validators";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  optionalQueryDateRangeValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const exceptions = await exceptionService.getExceptionsByUser(req.currentUserId);

    const resData = {
      object: "list",
      data: exceptions,
    };
    res.status(HttpResponse.OK).send(resData);
  }
);

router.get("/:id", requireAuth, requireOwnership(Exception, "params", "id"), async (req: Request, res: Response) => {
  const exception = await exceptionService.getExceptionById(req.params.id);
  res.status(HttpResponse.OK).send(exception);
});

router.post(
  "/",
  requireAuth,
  requireOwnership(Schedule, "body", "schedule", "id"),
  createExceptionValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const data: CreateExceptionDto = {
      ...req.body,
      userId: req.currentUserId,
    };
    const exception = await exceptionService.createException(data);
    res.status(HttpResponse.CREATED).send(exception);
  }
);

router.put(
  "/:id",
  requireAuth,
  requireOwnership(Exception, "params", "id"),
  updateExceptionValidator,
  handleValidationResult,
  async (req: Request, res: Response) => {
    const data: UpdateExceptionDto = { ...req.body, id: req.params.id };
    const exception = await exceptionService.updateException(data);
    res.status(HttpResponse.OK).send(exception);
  }
);

router.delete("/:id", requireAuth, requireOwnership(Exception, "params", "id"), async (req: Request, res: Response) => {
  const exception = await exceptionService.deleteException(req.params.id);
  res.status(HttpResponse.OK).send(exception);
});

export { router as exceptionRouter };
