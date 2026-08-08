import { describe, it, expect, vi } from "vitest";
import { createPost } from "../post.controller.js";
import * as service from "../../service/post.service.js";

vi.mock("../../service/post.service.js");

