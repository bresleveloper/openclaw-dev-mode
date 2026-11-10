import { _ as resolvePrimaryStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveAgentConfig, s as resolveAgentModelConfigForRuntime } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-CVU_V2PQ.mjs";
//#region src/agents/model-selection-config.ts
function resolveDefaultModelForAgent(params) {
	return resolveConfiguredModelRef({
		...params,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
}
function resolveSubagentConfiguredModelSelection(params) {
	const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
	return resolvePrimaryStringValue(agentConfig?.subagents?.model) ?? resolvePrimaryStringValue(params.cfg.agents?.defaults?.subagents?.model) ?? (params.includeAgentPrimary === false ? void 0 : resolvePrimaryStringValue(resolveAgentModelConfigForRuntime(agentConfig, params.modelRuntime)));
}
//#endregion
export { resolveSubagentConfiguredModelSelection as n, resolveDefaultModelForAgent as t };
