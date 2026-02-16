import { Router } from "express";
import { register, login, verify2FA } from "./controllers/auth.controller.js";
import { usersMePassword, usersMe2fa, usersMeDelete } from "./controllers/users.controller.js";
import * as prfls from "./controllers/profiles.controller.js";
import { gamesHistory, gamesIdHistory, gamesSave } from "./controllers/games.controller.js";
import { checkPlayerId } from "./middlewares/check_player_id.js"
import { parseParams } from "./middlewares/params.js";

export const routes = Router();

// ---------- Authentication ----------
routes.post("/register", register);
routes.post("/login", login);
routes.post("/2fa/verify", verify2FA);

// ---------- Users ----------
routes.put("/users/me/password", usersMePassword);
routes.put("/users/me/2fa", usersMe2fa);
routes.put("/users/me", usersMeDelete);

// ---------- Profiles ----------
routes.get("/profiles", prfls.profiles);
routes.get("/profiles/me", prfls.profilesMe);
routes.get("/profiles/me/history", prfls.profilesMeHistory);
routes.get("/profiles/:id", checkPlayerId , prfls.profilesId);
routes.get("/profiles/:id/history", checkPlayerId, prfls.profilesIdHistory);

routes.put("/profiles/me", prfls.profilesmePseudonym);
routes.put("/profiles/me", prfls.profilesMeBio);

// ---------- Games ----------
routes.get("/games", gamesHistory);
routes.get("/games/:id", parseParams({id: 'int'}), gamesIdHistory);

routes.post("/games", gamesSave);
