import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";

describe("POST /api/posts", () => {

	let testUserId: number;

	beforeAll(async () => {
		const user = await prisma.users.create({
			data: {
				name: "Test User",
				email: "test@example.com",
				username: "testuser"
			}
		});

		testUserId = user.id;
	});

	afterAll(async () => {
		await prisma.comments.deleteMany();
		await prisma.posts.deleteMany();
		await prisma.users.deleteMany();

		await prisma.$disconnect();
	});

	it("should create a new post", async () => {

		const response = await request(app)
		.post("/api/posts")
		.send({
			title: "Learning Integration Testing",
			content: "Testing the complete application",
			user_id: testUserId
		});

		console.log(JSON.stringify(response.body, null, 2));
		expect(response.status).toBe(201);

		expect(response.body).toMatchObject({
			user_id: testUserId,
			title: "Learning Integration Testing",
			content: "Testing the complete application"
		});
	});
})