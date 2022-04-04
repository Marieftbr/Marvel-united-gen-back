const mongoose = require("mongoose");

const Locations = mongoose.model("Locations", {
  name: String,
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Box",
  },
  picture: String,
});

module.exports = Locations;
