import express from "express";

import {
  googleLogin,
  logout,
  getCurrentUser
} from "../controllers/auth.controller.js";

import { requireAuth, } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post( "/google", googleLogin );
router.post( "/logout", logout );
router.get( "/me", requireAuth, getCurrentUser );

export default router;