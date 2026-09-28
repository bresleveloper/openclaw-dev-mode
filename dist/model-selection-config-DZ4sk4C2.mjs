import { _ as resolvePrimaryStringValue } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
//#region src/agents/model-selection-config.ts
function resolveDefaultModelForAgent(params) {
	return resolveConfiguredModelRef({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
function resolveSubagentConfiguredModelSelection(params) {
	const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
	return resolvePrimaryStringValue(agentConfig?.subagents?.model) ?? resolvePrimaryStringValue(params.cfg.agents?.defaults?.subagents?.model) ?? (params.includeAgentPrimary === false ? void 0 : resolvePrimaryStringValue(agentConfig?.model));
}
//#endregion
export { resolveSubagentConfiguredModelSelection as n, resolveDefaultModelForAgent as t };
