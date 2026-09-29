import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, t as AgentSelectionRequiredError, y as tryResolveAgentOperationAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
//#region src/acp/runtime/session-meta-store.ts
/** Store binding for ACP session metadata: resolves which session-store row owns a key. */
/** Join the logical ACP key to its canonical SQLite entry without renaming ACP metadata. */
function resolveStoreEntryForSessionKey(params) {
	const storeSessionKey = normalizeStoreSessionKey(params.sessionKey);
	if (!storeSessionKey) return { storeSessionKey };
	return {
		storeSessionKey,
		entry: loadSessionEntryReadOnly({
			...params,
			sessionKey: storeSessionKey
		})
	};
}
/** Resolves the session store path that owns an ACP session key. */
function resolveSessionStorePathForAcp(params) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const parsed = parseAgentSessionKey(params.sessionKey);
	const requestedAgentId = params.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const parsedAgentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : void 0;
	if (requestedAgentId && parsedAgentId && requestedAgentId !== parsedAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${params.sessionKey}"`,
		hint: `Agent "${requestedAgentId}" does not own agent-scoped session key "${params.sessionKey}".`
	});
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, params.sessionKey);
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
	const storeSessionKey = canonicalizeMainSessionAlias({
		cfg,
		sessionKey: params.sessionKey,
		agentId: resolvedAgentId
	});
	const canonicalOwner = resolvePersistedSessionStoreOwnerForKey(cfg, storeSessionKey);
	if (canonicalOwner.kind === "retired" || canonicalOwner.kind === "configured" && canonicalOwner.agentId !== resolvedAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `ACP session key "${storeSessionKey}"`,
		hint: "The canonical fixed-store session has a different or retired owner. Select its recorded owner."
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
	const { cfg, agentId, storePath, storeSessionKey: canonicalKey } = resolveSessionStorePathForAcp({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		env: params.env
	});
	try {
		const { storeSessionKey, entry } = resolveStoreEntryForSessionKey({
			...agentId ? { agentId } : {},
			storePath,
			sessionKey: canonicalKey,
			...params.clone === false ? { clone: false } : {}
		});
		return {
			cfg,
			agentId,
			storePath,
			storeSessionKey,
			entry
		};
	} catch {
		return {
			cfg,
			agentId,
			storePath,
			storeSessionKey: canonicalKey,
			storeReadFailed: true
		};
	}
}
//#endregion
export { resolveSessionStorePathForAcp as n, resolveStoreEntryForSessionKey as r, readSessionEntryFromStore as t };
