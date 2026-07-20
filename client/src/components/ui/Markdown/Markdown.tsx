import { FC } from "react";
import { Note } from "@shared/models/Note";

import "./Markdown.scss";

interface MarkdownProps {
  note: Required<Note>["content"];
}

export const Markdown: FC<MarkdownProps> = ({ note }) => {
  return (
    <div className="markdown" dangerouslySetInnerHTML={{ __html: note }} />
  );
};
