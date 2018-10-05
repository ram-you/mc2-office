
//  module.exports = {
//   id: 'increments', // special type, primary key
//   first_name: String,
//   last_name: String,
//   password: String,

  
//  };


 module.exports = function invoices(table) {
  table.increments('id').primary();
  table.string('first_name');
  table.string('last_name'); 
  table.string('password');
  table.timestamps(true, true);
}