const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork.model");

// Get all artwork
router.get("/", async (req, res, next) => {
  try {
    const allArtwork = await Artwork.find();
    res.json(allArtwork);
  }
  catch (err) {
    console.log(err);
  }
});

// Get specific artwork
router.get("/:artwork", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const artData = await Artwork.findOne(_id).populate("author").populate("assets");
    res.json(artData);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;