import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.secretkey, {
      expiresIn: "7d",
    });

    // Store token in both cookie and authorization header
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });

    return token;
  } catch (error) {
    console.error('Error in token generation:', error);
    throw error;
  }
};
