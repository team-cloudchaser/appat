"use strict";

const FutureSignal = class FutureSignal {
	#trueResolve;
	finished = false;
	onfinish;
	constructor() {
		let upThis = this;
		upThis.onfinish = new Promise((p) => {
			upThis.#trueResolve = p;
		});
	};
	resolve() {
		this.finished = true;
		this.#trueResolve();
	};
};

export default class AppatController {
	instanceId;
	#wsNext = true; // Set to true to trigger WS fallback
	#rqNext = true; // Set to true to trigger fetch fallback
	#prefix;
	#csrf;
	#compiledPrefix;
	#controller;
	constructor(prefix, csrf) {
		if (!Request.prototype.hasOwnProperty("body")) {
			this.#rqNext = false;
			throw(new Error("Fetch requests do not support streamable bodies"));
		};
		if (typeof self?.WebSocketStream !== "function") {
			this.#wsNext = false;
			throw(new Error("WebSocket does not support streaming"));
		};
		this.#csrf = csrf;
		this.#prefix = prefix;
	};
	async start() {
		let upThis = this;
		if (upThis.#controller) {
			switch (upThis.#controller.readyState) {
				case WebSocket.CLOSING:
				case WebSocket.CLOSED: {
					throw(new Error(`Attempted reconnection for an active dialer`));
					break;
				};
			};
		};
		// Generate a new page ID
		upThis.instanceId = self.crypto?.randomUUID();
		upThis.#compiledPrefix = `${upThis.#prefix}/ws/${upThis.instanceId}`;
		upThis.#controller = new WebSocket(`${upThis.#compiledPrefix}/ctrl?token=${upThis.#csrf}`);
		upThis.#controller.addEventListener("error", (ev) => {
			console.warn(`Control socket has errored out:`, ev.error);
		});
		upThis.#controller.addEventListener("close", (ev) => {
			console.warn(`Control socket closed.`);
		});
		upThis.#controller.addEventListener("opened", (ev) => {
			console.warn(`Control socket is now ready.`);
		});
		upThis.#controller.addEventListener("message", (ev) => {
			let data = JSON.parse(ev.data);
			console.debug(data);
		});
	};
};
