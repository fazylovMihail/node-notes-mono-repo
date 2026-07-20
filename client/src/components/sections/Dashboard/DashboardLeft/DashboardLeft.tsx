import { memo } from "react";
import { Button, NoteCard, SearchForm, Link } from "@client/components/ui";
import { ArchiveNotesList } from "@shared/models/ArchiveNote";
import { Note, NoteList } from "@shared/models/Note";

interface DashboardLeftProps {
  notes: NoteList | ArchiveNotesList;
  selectedNote: Note | null;
  isArchive: boolean;
  isEdit: boolean;
  isLoading: boolean;
  onSelect: (note: Note) => void;
  onOpenCreator: () => void;
  onSearch: (data: {
    sort: "month" | "three-month" | "all-time";
    search: string;
    isArchive: boolean;
  }) => void;
  isDeletePending: boolean;
  onDelete: () => void;
  page: number;
  totalPages: number;
  onLoadMore: () => void;
}

export const DashboardLeft = memo(
  ({
    notes,
    selectedNote,
    isArchive,
    isEdit,
    isLoading,
    onSelect,
    onOpenCreator,
    onSearch,
    isDeletePending,
    onDelete,
    page,
    totalPages,
    onLoadMore,
  }: DashboardLeftProps) => {
    return (
      <div className="dashboard__left">
        {!isEdit && (
          <>
            {!isArchive && (
              <Button
                modificators={["dashboard-left", "pale-gray-brown", "center"]}
                type="button"
                onClick={onOpenCreator}
              >
                Создать заметку
              </Button>
            )}
            <Button
              modificators={["dashboard-left", "deep-carmine", "center"]}
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending
                ? "Удаление..."
                : isArchive
                  ? "Удалить все архивные замтеки"
                  : "Удалить все заметки"}
            </Button>
            <Link
              to={isArchive ? "/dashboard" : "/dashboard/archive"}
              className="btn"
              modificators={[
                "dashboard-left",
                "dashboard-left-transparent",
                "forest-wolf-transparent",
                "center",
              ]}
            >
              {isArchive ? "Назад" : "В архив"}
            </Link>
          </>
        )}

        <SearchForm isArchive={isArchive} onSearch={onSearch} />

        {isLoading && notes.length === 0 ? (
          <div className="dashboard__loading">Загрузка...</div>
        ) : (
          <ul className="dashboard__notes">
            {notes.map((note) => (
              <li key={note.note_id} className="dashboard__notes-item">
                <NoteCard
                  note={note}
                  onClick={() => onSelect(note)}
                  isSelect={note.note_id === selectedNote?.note_id}
                />
              </li>
            ))}
          </ul>
        )}

        {page < totalPages && (
          <Button
            type="button"
            modificators={["forest-wolf-transparent", "more"]}
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Загрузить ещё"}
          </Button>
        )}
      </div>
    );
  },
);
