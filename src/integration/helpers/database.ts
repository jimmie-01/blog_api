import prisma from "../../lib/prisma.js";

export const cleanDatabase = async () => {
	await prisma.comments.deleteMany();

	await prisma.posts.deleteMany();

	await prisma.users.deleteMany();
};