const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model");
const secrets = require("../secrets");
const helpers = require("../api/helpers")
const router = express.Router();


/**
 * @api {get} / Get personal user info
 * @apiGroup Authorization
 * @apiSuccess {Number} user.id User id
 * @apiSuccess {String} user.username Username
 * @apiSuccess {String} user.first_name First Name
 * @apiSuccess {String} user.last_name Last Name
 * @apiSuccess {Boolean} user.role Seller or buyer
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "username": "user",
 *      "first_name": "Test",
 *      "last_name": "User",
 *      "role:" true
 *    }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */ 
router.get('/', helpers.verifyToken, (req,res) => {
  Users.findUser(req.decoded.username)
    .then(user => {
      user.role = (user.role ? "seller" : "buyer")
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({message: "Error retrieving from database"}))
});

/**
 * @api {post} /api/auth/register Register
 * @apiGroup Authorization
 * @apiParam {string} username Username
 * @apiParam {string} password Password
 * @apiParam {string} first_name First Name
 * @apiParam {string} [last_name] Last Name. Defaults to null
 * @apiParam {boolean} [is_seller=false] Seller or Buyer. Defaults to false
 * @apiParamExample {json} Input
 *    {
 *        "username": "student",
 *        "password": "secretpassword",
 *        "first_name": "Billy",
 *        "last_name": "Thomas",
 *        "is_seller": false
 *    }
 * @apiSuccess {integer} User ID
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 OK
 *    {
 *       "id": 5
 *    }
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/register', validateRegister, (req,res) => {
  req.body.username = req.body.username.toLowerCase();
  if (!req.body.is_seller) {
    req.body.is_seller = false
  }
  if (!req.body.last_name) {
    req.body.last_name = "";
  }
  const { password } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  req.body.password = hash;
  Users.register(req.body)
    .then(id => res.status(201).json(id))
    .catch(err => res.status(500).json({message:"Error registering user, try a different username"}));
});

/**
 * @api {post} /api/auth/login Login
 * @apiGroup Authorization
 * @apiParam {string} username Username
 * @apiParam {string} password Password
 * @apiParamExample {json} Input
 *    {
 *        "username": "student",
 *        "password": "secretpassword",
 *    }
 * @apiSuccess {string} Token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 OK
 *    {
 *       "token": "sdf890eufjiasdlkjklsdj3asdfskdlfdkfjkeladsf"
 *    }
 */
router.post('/login', (req,res) => {
  if (req.body) {
    if (req.body.username && req.body.password) {
      req.body.username = req.body.username.toLowerCase();
      Users.getUser(req.body.username)
        .then(user => {
          if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = generateToken(user);
            res.status(201).json({token});
          } else {
            res.status(500).json({message:"Incorrect Credentials"});
          }
        })
        .catch(err => res.status(500).json({message:"Error Logging In"}));
    } else {
      res.status(400).json({message:"Please provide credentials"});
    }
  } else {
    res.status(400).json({message:"Please provide body"});
  }
})

function validateRegister(req,res,next) {
  user = req.body;
  if (user) {
    if (!user.username || !user.password || !user.first_name) {
      res.status(400).json({message: "Please provide a username, password, and first name"});
    } else {
      next();
    }
  } else {
    res.status(500).json({message: "Please provide body"})
  }
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    seller: user.is_seller,
  };

  const options = {
    expiresIn: '3d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}


module.exports = router;