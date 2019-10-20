const db = require("../../data/dbconfig");

module.exports = {
  getAuction,
  add,
  edit,
  remove
}

function getAuction(id) {
  return db('auctions').where({id})
    .first();
}

function add(auction) {
  return db('auctions').insert(auction)
    .then(id => ids[0])
}

function edit(id, auction) {
  return db('auctions').update(auction).where({id})
}

function remove(id) {
  return db('auctions').del().where({id});
}