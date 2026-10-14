
const validateUpdateProfile = (req, res, next) => {
    const { name, phone, profileImage } = req.body;

    const allowedFields = ["name", "phone", "profileImage"];

    // Reject fields that users are not allowed to update
    const invalidFields = Object.keys(req.body).filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "You cannot update these fields",
            fields: invalidFields
        });
    }

    // Require at least one field to update
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required"
        });
    }

    if (Object.hasOwn(req.body, "name")) {
        if (
            typeof name !== "string" ||
            name.trim().length < 2 ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 100 characters"
            });
        }
    }

    if (Object.hasOwn(req.body, "phone")) {
        if (
            phone !== null &&
            (
                typeof phone !== "string" ||
                !/^\+?[0-9\s()-]{7,20}$/.test(phone.trim())
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid phone number"
            });
        }
    }

    if (Object.hasOwn(req.body, "profileImage")) {
        if (
            profileImage !== null &&
            (
                typeof profileImage !== "string" ||
                profileImage.trim().length === 0 ||
                profileImage.length > 2048
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid profile image URL"
            });
        }
    }

    next();
};

module.exports = {
    validateUpdateProfile
};
