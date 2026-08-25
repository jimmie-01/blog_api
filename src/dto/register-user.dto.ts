import z from "zod";
import { createUserSchema, registerUserSchema } from "../validation/auth.schema.js";

export type RegisterUserDto = z.infer<typeof registerUserSchema>;

export type createUserDto = z.infer<typeof createUserSchema>;