import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as isSensitiveFieldKey, h as redactSensitiveFieldValueWithConfig, o as prepareModelVisibleToolTextBlock, x as redactToolPayloadTextWithConfig } from "./redact-DJ8j6ADa.mjs";
import { A as registerResolvedAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { o as convertToLlm } from "./messages-CeqAykcC.mjs";
import { i as jsonUtf8BytesOrInfinity, n as firstEnumerableOwnKeys, t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { o as extractToolCallsFromAssistant, s as extractToolResultId, u as makeMissingToolResult } from "./tool-result-pairing-DxxMHOQj.mjs";
import { c as resolveTerminalAssistantTranscriptRunId, t as attachSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { a as resolveProviderRequestPolicy } from "./provider-attribution-DCsKu1Yv.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { f as withSessionMetadataPublication, p as withSessionTranscriptWriteAssertion, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-H2dQRi8K.mjs";
import { i as AuthStorage, n as getModelRegistryRuntime, t as ModelRegistry } from "./model-registry-DKSOyLSb.mjs";
import { n as getAgentDirResolution } from "./config-D_9OtqUZ.mjs";
import { r as bindStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { n as rewriteToolResultIds } from "./tool-call-id-CutFFA5a.mjs";
import { n as sanitizeToolCallInputs } from "./session-transcript-repair-CgGD_n-Q.mjs";
import { i as resolveLiveToolResultMaxChars, t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-B-fhY8wF.mjs";
import { c as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-D6jaTF6N.mjs";
import { E as withCodeModeSourceAppend, S as copyCodeModeSourceAppendOptions, h as redactTranscriptMessage, w as prepareCodeModeSourceAppend, x as copyCodeModeSourceAppend, y as resolveTranscriptLoggingConfig } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { s as restorePreparedUserTurnOperationalMetaForRuntime } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { o as applyInputProvenanceToUserMessage } from "./input-provenance-D1LHo5Qj.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { i as createSessionEntryWithTranscript } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { h as setInternalBeforeToolBatch, t as acknowledgeInternalToolResult } from "./internal-hooks-Cr0v44EY.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BXyGP6P6.mjs";
import "./user-turn-transcript-BMox_Fvt.mjs";
import { o as mergePreparedUserTurnMessageForRuntime } from "./user-turn-transcript.message-D6tiOY3Z.mjs";
import { t as Agent } from "./agent-core-B6jaDEVE.mjs";
import { B as takeRuntimeUserTurnTranscriptContext, H as withRuntimeUserTurnTranscriptRecorder, U as sanitizeCompactionReplayMessages, V as takeRuntimeUserTurnTranscriptRecorder, _ as setSessionToolResultPreparer, n as AgentSession, w as SettingsManager, z as attachRuntimeUserTurnTranscriptRecorder } from "./resource-loader-Cj2qTSi1.mjs";
import { d as truncateToolResultMessage } from "./tool-result-truncation-DHdMikfS.mjs";
import { a as setRawSessionAppendMessageAsync, i as setRawSessionAppendMessage, n as getRawSessionAppendMessage, r as getRawSessionAppendMessageAsync } from "./transcript-rewrite-ez8F94P3.mjs";
import "./messages-Lka8u-U2.mjs";
import { a as withSessionCompactionPersistence, i as sessionManagerReadInitialContext, n as SessionMetadataCommittedError, o as withSessionCompactionPersistenceAsync, t as SessionManager } from "./session-manager-fHN-UyrU.mjs";
import { n as withSessionManagerWrite } from "./session-manager-write-admission-BHoMWW_H.mjs";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "./transcript-visibility-DiwthCmj.mjs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { clampThinkingLevel } from "@openclaw/ai/internal/runtime";
//#region src/agents/embedded-agent-runner/run/midturn-precheck.ts
/** Stable message used to identify synthetic mid-turn overflow errors in session cleanup. */
const MID_TURN_PRECHECK_ERROR_MESSAGE = "Context overflow: prompt too large for the model (mid-turn precheck).";
/**
* Internal control-flow signal thrown after a tool result makes the next prompt
* exceed budget. The attempt runner catches it and routes through the overflow
* recovery path instead of treating it as an ordinary provider failure.
*/
var MidTurnPrecheckSignal = class extends Error {
	constructor(request) {
		super(MID_TURN_PRECHECK_ERROR_MESSAGE);
		this.name = "MidTurnPrecheckSignal";
		this.request = request;
	}
};
function isMidTurnPrecheckSignal(error) {
	return error instanceof MidTurnPrecheckSignal;
}
/** This local routing signal is not a provider response or durable conversation item. */
function isMidTurnPrecheckAssistantError(message) {
	return message?.role === "assistant" && message.stopReason === "error" && message.errorMessage === MID_TURN_PRECHECK_ERROR_MESSAGE;
}
//#endregion
//#region src/agents/session-tool-result-guard.payload.ts
function resolveMaxToolResultChars(opts) {
	return resolveIntegerOption(opts?.maxToolResultChars, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS, { min: 1 });
}
const MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES = 8192;
const MAX_PERSISTED_DETAIL_STRING_CHARS = 2e3;
const MAX_PERSISTED_DETAIL_SESSION_COUNT = 10;
const MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS = 200;
const MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS = 1024;
const MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS = 512;
const PERSISTED_DETAIL_REDACTION_BOUNDARY = "\0OPENCLAW_PERSISTED_DETAIL_BOUNDARY\0";
const PARTIAL_STRUCTURED_SECRET_VALUE_RE = /(?:["']?(?:api[-_]?key|apikey|token|secret|password|passwd|access[-_]?token|accesstoken|refresh[-_]?token|refreshtoken|auth[-_]?token|authtoken|client[-_]?secret|clientsecret|app[-_]?secret|appsecret|card[-_]?number|cardnumber|cvc|cvv)["']?\s*[:=]\s*["']?)(?!\*{3})(?=[^\s"',}\]]{8,})/i;
const PARTIAL_PRIVATE_KEY_BLOCK_RE = /-----BEGIN [A-Z0-9 ]*(?:PRIVATE KEY|OPENSSH PRIVATE KEY|RSA PRIVATE KEY|EC PRIVATE KEY|DSA PRIVATE KEY)-----/i;
function originalDetailsSizeFields(size) {
	return size.complete ? { originalDetailsBytes: size.bytes } : { originalDetailsBytesAtLeast: size.bytes };
}
function redactPersistedDetailString(value, maxChars = MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig) {
	if (value.length <= maxChars) return redactToolPayloadTextWithConfig(value, redactionConfig);
	const scan = `${sliceUtf16Safe(value, 0, maxChars)}${PERSISTED_DETAIL_REDACTION_BOUNDARY}${sliceUtf16Safe(value, maxChars, maxChars + MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS)}`;
	const redactedScan = redactToolPayloadTextWithConfig(scan, redactionConfig);
	const boundaryIndex = redactedScan.indexOf(PERSISTED_DETAIL_REDACTION_BOUNDARY);
	const redactedPrefix = boundaryIndex >= 0 ? redactedScan.slice(0, boundaryIndex) : "[OpenClaw persisted detail redacted: boundary marker removed]";
	const safePrefixChars = Math.max(0, maxChars - Math.min(maxChars, MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS));
	const initialPersistedPrefix = truncateUtf16Safe(redactedPrefix, safePrefixChars);
	const persistedPrefix = PARTIAL_STRUCTURED_SECRET_VALUE_RE.test(initialPersistedPrefix) || PARTIAL_PRIVATE_KEY_BLOCK_RE.test(initialPersistedPrefix) ? "[OpenClaw persisted detail redacted: partial secret span omitted]" : initialPersistedPrefix;
	return `${persistedPrefix}${persistedPrefix ? "\n" : ""}[OpenClaw persisted detail redacted: boundary overlap omitted]\n\n[OpenClaw persisted detail truncated: ${Math.max(0, value.length - maxChars)} original chars omitted]`;
}
function selectPersistedDetailRedactionKey(key, inheritedKey) {
	return isSensitiveFieldKey(key) ? key : inheritedKey;
}
function redactedOriginalDetailKeys(src, redactionConfig) {
	return firstEnumerableOwnKeys(src, 40).map((key) => redactToolPayloadTextWithConfig(key, redactionConfig));
}
function redactPersistedDetailValue(value, depth = 0, redactionKey, redactionConfig) {
	if (typeof value === "string") return redactionKey ? redactSensitiveFieldValueWithConfig(redactionKey, value, redactionConfig) : redactToolPayloadTextWithConfig(value, redactionConfig);
	if (redactionKey && (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")) return redactSensitiveFieldValueWithConfig(redactionKey, String(value), redactionConfig);
	const source = asOptionalObjectRecord(value);
	if (!source) return value;
	if (depth >= 8) return "[OpenClaw persisted detail redacted: max depth exceeded]";
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item) => {
			const redacted = redactPersistedDetailValue(item, depth + 1, redactionKey, redactionConfig);
			changed ||= redacted !== item;
			return redacted;
		});
		return changed ? next : value;
	}
	let changed = false;
	const next = {};
	for (const [key, field] of Object.entries(source)) {
		const redactedKey = redactToolPayloadTextWithConfig(key, redactionConfig);
		const redacted = redactPersistedDetailValue(field, depth + 1, selectPersistedDetailRedactionKey(key, redactionKey), redactionConfig);
		changed ||= redactedKey !== key || redacted !== field;
		next[redactedKey] = redacted;
	}
	return changed ? next : value;
}
function redactPersistedSummaryField(key, value, maxStringChars, redactionConfig) {
	if (typeof value === "string") return redactPersistedDetailString(value, maxStringChars, redactionConfig);
	return redactPersistedDetailValue(value, 0, selectPersistedDetailRedactionKey(key, void 0), redactionConfig);
}
function copyPersistedSummaryFields(params) {
	for (const key of params.keys) {
		const value = params.source[key];
		if (value !== void 0) params.target[key] = redactPersistedSummaryField(key, value, params.maxChars, params.redactionConfig);
	}
}
function sanitizePersistedSessionDetail(value, redactionConfig) {
	const src = asOptionalObjectRecord(value);
	if (!src) return value;
	const out = {};
	copyPersistedSummaryFields({
		target: out,
		source: src,
		keys: [
			"sessionId",
			"status",
			"pid",
			"startedAt",
			"endedAt",
			"runtimeMs",
			"cwd",
			"name",
			"truncated",
			"exitCode",
			"exitSignal"
		],
		maxChars: 500,
		redactionConfig
	});
	if (typeof src.command === "string") out.command = redactPersistedDetailString(src.command, 500, redactionConfig);
	return out;
}
function copyPersistedResultStateFields(out, src, maxStringChars, redactionConfig) {
	for (const key of [
		"disabled",
		"unavailable",
		"success"
	]) if (typeof src[key] === "boolean") out[key] = src[key];
	if (typeof src.error === "string" && src.error) out.error = redactPersistedDetailString(src.error, maxStringChars, redactionConfig);
	else if (src.error) out.error = true;
}
function buildPersistedDetailsFallback(src, originalSize, sanitizedBytes, redactionConfig) {
	const fallback = {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize)
	};
	if (sanitizedBytes !== void 0) fallback.sanitizedDetailsBytes = sanitizedBytes;
	if (src) {
		fallback.originalDetailKeys = redactedOriginalDetailKeys(src, redactionConfig);
		copyPersistedSummaryFields({
			target: fallback,
			source: src,
			keys: [
				"status",
				"sessionId",
				"pid",
				"exitCode",
				"exitSignal",
				"truncated",
				"spill",
				"fullOutputPath",
				"spilledChars",
				"spillTruncated"
			],
			maxChars: MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS,
			redactionConfig
		});
		copyPersistedResultStateFields(fallback, src, MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS, redactionConfig);
	}
	return fallback;
}
function enforcePersistedDetailsByteCap(value, originalDetails, originalSize, redactionConfig) {
	const sanitizedBytes = jsonUtf8BytesOrInfinity(value);
	if (sanitizedBytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return value;
	const fallback = buildPersistedDetailsFallback(isRecord(originalDetails) ? originalDetails : void 0, originalSize, sanitizedBytes, redactionConfig);
	return jsonUtf8BytesOrInfinity(fallback) <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES ? fallback : buildPersistedDetailsFallback(void 0, originalSize, sanitizedBytes);
}
function sanitizeToolResultDetailsForPersistence(details, redactionConfig) {
	if (details === void 0 || details === null) return details;
	const originalSize = boundedJsonUtf8Bytes(details, MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES);
	if (originalSize.complete && originalSize.bytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return enforcePersistedDetailsByteCap(redactPersistedDetailValue(details, 0, void 0, redactionConfig), details, originalSize, redactionConfig);
	const src = asOptionalObjectRecord(details);
	if (!src) return enforcePersistedDetailsByteCap({
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		valueType: typeof details
	}, void 0, originalSize, redactionConfig);
	const out = {
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		originalDetailKeys: redactedOriginalDetailKeys(src, redactionConfig)
	};
	copyPersistedSummaryFields({
		target: out,
		source: src,
		keys: [
			"status",
			"sessionId",
			"pid",
			"startedAt",
			"endedAt",
			"cwd",
			"name",
			"exitCode",
			"exitSignal",
			"retryInMs",
			"total",
			"totalLines",
			"totalChars",
			"truncated",
			"spill",
			"fullOutputPath",
			"spilledChars",
			"spillTruncated",
			"truncation"
		],
		maxChars: MAX_PERSISTED_DETAIL_STRING_CHARS,
		redactionConfig
	});
	copyPersistedResultStateFields(out, src, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
	if (typeof src.tail === "string") out.tail = redactPersistedDetailString(src.tail, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
	if (Array.isArray(src.sessions)) {
		out.sessions = src.sessions.slice(0, MAX_PERSISTED_DETAIL_SESSION_COUNT).map((session) => sanitizePersistedSessionDetail(session, redactionConfig));
		if (src.sessions.length > MAX_PERSISTED_DETAIL_SESSION_COUNT) out.sessionsTruncated = src.sessions.length - MAX_PERSISTED_DETAIL_SESSION_COUNT;
	}
	return enforcePersistedDetailsByteCap(out, src, originalSize, redactionConfig);
}
function capToolResultForPersistence(msg, maxChars, redactionConfig) {
	const capped = msg.role === "toolResult" ? truncateToolResultMessage(msg, maxChars) : msg;
	if (capped.role !== "toolResult") return capped;
	const details = capped.details;
	const sanitizedDetails = sanitizeToolResultDetailsForPersistence(details, redactionConfig);
	return sanitizedDetails === details ? capped : {
		...capped,
		details: sanitizedDetails
	};
}
function normalizePersistedToolResultName(message, fallbackName, fallbackId) {
	if (message.role !== "toolResult") return message;
	const rawToolName = message.toolName;
	const normalizedToolName = normalizeOptionalString(rawToolName);
	const normalizedFallback = normalizeOptionalString(fallbackName);
	const toolName = normalizedToolName ?? normalizedFallback ?? "unknown";
	const rawToolCallIdValue = message.toolCallId;
	const rawToolCallId = typeof rawToolCallIdValue === "string" ? rawToolCallIdValue : void 0;
	const toolCallId = rawToolCallId ?? normalizeOptionalString(fallbackId);
	const isError = typeof message.isError === "boolean" ? message.isError : false;
	if (rawToolName === toolName && rawToolCallId === toolCallId && message.isError === isError) return message;
	return {
		...message,
		...toolCallId ? { toolCallId } : {},
		toolName,
		isError
	};
}
//#endregion
//#region src/agents/session-tool-result-guard.transcript-seq.ts
function resolveEntryTranscriptSeq(sessionManager, entryId, seqByEntryId) {
	if (!entryId) return 0;
	const cached = seqByEntryId.get(entryId);
	if (cached !== void 0) return cached;
	let seq = 0;
	for (const entry of sessionManager.getBranch(entryId)) {
		if (entry.type === "message" || entry.type === "compaction") seq += 1;
		seqByEntryId.set(entry.id, seq);
	}
	return seqByEntryId.get(entryId);
}
function resolveAppendedMessageSeq(params) {
	if (typeof params.entryId !== "string") return;
	const parentSeq = resolveEntryTranscriptSeq(params.sessionManager, params.parentEntryId, params.seqByEntryId);
	if (parentSeq === void 0) return;
	const messageSeq = parentSeq + 1;
	params.seqByEntryId.set(params.entryId, messageSeq);
	return messageSeq;
}
//#endregion
//#region src/agents/session-tool-result-guard.ts
function isTranscriptOnlyOpenClawAssistantMessage(message) {
	if (!message || message.role !== "assistant") return false;
	const provider = normalizeOptionalString(message.provider) ?? "";
	const model = normalizeOptionalString(message.model) ?? "";
	return isTranscriptOnlyOpenClawAssistantModel(provider, model);
}
function extractPendingAssistantToolCalls(message) {
	return message.role === "assistant" && message.stopReason !== "aborted" && message.stopReason !== "error" ? extractToolCallsFromAssistant(message) : [];
}
/**
* Identities of one streamed assistant response. The runtime turnId is carried by every
* fragment; the provider responseId can first appear on a later fragment.
*/
function assistantResponseIds(message) {
	if (message.role !== "assistant") return [];
	return [message.responseId, message.turnId].flatMap((id) => normalizeOptionalString(id) ?? []);
}
function clearsPendingToolCalls(message, toolCalls, allowSyntheticToolResults, pendingResponseIds) {
	if (message.role === "toolResult") return false;
	if (assistantResponseIds(message).some((id) => pendingResponseIds.includes(id))) return false;
	return !(message.role === "custom" && "excludeFromContext" in message && message.excludeFromContext === true || message.role === "assistant" && toolCalls.length === 0 && isTranscriptOnlyOpenClawAssistantMessage(message)) && (toolCalls.length === 0 || message.role !== "assistant") || !allowSyntheticToolResults && toolCalls.length > 0;
}
function installSessionToolResultGuard(sessionManager, opts) {
	const originalAppend = getRawSessionAppendMessage(sessionManager);
	const originalAppendWithTranscriptAnchor = sessionManager.appendMessageWithTranscriptAnchor.bind(sessionManager);
	const originalAppendWithTranscriptAnchorAsync = sessionManager.appendMessageWithTranscriptAnchorAsync.bind(sessionManager);
	setRawSessionAppendMessage(sessionManager, originalAppend);
	setRawSessionAppendMessageAsync(sessionManager, getRawSessionAppendMessageAsync(sessionManager));
	const pending = /* @__PURE__ */ new Map();
	let pendingResponseIds = [];
	const persistMessage = (message, sourceAppend) => {
		const transformer = opts?.transformMessageForPersistence;
		const persisted = transformer ? transformer(message) : message;
		copyCodeModeSourceAppend(message, persisted, sourceAppend);
		return persisted;
	};
	const persistToolResult = (message, meta) => {
		const transformer = opts?.transformToolResultForPersistence;
		return transformer ? transformer(message, meta) : message;
	};
	const allowSyntheticToolResults = opts?.allowSyntheticToolResults ?? true;
	const missingToolResultText = opts?.missingToolResultText;
	const beforeWrite = opts?.beforeMessageWriteHook;
	const toolResultTransformerMayMutate = opts?.transformToolResultForPersistence !== void 0;
	const redactionConfig = opts?.config?.logging;
	const maxToolResultChars = resolveMaxToolResultChars(opts);
	const transcriptSeqByEntryId = /* @__PURE__ */ new Map();
	let transcriptRunId = opts?.runId;
	let assistantErrorTranscript = opts?.assistantErrorTranscript;
	let suppressNextUserMessagePersistence = opts?.suppressNextUserMessagePersistence === true;
	const appendRequest = (request, append) => withRuntimeUserTurnTranscriptRecorder(request.message, (beforeFreshMessageCommit) => {
		const appendOptions = opts?.config || beforeFreshMessageCommit ? copyCodeModeSourceAppendOptions(request.options, {
			...request.options,
			...opts?.config ? { config: opts.config } : {},
			...beforeFreshMessageCommit ? { beforeFreshMessageCommit } : {}
		}) : request.options;
		return append(request.message, request.sourceAppend ? prepareCodeModeSourceAppend(appendOptions ?? {}, request.message, request.sourceAppend) : appendOptions);
	});
	const runSync = (operation) => {
		let next = operation.next();
		while (!next.done) next = operation.next(appendRequest(next.value, originalAppendWithTranscriptAnchor));
		return next.value;
	};
	const runAsync = async (operation) => {
		let next = operation.next();
		while (!next.done) next = operation.next(await appendRequest(next.value, originalAppendWithTranscriptAnchorAsync));
		return next.value;
	};
	const updatePending = (message, calls = extractPendingAssistantToolCalls(message)) => {
		const resultId = message.role === "toolResult" ? extractToolResultId(message) : null;
		if (resultId) pending.delete(resultId);
		for (const call of calls) pending.set(call.id, call.name);
		if (calls.length > 0) pendingResponseIds = assistantResponseIds(message);
	};
	const recordPendingReceipt = (entryId, message, viewWasSuperseded) => {
		if (!viewWasSuperseded) {
			updatePending(message);
			return;
		}
		const branch = sessionManager.getBranch();
		const committedIndex = branch.findIndex((entry) => entry.id === entryId);
		if (committedIndex < 0) return;
		for (let index = committedIndex; index < branch.length; index++) {
			const entry = branch[index];
			if (entry?.type !== "message") continue;
			const calls = extractPendingAssistantToolCalls(entry.message);
			if (clearsPendingToolCalls(entry.message, calls, allowSyntheticToolResults, pendingResponseIds)) pending.clear();
			updatePending(entry.message, calls);
		}
	};
	function* appendMessageAndCacheTranscriptSeq(message, options, sourceAppend, acknowledgementSource = message) {
		const runOwnedMessage = attachSessionTranscriptRunId(message, transcriptRunId);
		copyCodeModeSourceAppend(message, runOwnedMessage, sourceAppend);
		const parentEntryId = sessionManager.getLeafId();
		const originalTarget = sessionManager.getSessionTarget();
		const { entryId, anchor, appended, lifecycleRevision, message: persistedMessage, viewWasSuperseded } = yield {
			message: runOwnedMessage,
			options,
			sourceAppend
		};
		const sessionTarget = anchor ? {
			agentId: anchor.agentId,
			sessionId: anchor.sessionId,
			sessionKey: anchor.sessionKey,
			storePath: anchor.storePath
		} : originalTarget;
		if (viewWasSuperseded) transcriptSeqByEntryId.clear();
		const persistedEntry = sessionManager.getEntry(entryId);
		const messageSeq = appended && sessionTarget && (!viewWasSuperseded || persistedEntry) ? resolveAppendedMessageSeq({
			sessionManager,
			entryId,
			parentEntryId: persistedEntry ? persistedEntry.parentId : parentEntryId,
			seqByEntryId: transcriptSeqByEntryId
		}) : void 0;
		acknowledgeInternalToolResult(acknowledgementSource);
		recordPendingReceipt(entryId, persistedMessage, viewWasSuperseded === true);
		if (!appended) return {
			entryId,
			message: persistedMessage,
			appended,
			...anchor ? { anchor } : {}
		};
		opts?.onMessagePersisted?.(persistedMessage);
		if (!sessionTarget) return {
			entryId,
			message: persistedMessage,
			appended,
			...anchor ? { anchor } : {}
		};
		return {
			entryId,
			appended,
			lifecycleRevision,
			message: persistedMessage,
			...anchor ? { anchor } : {},
			sessionTarget,
			messageSeq
		};
	}
	const originalAppendCompaction = sessionManager.appendCompaction.bind(sessionManager);
	const originalAppendCompactionAsync = sessionManager.appendCompactionAsync.bind(sessionManager);
	const guardedAppendCompaction = ((...args) => {
		args[5] = {
			runId: transcriptRunId,
			...args[5]
		};
		return withSessionCompactionPersistence(sessionManager, opts?.withCompactionPersistence, () => originalAppendCompaction(...args));
	});
	const guardedAppendCompactionAsync = (...args) => {
		args[5] = {
			runId: transcriptRunId,
			...args[5]
		};
		return withSessionCompactionPersistenceAsync(sessionManager, opts?.withCompactionPersistenceAsync, () => originalAppendCompactionAsync(...args));
	};
	/**
	* Run the before_message_write hook. Returns the (possibly modified) message,
	* or null if the message should be blocked.
	*/
	const applyBeforeWriteHook = (msg, sourceAppend) => {
		if (!beforeWrite) return {
			message: msg,
			changed: false
		};
		const result = beforeWrite({ message: msg }, sourceAppend);
		if (result?.block) return null;
		if (result?.message) return {
			message: result.message,
			changed: true
		};
		return {
			message: msg,
			changed: false
		};
	};
	function* flushPendingToolResultsOperation() {
		if (pending.size === 0) return;
		if (allowSyntheticToolResults) for (const [id, name] of pending.entries()) {
			const synthetic = makeMissingToolResult({
				toolCallId: id,
				toolName: name,
				text: missingToolResultText
			});
			const persistedSynthetic = persistMessage(synthetic);
			const transformed = persistToolResult(persistedSynthetic, {
				toolCallId: id,
				toolName: name,
				isSynthetic: true
			});
			const flushed = applyBeforeWriteHook(transformed);
			if (flushed) {
				const canonical = flushed.message.role === "toolResult" ? rewriteToolResultIds({
					message: flushed.message,
					resolveId: () => id
				}) : flushed.message;
				yield* appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(canonical, maxToolResultChars, redactionConfig), { invalidateSerializedPrefixCache: persistedSynthetic !== synthetic || toolResultTransformerMayMutate || canonical !== flushed.message || flushed.changed });
			}
		}
		pending.clear();
	}
	const flushPendingToolResults = () => runSync(flushPendingToolResultsOperation());
	const flushPendingToolResultsAsync = () => withSessionManagerWrite(sessionManager, () => runAsync(flushPendingToolResultsOperation()));
	function* guardedAppend(message, callerOptions, sourceAppend) {
		const callerInvalidatesCache = callerOptions?.invalidateSerializedPrefixCache === true;
		let nextMessage = message;
		if (message.role === "assistant") {
			const sanitized = sanitizeToolCallInputs([message], { allowedToolNames: opts?.allowedToolNames });
			if (sanitized.length === 0) {
				if (pending.size > 0) yield* flushPendingToolResultsOperation();
				return;
			}
			nextMessage = sanitized[0];
			copyCodeModeSourceAppend(message, nextMessage, sourceAppend);
		}
		if (nextMessage.role === "toolResult") {
			const id = extractToolResultId(nextMessage);
			const toolName = id ? pending.get(id) : void 0;
			const normalizedToolResult = normalizePersistedToolResultName(nextMessage, toolName, id ?? void 0);
			const persistedToolResult = persistMessage(normalizedToolResult);
			const capped = capToolResultForPersistence(persistedToolResult, maxToolResultChars, redactionConfig);
			const transformed = persistToolResult(capped, {
				toolCallId: id ?? void 0,
				toolName,
				isSynthetic: false
			});
			const persisted = applyBeforeWriteHook(transformed);
			if (!persisted) return;
			return (yield* appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(persisted.message, maxToolResultChars, redactionConfig), { invalidateSerializedPrefixCache: callerInvalidatesCache || persistedToolResult !== normalizedToolResult || toolResultTransformerMayMutate || persisted.changed }, void 0, message)).entryId;
		}
		const toolCalls = extractPendingAssistantToolCalls(nextMessage);
		if (pending.size > 0 && clearsPendingToolCalls(nextMessage, toolCalls, allowSyntheticToolResults, pendingResponseIds)) yield* flushPendingToolResultsOperation();
		const transformedMessage = persistMessage(nextMessage, sourceAppend);
		const finalWrite = applyBeforeWriteHook(transformedMessage, sourceAppend);
		if (!finalWrite) {
			if (transformedMessage.role === "user") opts?.onUserMessageBlocked?.(transformedMessage);
			return;
		}
		let finalMessage = finalWrite.message;
		if (finalMessage.role === "assistant" && toolCalls.length === 0 && opts?.suppressTranscriptOnlyAssistantPersistence === true) return;
		if (finalMessage.role === "assistant" && assistantErrorTranscript && finalMessage.stopReason === "error") {
			const target = sessionManager.getSessionTarget();
			if (target) {
				const replayMessage = assistantErrorTranscript.record(finalMessage, target, message);
				if (!replayMessage) return;
				copyCodeModeSourceAppend(finalMessage, replayMessage, sourceAppend);
				finalMessage = replayMessage;
			}
		}
		if (finalMessage.role === "user" && suppressNextUserMessagePersistence) {
			suppressNextUserMessagePersistence = false;
			opts?.onUserMessagePersistenceSuppressed?.(finalMessage);
			return;
		}
		const { anchor, appended, entryId: result, lifecycleRevision, message: persistedMessage, messageSeq, sessionTarget } = yield* appendMessageAndCacheTranscriptSeq(finalMessage, { invalidateSerializedPrefixCache: callerInvalidatesCache || transformedMessage !== nextMessage || finalWrite.changed || finalMessage !== finalWrite.message }, sourceAppend, message);
		if (sessionTarget) {
			const runId = resolveTerminalAssistantTranscriptRunId(persistedMessage, transcriptRunId);
			publishTranscriptUpdate(sessionTarget, {
				lifecycleRevision,
				message: persistedMessage,
				messageId: typeof result === "string" ? result : void 0,
				...messageSeq !== void 0 ? { messageSeq } : {},
				...runId ? { runId } : {}
			});
		}
		if (finalMessage.role === "user" && persistedMessage.role === "user") opts?.onUserMessagePersisted?.(finalMessage, {
			...anchor ? { anchor } : {},
			appended,
			entryId: result,
			persistedMessage,
			...sessionTarget ? { sessionTarget } : {}
		});
		return result;
	}
	sessionManager.appendMessage = ((message, options) => {
		warnSessionPersistenceDeprecation("SessionManager.appendMessage", "appendMessageAsync");
		return withCodeModeSourceAppend(message, options, (sourceAppend) => runSync(guardedAppend(message, options, sourceAppend)));
	});
	sessionManager.appendMessageAsync = (message, options) => withSessionManagerWrite(sessionManager, () => withCodeModeSourceAppend(message, options, (sourceAppend) => runAsync(guardedAppend(message, options, sourceAppend))));
	sessionManager.appendCompaction = guardedAppendCompaction;
	sessionManager.appendCompactionAsync = guardedAppendCompactionAsync;
	return {
		hasPendingToolResults: () => pending.size > 0,
		flushPendingToolResults,
		flushPendingToolResultsAsync,
		clearPendingToolResults: () => pending.clear(),
		clearNextUserMessagePersistenceSuppression: () => {
			suppressNextUserMessagePersistence = false;
		},
		setNextUserMessagePersistenceSuppression: (suppress) => {
			suppressNextUserMessagePersistence = suppress;
		},
		getPendingIds: () => Array.from(pending.keys()),
		setTranscriptRunId: (runId, errors) => {
			transcriptRunId = runId;
			assistantErrorTranscript = errors;
		}
	};
}
//#endregion
//#region src/agents/session-tool-result-guard-wrapper.ts
/**
* Apply the tool-result guard to a SessionManager exactly once and expose
* a flush method on the instance for easy teardown handling.
*/
function guardSessionManager(sessionManager, opts) {
	const guardedSessionManager = sessionManager;
	let prepareAssistantTranscriptMessage = opts?.trigger === "memory" ? void 0 : opts?.prepareAssistantTranscriptMessage;
	let skipBeforeMessageWriteHooks = opts?.skipBeforeMessageWriteHooks;
	let inputProvenance = opts?.inputProvenance;
	let pendingPreparedUserTurnMessage = opts?.preparedUserTurnMessage;
	let preparedUserTurnTranscriptRecorder = opts?.preparedUserTurnTranscriptRecorder;
	let preparedUserReplayKey = preparedUserTurnTranscriptRecorder?.getPersistedMessage?.()?.idempotencyKey === pendingPreparedUserTurnMessage?.idempotencyKey ? pendingPreparedUserTurnMessage?.idempotencyKey : void 0;
	if (typeof guardedSessionManager.flushPendingToolResultsAsync === "function") {
		guardedSessionManager.setTranscriptRunContext?.(opts?.runId, prepareAssistantTranscriptMessage, skipBeforeMessageWriteHooks, opts?.assistantErrorTranscript, inputProvenance, preparedUserReplayKey === void 0 && opts?.suppressNextUserMessagePersistence, {
			message: pendingPreparedUserTurnMessage,
			recorder: preparedUserTurnTranscriptRecorder,
			replayKey: preparedUserReplayKey
		});
		return guardedSessionManager;
	}
	const hookRunner = getGlobalHookRunner();
	let queuedUserTurnTranscriptRecorder;
	const runtimeUserMessageByPersistedMessage = /* @__PURE__ */ new WeakMap();
	const beforeMessageWrite = (event, sourceAppend) => {
		if (isMidTurnPrecheckAssistantError(event.message)) return { block: true };
		const runtimeUserMessage = runtimeUserMessageByPersistedMessage.get(event.message);
		let message = event.message;
		let changed = false;
		const skipUserWriteHook = skipBeforeMessageWriteHooks || message.role === "user" && queuedUserTurnTranscriptRecorder?.getPendingInputMessage?.() !== void 0;
		if (!skipUserWriteHook && hookRunner?.hasHooks("before_message_write") || prepareAssistantTranscriptMessage) {
			const preparedMessage = message.role === "user" ? {
				...message,
				__openclaw: { ...Reflect.get(message, "__openclaw") }
			} : void 0;
			if (preparedMessage && (preparedMessage["__openclaw"].humanMentions !== void 0 || preparedMessage["__openclaw"].workContext !== void 0)) {
				preparedMessage.content = structuredClone(preparedMessage.content);
				preparedMessage["__openclaw"].humanMentions = structuredClone(preparedMessage["__openclaw"].humanMentions);
			}
			const next = runAgentHarnessBeforeMessageWriteHook({
				message,
				agentId: opts?.agentId,
				sessionKey: opts?.sessionKey,
				prepareAssistantTranscriptMessage,
				skipBeforeMessageWriteHooks: skipUserWriteHook
			});
			if (!next) {
				runtimeUserMessageByPersistedMessage.delete(event.message);
				queuedUserTurnTranscriptRecorder?.markBlocked();
				queuedUserTurnTranscriptRecorder = void 0;
				return { block: true };
			}
			message = restorePreparedUserTurnOperationalMetaForRuntime({
				runtimeMessage: next,
				preparedMessage
			});
			changed = true;
		}
		copyCodeModeSourceAppend(event.message, message, sourceAppend);
		const redacted = redactTranscriptMessage(message, opts?.config, sourceAppend);
		if (redacted !== message) {
			message = redacted;
			changed = true;
		}
		const projectedMessage = projectAgentHarnessTranscriptMessageForDisplay({
			hidden: opts?.trigger === "memory",
			inputProvenance,
			message
		});
		if (projectedMessage !== message) {
			copyCodeModeSourceAppend(message, projectedMessage, sourceAppend);
			message = projectedMessage;
			changed = true;
		}
		if (message.role !== "user" && queuedUserTurnTranscriptRecorder) {
			queuedUserTurnTranscriptRecorder.markBlocked();
			queuedUserTurnTranscriptRecorder = void 0;
		}
		if (message.role === "user" && queuedUserTurnTranscriptRecorder) {
			message = attachRuntimeUserTurnTranscriptRecorder(message, queuedUserTurnTranscriptRecorder);
			queuedUserTurnTranscriptRecorder = void 0;
		}
		if (runtimeUserMessage && message.role === "user") runtimeUserMessageByPersistedMessage.set(message, runtimeUserMessage);
		return changed ? { message } : void 0;
	};
	const transform = hookRunner?.hasHooks("tool_result_persist") ? (message, meta) => {
		return hookRunner.runToolResultPersist({
			toolName: meta.toolName,
			toolCallId: meta.toolCallId,
			message,
			isSynthetic: meta.isSynthetic
		}, {
			agentId: opts?.agentId,
			sessionKey: opts?.sessionKey,
			toolName: meta.toolName,
			toolCallId: meta.toolCallId
		})?.message ?? message;
	} : void 0;
	const maxToolResultChars = resolveMaxToolResultChars({ maxToolResultChars: typeof opts?.contextWindowTokens === "number" ? resolveLiveToolResultMaxChars({ contextWindowTokens: opts.contextWindowTokens }) : void 0 });
	const guard = installSessionToolResultGuard(sessionManager, {
		sessionKey: opts?.sessionKey,
		agentId: opts?.agentId,
		runId: opts?.runId,
		transformMessageForPersistence: (message) => {
			queuedUserTurnTranscriptRecorder = void 0;
			const withProvenance = applyInputProvenanceToUserMessage(message, inputProvenance);
			const runtimeContext = takeRuntimeUserTurnTranscriptContext(message);
			if (message.role === "user" && preparedUserReplayKey !== void 0 && Reflect.get(runtimeContext?.message ?? message, "idempotencyKey") !== preparedUserReplayKey) {
				pendingPreparedUserTurnMessage = void 0;
				guard.clearNextUserMessagePersistenceSuppression();
			}
			const prepared = runtimeContext?.message ?? pendingPreparedUserTurnMessage;
			const recorder = runtimeContext?.recorder ?? (prepared !== void 0 && prepared === pendingPreparedUserTurnMessage ? preparedUserTurnTranscriptRecorder : void 0);
			if (message.role === "user") opts?.onUserMessagePreparingForPersistence?.(message, recorder, prepared);
			const merged = mergePreparedUserTurnMessageForRuntime({
				runtimeMessage: withProvenance,
				...prepared ? { preparedMessage: prepared } : {}
			});
			if (merged !== withProvenance) {
				queuedUserTurnTranscriptRecorder = recorder;
				if (!runtimeContext) pendingPreparedUserTurnMessage = void 0;
			}
			if (message.role === "user" && merged.role === "user") runtimeUserMessageByPersistedMessage.set(merged, message);
			return merged;
		},
		transformToolResultForPersistence: transform,
		allowSyntheticToolResults: opts?.allowSyntheticToolResults,
		missingToolResultText: opts?.missingToolResultText,
		allowedToolNames: opts?.allowedToolNames,
		beforeMessageWriteHook: beforeMessageWrite,
		config: opts?.config,
		maxToolResultChars,
		suppressNextUserMessagePersistence: opts?.suppressNextUserMessagePersistence,
		suppressTranscriptOnlyAssistantPersistence: opts?.suppressTranscriptOnlyAssistantPersistence,
		assistantErrorTranscript: opts?.assistantErrorTranscript,
		onMessagePersisted: opts?.onMessagePersisted,
		withCompactionPersistence: opts?.withCompactionPersistence,
		withCompactionPersistenceAsync: opts?.withCompactionPersistenceAsync,
		onUserMessagePersisted: async (message, persistence) => {
			const runtimeMessage = runtimeUserMessageByPersistedMessage.get(message);
			runtimeUserMessageByPersistedMessage.delete(message);
			takeRuntimeUserTurnTranscriptRecorder(message)?.markRuntimePersisted(persistence.persistedMessage, persistence.anchor, { appended: persistence.appended });
			await opts?.onUserMessagePersisted?.(persistence.persistedMessage, runtimeMessage);
		},
		onUserMessagePersistenceSuppressed: async (message) => {
			const runtimeMessage = runtimeUserMessageByPersistedMessage.get(message);
			runtimeUserMessageByPersistedMessage.delete(message);
			await opts?.onUserMessagePersistenceSuppressed?.(message, runtimeMessage);
		},
		onUserMessageBlocked: opts?.onUserMessageBlocked
	});
	setSessionToolResultPreparer(guardedSessionManager, {
		prepareText: (block) => prepareModelVisibleToolTextBlock(block, resolveTranscriptLoggingConfig(opts?.config)),
		cap: (message) => truncateToolResultMessage(message, maxToolResultChars)
	});
	guardedSessionManager.hasPendingToolResults = guard.hasPendingToolResults;
	guardedSessionManager.flushPendingToolResults = guard.flushPendingToolResults;
	guardedSessionManager.flushPendingToolResultsAsync = guard.flushPendingToolResultsAsync;
	guardedSessionManager.clearPendingToolResults = guard.clearPendingToolResults;
	guardedSessionManager.clearNextUserMessagePersistenceSuppression = guard.clearNextUserMessagePersistenceSuppression;
	guardedSessionManager.setTranscriptRunContext = (runId, prepare, skipHooks, errors, provenance, suppressUserPersistence, preparedUserTurn) => {
		guard.setTranscriptRunId(runId, errors);
		guard.setNextUserMessagePersistenceSuppression(suppressUserPersistence === true);
		prepareAssistantTranscriptMessage = prepare;
		skipBeforeMessageWriteHooks = skipHooks;
		inputProvenance = provenance;
		pendingPreparedUserTurnMessage = preparedUserTurn.message;
		preparedUserTurnTranscriptRecorder = preparedUserTurn.recorder;
		preparedUserReplayKey = preparedUserTurn.replayKey;
	};
	return guardedSessionManager;
}
//#endregion
//#region src/agents/sessions/telemetry.ts
/** Resolves whether install telemetry is enabled from env override or settings. */
function isInstallTelemetryEnabled(settingsManager, telemetryEnv = process.env.OPENCLAW_TELEMETRY) {
	return telemetryEnv !== void 0 ? isTruthyEnvValue(telemetryEnv) : settingsManager.getEnableInstallTelemetry();
}
//#endregion
//#region src/agents/sessions/sdk.ts
/** Assembles an agent session from the run owner's selected model and prepared resources. */
function createSessionPrepareNextTurnWithContext(getAgent) {
	let activeRunMessages;
	let effectiveModel;
	let effectiveThinkingLevel;
	let lastSessionModel;
	let lastSessionThinkingLevel;
	let lastSessionPrompt;
	let lastSessionTools = [];
	const sameTools = (left, right) => left.length === right.length && left.every((tool, index) => tool === right[index]);
	return async (turn, signal) => {
		const agent = getAgent();
		const firstTurnInRun = activeRunMessages !== turn.newMessages;
		if (firstTurnInRun) {
			activeRunMessages = turn.newMessages;
			effectiveModel = agent.state.model;
			effectiveThinkingLevel = agent.state.thinkingLevel;
		}
		const previousSnapshot = await agent.prepareNextTurn?.(signal);
		const sessionPrompt = agent.state.systemPrompt;
		const sessionTools = agent.state.tools;
		const sessionModelChanged = firstTurnInRun || agent.state.model !== lastSessionModel;
		const sessionThinkingChanged = firstTurnInRun || agent.state.thinkingLevel !== lastSessionThinkingLevel;
		const sessionPromptChanged = firstTurnInRun || sessionPrompt !== lastSessionPrompt;
		const sessionToolsChanged = firstTurnInRun || !sameTools(sessionTools, lastSessionTools);
		effectiveModel = previousSnapshot?.model ?? (sessionModelChanged ? agent.state.model : effectiveModel);
		effectiveThinkingLevel = previousSnapshot?.thinkingLevel ?? (sessionThinkingChanged ? agent.state.thinkingLevel : effectiveThinkingLevel);
		lastSessionModel = agent.state.model;
		lastSessionThinkingLevel = agent.state.thinkingLevel;
		lastSessionPrompt = sessionPrompt;
		lastSessionTools = sessionTools.slice();
		const nextContext = previousSnapshot?.context ? { ...previousSnapshot.context } : {
			...turn.context,
			systemPrompt: sessionPromptChanged ? sessionPrompt : turn.context.systemPrompt,
			tools: sessionToolsChanged ? sessionTools.slice() : turn.context.tools?.slice()
		};
		return {
			...previousSnapshot,
			context: nextContext,
			model: effectiveModel,
			thinkingLevel: effectiveThinkingLevel
		};
	};
}
function getAttributionHeaders(model, settingsManager) {
	const { attributionHeaders, allowsHiddenAttribution } = resolveProviderRequestPolicy({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl
	});
	if (attributionHeaders && !allowsHiddenAttribution) return attributionHeaders;
	if (!isInstallTelemetryEnabled(settingsManager)) return;
	const baseUrl = model.baseUrl ?? "";
	if (model.provider === "cloudflare-workers-ai" || model.provider === "cloudflare-ai-gateway" || baseUrl.includes("api.cloudflare.com") || baseUrl.includes("gateway.ai.cloudflare.com")) return { "User-Agent": "openclaw" };
}
async function createAgentSession(options) {
	return await createAgentSessionImpl(options);
}
/** Internal factory for temporary embedded sessions that do not own durable provider resources. */
async function createAgentSessionForEmbeddedRunner(options, internalOptions) {
	return await createAgentSessionImpl(options, internalOptions, false);
}
async function createAgentSessionImpl(options, internalOptions = {}, cleanupProviderSessionResourcesOnDispose = true) {
	const cwd = options.cwd ?? options.sessionManager?.getCwd() ?? process.cwd();
	const install = getAgentDirResolution(options.agentDir);
	const { dir: agentDir } = install.directory;
	if (options.agentDir === void 0 && install.directory.owner) registerResolvedAgentDir({
		agentId: install.directory.owner,
		agentDir,
		env: install.env
	});
	const resourceLoader = options.resourceLoader;
	const config = options.authStorage && options.modelRegistry ? void 0 : install.config;
	const authStorage = options.authStorage ?? AuthStorage.forAgent(agentDir, config);
	const modelRegistry = options.modelRegistry ?? ModelRegistry.create(authStorage, join(agentDir, "models.json"), {
		config,
		workspaceDir: cwd
	});
	const settingsManager = options.settingsManager ?? SettingsManager.create(cwd, agentDir);
	const sessionManager = options.sessionManager ?? await createDefaultSdkSessionManager(cwd, install);
	const initialTarget = sessionManager.getSessionTarget();
	const initialSessionId = sessionManager.getSessionId();
	const assertInitialSessionCurrent = () => {
		const current = sessionManager.getSessionTarget();
		if (sessionManager.getSessionId() !== initialSessionId || !sameSessionTranscriptTargetBinding(initialTarget, current)) throw new SessionTranscriptWriterClaimReboundError();
	};
	const existingSession = await sessionManager[sessionManagerReadInitialContext]();
	assertInitialSessionCurrent();
	const hasExistingSession = existingSession.messages.length > 0;
	const hasThinkingEntry = sessionManager.getBranch().some((entry) => entry.type === "thinking_level_change");
	const model = options.model;
	const thinkingLevel = clampThinkingLevel(model, options.thinkingLevel);
	const defaultActiveToolNames = [
		"read",
		"bash",
		"edit",
		"write"
	];
	const customToolNames = options.customTools?.map((tool) => tool.name) ?? [];
	const allowedToolNames = options.tools ?? (options.noTools === "all" ? [] : void 0);
	const disableBuiltInTools = !options.tools && options.noTools === "builtin";
	const initialActiveToolNames = options.tools ? [...options.tools] : options.noTools === "all" ? [] : options.noTools === "builtin" ? customToolNames : defaultActiveToolNames;
	const convertToLlmWithBlockImages = (messages) => {
		const converted = convertToLlm(messages);
		if (!settingsManager.getBlockImages()) return converted;
		return converted.map((msg) => {
			if (msg.role === "user" || msg.role === "toolResult") {
				const content = msg.content;
				if (Array.isArray(content)) {
					if (content.some((c) => c.type === "image")) {
						const filteredContent = content.map((c) => c.type === "image" ? {
							type: "text",
							text: "Image reading is disabled."
						} : c).filter((c, i, arr) => {
							const previous = arr.at(i - 1);
							return !(c.type === "text" && c.text === "Image reading is disabled." && i > 0 && previous?.type === "text" && previous.text === "Image reading is disabled.");
						});
						return Object.assign({}, msg, { content: filteredContent });
					}
				}
			}
			return msg;
		});
	};
	const extensionRunnerRef = {};
	const runWithSessionWriteSettlement = async (run) => options.withSessionWriteSettlement ? await options.withSessionWriteSettlement(run) : await run();
	assertInitialSessionCurrent();
	const modelRegistryRuntime = getModelRegistryRuntime(modelRegistry);
	const agent = new Agent({
		initialState: {
			systemPrompt: "",
			model,
			thinkingLevel,
			tools: []
		},
		convertToLlm: convertToLlmWithBlockImages,
		streamFn: async (modelResult, context, optionsLocal) => {
			const auth = await modelRegistry.getApiKeyAndHeaders(modelResult);
			if (!auth.ok) throw new Error(auth.error);
			await import("./ai-transport-runtime-host-CXLw_flH.mjs");
			optionsLocal?.signal?.throwIfAborted();
			const providerRetrySettings = settingsManager.getProviderRetrySettings();
			const attributionHeaders = getAttributionHeaders(modelResult, settingsManager);
			return modelRegistryRuntime.llmRuntime.streamSimple(modelResult, context, {
				...optionsLocal,
				apiKey: auth.apiKey,
				timeoutMs: optionsLocal?.timeoutMs ?? providerRetrySettings.timeoutMs,
				maxRetryDelayMs: optionsLocal?.maxRetryDelayMs ?? providerRetrySettings.maxRetryDelayMs,
				headers: attributionHeaders || auth.headers || optionsLocal?.headers ? {
					...attributionHeaders,
					...auth.headers,
					...optionsLocal?.headers
				} : void 0
			});
		},
		onPayload: async (payload) => {
			const runner = extensionRunnerRef.current;
			if (!runner?.hasHandlers("before_provider_request")) return payload;
			return await runWithSessionWriteSettlement(async () => await runner.emitBeforeProviderRequest(payload));
		},
		onResponse: async (response) => {
			const runner = extensionRunnerRef.current;
			if (!runner?.hasHandlers("after_provider_response")) return;
			await runWithSessionWriteSettlement(async () => await runner.emit({
				type: "after_provider_response",
				status: response.status,
				headers: response.headers
			}));
		},
		sessionId: initialSessionId,
		transformContext: async (messages) => {
			const runner = extensionRunnerRef.current;
			if (!runner) return messages;
			return runner.emitContext(messages);
		},
		resolveDeferredTool: options.resolveDeferredTool,
		prepareNextTurnWithContext: createSessionPrepareNextTurnWithContext(() => agent),
		steeringMode: settingsManager.getSteeringMode(),
		followUpMode: settingsManager.getFollowUpMode(),
		transport: settingsManager.getTransport(),
		thinkingBudgets: settingsManager.getThinkingBudgets(),
		maxRetryDelayMs: settingsManager.getProviderRetrySettings().maxRetryDelayMs
	});
	setInternalBeforeToolBatch(agent, internalOptions.beforeToolBatch);
	if (agent.streamFn) bindStreamLlmRuntime(agent.streamFn, modelRegistryRuntime.llmRuntime);
	let metadataCommit;
	const appendInitialMetadata = (change, append) => withSessionMetadataPublication(sessionManager, change, (commit) => {
		metadataCommit = commit;
	}, append);
	const appendInitialThinking = () => appendInitialMetadata({
		type: "thinking_level_change",
		thinkingLevel
	}, () => sessionManager.appendThinkingLevelChange(thinkingLevel));
	const initializeMetadata = () => {
		if (hasExistingSession && hasThinkingEntry) return Promise.resolve();
		return withSessionManagerWrite(sessionManager, async () => {
			assertInitialSessionCurrent();
			if (!hasExistingSession) {
				await appendInitialMetadata({
					type: "model_change",
					provider: model.provider,
					modelId: model.id
				}, () => sessionManager.appendModelChange(model.provider, model.id));
				assertInitialSessionCurrent();
			}
			await appendInitialThinking();
			if (hasExistingSession) assertInitialSessionCurrent();
		});
	};
	try {
		await (initialTarget ? withSessionTranscriptWriteAssertion(initialTarget, assertInitialSessionCurrent, initializeMetadata) : initializeMetadata());
		assertInitialSessionCurrent();
		if (hasExistingSession) agent.state.messages = sanitizeCompactionReplayMessages(existingSession.messages);
	} catch (cause) {
		if (cause instanceof SessionMetadataCommittedError || !metadataCommit) throw cause;
		throw new SessionMetadataCommittedError(metadataCommit.entry, metadataCommit.version, cause, metadataCommit.target);
	}
	return {
		session: new AgentSession({
			agent,
			sessionManager,
			settingsManager,
			cwd,
			resourceLoader,
			customTools: options.customTools,
			modelRegistry,
			initialActiveToolNames,
			allowedToolNames,
			disableBuiltInTools,
			extensionRunnerRef,
			sessionStartEvent: options.sessionStartEvent,
			withSessionWriteSettlement: options.withSessionWriteSettlement,
			contextOverflowRecoveryOwner: internalOptions.contextOverflowRecoveryOwner,
			resolveCompactionThinkingLevel: internalOptions.resolveCompactionThinkingLevel,
			cleanupProviderSessionResourcesOnDispose
		}),
		extensionsResult: resourceLoader.getExtensions()
	};
}
async function createDefaultSdkSessionManager(cwd, install) {
	const { dir: agentDir, owner: agentId } = install.directory;
	if (!agentId) throw new Error("Select an agent owner or provide a sessionManager before creating an SDK session.");
	const sessionId = randomUUID();
	const target = {
		agentId,
		sessionId,
		sessionKey: `agent:${agentId}:sdk:${sessionId}`,
		storePath: join(agentDir, "openclaw-agent.sqlite"),
		env: install.env
	};
	openOpenClawAgentDatabase({
		agentId,
		env: install.env,
		path: target.storePath
	});
	const created = await createSessionEntryWithTranscript(target, () => ({
		ok: true,
		entry: {
			sessionId,
			updatedAt: Date.now()
		}
	}), { cwd });
	if (!created.ok) throw new Error(`Failed to initialize SDK session transcript: ${created.error}`);
	return await SessionManager.openAsync(target, cwd);
}
//#endregion
export { isMidTurnPrecheckAssistantError as a, MidTurnPrecheckSignal as i, createAgentSessionForEmbeddedRunner as n, isMidTurnPrecheckSignal as o, guardSessionManager as r, createAgentSession as t };
