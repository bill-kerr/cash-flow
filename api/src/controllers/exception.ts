import express, { Request, Response, Router } from "express";
import { requireAuth, requireOwnership, handleValidationResult } from "../middleware";
import { ExceptionService } from "../services";
import { Schedule, Exception } from "../entities";
import { UpdateExceptionDto, CreateExceptionDto, HttpResponse } from "../types";
import { createExceptionValidator, updateExceptionValidator } from "../middleware/validators";
import { Controller } from ".";

export class ExceptionController implements Controller {
  constructor(private exceptionService: ExceptionService) {}

  private configureRouter = (router: Router) => {
    router.use(requireAuth);

    router.get("/", this.getExceptions);
    router.get("/:id", requireOwnership(Exception, "params", "id"), this.getException);

    router.post(
      "/",
      requireOwnership(Schedule, "body", "scheduleId", "id"),
      createExceptionValidator,
      handleValidationResult,
      this.createException
    );

    router.put(
      "/:id",
      requireOwnership(Exception, "params", "id"),
      updateExceptionValidator,
      handleValidationResult,
      this.updateException
    );

    router.delete("/:id", requireOwnership(Exception, "params", "id"), this.deleteException);
  };

  private getExceptions = async (req: Request, res: Response) => {
    const exceptions = await this.exceptionService.getExceptionsByUser(req.currentUserId);
    const resData = {
      object: "list",
      data: exceptions,
    };
    res.status(HttpResponse.OK).send(resData);
  };

  private getException = async (req: Request, res: Response) => {
    const exception = await this.exceptionService.getExceptionById(req.params.id);
    res.status(HttpResponse.OK).send(exception);
  };

  private createException = async (req: Request, res: Response) => {
    const data: CreateExceptionDto = {
      ...req.body,
      userId: req.currentUserId,
    };
    const exception = await this.exceptionService.createException(data);
    res.status(HttpResponse.CREATED).send(exception);
  };

  private updateException = async (req: Request, res: Response) => {
    const data: UpdateExceptionDto = { ...req.body, id: req.params.id };
    const exception = await this.exceptionService.updateException(data);
    res.status(HttpResponse.OK).send(exception);
  };

  private deleteException = async (req: Request, res: Response) => {
    const exception = await this.exceptionService.deleteException(req.params.id);
    res.status(HttpResponse.OK).send(exception);
  };

  public router = () => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
