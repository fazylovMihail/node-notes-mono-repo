import z from "zod";
import { SessionSchema } from "./Session";
import { NoteSchema } from "./Note";

const UserSchema = z.object({
  id: z.string().length(21),
  username: z.string(),
  password: z.string().length(60),
  created_at: z.coerce.date(),
});

type User = z.infer<typeof UserSchema>;

type UserName = User["username"];

const LoginUserSchema = UserSchema.pick({ username: true }).extend({
  password: z.string(),
});

type LoginUser = z.infer<typeof LoginUserSchema>;

const RegisterUserSchema = z.object({
  username: z
    .string()
    .min(1, "Имя обязательно.")
    .max(255, "Максимум 255 символов."),
  password: z
    .string()
    .min(8, "Минимум 8 символов.")
    .max(255, "Максимум 255 символов."),
});

type RegisterUser = z.infer<typeof RegisterUserSchema>;

const RawUserSchema = UserSchema.omit({ created_at: true });

type RawUser = z.infer<typeof RawUserSchema>;

const ReturningUserSchema = UserSchema.omit({ password: true });

type ReturningUser = z.infer<typeof ReturningUserSchema>;

const RequestUserSchema = UserSchema.pick({ id: true, username: true });

type RequestUser = z.infer<typeof RequestUserSchema>;

const PostAuthUserSchema = z.object({
  session: SessionSchema.shape.session_id,
  user: ReturningUserSchema,
  defaultNote: NoteSchema.optional(),
});

type PostAuthUser = z.infer<typeof PostAuthUserSchema>;

export {
  UserSchema,
  User,
  UserName,
  LoginUserSchema,
  LoginUser,
  RegisterUserSchema,
  RegisterUser,
  RawUserSchema,
  RawUser,
  ReturningUserSchema,
  ReturningUser,
  RequestUserSchema,
  RequestUser,
  PostAuthUserSchema,
  PostAuthUser,
};
