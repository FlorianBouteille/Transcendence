import rateLimit from "express-rate-limit";

// Apply a rate limit for all routes
const apiLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Limit each IP to 5 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: { error: "Too many requests, please try again later." }
});

export default apiLimiter;