import Captain from "../models/captain.model.js";
import { validationResult } from "express-validator";

const isProduction = process.env.NODE_ENV === "production";
const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const captainRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, email, password, status, vehicle } = req.body;

    const firstName = fullName?.firstName;
    const lastName = fullName?.lastName;

    const color = vehicle?.color;
    const plate = vehicle?.plate;
    const capacity = vehicle?.capacity;
    const vehicleType = vehicle?.vehicleType;

    if (
      [
        firstName,
        lastName,
        email,
        password,
        status,
        color,
        plate,
        capacity,
        vehicleType,
      ].some((field) => field === undefined || field === "")
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const captainExist = await Captain.findOne({ email });
    if (captainExist) {
      return res.status(400).json({
        message: "Captain with this email already exist",
        success: false,
      });
    }

    const captain = await Captain.create({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
      status,
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType,
      },
    });

    const accessToken = await captain.generateAccessToken();
    const refreshToken = await captain.generateRefreshToken();

    captain.refreshToken = refreshToken;
    await captain.save({ validateBeforeSave: false });

    const registeredCaptain = await Captain.findById(captain._id).select(
      "-password -refreshToken",
    );

    return res
      .status(201)
      .cookie("captainAccessToken", accessToken, options)
      .cookie("captainRefreshToken", refreshToken, options)
      .json({
        message: "Captain Registered Successsfully",
        success: true,
        captain: registeredCaptain,
      });
  } catch (error) {
    console.log("Captain Registration Error:", error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const captainLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Please Provide required fields",
        success: false,
      });
    }

    const captain = await Captain.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const isPassMatch = await captain.matchPassword(password);
    if (!isPassMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const accessToken = await captain.generateAccessToken();
    const refreshToken = await captain.generateRefreshToken();

    captain.refreshToken = refreshToken;
    await captain.save({ validateBeforeSave: false });

    const loggedInCaptain = await Captain.findById(captain._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("captainAccessToken", accessToken, options)
      .cookie("captainRefreshToken", refreshToken, options)
      .json({
        captain: loggedInCaptain,
        message: "Captain Logged in Successfully",
        success: true,
      });
  } catch (error) {
    console.log("Captain Login Error:", error.message);
    return res.status(500).json({
      message: "Failed to Login",
      success: false,
    });
  }
};

const captainProfile = async (req, res) => {
  try {
    const captainId = req.captain?._id;
    if (!captainId) {
      return res.status(403).json({
        message: "Captain is not authenticated",
        success: false,
      });
    }

    const captain = await Captain.findById(captainId).select("-password -refreshToken");
    if (!captain) {
      return res.status(400).json({
        message: "Captain not found",
        success: false,
      });
    }

    return res.status(200).json({
      captain,
      message: "Captain Details Fetched Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Failed to fetch captain profile: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const captainLogout = async (req, res) => {
  try {
    const captain = await Captain.findById(req.captain._id);
    if (!captain) {
      return res.status(400).json({
        message: "Captain Not found",
        success: false,
      });
    }

    captain.refreshToken = null;
    await captain.save({ validateBeforeSave: false });

    return res
      .status(200)
      .clearCookie("captainAccessToken", options)
      .clearCookie("captainRefreshToken", options)
      .json({
        success: true,
        message: "You have been logged out successfully. See you soon!",
      });
  } catch (error) {
    console.error("Error logging out captain:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout. Please try again.",
    });
  }
};

export { captainRegister, captainLogin, captainProfile, captainLogout };
