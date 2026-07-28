import { Router } from "express";
import { getPosts, createPost } from "../controllers/post.controller.js";
import { validateCreatePost } from "../middleware/validate-create-post.middleware.js";

const router = Router();

router.get("/", getPosts);
router.post("/", validateCreatePost, createPost);

export default router;