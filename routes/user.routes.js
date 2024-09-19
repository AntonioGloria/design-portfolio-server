const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Album = require("../models/Album.model");
const Artwork = require("../models/Artwork.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  }
  catch (err) {
    next(err);
  }
});

// Get user details
router.get("/:username", async (req, res, next) => {
  const { username } = req.params;
  try {
    const userData = await User.findOne({ username }).select({ password: 0 });
    res.json(userData);
  }
  catch (err) {
    next(err);
  }
});

// Send new information to update user info
router.put("/edit-profile", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true });
    res.json(updatedUser);
  }
  catch (err) {
    next(err);
  }
});

// Get user's albums or favorites
router.get("/:username/albums/:albumType/", async (req, res, next) => {
  const { username, albumType } = req.params;
  try {
    const userData = await User.findOne({ username }).select({ _id: 1});
    const userAlbums = await Album.find({ creator: userData._id, albumType })
    .populate("artworks")
    .sort({ createdAt: -1 });
    res.json(userAlbums);
  }
  catch (err) {
    next(err);
  }
});

// Get all artworks that belong to user
router.get("/:username/artworks/", async (req, res, next) => {
  const { username } = req.params;
  try {
    const userData = await User.findOne({ username }).select({ _id: 1});
    const userArtworks = await Artwork.find({ creator: userData._id })
    .sort({ createdAt: -1 });
    res.json(userArtworks);
  }
  catch (err) {
    next(err);
  }
});

// Get all favorites added by user
router.get("/:username/favorites/", async (req, res, next) => {
  const { username } = req.params;
  try {
    const userData = await User.findOne({ username }).select({ _id: 1});
    const userFavorites = await Artwork.find({ likes: userData._id })
    .sort({ createdAt: -1 });
    res.json(userFavorites);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;