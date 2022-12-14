const { Schema, model } = require("mongoose");

const albumSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    artworks: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Album = model("Album", albumSchema);

module.exports = Album;