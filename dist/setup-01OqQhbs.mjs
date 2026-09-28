import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-BbU4k6fu.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { t as FailoverError } from "./error-ON38hPhx.mjs";
import { a as isAgentHarnessSessionKey, c as isValidAgentHarnessSessionStoreEntry, d as resolveAgentHarnessSessionStoreEntryError, h as resolveSessionPinnedHarnessId, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import "./failover-error-BwAkMLuL.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { t as log } from "./logger-Cp6WXSpQ.mjs";
import { a as resolveContextWindowInfo, i as formatContextWindowWarningMessage, n as evaluateContextWindowGuard, r as formatContextWindowBlockMessage } from "./context-window-guard-BHx3Iiy5.mjs";
import { t as readAgentModelContextTokens } from "./model-context-tokens-DEI2pbNY.mjs";
//#region src/agents/embedded-agent-runner/run/setup.ts
/** Durable harness sessions run only with their exact persisted identity and runtime lock. */
function resolveAgentHarnessRunAdmissionError(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	const entry = params.entry;
	const reservedKey = isAgentHarnessSessionKey(sessionKey);
	if (!entry) return reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : void 0;
	if (entry.modelSelectionLocked !== true) return;
	const durableEntryError = resolveAgentHarnessSessionStoreEntryError(sessionKey, entry);
	if (durableEntryError) return durableEntryError;
	if (!isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) return;
	const requestedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const durableHarnessId = resolveSessionPinnedHarnessId(entry);
	const matchesRequestedRuntime = params.modelSelectionLocked === true && requestedHarnessId === durableHarnessId;
	const matchesDurableRuntime = entry.sessionId === params.sessionId && durableHarnessId !== void 0;
	return matchesRequestedRuntime && matchesDurableRuntime ? void 0 : reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
}
/**
* Runs model-selection hooks before resolving the runtime model.
*/
async function resolveHookModelSelection(params) {
	let provider = params.provider;
	let modelId = params.modelId;
	if (params.modelSelectionLocked === true) return {
		provider,
		modelId
	};
	let modelResolveOverride;
	const hookRunner = params.hookRunner;
	if (hookRunner?.hasHooks("before_model_resolve")) try {
		const event = params.attachments ? {
			prompt: params.prompt,
			attachments: params.attachments
		} : { prompt: params.prompt };
		modelResolveOverride = await hookRunner.runBeforeModelResolve(event, params.hookContext);
	} catch (hookErr) {
		log.warn(`before_model_resolve hook failed: ${String(hookErr)}`);
	}
	if (modelResolveOverride?.providerOverride) {
		provider = modelResolveOverride.providerOverride;
		log.info(`[hooks] provider overridden to ${provider}`);
	}
	if (modelResolveOverride?.modelOverride) {
		modelId = modelResolveOverride.modelOverride;
		log.info(`[hooks] model overridden to ${modelId}`);
	}
	return {
		provider,
		modelId
	};
}
/**
* Converts prompt image refs into the minimal attachment shape exposed to
* before-model-resolve hooks. Empty image lists stay undefined so hook payloads
* do not grow a meaningless attachments field.
*/
function buildBeforeModelResolveAttachments(images) {
	if (!images?.length) return;
	return images.map((img) => ({
		kind: "image",
		mimeType: img.mimeType
	}));
}
/** Builds structural model metadata for a harness that resolves its real model natively. */
function createNativeModelOwnedRuntimeModel(params) {
	return {
		provider: params.provider,
		id: params.modelId,
		name: params.modelId,
		baseUrl: "",
		api: "openai-responses",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_CONTEXT_TOKENS,
		maxTokens: DEFAULT_CONTEXT_TOKENS
	};
}
/**
* Resolves context-window policy for the selected runtime model and returns the
* model shape the session runtime should see. Configured context caps are
* reflected in `effectiveModel.contextWindow` so auto-compaction uses the same
* limit as the guard.
*/
function resolveEffectiveRuntimeModel(params) {
	const contextWindowProfile = resolveModelContextWindowProfile({
		catalogEntry: params.runtimeModel,
		selected: params.contextWindow
	});
	const resolvedCtxInfo = resolveContextWindowInfo({
		cfg: params.cfg,
		provider: params.contextConfigProvider ?? params.provider,
		modelId: params.modelId,
		modelContextTokens: readAgentModelContextTokens(params.runtimeModel),
		modelContextWindow: contextWindowProfile.contextTokens,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const ctxInfo = contextWindowProfile.contextWindow && contextWindowProfile.contextTokens !== void 0 && resolvedCtxInfo.tokens > contextWindowProfile.contextTokens ? {
		...resolvedCtxInfo,
		tokens: contextWindowProfile.contextTokens,
		source: "model"
	} : resolvedCtxInfo;
	const effectiveModel = ctxInfo.tokens < (params.runtimeModel.contextWindow ?? Infinity) ? {
		...params.runtimeModel,
		contextWindow: ctxInfo.tokens
	} : params.runtimeModel;
	const ctxGuard = evaluateContextWindowGuard({ info: ctxInfo });
	const runtimeBaseUrl = typeof params.runtimeModel.baseUrl === "string" ? params.runtimeModel.baseUrl : void 0;
	if (ctxGuard.shouldWarn) log.warn(formatContextWindowWarningMessage({
		provider: params.provider,
		modelId: params.modelId,
		guard: ctxGuard,
		runtimeBaseUrl
	}));
	if (ctxGuard.shouldBlock) {
		const message = formatContextWindowBlockMessage({
			guard: ctxGuard,
			runtimeBaseUrl
		});
		log.error(`blocked model (context window too small): ${params.provider}/${params.modelId} ctx=${ctxGuard.tokens} (min=${ctxGuard.hardMinTokens}) source=${ctxGuard.source}; ${message}`);
		throw new FailoverError(message, {
			reason: "unknown",
			provider: params.provider,
			model: params.modelId
		});
	}
	return {
		ctxInfo,
		effectiveModel
	};
}
/** Resolves only OpenClaw-owned context policy; native model owners keep that policy private. */
function resolveEmbeddedRuntimeModelPolicy(params) {
	if (params.nativeModelOwned) return { effectiveModel: params.runtimeModel };
	const resolved = resolveEffectiveRuntimeModel(params);
	const contextTokenBudget = Math.min(resolved.ctxInfo.tokens, params.contextTokenBudget ?? resolved.ctxInfo.tokens);
	return {
		contextWindowInfo: contextTokenBudget < resolved.ctxInfo.tokens ? {
			...resolved.ctxInfo,
			tokens: contextTokenBudget,
			referenceTokens: resolved.ctxInfo.referenceTokens ?? resolved.ctxInfo.tokens
		} : resolved.ctxInfo,
		contextTokenBudget,
		effectiveModel: contextTokenBudget < (resolved.effectiveModel.contextWindow ?? Infinity) ? {
			...resolved.effectiveModel,
			contextWindow: contextTokenBudget
		} : resolved.effectiveModel
	};
}
//#endregion
export { resolveHookModelSelection as a, resolveEmbeddedRuntimeModelPolicy as i, createNativeModelOwnedRuntimeModel as n, resolveAgentHarnessRunAdmissionError as r, buildBeforeModelResolveAttachments as t };
