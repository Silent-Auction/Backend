const jwt = require("jsonwebtoken");
const secrets = require("../secrets");

module.exports = {
  verifyToken
}

function verifyToken (req,res,next) {
  const token = req.headers.authorization;
  jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
    if (err) {
      res.status(400).json({message: "You must be logged in to view this."})
    } else {
      req.decoded = decodedToken;
      next();
    }
  })
}