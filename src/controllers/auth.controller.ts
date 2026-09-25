import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../service/auth.service.js";

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
		const { user, accessToken, refreshToken } = await loginUser(req.body);

		const { password_hash, ...safeUser } = user;

		return res.status(200).json({
			message: "Login Successful",
			user: safeUser,
			accessToken,
			refreshToken
		});
	} catch (error) {
		next(error);
	}
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {

	try {
		const { refreshToken } = req.body;

		const { accessToken, refreshToken: newRefreshToken } = 
		await refreshAccessToken(refreshToken);

		return res.status(200).json({
			accessToken,
			refreshToken: newRefreshToken
		 });

	} catch (error) {
		next(error)
	}
};

export const logout = async (req: Request, res:Response, next: NextFunction) => {

	try {
		const { refreshToken } = req.body;

		await logoutUser(refreshToken);
	} catch (error) {
		next(error)
	}
}