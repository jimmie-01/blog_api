import { Router } from "express";
import {register, login, refresh, logout } from "../controllers/auth.controller.js";
import { validateUserLogin, validateNewUser, validateRefreshToken } from "../middleware/validate-user.middleware.js";
import { authRateLimiter } from "../middleware/rate-limit.middleware.ts";

const router = Router();

router.post("/register", authRateLimiter, validateNewUser, register);
router.post("/login", authRateLimiter, validateUserLogin, login);
router.post("/refresh", authRateLimiter, validateRefreshToken, refresh);
router.post("/logout",validateRefreshToken, logout);

export default router;
