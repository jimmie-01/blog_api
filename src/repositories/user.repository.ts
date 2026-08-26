import prisma from "../lib/prisma.js";
import { CreateUserDto } from "../dto/register-user.dto.js";

// interface RegisterUserDto {
// 	name: string;
// 	email: string;
// 	username: string,
// 	password_hash: string;
// }

export const createUser = async (data: CreateUserDto) => {
	return await prisma.users.create({ data });
};

export const findUserByEmail = async (email: string) => {
	return await prisma.users.findUnique({
		where: {
			email
		}
	})
};

export const findUserByUsername = async (username: string) => {
	return await prisma.users.findUnique({
		where: {
			username
		}
	});
};