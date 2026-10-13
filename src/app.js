
const express = require("express");
const authRoutes = require("./routes/auth_routes.js");

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

module.exports = app;
