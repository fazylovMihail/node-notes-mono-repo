import { Note } from "@shared/models/Note";

export interface Social {
  link: string;
  iconId: string;
  width: number;
  height: number;
}

export interface DashboardContext {
  note: Note | null;
  isArchive: boolean;
}

export interface PaginatedResponse {
  data: Note[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
