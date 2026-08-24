import { hashPassword } from "../utils/password.js";
import { RegisterDto } from "../dto/register-user.dto.js";
import { createUser } from "../repositories/user.repository.js";

export const registerUser = async (data: RegisterDto) => {

	const password_hash = await hashPassword(data.password);

	return createUser({
		name: data.name,
		email:data.email,
		username: data.username,
		password_hash
	});
}