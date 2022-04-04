const mongoose = require("mongoose");

const Locations = mongoose.model("Locations", {
  name: String,
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Box",
  },
  picture: { type: mongoose.Schema.Types.Mixed, default: {} },
});

module.exports = Locations;
