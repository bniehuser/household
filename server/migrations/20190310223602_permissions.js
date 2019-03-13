const {onUpdateTrigger,dropUpdateTrigger} = require("../knexfile");

exports.up = async knex => await knex.schema
    .createTable('Feature', t => {
        t.increments('id').primary();
        t.integer('parentId').references('id').inTable('Feature').onDelete('cascade');
        t.string('name').notNullable();
        t.text('description');
        t.timestamps(true, true);
    })
    .createTable('Role', t => {
        t.increments('id').primary();
        t.string('name').notNullable();
        t.text('description');
        t.timestamps(true, true);
    })
    .createTable('UserRole', t => {
        t.increments('id').primary();
        t.integer('userId').references('id').inTable('User').notNullable().onDelete('cascade');
        t.integer('roleId').references('id').inTable('Role').notNullable().onDelete('cascade');
        t.timestamps(true, true);
    })
    .createTable('RoleFeaturePermission', t => {
        t.increments('id').primary();
        t.integer('roleId').references('id').inTable('Role').notNullable().onDelete('cascade');
        t.integer('featureId').references('id').inTable('Feature').notNullable().onDelete('cascade');
        t.string('permission').notNullable();
        t.timestamps(true, true);
    })
    .then(() => knex
        .raw(onUpdateTrigger('Feature'))
        .raw(onUpdateTrigger('Role'))
        .raw(onUpdateTrigger('UserRole'))
        .raw(onUpdateTrigger('RoleFeaturePermission'))
    )
;

exports.down = async knex => await knex.schema
    .dropTable('RoleFeaturePermission')
    .dropTable('UserRole')
    .dropTable('Role')
    .dropTable('Feature')
;
