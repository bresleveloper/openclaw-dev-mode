import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { E as tryResolveLegacyDataOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
//#region src/config/legacy.default-agent-owner-state.ts
const legacyDefaultAgentIdByConfig = /* @__PURE__ */ new WeakMap();
function setRetainedLegacyDefaultAgentId(config, agentId) {
	if (agentId) legacyDefaultAgentIdByConfig.set(config, agentId);
	else legacyDefaultAgentIdByConfig.delete(config);
}
function getRetainedLegacyDefaultAgentId(config) {
	return legacyDefaultAgentIdByConfig.get(config);
}
//#endregion
//#region src/config/legacy.default-agent-owner.ts
function retainLegacyDefaultAgentId(config, agentId) {
	setRetainedLegacyDefaultAgentId(config, agentId ? normalizeAgentId(agentId) : void 0);
	return config;
}
function inheritLegacyDefaultAgentId(source, target) {
	return retainLegacyDefaultAgentId(target, tryGetLegacyDefaultAgentId(source));
}
function tryGetLegacyDefaultAgentId(config) {
	return typeof config === "object" && config !== null || typeof config === "function" ? getRetainedLegacyDefaultAgentId(config) : void 0;
}
function resolveSessionStoreCompatibilityAgentId(config) {
	const persistedAgentId = config.agents?.defaults?.sessionStore?.agentId?.trim();
	return persistedAgentId ? normalizeAgentId(persistedAgentId) : tryResolveLegacyDataOwnerAgentId(config) ?? "main";
}
//#endregion
export { getRetainedLegacyDefaultAgentId as a, tryGetLegacyDefaultAgentId as i, resolveSessionStoreCompatibilityAgentId as n, setRetainedLegacyDefaultAgentId as o, retainLegacyDefaultAgentId as r, inheritLegacyDefaultAgentId as t };
