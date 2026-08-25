import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "../auth.service.js";
import * as repository from "../../repositories/user.repository.js";
import * as passwordHelper from "../../utils/password.js";

vi.mock("../../repositories/user.repository.js");
vi.mock("../../utils/password.js");

describe("Register User (Auth)", () => {

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return the registered user", async () =>{
		const fakeHashPassword ="user123wchbjsd9whhi7t5dtn*";

		const fakeUser = {
			name: "Razaq",
			email: "razaq@example.com",
			username: "fakeUserName",
			password_hash: fakeHashPassword,
			id: 1
		};

		vi.mocked(passwordHelper.hashPassword).mockResolvedValue(fakeHashPassword);

		vi.mocked(repository.createUser).mockResolvedValue(fakeUser);

		const input = {
			name: "Razaq",
			email: "razaq@example.com",
			username: "fakeUserName",
			password: "user123"
		}
		
		const {password, ...userData} = input;
		

		const user = await registerUser(input);

		expect(passwordHelper.hashPassword).toHaveBeenCalledWith(input.password);

		expect(repository.createUser).toHaveBeenCalledWith({
			...userData,
			password_hash: fakeHashPassword
		});

		expect(repository.createUser).toHaveBeenCalledWith
		(expect.not.objectContaining({
			password: input.password
		}));

		expect(user).toEqual(fakeUser);


	});
})