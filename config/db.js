const mongoose = require("mongoose");

const connect = async () => {
  const conn = await mongoose.connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connect;
