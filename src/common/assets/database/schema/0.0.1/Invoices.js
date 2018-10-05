 

module.exports = function invoices(table) {
  table.increments('id').primary();
  table.string('invoiceClient');
  table.string('invoiceNumber');
  table.date('invoiceDate');
  table.string('invoiceLines')
  table.string('invoiceTotal');
  table.timestamps(true, true);
}