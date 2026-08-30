import 
{ describe, 
	it, 
	vi, 
	expect, 
	beforeEach, 
	afterAll } 
	from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";
import { cleanDatabase } from "./helpers/database.js";