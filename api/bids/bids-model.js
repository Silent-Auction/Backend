const db = require("../../data/dbconfig");

module.exports = {
  getBidsByAuction,
  getBid,
  add,
  remove,
  edit,

}

function getBid(id) {
  return db('auction_bids')
    .where({id})
}

function getBidsByAuction(auction_id) {
  return db('auction_bids as ab')
    .where({auction_id})
    .orderBy('price')
    .join('users as u', 'u.id', 'ab.user_id')
    .select('ab.id', 'u.username', 'u.first_name', 'ab.price', 'ab.created_at')
}

function add(bid) {
  return db('auction_bids').insert(bid)
    .then(ids => ids[0])
}

function edit(id, bid) {
  return db('auction_bids')
    .update(bid)
    .where({id})
}

function remove(id) {
  return db('auction_bids')
    .del()
    .where({id});
}