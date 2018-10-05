
//  
//  KNEX Schema Building
//

module.exports = function industries(table) {
  table.increments('id').primary();
  table.string('name'); 
}