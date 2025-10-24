import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.secretkey, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allow cross-site cookies in production
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined // Set domain for production
  });
};
