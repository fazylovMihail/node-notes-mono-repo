import z from "zod";
import { SessionSchema } from "./Session";

const UserSchema = z.object({
  id: z.string().length(21),
  username: z
    .string()
    .min(1, "Имя обязательно.")
    .max(255, "Максимум 255 символов."),
  password: z.string().length(60),
  created_at: z.coerce.date(),
});

type User = z.infer<typeof UserSchema>;

type UserName = User["username"];

const AuthUserSchema = UserSchema.pick({ username: true }).extend({
  password: z
    .string()
    .min(8, "Минимум 8 символов.")
    .max(255, "Максимум 255 символов."),
});

type AuthUser = z.infer<typeof AuthUserSchema>;

const RawUserSchema = UserSchema.omit({ created_at: true });

type RawUser = z.infer<typeof RawUserSchema>;

const ReturningUserSchema = UserSchema.omit({ password: true });

type ReturningUser = z.infer<typeof ReturningUserSchema>;

const RequestUserSchema = UserSchema.pick({ id: true, username: true });

type RequestUser = z.infer<typeof RequestUserSchema>;

const PostAuthUserSchema = z.object({
  session: SessionSchema.shape.session_id,
  user: ReturningUserSchema,
});

type PostAuthUser = z.infer<typeof PostAuthUserSchema>;

export {
  UserSchema,
  User,
  UserName,
  AuthUserSchema,
  AuthUser,
  RawUserSchema,
  RawUser,
  ReturningUserSchema,
  ReturningUser,
  RequestUserSchema,
  RequestUser,
  PostAuthUserSchema,
  PostAuthUser,
};
