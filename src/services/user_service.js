
const User = require("../models/user_model");

const getMyProfile = async (userId) => {
    const user = await User.findById(userId);

    console.log("Requested user ID:", userId);
    console.log("User found:", Boolean(user));
    console.log("User active:", user?.isActive);

    if (!user || !user.isActive) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const updateMyProfile = async (userId, updates) => {
    const allowedFields = ["name", "phone", "profileImage"];
    const safeUpdates = {};

    // Copy only fields that are allowed to be updated
    for (const field of allowedFields) {
        if (Object.hasOwn(updates, field)) {
            safeUpdates[field] =
                typeof updates[field] === "string"
                    ? updates[field].trim()
                    : updates[field];
        }
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId,
            isActive: true
        },
        {
            $set: safeUpdates
        },
        {
            new: true,
            runValidators: true
        }
    ).select(
        "name email phone profileImage role createdAt updatedAt"
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};


module.exports = {
    getMyProfile,
    updateMyProfile
};
