import express from "express";

import {
  googleCallback,
  getProfile,
  logout,
  googleLogin,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);
router.get("/profile", authMiddleware, getProfile);

export default router;
