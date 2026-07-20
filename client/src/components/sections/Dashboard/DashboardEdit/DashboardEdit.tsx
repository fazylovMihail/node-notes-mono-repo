import { useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DashboardActions } from "../DashboardActions";
import { EditForm } from "@client/components/ui/EditForm/EditForm";
import { ErrorLabel } from "@client/components/ui";
import { getArchivePath } from "@client/utils";
import { DashboardContext } from "@client/utils";

export const DashboardEdit = () => {
  const navigate = useNavigate();
  const { note, isArchive } = useOutletContext<DashboardContext>();

  const handleCloseEditForm = useCallback(() => {
    if (!note) return;
    navigate(`/dashboard${getArchivePath(isArchive)}/${note.note_id}`);
  }, [navigate, isArchive, note]);

  if (!note) {
    return <ErrorLabel message="Заметка не найдена." />;
  }

  return (
    <>
      <DashboardActions
        selectedNote={note}
        isEdit={true}
        isArchive={isArchive}
        onCloseEditForm={handleCloseEditForm}
      />
      <EditForm
        note={note}
        isArchive={isArchive}
        onCloseEditForm={handleCloseEditForm}
        id="edit-form"
      />
    </>
  );
};
