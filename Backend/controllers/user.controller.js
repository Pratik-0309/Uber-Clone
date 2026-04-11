import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Captain from "../models/captain.model.js";

const isProduction = process.env.NODE_ENV === "production";
const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const refreshAccessToken = async (req, res) => {
  try {
    
    const isCaptainPath = req.originalUrl.includes('/api/captain');
    const tokenName = isCaptainPath ? "captainRefreshToken" : "userRefreshToken";
    
    const incomingRefreshToken = req.cookies[tokenName];

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "No refresh token found for this role.",
        success: false,
      });
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (isCaptainPath && decodedToken.role !== 'captain') {
       throw new Error("Invalid token role for this endpoint");
    }

    let account = decodedToken.role === "captain" 
      ? await Captain.findById(decodedToken._id) 
      : await User.findById(decodedToken._id);

    if (!account || incomingRefreshToken !== account.refreshToken) {
      return res.status(401).json({ message: "Invalid session.", success: false });
    }

    const accessToken = await account.generateAccessToken();
    const refreshToken = await account.generateRefreshToken();

    account.refreshToken = refreshToken;
    await account.save({ validateBeforeSave: false });

    const accessTokenName = isCaptainPath ? "captainAccessToken" : "userAccessToken";
    const refreshTokenName = isCaptainPath ? "captainRefreshToken" : "userRefreshToken";

    return res
      .status(200)
      .cookie(accessTokenName, accessToken, options)
      .cookie(refreshTokenName, refreshToken, options)
      .json({ success: true, message: "Tokens renewed" });

  } catch (error) {
    return res.status(401).json({ success: false, message: "Token expired" });
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

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const registeredUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(201)
      .cookie("userAccessToken", accessToken, options)
      .cookie("userRefreshToken", refreshToken, options)
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

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("userAccessToken", accessToken, options)
      .cookie("userRefreshToken", refreshToken, options)
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

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        message: "User in not authenticated",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      message: "User Profile fetch Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Failed to fetch profile:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .clearCookie("userAccessToken", options)
      .clearCookie("userRefreshToken", options)
      .json({
        success: true,
        message: "You have been logged out successfully. See you soon!",
      });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout. Please try again.",
    });
  }
};

export { registerUser, loginUser, refreshAccessToken, userProfile, logoutUser };
