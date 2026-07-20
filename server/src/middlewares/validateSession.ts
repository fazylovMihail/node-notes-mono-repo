import type { Request, Response, NextFunction } from "express";
import db from "../db";
import { RequestUserSchema } from "../../../shared/models/User";

export default async function validateSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const sessionId = req.cookies?.session_id;

    if (!sessionId) {
      return next();
    }

    const rawUser = await db("sessions")
      .join("users", "sessions.user_id", "=", "users.id")
      .where("sessions.session_id", sessionId)
      .select("users.id", "users.username")
      .first();

    if (!rawUser) {
      res.clearCookie("session_id");
      return next();
    }

    const user = RequestUserSchema.parse(rawUser);
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
}
