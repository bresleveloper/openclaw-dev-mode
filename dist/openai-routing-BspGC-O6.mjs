import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as normalizeOptionalAgentRuntimeId, o as resolveAgentScopedRuntimeOverride, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { n as resolveModelRouteIntent, r as resolveModelRuntimePolicy, t as resolveAgentRuntimePolicyAgentId } from "./model-runtime-policy-IbIjya7U.mjs";
import { t as canonicalizeProviderModelId } from "./provider-model-route-D-_CCdkJ.mjs";
import { f as resolveOpenAIModelRoutes } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as hasAuthoredProviderRequestParams } from "./model-extra-params-BJQs6MZV.mjs";
//#region src/agents/openai-routing.ts
/**
* OpenAI provider routing decisions shared by model selection, auth profiles, and runtime setup.
*
* Custom OpenAI-compatible base URLs intentionally bypass Codex-runtime defaults.
*/
/** Canonical provider id for OpenAI-hosted model routes. */
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = OPENAI_PROVIDER_ID;
/** Returns true for provider ids that normalize to OpenAI. */
function isOpenAIProvider(provider) {
	return normalizeProviderId(provider ?? "") === OPENAI_PROVIDER_ID;
}
/** Canonicalizes shipped OpenAI model aliases at runtime boundaries. */
function canonicalizeOpenAIModelId(provider, modelId) {
	return isOpenAIProvider(provider) ? canonicalizeProviderModelId(OPENAI_PROVIDER_ID, modelId) : modelId;
}
/** Resolves the provider-owned implicit runtime for one concrete OpenAI route. */
function resolveOpenAIImplicitAgentRuntime(params) {
	if (!isOpenAIProvider(params.provider)) return null;
	const modelId = params.modelId;
	const agentId = resolveAgentRuntimePolicyAgentId(params);
	const primaryModel = params.config ? resolveDefaultModelForAgent({
		cfg: params.config,
		agentId,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	}) : void 0;
	const hasConfiguredProviderRequestParams = hasAuthoredProviderRequestParams({
		config: params.config,
		provider: params.provider ?? "openai",
		modelId,
		agentId
	});
	const requestTransportOverrides = params.requestTransportOverrides === "present" || hasConfiguredProviderRequestParams ? "present" : "none";
	const resolution = resolveOpenAIModelRoutes({
		provider: params.provider,
		modelId,
		api: params.api,
		baseUrl: params.baseUrl,
		config: params.config,
		env: params.env,
		agentId,
		requestTransportOverrides,
		primaryModel,
		routeIntent: params.routeIntent ?? resolveModelRouteIntent({
			...params,
			primaryModel
		})
	});
	if (!resolution) return "openclaw";
	return resolution.kind !== "incompatible" && resolution.defaultRuntimeId === "codex" ? "codex" : "openclaw";
}
/** Parses the provider portion from a provider/model ref. */
function parseModelRefProvider(value) {
	if (typeof value !== "string") return;
	const slashIndex = value.trim().indexOf("/");
	if (slashIndex <= 0) return;
	return normalizeProviderId(value.trim().slice(0, slashIndex));
}
/** Returns true when selected model config should ensure the Codex plugin exists. */
function modelSelectionShouldEnsureCodexPlugin(params) {
	const provider = parseModelRefProvider(params.model);
	if (provider !== "openai") return false;
	const modelRef = params.model?.trim();
	const slashIndex = modelRef?.indexOf("/") ?? -1;
	const modelId = slashIndex >= 0 ? modelRef?.slice(slashIndex + 1) : void 0;
	const configuredPolicy = resolveModelRuntimePolicy({
		config: params.config,
		provider,
		modelId,
		agentId: params.agentId
	}).policy;
	const configuredRuntime = normalizeOptionalAgentRuntimeId(configuredPolicy?.id);
	if (configuredRuntime && !isDefaultAgentRuntimeId(configuredRuntime)) return configuredRuntime === "codex";
	if (!configuredPolicy) {
		const agentRuntime = resolveAgentScopedRuntimeOverride({
			config: params.config,
			agentId: params.agentId
		});
		if (agentRuntime && !isDefaultAgentRuntimeId(agentRuntime)) return agentRuntime === "codex";
	}
	return resolveOpenAIImplicitAgentRuntime({
		provider,
		modelId,
		config: params.config,
		agentId: params.agentId
	}) === "codex";
}
/** Lists auth-profile providers for an OpenAI runtime route. */
function listOpenAIAuthProfileProvidersForAgentRuntime(params) {
	if (!isOpenAIProvider(params.provider)) return [params.provider];
	return [OPENAI_PROVIDER_ID];
}
/** Resolves the provider id passed to OpenAI runtime auth/execution paths. */
function resolveOpenAIRuntimeProvider(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
/** Resolves the selected provider id displayed for OpenAI runtime routes. */
function resolveSelectedOpenAIRuntimeProvider(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
/** Resolves the config provider used for context-window lookup. */
function resolveContextConfigProviderForRuntime(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
//#endregion
export { listOpenAIAuthProfileProvidersForAgentRuntime as a, resolveContextConfigProviderForRuntime as c, resolveSelectedOpenAIRuntimeProvider as d, isOpenAIProvider as i, resolveOpenAIImplicitAgentRuntime as l, OPENAI_PROVIDER_ID as n, modelSelectionShouldEnsureCodexPlugin as o, canonicalizeOpenAIModelId as r, parseModelRefProvider as s, OPENAI_CODEX_PROVIDER_ID as t, resolveOpenAIRuntimeProvider as u };
