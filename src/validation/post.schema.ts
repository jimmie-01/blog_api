import { z } from "zod";

export const createPostSchema = z.object({
	title: z
	.string()
	.min(10, "Title must be at least 10 characters"),

	content: z
	.string()
	.min(1, "Content is required"),

	user_id: z.number()
});

export const  updatePostSchema = 
createPostSchema
.omit({ 
	user_id: true 
})
.partial()
//omit() removes user_id and partial() makes the remaining fields optional
.refine(
	(data) => Object.keys(data).length > 0,
	{
		message: "A least one field must be provided"
	}
);