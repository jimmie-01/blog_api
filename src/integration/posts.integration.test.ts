import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";
import { cleanDatabase, createTestUser } from "./helpers/database.js";
import { title } from "node:process";

describe("POST /api/posts", () => {

	let testUserId: number;

	beforeEach(async () => {
		await cleanDatabase();

		const user = await createTestUser();

		testUserId = user.id;
	});

	afterAll(async () => {
		await cleanDatabase();
		
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

		// console.log(JSON.stringify(response.body, null, 2));
		expect(response.status).toBe(201);

		expect(response.body).toMatchObject({
			user_id: testUserId,
			title: "Learning Integration Testing",
			content: "Testing the complete application"
		});

		const post = await prisma.posts.findUnique({
			where: {
				id: response.body.id
			}
		});

		expect(post).not.toBeNull();
		//This ensures the post was saved on the database

		expect(post).toMatchObject({
			user_id: testUserId,
			title: "Learning Integration Testing",
			content: "Testing the complete application"
		});
	});

	it("should return all posts", async () => {

		//Arrange
		const post1 = await prisma.posts.create({
			data: {
				title: "Learning TypeScript",
				content: "Typescript is powerful",
				user_id: testUserId
			}
		});

		const post2 = await prisma.posts.create({
			data: {
				title: "Learning PostgreSQL",
				content: "PostgreSQL is relaible",
				user_id: testUserId
			}
		});

		const post3 = await prisma.posts.create({
			data: {
				title: "Learning Integration Testing",
				content: "Testing the complete application",
				user_id: testUserId
			}
		});

		//Act
		const response = await request(app).get("/api/posts");

		//Assert
		expect(response.status).toBe(200);

		expect(response.body).toHaveLength(3);

		expect(response.body).toEqual(expect.arrayContaining([
			expect.objectContaining({
				id: post1.id,
				title: "Learning TypeScript"
			}),
			
			expect.objectContaining({
				id: post2.id,
				title: "Learning PostgreSQL"
			}),

			expect.objectContaining({
				id: post3.id,
				title: "Learning Integration Testing"
			})
		]))
	});

	it("should return a single post", async () => {

		const post = await prisma.posts.create({
			data: {
				title: "Learning Prisma",
				content: "Prisma makes database access easier",
				user_id: testUserId
			}
		});
		
		const response = 
		await request(app).get(`/api/posts/${post.id}`);

		expect(response.status).toBe(200);

		expect(response.body).toMatchObject({
			id: post.id,
			user_id: testUserId,
			title: "Learning Prisma",
			content: "Prisma makes database access easier"
		});
	});

	
})
