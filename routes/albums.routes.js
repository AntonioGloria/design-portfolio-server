const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Album = require("../models/Album.model");
const Artwork = require("../models/Artwork.model");

// Get all albums
router.get("/", async (req, res, next) => {
  try {
    const allAlbums = await Album.find().populate("artworks");
    res.json(allAlbums);
  }
  catch (err) {
    next(err);
  }
});

// Get specific album
router.get("/:albumId", async (req, res, next) => {
  const { albumId } = req.params;

  try {
    const albumData = await Album.findOne({ _id: albumId }).populate("artworks");
    res.json(albumData);
  }
  catch (err) {
    next(err);
  }
});

// Create own album
router.post("/create", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payload;

  try {
    const newAlbum = await Album.create({ creator: _id, ...req.body });
    res.json(newAlbum);
  }
  catch (err) {
    next(err);
  }
});

// Rename album
router.patch("/:albumId/rename", async (req, res, next) => {
  const { albumId } = req.params;
  const { title } = req.body;

  try {
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, { title }, { new: true });
    res.json(updatedAlbum);
  }
  catch (err) {
    next(err);
  }
});

// Delete album
router.delete("/:albumId/delete", async (req, res, next) => {
  const { albumId } = req.params;
  try {
    await Artwork.updateMany(
      { albums: albumId },
      { $pull: { albums: albumId } },
      { new: true }
    );

    const deletedAlbum = await Album.findByIdAndDelete({ _id: albumId });
    res.json(deletedAlbum);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;