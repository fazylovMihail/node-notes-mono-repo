import {
  fetchDeleteArchiveNote,
  fetchDeleteNote,
  fetchMoveNoteToArchive,
  fetchRestoreArchiveNote,
} from "@client/api/Note";
import { Button } from "@client/components/ui";
import { useNoteMutation } from "@client/hooks";
import { Note } from "@shared/models/Note";
import { memo, useCallback, type FC, type RefObject } from "react";
import { useReactToPrint } from "react-to-print";

interface DashboardActionsProps {
  selectedNote: Note;
  isEdit: boolean;
  isArchive: boolean;
  contentRef?: RefObject<HTMLDivElement | null>;
  onOpenEditForm?: () => void;
  onCloseEditForm?: () => void;
}

export const DashboardActions: FC<DashboardActionsProps> = memo(
  ({ selectedNote, isEdit, isArchive, contentRef, onOpenEditForm }) => {
    const { note_id } = selectedNote;
    const navigatePath = isArchive ? "/dashboard/archive" : "/dashboard";

    const { mutate, isAnyPending, isArchivePending, isDeletePending } =
      useNoteMutation(navigatePath);

    const handlePrint = useReactToPrint({
      contentRef: contentRef || undefined,
      documentTitle: selectedNote.title || "document",
    });

    const isDisabled = isAnyPending;

    const handleArchiveToggle = useCallback(() => {
      mutate({
        fn: isArchive ? fetchRestoreArchiveNote : fetchMoveNoteToArchive,
        id: note_id,
      });
    }, [mutate, isArchive, note_id]);

    const handleDelete = useCallback(() => {
      mutate({
        fn: isArchive ? fetchDeleteArchiveNote : fetchDeleteNote,
        id: note_id,
      });
    }, [mutate, isArchive, note_id]);

    return (
      <div className="dashboard__actions">
        <Button
          modificators={["dashboard", "forest-wolf"]}
          type="button"
          iconId="icon-box"
          width={16}
          height={16}
          disabled={isDisabled}
          onClick={handleArchiveToggle}
        >
          {isArchivePending
            ? "Обработка..."
            : isArchive
              ? "Вернуть"
              : "В архив"}
        </Button>

        {!isArchive &&
          (isEdit ? (
            <Button
              modificators={[
                "dashboard",
                "dashboard-transparent",
                "forest-wolf-transparent",
              ]}
              type="submit"
              form="edit-form"
              iconId="icon-save"
              width={16}
              height={16}
              disabled={isDisabled}
            >
              Сохранить
            </Button>
          ) : (
            <Button
              modificators={["dashboard", "pale-gray-brown"]}
              type="button"
              iconId="icon-edit"
              width={16}
              height={16}
              disabled={isDisabled}
              onClick={onOpenEditForm}
            >
              Редактировать
            </Button>
          ))}

        <Button
          modificators={["dashboard", "black"]}
          type="button"
          iconId="icon-download"
          width={16}
          height={16}
          disabled={isDisabled}
          onClick={() => handlePrint()}
        >
          pdf
        </Button>

        <Button
          modificators={["dashboard", "deep-carmine"]}
          type="button"
          iconId="icon-trash"
          width={16}
          height={16}
          disabled={isDisabled}
          onClick={handleDelete}
        >
          {isDeletePending ? "Удаление..." : "Удалить"}
        </Button>
      </div>
    );
  },
);

DashboardActions.displayName = "DashboardActions";
