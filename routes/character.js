const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const Character = require("../models/Character");
const Box = require("../models/Box");
const { get } = require("lodash");

//route for read all characters
router.get("/characters", async (req, res) => {
  const characters = await Character.find();
  res.json(characters);
});

//route for create a character
router.post("/character", async (req, res) => {
  try {
    const pictureToUpload = req.files.picture.path;
    if (
      !req.fields.name ||
      !req.fields.type ||
      !req.fields.box_id ||
      !pictureToUpload
    ) {
      res.status(400).json({ message: "Missing parameter" });
    } else {
      const newCharacter = new Character({
        name: req.fields.name,
        type: req.fields.type,
        box: req.fields.box_id,
      });

      await newCharacter.save();

      newCharacter.picture = await cloudinary.uploader.upload(pictureToUpload, {
        folder: `marvelUnited/characters/${newCharacter._id}/`,
      });
      await newCharacter.save();

      const box = await Box.findById(req.fields.box_id).populate();

      res.json({
        id: newCharacter._id,
        name: newCharacter.name,
        box: box.name,
        picture: newCharacter.picture.url,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//route for update a character
router.put("/character/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const character = await Character.findById(req.params.id);
      character.name = req.fields.name;
      character.box = req.fields.box_id;
      character.type = req.fields.type;

      await character.save();

      const pictureToUpload = get(req, "files.picture.path", null);
      if (pictureToUpload) {
        character.picture = await cloudinary.uploader.upload(pictureToUpload, {
          folder: `marvelUnited/characters/${character._id}/`,
        });
        await character.save();
      }

      res.json(character);
    } else {
      res.status(400).json({ message: "Id is missing" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//route for delete a character
router.delete("/character", async (req, res) => {
  try {
    if (req.fields.id) {
      const character = await Character.findByIdAndDelete(req.fields.id);
      res.json({ message: "Character deleted" });
    } else {
      res.json({ message: "Id is missing" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//route for have informations for one character by his Id
router.get("/character/:id", async (req, res) => {
  try {
    if (!req.query.id) {
      res.status(400).json({ message: "Id is missing" });
    } else {
      const character = await Character.findById(req.query.id);
      res.json(character);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
