
const express = require("express");

const {
    listHotels,
    getHotel,
    createHotelController
} = require("../controllers/hotel_controller");

const { authenticate } = require("../middlewares/auth_middleware");
const { authorizeAdmin } = require("../middlewares/authorize_middleware");
const { validateCreateHotel } = require("../validators/hotel_validator");

const router = express.Router();

router.get("/", listHotels);
router.get("/:hotelId", getHotel);
router.post(
    "/",
    authenticate,
    authorizeAdmin,
    validateCreateHotel,
    createHotelController
);

module.exports = router;
