import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as rawDataToString } from "./websocket-data-2vBvd4uX.mjs";
import { n as WebSocketServer, t as WebSocket } from "./websocket-CGHaToS5.mjs";
import { t as createOneTimeTicketStore } from "./one-time-ticket-store-B8dK9Gfu.mjs";
import { t as startWebSocketKeepalive } from "./websocket-keepalive-DYmRD_O3.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
//#region src/gateway/desktop/audio-bridge.ts
const DESKTOP_AUDIO_PATH = "/desktop/audio";
const MAX_BUFFERED_BYTES = 48e3;
const audioWss = new WebSocketServer({
	noServer: true,
	maxPayload: 128
});
const tickets = createOneTimeTicketStore({
	ttlMs: 6e4,
	onExpire: (entry) => entry.close()
});
/** The authenticated screen observation, not its bearer ticket, owns audio authority. */
function mintDesktopAudioObserver(params) {
	const lifetime = new AbortController();
	const ready = createDeferredCore();
	let closeSocket;
	const isCurrent = () => !lifetime.signal.aborted && params.requester?.isCurrent() !== false;
	const close = () => {
		if (lifetime.signal.aborted) return;
		lifetime.abort();
		ready.resolve(false);
		tickets.delete(minted.token);
		params.requester?.signal?.removeEventListener("abort", close);
		closeSocket?.();
	};
	const minted = tickets.mint({
		close,
		isCurrent,
		attach(ws) {
			let captureAbort;
			let transition;
			let pending;
			const schedule = (next) => {
				pending = next;
				if (transition) return;
				transition = (async () => {
					while (pending) {
						const run = pending;
						pending = void 0;
						await run();
					}
				})().catch(close).finally(() => {
					transition = void 0;
				});
			};
			const stopKeepalive = startWebSocketKeepalive(ws);
			const sendState = (state, message) => {
				if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({
					state,
					...message ? { message } : {}
				}));
			};
			const stop = () => {
				pending = void 0;
				captureAbort?.abort();
				captureAbort = void 0;
			};
			closeSocket = () => {
				stop();
				stopKeepalive();
				ws.close(1e3, "desktop audio observation closed");
			};
			ws.once("close", () => {
				stop();
				stopKeepalive();
				close();
			});
			ws.once("error", close);
			ws.on("message", (raw, binary) => {
				if (!isCurrent()) {
					close();
					return;
				}
				let value;
				try {
					value = binary ? void 0 : JSON.parse(rawDataToString(raw));
				} catch {}
				if (!isRecord(value) || Object.keys(value).length !== 1 || value.action !== "start" && value.action !== "stop") {
					ws.close(1008, "invalid desktop audio command");
					close();
					return;
				}
				if (value.action === "start" && captureAbort && !captureAbort.signal.aborted) return;
				stop();
				if (value.action === "stop") {
					sendState("stopped");
					return;
				}
				const controller = new AbortController();
				captureAbort = controller;
				const current = () => isCurrent() && !controller.signal.aborted && ws.readyState === WebSocket.OPEN;
				schedule(async () => {
					if (!await ready.promise || !current()) return;
					const signal = AbortSignal.any([lifetime.signal, controller.signal]);
					let capture;
					try {
						capture = await params.source.start(signal, () => {
							if (!current()) throw new Error("Desktop audio observation is no longer current");
						});
						if (!current()) return;
						sendState("started");
						const stream = capture.stream;
						await new Promise((resolve, reject) => {
							let settled = false;
							const cleanup = () => {
								signal.removeEventListener("abort", finish);
								stream.off("end", finish);
								stream.off("close", finish);
								stream.off("error", fail);
								stream.off("data", forward);
							};
							const finish = () => {
								if (settled) return;
								settled = true;
								cleanup();
								resolve();
							};
							const fail = (error) => {
								if (settled) return;
								settled = true;
								cleanup();
								reject(error);
							};
							const forward = (chunk) => {
								if (!current()) {
									controller.abort();
									return;
								}
								if (ws.bufferedAmount + chunk.length > MAX_BUFFERED_BYTES) {
									sendState("error", "Audio connection is too slow. Mute and reconnect the desktop to try again.");
									controller.abort();
									ws.close(1013, "desktop audio backpressure");
									return;
								}
								ws.send(chunk, { binary: true });
							};
							signal.addEventListener("abort", finish, { once: true });
							stream.once("end", finish);
							stream.once("close", finish);
							stream.once("error", fail);
							stream.on("data", forward);
							if (signal.aborted || stream.destroyed || stream.readableEnded) finish();
						});
						if (current()) sendState("error", "Desktop audio stopped. Check the remote audio service and reconnect.");
					} catch {
						if (current()) sendState("error", "Desktop audio is unavailable. Check the remote audio service and reconnect.");
					} finally {
						controller.abort();
						await capture?.stop();
					}
				});
			});
			if (!isCurrent()) closeSocket();
		}
	});
	params.requester?.signal?.addEventListener("abort", close, { once: true });
	if (params.requester?.signal?.aborted || !isCurrent()) close();
	return {
		descriptor: {
			wsPath: "/desktop/audio?token=" + minted.token,
			encoding: "pcm-s16le",
			sampleRate: 48e3,
			channels: 2
		},
		activate() {
			if (isCurrent()) ready.resolve(true);
		},
		close
	};
}
function handleDesktopAudioUpgrade(req, socket, head) {
	const resource = new URL(req.url ?? "/", "http://127.0.0.1");
	if (resource.pathname !== DESKTOP_AUDIO_PATH) return false;
	const entry = tickets.consume(resource.searchParams.get("token") ?? "");
	if (!entry || !entry.isCurrent()) {
		entry?.close();
		rejectWebSocketUpgrade(socket, { status: 401 });
		return true;
	}
	audioWss.handleUpgrade(req, socket, head, (ws) => entry.attach(ws));
	return true;
}
//#endregion
export { mintDesktopAudioObserver as n, handleDesktopAudioUpgrade as t };
