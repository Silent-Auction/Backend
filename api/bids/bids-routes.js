const express = require("express");

const Auctions = require('../auctions/auction-model');
const Bids = require("./bids-model");
const router = express.Router();

/**
 * @api {get} /api/auctions/:id Request Specific Bid
 * @apiPermission Buyer or Seller
 * 
 * @apiGroup Bids
 * 
 * @apiParam (params) {Number} id Bid's unique ID 
 * @apiSuccess (content) {Number} id ID
 * @apiSuccess (content) {Number} user_id User ID of owner of auction
 * @apiSuccess (content) {Number} auction_id Starting price for item
 * @apiSuccess (content) {Number} starting_price Starting price for item
 * @apiSuccess (content) {Date} created_at Date of bid
 * @apiSuccessExample {json} Success 
 * HTTP/1.1 200 OK
 * {
 *    "id": 1,
 *    "user_id": 2,
 *    "auction_id": 1,
 *    "price": 150,
 *    "created_at": "2019-10-19"
 * }
 */
router.get("/:id", (req,res) => {
  Bids.getBid(req.params.id)
    .then(bid => {
      if (bid) {
        bid.created_at = new Date(bid.created_at);
        res.status(201).json(bid);
      } else {
        res.status(404).json({message: "Cannot find bid with specified ID."});
      }
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database"}));
});

/**
 * @api {post} /api/bids/:auction_id Place bid
 * @apiParam (params) ID of auction
 * @apiGroup Bids
 * @apiParam (content) {Number} price Price of bid. Cannot place bid that is lower than current bid price, or on an auction that has ended already.
 * @apiParamExample {json} Input
 *    {
 *        "price": "500,
 *    }
 * @apiSuccess {integer} Bid ID
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 OK
 *    {
 *       "id": 5
 *    }
 * @apiErrorExample {json} 
 *    HTTP/1.1 500 Internal Server Error
 *    
 */
// Add bid to auction, must have buyer role, valid auctoin, and auction must not be over. 
router.post("/:auction_id", [isBuyer, validateBid, findAuction, validDate, validPrice] , (req,res) => {
  req.bid = {...bid, user_id: req.decoded.subject, auction_id: req.params.auction_id, created_at: new Date()}
  Bids.add(req.bid)
    .then(id => res.status(201).json({id}))
    .catch(err => res.status(500).json({message: "Error adding to database"}))
});

// Edit your bid. Checks token to see if you are the owner of bid.
// Need to add more logic (when can you not edit the bid?)
router.put("/:id", [authOwner, isLastBid, validateBid, findAuction, validDate, validPrice], (req,res) => {
  const {id, auction_id, user_id, ...rest} = req.body;
  req.body = rest;
  req.body.created_at = new Date();
  Bids.edit(req.params.id, req.body)
    .then(records => res.status(201).json({records}))
    .catch(err => res.status(500).json({message: "Error updating database"}))
});

// Delete bid. Also requires logic
router.delete("/:id", [authOwner, isLastBid, findAuction, validDate], (req,res) => {
  Bids.remove(req.params.id)
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
      req.bid = {...req.bid, ...bid};
      next();
    } else {
      res.status(400).json({message: "Price is required."})
    }
  } else {
    res.status(400).json({message: "Body is required."})
  }
}

function findAuction(req, res, next) {
  Auctions.getAuction(req.params.auction_id || req.bid.auction_id)
    .then(auction => {
      if (auction) {
        req.auction = auction;
        next();
      } else {
        res.status(404).json({message: "Cannot find auction with specified ID."});
      }
    })
}

function validDate(req, res, next) {
  let date = new Date().getTime();
  if (date < req.auction.date_ending) {
    next();
  } else {
      res.status(400).json({message: "Auction is already over."})
  }
}

function validPrice(req, res, next) {
  Auctions.getHighestBid(req.auction.id)
    .then(auction => {
      if (auction.price < req.bid.price) {
        next();
      } else {
        res.status(400).json({message: "You cannot bid lower than the current price."})
      }
    })
    .catch(err => res.status(500).json({message: "Error retrieving from the database."}))
}

function isLastBid(req,res,next) {
  Bids.getLastBid(req.bid.auction_id)
    .then(lastBid => {
      if (lastBid.id == req.params.id) {
        next();
      } else {
        res.status(403).json({mesesage: "Cannot modify bid."})
      }
    })
}

module.exports = router;