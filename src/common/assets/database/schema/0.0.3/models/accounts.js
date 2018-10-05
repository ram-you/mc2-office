//  
//  KNEX Schema Building
//

module.exports = function accounts(table) {
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

  table.integer('is_deleted').defaultTo('0');

  table.string('shipping_address1');
  table.string('shipping_address2');
  table.string('shipping_city');
  table.string('shipping_state');
  table.string('shipping_postal_code');

   

  table.text('custom_messages');

  table.text('invoice_footer');
  table.text('invoice_labels');
  

  table.timestamps(true, true);


  


  table.integer('language_id').unsigned().notNullable();
  table.foreign('language_id').references('id').inTable('languages');



  table.integer('currency_id').unsigned().notNullable();
  table.foreign('currency_id').references('id').inTable('currencies');

}