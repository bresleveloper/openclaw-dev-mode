import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { f as parseUsageCountedSessionIdFromFileName } from "./artifacts-C9weQ_MG.mjs";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-Bb3P3TzM.mjs";
import "./session-transcript-memory-hit-vbgnM699.mjs";
import path from "node:path";
//#region src/plugin-sdk/session-transcript-hit.ts
/** Loads the cross-session plugin view without process-only incognito rows. */
function loadCombinedSessionStoreForGateway(cfg, opts = {}) {
	const result = loadCombinedSessionStoreForGatewayCore(cfg, {
		...opts,
		includeIncognito: false,
		projection: "full"
	});
	return {
		storePath: result.storePath,
		store: Object.fromEntries(Object.entries(result.store).filter(([sessionKey]) => !isIncognitoSessionKey(sessionKey)))
	};
}
function parseSessionsPath(hitPath) {
	const normalized = hitPath.replace(/\\/g, "/");
	const fromSessionsRoot = normalized.startsWith("sessions/") ? normalized.slice(9) : normalized;
	const parts = fromSessionsRoot.split("/").filter(Boolean);
	return {
		base: path.posix.basename(fromSessionsRoot),
		ownerAgentId: normalized.startsWith("sessions/") && parts.length === 2 ? normalizeAgentId(parts[0]) : void 0
	};
}
/**
* Derive transcript stem `S` from a memory search hit path for `source === "sessions"`.
* Builtin index uses `sessions/<basename>.jsonl`.
* Archived transcripts (`.jsonl.reset.<iso>` / `.jsonl.deleted.<iso>`) resolve
* to the same stem as the live `.jsonl` they were rotated from.
*/
function extractTranscriptStemFromSessionsMemoryHit(hitPath) {
	return extractTranscriptIdentityFromSessionsMemoryHit(hitPath)?.stem ?? null;
}
/** Parse live/archive ownership metadata from a sessions-memory hit path. */
function extractTranscriptIdentityFromSessionsMemoryHit(hitPath) {
	const { base, ownerAgentId } = parseSessionsPath(hitPath);
	const archivedStem = parseUsageCountedSessionIdFromFileName(base);
	if (archivedStem && base !== `${archivedStem}.jsonl`) return {
		stem: archivedStem,
		ownerAgentId,
		archived: true
	};
	if (base.endsWith(".jsonl")) {
		const stem = base.slice(0, -6);
		return stem ? {
			stem,
			ownerAgentId,
			archived: false
		} : null;
	}
	return null;
}
/**
* Map transcript stem to canonical session store keys (all agents in the combined store).
* Session tools visibility and agent-to-agent policy are enforced by the caller (e.g.
* `createSessionVisibilityGuard`), including cross-agent cases.
*/
function resolveTranscriptStemToSessionKeys(params) {
	const { store } = params;
	const matches = [];
	const stemAsFile = params.stem.endsWith(".jsonl") ? params.stem : `${params.stem}.jsonl`;
	const parsedStemId = parseUsageCountedSessionIdFromFileName(stemAsFile);
	for (const [sessionKey, entry] of Object.entries(store)) {
		if (isIncognitoSessionKey(sessionKey)) continue;
		if (entry.sessionId === params.stem || parsedStemId && entry.sessionId === parsedStemId) matches.push(sessionKey);
	}
	const deduped = uniqueStrings(matches);
	if (deduped.length > 0) return deduped;
	const archivedOwnerAgentId = normalizeOptionalString(params.archivedOwnerAgentId);
	if (!archivedOwnerAgentId) return [];
	const fallbackKey = `agent:${normalizeAgentId(archivedOwnerAgentId)}:${params.stem}`;
	return isIncognitoSessionKey(fallbackKey) ? [] : [fallbackKey];
}
//#endregion
export { resolveTranscriptStemToSessionKeys as i, extractTranscriptStemFromSessionsMemoryHit as n, loadCombinedSessionStoreForGateway as r, extractTranscriptIdentityFromSessionsMemoryHit as t };
