import { tokenGeneration } from "../lib/token.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedpassword,
    });
    
  await newUser.save();
  // Generate token and set cookie
  const token = tokenGeneration(newUser._id, res);
  // Then send user data with token
  const userWithoutPassword = { ...newUser.toObject(), password: undefined };
  return res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.log("Error in signup:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate token and set cookie
    const token = tokenGeneration(user._id, res);
    
    // Send user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      user: userResponse,
      token: token
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("error in logout", error.message);
    res.status(500).json({ message: "Internal Server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id;

    if (!profilepic) {
      return res.status(400).json({ message: "profilepic is required." });
    }

    const uploadImage = await cloudinary.uploader.upload(profilepic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadImage.secure_url },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error in Updating Profile", error: error.message });
  }
};
