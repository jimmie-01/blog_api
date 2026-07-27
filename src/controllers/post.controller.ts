import { Request, Response } from "express";
import { createNewPost, getAllPosts } from "../service/post.service.js";

export const getPosts = async (req: Request, res: Response) => {

	const posts = await getAllPosts();

	res.status(200).json(posts);
};

export const createPost = async(req: Request, res: Response) => {

	const post = await createNewPost(req.body);

	res.status(201).json(post);
}