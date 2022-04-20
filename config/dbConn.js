const mongoose = require("mongoose");

const connectDB = (url) => {
  console.info(`Trying to connect to ${url}...`);
  try {
    mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {

    
  }
};
module.exports = connectDB;
