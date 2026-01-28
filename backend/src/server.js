import express from "express";
import http from "http";
import { Server } from "socket.io";
import { addPlayer, removePlayer, updatePlayerInput, initGameServer, setPlayerReady, everyOneLoaded, updatePosition } from './gameServer.js';
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

initGameServer(io);

io.on("connection", (socket) => {
	addPlayer(socket.id);

	socket.on('test', (data) => {
		console.log('Message reçu du client:', data);
		socket.emit('response', { echo: data });
	});

	socket.on('playerInput', (data) => {
		updatePlayerInput(socket.id, data.key, data.pressed);
	});

	socket.on('playerReady', () => {
		if (setPlayerReady(socket.id) == true)
		{
			io.emit('start', 'ok');  // io.emit pour envoyer à TOUS les clients
		}
	});

	socket.on('gameLoaded', () => {
		console.log(`📩 Reçu gameLoaded de ${socket.id}`);
		if (everyOneLoaded(socket.id) == true)
		{
			const timestamp = Date.now();
			io.emit('startClock', timestamp);
		}
	});

	socket.on('playerPosition', (position) => {
		updatePosition(socket.id, position);
	});

	socket.on('disconnect', () => {
		removePlayer(socket.id);
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend listening on :${PORT}`);
});