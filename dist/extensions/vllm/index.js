import { i as defineSelfHostedOpenAICompatibleProvider } from "../../provider-model-shared-B_4afNJ5.mjs";
import { i as VLLM_PROVIDER_LABEL, n as VLLM_DEFAULT_BASE_URL, r as VLLM_MODEL_PLACEHOLDER, t as VLLM_DEFAULT_API_KEY_ENV_VAR } from "../../defaults-Cha6Xv-5.mjs";
import { t as wrapVllmPriorityStream } from "../../priority-bhAt3R_E.mjs";
import { n as resolveThinkingProfile } from "../../thinking-policy-C8CEl-sL.mjs";
import { n as normalizeVllmResolvedModel, r as wrapVllmProviderStream } from "../../stream-Byj4xR8l.mjs";
import "../../api-BeIcs1MD.mjs";
//#region extensions/vllm/index.ts
var vllm_default = defineSelfHostedOpenAICompatibleProvider({
	id: "vllm",
	label: VLLM_PROVIDER_LABEL,
	hint: "Local/self-hosted OpenAI-compatible server",
	groupHint: "Local/self-hosted OpenAI-compatible",
	defaultBaseUrl: VLLM_DEFAULT_BASE_URL,
	apiKeyEnvVar: VLLM_DEFAULT_API_KEY_ENV_VAR,
	modelPlaceholder: VLLM_MODEL_PLACEHOLDER,
	overrides: {
		buildUnknownModelHint: () => "vLLM requires authentication to be registered as a provider. Set VLLM_API_KEY (any value works) or run \"openclaw configure\". See: https://docs.openclaw.ai/providers/vllm",
		resolveThinkingProfile,
		normalizeResolvedModel: normalizeVllmResolvedModel,
		wrapStreamFn: wrapVllmProviderStream,
		wrapSimpleCompletionStreamFn: wrapVllmPriorityStream
	}
});
//#endregion
export { vllm_default as default };
