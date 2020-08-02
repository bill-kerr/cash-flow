import express, { Request, Response, Router } from "express";
import { requireAuth, handleValidationResult } from "../middleware";
import { ExceptionService } from "../services";
import { UpdateExceptionDto, CreateExceptionDto } from "../types";
import { HttpResponse } from "../interfaces";
import { createExceptionValidator, updateExceptionValidator } from "../middleware/validators";

export class ExceptionController {
  constructor(private exceptionService: ExceptionService) {}

  private configureRouter = (router: Router) => {
    router.use(requireAuth);

    router.get("/", this.getExceptions);
    router.get("/:id", this.getException);

    router.post("/", createExceptionValidator, handleValidationResult, this.createException);

    router.put("/:id", updateExceptionValidator, handleValidationResult, this.updateException);

    router.delete("/:id", this.deleteException);
  };

  private getExceptions = async (req: Request, res: Response) => {
    const exceptions = await this.exceptionService.getExceptionsByUser(req.userId);
    const resData = {
      object: "list",
      data: exceptions,
    };
    res.status(HttpResponse.OK).send(resData);
  };

  private getException = async (req: Request, res: Response) => {
    const exception = await this.exceptionService.getExceptionById(req.params.id, req.userId);
    res.status(HttpResponse.OK).send(exception);
  };

  private createException = async (req: Request, res: Response) => {
    const data: CreateExceptionDto = {
      ...req.body,
      userId: req.userId,
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
    const exception = await this.exceptionService.deleteException(req.params.id, req.userId);
    res.status(HttpResponse.OK).send(exception);
  };

  public router = () => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
