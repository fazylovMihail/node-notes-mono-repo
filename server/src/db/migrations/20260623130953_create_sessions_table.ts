import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sessions", (table) => {
    table.string("session_id", 21).notNullable().primary();
    table
      .string("user_id", 21)
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .timestamp("expired_at")
      .notNullable()
      .defaultTo(knex.raw("NOW() + INTERVAL '3 days'"));
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sessions");
}
