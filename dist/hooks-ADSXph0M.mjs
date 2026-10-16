import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { d as runPluginCleanup, o as getPluginValueInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { c as normalizeToolList, l as normalizeToolPolicyName, o as expandToolGroups, r as attachToolAllowlistIntersection, u as readToolAllowlistIntersection } from "./tool-policy-shared-DWHChhWM.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Dn8gpf-E.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { n as projectModelContextMessages } from "./model-context-message-CS718pyQ.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { a as createPluginToolMatcherScope, c as pluginToolMatcherCoversTool, r as isPluginHookReplyDispatchKind } from "./hook-types-BYClmq1o.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-B2u479yP.mjs";
import { i as finalizeGroupThreadToolReply } from "./group-thread-context-Dq9sbt-L.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { r as recordReplyPayloadMediaSelectionChange, t as collectReplyMediaEntries } from "./reply-media-entries-Ce3gllsX.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomUUID } from "node:crypto";
//#region src/hooks/fire-and-forget.ts
const DEFAULT_MAX_CONCURRENT_FIRE_AND_FORGET_HOOKS = 16;
const DEFAULT_MAX_QUEUED_FIRE_AND_FORGET_HOOKS = 256;
const DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS = 2e3;
const MAX_HOOK_LOG_MESSAGE_LENGTH = 500;
const getFireAndForgetHookState = () => resolveGlobalSingleton(Symbol.for("openclaw.fireAndForgetHookState"), () => ({
	active: 0,
	queue: []
}));
function positiveIntegerOrDefault(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
/** Format hook errors as bounded single-line log messages with secrets redacted upstream. */
function formatHookErrorForLog(err) {
	const formatted = formatErrorMessage(err).replace(/\p{Cc}/gu, (char) => char.charCodeAt(0) <= 127 ? " " : char).replace(/\s+/g, " ").trim();
	return truncateUtf16Safe(formatted || "unknown error", MAX_HOOK_LOG_MESSAGE_LENGTH);
}
/** Run a hook promise without awaiting it, logging rejection safely. */
function fireAndForgetHook(task, label, logger = logVerbose) {
	task.catch((err) => {
		logger(`${label}: ${formatHookErrorForLog(err)}`);
	});
}
function runFireAndForgetHookJob(state, { task, ...job }, limits) {
	state.active += 1;
	let didLogTimeout = false;
	const timeout = job.timeoutMs > 0 ? setTimeout(() => {
		didLogTimeout = true;
		job.logger(`${job.label}: timed out after ${job.timeoutMs}ms`);
	}, job.timeoutMs) : void 0;
	Promise.resolve().then(task).catch((err) => {
		if (!didLogTimeout) job.logger(`${job.label}: ${formatHookErrorForLog(err)}`);
	}).finally(() => {
		if (timeout) clearTimeout(timeout);
		state.active -= 1;
		drainFireAndForgetHookQueue(state, limits);
	});
}
function drainFireAndForgetHookQueue(state, limits) {
	while (state.active < limits.maxConcurrency) {
		const next = state.queue.shift();
		if (!next) return;
		runFireAndForgetHookJob(state, next, limits);
	}
}
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
function fireAndForgetBoundedHook(task, label, logger = logVerbose, options = {}) {
	const state = getFireAndForgetHookState();
	const maxConcurrency = positiveIntegerOrDefault(options.maxConcurrency, DEFAULT_MAX_CONCURRENT_FIRE_AND_FORGET_HOOKS);
	const maxQueue = positiveIntegerOrDefault(options.maxQueue, DEFAULT_MAX_QUEUED_FIRE_AND_FORGET_HOOKS);
	const timeoutMs = resolveTimerTimeoutMs(positiveIntegerOrDefault(options.timeoutMs, DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS), DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS);
	if (state.active >= maxConcurrency && state.queue.length >= maxQueue) {
		logger(`${label}: queue full; dropping hook`);
		return;
	}
	state.queue.push({
		task,
		label,
		logger,
		timeoutMs
	});
	drainFireAndForgetHookQueue(state, { maxConcurrency });
}
//#endregion
//#region src/shared/text/join-segments.ts
/** Concatenates two optional text blocks, preserving the right block's explicit empty string. */
function concatOptionalTextSegments(params) {
	if (params.left && params.right) return `${params.left}\n\n${params.right}`;
	return params.right ?? params.left;
}
/** Joins non-empty string segments, optionally trimming each segment before presence checks. */
function joinPresentTextSegments(segments, options) {
	const trim = options?.trim ?? false;
	const values = [];
	for (const segment of segments) {
		if (typeof segment !== "string") continue;
		const normalized = trim ? segment.trim() : segment;
		if (!normalized) continue;
		values.push(normalized);
	}
	return values.length > 0 ? values.join("\n\n") : void 0;
}
//#endregion
//#region src/plugins/hook-agent-observations.ts
function withAgentRunId(event, ctx) {
	if (event.runId || !ctx.runId) return event;
	return {
		...event,
		runId: ctx.runId
	};
}
/** Terminal hooks release per-run state and settle work, even for private runs. */
function projectAgentEndEvent(event, ctx) {
	return withAgentRunId(isIncognitoSessionKey(ctx.sessionKey) ? {
		runId: event.runId,
		messages: [],
		success: event.success,
		durationMs: event.durationMs
	} : event, ctx);
}
/** Exclude optional prompt/response observers without changing policy hooks. */
function withoutIncognitoLlmContent(run) {
	return async (event, ctx) => {
		if (!isIncognitoSessionKey(ctx.sessionKey)) await run(event, ctx);
	};
}
//#endregion
//#region src/plugins/hook-claim-admission.ts
const CLAIM_ADMISSION = Symbol.for("openclaw.claimingHookAdmission");
function withClaimingHookAdmission(context, admission) {
	return admission ? Object.assign(context, { [CLAIM_ADMISSION]: admission }) : context;
}
function readClaimingHookAdmission(context) {
	return context[CLAIM_ADMISSION];
}
//#endregion
//#region src/plugins/hook-decision-types.ts
/** Prefix for user-facing replacement messages when a `block` decision stops a request. */
const BLOCK_MESSAGE_PREFIX = "Your message could not be sent";
function resolveBlockMessage(decision, params = {}) {
	const message = typeof decision.message === "string" ? decision.message.trim() : "";
	const blockedBy = params.blockedBy?.trim();
	if (message) return blockedBy ? `${BLOCK_MESSAGE_PREFIX}: ${message} (blocked by ${blockedBy})` : `${BLOCK_MESSAGE_PREFIX}: ${message}`;
	return blockedBy ? `${BLOCK_MESSAGE_PREFIX}: blocked by ${blockedBy}` : `${BLOCK_MESSAGE_PREFIX}: blocked`;
}
/**
* Type guard: does this object look like a HookDecision (has `outcome` field)?
*/
function isHookDecision(value) {
	if (typeof value !== "object" || value === null) return false;
	const v = value;
	const keys = Object.keys(v);
	if (v.outcome === "pass") return keys.length === 1;
	if (v.outcome !== "block") return false;
	const allowedBlockKeys = /* @__PURE__ */ new Set([
		"outcome",
		"reason",
		"message",
		"category",
		"metadata"
	]);
	if (keys.some((key) => !allowedBlockKeys.has(key))) return false;
	if (typeof v.reason !== "string" || !v.reason.trim()) return false;
	if ("message" in v && (typeof v.message !== "string" || !v.message.trim())) return false;
	if ("category" in v && (typeof v.category !== "string" || !v.category.trim())) return false;
	if ("metadata" in v && (typeof v.metadata !== "object" || v.metadata === null || Array.isArray(v.metadata))) return false;
	return true;
}
//#endregion
//#region src/plugins/hook-isolation.ts
var HookIsolationError = class extends Error {};
function containsSharedMemory(value, seen) {
	if (typeof SharedArrayBuffer !== "undefined" && value instanceof SharedArrayBuffer) return true;
	if (!value || typeof value !== "object") return false;
	if (ArrayBuffer.isView(value)) return typeof SharedArrayBuffer !== "undefined" && value.buffer instanceof SharedArrayBuffer;
	if (value instanceof ArrayBuffer) return false;
	const webAssemblyMemory = globalThis.WebAssembly?.Memory;
	if (webAssemblyMemory && value instanceof webAssemblyMemory && typeof SharedArrayBuffer !== "undefined") {
		if (Reflect.get(webAssemblyMemory.prototype, "buffer", value) instanceof SharedArrayBuffer) return true;
	}
	if (seen.has(value)) return false;
	seen.add(value);
	if (value instanceof Map) {
		const entries = Map.prototype.entries.call(value);
		for (const [key, entry] of entries) if (containsSharedMemory(key, seen) || containsSharedMemory(entry, seen)) return true;
		return false;
	}
	if (value instanceof Set) {
		const entries = Set.prototype.values.call(value);
		for (const entry of entries) if (containsSharedMemory(entry, seen)) return true;
		return false;
	}
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		if (descriptor && "value" in descriptor && containsSharedMemory(descriptor.value, seen)) return true;
	}
	return false;
}
function cloneHookIsolationValue(hookName, value) {
	try {
		if (containsSharedMemory(value, /* @__PURE__ */ new Set())) throw new TypeError("shared memory cannot be isolated");
		const cloned = structuredClone(value);
		if (containsSharedMemory(cloned, /* @__PURE__ */ new Set())) throw new TypeError("shared memory cannot be isolated");
		return cloned;
	} catch (cause) {
		throw new HookIsolationError(`[hooks] ${hookName} mutable input isolation failed`, { cause });
	}
}
//#endregion
//#region src/plugins/hook-reply-payload.ts
const toPluginReplyPayload = (payload) => {
	const { trustedLocalMedia: _trustedLocalMedia, ...visiblePayload } = payload;
	return structuredClone(visiblePayload);
};
const areMediaUrlArraysEqual = (left, right) => {
	const normalizedLeft = left ?? [];
	const normalizedRight = right ?? [];
	return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((value, index) => value === normalizedRight[index]);
};
const preservesTrustedMediaRefs = (previous, next) => {
	return previous.trustedLocalMedia === true && previous.mediaUrl === next.mediaUrl && areMediaUrlArraysEqual(previous.mediaUrls, next.mediaUrls);
};
const acceptPluginReplyPayload = (previous, next) => {
	const clonedPayload = toPluginReplyPayload(next);
	const acceptedPayload = preservesTrustedMediaRefs(previous, clonedPayload) ? {
		...clonedPayload,
		trustedLocalMedia: true
	} : clonedPayload;
	return recordReplyPayloadMediaSelectionChange(collectReplyMediaEntries(previous).map(({ url }) => url), copyReplyPayloadMetadata(previous, acceptedPayload));
};
//#endregion
//#region src/plugins/hook-timeout.ts
const withHookTimeout = async (promise, timeoutMs, optionsResult = {}) => {
	trackAsyncWork(() => promise).catch(() => {});
	return await raceWithTimeout(promise, timeoutMs, () => {
		throw new Error(`timed out after ${timeoutMs}ms`);
	}, { ref: !optionsResult.unref });
};
//#endregion
//#region src/plugins/runtime/subagent-requester-context.ts
const pluginSubagentRequesterScope = resolveGlobalSingleton(Symbol.for("openclaw.pluginSubagentRequesterScope"), () => new AsyncLocalStorage());
function createPluginSubagentRequesterContext(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const origin = normalizeDeliveryContext(params.origin);
	if (!sessionKey || !origin?.channel || !origin.to) return;
	return Object.freeze({
		sessionKey,
		origin: Object.freeze({ ...origin })
	});
}
async function withPluginSubagentRequesterContext(requester, run) {
	const scope = {
		active: true,
		requester
	};
	return await pluginSubagentRequesterScope.run(scope, async () => {
		try {
			return await run();
		} finally {
			scope.active = false;
		}
	});
}
function resolvePluginSubagentCompletionRequester(completionDelivery) {
	if (completionDelivery !== void 0 && completionDelivery !== "current-requester") throw new Error("Unsupported plugin subagent completionDelivery value.");
	if (completionDelivery === void 0) return;
	const scope = pluginSubagentRequesterScope.getStore();
	const requester = scope?.active === true ? scope.requester : void 0;
	if (!requester) throw new Error("completionDelivery \"current-requester\" requires an active requester-bound plugin hook invocation.");
	return requester;
}
//#endregion
//#region src/plugins/session-end-transcript.ts
const sessionEndTranscriptSource = Symbol("openclaw.sessionEndTranscriptSource");
function attachSessionEndTranscriptSource(context, source) {
	Object.defineProperty(context, sessionEndTranscriptSource, {
		configurable: false,
		enumerable: false,
		value: source,
		writable: false
	});
}
function readSessionEndTranscriptSource(context) {
	return context[sessionEndTranscriptSource] ?? {
		available: false,
		reason: "unsupported-source"
	};
}
function createScopedAvailableEndedTranscript(source, lifecycleSignal) {
	let active = true;
	const assertActive = () => {
		if (!active || lifecycleSignal?.aborted) throw new Error("session_end transcript reader is no longer active");
	};
	return {
		capability: Object.freeze({
			available: true,
			async readTail(options) {
				assertActive();
				const result = await source.readTail(options);
				await Promise.resolve();
				assertActive();
				return result;
			}
		}),
		revoke() {
			active = false;
		}
	};
}
function createSessionEndTranscriptSourceLease(source) {
	if (!source.available) return {
		source: Object.freeze({ ...source }),
		revoke() {}
	};
	const scoped = createScopedAvailableEndedTranscript(source);
	return {
		source: scoped.capability,
		revoke: () => scoped.revoke()
	};
}
function projectSessionEndTranscriptContext(hook, context, lifecycleSignal) {
	if (hook.conversationAccessAllowed !== true) return {
		context: {
			...context,
			endedTranscript: Object.freeze({
				available: false,
				reason: "conversation-access-required"
			})
		},
		dispose() {}
	};
	const source = readSessionEndTranscriptSource(context);
	if (!source.available) return {
		context: {
			...context,
			endedTranscript: Object.freeze({ ...source })
		},
		dispose() {}
	};
	const scoped = createScopedAvailableEndedTranscript(source, lifecycleSignal);
	return {
		context: {
			...context,
			endedTranscript: scoped.capability
		},
		dispose: () => scoped.revoke()
	};
}
//#endregion
//#region src/plugins/hooks.ts
const DEFAULT_VOID_HOOK_TIMEOUT_MS_BY_HOOK = {
	agent_end: 3e4,
	channel_pairing_requested: 2e3,
	before_compaction: 3e4,
	after_compaction: 3e4,
	skill_changed: 3e4,
	skill_proposal_changed: 3e4,
	gateway_stop: 5e3
};
const DEFAULT_MODIFYING_HOOK_TIMEOUT_MS_BY_HOOK = {
	before_agent_run: 15e3,
	before_install: 15e3,
	before_tool_call: 15e3,
	before_agent_finalize: 15e3,
	before_prompt_build: 15e3,
	message_sending: 15e3,
	reply_payload_sending: 15e3,
	resolve_exec_env: 15e3,
	skill_proposal_evaluate: 12e4
};
function deepFreezeHookValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value !== "object" && typeof value !== "function" || value === null) return value;
	const object = value;
	if (seen.has(object)) return value;
	seen.add(object);
	for (const child of Object.values(object)) deepFreezeHookValue(child, seen);
	return Object.freeze(value);
}
function isHookContextEligible(hook, ctx) {
	if (hook.hookName === "reply_dispatch" && hook.eligibleDispatchKinds !== void 0) {
		const kind = typeof ctx === "object" && ctx !== null && "dispatchKind" in ctx ? ctx.dispatchKind : void 0;
		return !isPluginHookReplyDispatchKind(kind) || hook.eligibleDispatchKinds.includes(kind);
	}
	if (hook.hookName !== "before_agent_reply" || hook.eligibleTriggers === void 0) return true;
	const trigger = typeof ctx === "object" && ctx !== null && "trigger" in ctx ? ctx.trigger : void 0;
	return typeof trigger === "string" && hook.eligibleTriggers.includes(trigger);
}
/** Get hooks for a specific hook name, sorted by priority (higher first). */
function getHooksForName(registry, hookName, ctx, toolName) {
	return registry.typedHooks.filter((hook) => hook.hookName === hookName && isHookContextEligible(hook, ctx)).filter((hook) => toolName === void 0 || pluginToolMatcherCoversTool(hook.matcher, toolName)).toSorted((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
function getToolHookMatcherScope(registry, hookName) {
	return createPluginToolMatcherScope(getHooksForName(registry, hookName).map((registration) => registration.matcher));
}
function getHooksForNameAndPlugin(registry, hookName, pluginId) {
	return getHooksForName(registry, hookName).filter((hook) => hook.pluginId === pluginId);
}
function createHookRunner(registry, options = {}) {
	const logger = options.logger;
	const catchErrors = options.catchErrors ?? true;
	const failurePolicyByHook = {
		before_agent_run: "fail-closed",
		...options.failurePolicyByHook
	};
	const voidHookTimeoutMsByHook = {
		...DEFAULT_VOID_HOOK_TIMEOUT_MS_BY_HOOK,
		...options.voidHookTimeoutMsByHook
	};
	const modifyingHookTimeoutMsByHook = {
		...DEFAULT_MODIFYING_HOOK_TIMEOUT_MS_BY_HOOK,
		...options.modifyingHookTimeoutMsByHook
	};
	const beforePromptBuildDispatch = new AsyncLocalStorage();
	const runtimeDecisionScopeId = randomUUID();
	let runtimeDecisionOrdinal = 0;
	const shouldCatchHookErrors = (hookName) => catchErrors && (failurePolicyByHook[hookName] ?? "fail-open") === "fail-open";
	const recordBeforeToolCallDecision = (params) => {
		if (!params.receiptAuthority) return;
		try {
			if (params.receiptAuthority() === false) return;
		} catch {
			return;
		}
		const failed = params.failOpen !== void 0;
		const blocked = params.result?.block === true || params.failOpen === false;
		recordRuntimeActionDecision({
			token: params.token,
			family: "plugin",
			operation: "before_tool_call",
			outcome: blocked ? "denied" : params.failOpen ? "unknown" : "allowed",
			coverageState: blocked || !failed ? "enforced" : "unknown",
			reasonCode: failed ? params.failOpen ? "plugin_hook_failed_open" : "plugin_hook_failed_closed" : blocked ? "plugin_hook_blocked" : params.result?.requireApproval ? "plugin_hook_approval_required" : "plugin_hook_allowed",
			owner: "plugin-hook",
			decisionBoundary: "plugin.before-tool-call",
			policyRefs: ["plugin-hook:before-tool-call"],
			summary: failed ? params.failOpen ? "A plugin hook failed open, so its policy outcome is unknown." : "A plugin hook failed closed before tool execution." : blocked ? "A registered plugin hook denied tool execution." : params.result?.requireApproval ? "A registered plugin hook required a separate owner-native approval decision." : "A registered plugin hook allowed tool execution to continue.",
			missingEvidence: params.failOpen ? ["plugin.hook_decision"] : [],
			remediation: params.failOpen ? [{
				code: "repair_plugin_hook",
				text: "Inspect the registered plugin hook failure before relying on this action."
			}] : [],
			discriminator: JSON.stringify([
				params.hook.pluginId,
				params.hook.registrationId ?? null,
				params.event.toolCallId ?? null,
				++runtimeDecisionOrdinal,
				params.event.toolName,
				runtimeDecisionScopeId
			])
		});
	};
	const stickyTrue = (prev, next) => prev === true || next === true ? true : void 0;
	const mergeBeforeModelResolve = (acc, next) => ({
		modelOverride: acc?.modelOverride ?? next.modelOverride,
		providerOverride: acc?.providerOverride ?? next.providerOverride
	});
	const normalizeHookToolsAllow = (value) => {
		if (value === void 0) return;
		return Array.isArray(value) && value.every((entry) => typeof entry === "string") ? value : [];
	};
	const readHookToolsAllowRestrictions = (value) => {
		const normalized = normalizeHookToolsAllow(value);
		if (normalized === void 0) return [];
		const attached = Array.isArray(value) ? readToolAllowlistIntersection(value) : void 0;
		return attached ? attached.map((restriction) => normalizeHookToolsAllow(restriction) ?? []) : [normalized];
	};
	const intersectToolsAllow = (left, right) => {
		if (left === void 0) return right;
		if (left.length === 0 || right.length === 0) return [];
		const normalizedLeft = normalizeToolList(expandToolGroups(left));
		const normalizedRight = normalizeToolList(expandToolGroups(right));
		if (normalizedLeft.includes("*")) return normalizedRight;
		if (normalizedRight.includes("*")) return normalizedLeft;
		const matchesLeft = createToolPolicyMatcher({ allow: normalizedLeft });
		const matchesRight = createToolPolicyMatcher({ allow: normalizedRight });
		return [...new Set(normalizeToolList([...normalizedLeft, ...normalizedRight]))].filter((name) => matchesLeft(name) && matchesRight(name));
	};
	const mergeBeforePromptBuild = (acc, next) => {
		const toolRestrictions = [...readHookToolsAllowRestrictions(acc?.toolsAllow), ...readHookToolsAllowRestrictions(next.toolsAllow)];
		const toolsAllow = toolRestrictions.length === 0 ? void 0 : attachToolAllowlistIntersection([...toolRestrictions.reduce(intersectToolsAllow, void 0) ?? []], toolRestrictions);
		return {
			systemPrompt: acc?.systemPrompt ?? next.systemPrompt,
			...mergeAgentTurnPrepare(acc, next),
			...toolsAllow !== void 0 ? { toolsAllow } : {},
			prependSystemContext: concatOptionalTextSegments({
				left: acc?.prependSystemContext,
				right: next.prependSystemContext
			}),
			appendSystemContext: concatOptionalTextSegments({
				left: acc?.appendSystemContext,
				right: next.appendSystemContext
			})
		};
	};
	const mergeAgentTurnPrepare = (acc, next) => ({
		prependContext: concatOptionalTextSegments({
			left: acc?.prependContext,
			right: next.prependContext
		}),
		appendContext: concatOptionalTextSegments({
			left: acc?.appendContext,
			right: next.appendContext
		})
	});
	const mergeBeforeAgentFinalize = (acc, next) => {
		const normalizeRetry = (retry) => {
			const instruction = typeof retry?.instruction === "string" ? retry.instruction.trim() : "";
			if (!instruction) return;
			return {
				...retry,
				instruction
			};
		};
		const readRetryCandidates = (result) => {
			if (!result || result.action !== "revise") return [];
			const candidateList = result.retryCandidates;
			if (Array.isArray(candidateList) && candidateList.length > 0) return candidateList.map(normalizeRetry).filter((retry) => retry !== void 0);
			const retry = normalizeRetry(result.retry);
			return retry ? [retry] : [];
		};
		if (acc?.action === "finalize") return acc;
		if (next.action === "finalize") return {
			action: "finalize",
			reason: next.reason
		};
		if (acc?.action === "revise" && next.action === "revise") {
			const retryCandidates = [...readRetryCandidates(acc), ...readRetryCandidates(next)];
			const retry = retryCandidates[0];
			const result = {
				action: "revise",
				reason: concatOptionalTextSegments({
					left: acc.reason,
					right: next.reason
				}),
				...retry ? { retry } : {}
			};
			if (retryCandidates.length > 1) Object.defineProperty(result, "retryCandidates", {
				configurable: true,
				enumerable: false,
				value: retryCandidates
			});
			return result;
		}
		if (acc?.action === "revise") return acc;
		if (next.action === "revise") {
			const retry = normalizeRetry(next.retry);
			return {
				action: "revise",
				reason: next.reason,
				...retry ? { retry } : {}
			};
		}
		return next.action === "continue" ? {
			action: "continue",
			reason: next.reason
		} : acc ?? next;
	};
	const handleHookError = (params) => {
		const msg = `[hooks] ${params.hookName} handler from ${params.pluginId} failed: ${formatHookErrorForLog(params.error)}`;
		if (shouldCatchHookErrors(params.hookName)) {
			logger?.error(msg);
			return;
		}
		throw new Error(msg, { cause: params.error });
	};
	const sanitizeHookError = (error) => {
		return formatErrorMessage(error).split("\n")[0]?.trim() || "unknown error";
	};
	const awaitHook = (hook, promise, defaultTimeoutMs, timeoutOptions) => {
		const timeoutMs = clampPositiveTimerTimeoutMs(hook.timeoutMs) ?? clampPositiveTimerTimeoutMs(defaultTimeoutMs);
		return timeoutMs ? withHookTimeout(promise, timeoutMs, timeoutOptions) : promise;
	};
	const runSyncMessageHookStep = (hook, hookName, event, message, ctx) => {
		try {
			const handler = hook.handler;
			const result = handler({
				...event,
				message
			}, ctx);
			if (isPromiseLike(result)) {
				Promise.resolve(result).catch(() => void 0);
				const msg = `[hooks] ${hookName} handler from ${hook.pluginId} returned a Promise; this hook is synchronous and the result was ignored.`;
				if (!shouldCatchHookErrors(hookName)) throw new Error(msg);
				logger?.warn?.(msg);
				return;
			}
			if (!result) return;
			if (hookName === "before_message_write" && result.block) return { block: true };
			const nextMessage = result.message;
			return nextMessage ? { message: nextMessage } : void 0;
		} catch (err) {
			const msg = `[hooks] ${hookName} handler from ${hook.pluginId} failed: ${String(err)}`;
			if (shouldCatchHookErrors(hookName)) {
				logger?.error(msg);
				return;
			}
			throw new Error(msg, { cause: err });
		}
	};
	const runSyncMessageHooks = (hookName, event, ctx) => {
		const hooks = getHooksForName(registry, hookName);
		if (hooks.length === 0) return;
		let current = event.message;
		for (const hook of hooks) {
			const result = runSyncMessageHookStep(hook, hookName, event, current, ctx);
			if (result?.block) return {
				message: current,
				block: true
			};
			if (result?.message) current = result.message;
		}
		return { message: current };
	};
	/**
	* All handlers are executed in parallel for performance.
	*/
	async function runVoidHook(hookName, event, ctx, optionsValue = {}, matcherToolName, projectContext) {
		const hooks = getHooksForName(registry, hookName, void 0, matcherToolName);
		if (hooks.length === 0) return;
		logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers)`);
		const promises = hooks.map(async (hook) => {
			const projected = projectContext?.(hook, ctx);
			try {
				const invoke = () => hook.handler(event, projected?.context ?? ctx);
				const handlerPromise = Promise.resolve(hookName === "gateway_stop" ? runPluginCleanup(hook.handler, invoke) : invoke());
				const promise = projected ? handlerPromise.finally(projected.dispose) : handlerPromise;
				await awaitHook(hook, promise, voidHookTimeoutMsByHook[hookName], { unref: optionsValue.unrefTimeout ?? true });
			} catch (err) {
				handleHookError({
					hookName,
					pluginId: hook.pluginId,
					error: err
				});
			} finally {
				projected?.dispose();
			}
		});
		const failures = (await Promise.allSettled(promises)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length > 0) throw failures.length === 1 ? failures[0] : new AggregateError(failures, failures.map(formatErrorMessage).join("; "));
	}
	const bindVoidHook = (hookName) => (event, ctx) => runVoidHook(hookName, event, ctx);
	const bindModifyingHook = (hookName, policy = {}) => (event, ctx) => runModifyingHook(hookName, event, ctx, policy);
	const bindClaimingHook = (hookName) => (event, ctx) => runClaimingHook(hookName, event, ctx);
	const bindFrozenVoidHook = (hookName) => (event, ctx) => runVoidHook(hookName, deepFreezeHookValue(structuredClone(event)), ctx);
	/**
	* Handlers are executed sequentially in priority order, and results are merged.
	*/
	async function runModifyingHook(hookName, event, ctx, policy = {}, matcherToolName) {
		const hooks = getHooksForName(registry, hookName, void 0, matcherToolName);
		const selectedHooks = policy.includeRegistration ? hooks.filter(policy.includeRegistration) : hooks;
		if (selectedHooks.length === 0) return;
		const dispatchEvent = (hookName === "before_prompt_build" || hookName === "agent_turn_prepare") && "messages" in event && Array.isArray(event.messages) ? cloneHookIsolationValue(hookName, {
			...event,
			messages: projectModelContextMessages(event.messages)
		}) : event;
		logger?.debug?.(`[hooks] running ${hookName} (${selectedHooks.length} handlers, sequential)`);
		let result;
		for (const hook of selectedHooks) {
			policy.assertHandlerBoundaryActive?.();
			readClaimingHookAdmission(ctx)?.assertCurrent?.();
			let shouldStop = false;
			try {
				const handler = hook.handler;
				const handlerEvent = policy.eventForHandler ? policy.eventForHandler(dispatchEvent, result) : policy.isolateEventPerHandler ? cloneHookIsolationValue(hookName, dispatchEvent) : dispatchEvent;
				const invocation = hookName === "before_prompt_build" ? { active: true } : void 0;
				const handlerContext = invocation ? {
					...ctx,
					hookInvocation: Object.freeze({ assertActive() {
						if (!invocation.active) throw new Error("prompt hook invocation is no longer active");
					} })
				} : ctx;
				let handlerResult;
				try {
					const promise = Promise.resolve(handler(handlerEvent, handlerContext));
					handlerResult = await awaitHook(hook, promise, modifyingHookTimeoutMsByHook[hookName]);
				} finally {
					if (invocation) invocation.active = false;
				}
				policy.onHandlerResult?.({
					hook,
					result: handlerResult
				});
				if (handlerResult !== void 0 && (handlerResult !== null || policy.mergeNullResults)) {
					if (policy.mergeResults) result = policy.mergeResults(result, handlerResult, hook, dispatchEvent);
					else result = handlerResult;
					if (result && policy.shouldStop?.(result)) {
						const terminalLabel = policy.terminalLabel ? ` ${policy.terminalLabel}` : "";
						const priority = hook.priority ?? 0;
						logger?.debug?.(`[hooks] ${hookName}${terminalLabel} decided by ${hook.pluginId} (priority=${priority}); skipping remaining handlers`);
						shouldStop = true;
					}
				}
			} catch (err) {
				const failOpen = !(err instanceof HookIsolationError) && shouldCatchHookErrors(hookName);
				policy.onHandlerError?.(hook, failOpen);
				if (err instanceof HookIsolationError) throw err;
				handleHookError({
					hookName,
					pluginId: hook.pluginId,
					error: err
				});
			}
			policy.assertHandlerBoundaryActive?.();
			readClaimingHookAdmission(ctx)?.assertCurrent?.();
			if (shouldStop) break;
		}
		return result;
	}
	/**
	* Run a sequential claim hook where the first `{ handled: true }` result wins.
	*/
	async function runClaimingHook(hookName, event, ctx, runHandler) {
		const hooks = getHooksForName(registry, hookName, ctx);
		if (hooks.length === 0) return;
		logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers, first-claim wins)`);
		const outcome = await runClaimingHooksList(hooks, hookName, event, ctx, runHandler);
		return outcome.status === "handled" ? outcome.result : void 0;
	}
	async function runClaimingHooksList(hooks, hookName, event, ctx, runHandler) {
		const admission = readClaimingHookAdmission(ctx);
		let firstError;
		for (const hook of hooks) {
			if (admission?.prepare) await admission.prepare();
			admission?.assertCurrent?.();
			let handlerResult = void 0;
			try {
				const invokeHandler = async () => {
					const promise = Promise.resolve(hook.handler(event, ctx));
					return await awaitHook(hook, promise);
				};
				handlerResult = runHandler ? await runHandler(invokeHandler) : await invokeHandler();
			} catch (err) {
				firstError ??= sanitizeHookError(err);
				handleHookError({
					hookName,
					pluginId: hook.pluginId,
					error: err
				});
			}
			admission?.assertCurrent?.();
			if (handlerResult?.handled) return {
				status: "handled",
				result: handlerResult
			};
		}
		return firstError ? {
			status: "error",
			error: firstError
		} : { status: "declined" };
	}
	async function runBeforePromptBuild(event, ctx) {
		if (beforePromptBuildDispatch.getStore()?.active) return;
		const token = { active: true };
		return await beforePromptBuildDispatch.run(token, async () => {
			try {
				return await runModifyingHook("before_prompt_build", event, ctx, {
					mergeResults: mergeBeforePromptBuild,
					includeRegistration: (registration) => registration.requiresToolAuthority !== true
				});
			} finally {
				token.active = false;
			}
		});
	}
	/** Runs context enrichment only after the host has finalized the turn's tool surface. */
	async function runAuthorizedPromptBuild(event, ctx, params) {
		const sourceFingerprint = params.toolAuthorityFingerprint.trim();
		if (!sourceFingerprint) return;
		const activeToolNames = [...new Set(params.activeToolNames.map(normalizeToolPolicyName).filter(Boolean))].toSorted();
		const activeToolNameSet = new Set(activeToolNames);
		const token = { active: true };
		const assertActive = () => {
			if (!token.active) throw new Error("prompt tool authority is no longer active");
			params.assertHostActive();
		};
		const authority = Object.freeze({
			fingerprint: createHash("sha256").update(sourceFingerprint).update("\0").update(activeToolNames.join("\0")).digest("hex"),
			allows(toolName) {
				assertActive();
				return activeToolNameSet.has(normalizeToolPolicyName(toolName));
			},
			assertActive
		});
		try {
			const result = await runModifyingHook("before_prompt_build", event, {
				...ctx,
				toolAuthority: authority
			}, {
				mergeResults: mergeBeforePromptBuild,
				includeRegistration: (registration) => registration.requiresToolAuthority === true,
				assertHandlerBoundaryActive: assertActive
			});
			if (!result) return;
			return {
				...result.prependContext ? { prependContext: result.prependContext } : {},
				...result.appendContext ? { appendContext: result.appendContext } : {}
			};
		} finally {
			token.active = false;
		}
	}
	async function runInboundClaimForPlugin(pluginId, event, ctx) {
		const outcome = await runClaimingHooksList(getHooksForNameAndPlugin(registry, "inbound_claim", pluginId), "inbound_claim", event, ctx);
		return outcome.status === "handled" ? outcome.result : void 0;
	}
	async function runInboundClaimForPluginOutcome(pluginId, event, ctx) {
		if (!registry.plugins.some((plugin) => plugin.id === pluginId && plugin.status === "loaded")) return { status: "missing_plugin" };
		const hooks = getHooksForNameAndPlugin(registry, "inbound_claim", pluginId);
		if (hooks.length === 0) return { status: "no_handler" };
		logger?.debug?.(`[hooks] running inbound_claim for ${pluginId} (${hooks.length} handlers, targeted outcome)`);
		return runClaimingHooksList(hooks, "inbound_claim", event, ctx);
	}
	async function runBeforeDispatch(event, ctx, requester) {
		return runClaimingHook("before_dispatch", event, ctx, requester ? (run) => withPluginSubagentRequesterContext(requester, run) : void 0);
	}
	/** After session preparation, the first block wins; void handlers allow inference. */
	async function runBeforeAgentRun(event, ctx) {
		let winningPluginId;
		const decision = await runModifyingHook("before_agent_run", event, ctx, {
			mergeResults: (_acc, next, reg) => {
				const normalized = isHookDecision(next) ? next : {
					outcome: "block",
					reason: "before_agent_run returned an invalid decision"
				};
				const merged = !_acc || normalized.outcome === "block" && _acc.outcome !== "block" ? normalized : _acc;
				if (merged === normalized) winningPluginId = reg.pluginId;
				return merged;
			},
			mergeNullResults: true,
			shouldStop: (result) => result?.outcome === "block",
			terminalLabel: "gate-decision"
		});
		if (!decision) return;
		return {
			decision,
			pluginId: winningPluginId ?? "unknown"
		};
	}
	async function runBeforeToolCall(event, ctx, receipt) {
		return runModifyingHook("before_tool_call", event, ctx, {
			isolateEventPerHandler: true,
			mergeResults: (acc, next, reg) => {
				if (acc?.block === true) return acc;
				const approvalAlreadyRequested = acc?.requireApproval !== void 0;
				let params = next.params ?? acc?.params;
				if (approvalAlreadyRequested) params = acc?.params;
				else if (next.requireApproval && params !== void 0) params = cloneHookIsolationValue("before_tool_call", params);
				return {
					params,
					block: stickyTrue(acc?.block, next.block),
					blockReason: next.blockReason ?? acc?.blockReason,
					requireApproval: acc?.requireApproval ?? (next.requireApproval ? {
						...next.requireApproval,
						pluginId: reg.pluginId
					} : void 0)
				};
			},
			shouldStop: (result) => result.block === true,
			terminalLabel: "block=true",
			onHandlerResult: ({ hook, result }) => {
				receipt?.markOwnerDecision?.();
				recordBeforeToolCallDecision({
					event,
					hook,
					token: receipt?.token,
					result,
					receiptAuthority: receipt?.assertAuthority
				});
			},
			onHandlerError: (hook, failOpen) => {
				receipt?.markOwnerDecision?.();
				recordBeforeToolCallDecision({
					event,
					hook,
					token: receipt?.token,
					failOpen,
					receiptAuthority: receipt?.assertAuthority
				});
			}
		}, event.toolName);
	}
	/** Transcript hooks stay synchronous and pass each replacement to the next handler. */
	function runToolResultPersist(event, ctx) {
		const result = runSyncMessageHooks("tool_result_persist", event, ctx);
		return result ? { message: result.message } : void 0;
	}
	/** A blocked transcript write stops the chain; otherwise publish only a changed message. */
	function runBeforeMessageWrite(event, ctx) {
		const result = runSyncMessageHooks("before_message_write", event, ctx);
		if (result?.block) return { block: true };
		return result && result.message !== event.message ? { message: result.message } : void 0;
	}
	/**
	* Run every registered proposal evaluator and retain its attribution.
	*
	* Evaluator failures are returned as data so Workshop can persist and show
	* them. A broken optional evaluator must not make proposal state unreadable.
	*/
	async function runSkillProposalEvaluate(event, ctx) {
		const hookName = "skill_proposal_evaluate";
		const hooks = getHooksForName(registry, hookName);
		if (hooks.length === 0) return [];
		logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers, attributed)`);
		const immutableEvent = deepFreezeHookValue(structuredClone(event));
		return await Promise.all(hooks.map(async (hook) => {
			const pluginVersion = registry.plugins.find((plugin) => plugin.id === hook.pluginId)?.packageVersion;
			const attribution = {
				evaluatorId: hook.registrationId ?? hook.pluginId,
				pluginId: hook.pluginId,
				...pluginVersion ? { pluginVersion } : {}
			};
			try {
				const handler = hook.handler;
				const promise = Promise.resolve(handler(immutableEvent, ctx));
				const result = await awaitHook(hook, promise, modifyingHookTimeoutMsByHook[hookName]);
				return result ? Object.assign(attribution, {
					status: "completed",
					result
				}) : Object.assign(attribution, { status: "skipped" });
			} catch (error) {
				const message = sanitizeHookError(error);
				logger?.error(`[hooks] ${hookName} handler from ${hook.pluginId} failed: ${formatHookErrorForLog(error)}`);
				return Object.assign(attribution, {
					status: "error",
					error: message
				});
			}
		}));
	}
	async function runResolveExecEnv(event, ctx) {
		return await runModifyingHook("resolve_exec_env", event, ctx, { mergeResults: (acc, next) => acc ? {
			...acc,
			...next
		} : next }) ?? {};
	}
	return {
		runBeforeModelResolve: bindModifyingHook("before_model_resolve", { mergeResults: mergeBeforeModelResolve }),
		runAgentTurnPrepare: bindModifyingHook("agent_turn_prepare", { mergeResults: mergeAgentTurnPrepare }),
		runBeforePromptBuild,
		runAuthorizedPromptBuild,
		hasAuthorizedPromptBuildHooks: (ctx) => registry.typedHooks.some((hook) => hook.hookName === "before_prompt_build" && hook.requiresToolAuthority === true && (ctx === void 0 || isHookContextEligible(hook, ctx))),
		runBeforeAgentReply: bindClaimingHook("before_agent_reply"),
		runModelCallStarted: bindVoidHook("model_call_started"),
		runModelCallEnded: bindVoidHook("model_call_ended"),
		runLlmInput: withoutIncognitoLlmContent(bindVoidHook("llm_input")),
		runLlmOutput: withoutIncognitoLlmContent(bindVoidHook("llm_output")),
		runBeforeAgentFinalize: async (event, ctx) => runModifyingHook("before_agent_finalize", withAgentRunId(event, ctx), ctx, { mergeResults: mergeBeforeAgentFinalize }),
		runAgentEnd: async (event, ctx, optionsLocal) => runVoidHook("agent_end", projectAgentEndEvent(event, ctx), ctx, optionsLocal),
		runBeforeCompaction: bindVoidHook("before_compaction"),
		runAfterCompaction: bindVoidHook("after_compaction"),
		runBeforeReset: bindVoidHook("before_reset"),
		runBeforeAgentRun,
		runInboundClaim: bindClaimingHook("inbound_claim"),
		runInboundClaimForPlugin,
		runInboundClaimForPluginOutcome,
		runChannelPairingRequested: bindVoidHook("channel_pairing_requested"),
		runMessageReceived: bindVoidHook("message_received"),
		runBeforeDispatch,
		runReplyDispatch: bindClaimingHook("reply_dispatch"),
		runReplyPayloadSending: bindModifyingHook("reply_payload_sending", {
			eventForHandler: (event, result) => ({
				...event,
				payload: toPluginReplyPayload(result?.payload ?? event.payload)
			}),
			mergeResults: (acc, next, _registration, event) => ({
				payload: next.payload === void 0 ? acc?.payload ?? event.payload : acceptPluginReplyPayload(acc?.payload ?? event.payload, next.payload),
				cancel: stickyTrue(acc?.cancel, next.cancel),
				reason: next.reason ?? acc?.reason
			}),
			shouldStop: (result) => result.cancel === true,
			terminalLabel: "cancel=true"
		}),
		runMessageSending: async (event, ctx) => {
			const result = await runModifyingHook("message_sending", event, ctx, {
				mergeResults: (acc, next) => ({
					content: next.content ?? acc?.content,
					cancel: stickyTrue(acc?.cancel, next.cancel),
					cancelReason: next.cancelReason ?? acc?.cancelReason,
					metadata: next.metadata ?? acc?.metadata
				}),
				shouldStop: (decision) => decision.cancel === true,
				terminalLabel: "cancel=true"
			});
			const original = result?.cancel ? void 0 : result?.content ?? event.content;
			const content = finalizeGroupThreadToolReply(original, event, ctx);
			return content !== original ? {
				...result,
				content
			} : result;
		},
		runMessageSent: bindVoidHook("message_sent"),
		runBeforeToolCall,
		runAfterToolCall: async (event, ctx) => runVoidHook("after_tool_call", event, ctx, {}, event.toolName),
		runToolResultPersist,
		runBeforeMessageWrite,
		runSessionStart: bindVoidHook("session_start"),
		runSessionEnd: (event, ctx) => runVoidHook("session_end", event, ctx, {}, void 0, (hook, context) => projectSessionEndTranscriptContext(hook, context, getPluginValueInstance(hook.handler)?.lifecycle.signal)),
		runSubagentDeliveryTarget: bindModifyingHook("subagent_delivery_target", { mergeResults: (acc, next) => acc?.origin ? acc : next }),
		runSubagentSpawned: bindVoidHook("subagent_spawned"),
		runSubagentProgress: bindVoidHook("subagent_progress"),
		runSubagentEnded: bindVoidHook("subagent_ended"),
		runGatewayStart: bindVoidHook("gateway_start"),
		runGatewayStop: bindVoidHook("gateway_stop"),
		runHeartbeatPromptContribution: bindModifyingHook("heartbeat_prompt_contribution", { mergeResults: mergeAgentTurnPrepare }),
		runCronReconciled: bindVoidHook("cron_reconciled"),
		runCronChanged: bindVoidHook("cron_changed"),
		runSkillProposalEvaluate,
		runSkillProposalChanged: bindFrozenVoidHook("skill_proposal_changed"),
		runSkillChanged: bindFrozenVoidHook("skill_changed"),
		runBeforeInstall: bindModifyingHook("before_install", {
			mergeResults: (acc, next) => {
				const findings = [...acc?.findings ?? [], ...next.findings ?? []];
				return {
					findings: findings.length ? findings : void 0,
					block: stickyTrue(acc?.block, next.block),
					blockReason: next.blockReason ?? acc?.blockReason
				};
			},
			shouldStop: (result) => result.block === true,
			terminalLabel: "block=true"
		}),
		runResolveExecEnv,
		hasHooks: (hookName, ctx) => registry.typedHooks.some((hook) => hook.hookName === hookName && (ctx === void 0 || isHookContextEligible(hook, ctx))),
		getHookCount: (hookName) => registry.typedHooks.filter((h) => h.hookName === hookName).length
	};
}
//#endregion
export { createPluginSubagentRequesterContext as a, resolveBlockMessage as c, joinPresentTextSegments as d, fireAndForgetBoundedHook as f, createSessionEndTranscriptSourceLease as i, readClaimingHookAdmission as l, formatHookErrorForLog as m, getToolHookMatcherScope as n, resolvePluginSubagentCompletionRequester as o, fireAndForgetHook as p, attachSessionEndTranscriptSource as r, cloneHookIsolationValue as s, createHookRunner as t, withClaimingHookAdmission as u };
