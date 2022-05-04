require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const uid2 = require("uid2");

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
const { adminRoute } = require("./middlewares");
const Session = require("./models/Session");
app.use(locationRoutes);

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1/marvel-united");

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

//route for generate a party
app.get("/new-game", async (req, res) => {
  try {
    if (req.query.number) {
      const heroes = await Character.aggregate([
        { $match: { type: "hero" } },
        { $sample: { size: parseInt(req.query.number) } },
      ]);

      const villain = await Character.aggregate([
        { $match: { type: "villain" || "both" } },
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

app.post("/login", async (req, res) => {
  try {
    if (req.fields.password === process.env.PASSWORD) {
      const token = uid2(16);

      const newSession = new Session({
        token: token,
      });

      await newSession.save();
      res.json(token);
    } else {
      res.json("the password isn't the good one");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
