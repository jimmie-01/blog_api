import 
{ describe, 
	it, 
	vi, 
	expect, 
	beforeEach, 
	afterAll } 
	from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";
import { hashPassword } from "../utils/password.js";
import { cleanDatabase } from "./helpers/database.js";
import { createTestUser } from "./helpers/factories.js";

describe("POST /api/auth/register", () => {

	beforeEach( async () => {
		await cleanDatabase();
	});

	afterAll(async () => {
		await cleanDatabase();

		await prisma.$disconnect();
	});

	it("should register a new user", async () => {

		const response = await request(app).
		post("/api/auth/register").
		send({
			name: "Razaq",
			email: "razaq@example.com",
			username: "jimmie-01",
			password: "user-password"
		});

		expect(response.status).toBe(201);

		expect(response.body).toMatchObject({
			message: "User created successfully",
			user: response.body.user
		});

		const user = await prisma.users.findUnique({
			where: {
				email: response.body.user.email
			}
		});

		expect(user).not.toBeNull();

		expect(user).toMatchObject({
			name: "Razaq",
			email: "razaq@example.com",
			username: "jimmie-01"
		});
	})
});

describe("POST /api/auth/login", () => {

	beforeEach(async() => {
		await cleanDatabase();
	});

	it("should login an existing user", async () => {

		const password = "user-password123";
		
		const passwordHash = await hashPassword(password);

		const user = await prisma.users.create({
			data: {
				name: "Razaq",
				email: "razaq@example.com",
				username: "jimmie-01",
				password_hash: passwordHash
			}
		});

		const response = await request(app).
		post("/api/auth/login").
		send({
			email: "razaq@example.com",
			password
		});

		expect(response.status).toBe(200);

	})
})