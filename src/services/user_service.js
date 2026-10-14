
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

module.exports = {
    getMyProfile
};
