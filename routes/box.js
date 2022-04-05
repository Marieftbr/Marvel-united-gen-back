const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const Box = require("../models/Box");

//route for read a list of boxes
router.get("/box", async (req, res) => {
  try {
    const boxes = await Box.find();
    res.json(
      boxes.map((box) => {
        return {
          _id: box._id,
          name: box.name,
          // picture: picture.url,
        };
      })
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// route for create box
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

//route for update box
router.put("/box", async (req, res) => {
  try {
    if (req.fields.id) {
      const box = await Box.findById(req.fields.id);
      const pictureToUpload = req.files.picture.path;

      box.name = req.fields.name;
      await box.save();
      box.picture = await cloudinary.uploader.upload(pictureToUpload, {
        folder: `marvelUnited/box/${box._id}`,
      });

      await box.save();
      res.json(box);
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//route for delete a box
router.delete("/box", async (req, res) => {
  try {
    if (req.fields.id) {
      await Box.findByIdAndDelete(req.fields.id);
      res.json({ message: "Box is deleted" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
