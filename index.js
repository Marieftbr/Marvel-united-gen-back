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
app.use(locationRoutes);

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1/marvel-united");

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

//route for get random characters
app.get("/random/character", async (req, res) => {
  try {
    if (req.fields.number) {
      const test = await Character.aggregate([
        { $match: { type: "Hero" } },
        { $sample: { size: req.fields.number } },
      ]);

      console.log(test);
      res.json(test);
    } else {
      res.json({ message: "noooooo" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
