const db = require("../data/dbconfig");

module.exports = {
  register,
  findUser
}

function register(user) {
  return db('users').insert(user)
    .then(id => {return {id:id[0]}});
}

function findUser(username) {
  return db('users').where({username: username})
    .then(users => users[0])
}


