import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Authentication required. No token provided." });
    }

    const decode = jwt.verify(token, process.env.secretkey);
    if (!decode) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in checkAuth middleware:", error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};
