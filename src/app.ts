import express from "express";
import postRoutes from "./routes/post.routes.js";
import { logger } from "./middleware/logger.middleware.js";


const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/posts", postRoutes);

export default app;