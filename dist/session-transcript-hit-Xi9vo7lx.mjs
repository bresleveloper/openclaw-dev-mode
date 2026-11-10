import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { o as parseUsageCountedSessionIdFromFileName } from "./transcript-file-names-BZ8jA63H.mjs";
import "./artifacts-C6u8F4sP.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { i as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-D1UQome7.mjs";
import "./session-transcript-memory-hit-DQ5oaXTM.mjs";
import path from "node:path";
//#region src/plugin-sdk/session-transcript-hit.ts
/** @deprecated Await loadCombinedSessionStoreForGatewayAsync. Final compatibility day: 2026-12-31. */
function loadCombinedSessionStoreForGateway(cfg, opts = {}) {
	warnPluginSdkDeprecation({
		family: "session-transcript-store",
		method: "loadCombinedSessionStoreForGateway",
		replacement: "loadCombinedSessionStoreForGatewayAsync",
		compatibility: "The synchronous loader retains its complete session-entry return value."
	});
	return projectPluginSessionStore(loadCombinedSessionStoreForGatewayCore(cfg, {
		...opts,
		includeIncognito: false,
		projection: "full"
	}));
}
/** Loads the complete cross-session plugin view through the existing database workers. */
async function loadCombinedSessionStoreForGatewayAsync(cfg, opts = {}) {
	const { loadCombinedSessionStoreForGatewayCoreAsync } = await import("./combined-store-gateway-read-BhgN3aYB.mjs");
	return projectPluginSessionStore(await loadCombinedSessionStoreForGatewayCoreAsync(cfg, {
		...opts,
		includeIncognito: false,
		projection: "full"
	}));
}
function projectPluginSessionStore(result) {
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
	if (matches.length > 0) return matches;
	const archivedOwnerAgentId = normalizeOptionalString(params.archivedOwnerAgentId);
	if (!archivedOwnerAgentId) return [];
	const fallbackKey = `agent:${normalizeAgentId(archivedOwnerAgentId)}:${params.stem}`;
	return isIncognitoSessionKey(fallbackKey) ? [] : [fallbackKey];
}
//#endregion
export { resolveTranscriptStemToSessionKeys as a, loadCombinedSessionStoreForGatewayAsync as i, extractTranscriptStemFromSessionsMemoryHit as n, loadCombinedSessionStoreForGateway as r, extractTranscriptIdentityFromSessionsMemoryHit as t };
