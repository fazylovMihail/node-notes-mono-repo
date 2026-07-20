import { Request, Response, NextFunction } from "express";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ error: "Вы не авторизованы." });
  }

  next();
}
