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
	});

	it("should reject a password less than 8 characters and return 400", async () => {

		const response = await request(app).
		post("/api/auth/register").
		send({
			name: "Razaq",
			email: "razaq@example.com",
			username: "jimmie-01",
			password: "pass123"
		});

		expect(response.status).toBe(400);

		expect(response.body.message).toBe("Validation failed");

	});

	it("should reject an email that already exist", async () => {

		const password = "password123";

		const passwordHash = await hashPassword(password);

		const user = await prisma.users.create({
			data: {
				name: "Asiyah",
				email: "asiyah@example.com",
				username: "jimmie-01",
				password_hash: passwordHash
			}
		});

		const response = await request(app).
		post("/api/auth/register").
		send({
			name: "Asiyah Fakile",
			email: user.email,
			username: user.username,
			password
		});

		expect(response.status).toBe(409);
		expect(response.body.message).toBe("Email already exists");
	});

	it("should reject a username that already exist", async() => {

		const password = "password123";

		const passwordHash = await hashPassword(password);

		const user = await prisma.users.create({
			data: {
				name: "Asiyah",
				email: "asiyah@example.com",
				username: "jimmie-01",
				password_hash: passwordHash
			}
		});

		const response = await request(app).
		post("/api/auth/register").
		send({
			name: "Asiyah Fakile",
			email: "razaq@exapmle.com",
			username: user.username,
			password
		});

		expect(response.status).toBe(409);
		expect(response.body.message).toBe("Username already exist");
	});
});

describe("POST /api/auth/login", () => {

	beforeEach(async() => {
		await cleanDatabase();
	});

	it("should login an existing user", async () => {

		const password = "user-password123";
		
		const passwordHash = await hashPassword(password);

		await prisma.users.create({
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

		expect(response.body).toEqual({
			message: "Login Successful",
			user: {
				id: expect.any(Number),
				name: "Razaq",
				email: "razaq@example.com",
				username: "jimmie-01"
			}
		});
	});

	it("should reject incorrect password", async() => {
		
		const password = "user-password123";

		const passwordHash = await hashPassword(password);

		await prisma.users.create({
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
			password: "wrongpassword"
		});

		expect(response.status).toBe(401);

		expect(response.body.message).toBe("Invalid credentials");

	});

	it("should reject non-existing user", async () => {

		const response = await request(app).
		post("/api/auth/login").
		send({
			email: "nonexixstinguser@example.com",
			password: "password123"
		});

		expect(response.status).toBe(401);

		expect(response.body.message).toBe("Invalid credentials");
	});

	it("should reject an invalid email", async() => {

		const response = await request(app).
		post("/api/auth/login").
		send({
			email: "non-an-email",
			password: "password123"
		});

		expect(response.status).toBe(400);

		expect(response.body.message).toBe("Validation failed")
	});

	it("should reject missing password", async () => {

		const response = await request(app).
		post("/api/auth/login").
		send({
			email: "razaq@example.com"
		});

		expect(response.status).toBe(400);

		expect(response.body.message).toBe("Validation failed");
	})
})