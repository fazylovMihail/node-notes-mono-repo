import z from "zod";

const SessionSchema = z.object({
  session_id: z.string().length(21),
  user_id: z.string().length(21),
  created_at: z.coerce.date(),
  expired_at: z.coerce.date(),
});

type Session = z.infer<typeof SessionSchema>;

const CreateSessionSchema = SessionSchema.pick({
  session_id: true,
  user_id: true,
});

type CreateSession = z.infer<typeof CreateSessionSchema>;

export { SessionSchema, Session, CreateSessionSchema, CreateSession };
