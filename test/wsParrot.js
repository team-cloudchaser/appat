"use strict";

const u8Enc = new TextEncoder();

Deno.serve({
	"port": 5780,
	"hostname": "127.0.0.1"
}, async function (req) {
	let url = new URL(req.url);
	if (req.headers.get("Upgrade") !== "websocket") {
		return new Response("Invalid request", {
			"status": 400
		});
	} else {
		const {socket, response: resp} = Deno.upgradeWebSocket(req);
		socket.addEventListener("open", async () => {
			console.debug(`Repeater has been connected.`);
			socket.send(u8Enc.encode("Connected!"))
		});
		socket.addEventListener("message", async (ev) => {
			console.debug(`Message received.`);
			socket.send(ev.data);
		});
		return resp;
	};
});
