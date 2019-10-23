const db = require("../../data/dbconfig");

module.exports = {
  getBidsByAuction,
  getBid,
  add,
  remove,
  edit,
  getLastBid,
}

function getBid(id) {
  return db('auction_bids')
    .where({id})
    .first();
}

function getBidsByAuction(auction_id) {
  return db('auction_bids as ab')
    .where({auction_id})
    .orderBy('price')
    .join('users as u', 'u.id', 'ab.user_id')
    .select('ab.id', 'u.username', 'u.first_name', 'ab.price', 'ab.created_at')
}

function add(bid) {
  return db('auction_bids').insert(bid, ['id'])
}

function getLastBid(auction_id) {
  return db('auction_bids')
    .where({auction_id})
    .orderBy('price', 'desc')
    .first();
}

function edit(id, bid) {
  return db('auction_bids')
    .where({id})
    .update({price: bid.price, created_at: bid.created_at})
}

function remove(id) {
  return db('auction_bids')
    .where({id})
    .del();

}