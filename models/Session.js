const mongoose = require("mongoose");

const Session = mongoose.model("Session", {
  token: String,
});

module.exports = Session;
