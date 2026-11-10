import { t as isCodexAppServerNativeAuthProfile } from "./auth-profile-auwzSwwy.mjs";
import { i as isCodexResponsesOAuthCredential, t as CODEX_RESPONSES_OAUTH_PROVIDER } from "./responses-oauth-CCV7aVYF.mjs";
//#region extensions/codex/src/app-server/thread-model-selection.ts
const CODEX_NATIVE_PERSONALITY_NONE = "none";
function resolveCodexBindingModelProviderFallback(params) {
	const provider = params.provider?.trim().toLowerCase();
	if (provider && provider !== "codex") return;
	const currentModel = params.currentModel?.trim();
	const bindingModel = params.bindingModel?.trim();
	if (currentModel && bindingModel && currentModel === bindingModel && params.bindingModelProvider) return params.bindingModelProvider;
	const slashIndex = currentModel?.indexOf("/") ?? -1;
	return slashIndex > 0 && slashIndex < (currentModel?.length ?? 0) - 1 ? void 0 : params.bindingModelProvider;
}
async function resolveCodexAppServerThreadModelSelection(params) {
	const authProfileId = params.inheritBindingAuthProfile === false ? params.authProfileId : params.authProfileId ?? params.binding?.authProfileId;
	const explicitModelProvider = await resolveCodexAppServerModelProvider({
		...params,
		authProfileId
	});
	const bindingModelProvider = params.binding?.threadId ? resolveCodexBindingModelProviderFallback({
		provider: params.provider,
		currentModel: params.model,
		bindingModel: params.binding.model,
		bindingModelProvider: params.binding.modelProvider
	}) : void 0;
	return await resolveCodexAppServerRequestModelSelection({
		...params,
		model: params.requestModel ?? params.model,
		modelProvider: explicitModelProvider ?? bindingModelProvider,
		authProfileId
	});
}
async function resolveCodexAppServerRequestModelSelection(params) {
	const model = params.model.trim();
	const modelProvider = params.modelProvider?.trim();
	if (modelProvider) return {
		model,
		modelProvider
	};
	const slashIndex = model.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= model.length - 1) return { model };
	const inferredProvider = model.slice(0, slashIndex);
	const inferredModelProvider = await resolveCodexAppServerModelProvider({
		...params,
		provider: inferredProvider
	});
	return {
		model: model.slice(slashIndex + 1).trim(),
		...inferredModelProvider ? { modelProvider: inferredModelProvider } : {}
	};
}
async function resolveCodexAppServerModelProvider(params) {
	const normalized = params.provider.trim();
	const normalizedLower = normalized.toLowerCase();
	if (normalizedLower === "openai" && params.authProfileId && isCodexResponsesOAuthCredential(params.authProfileStore?.profiles[params.authProfileId])) return CODEX_RESPONSES_OAUTH_PROVIDER;
	if (!normalized || normalizedLower === "codex") return;
	if (normalizedLower === "openai" && (params.homeScope === "user" || await isCodexAppServerNativeAuthProfile(params))) return;
	return normalizedLower === "openai" ? "openai" : normalized;
}
//#endregion
export { resolveCodexBindingModelProviderFallback as a, resolveCodexAppServerThreadModelSelection as i, resolveCodexAppServerModelProvider as n, resolveCodexAppServerRequestModelSelection as r, CODEX_NATIVE_PERSONALITY_NONE as t };
