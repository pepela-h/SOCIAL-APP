const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deluserSchema = new Schema({
  counts: 0
});

module.exports = mongoose.model("DelUser", deluserSchema);
