require('dotenv').config();

const server = require("./api/server");

const port = process.env.PORT;

server.listen(port, () => {
  console.log("SERVER UP! ON PORT " + port);
});

