const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { get } = require("lodash");

const Location = require("../models/Locations");
const Box = require("../models/Box");

//route for read all locations
router.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//route for add a location
router.post("/locations", async (req, res) => {
  try {
    const pictureToUpload = req.files.picture.path;

    if (!req.fields.name || !req.fields.box_id || !pictureToUpload) {
      res.json({ message: "Parameters name, box or picture is missing" });
    } else {
      const newLocation = new Location({
        name: req.fields.name,
        box: req.fields.box_id,
      });

      await newLocation.save();

      newLocation.picture = await cloudinary.uploader.upload(pictureToUpload, {
        folder: `marvelUnited/locations/${newLocation.name}`,
      });
      await newLocation.save();
      const box = await Box.findById(req.fields.box_id).populate();

      res.json({
        id: newLocation._id,
        name: newLocation.name,
        box: box.name,
        picture: newLocation.picture.url,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//route for update a location
router.put("/location", async (req, res) => {
  try {
    if (req.fields.id) {
      const location = await Location.findById(req.fields.id);

      location.name = req.fields.name;
      location.box = req.fields.box_id;

      await location.save();
      const pictureToUpload = get(req, "files.picture.path", null);
      if (pictureToUpload) {
        location.picture = await cloudinary.uploader.upload(pictureToUpload, {
          folder: `marvelUnited/locations/${location.name}`,
        });
      }

      await location.save();
      res.json(location);
    } else {
      res.json({ message: "Id is missing" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//route for delete a location
router.delete("/location", async (req, res) => {
  try {
    if (req.fields.id) {
      await Location.findByIdAndDelete(req.fields.id);
      res.json({ message: "Location is deleted" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
