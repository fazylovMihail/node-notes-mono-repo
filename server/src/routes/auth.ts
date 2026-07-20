import db from "../db";
import { authMiddleware, guestMiddleware } from "../middlewares";
import { handleError } from "../utils";
import {
  AuthUserSchema,
  RawUserSchema,
  ReturningUser,
  User,
} from "../../../shared/models/User";
import { compare, hash } from "bcryptjs";
import { CookieOptions, Router } from "express";
import {
  CreateSessionSchema,
  SessionSchema,
} from "../../../shared/models/Session";
import { nanoid } from "nanoid";
import moment from "moment";
import { demoNote } from "../utils/demoNote";
import { Note, RawNote } from "../../../shared/models/Note";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: moment().add(3, "days").diff(moment()),
};

const createSession = async (user: ReturningUser) => {
  const rawSession = CreateSessionSchema.parse({
    session_id: nanoid(),
    user_id: user.id,
  });

  const data = await db("sessions")
    .insert(rawSession)
    .returning("*")
    .then((results) => results[0]);

  const { session_id } = SessionSchema.parse(data);

  return session_id;
};

const route = Router();

route.post("/register", guestMiddleware, async (req, res) => {
  try {
    const { username, password } = AuthUserSchema.parse(req.body);
    const hashedPassword = await hash(password, 10);

    const rawUser = RawUserSchema.parse({
      id: nanoid(),
      username,
      password: hashedPassword,
    });

    const returningUser: ReturningUser = await db("users")
      .insert(rawUser)
      .returning(["id", "username", "created_at"])
      .then((results) => results[0]);

    const sessionId = await createSession(returningUser);

    const rawNote: RawNote = {
      note_id: nanoid(),
      user_id: returningUser.id,
      ...demoNote,
    };

    const returningNote: Note = await db("notes")
      .insert(rawNote)
      .returning("*")
      .then((results) => results[0]);

    res.status(200).cookie("session_id", sessionId, COOKIE_OPTIONS).json({
      session: sessionId,
      user: returningUser,
      defaultNote: returningNote,
    });
  } catch (err) {
    handleError(err, res);
  }
});

route.post("/login", guestMiddleware, async (req, res) => {
  try {
    const { username, password } = AuthUserSchema.parse(req.body);

    const user: User = await db
      .select()
      .table("users")
      .where({ username })
      .returning("*")
      .first();

    if (!user) {
      return res.status(401).json({ error: "Неверный логин или пароль." });
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Неверный логин или пароль." });
    }

    const sessionId = await createSession(user);

    const { password: _, ...returningUser } = user;

    res.status(200).cookie("session_id", sessionId, COOKIE_OPTIONS).json({
      session: sessionId,
      user: returningUser,
    });
  } catch (err) {
    handleError(err, res);
  }
});

route.post("/logout", authMiddleware, async (req, res) => {
  try {
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
      return res.sendStatus(400);
    }

    res.clearCookie("session_id", COOKIE_OPTIONS);

    const userId = req.user?.id;
    const deletedCount: number = await db("sessions")
      .where({ session_id: sessionId, user_id: userId })
      .delete();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Сессия не найдена." });
    }

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

route.get("/me", authMiddleware, async (req, res) => {
  try {
    res.status(200).json(req.user?.username);
  } catch (err) {
    handleError(err, res);
  }
});

export default route;
