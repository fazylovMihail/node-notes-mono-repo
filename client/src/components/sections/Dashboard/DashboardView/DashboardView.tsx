import { useNavigate, useOutletContext } from "react-router-dom";
import { DashboardActions } from "../DashboardActions";
import { ErrorLabel, Loader, Markdown } from "@client/components/ui";
import { getArchivePath } from "@client/utils";
import { DashboardContext } from "@client/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteHtmlContent } from "@client/api/Note";
import { useCallback } from "react";

export function DashboardView() {
  const navigate = useNavigate();
  const { note, isArchive } = useOutletContext<DashboardContext>();

  const { data: htmlNote, status } = useQuery({
    queryFn: () => fetchNoteHtmlContent(note!),
    queryKey: ["note_html_content", note?.note_id],
    enabled: !!note?.note_id,
    refetchOnWindowFocus: false,
  });

  const handleOpenEditForm = useCallback(() => {
    navigate(`/dashboard${getArchivePath(isArchive)}/${note?.note_id}/edit`);
  }, [navigate, isArchive, note]);

  if (!note) {
    return <ErrorLabel message="Заметка не найдена." />;
  }

  switch (status) {
    case "pending":
      return <Loader />;
    case "error":
      return <ErrorLabel message="Html контент не найден." />;
    case "success":
      return (
        <>
          <h2 className="dashboard__heading">{note.title}</h2>
          <DashboardActions
            selectedNote={note}
            onOpenEditForm={handleOpenEditForm}
            isEdit={false}
            isArchive={isArchive}
          />
          {htmlNote && <Markdown note={htmlNote} />}
        </>
      );
  }
}
