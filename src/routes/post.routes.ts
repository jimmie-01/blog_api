import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost, getPostById } from "../controllers/post.controller.js";
import { validateCreatePost, validateUpdatePost } from "../middleware/validate-post.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get("/",authenticate, getPosts);
router.get("/:id", getPostById);
router.post("/",authenticate, validateCreatePost, createPost);
router.patch("/:id", authenticate, validateUpdatePost, updatePost);
router.delete("/:id", authenticate, authorize("ADMIN"), deletePost);

export default router;