import { r as resolveCodexAppServerUserHomeDir } from "./auth-start-options-BPIPeEX8.mjs";
import "./config-0Gxk3_eq.mjs";
import { t as codexWebSocketDataToBuffer } from "./websocket-data-XlRvt8Ys.mjs";
import path from "node:path";
import { EventEmitter } from "node:events";
import net from "node:net";
import { PassThrough, Writable } from "node:stream";
import { StringDecoder } from "node:string_decoder";
import { WebSocket } from "openclaw/plugin-sdk/websocket-runtime";
//#region extensions/codex/src/app-server/transport-websocket.ts
/**
* Adapts a remote Codex app-server WebSocket endpoint to the shared stdio-like
* transport interface.
*/
const WEBSOCKET_HANDSHAKE_TIMEOUT_MS = 1e4;
const WEBSOCKET_PING_INTERVAL_MS = 2e4;
const WEBSOCKET_PONG_TIMEOUT_MS = 2e4;
const MAX_CONSECUTIVE_MISSED_WEBSOCKET_PONGS = 5;
/** Only the transport can prove that its buffered initialize never reached a peer. */
function isCodexWebSocketOpenFailure(error) {
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current instanceof Error && !seen.has(current)) {
		seen.add(current);
		if ("code" in current && current.code === "CODEX_APP_SERVER_WEBSOCKET_OPEN_FAILED") return true;
		current = current.cause;
	}
	return false;
}
/** Opens a WebSocket app-server transport and maps newline-delimited frames to stdout/stdin. */
function createWebSocketTransport(options) {
	if (!options.url) throw new Error("codex app-server websocket transport requires plugins.entries.codex.config.appServer.url");
	const events = new EventEmitter();
	const stdout = new PassThrough();
	const stderr = new PassThrough();
	const websocketOptions = {
		headers: {
			...options.headers,
			...options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}
		},
		perMessageDeflate: false,
		...options.transport === "websocket" ? { handshakeTimeout: WEBSOCKET_HANDSHAKE_TIMEOUT_MS } : {}
	};
	const unixSocketPath = resolveCodexAppServerUnixSocketPath(options);
	const socket = unixSocketPath ? new WebSocket("ws://localhost/", {
		...websocketOptions,
		createConnection: () => connectCodexAppServerUnixSocket(unixSocketPath)
	}) : new WebSocket(options.url, websocketOptions);
	const pendingFrames = [];
	const stdinDecoder = new StringDecoder("utf8");
	let pendingLine = "";
	let opened = false;
	let killed = false;
	let exitCode = null;
	let pingTimeout;
	let pongTimeout;
	let expectedPong;
	let consecutiveMissedPongs = 0;
	let heartbeatSequence = 0;
	const clearConnectionHealthTimers = () => {
		if (pingTimeout) {
			clearTimeout(pingTimeout);
			pingTimeout = void 0;
		}
		if (pongTimeout) {
			clearTimeout(pongTimeout);
			pongTimeout = void 0;
		}
		expectedPong = void 0;
	};
	const sendHeartbeatPing = () => {
		if (socket.readyState !== WebSocket.OPEN || pongTimeout) return;
		const payload = Buffer.from(`openclaw-codex-${++heartbeatSequence}`);
		expectedPong = payload;
		pongTimeout = setTimeout(() => {
			pongTimeout = void 0;
			expectedPong = void 0;
			consecutiveMissedPongs += 1;
			if (consecutiveMissedPongs >= MAX_CONSECUTIVE_MISSED_WEBSOCKET_PONGS) {
				socket.terminate();
				return;
			}
			sendHeartbeatPing();
		}, WEBSOCKET_PONG_TIMEOUT_MS);
		pongTimeout.unref();
		socket.ping(payload, void 0, (error) => {
			if (error) socket.terminate();
		});
	};
	const scheduleHeartbeatPing = () => {
		if (options.transport !== "websocket" || socket.readyState !== WebSocket.OPEN || pingTimeout || pongTimeout) return;
		pingTimeout = setTimeout(() => {
			pingTimeout = void 0;
			sendHeartbeatPing();
		}, WEBSOCKET_PING_INTERVAL_MS);
		pingTimeout.unref();
	};
	const recordConnectionActivity = () => {
		consecutiveMissedPongs = 0;
		if (pongTimeout) {
			clearTimeout(pongTimeout);
			pongTimeout = void 0;
		}
		expectedPong = void 0;
		scheduleHeartbeatPing();
	};
	const sendFrame = (frame) => {
		const trimmed = frame.trim();
		if (!trimmed) return;
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(trimmed);
			return;
		}
		pendingFrames.push(trimmed);
	};
	socket.once("open", () => {
		opened = true;
		for (const frame of pendingFrames.splice(0)) socket.send(frame);
		scheduleHeartbeatPing();
	});
	socket.on("pong", (payload) => {
		if (expectedPong?.equals(payload)) recordConnectionActivity();
	});
	socket.once("error", (error) => {
		clearConnectionHealthTimers();
		const code = "code" in error ? error.code : void 0;
		if (options.transport === "websocket" && !opened && (code === "ECONNREFUSED" || code === "ECONNRESET" || code === "ETIMEDOUT" || error.message === "Opening handshake has timed out")) {
			events.emit("error", Object.assign(new Error(error.message, { cause: error }), { code: "CODEX_APP_SERVER_WEBSOCKET_OPEN_FAILED" }));
			return;
		}
		events.emit("error", error);
	});
	socket.once("close", (code, reason) => {
		clearConnectionHealthTimers();
		killed = true;
		exitCode = code;
		events.emit("exit", code, reason.toString("utf8"));
	});
	socket.on("message", (data) => {
		if (options.transport === "websocket") recordConnectionActivity();
		const frame = codexWebSocketDataToBuffer(data);
		const writable = stdout.write(frame);
		const delimited = frame.at(-1) === 10 || stdout.write(Buffer.from("\n"));
		if (!writable || !delimited) socket.pause();
	});
	stdout.on("drain", () => {
		if (socket.readyState === WebSocket.OPEN) socket.resume();
	});
	const stdin = new Writable({
		write(chunk, _encoding, callback) {
			pendingLine += stdinDecoder.write(chunk);
			const lines = pendingLine.split("\n");
			pendingLine = lines.pop() ?? "";
			for (const frame of lines) sendFrame(frame);
			callback();
		},
		final(callback) {
			pendingLine += stdinDecoder.end();
			if (pendingLine) sendFrame(pendingLine);
			pendingLine = "";
			callback();
		}
	});
	const closeSocket = () => {
		if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) return;
		socket.close();
	};
	stdin.once("finish", closeSocket);
	stdin.once("close", closeSocket);
	return {
		maxFrameBytes: 16777216,
		stdin,
		stdout,
		stderr,
		get killed() {
			return killed;
		},
		get exitCode() {
			return exitCode;
		},
		kill: (signal) => {
			killed = true;
			clearConnectionHealthTimers();
			if (signal === "SIGKILL") socket.terminate();
			else socket.close();
		},
		once: (event, listener) => events.once(event, listener),
		off: (event, listener) => events.off(event, listener)
	};
}
/** Named local-only socket boundary for the egress classifier. */
function connectCodexAppServerUnixSocket(socketPath) {
	return net.createConnection(socketPath);
}
/** Resolves the canonical or explicitly configured Codex control socket. */
function resolveCodexAppServerUnixSocketPath(options) {
	if (options.transport !== "unix") {
		if (options.url?.startsWith("unix://")) throw new Error("codex app-server unix URL requires unix transport");
		return;
	}
	const url = options.url ?? "unix://";
	if (!url.startsWith("unix://")) throw new Error("codex app-server unix transport requires a unix:// URL");
	return url.slice(7) || path.join(resolveCodexAppServerUserHomeDir(options.env ?? process.env), "app-server-control", "app-server-control.sock");
}
//#endregion
export { isCodexWebSocketOpenFailure as n, resolveCodexAppServerUnixSocketPath as r, createWebSocketTransport as t };
