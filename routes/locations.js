const express = require("express");
const router = express.Router();

const Locations = require("../models/Character");

router.get("/locations", (req, res) => {
  res.json({ message: "Locations List" });
});

module.exports = router;
