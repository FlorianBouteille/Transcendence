// export function connectWS() {
//   const proto = window.location.protocol === "https:" ? "wss" : "ws";
//   const ws = new WebSocket(`${proto}://${window.location.host}/ws`);
//   return ws;
// }

import { io } from 'socket.io-client';

export function connectWS() {
	const socket = io('http://localhost:8080', {  // URL complète vers nginx
		path: '/ws'
	});

	return socket;
}