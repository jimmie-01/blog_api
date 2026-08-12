import { describe, it, expect, vi } from "vitest";
import { Request, Response } from "express";
import { createPost } from "../post.controller.js";
import * as service from "../../service/post.service.js";

vi.mock("../../service/post.service.js");

describe("Post Controller", () => {
	it("should return 201 and the created post when the service succeeds", async () => {
		const req = {
			body: {
				title: "Learning Testing",
				content: "Controllers are fun.",
				user_id: 1
			}
		} as unknown as Request;

		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn()
		} as unknown as Response;

		const next = vi.fn();

		const fakePost = {
			id: 1,
			title: "Learning Unit Testing"
		};

		vi.spyOn(service, "createNewPost").mockResolvedValue(fakePost);

		await createPost(req, res, next);

		expect(service.createNewPost).toHaveBeenCalledWith(req.body);
		// This proves the controller called the sevice correctly

		expect(res.status).toHaveBeenCalledWith(201);

		expect(res.json).toHaveBeenCalledWith(fakePost);
	});

	
})