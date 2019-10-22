const express = require("express");

const Users = require("./user-model");
const Bids = require("../bids/bids-model");

const router = express.Router();


/**
 * @api {get} /api/users/ Request User Information (Seller)
 * @apiPermission Buyer or Seller
 * 
 * @apiGroup Users
 * 
 * @apiSuccess (content) {Number} id ID
 * @apiSuccess (content) {String} username Username
 * @apiSuccess (content) {String} first_name First Name
 * @apiSuccess (content) {String} last_name Last Name
 * @apiSuccess (content) {String} role Role of user
 * @apiSuccess (content) {Object[]} auctions Auctions owned by seller
 * @apiSuccess (content) {Number} auctions.id Auction ID
 * @apiSuccess (content) {String} auctions.name Title/name of auction
 * @apiSuccess (content) {Number} auctions.starting_price Starting price
 * @apiSuccess (content) {Date} auctions.date_ending Ending date 
 * @apiSuccess (content) {String} auctions.image Link to image of item sold
 * @apiSuccess (content) {Number} auctions.bid_count Number of placed bids
 * @apiSuccess (content) {Number} auctions.current_price Current bid 
 * @apiSuccessExample {json} Success 
 * HTTP/1.1 200 OK
{
    "id": 1,
    "username": "testseller",
    "first_name": "Test",
    "last_name": "Seller",
    "role": "seller",
    "auctions": [
        {
            "id": 1,
            "name": "iPhone",
            "description": "A beautiful space gray iphone 11",
            "starting_price": 100,
            "date_ending": "2019-12-29T08:00:00.000Z",
            "image": "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-11-Pro/Midnight-Green/Apple-iPhone-11-Pro-Midnight-Green-frontimage.jpg",
            "bid_count": 4,
            "current_price": 250
        },
        {
            "id": 2,
            "name": "Pixel Plus",
            "description": "A Google Pixel",
            "starting_price": 100,
            "date_ending": "2019-10-20T07:00:00.000Z",
            "image": "https://static.bhphoto.com/images/images1000x1000/1550057716_1448921.jpg",
            "bid_count": 4,
            "current_price": 220
        }
    ]
}

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

/**
 * @api {get} /api/users/ Request User Information (Buyer)
 * @apiPermission Buyer or Seller
 * @apiName getBuyer
 * @apiGroup Users
 * 
 * @apiSuccess (content) {Number} id ID
 * @apiSuccess (content) {String} username Username
 * @apiSuccess (content) {String} first_name First Name
 * @apiSuccess (content) {String} last_name Last Name
 * @apiSuccess (content) {String} role Role of user
 * @apiSuccess (content) {Object[]} auctions Auctions owned by seller
 * @apiSuccess (content) {Number} auctions.id Auction ID
 * @apiSuccess (content) {String} auctions.sold_by_user Username of seller
 * @apiSuccess (content) {String} auction.sold_by First name of seller
 * @apiSuccess (content) {String} auctions.name Title/name of auction
 * @apiSuccess (content) {Date} auctions.date_ending Ending date 
 * @apiSuccess (content) {String} auctions.image Link to image of item sold
 * @apiSuccess (content) {Number} auctions.bid_id ID of user's most recent bid
 * @apiSuccess (content) {Date} auctions.bid_date Date of user's most recent bid
 * @apiSuccess (content) {Number} auctions.your_recent_bid User's most recent bid
 * @apiSuccess (content) {Number} auctions.bid_count Number of bids on auction
 * @apiSuccess (content) {Number} auctions.current_price Current bid 
 * @apiSuccessExample {json} Success 
 * HTTP/1.1 200 OK
{
    "id": 3,
    "username": "testbuyer",
    "first_name": "Test",
    "last_name": "Buyer",
    "role": "buyer",
    "auctions": [
        {
            "auction_id": 1,
            "sold_by_user": "testseller",
            "sold_by": "Test",
            "name": "iPhone",
            "description": "A beautiful space gray iphone 11",
            "date_ending": "2019-12-29T08:00:00.000Z",
            "image": "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-11-Pro/Midnight-Green/Apple-iPhone-11-Pro-Midnight-Green-frontimage.jpg",
            "bid_id": 4,
            "bid_date": "2019-10-20T07:00:00.000Z",
            "your_recent_bid": 250,
            "bid_count": 4,
            "current_price": 250
        },
        {
            "auction_id": 2,
            "sold_by_user": "testseller",
            "sold_by": "Test",
            "name": "Pixel Plus",
            "description": "A Google Pixel",
            "date_ending": "2019-10-20T07:00:00.000Z",
            "image": "https://static.bhphoto.com/images/images1000x1000/1550057716_1448921.jpg",
            "bid_id": 8,
            "bid_date": "2019-10-19T07:00:00.000Z",
            "your_recent_bid": 220,
            "bid_count": 4,
            "current_price": 220
        }
    ]
}

 */
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