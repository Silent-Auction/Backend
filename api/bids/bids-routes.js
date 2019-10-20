const express = require("express");

const Auctions = require('../auctions/auction-model');
const Bids = require("./bids-model");
const router = express.Router();

router.get("/:id", (req,res) => {
  Bids.getBid(req.params.id)
    .then(bid => {
      if (bid) {
        res.status(201).json(bid);
      } else {
        res.status(400).json({message: "Cannot find bid with specified ID."});
      }
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database"}));
});

// Add bid to auction, must have buyer role. 
router.post("/:auction_id", [isBuyer, validateBid, findAuction] , (req,res) => {
  Bids.add(req.bid)
    .then(id => res.status(201).json({id}))
    .catch(err => res.status(500).json({message: "Error adding to database"}))
});

// Edit your bid. Checks token to see if you are the owner of bid.
// Need to add more logic (when can you not edit the bid?)
router.put("/:id", authOwner, (req,res) => {
  Auctions.edit(req.params.id, req.body)
    .then(records => res.status(201).json({records}))
    .catch(err => res.status(500).json({message: "Error updating database"}))
});

// Delete bid. Also requires logic
router.delete("/:id", authOwner, (req,res) => {
  Auctions.remove(req.params.id)
  .then(records => res.status(201).json({records}))
  .catch(err => res.status(500).json({message: "Error deleting from database"}))
})

// Checks for buyer role
function isBuyer(req,res,next) {
  if (!req.decoded.seller) {
    next();    
  } else {
    res.status(403).json({message: "You are unauthorized to perform this action."})
  }
}

// Matches token's user ID with user_id associated with bid
function authOwner(req,res,next) {
  Bids.getBid(req.params.id)
    .then(bid => {
      if (bid) {
        if (bid.user_id === req.decoded.subject) {
          req.bid = bid;
          next();
        } else {
          res.status(403).json({message: "You are unauthorized to perform this action."});
        }
      } else {
        res.status(400).json({message: "Bid with specified ID does not exist."})
      }
    })
}

// Checks to see if body has all fields for bid
function validateBid(req, res, next) {
  const bid = req.body;
  if (bid) {
    if (bid.price) {
      req.bid = {...bid, user_id: req.decoded.subject, auction_id: req.params.auction_id, created_at: new Date()}
      next();
    } else {
      res.status(400).json({message: "Price is required."})
    }
  } else {
    res.status(400).json({message: "Body is required."})
  }
}

function findAuction(req, res, next) {
  Auctions.getAuction(req.params.auction_id)
    .then(auction => {
      if (auction) {
        Auctions.getHighestBid(auction.id)
          .then(price => {
            price = price || auction.starting_price
            if (price < req.bid.price) {
              next();
            } else {
              res.status(400).json({message: "Your bid is lower than or equal to current price."});
            }
          })
      } else {
        res.status(400).json({message: "Cannot find auction with specified ID."});
      }
    })
}

module.exports = router;