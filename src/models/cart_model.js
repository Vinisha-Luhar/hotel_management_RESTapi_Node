
const mongoose = require("mongoose");

// Each item represents one hotel-room selection.
const cartItemSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: [true, "Hotel ID is required"]
        },

        roomTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Room type ID is required"]
        },

        checkIn: {
            type: Date,
            required: [true, "Check-in date is required"]
        },

        checkOut: {
            type: Date,
            required: [true, "Check-out date is required"],
            validate: {
                validator: function (value) {
                    return value > this.checkIn;
                },
                message: "Check-out must be after check-in"
            }
        },

        adults: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
            validate: {
                validator: Number.isInteger,
                message: "Adults must be a whole number"
            }
        },

        children: {
            type: Number,
            min: 0,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: "Children must be a whole number"
            }
        },

        rooms: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
            validate: {
                validator: Number.isInteger,
                message: "Rooms must be a whole number"
            }
        }
    },
    {
        timestamps: true
    }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true
        },

        items: {
            type: [cartItemSchema],
            default: []
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
