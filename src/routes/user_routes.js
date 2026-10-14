
const express = require("express");
const { authenticate } = require("../middlewares/auth_middleware");
const { getMe, updateMe } = require("../controllers/user_controller");

const {validateUpdateProfile} = require("../validators/user_validator");

const router = express.Router();


router.get("/me", authenticate, getMe);
router.patch("/me",authenticate,validateUpdateProfile, updateMe);

module.exports = router;
