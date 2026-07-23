import express from "express";
import cookieParser from "cookie-parser";
import { validateSession } from "./middlewares";
import apiRoute from "./routes";
import path from "path";
import { initBackgroundTasks } from "./cron";

const CLIENT_DIST_PATH = path.resolve(__dirname, "../../dist/client");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(validateSession);

app.use("/api", apiRoute);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(CLIENT_DIST_PATH));

  app.get("{*path}", (req, res) => {
    res.sendFile(path.join(CLIENT_DIST_PATH, "index.html"), (err) => {
      if (err) {
        res
          .status(404)
          .send(
            "Критическая ошибка: клиентский index.html не найден. Убедитесь, что Webpack завершил сборку.",
          );
      }
    });
  });

  app.listen(PORT, () => {
    console.log(`   Server listen on http://localhost:${PORT}`);
  });
}

initBackgroundTasks();

export default app;
