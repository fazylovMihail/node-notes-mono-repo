import z from "zod";

const ErrorSchema = z.object({
  message: z.string(),
});

type TError = z.infer<typeof ErrorSchema>;

export { ErrorSchema, TError };
