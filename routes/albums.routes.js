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
    console.log(err);
  }
});

// Get specific album
router.get("/:album", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const albumData = await Album.findOne(_id).populate("artworks");
    res.json(albumData);
  }
  catch (err) {
    console.log(err);
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
    console.log(err);
  }
});

// Delete album
router.delete("/:_id/delete", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const deletedAlbum = await Album.findByIdAndDelete({ _id });
    await User.findByIdAndUpdate({ _id: deletedAlbum.creator }, { $pull : { ownAlbums: _id } }, { new: true });
    res.json(deletedAlbum);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;