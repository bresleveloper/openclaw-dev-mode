import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./defaults-Bg930vxE.mjs";
import { i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as OPENAI_PROVIDER_ID } from "./openai-routing-Bm7d8DH8.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
//#region src/agents/embedded-agent-runner/run/runtime-resolution.ts
const CODEX_HARNESS_ID = "codex";
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function resolveAttemptTrajectoryAttribution(params) {
	const authProfileProvider = normalizeLowercaseStringOrEmpty(params.runtimePlan.auth?.authProfileProviderForAuth);
	if (normalizeLowercaseStringOrEmpty(params.runtimePlan.observability?.harnessId) === "codex" && authProfileProvider !== "openai" && normalizeLowercaseStringOrEmpty(params.model.provider) === "openai" && normalizeLowercaseStringOrEmpty(params.model.api) === OPENAI_RESPONSES_API) return {
		modelApi: OPENAI_CODEX_RESPONSES_API,
		modelId: params.modelId,
		provider: OPENAI_PROVIDER_ID
	};
	return {
		...params.model.api ? { modelApi: params.model.api } : {},
		modelId: params.modelId,
		provider: params.provider
	};
}
function resolveInitialThinkLevel(params) {
	if (params.requested) return params.requested;
	return resolveThinkingDefaultCore({
		cfg: params.config ?? {},
		agentId: params.agentId,
		provider: params.provider,
		model: params.modelId,
		catalog: [{
			provider: params.provider,
			id: params.modelId,
			name: params.modelId,
			reasoning: params.model.reasoning
		}]
	});
}
/** Marks only request parameters that OpenClaw applies to provider egress. */
function resolveRequestStreamTransportOverrides(streamParams) {
	return streamParams && Object.keys(streamParams).length > 0 ? "present" : void 0;
}
function resolveInitialEmbeddedRunModel(params) {
	const resolutionContext = {
		cfg: params.config ?? {},
		agentId: params.agentId,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	};
	const configuredDefault = resolveDefaultModelForAgent(resolutionContext);
	const explicitProvider = normalizeOptionalString(params.provider);
	const explicitModel = normalizeOptionalString(params.model);
	const defaultProvider = configuredDefault.provider || "openai";
	if (explicitProvider && explicitModel) return {
		provider: explicitProvider,
		modelId: explicitModel
	};
	if (explicitModel) {
		const aliasIndex = buildModelAliasIndex({
			...resolutionContext,
			defaultProvider
		});
		const resolved = resolveModelRefFromString({
			...resolutionContext,
			raw: explicitModel,
			defaultProvider,
			aliasIndex
		});
		return {
			provider: resolved?.ref.provider ?? defaultProvider,
			modelId: resolved?.ref.model ?? explicitModel
		};
	}
	return {
		provider: explicitProvider ?? defaultProvider,
		modelId: configuredDefault.model || "gpt-6-astra"
	};
}
//#endregion
export { resolveRequestStreamTransportOverrides as a, resolveInitialThinkLevel as i, resolveAttemptTrajectoryAttribution as n, resolveInitialEmbeddedRunModel as r, CODEX_HARNESS_ID as t };
