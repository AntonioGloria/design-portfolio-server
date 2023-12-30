const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Album = require("../models/Album.model");
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
  const username = req.params;

  const ownAlbumsPopulate = {
    path: 'ownAlbums',
    populate: { path: 'artworks' }
  };

  const favoritesPopulate = {
    path: 'favCollections',
    populate: { path: 'artworks' }
  };

  try {
    const userData = await User
      .findOne(username)
      .populate(ownAlbumsPopulate)
      .populate(favoritesPopulate);

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

// Get user's albums
router.get("/:username/albums/", async (req, res, next) => {
  try {
    const { username } = req.params;
    const userInfo = await User.find({ username }, "ownAlbums").populate("ownAlbums");
    res.json(userInfo);
  }
  catch (err) {
    next(err);
  }
});

// Get artworks in user's specific album
router.get("/:username/albums/:album", async (req, res, next) => {
  try {
    const { album } = req.params;
    const userAlbumArt = await Album.findOne({ _id: album }, "artworks").populate("artworks");
    res.json(userAlbumArt);
  }
  catch (err) {
    next(err);
  }
});

// Create album
router.post("/:username/create-album", async (req, res, next) => {
  try {
    const { username } = req.params;
    const createdAlbum = await Album.create(req.body);
    await User.findOneAndUpdate(username, { $push:{ ownAlbums: createdAlbum } }, { new : true });
    res.json(createdAlbum);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;