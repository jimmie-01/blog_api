import { describe, it, expect, vi } from "vitest";
import * as repository from "../../repositories/post.repository.js";
import { findPostById, getAllPosts } from "../post.service.js";
import { NotFoundError } from "../../errors/bad-request.error.js";

vi.mock("../../repositories/post.repository.js");

describe("Post Service", () => {

	it("should return all posts", async () => {

		const fakePosts = [
			{
				id: 1,
				title: "Learning Unit Testing With Typscript"
			}
		];

		vi.spyOn(repository, "findAllPosts").mockResolvedValue(fakePosts);

		const result = await getAllPosts();

		expect(result).toEqual(fakePosts);
	});
});

describe("getPostById", () => {

	it("should throw NotFoundError when post does not exist", async () => {

		vi.spyOn(repository, "getPostById").mockResolvedValue(null);
		
		await expect(findPostById(1)).rejects.toThrow("Post Not Found");
	});
});
