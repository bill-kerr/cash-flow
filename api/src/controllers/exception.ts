import express, { Request, Response, Router } from "express";
import { requireAuth, handleValidationResult } from "../middleware";
import { UpdateExceptionDto, CreateExceptionDto, HttpResponse } from "../types";
import { createExceptionValidator, updateExceptionValidator } from "../middleware/validators";
import { IExceptionController, IExceptionService } from "../interfaces";

export class ExceptionController implements IExceptionController {
  constructor(private exceptionService: IExceptionService) {}

  private configureRouter = (router: Router) => {
    router.use(requireAuth);

    router.get("/", this.getExceptions);
    router.get("/:id", this.getException);

    router.post("/", createExceptionValidator, handleValidationResult, this.createException);

    router.put("/:id", updateExceptionValidator, handleValidationResult, this.updateException);

    router.delete("/:id", this.deleteException);
  };

  getExceptions = async (req: Request, res: Response) => {
    const exceptions = await this.exceptionService.getExceptionsByUser(req.userId);
    const resData = {
      object: "list",
      data: exceptions,
    };
    res.status(HttpResponse.OK).send(resData);
  };

  getException = async (req: Request, res: Response) => {
    const exception = await this.exceptionService.getExceptionById(req.params.id, req.userId);
    res.status(HttpResponse.OK).send(exception);
  };

  createException = async (req: Request, res: Response) => {
    const data: CreateExceptionDto = {
      ...req.body,
      userId: req.userId,
    };

    const exception = await this.exceptionService.createException(data);
    res.status(HttpResponse.CREATED).send(exception);
  };

  updateException = async (req: Request, res: Response) => {
    const data: UpdateExceptionDto = { ...req.body, id: req.params.id };
    const exception = await this.exceptionService.updateException(data);
    res.status(HttpResponse.OK).send(exception);
  };

  deleteException = async (req: Request, res: Response) => {
    const exception = await this.exceptionService.deleteException(req.params.id, req.userId);
    res.status(HttpResponse.OK).send(exception);
  };

  router = () => {
    const router = express.Router();
    this.configureRouter(router);
    return router;
  };
}
