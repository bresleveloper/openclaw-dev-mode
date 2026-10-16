import "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { o as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { f as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { l as readSessionMessagesPageWithStatsAsync } from "./session-transcript-readers-CDyCeaj9.mjs";
//#region src/gateway/control-ui-public-session-read.ts
function resolvePublicSessionShareScope(cfg, locator) {
	const parsed = parseAgentSessionKey(locator.sessionKey);
	const fixedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, locator.sessionKey);
	if (locator.sessionKey !== "global" && (!parsed || parsed.agentId !== locator.agentId || locator.sessionKey !== `agent:${parsed.agentId}:${parsed.rest}`) || fixedOwner.kind === "retired" || fixedOwner.kind === "configured" && fixedOwner.agentId !== locator.agentId || !listAgentIds(cfg).includes(locator.agentId) || isIncognitoSessionKey(locator.sessionKey)) return null;
	return {
		agentId: locator.agentId,
		sessionKey: locator.sessionKey,
		storePath: resolveSessionStorePathForScope(locator, cfg),
		projection: "list"
	};
}
function readAuthorizedEntry(scope, locator) {
	const entry = loadExactSessionEntryReadOnly(scope)?.entry;
	const share = resolveSessionPublicShare(entry);
	return share?.id === locator.shareId && share.sessionId === locator.sessionId ? entry : void 0;
}
function isPublicSessionShareActive(cfg, locator) {
	const scope = resolvePublicSessionShareScope(cfg, locator);
	return Boolean(scope && readAuthorizedEntry(scope, locator));
}
/** Only the exact published generation is readable; this grants no Gateway session authority. */
async function readPublicSessionShare(cfg, locator, options = {}) {
	const scope = resolvePublicSessionShareScope(cfg, locator);
	if (!scope) return null;
	const entry = readAuthorizedEntry(scope, locator);
	if (!entry) return null;
	const history = await readSessionMessagesPageWithStatsAsync({
		...scope,
		sessionId: locator.sessionId,
		sessionEntry: entry
	}, {
		offset: options.offset ?? 0,
		maxMessages: 100,
		maxBytes: 1048576,
		allowResetArchiveFallback: false
	});
	const current = readAuthorizedEntry(scope, locator);
	if (!current) return null;
	return {
		title: (current.label || current.displayName || "Shared session").trim() || "Shared session",
		messages: history.messages,
		totalMessages: history.totalMessages,
		truncated: history.omittedOversized === true,
		...history.olderOffset !== void 0 ? { olderOffset: history.olderOffset } : {}
	};
}
//#endregion
export { isPublicSessionShareActive, readPublicSessionShare };
