import { HttpResponse } from "../interfaces";

export { ScheduleController } from "./schedule";
export { ExceptionController } from "./exception";
export { OccurrenceController } from "./occurrence";

export const objectSerializer = (res: HttpResponse<any>): HttpResponse<any> => {
  if (Array.isArray(res.data)) {
    return {
      status: res.status,
      data: {
        object: "list",
        data: res.data,
      },
    };
  }
  return res;
};
