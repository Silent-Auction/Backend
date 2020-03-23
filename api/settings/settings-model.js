const db = require("../../data/dbconfig");

module.exports = {
  getUserByName,
  getUserById,
  update,
  remove
}

function getUserByName(username) {
  return db('users').where({username: username})
    .first();
}

function getUserById(id) {
  return db('users').where({id})
    .first();
}

function update(id, data) {
  return db('users').where({id}).update({...data})
}

function remove(id) {
  return db('users').where({id}).del()
}