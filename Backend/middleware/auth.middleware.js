import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
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

export default verifyJWT;
