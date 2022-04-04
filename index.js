const express = require("express");
const app = express();
const mongoose = require("mongoose");

const characterRoutes = require("./models/Character");
app.use(characterRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

mongoose.connect("mongodb://localhost:27017/marvel-united");

app.listen(3000, () => {
  console.log("Server has started");
});
