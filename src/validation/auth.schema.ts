import z from "zod";

export const registerSchema = z.object({
	name: z.string().min(2),
	email: z.email(),
	username: z.string().min(3),
	pasword: z.string().min(8)
});