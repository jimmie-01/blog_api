import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "../auth.service.js";
import * as repository from "../../repositories/user.repository.js";
import * as passwordHelper from "../../utils/password.js";
import { userInfo } from "node:os";

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

	it("should reject registration when email already exists", async() => {
		const input = {
			name: "Razaq",
			email: "razaq@example.com",
			username: "fakeUserName",
			password: "usr123"
		};

		const existingUser = {
			id: 5,
			name: "Existing User",
			email: input.email,
			username: "existingUser",
			password_hash: "existing-hash"
		};

		vi.mocked(repository.findUserByEmail)
		.mockResolvedValue(existingUser);

		await expect(registerUser(input))
		.rejects.toThrow("Email already exists");

		expect(repository.findUserByEmail).
		toHaveBeenCalledWith(input.email);

		expect(passwordHelper.hashPassword).
		not.toHaveBeenCalled();

		expect(repository.createUser).
		not.toHaveBeenCalled();
	});

	it("should reject registration when username already exist", async () => {
		const input = {
			name: "Razaq",
			email: "new@example.com",
			username: "fakeUserName",
			password: "user123"
		};

		const existingUser = {
			id: 5,
			name: "Existing User",
			email: input.email,
			username: input.username,
			password_hash: "existing-hash"
		};

		vi.mocked(repository.findUserByEmail).
		mockResolvedValue(null);

		vi.mocked(repository.findUserByUsername).
		mockResolvedValue(existingUser);

		await expect(registerUser(input)).
		rejects.toThrow("Username already exists");

		expect(repository.findUserByUsername).
		toHaveBeenCalledWith(input.username);

		expect(passwordHelper.hashPassword).
		not.toHaveBeenCalled();

		expect(repository.createUser).
		not.toHaveBeenCalled();
	});

	it("should propagate password hashing  errors", async() => {
		
		const input = {
			name: "Razaq",
			email: "new@example.com",
			username: "fakeUserName",
			password: "user123"
		};

		vi.mocked(repository.findUserByEmail).
		mockResolvedValue(null);

		vi.mocked(repository.findUserByUsername).
		mockResolvedValue(null);

		vi.mocked(passwordHelper.hashPassword).
		mockRejectedValue(new Error("Hashing failed"));

		await expect(registerUser(input)).
		rejects.toThrow("Hashing failed");

		expect(repository.createUser).
		not.toHaveBeenCalled();
	});

	it("should propagate repository errors", async() => {
		
		const input = {
			name: "Razaq",
			email: "new@example.com",
			username: "fakeUserName",
			password: "user123"
		};

		const fakeHashPassword = "hashed-password";

		vi.mocked(repository.findUserByEmail).
		mockResolvedValue(null);

		vi.mocked(repository.findUserByUsername).
		mockResolvedValue(null);

		vi.mocked(repository.createUser).
		mockRejectedValue(new Error("Database failure"));

		await expect(registerUser(input))
		.rejects.toThrow("Database failure");

		expect(repository.createUser).toHaveBeenCalledWith({
			name: input.name,
			email: input.email,
			username: input.username,
			password_hash: fakeHashPassword
		});
	});
})