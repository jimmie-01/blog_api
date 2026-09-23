import prisma from "../lib/prisma.js";

export const createSession = 
async(
	userId: number,
	refreshTokenHash: string,
	expiresAt: Date
) => {
	return prisma.sessions.create({
		data: {
			user_id: userId,
			refresh_token_hash: refreshTokenHash,
			expires_at: expiresAt
		}
	});
};

export const findSessionByTokenHash = 
async (refreshTokenHash: string) => {
	return prisma.sessions.findUnique({
		where: {
			refresh_token_hash: refreshTokenHash
		}
	});
};

export const revokeSession = async (sessionId: number) => {
	return prisma.sessions.update({
		where: {
			id: sessionId
		},
		data: {
			revoked_at: new Date()
		}
	});
};