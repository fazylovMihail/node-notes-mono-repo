import express from "express";
import cookieParser from "cookie-parser";
import { validateSession } from "./middlewares";
import apiRoute from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(validateSession);

app.use("/api", apiRoute);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`   Server listen on http://localhost:${PORT}`);
  });
}

export default app;
