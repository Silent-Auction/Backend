const express = require("express");

const Auctions = require("./auction-model");
const Bids = require("../bids/bids-model");
const router = express.Router();


router.get('/', (req,res) => {
  Auctions.getAll()
    .then(async auctions => {
      for (i = 0; i < auctions.length; i++) {
        const auction_id = auctions[i].id;
        const bids = await Bids.getBidsByAuction(auction_id);
        const bid_count = bids.length;
        auctions[i].date_ending = new Date(auctions[i].date_ending);
        auctions[i].bid_count = bid_count;
        auctions[i].current_price = (bid_count ? bids[bid_count - 1].price : auctions[i].starting_price)
        auctions[i].last_bid_date = new Date(bids[bid_count - 1].created_at);
      }
      res.status(200).json(auctions);
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database."}));
})

// Get info for auction by ID. Includes current bids
router.get('/:id', (req,res) => {
  Auctions.getAuction(req.params.id)
    .then(auction => {
      if (auction) { 
        auction.date_ending = new Date(auction.date_ending);
        Bids.getBidsByAuction(auction.id)
          .then(bids => {
            bids.forEach(bid => {
              bid.created_at = new Date(bid.created_at);
            })
            auction.bids = bids;
            res.status(200).json(auction);
          })
          .catch(err => res.status(500).json({message: "Error retrieving from database."}));
      } else {
        res.status(400).json({message: "Cannot find auction with specified ID."})
      } 
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database."}));
});

// Add auction. Must have the seller role.
router.post("/", [isSeller, validateAuction] , (req,res) => {
  Auctions.add(req.auction)
    .then(id => res.status(201).json({id}))
    .catch(err => res.status(500).json({message: "Error adding to database"}))
});

// Edit your auction. Checks token to see if you are the owner of auction.
// Need to add more logic (when can you not edit the auction?)
// What is editable thorughout the whole auction, vs what is editable after a bid is placed.
router.put("/:id", [authOwner, validDate], (req,res) => {
  const {user_id, ...rest} = req.body;
  req.body = rest;
  Bids.getBidsByAuction(req.params.id)
    .then(bids => {
      // can't change starting price if there are bids on it already or title
      if (bids.length) {
        const {starting_price, name, ...rest} = req.body;
        req.body = rest;
      }
      Auctions.edit(req.params.id, req.body)
      .then(records => res.status(201).json({records}))
      .catch(err => res.status(500).json({message: "Error updating database"}));
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database"}));
});

router.delete("/:id", [authOwner, validDate], (req,res) => {
  Bids.getBidsByAuction(req.auction.id)
  Auctions.remove(req.params.id)
  .then(records => res.status(201).json({records}))
  .catch(err => res.status(500).json({message: "Error deleting from database"}))
})

// Checks for seller role
function isSeller(req,res,next) {
  if (req.decoded.seller) {
    next();    
  } else {
    res.status(403).json({message: "You are unauthorized to perform this action."})
  }
}

// Matches token's user ID with auction ID passed in params
function authOwner(req,res,next) {
  Auctions.getAuction(req.params.id)
    .then(auction => {
      if (auction) {
        if (auction.user_id === req.decoded.subject) {
          req.auction = auction;
          next();
        } else {
          res.status(403).json({message: "You are unauthorized to perform this action."});
        }
      } else {
        res.status(400).json({message: "Auction with specified ID does not exist."})
      }
    })
}

// Checks to see if body has all fields for auction
function validateAuction(req, res, next) {
  const auction = req.body;
  if (auction) {
    if (!auction.name || !auction.starting_price || !auction.date_ending || !auction.image ) {
      res.status(400).json({message: "Name, starting price, end date, and image URL is required."})
    } else {
      req.auction = {...auction, user_id: req.decoded.subject}
      next();
    }
  } else {
    res.status(400).json({message: "Body is required."})
  }
}

function validDate(req, res, next) {
  let date = new Date().getTime();
  if (date < req.auction.date_ending) {
    next();
  } else {
      res.status(400).json({message: "Auction is already over."})
  }
}
module.exports = router;