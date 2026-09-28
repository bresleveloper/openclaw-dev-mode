import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/local-runtime-attribution.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
/** Maps local Codex runtime plans onto the provider/api pair exposed to event projection. */
function resolveCodexLocalRuntimeAttribution(params) {
	const authProfileProvider = normalizeLowercaseStringOrEmpty(params.runtimePlan?.auth?.authProfileProviderForAuth);
	if (normalizeLowercaseStringOrEmpty(params.runtimePlan?.observability.harnessId) === "codex" && authProfileProvider !== OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.model.provider) === OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.model.api) === OPENAI_RESPONSES_API) return {
		provider: OPENAI_PROVIDER_ID,
		api: OPENAI_CODEX_RESPONSES_API
	};
	return {
		provider: params.provider,
		api: params.model.api
	};
}
//#endregion
export { resolveCodexLocalRuntimeAttribution as t };
