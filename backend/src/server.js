import express from "express";
import http from "http";
import { Server } from "socket.io";
import { removePlayer, initGameServer, everyOneLoaded, updatePosition, initLobbyHandler } from './gameServer.js';
// import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true
	},
	path: "/ws",
	transports: ['websocket', 'polling']
});

initGameServer(io);

io.on("connection", (socket) => {
	initLobbyHandler(socket, io);


	// socket.on('playerReady', () => {
	// 	if (setPlayerReady(socket.id) == true) {
	// 		io.emit('start', 'ok');
	// 	}
	// });

	socket.on('gameLoaded', () => {
		console.log(`📩 Reçu gameLoaded de ${socket.id}`);
		if (everyOneLoaded(socket.id, socket.roomID) == true) {
			const timestamp = Date.now();
			io.to(socket.roomID).emit('startClock', timestamp);
		}
	});

	socket.on('playerPosition', (position) => {
		updatePosition(socket.id, socket.roomID, position);
	});

	socket.on('disconnect', () => {
		removePlayer(socket.id, socket.roomID);
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend listening on :${PORT}`);
});