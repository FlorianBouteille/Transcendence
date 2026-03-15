import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { db } from "../db/index.js";

export async function checkAuthToken(req, res, next) {
	const token = req.cookies?.auth_token;

	console.log("token -> ", token);

	if (!token) {
		return res.status(401).json({ error: "No token, authorization denied" });
	}

	try {
		// 1. Verify token validity
		const decoded = jwt.verify(token, JWT_SECRET);
		console.log("✅ Decoded JWT payload:", decoded);

		// 2. Check that user still exists in database
		const user = await db.models.userAccounts.findByPk(decoded.id);
		console.log("✅ User from DB:", user);
		if (!user) {
			res.clearCookie("auth_token", { httpOnly: true, sameSite: "strict" });
			return res.status(401).json({ error: "User doesn't exists" });
		}

		req.user = user;

		next();
	} catch (err) {
		console.error("JWT verification failed:", err);
		return res.status(401).json({ error: "Token is invalid or expired" });
	}
}