import prisma from "../lib/prisma.js";
import { CreateUserDto } from "../dto/register-user.dto.js";

// interface RegisterUserDto {
// 	name: string;
// 	email: string;
// 	username: string,
// 	password_hash: string;
// }

export const createUser = async (data: CreateUserDto) => {

	return prisma.users.create({ data });
};