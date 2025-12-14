"use strict";

const u8Enc = new TextEncoder(), u8Dec = new TextDecoder();

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
		let upgradeOpt = {};
		if (req.headers.has("Sec-WebSocket-Protocol")) {
			let wsProtos = req.headers.get("Sec-WebSocket-Protocol").split(", ");
			console.debug(wsProtos);
			upgradeOpt.protocol = wsProtos[0];
		};
		const {socket, response: resp} = Deno.upgradeWebSocket(req, upgradeOpt);
		socket.addEventListener("open", async () => {
			console.debug(`Repeater has been connected.`);
			if (socket.protocol) {
				console.debug(`Advertised protocol: ${socket.protocol}`);
			};
			socket.send(u8Enc.encode("Connected!"))
		});
		socket.addEventListener("message", async (ev) => {
			console.debug(`Message received (${ev.data.length}). ${ev.data}`);
			socket.send(ev.data);
		});
		return resp;
	};
});
