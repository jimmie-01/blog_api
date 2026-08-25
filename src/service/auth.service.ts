import { hashPassword } from "../utils/password.js";
import { RegisterUserDto } from "../dto/register-user.dto.js";
import { createUser } from "../repositories/user.repository.js";

export const registerUser = async (data: RegisterUserDto) => {

	const existingEmail = 
	await repository.findUserByEmail(data.email);

	if (existingEmail) {
		throw new Error("Email already exists");
	};

	const existingUsername = 
	await repository.findUserByUsername(data.username);

	if (existingUsername) {
		throw new Error("Username already exist");
	}

	const { password, ...userData } = data;

	const password_hash = 
	await hashPassword(data.password);

	return createUser({
		...userData,
		password_hash
	});
}