import { Router } from "express";
import {register, login } from "../controllers/auth.controller.js";
import { validateUserLogin, validateNewUser } from "../middleware/validate-user.middleware.js";

const router = Router();

router.post("/register", validateNewUser, register);
router.post("/login", validateUserLogin, login);

export default router;
