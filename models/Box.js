const mongoose = require("mongoose");

const Box = mongoose.model("Box", {
  name: String,
  picture: { type: mongoose.Schema.Types.Mixed, default: {} },
});

module.exports = Box;
