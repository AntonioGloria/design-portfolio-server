const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork.model");
const Album = require("../models/Album.model");
//const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

// Get all artwork
router.get("/", async (req, res, next) => {
  try {
    const allArtwork = await Artwork.find();
    res.json(allArtwork);
  }
  catch (err) {
    console.log(err);
  }
});

// Get specific artwork
router.get("/:artwork", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const artData = await Artwork.findOne(_id);
    res.json(artData);
  }
  catch (err) {
    console.log(err);
  }
});

/*
// Upload image
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  res.json({ fileUrl: req.file.path });

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
*/

module.exports = router;