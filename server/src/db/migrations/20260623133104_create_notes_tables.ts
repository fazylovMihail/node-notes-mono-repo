import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("notes", (table) => {
    table.string("note_id", 21).notNullable().primary();
    table
      .string("user_id", 21)
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("title", 255).notNullable();
    table.text("content", "mediumtext").nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("archive_notes", (table) => {
    table.string("note_id", 21).notNullable().primary();
    table
      .string("user_id", 21)
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.string("title", 255).notNullable();
    table.text("content", "mediumtext").nullable();
    table.timestamps(true, true);
    table.timestamp("archived_at").defaultTo(knex.fn.now());
  });

  await knex.raw(`
    INSERT INTO archive_notes (note_id, user_id, title, content, created_at, updated_at)
    SELECT note_id, user_id, title, content, created_at, updated_at 
    FROM notes
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("archive_notes");
  await knex.schema.dropTableIfExists("notes");
}
