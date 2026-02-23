import { Router } from "express";
import { register, login, verify2FA, logout } from "./controllers/auth.controller.js";
import { usersMePassword, usersMe2fa, usersMeDelete } from "./controllers/users.controller.js";
import * as prfls from "./controllers/profiles.controller.js";
import { gamesHistory, gamesIdHistory, gamesSave } from "./controllers/games.controller.js";
import { checkPlayerId } from "./middlewares/check_player_id.js"
import { parseParams } from "./middlewares/params.js";
import { checkAuthToken } from "./middlewares/auth.js";

export const routes = Router();

// ---------- Authentication ----------
routes.get("/me", checkAuthToken, (req, res) => res.status(200).json(req.user));

routes.post("/register", register);
routes.post("/login", login);
routes.post("/2fa/verify", verify2FA);
routes.post("/logout", logout);

// ---------- Users ----------
routes.put("/users/me/password", usersMePassword);
routes.put("/users/me/2fa", usersMe2fa);
routes.put("/users/me", usersMeDelete);

// ---------- Profiles ----------
routes.get("/profiles", prfls.profiles);
routes.get("/profiles/me", checkAuthToken, prfls.profilesMe);
routes.get("/profiles/me/history", checkAuthToken, prfls.profilesMeHistory);
routes.get("/profiles/:id", checkAuthToken , prfls.profilesId);
routes.get("/profiles/:id/history", checkAuthToken, prfls.profilesIdHistory);

routes.put("/profiles/me/pseudonym", prfls.profilesMePseudonym);
routes.put("/profiles/me/bio", prfls.profilesMeBio);

// ---------- Games ----------
routes.get("/games", gamesHistory);
routes.get("/games/:id", parseParams({id: 'int'}), gamesIdHistory);

routes.post("/games", gamesSave);
