import db from "../db";

export async function deleteExpiredSessions(): Promise<void> {
  const now = new Date();

  try {
    const deletedCount = await db("sessions")
      .where("expired_at", "<", now)
      .del();

    console.log(
      `[${now.toISOString()}] Очистка завершена. Удалено сессий: ${deletedCount}`,
    );
  } catch (error) {
    console.error(
      `[${now.toISOString()}] Ошибка при очистке сессий из БД:`,
      error,
    );
  }
}
