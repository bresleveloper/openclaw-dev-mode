import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-DBLVDypr.js";
//#region extensions/whatsapp/src/socket-timing.ts
const socketSendMessageQueueTails = /* @__PURE__ */ new WeakMap();
const DEFAULT_WHATSAPP_SOCKET_TIMING = {
	keepAliveIntervalMs: 25e3,
	connectTimeoutMs: 6e4,
	defaultQueryTimeoutMs: 6e4
};
var WhatsAppSocketOperationTimeoutError = class extends Error {
	constructor(operation, timeoutMs) {
		super(`WhatsApp socket ${operation} timed out after ${timeoutMs}ms; delivery state is unknown`);
		this.operation = operation;
		this.timeoutMs = timeoutMs;
		this.deliveryState = "unknown";
		this.name = "WhatsAppSocketOperationTimeoutError";
	}
};
function positiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function resolveWhatsAppSocketTiming(cfg, overrides) {
	const configured = cfg.web?.whatsapp;
	return {
		keepAliveIntervalMs: positiveInteger(overrides?.keepAliveIntervalMs) ?? positiveInteger(configured?.keepAliveIntervalMs) ?? DEFAULT_WHATSAPP_SOCKET_TIMING.keepAliveIntervalMs,
		connectTimeoutMs: positiveInteger(overrides?.connectTimeoutMs) ?? positiveInteger(configured?.connectTimeoutMs) ?? DEFAULT_WHATSAPP_SOCKET_TIMING.connectTimeoutMs,
		defaultQueryTimeoutMs: positiveInteger(overrides?.defaultQueryTimeoutMs) ?? positiveInteger(configured?.defaultQueryTimeoutMs) ?? DEFAULT_WHATSAPP_SOCKET_TIMING.defaultQueryTimeoutMs
	};
}
function isWhatsAppSocketOperationTimeoutError(error) {
	return error instanceof WhatsAppSocketOperationTimeoutError;
}
function resolveWhatsAppSocketOperationTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_WHATSAPP_SOCKET_TIMING.defaultQueryTimeoutMs);
}
async function runSerializedSocketSendMessage(sock, run) {
	const result = (socketSendMessageQueueTails.get(sock) ?? Promise.resolve()).then(run);
	const tail = result.then(() => void 0, () => void 0);
	socketSendMessageQueueTails.set(sock, tail);
	tail.then(() => {
		if (socketSendMessageQueueTails.get(sock) === tail) socketSendMessageQueueTails.delete(sock);
	});
	return await result;
}
async function withWhatsAppSocketOperationTimeout(operation, promise, timeoutMs, onTimeout) {
	const resolvedTimeoutMs = resolveWhatsAppSocketOperationTimeoutMs(timeoutMs);
	let timeout = null;
	try {
		return await Promise.race([promise, new Promise((_, reject) => {
			timeout = setTimeout(() => {
				onTimeout?.();
				reject(new WhatsAppSocketOperationTimeoutError(operation, resolvedTimeoutMs));
			}, resolvedTimeoutMs);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function createWhatsAppSocketOperationTimeoutAdapter(sock, timeoutMs, hooks) {
	const operationTimeoutMs = resolveWhatsAppSocketOperationTimeoutMs(timeoutMs);
	return {
		sendMessage: (jid, content, options) => {
			return runSerializedSocketSendMessage(sock, () => {
				const send = options ? sock.sendMessage(jid, content, options) : sock.sendMessage(jid, content);
				return withWhatsAppSocketOperationTimeout("sendMessage", send, operationTimeoutMs, hooks?.onSendMessageTimeout ? () => hooks.onSendMessageTimeout?.({
					jid,
					promise: send
				}) : void 0);
			});
		},
		sendPresenceUpdate: (presence, jid) => {
			return withWhatsAppSocketOperationTimeout("sendPresenceUpdate", jid === void 0 ? sock.sendPresenceUpdate(presence) : sock.sendPresenceUpdate(presence, jid), operationTimeoutMs);
		}
	};
}
//#endregion
export { resolveWhatsAppSocketTiming as a, resolveWhatsAppSocketOperationTimeoutMs as i, createWhatsAppSocketOperationTimeoutAdapter as n, withWhatsAppSocketOperationTimeout as o, isWhatsAppSocketOperationTimeoutError as r, DEFAULT_WHATSAPP_SOCKET_TIMING as t };
