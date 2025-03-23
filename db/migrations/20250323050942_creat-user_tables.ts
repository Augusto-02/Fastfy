import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (table) => {
    table.uuid("id").primary();
    table.uuid("session_id").index();
    table.string("name").notNullable().index();
    table.string("email").notNullable();
    table.string("phone_number").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("user");
}
