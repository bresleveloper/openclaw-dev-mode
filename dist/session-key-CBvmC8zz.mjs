import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { a as parseAgentSessionKeyParts, n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./src-Da9425In.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
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
function normalizeSessionPeerId(params) {
	const peerId = (params.peerId ?? "").trim();
	if (!peerId) return "";
	return casePreservingPeerSpan(params.channel, params.peerKind) !== void 0 ? peerId : normalizeLowercaseStringOrEmpty(peerId);
}
const NORMALIZED_SESSION_KEY_CACHE_MAX_ENTRIES = 2048;
const NORMALIZED_SESSION_KEY_CACHE_MAX_LENGTH = 4096;
const normalizedSessionKeyCache = /* @__PURE__ */ new Map();
function readNormalizedSessionKeyCache(raw) {
	return raw.length <= NORMALIZED_SESSION_KEY_CACHE_MAX_LENGTH ? normalizedSessionKeyCache.get(raw) : void 0;
}
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
		const matched = match[0] ?? "";
		const segment = match[2] ?? "";
		const segStart = (match.index ?? 0) + matched.length - segment.length;
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
	const cached = readNormalizedSessionKeyCache(raw);
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
//#region src/sessions/session-key-utils.ts
function isCronRunSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return false;
	return /^cron:[^:]+:run:[^:]+(?::|$)/.test(parsed.rest);
}
/**
* Splits the terminal per-run `:run:<id>` scope off an isolated cron session key
* (`agent:<id>:cron:<job>:run:<runId>`), yielding the cache-stable base key.
* The run scope is only ever appended to cron keys, so this is gated to that exact
* shape: any other key (including channel ids that embed a `:run:` segment) is returned
* unchanged with `runId` undefined, never truncating an unrelated session identity.
*/
function parseCronRunScopeSuffix(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return {
		baseSessionKey: void 0,
		runId: void 0
	};
	const parsed = parseAgentSessionKey(raw);
	if (!parsed || !/^cron:[^:]+:run:[^:]+$/.test(parsed.rest)) return {
		baseSessionKey: raw,
		runId: void 0
	};
	const markerIndex = raw.toLowerCase().lastIndexOf(":run:");
	return {
		baseSessionKey: raw.slice(0, markerIndex),
		runId: raw.slice(markerIndex + 5)
	};
}
function isCronSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return false;
	return normalizeOptionalLowercaseString(parsed.rest)?.startsWith("cron:") === true;
}
function isSubagentSessionKey(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return false;
	if (normalizeOptionalLowercaseString(raw)?.startsWith("subagent:")) return true;
	const parsed = parseAgentSessionKey(raw);
	return normalizeOptionalLowercaseString(parsed?.rest)?.startsWith("subagent:") === true;
}
function getSubagentDepth(sessionKey) {
	const raw = normalizeOptionalLowercaseString(sessionKey);
	if (!raw) return 0;
	return (parseAgentSessionKey(raw)?.rest ?? raw).toLowerCase().match(/(^|:)subagent:/g)?.length ?? 0;
}
function isAcpSessionKey(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return false;
	if (normalizeLowercaseStringOrEmpty(raw).startsWith("acp:")) return true;
	const parsed = parseAgentSessionKey(raw);
	return normalizeOptionalLowercaseString(parsed?.rest)?.startsWith("acp:") === true;
}
/** Stored ACP bindings and stale ACP keys both belong to ACP dispatch, never local fallback. */
function resolveSessionDispatchKind(sessionKey, entry) {
	return entry?.acp || isAcpSessionKey(sessionKey) ? "acp" : "agent";
}
function parseThreadSessionSuffix(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return {
		baseSessionKey: void 0,
		threadId: void 0
	};
	const markerIndex = normalizeLowercaseStringOrEmpty(raw).lastIndexOf(":thread:");
	const baseSessionKey = markerIndex === -1 ? raw : raw.slice(0, markerIndex);
	const threadIdRaw = markerIndex === -1 ? void 0 : raw.slice(markerIndex + 8);
	return {
		baseSessionKey,
		threadId: normalizeOptionalString(threadIdRaw)
	};
}
const SESSION_DELIVERY_PEER_KINDS = /* @__PURE__ */ new Set([
	"channel",
	"direct",
	"dm",
	"group"
]);
/** Parse only complete external delivery shapes; nested ownership stays opaque. */
function parseSessionDeliveryRoute(sessionKey) {
	const parsedThread = parseThreadSessionSuffix(sessionKey);
	const parsed = parseAgentSessionKey(parsedThread.baseSessionKey ?? sessionKey);
	if (!parsed) return null;
	const parts = parsed.rest.split(":");
	if (parts[0] === "agent" || parts.length < 3) return null;
	const channel = normalizeOptionalLowercaseString(parts[0]);
	if (!channel) return null;
	if (parts.length >= 4 && (parts[2] === "direct" || parts[2] === "dm")) {
		const accountId = normalizeOptionalString(parts[1]);
		const firstPeerIdSegment = normalizeOptionalString(parts[3]);
		const peerId = normalizeOptionalString(parts.slice(3).join(":"));
		if (!accountId || !firstPeerIdSegment || !peerId) return null;
		return {
			accountId,
			channel,
			peerId,
			peerKind: parts[2],
			threadId: parsedThread.threadId
		};
	}
	const peerKind = parts[1];
	const firstPeerIdSegment = normalizeOptionalString(parts[2]);
	const peerId = normalizeOptionalString(parts.slice(2).join(":"));
	if (!peerKind || !SESSION_DELIVERY_PEER_KINDS.has(peerKind) || !firstPeerIdSegment || !peerId) return null;
	return {
		channel,
		peerId,
		peerKind,
		threadId: parsedThread.threadId
	};
}
function parseRawSessionConversationRef(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return null;
	const rawParts = raw.split(":");
	const hasAgentWrapper = normalizeOptionalLowercaseString(rawParts[0]) === "agent";
	if (hasAgentWrapper && (!normalizeOptionalString(rawParts[1]) || rawParts.length < 3)) return null;
	const bodyStartIndex = hasAgentWrapper ? 2 : 0;
	const parts = rawParts.slice(bodyStartIndex);
	if (normalizeOptionalLowercaseString(parts[0]) === "agent") return null;
	if (parts.length < 3 || !normalizeOptionalString(parts[2])) return null;
	const channel = normalizeOptionalLowercaseString(parts[0]);
	const kind = normalizeOptionalLowercaseString(parts[1]);
	if (!channel || kind !== "group" && kind !== "channel") return null;
	const rawId = normalizeOptionalString(parts.slice(2).join(":"));
	const prefix = normalizeOptionalString(rawParts.slice(0, bodyStartIndex + 2).join(":"));
	if (!rawId || !prefix) return null;
	return {
		channel,
		kind,
		rawId,
		prefix
	};
}
//#endregion
//#region src/routing/session-key.ts
/** Legacy on-disk identity used only by doctor/migration and their fixtures. */
const LEGACY_IMPLICIT_AGENT_ID = "main";
/** @deprecated legacy implicit agent id; use roster default resolution. Removal: next major SDK cut. */
const DEFAULT_AGENT_ID = LEGACY_IMPLICIT_AGENT_ID;
function normalizeToken(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function scopedHeartbeatWakeOptions(sessionKey, wakeOptions, mainKey, scope) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return wakeOptions;
	if (isCronRunSessionKey(sessionKey)) {
		if (scope === "global") return {
			...wakeOptions,
			agentId: parsed.agentId
		};
		return {
			...wakeOptions,
			sessionKey: buildAgentMainSessionKey({
				agentId: parsed.agentId,
				mainKey
			})
		};
	}
	return {
		...wakeOptions,
		sessionKey
	};
}
function resolveEventSessionKey(sessionKey, mainKey, scope) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || !isCronRunSessionKey(sessionKey)) return sessionKey;
	if (scope === "global") return "global";
	return buildAgentMainSessionKey({
		agentId: parsed.agentId,
		mainKey
	});
}
function toAgentRequestSessionKey(storeKey) {
	const raw = (storeKey ?? "").trim();
	if (!raw) return;
	return parseAgentSessionKey(raw)?.rest ?? raw;
}
function agentSessionKeysMatchByRequestKey(left, right) {
	const leftRaw = (left ?? "").trim();
	const rightRaw = (right ?? "").trim();
	if (!leftRaw || !rightRaw) return false;
	return leftRaw === rightRaw || toAgentRequestSessionKey(leftRaw) === toAgentRequestSessionKey(rightRaw);
}
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
function isUnscopedSessionKeySentinel(sessionKey) {
	const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
	return lowered === "global" || lowered === "unknown";
}
function scopeLegacySessionKeyToAgent(params) {
	const raw = (params.sessionKey ?? "").trim();
	if (!raw) return;
	const agentId = params.agentId?.trim();
	if (!agentId || classifySessionKeyShape(raw) !== "legacy_or_alias") return raw;
	return toAgentStoreSessionKey({
		agentId,
		requestKey: raw,
		mainKey: params.mainKey
	});
}
function normalizeOptionalAgentId(value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? normalizeAgentId(trimmed) : void 0;
}
function sanitizeAgentId(value) {
	return normalizeAgentId(value);
}
function buildAgentPeerSessionKey(params) {
	const peerKind = params.peerKind ?? "direct";
	if (peerKind === "direct") {
		const dmScope = params.dmScope ?? "main";
		let peerId = (params.peerId ?? "").trim();
		const linkedPeerId = dmScope === "main" ? null : resolveLinkedDirectPeerId({
			identityLinks: params.identityLinks,
			channel: params.channel,
			peerId
		});
		if (linkedPeerId) peerId = linkedPeerId;
		peerId = normalizeLowercaseStringOrEmpty(peerId);
		if (dmScope === "per-account-channel-peer" && peerId) {
			const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
			const accountId = normalizeAccountId(params.accountId);
			return `agent:${normalizeAgentId(params.agentId)}:${channel}:${accountId}:direct:${peerId}`;
		}
		if (dmScope === "per-channel-peer" && peerId) {
			const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
			return `agent:${normalizeAgentId(params.agentId)}:${channel}:direct:${peerId}`;
		}
		if (dmScope === "per-peer" && peerId) return `agent:${normalizeAgentId(params.agentId)}:direct:${peerId}`;
		return buildAgentMainSessionKey({
			agentId: params.agentId,
			mainKey: params.mainKey
		});
	}
	if (params.groupScope === "main") return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey
	});
	const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
	const peerId = normalizeSessionPeerId({
		channel: params.channel,
		peerKind,
		peerId: params.peerId
	}) || "unknown";
	return `agent:${normalizeAgentId(params.agentId)}:${channel}:${peerKind}:${peerId}`;
}
/** @internal Resolves a declared cross-channel identity for one direct peer. */
function resolveLinkedDirectPeerId(params) {
	const identityLinks = params.identityLinks;
	if (!identityLinks) return null;
	const peerId = params.peerId.trim();
	if (!peerId) return null;
	const candidates = /* @__PURE__ */ new Set();
	const rawCandidate = normalizeToken(peerId);
	if (rawCandidate) candidates.add(rawCandidate);
	const channel = normalizeToken(params.channel);
	if (channel) {
		const scopedCandidate = normalizeToken(`${channel}:${peerId}`);
		if (scopedCandidate) candidates.add(scopedCandidate);
	}
	if (candidates.size === 0) return null;
	for (const [canonical, ids] of Object.entries(identityLinks)) {
		const canonicalName = canonical.trim();
		if (!canonicalName) continue;
		if (!Array.isArray(ids)) continue;
		for (const id of ids) {
			const normalized = normalizeToken(id);
			if (normalized && candidates.has(normalized)) return canonicalName;
		}
	}
	return null;
}
function buildGroupHistoryKey(params) {
	const channel = normalizeToken(params.channel) || "unknown";
	const accountId = normalizeAccountId(params.accountId);
	const peerId = normalizeSessionPeerId({
		channel,
		peerKind: params.peerKind,
		peerId: params.peerId
	}) || "unknown";
	return `${channel}:${accountId}:${params.peerKind}:${peerId}`;
}
function resolveThreadSessionKeys(params) {
	const threadId = (params.threadId ?? "").trim();
	if (!threadId) return {
		sessionKey: params.baseSessionKey,
		parentSessionKey: void 0
	};
	const normalizedThread = params.normalizeThreadId?.(threadId) ?? normalizeLowercaseStringOrEmpty(threadId);
	return {
		sessionKey: params.useSuffix ?? true ? `${params.baseSessionKey}:thread:${normalizedThread}` : params.baseSessionKey,
		parentSessionKey: params.parentSessionKey
	};
}
//#endregion
export { parseAgentSessionKey as A, parseCronRunScopeSuffix as C, resolveSessionDispatchKind as D, parseThreadSessionSuffix as E, normalizeSessionKeyPreservingOpaquePeerIds as O, isSubagentSessionKey as S, parseSessionDeliveryRoute as T, toAgentStoreSessionKey as _, buildGroupHistoryKey as a, isCronRunSessionKey as b, normalizeOptionalAgentId as c, resolveLinkedDirectPeerId as d, resolveThreadSessionKeys as f, toAgentRequestSessionKey as g, scopedHeartbeatWakeOptions as h, buildAgentPeerSessionKey as i, requiresFoldedSessionKeyAliasProof as j, normalizeSessionPeerId as k, resolveAgentIdFromSessionKey as l, scopeLegacySessionKeyToAgent as m, LEGACY_IMPLICIT_AGENT_ID as n, classifySessionKeyShape as o, sanitizeAgentId as p, agentSessionKeysMatchByRequestKey as r, isUnscopedSessionKeySentinel as s, DEFAULT_AGENT_ID as t, resolveEventSessionKey as u, getSubagentDepth as v, parseRawSessionConversationRef as w, isCronSessionKey as x, isAcpSessionKey as y };
