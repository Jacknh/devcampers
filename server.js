const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const connect = require("./config/db");
const errorHandler = require("./middlewares/error");

dotenv.config({ path: "./.env" });

connect();

const app = express();

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use(errorHandler);

app.listen(
  process.env.PORT,
  console.log(
    `The server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
      .yellow
  )
);
