import prisma from "../lib/prisma.js";
import { CreatePostDto } from "../dto/create-post.dto.js";
import { UpdatePostDto } from "../dto/update-post.dto.js";

export const findAllPosts = async () => {
	return prisma.posts.findMany();
};

export const createPost = async (data: CreatePostDto) => {
	return prisma.posts.create({
		data
	});
};

export const updatePost = async (id: number, data: UpdatePostDto) => {

	return await prisma.posts.update({ where: { id }, data })
}