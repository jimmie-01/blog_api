import { describe, it, expect, vi, beforeEach } from "vitest";
import * as repository from "../../repositories/post.repository.js";
import { findPostById, getAllPosts } from "../post.service.js";

vi.mock("../../repositories/post.repository.js");

describe("Post Service", () => {

	beforeEach(() => {
		vi.clearAllMocks();
	});

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

	it("should return a unique post", async () => {
		const fakePosts =
			{
				id: 1,
				title: "Learning Unit Testing With Typscript"
			};

		const spy = vi.spyOn(repository, "getPostById").mockResolvedValue(fakePosts);

		const result = await findPostById(1);

		expect(spy).toHaveBeenCalledWith(1);
		expect(result).toEqual(fakePosts);
	});

	it("should throw NotFoundError when post does not exist", async () => {
		
		vi.spyOn(repository, "getPostById").mockResolvedValue(null);
		
		await expect(findPostById(1)).rejects.toThrow("Post Not Found");
	});
});
