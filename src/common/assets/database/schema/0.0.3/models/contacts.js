
//  
//  KNEX Schema Building
//

module.exports = function contacts(table) {
  table.increments('id').primary();
 
  table.specificType('is_primary', 'tinyint(1)').defaultTo('0');
  table.string('first_name');
  table.string('last_name');
  table.string('email');
  table.string('phone');

  table.text('custom_value1');
  table.text('custom_value2');


  table.timestamps(true, true);


  table.integer('client_id').unsigned().notNullable();
  table.foreign('client_id').references('id').inTable('clients');

}