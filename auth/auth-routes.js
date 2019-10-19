const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model");
const secrets = require("../secrets");

const router = express.Router();

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

router.post('/login', (req,res) => {
  if (req.body) {
    if (req.body.username && req.body.password) {
      req.body.username = req.body.username.toLowerCase();
      Users.findUser(req.body.username)
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
  };

  const options = {
    expiresIn: '3d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

module.exports = router;