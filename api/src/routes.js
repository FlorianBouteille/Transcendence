import { Router } from "express";
import { checkAuthToken } from "./middlewares/auth.js";
import { register, login, verify2FA, logout } from "./controllers/auth.controller.js";
import { usersMePassword, usersMe2fa, usersMeDelete } from "./controllers/users.controller.js";
import * as prfls from "./controllers/profiles.controller.js";
import * as frds from "./controllers/friends.controller.js";
import { gamesHistory, gamesIdHistory, gamesSave } from "./controllers/games.controller.js";
import { getAllAchievements, getMyAchievements, getPlayerAchievements } from "./controllers/achievements.controller.js";
import { parseParams } from "./middlewares/params.js";

export const routes = Router();

// ---------- Authentication ----------
routes.post("/register", register);
routes.post("/login", login);
routes.post("/2fa/verify", verify2FA);
routes.post("/logout", logout);

// ---------- Server ----------
routes.post("/games", gamesSave);

// ---------- Authentication check ----------
routes.use("/", checkAuthToken);

routes.get("/me", (req, res) => res.status(200).json(req.user));

// ---------- Users ----------
routes.put("/users/me/password", checkAuthToken, usersMePassword);
routes.put("/users/me/2fa", checkAuthToken, usersMe2fa);
routes.put("/users/me", checkAuthToken, usersMeDelete);


// ---------- Profiles ----------
routes.get("/profiles", prfls.profiles);

routes.get("/profiles/me", prfls.profilesMe);
routes.get("/profiles/me/history", prfls.profilesMeHistory);

routes.put("/profiles/me/pseudonym", prfls.profilesMePseudonym);
routes.put("/profiles/me/bio", prfls.profilesMeBio);

routes.get("/profiles/:id" , prfls.profilesId);
routes.get("/profiles/:id/history", prfls.profilesIdHistory);


// ---------- Friends ----------
routes.get("/friends/me", frds.friendsMe);
routes.get("/friends/me/requests/received", frds.friendsMeRequestsReceived);
routes.get("/friends/me/requests/sent", frds.friendsMeRequestsSent);

routes.get("/friends/:id", frds.friendsId);

routes.post("/friends/me/requests/:friend_id", frds.friendsMeRequestsSend);

routes.put("/friends/me/requests/:friend_id", frds.friendsMeRequestsAccept);

routes.delete("/friends/me/:friend_id", frds.friendsMeDelete);
routes.delete("/friends/me/requests/:friend_id", frds.friendsMeRequestsReject)


// ---------- Games ----------
routes.get("/games", gamesHistory);
routes.get("/games/:id", parseParams({ id: 'int' }), gamesIdHistory);

// ---------- Achievements ----------
routes.get("/achievements", getAllAchievements);
routes.get("/achievements/me", getMyAchievements);
routes.get("/profiles/:id/achievements", getPlayerAchievements);
