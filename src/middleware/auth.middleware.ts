import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized-error.js";

interface JwtPayload {
	userId: number
};

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authorization = req.headers.authorization;

		if (typeof authorization !== "string") {
			throw new UnauthorizedError("Authentication required");
		}

		const [scheme, token] = authorization.split(" ");

		if (scheme !== "Bearer" || !token) {
			throw new UnauthorizedError("Invalid authorization header");
		}

		const secret = process.env.JWT_SECRET

		if (!secret) {
			throw new Error("JWT_SECRET is not configured");
		}

		const decoded = jwt.verify(token, secret);

		if (
			typeof decoded !== "object" ||
			decoded == null ||
			typeof decoded.user_id !== "number"
		){
			throw new UnauthorizedError("Invalid token");
		};

		console.log(decoded.user_id)

		req.user = {
			userId: decoded.user_id
		}
		next();
	} catch (error) {
		next(error)
	}
};