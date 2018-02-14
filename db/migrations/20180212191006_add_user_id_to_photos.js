
exports.up = function(knex, Promise) {
  return knex.schema.table('photos', table => {
    table.integer('user_id').references('id').inTable('users');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('photos', table => {
    table.dropColumn('user_id');
  })
};