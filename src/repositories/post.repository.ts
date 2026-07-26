import prisma from "../lib/prisma.js";

export const findAllPosts = async () => {
	return prisma.posts.findMany();
};