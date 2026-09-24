import { comparePassword, hashPassword } from "../utils/password.js";
import { RegisterUserDto, UserLoginDto } from "../dto/register-user.dto.js";
import { createUser, findUserByEmail, findUserByUsername, findUserById } from "../repositories/user.repository.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { ConflictError } from "../errors/conflict-error.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import { hashRefreshToken } from "../utils/tokenHash.js";
import { createSession, findSessionByTokenHash, revokeSession } from "../repositories/session.repository.js";

export const registerUser = async (data: RegisterUserDto) => {

	const existingEmail = 
	await findUserByEmail(data.email);

	if (existingEmail) {
		throw new ConflictError("Email already exists");
	};

	const existingUsername = 
	await findUserByUsername(data.username);

	if (existingUsername) {
		throw new ConflictError("Username already exist");
	}

	const { password, ...userData } = data;

	const password_hash = 
	await hashPassword(data.password);

	return createUser({
		...userData,
		password_hash
	});
};

export const loginUser = async (data: UserLoginDto) => {

	const user = await findUserByEmail(data.email);

	if (!user) {
		throw new UnauthorizedError("Invalid credentials");
	}

	const validPassword = 
	await comparePassword(data.password, user.password_hash);

	if (!validPassword) {
		throw new UnauthorizedError("Invalid credentials");
	}

	const accessToken = generateAccessToken(user.id, user.role);

	const refreshToken = generateRefreshToken(user.id);

	const refreshTokenHash = hashRefreshToken(refreshToken);

	const expiresAt = new Date(
		Date.now() + 7 * 24 * 60 * 60 * 1000
	);

	await createSession(
		user.id,
		refreshTokenHash,
		expiresAt
	)

	return {
		user,
		accessToken,
		refreshToken
	};
}

export const refreshAccessToken = async(refreshToken: string) => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}

	try {
		const decoded = jwt.verify(refreshToken, secret);

		if (
			typeof decoded !== "object" ||
			decoded === null ||
			typeof decoded.userId !== "number" ||
			decoded.type !== "refresh"
		) {
			throw new UnauthorizedError("Invalid refresh token");
		}

		const refreshTokenHash = hashRefreshToken(refreshToken);

		const session = await findSessionByTokenHash(refreshTokenHash);

		if (!session) {
			throw new UnauthorizedError("Invalid refresh token");
		}

		if (session.revoked_at) {
			throw new UnauthorizedError("Refresh token has been revoked");
		}

		if (session.expires_at <= new Date()) {
			throw new UnauthorizedError("Refresh token expired");
		}

		const user = await findUserById(decoded.userId);

		if (!user) {
			throw new UnauthorizedError("Invalid refresh token");
		}

		await revokeSession(session.id);

		const accessToken = generateAccessToken(user.id, user.role);

		const newRefreshToken = generateRefreshToken(user.id);
		
		const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		await createSession(
			user.id,
			newRefreshTokenHash,
			expiresAt
		);

		return {
			accessToken,
			refreshToken: newRefreshToken
		};
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new UnauthorizedError("Refresh token expired");
		}

		if (error instanceof jwt.JsonWebTokenError) {
			throw new UnauthorizedError("Invalid refresh token");
		}
		throw error;
	}
}

export const logoutUser = async (refreshToken: string) => {
	const refreshTokenHash = hashRefreshToken(refreshToken);

	const session = await findSessionByTokenHash(refreshTokenHash);

	if (!session) {
		throw new UnauthorizedError("Invalid refresh token");
	}

	await revokeSession(session.id);
}