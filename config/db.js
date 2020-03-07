const mongoose = require("mongoose");

const connect = async () => {
  const conn = await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connect;
