const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork.model");

// Get all artwork, or filter by category and medium
router.get("/", async (req, res, next) => {
  try {
    const { category, medium } = req.query;
    const artData = await Artwork.find({
      ...(category && {category: category}),
      ...(medium && {medium: medium})
    });
    res.json(artData);
  }
  catch (err) {
    console.log(err);
  }
});

// Get specific artwork
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const artData = await Artwork.findOne({ _id }).populate("author").populate("assets");
    res.json(artData);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;