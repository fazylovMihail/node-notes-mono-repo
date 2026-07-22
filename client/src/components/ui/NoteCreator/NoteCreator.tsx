import { fetchCreateNote } from "@client/api/Note";
import { queryClient } from "@client/api/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNote, CreateNoteSchema } from "@shared/models/Note";
import { useMutation } from "@tanstack/react-query";
import { FC, FormHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import { useNavigate } from "react-router-dom";

import "./NoteCreator.scss";
import { Helmet } from "react-helmet-async";

export const NoteCreator: FC<FormHTMLAttributes<HTMLFormElement>> = (props) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNote>({
    resolver: zodResolver(CreateNoteSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: fetchCreateNote,
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate(`/dashboard/${note.note_id}`);
    },
  });

  const onSubmit = (data: CreateNote) => {
    mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Создать заметку | Заметки</title>
      </Helmet>
      <form
        className="note-creator"
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        <div className="container">
          <div className="note-creator__content">
            <h2 className="note-creator__heading">Создать заметку</h2>
            <Input
              {...register("title")}
              modificators={["create"]}
              labelText="Название"
              id="input-title-note"
              isRequire
              errorText={errors.title?.message}
            />
            <Textarea
              {...register("content")}
              modificators={["create"]}
              labelText="Контент"
              id="input-edit-note"
            />
            <Button
              modificators={["center"]}
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Создание..." : "Создать"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
