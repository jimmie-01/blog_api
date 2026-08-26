import { Request, Response, NextFunction } from "express";
import { createPostSchema, updatePostSchema } from "../validation/post.schema.js";
import { userLoginSchema } from "../validation/auth.schema.js";
import { error } from "node:console";

export const validateCreatePost = (req: Request, res: Response, next: NextFunction) => {

	const result = createPostSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			errors: result.error.issues
		});
	}

	req.body = result.data;

	next();
	// const { title, content, user_id } = req.body;

	// if (!title || typeof title !== "string") {
	// 	return res.status(400).json({
	// 		message: "Title is requires."
	// 	});
	// }

	// if (title.trim().length < 10) {
	// 	return res.status(400).json({
	// 		message: "Title must be at least 10 characters"
	// 	});
	// }

	// if (!content || typeof content !== "string") {
	// 	return res.status(400).json({
	// 		message: "content is required."
	// 	});
	// }

	// if (typeof user_id !== "number") {
	// 	return res.status(400).json({
	// 		message: "user_id must be a number"
	// 	});
	//}
};

export const validateUpdatePost = (req: Request, res: Response, next: NextFunction) => {

	const result = updatePostSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			message: "Validation Failed",
			errors: result.error.issues
		});
	}

	// Replace req.body with the validated data
	req.body = result.data;

	next();
}

export const validateUserLogin = 
(req: Request, res: Response, next: NextFunction) => {

	const result = userLoginSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			message: "Validation failed",
			error: result.error.flatten()
		});
	};

	req.body = result.data;

	next();
};