import { Router } from "express";
import { ctrl } from "./controllers/index.js";


export const routes = Router();

// ---------- TEST ----------
routes.get("/", (req, res) => res.json({ msg: "You are at the api root" }));

routes.get("/test", (req, res) => res.send("<h1>You are a test</h1>"));

// ---------- Authentication ----------
routes.post("/register", ctrl.register);
routes.post("/login", ctrl.login);
routes.post("/2fa/verify", ctrl.verify2FA);

// ---------- User infos ----------
routes.get("/profile", ctrl.profile);
// routes.post("/settings", ctrl.profile);
//routes.get("/user", ctrl.user);

// ---------- History ----------
routes.get("/history/global", ctrl.globalHistory);
routes.get("/history/player", ctrl.playerHistory);

// routes.post("/history/player", ctrl.history);

