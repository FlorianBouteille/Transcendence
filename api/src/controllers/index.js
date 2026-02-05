import { register, login } from "./auth.controller.js";
//import { userAccounts } from "./user-accounts.models.js";
import { profile } from "./profile.controller.js";
import { globalHistory } from "./history.controller.js";

// export all controllers functions in one object
export const ctrl = {
	register,
	login,
//	user,
	profile,
	globalHistory
};