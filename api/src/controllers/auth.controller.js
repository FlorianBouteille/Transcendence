import { db } from "../db/index.js";

export async function register(req, res) {
	try {
		const { username, email, password } = req.body;

		const existingUser = await db.models.userAccounts.findOne({
			where: { email }
		});

		if (existingUser) {
			return res.status(400).json({ error: "Email already registered" });
		}

		const user = await db.models.userAccounts.create({
			username,
			email,
			password_hash: password
		});

		res.status(201).json({ id: user.id, email: user.email });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

export async function login(req, res) {
	// later: password check, token, etc.
}
