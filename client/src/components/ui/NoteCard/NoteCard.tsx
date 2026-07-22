import { Note } from "@shared/models/Note";
import { FC, memo, useMemo } from "react";
import moment from "moment";

import "./NoteCard.scss";

interface NoteCardProps {
  note: Note;
  isSelect: boolean;
  onClick: () => void;
}

export const NoteCard: FC<NoteCardProps> = memo(
  ({ note, isSelect, onClick }) => {
    const className =
      `note-card ${isSelect ? "note-card--selected" : ""}`.trim();

    const formatedDate = useMemo(
      () => moment(note.created_at).format("DD.MM.YYYY"),
      [note.created_at],
    );

    return (
      <div className={className} role="button" tabIndex={0} onClick={onClick}>
        <span className="note-card__label">{formatedDate}</span>
        <p className="note-card__title">{note.title}</p>
      </div>
    );
  },
);

NoteCard.displayName = "NoteCard";
