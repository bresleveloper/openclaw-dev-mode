import "./agent-scope-CDZXADgT.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-C3ijpoNo.js";
import { at as resolveStoredSessionKeyForAgentStore, nt as canonicalizeSpawnedByForAgent } from "./store-DJ7wx5_V.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { i as resolveSessionStoreTargets, n as resolveAgentSessionStoreTargetsSync, r as resolveAllAgentSessionStoreTargetsSync } from "./targets-7kfDzi_O.js";
import { f as listSessionEntries } from "./session-accessor-Dx6KDG0K.js";
//#region src/config/sessions/combined-store-gateway.ts
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function loadGatewayStoreEntries(storePath) {
	return Object.fromEntries(listSessionEntries({
		clone: false,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
}
function mergeSessionEntryIntoCombined(params) {
	const { cfg, combined, entry, agentId, canonicalKey } = params;
	const existing = combined[canonicalKey];
	if (existing && (existing.updatedAt ?? 0) > (entry.updatedAt ?? 0)) {
		const spawnedBy = canonicalizeSpawnedByForAgent(cfg, agentId, existing.spawnedBy ?? entry.spawnedBy);
		combined[canonicalKey] = {
			...entry,
			...existing,
			spawnedBy
		};
		return;
	}
	const spawnedBy = canonicalizeSpawnedByForAgent(cfg, agentId, entry.spawnedBy ?? existing?.spawnedBy);
	if (!existing && entry.spawnedBy === spawnedBy) combined[canonicalKey] = entry;
	else combined[canonicalKey] = {
		...existing,
		...entry,
		spawnedBy
	};
}
/** Loads and canonicalizes session entries for gateway views across one or more agent stores. */
function loadCombinedSessionStoreForGateway(cfg, opts = {}) {
	const storeConfig = cfg.session?.store;
	if (storeConfig && !isStorePathTemplate(storeConfig)) {
		const storePath = resolveStorePath(storeConfig);
		const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(cfg));
		const store = loadGatewayStoreEntries(storePath);
		const combined = {};
		for (const [key, entry] of Object.entries(store)) mergeSessionEntryIntoCombined({
			cfg,
			combined,
			entry,
			agentId: defaultAgentId,
			canonicalKey: resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId: defaultAgentId,
				sessionKey: key
			})
		});
		return {
			storePath,
			store: combined
		};
	}
	const requestedAgentId = typeof opts.agentId === "string" && opts.agentId.trim() ? normalizeAgentId(opts.agentId) : void 0;
	const targets = requestedAgentId ? resolveAgentSessionStoreTargetsSync(cfg, requestedAgentId) : opts.configuredAgentsOnly === true ? resolveSessionStoreTargets(cfg, { allAgents: true }) : resolveAllAgentSessionStoreTargetsSync(cfg);
	const combined = {};
	for (const target of targets) {
		const agentId = target.agentId;
		const storePath = target.storePath;
		const store = loadGatewayStoreEntries(storePath);
		for (const [key, entry] of Object.entries(store)) mergeSessionEntryIntoCombined({
			cfg,
			combined,
			entry,
			agentId,
			canonicalKey: resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId,
				sessionKey: key
			})
		});
	}
	return {
		storePath: targets.length === 1 ? targets[0].storePath : typeof storeConfig === "string" && storeConfig.trim() ? storeConfig.trim() : "(multiple)",
		store: combined
	};
}
//#endregion
export { loadCombinedSessionStoreForGateway as t };
