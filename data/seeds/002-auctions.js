
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('auctions').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('auctions').insert([
        {user_id: 1, name:"iPhone", description: "A beautiful space gray iphone 11", date_ending: new Date ("12/29/2019"), starting_price: 100, image: "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-11-Pro/Midnight-Green/Apple-iPhone-11-Pro-Midnight-Green-frontimage.jpg"},
        {user_id: 1, name:"Pixel Plus", description: "A Google Pixel", date_ending: new Date("12/29/2019"), starting_price: 100, image: "https://static.bhphoto.com/images/images1000x1000/1550057716_1448921.jpg"}
      ]);
    });
};
