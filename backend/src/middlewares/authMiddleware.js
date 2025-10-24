import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req?.cookies?.jwt;

    // If cookie-parser returned an object or unexpected format, coerce to string
    if (token && typeof token !== 'string') {
      try {
        token = String(token);
      } catch (e) {
        token = undefined;
      }
    }

    // Check Authorization header if no cookie
    const authHeader = req.headers?.authorization;
    if (!token && authHeader) {
      // Accept formats like: 'Bearer <token>' or just '<token>'
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        token = authHeader;
      }
    }

    // Some clients may send cookie string like 'jwt=<token>' accidentally; strip that
    if (token && typeof token === 'string' && token.includes('jwt=')) {
      const idx = token.indexOf('jwt=');
      token = token.substring(idx + 4);
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // sanity: trim whitespace
    token = token.trim();

    // Quick debug info (do not log full token)
    console.log('Authenticating request - token length:', token.length, 'prefix:', token.slice(0, 8));

    // Verify token
    let decode;
    try {
      decode = jwt.verify(token, process.env.secretkey);
    } catch (jwtErr) {
      console.log('JWT verification error (sanitized):', jwtErr.name, jwtErr.message);
      return res.status(401).json({ message: 'Invalid or malformed token.' });
    }
    
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
