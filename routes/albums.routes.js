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
    const { owner } = req.body;
    const newAlbum = await Album.create(req.body);
    await User.updateOne({ _id: owner._id }, { $push : { ownAlbums: newAlbum } }, { new: true });
    res.json(newAlbum);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;