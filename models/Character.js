const mongoose = require("mongoose");

const Character = mongoose.model("Character", {
  name: String,
  type: String,
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Box",
  },
  picture: { type: mongoose.Schema.Types.Mixed, default: {} },
});

module.exports = Character;
