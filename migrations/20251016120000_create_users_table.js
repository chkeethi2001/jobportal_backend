export async function up(knex) {
  const exists = await knex.schema.hasTable('users');
  if (!exists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('email').unique();
      table.string('status');
      table.string('bio');
      table.string('role');
      table.string('password');
      table.timestamps(true, true);
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users');
}