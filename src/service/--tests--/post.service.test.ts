import { describe, it, expect, vi } from "vitest";
import * as repository from "../../repositories/post.repository.js";
import { getAllPosts } from "../post.service.js";

vi.mock("../../repositories/post.repository.js");

describe("Post Service", () => {

	it("should return all posts", async () => {

		const fakePosts = [
			{
				id: 1,
				title: "Learning Unit Testing With Typscirpt"
			}
		];

		vi.spyOn(repository, "findAllPosts").mockResolvedValue(fakePosts);

		const result = await getAllPosts();

		expect(result).toEqual(fakePosts);
	});
});
