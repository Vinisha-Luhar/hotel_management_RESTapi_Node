
const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        pricePerNight: {
            type: Number,
            required: true,
            min: 0
        },
        maxGuests: {
            type: Number,
            required: true,
            min: 1
        },
        totalRooms: {
            type: Number,
            required: true,
            min: 0
        },
        amenities: {
            type: [String],
            default: []
        }
    },
    { _id: true }
);

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            street: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            country: { type: String, required: true, trim: true },
            postalCode: { type: String, required: true, trim: true }
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
            default: []
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

module.exports = mongoose.model("Hotel", hotelSchema);
