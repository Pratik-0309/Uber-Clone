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
     const {
      fullName,
      email,
      password,
      status,
      vehicle,
    } = req.body;

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

    const accessToken = captain.generateAccessToken();
    const refreshToken = captain.generateRefreshToken();

    captain.refreshToken = refreshToken;
    await captain.save({ validateBeforeSave: false });

    const registeredCaptain = await Captain.findById(captain._id).select(
      "-password -refreshToken",
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
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

export { captainRegister };
