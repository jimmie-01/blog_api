import prisma from "../../lib/prisma.js";

export const createTestUser = async (
	overrides: Partial<{
	name: string;
	email: string;
	username: string;
	password_hash: string
}> = {}
) => {
	return prisma.users.create({
		data: {
			name: "Test User",
			email: `test-${Date.now()}@example.com`,
			username: `testuser-${Date.now()}`,
			password_hash: "test-password-hash",
			...overrides
		}
	});
};

export const createTestPost = async (
	userId: number, 
	overrides: Partial<{
		title: string;
		content: string;
	}> = {} 
) => {
	return prisma.posts.create({
		data: {
		user_id: userId,
		title: "Test Post",
		content: "Test post content",
		...overrides
		}
	});
};