import jwt, { SignOptions } from "jsonwebtoken";
import type { UserRole } from "../generated/prisma/enums.js";

interface AccessTokenPayLoad{
	userId: number;
	role: UserRole;
	type: "access"
};

interface RefreshTokenPayLoad{
	userId: number;
	type: "refresh"
}

const getJwtSecret = (): string => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}

	return secret;
}

export const generateAccessToken = 
(userId: number, role: UserRole): string => {
	const secret = getJwtSecret();
	const expiresIn = process.env.JWT_EXPIRES_IN || "15m";
	
	if (!expiresIn) {
		throw new Error("JWT_EXPIRES_IN is not configured")
	}

	return jwt.sign(
		{ userId, 
			role, 
			type: "access"
		},
		secret,
		{ 
			expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]> 
		}
	);
};

export const generateRefreshToken = (
	userId: number
): string => {
	const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

	if (!expiresIn) {
		throw new Error("JWT_REFRESH_EXPIRES_IN is not configured");
	}

	return jwt.sign(
		{userId,
		type: "refresh", 
	},
	getJwtSecret(),
	{
		expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]>
	}
	);
}