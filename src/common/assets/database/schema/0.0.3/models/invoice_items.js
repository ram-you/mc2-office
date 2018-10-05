 //  
 //  KNEX Schema Building
 //

 module.exports = function invoice_items(table) {
   table.increments('id').primary();
   table.integer('account_id');

   table.decimal('cost', 15, 4);
   table.decimal('qty', 15, 4).defaultTo('0.0000');

   table.decimal('discount', 13, 2);

   table.string('product_key');
   
   table.string('tax_name1');
   table.decimal('tax_rate1', 13, 3).notNullable();
   table.string('tax_name2');
   table.decimal('tax_rate2', 13, 3).notNullable();

   table.text('custom_value1');
   table.text('custom_value2');
   table.string('notes');

   table.timestamps(true, true);


   table.integer('invoice_id').unsigned().notNullable();
   table.foreign('invoice_id').references('id').inTable('invoices');

   table.integer('product_id').unsigned().notNullable();
   table.foreign('product_id').references('id').inTable('products');

   table.integer('user_id').unsigned().notNullable();
   table.foreign('user_id').references('id').inTable('users');
 }