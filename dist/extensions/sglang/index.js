import { a as buildProviderReplayFamilyHooks, o as defineSelfHostedOpenAICompatibleProvider } from "../../provider-model-shared-DwrT_ZjA.mjs";
import { i as SGLANG_PROVIDER_LABEL, n as SGLANG_DEFAULT_BASE_URL, r as SGLANG_MODEL_PLACEHOLDER, t as SGLANG_DEFAULT_API_KEY_ENV_VAR } from "../../defaults-DEyguuem.mjs";
//#region extensions/sglang/index.ts
var sglang_default = defineSelfHostedOpenAICompatibleProvider({
	id: "sglang",
	label: SGLANG_PROVIDER_LABEL,
	hint: "Fast self-hosted OpenAI-compatible server",
	groupHint: "Fast self-hosted server",
	defaultBaseUrl: SGLANG_DEFAULT_BASE_URL,
	apiKeyEnvVar: SGLANG_DEFAULT_API_KEY_ENV_VAR,
	modelPlaceholder: SGLANG_MODEL_PLACEHOLDER,
	overrides: buildProviderReplayFamilyHooks({
		family: "openai-compatible",
		dropReasoningFromHistory: false
	})
});
//#endregion
export { sglang_default as default };
