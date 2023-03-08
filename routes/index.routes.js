const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");

router.get("/", (req, res, next) => {
  res.json("All good in here");
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
  });

  res.json({ fileUrls: urls });
});

module.exports = router;