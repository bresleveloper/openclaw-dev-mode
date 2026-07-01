import { c as resolveClaudeModelIdentity } from "../../src-M7TBQdDX.js";
import { n as resolveClaudeThinkingProfile } from "../../provider-claude-thinking-s2PAP2Wu.js";
import "../../provider-model-shared-pp09751S.js";
import { n as CLAUDE_CLI_OFF_THINKING_PROFILE } from "../../cli-shared-B4FSWhaK.js";
import { n as normalizeAnthropicProviderConfigForProvider, t as applyAnthropicConfigDefaults } from "../../config-defaults-BboXB6yv.js";
//#region extensions/anthropic/provider-policy-api.ts
/**
* Provider-policy API for Anthropic and Claude CLI. Core calls this lightweight
* path for config defaults and thinking profiles.
*/
/** Normalize Anthropic provider config without importing runtime registration. */
function normalizeConfig(params) {
	return normalizeAnthropicProviderConfigForProvider(params);
}
/** Apply Anthropic config defaults through the provider-policy seam. */
function applyConfigDefaults(params) {
	return applyAnthropicConfigDefaults(params);
}
/** Resolve Claude thinking profile for Anthropic or Claude CLI providers. */
function resolveThinkingProfile(params) {
	const contractModelId = resolveClaudeModelIdentity({
		id: params.modelId,
		params: params.params
	});
	switch (params.provider.trim().toLowerCase()) {
		case "anthropic": return resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: true });
		case "claude-cli":
			if (contractModelId.startsWith("claude-fable-5")) return CLAUDE_CLI_OFF_THINKING_PROFILE;
			return resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: true });
		default: return null;
	}
}
//#endregion
export { applyConfigDefaults, normalizeConfig, resolveThinkingProfile };
