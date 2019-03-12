const {onUpdateTrigger,dropUpdateTrigger} = require("../knexfile");

exports.up = async (knex) => {

    await knex.schema
        .createTable('Feature', (table) => {
            table.increments('id').primary();
            table.integer('parentId').references('id').inTable('Feature').onDelete('cascade');
            table.string('name').notNullable();
            table.text('description');
            table.timestamps(true, true);
        })
        .createTable('Role', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.text('description');
            table.timestamps(true, true);
        })
        .createTable('UserRole', (table) => {
            table.increments('id').primary();
            table.integer('userId').references('id').inTable('User').notNullable().onDelete('cascade');
            table.integer('roleId').references('id').inTable('Role').notNullable().onDelete('cascade');
            table.timestamps(true, true);
        })
        .createTable('RoleFeaturePermission', (table) => {
            table.increments('id').primary();
            table.integer('roleId').references('id').inTable('Role').notNullable().onDelete('cascade');
            table.integer('featureId').references('id').inTable('Feature').notNullable().onDelete('cascade');
            table.string('permission').notNullable();
            table.timestamps(true, true);
        })
        .then(() => {
            knex.raw(onUpdateTrigger('Feature'));
            knex.raw(onUpdateTrigger('Role'));
            knex.raw(onUpdateTrigger('UserRole'));
            knex.raw(onUpdateTrigger('RoleFeaturePermission'));
        })
    ;
};

exports.down = async (knex) => {
    await knex.schema
        .dropTable('RoleFeaturePermission')
        .dropTable('UserRole')
        .dropTable('Role')
        .dropTable('Feature')
    ;
};
