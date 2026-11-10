import { n as listKnownSessionStoreAgentIds } from "./targets-discovery.native-C3KQIMj6.mjs";
import { c as resolveGatewaySessionStoreTargets, o as prepareCombinedSessionStore } from "./combined-store-gateway-D1UQome7.mjs";
//#region src/config/sessions/combined-store-topology.worker.ts
/** Resolve durable federation in the existing discovery worker; the host owns incognito rows. */
function readCombinedSessionStoreTopology(request) {
	const options = {
		...request.options,
		includeIncognito: false,
		discovery: {
			...request.options.discovery,
			readCandidates: request.candidates
		}
	};
	const selections = [
		["all", {}],
		["configured", { configuredAgentsOnly: true }],
		...(request.scopeAgentIds ? [.../* @__PURE__ */ new Set([...request.scopeAgentIds, ...listKnownSessionStoreAgentIds(request.config, {
			env: options.discovery.env,
			registeredDatabases: options.discovery.snapshot?.registeredAgentDatabases ?? []
		})])] : []).map((agentId) => [`agent:${agentId}`, { agentId }])
	];
	const scopes = request.scopeAgentIds ? new Map(selections.map(([key, selection]) => {
		try {
			return [key, resolveGatewaySessionStoreTargets(request.config, {
				...selection,
				includeIncognito: false,
				discovery: options.discovery
			})];
		} catch (error) {
			return [key, error instanceof Error ? error : new Error(String(error))];
		}
	})) : void 0;
	return {
		kind: "combined-store-topology",
		prepared: prepareCombinedSessionStore(request.config, options),
		...scopes ? { scopes } : {}
	};
}
//#endregion
export { readCombinedSessionStoreTopology };
