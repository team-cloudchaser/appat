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
		let newHeaders = new Headers();
		for (let [k, v] of resp.headers.entries()) {
			newHeaders.set(k, v);
		};
		if (req.headers.has("Sec-WebSocket-Protocol")) {
			let wsProtos = req.headers.get("Sec-WebSocket-Protocol").split(", ");
			console.debug(wsProtos);
			newHeaders.set("Sec-WebSocket-Protocol", wsProtos[0]);
		};
		socket.addEventListener("open", async () => {
			console.debug(`Repeater has been connected.`);
			if (socket.protocol) {
				console.debug(`Advertised protocol: ${socket.protocol}`);
			};
			socket.send(u8Enc.encode("Connected!"))
		});
		socket.addEventListener("message", async (ev) => {
			console.debug(`Message received.`);
			socket.send(ev.data);
		});
		return new Response(resp.body, {
			"status": resp.status,
			"statusText": resp.statusText,
			"headers": newHeaders
		});
	};
});
