import z from "zod";
import { registerSchema } from "../validation/auth.schema.js";

export type RegisterDto = z.infer<typeof registerSchema>;