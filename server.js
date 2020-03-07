const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const connect = require("./config/db");
const errorHandler = require("./middlewares/error");

const server = async () => {
  dotenv.config({ path: "./.env" });

  await connect();

  const app = express();

  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
  }

  app.use(express.json());
  app.use(express.static("public"));
  app.use(fileupload());
  app.use(cookieParser());
  app.use(mongoSanitize())
  app.use(helmet())
  app.use(xss())
  app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }))
  app.use(hpp())
  app.use(cors())

  app.use("/api/v1/bootcamps", bootcamps);
  app.use("/api/v1/courses", courses);
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/users", users);
  app.use("/api/v1/reviews", reviews);
  app.use(errorHandler);

  app.listen(
    process.env.PORT,
    console.log(
      `The server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
        .yellow
    )
  );
};

server();