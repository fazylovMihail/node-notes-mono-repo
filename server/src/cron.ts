import cron from "node-cron";
import { deleteExpiredSessions } from "./utils";

export function initBackgroundTasks() {
  cron.schedule("0 * * * *", async () => {
    await deleteExpiredSessions();
  });
}
