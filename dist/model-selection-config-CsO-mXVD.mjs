import { _ as resolvePrimaryStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveAgentConfig, s as resolveAgentModelConfigForRuntime } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-DKlQ1p0S.mjs";
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
