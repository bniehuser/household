const {onUpdateTrigger,dropUpdateTrigger} = require("../knexfile");

exports.up = async knex => {
  await knex.schema.table( 'User', t => {
      t.dropColumn('createdAt');
  })
};

exports.down = async knex => {
    await knex.schema.table( 'User', t => {
        t.timestamp('createdAt').defaultTo(knex.fn.now(6));
    })
};