import { Router } from "express";

import authRoute from "./auth";
import notesRoute from "./notes";

const route = Router();

route.use("/auth", authRoute);
route.use("/notes", notesRoute);

export default route;
