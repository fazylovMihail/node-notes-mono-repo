import { PaginatedResponse } from "@client/utils";
import { CreateNote, Note, NoteId, UpdateNote } from "@shared/models/Note";

type SearchParams = {
  sort?: "month" | "three-month" | "all-time";
  search?: string;
  isArchive?: boolean;
  page?: number;
  limit?: number;
};

async function fetchNotesList(
  params?: SearchParams,
): Promise<PaginatedResponse> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const response = await fetch(`/api/notes?${query.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Ошибка получения заметок.");
    }

    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchArchiveNotesList(
  params?: SearchParams,
): Promise<PaginatedResponse> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const response = await fetch(`/api/notes/archive?${query.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Ошибка получения архивных заметок.");
    }

    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchNote(id: NoteId): Promise<Note> {
  try {
    const response = await fetch(`/api/notes/${id}`, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Ошибка получения заметки.`);
    }

    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchNoteArchive(id: NoteId): Promise<Note> {
  try {
    const response = await fetch(`/api/notes/${id}/archive`, { method: "GET" });
    if (!response.ok) {
      throw new Error("Ошибка получения архивной заметки.");
    }

    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchCreateNote(data: CreateNote): Promise<Note> {
  try {
    const response = await fetch(`/api/notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка создания заметки.");
    }

    return response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchMoveNoteToArchive(id: NoteId): Promise<void> {
  try {
    const response = await fetch(`/api/notes/${id}/archive`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Ошибка создания архивной заметки.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchRestoreArchiveNote(id: NoteId): Promise<void> {
  try {
    const response = await fetch(`/api/notes/${id}/archive/restore`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Ошибка восстановления заметки из архива.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchDeleteNotes(): Promise<void> {
  try {
    const response = await fetch("/api/notes", { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Ошибка удаления всех заметок.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchDeleteArchiveNotes(): Promise<void> {
  try {
    const response = await fetch("/api/notes/archive", { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Ошибка удаления всех архивных заметок.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchDeleteNote(id: NoteId): Promise<void> {
  try {
    const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Ошибка удаления заметки.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchDeleteArchiveNote(id: NoteId): Promise<void> {
  try {
    const response = await fetch(`/api/notes/${id}/archive`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Ошибка удаления архивной заметки.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchEditNote(id: NoteId, data: UpdateNote): Promise<void> {
  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка редактирования заметки.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchNoteHtmlContent(data: Note): Promise<string> {
  try {
    const response = await fetch("/api/notes/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка получения HTML контента заметки.");
    }

    return response.text();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchNoteDownloadPdf(data: Note): Promise<void> {
  try {
    const response = await fetch("/api/notes/download-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка создания PDF файла заметки.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.title || "document"}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  fetchNotesList,
  fetchArchiveNotesList,
  fetchNote,
  fetchNoteArchive,
  fetchCreateNote,
  fetchMoveNoteToArchive,
  fetchRestoreArchiveNote,
  fetchDeleteNotes,
  fetchDeleteArchiveNotes,
  fetchDeleteNote,
  fetchDeleteArchiveNote,
  fetchEditNote,
  fetchNoteHtmlContent,
  fetchNoteDownloadPdf,
};
