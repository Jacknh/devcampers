const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps')

dotenv.config({path: './config/config.env'})

const app = express();

app.use('/api/v1/bootcamps', bootcamps);

app.listen(process.env.PORT, console.log(`The server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`))