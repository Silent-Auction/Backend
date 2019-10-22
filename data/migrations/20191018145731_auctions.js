
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('username', 128)
      .unique()
      .notNullable();
    tbl.string('password', 128)
      .notNullable();
    tbl.string('first_name', 128)
      .notNullable();
    tbl.boolean('is_seller')
      .notNullable();
    tbl.string('last_name', 128)
  })
  .createTable('auctions', tbl => {
    tbl.increments();
    tbl.integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    tbl.string('name', 128)
      .notNullable();
    tbl.string('description', 1000)
    tbl.integer('starting_price')
      .notNullable();
    tbl.date('date_starting')
      .notNullable();
    tbl.date('date_ending')
      .notNullable();
    tbl.string('image', 500)
      .notNullable();
  })
  .createTable('auction_bids', tbl => {
    tbl.increments();
    tbl.integer('user_id')
      .unsigned()
      .notNullable()
      .references("id")
      .inTable('users');
    tbl.integer('auction_id')
      .unsigned()
      .notNullable()
      .references("id")
      .inTable('auctions')
    tbl.integer('price')
      .unsigned()
      .notNullable();
    tbl.date('created_at')
      .notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema
          .dropTableIfExists('auction_bids')
          .dropTableIfExists('auctions')
          .dropTableIfExists('users')
};
