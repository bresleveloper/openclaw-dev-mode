import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { S as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
//#region src/gateway/session-utils-store-candidates.ts
function resolveGatewaySessionStoreCandidates(cfg, agentId, cache, excludeConfiguredFallback = false, env = process.env, resolveExistingTargets) {
	const cached = cache?.get(agentId);
	if (cached) return cached;
	if (!resolveExistingTargets) throw new Error("Session store discovery must be prepared in the read worker");
	const storeConfig = cfg.session?.store;
	const fallback = {
		agentId,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId,
			env
		})
	};
	const discovery = {
		existing: resolveExistingTargets(agentId, !cache && excludeConfiguredFallback && !isPerAgentSessionStoreConfig(storeConfig) ? fallback.storePath : void 0),
		fallback
	};
	cache?.set(agentId, discovery);
	return discovery;
}
function resolveGatewaySessionStoreLookupCandidates(params) {
	const configured = isConfiguredSessionStoreAgentId(params.cfg, params.agentId);
	if (!configured && params.registeredDatabases) {
		const readSources = params.registeredDatabases.filter((source) => normalizeAgentId(source.agentId) === params.agentId).map((source) => ({
			agentId: source.agentId,
			path: source.path
		}));
		return {
			configured,
			fallback: {
				agentId: params.agentId,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
					agentId: params.agentId,
					env: params.env
				})
			},
			candidates: readSources.map((source) => ({
				agentId: source.agentId,
				storePath: source.path
			})),
			readSources
		};
	}
	const { existing, fallback } = resolveGatewaySessionStoreCandidates(params.cfg, params.agentId, params.targetDiscoveryCache, configured, params.env, params.resolveExistingTargets);
	return {
		configured,
		fallback,
		candidates: configured ? [fallback, ...existing.filter((target) => target.storePath !== fallback.storePath)] : existing
	};
}
//#endregion
export { resolveGatewaySessionStoreLookupCandidates as n, resolveGatewaySessionStoreCandidates as t };
