const express = require("express");
const router = express.Router();

const Character = require("../models/Character");

router.get("/character", (req, res) => {
  res.json({ message: "Character List" });
});

router.post("/character/create", (req, res) => {
  res.json({ message: "Create a Character" });
});

module.exports = router;
