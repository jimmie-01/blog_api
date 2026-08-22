import bcrypt from "bcrypt";

const SALT_ROUND = 10;

export const hashPassword = async (password: string) => {
	
	return bcrypt.hash(password, SALT_ROUND);
};

export const comparePassword = async (password: string, passwordHash: string) => {

	return bcrypt.compare(password, passwordHash);
}