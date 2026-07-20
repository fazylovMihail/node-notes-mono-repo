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
import path from "node:path";

import { PDF_NOTE_CSS } from "../utils";

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
      user_id: userId,
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
    const markdownContent = content || "";

    const htmlContent = markdownToHtml(markdownContent);

    const puppeteerCore = await import("puppeteer-core");
    // @ts-ignore
    const chromium = (await import("@sparticuz/chromium")).default;

    const executablePath = await chromium.executablePath();
    const execDir = path.dirname(executablePath);
    process.env.LD_LIBRARY_PATH =
      execDir +
      (process.env.LD_LIBRARY_PATH ? ":" + process.env.LD_LIBRARY_PATH : "");

    const browser = await puppeteerCore.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gl-drawing-for-tests",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${PDF_NOTE_CSS}
          </style>
        </head>
        <body>
          <h1 class="pdf-title">${title || "document"}</h1>
          ${htmlContent}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(title || "document")}.pdf"`,
    );
    res.end(pdfBuffer);
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
