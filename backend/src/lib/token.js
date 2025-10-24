import jwt from "jsonwebtoken";

export const tokenGeneration = (userId, res) => {
  try {
    console.log('Generating token for userId:', userId);
    const token = jwt.sign({ userId }, process.env.secretkey, {
      expiresIn: "7d",
    });
    
    console.log('Setting cookie...');
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });
    console.log('Cookie set successfully');
    
    // Also send token in response header for debugging
    res.setHeader('x-auth-token', token);
    
    return token;
  } catch (error) {
    console.error('Error in token generation:', error);
    throw error;
  }
};
