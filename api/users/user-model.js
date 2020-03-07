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
    .select('id','name','description','starting_price','date_starting', 'date_ending','image')
}

function getBuyerAuctions(user_id) {
    return db('auction_bids')
      .whereRaw(`auction_bids.user_id = ${user_id}`)
      .join('auctions as a', 'auction_bids.auction_id', 'a.id')
      .join('users as u', 'a.user_id', 'u.id')
      .select('a.id as auction_id', 'u.username as sold_by_user', 'u.first_name as sold_by', 'a.name', 'a.description', 'a.date_starting', 'a.date_ending', 'a.image',)
      .then(async auctions => {
        const newAuctions = auctions.map(async auction => {
          const bid = await db('auction_bids')
            .where({auction_id: auction.auction_id})
            .andWhere({user_id})
            .max('price as your_recent_bid', 'id as bid_id', 'created_at as bid_date')
            .groupBy('auction_id')
            .first()
          const new_auction = {...auction, ...bid}
          return new_auction
        })
        return Promise.all(newAuctions)
      })
}