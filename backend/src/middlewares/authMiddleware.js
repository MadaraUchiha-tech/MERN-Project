import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.jwt;
    
    // Check Authorization header if no cookie
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // Verify token
    const decode = jwt.verify(token, process.env.secretkey);
    
    // Get user
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};
