const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Upload image
router.post("/upload", fileUploader.single("imageUrl"), async (req, res, next) => {
  try {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    res.json({ fileUrl: req.file.path });
  }

  catch (err) {
    console.log(err);
  }
});

// Upload multiple images
router.post("/upload-multi", fileUploader.array("imageUrl"), async (req, res, next) => {
  try {
    if (!req.files) {
      next(new Error("No file uploaded!"));
      return;
    }
    const { files } = req;
    const urls = files.map(file => {
      return file.path;
    });

    res.json({ fileUrls: urls });
  }
  catch (err) {
    console.log(err);
  }
});

// Delete multiple images
router.put("/delete-multi/", async (req, res, next) => {
  try {
    const { api } = fileUploader.storage.cloudinary;
    const { folder } = fileUploader.storage.params;
    const imgUrls = req.body;

    const publicIds = imgUrls.map(imgUrl => {
      // public_id: "folder_name/file_name" WITHOUT file extension
      return `${folder}/${imgUrl.split("/").pop().split(".")[0]}`;
    });

    const deletedFiles = await api.delete_resources(publicIds);
    res.json(deletedFiles);
  }

  catch (err) {
    console.log(err);
  }
});

module.exports = router;