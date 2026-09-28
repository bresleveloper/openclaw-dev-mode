import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
//#region src/plugin-sdk/session-transcript-memory-hit.ts
const SESSION_TRANSCRIPT_MEMORY_HIT_PREFIX = "transcript";
function requireMemoryKeySegment(value, label) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) throw new Error(`Cannot build session transcript memory hit key without ${label}.`);
	return encodeURIComponent(normalized);
}
function decodeMemoryKeySegment(value) {
	try {
		return normalizeOptionalString(decodeURIComponent(value)) ?? null;
	} catch {
		return null;
	}
}
function syntheticSessionKey(identity) {
	return `agent:${identity.agentId}:${identity.sessionId}`;
}
/**
* Builds the memory hit key for one session transcript.
*/
function formatSessionTranscriptMemoryHitKey(params) {
	const agentId = requireMemoryKeySegment(normalizeAgentId(params.agentId), "agentId");
	const sessionId = requireMemoryKeySegment(params.sessionId, "sessionId");
	return `${SESSION_TRANSCRIPT_MEMORY_HIT_PREFIX}:${agentId}:${sessionId}`;
}
/**
* Parses a session transcript memory hit key.
*/
function parseSessionTranscriptMemoryHitKey(key) {
	const parts = key.split(":");
	if (parts.length !== 3 || parts[0] !== SESSION_TRANSCRIPT_MEMORY_HIT_PREFIX) return null;
	const agentId = decodeMemoryKeySegment(parts[1] ?? "");
	const sessionId = decodeMemoryKeySegment(parts[2] ?? "");
	if (!agentId || !sessionId) return null;
	return {
		agentId: normalizeAgentId(agentId),
		key: formatSessionTranscriptMemoryHitKey({
			agentId,
			sessionId
		}),
		sessionId
	};
}
/**
* Maps a session transcript memory hit key back to visible session store keys.
*/
function resolveSessionTranscriptMemoryHitKeyToSessionKeys(params) {
	const identity = parseSessionTranscriptMemoryHitKey(params.key);
	if (!identity) return [];
	const matches = Object.entries(params.store).filter(([sessionKey, entry]) => {
		return !isIncognitoSessionKey(sessionKey) && entry.sessionId === identity.sessionId && normalizeAgentId(resolveAgentIdFromSessionKey(sessionKey)) === identity.agentId;
	}).map(([sessionKey]) => sessionKey);
	const deduped = uniqueStrings(matches);
	if (deduped.length > 0) return deduped;
	const fallbackKey = syntheticSessionKey(identity);
	return params.includeSyntheticFallback === false || isIncognitoSessionKey(fallbackKey) ? [] : [fallbackKey];
}
//#endregion
export { parseSessionTranscriptMemoryHitKey as n, resolveSessionTranscriptMemoryHitKeyToSessionKeys as r, formatSessionTranscriptMemoryHitKey as t };
