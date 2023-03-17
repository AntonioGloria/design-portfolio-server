const { Schema, model } = require("mongoose");

const albumSchema = new Schema(
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
    thumbnail: {
      type: String,
      default: "https://res.cloudinary.com/dwhznw5ny/image/upload/v1671209665/design-portfolio/ui-defaults/defaultAlbum_qgieye.png"
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