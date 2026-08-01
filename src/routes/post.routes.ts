import { Router } from "express";
import { getPosts, createPost, updatePost } from "../controllers/post.controller.js";
import { validateCreatePost } from "../middleware/validate-create-post.middleware.js";

const router = Router();

router.get("/", getPosts);
router.post("/", validateCreatePost, createPost);
router.patch("/:id", updatePost);

export default router;