import { Schedule, Exception } from "../entities";
import { NotAuthorizedError } from "../errors";

export function verifyOwnership(resource: Schedule | Exception, userId: string) {
  if (resource.userId !== userId) {
    throw new NotAuthorizedError();
  }
}
