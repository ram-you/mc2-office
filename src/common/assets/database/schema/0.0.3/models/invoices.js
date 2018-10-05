//  
//  KNEX Schema Building
//

module.exports = function invoices(table) {
  table.increments('id').primary();
  table.string('invoice_number').notNullable();

  table.string('po_number').comment('This is the Purchase Order Number');
  table.date('invoice_date');
  table.date('due_date');

  table.decimal('partial', 13, 2);
  table.date('partial_due_date');
  table.date('start_date');


  table.decimal('amount', 13, 2);
  table.decimal('discount', 13, 2); 
  table.specificType('is_amount_discount', 'tinyint(1)').defaultTo('0');

  table.integer('quote_id');
  table.integer('quote_invoice_id');


 

  table.text('invoice_footer');
  table.text('terms');
  table.text('private_notes');
  table.text('public_notes');


  table.timestamps(true, true);


  


  table.integer('client_id').unsigned().notNullable();
  table.foreign('client_id').references('id').inTable('clients');


  table.integer('account_id').unsigned().notNullable();
  table.foreign('account_id').references('id').inTable('accounts');

  table.integer('invoice_status_id').unsigned().notNullable();
  table.foreign('invoice_status_id').references('id').inTable('invoice_statuses');

  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users');
}