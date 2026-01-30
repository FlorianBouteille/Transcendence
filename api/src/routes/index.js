import { Router } from "express";
import { authRoutes } from "./auth.route.js";

export const routes = Router();

// Routes montees directement sur /api pas /api/auth
routes.use(authRoutes);
