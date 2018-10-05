
//  
//  KNEX Schema Building
//

module.exports = function clients(table) {
  table.increments('id').primary();
  table.string('id_number');
  table.string('vat_number');

  table.string('name');
  table.string('address1');
  table.string('address2');
  table.string('city');
  table.string('state');
  table.string('postal_code');


  table.string('work_phone');
  table.text('private_notes');
  table.string('website');

  table.integer('size_id');

 

  table.string('shipping_address1');
  table.string('shipping_address2');
  table.string('shipping_city');
  table.string('shipping_state');
  table.string('shipping_postal_code');

  
  table.text('custom_messages');


 table.specificType('is_deleted', 'tinyint(1)').defaultTo('0');





  table.timestamps(true, true);


  table.integer('account_id').unsigned().notNullable();
  table.foreign('account_id').references('id').inTable('accounts');

  table.integer('currency_id').unsigned().notNullable();
  table.foreign('currency_id').references('id').inTable('currencies');

  table.integer('country_id').unsigned().notNullable();
  table.foreign('country_id').references('id').inTable('countries');

  table.integer('industry_id').unsigned().notNullable();
  table.foreign('industry_id').references('id').inTable('industries');

  table.integer('language_id').unsigned().notNullable();
  table.foreign('language_id').references('id').inTable('languages');

  table.integer('shipping_country_id').unsigned().notNullable();
  table.foreign('shipping_country_id').references('id').inTable('countries');
}