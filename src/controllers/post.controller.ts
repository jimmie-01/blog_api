import { Request, Response } from "express";
import { createNewPost, getAllPosts } from "../service/post.service.js";
import { Prisma } from "../generated/prisma/client.js";

export const getPosts = async (req: Request, res: Response) => {
	try {
		const posts = await getAllPosts();
		res.status(200).json(posts);	
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const createPost = async(req: Request, res: Response) => {
	try {

		const post = await createNewPost(req.body);
		res.status(201).json(post);	

	} catch (error) {
		console.error(error);

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
			return res.status(400).json({
				message: "The specified user does not exist."
			});
		}
		return res.status(500).json({ message: "Internal Server Error"});
	}	
}