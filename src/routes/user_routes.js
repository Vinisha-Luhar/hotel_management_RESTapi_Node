
const express = require("express");
const { authenticate } = require("../middlewares/auth_middleware");

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authenticated user fetched successfully",
        data: {
            userId: req.user.id,
            role: req.user.role
        }
    });
});

module.exports = router;
