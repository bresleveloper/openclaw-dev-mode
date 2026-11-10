import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-Bg930vxE.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as FailoverError } from "./error-Bcp4ZyOv.mjs";
import { a as isAgentHarnessSessionKey, c as isValidAgentHarnessSessionStoreEntry, d as resolveAgentHarnessSessionStoreEntryError, h as resolveSessionPinnedHarnessId, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { n as withGuardedFetchRequestAuthority } from "./fetch-request-authority-BA1Sa1i8.mjs";
import { l as readClaimingHookAdmission } from "./hooks-CU2qx9-T.mjs";
import "./failover-error-Bjf0VdY2.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { a as resolveContextWindowInfo, i as formatContextWindowWarningMessage, n as evaluateContextWindowGuard, r as formatContextWindowBlockMessage } from "./context-window-guard-y7ROXMY6.mjs";
import { resolveOpenAIResponsesRequestContextTokens } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/agents/assistant-error-transcript.ts
/** Defers failed-attempt display without changing the append-only transcript. */
function createAssistantErrorTranscript() {
	const streamOutputs = /* @__PURE__ */ new WeakMap();
	let pending;
	const clear = () => {
		const failure = pending;
		pending = void 0;
		failure?.replaceStream?.(false);
	};
	return {
		clear,
		bindStream(source, replaceStream) {
			if (pending?.source === source) pending.replaceStream = replaceStream;
			else streamOutputs.set(source, replaceStream);
		},
		snapshot() {
			return pending;
		},
		restore(snapshot) {
			clear();
			pending = snapshot;
			pending?.replaceStream?.(true);
		},
		record(source) {
			pending = {
				source,
				replaceStream: streamOutputs.get(source)
			};
			streamOutputs.delete(source);
		},
		settle(failed) {
			if (!failed) clear();
			else pending = void 0;
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/setup.ts
/** Durable harness sessions run only with their exact persisted identity and runtime lock. */
function resolveAgentHarnessRunAdmissionError(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	const entry = params.entry;
	const reservedKey = isAgentHarnessSessionKey(sessionKey);
	if (!entry) return reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : void 0;
	if (entry.modelSelectionLocked !== true) return;
	if (!isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) return resolveAgentHarnessSessionStoreEntryError(sessionKey, entry);
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
	const selection = {
		provider: params.provider,
		modelId: params.modelId
	};
	if (params.modelSelectionLocked === true) return selection;
	let modelResolveOverride;
	const hookRunner = params.hookRunner;
	if (hookRunner?.hasHooks("before_model_resolve")) {
		const assertCurrent = readClaimingHookAdmission(params.hookContext)?.assertCurrent;
		await params.awaitSessionDiffBaseline?.();
		assertCurrent?.();
		try {
			const event = params.attachments ? {
				prompt: params.prompt,
				attachments: params.attachments
			} : { prompt: params.prompt };
			const run = () => hookRunner.runBeforeModelResolve(event, params.hookContext);
			modelResolveOverride = assertCurrent ? await withGuardedFetchRequestAuthority(assertCurrent, run) : await run();
		} catch (hookErr) {
			log.warn(`before_model_resolve hook failed: ${String(hookErr)}`);
		}
		assertCurrent?.();
	}
	if (modelResolveOverride?.providerOverride) {
		selection.provider = modelResolveOverride.providerOverride;
		log.info(`[hooks] provider overridden to ${selection.provider}`);
	}
	if (modelResolveOverride?.modelOverride) {
		selection.modelId = modelResolveOverride.modelOverride;
		log.info(`[hooks] model overridden to ${selection.modelId}`);
	}
	if (modelResolveOverride?.fallbacksOverride !== void 0) selection.fallbacksOverride = modelResolveOverride.fallbacksOverride;
	return selection;
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
/** Resolves only OpenClaw-owned context policy; native model owners keep that policy private. */
function resolveEmbeddedRuntimeModelPolicy(params) {
	if (params.nativeModelOwned) return { effectiveModel: params.runtimeModel };
	const contextWindowProfile = resolveModelContextWindowProfile({
		catalogEntry: params.runtimeModel,
		selected: params.contextWindow
	});
	const resolvedCtxInfo = resolveContextWindowInfo({
		cfg: params.cfg,
		provider: params.contextConfigProvider ?? params.provider,
		modelId: params.modelId,
		modelContextTokens: asFiniteNumber(params.runtimeModel.contextTokens),
		modelContextWindow: contextWindowProfile.contextTokens,
		modelContextWindowSource: contextWindowProfile.contextWindow ? void 0 : params.runtimeModel.contextWindowSource,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const ctxInfo = contextWindowProfile.contextWindow && contextWindowProfile.contextTokens !== void 0 && resolvedCtxInfo.tokens > contextWindowProfile.contextTokens ? {
		...resolvedCtxInfo,
		tokens: contextWindowProfile.contextTokens,
		source: "model"
	} : resolvedCtxInfo;
	const ctxGuard = evaluateContextWindowGuard({ info: ctxInfo });
	const runtimeBaseUrl = params.runtimeModel.baseUrl;
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
	const contextTokenBudget = Math.min(ctxInfo.tokens, params.contextTokenBudget ?? ctxInfo.tokens, resolveOpenAIResponsesRequestContextTokens(params.runtimeModel, params.requestExtraParams, params.requestServiceTiers) ?? Infinity);
	const contextWindowInfo = contextTokenBudget < ctxInfo.tokens ? {
		...ctxInfo,
		tokens: contextTokenBudget,
		referenceTokens: ctxInfo.referenceTokens ?? ctxInfo.tokens
	} : ctxInfo;
	const effectiveModel = contextTokenBudget < (params.runtimeModel.contextWindow ?? Infinity) ? {
		...params.runtimeModel,
		contextWindow: contextTokenBudget
	} : params.runtimeModel;
	return {
		contextWindowInfo,
		contextTokenBudget,
		contextTokensSource: contextWindowInfo.source === "model" && contextWindowInfo.referenceTokens === void 0 && !params.runtimeModel.contextWindows?.length ? "resolved-v1" : void 0,
		effectiveModel
	};
}
//#endregion
export { createAssistantErrorTranscript as a, resolveHookModelSelection as i, resolveAgentHarnessRunAdmissionError as n, resolveEmbeddedRuntimeModelPolicy as r, buildBeforeModelResolveAttachments as t };
