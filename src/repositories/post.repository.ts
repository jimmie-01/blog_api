import prisma from "../lib/prisma.js";
import { CreatePostDto } from "../dto/create-post.dto.js";
import { UpdatePostDto } from "../dto/update-post.dto.js";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";

export const findAllPosts = async () => {
	return prisma.posts.findMany();
};

export const getPostById = async (id: number) => {
	return prisma.posts.findUnique({
		where: { id }
	});
};

export const createPost = async (data: CreatePostDto) => {
	return prisma.posts.create({
		data
	});
};

export const updatePost = async (id: number, data: UpdatePostDto) => {
	try {
		const updateData: Prisma.postsUpdateInput = {};
		
		if (data.title !== undefined) {
			updateData.title = data.title;
		}
		
		if (data.content !== undefined) {
			updateData.content = data.content;
		}
		
		return await prisma.posts.update({ where: { id }, data: updateData })
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw new AppError("Post not found", 404);
		}
		throw error;
	}
}

export const deletePost = async (id: number) => {
	try {
		return prisma.posts.delete({
		where: {
			id
		}
	});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw new AppError("Post not found", 404);
		}
		throw error;
	}
};