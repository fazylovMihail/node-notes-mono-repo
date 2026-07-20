import {
  fetchDeleteArchiveNote,
  fetchDeleteNote,
  fetchMoveNoteToArchive,
  fetchRestoreArchiveNote,
} from "@client/api/Note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type MutationVariables = {
  fn: (id: string) => Promise<void>;
  id?: string | null;
};

export const useNoteMutation = (navigatePath: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation<unknown, Error, MutationVariables>({
    mutationFn: ({ fn, id }) => {
      if (id !== undefined && id !== null) {
        return fn(id);
      }
      return fn(undefined as unknown as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["archive_notes"] });
      navigate(navigatePath);
    },
  });

  const currentFn = mutation.variables?.fn;

  const isDeletePending =
    mutation.isPending &&
    (currentFn === fetchDeleteNote || currentFn === fetchDeleteArchiveNote);

  const isArchivePending =
    mutation.isPending &&
    (currentFn === fetchMoveNoteToArchive ||
      currentFn === fetchRestoreArchiveNote);

  return {
    ...mutation,
    isDeletePending,
    isArchivePending,
    isAnyPending: mutation.isPending,
  };
};
