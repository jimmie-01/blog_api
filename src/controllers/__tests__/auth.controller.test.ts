import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { register, login } from "../auth.controller.js";
import * as authService from "../../service/auth.service.js";

vi.mock("../../service/auth.service.js");

describe("Auth Controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should register a user and return 201", async () => {

		const req = {
			body: {
				name: "Fakile Razaq",
				email: "razaq@example.com",
				username: "jimmie-01",
				password: "jimmie1234"
			}
		}as unknown as Request;

		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn()
		} as unknown as Response;

		const next = vi.fn();

		const fakeUser = {
			name: "Fakile Razaq",
			email: "razaq@expamle.com",
			username: "jimmie-01",
			password_hash: "iu59#0ibkn$n89%acyt*&buvoir",
			id: 86
		};

		const {password_hash, ...safeUser} = fakeUser;

		vi.mocked(authService.registerUser).
		mockResolvedValue(fakeUser);

		await register(req, res, next);

		expect(authService.registerUser).
		toHaveBeenCalledWith(req.body);

		expect(res.status).toHaveBeenCalledWith(201);

		expect(res.json).toHaveBeenCalledWith({
			message: "User created successfully",
			user: safeUser
		});
	});

	it("should pass registration errors to next", async () => {

		const req = {
			body: {
				name: "Fakile Razaq",
				email: "razaq@example.com",
				username: "jimmie-01",
				password: "jimmie1234"
			}
		}as unknown as Request;

		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn()
		}as unknown as Response;

		const next = vi.fn();

		const error = new Error("Database Failure!");

		vi.mocked(authService.registerUser).mockRejectedValue(error);

		await register(req, res, next);

		expect(next).toHaveBeenCalledWith(error);

		expect(res.status).not.toHaveBeenCalled();

		expect(res.json).not.toHaveBeenCalled();
	})
})