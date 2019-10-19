const db = require("../../data/dbconfig");

module.exports = {
  getAuction
}

function getAuction(id) {
  return db('auctions').where({id})
    .first();
}

