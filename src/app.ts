import express from "express";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import { logger } from "./middleware/logger.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";


const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use(errorHandler);

export default app;