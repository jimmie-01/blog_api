import z from "zod";

const userIdentitySchema = z.object({
	name: z.string().min(2),
	email: z.email(),
	username: z.string().min(3),
});

export const registerUserSchema = 
userIdentitySchema.extend({
	password: z.string().min(8)
});

export const createUserSchema = 
userIdentitySchema.extend({
	password_hash: z.string()
});