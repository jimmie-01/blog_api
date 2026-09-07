import jwt, { SignOptions } from "jsonwebtoken";

interface TokenPayLoad{
	userId: number
};

export const generateAccessToken = 
(userId: number): string => {
	const secret = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN;

	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}
	
	if (!expiresIn) {
		throw new Error("JWT_EXPIRES is not configured")
	}

	return jwt.sign(
		{ userId },
		secret,
		{ 
			expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]> 
		}
	);
};