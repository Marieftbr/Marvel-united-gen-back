const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const Box = require("../models/Box");

router.get("/box", (req, res) => {
  res.json({ message: "Box List" });
});

router.post("/box", async (req, res) => {
  try {
    const pictureToUpload = req.files.picture.path;
    if (!req.fields.name || !pictureToUpload) {
      res.status(400).json({ message: "name or picture is missing" });
    } else {
      const newBox = new Box({
        name: req.fields.name,
      });
      await newBox.save();

      newBox.picture = await cloudinary.uploader.upload(pictureToUpload, {
        folder: `marvelUnited/box/${newBox._id}`,
      });
      console.log(newBox.picture);

      await newBox.save();

      res.json({
        id: newBox._id,
        name: req.fields.name,
        picture: newBox.picture.url,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
