import { CreatePostDto } from "../dto/create-post.dto.js";
import { findAllPosts, createPost } from "../repositories/post.repository.js";

export const getAllPosts = async () => {
	return await findAllPosts();
};

export const createNewPost = async(data: CreatePostDto) => {
	return createPost(data);
};