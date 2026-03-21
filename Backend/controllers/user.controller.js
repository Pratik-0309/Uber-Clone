import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const isProduction = process.env.NODE_ENV === "production";
const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Couldn't find an account associated with that ID.");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error(
        "Something went wrong while securing your session. Please try again.",
      );
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Token Generation error:", error);
    throw new Error(
      error.message || "An unexpected error occurred during authentication.",
    );
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Your Session has expired. Please log in again.",
        success: false,
      });
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        message: "Account not found. Please register or log in.",
        success: false,
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({
        message: "Session is no longer valid. Please sign in again",
        success: false,
      });
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user._id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Session renewed successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Token Refresh Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating your session.",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;
    const firstName = fullName.firstName;
    const lastName = fullName.lastName;
    if (!firstName || !email || !password) {
      return res.status(400).json({
        message: "Please provide required fields",
        success: false,
      });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(409).json({
        message: "User already exists With this email",
        success: false,
      });
    }

    const user = await User.create({
      email,
      fullName: {
        firstName,
        lastName,
      },
      password,
    });

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user._id,
    );

    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Welcome! Your account has been created successfully.",
        user: registeredUser,
        success: true,
      });
  } catch (error) {
    console.log("Registration Error:", error);
    return res.status(500).json({
      message: "Something went wrong on our end. Please try again later",
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "please provide required feilds",
        success: false,
      });
    }

    const user = await User.findOne({ email: email }).select("+password ");
    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const isPassCorrect = await user.matchPassword(password);
    if (!isPassCorrect) {
      return res.status(400).json({
        message: "Invaild Credentials",
        success: false,
      });
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user._id,
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: loggedInUser,
        message: "User Logged-In Successfully",
        success: true,
      });
  } catch (error) {
    console.log("Logged-In Error: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};



export { registerUser, loginUser, refreshAccessToken };
