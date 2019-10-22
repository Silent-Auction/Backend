
const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
  return knex('users').insert([
        {username: "testseller", password: bcrypt.hashSync("password", 12), first_name: "Test", last_name: "Seller", is_seller: true},
        {username: "testseller2", password: bcrypt.hashSync("password", 12), first_name: "Test", last_name: "Seller2", is_seller: true},
        {username: "testbuyer", password: bcrypt.hashSync("password", 12), first_name: "Test", last_name: "Buyer", is_seller: false},
        {username: "testbuyer2", password: bcrypt.hashSync("password", 12), first_name: "Test", last_name: "Buyer2", is_seller: false},
      ]);
};
