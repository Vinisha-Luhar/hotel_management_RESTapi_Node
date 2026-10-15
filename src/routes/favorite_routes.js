
const express = require("express");

const {
  addFavoriteController, getMyFavoritesController
} = require("../controllers/favorite_controller");

const {
  authenticate
} = require("../middlewares/auth_middleware");

const router = express.Router();

router.post("/:hotelId",authenticate,addFavoriteController);
router.get("/", authenticate, getMyFavoritesController);

module.exports = router;
