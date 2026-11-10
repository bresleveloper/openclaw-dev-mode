import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/local-runtime-attribution.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function resolveCodexLocalRuntimeAttribution(params) {
	const authProfileProvider = normalizeLowercaseStringOrEmpty(params.runtimePlan?.auth?.authProfileProviderForAuth);
	const useCodexResponsesApi = normalizeLowercaseStringOrEmpty(params.runtimePlan?.observability.harnessId) === "codex" && authProfileProvider !== OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.model.provider) === OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.model.api) === OPENAI_RESPONSES_API;
	return {
		provider: useCodexResponsesApi ? OPENAI_PROVIDER_ID : params.provider,
		api: useCodexResponsesApi ? OPENAI_CODEX_RESPONSES_API : params.model.api
	};
}
//#endregion
export { resolveCodexLocalRuntimeAttribution as t };
