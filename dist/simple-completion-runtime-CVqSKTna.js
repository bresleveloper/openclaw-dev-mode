import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CDZXADgT.js";
import { a as resolveAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { n as OPENAI_PROVIDER_ID, r as isOpenAIProvider } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import "./defaults-mDjiWzE5.js";
import { a as prepareProviderRuntimeAuth } from "./provider-runtime.runtime.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-B7N9imAw.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-CKMggJal.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { r as formatMissingAuthError } from "./model-auth-runtime-shared-D8fFlbsz.js";
import { n as completeSimple } from "./stream-Bs1DzXcN.js";
import { a as getApiKeyForModel, n as applyLocalNoAuthHeaderOverride } from "./model-auth-Bvz14MtI.js";
import { n as resolveModelAsync, t as resolveModel } from "./model-Cc001htM.js";
import { t as prepareModelForSimpleCompletion } from "./simple-completion-transport-830TQwEh.js";
//#region src/agents/simple-completion-runtime.ts
function resolveSimpleCompletionSelectionForAgent(params) {
	const fallbackRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const modelRef = params.modelRef?.trim() || resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
	const split = modelRef ? splitTrailingAuthProfile(modelRef) : null;
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: fallbackRef.provider || "openai"
	});
	const resolved = split ? resolveModelRefFromString({
		raw: split.model,
		defaultProvider: fallbackRef.provider || "openai",
		aliasIndex
	}) : null;
	const provider = resolved?.ref.provider ?? fallbackRef.provider;
	const modelId = resolved?.ref.model ?? fallbackRef.model;
	if (!provider || !modelId) return null;
	return {
		provider,
		modelId,
		...resolveSimpleCompletionRuntimeProvider({
			cfg: params.cfg,
			agentId: params.agentId,
			provider,
			modelId
		}),
		profileId: split?.profile || void 0,
		agentDir: resolveAgentDir(params.cfg, params.agentId)
	};
}
function resolveSimpleCompletionRuntimeProvider(params) {
	if (!isOpenAIProvider(params.provider)) return {};
	return resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		agentId: params.agentId
	}).runtime === "codex" ? { runtimeProvider: OPENAI_PROVIDER_ID } : {};
}
async function setRuntimeApiKeyForCompletion(params) {
	if (params.model.provider === "github-copilot") {
		const { resolveCopilotApiToken } = await import("./plugin-sdk/provider-auth.js");
		const copilotToken = await resolveCopilotApiToken({ githubToken: params.apiKey });
		params.authStorage.setRuntimeApiKey(params.model.provider, copilotToken.token);
		return {
			apiKey: copilotToken.token,
			model: {
				...params.model,
				baseUrl: copilotToken.baseUrl
			}
		};
	}
	const preparedAuth = await prepareProviderRuntimeAuth({
		provider: params.model.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: process.env,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: process.env,
			provider: params.model.provider,
			modelId: params.model.id,
			model: params.model,
			apiKey: params.apiKey,
			authMode: params.authMode,
			profileId: params.profileId
		}
	});
	const runtimeApiKey = preparedAuth?.apiKey?.trim() || params.apiKey;
	params.authStorage.setRuntimeApiKey(params.model.provider, runtimeApiKey);
	return {
		apiKey: runtimeApiKey,
		model: applyPreparedRuntimeAuthToModel(params.model, preparedAuth)
	};
}
function hasMissingApiKeyAllowance(params) {
	return Boolean(params.allowMissingApiKeyModes?.includes(params.mode));
}
async function prepareSimpleCompletionModel(params) {
	const resolved = params.useAsyncModelResolution || params.skipAgentDiscovery ? await (params.modelResolver ?? resolveModelAsync)(params.provider, params.modelId, params.agentDir, params.cfg, {
		...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
		...params.skipAgentDiscovery ? { skipAgentDiscovery: true } : {},
		authProfileId: params.profileId,
		preferredProfile: params.preferredProfile
	}) : resolveModel(params.provider, params.modelId, params.agentDir, params.cfg, {
		authProfileId: params.profileId,
		preferredProfile: params.preferredProfile
	});
	if (!resolved.model) return { error: resolved.error ?? `Unknown model: ${params.provider}/${params.modelId}` };
	let auth;
	try {
		auth = await getApiKeyForModel({
			model: resolved.model,
			cfg: params.cfg,
			agentDir: params.agentDir,
			profileId: params.profileId,
			preferredProfile: params.preferredProfile
		});
	} catch (err) {
		return { error: `Auth lookup failed for provider "${resolved.model.provider}": ${formatErrorMessage(err)}` };
	}
	const rawApiKey = auth.apiKey?.trim();
	if (!rawApiKey && !hasMissingApiKeyAllowance({
		mode: auth.mode,
		allowMissingApiKeyModes: params.allowMissingApiKeyModes
	})) return {
		error: formatMissingAuthError(auth, resolved.model.provider),
		auth
	};
	let resolvedApiKey = rawApiKey;
	let resolvedModel = resolved.model;
	if (rawApiKey) {
		const runtimeCredential = await setRuntimeApiKeyForCompletion({
			authStorage: resolved.authStorage,
			model: resolved.model,
			apiKey: rawApiKey,
			authMode: auth.mode,
			cfg: params.cfg,
			workspaceDir: params.agentDir,
			profileId: auth.profileId
		});
		resolvedApiKey = runtimeCredential.apiKey;
		resolvedModel = runtimeCredential.model;
	}
	const resolvedAuth = {
		...auth,
		apiKey: resolvedApiKey
	};
	return {
		model: applyLocalNoAuthHeaderOverride(resolvedModel, resolvedAuth),
		auth: resolvedAuth
	};
}
async function prepareSimpleCompletionModelForAgent(params) {
	const selection = resolveSimpleCompletionSelectionForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		modelRef: params.modelRef
	});
	if (!selection) return { error: `No model configured for agent ${params.agentId}.` };
	const prepared = await prepareSimpleCompletionModel({
		cfg: params.cfg,
		provider: selection.runtimeProvider ?? selection.provider,
		modelId: selection.modelId,
		agentDir: selection.agentDir,
		profileId: selection.profileId,
		preferredProfile: params.preferredProfile,
		allowMissingApiKeyModes: params.allowMissingApiKeyModes,
		...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
		useAsyncModelResolution: params.useAsyncModelResolution,
		skipAgentDiscovery: params.skipAgentDiscovery,
		modelResolver: params.modelResolver
	});
	if ("error" in prepared) return {
		...prepared,
		selection
	};
	return {
		selection,
		model: prepared.model,
		auth: prepared.auth
	};
}
async function completeWithPreparedSimpleCompletionModel(params) {
	const completionModel = prepareModelForSimpleCompletion({
		model: params.model,
		cfg: params.cfg
	});
	const { reasoning: rawReasoning, ...options } = params.options ?? {};
	const reasoning = normalizeSimpleCompletionReasoning(rawReasoning);
	return await completeSimple(completionModel, params.context, {
		...options,
		...reasoning ? { reasoning } : {},
		apiKey: params.auth.apiKey
	});
}
function normalizeSimpleCompletionReasoning(reasoning) {
	switch (reasoning) {
		case void 0:
		case "off": return;
		case "adaptive": return "medium";
		case "max": return "xhigh";
		default: return reasoning;
	}
}
//#endregion
export { resolveSimpleCompletionSelectionForAgent as i, prepareSimpleCompletionModel as n, prepareSimpleCompletionModelForAgent as r, completeWithPreparedSimpleCompletionModel as t };
