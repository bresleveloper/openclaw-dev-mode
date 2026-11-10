import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as resolveCodexNativeWebSearchConfig } from "./codex-native-web-search.shared-CVD6u15D.mjs";
import { n as isCodexNativeSearchEligibleModel, t as hasAvailableCodexAuth } from "./codex-native-web-search-core-DjHnWmPI.mjs";
//#region src/agents/codex-native-web-search.ts
/** True when Codex native web search should appear relevant for an agent. */
async function isCodexNativeWebSearchRelevant(params) {
	if (resolveCodexNativeWebSearchConfig(params.config).enabled) return true;
	if (await hasAvailableCodexAuth(params)) return true;
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.config,
		agentId: params.agentId
	});
	const configuredProvider = params.config.models?.providers?.[defaultModel.provider];
	const configuredModelApi = configuredProvider?.models?.find((candidate) => candidate.id === defaultModel.model)?.api;
	return isCodexNativeSearchEligibleModel({
		modelProvider: defaultModel.provider,
		modelApi: configuredModelApi ?? configuredProvider?.api
	});
}
//#endregion
export { isCodexNativeWebSearchRelevant };
