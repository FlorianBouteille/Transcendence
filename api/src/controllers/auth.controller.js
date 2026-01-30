import { db } from "../db/index.js";

export async function register(req, res) {
	const { username, email, password, confirmPassword } = req.body;

	if (!username || !email || !password || !confirmPassword) {
		return res.status(400).json({ error: "Tous les champs sont requis" });
	}

	if (password !== confirmPassword) {
		return res.status(400).json({ error: "Mots de passe non similaires" });
	}

	try {
		const existingUser = await db.models.userAccounts.findOne({
			where: { email }
		});

		if (existingUser) {
			return res.status(400).json({ error: "Email deja utilise" });
		}

		const existingUsername = await db.models.userAccounts.findOne({
			where: { username }
		});

		if (existingUsername) {
			return res.status(400).json({ error: "Username deja utilise" });
		}

		const user = await db.models.userAccounts.create({
			username,
			email,
			password_hash: password  // TODO: hasher avec bcrypt
		});

		res.json({ success: true, user: { id: user.id, email: user.email } });
	} catch (err) {
		console.error("Register error:", err);
		res.status(500).json({ error: "Erreur serveur" });
	}
}

export async function login(req, res) {
	// Plus tard: password check, token, etc.
}
