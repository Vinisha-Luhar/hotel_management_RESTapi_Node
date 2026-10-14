
const express = require("express");
const { authenticate } = require("../middlewares/auth_middleware");
const { getMe } = require("../controllers/user_controller");

const router = express.Router();


router.get("/me", authenticate, getMe);

module.exports = router;
