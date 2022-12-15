const express = require("express");
const router = express.Router();
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

module.exports = router;