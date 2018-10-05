
//  
//  KNEX Schema Building
//

module.exports = function languages(table) {
  table.increments('id').primary();
  table.string('name'); 
  table.string('locale'); 
}