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
	})
})