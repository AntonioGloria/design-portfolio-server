const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dwhznw5ny/image/upload/v1670880806/design-portfolio/ui-defaults/defaultAvatar_i3bmyp.png"
    },
    ownArtworks: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
    ownAlbums: [{type: Schema.Types.ObjectId, ref: 'Album'}],
    likedArtworks: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
    likedCollections: [{type: Schema.Types.ObjectId, ref: 'Album'}],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
