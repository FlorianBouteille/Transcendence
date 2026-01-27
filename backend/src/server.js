import express from "express";
import http from "http";
import { Server } from "socket.io";
// import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",  // Pour l'instant on autorise tout (dev only)
	},
	path: "/ws"
});
// const wss = new WebSocketServer({ server, path: "/ws" });

// wss.on("connection", (ws) => {
// 	ws.send(JSON.stringify({ type: "hello", msg: "ws connected" }));

// 	ws.on("message", (data) => {
// 		ws.send(JSON.stringify({ type: "echo", data: data.toString() }));
// 	});
// });
io.on("connection", (socket) => {
	console.log("Un joueur s'est connecté:", socket.id);

	// Envoyer un message de bienvenue
	socket.emit('welcome', { message: 'Connexion réussie!' });

	// Écouter un événement "test" depuis le client
	socket.on('test', (data) => {
		console.log('Message reçu du client:', data);
		socket.emit('response', { echo: data });
	});

	// Recevoir les inputs du joueur
	socket.on('playerInput', (data) => {
		console.log(`Joueur ${socket.id} - Touche:`, data.key, 'Pressée:', data.pressed);
	});

	// Déconnexion
	socket.on('disconnect', () => {
		console.log('Un joueur s\'est déconnecté:', socket.id);
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend listening on :${PORT}`);
});