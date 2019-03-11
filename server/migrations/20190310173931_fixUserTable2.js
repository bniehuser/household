const {onUpdateTrigger,dropUpdateTrigger} = require("../knexfile");

exports.up = async knex => {
    await knex.schema.table( 'User', t => {
        t.timestamps(true, true);
    }).then(() => knex.raw(onUpdateTrigger('User')))
};

exports.down = async knex => {
    await knex.schema.table( 'User', t => {
        t.dropTimestamps();
    }).then(() => knex.raw(dropUpdateTrigger('User')))
};