import { Request, Response } from "express";
import { getAllPosts } from "../service/post.service.js";

export const getPosts = async (req: Request, res: Response): Promise<void> => {

	const posts = await getAllPosts();

	res.status(200).json(posts);
};