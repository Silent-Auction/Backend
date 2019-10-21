const db = require("../../data/dbconfig");

module.exports = {
  findUser,
  getSellerAuctions,
  getBuyerAuctions,
}

function findUser(username) {
  return db('users')
    .where({username})
    .select('id','username','first_name','last_name','is_seller as role')
    .first();
}

function getSellerAuctions(user_id) {
  return db('auctions')
    .where({user_id})
    .select('id','name','description','starting_price','date_ending','image')
}

function getBuyerAuctions(user_id) {
    return db('auction_bids')
      .where({user_id})
      .select('id', 'auction_id', 'created_at',)
      .max('price as recent_bid')
      .groupBy('auction_id')
    


}