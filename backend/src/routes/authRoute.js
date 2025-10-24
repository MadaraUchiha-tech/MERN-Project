import express from "express";
import { checkAuth } from "../middlewares/authMiddleware.js";

const route = express.Router();
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/authController.js";

route.post("/signup", signup);

route.post("/login", login);

route.get("/logout", logout);

route.get("/check", checkAuth, (req, res) => res.json(req.user));

route.put("/update-profile", checkAuth, updateProfile);

export default route;
