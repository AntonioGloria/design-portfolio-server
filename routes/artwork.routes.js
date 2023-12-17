const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork.model");
const Album = require("../models/Album.model");

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
    const artData = await Artwork.findOne({ _id }).populate("creator").populate("assets");
    res.json(artData);
  }
  catch (err) {
    console.log(err);
  }
});

// POST Create artwork
router.post("/create", async (req, res, next) => {
  try {
    const { albums } = req.body;
    const createdArt = await Artwork.create(req.body);

    await Album.updateMany({ _id: albums }, { $push : { artworks:createdArt } }, { new: true });
    res.json(createdArt);
  }
  catch (err) {
    console.log(err);
  }
});

// PATCH Edit artwork
router.patch("/:artworkId/edit", async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    await Artwork.findByIdAndUpdate(artworkId, req.body);
    res.json("Artwork edited successfully");
  }
  catch (err) {
    console.log(err);
  }
});

// DELETE artwork
router.delete("/:_id/delete", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const deletedProject = await Artwork.findByIdAndDelete({ _id });
    res.json(deletedProject);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;