import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { n as setRetainedLegacyDefaultAgentId, t as getRetainedLegacyDefaultAgentId } from "./legacy.default-agent-owner-state-BIemD7B0.mjs";
import { C as tryResolveLegacyDataOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/config/legacy.default-agent-owner.ts
function retainLegacyDefaultAgentId(config, agentId) {
	setRetainedLegacyDefaultAgentId(config, agentId ? normalizeAgentId(agentId) : void 0);
	return config;
}
function inheritLegacyDefaultAgentId(source, target) {
	return retainLegacyDefaultAgentId(target, tryGetLegacyDefaultAgentId(source));
}
function tryGetLegacyDefaultAgentId(config) {
	return getRetainedLegacyDefaultAgentId(config);
}
function resolveSessionStoreCompatibilityAgentId(config) {
	const persistedAgentId = config.agents?.defaults?.sessionStore?.agentId?.trim();
	return persistedAgentId ? normalizeAgentId(persistedAgentId) : tryResolveLegacyDataOwnerAgentId(config) ?? "main";
}
//#endregion
export { tryGetLegacyDefaultAgentId as i, resolveSessionStoreCompatibilityAgentId as n, retainLegacyDefaultAgentId as r, inheritLegacyDefaultAgentId as t };
