import { db } from "../db/index.js";
import bcrypt from "bcrypt";

/**
 * Update your password
 */
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";

export async function usersMePassword(req, res) {
	try {
		const { oldPassword, newPassword, confirmPassword } = req.body;

		if (!oldPassword || !newPassword || !confirmPassword) {
			return res.status(400).json({ error: "All password fields are required" });
		}

		if (newPassword !== confirmPassword) {
			return res.status(400).json({ error: "Passwords do not match" });
		}

		const hasMinLength = newPassword.length >= 10;
		const hasUppercase = /[A-Z]/.test(newPassword);
		const hasLowercase = /[a-z]/.test(newPassword);
		const hasNumber = /[0-9]/.test(newPassword);
		const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

		if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
			return res.status(400).json({
				error: "Weak password (min 10 char..., 1 upper..., 1 lower..., 1 digit, 1 special)"
			});
		}

		const user = await db.models.userAccounts.findByPk(req.user.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
		if (!isMatch) {
			return res.status(401).json({ error: "Old password is incorrect" });
		}

		const hashed = await bcrypt.hash(newPassword, 10);

		await db.models.userAccounts.update(
			{ password_hash: hashed },
			{ where: { id: req.user.id } }
		);

		return res.json({ message: "Password updated successfully" });

	} catch (error) {
		console.error("Error in usersMePassword:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}


/**
 * Enable or disable 2FA
 */
export async function usersMe2fa(req, res) {
	try {
		const { enable2FA } = req.body;
		if (typeof enable2FA !== "boolean") return res.status(400).json({ error: "enable2FA must be boolean" });

		await db.models.userAccounts.update(
			{ two_fa_enabled: enable2FA },
			{ where: { id: req.user.id } }
		);

		res.json({ message: `2FA ${enable2FA ? "enabled" : "disabled"}` });
	} catch (error) {
		console.error("Error in usersMe2fa:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * Delete your user account
 */
export async function usersMeDelete(req, res) {
	try {
		await db.models.userAccounts.destroy({ where: { id: req.user.id } });
		res.json({ message: "User account deleted successfully" });
	} catch (error) {
		console.error("Error in \'usersMeDelete\' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
