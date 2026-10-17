import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./defaults-Jag53zwP.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { n as OPENAI_PROVIDER_ID } from "./openai-routing-92B-lj2w.mjs";
import "./model-selection-D3_rVb38.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
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
	const cfg = params.config ?? {};
	const staticPreliminaryNormalization = {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	};
	const configuredDefault = resolveDefaultModelForAgent({
		cfg,
		agentId: params.agentId,
		...staticPreliminaryNormalization
	});
	const explicitProvider = normalizeOptionalString(params.provider);
	const explicitModel = normalizeOptionalString(params.model);
	const defaultProvider = configuredDefault.provider || "openai";
	if (explicitProvider && explicitModel) return {
		provider: explicitProvider,
		modelId: explicitModel
	};
	if (explicitModel) {
		const aliasIndex = buildModelAliasIndex({
			cfg,
			agentId: params.agentId,
			defaultProvider,
			...staticPreliminaryNormalization
		});
		const resolved = resolveModelRefFromString({
			cfg,
			agentId: params.agentId,
			raw: explicitModel,
			defaultProvider,
			aliasIndex,
			...staticPreliminaryNormalization
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
