
const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Room type name is required"],
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        pricePerNight: {
            type: Number,
            required: [true, "Room price is required"],
            min: [0, "Room price cannot be negative"]
        },

        maxGuests: {
            type: Number,
            required: [true, "Maximum guests is required"],
            min: [1, "A room must accommodate at least one guest"],
            validate: {
                validator: Number.isInteger,
                message: "Maximum guests must be a whole number"
            }
        },

        totalRooms: {
            type: Number,
            required: [true, "Total rooms is required"],
            min: [0, "Total rooms cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Total rooms must be a whole number"
            }
        }
    },
    {
        _id: true
    }
);

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Hotel name is required"],
            trim: true,
            minlength: 2,
            maxlength: 150
        },

        description: {
            type: String,
            required: [true, "Hotel description is required"],
            trim: true,
            maxlength: 2000
        },

        address: {
            street: {
                type: String,
                trim: true,
                default: ""
            },

            city: {
                type: String,
                required: [true, "City is required"],
                trim: true
            },

            state: {
                type: String,
                required: [true, "State is required"],
                trim: true
            },

            country: {
                type: String,
                required: [true, "Country is required"],
                trim: true
            },

            postalCode: {
                type: String,
                trim: true,
                default: ""
            }
        },

        images: {
            type: [String],
            default: []
        },

        amenities: {
            type: [String],
            default: []
        },

        roomTypes: {
            type: [roomTypeSchema],
            validate: {
                validator: (rooms) => rooms.length > 0,
                message: "A hotel must have at least one room type"
            }
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

hotelSchema.index({
    "address.city": 1,
    isActive: 1
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
