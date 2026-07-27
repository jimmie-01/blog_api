import { Request, Response } from "express";
import { createNewPost, getAllPosts } from "../service/post.service.js";

export const getPosts = async (req: Request, res: Response) => {

	const posts = await getAllPosts();

	res.status(200).json(posts);
};

export const createPost = async(req: Request, res: Response) => {
	try {
		const post = await createNewPost(req.body);
		res.status(201).json(post);	
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong."});
	}	
};