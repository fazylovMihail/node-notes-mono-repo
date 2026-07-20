import z from "zod";

const NoteSchema = z.object({
  note_id: z.string().length(21),
  user_id: z.string().length(21),
  title: z
    .string()
    .min(1, "Название обязательно")
    .max(255, "Не больше 255 символов"),
  content: z.string().optional(),
  html_content: z.string().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

type Note = z.infer<typeof NoteSchema>;

type NoteId = Note["note_id"];

const NotesListSchema = z.array(NoteSchema);

type NoteList = z.infer<typeof NotesListSchema>;

const CreateNoteSchema = NoteSchema.pick({ title: true, content: true });

type CreateNote = z.infer<typeof CreateNoteSchema>;

const RawNoteSchema = NoteSchema.omit({ created_at: true, updated_at: true });

type RawNote = z.infer<typeof RawNoteSchema>;

const UpdateNoteSchema = CreateNoteSchema.partial();

type UpdateNote = z.infer<typeof UpdateNoteSchema>;

const NoteSortSchema = z.enum(["month", "three-month", "all-time"]);

type NoteSort = z.infer<typeof NoteSortSchema>;

const SearchNoteSchema = z.object({
  sort: NoteSortSchema.optional(),
  search: z.string().optional(),
  isArchive: z.boolean().default(false),
});

type SearchNote = z.infer<typeof SearchNoteSchema>;

export {
  NoteSchema,
  Note,
  NoteId,
  NotesListSchema,
  NoteList,
  CreateNoteSchema,
  CreateNote,
  RawNoteSchema,
  RawNote,
  UpdateNoteSchema,
  UpdateNote,
  NoteSortSchema,
  NoteSort,
  SearchNoteSchema,
  SearchNote,
};
