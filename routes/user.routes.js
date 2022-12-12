const express = require("express");
const router = express.Router();

const User = require("../models/User.model");


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
    const userData = await User.findOne(username);
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
    const userData = await User.findOne(username);
    res.json(userData);
  }
  catch (err) {
    console.log(err);
  }
});


module.exports = router;