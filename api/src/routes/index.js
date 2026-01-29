import { Router } from "express";
import { authRoutes } from "./auth.route.js";

export const routes = Router();

routes.use("/auth", authRoutes);
