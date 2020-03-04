const express = require("express");

const Auctions = require("./auction-model");
const Bids = require("../bids/bids-model");
const helpers = require("../helpers");
const router = express.Router();


/**
 * @api {get} /api/auctions/ Request All Auctions
 * @apiPermission Buyer or Seller
 * @apiGroup Auctions
 * @apiSuccess {Object[]} auctions Auction
 * @apiSuccess {Number} auctions.id ID
 * @apiSuccess {Number} auctions.user_id User ID of owner of auction
 * @apiSuccess {String} auctions.seller Username of seller
 * @apiSuccess {String} auctions.first_name First Name of seller
 * @apiSuccess {String} auctions.name Title of auction
 * @apiSuccess {String} auctions.description Description
 * @apiSuccess {Number} auctions.starting_price Starting price for item
 * @apiSuccess (request) {Date} auctions.date_starting Start Date of Auction
 * @apiSuccess {Date} auctions.date_ending Ending date of auction
 * @apiSuccess {String} auctions.image Link to photo of image
 * @apiSuccess {Number} auctions.bid_count Number of bids placed
 * @apiSuccess {Number} auction.current_price Highest bid 
 * @apiSuccess {Date} auction.last_bid_date Time of last bid
 *
 * @apiSuccessExample {json} Success 
 * HTTP/1.1 200 OK
* [
*     {
*         "id": 1,
*         "user_id": 1,
*         "seller": "testseller",
*         "first_name": "Test",
*         "name": "iPhone",
*         "description": "A beautiful space gray iphone 11",
*         "starting_price": 100,
*         "date_starting": "2019-12-19T08:00:00.000Z"
*         "date_ending": "2019-12-29T08:00:00.000Z",
*         "image": "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-11-Pro/Midnight-Green/Apple-iPhone-11-Pro-Midnight-Green-frontimage.jpg",
*         "bid_count": 4,
*         "current_price": 250,
*         "last_bid_date": "2019-10-20T07:00:00.000Z"
*     },
*     {
*         "id": 2,
*         "user_id": 1,
*         "seller": "testseller",
*         "first_name": "Test",
*         "name": "Pixel Plus",
*         "description": "A Google Pixel",
*         "starting_price": 100,
*         "date_starting": "2019-10-19T08:00:00.000Z"
*         "date_ending": "2019-10-20T07:00:00.000Z",
*         "image": "https://static.bhphoto.com/images/images1000x1000/1550057716_1448921.jpg",
*         "bid_count": 4,
*         "current_price": 220,
*         "last_bid_date": "2019-10-19T07:00:00.000Z"
*     }
* ]
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', (req,res) => {
  Auctions.getAll()
    .then(async auctions => {
      for (i = 0; i < auctions.length; i++) {
        const auction_id = auctions[i].id;
        const bids = await Bids.getBidsByAuction(auction_id);
        const bid_count = bids.length;
        auctions[i].date_ending = new Date(auctions[i].date_ending);
        auctions[i].date_starting = new Date(auctions[i].date_starting);
        auctions[i].bid_count = bid_count;
        auctions[i].current_price = (bid_count ? bids[bid_count - 1].price : auctions[i].starting_price)
        
        auctions[i].last_bid_date = ( bid_count ? new Date(bids[bid_count - 1].created_at) : auctions[i].date_starting);
      }
      res.status(200).json(auctions);
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database."}));
})

/**
 * @api {get} /api/auctions/:id Request Specific Auction
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
 * @apiSuccess (content) {Date} auction.date_starting Starting date of auction
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
 *  "date_starting": "2019-12-19T08:00:00.000Z"
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
// Get info for auction by ID. Includes current bids
router.get('/:id', (req,res) => {
  Auctions.getAuction(req.params.id)
    .then(auction => {
      if (auction) {
        auction.date_starting = new Date(auction.date_starting);
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

router.use(helpers.verifyToken);
/**
 * @api {post} /api/auctions/ Add an auction
 * @apiPermission Seller
 * 
 * @apiGroup Auctions
 * @apiParam (request) {String} name Name/Title of auction
 * @apiParam (request) {Number} starting_price Starting bid 
 * @apiParam (request) {Date} date_starting Start Date of Auction
 * @apiParam (request) {Date} date_ending End Date of Auction
 * @apiParam (request) {String} [description] Description of product
 * @apiParam (request) {string} image URL to image
 * @apiParamExample {json} Input
 *    {
 *      "name": "iPhone",
 *      "starting_price": 50,
 *      "date_starting": "10/19/19",
 *      "date_ending": "10/31/19",
 *      "description": "A brand new iPhone",
 *      "image": "https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg"
 *    }
 * @apiSuccess {integer} Auction ID
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 OK
 *    {
 *       "id": 5
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
// Add auction. Must have the seller role.
router.post("/", [isSeller, validateAuction] , (req,res) => {
  Auctions.add(req.auction).then(id => res.status(201).json(id[0]))
    .catch(err => res.status(500).json({message: "Error adding to database"}))
});

// Edit your auction. Checks token to see if you are the owner of auction.
// Need to add more logic (when can you not edit the auction?)
// What is editable thorughout the whole auction, vs what is editable after a bid is placed.
/**
 * @api {put} /api/auctions/:id Edit an auction
 * @apiPermission Auction Owner
 * @apiDescription Auctions cannot be edited after the end date has passed. You cannot edit the name, starting price, and start date of the 
 * auction after a bid has been placed on it. 
 * @apiGroup Auctions
 * @apiParam (param) {Number} id ID of auction
 * @apiParam (request) {String} [name] Name/Title of auction. Cannot edit after a bid has been placed
 * @apiParam (request) {Number} [starting_price] Starting bid. Cannot edit after a bid has been placed
 * @apiParam (request) {Date} [date_starting] End Date of Auction. Cannot edit after a bid has been placed
 * @apiParam (request) {Date} [date_ending] End Date of Auction
 * @apiParam (request) {String} [description] Description of product
 * @apiParam (request) {string} [image] URL to image
 * @apiParamExample {json} Input
 *    {
 *      "name": "iPhone",
 *      "starting_price": 50,
 *      "date_starting": "10/21/19"
 *      "date_ending": "10/30/19",
 *      "description": "A brand new iPhone",
 *      "image": "https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg"
 *    }
 * @apiSuccess {integer} Number of entries changed
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 OK
 *    {
 *       "records": 1
 *    }
 */
router.put("/:id", [authOwner, validDate], (req,res) => {
  const {user_id, id, ...rest} = req.body;
  req.body = rest;
  Bids.getBidsByAuction(req.params.id)
    .then(bids => {
      // can't change starting price, title, date_starting if there are bids on it already
      if (bids.length) {
        const {starting_price, name, date_starting, ...rest} = req.body;
        req.body = rest;
      }
      Auctions.edit(req.params.id, req.body)
      .then(records => res.status(201).json({records}))
      .catch(err => res.status(500).json({message: "Error updating database"}));
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database"}));
});

/**
   * @api {delete} /api/auctions/:id Delete an auction
   * @apiGroup Auctions
   * @apiPermission Auction Owner
   *
   * @apiParam {Number} id Auction's unique ID.
   *
   * @apiSuccess {integer} Number of entries deleted
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 201 OK
   *    {
   *       "records": 1
   *    }
   */
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
    if (!auction.name || !auction.starting_price || !auction.date_ending || !auction.image || !auction.date_starting) {
      res.status(400).json({message: "Name, starting price, end date, start date, and image URL is required."})
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
  let date_ending = new Date(req.auction.date_ending).getTime();
  if (date < date_ending) {
    next();
  } else {
      res.status(400).json({message: "Auction is already over."})
  }
}
module.exports = router;