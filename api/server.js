const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("../auth/auth-routes");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRoutes);
server.get("/", (req,res) => {
  res.send("Welcome to the root!");
})

module.exports = server;