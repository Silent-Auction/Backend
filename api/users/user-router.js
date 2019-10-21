const express = require("express");

const Users = require("./user-model");
const Bids = require("../bids/bids-model");
const Auctions = require("../auctions/auction-model");

const router = express.Router();

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