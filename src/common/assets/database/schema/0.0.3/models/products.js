//  
//  KNEX Schema Building
//

module.exports = function products(table) {
  table.increments('id').primary();
 
  table.string('product_key');
  table.text('notes');
  table.decimal('cost', 15, 4);
  table.decimal('qty', 15, 4).defaultTo('0.0000');
  table.specificType('is_deleted', 'tinyint(1)').defaultTo('0');
  table.text('custom_value1');
  table.text('custom_value2');

  table.string('tax_name1');
  table.decimal('tax_rate1', 13, 3).notNullable();
  table.string('tax_name2');
  table.decimal('tax_rate2', 13, 3).notNullable();
 

  
  table.timestamps(true, true);


  table.integer('account_id').unsigned().notNullable();
  table.foreign('account_id').references('id').inTable('accounts');

  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users');



}