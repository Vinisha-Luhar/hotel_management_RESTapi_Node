
const express = require("express");

const {
  addCartItemController
} = require("../controllers/cart_controller");

const {
  authenticate
} = require("../middlewares/auth_middleware");

const router = express.Router();

router.post(
  "/items",
  authenticate,
  addCartItemController
);

module.exports = router;
