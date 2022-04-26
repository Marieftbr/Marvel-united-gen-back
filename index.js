require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(formidable());
app.use(cors());

const characterRoutes = require("./routes/character");
app.use(characterRoutes);
const boxRoutes = require("./routes/box");
app.use(boxRoutes);
const locationRoutes = require("./routes/locations");
const Character = require("./models/Character");
const Locations = require("./models/Locations");
app.use(locationRoutes);

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1/marvel-united");

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

//route for generate a party
app.get("/new-game", async (req, res) => {
  try {
    if (req.fields.number) {
      const heroes = await Character.aggregate([
        { $match: { type: "Hero" } },
        { $sample: { size: req.fields.number } },
      ]);

      const villain = await Character.aggregate([
        { $match: { type: "Villain" || "Both" } },
        { $sample: { size: 1 } },
      ]);

      const locations = await Locations.aggregate([{ $sample: { size: 6 } }]);

      res.json({
        heroes,
        locations,
        villain: villain[0],
      });
    } else {
      res.json({ message: "number is mandatory" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
