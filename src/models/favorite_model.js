
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        },

        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: [true, "Hotel ID is required"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Prevent the same user from favoriting
// the same hotel more than once.
favoriteSchema.index(
    { userId: 1, hotelId: 1 },
    { unique: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
