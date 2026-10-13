
const express = require("express");

const { register } = require("../controllers/auth_controller");
const { validateRegister } = require("../validators/auth_validator");

const router = express.Router();

router.post("/register", validateRegister, register);

module.exports = router;
