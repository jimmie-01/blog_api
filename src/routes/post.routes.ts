import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/post.controller.js";
import { validateCreatePost, validateUpdatePost } from "../middleware/validate-post.middleware.js";

const router = Router();

router.get("/", getPosts);
router.post("/", validateCreatePost, createPost);
router.patch("/:id", validateUpdatePost, updatePost);
router.delete("/:id", deletePost);

export default router;