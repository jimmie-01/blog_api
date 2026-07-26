import { findAllPosts } from "../repositories/post.repository.js";

export const getAllPosts = async () => {
	return await findAllPosts();
};