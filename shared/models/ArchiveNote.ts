import z from "zod";
import { NoteSchema } from "./Note";

const ArchiveNoteSchema = NoteSchema.extend({
  archived_at: z.coerce.date(),
});

type ArchiveNote = z.infer<typeof ArchiveNoteSchema>;

const ArchiveNotesListSchema = z.array(ArchiveNoteSchema);

type ArchiveNotesList = z.infer<typeof ArchiveNotesListSchema>;

export {
  ArchiveNoteSchema,
  ArchiveNote,
  ArchiveNotesListSchema,
  ArchiveNotesList,
};
