const router = require("express").Router();

const validate = require(
  "../middlewares/validate"
);

const {
  loginSchema
} = require("../schemas/loginSchema");

const {
  signupSchema
} = require("../schemas/signupSchema");

const {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
} = require("../controllers/authController");

router.post(
  "/signup",
  validate(signupSchema),
  signup
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;