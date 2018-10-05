
//  
//  KNEX Schema Building
//

module.exports = function invoice_designs(table) {
  table.increments('id').primary();
  table.string('name');
  table.text('javascript');
  table.text('pdfmake'); 

}