import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    console.log('Cookies received:', req.cookies);
    console.log('Headers:', req.headers);
    
    const token = req.cookies.jwt;
    if (!token) {
      console.log('No JWT token found in cookies');
      return res.status(401).json({ message: "Authentication required. No token provided." });
    }

    console.log('Token found, verifying...');
    const decode = jwt.verify(token, process.env.secretkey);
    console.log('Token decoded:', { userId: decode.userId });

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      console.log('User not found for ID:', decode.userId);
      return res.status(404).json({ message: "User not found." });
    }

    console.log('User authenticated:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in checkAuth middleware:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token: " + error.message });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(500).json({ message: "Internal server error: " + error.message });
  }
};
