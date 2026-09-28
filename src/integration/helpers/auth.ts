import request from "supertest";
import app from "../../app.js";

export const registerTestUser = async (
	overrides: Partial<{
		names: string;
		email: string;
		username: string;
		password: string;
	}> = {}
) => {
	const user = {
		user: "Test User",
		email: `test-${Date.now()}@example.com`,
		username: `testuser-${Date.now()}`,
		password: "Password123!",
		...overrides
	};

	const response = 
	await request(app).post("/api/auth/register")
	.send(user);

	return {
		input: user,
		response
	};
};

export const loginTestUser = async (email: string, password: string) => {
	return request(app)
	.post("/api/auth/login")
	.send({
		email,
		password
	});
};