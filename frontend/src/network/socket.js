// export function connectWS() {
//   const proto = window.location.protocol === "https:" ? "wss" : "ws";
//   const ws = new WebSocket(`${proto}://${window.location.host}/ws`);
//   return ws;
// }

import { io } from 'socket.io-client';

export function connectWS() {
	// Si on est sur le port 5173 (Vite direct), on se connecte au backend sur 3001
	// Sinon on utilise le même host (nginx sur 8080)
	const isViteDirect = window.location.port === '5173';
	const socketUrl = isViteDirect 
		? 'http://localhost:3001'
		: `${window.location.protocol}//${window.location.host}`;
	
	const socket = io(socketUrl, {
		path: '/ws',
		transports: ['websocket', 'polling'],
		withdCredentials: false,
		autoConnect: true
	});

	return socket;
}