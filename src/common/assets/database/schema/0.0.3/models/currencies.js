//  
//  KNEX Schema Building
//

module.exports = function currencies(table) {
  table.increments('id').primary();


  table.string('name');
  table.string('symbol');
  table.string('precision');
  table.string('thousand_separator').comment('Thousand Separator');
  table.string('decimal_separator').comment('Decimal Separator');
  table.string('code');
  table.integer('swap_currency_symbol').defaultTo('0');
  table.decimal('exchange_rate', 13, 4);



}