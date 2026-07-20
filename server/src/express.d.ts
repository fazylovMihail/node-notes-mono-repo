import type { RequestUser } from "../../../shared/models/User";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
