
const express = require("express");

const { register, login } = require("../controllers/auth_controller");
const { validateRegister, validateLogin } = require("../validators/auth_validator");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

module.exports = router;
