const db = require("../data/dbconfig");

module.exports = {
  register,
  findUser,
  getUser
}

function register(user) {
  return db('users').insert(user)
}

function findUser(username) {
  return db('users').where({username: username})
    .select('id','username','first_name','last_name','is_seller as role')
    .first();
}

function getUser(username) {
  return db('users').where({username: username})
    .first();
}


