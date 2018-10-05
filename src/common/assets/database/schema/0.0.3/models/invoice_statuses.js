
//  
//  KNEX Schema Building
//

module.exports = function invoice_statuses(table) {
  table.increments('id').primary();
  table.string('name'); 
}