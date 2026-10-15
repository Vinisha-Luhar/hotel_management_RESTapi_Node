
const express = require("express");

const {
  addFavoriteController, 
  getMyFavoritesController,
  removeFavoriteController
} = require("../controllers/favorite_controller");

const {
  authenticate
} = require("../middlewares/auth_middleware");

const router = express.Router();

router.post("/:hotelId",authenticate,addFavoriteController);
router.get("/", authenticate, getMyFavoritesController);
router.delete("/:hotelId",authenticate,removeFavoriteController);

module.exports = router;
