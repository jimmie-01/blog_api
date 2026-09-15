import jwt, { SignOptions } from "jsonwebtoken";
import type { UserRole } from "../generated/prisma/enums.js";

interface TokenPayLoad{
	userId: number;
	role: UserRole;
};

export const generateAccessToken = 
(userId: number, role: UserRole): string => {
	const secret = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN;

	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}
	
	if (!expiresIn) {
		throw new Error("JWT_EXPIRES_IN is not configured")
	}

	return jwt.sign(
		{ userId, role },
		secret,
		{ 
			expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]> 
		}
	);
};