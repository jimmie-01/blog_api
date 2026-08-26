import { Request, Response, NextFunction } from "express";
import { userLoginSchema, registerUserSchema } from "../validation/auth.schema.js";
import { z } from "zod";

export const validateNewUser =
async (req: Request, res: Response, next: NextFunction) => {
	const result =
	registerUserSchema.safeParse(req.body);
	
	if (!result.success) {
		return res.status(400).json({
			message: "Validation failed",
			error: z.flattenError(result.error)
		})
	};
	
	req.body = result.data;
	
	next();
};

export const validateUserLogin = 
(req: Request, res: Response, next: NextFunction) => {

	const result =
	userLoginSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			message: "Validation failed",
			error: z.flattenError(result.error)
		});
	};

	req.body = result.data;

	next();
};