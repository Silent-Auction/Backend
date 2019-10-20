const express = require("express");

const Bids = require("./bids-model");
const router = express.Router();

// Need route for dahsboard: view all current auctions

// Add bid to auction, must have buyer role. 
router.post("/:auction_id", [isBuyer, validateBid] , (req,res) => {
  Auctions.add(req.auction)
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

module.exports = router;