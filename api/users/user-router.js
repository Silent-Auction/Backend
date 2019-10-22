const express = require("express");

const Users = require("./user-model");
const Bids = require("../bids/bids-model");

const router = express.Router();


/**
 * @api {get} /api/users/ Request User Information
 * @apiPermission Buyer or Seller
 * 
 * @apiGroup Auctions
 * 
 * @apiParam {Number} id Auction's unique ID. 
 * @apiSuccess (content) {Number} auction.id ID
 * @apiSuccess (content) {Number} auction.user_id User ID of owner of auction
 * @apiSuccess (content) {String} auction.seller Username of seller
 * @apiSuccess (content) {String} auction.first_name First Name of seller
 * @apiSuccess (content) {String} auction.name Title of auction
 * @apiSuccess (content) {String} auction.description Description
 * @apiSuccess (content) {Number} auction.starting_price Starting price for item
 * @apiSuccess (content) {Date} auction.date_ending Ending date of auction
 * @apiSuccess (content) {String} auction.image Link to photo of image
 * @apiSuccess (content) {Object[]} auction.bids Bids
 * @apiSuccess (content) {Number} auction.bids.id ID of Bid
 * @apiSuccess (content) {String} auction.bids.seller Username of seller
 * @apiSuccess (content) {String} auction.bids.first_name First Name of seller
 * @apiSuccess (content) {Number} auction.bids.price Price of Bid
 * @apiSuccess (content) {Date} auction.bids.created_at Date of Bid
 * @apiSuccessExample {json} Success 
 * HTTP/1.1 200 OK
 * {
 *  "id": 1,
 *  "user_id": 1,
 *  "seller": "testseller",
 *  "first_name": "Test",
 *  "name": "iPhone",
 *  "description": "A beautiful space gray iphone 11",
 *  "starting_price": 100,
 *  "date_ending": "2019-12-29T08:00:00.000Z",
 *  "image": "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-11-Pro/Midnight-Green/Apple-iPhone-11-Pro-Midnight-Green-frontimage.jpg",
 *  "bids": [
 *      {
 *          "id": 1,
 *          "username": "testseller2",
 *          "first_name": "Test",
 *          "price": 150,
 *          "created_at": "2019-10-19T20:00:00.000Z"
 *      },
 *      {
 *          "id": 2,
 *          "username": "testbuyer",
 *          "first_name": "Test",
 *          "price": 200,
 *          "created_at": "2019-10-19T22:00:00.000Z"
 *      },
 *    ]
 * }
 */
router.get("/", (req, res) => {
  Users.findUser(req.decoded.username)
    .then(async user => {
      user.role = (user.role ? "seller" : "buyer");
      if (req.decoded.seller) {
        Users.getSellerAuctions(req.decoded.subject)
        .then(auctions => setAuctionInfo(auctions))
        .then(auctions => {
          user.auctions = auctions;
          res.json(user)
        })
      } else {
        Users.getBuyerAuctions(req.decoded.subject)
        .then(auctions => setAuctionInfo(auctions))
        .then(auctions => {
          user.auctions = auctions;
          res.json(user)
        })
      }
    })
})

async function setAuctionInfo(auctions) {
  const newAuctions = await auctions.map(async (auction, idx) => {
    auction.date_ending = new Date(auction.date_ending);
    if (auction.bid_date) {
      auction.bid_date = new Date(auction.bid_date);
    }
    await Bids.getBidsByAuction(auction.id || auction.auction_id)
      .then(bids => {
        let len = bids.length;
        auction.bid_count = len;
        auction.current_price = (len ? bids[len-1].price : auction.starting_price);
        return auction;
      })
      return auction;
  })
  return Promise.all(newAuctions)
    .then(newAuctions => newAuctions)
}

module.exports = router;