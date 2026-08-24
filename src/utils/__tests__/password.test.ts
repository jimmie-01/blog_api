import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../password.js";


describe("Auth Password", () => {

	it("should return a hashed password", async () => {
		
		const userPassword = "last123";

		const result = await hashPassword(userPassword);

		expect(result).not.toBe(userPassword);

		expect(result).toBeTypeOf("string");
	});

	it("should create a hash that can be verified", async () => {
		const userPassword = "user1234";

		const passwordHash = await hashPassword(userPassword);

		const result = await comparePassword(userPassword, passwordHash);

		expect(result).toBe(true);
	});

	it("should reject an incorrect passworrd", async () => {
		const userPassword = "user3456";

		const wrongPassword = "wrongUser123";

		const passwordHash = await hashPassword(userPassword);

		const result = await comparePassword(wrongPassword, passwordHash);

		expect(result).toBe(false);
	})
})