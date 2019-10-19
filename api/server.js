const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("../auth/auth-routes");
const auctionRoutes = require("./auctions/auction-routes");
const bidsRoutes = require("./bids/bids-routes");
const helpers = require("../api/helpers")

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRoutes);
server.use("/api/auctions", auctionRoutes);
server.use("/api/bids", bidsRoutes);
server.get("/", (req,res) => {
  res.send("Welcome to the root!");
})

module.exports = server;