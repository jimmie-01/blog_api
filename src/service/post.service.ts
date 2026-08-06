import { CreatePostDto } from "../dto/create-post.dto.js";
import { UpdatePostDto } from "../dto/update-post.dto.js";
import { NotFoundError } from "../errors/bad-request.error.js";
import prisma from "../lib/prisma.js";
import { findAllPosts, createPost, updatePost, deletePost, getPostById } from "../repositories/post.repository.js";

export const getAllPosts = async () => {
	return await findAllPosts();
};

export const findPostById = async (id: number) => {
	
	const post = await getPostById(id);

	if (!post) {
		return new NotFoundError("Post Not Found");
	}

	return getPostById(id);
};

export const createNewPost = async(data: CreatePostDto) => {
	return createPost(data);
};

export const updateExistingPost = async (id: number, data: UpdatePostDto) => {

	return updatePost(id, data);
};

export const deleteExistingPost = async (id: number) => {

	const post = await prisma.posts.findUnique({
		where: { id }
	});

	if (!post) {
		throw new NotFoundError("Post Not Found");
	}

	return deletePost(id);
}