
const bcrypt = require("bcryptjs");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    };
};


// Add this function alongside your existing registerUser function.
const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // passwordHash has select: false in our User schema,
    // so explicitly request it for password verification.
    const user = await User.findOne({
        email: normalizedEmail
    }).select("+passwordHash");

    // Use the same message for both cases so we don't
    // reveal whether an email address is registered.
    if (!user || !user.isActive) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordCorrect) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
            algorithm: "HS256"
        }
    );

    return {
        accessToken: token,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = { registerUser, loginUser };
