
const mongoose = require("mongoose");
const Hotel = require("../models/hotel_model");

const getHotels = async ({ page = 1, limit = 10, city }) => {
    const filter = {
        isActive: true
    };

    if (city) {
        filter["address.city"] = {
            $regex: city,
            $options: "i"
        };
    }

    const skip = (page - 1) * limit;

    const [hotels, total] = await Promise.all([
        Hotel.find(filter)
            .select("-__v")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Hotel.countDocuments(filter)
    ]);

    return {
        hotels,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getHotelById = async (hotelId) => {
    if (!mongoose.isValidObjectId(hotelId)) {
        const error = new Error("Invalid hotel ID");
        error.statusCode = 400;
        throw error;
    }

    const hotel = await Hotel.findOne({
        _id: hotelId,
        isActive: true
    }).lean();

    if (!hotel) {
        const error = new Error("Hotel not found");
        error.statusCode = 404;
        throw error;
    }

    return hotel;
};

module.exports = {
    getHotels,
    getHotelById
};
