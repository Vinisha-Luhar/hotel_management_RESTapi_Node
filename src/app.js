
const express = require("express");
const authRoutes = require("./routes/auth_routes.js");
const userRoutes = require("./routes/user_routes");
const hotelRoutes = require("./routes/hotel_routes");

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());

// Health-check endpoint.
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hotel Booking API is running"
    });
});

// Authentication routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/hotels", hotelRoutes);

module.exports = app;
