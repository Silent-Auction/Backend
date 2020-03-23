const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("../auth/auth-routes");
const auctionRoutes = require("./auctions/auction-routes");
const bidsRoutes = require("./bids/bids-routes");
const userRoutes = require("./users/user-router");
const settingsRoutes = require("./settings/settings-routes");
const helpers = require("../api/helpers")

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(express.static('public'));
server.use("/api/auth", authRoutes);
server.use("/api/auctions", auctionRoutes);
server.use("/api/bids", helpers.verifyToken, bidsRoutes);
server.use("/api/users", helpers.verifyToken, userRoutes);
server.use("/api/settings", helpers.verifyToken, settingsRoutes);
server.get("/", (req,res) => {
  res.send("Welcome to the root!");
})

module.exports = server;