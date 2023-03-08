const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Album = require("../models/Album.model");

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  }
  catch (err) {
    console.log(err);
  }
});

// Get user details
router.get("/:username", async (req, res, next) => {
  try {
    const username = req.params;
    const userData = await User.findOne(username).populate("ownAlbums")
                                                  .populate({
                                                    path: 'ownAlbums',
                                                    populate: {
                                                      path: 'artworks',
                                                      model: 'Artwork'
                                                    }
                                                  })
                                                  .populate("favCollections")
                                                  .populate({
                                                    path: 'favCollections',
                                                    populate: {
                                                      path: 'artworks',
                                                      model: 'Artwork'
                                                    }
                                                  })
    res.json(userData);
  }
  catch (err) {
    console.log(err);
  }
});

// Upload image
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  res.json({ fileUrl: req.file.path });

});

// Upload multiple images
router.post("/upload-multi", fileUploader.array("imageUrl"), (req, res, next) => {
  if (!req.files) {
    next(new Error("No file uploaded!"));
    return;
  }

  const { files } = req;
  const urls = files.map(file => {
    return file.path;
  })

  res.json({ fileUrls: urls });

});

// Send new information to update user info
router.put("/:username/edit-profile", async (req, res, next) => {
  try {
    const username = req.params;
    const newData = req.body;
    const updatedUser = await User.findOneAndUpdate(username, newData, { new: true });
    res.json(updatedUser);
  }
  catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
});

module.exports = router;