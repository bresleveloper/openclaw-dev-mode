import { o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { c as CLAUDE_CLI_PROFILE_ID, t as CLAUDE_CLI_BACKEND_ID } from "../../cli-constants-Cgfnh_uF.mjs";
import { n as normalizeAnthropicProviderId, r as parseAnthropicModelRef } from "../../claude-model-refs-BbpYgmW1.mjs";
//#region extensions/anthropic/doctor-contract-api.ts
const CLAUDE_CLI_WILDCARD_REF = "anthropic/*";
function hasAnthropicCredential(cfg) {
	if (Object.values(cfg.auth?.profiles ?? {}).some((profile) => normalizeAnthropicProviderId(profile.provider) === "anthropic")) return true;
	return ["ANTHROPIC_API_KEY", "ANTHROPIC_OAUTH_TOKEN"].some((key) => {
		const value = process.env[key] || cfg.env?.vars?.[key] || cfg.env?.[key];
		return typeof value === "string" && value.trim() !== "";
	});
}
function normalizeCompatibilityConfig({ cfg }) {
	const models = cfg.agents?.defaults?.models ?? {};
	if (Object.keys(models).some((ref) => {
		const parsed = parseAnthropicModelRef(ref);
		return parsed?.explicitProvider && parsed.provider === "anthropic" && parsed.model === "*";
	})) return {
		config: cfg,
		changes: []
	};
	const model = cfg.agents?.defaults?.model;
	const primary = typeof model === "string" ? model : model?.primary;
	const parsedPrimary = primary ? parseAnthropicModelRef(primary) : null;
	const primaryEntry = primary ? models[primary] : void 0;
	const primaryRuntime = isRecord(primaryEntry?.agentRuntime) ? primaryEntry.agentRuntime.id : void 0;
	const anthropicProviders = Object.entries(cfg.models?.providers ?? {}).filter(([provider]) => normalizeAnthropicProviderId(provider) === "anthropic");
	if (!parsedPrimary?.explicitProvider || parsedPrimary.provider !== "anthropic" || normalizeLowercaseStringOrEmpty(primaryRuntime) !== "claude-cli" || anthropicProviders.some(([, entry]) => entry.agentRuntime !== void 0 || entry.apiKey !== void 0 && entry.apiKey !== CLAUDE_CLI_PROFILE_ID) || hasAnthropicCredential(cfg)) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...cfg,
			agents: {
				...cfg.agents,
				defaults: {
					...cfg.agents?.defaults,
					models: {
						...models,
						[CLAUDE_CLI_WILDCARD_REF]: { agentRuntime: { id: CLAUDE_CLI_BACKEND_ID } }
					}
				}
			}
		},
		changes: [`agents.defaults.models["${CLAUDE_CLI_WILDCARD_REF}"]: added the ${CLAUDE_CLI_BACKEND_ID} runtime so Claude models not seeded at Claude CLI sign-in run through Claude Code instead of failing without an Anthropic API key.`]
	};
}
//#endregion
export { normalizeCompatibilityConfig };
