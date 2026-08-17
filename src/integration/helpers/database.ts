import prisma from "../../lib/prisma.js";

export const cleanDatabase = async () => {
	await prisma.comments.deleteMany();

	await prisma.posts.deleteMany();

	await prisma.users.deleteMany();
};

export const createTestUser = async () => {
	return prisma.users.create({
		data: {
			name: "Test User",
			email: `test-${Date.now()}@example.com`,
			username: `testuser-${Date.now()}`
		}
	});
};