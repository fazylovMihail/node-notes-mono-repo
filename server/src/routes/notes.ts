import db from "../db";
import { authMiddleware } from "../middlewares";
import { handleError, MARKDOWN_CLEAN_OPTIONS, md } from "../utils";
import { ArchiveNote } from "../../../shared/models/ArchiveNote";
import {
  CreateNoteSchema,
  Note,
  NoteSchema,
  RawNoteSchema,
  UpdateNoteSchema,
} from "../../../shared/models/Note";
import { Router } from "express";
import { nanoid } from "nanoid";
import sanitizeHtml from "sanitize-html";
import PDFDocument from "pdfkit";

const markdownToHtml = (content: Note["content"]): string => {
  if (!content) return "";
  return md.render(content);
};

const route = Router();

route.use(authMiddleware);

route.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    const search = String(req.query.search || "").trim();
    const sort = String(req.query.sort || "all-time");

    const rawPage = typeof req.query.page === "string" ? req.query.page : "1";
    const rawLimit =
      typeof req.query.limit === "string" ? req.query.limit : "20";

    const page = Math.max(1, parseInt(rawPage, 10) || 1);
    const limit = Math.max(1, parseInt(rawLimit, 10) || 20);
    const offset = (page - 1) * limit;

    const baseQuery = db("notes").where("user_id", userId);

    if (search) {
      baseQuery.where("title", "ilike", `%${search}%`);
    }

    const now = new Date();
    if (sort === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      baseQuery.where("created_at", ">=", oneMonthAgo);
    } else if (sort === "three-month") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      baseQuery.where("created_at", ">=", threeMonthsAgo);
    }

    const totalCountResult = await baseQuery
      .clone()
      .count("* as total")
      .first();
    const totalItems = parseInt(String(totalCountResult?.total || 0), 10);

    const notes = await baseQuery
      .clone()
      .select()
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    res.status(200).json({
      data: notes,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (err) {
    handleError(err, res);
  }
});

route.get("/archive", async (req, res) => {
  try {
    const userId = req.user?.id;
    const search = String(req.query.search || "").trim();
    const sort = String(req.query.sort || "all-time");

    const rawPage = typeof req.query.page === "string" ? req.query.page : "1";
    const rawLimit =
      typeof req.query.limit === "string" ? req.query.limit : "20";

    const page = Math.max(1, parseInt(rawPage, 10) || 1);
    const limit = Math.max(1, parseInt(rawLimit, 10) || 20);
    const offset = (page - 1) * limit;

    const baseQuery = db("archive_notes").where("user_id", userId);

    if (search) {
      baseQuery.where("title", "ilike", `%${search}%`);
    }

    const now = new Date();
    if (sort === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      baseQuery.where("created_at", ">=", oneMonthAgo);
    } else if (sort === "three-month") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      baseQuery.where("created_at", ">=", threeMonthsAgo);
    }

    const totalCountResult = await baseQuery
      .clone()
      .count("* as total")
      .first();
    const totalItems = parseInt(String(totalCountResult?.total || 0), 10);

    const archiveNotes = await baseQuery
      .clone()
      .select()
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    res.status(200).json({
      data: archiveNotes,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (err) {
    handleError(err, res);
  }
});

route.get("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;

    const note: Note = await db
      .select()
      .table("notes")
      .where({ user_id: userId, note_id: noteId })
      .first();

    if (!note) {
      return res.status(404).json({ error: "Заметка не найдена" });
    }

    res.status(200).json(note);
  } catch (err) {
    handleError(err, res);
  }
});

route.get("/:id/archive", async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;

    const archiveNote: ArchiveNote = await db
      .select()
      .table("archive_notes")
      .where({ user_id: userId, note_id: noteId })
      .first();

    if (!archiveNote) {
      return res
        .status(404)
        .json({ error: "Архивированная заметка не найдена." });
    }

    res.status(200).json(archiveNote);
  } catch (err) {
    handleError(err, res);
  }
});

route.post("/", async (req, res) => {
  try {
    const { title, content } = CreateNoteSchema.parse(req.body);
    const userId = req.user?.id;

    const rawNote = RawNoteSchema.parse({
      note_id: nanoid(),
      user_id: userId || "",
      title,
      content: content ?? "",
    });

    const note: Note = await db("notes")
      .insert(rawNote)
      .returning("*")
      .then((results) => results[0]);

    res.location(`/api/notes/${note.note_id}`);
    res.status(201).json(note);
  } catch (err) {
    handleError(err, res);
  }
});

route.post("/:id/archive", async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;
    let isNotFound = false;

    await db.transaction(async (trx) => {
      const note = await trx<Note>("notes")
        .where({ note_id: noteId, user_id: userId })
        .first();

      if (!note) {
        isNotFound = true;
        return;
      }

      await trx("archive_notes").insert(note);
      await trx("notes").where({ note_id: noteId, user_id: userId }).del();
    });

    if (isNotFound) {
      return res
        .status(404)
        .json({ error: "Архивированная заметка не найдена." });
    }

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

route.post("/:id/archive/restore", async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;
    let isNotFound = false;

    await db.transaction(async (trx) => {
      const archivedNote = await trx<ArchiveNote>("archive_notes")
        .where({ note_id: noteId, user_id: userId })
        .first();

      if (!archivedNote) {
        isNotFound = true;
        return;
      }

      const { archived_at, ...noteToRestore } = archivedNote;

      await trx("notes").insert(noteToRestore);
      await trx("archive_notes")
        .where({ note_id: noteId, user_id: userId })
        .del();
    });

    if (isNotFound) {
      return res
        .status(404)
        .json({ error: "Архивированная заметка не найдена." });
    }

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

route.patch("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;

    const data = UpdateNoteSchema.parse(req.body);

    const updatedCount: number = await db("notes")
      .where({
        user_id: userId,
        note_id: noteId,
      })
      .update(data);

    if (updatedCount === 0) {
      return res.status(404).json({ error: "Заметка не найдена" });
    }

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

route.patch("/:id/archive", async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;

    const data = UpdateNoteSchema.parse(req.body);

    const updatedCount: number = await db("archive_notes")
      .where({
        user_id: userId,
        note_id: noteId,
      })
      .update(data);

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ error: "Архивированная заметка не найдена" });
    }

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

route.post("/content", async (req, res) => {
  try {
    const note = NoteSchema.parse(req.body);
    const markdownContent = note.content || "";

    const htmlContent = markdownToHtml(markdownContent);
    const sanitizedHtml = sanitizeHtml(htmlContent, MARKDOWN_CLEAN_OPTIONS);

    res.status(200).send(sanitizedHtml);
  } catch (err) {
    handleError(err, res);
  }
});

route.post("/download-pdf", async (req, res) => {
  try {
    const { title, content } = req.body;

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(title || "document")}.pdf"`,
    );

    doc.pipe(res);

    doc.fontSize(26).text(title || "Заметка", { align: "center" });
    doc.moveDown(2);

    const rawLines = (content || "").split("\n");

    rawLines.forEach((line: string) => {
      const trimmed = line.trim();
      if (!trimmed) {
        doc.moveDown(0.5);
        return;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);

      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];

        let fontSize = 20;
        if (level === 1) fontSize = 22;
        if (level === 2) fontSize = 18;
        if (level === 3) fontSize = 16;
        if (level > 3) fontSize = 14;

        doc.moveDown(0.5);
        doc.fontSize(fontSize).text(text, { lineGap: 4 });
        doc.moveDown(0.3);
      } else {
        const cleanText = trimmed.replace(/[*_`\-]/g, "");
        doc.fontSize(12).text(cleanText, { lineGap: 6 });
      }
    });

    doc.end();
  } catch (err) {
    handleError(err, res);
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const userId = req.user?.id;
    const noteId = req.params.id;

    const deletedCount = await db("notes")
      .where({ user_id: userId, note_id: noteId })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Заметка не найдена" });
    }

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
});

export default route;
