import bcrypt from "bcrypt";

const SALT_ROUND = 10;

export const hashPassword = async (password: string): Promise<string> => {
	
	return bcrypt.hash(password, SALT_ROUND);
};

export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {

	return bcrypt.compare(password, passwordHash);
}