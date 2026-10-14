
const {
    getHotels,
    getHotelById,
    createHotel
} = require("../services/hotel_service");


const listHotels = async (req, res) => {
    try {
        const { page = "1", limit = "10", city, sort = "newest" } =
            req.query;

        const minPrice =
            req.query.minPrice === undefined
                ? undefined
                : Number(req.query.minPrice);

        const maxPrice =
            req.query.maxPrice === undefined
                ? undefined
                : Number(req.query.maxPrice);

        const parsedPage = Number(page);
        const parsedLimit = Number(limit);

        if (
            !Number.isSafeInteger(parsedPage) ||
            parsedPage < 1 ||
            !Number.isSafeInteger(parsedLimit) ||
            parsedLimit < 1 ||
            parsedLimit > 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be positive and limit must be between 1 and 50"
            });
        }

        if (
            minPrice !== undefined &&
            (!Number.isFinite(minPrice) || minPrice < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "minPrice must be a non-negative number"
            });
        }

        if (
            maxPrice !== undefined &&
            (!Number.isFinite(maxPrice) || maxPrice < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "maxPrice must be a non-negative number"
            });
        }

        if (
            minPrice !== undefined &&
            maxPrice !== undefined &&
            minPrice > maxPrice
        ) {
            return res.status(400).json({
                success: false,
                message: "minPrice cannot exceed maxPrice"
            });
        }

        if (
            city !== undefined &&
            (typeof city !== "string" || city.trim().length === 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "City must be a non-empty string"
            });
        }

        const allowedSortValues = [
            "newest",
            "price_asc",
            "price_desc"
        ];

        if (!allowedSortValues.includes(sort)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort value"
            });
        }

        const result = await getHotels({
            page: parsedPage,
            limit: parsedLimit,
            city: city?.trim(),
            minPrice,
            maxPrice,
            sort
        });

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("List hotels error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const getHotel = async (req, res) => {
    try {
        const hotel = await getHotelById(req.params.hotelId);

        return res.status(200).json({
            success: true,
            data: { hotel }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : "Internal server error"
        });
    }
};


const createHotelController = async (req, res) => {
    try {
        const hotel = await createHotel(req.body);

        return res.status(201).json({
            success: true,
            message: "Hotel created successfully",
            data: { hotel }
        });
    } catch (error) {
        console.error("Create hotel error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    listHotels,
    getHotel,
    createHotelController
};
