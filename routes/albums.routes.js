const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Album = require("../models/Album.model");

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
router.post("/create", async (req, res, next) => {
  try {
    const { creator } = req.body;
    const newAlbum = await Album.create(req.body);
    await User.updateOne({ _id: creator._id }, { $push : { ownAlbums: newAlbum } }, { new: true });
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
    const deletedAlbum = await Album.findByIdAndDelete({ _id: albumId });
    await User.findByIdAndUpdate({ _id: deletedAlbum.creator }, { $pull : { ownAlbums: albumId } }, { new: true });
    res.json(deletedAlbum);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;