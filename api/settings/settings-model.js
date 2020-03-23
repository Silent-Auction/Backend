const db = require("../../data/dbconfig");

module.exports = {
  getUserByName,
  getUserById,
  update
}

function getUserByName(username) {
  return db('users').where({username: username})
    .first();
}

function getUserById(id) {
  return db('users').where({id})
    .first();
}
function update(username, data) {
  return db('users').where({username: username}).update({...data})
}