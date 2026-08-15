import prisma from "../../lib/prisma.js";

export const createTestUser = async () => {
	return prisma.users.create({
		data: {
			name: "Test User",
			email: "test@example.com",
			username: "testuser"	
		}
	});
}
// This gives our integration test a predictable user