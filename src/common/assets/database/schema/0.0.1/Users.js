
 
 module.exports = function invoices(table) {
  table.increments('id').primary();
  table.string('firstName');
  table.string('lastName'); 
  table.string('password');
  table.timestamps(true, true);
}