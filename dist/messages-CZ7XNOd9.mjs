import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as readAgentAssistantSource, n as bindAgentAssistantSource } from "./agent-events-Bf3Js0D3.mjs";
import { o as extractToolCallsFromAssistant, s as extractToolResultId, u as makeMissingToolResult } from "./tool-result-pairing-B20tITEh.mjs";
import { l as resolveTerminalAssistantTranscriptRunId, n as attachSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { t as advanceMessageActionPrompt } from "./message-action-turn-capability-CbQswcwc.mjs";
import { E as mergePreparedUserTurnMessageForRuntime } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { t as acknowledgeInternalToolResult } from "./internal-hooks-CSjTREUl.mjs";
import { o as applyInputProvenanceToUserMessage } from "./input-provenance-D1LHo5Qj.mjs";
import "./messages-Cdi_z_94.mjs";
import { i as jsonUtf8BytesOrInfinity, n as firstEnumerableOwnKeys, t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { l as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { s as restorePreparedUserTurnOperationalMetaForRuntime } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { f as sanitizeTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { r as prepareSessionManagerSync } from "./session-manager-incognito-scope-DBz3K1lk.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-CXanuHpz.mjs";
import { i as resolveLiveToolResultMaxChars, t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-tYfGdUlb.mjs";
import { n as rewriteToolResultIds } from "./tool-call-id-Cp_h0s17.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C0CV-oid.mjs";
import "./user-turn-transcript-CtVHLnLR.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { n as sanitizeToolCallInputs } from "./session-transcript-repair-BTNxtQ4j.mjs";
import { d as truncateToolResultMessage } from "./tool-result-truncation-B6wvsjzz.mjs";
import { a as setRawSessionAppendMessageAsync, i as setRawSessionAppendMessage, n as getRawSessionAppendMessage, r as getRawSessionAppendMessageAsync } from "./transcript-rewrite-exk4oVrD.mjs";
import { n as isMidTurnPrecheckAssistantError } from "./midturn-precheck-BtRLC6ta.mjs";
import { t as listActiveProcessSessionReferences } from "./bash-process-references-By_k1Nsh.mjs";
import { h as setSessionToolResultPreparer } from "./settings-manager-D9ggLoN1.mjs";
import { a as takeRuntimeUserTurnTranscriptRecorder, c as withRuntimeUserTurnTranscriptRecorder, i as takeRuntimeUserTurnTranscriptContext, n as attachRuntimeUserTurnTranscriptRecorder, o as withCurrentRuntimeUserTurnTranscriptRecorder } from "./user-turn-transcript-runtime-context-T4-x_GL3.mjs";
import { d as withSessionManagerAppend, l as withSessionCompactionPersistence, u as withSessionCompactionPersistenceAsync } from "./session-manager-Mve5HWCW.mjs";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "./transcript-visibility-DiwthCmj.mjs";
import path from "node:path";
//#region src/agents/embedded-agent-runner/empty-assistant-turn.ts
function hasZeroTokenUsageSnapshot(usage) {
	const fields = asOptionalObjectRecord(usage);
	if (!fields) return false;
	const counts = [
		fields.input,
		fields.output,
		fields.cacheRead,
		fields.cacheWrite,
		fields.total ?? fields.totalTokens ?? fields.total_tokens
	].map(asFiniteNumber);
	return counts.includes(0) && counts.every((count) => count === void 0 || count === 0);
}
function isZeroUsageEmptyStopAssistantTurn(message) {
	return Boolean(message && message.stopReason === "stop" && Array.isArray(message.content) && message.content.length === 0 && hasZeroTokenUsageSnapshot(message.usage));
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
function originalDetailsSizeFields(size) {
	return size.complete ? { originalDetailsBytes: size.bytes } : { originalDetailsBytesAtLeast: size.bytes };
}
function truncatePersistedDetailString(value, maxChars = MAX_PERSISTED_DETAIL_STRING_CHARS) {
	if (value.length <= maxChars) return value;
	return `${truncateUtf16Safe(value, maxChars)}\n\n[OpenClaw persisted detail truncated: ${value.length - maxChars} original chars omitted]`;
}
function copyPersistedSummaryFields(params) {
	for (const key of params.keys) {
		const value = params.source[key];
		if (value !== void 0) params.target[key] = typeof value === "string" ? truncatePersistedDetailString(value, params.maxChars) : value;
	}
}
function sanitizePersistedSessionDetail(value) {
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
		maxChars: 500
	});
	if (typeof src.command === "string") out.command = truncatePersistedDetailString(src.command, 500);
	return out;
}
function copyPersistedResultStateFields(out, src, maxStringChars) {
	for (const key of [
		"disabled",
		"unavailable",
		"success"
	]) if (typeof src[key] === "boolean") out[key] = src[key];
	if (typeof src.error === "string" && src.error) out.error = truncatePersistedDetailString(src.error, maxStringChars);
	else if (src.error) out.error = true;
}
function buildPersistedDetailsFallback(src, originalSize, sanitizedBytes) {
	const fallback = {
		persistedDetailsTruncated: true,
		finalDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize)
	};
	if (sanitizedBytes !== void 0) fallback.sanitizedDetailsBytes = sanitizedBytes;
	if (src) {
		fallback.originalDetailKeys = firstEnumerableOwnKeys(src, 40);
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
			maxChars: MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS
		});
		copyPersistedResultStateFields(fallback, src, MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS);
	}
	return fallback;
}
function enforcePersistedDetailsByteCap(value, originalDetails, originalSize) {
	const sanitizedBytes = jsonUtf8BytesOrInfinity(value);
	if (sanitizedBytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return value;
	const fallback = buildPersistedDetailsFallback(isRecord(originalDetails) ? originalDetails : void 0, originalSize, sanitizedBytes);
	return jsonUtf8BytesOrInfinity(fallback) <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES ? fallback : buildPersistedDetailsFallback(void 0, originalSize, sanitizedBytes);
}
function sanitizeToolResultDetailsForPersistence(details) {
	if (details === void 0 || details === null) return details;
	const originalSize = boundedJsonUtf8Bytes(details, MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES);
	if (originalSize.complete && originalSize.bytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return details;
	const src = asOptionalObjectRecord(details);
	if (!src) return enforcePersistedDetailsByteCap({
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		valueType: typeof details
	}, void 0, originalSize);
	const out = {
		persistedDetailsTruncated: true,
		...originalDetailsSizeFields(originalSize),
		originalDetailKeys: firstEnumerableOwnKeys(src, 40)
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
		maxChars: MAX_PERSISTED_DETAIL_STRING_CHARS
	});
	copyPersistedResultStateFields(out, src, MAX_PERSISTED_DETAIL_STRING_CHARS);
	if (typeof src.tail === "string") out.tail = truncatePersistedDetailString(src.tail, MAX_PERSISTED_DETAIL_STRING_CHARS);
	if (Array.isArray(src.sessions)) {
		out.sessions = src.sessions.slice(0, MAX_PERSISTED_DETAIL_SESSION_COUNT).map((session) => sanitizePersistedSessionDetail(session));
		if (src.sessions.length > MAX_PERSISTED_DETAIL_SESSION_COUNT) out.sessionsTruncated = src.sessions.length - MAX_PERSISTED_DETAIL_SESSION_COUNT;
	}
	return enforcePersistedDetailsByteCap(out, src, originalSize);
}
function capToolResultForPersistence(msg, maxChars) {
	const capped = msg.role === "toolResult" ? truncateToolResultMessage(msg, maxChars) : msg;
	if (capped.role !== "toolResult") return capped;
	const details = capped.details;
	const sanitizedDetails = sanitizeToolResultDetailsForPersistence(details);
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
	return !(message.role === "custom" && "excludeFromContext" in message && message.excludeFromContext === true || message.role === "assistant" && toolCalls.length === 0 && isTranscriptOnlyOpenClawAssistantModel(normalizeOptionalString(message.provider) ?? "", normalizeOptionalString(message.model) ?? "")) && (toolCalls.length === 0 || message.role !== "assistant") || !allowSyntheticToolResults && toolCalls.length > 0;
}
function installSessionToolResultGuard(sessionManager, opts) {
	const originalAppend = getRawSessionAppendMessage(sessionManager);
	const originalAppendWithTranscriptAnchor = sessionManager.appendMessageWithTranscriptAnchor.bind(sessionManager);
	const originalAppendWithTranscriptAnchorAsync = sessionManager.appendMessageWithTranscriptAnchorAsync.bind(sessionManager);
	setRawSessionAppendMessage(sessionManager, originalAppend);
	setRawSessionAppendMessageAsync(sessionManager, getRawSessionAppendMessageAsync(sessionManager));
	const pending = /* @__PURE__ */ new Map();
	let pendingResponseIds = [];
	const persistMessage = (message) => {
		const transformer = opts?.transformMessageForPersistence;
		return transformer ? transformer(message) : message;
	};
	const persistToolResult = (message, meta) => {
		const transformer = opts?.transformToolResultForPersistence;
		return transformer ? transformer(message, meta) : message;
	};
	const allowSyntheticToolResults = opts?.allowSyntheticToolResults ?? true;
	const missingToolResultText = opts?.missingToolResultText;
	const beforeWrite = opts?.beforeMessageWriteHook;
	const toolResultTransformerMayMutate = opts?.transformToolResultForPersistence !== void 0;
	const maxToolResultChars = resolveMaxToolResultChars(opts);
	const transcriptSeqByEntryId = /* @__PURE__ */ new Map();
	let transcriptRunId = opts?.runId;
	let assistantErrorTranscript = opts?.assistantErrorTranscript;
	let nextUserMessagePersistence = opts?.suppressNextUserMessagePersistence ? "suppress" : "normal";
	const appendRequest = (request, append) => withRuntimeUserTurnTranscriptRecorder(request.message, (beforeFreshMessageCommit) => {
		const appendOptions = opts?.config || beforeFreshMessageCommit ? {
			...request.options,
			...opts?.config ? { config: opts.config } : {},
			...beforeFreshMessageCommit ? { beforeFreshMessageCommit } : {}
		} : request.options;
		return append(request.message, appendOptions);
	});
	const runSync = (operation) => {
		let next = operation.next();
		while (!next.done) next = operation.next(appendRequest(next.value, originalAppendWithTranscriptAnchor));
		return next.value;
	};
	const runAsync = async (operation) => {
		let next = operation.next();
		while (!next.done) {
			const request = next.value;
			next = operation.next(await withCurrentRuntimeUserTurnTranscriptRecorder(request.message, () => appendRequest(request, originalAppendWithTranscriptAnchorAsync)));
		}
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
	function* appendMessageAndCacheTranscriptSeq(message, options, acknowledgementSource = message) {
		const assistantSource = readAgentAssistantSource(acknowledgementSource);
		const runOwnedMessage = attachSessionTranscriptRunId(message, transcriptRunId);
		const parentEntryId = sessionManager.getLeafId();
		const originalTarget = sessionManager.getSessionTarget();
		const { entryId, anchor, appended, lifecycleRevision, message: persistedMessage, viewWasSuperseded } = yield {
			message: runOwnedMessage,
			options
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
		if (assistantSource && appended) {
			assistantSource.committedMessageSeq = messageSeq ?? (anchor ? anchor.activeMessagePosition + 1 : null);
			bindAgentAssistantSource(persistedMessage, assistantSource);
		}
		recordPendingReceipt(entryId, persistedMessage, viewWasSuperseded === true);
		if (appended) opts?.onMessagePersisted?.(persistedMessage);
		if (!appended || !sessionTarget) return {
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
	const applyBeforeWriteHook = (msg) => {
		const result = beforeWrite ? beforeWrite({ message: msg }) : void 0;
		if (result?.block) return null;
		return result?.message ? {
			message: result.message,
			changed: true
		} : {
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
				yield* appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(canonical, maxToolResultChars), { invalidateSerializedPrefixCache: persistedSynthetic !== synthetic || toolResultTransformerMayMutate || canonical !== flushed.message || flushed.changed });
			}
		}
		pending.clear();
	}
	const flushPendingToolResults = () => runSync(flushPendingToolResultsOperation());
	const flushPendingToolResultsAsync = () => withSessionManagerAppend(sessionManager, () => runAsync(flushPendingToolResultsOperation()));
	function* guardedAppend(message, callerOptions) {
		const callerInvalidatesCache = callerOptions?.invalidateSerializedPrefixCache === true;
		let nextMessage = message;
		if (message.role === "assistant") {
			if (!Object.isFrozen(message)) Object.assign(message, attachSessionTranscriptRunId(message, transcriptRunId));
			const sanitized = sanitizeToolCallInputs([message], { allowedToolNames: opts?.allowedToolNames });
			if (sanitized.length === 0) {
				if (pending.size > 0) yield* flushPendingToolResultsOperation();
				return;
			}
			nextMessage = sanitized[0];
		}
		if (nextMessage.role === "toolResult") {
			const id = extractToolResultId(nextMessage);
			const toolName = id ? pending.get(id) : void 0;
			const normalizedToolResult = normalizePersistedToolResultName(nextMessage, toolName, id ?? void 0);
			const persistedToolResult = persistMessage(normalizedToolResult);
			const capped = capToolResultForPersistence(persistedToolResult, maxToolResultChars);
			const transformed = persistToolResult(capped, {
				toolCallId: id ?? void 0,
				toolName,
				isSynthetic: false
			});
			const persisted = applyBeforeWriteHook(transformed);
			if (!persisted) return;
			return (yield* appendMessageAndCacheTranscriptSeq(capToolResultForPersistence(persisted.message, maxToolResultChars), { invalidateSerializedPrefixCache: callerInvalidatesCache || persistedToolResult !== normalizedToolResult || toolResultTransformerMayMutate || persisted.changed }, message)).entryId;
		}
		const toolCalls = extractPendingAssistantToolCalls(nextMessage);
		if (pending.size > 0 && clearsPendingToolCalls(nextMessage, toolCalls, allowSyntheticToolResults, pendingResponseIds)) yield* flushPendingToolResultsOperation();
		if (nextMessage.role === "user" && nextUserMessagePersistence === "runtime") {
			nextUserMessagePersistence = "normal";
			Object.assign(nextMessage, {
				provenance: { kind: "internal_system" },
				display: false
			});
		}
		const transformedMessage = persistMessage(nextMessage);
		const finalWrite = applyBeforeWriteHook(transformedMessage);
		if (!finalWrite) {
			if (transformedMessage.role === "user") opts?.onUserMessageBlocked?.(transformedMessage);
			return;
		}
		const finalMessage = finalWrite.message;
		if (finalMessage.role === "assistant" && toolCalls.length === 0 && opts?.suppressTranscriptOnlyAssistantPersistence === true) return;
		if (finalMessage.role === "assistant" && assistantErrorTranscript && finalMessage.stopReason === "error") assistantErrorTranscript.record(message);
		if (finalMessage.role === "user") {
			const suppress = nextUserMessagePersistence === "suppress";
			nextUserMessagePersistence = "normal";
			if (suppress) {
				opts?.onUserMessagePersistenceSuppressed?.(finalMessage);
				return;
			}
		}
		const { anchor, appended, entryId: result, lifecycleRevision, message: persistedMessage, messageSeq, sessionTarget } = yield* appendMessageAndCacheTranscriptSeq(finalMessage, { invalidateSerializedPrefixCache: callerInvalidatesCache || transformedMessage !== nextMessage || finalWrite.changed || finalMessage !== finalWrite.message }, message);
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
		prepareSessionManagerSync("appendMessage", sessionManager.getSessionTarget(), sessionManager);
		return runSync(guardedAppend(message, options));
	});
	sessionManager.appendMessageAsync = (message, options) => withSessionManagerAppend(sessionManager, () => runAsync(guardedAppend(message, options)));
	sessionManager.appendCompaction = guardedAppendCompaction;
	sessionManager.appendCompactionAsync = guardedAppendCompactionAsync;
	return {
		hasPendingToolResults: () => pending.size > 0,
		flushPendingToolResults,
		flushPendingToolResultsAsync,
		clearPendingToolResults: () => pending.clear(),
		setNextUserMessagePersistence: (mode) => {
			nextUserMessagePersistence = mode;
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
function publishPersistedUserEnvelope(runtime, persisted) {
	if (!runtime || runtime === persisted || Object.isFrozen(runtime)) return;
	const content = runtime.content;
	const imageFactIndexes = readPersistedImageBlockFactIndexes(runtime);
	for (const key of Object.keys(runtime)) Reflect.deleteProperty(runtime, key);
	Object.assign(runtime, persisted, { content });
	if (imageFactIndexes) runtime["__openclaw"] = {
		...runtime["__openclaw"],
		mediaImageBlockFactIndexes: imageFactIndexes
	};
}
/**
* Apply the tool-result guard to a SessionManager exactly once and expose
* a flush method on the instance for easy teardown handling.
*/
function guardSessionManager(sessionManager, opts) {
	const guardedSessionManager = sessionManager;
	let transcriptRunId = opts?.runId;
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
	const beforeMessageWrite = (event) => {
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
		const sanitized = sanitizeTranscriptMessage(message);
		if (sanitized !== message) {
			message = sanitized;
			changed = true;
		}
		const projectedMessage = projectAgentHarnessTranscriptMessageForDisplay({
			hidden: opts?.trigger === "memory",
			inputProvenance,
			message
		});
		if (projectedMessage !== message) {
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
				guard.setNextUserMessagePersistence("normal");
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
			publishPersistedUserEnvelope(runtimeMessage, persistence.persistedMessage);
			const recorder = takeRuntimeUserTurnTranscriptRecorder(message);
			recorder?.markRuntimePersisted(persistence.persistedMessage, persistence.anchor, { appended: persistence.appended });
			advanceMessageActionPrompt({
				runId: transcriptRunId,
				agentId: opts?.agentId,
				sessionKey: opts?.sessionKey,
				sessionId: sessionManager.getSessionId(),
				recorder
			});
			await opts?.onUserMessagePersisted?.(persistence.persistedMessage, runtimeMessage);
		},
		onUserMessagePersistenceSuppressed: async (message) => {
			const runtimeMessage = runtimeUserMessageByPersistedMessage.get(message);
			runtimeUserMessageByPersistedMessage.delete(message);
			publishPersistedUserEnvelope(runtimeMessage, takeRuntimeUserTurnTranscriptRecorder(message)?.getPersistedMessage?.() ?? preparedUserTurnTranscriptRecorder?.getPersistedMessage?.() ?? message);
			await opts?.onUserMessagePersistenceSuppressed?.(message, runtimeMessage);
		},
		onUserMessageBlocked: opts?.onUserMessageBlocked
	});
	setSessionToolResultPreparer(guardedSessionManager, { cap: (message) => truncateToolResultMessage(message, maxToolResultChars) });
	guardedSessionManager.hasPendingToolResults = guard.hasPendingToolResults;
	guardedSessionManager.flushPendingToolResults = guard.flushPendingToolResults;
	guardedSessionManager.flushPendingToolResultsAsync = guard.flushPendingToolResultsAsync;
	guardedSessionManager.clearPendingToolResults = guard.clearPendingToolResults;
	guardedSessionManager.setNextUserMessagePersistence = guard.setNextUserMessagePersistence;
	guardedSessionManager.setTranscriptRunContext = (runId, prepare, skipHooks, errors, provenance, suppressUserPersistence, preparedUserTurn) => {
		transcriptRunId = runId;
		guard.setTranscriptRunId(runId, errors);
		guard.setNextUserMessagePersistence(suppressUserPersistence ? "suppress" : "normal");
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
//#region src/agents/runtime-execution-facts.ts
async function buildApprovedExecutablesRuntimeContext(agentId, includeEmptySnapshots) {
	const header = "## Approved executables";
	try {
		const { allowlist } = resolveExecApprovalsFromFileInternal({
			file: await loadExecApprovalsReadOnlyAsync(),
			agentId
		});
		const hints = allowlist.flatMap((entry) => {
			const pattern = entry.pattern.trim();
			if (pattern.startsWith("=command:") || !/[\\/~]/.test(pattern)) return [];
			const name = path.win32.isAbsolute(pattern) ? pattern : path.win32.basename(pattern).replace(/\.exe$/i, "");
			if (!name || name.length > 256 || sanitizeForPromptLiteral(name) !== name) return [];
			return [`  ${name} ${entry.argPattern ? "(restricted args)" : "(any arguments)"}`];
		}).toSorted().slice(0, 10);
		if (!hints.length && !includeEmptySnapshots) return;
		return [
			header,
			hints.length ? "Pre-approved executables (exact arguments are enforced at runtime; no approval prompt needed when args match):" : "none",
			...hints
		].join("\n");
	} catch {
		return `${header}\nunavailable`;
	}
}
async function buildExecutionHostRuntimeFacts(params) {
	const sections = [];
	const includeEmptySnapshots = params.includeEmptySnapshots === true;
	if (process.platform === "win32" && params.capabilityToolNames.has("exec")) {
		const approved = await buildApprovedExecutablesRuntimeContext(params.agentId, includeEmptySnapshots);
		if (approved) sections.push(approved);
	}
	if (params.capabilityToolNames.has("process")) {
		const sessions = listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey(params) }).toSorted((a, b) => a.sessionId < b.sessionId ? -1 : a.sessionId > b.sessionId ? 1 : 0).map((session) => {
			const pid = typeof session.pid === "number" ? ` pid=${session.pid}` : "";
			const cwd = session.cwd ? ` cwd=${truncateUtf16Safe(sanitizeForPromptLiteral(session.cwd), 256)}` : "";
			return `- ${session.sessionId} ${session.status}${pid}${cwd} :: ${sanitizeForPromptLiteral(session.name)}`;
		});
		if (sessions.length || includeEmptySnapshots) sections.push(`Active exec sessions:\n${sessions.join("\n") || "none"}`);
	}
	return sections.map((text) => ({
		kind: "conversation-data",
		text
	}));
}
//#endregion
export { guardSessionManager as n, isZeroUsageEmptyStopAssistantTurn as r, buildExecutionHostRuntimeFacts as t };
