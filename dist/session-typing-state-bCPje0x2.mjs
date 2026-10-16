import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as listSystemPresence } from "./system-presence-CbgT1h20.mjs";
import { n as presenceUserKey } from "./presence-user-DFg4B6Vx.mjs";
//#region src/gateway/server-methods/session-typing-state.ts
const TYPING_THROTTLE_MS = 1e3;
const TYPING_ACTIVE_TTL_MS = 2500;
const MAX_TYPING_THROTTLE_KEYS = 2048;
function clearSessionTypingStateValue(state) {
	for (const entries of [state.broadcasts, state.connections]) {
		for (const entry of entries.values()) clearTimeout(entry.timer);
		entries.clear();
	}
}
const sessionTypingState = resolveGlobalSingleton(Symbol.for("openclaw.sessionTypingState"), () => ({
	broadcasts: /* @__PURE__ */ new Map(),
	connections: /* @__PURE__ */ new Map()
}), clearSessionTypingStateValue);
const typingBroadcastState = sessionTypingState.broadcasts;
const typingConnections = sessionTypingState.connections;
function clearSessionTypingState() {
	clearSessionTypingStateValue(sessionTypingState);
}
function liveViewerIdentities(sessionKeys) {
	return new Set(listSystemPresence().flatMap((entry) => entry.user?.id && entry.watchedSessions?.some((sessionKey) => sessionKeys.has(sessionKey)) ? [presenceUserKey(entry.user)] : []));
}
function rememberTypingBroadcast(key, state) {
	typingBroadcastState.delete(key);
	typingBroadcastState.set(key, state);
	if (typingBroadcastState.size <= MAX_TYPING_THROTTLE_KEYS) return;
	const oldestKey = typingBroadcastState.keys().next().value;
	if (!oldestKey) return;
	clearTimeout(typingBroadcastState.get(oldestKey)?.timer);
	typingBroadcastState.delete(oldestKey);
}
function broadcastTypingThrottled(params) {
	const previous = typingBroadcastState.get(params.key);
	if (!previous || params.now - previous.at >= params.intervalMs) {
		clearTimeout(previous?.timer);
		const emitted = params.emit();
		rememberTypingBroadcast(params.key, {
			at: params.now,
			signature: params.signature
		});
		return emitted;
	}
	if (params.signature === previous.signature && previous.pending?.signature !== params.signature) {
		clearTimeout(previous.timer);
		delete previous.pending;
		delete previous.timer;
		if (!params.typing) {
			rememberTypingBroadcast(params.key, previous);
			return false;
		}
	}
	if (previous.timer && previous.pending?.intervalMs !== params.intervalMs) {
		clearTimeout(previous.timer);
		delete previous.timer;
	}
	previous.pending = {
		signature: params.signature,
		intervalMs: params.intervalMs,
		emit: params.emit
	};
	if (!previous.timer) {
		const timer = setTimeout(() => {
			const current = typingBroadcastState.get(params.key);
			if (!current || current.timer !== timer || !current.pending) return;
			const pending = current.pending;
			const next = {
				at: Date.now(),
				signature: pending.signature
			};
			pending.emit();
			rememberTypingBroadcast(params.key, next);
		}, params.intervalMs - (params.now - previous.at));
		timer.unref?.();
		previous.timer = timer;
	}
	rememberTypingBroadcast(params.key, previous);
	return false;
}
function updateTypingConnections(params) {
	let bucket = typingConnections.get(params.key);
	if (!bucket) {
		if (!params.typing) return { typing: false };
		const timer = setTimeout(() => {
			typingConnections.delete(params.key);
		}, TYPING_ACTIVE_TTL_MS);
		timer.unref?.();
		bucket = {
			connections: /* @__PURE__ */ new Map(),
			timer
		};
	}
	const { connections } = bucket;
	if (params.typing) {
		bucket.timer.refresh();
		connections.set(params.connectionId, {
			updatedAt: params.now,
			...params.preview ? { preview: params.preview } : {}
		});
	} else connections.delete(params.connectionId);
	let latestPreview;
	for (const [connectionId, connection] of connections) if (params.now - connection.updatedAt >= TYPING_ACTIVE_TTL_MS) connections.delete(connectionId);
	else if (connection.preview && (!latestPreview || connection.updatedAt >= latestPreview.updatedAt)) latestPreview = connection;
	if (connections.size === 0) {
		clearTimeout(bucket.timer);
		typingConnections.delete(params.key);
		return { typing: false };
	}
	typingConnections.delete(params.key);
	typingConnections.set(params.key, bucket);
	if (typingConnections.size > MAX_TYPING_THROTTLE_KEYS) {
		const oldestKey = typingConnections.keys().next().value;
		if (oldestKey !== void 0) {
			clearTimeout(typingConnections.get(oldestKey)?.timer);
			typingConnections.delete(oldestKey);
		}
	}
	return {
		typing: true,
		...latestPreview?.preview ? { preview: latestPreview.preview } : {}
	};
}
//#endregion
export { updateTypingConnections as a, liveViewerIdentities as i, broadcastTypingThrottled as n, clearSessionTypingState as r, TYPING_THROTTLE_MS as t };
