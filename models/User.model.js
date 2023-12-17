const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
    },
    tagline: {
      type: String,
      default: "Jutsu Creator"
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dwhznw5ny/image/upload/v1702842619/design-portfolio/ui-defaults/defaultAvatar_crbk2x.png"
    },
    coverImg: {
      type: String,
      default: "https://res.cloudinary.com/dwhznw5ny/image/upload/v1702842623/design-portfolio/ui-defaults/defaultCover_e9xpho.png"
    },
    bio: {
      type: String
    },
    ownArtworks: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
    ownAlbums: [{type: Schema.Types.ObjectId, ref: 'Album'}],
    favArtworks: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
    favCollections: [{type: Schema.Types.ObjectId, ref: 'Album'}],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
