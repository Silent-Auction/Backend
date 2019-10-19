const express = require("express");

const Auctions = require("./auction-model");
const Bids = require("../bids/bids-model");
const helpers = require("../helpers")
const router = express.Router();


router.get('/:id', helpers.verifyToken, (req,res) => {
  Auctions.getAuction(req.params.id)
    .then(auction => {
      Bids.getBidsByAuction(auction.id)
        .then(bids => {
          auction.bids = bids
          res.status(200).json(auction)
        })
    })
});

module.exports = router;