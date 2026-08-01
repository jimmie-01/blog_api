import { z } from "zod";
import { updatePostSchema } from "../validation/post.schema.js";

export type UpdatePostDto = z.infer< typeof updatePostSchema >;