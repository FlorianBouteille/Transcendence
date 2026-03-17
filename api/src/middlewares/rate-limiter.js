import rateLimit from "express-rate-limit";
import { API_RATE_LIMIT_MAX, API_RATE_LIMIT_WINDOW_MS } from "../config.js";

// Apply a rate limit for all routes
const apiLimiter = rateLimit({
  windowMs: API_RATE_LIMIT_WINDOW_MS,
  max: API_RATE_LIMIT_MAX,
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: { error: "Too many requests, please try again later." }
});

export default apiLimiter;