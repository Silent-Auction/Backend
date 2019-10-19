const db = require("../../data/dbconfig");

module.exports = {
  getBidsByAuction
}

function getBidsByAuction(id) {
  return db('auction_bids as ab')
    .where({auction_id: id})
    .orderBy('price')
    .join('users as u', 'u.id', 'ab.user_id')
    .select('ab.id', 'u.username', 'u.first_name', 'ab.price', 'ab.created_at')
}

