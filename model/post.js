const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: String,
  location: String,
  tags: [String],
  likes: {
    type: [String],
    default: [],
  },
  comments: {
    type: [{}],
    default: [],
  },
  created: {
    type: Date,
    default: new Date().toLocaleDateString(),
  },
  reported: {
    type: [Boolean],
    
  },
  saves: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Post", postSchema);
