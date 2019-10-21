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
        await Users.getSellerAuctions(user.id)
          .then(async auctions => {
            const newAuctions = await auctions.map(async (auction, idx) => {
              auction.date_ending = new Date(auction.date_ending);
              await Bids.getBidsByAuction(auction.id)
                .then(bids => {
                  let len = bids.length;
                  auction.bid_count = len;
                  auction.current_price = (len ? bids[len-1].price : auction.starting_price);
                  return auction;
                })
                return auction;
            })
            return Promise.all(newAuctions)
              .then(newAuctions => user.auctions = newAuctions)
          })
        res.status(200).json(user);
      } else {

      }
    })
})

router.get("/buyer", (req, res) => {
  Users.getBuyerAuctions(req.decoded.subject)
    .then(bids => res.json(bids));
})

module.exports = router;