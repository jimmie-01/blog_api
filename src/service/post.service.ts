import { CreatePostDto } from "../dto/create-post.dto.js";
import { UpdatePostDto } from "../dto/update-post.dto.js";
import { findAllPosts, createPost, updatePost } from "../repositories/post.repository.js";

export const getAllPosts = async () => {
	return await findAllPosts();
};

export const createNewPost = async(data: CreatePostDto) => {
	return createPost(data);
};

export const updateExistingPost = async (id: number, data: UpdatePostDto) => {

	return updatePost(id, data);
};