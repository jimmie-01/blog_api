import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Request, Response, NextFunction, response } from "express";
import { register, login } from "../auth.controller.js";
import * as authService from "../../service/auth.service.js";

vi.mock("../../service/auth.service.js");

describe("Register", () => {
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

		vi.mocked(authService.registerUser).
		mockRejectedValue(error);

		await register(req, res, next);

		expect(next).toHaveBeenCalledWith(error);

		expect(res.status).not.toHaveBeenCalled();

		expect(res.json).not.toHaveBeenCalled();
	});
});

describe("Login", () => {
	
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sholud login a user and return 200", async () => {

		const req = {
			body: {
				name: "Razaq",
				email: "razaq@example.com",
				username: "jmmie-01",
				password: "userpassword"
			}
		} as unknown as Request;

		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn()
		} as unknown as Response;

		const next = vi.fn();

		const fakeUser = {
			name: "Razaq",
			email: "razaq@example.com",
			username: "jimmie@example.com",
			password_hash: "Hash-Passord",
			id: 52
		};

		const { password_hash, ...safeUser} = fakeUser;

		vi.mocked(authService.loginUser).mockResolvedValue(fakeUser)

		await login(req, res, next);

		expect(authService.loginUser).toHaveBeenCalledWith(req.body);

		expect(res.status).toHaveBeenCalledWith(200);

		expect(res.json).toHaveBeenCalledWith({
			message: "Login Successful",
			user: safeUser
		});
	});
})