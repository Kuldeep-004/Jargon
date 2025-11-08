import express from "express";
import { forgotPasswordController, loginController, passwordUpdator, signUpController, verifyOtpController } from "../controllers/auth";
import { authLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/signup",authLimiter,signUpController);
router.post("/login",loginController);
router.post("/verify-otp",authLimiter,verifyOtpController);
router.post("/forgot-password",authLimiter,forgotPasswordController);
router.post("/update-password/:token",authLimiter,passwordUpdator);

export default router;