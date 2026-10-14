
const express = require("express");

const {
    listHotels,
    getHotel
} = require("../controllers/hotel_controller");

const router = express.Router();

router.get("/", listHotels);
router.get("/:hotelId", getHotel);

module.exports = router;
