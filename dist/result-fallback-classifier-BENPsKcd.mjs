import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-BTKQYTUd.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import "./model-selection-resolve-D7hqOXrq.mjs";
import "./user-copy-DfLWtdTx.mjs";
import { t as classifyFailoverReason } from "./classify-DO9EO_30.mjs";
import { a as hasVisibleAgentPayload } from "./message-visibility-yTJ46I8l.mjs";
import { l as hasCommittedOutboundDeliveryEvidence } from "./delivery-evidence-B9fCOuaI.mjs";
//#region src/agents/fallback-skip-cache.ts
/**
* Session-scoped "known-bad candidate" cache for the model fallback chain.
*
* When explicitly enabled and a fallback candidate fails with a non-transient
* credential error (`auth` / `auth_permanent`), the chain can avoid retrying
* the same candidate on every subsequent turn until the user fixes their auth.
*
* This module records skip markers per `(sessionId, provider, model, authScope)`
* with a short TTL. The cache is intentionally in-memory only: a process
* restart clears it so a freshly-restarted gateway always tries every
* candidate at least once before deciding to skip again.
*
* The cache is global, not per-config, so any caller running fallbacks for the
* same `sessionId` shares the same skip set.
*/
/**
* Default time-to-live for a skip marker. Disabled by default so existing
* fallback retry behavior stays unchanged unless an operator opts in with
* OPENCLAW_FALLBACK_SKIP_TTL_MS.
*/
const DEFAULT_FALLBACK_SKIP_TTL_MS = 0;
const FALLBACK_SKIP_TTL_ENV = "OPENCLAW_FALLBACK_SKIP_TTL_MS";
const FALLBACK_SKIP_TTL_MIN_MS = 1e3;
const FALLBACK_SKIP_TTL_MAX_MS = 6e5;
function resolveConfiguredSkipTtlMs(env = process.env) {
	const raw = env[FALLBACK_SKIP_TTL_ENV];
	if (!raw) return DEFAULT_FALLBACK_SKIP_TTL_MS;
	const trimmed = raw.trim();
	if (!trimmed) return DEFAULT_FALLBACK_SKIP_TTL_MS;
	const parsed = parseStrictNonNegativeInteger(trimmed);
	if (parsed === void 0) return DEFAULT_FALLBACK_SKIP_TTL_MS;
	if (parsed === 0) return 0;
	return Math.min(FALLBACK_SKIP_TTL_MAX_MS, Math.max(FALLBACK_SKIP_TTL_MIN_MS, parsed));
}
/**
* Minimum interval between two opportunistic global prunes. Keeps the
* worst-case cost of a hot write/check path amortized: even if a gateway
* tracks thousands of sessions, the cache is only walked every
* `GLOBAL_PRUNE_INTERVAL_MS`, not on every call.
*/
const GLOBAL_PRUNE_INTERVAL_MS = 5e3;
function getState() {
	const globalStore = globalThis;
	if (!globalStore.openclawFallbackSkipCacheState) {
		const buckets = globalStore.openclawFallbackSkipCache ?? /* @__PURE__ */ new Map();
		globalStore.openclawFallbackSkipCacheState = {
			buckets,
			lastGlobalPruneAtMs: 0
		};
		globalStore.openclawFallbackSkipCache = buckets;
	}
	return globalStore.openclawFallbackSkipCacheState;
}
function getBuckets() {
	return getState().buckets;
}
function sessionBucket(sessionId, create) {
	const buckets = getBuckets();
	let bucket = buckets.get(sessionId);
	if (!bucket && create) {
		bucket = /* @__PURE__ */ new Map();
		buckets.set(sessionId, bucket);
	}
	return bucket;
}
function candidateKey(provider, model, authScope) {
	return JSON.stringify([modelKey(provider, model), authScope?.trim() || null]);
}
function pruneExpired(bucket, now) {
	for (const [key, entry] of bucket.entries()) if (entry.expiresAtMs <= now) bucket.delete(key);
}
/**
* Walk every session bucket, drop expired markers, and remove buckets that
* end up empty. Called opportunistically from the hot write/check paths so
* stale buckets left behind by one-off sessions cannot accumulate across the
* gateway's lifetime — the per-bucket prune only fires when the same session
* is queried again, which is not guaranteed for short-lived sessions.
*/
function pruneAllExpired(now) {
	const state = getState();
	if (now - state.lastGlobalPruneAtMs < GLOBAL_PRUNE_INTERVAL_MS) return;
	state.lastGlobalPruneAtMs = now;
	for (const [sessionId, bucket] of state.buckets.entries()) {
		pruneExpired(bucket, now);
		if (bucket.size === 0) state.buckets.delete(sessionId);
	}
}
/**
* Record that `(sessionId, provider, model)` should be skipped for the
* configured TTL. Safe to call with falsy `sessionId` — the call becomes a
* no-op so callers do not need to guard themselves.
*/
function markFallbackCandidateSkipped(params) {
	if (!params.sessionId || !params.provider || !params.model) return;
	const now = params.now ?? Date.now();
	const ttlMs = params.ttlMs ?? resolveConfiguredSkipTtlMs();
	if (ttlMs <= 0) return;
	pruneAllExpired(now);
	const bucket = sessionBucket(params.sessionId, true);
	if (!bucket) return;
	bucket.set(candidateKey(params.provider, params.model, params.authScope), {
		expiresAtMs: now + ttlMs,
		reason: params.reason
	});
}
/**
* Returns true when `(sessionId, provider, model)` has an unexpired skip
* marker. Expired entries are pruned as a side-effect so the cache does not
* grow unbounded.
*/
function isFallbackCandidateSkipped(params) {
	if (!params.sessionId || !params.provider || !params.model) return false;
	const now = params.now ?? Date.now();
	pruneAllExpired(now);
	const bucket = sessionBucket(params.sessionId, false);
	if (!bucket) return false;
	pruneExpired(bucket, now);
	if (bucket.size === 0) {
		getBuckets().delete(params.sessionId);
		return false;
	}
	const entry = bucket.get(candidateKey(params.provider, params.model, params.authScope));
	return Boolean(entry && entry.expiresAtMs > now);
}
/**
* Look up the recorded skip reason for a `(sessionId, provider, model)`
* triple. Returns `undefined` when no unexpired marker exists. Used by the
* fallback chain to surface the original failure reason in observation logs.
*/
function getFallbackCandidateSkipReason(params) {
	if (!params.sessionId || !params.provider || !params.model) return;
	const bucket = sessionBucket(params.sessionId, false);
	if (!bucket) return;
	const now = params.now ?? Date.now();
	const entry = bucket.get(candidateKey(params.provider, params.model, params.authScope));
	if (!entry || entry.expiresAtMs <= now) return;
	return entry.reason;
}
//#endregion
//#region src/agents/embedded-agent-runner/embedded-cyber-failover.ts
const EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE = "OPENAI_CYBER_POLICY_REFUSAL";
const DEFAULT_EMBEDDED_CYBER_FAILOVER = {
	mode: "auto",
	model: "openai/gpt-daybreak-blue-latest",
	cooloffMs: 6e5
};
function resolveEmbeddedCyberFailoverConfig(cfg) {
	const configured = cfg?.agents?.defaults?.embeddedAgent?.cyberFailover;
	return {
		mode: configured?.mode ?? DEFAULT_EMBEDDED_CYBER_FAILOVER.mode,
		model: configured?.model ?? DEFAULT_EMBEDDED_CYBER_FAILOVER.model,
		cooloffMs: configured?.cooloffMs ?? DEFAULT_EMBEDDED_CYBER_FAILOVER.cooloffMs
	};
}
function resolveEmbeddedCyberFailoverTarget(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: "openai",
		manifestPlugins: params.manifestPlugins
	});
	return resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
		raw: params.raw,
		defaultProvider: "openai",
		aliasIndex,
		manifestPlugins: params.manifestPlugins
	})?.ref ?? null;
}
function isReplaySafeEmbeddedOpenAiCyberRefusal(params) {
	const refusal = params.result.meta.agentMeta?.providerRefusal;
	return params.provider === "openai" && params.result.meta.agentMeta?.agentHarnessId === "openclaw" && params.result.meta.replayInvalid !== true && refusal?.provider === "openai" && refusal.category === "cyber";
}
/**
* True when the caller pinned this turn to exactly one model. `run-embedded-attempt`
* passes an explicit empty fallback override for a locked model selection, and
* `docs/concepts/model-failover.md` documents that as strict: no other model may
* serve the turn. Policy escalation honors that contract, so a locked session
* keeps a cyber refusal terminal until the operator unlocks the selection.
*/
function isEmbeddedModelSelectionStrict(selection) {
	return selection.fallbacksOverride !== void 0 && selection.fallbacksOverride.length === 0;
}
function isSameEmbeddedCyberFailoverTarget(current, target) {
	return modelKey(current.provider, current.model) === modelKey(target.provider, target.model);
}
function isEmbeddedCyberFailoverTargetUsable(result) {
	const hasErrorPayload = (result.payloads ?? []).some((payload) => payload.isError === true);
	return result.meta.aborted !== true && result.meta.error === void 0 && result.meta.agentMeta?.providerRefusal === void 0 && (!hasErrorPayload || hasVisibleAgentPayload(result, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false,
		includeSilentReplyPayloads: false
	}));
}
/**
* True when a failed escalation attempt already committed work that the caller
* must still see. A replay-safe initial refusal says nothing about the retry:
* the retry runs the same turn with tools enabled, so it can execute a tool or
* deliver output and only then error out. Restoring the original refusal
* wholesale in that case would drop the retry's replay verdict, delivery
* evidence, and terminal receipt, and would tell recovery consumers that
* nothing ran.
*/
function didEmbeddedCyberFailoverTargetCommitWork(result) {
	return result.meta.replayInvalid === true || hasCommittedOutboundDeliveryEvidence(result);
}
function isEmbeddedCyberFailoverTargetSkipped(params) {
	return isFallbackCandidateSkipped({
		sessionId: params.sessionId,
		provider: params.target.provider,
		model: params.target.model,
		authScope: params.authScope
	});
}
function recordEmbeddedCyberFailoverTargetUnavailable(params) {
	const authFailure = params.attempts.findLast((attempt) => attempt.reason === "auth" || attempt.reason === "auth_permanent");
	if (!authFailure) return;
	markFallbackCandidateSkipped({
		sessionId: params.sessionId,
		provider: params.target.provider,
		model: params.target.model,
		authScope: params.authScope,
		reason: authFailure.reason ?? "auth",
		ttlMs: params.cooloffMs
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/result-fallback-classifier.ts
/** Classifies embedded-agent run results for model fallback decisions. */
/**
* Classifies embedded-agent terminal results for model fallback decisions.
*
* The classifier only flags failed invisible outcomes or exact generic external-runner failure
* copy; delivered messages, deliberate silent replies, hook blocks, and aborts must not trigger
* another model attempt.
*/
function isEmbeddedAgentRunResult(value) {
	return Boolean(value && typeof value === "object" && "meta" in value && value.meta && typeof value.meta === "object");
}
/** Keeps final-candidate bookkeeping while surfacing the best trusted terminal payload. */
function mergeEmbeddedAgentRunResultForModelFallbackExhaustion(params) {
	const executionTrace = params.latestResult.meta.executionTrace;
	const filteredAttempts = executionTrace?.attempts?.filter((attempt) => attempt.result !== "success");
	const traceNeedsNormalization = executionTrace !== void 0 && (executionTrace.winnerProvider !== void 0 || executionTrace.winnerModel !== void 0 || filteredAttempts?.length !== executionTrace.attempts?.length);
	if (params.latestResult === params.preferredResult && !traceNeedsNormalization) return params.latestResult;
	return {
		...params.latestResult,
		payloads: params.preferredResult.payloads,
		meta: {
			...params.latestResult.meta,
			error: params.preferredResult.meta.error,
			...traceNeedsNormalization ? { executionTrace: {
				...executionTrace,
				winnerProvider: void 0,
				winnerModel: void 0,
				attempts: filteredAttempts?.length ? filteredAttempts : void 0
			} } : {}
		}
	};
}
function hasDeliberateSilentTerminalReply(result) {
	if (result.meta.error?.kind === "hook_block") return true;
	return [result.meta.finalAssistantRawText, result.meta.finalAssistantVisibleText].some((text) => typeof text === "string" && isSilentReplyPayloadText(text));
}
function hasDeliverableAssistantPayload(result) {
	const finalVisibleText = result.meta?.finalAssistantVisibleText;
	return typeof finalVisibleText === "string" && finalVisibleText.trim().length > 0 && !isSilentReplyPayloadText(finalVisibleText) || hasVisibleAgentPayload(result, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false,
		requireTerminalContent: true
	});
}
function hasNonTextVisiblePayloadContent(payload) {
	const { isError: _isError, text: _text, ...payloadWithoutText } = payload;
	return hasDeliverableAssistantPayload({ payloads: [payloadWithoutText] });
}
function classifyGenericExternalRunFailurePayload(params) {
	const payloads = params.result.payloads;
	if (!Array.isArray(payloads) || payloads.length !== 1) return null;
	const [payload] = payloads;
	const text = payload?.text;
	if (payload?.isError === true || payload?.isReasoning === true || typeof text !== "string" || text.trim() !== "⚠️ Something went wrong while processing your request. Please try again, or use /new to start a fresh session." || !payload || hasNonTextVisiblePayloadContent(payload)) return null;
	return {
		message: `${params.provider}/${params.model} ended with a generic external runner failure: ${text}`,
		reason: "format",
		code: "generic_external_run_failure",
		rawError: text
	};
}
function classifyHarnessResult(params) {
	switch (params.result.meta.agentHarnessResultClassification) {
		case "empty": return {
			message: `${params.provider}/${params.model} ended without a visible assistant reply`,
			reason: "format",
			code: "empty_result"
		};
		case "reasoning-only": return {
			message: `${params.provider}/${params.model} ended with reasoning only`,
			reason: "format",
			code: "reasoning_only_result"
		};
		case "planning-only": return {
			message: `${params.provider}/${params.model} ended with a structured plan but no final answer`,
			reason: "format",
			code: "planning_only_result"
		};
		default: return null;
	}
}
function classifyProviderErrorPayloadReason(errorText, provider) {
	if (!errorText.trim()) return null;
	const failoverReason = classifyFailoverReason(errorText, { provider });
	switch (failoverReason) {
		case "auth":
		case "auth_permanent":
		case "billing":
		case "rate_limit":
		case "server_error":
		case "overloaded":
		case "timeout": return failoverReason;
		default: return null;
	}
}
/** Returns a fallback classification when an embedded run failed without user-visible output. */
function classifyEmbeddedAgentRunResultForModelFallback(params) {
	if (!isEmbeddedAgentRunResult(params.result)) return null;
	if (params.result.meta.agentMeta?.providerRefusal?.category === "misalignment") return null;
	if (params.result.meta.intentionalTerminalCompletion === "tool-batch" || params.result.meta.aborted || params.hasDirectlySentBlockReply === true || params.hasBlockReplyPipelineOutput === true) return null;
	const incompleteTurn = params.result.meta.error?.kind === "incomplete_turn";
	const fallbackSafeIncompleteTurn = incompleteTurn && params.result.meta.error?.fallbackSafe === true;
	if (params.result.meta.replayInvalid === true && !fallbackSafeIncompleteTurn) return null;
	if (hasCommittedOutboundDeliveryEvidence(params.result)) return null;
	if (params.result.meta.error?.kind === "hook_block") return null;
	if (isReplaySafeEmbeddedOpenAiCyberRefusal({
		provider: params.provider,
		result: params.result
	})) return {
		message: `${params.provider}/${params.model} was refused by OpenAI cyber policy`,
		reason: "unknown",
		code: EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE,
		preserveResultOnExhaustion: true,
		preserveResultPriority: 100
	};
	if (incompleteTurn && !fallbackSafeIncompleteTurn) return null;
	const payloads = params.result.payloads ?? [];
	const genericExternalFailureClassification = classifyGenericExternalRunFailurePayload({
		provider: params.provider,
		model: params.model,
		result: params.result
	});
	if (genericExternalFailureClassification) return genericExternalFailureClassification;
	if (hasDeliverableAssistantPayload(params.result)) return null;
	if (fallbackSafeIncompleteTurn) return {
		message: payloads.find((payload) => payload.isError === true && typeof payload.text === "string")?.text ?? `${params.provider}/${params.model} ended with an incomplete terminal response`,
		reason: "format",
		code: "incomplete_result",
		preserveResultOnExhaustion: true,
		preserveResultPriority: params.result.meta.error?.terminalPresentation === true ? 1 : 0
	};
	const harnessClassification = classifyHarnessResult({
		provider: params.provider,
		model: params.model,
		result: params.result
	});
	if (harnessClassification) return harnessClassification;
	const errorText = payloads.filter((payload) => payload?.isError === true).map((payload) => typeof payload.text === "string" ? payload.text : "").join("\n");
	const failoverReason = classifyProviderErrorPayloadReason(errorText, params.provider);
	if (failoverReason) return {
		message: `${params.provider}/${params.model} ended with a provider error: ${errorText}`,
		reason: failoverReason,
		code: "embedded_error_payload",
		rawError: errorText
	};
	if (hasDeliberateSilentTerminalReply(params.result)) return null;
	if (errorText.trim()) return null;
	if (payloads.some((payload) => payload.isError === true && hasNonTextVisiblePayloadContent(payload))) return null;
	const assistantPayloads = payloads.filter((payload) => payload.isError !== true);
	if (assistantPayloads.length > 0 && assistantPayloads.every((payload) => payload.isReasoning === true)) return {
		message: `${params.provider}/${params.model} ended with reasoning only`,
		reason: "format",
		code: "reasoning_only_result"
	};
	return {
		message: `${params.provider}/${params.model} ended without a visible assistant reply`,
		reason: "format",
		code: "empty_result"
	};
}
//#endregion
export { isEmbeddedCyberFailoverTargetSkipped as a, isSameEmbeddedCyberFailoverTarget as c, resolveEmbeddedCyberFailoverTarget as d, getFallbackCandidateSkipReason as f, didEmbeddedCyberFailoverTargetCommitWork as i, recordEmbeddedCyberFailoverTargetUnavailable as l, markFallbackCandidateSkipped as m, mergeEmbeddedAgentRunResultForModelFallbackExhaustion as n, isEmbeddedCyberFailoverTargetUsable as o, isFallbackCandidateSkipped as p, EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE as r, isEmbeddedModelSelectionStrict as s, classifyEmbeddedAgentRunResultForModelFallback as t, resolveEmbeddedCyberFailoverConfig as u };
