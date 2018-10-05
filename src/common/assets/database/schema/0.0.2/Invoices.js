
//  module.exports = {
//   id: 'increments', // special type, primary key
//   invoiceClient: String,
//   invoiceNumber: String,
//   invoiceDate: Date,
//   invoiceLines: Array,
//   invoiceTotal: String,

  
//  };

 
 

module.exports = function invoices(table) {
  table.increments('id').primary();
  table.string('invoiceClient');
  table.string('invoiceNumber');
  table.date('invoiceDate');
  table.string('invoiceLines')
  table.string('invoiceTotal');
  table.timestamps(true, true);
}