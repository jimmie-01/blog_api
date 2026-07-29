import { z } from "zod";
import { createPostSchema } from "../validation/post.schema.js";

export type CreatePostDto = z.infer< typeof createPostSchema >;