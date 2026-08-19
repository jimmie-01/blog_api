import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";
import { cleanDatabase } from "./helpers/database.js";
import { createTestPost, createTestUser } from "./helpers/factories.js";

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
		const post1 = await createTestPost(testUserId, {
			title: "Learning TypeScript",
			content: "Typescript is powerful"
		});

		const post2 = await createTestPost(testUserId, {
			title: "Learning PostgreSQL",
			content: "PostgreSQL is relaible",
		});

		const post3 = await createTestPost(testUserId,{
				title: "Learning Integration Testing",
				content: "Testing the complete application",
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

		const post = await createTestPost(testUserId, {
				title: "Learning Prisma",
				content: "Prisma makes database access easier",
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

	it("should return 404 when the post does not exists", async () => {

		const response = 
		await request(app).get("/api/posts/9999");

		expect(response.status).toBe(404);
	});

	it("should update an existing post", async () => {

		const post = await createTestPost(testUserId, {
				title: "Original title",
				content: "original content",
			});

		const response = 
		await request(app).patch(`/api/posts/${post.id}`)
		.send({
			title: "Updated title",
			content: "Updated content"
		});

		expect(response.status).toBe(200);

		expect(response.body).toMatchObject({
			user_id: testUserId,
			title: "Updated title",
			content: "Updated content"
		});

		const updatedPost = 
		await prisma.posts.findUnique({
			where: {
				id: post.id
			}
		});

		expect(updatedPost).toMatchObject({
			id: post.id,
			user_id: testUserId,
			title: "Updated title",
			content: "Updated content"
		});
	});

	it("should return 404 when updating a post that does not exist", async () => {

		const response = 
		await request(app).patch("/api/posts/99999")
		.send({
			title: "Updated Title"
		});

		expect(response.status).toBe(404);
	});

	it("should return 400 when the update body is empty", async () => {

		const post = await createTestPost(testUserId, {
				title: "Original Post",
				content: "Original Content",
			});

		const response = 
		await request(app).patch(`/api/posts/${post.id}`)
		.send({});

		expect(response.status).toBe(400);
	});

	it("should return 400 when the update data is invalid", async () => {

		const post = await createTestPost(testUserId, {
				title: "Original Post",
				content: "Original Content",
			});

		const response = 
		await request(app).patch(`/api/posts/${post.id}`)
		.send({
			title: 123
		});

		expect(response.status).toBe(400);
	});

	it("should delete an existing post", async () => {

		const post = await createTestPost(testUserId, {
				title: "Post to delete",
				content: "This post should be deleted",
			});

		const response = 
		await request(app).delete(`/api/posts/${post.id}`);

		expect(response.status).toBe(204);

		const deletedPost = 
		await prisma.posts.findUnique({
			where: {
				id: post.id
			}
		});

		expect(deletedPost).toBeNull();
	});

	it("should return 404 when deleting a post that does not exist", async () => {

		const response = 
		await request(app).delete("/api/posts/99999");

		expect(response.status).toBe(404);
	});

	it("should reject a post with an empty title", async () => {

		const response = 
		await request(app).post("/api/posts")
		.send({
			title: "",
			content: "Testing Edge Cases",
			user_id: testUserId
		});

		expect(response.status).toBe(400);
	});

	it("should reject a post with empty content", async () => {

		const response = 
		await request(app).post("/api/posts").send({
			title: "A Valid Title",
			content: "",
			user_id: testUserId
		});

		expect(response.status).toBe(400);
	});

	it("should reject a post when title is missing", async () => {

		const response = 
		await request(app).post("/api/posts").send({
			content: "A Valid Content",
			user_id: testUserId
		});

		expect(response.status).toBe(400);
	});

	it("should reject a title when title is not a string", async () => {

		const response = 
		await request(app).post("/api/posts").send({
			title: 123,
			content: "A Valid Content",
			user_id: testUserId
		});

		expect(response.status).toBe(400);
	});

	it("should accept a title with exactly 100 chharacters", async () => {

		const title = "A".repeat(100);

		const response = 
		await request(app).post("/api/posts").send({
			title,
			content: "A Valid Content",
			user_id: testUserId
		});

		expect(response.status).toBe(201);
	});

	it("should reject a title longer than 100 chharacters", async () => {
		
		const title = "A".repeat(101);

		const response = 
		await request(app).post("/api/posts").send({
			title,
			content: "A Valid Content",
			user_id: testUserId
		});

		expect(response.status).toBe(400);
	});
})
