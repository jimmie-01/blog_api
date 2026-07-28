import { z } from "zod";

export const createPostSchema = z.object({
	title: z
	.string()
	.min(10, "Title must be at least 10 characters"),

	content: z
	.string()
	.min(1, "Content is required"),

	user_id: z.nnumber()
});