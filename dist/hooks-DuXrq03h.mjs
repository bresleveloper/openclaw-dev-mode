import { F as resolveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { c as runPluginCleanup } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-BTKQYTUd.mjs";
import { c as normalizeToolList, l as normalizeToolPolicyName, o as expandToolGroups, r as attachToolAllowlistIntersection, u as readToolAllowlistIntersection } from "./tool-policy-shared-auQCQEhM.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Bv2XOvEF.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { n as projectModelContextMessages } from "./model-context-message-BQc0E7_M.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-DdRNB2jf.mjs";
import { a as copyReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { r as recordReplyPayloadMediaSelectionChange, t as collectReplyMediaEntries } from "./reply-media-entries-BifhlC95.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomUUID } from "node:crypto";
//#region src/plugins/tool-hook-matcher.ts
const NON_CANONICAL_TOOL_MATCHER_NAMES = /* @__PURE__ */ new Set([
	"bash",
	"exec_command",
	"apply-patch",
	"Write",
	"Edit",
	"agent"
]);
/** Omission is the only match-all form; explicit matcher values must stay bounded. */
function normalizePluginToolMatcher(matcher) {
	if (matcher === void 0) return;
	if (!Array.isArray(matcher)) throw new TypeError("tool hook matcher must be an array of tool names");
	if (matcher.length === 0) throw new TypeError("tool hook matcher must contain at least one tool name");
	const normalized = /* @__PURE__ */ new Set();
	for (let index = 0; index < matcher.length; index += 1) {
		if (!Object.hasOwn(matcher, index)) throw new TypeError("tool hook matcher entries must be non-empty strings");
		const toolName = matcher[index];
		if (typeof toolName !== "string") throw new TypeError("tool hook matcher entries must be non-empty strings");
		const canonicalToolName = normalizeLowercaseStringOrEmpty(toolName);
		if (!canonicalToolName) throw new TypeError("tool hook matcher entries must be non-empty strings");
		if (canonicalToolName === "*") throw new TypeError("tool hook matcher wildcard entries are not supported");
		if (NON_CANONICAL_TOOL_MATCHER_NAMES.has(canonicalToolName) || NON_CANONICAL_TOOL_MATCHER_NAMES.has(toolName.trim())) throw new TypeError("tool hook matcher entries must use canonical OpenClaw tool ids");
		normalized.add(canonicalToolName);
	}
	const toolNames = Array.from(normalized).toSorted();
	if (toolNames.length === 0) throw new TypeError("tool hook matcher entries must be non-empty strings");
	const [firstToolName, ...remainingToolNames] = toolNames;
	if (!firstToolName) throw new TypeError("tool hook matcher entries must be non-empty strings");
	return [firstToolName, ...remainingToolNames];
}
function pluginToolMatcherCoversTool(matcher, toolName) {
	const normalizedMatcher = normalizePluginToolMatcher(matcher);
	return normalizedMatcher === void 0 || normalizedMatcher.includes(normalizeLowercaseStringOrEmpty(toolName));
}
function createPluginToolMatcherScope(matchers) {
	let hasRegistration = false;
	const toolNames = /* @__PURE__ */ new Set();
	for (const matcher of matchers) {
		hasRegistration = true;
		const normalized = normalizePluginToolMatcher(matcher);
		if (!normalized) return {
			matchAll: true,
			toolNames: []
		};
		for (const toolName of normalized) toolNames.add(toolName);
	}
	return hasRegistration ? {
		matchAll: false,
		toolNames: Array.from(toolNames).toSorted()
	} : void 0;
}
function mergePluginToolMatcherScopes(scopes) {
	let hasScope = false;
	const toolNames = /* @__PURE__ */ new Set();
	for (const scope of scopes) {
		if (!scope) continue;
		hasScope = true;
		if (scope.matchAll) return {
			matchAll: true,
			toolNames: []
		};
		for (const toolName of scope.toolNames) toolNames.add(toolName);
	}
	return hasScope ? {
		matchAll: false,
		toolNames: Array.from(toolNames).toSorted()
	} : void 0;
}
//#endregion
//#region src/auto-reply/group-thread-context.ts
const turns = resolveGlobalSingleton(Symbol.for("openclaw.groupThreadContext"), () => new AsyncLocalStorage());
const toolReplies = resolveGlobalSingleton(Symbol.for("openclaw.groupThreadToolReplies"), () => new AsyncLocalStorage());
async function captureGroupThreadToolReply(run, source) {
	if (!currentScope()) return {
		result: await run(),
		observed: false
	};
	const capture = {
		active: true,
		observed: false,
		source
	};
	return toolReplies.run(capture, async () => {
		try {
			return {
				result: await run(),
				observed: capture.observed,
				text: capture.text
			};
		} finally {
			capture.active = false;
		}
	});
}
/** Restore source attribution after modifying hooks; undefined preserves cancellation. */
function finalizeGroupThreadToolReply(text, event, context) {
	const capture = toolReplies.getStore();
	let content = text;
	if (capture?.active && currentScope() && (!capture.source || capture.source.matches(event, context))) {
		if (content?.trim() && !isSilentReplyPayloadText(content)) content = capture.source?.format(content) ?? content;
		capture.observed = true;
		capture.text = content?.slice(0, 4e3);
	}
	return content;
}
function withGroupThreadTurn(scope, run) {
	const owned = {
		...scope,
		active: true
	};
	return turns.run(owned, async () => {
		try {
			return await run();
		} finally {
			owned.active = false;
		}
	});
}
function currentScope() {
	const scope = turns.getStore();
	return scope?.active ? scope : void 0;
}
function getGroupThreadTurn() {
	return currentScope()?.turn;
}
function getGroupThreadParticipant() {
	return currentScope()?.participant;
}
async function adoptGroupThreadRoot(lifecycle) {
	if (lifecycle) await currentScope()?.adopt?.(lifecycle);
}
function bindGroupThreadDispatchContext(ctx) {
	const runState = {};
	const scope = currentScope();
	if (scope) scope.dispatch = {
		ctx,
		runState
	};
	return runState;
}
function getGroupThreadDispatchContext() {
	return currentScope()?.dispatch;
}
/** Data-only delivery identity, including unlabeled single-participant groups. */
function getGroupThreadDeliverySession() {
	const ctx = currentScope()?.dispatch?.ctx;
	return ctx?.AgentId && ctx.SessionKey ? {
		agentId: ctx.AgentId,
		sessionKey: ctx.SessionKey
	} : void 0;
}
function recordGroupThreadReply(payload) {
	currentScope()?.recordReply(payload);
}
/** Message actions use the initiating channel's encoder, without changing delivery ownership. */
function formatGroupThreadReply(text) {
	const scope = currentScope();
	if (!scope?.participant || !scope.formatReply) return text;
	const label = scope.formatReply("", scope.participant);
	return label && text.startsWith(label) ? text : scope.formatReply(text, scope.participant);
}
//#endregion
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
function resolveFireAndForgetHookTimeoutMs(value) {
	if (typeof value === "number" && Number.isInteger(value) && value > 0) return resolveTimerTimeoutMs(value, DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS);
	return resolveTimerTimeoutMs(DEFAULT_FIRE_AND_FORGET_HOOK_TIMEOUT_MS, 1);
}
function replaceLogControlCharacters(value) {
	let result = "";
	for (const char of value) {
		const codePoint = char.codePointAt(0);
		if (codePoint === void 0 || codePoint <= 31 || codePoint === 127 || codePoint === 8232 || codePoint === 8233) {
			result += " ";
			continue;
		}
		result += char;
	}
	return result;
}
/** Format hook errors as bounded single-line log messages with secrets redacted upstream. */
function formatHookErrorForLog(err) {
	const formatted = replaceLogControlCharacters(formatErrorMessage(err)).replace(/\s+/g, " ").trim();
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
	const timeoutMs = resolveFireAndForgetHookTimeoutMs(options.timeoutMs);
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
	const separator = params.separator ?? "\n\n";
	if (params.left && params.right) return `${params.left}${separator}${params.right}`;
	return params.right ?? params.left;
}
/** Joins non-empty string segments, optionally trimming each segment before presence checks. */
function joinPresentTextSegments(segments, options) {
	const separator = options?.separator ?? "\n\n";
	const trim = options?.trim ?? false;
	const values = [];
	for (const segment of segments) {
		if (typeof segment !== "string") continue;
		const normalized = trim ? segment.trim() : segment;
		if (!normalized) continue;
		values.push(normalized);
	}
	return values.length > 0 ? values.join(separator) : void 0;
}
//#endregion
//#region src/plugins/hook-claim-admission.ts
const CLAIM_ADMISSION = Symbol.for("openclaw.claimingHookAdmission");
function withClaimingHookAdmission(context, assertCurrent) {
	return assertCurrent ? Object.assign(context, { [CLAIM_ADMISSION]: assertCurrent }) : context;
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
	const { trustedLocalMedia: _trustedLocalMedia, ...safePayload } = next;
	const clonedPayload = structuredClone(safePayload);
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
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => {
			reject(/* @__PURE__ */ new Error(`timed out after ${timeoutMs}ms`));
		}, timeoutMs);
		if (optionsResult.unref) timer.unref?.();
	});
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
};
//#endregion
//#region src/plugins/hook-types.ts
const pluginHookNameSet = /* @__PURE__ */ new Set([
	"before_model_resolve",
	"agent_turn_prepare",
	"before_prompt_build",
	"before_agent_reply",
	"model_call_started",
	"model_call_ended",
	"llm_input",
	"llm_output",
	"before_agent_finalize",
	"agent_end",
	"before_compaction",
	"after_compaction",
	"before_reset",
	"inbound_claim",
	"channel_pairing_requested",
	"message_received",
	"message_sending",
	"reply_payload_sending",
	"message_sent",
	"before_tool_call",
	"after_tool_call",
	"tool_result_persist",
	"before_message_write",
	"session_start",
	"session_end",
	"subagent_delivery_target",
	"subagent_spawned",
	"subagent_progress",
	"subagent_ended",
	"gateway_start",
	"gateway_stop",
	"heartbeat_prompt_contribution",
	"cron_reconciled",
	"cron_changed",
	"skill_proposal_evaluate",
	"skill_proposal_changed",
	"skill_changed",
	"before_dispatch",
	"reply_dispatch",
	"before_install",
	"before_agent_run",
	"resolve_exec_env"
]);
const isPluginHookName = (hookName) => typeof hookName === "string" && pluginHookNameSet.has(hookName);
const promptInjectionHookNameSet = /* @__PURE__ */ new Set([
	"agent_turn_prepare",
	"before_prompt_build",
	"heartbeat_prompt_contribution"
]);
const isPromptInjectionHookName = (hookName) => promptInjectionHookNameSet.has(hookName);
const conversationHookNameSet = /* @__PURE__ */ new Set([
	"before_model_resolve",
	"agent_turn_prepare",
	"before_prompt_build",
	"before_agent_reply",
	"llm_input",
	"llm_output",
	"before_agent_finalize",
	"agent_end",
	"before_agent_run"
]);
const isConversationHookName = (hookName) => conversationHookNameSet.has(hookName);
const pluginHookAgentTriggerSet = /* @__PURE__ */ new Set([
	"cron",
	"heartbeat",
	"user"
]);
const isPluginHookAgentTrigger = (trigger) => typeof trigger === "string" && pluginHookAgentTriggerSet.has(trigger);
const isPluginHookReplyDispatchKind = (kind) => kind === "agent" || kind === "acp";
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
function getPluginSubagentRequesterContext() {
	const scope = pluginSubagentRequesterScope.getStore();
	return scope?.active === true ? scope.requester : void 0;
}
function resolvePluginSubagentCompletionRequester(completionDelivery) {
	if (completionDelivery !== void 0 && completionDelivery !== "current-requester") throw new Error("Unsupported plugin subagent completionDelivery value.");
	if (completionDelivery === void 0) return;
	const requester = getPluginSubagentRequesterContext();
	if (!requester) throw new Error("completionDelivery \"current-requester\" requires an active requester-bound plugin hook invocation.");
	return requester;
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
/**
* Create a hook runner for a specific registry.
*/
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
	const firstDefined = (prev, next) => prev ?? next;
	const lastDefined = (prev, next) => next ?? prev;
	const stickyTrue = (prev, next) => prev === true || next === true ? true : void 0;
	const mergeBeforeModelResolve = (acc, next) => ({
		modelOverride: firstDefined(acc?.modelOverride, next.modelOverride),
		providerOverride: firstDefined(acc?.providerOverride, next.providerOverride)
	});
	const normalizeHookToolsAllow = (value) => {
		if (value === void 0) return;
		if (!Array.isArray(value)) return [];
		if (value.some((entry) => typeof entry !== "string")) return [];
		return value;
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
			systemPrompt: firstDefined(acc?.systemPrompt, next.systemPrompt),
			prependContext: concatOptionalTextSegments({
				left: acc?.prependContext,
				right: next.prependContext
			}),
			appendContext: concatOptionalTextSegments({
				left: acc?.appendContext,
				right: next.appendContext
			}),
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
			if (Array.isArray(candidateList) && candidateList.length > 0) return candidateList.map((retry) => normalizeRetry(retry)).filter((retry) => retry !== void 0);
			const retry = normalizeRetry(result.retry);
			return retry ? [retry] : [];
		};
		const attachRetryCandidates = (result, candidates) => {
			if (result.action !== "revise" || candidates.length <= 1) return result;
			Object.defineProperty(result, "retryCandidates", {
				configurable: true,
				enumerable: false,
				value: candidates
			});
			return result;
		};
		if (acc?.action === "finalize") return acc;
		if (next.action === "finalize") return {
			action: "finalize",
			reason: next.reason
		};
		if (acc?.action === "revise" && next.action === "revise") {
			const retryCandidates = [...readRetryCandidates(acc), ...readRetryCandidates(next)];
			const retry = retryCandidates[0];
			return attachRetryCandidates({
				action: "revise",
				reason: concatOptionalTextSegments({
					left: acc.reason,
					right: next.reason
				}),
				...retry ? { retry } : {}
			}, retryCandidates);
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
	const mergeSubagentDeliveryTargetResult = (acc, next) => {
		if (acc?.origin) return acc;
		return next;
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
	const getPluginPackageVersion = (pluginId) => registry.plugins.find((plugin) => plugin.id === pluginId)?.packageVersion;
	const normalizePositiveTimeoutMs = (timeoutMs) => {
		return clampPositiveTimerTimeoutMs(timeoutMs);
	};
	const getVoidHookTimeoutMs = (hookName, hook) => normalizePositiveTimeoutMs(hook.timeoutMs) ?? normalizePositiveTimeoutMs(voidHookTimeoutMsByHook[hookName]);
	const getModifyingHookTimeoutMs = (hookName, hook) => normalizePositiveTimeoutMs(hook.timeoutMs) ?? normalizePositiveTimeoutMs(modifyingHookTimeoutMsByHook[hookName]);
	const getClaimingHookTimeoutMs = (hook) => normalizePositiveTimeoutMs(hook.timeoutMs);
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
	* Run a hook that doesn't return a value (fire-and-forget style).
	* All handlers are executed in parallel for performance.
	*/
	async function runVoidHook(hookName, event, ctx, optionsValue = {}, matcherToolName) {
		const hooks = getHooksForName(registry, hookName, void 0, matcherToolName);
		if (hooks.length === 0) return;
		logger?.debug?.(`[hooks] running ${hookName} (${hooks.length} handlers)`);
		const promises = hooks.map(async (hook) => {
			try {
				const invoke = () => hook.handler(event, ctx);
				const promise = Promise.resolve(hookName === "gateway_stop" ? runPluginCleanup(hook.handler, invoke) : invoke());
				const timeoutMs = getVoidHookTimeoutMs(hookName, hook);
				if (timeoutMs) await withHookTimeout(promise, timeoutMs, { unref: optionsValue.unrefTimeout ?? true });
				else await promise;
			} catch (err) {
				handleHookError({
					hookName,
					pluginId: hook.pluginId,
					error: err
				});
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
	* Run a hook that can return a modifying result.
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
					const timeoutMs = getModifyingHookTimeoutMs(hookName, hook);
					handlerResult = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
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
						policy.onTerminal?.({
							hookName,
							pluginId: hook.pluginId,
							result
						});
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
		const assertCurrent = readClaimingHookAdmission(ctx);
		let firstError;
		for (const hook of hooks) {
			if (assertCurrent) await assertCurrent();
			try {
				const invokeHandler = async () => {
					const promise = Promise.resolve(hook.handler(event, ctx));
					const timeoutMs = getClaimingHookTimeoutMs(hook);
					return timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
				};
				const handlerResult = runHandler ? await runHandler(invokeHandler) : await invokeHandler();
				if (handlerResult?.handled) return {
					status: "handled",
					result: handlerResult
				};
			} catch (err) {
				firstError ??= sanitizeHookError(err);
				handleHookError({
					hookName,
					pluginId: hook.pluginId,
					error: err
				});
			}
		}
		return firstError ? {
			status: "error",
			error: firstError
		} : { status: "declined" };
	}
	async function runClaimingHookForPluginOutcome(hookName, pluginId, event, ctx) {
		if (!registry.plugins.some((plugin) => plugin.id === pluginId && plugin.status === "loaded")) return { status: "missing_plugin" };
		const hooks = getHooksForNameAndPlugin(registry, hookName, pluginId);
		if (hooks.length === 0) return { status: "no_handler" };
		logger?.debug?.(`[hooks] running ${hookName} for ${pluginId} (${hooks.length} handlers, targeted outcome)`);
		return runClaimingHooksList(hooks, hookName, event, ctx);
	}
	function withAgentRunId(event, ctx) {
		if (event.runId || !ctx.runId) return event;
		return {
			...event,
			runId: ctx.runId
		};
	}
	/**
	* Run before_prompt_build hook.
	* Allows plugins to inject context and system prompt before prompt submission.
	*/
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
	/**
	* Run agent_end hook.
	* Allows plugins to analyze completed conversations.
	* Runs handlers in parallel.
	*/
	async function runAgentEnd(event, ctx, optionsLocal) {
		return runVoidHook("agent_end", withAgentRunId(event, ctx), ctx, optionsLocal);
	}
	/**
	* Run before_agent_finalize hook.
	* Allows plugins to request one more model pass before a natural final reply
	* is accepted. This is not the user-facing /stop cancellation path.
	*/
	async function runBeforeAgentFinalize(event, ctx) {
		return runModifyingHook("before_agent_finalize", withAgentRunId(event, ctx), ctx, { mergeResults: mergeBeforeAgentFinalize });
	}
	async function runInboundClaimForPlugin(pluginId, event, ctx) {
		const outcome = await runClaimingHooksList(getHooksForNameAndPlugin(registry, "inbound_claim", pluginId), "inbound_claim", event, ctx);
		return outcome.status === "handled" ? outcome.result : void 0;
	}
	async function runInboundClaimForPluginOutcome(pluginId, event, ctx) {
		return runClaimingHookForPluginOutcome("inbound_claim", pluginId, event, ctx);
	}
	/**
	* Run before_dispatch hook.
	* Allows plugins to inspect or handle a message before model dispatch.
	* First handler returning { handled: true } wins.
	*/
	async function runBeforeDispatch(event, ctx, requester) {
		return runClaimingHook("before_dispatch", event, ctx, requester ? (run) => withPluginSubagentRequesterContext(requester, run) : void 0);
	}
	/**
	* Run before_agent_run gate hook.
	* Fires after session resolution and workspace preparation, before model inference.
	* Returns the most-restrictive pass/block decision from all handlers.
	* Handlers that return void are treated as pass.
	*/
	async function runBeforeAgentRun(event, ctx) {
		let winningPluginId;
		const decision = await runModifyingHook("before_agent_run", event, ctx, {
			mergeResults: (_acc, next, reg) => {
				if (next === void 0 || next === null) {
					const normalized = {
						outcome: "block",
						reason: "before_agent_run returned an invalid decision"
					};
					winningPluginId = reg.pluginId;
					return normalized;
				}
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
	/**
	* Run before_tool_call hook.
	* Allows plugins to modify or block tool calls.
	* Runs sequentially.
	*/
	async function runBeforeToolCall(event, ctx, receipt) {
		return runModifyingHook("before_tool_call", event, ctx, {
			isolateEventPerHandler: true,
			mergeResults: (acc, next, reg) => {
				if (acc?.block === true) return acc;
				const approvalAlreadyRequested = acc?.requireApproval !== void 0;
				let params = lastDefined(acc?.params, next.params);
				if (approvalAlreadyRequested) params = acc?.params;
				else if (next.requireApproval && params !== void 0) params = cloneHookIsolationValue("before_tool_call", params);
				return {
					params,
					block: stickyTrue(acc?.block, next.block),
					blockReason: lastDefined(acc?.blockReason, next.blockReason),
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
	/**
	* Run after_tool_call hook.
	* Runs in parallel (fire-and-forget).
	*/
	async function runAfterToolCall(event, ctx) {
		return runVoidHook("after_tool_call", event, ctx, {}, event.toolName);
	}
	/**
	* Run tool_result_persist hook.
	*
	* This hook is intentionally synchronous: it runs in hot paths where session
	* transcripts are appended synchronously.
	*
	* Handlers are executed sequentially in priority order (higher first). Each
	* handler may return `{ message }` to replace the message passed to the next
	* handler.
	*/
	function runToolResultPersist(event, ctx) {
		const result = runSyncMessageHooks("tool_result_persist", event, ctx);
		return result ? { message: result.message } : void 0;
	}
	/**
	* Run before_message_write hook.
	*
	* This hook is intentionally synchronous: it runs on the hot path where
	* session transcripts are appended synchronously.
	*
	* Handlers are executed sequentially in priority order (higher first).
	* If any handler returns { block: true }, the message is NOT written
	* to the session JSONL and we return immediately.
	* If a handler returns { message }, the modified message replaces the
	* original for subsequent handlers and the final write.
	*/
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
			const pluginVersion = getPluginPackageVersion(hook.pluginId);
			const attribution = {
				evaluatorId: hook.registrationId ?? hook.pluginId,
				pluginId: hook.pluginId,
				...pluginVersion ? { pluginVersion } : {}
			};
			try {
				const handler = hook.handler;
				const promise = Promise.resolve(handler(immutableEvent, ctx));
				const timeoutMs = getModifyingHookTimeoutMs(hookName, hook);
				const result = timeoutMs ? await withHookTimeout(promise, timeoutMs) : await promise;
				return result ? Object.assign({}, attribution, {
					status: "completed",
					result
				}) : Object.assign({}, attribution, { status: "skipped" });
			} catch (error) {
				const message = sanitizeHookError(error);
				logger?.error(`[hooks] ${hookName} handler from ${hook.pluginId} failed: ${formatHookErrorForLog(error)}`);
				return Object.assign({}, attribution, {
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
	function hasHooks(hookName, ctx) {
		return registry.typedHooks.some((hook) => hook.hookName === hookName && (ctx === void 0 || isHookContextEligible(hook, ctx)));
	}
	/**
	* Get count of registered hooks for a given hook name.
	*/
	function getHookCount(hookName) {
		return registry.typedHooks.filter((h) => h.hookName === hookName).length;
	}
	return {
		runBeforeModelResolve: bindModifyingHook("before_model_resolve", { mergeResults: mergeBeforeModelResolve }),
		runAgentTurnPrepare: bindModifyingHook("agent_turn_prepare", { mergeResults: mergeAgentTurnPrepare }),
		runBeforePromptBuild,
		runAuthorizedPromptBuild,
		runBeforeAgentReply: bindClaimingHook("before_agent_reply"),
		runModelCallStarted: bindVoidHook("model_call_started"),
		runModelCallEnded: bindVoidHook("model_call_ended"),
		runLlmInput: bindVoidHook("llm_input"),
		runLlmOutput: bindVoidHook("llm_output"),
		runBeforeAgentFinalize,
		runAgentEnd,
		/**
		* Run before_compaction hook.
		*/
		runBeforeCompaction: bindVoidHook("before_compaction"),
		/**
		* Run after_compaction hook.
		*/
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
				reason: lastDefined(acc?.reason, next.reason)
			}),
			shouldStop: (result) => result.cancel === true,
			terminalLabel: "cancel=true"
		}),
		runMessageSending: async (event, ctx) => {
			const result = await runModifyingHook("message_sending", event, ctx, {
				mergeResults: (acc, next) => ({
					content: lastDefined(acc?.content, next.content),
					cancel: stickyTrue(acc?.cancel, next.cancel),
					cancelReason: lastDefined(acc?.cancelReason, next.cancelReason),
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
		runAfterToolCall,
		runToolResultPersist,
		runBeforeMessageWrite,
		runSessionStart: bindVoidHook("session_start"),
		runSessionEnd: bindVoidHook("session_end"),
		runSubagentDeliveryTarget: bindModifyingHook("subagent_delivery_target", { mergeResults: mergeSubagentDeliveryTargetResult }),
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
					blockReason: lastDefined(acc?.blockReason, next.blockReason)
				};
			},
			shouldStop: (result) => result.block === true,
			terminalLabel: "block=true"
		}),
		runResolveExecEnv,
		hasHooks,
		getHookCount
	};
}
//#endregion
export { pluginToolMatcherCoversTool as A, getGroupThreadParticipant as C, createPluginToolMatcherScope as D, withGroupThreadTurn as E, mergePluginToolMatcherScopes as O, getGroupThreadDispatchContext as S, recordGroupThreadReply as T, adoptGroupThreadRoot as _, isConversationHookName as a, formatGroupThreadReply as b, isPluginHookReplyDispatchKind as c, resolveBlockMessage as d, withClaimingHookAdmission as f, formatHookErrorForLog as g, fireAndForgetHook as h, resolvePluginSubagentCompletionRequester as i, normalizePluginToolMatcher as k, isPromptInjectionHookName as l, fireAndForgetBoundedHook as m, getToolHookMatcherScope as n, isPluginHookAgentTrigger as o, joinPresentTextSegments as p, createPluginSubagentRequesterContext as r, isPluginHookName as s, createHookRunner as t, cloneHookIsolationValue as u, bindGroupThreadDispatchContext as v, getGroupThreadTurn as w, getGroupThreadDeliverySession as x, captureGroupThreadToolReply as y };
