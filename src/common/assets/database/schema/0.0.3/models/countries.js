 //  
 //  KNEX Schema Building
 //

 module.exports = function countries(table) {
   table.increments('id').primary();


   table.string('capital');
   table.string('citizenship');
   table.string('country_code', 3);
   table.string('currency');
   table.string('currency_code');
   table.string('currency_sub_unit');
   table.string('full_name');
   table.string('iso_3166_2', 2);
   table.string('iso_3166_3', 3);
   table.string('name');
   table.string('region_code', 3);
   table.string('sub_region_code', 3);
   table.integer('eea').defaultTo('0');
   table.integer('swap_postal_code').defaultTo('0');
   table.integer('swap_currency_symbol').defaultTo('0');
   table.string('thousand_separator');
   table.string('decimal_separator');



 }