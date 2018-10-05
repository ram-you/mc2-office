//  
//  KNEX Schema Building
//

module.exports = function users(table) {
  table.increments('id').primary();
  table.string('first_name');
  table.string('last_name');
  table.string('password');
  table.timestamps(true, true);
}