const {onUpdateTrigger,dropUpdateTrigger} = require("../knexfile");

exports.up = async (knex) => {

    await knex.schema.createTable('Role', (table) => {
        table.increments('id').primary();
        table.string('email');
        table.string('firstName');
        table.string('lastName');
        table.string('password');
        table.timestamps(true, true);
    }).then(() => knex.raw(onUpdateTrigger('Role')));

    await knex.schema.createTable('UserRole', (table) => {
        table.increments('id').primary();
        table.string('email');
        table.string('firstName');
        table.string('lastName');
        table.string('password');
        table.timestamp('createdAt').defaultTo(knex.fn.now(6));
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('User');
};
