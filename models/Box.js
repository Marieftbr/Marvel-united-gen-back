const mongoose = require("mongoose");

const Box = mongoose.model("Box", {
  name: String,
  picture: String,
});

module.exports = Box;
