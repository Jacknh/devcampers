const mongoose = require("mongoose");

const connect = async () => {
  const conn = await mongoose.connect("mongodb://localhost:27017/devcamper", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connect;
