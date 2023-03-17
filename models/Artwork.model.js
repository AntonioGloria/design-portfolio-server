const { Schema, model } = require("mongoose");

const artworkSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      enum: ["physicalMedia", "digitalMedia", "photography"]
    },
    medium: {
      type: String,
      enum: [
        "physDrawing",
        "physPainting",
        "physSculpture",
        "digiDrawing",
        "digiPainting",
        "digi3DArt",
        "photoPortrait",
        "photoNature",
        "photoMacro"
      ]
    },
    description: {
      type: String,
      trim: true
    },
    assets: {
      type: [String],
      required: [true, "At least 1 asset is required."]
    },
    albums: [{type: Schema.Types.ObjectId, ref: 'Album'}],
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  },
  {
    timestamps: true,
  }
);

const Artwork = model("Artwork", artworkSchema);

module.exports = Artwork;