import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../service/auth.service.js";

export const register = 
async (req: Request, res: Response, next: NextFunction) => {
	try {
		// console.log("Controller Started");
		const user = await registerUser(req.body);

		// console.log("Service Finished")

		const { password_hash, ...safeUser } = user;

		return res.status(201).json({
			message: "User created successfully",
			user: safeUser
		});
	} catch (error) {
		next(error);
	}
};

export const login = 
async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await loginUser(req.body);

		const { password_hash, ...safeUser } = user;

		return res.status(200).json({
			message: "Login Successful",
			user: safeUser
		});
	} catch (error) {
		next(error);
	}
};