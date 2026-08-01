import { NextFunction, Request, Response } from "express";
import { createNewPost, getAllPosts, updateExistingPost } from "../service/post.service.js";

export const getPosts = async (req: Request, res: Response) => {
	try {
		const posts = await getAllPosts();
		res.status(200).json(posts);	
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const createPost = async(req: Request, res: Response, next: NextFunction) => {
	try {
		const post = await createNewPost(req.body);

		return res.status(201).json(post);
	} catch (error) {
		next(error);
	}	
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {

	try {
		const id = Number(req.params.id);

		const post = await updateExistingPost(id, req.body);

		return res.json(post);
	} catch (error) {
		next(error);
	}
}