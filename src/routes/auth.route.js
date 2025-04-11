import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  updateProfilePic,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middlewate.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-Profile", protectRoute, updateProfile);
router.put("/update", protectRoute, updateProfilePic);
router.get("/check", protectRoute, checkAuth);

export default router;
