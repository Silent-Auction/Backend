const db = require("../../data/dbconfig");

module.exports = {
  getBidsByAuction,
  getBid
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

