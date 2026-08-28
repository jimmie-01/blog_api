import { describe, it, expect, beforeEach, vi } from "vitest";
//import { Request, Response} from "express";
import { register, login } from "../auth.controller.js";
import * as authService from "../../service/auth.service.js";
import { hashPassword } from "../../utils/password.js";

vi.mock("../../service/auth.service.js");

describe("Auth Controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 201 and the registered user", async () => {

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
			name: "Kim Jimmie",
			email: "kin2Expamle.com",
			username: "jimmie-01",
		};

		vi.mocked(authService.registerUser).mockResolvedValue(fakeUser);
	})
})