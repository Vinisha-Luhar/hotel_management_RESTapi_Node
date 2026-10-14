
const {
    getHotels,
    getHotelById
} = require("../services/hotel_service");

const listHotels = async (req, res) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const city =
            typeof req.query.city === "string"
                ? req.query.city.trim()
                : undefined;

        if (
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be positive and limit must be between 1 and 50"
            });
        }

        const result = await getHotels({ page, limit, city });

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
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

module.exports = {
    listHotels,
    getHotel
};
