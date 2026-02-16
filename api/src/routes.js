import { Router } from "express";
import { register, login, verify2FA } from "./controllers/auth.controller.js";
import { profiles, profilesMe, profilesMeHistory, profilesId, profilesIdHistory } from "./controllers/profiles.controller.js";
import { gamesHistory, gamesIdHistory, gamesSave } from "./controllers/games.controller.js";
import { checkPlayerId } from "./middlewares/check_player_id.js"
import { parseParams } from "./middlewares/params.js";

export const routes = Router();

// ---------- Authentication ----------
routes.post("/register", register);
routes.post("/login", login);
routes.post("/2fa/verify", verify2FA);

// ---------- Profiles ----------
routes.get("/profiles", profiles);
// routes.get("/profiles/history", profilesMe);
routes.get("/profiles/me", profilesMe);
routes.get("/profiles/me/history", profilesMeHistory);
routes.get("/profiles/:id", checkPlayerId , profilesId);
routes.get("/profiles/:id/history", checkPlayerId, profilesIdHistory);

// ---------- Games ----------
routes.get("/games", gamesHistory);
routes.get("/games/:id", parseParams({id: 'int'}), gamesIdHistory);
routes.post("/games", gamesSave);
