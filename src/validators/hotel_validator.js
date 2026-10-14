
const validateCreateHotel = (req, res, next) => {
    const {
        name,
        description,
        address,
        images,
        amenities,
        roomTypes
    } = req.body;

    const errors = [];

    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 150
    ) {
        errors.push("Hotel name must be between 2 and 150 characters");
    }

    if (
        typeof description !== "string" ||
        description.trim().length === 0
    ) {
        errors.push("Hotel description is required");
    }

    const addressFields = [
        "street",
        "city",
        "state",
        "country",
        "postalCode"
    ];

    if (
        !address ||
        typeof address !== "object" ||
        Array.isArray(address) ||
        addressFields.some(
            (field) =>
                typeof address[field] !== "string" ||
                address[field].trim().length === 0
        ) ||
        Object.keys(address || {}).some(
            (field) => !addressFields.includes(field)
        )
    ) {
        errors.push("All valid address fields are required");
    }

    if (
        images !== undefined &&
        (!Array.isArray(images) ||
            !images.every((image) => typeof image === "string"))
    ) {
        errors.push("Images must be an array of strings");
    }

    if (
        amenities !== undefined &&
        (!Array.isArray(amenities) ||
            !amenities.every((item) => typeof item === "string"))
    ) {
        errors.push("Amenities must be an array of strings");
    }

    if (!Array.isArray(roomTypes) || roomTypes.length === 0) {
        errors.push("At least one room type is required");
    } else {
        roomTypes.forEach((room, index) => {
            if (
                !room ||
                typeof room.name !== "string" ||
                room.name.trim().length === 0
            ) {
                errors.push(`Room type ${index + 1}: name is required`);
            }

            if (
                !Number.isFinite(room.pricePerNight) ||
                room.pricePerNight < 0
            ) {
                errors.push(`Room type ${index + 1}: price must be non-negative`);
            }

            if (
                !Number.isInteger(room.maxGuests) ||
                room.maxGuests < 1
            ) {
                errors.push(`Room type ${index + 1}: maxGuests must be a positive integer`);
            }

            if (
                !Number.isInteger(room.totalRooms) ||
                room.totalRooms < 0
            ) {
                errors.push(`Room type ${index + 1}: totalRooms must be a non-negative integer`);
            }

            if (
                room.amenities !== undefined &&
                (!Array.isArray(room.amenities) ||
                    !room.amenities.every(
                        (item) => typeof item === "string"
                    ))
            ) {
                errors.push(`Room type ${index + 1}: amenities must be an array of strings`);
            }

            if (
                room.description !== undefined &&
                typeof room.description !== "string"
            ) {
                errors.push(`Room type ${index + 1}: description must be a string`);
            }

            const allowedRoomFields = [
                "name",
                "description",
                "pricePerNight",
                "maxGuests",
                "totalRooms",
                "amenities"
            ];

            if (
                Object.keys(room).some(
                    (field) => !allowedRoomFields.includes(field)
                )
            ) {
                errors.push(`Room type ${index + 1}: contains unsupported fields`);
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    next();
};

module.exports = {
    validateCreateHotel
};
