import { FC, FormHTMLAttributes, KeyboardEvent, useCallback } from "react";
import { Textarea } from "../Textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { Note, UpdateNote, UpdateNoteSchema } from "@shared/models/Note";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEditArchiveNote, fetchEditNote } from "@client/api/Note";

import "./EditForm.scss";

interface EditFormProps extends FormHTMLAttributes<HTMLFormElement> {
  note: Note;
  isArchive: boolean;
  onCloseEditForm: () => void;
}

export const EditForm: FC<EditFormProps> = ({
  note,
  isArchive,
  onCloseEditForm,
  ...props
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateNote>({
    resolver: zodResolver(UpdateNoteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: UpdateNote) =>
      isArchive
        ? fetchEditArchiveNote(note.note_id, data)
        : fetchEditNote(note.note_id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [isArchive ? "archive_notes" : "notes"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["note_html_content", note.note_id],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["note_by_id", note.note_id, isArchive],
          exact: false,
        }),
      ]);
      onCloseEditForm();
    },
  });

  const onSubmit: SubmitHandler<UpdateNote> = useCallback(
    (data) => {
      editMutation.mutate(data);
    },
    [editMutation],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <form className="edit-form" onSubmit={handleSubmit(onSubmit)} {...props}>
      <Input
        {...register("title")}
        modificators={["edit"]}
        labelText="Название"
        id="input-title-note"
        isRequire
        errorText={errors.title?.message}
        onKeyDown={handleKeyDown}
      />
      <Textarea
        {...register("content")}
        labelText="Контент"
        id="input-edit-note"
      />
    </form>
  );
};
