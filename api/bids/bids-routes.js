const express = require("express");

const Auctions = require("./auction-model");
const Bids = require("../bids/bids-model");
const helpers = require("../helpers")
const router = express.Router();

// Need route for dahsboard: view all current auctions

// Add auction. Must have the seller role.
router.post("/:auction_id", [helpers.verifyToken, isBuyer] , (req,res) => {
  Auctions.add(req.auction)
    .then(id => res.status(201).json({id}))
    .catch(err => res.status(500).json({message: "Error adding to database"}))
});

// Edit your auction. Checks token to see if you are the owner of auction.
// Need to add more logic (when can you not edit the bid?)
router.put("/:id", [helpers.verifyToken, authOwner], (req,res) => {
  Auctions.edit(req.auction.user_id, req.body)
    .then(records => res.status(201).json({records}))
    .catch(err => res.status(500).json({message: "Error updating database"}))
});

// Delete auction
router.delete("/:id", [helpers.verifyToken, authOwner], (req,res) => {
  Auctions.remove(req.params.id)
  .then(records => res.status(201).json({records}))
  .catch(err => res.status(500).json({message: "Error deleting from database"}))
})

// Checks for seller role
function isBuyer(req,res,next) {
  if (!req.decoded.seller) {
    next();    
  } else {
    res.status(403).json({message: "You are unauthorized to perform this action."})
  }
}

// Matches token's user ID with auction ID passed in params
function authOwner(req,res,next) {
  Bids.getBid(req.params.id)
    .then(bid => {
      if (bid) {
        if (auction.user_id === req.decoded.subject) {
          req.bid = req.bid;
          next();
        } else {
          res.status(403).json({message: "You are unauthorized to perform this action."});
        }
      } else {
        res.status(400).json({message: "Bid with specified ID does not exist."})
      }
    })
}

// Checks to see if body has all fields for auction
function validateBid(req, res, next) {
  const auction = req.body;
  if (auction) {
    if (!auction.name || !auction.starting_price || !auction.date_ending || !auction.image ) {
      req.auction = {...auction, id: req.decoded.subject}
      next();
    } else {
      res.status(400).json({message: "Name, starting price, end date, and image URL is required."})
    }
  } else {
    res.status(400).json({message: "Body is required."})
  }
}

module.exports = router;