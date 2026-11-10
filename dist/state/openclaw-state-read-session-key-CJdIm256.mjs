import { E as normalizeLowercaseStringOrEmpty, O as normalizeOptionalLowercaseString, k as normalizeOptionalString } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { a as parseAgentSessionKeyParts, n as buildAgentMainSessionKey } from "./openclaw-state-read-src-YegAQ-al.mjs";
//#region packages/session-url-contract/src/session-key-normalization.ts
const SIGNAL_GROUP_ID_PATTERN = /(^|:)signal:group:([^:]+)/gi;
const MATRIX_ROOM_KEY_PATTERN = /^(?:(?:agent:[^:]*:)+:*)?matrix:(?:channel|group):/i;
function casePreservingPeerSpan(channel, peerKind) {
	const c = normalizeLowercaseStringOrEmpty(channel);
	const k = normalizeLowercaseStringOrEmpty(peerKind);
	if (c === "signal" && k === "group") return "segment";
	if (c === "matrix" && (k === "channel" || k === "group")) return "tail";
}
function requiresFoldedSessionKeyAliasProof(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return false;
	const parts = raw.split(":");
	let bodyStartIndex = 0;
	let hasAgentWrapper = false;
	while (parts.length - bodyStartIndex >= 3 && normalizeOptionalLowercaseString(parts[bodyStartIndex]) === "agent") {
		hasAgentWrapper = true;
		bodyStartIndex += 2;
	}
	if (hasAgentWrapper) while (bodyStartIndex < parts.length && !normalizeOptionalString(parts[bodyStartIndex])) bodyStartIndex += 1;
	return casePreservingPeerSpan(parts[bodyStartIndex], parts[bodyStartIndex + 1]) === "tail";
}
const NORMALIZED_SESSION_KEY_CACHE_MAX_ENTRIES = 2048;
const NORMALIZED_SESSION_KEY_CACHE_MAX_LENGTH = 4096;
const normalizedSessionKeyCache = /* @__PURE__ */ new Map();
function writeNormalizedSessionKeyCache(raw, normalized) {
	if (raw.length > NORMALIZED_SESSION_KEY_CACHE_MAX_LENGTH) return;
	normalizedSessionKeyCache.set(raw, normalized);
	if (normalizedSessionKeyCache.size > NORMALIZED_SESSION_KEY_CACHE_MAX_ENTRIES) {
		const oldest = normalizedSessionKeyCache.keys().next();
		if (!oldest.done) normalizedSessionKeyCache.delete(oldest.value);
	}
}
function collectCasePreservedSpans(raw) {
	const spans = [];
	for (const match of raw.matchAll(SIGNAL_GROUP_ID_PATTERN)) {
		const matched = match[0];
		const segment = match[2] ?? "";
		const segStart = match.index + matched.length - segment.length;
		spans.push({
			start: segStart,
			end: segStart + segment.length,
			trim: true
		});
	}
	const match = MATRIX_ROOM_KEY_PATTERN.exec(raw);
	if (!match || match[0].length >= raw.length) return spans;
	const tailStart = match[0].length;
	const tail = raw.slice(tailStart);
	const markerIndex = normalizeLowercaseStringOrEmpty(tail).lastIndexOf(":thread:");
	if (markerIndex === -1) {
		spans.push({
			start: tailStart,
			end: raw.length,
			trim: false
		});
		return spans;
	}
	spans.push({
		start: tailStart,
		end: tailStart + markerIndex,
		trim: false
	});
	const threadIdStart = tailStart + markerIndex + 8;
	if (threadIdStart < raw.length) spans.push({
		start: threadIdStart,
		end: raw.length,
		trim: false
	});
	return spans;
}
function normalizeSessionKeyPreservingOpaquePeerIds(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return "";
	const cached = normalizedSessionKeyCache.get(raw);
	if (cached !== void 0) return cached;
	const folded = raw.toLowerCase();
	if (!folded.includes("signal:") && !folded.includes("matrix:")) return folded;
	const spans = collectCasePreservedSpans(raw).filter((span) => span.end > span.start).toSorted((a, b) => a.start - b.start);
	let normalized = "";
	let cursor = 0;
	for (const span of spans) {
		if (span.start < cursor) continue;
		normalized += normalizeLowercaseStringOrEmpty(raw.slice(cursor, span.start));
		const preserved = raw.slice(span.start, span.end);
		normalized += span.trim ? preserved.trim() : preserved;
		cursor = span.end;
	}
	normalized += normalizeLowercaseStringOrEmpty(raw.slice(cursor));
	writeNormalizedSessionKeyCache(raw, normalized);
	return normalized;
}
/**
* Parse agent-scoped session keys in a canonical, case-insensitive way.
* Returned values are canonicalized for stable comparisons/routing while
* preserving provider-owned opaque peer IDs.
*/
function parseAgentSessionKey(sessionKey) {
	return parseAgentSessionKeyParts(normalizeSessionKeyPreservingOpaquePeerIds(sessionKey));
}
//#endregion
//#region src/routing/session-key.ts
/** Legacy on-disk identity used only by doctor/migration and their fixtures. */
const LEGACY_IMPLICIT_AGENT_ID = "main";
function toAgentStoreSessionKey(params) {
	const raw = (params.requestKey ?? "").trim();
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (!raw || lowered === "main") return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey
	});
	const parsed = parseAgentSessionKey(raw);
	if (parsed) return `agent:${parsed.agentId}:${parsed.rest}`;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
	if (lowered.startsWith("agent:")) return normalized;
	return `agent:${normalizeAgentId(params.agentId)}:${normalized}`;
}
function resolveAgentIdFromSessionKey(sessionKey, configuredDefaultAgentId) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (parsed?.agentId) return normalizeAgentId(parsed.agentId);
	if (classifySessionKeyShape(sessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing default-agent resolution.");
	const configuredDefault = configuredDefaultAgentId?.trim();
	if (configuredDefault) return normalizeAgentId(configuredDefault);
	throw new Error("Session key does not contain an agent id; resolve it with the configured default agent.");
}
function classifySessionKeyShape(sessionKey) {
	const raw = (sessionKey ?? "").trim();
	if (!raw) return "missing";
	if (parseAgentSessionKey(raw)) return "agent";
	return normalizeLowercaseStringOrEmpty(raw).startsWith("agent:") ? "malformed_agent" : "legacy_or_alias";
}
function sanitizeAgentId(value) {
	return normalizeAgentId(value);
}
//#endregion
export { toAgentStoreSessionKey as a, requiresFoldedSessionKeyAliasProof as c, sanitizeAgentId as i, classifySessionKeyShape as n, normalizeSessionKeyPreservingOpaquePeerIds as o, resolveAgentIdFromSessionKey as r, parseAgentSessionKey as s, LEGACY_IMPLICIT_AGENT_ID as t };
