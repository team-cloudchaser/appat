"use strict";

Deno.serve({
	"port": 5779,
	"hostname": "127.0.0.1"
}, async function (req) {
	let url = new URL(req.url);
	if (req.headers.get("Upgrade") !== "websocket") {
		return new Response("Invalid request", {
			"status": 400
		});
	} else {
		const {socket, response: resp} = Deno.upgradeWebSocket(req);
		let splitPath = url.pathname.substring(1).split("/");
		if (splitPath[0] === "ws" && splitPath.length === 3) {
			let instanceId = splitPath[1];
			let socketId = splitPath[2];
			console.debug(`Received: ${instanceId} ${socketId} ${url.search}`);
			if (socketId === "ctrl") {
				socket.addEventListener("open", () => {
					socket.send(`{"m":"PING"}`);
					socket.send(`{"m":"GET","u":"https://example.com/","c":"11111111-1111-1111-1111-111111111111","e":{"r":"about:client","h":{"Accept":"text/html"}}}`);
				});
				socket.addEventListener("message", (ev) => {
					console.debug(`Status ${socketId}`, ev.data);
				});
			} else {
				socket.addEventListener("message", (ev) => {
					console.debug(`Body ${socketId}:`, ev.data);
				});
			};
		} else {
			console.debug(`Invalid WS path.`);
			socket.close();
		};
		return resp;
	};
});
