import { f as resolveClaudeModelIdentity, p as resolveClaudeMythos5ModelIdentity } from "./anthropic-D-i5CCnY.mjs";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-vHRl78JV.mjs";
import "./claude-model-runtime-C1j-v9zi.mjs";
import { l as CLAUDE_CLI_OFF_THINKING_PROFILE, u as CLAUDE_CLI_PROFILE_ID } from "./cli-constants-D6douw4O.mjs";
import { n as normalizeAnthropicProviderConfigForProvider } from "./config-defaults-D_9hSoEj.mjs";
import "./fast-mode-policy-CQkedLTE.mjs";
//#region extensions/anthropic/provider-policy-api.ts
/**
* Provider-policy API for Anthropic and Claude CLI. Core calls this lightweight
* path for config defaults and thinking profiles.
*/
const normalizeConfig = normalizeAnthropicProviderConfigForProvider;
/** Profile ids that native Claude auth has retired from OpenClaw ownership. */
const deprecatedProfileIds = [CLAUDE_CLI_PROFILE_ID];
/** Resolve Claude thinking profile for Anthropic or Claude CLI providers. */
function resolveThinkingProfile(params) {
	const contractModelId = resolveClaudeModelIdentity({
		id: params.modelId,
		params: params.params
	});
	const provider = params.provider.trim().toLowerCase();
	switch (provider) {
		case "anthropic":
		case "claude-cli":
			if (provider === "claude-cli" && resolveClaudeMythos5ModelIdentity({ id: contractModelId })) return CLAUDE_CLI_OFF_THINKING_PROFILE;
			return resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: true });
		default: return null;
	}
}
//#endregion
export { normalizeConfig as n, resolveThinkingProfile as r, deprecatedProfileIds as t };
