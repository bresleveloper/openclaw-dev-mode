import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as tryResolveAmbientOwnerAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import { y as resolveSessionAgentIdsStrict } from "./agent-scope-CG17uXFn.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
//#region src/plugin-sdk/agent-scope-runtime.ts
/**
* @deprecated Use `resolveSessionAgentIdsStrict` with an explicit or prepared
* owner. Retained through 2026-11-29 for plugins shipped before strict
* multi-agent ownership was introduced.
*/
function resolveSessionAgentIdsCompatibility(params) {
	const normalized = {
		...params,
		agentId: normalizeOptionalString(params.agentId)
	};
	try {
		return resolveSessionAgentIdsStrict(normalized);
	} catch (error) {
		const requestedAgentId = normalized.agentId ?? normalizeOptionalString(params.fallbackAgentId);
		const config = params.config ?? {};
		if (!(error instanceof AgentSelectionRequiredError) || requestedAgentId || resolvePersistedSessionStoreOwnerForKey(config, params.sessionKey).kind !== "none") throw error;
		const ambientAgentId = tryResolveAmbientOwnerAgentId(config);
		if (!ambientAgentId) throw error;
		return resolveSessionAgentIdsStrict({
			...normalized,
			fallbackAgentId: ambientAgentId
		});
	}
}
/**
* @deprecated Use `resolveSessionAgentIdStrict` with an explicit or prepared
* owner. Retained through 2026-11-29 for plugins shipped before strict
* multi-agent ownership was introduced.
*/
function resolveSessionAgentIdCompatibility(params) {
	return resolveSessionAgentIdsCompatibility(params).sessionAgentId;
}
//#endregion
export { resolveSessionAgentIdsCompatibility as n, resolveSessionAgentIdCompatibility as t };
