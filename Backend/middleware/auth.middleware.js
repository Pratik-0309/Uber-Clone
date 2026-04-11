import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Captain from "../models/captain.model.js";

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.userAccessToken;
    if (!token) {
      return res.status(401).json({
        message: "Token is required",
        success: false,
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        message: "User is not authenticated",
        success: false,
      });
    }

    const user = await User.findById(decodedToken._id).select("-refreshToken");
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const authCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.captainAccessToken;
    if (!token) {
      return res.status(401).json({
        message: "Token is required",
        success: false,
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        message: "Captain is not authenticated",
        success: false,
      });
    }

    if (decodedToken.role !== "captain") {
      return res.status(403).json({
        message: "Access denied: Captain only",
        success: false,
      });
    }

    const captain = await Captain.findById(decodedToken._id).select(
      "-password -refreshToken",
    );
    if (!captain) {
      return res.status(401).json({
        message: "Captain not found",
        success: false,
      });
    }

    req.captain = captain;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default authUser;
