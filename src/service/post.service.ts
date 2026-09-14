import { CreatePostDto } from "../dto/create-post.dto.js";
import { UpdatePostDto } from "../dto/update-post.dto.js";
import { NotFoundError } from "../errors/bad-request.error.js";
import { ForbiddenError } from "../errors/forbidden-error.js";
import prisma from "../lib/prisma.js";
import { findAllPosts, createPost, updatePost, deletePost, getPostById } from "../repositories/post.repository.js";

export const getAllPosts = async () => {
	return await findAllPosts();
};

export const findPostById = async (id: number) => {
	
	const post = await getPostById(id);

	if (!post) {
		throw new NotFoundError("Post Not Found");
	}

	return getPostById(id);
};

export const createNewPost = async(data: CreatePostDto) => {
	return createPost(data);
};

export const updateExistingPost = async (
	id: number,
	data: UpdatePostDto,
	userId: number
) => {
	const post = await getPostById(id);

	if (!post) {
		throw new NotFoundError("Post not found");
	}

	if (post.user_id !== userId) {
		throw new ForbiddenError("You are not allowed to modify this post");
	}

	return updatePost(id, data);
};

export const deleteExistingPost = async (id: number, userId: number) => {

	const post = await getPostById(id);

	if (!post) {
		throw new NotFoundError("Post Not Found");
	}

	if (post.user_id !== userId) {
		throw new ForbiddenError("You are not allowed to delete this post");
	}

	return deletePost(id);
}