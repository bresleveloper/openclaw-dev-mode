import crypto from "node:crypto";
//#region extensions/browser/src/browser/extension-relay/auth-v2-crypto.ts
const BROWSER_RELAY_AUTH_LABEL = "openclaw.browser-relay.auth";
const KEY_HEX_PATTERN = /^[0-9a-f]{64}$/u;
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/u;
function decodeRelayKey(keyHex) {
	if (!KEY_HEX_PATTERN.test(keyHex)) throw new Error("browser relay key must be 32 lowercase-hex bytes");
	return Buffer.from(keyHex, "hex");
}
function isCanonicalBase64UrlBytes(value, bytes) {
	if (typeof value !== "string" || !BASE64URL_PATTERN.test(value)) return false;
	try {
		const decoded = Buffer.from(value, "base64url");
		return decoded.length === bytes && decoded.toString("base64url") === value;
	} catch {
		return false;
	}
}
function isBase64UrlText(value) {
	return BASE64URL_PATTERN.test(value);
}
function relayKeyIdFromHex(keyHex) {
	return crypto.createHash("sha256").update(decodeRelayKey(keyHex)).digest("base64url").slice(0, 22);
}
function randomRelayNonce() {
	return crypto.randomBytes(32).toString("base64url");
}
function randomRelayId() {
	return crypto.randomBytes(16).toString("base64url");
}
function canonicalRelayProofBytes(proofKind, fields, clientProof) {
	const values = [
		BROWSER_RELAY_AUTH_LABEL,
		2,
		proofKind,
		fields.keyId,
		fields.instanceId,
		fields.sessionId,
		fields.clientNonce,
		fields.serverNonce,
		fields.issuedAtMs,
		fields.expiresAtMs,
		fields.role,
		fields.transport,
		fields.method,
		fields.resource,
		fields.flow
	];
	if (proofKind === "accept") {
		if (!isCanonicalBase64UrlBytes(clientProof, 32)) throw new Error("accept proof requires a 32-byte client proof");
		values.push(clientProof);
	}
	return Buffer.from(JSON.stringify(values), "utf8");
}
function createRelayProof(keyHex, proofKind, fields, clientProof) {
	return crypto.createHmac("sha256", decodeRelayKey(keyHex)).update(canonicalRelayProofBytes(proofKind, fields, clientProof)).digest("base64url");
}
function verifyRelayProof(keyHex, proofKind, fields, candidate, clientProof) {
	if (!isCanonicalBase64UrlBytes(candidate, 32)) return false;
	const expected = Buffer.from(createRelayProof(keyHex, proofKind, fields, clientProof), "base64url");
	const actual = Buffer.from(candidate, "base64url");
	return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/auth-v2.ts
const BROWSER_RELAY_EXTENSION_SUBPROTOCOL = "openclaw-extension-relay.v2";
const BROWSER_RELAY_AUTH_CHALLENGE_PATH = "/_openclaw/relay/auth/v2/challenge";
const BROWSER_RELAY_AUTH_COMPLETE_PATH = "/_openclaw/relay/auth/v2/complete";
const BROWSER_RELAY_CHALLENGE_TTL_MS = 1e4;
const MAX_PENDING_AUTH_CONNECTIONS = 128;
const MAX_PENDING_AUTH_CONNECTIONS_PER_SOURCE = 32;
const MAX_AUTHENTICATED_CONNECTIONS = 128;
const MAX_REPLAY_ENTRIES = 1024;
const MAX_REPLAY_ENTRIES_PER_SOURCE = 256;
const LOOPBACK_AUTH_SOURCE = "loopback";
function normalizeAuthSource(source) {
	const normalized = source.trim().toLowerCase();
	if (normalized === "::1" || /^127(?:\.\d{1,3}){3}$/.test(normalized) || /^::ffff:127(?:\.\d{1,3}){3}$/.test(normalized)) return LOOPBACK_AUTH_SOURCE;
	return normalized || "unknown";
}
function hasExactKeys(value, keys) {
	const actual = Object.keys(value).toSorted();
	const expected = [...keys].toSorted();
	return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}
function parseRelayAuthHello(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	if (!hasExactKeys(record, [
		"type",
		"v",
		"keyId",
		"clientNonce"
	]) || record.type !== "auth.hello" || record.v !== 2 || typeof record.keyId !== "string" || record.keyId.length !== 22 || !isBase64UrlText(record.keyId) || !isCanonicalBase64UrlBytes(record.clientNonce, 32)) return null;
	return record;
}
function parseRelayAuthResponse(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	if (!hasExactKeys(record, [
		"type",
		"v",
		"sessionId",
		"clientProof"
	]) || record.type !== "auth.response" || record.v !== 2 || !isCanonicalBase64UrlBytes(record.sessionId, 16) || !isCanonicalBase64UrlBytes(record.clientProof, 32)) return null;
	return record;
}
function parseRelayHttpChallengeRequest(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	if (!hasExactKeys(record, [
		"v",
		"keyId",
		"clientNonce",
		"role",
		"transport",
		"method",
		"resource",
		"flow"
	]) || record.v !== 2 || typeof record.keyId !== "string" || record.keyId.length !== 22 || !isBase64UrlText(record.keyId) || !isCanonicalBase64UrlBytes(record.clientNonce, 32) || record.role !== "cdp" || record.transport !== "connection" || !(record.flow === "cdp" && record.method === "SEQUENCE" && record.resource === "/json/version -> /cdp" || record.flow === "json-list" && record.method === "GET" && record.resource === "/json/list")) return null;
	return record;
}
function parseRelayHttpCompleteRequest(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	if (!hasExactKeys(record, [
		"v",
		"sessionId",
		"clientProof"
	]) || record.v !== 2 || !isCanonicalBase64UrlBytes(record.sessionId, 16) || !isCanonicalBase64UrlBytes(record.clientProof, 32)) return null;
	return record;
}
function parseExtensionRelayResource(rawUrl, expectedPath) {
	let url;
	try {
		url = new URL(rawUrl, "http://127.0.0.1");
	} catch {
		return null;
	}
	if (url.pathname !== expectedPath || url.hash) return null;
	if ([...url.searchParams.entries()].some(([key]) => key !== "profile") || url.searchParams.getAll("profile").length > 1) return null;
	const profile = url.searchParams.get("profile");
	if (profile !== null && !/^[a-z0-9-]+$/u.test(profile)) return null;
	return profile === null ? expectedPath : `${expectedPath}?profile=${encodeURIComponent(profile)}`;
}
/** Reject duplicate object keys before JSON.parse can silently keep the last value. */
function hasDuplicateJsonObjectKeys(text) {
	const stack = [];
	let expectingKey = false;
	let index = 0;
	const skipWhitespace = () => {
		while (/\s/u.test(text[index] ?? "")) index += 1;
	};
	while (index < text.length) {
		const char = text[index];
		if (char === "\"") {
			const start = index;
			index += 1;
			let escaped = false;
			while (index < text.length) {
				const next = text[index++];
				if (escaped) escaped = false;
				else if (next === "\\") escaped = true;
				else if (next === "\"") break;
			}
			if (expectingKey && stack.at(-1)) {
				let key;
				try {
					key = JSON.parse(text.slice(start, index));
				} catch {
					return false;
				}
				skipWhitespace();
				if (text[index] === ":" && typeof key === "string") {
					const keys = stack.at(-1);
					if (keys.has(key)) return true;
					keys.add(key);
					expectingKey = false;
				}
			}
			continue;
		}
		if (char === "{") {
			stack.push(/* @__PURE__ */ new Set());
			expectingKey = true;
		} else if (char === "[") {
			stack.push(null);
			expectingKey = false;
		} else if (char === "}") {
			stack.pop();
			expectingKey = false;
		} else if (char === "]") {
			stack.pop();
			expectingKey = false;
		} else if (char === ",") expectingKey = stack.at(-1) instanceof Set;
		index += 1;
	}
	return false;
}
function parseStrictJsonObject(text) {
	if (hasDuplicateJsonObjectKeys(text)) return null;
	try {
		const parsed = JSON.parse(text);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
var BoundedReplayCache = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map();
	}
	reserve(key, expiresAtMs, nowMs, source) {
		let entriesForSource = 0;
		for (const [candidate, entry] of this.entries) if (entry.expiresAtMs < nowMs) this.entries.delete(candidate);
		else entriesForSource += entry.source === source ? 1 : 0;
		if (this.entries.has(key) || entriesForSource >= MAX_REPLAY_ENTRIES_PER_SOURCE || this.entries.size >= MAX_REPLAY_ENTRIES) return false;
		this.entries.set(key, {
			expiresAtMs,
			source
		});
		return true;
	}
	clear() {
		this.entries.clear();
	}
};
var BrowserRelayAuthV2Authority = class {
	constructor(keyHex) {
		this.keyHex = keyHex;
		this.instanceId = randomRelayId();
		this.challenges = /* @__PURE__ */ new Map();
		this.pendingConnections = /* @__PURE__ */ new Map();
		this.authenticatedConnections = /* @__PURE__ */ new Map();
		this.replay = new BoundedReplayCache();
		this.disposed = false;
		this.keyId = relayKeyIdFromHex(keyHex);
	}
	registerPendingConnection(binding, onInvalidate, source) {
		const normalizedSource = normalizeAuthSource(source);
		let pendingForSource = 0;
		for (const pending of this.pendingConnections.values()) pendingForSource += pending.source === normalizedSource ? 1 : 0;
		if (this.disposed || this.pendingConnections.has(binding) || this.authenticatedConnections.has(binding) || pendingForSource >= MAX_PENDING_AUTH_CONNECTIONS_PER_SOURCE || this.pendingConnections.size >= MAX_PENDING_AUTH_CONNECTIONS) return false;
		this.pendingConnections.set(binding, {
			onInvalidate,
			source: normalizedSource
		});
		return true;
	}
	registerAuthenticatedConnection(binding, onInvalidate) {
		if (this.disposed || this.pendingConnections.has(binding) || this.authenticatedConnections.has(binding) || this.authenticatedConnections.size >= MAX_AUTHENTICATED_CONNECTIONS) return false;
		this.authenticatedConnections.set(binding, onInvalidate);
		return true;
	}
	releaseConnection(binding) {
		this.pendingConnections.delete(binding);
		this.authenticatedConnections.delete(binding);
		for (const [sessionId, challenge] of this.challenges) if (challenge.binding === binding) this.challenges.delete(sessionId);
	}
	issueChallenge(binding, hello, expected, nowMs = Date.now()) {
		const pending = this.pendingConnections.get(binding);
		if (this.disposed || !pending || hello.keyId !== this.keyId || this.challenges.size >= MAX_PENDING_AUTH_CONNECTIONS) return null;
		const expiresAtMs = nowMs + BROWSER_RELAY_CHALLENGE_TTL_MS;
		if (!this.replay.reserve(`${this.keyId}:${hello.clientNonce}`, expiresAtMs, nowMs, pending.source)) return null;
		const fields = {
			keyId: this.keyId,
			instanceId: this.instanceId,
			sessionId: randomRelayId(),
			clientNonce: hello.clientNonce,
			serverNonce: randomRelayNonce(),
			issuedAtMs: nowMs,
			expiresAtMs,
			...expected
		};
		this.challenges.set(fields.sessionId, {
			binding,
			fields
		});
		return {
			type: "auth.challenge",
			v: 2,
			...fields,
			serverProof: createRelayProof(this.keyHex, "server", fields)
		};
	}
	completeChallenge(binding, response, nowMs = Date.now()) {
		const challenge = this.challenges.get(response.sessionId);
		if (!challenge || challenge.binding !== binding || this.disposed) return null;
		this.challenges.delete(response.sessionId);
		if (nowMs > challenge.fields.expiresAtMs || !verifyRelayProof(this.keyHex, "client", challenge.fields, response.clientProof)) return null;
		const pending = this.pendingConnections.get(binding);
		if (!pending || this.authenticatedConnections.size >= MAX_AUTHENTICATED_CONNECTIONS) return null;
		this.pendingConnections.delete(binding);
		this.authenticatedConnections.set(binding, pending.onInvalidate);
		return {
			fields: challenge.fields,
			ok: {
				type: "auth.ok",
				v: 2,
				sessionId: challenge.fields.sessionId,
				acceptProof: createRelayProof(this.keyHex, "accept", challenge.fields, response.clientProof)
			}
		};
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		const invalidators = [...Array.from(this.pendingConnections.values(), ({ onInvalidate }) => onInvalidate), ...this.authenticatedConnections.values()];
		this.pendingConnections.clear();
		this.authenticatedConnections.clear();
		this.challenges.clear();
		this.replay.clear();
		for (const invalidate of invalidators) invalidate();
	}
};
let activeAuthority = null;
/** One process-wide replay/session authority for the current host key. */
function getBrowserRelayAuthV2Authority(keyHex) {
	if (activeAuthority?.keyHex === keyHex) return activeAuthority.authority;
	activeAuthority?.authority.dispose();
	const authority = new BrowserRelayAuthV2Authority(keyHex);
	activeAuthority = {
		keyHex,
		authority
	};
	return authority;
}
function invalidateBrowserRelayAuthV2Authority() {
	activeAuthority?.authority.dispose();
	activeAuthority = null;
}
//#endregion
export { randomRelayNonce as _, getBrowserRelayAuthV2Authority as a, parseRelayAuthHello as c, parseRelayHttpCompleteRequest as d, parseStrictJsonObject as f, randomRelayId as g, isCanonicalBase64UrlBytes as h, BROWSER_RELAY_EXTENSION_SUBPROTOCOL as i, parseRelayAuthResponse as l, createRelayProof as m, BROWSER_RELAY_AUTH_COMPLETE_PATH as n, invalidateBrowserRelayAuthV2Authority as o, BROWSER_RELAY_AUTH_LABEL as p, BROWSER_RELAY_CHALLENGE_TTL_MS as r, parseExtensionRelayResource as s, BROWSER_RELAY_AUTH_CHALLENGE_PATH as t, parseRelayHttpChallengeRequest as u, relayKeyIdFromHex as v, verifyRelayProof as y };
