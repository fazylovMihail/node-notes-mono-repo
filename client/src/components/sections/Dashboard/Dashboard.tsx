import { Note } from "@shared/models/Note";
import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchArchiveNotesList,
  fetchNotesList,
  fetchNote,
  fetchNoteArchive,
  fetchDeleteNotes,
  fetchDeleteArchiveNotes,
} from "@client/api/Note";
import { DashboardLeft } from "./DashboardLeft";
import { ErrorLabel } from "@client/components/ui/ErrorLabel";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { NoteCreator } from "@client/components/ui";
import { useCallback, useEffect, useState } from "react";
import { getArchivePath } from "@client/utils";
import { queryClient } from "@client/api/queryClient";

import "./Dashboard.scss";

type SearchData = {
  sort: "month" | "three-month" | "all-time";
  search: string;
  isArchive: boolean;
};

export function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isArchive = location.pathname.includes("/archive");
  const isEdit = location.pathname.endsWith("/edit");
  const isNoteCreatorOpen = searchParams.get("create") === "true";

  const [searchData, setSearchData] = useState<SearchData>({
    sort: "all-time",
    search: "",
    isArchive,
  });

  const handleSearch = useCallback((data: SearchData) => {
    setSearchData(data);
  }, []);

  const notesQuery = useInfiniteQuery({
    queryKey: [
      isArchive ? "archive_notes" : "notes",
      searchData.sort,
      searchData.search,
      isArchive,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { ...searchData, page: pageParam, limit: 20 } as any;
      const response = isArchive
        ? await fetchArchiveNotesList(params)
        : await fetchNotesList(params);
      return response as any;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.page || 1;
      const totalPages = lastPage?.pagination?.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const noteQuery = useQuery({
    queryKey: ["note_by_id", id, isArchive],
    queryFn: () => (isArchive ? fetchNoteArchive(id!) : fetchNote(id!)),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutate: allDeleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: isArchive ? fetchDeleteArchiveNotes : fetchDeleteNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [isArchive ? "archive_notes" : "notes"],
      });
    },
  });

  const selectedNote = noteQuery.data ?? null;

  const combinedNotes =
    notesQuery.data?.pages.flatMap((page) => page.data || []) ?? [];

  const lastPageData = notesQuery.data?.pages[notesQuery.data.pages.length - 1];
  const page = lastPageData?.pagination?.page || 1;
  const totalPages = lastPageData?.pagination?.totalPages || 1;

  const handleLoadMore = useCallback(() => {
    if (notesQuery.hasNextPage && !notesQuery.isFetchingNextPage) {
      notesQuery.fetchNextPage();
    }
  }, [notesQuery]);

  const handleSelectNote = useCallback(
    (note: Note) => {
      navigate(`/dashboard${getArchivePath(isArchive)}/${note.note_id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate, isArchive],
  );

  const handleOpenNoteCreator = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("create", "true");
      return params;
    });
  }, [setSearchParams]);

  const handleCloseNoteCreator = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("create");
      return params;
    });
  }, [setSearchParams]);

  const handleDeleteAllNotes = useCallback(
    () => allDeleteMutate(),
    [allDeleteMutate],
  );

  useEffect(() => {
    if (!isNoteCreatorOpen || isArchive) {
      handleCloseNoteCreator();
    }
  }, [isNoteCreatorOpen, isArchive, handleCloseNoteCreator]);

  if (notesQuery.status === "error") {
    return <ErrorLabel message={notesQuery.error.message} />;
  }

  return (
    <>
      <section
        className={selectedNote ? "dashboard dashboard--selected" : "dashboard"}
      >
        <div className="container">
          <DashboardLeft
            notes={combinedNotes}
            selectedNote={selectedNote}
            isArchive={isArchive}
            isEdit={isEdit}
            isLoading={notesQuery.isFetchingNextPage || notesQuery.isPending}
            onSelect={handleSelectNote}
            onOpenCreator={handleOpenNoteCreator}
            onSearch={handleSearch}
            isDeletePending={isDeletePending}
            onDelete={handleDeleteAllNotes}
            page={page}
            totalPages={totalPages}
            onLoadMore={handleLoadMore}
          />
          <div className="dashboard__right">
            <Outlet
              context={{
                note: selectedNote,
                isArchive,
              }}
            />
          </div>
        </div>
      </section>

      {isNoteCreatorOpen && !isArchive && <NoteCreator />}
    </>
  );
}
