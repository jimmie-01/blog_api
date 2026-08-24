import prisma from "../lib/prisma.js";

interface RegisterUserDto {
	name: string;
	email: string;
	username: string,
	password_hash: string;
}

export const createUser = async (data: RegisterUserDto) => {

	return prisma.users.create({ data });
};