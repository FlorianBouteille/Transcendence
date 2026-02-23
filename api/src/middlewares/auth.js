import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export function checkAuthToken(req, res, next) {
	const token = req.cookies?.auth_token;

	if (!token) {
		return res.status(401).json({ error: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		console.error("JWT verification failed:", err);
		return res.status(401).json({ error: "Token is invalid or expired" });
	}
}