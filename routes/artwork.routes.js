const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");


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
    const userData = await User.findOne(username).populate("ownAlbums").populate("favCollections");
    res.json(userData);
  }
  catch (err) {
    console.log(err);
  }
});

// Get form to edit user
router.get("/:username/edit-profile", async (req, res, next) => {
  try {
    const username = req.params;
    const userData = await User.findOne(username)
    res.json(userData);
  }
  catch (err) {
    console.log(err);
  }
});

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


module.exports = router;