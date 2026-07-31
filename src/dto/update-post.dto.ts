import { z } from "zod";
import { updatePostSchema } from "../validation/post.schema.js";

export type UdatePostDto = z.infer<typeof updatePostSchema>;