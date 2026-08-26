import { comparePassword, hashPassword } from "../utils/password.js";
import { RegisterUserDto, UserLoginDto } from "../dto/register-user.dto.js";
import { createUser, findUserByEmail, findUserByUsername} from "../repositories/user.repository.js";

export const registerUser = async (data: RegisterUserDto) => {

	const existingEmail = 
	await findUserByEmail(data.email);

	if (existingEmail) {
		throw new Error("Email already exists");
	};

	const existingUsername = 
	await findUserByUsername(data.username);

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
};

export const loginUser = async (data: UserLoginDto) => {

	const user = await findUserByEmail(data.email);

	if (!user) {
		throw new Error("Invalid credentials");
	}

	const validPassword = 
	await comparePassword(data.password, user.password_hash);

	if (!validPassword) {
		throw new Error("Invalid credentials");
	}

	return user;
}