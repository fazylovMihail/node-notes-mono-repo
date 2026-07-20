import { Response } from "express";
import { ZodError } from "zod";

export default function handleError(err: unknown, res: Response) {
  console.error(err instanceof Error ? err.stack : err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Ошибка валидации.",
      details: err.issues,
    });
  }

  if (err instanceof Error) {
    if ("code" in err) {
      const pgErr = err as { code: string };

      if (pgErr.code === "23505") {
        return res.status(409).json({
          message: "Пользователь с таким именем уже существует.",
        });
      }
    }
  }

  res.status(500).json({ error: "Внутренняя ошибка сервера." });
}
