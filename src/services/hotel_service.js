
const mongoose = require("mongoose");
const Hotel = require("../models/hotel_model");


const getHotels = async ({
    page = 1,
    limit = 10,
    city,
    minPrice,
    maxPrice,
    sort = "newest"
}) => {
    const filter = {
        isActive: true
    };

    if (city) {
        filter["address.city"] = {
            $regex: city,
            $options: "i"
        };
    }

    // Calculate each hotel's lowest room price.
    const pipeline = [
        { $match: filter },
        {
            $addFields: {
                lowestRoomPrice: {
                    $min: "$roomTypes.pricePerNight"
                }
            }
        }
    ];

    // Filter using the lowest room price.
    const priceFilter = {};

    if (minPrice !== undefined) {
        priceFilter.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
        priceFilter.$lte = maxPrice;
    }

    if (Object.keys(priceFilter).length > 0) {
        pipeline.push({
            $match: {
                lowestRoomPrice: priceFilter
            }
        });
    }

    // Apply sorting.
    const sortOptions = {
        newest: { createdAt: -1 },
        price_asc: { lowestRoomPrice: 1 },
        price_desc: { lowestRoomPrice: -1 }
    };

    pipeline.push({
        $sort: {
            ...sortOptions[sort],
            _id: 1
        }
    });

    // Fetch paginated results and total count together.
    const [result] = await Hotel.aggregate([
        ...pipeline,
        {
            $facet: {
                hotels: [
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    {
                        $project: {
                            name: 1,
                            description: 1,
                            address: 1,
                            images: 1,
                            amenities: 1,
                            roomTypes: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            lowestRoomPrice: 1
                        }
                    }
                ],
                metadata: [
                    { $count: "total" }
                ]
            }
        }
    ]);

    const total = result.metadata[0]?.total || 0;

    return {
        hotels: result.hotels,
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


const createHotel = async (hotelData) => {
    const hotel = await Hotel.create({
        name: hotelData.name,
        description: hotelData.description,
        address: {
            street: hotelData.address.street,
            city: hotelData.address.city,
            state: hotelData.address.state,
            country: hotelData.address.country,
            postalCode: hotelData.address.postalCode
        },
        images: hotelData.images || [],
        amenities: hotelData.amenities || [],
        roomTypes: hotelData.roomTypes || []
    });

    return hotel;
};


module.exports = {
    getHotels,
    getHotelById,
    createHotel
};
