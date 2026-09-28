import { a as parseProviderModelRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { E as listAgentEntries, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/agents/decision-model-setting.ts
/** A defined empty agent value disables decisions rather than inheriting the default. */
function resolveDecisionModelSetting(config, agentId) {
	const value = (agentId ? resolveAgentConfig(config, agentId)?.decisionModel : void 0) ?? config.agents?.defaults?.decisionModel;
	return value ? parseProviderModelRef(value) ?? void 0 : void 0;
}
/** Activation includes explicitly selected providers throughout the configured fleet. */
function getConfiguredDecisionProviderIds(config) {
	const refs = [config.agents?.defaults?.decisionModel, ...listAgentEntries(config).map((entry) => entry.decisionModel)];
	return [...new Set(refs.flatMap((ref) => {
		const selection = ref ? parseProviderModelRef(ref) : null;
		return selection ? [selection.provider] : [];
	}))];
}
//#endregion
export { resolveDecisionModelSetting as n, getConfiguredDecisionProviderIds as t };
