import prisma from "../lib/prisma.js";
import { CreatePostDto } from "../dto/create-post.dto.js";
import { UpdatePostDto } from "../dto/update-post.dto.js";
import { Prisma } from "../generated/prisma/client.js";

export const findAllPosts = async () => {
	return prisma.posts.findMany();
};

export const createPost = async (data: CreatePostDto) => {
	return prisma.posts.create({
		data
	});
};

export const updatePost = async (id: number, data: UpdatePostDto) => {

	const updateData: Prisma.postsUpdateInput = {};

	if (data.title !== undefined) {
		updateData.title = data.title;
	}

	if (data.content !== undefined) {
		updateData.content = data.content;
	}

	return await prisma.posts.update({ where: { id }, data: updateData })
}