const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Settings = require('./settings-model');
const helpers = require("../helpers");
const router = express.Router();

router.get('/', (req,res) => {
  Settings.getUserById(req.decoded.subject)
    .then(user => {
      if (user) {
        const {password, ...rest} = user;
        res.status(200).json({...rest});
      } else {
        res.status(404).json({message: "User cannot be found."});
      }
    })
    .catch(err => {
      res.status(500).json({message: "Error retrieving user information"});
    });
})

router.put('/', [verifyBody, checkPassword, checkUsername], (req, res) => {
  const {username, password, first_name, last_name} = req.settings;
  Settings.update(req.decoded.subject, {username, password, first_name, last_name})
    .then(records => res.status(201).json({records}))
    .catch(err => {
      res.status(500).json({message: "Error updating user information"});
    });
})

router.delete('/', (req,res) => {
  Settings.remove(req.decoded.subject)
    .then(records => res.status(201).json({records}))
    .catch(err => {
      res.status(500).json({message: "Error deleting user information"});
    });
})

function verifyBody (req, res, next) {
  settings = req.body;
  if (settings) {
    if ([settings.first_name, settings.last_name, settings.username, settings.password, settings.old_password, settings.username].some(element => element)) {
      req.settings = settings;
      next();
    } else {
      res.status(400).json({message: "Editable fields are: first_name, last_name, username, password"})
    }
  } else {
    res.status(400).json({message: "Missing body in request"})
  }
}

function checkPassword (req, res, next) {
  const { password, old_password } = req.settings;
  if (password && old_password) {
    Settings.getUserById(req.decoded.subject)
      .then(user => {
        if (user && bcrypt.compareSync(req.settings.old_password, user.password)) {
          req.settings.password = bcrypt.hashSync(settings.password, 12);
          next();
        } else {
          res.status(403).json({message: "Old password is incorrect."})
        }
      })
  } else if (password) {
    res.status(400).json({message: "Missing old_password for verification!"})
  } else {
    next();
  }
}

function checkUsername (req, res, next) {
  const {username } = req.settings;
  if (username) {
    req.settings.username = username.toLowerCase();
    Settings.getUserByName(username)
      .then(user => {
        if (!user) {
          next();
        } else {
          res.status(403).json({message: "Username is already taken."})
        }
      })
  } else {
    next();
  }

}
module.exports = router;