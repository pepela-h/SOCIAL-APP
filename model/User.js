const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
  },
  name: {
    type: String,
  },
  image: String,
  location: String,
  gender: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  following: {
    type: [Schema.ObjectId],
    default: [],
  },
  followers: {
    type: [Schema.ObjectId],
    default: [],
  },
  closeFriends: {
    type: [String],
    default: [],
  },
  savedPosts: {
    type: [String],
    default: [],
  },
  roles: {
    type: [Number],
    default: [2001],
  },
});

module.exports = mongoose.model("User", userSchema);
