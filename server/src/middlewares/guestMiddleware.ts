import { Request, Response, NextFunction } from "express";

export default function guestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user) {
    return res.status(400).json({ error: "Вы уже авторизованы." });
  }

  next();
}
