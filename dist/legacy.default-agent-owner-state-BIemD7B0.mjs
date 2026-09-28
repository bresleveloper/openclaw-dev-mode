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
export { setRetainedLegacyDefaultAgentId as n, getRetainedLegacyDefaultAgentId as t };
