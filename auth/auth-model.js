const db = require("../data/dbconfig");

module.exports = {
  register,
  findUserById,
  getUser
}

function register(user) {
  return db('users').insert(user, ['id'])
}

function findUserById(id) {
  return db('users').where({id})
    .select('id','username','first_name','last_name','is_seller as role')
    .first();
}

function getUser(username) {
  return db('users').where({username: username})
    .first();
}


