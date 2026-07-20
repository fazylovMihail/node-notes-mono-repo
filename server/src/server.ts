import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { validateSession } from "./middlewares";
import apiRoute from "./routes";

const app = express();
const CLIENT_DIST_PATH = path.resolve(process.cwd(), "dist/client");

app.use(express.json());
app.use(cookieParser());
app.use(validateSession);

app.use("/api", apiRoute);
app.use(express.static(CLIENT_DIST_PATH));

app.get("/*", (req, res) => {
  res.sendFile(path.join(CLIENT_DIST_PATH, "index.html"));
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`   Server listen on http://localhost:${PORT}`);
  });
}

export default app;
