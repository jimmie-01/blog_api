import { comparePassword, hashPassword } from "../utils/password.js";
import { RegisterUserDto, UserLoginDto } from "../dto/register-user.dto.js";
import { createUser, findUserByEmail, findUserByUsername} from "../repositories/user.repository.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { ConflictError } from "../errors/conflict-error.js";

export const registerUser = async (data: RegisterUserDto) => {

	const existingEmail = 
	await findUserByEmail(data.email);

	if (existingEmail) {
		throw new ConflictError("Email already exists");
	};

	const existingUsername = 
	await findUserByUsername(data.username);

	if (existingUsername) {
		throw new ConflictError("Username already exist");
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
		throw new UnauthorizedError("Invalid credentials");
	}

	const validPassword = 
	await comparePassword(data.password, user.password_hash);

	if (!validPassword) {
		throw new UnauthorizedError("Invalid credentials");
	}

	return user;
}