
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Prevent the same user from favoriting the same hotel twice.
favoriteSchema.index(
  { userId: 1, hotelId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
