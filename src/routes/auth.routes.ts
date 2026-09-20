import { Router } from "express";
import {register, login, refresh } from "../controllers/auth.controller.js";
import { validateUserLogin, validateNewUser, validateRefreshToken } from "../middleware/validate-user.middleware.js";

const router = Router();

router.post("/register", validateNewUser, register);
router.post("/login", validateUserLogin, login);
router.post("/refresh", validateRefreshToken, refresh);

export default router;
