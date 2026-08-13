import { describe, it, vi, expect } from "vitest";
import prisma from "../../lib/prisma.js";
import { findAllPosts, getPostById } from "../post.repository.js";

vi.mock("../../lib/prisma.js");

describe("Post Repository", () => {

	it("should return all post", async() => {

		const fakePost = [
			{
				id: 5,
				title: "Learning Testing"
			}
		];

		vi.spyOn(prisma.posts, "findMany").mockResolvedValue(fakePost);

		const result = await findAllPosts();

		expect(prisma.posts.findMany).toHaveBeenCalled();
		expect(result).toEqual(fakePost);

	});

	it("should return a post by id", async () => {
		
		const fakePost = {
			id: 3,
			title: "Mastering Testing"
		}

		vi.spyOn(prisma.posts, "findUnique").mockResolvedValueOnce(fakePost);

		const result = await getPostById(3);

		expect(prisma.posts.findUnique).toHaveBeenCalledWith({
			where: {
				id: 3
			}
		});
		expect(result).toEqual(fakePost);
	})
})