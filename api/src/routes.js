import { Router } from "express";
import { ctrl } from "./controllers/index.js";


export const routes = Router();

// ---------- TEST ----------
routes.get("/", (req, res) => res.json({ msg: "You are at the api root" }));

routes.get("/test", (req, res) => res.send("<h1>You are a test</h1>"));

// ---------- Authentication ----------
routes.post("/register", ctrl.register);
routes.post("/login", ctrl.login);

// ---------- Profile ----------
routes.get("/profile", ctrl.profile);
//routes.get("/user", ctrl.user);

// ---------- History ----------
routes.get("/history/global", ctrl.globalHistory);
// routes.post("/history/player", ctrl.history);

