const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require('colors');
const bootcamps = require("./routes/bootcamps");
const connect = require('./config/db')

dotenv.config({ path: "./.env" });

connect();

const app = express();

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);
    
app.listen(
  process.env.PORT,
  console.log(
    `The server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`.yellow
  )
);
