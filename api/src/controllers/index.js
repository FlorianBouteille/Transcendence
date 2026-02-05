import { register, login, verify2FA } from "./auth.controller.js";
import { profile } from "./profile.controller.js";
import { globalHistory, playerHistory } from "./history.controller.js";

// export all controllers functions in one object
export const ctrl = {
	register,
	login,
	verify2FA,
	profile,
	globalHistory,
	playerHistory
};