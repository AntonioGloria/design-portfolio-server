const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork.model");
const Album = require("../models/Album.model");
const { isAuthenticated } = require("../middleware/jwt.middleware")

// Get all artwork, or filter by category and medium
router.get("/", async (req, res, next) => {
  try {
    const { category, medium } = req.query;
    const artData = await Artwork.find({
      ...(category && {category: category}),
      ...(medium && {medium: medium})
    });
    res.json(artData);
  }
  catch (err) {
    console.log(err);
  }
});

// Get specific artwork
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const artData = await Artwork.findOne({ _id }).populate("creator").populate("assets");
    res.json(artData);
  }
  catch (err) {
    console.log(err);
  }
});

// POST Create artwork
router.post("/create", isAuthenticated, async (req, res, next) => {
  try {
    const { albums } = req.body;
    const { _id } = req.payload;

    const createdArt = await Artwork.create({ ...req.body, creator:_id });
    await Album.updateMany({ _id: { $in: albums } }, { $push : { artworks:createdArt } }, { new: true });
    res.json(createdArt);
  }
  catch (err) {
    next(err);
  }
});

// PATCH Edit artwork
router.patch("/:artworkId/edit", isAuthenticated, async (req, res, next) => {
  const { artworkId } = req.params;
  const { albums } = req.body;

  try {
    const oldArtwork = await Artwork.findById(artworkId);

    // Find albums in req.body that aren't in DB document and add artwork to them
    const albumsToAdd = albums.filter((album => {
      return !oldArtwork.albums.includes(album);
    }));

    if (albumsToAdd.length > 0) {
      await Album.updateMany({ _id: { $in: albumsToAdd } }, { $addToSet: { artworks: artworkId } });
    }

    // Find albums in DB document that aren't in req.body and remove artwork from them
    const albumsToRemove = oldArtwork.albums.filter((album => {
      return !albums.includes(album.toString());
    }));

    if (albumsToRemove.length > 0) {
      await Album.updateMany({ _id: { $in: albumsToRemove } }, { $pull: { artworks: artworkId } });
    }

    const editedArt = await Artwork.findByIdAndUpdate(artworkId, req.body, { new : true });
    res.json(editedArt);
  }

  catch (err) {
    next(err);
  }
});

// DELETE artwork
router.delete("/:_id/delete", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const deletedProject = await Artwork.findByIdAndDelete({ _id });
    res.json(deletedProject);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;