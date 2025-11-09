import type { Request, Response } from "express";
import User from "../models/User";
import { z } from "zod";
import { generateOTP, setOtpUser, verifyOtp } from "../utils/otp";
import { sendMail } from "../utils/mailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  otp: z.number().optional(),
});

export const signUpController = async (req: Request, res: Response) => {
  try {
    const parsed = signUpSchema.safeParse(req.body);

    if (!parsed.success)
      return res.status(400).json({ success: false, msg: "Enter proper data" });

    const { email, password } = parsed.data || {};

    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });

    const newUser = await User.create({ email, password });
    await newUser.save();

    const otp = generateOTP(6);
    await setOtpUser(newUser, otp, 300);
    await sendMail(newUser.email, `Sign Up With OTP ${otp}`);
    return res.status(200).json({ success: true, msg: "Email sent" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (verifyOtp(user, otp)) {
      user.isVerified = true;
      user.otp = undefined;
      await user.save();
      return res.status(200).json({ success: true, msg: "Otp verified" });
    }

    return res
      .status(400)
      .json({ success: false, msg: "otp verification failed" });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "internal server Error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const parsedData = signUpSchema.safeParse(req.body);

    if (!parsedData.success)
      return res
        .status(400)
        .json({ success: false, msg: "Login Data invalid" });

    const { email, password } = parsedData.data;

    const existingUser = await User.findOne({ email });

    if (existingUser.lockUntil && existingUser.lockUntil > Date.now())
      return res
        .status(200)
        .json({ success: false, msg: "User is locked try again in 30 mins" });

    if (!existingUser)
      return res
        .status(400)
        .json({ success: false, msg: "User does not exist" });

    if (!existingUser.isVerified)
      return res.status(400).json({ success: false, msg: "not verified" });

    if (!existingUser.comparePassword(password)) {
      existingUser.failedLoginAttempts++;
      if (existingUser.failedLoginAttempts > 5) {
        existingUser.lockUntil = new Date(Date.now() + 30000000);
        existingUser.failedLoginAttempts = 0;
      }
      await existingUser.save();
      return res
        .status(400)
        .json({ success: false, msg: "User login attempt limit reached" });
    }

    existingUser.failedLoginAttempts = 0;
    existingUser.lockUntil = undefined;

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET || "",
      { expiresIn: "30s" }
    );

    return res.status(200).json({
      success: true,
      token,
      msg: "Login Successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "login failed" });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "user does not exists" });

    const token = crypto.randomBytes(10);

    user.token = token;
    user.tokenExpiresIn = new Date(Date.now() + 30000000);

    await user.save();

    const url = `http://localhost:3000/update-password/${token}`;

    await sendMail(user.email, `OTP for forgot Password ${url}`);

    return res
      .status(200)
      .json({ success: true, msg: "Reset Password Link Sent Successfully" });
  } catch (Err) {
    return res
      .status(500)
      .json({
        success: false,
        msg: "Internal server error while forgoting password",
      });
  }
};

export const passwordUpdator = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const { token } = req.params;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ success: false, msg: "user not found" });

    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, msg: "Password Does Not Match" });

    if (token != user.token || new Date() > user.tokenExpiresIn)
      return res
        .status(400)
        .json({ success: false, msg: "token expired try again later" });

    user.token = undefined;
    user.tokenExpiresIn = undefined;
    user.password = password;

    await user.save();
    return res
      .status(200)
      .json({ success: true, msg: "Password Reset Successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        msg: "Internal server error while updating password",
      });
  }
};
