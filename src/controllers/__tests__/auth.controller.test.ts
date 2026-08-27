import { describe, it, expect, beforeEach, vi } from "vitest";
import { register, login } from "../auth.controller.js";
import * as authService from "../../service/auth.service.js";

vi.mock("../../service/auth.service.js");

describe("")