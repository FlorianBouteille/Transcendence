import { Router } from "express";
import { register, login, verify2FA } from "../controllers/auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/2fa/verify", verify2FA);
