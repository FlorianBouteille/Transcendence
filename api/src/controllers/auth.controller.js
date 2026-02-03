import { db } from "../db/index.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const SALT_ROUNDS = 10;

// Stockage temporaire des codes 2FA (en memoire)
const pending2FACodes = new Map();

// Configuration du transporter mail
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: process.env.SMTP_PORT || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
});

export async function register(req, res) {
	const { username, email, password, confirmPassword } = req.body;

	if (!username || !email || !password || !confirmPassword) {
		return res.status(400).json({ error: "Tous les champs sont requis" });
	}

	if (password !== confirmPassword) {
		return res.status(400).json({ error: "Mots de passe non similaires" });
	}

	const hasMinLength = password.length >= 10;
	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

	if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
		return res.status(400).json({
			error: "Mot de passe faible (min 10 car., 1 maj., 1 min., 1 chiffre, 1 special)"
		});
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

		const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

		const user = await db.models.userAccounts.create({
			username,
			email,
			password_hash
		});

		res.json({ success: true, user: { id: user.id, email: user.email } });
	} catch (err) {
		console.error("Register error:", err);
		res.status(500).json({ error: "Erreur serveur" });
	}
}

export async function login(req, res) {
	const { login, password } = req.body;

	if (!login || !password) {
		return res.status(400).json({ error: "Tous les champs sont requis" });
	}

	try {
		const user = await db.models.userAccounts.findOne({
			where: {
				[db.models.userAccounts.sequelize.Sequelize.Op.or]: [
					{ email: login },
					{ username: login }
				]
			}
		});

		// if (!user) {
		// 	return res.status(401).json({ error: "Utilisateur non trouve" });
		// }

		const passwordValid = await bcrypt.compare(password, user.password_hash);
		if (!user || !passwordValid) {
			return res.status(401).json({ error: "Mot de passe ou login incorrect" });
		}

		if (user.enable_2FA) {
			// Generer un code a 6 chiffres
			const code = Math.floor(100000 + Math.random() * 900000).toString();

			pending2FACodes.set(user.id, {
				code,
				expires: Date.now() + 5 * 60 * 1000
			});

			// Envoyer le mail
			await transporter.sendMail({
				to: user.email,
				subject: 'Ton code de connexion',
				text: `Ton code de verification est : ${code}`
			});

			return res.json({
				success: true,
				requires_2FA: true,
				user_id: user.id
			});
		}

		const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

		res.json({
			success: true,
			requires_2FA: false,
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				enable_2FA: user.enable_2FA
			}
		});


	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Erreur serveur" });
	}
}

export async function verify2FA(req, res) {
	const { user_id, code } = req.body;

	if (!user_id || !code) {
		return res.status(400).json({ error: "User ID et code requis" });
	}

	try {
		const user = await db.models.userAccounts.findByPk(user_id);

		if (!user) {
			return res.status(404).json({ error: "Utilisateur non trouve" });
		}

		// Recuperer le code stocke
		const stored = pending2FACodes.get(parseInt(user_id));

		if (!stored) {
			return res.status(401).json({ error: "Aucun code en attente" });
		}

		// Verifier expiration
		if (Date.now() > stored.expires) {
			pending2FACodes.delete(parseInt(user_id));
			return res.status(401).json({ error: "Code expire" });
		}

		// Verifier le code
		if (code !== stored.code) {
			return res.status(401).json({ error: "Code invalide" });
		}

		// Code valide - supprimer et generer le token
		pending2FACodes.delete(parseInt(user_id));

		const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

		res.json({
			success: true,
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				enable_2FA: user.enable_2FA
			}
		});
	} catch (err) {
		console.error("2FA verify error:", err);
		res.status(500).json({ error: "Erreur serveur" });
	}
}
