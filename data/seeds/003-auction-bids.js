
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('auction_bids').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('auction_bids').insert([
        {user_id: 2, auction_id: 1, price: 150, created_at: new Date("10/19/2019 13:00")},
        {user_id: 3, auction_id: 1, price: 200, created_at: new Date("10/19/2019 15:00")},
        {user_id: 2, auction_id: 1, price: 210, created_at: new Date("10/20/2019")},
        {user_id: 3, auction_id: 1, price: 250, created_at: new Date("10/20/2019")},
        {user_id: 2, auction_id: 2, price: 150, created_at: new Date("10/18/2019")},
        {user_id: 3, auction_id: 2, price: 200, created_at: new Date("10/19/2019")},
        {user_id: 2, auction_id: 2, price: 210, created_at: new Date("10/19/2019")},
        {user_id: 3, auction_id: 2, price: 220, created_at: new Date("10/19/2019")},
      ]);
    });
};
