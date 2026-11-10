import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { C as tryResolveAgentOperationAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { i as rethrowIncognitoSessionError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { a as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./config-B3oiWDlr.mjs";
//#region src/acp/runtime/session-meta-store.ts
/** Store binding for ACP session metadata: resolves which session-store row owns a key. */
/** Resolves the session store path that owns an ACP session key. */
function resolveSessionStorePathForAcp(params) {
	const cfg = params.cfg ?? readRuntimeConfig();
	const sessionKey = normalizeStoreSessionKey(params.sessionKey);
	const parsed = parseAgentSessionKey(sessionKey);
	const requestedAgentId = params.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const parsedAgentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : void 0;
	if (requestedAgentId && parsedAgentId && requestedAgentId !== parsedAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: `Agent "${requestedAgentId}" does not own agent-scoped session key "${params.sessionKey}".`
	});
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey);
	const agentId = requestedAgentId ?? parsedAgentId;
	if (requestedAgentId && persistedStoreOwner.kind === "configured" && requestedAgentId !== persistedStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: `The shared fixed-store row belongs to agent "${persistedStoreOwner.agentId}", not agent "${requestedAgentId}".`
	});
	if (persistedStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: `The shared fixed-store row belongs to retired agent "${persistedStoreOwner.agentId}".`
	});
	const resolvedAgentId = agentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveAgentOperationAgentId(cfg);
	if (!resolvedAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: "Pass an explicit agent owner for this ACP session."
	});
	const storeSessionKey = resolveSqliteSessionKey(canonicalizeMainSessionAlias({
		cfg,
		sessionKey,
		agentId: resolvedAgentId
	}), resolvedAgentId);
	const canonicalOwner = resolvePersistedSessionStoreOwnerForKey(cfg, storeSessionKey);
	if (canonicalOwner.kind === "retired" || canonicalOwner.kind === "configured" && canonicalOwner.agentId !== resolvedAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${storeSessionKey}"`,
		hint: "The stored fixed-store session has a different or retired owner. Select its recorded owner."
	});
	return {
		cfg,
		storeSessionKey,
		agentId: resolvedAgentId,
		storePath: resolveSessionStorePathCore(cfg.session?.store, {
			agentId: resolvedAgentId,
			env: params.env
		})
	};
}
/** Reads the canonical session binding while retaining ACP's logical key. */
function readSessionEntryFromStore(params) {
	const { cfg, agentId, storePath, storeSessionKey } = resolveSessionStorePathForAcp(params);
	try {
		return {
			cfg,
			agentId,
			storePath,
			storeSessionKey,
			entry: storeSessionKey ? loadSessionEntryReadOnly({
				agentId,
				storePath,
				sessionKey: storeSessionKey,
				...params.clone === false ? { clone: false } : {}
			}) : void 0
		};
	} catch (error) {
		rethrowIncognitoSessionError(error);
		return {
			cfg,
			agentId,
			storePath,
			storeSessionKey,
			storeReadFailed: true
		};
	}
}
//#endregion
export { resolveSessionStorePathForAcp as n, readSessionEntryFromStore as t };
