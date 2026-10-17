import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { o as resolveAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as resolveModelRouteIntent, r as resolveModelRuntimePolicy, t as resolveAgentRuntimePolicyAgentId } from "./model-runtime-policy-CpJt0qgU.mjs";
import { t as canonicalizeProviderModelId } from "./provider-model-route-DaPsySrY.mjs";
import { o as resolveOpenAIModelRoutes } from "./openai-model-routes-CVmOODN3.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { t as hasAuthoredProviderRequestParams } from "./model-extra-params-C1g6s41K.mjs";
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
/** Reads the retired whole-agent runtime opt-out from pre-admission plugin-setup config. */
function resolveRetiredAgentRuntimeOptOut(params) {
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	const entry = agentId && params.config ? resolveAgentEntry(params.config, agentId) : void 0;
	return normalizeOptionalAgentRuntimeId(entry?.agentRuntime?.id ?? params.config?.agents?.defaults?.agentRuntime?.id);
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
		const agentRuntime = resolveRetiredAgentRuntimeOptOut({
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
