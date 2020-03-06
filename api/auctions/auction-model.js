const db = require("../../data/dbconfig");

module.exports = {
  getAuction,
  getAll,
  add,
  getHighestBid,
  edit,
  remove
}

function getAuction(id) {
  return db('auctions as a')
    .join('users', 'users.id', 'a.user_id')
    .select('a.id', 'a.user_id', 'users.username as seller', 'users.first_name', 'a.name', 'a.description','a.starting_price','a.date_starting', 'a.date_ending', 'a.image')
    .whereRaw(`a.id = ${id}`)
    .first();
}

function getAll() {
  return db('auctions as a')
  .join('users', 'users.id', 'a.user_id')
  .select('a.id', 'a.user_id', 'users.username as seller', 'users.first_name', 'a.name', 'a.description', 'a.starting_price','a.date_starting', 'a.date_ending', 'a.image')
}

async function getHighestBid(auction_id) {
  let auction;
  auction = await db('auction_bids as ab')
    .where({auction_id})
    .orderBy('price', 'desc')
    .select('ab.price')
    .first() || await db('auctions')
      .where({id: auction_id})
      .select('starting_price as price')
      .first();
  return auction;
}
function add(auction) {
  return db('auctions').insert(auction, ['id'])
}

function edit(id, auction) {
  return db('auctions').update(auction).where({id})
}

function remove(id) {
  return db('auctions')
    .where({id})
    .del();
}