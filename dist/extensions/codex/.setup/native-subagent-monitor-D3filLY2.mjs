import { C as readCodexNativeSubagentHistoryOwner, S as matchesCodexNativeSubagentHistoryOwner, y as assertHistoryOwnerMatchesRegistration } from "./session-binding-record-BGoz8wOK.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { D as readNullableString$1, S as readItem, a as isNonSuccessItemStatus, c as itemName, d as matchesCodexSnapshotTurn, h as unknownItemStatus, i as isMutatingNativeToolItem, l as itemStatus, m as shouldSynthesizeToolProgressForItem, n as auditNativeToolTerminalStatus, o as isSideEffectingNativeToolItem, p as shouldRecordNativeToolTranscript, s as itemKind, u as itemTitle, x as readHookOutputEntries } from "./event-projector-items-C6L_5ZiT.mjs";
import { t as attachCodexMirrorIdentity } from "./upstream-prompt-provenance-LphB8slG.mjs";
import { t as readCodexMirroredSessionHistoryMessages } from "./session-history-BrqhSCf9.mjs";
import { I as hasCodexAppServerLiveThread, M as claimCodexAppServerLiveThread, W as retainCodexAppServerLiveThread } from "./shared-client-DA4VR4Eb.mjs";
import { t as resolveCodexLocalRuntimeAttribution } from "./local-runtime-attribution-B_2mnqhb.mjs";
import { A as formatToolSummary, C as sanitizeCodexToolArguments, D as ToolOutputAccumulator, E as TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS, M as readCodexResponseOutput, N as toolOutputRawEchoSignature, O as collectDynamicToolContentText, P as truncateToolTranscriptText, S as resolveCodexToolProgressDetailMode, _ as readCodeModeNativePatchInput, a as readCodexNativeSubagentRunId, c as isCommandBearingToolItem, d as itemOutputText, f as itemToolArgs, g as projectCodexToolActivity, h as itemTranscriptResultText, i as codexNativeSubagentRunId, j as normalizeToolTranscriptArguments, k as formatToolOutput, l as isNativePostToolUseRelayItem, m as itemToolResult, n as CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX, o as readNativeSubagentThreadIds, p as itemToolError, r as CODEX_NATIVE_SUBAGENT_TASK_KIND, s as readNativeTaskAssignment, t as CODEX_NATIVE_SUBAGENT_RUNTIME, u as itemMeta, v as readInterceptedNativePatchInput, x as isCodexCommandBearingToolCall, y as shouldSuppressChannelProgressForItem } from "./native-subagent-task-ids-wb8CKZGN.mjs";
import { n as codexApprovalTimeoutText } from "./plugin-approval-roundtrip-C0MZzCuP.mjs";
import { asFiniteNumber, normalizeOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { asDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import path from "node:path";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { TOOL_PROGRESS_OUTPUT_MAX_CHARS, embeddedAgentLog, emitAgentEvent, formatErrorMessage, inferToolMetaFromArgs, projectAgentActivityItem, runAgentHarnessAfterToolCallHook } from "openclaw/plugin-sdk/agent-harness-runtime";
import { createAgentHarnessTaskRuntime, deliverAgentHarnessTaskCompletion, isDurableAgentHarnessCompletionDelivery } from "openclaw/plugin-sdk/agent-harness-task-runtime";
//#region extensions/codex/src/app-server/event-projector-tool-progress.ts
const TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES = /* @__PURE__ */ new Set([
	"message",
	"messages",
	"reply",
	"send",
	"reaction",
	"react",
	"typing"
]);
function shouldEmitTranscriptToolProgress(toolName) {
	const normalized = typeof toolName === "string" ? toolName.trim().toLowerCase() : "";
	return Boolean(normalized && !TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES.has(normalized));
}
var CodexToolProgressProjection = class {
	constructor(params) {
		this.params = params;
		this.echoesByItem = /* @__PURE__ */ new Map();
		this.resultSummaryItemIds = /* @__PURE__ */ new Set();
		this.resultOutputItemIds = /* @__PURE__ */ new Set();
		this.resultOutputStreamedItemIds = /* @__PURE__ */ new Set();
		this.transcriptProgressSuppressedIds = /* @__PURE__ */ new Set();
		this.resultOutputDeltaState = /* @__PURE__ */ new Map();
		this.output = new ToolOutputAccumulator();
		this.metas = /* @__PURE__ */ new Map();
		this.sideEffectingNativeIds = /* @__PURE__ */ new Set();
		this.sideEffectingDynamicIds = /* @__PURE__ */ new Set();
		this.transcriptProgressCallIds = /* @__PURE__ */ new Set();
		this.approvalTimeoutKinds = /* @__PURE__ */ new Map();
	}
	get outputTextByItem() {
		return this.output.textByItem;
	}
	isOutputTruncated(itemId) {
		return this.output.isTruncated(itemId);
	}
	get toolMetas() {
		return [...this.metas.values()];
	}
	getToolMeta(itemId) {
		return this.metas.get(itemId);
	}
	get lastToolError() {
		return this.lastNativeToolError;
	}
	get hasPotentialSideEffects() {
		return this.sideEffectingNativeIds.size > 0 || this.sideEffectingDynamicIds.size > 0;
	}
	approvalTimeoutExplanation(itemId, status) {
		const kind = isNonSuccessItemStatus(status) && this.approvalTimeoutKinds.get(itemId);
		return kind ? codexApprovalTimeoutText(kind) : void 0;
	}
	setLastToolError(error) {
		if (!error) {
			this.lastNativeToolError = void 0;
			return;
		}
		const terminalResolution = this.params.observeToolTerminal?.({
			toolName: error.toolName,
			...error.meta ? { meta: error.meta } : {},
			outcome: "failure",
			failure: {
				...error.errorCode ? { errorCode: error.errorCode } : {},
				...error.error ? { error: error.error } : {},
				...error.validationErrorSummary ? { validationErrorSummary: error.validationErrorSummary } : {},
				...error.timedOut ? { timedOut: true } : {},
				...error.middlewareError ? { middlewareError: true } : {}
			},
			nativeMutation: {
				mutatingAction: error.mutatingAction === true,
				replaySafe: error.mutatingAction !== true
			}
		});
		this.lastNativeToolError = terminalResolution?.lastToolError ?? (this.lastNativeToolError?.mutatingAction && error.mutatingAction !== true ? this.lastNativeToolError : error);
	}
	recordDynamicToolResult(params) {
		const resultText = collectDynamicToolContentText(params.contentItems);
		const existing = this.metas.get(params.callId);
		this.metas.set(params.callId, {
			toolName: existing?.toolName ?? params.tool,
			...existing?.meta ? { meta: existing.meta } : {},
			...params.asyncStarted === true ? { asyncStarted: true } : {},
			isError: !params.success
		});
		if (params.terminalResolution) this.lastNativeToolError = params.terminalResolution.lastToolError;
		else if (!params.success) this.lastNativeToolError = {
			toolName: params.tool,
			error: resultText || (params.terminalType === "blocked" ? "codex dynamic tool blocked" : "codex dynamic tool failed")
		};
		else if (this.lastNativeToolError?.mutatingAction !== true) this.lastNativeToolError = void 0;
		if (params.sideEffectEvidence === true) this.sideEffectingDynamicIds.add(params.callId);
	}
	handleOutputDelta(params, toolName) {
		const itemId = readStringField(params, "itemId");
		const delta = readStringField(params, "delta");
		if (!itemId || !delta) return;
		const storedOutput = this.output.append(itemId, delta);
		this.rememberEcho(itemId, {
			displayText: storedOutput.text,
			rawLength: storedOutput.normalizedLength,
			rawPrefix: storedOutput.rawPrefix,
			streamedDisplay: true
		});
		if (!this.shouldEmitToolOutput()) return;
		if (this.transcriptProgressSuppressedIds.has(itemId) || !shouldEmitTranscriptToolProgress(toolName)) return;
		const state = this.resultOutputDeltaState.get(itemId) ?? {
			chars: 0,
			messages: 0,
			truncated: false
		};
		if (state.truncated) return;
		const remainingChars = Math.max(0, TOOL_PROGRESS_OUTPUT_MAX_CHARS - state.chars);
		const chunk = delta.length > remainingChars ? truncateUtf16Safe(delta, remainingChars) : delta;
		state.chars += chunk.length;
		state.messages += 1;
		const reachedLimit = delta.length > remainingChars || state.chars >= TOOL_PROGRESS_OUTPUT_MAX_CHARS || state.messages >= 20;
		if (reachedLimit) state.truncated = true;
		this.resultOutputDeltaState.set(itemId, state);
		this.resultOutputStreamedItemIds.add(itemId);
		this.emitToolResultMessage({
			itemId,
			text: formatToolOutput(toolName, void 0, reachedLimit ? `${chunk}\n...(truncated)...` : chunk)
		});
	}
	recordNativeToolError(params) {
		const executionStarted = params.status !== "blocked";
		const mutatingAction = executionStarted && isMutatingNativeToolItem(params.item);
		const isFailure = isNonSuccessItemStatus(params.status);
		const approvalTimeoutExplanation = this.approvalTimeoutExplanation(params.item.id, params.status);
		const error = isFailure ? approvalTimeoutExplanation ?? itemToolError(params.item, params.status, this.output.textByItem) : void 0;
		const failure = error ? {
			...approvalTimeoutExplanation ? { errorCode: "approval_timeout" } : {},
			error,
			...approvalTimeoutExplanation ? { timedOut: true } : {}
		} : {};
		const terminalResolution = this.params.observeToolTerminal?.({
			toolCallId: params.item.id,
			toolName: params.name,
			arguments: itemToolArgs(params.item),
			...params.meta ? { meta: params.meta } : {},
			executionStarted,
			outcome: isFailure ? "failure" : "success",
			...isFailure ? { failure } : {},
			nativeMutation: {
				mutatingAction,
				replaySafe: !mutatingAction
			}
		});
		if (terminalResolution) {
			this.lastNativeToolError = terminalResolution.lastToolError;
			return;
		}
		if (isFailure) this.lastNativeToolError = {
			toolName: params.name,
			...params.meta ? { meta: params.meta } : {},
			...failure,
			...mutatingAction ? { mutatingAction: true } : {}
		};
		else if (this.lastNativeToolError?.mutatingAction !== true) this.lastNativeToolError = void 0;
	}
	emitToolResultSummary(item) {
		if (!item || item.type === "dynamicToolCall") return;
		if (!this.params.onToolResult || !this.shouldEmitToolResult()) return;
		if (this.resultSummaryItemIds.has(item.id)) return;
		const toolName = itemName(item);
		const args = itemToolArgs(item);
		if (!toolName || !shouldEmitTranscriptToolProgress(toolName)) return;
		this.resultSummaryItemIds.add(item.id);
		const meta = this.shouldIncludeFormattedMeta(isCommandBearingToolItem(item, args)) ? itemMeta(item, this.toolProgressDetailMode()) : void 0;
		this.emitToolResultMessage({
			itemId: item.id,
			text: formatToolSummary(toolName, meta)
		});
	}
	emitToolResultOutput(item) {
		if (!item || item.type === "dynamicToolCall") return;
		if (!this.params.onToolResult || !this.shouldEmitToolOutput()) return;
		if (this.resultOutputItemIds.has(item.id) || this.resultOutputStreamedItemIds.has(item.id)) return;
		const toolName = itemName(item);
		const output = itemOutputText(item, this.output.textByItem);
		if (!toolName || !output || !shouldEmitTranscriptToolProgress(toolName)) return;
		const meta = this.shouldIncludeFormattedMeta(isCommandBearingToolItem(item, itemToolArgs(item))) ? itemMeta(item, this.toolProgressDetailMode()) : void 0;
		this.emitToolResultMessage({
			itemId: item.id,
			text: formatToolOutput(toolName, meta, output),
			finalOutput: true,
			isError: isNonSuccessItemStatus(itemStatus(item))
		});
	}
	recordToolMeta(item) {
		if (!item) return;
		if (isSideEffectingNativeToolItem(item)) this.sideEffectingNativeIds.add(item.id);
		else this.sideEffectingNativeIds.delete(item.id);
		const toolName = itemName(item);
		if (!toolName) return;
		const meta = itemMeta(item, this.toolProgressDetailMode());
		const existing = this.metas.get(item.id);
		const terminalStatus = auditNativeToolTerminalStatus(item);
		const isError = typeof existing?.isError === "boolean" ? existing.isError : terminalStatus === "completed" ? false : terminalStatus === "failed" || terminalStatus === "blocked" ? true : void 0;
		this.metas.set(item.id, {
			toolName,
			...meta ? { meta } : {},
			...existing?.asyncStarted ? { asyncStarted: true } : {},
			...isError === void 0 ? {} : { isError }
		});
	}
	recordTranscriptCall(params) {
		if (!shouldEmitTranscriptToolProgress(params.name)) this.transcriptProgressSuppressedIds.add(params.id);
		else this.transcriptProgressSuppressedIds.delete(params.id);
		this.emitTranscriptToolCallProgress(params);
	}
	recordTranscriptResult(params) {
		this.emitTranscriptToolResultProgress(params);
	}
	matchesEcho(text) {
		for (const state of this.echoesByItem.values()) {
			if (state.streamedDisplayText === text || state.displayTexts.includes(text)) return true;
			if (state.streamedRawSignature && text.length === state.streamedRawSignature.length && text.startsWith(state.streamedRawSignature.prefix)) return true;
			for (const signature of state.rawSignatures) if (text.length === signature.length && text.startsWith(signature.prefix)) return true;
		}
		return false;
	}
	rememberCommandAggregateOutputEcho(item) {
		if (item?.type !== "commandExecution" || typeof item.aggregatedOutput !== "string") return;
		const signature = toolOutputRawEchoSignature(item.aggregatedOutput);
		if (signature) this.rememberEcho(item.id, signature);
	}
	toolProgressDetailMode() {
		return resolveCodexToolProgressDetailMode(this.params.toolProgressDetail);
	}
	emitToolResultMessage(params) {
		const rawText = params.text.trim();
		const text = truncateToolTranscriptText(rawText);
		if (!text) return;
		this.rememberEcho(params.itemId, {
			displayText: text,
			rawText
		});
		if (params.finalOutput) this.resultOutputItemIds.add(params.itemId);
		try {
			Promise.resolve(this.params.onToolResult?.({
				text,
				...(this.params.messageChannel || this.params.messageProvider) && { channelData: { openclawToolProgressId: `tool:${params.itemId}` } },
				...params.isError === true ? { isError: true } : {}
			})).catch(() => {});
		} catch {}
	}
	shouldEmitToolResult() {
		return typeof this.params.shouldEmitToolResult === "function" ? this.params.shouldEmitToolResult() : this.params.verboseLevel === "on" || this.params.verboseLevel === "full";
	}
	shouldEmitToolOutput() {
		return typeof this.params.shouldEmitToolOutput === "function" ? this.params.shouldEmitToolOutput() : this.params.verboseLevel === "full";
	}
	shouldIncludeFormattedMeta(commandBearing) {
		const channel = this.params.messageChannel ?? this.params.messageProvider;
		return !commandBearing || !channel && this.shouldEmitToolOutput();
	}
	emitTranscriptToolCallProgress(params) {
		if (params.name === "progress_card" || !shouldEmitTranscriptToolProgress(params.name)) return;
		this.transcriptProgressCallIds.add(params.id);
		const args = normalizeToolTranscriptArguments(params.arguments);
		const meta = this.shouldIncludeFormattedMeta(isCodexCommandBearingToolCall(params.name, args)) ? inferToolMetaFromArgs(params.name, args, { detailMode: this.toolProgressDetailMode() }) : void 0;
		if (!this.params.onToolResult || !this.shouldEmitToolResult() || this.resultSummaryItemIds.has(params.id) || this.resultOutputStreamedItemIds.has(params.id)) return;
		this.resultSummaryItemIds.add(params.id);
		this.emitToolResultMessage({
			itemId: params.id,
			text: formatToolSummary(params.name, meta)
		});
	}
	emitTranscriptToolResultProgress(params) {
		if (params.name === "progress_card" && !params.isError || this.transcriptProgressSuppressedIds.has(params.id) || !shouldEmitTranscriptToolProgress(params.name)) return;
		if (params.name === "progress_card" && this.shouldEmitToolResult()) this.emitToolResultMessage({
			itemId: params.id,
			text: formatToolSummary(params.name),
			isError: true
		});
		if (!this.transcriptProgressCallIds.has(params.id)) this.emitTranscriptToolCallProgress({
			id: params.id,
			name: params.name,
			arguments: {}
		});
		if (!this.params.onToolResult || !this.shouldEmitToolOutput() || this.resultOutputItemIds.has(params.id) || this.resultOutputStreamedItemIds.has(params.id)) return;
		const text = params.text?.trim();
		if (text) this.emitToolResultMessage({
			itemId: params.id,
			text: formatToolOutput(params.name, void 0, text),
			finalOutput: true,
			isError: params.isError
		});
	}
	rememberEcho(itemId, signature) {
		if (!itemId) return;
		const existing = this.echoesByItem.get(itemId) ?? {
			displayTexts: [],
			rawSignatures: []
		};
		const displayText = signature.displayText?.trim();
		if (displayText) {
			if (signature.streamedDisplay) existing.streamedDisplayText = displayText;
			else if (!existing.displayTexts.includes(displayText)) {
				if (existing.displayTexts.length >= 24) existing.displayTexts.shift();
				existing.displayTexts.push(displayText);
			}
		}
		const rawText = signature.rawText?.trim();
		const rawLength = signature.rawLength ?? rawText?.length;
		const rawPrefix = signature.rawPrefix?.trim() ?? rawText;
		if (rawLength !== void 0 && rawPrefix && rawPrefix.length >= 1024) {
			const next = {
				length: rawLength,
				prefix: rawPrefix.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS)
			};
			if (signature.streamedDisplay) existing.streamedRawSignature = next;
			else {
				const matchIndex = existing.rawSignatures.findIndex((entry) => entry.prefix === next.prefix);
				if (matchIndex >= 0) existing.rawSignatures[matchIndex] = next;
				else {
					if (existing.rawSignatures.length >= 24) existing.rawSignatures.shift();
					existing.rawSignatures.push(next);
				}
			}
		}
		this.echoesByItem.set(itemId, existing);
	}
};
//#endregion
//#region extensions/codex/src/app-server/event-projector-tool-transcript.ts
const ZERO_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
const MISSING_TOOL_RESULT_ERROR = "OpenClaw recorded a native Codex tool.call without a matching tool.result before the turn completed.";
const NATIVE_PATCH_REJECTION_RE = /^\s*patch rejected:\s*writing outside of the project;\s*rejected by user approval settings\s*$/iu;
const CODE_MODE_RESULT_RE = /^\s*Script (completed|failed)\s*\r?\nWall time\s+\d+(?:\.\d+)?\s+seconds\s*\r?\nOutput:\s*([\s\S]*?)\s*$/iu;
const MAX_TOOL_APPROVAL_REVIEWS = 16;
function toolApprovalReviewOutcome(state) {
	return state.denied ? "denied" : state.unresolvedReviewIds === null || state.unresolvedReviewIds.size > 0 ? "reviewing" : "approved";
}
var CodexToolTranscriptProjection = class {
	constructor(params, threadId, turnId, progress, nextTranscriptTimestamp, options = {}) {
		this.params = params;
		this.threadId = threadId;
		this.turnId = turnId;
		this.progress = progress;
		this.nextTranscriptTimestamp = nextTranscriptTimestamp;
		this.options = options;
		this.messages = [];
		this.callIds = /* @__PURE__ */ new Set();
		this.resultIds = /* @__PURE__ */ new Set();
		this.namesById = /* @__PURE__ */ new Map();
		this.trajectoryCallIds = /* @__PURE__ */ new Set();
		this.trajectoryResultIds = /* @__PURE__ */ new Set();
		this.trajectoryNamesById = /* @__PURE__ */ new Map();
		this.trajectoryItemsById = /* @__PURE__ */ new Map();
		this.afterToolCallObservedItemIds = /* @__PURE__ */ new Set();
		this.nativeMcpAppResultDetails = /* @__PURE__ */ new Map();
		this.nativeMcpAppResultDetailsAttempted = /* @__PURE__ */ new Set();
		this.approvalReviewsByCallId = /* @__PURE__ */ new Map();
		this.rawNativeToolOutputByCallId = /* @__PURE__ */ new Map();
		this.pendingRawOutputIds = /* @__PURE__ */ new Set();
		this.rawCallsById = /* @__PURE__ */ new Map();
		this.codeModeNativePatchInputsByCallId = /* @__PURE__ */ new Map();
	}
	get transcriptMessages() {
		return this.messages;
	}
	recordToolApprovalReview(toolCallId, reviewId, status, review) {
		const state = this.approvalReviewsByCallId.get(toolCallId) ?? {
			reviews: [],
			denied: false,
			unresolvedReviewIds: /* @__PURE__ */ new Set()
		};
		state.reviews = [...state.reviews.filter((candidate) => candidate.id !== reviewId), review].slice(-16);
		state.denied ||= [
			"denied",
			"timed_out",
			"aborted"
		].includes(status);
		const unresolved = state.unresolvedReviewIds;
		if (status === "in_progress") state.unresolvedReviewIds = unresolved && (unresolved.size < MAX_TOOL_APPROVAL_REVIEWS || unresolved.has(reviewId)) ? unresolved.add(reviewId) : null;
		else unresolved?.delete(reviewId);
		this.approvalReviewsByCallId.set(toolCallId, state);
		return toolApprovalReviewOutcome(state);
	}
	finalizeToolApprovalReviews(toolCallId) {
		const state = this.approvalReviewsByCallId.get(toolCallId);
		if (!state) return;
		state.unresolvedReviewIds = /* @__PURE__ */ new Set();
		return toolApprovalReviewOutcome(state);
	}
	recordDynamicToolCall(params) {
		this.recordToolCall({
			id: params.callId,
			name: params.tool,
			arguments: sanitizeCodexToolArguments(params.arguments)
		});
	}
	recordDynamicToolResult(params, resultContentSource) {
		this.recordToolResult({
			id: params.callId,
			name: params.tool,
			text: collectDynamicToolContentText(params.contentItems),
			isError: !params.success,
			details: params.details,
			...resultContentSource ? { resultContentSource } : {}
		});
	}
	recordNativeToolCall(item) {
		if (!item || !shouldRecordNativeToolTranscript(item)) return;
		const name = itemName(item);
		if (name) this.recordToolCall({
			id: item.id,
			name,
			arguments: itemToolArgs(item)
		});
	}
	recordNativeToolResult(item, details) {
		if (!item || !shouldRecordNativeToolTranscript(item) || this.resultIds.has(item.id)) return;
		const name = itemName(item);
		if (name) {
			const status = itemStatus(item);
			const approvalTimeoutExplanation = this.progress.approvalTimeoutExplanation(item.id, status);
			this.recordToolResult({
				id: item.id,
				name,
				text: approvalTimeoutExplanation ?? this.rawNativeToolOutputByCallId.get(item.id) ?? itemTranscriptResultText(item, this.progress.outputTextByItem),
				isError: isNonSuccessItemStatus(status),
				...item.type === "commandExecution" && item.aggregatedOutput == null && this.progress.isOutputTruncated(item.id) ? { captureTruncated: true } : {},
				details,
				...item.type === "webSearch" ? { resultContentSource: "network" } : {}
			});
			this.progress.approvalTimeoutKinds.delete(item.id);
		}
	}
	recordRawNativeToolItem(item) {
		const type = typeof item.type === "string" ? item.type : void 0;
		const callId = typeof item.call_id === "string" ? item.call_id : typeof item.callId === "string" ? item.callId : void 0;
		if (!callId) return;
		if ((type === "custom_tool_call" || type === "function_call") && typeof item.name === "string") {
			this.rawCallsById.set(callId, {
				id: callId,
				name: item.name,
				arguments: type === "custom_tool_call" ? { input: item.input } : { arguments: item.arguments }
			});
			this.pendingRawOutputIds.add(callId);
		}
		if ((type === "custom_tool_call" || type === "function_call") && (item.name === "apply_patch" || item.name === "exec_command" || item.name === "exec")) {
			let args;
			if (type === "custom_tool_call" && item.name === "apply_patch" && typeof item.input === "string") args = { input: item.input };
			else if (type === "custom_tool_call" && item.name === "exec") {
				const input = readCodeModeNativePatchInput(item.input);
				if (input) this.codeModeNativePatchInputsByCallId.set(callId, input);
				return;
			} else if (type === "function_call" && typeof item.arguments === "string") try {
				const parsed = JSON.parse(item.arguments);
				if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
					const parsedArguments = parsed;
					if (item.name === "apply_patch") args = parsedArguments;
					else {
						const command = typeof parsedArguments.cmd === "string" ? parsedArguments.cmd : typeof parsedArguments.command === "string" ? parsedArguments.command : void 0;
						const patch = readInterceptedNativePatchInput(command);
						if (patch) {
							const workdir = typeof parsedArguments.workdir === "string" ? parsedArguments.workdir : typeof parsedArguments.cwd === "string" ? parsedArguments.cwd : void 0;
							const cwd = patch.cwd ? workdir && !path.isAbsolute(patch.cwd) ? path.join(workdir, patch.cwd) : patch.cwd : workdir;
							args = {
								input: patch.input,
								...cwd ? { cwd } : {}
							};
						}
					}
				}
			} catch {
				return;
			}
			if (args) {
				this.pendingRawOutputIds.add(callId);
				this.recordToolCall({
					id: callId,
					name: "apply_patch",
					arguments: args
				});
			}
			return;
		}
		if (type !== "custom_tool_call_output" && type !== "function_call_output") return;
		this.pendingRawOutputIds.delete(callId);
		const text = readCodexResponseOutput(item);
		if (text === void 0) return;
		this.rawNativeToolOutputByCallId.set(callId, text);
		const rawCall = this.rawCallsById.get(callId);
		const responseText = typeof item.output === "string" ? item.output : collectDynamicToolContentText(item.output);
		const execution = rawCall?.name === "exec" ? CODE_MODE_RESULT_RE.exec(responseText) : null;
		const codeModePatchInput = this.codeModeNativePatchInputsByCallId.get(callId);
		if (codeModePatchInput) {
			this.codeModeNativePatchInputsByCallId.delete(callId);
			if (execution?.[1]?.toLowerCase() === "failed") {
				const failure = execution[2]?.replace(/^Script error:\s*/iu, "").trim() || text;
				this.recordToolCall({
					id: callId,
					name: "apply_patch",
					arguments: { input: codeModePatchInput }
				});
				this.recordToolResult({
					id: callId,
					name: "apply_patch",
					text: failure,
					isError: true
				});
				return;
			}
		}
		const result = this.messages.find((message) => message.role === "toolResult" && message.toolCallId === callId);
		if (!result) {
			if (!this.callIds.has(callId) && rawCall) {
				this.recordToolCall(rawCall);
				this.recordToolResult({
					id: callId,
					name: rawCall.name,
					text,
					isError: execution?.[1]?.toLowerCase() === "failed",
					...!execution ? { outcomeUnknown: true } : {}
				});
			} else if (this.namesById.get(callId) === "apply_patch" && NATIVE_PATCH_REJECTION_RE.test(text)) this.recordToolResult({
				id: callId,
				name: "apply_patch",
				text,
				isError: true
			});
			return;
		}
		result.content = this.createToolResultMessage({
			id: callId,
			name: result.toolName,
			text,
			isError: result.isError
		}).content;
		const metadata = Reflect.get(result, "__openclaw");
		Reflect.set(result, "__openclaw", {
			...isJsonObject(metadata) ? metadata : {},
			toolOutput: {
				source: "provider-response",
				modelInput: "unverified"
			}
		});
	}
	async prepareNativeToolResultDetails(item) {
		const preparedDetails = await this.prepareNativeMcpAppResultDetails(item);
		const approvalReviewState = item ? this.approvalReviewsByCallId.get(item.id) : void 0;
		const reviewDetails = approvalReviewState ? {
			approvalReviews: approvalReviewState.reviews,
			approvalReviewOutcome: toolApprovalReviewOutcome(approvalReviewState)
		} : void 0;
		return reviewDetails ? isJsonObject(preparedDetails) ? {
			...preparedDetails,
			...reviewDetails
		} : {
			...preparedDetails !== void 0 ? { toolDetails: preparedDetails } : {},
			...reviewDetails
		} : preparedDetails;
	}
	async prepareNativeMcpAppResultDetails(item) {
		if (!item || item.type !== "mcpToolCall" || itemStatus(item) === "running") return;
		if (this.nativeMcpAppResultDetails.has(item.id)) return this.nativeMcpAppResultDetails.get(item.id);
		if (this.nativeMcpAppResultDetailsAttempted.has(item.id) || !this.options.prepareNativeMcpAppResultDetails) return;
		this.nativeMcpAppResultDetailsAttempted.add(item.id);
		try {
			const details = await this.options.prepareNativeMcpAppResultDetails(item);
			if (details !== void 0) this.nativeMcpAppResultDetails.set(item.id, details);
			return details;
		} catch (error) {
			embeddedAgentLog.debug("codex native MCP App preview preparation failed", {
				itemId: item.id,
				error
			});
			return;
		}
	}
	recordTrajectoryEvent(params) {
		if (params.phase === "start") {
			this.trajectoryCallIds.add(params.item.id);
			this.trajectoryNamesById.set(params.item.id, params.name);
			this.trajectoryItemsById.set(params.item.id, params.item);
			this.options.trajectoryRecorder?.recordEvent("tool.call", {
				threadId: this.threadId,
				turnId: this.turnId,
				itemId: params.item.id,
				toolCallId: params.item.id,
				name: params.name,
				arguments: params.args
			});
			return;
		}
		this.trajectoryResultIds.add(params.item.id);
		const toolResult = itemToolResult(params.item).result;
		const output = this.progress.approvalTimeoutExplanation(params.item.id, params.status) ?? itemOutputText(params.item, this.progress.outputTextByItem);
		this.options.trajectoryRecorder?.recordEvent("tool.result", {
			threadId: this.threadId,
			turnId: this.turnId,
			itemId: params.item.id,
			toolCallId: params.item.id,
			name: params.name,
			status: params.status,
			isError: isNonSuccessItemStatus(params.status),
			...toolResult ? { result: toolResult } : {},
			...output ? { output } : {}
		});
	}
	emitAfterToolCallObservation(item) {
		if (!this.shouldEmitAfterToolCallObservation(item)) return;
		const name = itemName(item);
		const status = itemStatus(item);
		if (!name || status === "running") return;
		this.afterToolCallObservedItemIds.add(item.id);
		const result = itemToolResult(item).result;
		const error = this.progress.approvalTimeoutExplanation(item.id, status) ?? itemToolError(item, status, this.progress.outputTextByItem);
		const startedAt = resolveStartedAtFromDurationMs(item.durationMs);
		const hookParams = {
			toolName: name,
			toolCallId: item.id,
			runId: this.params.runId,
			agentId: this.params.agentId,
			sessionId: this.params.sessionId,
			sessionKey: this.params.sessionKey,
			startArgs: itemToolArgs(item) ?? {},
			...result !== void 0 ? { result } : {},
			...error ? { error } : {},
			...startedAt !== void 0 ? { startedAt } : {}
		};
		setImmediate(() => {
			runAgentHarnessAfterToolCallHook(hookParams);
		});
	}
	synthesizeMissingToolResults(params) {
		if (!params.synthesize) return;
		const missingTranscriptIds = [...this.callIds].filter((id) => !this.resultIds.has(id));
		const missingTrajectoryIds = [...this.trajectoryCallIds].filter((id) => !this.trajectoryResultIds.has(id));
		if (missingTranscriptIds.length === 0 && missingTrajectoryIds.length === 0) return;
		for (const id of missingTranscriptIds) {
			const name = this.namesById.get(id) ?? this.trajectoryNamesById.get(id);
			if (name) this.recordToolResult({
				id,
				name,
				text: formatMissingToolResultError({
					id,
					name
				}),
				isError: true,
				details: { reason: "missing_tool_result" }
			});
		}
		for (const id of missingTrajectoryIds) {
			const name = this.trajectoryNamesById.get(id) ?? this.namesById.get(id);
			if (!name) continue;
			this.trajectoryResultIds.add(id);
			const text = formatMissingToolResultError({
				id,
				name
			});
			this.options.trajectoryRecorder?.recordEvent("tool.result", {
				threadId: this.threadId,
				turnId: this.turnId,
				itemId: id,
				toolCallId: id,
				name,
				status: "failed",
				isError: true,
				result: {
					status: "failed",
					reason: "missing_tool_result"
				},
				output: text
			});
		}
		if (params.terminalDisposition === "tool_error") {
			this.recordMissingToolError(missingTranscriptIds, missingTrajectoryIds);
			return;
		}
		if (params.terminalDisposition === "diagnostic_only") return;
		const missingCount = (/* @__PURE__ */ new Set([...missingTranscriptIds, ...missingTrajectoryIds])).size;
		return missingCount === 1 ? MISSING_TOOL_RESULT_ERROR : `${MISSING_TOOL_RESULT_ERROR} missingToolResultCount=${missingCount}`;
	}
	async readMirroredSessionMessages(signal) {
		return await readCodexMirroredSessionHistoryMessages({
			agentId: this.params.agentId,
			sessionFile: this.params.sessionFile,
			sessionId: this.params.sessionId,
			sessionKey: this.params.sessionKey,
			sessionTarget: this.params.sessionTarget
		}, void 0, signal, this.params.contextTokenBudget) ?? [];
	}
	recordToolCall(params) {
		if (!params.id || !params.name || this.callIds.has(params.id)) return;
		this.callIds.add(params.id);
		this.namesById.set(params.id, params.name);
		this.progress.recordTranscriptCall(params);
		const message = attachCodexMirrorIdentity(this.createToolCallMessage(params), `${this.turnId}:tool:${params.id}:call`);
		this.messages.push(message);
		this.options.checkpointMessage?.({ read: () => message });
	}
	recordToolResult(params) {
		if (!params.id || !params.name || this.resultIds.has(params.id)) return;
		this.resultIds.add(params.id);
		this.progress.recordTranscriptResult(params);
		const message = attachCodexMirrorIdentity(this.createToolResultMessage(params), `${this.turnId}:tool:${params.id}:result`);
		this.messages.push(message);
		this.options.checkpointMessage?.({
			read: () => message,
			ready: () => !this.pendingRawOutputIds.has(params.id)
		});
	}
	recordMissingToolError(missingTranscriptIds, missingTrajectoryIds) {
		const firstMissingId = missingTranscriptIds.find((id) => Boolean(this.namesById.get(id))) ?? missingTrajectoryIds.find((id) => Boolean(this.trajectoryNamesById.get(id) ?? this.namesById.get(id)));
		if (!firstMissingId) return;
		const name = this.namesById.get(firstMissingId) ?? this.trajectoryNamesById.get(firstMissingId);
		if (!name) return;
		const item = this.trajectoryItemsById.get(firstMissingId);
		const meta = item ? itemMeta(item, this.progress.toolProgressDetailMode()) : this.progress.getToolMeta(firstMissingId)?.meta;
		this.progress.setLastToolError({
			toolName: name,
			...meta ? { meta } : {},
			error: formatMissingToolResultError({
				id: firstMissingId,
				name
			}),
			...item && isMutatingNativeToolItem(item) ? { mutatingAction: true } : {}
		});
	}
	shouldEmitAfterToolCallObservation(item) {
		if (!shouldSynthesizeToolProgressForItem(item) || this.afterToolCallObservedItemIds.has(item.id)) return false;
		return !(this.options.nativePostToolUseRelayEnabled && isNativePostToolUseRelayItem(item));
	}
	createToolCallMessage(params) {
		const args = normalizeToolTranscriptArguments(params.arguments);
		const attribution = resolveCodexLocalRuntimeAttribution(this.params);
		return {
			role: "assistant",
			content: [{
				type: "toolCall",
				id: params.id,
				name: params.name,
				arguments: args
			}],
			api: attribution.api ?? "openai-chatgpt-responses",
			provider: attribution.provider,
			model: this.params.modelId,
			usage: ZERO_USAGE,
			stopReason: "toolUse",
			timestamp: this.nextTranscriptTimestamp()
		};
	}
	createToolResultMessage(params) {
		const response = this.rawNativeToolOutputByCallId.get(params.id);
		const text = response ?? params.text ?? toolResultStatusText(params);
		return {
			role: "toolResult",
			toolCallId: params.id,
			toolName: params.name,
			isError: params.isError,
			content: [{
				type: "text",
				text
			}],
			...params.details !== void 0 ? { details: params.details } : {},
			timestamp: this.nextTranscriptTimestamp(),
			__openclaw: {
				...params.resultContentSource ? { resultContentSource: params.resultContentSource } : {},
				toolOutput: {
					source: response === void 0 ? "execution" : "provider-response",
					modelInput: "unverified",
					...params.outcomeUnknown ? { outcome: "unknown" } : {},
					...response === void 0 && params.captureTruncated ? { captureTruncated: true } : {}
				}
			}
		};
	}
};
function formatMissingToolResultError(params) {
	return `${MISSING_TOOL_RESULT_ERROR} toolCallId=${params.id}; toolName=${params.name}`;
}
function toolResultStatusText(params) {
	return params.isError ? `${params.name} failed` : `${params.name} completed`;
}
function resolveStartedAtFromDurationMs(durationMs) {
	if (typeof durationMs !== "number" || !Number.isFinite(durationMs)) return;
	return asDateTimestampMs(Date.now() - Math.max(0, durationMs));
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-events.ts
/** Downstream event consumers must never corrupt the canonical Codex turn projection. */
function emitCodexAgentEvent(params, event) {
	try {
		emitAgentEvent({
			runId: params.runId,
			stream: event.stream,
			data: event.data,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		});
	} catch (error) {
		embeddedAgentLog.debug("codex app-server global agent event emit failed", { error });
	}
	try {
		const maybePromise = params.onAgentEvent?.(event);
		Promise.resolve(maybePromise).catch((error) => {
			embeddedAgentLog.debug("codex app-server agent event handler rejected", { error });
		});
	} catch (error) {
		embeddedAgentLog.debug("codex app-server agent event handler threw", { error });
	}
}
function guardianActionCommand(action) {
	if (!action) return;
	const directLabel = readStringField(action, "command") ?? readStringField(action, "target") ?? readStringField(action, "toolTitle") ?? readStringField(action, "reason");
	if (directLabel) return directLabel;
	const server = readStringField(action, "connectorName") ?? readStringField(action, "server");
	const tool = readStringField(action, "toolName");
	if (server && tool) return `${server}/${tool}`;
	const argv = Array.isArray(action.argv) ? action.argv.filter((value) => typeof value === "string") : [];
	return argv.length > 0 ? argv.join(" ") : readStringField(action, "program");
}
function normalizeApprovalReviewStatus(status) {
	return status === "inProgress" ? "in_progress" : status === "timedOut" ? "timed_out" : status;
}
const GUARDIAN_TIMEOUT_WARNING = "Automatic approval review timed out while evaluating the requested approval.";
const LOG_ONLY_CODEX_WARNING_PATTERNS = [/^Configured service tier `[^`\r\n]+` is not advertised as supported for model `[^`\r\n]+` and will be omitted from requests\.$/, /^Code Mode is enabled in configuration, but model `[^`\r\n]+` does not advertise Code Mode support\. This may degrade model performance\. Disable `features\.code_mode` and `features\.code_mode_only`, or select a model whose metadata enables Code Mode\.$/];
function projectNormalizedToolItem(params) {
	const { item } = params;
	if (!item || !shouldSynthesizeToolProgressForItem(item)) return;
	const name = itemName(item);
	if (!name) return;
	const status = params.phase === "result" ? itemStatus(item) : "running";
	const args = itemToolArgs(item);
	const commandBearing = isCommandBearingToolItem(item, args);
	const meta = itemMeta(item, params.detailMode);
	return {
		name,
		status,
		args,
		meta,
		event: shouldEmitTranscriptToolProgress(name) ? {
			stream: "tool",
			data: {
				phase: params.phase,
				name,
				itemId: item.id,
				toolCallId: item.id,
				...meta ? { meta } : {},
				...commandBearing ? { commandBearing: true } : {},
				...params.phase === "start" && args ? { args } : {},
				...params.phase === "result" ? {
					status,
					isError: isNonSuccessItemStatus(status),
					...itemToolResult(item)
				} : {}
			}
		} : void 0
	};
}
var CodexEventProjection = class {
	constructor(provider, threadId, turnId, emitAgentEvent, toolProgress, toolTranscript, onNativeToolResultRecorded) {
		this.provider = provider;
		this.threadId = threadId;
		this.turnId = turnId;
		this.emitAgentEvent = emitAgentEvent;
		this.toolProgress = toolProgress;
		this.toolTranscript = toolTranscript;
		this.onNativeToolResultRecorded = onNativeToolResultRecorded;
		this.reviewCount = 0;
		this.safetyBufferingEnded = false;
	}
	get guardianReviewCount() {
		return this.reviewCount;
	}
	emitCompactionEnd(itemId, completed) {
		this.emitAgentEvent({
			stream: "compaction",
			data: {
				phase: "end",
				backend: "codex-app-server",
				completed,
				threadId: this.threadId,
				turnId: this.turnId,
				itemId
			}
		});
	}
	handleGuardianReview(method, params) {
		this.reviewCount += 1;
		const review = isJsonObject(params.review) ? params.review : void 0;
		const action = isJsonObject(params.action) ? params.action : void 0;
		const reviewId = readStringField(params, "reviewId");
		const targetItemId = readNullableString$1(params, "targetItemId");
		const command = guardianActionCommand(action);
		const reviewStatus = review ? readStringField(review, "status") : void 0;
		const status = normalizeApprovalReviewStatus(reviewStatus);
		const riskLevel = review ? readStringField(review, "riskLevel") : void 0;
		const userAuthorization = review ? readStringField(review, "userAuthorization") : void 0;
		const rationale = review ? readNullableString$1(review, "rationale") : void 0;
		const expectedWarning = status === "timed_out" ? GUARDIAN_TIMEOUT_WARNING : rationale && riskLevel && userAuthorization && (status === "approved" || status === "denied") ? `Automatic approval review ${status} (risk: ${riskLevel}, authorization: ${userAuthorization}): ${rationale}` : void 0;
		if (Boolean(targetItemId) && Boolean(reviewId) && this.pendingGuardianWarning === expectedWarning) this.pendingGuardianWarning = void 0;
		else this.flushPendingGuardianWarning();
		const threadId = readStringField(params, "threadId") ?? this.threadId;
		const turnId = readStringField(params, "turnId") ?? this.turnId;
		if (method.endsWith("/started")) this.activeGuardianReview = {
			reviewId,
			targetItemId,
			command,
			threadId,
			turnId
		};
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				method,
				phase: method.endsWith("/started") ? "started" : "completed",
				threadId,
				turnId,
				reviewId,
				targetItemId,
				decisionSource: readStringField(params, "decisionSource"),
				status: reviewStatus,
				riskLevel,
				userAuthorization,
				rationale,
				actionType: action ? readStringField(action, "type") : void 0,
				command
			}
		});
		if (reviewId && targetItemId && status) {
			const approvalReview = {
				id: reviewId,
				label: "Guardian",
				status,
				...riskLevel ? { riskLevel } : {},
				...userAuthorization ? { userAuthorization } : {},
				...rationale ? { rationale } : {}
			};
			const approvalReviewOutcome = this.toolTranscript.recordToolApprovalReview(targetItemId, reviewId, status, approvalReview);
			this.emitAgentEvent({
				stream: "tool",
				data: {
					phase: "review",
					toolCallId: targetItemId,
					hideFromChannelProgress: true,
					approvalReviewOutcome,
					review: approvalReview
				}
			});
		}
		if (method.endsWith("/completed") && this.activeGuardianReview?.reviewId === reviewId) this.activeGuardianReview = void 0;
	}
	handleGuardianWarning(params) {
		this.flushPendingGuardianWarning();
		const message = readStringField(params, "message");
		if (message) {
			this.pendingGuardianWarning = message;
			return;
		}
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				phase: "warning",
				message
			}
		});
	}
	handleWarning(params) {
		const message = [readStringField(params, "summary") ?? readStringField(params, "message"), readStringField(params, "details")].filter(Boolean).join("\n");
		if (LOG_ONLY_CODEX_WARNING_PATTERNS.some((pattern) => pattern.test(message))) embeddedAgentLog.warn(message);
		else if (message) this.emitAgentEvent({
			stream: "notice",
			data: {
				phase: "warning",
				message
			}
		});
	}
	handleModelRerouted(params) {
		const fromModel = readStringField(params, "fromModel");
		const toModel = readStringField(params, "toModel");
		const reason = readStringField(params, "reason");
		this.responseModel = toModel ?? this.responseModel;
		if (fromModel && toModel && fromModel !== toModel) {
			this.emitAgentEvent({
				stream: "lifecycle",
				data: {
					phase: "model",
					provider: this.provider,
					model: toModel
				}
			});
			this.emitAgentEvent({
				stream: "fallback",
				data: {
					fromModel,
					toModel,
					...reason ? { reason } : {}
				}
			});
			if (reason === "highRiskCyberActivity") {
				this.cyberNoticeState = "fallback";
				this.emitCyberNotice("fallback", {
					model: fromModel,
					fallbackModel: toModel
				});
			}
		}
	}
	handleSafetyBuffering(params) {
		if (params.showBufferingUi === false) {
			this.clearSafetyBuffering();
			return;
		}
		if (this.safetyBufferingEnded || this.cyberNoticeState === "blocked" || this.cyberNoticeState === "fallback" || params.showBufferingUi !== true || !Array.isArray(params.useCases) || !params.useCases.includes("cyber")) return;
		this.cyberNoticeState = "buffering";
		const model = readStringField(params, "model");
		const fallbackModel = readStringField(params, "fasterModel");
		this.emitCyberNotice("buffering", {
			...model ? { model } : {},
			...fallbackModel ? { fallbackModel } : {}
		});
	}
	handleCyberPolicyError(codexErrorInfo, model) {
		if (codexErrorInfo !== "cyberPolicy" || this.cyberNoticeState === "blocked") return;
		this.cyberNoticeState = "blocked";
		this.emitCyberNotice("blocked", { model: this.responseModel ?? model });
	}
	endSafetyBuffering() {
		this.safetyBufferingEnded = true;
		this.clearSafetyBuffering();
	}
	markSafetyBufferingAssistantStarted() {
		if (this.cyberNoticeState === "buffering") this.endSafetyBuffering();
	}
	clearSafetyBuffering() {
		if (this.cyberNoticeState !== "buffering") return;
		this.cyberNoticeState = void 0;
		this.emitCyberNotice("cleared");
	}
	emitCyberNotice(state, models = {}) {
		if (this.provider !== "openai") return;
		this.emitAgentEvent({
			stream: "notice",
			data: {
				phase: "provider_policy",
				category: "cyber",
				state,
				provider: "openai",
				...models
			}
		});
	}
	handleRetry(params) {
		const rateLimited = isJsonObject(params.error) && params.error.codexErrorInfo === "rateLimitExceeded";
		this.emitAgentEvent({
			stream: "run_status",
			data: {
				phase: "retrying",
				message: rateLimited ? "Rate limited. The provider is retrying." : "Connection interrupted. The provider is retrying."
			}
		});
	}
	flushPendingGuardianWarning() {
		const pending = this.pendingGuardianWarning;
		if (!pending) return;
		this.pendingGuardianWarning = void 0;
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				phase: "warning",
				message: pending
			}
		});
	}
	handleStrictReviewRequired(params) {
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				method: "autoApprovalReview/strictReviewRequired",
				phase: "strict_review_required",
				threadId: readStringField(params, "threadId") ?? this.activeGuardianReview?.threadId ?? this.threadId,
				turnId: readStringField(params, "turnId") ?? this.activeGuardianReview?.turnId ?? this.turnId,
				reviewId: this.activeGuardianReview?.reviewId,
				targetItemId: this.activeGuardianReview?.targetItemId,
				command: this.activeGuardianReview?.command,
				startedAtMs: asFiniteNumber(params.startedAtMs)
			}
		});
	}
	handleHook(method, params) {
		const run = isJsonObject(params.run) ? params.run : void 0;
		if (!run) return;
		const durationMs = asFiniteNumber(run.durationMs);
		const entries = readHookOutputEntries(run.entries);
		const hookTurnId = readNullableString$1(params, "turnId");
		this.emitAgentEvent({
			stream: "codex_app_server.hook",
			data: {
				phase: method === "hook/started" ? "started" : "completed",
				threadId: this.threadId,
				turnId: hookTurnId === void 0 ? this.turnId : hookTurnId,
				hookRunId: readStringField(run, "id"),
				eventName: readStringField(run, "eventName"),
				handlerType: readStringField(run, "handlerType"),
				executionMode: readStringField(run, "executionMode"),
				scope: readStringField(run, "scope"),
				source: readStringField(run, "source"),
				sourcePath: readStringField(run, "sourcePath"),
				status: readStringField(run, "status"),
				statusMessage: readNullableString$1(run, "statusMessage"),
				...durationMs !== void 0 ? { durationMs } : {},
				...entries.length > 0 ? { entries } : {}
			}
		});
	}
	emitStandardItemEvent(params) {
		const { item } = params;
		if (!item) return;
		const activity = item.type === "subAgentActivity";
		if (activity && params.phase === "start") return;
		const subagent = activity || item.type === "collabAgentToolCall";
		const kind = subagent ? "tool" : itemKind(item);
		if (!kind) return;
		const name = subagent ? "subagents" : itemName(item);
		const args = itemToolArgs(item);
		const commandBearing = isCommandBearingToolItem(item, args);
		const subagentStatus = readStringField(item, activity ? "kind" : "status");
		const interaction = activity && subagentStatus === "interacted";
		const status = subagent && subagentStatus === "interrupted" ? "failed" : activity ? subagentStatus === "completed" || interaction ? "completed" : "running" : params.phase === "start" ? "running" : kind === "analysis" ? "completed" : unknownItemStatus(item) ? void 0 : itemStatus(item);
		const meta = subagent ? [interaction ? "message sent" : activity ? subagentStatus : status, readStringField(item, activity ? "agentPath" : "tool")].filter(Boolean).join(": ") : itemMeta(item, this.toolProgress.toolProgressDetailMode());
		const suppressChannelProgress = shouldSuppressChannelProgressForItem(item);
		this.emitAgentEvent({
			stream: "item",
			data: projectAgentActivityItem({
				itemId: activity && !interaction ? `subagent:${readStringField(item, "agentThreadId") ?? item.id}` : item.id,
				phase: params.phase,
				kind,
				title: itemTitle(item),
				...status ? { status } : {},
				...status === void 0 ? {
					summary: "Outcome unknown",
					title: `${itemTitle(item)} — outcome unknown`
				} : {},
				toolCallId: item.id,
				...name ? { name } : {},
				...meta ? { meta } : {},
				...commandBearing ? { commandBearing: true } : {},
				...suppressChannelProgress ? { suppressChannelProgress: true } : {}
			}, {
				args: itemToolArgs(item),
				...item.type === "collabAgentToolCall" && item.tool === "wait" ? { nativeOperation: "wait" } : {}
			})
		});
	}
	async emitSnapshotOnlyNativeToolProgress(params) {
		const { item, activeItemIds, completedItemIds, isActive } = params;
		if (!shouldSynthesizeToolProgressForItem(item) || !matchesCodexSnapshotTurn(item, this.turnId) || completedItemIds.has(item.id) || itemStatus(item) === "running") return;
		if (!activeItemIds.has(item.id)) {
			this.emitStandardItemEvent({
				phase: "start",
				item
			});
			await this.emitNormalizedToolItemEvent({
				phase: "start",
				item
			});
		}
		if (!isActive()) return;
		activeItemIds.delete(item.id);
		this.emitStandardItemEvent({
			phase: "end",
			item
		});
		await this.emitNormalizedToolItemEvent({
			phase: "result",
			item
		});
		completedItemIds.add(item.id);
	}
	async emitNormalizedToolItemEvent(params) {
		const projection = projectNormalizedToolItem({
			...params,
			detailMode: this.toolProgress.toolProgressDetailMode()
		});
		if (!projection || !params.item) return;
		const { item } = params;
		const { name, status, args, meta, event } = projection;
		const approvalReviewOutcome = params.phase === "result" ? this.toolTranscript.finalizeToolApprovalReviews(item.id) : void 0;
		if (event && approvalReviewOutcome) event.data.approvalReviewOutcome = approvalReviewOutcome;
		this.toolTranscript.recordTrajectoryEvent({
			phase: params.phase,
			item,
			name,
			args,
			status
		});
		if (params.phase === "result") this.toolProgress.recordNativeToolError({
			item,
			name,
			meta,
			status
		});
		if (!event) {
			if (params.phase === "result") {
				this.toolTranscript.emitAfterToolCallObservation(item);
				await this.onNativeToolResultRecorded?.();
			}
			return;
		}
		const activity = projectCodexToolActivity(item, params.phase, meta);
		if (activity && params.phase === "start") this.emitAgentEvent({
			stream: "item",
			data: activity
		});
		this.emitAgentEvent(event);
		if (activity && params.phase !== "start") this.emitAgentEvent({
			stream: "item",
			data: activity
		});
		if (params.phase === "result") {
			this.toolTranscript.emitAfterToolCallObservation(item);
			await this.onNativeToolResultRecorded?.();
		}
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-history-recovery.ts
const THREAD_READ_TIMEOUT_MS = 3e4;
const RECENT_TERMINAL_TASK_RECONCILE_GRACE_MS = 6e4;
var CodexNativeSubagentHistoryRecovery = class {
	constructor(client, queries) {
		this.client = client;
		this.queries = queries;
		this.recoveredParentSources = /* @__PURE__ */ new Map();
	}
	retainRecoveryParents(recovered, source) {
		for (const parent of recovered) {
			if (!parent || parent === source) continue;
			const sources = this.recoveredParentSources.get(parent) ?? /* @__PURE__ */ new Set();
			sources.add(source);
			this.recoveredParentSources.set(parent, sources);
		}
	}
	forgetRecoveredParent(state) {
		const ancestors = this.recoveredParentSources.get(state);
		if (ancestors) {
			for (const sources of this.recoveredParentSources.values()) if (sources.has(state)) for (const ancestor of ancestors) sources.add(ancestor);
		}
		this.recoveredParentSources.delete(state);
	}
	parentsForRetirement(parentThreadId, parents) {
		const current = parents.get(parentThreadId);
		const retiring = new Set(current ? [current] : []);
		for (const sources of this.recoveredParentSources.values()) for (const source of sources) if (source.parentThreadId === parentThreadId && (!current || source === current || source.historyOwner && current.historyOwner && this.acceptsParent(source, current))) retiring.add(source);
		for (const source of retiring) for (const [recovered, sources] of this.recoveredParentSources) if (sources.has(source)) retiring.add(recovered);
		return [...retiring].filter((state) => parents.get(state.parentThreadId) === state);
	}
	selectTaskRecords(state, records = state.taskRuntime?.listTaskRecords() ?? []) {
		return records.filter((task) => this.acceptsTask(task, state)).toSorted((a, b) => (b.startedAt ?? b.createdAt) - (a.startedAt ?? a.createdAt));
	}
	acceptsParent(stored, current) {
		return stored.requesterSessionKey === current.requesterSessionKey && (!stored.historyOwner || current.historyOwner !== void 0 && matchesCodexNativeSubagentHistoryOwner(stored.historyOwner, current.historyOwner));
	}
	acceptsTask(task, state) {
		if (task.requesterSessionKey !== state.requesterSessionKey) return false;
		return this.acceptsParent({
			requesterSessionKey: task.requesterSessionKey,
			historyOwner: readCodexNativeSubagentHistoryOwner(task.detail)
		}, state);
	}
	canRestoreTask(task, state) {
		const history = readCodexNativeSubagentHistoryOwner(task.detail);
		try {
			assertHistoryOwnerMatchesRegistration(history, state.historyOwner, history?.parentThreadId ?? state.parentThreadId, true);
			return this.acceptsTask(task, state);
		} catch {
			return false;
		}
	}
	readReceiverTask(state, childThreadId) {
		const records = state.taskRuntime?.listTaskRecords() ?? [];
		const task = records.toSorted((a, b) => (b.startedAt ?? b.createdAt) - (a.startedAt ?? a.createdAt)).find((record) => readNativeTaskAssignment(record)?.childThreadId === childThreadId);
		const assignment = task && readNativeTaskAssignment(task);
		const history = task && readCodexNativeSubagentHistoryOwner(task.detail);
		if (!task) return;
		if (!assignment || !history || history.parentThreadId !== state.parentThreadId && ![
			"succeeded",
			"failed",
			"cancelled"
		].includes(task.status) || !this.canRestoreTask(task, state)) return { restorable: false };
		return {
			restorable: true,
			assignment,
			nativeParentThreadId: history.parentThreadId,
			records: this.selectTaskRecords(state, records)
		};
	}
	readChildAssignments(state, assignment, tasks) {
		let current = assignment;
		let latestAt = -Infinity;
		let terminal = false;
		let nativeParentThreadId = state.parentThreadId;
		const storedTurnIds = /* @__PURE__ */ new Set();
		const completedRunIds = [];
		for (const task of tasks) {
			const candidate = readNativeTaskAssignment(task);
			if (!this.acceptsTask(task, state) || candidate?.childThreadId !== assignment.childThreadId) continue;
			const history = readCodexNativeSubagentHistoryOwner(task.detail);
			if (history && !this.canRestoreTask(task, state)) continue;
			const taskTerminal = task.status === "succeeded" || task.status === "failed" || task.status === "cancelled";
			if (taskTerminal) completedRunIds.push(candidate.runId);
			for (const turnId of [candidate.nativeTurnId, candidate.initialTurnId]) if (turnId) storedTurnIds.add(turnId);
			const startedAt = task.startedAt ?? task.createdAt;
			if (startedAt > latestAt) {
				current = {
					...candidate,
					nativeTurnId: candidate.nativeTurnId ?? (candidate.runId === assignment.runId ? assignment.nativeTurnId : void 0)
				};
				terminal = taskTerminal;
				nativeParentThreadId = history?.parentThreadId ?? state.parentThreadId;
				latestAt = startedAt;
			}
		}
		return {
			current,
			found: latestAt !== -Infinity,
			terminal,
			nativeParentThreadId,
			storedTurnIds,
			completedRunIds
		};
	}
	shouldReconcileTask(task, now) {
		if (task.status === "queued" || task.status === "running" || task.deliveryStatus === "pending") return true;
		if (task.deliveryStatus !== "not_applicable" || task.endedAt === void 0) return false;
		return task.endedAt >= now - RECENT_TERMINAL_TASK_RECONCILE_GRACE_MS;
	}
	prepareTaskRead(candidate, child, now) {
		const tasks = candidate.taskRuntime.listTaskRecords().filter((record) => record.runId === candidate.runId);
		const task = tasks[0];
		if (tasks.length !== 1 || !task || task.taskId !== candidate.taskId || !this.acceptsTask(task, candidate.parentState) || !this.shouldReconcileTask(task, now) || child?.completionTaskId && child.completionTaskId !== candidate.taskId) return;
		const assignment = child ?? readNativeTaskAssignment(task);
		if (!assignment) return;
		return {
			task,
			historyOwner: readCodexNativeSubagentHistoryOwner(task.detail),
			assignment,
			terminal: task.status === "succeeded" || task.status === "failed" || task.status === "cancelled"
		};
	}
	isCurrentTask(candidate, task, history, parentThreadId, now) {
		const currentTasks = candidate.taskRuntime.listTaskRecords().filter((record) => record.runId === candidate.runId);
		const current = currentTasks[0];
		if (currentTasks.length !== 1 || !current || current.taskId !== candidate.taskId || task.taskId !== candidate.taskId) return false;
		try {
			assertHistoryOwnerMatchesRegistration(readCodexNativeSubagentHistoryOwner(current.detail), candidate.parentState.historyOwner, parentThreadId, true);
		} catch {
			return false;
		}
		return current && current.taskId === task.taskId && this.acceptsTask(current, candidate.parentState) && this.shouldReconcileTask(current, now) && isDeepStrictEqual(readCodexNativeSubagentHistoryOwner(current.detail), history) && parentThreadId === (history?.parentThreadId ?? candidate.parentState.parentThreadId);
	}
	requestThreadRead(childThreadId, includeTurns) {
		return this.client.request("thread/read", {
			threadId: childThreadId,
			includeTurns
		}, { timeoutMs: THREAD_READ_TIMEOUT_MS });
	}
	requestLatestThreadTurn(childThreadId) {
		return this.client.request("thread/turns/list", {
			threadId: childThreadId,
			limit: 1,
			sortDirection: "desc",
			itemsView: "full"
		}, { timeoutMs: THREAD_READ_TIMEOUT_MS });
	}
	readTask(assignment, task, candidate) {
		const recordedStatus = task.status === "succeeded" || task.status === "failed" || task.status === "cancelled" ? task.status : void 0;
		return this.read(assignment, {
			resumeInterrupted: task.status === "queued" || task.status === "running",
			getTaskRecords: () => this.selectTaskRecords(candidate.parentState),
			observedTurns: candidate.observedTurns,
			...recordedStatus && task.terminalSummary ? { recordedCompletion: {
				childThreadId: candidate.childThreadId,
				status: recordedStatus,
				statusLabel: "recorded_task_result",
				result: task.terminalSummary,
				completedAt: task.endedAt
			} } : {}
		});
	}
	async read(assignment, options) {
		const { childThreadId } = assignment;
		const { recordedCompletion } = options;
		const response = await this.requestThreadRead(childThreadId, true).catch(() => this.requestThreadRead(childThreadId, false));
		const thread = isJsonObject(response.thread) ? response.thread : void 0;
		if (!thread || readStringField(thread, "id")?.trim() !== childThreadId) return {
			resumable: false,
			threadState: "unavailable",
			observedPendingTurns: []
		};
		const firstObserved = options.observedTurns?.[0];
		const observedPredecessor = options.resumeInterrupted && firstObserved?.state && firstObserved.state !== "active" && !firstObserved.startObserved ? firstObserved.turnId : void 0;
		const turnId = assignment.nativeTurnId ?? observedPredecessor;
		const pendingTurnIds = /* @__PURE__ */ new Set([...this.queries.getPendingTurnIds(childThreadId), ...options.observedTurns?.map((turn) => turn.turnId) ?? []]);
		const unresolvedAssignment = options.resumeInterrupted && !turnId && pendingTurnIds.size > 0;
		const observedPendingTurns = [];
		for (const turn of Array.isArray(thread.turns) ? thread.turns : []) {
			const pendingTurnId = readStringField(turn, "id");
			if (pendingTurnId && pendingTurnIds.has(pendingTurnId)) observedPendingTurns.push({
				turnId: pendingTurnId,
				state: readNativeTurnState(turn)
			});
		}
		const threadStatus = isJsonObject(thread.status) ? normalizeIdentifier(readStringField(thread.status, "type")) : void 0;
		let completion;
		let fallbackCompletion;
		let nativeTurnId;
		let nativeTurnState;
		let resumable = false;
		let threadState = threadStatus === "active" ? "active" : threadStatus === "systemerror" ? "system_error" : threadStatus ? "other" : "unavailable";
		if (unresolvedAssignment) threadState = "unavailable";
		else if (turnId) {
			const turns = Array.isArray(thread.turns) ? thread.turns.filter(isJsonObject) : [];
			let index = turns.findIndex((turn) => readStringField(turn, "id") === turnId);
			while (options.resumeInterrupted && index >= 0 && index + 1 < turns.length && normalizeIdentifier(readStringField(turns[index], "status")) === "interrupted") index += 1;
			const turn = turns[index];
			const turnStatus = normalizeIdentifier(readStringField(turn, "status"));
			nativeTurnId = readStringField(turn, "id");
			nativeTurnState = readNativeTurnState(turn);
			completion = isJsonObject(turn) ? readTurnCompletion(turn, childThreadId) : void 0;
			resumable = turnStatus === "interrupted";
			threadState = turnStatus === "inprogress" ? "active" : turnStatus ? "other" : "unavailable";
		} else if (threadStatus === "active") {
			const turn = Array.isArray(thread.turns) ? thread.turns.at(-1) : void 0;
			if (normalizeIdentifier(readStringField(turn, "status")) === "inprogress") {
				nativeTurnId = readStringField(turn, "id");
				nativeTurnState = "active";
			}
		} else if (threadStatus !== "systemerror") {
			const turnRecovery = readThreadTurnRecovery(thread, childThreadId);
			nativeTurnId = turnRecovery.nativeTurnId;
			nativeTurnState = turnRecovery.nativeTurnState;
			completion = turnRecovery.completion;
			resumable = turnRecovery.resumable;
		}
		if (!unresolvedAssignment && threadStatus === "systemerror" && (!turnId || threadState === "unavailable" && !completion)) {
			const turnsResponse = await this.requestLatestThreadTurn(childThreadId).catch(() => void 0);
			const data = isJsonObject(turnsResponse) && Array.isArray(turnsResponse.data) ? turnsResponse.data : [];
			const latestTurn = isJsonObject(data[0]) ? data[0] : void 0;
			const latestTurnId = readStringField(latestTurn, "id");
			if (latestTurnId && pendingTurnIds.has(latestTurnId)) observedPendingTurns.push({
				turnId: latestTurnId,
				state: readNativeTurnState(latestTurn)
			});
			const latestTurnStatus = normalizeIdentifier(readStringField(latestTurn, "status"));
			const matchesAssignment = !turnId || readStringField(latestTurn, "id") === turnId;
			if (latestTurn && matchesAssignment) {
				if (turnId) {
					const turnRecovery = readThreadTurnRecovery({ turns: [latestTurn] }, childThreadId);
					nativeTurnId = turnRecovery.nativeTurnId;
					nativeTurnState = turnRecovery.nativeTurnState;
					completion = turnRecovery.completion;
					resumable = turnRecovery.resumable;
				} else if (latestTurnStatus === "failed") completion = readTurnCompletion(latestTurn, childThreadId);
			}
			const current = !latestTurn ? this.queries.getCurrentAssignmentState(childThreadId) : void 0;
			const taskRecords = !latestTurn ? options.getTaskRecords() : [];
			const task = taskRecords.find((record) => record.runId === assignment.runId);
			const hasSuccessor = task && taskRecords.some((record) => record.requesterSessionKey === task.requesterSessionKey && (record.startedAt ?? record.createdAt) > (task.startedAt ?? task.createdAt) && readNativeTaskAssignment(record)?.childThreadId === childThreadId);
			const unresolvedCurrentAssignment = current?.runId === assignment.runId && current?.nativeTurnState !== "completed" && !hasSuccessor;
			if (latestTurnStatus === "inprogress" && matchesAssignment) {
				nativeTurnId = readStringField(latestTurn, "id");
				nativeTurnState = "active";
				threadState = "active";
			} else if (!completion && !resumable && latestTurnStatus !== "inprogress" && (!turnId || !latestTurn && unresolvedCurrentAssignment)) fallbackCompletion = systemErrorFallbackCompletion(childThreadId);
		}
		if (recordedCompletion && (!turnId || !completion || completion.status !== recordedCompletion.status)) {
			completion = recordedCompletion;
			if (!turnId) {
				nativeTurnId = void 0;
				nativeTurnState = void 0;
			}
			fallbackCompletion = void 0;
			resumable = false;
			threadState = "other";
		}
		const lineage = {
			parentThreadId: readThreadParentThreadId(thread),
			agentPath: normalizeOptionalString(readStringField(readThreadSpawnSource(thread), "agent_path"))
		};
		if (!turnId && !recordedCompletion && hasSavedSuccessor(assignment, options.getTaskRecords())) return {
			...lineage,
			assignmentUnresolved: true,
			observedPendingTurns,
			resumable: false,
			threadState: "unavailable"
		};
		return {
			...lineage,
			assignmentTurnId: turnId,
			nativeTurnId,
			nativeTurnState,
			observedPendingTurns,
			completion,
			fallbackCompletion,
			resumable,
			threadState
		};
	}
};
function hasSavedSuccessor(assignment, records) {
	const task = records.find((record) => record.runId === assignment.runId);
	return Boolean(task && records.some((record) => {
		const successor = readNativeTaskAssignment(record);
		return record.requesterSessionKey === task.requesterSessionKey && record.runId !== assignment.runId && successor?.childThreadId === assignment.childThreadId && Boolean(successor.initialTurnId);
	}));
}
function readThreadTurnRecovery(thread, childThreadId) {
	const turns = Array.isArray(thread.turns) ? thread.turns : [];
	for (let index = turns.length - 1; index >= 0; index -= 1) {
		const turn = turns[index];
		if (!isJsonObject(turn)) continue;
		const status = normalizeIdentifier(readStringField(turn, "status"));
		return {
			nativeTurnId: readStringField(turn, "id"),
			nativeTurnState: readNativeTurnState(turn),
			completion: readTurnCompletion(turn, childThreadId),
			resumable: status === "interrupted"
		};
	}
	return { resumable: false };
}
function readNativeTurnEnd(turn) {
	const status = normalizeIdentifier(readStringField(turn, "status"));
	return status === "completed" || status === "failed" || status === "interrupted" ? status : void 0;
}
function readNativeTurnState(turn) {
	return normalizeIdentifier(readStringField(turn, "status")) === "inprogress" ? "active" : readNativeTurnEnd(turn);
}
function readTurnErrorMessage(turn) {
	const error = isJsonObject(turn.error) ? turn.error : void 0;
	return normalizeOptionalString(readStringField(error, "message")) ?? normalizeOptionalString(isJsonObject(error?.codexErrorInfo) ? readStringField(error.codexErrorInfo, "message") : void 0);
}
function systemErrorFallbackCompletion(childThreadId) {
	return {
		childThreadId,
		status: "failed",
		statusLabel: "system_error",
		result: "Subagent runtime reported a system error."
	};
}
function readTurnCompletion(turn, childThreadId) {
	const status = normalizeIdentifier(readStringField(turn, "status"));
	if (status === "inprogress" || !status) return;
	const result = readLastAgentMessage(turn);
	const completedAtSeconds = asFiniteNumber(turn.completedAt);
	const completedAt = completedAtSeconds === void 0 ? void 0 : Math.round(completedAtSeconds * 1e3);
	if (status === "completed") return {
		childThreadId,
		status: "succeeded",
		statusLabel: result ? "task_complete" : "completed_without_final_message",
		result: result ?? "Subagent completed without a final assistant message.",
		completedAt
	};
	if (status === "interrupted") return;
	if (status === "failed") return {
		childThreadId,
		status: "failed",
		statusLabel: "task_failed",
		result: readTurnErrorMessage(turn) ?? result ?? "Subagent failed.",
		completedAt
	};
}
function readLastAgentMessage(turn) {
	const items = Array.isArray(turn.items) ? turn.items : [];
	let legacyResult;
	for (let index = items.length - 1; index >= 0; index -= 1) {
		const item = items[index];
		if (!isJsonObject(item)) continue;
		if (normalizeIdentifier(readStringField(item, "type")) !== "agentmessage") continue;
		const text = readStringField(item, "text")?.trim();
		if (!text) continue;
		const phase = normalizeIdentifier(readStringField(item, "phase"));
		if (phase === "finalanswer") return text;
		if (!phase) legacyResult ??= text;
	}
	return legacyResult;
}
function isNoFinalCompletion(completion) {
	return completion.status === "succeeded" && completion.statusLabel === "completed_without_final_message";
}
function readThreadParentThreadId(thread) {
	return readStringField(thread, "parentThreadId")?.trim() ?? readStringField(readThreadSpawnSource(thread), "parent_thread_id")?.trim();
}
function readThreadSpawnSource(thread) {
	const source = isJsonObject(thread?.source) ? thread.source : void 0;
	const subAgent = isJsonObject(source?.subAgent) ? source.subAgent : void 0;
	return isJsonObject(subAgent?.thread_spawn) ? subAgent.thread_spawn : void 0;
}
function normalizeIdentifier(value) {
	return value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-retry.ts
function delayForAttempt(delays, attempt) {
	return Math.max(1, delays[Math.min(attempt, delays.length - 1)] ?? 1);
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-recovery-coordinator.ts
const DEFAULT_RECOVERY_POLL_DELAYS_MS = [
	2e3,
	5e3,
	1e4,
	15e3,
	3e4,
	6e4,
	12e4,
	3e5
];
var CodexNativeSubagentRecoveryCoordinator = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.taskReconciliations = /* @__PURE__ */ new Map();
		this.taskReconciliationTimers = /* @__PURE__ */ new Map();
		this.threadStatusRevisions = /* @__PURE__ */ new Map();
		this.recoveryPollDelaysMs = dependencies.recoveryPollDelaysMs ?? DEFAULT_RECOVERY_POLL_DELAYS_MS;
	}
	allCandidates() {
		return [...this.taskReconciliations.values(), ...this.taskReconciliationTimers.values()].map(({ candidate }) => candidate);
	}
	observeUnregisteredTurn(threadId, turnId, started, end) {
		const candidates = [...new Set(this.allCandidates())].filter((candidate) => candidate.childThreadId === threadId && !this.dependencies.isRetiredParent(candidate.parentState));
		for (const turns of new Set(candidates.map((candidate) => candidate.observedTurns))) {
			const observed = turns.find((entry) => entry.turnId === turnId);
			if (!started) {
				if (observed) observed.state = end;
				else turns.push({
					turnId,
					state: end
				});
			} else if (!observed) {
				const previous = turns.at(-1);
				if (previous?.state === "active") previous.state = void 0;
				turns.push({
					turnId,
					state: "active",
					startObserved: true
				});
			}
		}
		return candidates;
	}
	hasRevision(threadId) {
		return this.threadStatusRevisions.has(threadId);
	}
	observeRevision(threadId) {
		const revision = this.threadStatusRevisions.get(threadId);
		if (revision) revision.value += 1;
	}
	isTerminalRevision(threadId) {
		return this.threadStatusRevisions.get(threadId)?.terminal === true;
	}
	markTerminalRevision(threadId) {
		const revision = this.threadStatusRevisions.get(threadId);
		if (revision) revision.terminal = true;
	}
	seedRevision(threadId, parentThreadId) {
		this.threadStatusRevisions.set(threadId, this.threadStatusRevisions.get(threadId) ?? {
			value: 0,
			readers: 0,
			parentThreadId
		});
	}
	dispose() {
		for (const { timer } of this.taskReconciliationTimers.values()) clearTimeout(timer);
		this.taskReconciliationTimers.clear();
	}
	async reconcileRegisteredChild(childState) {
		if (childState.terminal || this.dependencies.isDisposed() || !this.dependencies.isRegisteredChild(childState)) return false;
		if (childState.recoveryInFlight) return await childState.recoveryInFlight;
		const recovery = this.dependencies.reconcileChildState(childState);
		childState.recoveryInFlight = recovery;
		try {
			return await recovery;
		} finally {
			if (childState.recoveryInFlight === recovery) childState.recoveryInFlight = void 0;
		}
	}
	pendingChildRecoveries(state, threadId) {
		return [...new Set(this.allCandidates())].filter((candidate) => candidate.childThreadId === threadId && candidate.requesterSessionKey === state.requesterSessionKey && candidate.parentState.parentThreadId === state.parentThreadId && !this.dependencies.isRetiredParent(candidate.parentState));
	}
	resolveChildTurnBuffer(state, threadId) {
		return this.pendingChildRecoveries(state, threadId)[0]?.observedTurns ?? [];
	}
	clearTerminalRevisionsForParent(parentThreadId) {
		for (const [threadId, revision] of this.threadStatusRevisions) if (revision.parentThreadId === parentThreadId) this.collectThreadStatusRevision(threadId, revision);
	}
	collectThreadStatusRevision(threadId, revision = this.threadStatusRevisions.get(threadId)) {
		if (!revision || revision.readers > 0 || Boolean(this.dependencies.currentChild(threadId))) return;
		if ((revision.parentThreadId ? this.dependencies.parentState(revision.parentThreadId) : void 0)?.owners.size) return;
		if (this.threadStatusRevisions.get(threadId) === revision) this.threadStatusRevisions.delete(threadId);
	}
	scheduleRecoveryPoll(childState) {
		if (childState.terminal || childState.settledWithoutCompletion || childState.recoveryTimer || this.dependencies.isDisposed() || this.recoveryPollDelaysMs.length === 0) return;
		const delayMs = delayForAttempt(this.recoveryPollDelaysMs, childState.recoveryAttempt++);
		childState.recoveryTimer = setTimeout(() => {
			childState.recoveryTimer = void 0;
			this.reconcileRegisteredChild(childState).catch((error) => {
				logRecoveryFailure(childState.childThreadId, error);
				return false;
			}).then(async (reconciled) => {
				if (reconciled || !this.dependencies.isRegisteredChild(childState)) return;
				const fallback = childState.fallbackCompletion;
				const state = this.dependencies.parentState(childState.parentThreadId);
				if (fallback && state && childState.recoveryAttempt >= 2) {
					await this.dependencies.processCompletion(state, childState, fallback, fallback.completedAt ?? this.dependencies.now());
					return;
				}
				this.scheduleRecoveryPoll(childState);
			});
		}, delayMs);
		childState.recoveryTimer.unref();
	}
	setRecoveryFallback(childState, completion, eventAt) {
		if (childState.terminal) return;
		const current = childState.fallbackCompletion;
		if (current?.status === completion.status && current.statusLabel === completion.statusLabel && current.result === completion.result) return;
		if (childState.recoveryTimer) {
			clearTimeout(childState.recoveryTimer);
			childState.recoveryTimer = void 0;
		}
		childState.recoveryAttempt = 0;
		childState.fallbackCompletion = {
			...completion,
			completedAt: eventAt
		};
		this.scheduleRecoveryPoll(childState);
	}
	clearSystemErrorFallback(childState) {
		if (childState.fallbackCompletion?.statusLabel !== "system_error") return;
		childState.fallbackCompletion = void 0;
	}
	retainThreadStatusRevision(threadId) {
		const revision = this.threadStatusRevisions.get(threadId) ?? {
			value: 0,
			readers: 0
		};
		this.threadStatusRevisions.set(threadId, revision);
		revision.readers += 1;
		const capturedValue = revision.value;
		let retained = true;
		return {
			isCurrent: () => this.threadStatusRevisions.get(threadId) === revision && revision.value === capturedValue,
			release: () => {
				if (!retained) return;
				retained = false;
				revision.readers -= 1;
				this.collectThreadStatusRevision(threadId, revision);
			}
		};
	}
	clearRecoveryTimers(childState) {
		if (childState.recoveryTimer) {
			clearTimeout(childState.recoveryTimer);
			childState.recoveryTimer = void 0;
		}
	}
	async reconcileTaskCandidate(candidate, after) {
		const key = `${candidate.requesterSessionKey}\0${candidate.runId}`;
		const scheduled = this.taskReconciliationTimers.get(key);
		if (scheduled) {
			clearTimeout(scheduled.timer);
			this.taskReconciliationTimers.delete(key);
		}
		const existing = this.taskReconciliations.get(key);
		if (existing) {
			await existing.promise;
			return;
		}
		const reconciliation = after ? after.then(() => this.dependencies.reconcileTaskCandidateOnce(candidate)) : this.dependencies.reconcileTaskCandidateOnce(candidate);
		this.taskReconciliations.set(key, {
			candidate,
			promise: reconciliation
		});
		try {
			await reconciliation;
		} finally {
			if (this.taskReconciliations.get(key)?.promise === reconciliation) this.taskReconciliations.delete(key);
			this.dependencies.onCandidateSettled(candidate.parentState);
		}
	}
	scheduleTaskCandidateReconciliation(candidate) {
		const key = `${candidate.requesterSessionKey}\0${candidate.runId}`;
		if (this.dependencies.isDisposed() || this.dependencies.isRetiredParent(candidate.parentState) || this.recoveryPollDelaysMs.length === 0 || this.taskReconciliationTimers.has(key)) return;
		const delayMs = delayForAttempt(this.recoveryPollDelaysMs, candidate.recoveryAttempt++);
		const timer = setTimeout(() => {
			this.taskReconciliationTimers.delete(key);
			this.reconcileTaskCandidate(candidate).catch((error) => {
				logRecoveryFailure(candidate.childThreadId, error);
				this.scheduleTaskCandidateReconciliation(candidate);
			});
		}, delayMs);
		this.taskReconciliationTimers.set(key, {
			candidate,
			timer
		});
		timer.unref();
	}
};
function logRecoveryFailure(childThreadId, error) {
	embeddedAgentLog.debug("Codex native subagent history is not ready", {
		childThreadId,
		error: formatErrorMessage(error)
	});
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-close-owner.ts
var CodexNativeSubagentCloseOwner = class {
	constructor(client, callbacks) {
		this.client = client;
		this.callbacks = callbacks;
		this.calls = /* @__PURE__ */ new WeakMap();
	}
	bind(state, turnId) {
		this.prune(state);
		for (const [key, call] of this.calls.get(state) ?? []) if (call.completionObserved && call.turnId === turnId) this.completeChildClose(state, key, call);
	}
	clear(state) {
		this.calls.delete(state);
	}
	hasPending(state) {
		return [...this.calls.get(state)?.values() ?? []].some((call) => call.completing && !call.settled);
	}
	settlements(state) {
		return [...this.calls.get(state)?.values() ?? []].flatMap((call) => call.settlement ? [call.settlement] : []);
	}
	async observe(notification, state) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const item = isJsonObject(params?.item) ? params.item : void 0;
		const turnId = readStringField(params, "turnId");
		const itemId = readStringField(item, "id");
		const senderThreadId = readStringField(item, "senderThreadId");
		if (!turnId || !itemId || readStringField(params, "threadId") !== state.parentThreadId || senderThreadId !== void 0 && senderThreadId !== state.parentThreadId || this.callbacks.isParentRetired(state)) return;
		let calls = this.calls.get(state);
		if (!calls) {
			calls = /* @__PURE__ */ new Map();
			this.calls.set(state, calls);
		}
		const key = `${turnId}\0${itemId}`;
		const childThreadIds = new Set(readNativeSubagentThreadIds(item?.receiverThreadIds));
		if (notification.method === "item/started") {
			if (calls.has(key)) return;
			const owners = new Set([...state.owners.values()].filter((owner) => !owner.turnId || owner.turnId === turnId));
			if (owners.size === 0) return;
			const targets = [];
			for (const childThreadId of childThreadIds) {
				const known = this.callbacks.knownChild(childThreadId);
				if (known?.parent !== state || known.pendingTurns.length > 0) continue;
				targets.push({
					childThreadId,
					runId: known.assignment.runId,
					nativeTurnId: known.turnId,
					childState: this.callbacks.currentChild(childThreadId),
					forget: this.callbacks.captureForget?.(childThreadId).catch((error) => {
						logRecoveryFailure(childThreadId, error);
					})
				});
			}
			calls.set(key, {
				turnId,
				owners,
				targets
			});
			return;
		}
		const call = calls.get(key);
		if (!call || call.targets.some((target) => !childThreadIds.has(target.childThreadId)) || childThreadIds.size !== call.targets.length) return;
		call.completionObserved = true;
		await this.completeChildClose(state, key, call);
	}
	prune(state) {
		const calls = this.calls.get(state);
		if (!calls) return;
		for (const [key, call] of calls) {
			if (call.completing && !call.settled) continue;
			if (![...state.owners.values()].some((owner) => call.owners.has(owner) && (!owner.turnId || owner.turnId === call.turnId))) calls.delete(key);
		}
	}
	retireChild(state, childState, summary, releaseSubscription) {
		if (childState.pendingCompletion && !this.callbacks.isParentRetired(state)) {
			childState.subscriptionClosed = true;
			this.callbacks.releaseDirectChild(childState);
			this.callbacks.clearRecoveryTimers(childState);
			releaseSubscription?.();
			this.callbacks.releaseClientRetentionIfIdle();
			return;
		}
		if (!childState.terminal) {
			childState.terminal = true;
			const known = this.callbacks.knownChild(childState.childThreadId);
			if (known?.assignment.runId === childState.runId) {
				known.assignment.terminal = true;
				known.assignment.nativeTurnId = childState.nativeTurnId;
			}
			this.callbacks.markTerminalRevision(childState.childThreadId);
			const eventAt = this.callbacks.now();
			state.mirror?.markAuthoritativeCompletion(childState.childThreadId);
			state.taskRuntime?.finalizeTaskRunByRunId({
				runId: childState.runId,
				status: "cancelled",
				endedAt: eventAt,
				lastEventAt: eventAt,
				error: summary,
				progressSummary: summary,
				terminalSummary: summary
			});
		}
		if (childState.pendingCompletion) {
			childState.pendingCompletion = void 0;
			state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
				runId: childState.runId,
				deliveryStatus: "failed",
				error: summary
			});
		}
		this.callbacks.unregisterChild(childState);
		releaseSubscription?.();
	}
	retireReceiver(receiver, releaseSubscription) {
		const threadId = receiver.assignment.childThreadId;
		if (this.callbacks.isParentRetired(receiver.parent) && this.callbacks.knownChild(threadId) === receiver && !this.callbacks.currentChild(threadId)) releaseSubscription();
	}
	completeChildClose(state, key, call) {
		if (call.settlement) return call.settlement;
		const settlement = this.confirmChildClose(state, key, call);
		if (call.completing) call.settlement = settlement;
		return settlement;
	}
	async confirmChildClose(state, key, call) {
		const isCurrent = () => this.callbacks.isParentCurrent(state) && this.calls.get(state)?.get(key) === call;
		const isTargetCurrent = (target) => {
			const known = this.callbacks.knownChild(target.childThreadId);
			const childState = this.callbacks.currentChild(target.childThreadId);
			return known?.parent === state && known.assignment.runId === target.runId && known.turnId === target.nativeTurnId && known.pendingTurns.length === 0 && (childState === void 0 || childState === target.childState);
		};
		const recordUnconfirmedClose = () => {
			if (!isCurrent()) return;
			for (const target of call.targets) {
				const known = this.callbacks.knownChild(target.childThreadId);
				const childState = this.callbacks.currentChild(target.childThreadId);
				if (!isTargetCurrent(target) || known?.assignment.terminal || childState?.terminal || childState?.pendingCompletion) continue;
				state.taskRuntime?.recordTaskRunProgressByRunId({
					runId: target.runId,
					lastEventAt: this.callbacks.now(),
					progressSummary: "Could not confirm that the subagent closed. Retry the close request."
				});
			}
		};
		if (call.completing || !isCurrent() || ![...state.owners.values()].some((owner) => call.owners.has(owner) && owner.turnId === call.turnId)) return;
		call.completing = true;
		try {
			const forgetters = await Promise.all(call.targets.map((target) => Promise.resolve(target.forget)));
			if (!isCurrent()) return;
			const loaded = await this.client.request("thread/loaded/list", {}, { timeoutMs: 1e4 });
			if (!isCurrent()) return;
			if (!isJsonObject(loaded) || loaded.nextCursor !== null || !Array.isArray(loaded.data) || !loaded.data.every((id) => typeof id === "string" && id.trim() !== "")) {
				recordUnconfirmedClose();
				return;
			}
			for (const [index, target] of call.targets.entries()) {
				const childState = this.callbacks.currentChild(target.childThreadId);
				if (loaded.data.includes(target.childThreadId) || !isTargetCurrent(target)) continue;
				const forget = forgetters[index];
				if (childState) this.retireChild(state, childState, "Subagent was closed.", forget);
				else forget?.();
			}
		} catch (error) {
			embeddedAgentLog.warn("Failed to confirm Codex native subagent close", {
				parentThreadId: state.parentThreadId,
				error: formatErrorMessage(error)
			});
			recordUnconfirmedClose();
		} finally {
			call.settled = true;
			if (this.calls.get(state)?.get(key) === call) call.targets = [];
			this.prune(state);
			this.callbacks.pruneParent(state);
		}
	}
};
function isCodexNativeSubagentCloseNotification(notification) {
	if (notification.method !== "item/started" && notification.method !== "item/completed") return false;
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	const item = isJsonObject(params?.item) ? params.item : void 0;
	return readStringField(item, "type") === "collabAgentToolCall" && normalizeIdentifier(readStringField(item, "tool")) === "closeagent";
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-completion-delivery.ts
const DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS = [
	5e3,
	15e3,
	3e4,
	6e4,
	12e4,
	3e5
];
const completionDeliveryOwners = /* @__PURE__ */ new Map();
var CodexNativeSubagentCompletionDelivery = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.retryDelaysMs = dependencies.retryDelaysMs ?? DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS;
		this.maxRetries = dependencies.maxRetries ?? this.retryDelaysMs.length;
	}
	async deliverPending(state, childState) {
		const completion = childState.pendingCompletion;
		if (!completion || !this.dependencies.isCurrentChild(childState) || !this.dependencies.isCurrentParent(state) || this.dependencies.isRetiredParent(state)) return;
		if (childState.deliveringCompletion || childState.completionDeliveryTimer) return;
		childState.deliveringCompletion = true;
		try {
			if (!this.persistPending(state, childState)) return;
			if (state.owners.size > 0 || !state.taskRuntimeScope) return;
			const task = state.taskRuntime?.listTaskRecords().find((record) => record.runId === childState.runId);
			const historyOwner = readCodexNativeSubagentHistoryOwner(task?.detail);
			const delivery = await this.dependencies.deliver({
				scope: state.taskRuntimeScope,
				...historyOwner ? { expectedRequester: {
					sessionId: historyOwner.sessionId,
					lifecycleRevision: historyOwner.lifecycleRevision
				} } : {},
				isSourceSessionAdmissionAllowed: () => this.dependencies.isCurrentChild(childState) && this.dependencies.isCurrentParent(state) && !this.dependencies.isRetiredParent(state) && this.claim(state, childState),
				childSessionKey: childState.runId,
				childSessionId: completion.childThreadId,
				announceId: `codex-native:${childState.nativeParentThreadId}:${readCodexNativeSubagentRunId(childState.runId)?.turnId ? childState.runId : completion.childThreadId}:${completion.status}`,
				announceType: "Subagent",
				taskLabel: "Subagent",
				status: completion.status,
				statusLabel: completion.statusLabel,
				result: completion.result,
				replyInstruction: "Use the Codex native subagent result to continue or wrap up the parent task. If this is a Discord/channel session, send the visible response with the message tool instead of only writing a transcript final answer. Reply in your normal assistant voice and do not expose internal notification markup."
			});
			if (!this.dependencies.isCurrentChild(childState) || !this.dependencies.isCurrentParent(state)) return;
			if (!this.claim(state, childState)) {
				this.dependencies.unregisterChild(childState);
				return;
			}
			if (isDurableAgentHarnessCompletionDelivery(delivery)) {
				childState.nativeCompletionDelivered = true;
				childState.completionTaskPhase = "delivery";
				this.persistPending(state, childState);
				return;
			}
			if (delivery.recoveryBlocked) {
				this.dependencies.unregisterChild(childState);
				return;
			}
			if (delivery.recoveryPending) {
				this.scheduleRetry(childState, delivery.error ?? "requester recovery owns completion", false);
				return;
			}
			const error = delivery.error ?? "completion delivery did not produce a parent response";
			state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
				runId: childState.runId,
				deliveryStatus: "pending",
				error
			});
			this.scheduleRetry(childState, error);
		} catch (error) {
			if (!this.dependencies.isCurrentChild(childState) || !this.dependencies.isCurrentParent(state)) return;
			if (!this.claim(state, childState)) {
				this.dependencies.unregisterChild(childState);
				return;
			}
			const message = formatErrorMessage(error);
			if (!childState.completionTaskPhase) state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
				runId: childState.runId,
				deliveryStatus: "pending",
				error: message
			});
			this.scheduleRetry(childState, message);
			embeddedAgentLog.warn("Failed to deliver Codex native subagent completion", {
				parentThreadId: state.parentThreadId,
				childThreadId: completion.childThreadId,
				error: message
			});
		} finally {
			childState.deliveringCompletion = false;
		}
	}
	finish(state, child) {
		child.completionTaskPhase ??= "delivery";
		if (child.completionDeliveryTimer) {
			clearTimeout(child.completionDeliveryTimer);
			child.completionDeliveryTimer = void 0;
		}
		this.deliverPending(state, child);
	}
	applyReceipts(state, runIds, children) {
		for (const runId of runIds) {
			const child = children.get(runId);
			const deliveryParent = child && this.dependencies.getParent(child.parentThreadId);
			if (!child || !deliveryParent || !this.dependencies.isCurrentChild(child) || !this.dependencies.isCurrentParent(state) || this.dependencies.isRetiredParent(state) || !this.dependencies.isCurrentParent(deliveryParent) || this.dependencies.isRetiredParent(deliveryParent)) continue;
			if (deliveryParent !== state) {
				if (!state.requesterSessionKey?.trim() || state.requesterSessionKey !== deliveryParent.requesterSessionKey) continue;
				const task = deliveryParent.taskRuntime?.listTaskRecords().find((record) => record.runId === runId);
				try {
					assertHistoryOwnerMatchesRegistration(readCodexNativeSubagentHistoryOwner(task?.detail), state.historyOwner, child.nativeParentThreadId, true);
				} catch {
					continue;
				}
				if (!this.claim(deliveryParent, child)) continue;
			}
			child.nativeCompletionDelivered = true;
			if (child.pendingCompletion && !child.deliveringCompletion) this.finish(deliveryParent, child);
		}
	}
	deliverDetached(state, children) {
		for (const child of children) if (child.parentThreadId === state.parentThreadId && child.pendingCompletion) this.deliverPending(state, child);
	}
	release(childState) {
		if (childState.completionDeliveryTimer) clearTimeout(childState.completionDeliveryTimer);
		const deliveryOwnerKey = childState.deliveryOwnerKey;
		if (deliveryOwnerKey && completionDeliveryOwners.get(deliveryOwnerKey) === childState) completionDeliveryOwners.delete(deliveryOwnerKey);
		childState.deliveryOwnerKey = void 0;
	}
	persistPending(state, child) {
		const completion = child.pendingCompletion;
		if (!completion) return false;
		const runId = child.runId;
		if (!this.claim(state, child)) {
			this.dependencies.unregisterChild(child);
			return false;
		}
		if (child.completionTaskPhase === "finalize") {
			const eventAt = completion.completedAt ?? this.dependencies.now();
			const currentRecord = state.taskRuntime?.listTaskRecords().find((record) => record.runId === runId);
			const updated = state.taskRuntime?.finalizeTaskRunByRunId({
				runId,
				status: completion.status,
				endedAt: eventAt,
				lastEventAt: eventAt,
				...completion.status === "succeeded" ? {} : { error: completion.result },
				progressSummary: completion.result,
				terminalSummary: completion.result,
				...child.nativeTurnId ? { detail: {
					...isJsonObject(currentRecord?.detail) ? currentRecord.detail : {},
					nativeTurnId: child.nativeTurnId
				} } : {}
			});
			if (state.taskRuntime && !updated?.some((task) => task.runId === runId && (!child.completionTaskId || task.taskId === child.completionTaskId))) {
				const current = state.taskRuntime.listTaskRecords().find((task) => task.runId === runId);
				if (!current || current.status !== completion.status && current.status !== "queued" && current.status !== "running") {
					this.dependencies.unregisterChild(child);
					return false;
				}
				throw new Error("Codex native subagent task finalization was not persisted.");
			}
			child.completionTaskPhase = "delivery";
		}
		if (!state.requesterSessionKey || !state.taskRuntimeScope) {
			this.dependencies.unregisterChild(child);
			return false;
		}
		if (child.completionTaskPhase === "delivery") {
			const updated = state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
				runId,
				deliveryStatus: child.nativeCompletionDelivered ? "delivered" : "pending"
			});
			if (state.taskRuntime && !updated?.some((task) => task.runId === runId && (!child.completionTaskId || task.taskId === child.completionTaskId))) {
				if (!state.taskRuntime.listTaskRecords().some((task) => task.runId === runId)) {
					this.dependencies.unregisterChild(child);
					return false;
				}
				throw new Error("Codex native subagent task delivery status was not persisted.");
			}
			child.completionTaskPhase = void 0;
			child.completionDeliveryAttempt = 0;
		}
		if (child.nativeCompletionDelivered) {
			child.pendingCompletion = void 0;
			this.dependencies.unregisterChild(child);
			return false;
		}
		this.dependencies.releaseClientRetentionIfIdle();
		return true;
	}
	scheduleRetry(childState, error, chargeAttempt = true) {
		if (!childState.pendingCompletion || childState.completionDeliveryTimer || !this.dependencies.isCurrentChild(childState)) return;
		if (chargeAttempt && !childState.completionTaskPhase && childState.completionDeliveryAttempt >= this.maxRetries) {
			this.dependencies.getParent(childState.parentThreadId)?.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
				runId: childState.runId,
				deliveryStatus: "failed",
				error
			});
			this.dependencies.unregisterChild(childState);
			return;
		}
		const delayMs = delayForAttempt(this.retryDelaysMs, chargeAttempt ? childState.completionDeliveryAttempt++ : childState.completionDeliveryAttempt);
		childState.completionDeliveryTimer = setTimeout(() => {
			childState.completionDeliveryTimer = void 0;
			if (!this.dependencies.isCurrentChild(childState)) return;
			const state = this.dependencies.getParent(childState.parentThreadId);
			if (state) this.deliverPending(state, childState);
		}, delayMs);
		childState.completionDeliveryTimer.unref();
	}
	claim(state, childState) {
		const requesterSessionKey = state.requesterSessionKey?.trim();
		if (!requesterSessionKey) return true;
		const key = `${requesterSessionKey}\0${childState.runId}`;
		const runId = childState.runId;
		const tasks = state.taskRuntime?.listTaskRecords().filter((record) => record.runId === runId) ?? [];
		const task = tasks[0];
		if (tasks.length > 1 || childState.completionTaskId && task?.taskId !== childState.completionTaskId) return false;
		if (task?.deliveryStatus === "delivered") return false;
		try {
			assertHistoryOwnerMatchesRegistration(readCodexNativeSubagentHistoryOwner(task?.detail), state.historyOwner, childState.nativeParentThreadId, childState.requiresHistoryOwner === true);
		} catch (error) {
			embeddedAgentLog.warn("Holding native completion with unresolved history owner", {
				childThreadId: childState.childThreadId,
				error: formatErrorMessage(error)
			});
			return false;
		}
		const owner = completionDeliveryOwners.get(key);
		if (owner) return owner === childState;
		childState.completionTaskId = task?.taskId;
		completionDeliveryOwners.set(key, childState);
		childState.deliveryOwnerKey = key;
		return true;
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-notification.ts
/**
* Extracts native Codex subagent completion notifications from trusted
* contextual and inter-agent messages emitted by the app-server.
*/
const CODEX_SUBAGENT_NOTIFICATION_START = "<subagent_notification>";
const CODEX_SUBAGENT_NOTIFICATION_END = "</subagent_notification>";
/** Extracts trusted subagent completion payloads from a Codex server notification. */
function extractCodexNativeSubagentCompletions(notification) {
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	if (!params) return [];
	const item = isJsonObject(params.item) ? params.item : void 0;
	if (!item) return [];
	if (notification.method === "rawResponseItem/completed" && item.role === "user") return readTrustedContextualCompletions(item);
	return [];
}
function readTrustedContextualCompletions(item) {
	const content = item.content;
	const metadata = item.internal_chat_message_metadata_passthrough;
	const kinds = isJsonObject(metadata) ? metadata.content_item_kinds : void 0;
	if (item.type !== "message" || !Array.isArray(content) || !Array.isArray(kinds) || content.length !== kinds.length) return [];
	return content.flatMap((entry, index) => {
		if (kinds[index] !== "multi_agent.subagent_notification" || !isJsonObject(entry) || entry.type !== "input_text") return [];
		const text = readStringField(entry, "text")?.trim();
		if (!text?.startsWith(CODEX_SUBAGENT_NOTIFICATION_START) || !text.endsWith(CODEX_SUBAGENT_NOTIFICATION_END)) return [];
		const completion = parseCodexNativeSubagentNotificationBody(text.slice(23, -24));
		return completion ? [completion] : [];
	});
}
const codexNativeSubagentNotifications = {
	fromNotification: extractCodexNativeSubagentCompletions,
	deliveredAgentPaths: readDeliveredNativeCompletionPaths
};
/** Reads native delivery receipts, leaving status and result ownership with the child lifecycle. */
function readDeliveredNativeCompletionPaths(notification) {
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	const item = isJsonObject(params?.item) ? params.item : void 0;
	if (notification.method === "item/completed" && item?.type === "collabAgentToolCall" && item.tool === "wait" && (item.status === "completed" || item.status === "failed") && item.senderThreadId === params?.threadId && Array.isArray(item.receiverThreadIds) && isJsonObject(item.agentsStates)) {
		const receivers = new Set(item.receiverThreadIds);
		return Object.entries(item.agentsStates).flatMap(([threadId, state]) => receivers.has(threadId) && isJsonObject(state) && [
			"completed",
			"errored",
			"shutdown",
			"notFound"
		].includes(readStringField(state, "status") ?? "") ? [threadId] : []);
	}
	if (notification.method !== "rawResponseItem/completed") return [];
	if (!item || readStringField(item, "type") !== "agent_message") return extractCodexNativeSubagentCompletions(notification).map((completion) => completion.agentPath);
	const author = readStringField(item, "author");
	const recipient = readStringField(item, "recipient");
	const content = item.content;
	if (!author || !recipient || !Array.isArray(content) || content.length !== 1) return [];
	const part = content[0];
	if (!isJsonObject(part) || readStringField(part, "type") !== "input_text") return [];
	return readStringField(part, "text")?.startsWith(`Message Type: FINAL_ANSWER\nTask name: ${recipient}\nSender: ${author}\nPayload:\n`) ? [author] : [];
}
function parseCodexNativeSubagentNotificationBody(body) {
	let payload;
	try {
		payload = JSON.parse(body.trim());
	} catch {
		return;
	}
	if (!isJsonObject(payload)) return;
	const agentPath = readStringField(payload, "agent_path")?.trim();
	const completion = readCompletionStatus(payload.status);
	return agentPath && completion ? {
		agentPath,
		...completion
	} : void 0;
}
function readCompletionStatus(status) {
	if (status === "shutdown" || status === "not_found") return {
		status: status === "shutdown" ? "cancelled" : "failed",
		statusLabel: status,
		result: "(no output)"
	};
	if (!isJsonObject(status)) return;
	const completed = status.completed;
	if (completed === null || typeof completed === "string") {
		const result = completed?.trim();
		return {
			status: "succeeded",
			statusLabel: result ? "completed" : "completed_without_final_message",
			result: result || "Subagent completed without a final assistant message."
		};
	}
	const error = readStringField(status, "errored");
	return error === void 0 ? void 0 : {
		status: "failed",
		statusLabel: "errored",
		result: error.trim() || "(no output)"
	};
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-delivery-receipts.ts
function buildCodexNativeSubagentAgentPathKey(parentThreadId, agentPath) {
	return `${parentThreadId}\0${agentPath}`;
}
function resolveCodexNativeSubagentReceiptOwner(params) {
	const { state, childThreadId, known, candidates, isRetiredParent } = params;
	if (known?.parent === state) return known.deliveryReceipts;
	for (const candidate of candidates) if (candidate.childThreadId === childThreadId && candidate.parentState.parentThreadId === state.parentThreadId && candidate.requesterSessionKey === state.requesterSessionKey && !isRetiredParent(candidate.parentState)) return candidate.deliveryReceipts;
	return state.deliveryReceipts;
}
function registerCodexNativeSubagentReceiptAlias(params) {
	const { state, childThreadId, agentPath, known, aliases } = params;
	if (known?.parent !== state) return [];
	const key = buildCodexNativeSubagentAgentPathKey(state.parentThreadId, agentPath);
	const existingChild = aliases.get(key);
	if (existingChild && existingChild !== childThreadId) {
		embeddedAgentLog.warn("Ignoring conflicting Codex native subagent agent path", {
			parentThreadId: state.parentThreadId,
			agentPath,
			existingChildThreadId: existingChild,
			attemptedChildThreadId: childThreadId
		});
		return [];
	}
	aliases.set(key, childThreadId);
	known.agentPaths.add(agentPath);
	return known.deliveryReceipts.addAlias(childThreadId, agentPath);
}
/** Correlates native receipts with immutable assignments while a parent is registered. */
var CodexNativeSubagentDeliveryReceipts = class {
	constructor() {
		this.seen = /* @__PURE__ */ new Set();
		this.pending = [];
		this.outcomes = /* @__PURE__ */ new Map();
	}
	observe(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const item = isJsonObject(params?.item) ? params.item : void 0;
		if (!item) return [];
		const nativeResults = codexNativeSubagentNotifications.fromNotification(notification);
		for (const agentPath of codexNativeSubagentNotifications.deliveredAgentPaths(notification)) {
			const id = `${notification.method}:${readStringField(item, "id") ?? JSON.stringify(item)}:${agentPath}`;
			if (this.seen.has(id)) continue;
			this.seen.add(id);
			let result = nativeResults.find((value) => value.agentPath === agentPath)?.result;
			if (item.type === "agent_message" && Array.isArray(item.content)) {
				const part = item.content[0];
				result = (isJsonObject(part) ? readStringField(part, "text") : void 0)?.split("\nPayload:\n").slice(1).join("\nPayload:\n");
			} else if (isJsonObject(item.agentsStates)) {
				const child = item.agentsStates[agentPath];
				result = isJsonObject(child) ? readStringField(child, "message") : result;
			}
			this.pending.push({
				agentPath,
				result: receiptResultKey(result)
			});
		}
		return this.match();
	}
	record(runId, paths, result) {
		const outcome = this.outcomes.get(runId) ?? {
			paths: new Set(paths),
			received: false,
			receiptResults: /* @__PURE__ */ new Set()
		};
		outcome.result = receiptResultKey(result);
		this.outcomes.set(runId, outcome);
		const matched = this.match();
		return outcome.received ? [.../* @__PURE__ */ new Set([...matched, runId])] : matched;
	}
	track(runId, paths) {
		const outcome = this.outcomes.get(runId) ?? {
			paths: /* @__PURE__ */ new Set(),
			received: false,
			receiptResults: /* @__PURE__ */ new Set()
		};
		for (const path of paths) outcome.paths.add(path);
		this.outcomes.set(runId, outcome);
		const matched = this.match();
		return outcome.received ? [.../* @__PURE__ */ new Set([...matched, runId])] : matched;
	}
	restore(assignments) {
		const restored = /* @__PURE__ */ new Map();
		for (const assignment of assignments) {
			const outcome = this.outcomes.get(assignment.runId) ?? {
				paths: /* @__PURE__ */ new Set(),
				received: false,
				receiptResults: /* @__PURE__ */ new Set()
			};
			for (const path of assignment.paths) outcome.paths.add(path);
			outcome.result ??= receiptResultKey(assignment.result);
			restored.set(assignment.runId, outcome);
		}
		for (const [runId, outcome] of this.outcomes) if (!restored.has(runId)) restored.set(runId, outcome);
		this.outcomes = restored;
		const matched = this.match();
		return [.../* @__PURE__ */ new Set([...matched, ...[...restored].filter(([, value]) => value.received).map(([id]) => id)])];
	}
	resumeAssignment(runId, pendingRunIds) {
		for (const pendingRunId of pendingRunIds) this.outcomes.delete(pendingRunId);
		return this.track(runId, []);
	}
	addAlias(threadId, agentPath) {
		for (const outcome of this.outcomes.values()) if (outcome.paths.has(threadId)) outcome.paths.add(agentPath);
		return this.match();
	}
	match() {
		const received = [];
		for (let index = 0; index < this.pending.length;) {
			const receipt = this.pending[index];
			const matches = [...this.outcomes].filter(([, outcome]) => outcome.paths.has(receipt.agentPath));
			let match;
			for (const candidate of matches) {
				const outcome = candidate[1];
				if (outcome.result !== void 0 && outcome.result === receipt.result || outcome.receiptResults.has(receipt.result)) {
					match = candidate;
					break;
				}
				if (outcome.result === void 0) {
					match = matches.length === 1 ? candidate : void 0;
					break;
				}
			}
			if (!match) {
				index += 1;
				continue;
			}
			match[1].receiptResults.add(receipt.result);
			if (!match[1].received) {
				match[1].received = true;
				received.push(match[0]);
			}
			this.pending.splice(index, 1);
		}
		return received;
	}
};
function restoreCodexNativeSubagentTaskReceipts(params) {
	const { state, taskRecords, knownChildren, applyReceipts } = params;
	const snapshots = /* @__PURE__ */ new Map();
	for (const task of taskRecords.toReversed().toSorted((a, b) => (a.startedAt ?? a.createdAt) - (b.startedAt ?? b.createdAt))) {
		if (task.requesterSessionKey !== state.requesterSessionKey) continue;
		const assignment = readNativeTaskAssignment(task);
		if (!assignment) continue;
		const known = knownChildren.get(assignment.childThreadId);
		const history = readCodexNativeSubagentHistoryOwner(task.detail);
		if (known && known.parent !== state || (history ? history.parentThreadId !== (known?.nativeParentThreadId ?? state.parentThreadId) : known?.parent !== state)) continue;
		const receipts = known?.deliveryReceipts ?? state.deliveryReceipts;
		const snapshot = snapshots.get(receipts) ?? [];
		snapshot.push({
			runId: assignment.runId,
			paths: known?.agentPaths ?? [assignment.childThreadId],
			...task.terminalSummary ? { result: task.terminalSummary } : {}
		});
		snapshots.set(receipts, snapshot);
	}
	for (const [threadId, known] of knownChildren) {
		if (known.parent !== state || known.pendingTurns.length === 0) continue;
		const snapshot = snapshots.get(known.deliveryReceipts) ?? [];
		for (const turn of known.pendingTurns) snapshot.push({
			runId: codexNativeSubagentRunId(threadId, turn.turnId),
			paths: known.agentPaths
		});
		snapshots.set(known.deliveryReceipts, snapshot);
	}
	for (const [receipts, snapshot] of snapshots) applyReceipts(receipts.restore(snapshot));
}
function observeCodexNativeSubagentDeliveryReceipts(params) {
	const { state, notification, knownChildren, candidates, isRetiredParent, applyReceipts } = params;
	const trackers = /* @__PURE__ */ new Set([state.deliveryReceipts]);
	for (const known of knownChildren) if (known.parent === state) trackers.add(known.deliveryReceipts);
	for (const candidate of candidates) if (candidate.parentState.parentThreadId === state.parentThreadId && candidate.requesterSessionKey === state.requesterSessionKey && !isRetiredParent(candidate.parentState)) trackers.add(candidate.deliveryReceipts);
	for (const tracker of trackers) applyReceipts(tracker.observe(notification));
}
function receiptResultKey(result) {
	return result?.replace(/\s+/g, " ").trim();
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-monitor-runtime.ts
const defaultNativeSubagentMonitorRuntime = {
	createAgentHarnessTaskRuntime,
	deliverAgentHarnessTaskCompletion
};
function createCodexNativeSubagentMonitorRuntime(Monitor) {
	const monitors = /* @__PURE__ */ new WeakMap();
	function registerMonitor(params) {
		let monitor = monitors.get(params.client);
		if (!monitor) {
			const childThreadOwnership = /* @__PURE__ */ new Map();
			const childThreadTransitions = new KeyedAsyncQueue();
			const releaseOwnership = async (threadId, ownership) => {
				if (!ownership) return;
				await ownership.release(threadId);
				if (childThreadOwnership.get(threadId) === ownership) childThreadOwnership.delete(threadId);
			};
			monitor = new Monitor(params.client, params.runtime ?? defaultNativeSubagentMonitorRuntime, {
				retainClient: params.retainClient,
				retainParentThread: params.retainParentThread,
				hasObservationBacking: (parentThreadId, childThreadId) => hasCodexAppServerLiveThread(params.client, parentThreadId) || hasCodexAppServerLiveThread(params.client, childThreadId),
				claimChildThread: (threadId) => childThreadTransitions.enqueue(threadId, async () => {
					let ownership;
					let invalidated = false;
					ownership = await claimCodexAppServerLiveThread(params.client, threadId, () => {
						invalidated = true;
						if (childThreadOwnership.get(threadId) === ownership) childThreadOwnership.delete(threadId);
						ownership = void 0;
					});
					if (ownership && !invalidated) childThreadOwnership.set(threadId, ownership);
					return invalidated ? void 0 : ownership;
				}),
				retainChildThread: (threadId) => childThreadTransitions.enqueue(threadId, async () => {
					const ownership = childThreadOwnership.get(threadId);
					if (!ownership) return false;
					let retained = false;
					try {
						retained = await retainCodexAppServerLiveThread(params.client, threadId, ownership.release);
						return retained;
					} finally {
						if (!retained) {
							await ownership.release(threadId);
							if (childThreadOwnership.get(threadId) === ownership) childThreadOwnership.delete(threadId);
						}
					}
				}),
				releaseChildThread: (threadId) => childThreadTransitions.enqueue(threadId, () => releaseOwnership(threadId, childThreadOwnership.get(threadId))),
				captureChildThreadForget: (threadId) => childThreadTransitions.enqueue(threadId, async () => {
					return childThreadOwnership.get(threadId)?.forget;
				})
			});
			monitors.set(params.client, monitor);
		}
		return monitor.registerParent({
			parentThreadId: params.parentThreadId,
			requesterSessionKey: params.requesterSessionKey,
			taskRuntimeScope: params.taskRuntimeScope,
			historyOwner: params.historyOwner,
			submissionStore: params.submissionStore,
			agentId: params.agentId,
			claimDirectChild: params.claimDirectChild,
			rejectPendingDirectChild: params.rejectPendingDirectChild,
			onDirectChildAccepted: params.onDirectChildAccepted
		});
	}
	return {
		Monitor,
		register: registerMonitor,
		retireParent: (client, parentThreadId) => {
			monitors.get(client)?.retireParent(parentThreadId);
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-submission-call.ts
function hasSubmissionCallCustody(state, call, hasObservationBacking) {
	return Boolean(call.accepted && call.targets.some(({ childThreadId }) => state.owners.size > 0 || hasObservationBacking?.(state.parentThreadId, childThreadId)));
}
function captureSubmissionPredecessor(params) {
	const { state, known, child } = params;
	if (known?.parent !== state) return;
	if (!known.assignment.nativeTurnId) return child && child.runId === known.assignment.runId && !child.terminal && !known.assignment.terminal && !known.assignment.unanchored ? { child } : void 0;
	return {
		runId: known.assignment.runId,
		nativeTurnId: known.assignment.nativeTurnId,
		terminal: known.assignment.terminal || child?.nativeTurnState === "completed" || child?.nativeTurnState === "failed"
	};
}
function observeSubmissionPredecessor(params) {
	const { state, call, threadId, turn, known } = params;
	const submissionId = call.submissionId;
	if (!call.accepted || !submissionId) return;
	call.targets = call.targets.filter(({ childThreadId, predecessor }) => {
		if (childThreadId !== threadId || !("child" in predecessor)) return true;
		const child = predecessor.child;
		if (known?.parent !== state || known.assignment.runId !== child.runId || state.owners.size === 0 && !params.hasObservationBacking?.(state.parentThreadId, threadId)) return false;
		const nativeTurnId = child.nativeTurnId;
		if (!nativeTurnId || nativeTurnId === submissionId || known.assignment.nativeTurnId !== nativeTurnId) return true;
		const nativeState = (readStringField(turn, "id") === nativeTurnId ? readNativeTurnEnd(turn) : void 0) ?? child.nativeTurnState;
		const owner = call.owner && [...state.owners.values()].includes(call.owner) ? call.owner : void 0;
		if (nativeState === "interrupted") {
			if (owner) params.acceptContinuation(owner);
			return false;
		}
		if (!known.assignment.terminal && nativeState !== "completed" && nativeState !== "failed") return true;
		params.capture({
			parentTurnId: call.parentTurnId,
			callId: call.callId,
			childThreadId,
			submissionId,
			predecessorRunId: child.runId,
			predecessorNativeTurnId: nativeTurnId
		}, owner);
		return false;
	});
	if (call.targets.length === 0) call.owner = void 0;
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-submission-owner.ts
/** Captures successful native submissions before their turn notifications arrive. */
var CodexNativeSubagentSubmissionOwner = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.calls = /* @__PURE__ */ new Map();
		this.pending = /* @__PURE__ */ new Map();
		this.writes = /* @__PURE__ */ new Map();
		this.disposed = false;
		this.pollDelays = dependencies.recoveryPollDelaysMs ?? DEFAULT_RECOVERY_POLL_DELAYS_MS;
	}
	isCurrent(state) {
		if (this.dependencies.isCurrent(state)) return true;
		this.retire(state);
		this.dependencies.onSettled(state);
		return false;
	}
	nativeParentThreadId(state, childThreadId) {
		const known = this.dependencies.knownChildren.get(childThreadId);
		return known?.parent === state ? known.nativeParentThreadId : state.parentThreadId;
	}
	isObserving(state, custody) {
		if (this.disposed || custody.phase === "promoting" || custody.phase === "settled" || !this.isCurrent(state)) return false;
		if (custody.phase === "detached" && !this.dependencies.hasObservationBacking?.(state.parentThreadId, custody.receipt.childThreadId)) {
			this.finishCustody(state, custody);
			return false;
		}
		return true;
	}
	observedTurn(state, threadId, turnId) {
		const known = this.dependencies.knownChildren.get(threadId);
		if (known?.parent !== state) return;
		const pending = known.pendingTurns.find((turn) => turn.turnId === turnId);
		const child = this.dependencies.currentChild(threadId);
		const status = pending?.state ?? (child?.nativeTurnId === turnId ? child.nativeTurnState : void 0);
		return status ? {
			id: turnId,
			status: status === "active" ? "inProgress" : status
		} : void 0;
	}
	observeCall(state, turnId, item) {
		const callId = readStringField(item, "id");
		if (!turnId || !callId || !this.isCurrent(state)) return;
		const owner = this.dependencies.parentOwner(state, turnId);
		if (!owner && ![...state.owners.values()].some((candidate) => !candidate.turnId)) return;
		const calls = this.calls.get(state) ?? /* @__PURE__ */ new Map();
		const key = `${turnId}\0${callId}`;
		if (calls.has(key) || !owner && calls.size >= 32) return;
		const targets = (Array.isArray(item.receiverThreadIds) ? item.receiverThreadIds : []).flatMap((id) => {
			if (typeof id !== "string") return [];
			this.dependencies.prepareReceiver(state, id);
			const predecessor = captureSubmissionPredecessor({
				state,
				known: this.dependencies.knownChildren.get(id),
				child: this.dependencies.currentChild(id)
			});
			return predecessor ? [{
				childThreadId: id,
				predecessor
			}] : [];
		});
		if (!targets.length) return;
		calls.set(key, {
			parentTurnId: turnId,
			callId,
			targets,
			owner
		});
		this.calls.set(state, calls);
	}
	observeOutput(state, turnId, item) {
		if (item.type !== "function_call_output" || !turnId) return;
		const key = `${turnId}\0${readStringField(item, "call_id") ?? ""}`;
		const call = this.calls.get(state)?.get(key);
		if (!call || call.closed) return;
		let output;
		try {
			output = JSON.parse(readStringField(item, "output") ?? "");
		} catch {}
		const submissionId = isJsonObject(output) ? readStringField(output, "submission_id")?.trim() : void 0;
		if (!submissionId) {
			call.closed = true;
			return;
		}
		call.submissionId = submissionId;
		this.accept(state, call);
	}
	bind(state, turnId) {
		for (const call of this.calls.get(state)?.values() ?? []) if (call.parentTurnId === turnId && call.submissionId) this.accept(state, call);
	}
	restore(state) {
		try {
			for (const receipt of state.submissionStore?.read() ?? []) this.capture(state, receipt);
		} catch (error) {
			embeddedAgentLog.warn("Cannot recover native follow-up submission receipts", { error: formatErrorMessage(error) });
		}
	}
	observeTurn(threadId, turn) {
		const turnId = readStringField(turn, "id");
		if (!turnId) return;
		this.observeKnownChild(threadId, turn);
		for (const [state, entries] of this.pending) for (const custody of entries.values()) if (custody.receipt.childThreadId === threadId && custody.receipt.submissionId === turnId) this.promote(state, custody, turn);
	}
	hasCustody(state) {
		return Boolean(this.pending.get(state)?.size || this.writes.get(state)?.size) || [...this.calls.get(state)?.values() ?? []].some((call) => hasSubmissionCallCustody(state, call, this.dependencies.hasObservationBacking));
	}
	hasChildCustody(state, childThreadId) {
		return [...this.pending.get(state)?.values() ?? []].some((entry) => entry.receipt.childThreadId === childThreadId) || [...this.calls.get(state)?.values() ?? []].some((call) => call.targets.some((target) => target.childThreadId === childThreadId) && hasSubmissionCallCustody(state, call, this.dependencies.hasObservationBacking));
	}
	async drain(state) {
		const calls = this.calls.get(state);
		const hasUnboundOwner = [...state.owners.values()].some((owner) => !owner.turnId);
		for (const [key, call] of calls ?? []) {
			if (hasSubmissionCallCustody(state, call, this.dependencies.hasObservationBacking)) {
				if (!call.owner || ![...state.owners.values()].includes(call.owner)) call.owner = void 0;
				continue;
			}
			if (call.owner && ![...state.owners.values()].includes(call.owner) || !this.dependencies.parentOwner(state, call.parentTurnId) && !hasUnboundOwner) calls.delete(key);
		}
		if (!calls?.size) this.calls.delete(state);
		while (this.writes.get(state)?.size) await Promise.allSettled(this.writes.get(state));
		if (state.owners.size === 0) for (const custody of this.pending.get(state)?.values() ?? []) {
			if (custody.phase === "captured") {
				custody.phase = "detached";
				custody.owner = void 0;
				custody.release();
			}
			this.isObserving(state, custody);
		}
	}
	retire(state) {
		this.calls.delete(state);
		for (const custody of this.pending.get(state)?.values() ?? []) {
			custody.phase = "settled";
			if (custody.timer) clearTimeout(custody.timer);
			custody.release();
		}
		this.pending.delete(state);
	}
	dispose() {
		this.disposed = true;
		for (const state of this.pending.keys()) this.retire(state);
		this.calls.clear();
	}
	accept(state, call) {
		const owner = this.dependencies.parentOwner(state, call.parentTurnId);
		if (call.closed || !owner || call.owner && owner !== call.owner || !call.submissionId || !this.isCurrent(state)) return;
		call.closed = true;
		call.accepted = true;
		call.owner = owner;
		const targets = call.targets;
		call.targets = [];
		for (const target of targets) {
			const { childThreadId, predecessor } = target;
			if ("child" in predecessor) {
				call.targets.push(target);
				continue;
			}
			if (!predecessor.terminal) {
				this.dependencies.acceptContinuation(state, owner, childThreadId, call);
				continue;
			}
			this.capture(state, {
				parentTurnId: call.parentTurnId,
				callId: call.callId,
				childThreadId,
				submissionId: call.submissionId,
				predecessorRunId: predecessor.runId,
				predecessorNativeTurnId: predecessor.nativeTurnId
			}, owner, true);
		}
		for (const { childThreadId } of call.targets) this.observeKnownChild(childThreadId);
	}
	observeKnownChild(threadId, turn) {
		for (const [state, calls] of this.calls) {
			if (!this.isCurrent(state)) continue;
			for (const call of calls.values()) observeSubmissionPredecessor({
				state,
				call,
				threadId,
				turn,
				known: this.dependencies.knownChildren.get(threadId),
				hasObservationBacking: this.dependencies.hasObservationBacking,
				acceptContinuation: (owner) => this.dependencies.acceptContinuation(state, owner, threadId, call),
				capture: (receipt, owner) => this.capture(state, receipt, owner, true)
			});
			this.dependencies.onSettled(state);
		}
	}
	capture(state, receipt, owner, persist = false) {
		if (this.disposed || !this.isCurrent(state)) return;
		const entries = this.pending.get(state) ?? /* @__PURE__ */ new Map();
		const key = `${receipt.parentTurnId}\0${receipt.callId}\0${receipt.childThreadId}`;
		if (entries.has(key)) return;
		const foreground = state.owners.size > 0;
		const custody = {
			receipt: Object.freeze({ ...receipt }),
			owner,
			release: foreground ? this.dependencies.retain(state, receipt.childThreadId) : () => {},
			recorded: Promise.resolve(),
			phase: foreground ? "captured" : "detached",
			attempt: 0
		};
		entries.set(key, custody);
		this.pending.set(state, entries);
		if (persist && state.submissionStore) custody.recorded = this.track(state, (async () => {
			try {
				if (!await state.submissionStore.record(receipt, () => this.dependencies.assertPersistenceCurrent(state))) throw new Error("Native submission binding changed before receipt persistence.");
			} catch (error) {
				embeddedAgentLog.warn("Accepted native follow-up lost restart protection; retaining local observation", { error: formatErrorMessage(error) });
			}
		})());
		const observed = this.observedTurn(state, receipt.childThreadId, receipt.submissionId);
		if (observed) this.promote(state, custody, observed);
		if (custody.phase !== "promoting") this.reconcile(state, custody);
	}
	promote(state, custody, turn, historyValidated = false) {
		if (!this.isObserving(state, custody) || !this.admitTurn(state, custody.receipt, turn, custody.owner, historyValidated)) return;
		custody.phase = "promoting";
		if (custody.timer) clearTimeout(custody.timer);
		const consumed = (async () => {
			await custody.recorded;
			if (state.submissionStore) try {
				await state.submissionStore.consume(custody.receipt, () => this.dependencies.assertPersistenceCurrent(state));
			} catch (error) {
				embeddedAgentLog.warn("Native follow-up task is persisted but its receipt remains for reconciliation", { error: formatErrorMessage(error) });
			}
			this.finishCustody(state, custody);
		})();
		this.track(state, consumed);
	}
	async reconcile(state, custody) {
		if (!this.isObserving(state, custody)) return;
		try {
			const turn = await this.readTurn(state, custody);
			if (turn) this.promote(state, custody, turn, true);
		} catch (error) {
			embeddedAgentLog.warn("Failed to reconcile an accepted native follow-up receipt", { error: formatErrorMessage(error) });
		}
		if (!this.isObserving(state, custody) || !this.pollDelays.length) return;
		custody.timer = setTimeout(() => {
			custody.timer = void 0;
			this.reconcile(state, custody);
		}, delayForAttempt(this.pollDelays, custody.attempt++));
		custody.timer.unref();
	}
	async readTurn(state, custody) {
		const { receipt } = custody;
		if (!this.dependencies.prepareReceiver(state, receipt.childThreadId)) return;
		const revision = this.dependencies.recovery.retainThreadStatusRevision(receipt.childThreadId);
		try {
			const response = await this.dependencies.client.request("thread/read", {
				threadId: receipt.childThreadId,
				includeTurns: true
			}, { timeoutMs: 3e4 });
			if (!revision.isCurrent() || !this.isObserving(state, custody)) return;
			const thread = isJsonObject(response.thread) ? response.thread : void 0;
			if (readStringField(thread, "id") !== receipt.childThreadId || readThreadParentThreadId(thread) !== this.nativeParentThreadId(state, receipt.childThreadId)) return;
			const turns = [];
			for (const turn of Array.isArray(thread?.turns) ? thread.turns : []) if (isJsonObject(turn)) turns.push(turn);
			const predecessorIndex = turns.findIndex((turn) => readStringField(turn, "id") === receipt.predecessorNativeTurnId);
			const turnIndex = turns.findIndex((turn) => readStringField(turn, "id") === receipt.submissionId);
			if (predecessorIndex < 0 || turnIndex <= predecessorIndex || !["completed", "failed"].includes(readStringField(turns[predecessorIndex], "status") ?? "")) return;
			const previous = this.dependencies.currentChild(receipt.childThreadId);
			if (previous && !previous.terminal && previous.nativeTurnId !== receipt.submissionId) await this.dependencies.recovery.reconcileRegisteredChild(previous);
			return this.isObserving(state, custody) ? turns[turnIndex] : void 0;
		} finally {
			revision.release();
		}
	}
	finishCustody(state, custody) {
		custody.phase = "settled";
		if (custody.timer) clearTimeout(custody.timer);
		const entries = this.pending.get(state);
		for (const [key, entry] of entries ?? []) if (entry === custody) entries.delete(key);
		if (!entries?.size) this.pending.delete(state);
		custody.release();
		this.dependencies.onSettled(state);
	}
	admitTurn(state, receipt, turn, owner, historyValidated) {
		if (readStringField(turn, "id") !== receipt.submissionId || this.disposed || !this.isCurrent(state)) return false;
		const runId = codexNativeSubagentRunId(receipt.childThreadId, receipt.submissionId);
		const records = state.taskRuntime?.listTaskRecords() ?? [];
		const existing = records.find((task) => task.runId === runId);
		if (existing) {
			const assignment = readNativeTaskAssignment(existing);
			const history = readCodexNativeSubagentHistoryOwner(existing.detail);
			if (assignment?.nativeTurnId !== receipt.submissionId || history && history.parentThreadId !== this.nativeParentThreadId(state, receipt.childThreadId)) return false;
			if ((existing.status === "succeeded" || existing.status === "failed" || existing.status === "cancelled") && existing.deliveryStatus === "delivered") return true;
		}
		let known = this.dependencies.knownChildren.get(receipt.childThreadId);
		if (!known) {
			if (!historyValidated) return false;
			this.dependencies.restoreKnownChild(state, {
				runId: receipt.predecessorRunId,
				childThreadId: receipt.childThreadId,
				nativeTurnId: receipt.predecessorNativeTurnId
			}, records);
			known = this.dependencies.knownChildren.get(receipt.childThreadId);
			if (known && known.assignment.runId === receipt.predecessorRunId && !records.some((task) => task.runId === receipt.predecessorRunId)) known.assignment.terminal = true;
		}
		if (known?.parent !== state) return false;
		if (known.assignment.runId !== receipt.predecessorRunId && known.assignment.runId !== runId && !known.pendingTurns.some((pending) => pending.turnId === receipt.submissionId)) return false;
		if (known.assignment.runId === receipt.predecessorRunId && known.assignment.nativeTurnId !== receipt.predecessorNativeTurnId) return false;
		const nativeState = readStringField(turn, "status") === "inProgress" ? "active" : readNativeTurnEnd(turn);
		if (!nativeState) return false;
		if (known.assignment.runId === runId) {
			const child = this.dependencies.currentChild(receipt.childThreadId) ?? this.dependencies.registerChild(state, {
				runId,
				childThreadId: receipt.childThreadId,
				nativeTurnId: receipt.submissionId
			}, { admitAssignment: true });
			if (!child) return false;
			child.nativeTurnState = nativeState;
		} else {
			let pending = known.pendingTurns.find((candidate) => candidate.turnId === receipt.submissionId);
			if (!pending) {
				pending = {
					turnId: receipt.submissionId,
					state: nativeState
				};
				known.pendingTurns.push(pending);
				known.observedTurns.set(receipt.submissionId, {});
			}
			pending.state = nativeState;
			pending.admittedSubmission = receipt;
			if (owner && pending.admittedOwner !== owner && [...state.owners.values()].includes(owner)) {
				pending.admittedOwner = owner;
				owner.onDirectChildAccepted?.();
			}
			this.dependencies.admitFollowup(known, receipt.childThreadId);
		}
		const child = this.dependencies.currentChild(receipt.childThreadId);
		if (child?.runId !== runId) return false;
		if (!state.taskRuntime?.listTaskRecords().some((task) => task.runId === runId)) return false;
		if (nativeState === "active") this.dependencies.resumeChild(child);
		else if (Array.isArray(turn.items)) this.dependencies.completeChild({
			method: "turn/completed",
			params: {
				threadId: receipt.childThreadId,
				turn
			}
		}, child).catch((error) => logRecoveryFailure(receipt.childThreadId, error));
		return true;
	}
	track(state, operation) {
		const writes = this.writes.get(state) ?? /* @__PURE__ */ new Set();
		writes.add(operation);
		this.writes.set(state, writes);
		const remove = () => {
			writes.delete(operation);
			if (!writes.size) this.writes.delete(state);
			this.dependencies.onSettled(state);
		};
		operation.then(remove, remove);
		return operation;
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-task-mirror.ts
/** Projects Codex thread and collab-agent notifications into task lifecycle updates. */
var CodexNativeSubagentTaskMirror = class {
	constructor(params, runtime) {
		this.params = params;
		this.runtime = runtime;
		this.mirrorStateByThreadId = /* @__PURE__ */ new Map();
		this.terminalRunIds = /* @__PURE__ */ new Set();
		this.authoritativeRunIds = /* @__PURE__ */ new Set();
		this.runIdsByThreadId = /* @__PURE__ */ new Map();
		this.now = params.now ?? Date.now;
	}
	markAuthoritativeCompletion(childThreadId, runId = this.runId(childThreadId)) {
		this.authoritativeRunIds.add(runId);
		this.terminalRunIds.add(runId);
	}
	restoreCurrentTaskRun(threadId, runId) {
		this.runIdsByThreadId.set(threadId, runId);
		this.mirrorStateByThreadId.set(threadId, "mirrored");
	}
	startFollowupTurn(threadId, turnId, nativeParentThreadId) {
		const previousRunId = this.runId(threadId);
		const previous = this.runtime.listTaskRecords().find((task) => task.runId === previousRunId);
		const runId = codexNativeSubagentRunId(threadId, turnId);
		this.runIdsByThreadId.set(threadId, runId);
		this.mirrorStateByThreadId.delete(threadId);
		this.createRunningTask({
			threadId,
			turnId,
			nativeParentThreadId,
			label: previous?.label ?? "Subagent",
			task: previous?.task ?? "Subagent follow-up",
			startedAt: this.now(),
			progressSummary: "Subagent started follow-up work."
		});
	}
	recordNativeTurn(runId, turnId) {
		const task = this.runtime.listTaskRecords().find((record) => record.runId === runId);
		const detail = isJsonObject(task?.detail) ? task.detail : {};
		if (!task || detail.nativeTurnId === turnId) return;
		this.runtime.tryCreateRunningTaskRun({
			runId,
			sourceId: task.sourceId,
			label: task.label,
			task: task.task,
			notifyPolicy: task.notifyPolicy,
			deliveryStatus: task.deliveryStatus,
			detail: {
				...detail,
				nativeTurnId: turnId
			}
		});
	}
	runId(threadId) {
		return this.runIdsByThreadId.get(threadId) ?? codexNativeSubagentRunId(threadId);
	}
	handleNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		if (notification.method === "thread/started") {
			this.handleThreadStarted(params);
			return;
		}
		if (notification.method === "thread/status/changed") {
			this.handleThreadStatusChanged(params);
			return;
		}
		if (notification.method === "item/started" || notification.method === "item/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			if (notification.method === "item/completed" && item && readStringField(item, "type") === "subAgentActivity") {
				this.handleSubagentActivityItem(params);
				return;
			}
			this.handleCollabAgentItem(params);
		}
	}
	handleThreadStarted(params) {
		const notification = readThreadStartedNotification(params);
		if (!notification) return;
		const thread = notification.thread;
		const spawn = readSubagentThreadSpawnSource(thread.source, this.params.parentThreadId);
		if (!spawn) return;
		const threadId = thread.id.trim();
		const label = normalizeOptionalString(spawn.agent_nickname) ?? normalizeOptionalString(thread.agentNickname) ?? normalizeOptionalString(spawn.agent_role) ?? normalizeOptionalString(thread.agentRole) ?? "Subagent";
		const task = normalizeOptionalString(thread.preview) ?? `Subagent${label === "Subagent" ? "" : ` ${label}`}`;
		const createdAt = secondsToMillis(thread.createdAt) ?? this.now();
		if (!this.createRunningTask({
			threadId,
			label,
			task,
			startedAt: createdAt,
			progressSummary: "Subagent started."
		})) return;
		this.applyStatus(threadId, thread.status);
	}
	handleThreadStatusChanged(params) {
		const notification = readThreadStatusChangedNotification(params);
		if (!notification) return;
		this.applyStatus(notification.threadId, notification.status);
	}
	applyStatus(threadId, status) {
		if (this.mirrorStateByThreadId.get(threadId) === "failed") return;
		const statusType = status?.type;
		if (!statusType) return;
		const runId = this.runId(threadId);
		if (this.authoritativeRunIds.has(runId)) return;
		if (this.terminalRunIds.has(runId) && statusType !== "systemError") return;
		const eventAt = this.now();
		if (statusType === "active") {
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: "Subagent is active."
			});
			return;
		}
		if (statusType === "idle") {
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: "Subagent is idle."
			});
			return;
		}
		if (statusType === "systemError") {
			this.terminalRunIds.delete(runId);
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: "Subagent hit a system error; awaiting recovery."
			});
			return;
		}
		if (statusType === "notLoaded") this.runtime.recordTaskRunProgressByRunId({
			runId,
			lastEventAt: eventAt,
			progressSummary: "Subagent is not loaded."
		});
	}
	handleCollabAgentItem(params) {
		const item = isJsonObject(params.item) ? params.item : void 0;
		if (!item || readStringField(item, "type") !== "collabAgentToolCall") return;
		if ((readStringField(item, "senderThreadId") ?? readStringField(params, "threadId")) !== this.params.parentThreadId) return;
		const isSpawnAgentTool = normalizeToolName(readStringField(item, "tool")) === "spawnagent";
		const receiverThreadIds = readNativeSubagentThreadIds(item.receiverThreadIds);
		const agentsStates = readAgentsStates(item.agentsStates);
		const spawnChildThreadIds = /* @__PURE__ */ new Set([...receiverThreadIds, ...agentsStates.keys()]);
		if (isSpawnAgentTool) for (const childThreadId of spawnChildThreadIds) this.createTaskFromCollabSpawnItem(childThreadId, item);
		const toolCallStatus = normalizeCollabToolCallStatus(readStringField(item, "status"));
		const terminalToolCallThreadIds = /* @__PURE__ */ new Set();
		if (isSpawnAgentTool && isBlockedOrFailedCollabToolCallStatus(toolCallStatus)) {
			for (const threadId of spawnChildThreadIds) terminalToolCallThreadIds.add(threadId);
			for (const threadId of agentsStates.keys()) terminalToolCallThreadIds.add(threadId);
		}
		const terminalAgentStateThreadIds = /* @__PURE__ */ new Set();
		for (const [threadId, state] of agentsStates) {
			const normalizedStatus = normalizeAgentStateStatus(state.status);
			if (terminalToolCallThreadIds.has(threadId) && isNonTerminalAgentStateStatus(normalizedStatus)) continue;
			this.applyCollabAgentStatus(threadId, normalizedStatus, state.message);
			if (isTerminalAgentStateStatus(normalizedStatus)) terminalAgentStateThreadIds.add(threadId);
		}
		if (isBlockedOrFailedCollabToolCallStatus(toolCallStatus)) for (const threadId of terminalToolCallThreadIds) {
			if (terminalAgentStateThreadIds.has(threadId)) continue;
			const state = agentsStates.get(threadId);
			this.applyCollabAgentStatus(threadId, toolCallStatus, state?.message);
		}
	}
	handleSubagentActivityItem(params) {
		const item = isJsonObject(params.item) ? params.item : void 0;
		if (!item || readStringField(item, "type") !== "subAgentActivity" || readStringField(params, "threadId") !== this.params.parentThreadId) return;
		const threadId = normalizeOptionalString(readStringField(item, "agentThreadId"));
		const kind = normalizeSubagentActivityKind(readStringField(item, "kind"));
		if (!threadId || !kind) return;
		if (kind === "started") {
			this.createTaskFromSubagentActivity(threadId, normalizeOptionalString(readStringField(item, "agentPath")));
			return;
		}
		if (this.mirrorStateByThreadId.get(threadId) !== "mirrored") return;
		const message = kind === "interacted" ? "Subagent received more input." : "Subagent was interrupted.";
		this.applyCollabAgentStatus(threadId, kind === "interacted" ? "running" : "interrupted", message);
	}
	createTaskFromSubagentActivity(threadId, agentPath) {
		const eventAt = this.now();
		this.createRunningTask({
			threadId,
			label: "Subagent",
			task: agentPath ? `Subagent ${agentPath}` : "Subagent",
			startedAt: eventAt,
			progressSummary: "Subagent started."
		});
	}
	createTaskFromCollabSpawnItem(threadId, item) {
		const prompt = normalizeOptionalString(readStringField(item, "prompt"));
		const createdAt = this.now();
		this.createRunningTask({
			threadId,
			label: "Subagent",
			task: prompt ?? "Subagent",
			startedAt: createdAt,
			progressSummary: "Subagent spawned."
		});
	}
	createRunningTask(params) {
		const threadId = params.threadId.trim();
		if (!threadId || this.mirrorStateByThreadId.get(threadId) === "mirrored") return false;
		this.mirrorStateByThreadId.set(threadId, "mirrored");
		const runId = this.runId(threadId);
		const historyOwner = this.params.historyOwner && params.nativeParentThreadId ? {
			...this.params.historyOwner,
			parentThreadId: params.nativeParentThreadId
		} : this.params.historyOwner;
		const existing = this.runtime.listTaskRecords().find((task) => task.runId === runId);
		const stampHistoryOwner = historyOwner && !existing;
		const detail = {
			...isJsonObject(existing?.detail) ? existing.detail : {},
			...stampHistoryOwner ? { nativeHistory: { ...historyOwner } } : {},
			...params.turnId ? { nativeTurnId: params.turnId } : {}
		};
		if (!this.runtime.tryCreateRunningTaskRun({
			sourceId: runId,
			agentId: this.params.agentId,
			runId,
			label: params.label,
			task: params.task,
			notifyPolicy: "silent",
			deliveryStatus: "not_applicable",
			preferMetadata: true,
			startedAt: params.startedAt,
			lastEventAt: this.now(),
			progressSummary: params.progressSummary,
			...stampHistoryOwner || params.turnId ? { detail } : {}
		})) {
			this.mirrorStateByThreadId.set(threadId, "failed");
			return false;
		}
		this.terminalRunIds.delete(runId);
		this.authoritativeRunIds.delete(runId);
		return true;
	}
	applyCollabAgentStatus(threadId, status, message) {
		if (this.mirrorStateByThreadId.get(threadId) === "failed") return;
		const normalizedStatus = normalizeAgentStateStatus(status);
		if (!normalizedStatus) return;
		const runId = this.runId(threadId);
		if (this.authoritativeRunIds.has(runId)) return;
		if (this.terminalRunIds.has(runId) && isNonTerminalAgentStateStatus(normalizedStatus)) return;
		const eventAt = this.now();
		if (isNonTerminalAgentStateStatus(normalizedStatus)) {
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: normalizeOptionalString(message) ?? (normalizedStatus === "pendingInit" ? "Subagent is initializing." : normalizedStatus === "interrupted" ? "Subagent was interrupted." : "Subagent is running.")
			});
			return;
		}
		if (normalizedStatus === "completed") {
			this.terminalRunIds.add(runId);
			const summary = normalizeOptionalString(message) ?? "Subagent completed.";
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: summary
			});
			return;
		}
		if (normalizedStatus === "blocked") {
			this.terminalRunIds.add(runId);
			this.runtime.finalizeTaskRunByRunId({
				runId,
				status: "succeeded",
				endedAt: eventAt,
				lastEventAt: eventAt,
				progressSummary: normalizeOptionalString(message) ?? "Subagent blocked.",
				terminalSummary: normalizeOptionalString(message) ?? "Subagent blocked.",
				terminalOutcome: "blocked"
			});
			return;
		}
		this.terminalRunIds.add(runId);
		this.runtime.finalizeTaskRunByRunId({
			runId,
			status: normalizedStatus === "shutdown" ? "cancelled" : "failed",
			endedAt: eventAt,
			lastEventAt: eventAt,
			error: normalizeOptionalString(message) ?? `Subagent status: ${normalizedStatus}`,
			progressSummary: normalizeOptionalString(message) ?? `Subagent ${normalizedStatus}.`,
			terminalSummary: normalizeOptionalString(message) ?? "Subagent did not complete."
		});
	}
};
/** Reads a subagent thread-spawn source only when it belongs to the expected parent thread. */
function readSubagentThreadSpawnSource(source, parentThreadId) {
	if (!source || typeof source !== "object" || !("subAgent" in source)) return;
	const subAgent = source.subAgent;
	if (!subAgent || typeof subAgent !== "object" || !("thread_spawn" in subAgent)) return;
	const spawn = subAgent.thread_spawn;
	if (!spawn || typeof spawn !== "object") return;
	return spawn.parent_thread_id === parentThreadId ? spawn : void 0;
}
function readThreadStartedNotification(params) {
	const thread = params.thread;
	if (!isJsonObject(thread) || typeof thread.id !== "string") return;
	return { thread };
}
function readThreadStatusChangedNotification(params) {
	if (typeof params.threadId !== "string") return;
	const status = params.status;
	if (!isJsonObject(status) || !isCodexThreadStatusType(status.type)) return;
	return {
		threadId: params.threadId,
		status
	};
}
function isCodexThreadStatusType(value) {
	return value === "notLoaded" || value === "idle" || value === "systemError" || value === "active";
}
function readAgentsStates(value) {
	const states = /* @__PURE__ */ new Map();
	if (!isJsonObject(value)) return states;
	for (const [threadId, rawState] of Object.entries(value)) {
		if (!isJsonObject(rawState)) continue;
		const status = readStringField(rawState, "status");
		const message = readNullableString(rawState, "message");
		states.set(threadId, {
			status,
			message
		});
	}
	return states;
}
function readNullableString(value, key) {
	const entry = value[key];
	return typeof entry === "string" || entry === null ? entry : void 0;
}
function normalizeToolName(value) {
	return value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
function normalizeSubagentActivityKind(value) {
	const key = value?.replace(/[^a-z]/giu, "").toLowerCase();
	return key === "started" || key === "interacted" || key === "interrupted" ? key : void 0;
}
function normalizeCollabToolCallStatus(value) {
	const key = value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
	if (key === "completed" || key === "succeeded" || key === "success") return "completed";
	if (key === "failed" || key === "error" || key === "errored") return "failed";
	if (key === "blocked" || key === "declined") return "blocked";
	if (key === "inprogress" || key === "running") return "running";
	return value?.trim();
}
function isBlockedOrFailedCollabToolCallStatus(value) {
	return value === "failed" || value === "blocked";
}
function isNonTerminalAgentStateStatus(value) {
	return value === "pendingInit" || value === "running" || value === "interrupted";
}
function isTerminalAgentStateStatus(value) {
	return value !== void 0 && !isNonTerminalAgentStateStatus(value);
}
function normalizeAgentStateStatus(value) {
	const key = value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
	if (!key) return;
	if (key === "pendinginit") return "pendingInit";
	if (key === "inprogress" || key === "running") return "running";
	if (key === "completed" || key === "succeeded" || key === "success") return "completed";
	if (key === "interrupted" || key === "cancelled" || key === "canceled" || key === "shutdown") return key === "shutdown" ? "shutdown" : "interrupted";
	if (key === "failed" || key === "error" || key === "systemerror") return "failed";
	if (key === "blocked" || key === "declined") return "blocked";
	return value?.trim();
}
function secondsToMillis(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return value * 1e3;
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-turn-observation.ts
var CodexNativeSubagentTurnObservation = class {
	constructor(callbacks) {
		this.callbacks = callbacks;
		this.observationSourceId = randomUUID();
		this.projectedActivityWaits = /* @__PURE__ */ new WeakSet();
	}
	invalidate(childState) {
		this.projectedActivityWaits.delete(childState);
		if (!childState.terminal && childState.activityObserved) emitAgentEvent({
			runId: childState.runId,
			...childState.agentId ? { agentId: childState.agentId } : {},
			stream: "execution",
			data: {
				state: "unknown",
				sourceId: this.observationSourceId,
				invalidate: true
			}
		});
	}
	markActivityUnknown(childState) {
		this.projectedActivityWaits.delete(childState);
		childState.activityObserved = true;
		emitAgentEvent({
			runId: childState.runId,
			...childState.agentId ? { agentId: childState.agentId } : {},
			stream: "execution",
			data: {
				state: "unknown",
				sourceId: this.observationSourceId,
				executionId: childState.nativeTurnId
			}
		});
	}
	refreshWaitDependency(childState, receiverThreadId) {
		const activityWait = childState.activityWait;
		if (childState.terminal || childState.nativeTurnState && childState.nativeTurnState !== "active" || this.callbacks.currentChild(childState.childThreadId) !== childState || activityWait?.wait.kind !== "children") return;
		const runId = this.callbacks.dependencyRunId(childState.parentThreadId, receiverThreadId);
		if (!runId) return;
		let changed = false;
		const dependencies = activityWait.wait.dependencies?.map((dependency) => {
			if (dependency.runId === runId || readCodexNativeSubagentRunId(dependency.runId)?.threadId !== receiverThreadId) return dependency;
			changed = true;
			return { runId };
		});
		if (!changed) return;
		const wait = {
			...activityWait.wait,
			dependencies
		};
		childState.activityWait = {
			...activityWait,
			wait
		};
		if (this.projectedActivityWaits.has(childState)) this.observeActivity(childState, "waiting", wait);
	}
	observeActivity(childState, state, wait) {
		if (wait && wait === childState.activityWait?.wait) this.projectedActivityWaits.add(childState);
		else this.projectedActivityWaits.delete(childState);
		childState.activityObserved = true;
		emitAgentEvent({
			runId: childState.runId,
			...childState.agentId ? { agentId: childState.agentId } : {},
			stream: "execution",
			data: {
				state,
				sourceId: this.observationSourceId,
				...childState.nativeTurnId ? { executionId: childState.nativeTurnId } : {},
				...wait ? { wait } : {}
			}
		});
	}
	emitChildTaskActivity(notification, childState) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		const owner = {
			runId: childState.runId,
			...childState.agentId ? { agentId: childState.agentId } : {}
		};
		const turn = isJsonObject(params.turn) ? params.turn : void 0;
		const turnId = readStringField(params, "turnId") ?? readStringField(turn, "id");
		if (notification.method === "turn/started") {
			childState.nativeTurnId = turnId;
			childState.nativeTurnState = "active";
			childState.activityWait = void 0;
		} else if (turnId && childState.nativeTurnId && turnId !== childState.nativeTurnId) return;
		else if (turnId && childState.nativeTurnState && childState.nativeTurnState !== "active") return;
		else if (turnId) childState.nativeTurnId ??= turnId;
		const observe = (state, wait) => this.observeActivity(childState, state, wait);
		if (notification.method === "turn/started") {
			observe("running");
			return;
		}
		if (notification.method === "turn/completed") {
			childState.nativeTurnState = readNativeTurnEnd(turn);
			childState.activityWait = void 0;
			observe("unknown");
			const current = this.callbacks.onTurnEnded(childState);
			if (current?.nativeTurnId !== turnId && current?.nativeTurnState === "active") this.emitChildTaskActivity({
				method: "turn/started",
				params: {
					threadId: current.childThreadId,
					turn: { id: current.nativeTurnId }
				}
			}, current);
			return;
		}
		if (notification.method === "thread/status/changed") {
			const status = isJsonObject(params.status) ? params.status : void 0;
			if (status?.type === "active") {
				const flags = Array.isArray(status.activeFlags) ? status.activeFlags : [];
				const wait = flags.includes("waitingOnApproval") ? { kind: "approval" } : flags.includes("waitingOnUserInput") ? { kind: "user_input" } : childState.activityWait?.wait;
				observe(wait ? "waiting" : "running", wait);
			} else if (status?.type === "idle" || status?.type === "notLoaded" || status?.type === "systemError") {
				childState.activityWait = void 0;
				observe("unknown");
			}
			return;
		}
		if (notification.method === "item/agentMessage/delta" || notification.method === "item/reasoning/summaryTextDelta") {
			const delta = readStringField(params, "delta");
			if (delta) {
				if (!childState.activityObserved) observe("running");
				emitAgentEvent({
					...owner,
					stream: notification.method === "item/agentMessage/delta" ? "assistant" : "thinking",
					data: { delta }
				});
			}
			return;
		}
		if (notification.method !== "item/started" && notification.method !== "item/completed") return;
		const item = readItem(params.item);
		if (item?.type === "collabAgentToolCall" && normalizeIdentifier(item.tool ?? void 0) === "wait" && Array.isArray(item.receiverThreadIds)) {
			if (notification.method === "item/started") {
				const receivers = [...new Set(item.receiverThreadIds.flatMap((id) => typeof id === "string" && id.trim() ? [id.trim()] : []))];
				const wait = receivers.length > 0 ? {
					kind: "children",
					dependencies: receivers.slice(0, 32).map((id) => ({ runId: this.callbacks.dependencyRunId(childState.parentThreadId, id) ?? codexNativeSubagentRunId(id) })),
					pendingCount: receivers.length
				} : { kind: "agent_messages" };
				childState.activityWait = {
					itemId: item.id,
					wait
				};
				observe("waiting", wait);
			} else if (childState.activityWait?.itemId === item.id) {
				childState.activityWait = void 0;
				observe("running");
			}
			return;
		}
		if (item?.type === "agentMessage" && notification.method === "item/completed" && item.text) {
			if (!childState.activityObserved) observe("running");
			emitAgentEvent({
				...owner,
				stream: "assistant",
				data: { text: item.text }
			});
		}
		const projection = projectNormalizedToolItem({
			phase: notification.method === "item/started" ? "start" : "result",
			item
		});
		if (projection?.event) {
			if (!childState.activityObserved) observe("running");
			emitAgentEvent({
				...owner,
				...projection.event
			});
		}
	}
	toChildTurnCompletion(childState, turn) {
		const status = normalizeIdentifier(readStringField(turn, "status"));
		if (status === "completed") {
			const result = readLastAgentMessage(turn);
			return {
				childThreadId: childState.childThreadId,
				status: "succeeded",
				statusLabel: result ? "turn_completed" : "completed_without_final_message",
				result: result ?? "Subagent completed without a final assistant message."
			};
		}
		if (status === "failed") return {
			childThreadId: childState.childThreadId,
			status: "failed",
			statusLabel: "turn_failed",
			result: readTurnErrorMessage(turn) ?? "Subagent failed."
		};
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-monitor.ts
const NATIVE_SUBAGENT_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
	"thread/started",
	"thread/status/changed",
	"turn/started",
	"turn/completed",
	"item/agentMessage/delta",
	"item/reasoning/summaryTextDelta",
	"item/started",
	"item/completed",
	"rawResponseItem/completed"
]);
const RECOVERY_REVISION_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
	"thread/started",
	"thread/status/changed",
	"turn/started",
	"turn/completed"
]);
const MAX_PENDING_CHILD_ADMISSION_EVIDENCE = 32;
var Monitor = class {
	constructor(client, runtime = defaultNativeSubagentMonitorRuntime, options = {}) {
		this.client = client;
		this.runtime = runtime;
		this.parentStates = /* @__PURE__ */ new Map();
		this.pendingChildAdmissionEvidence = /* @__PURE__ */ new Map();
		this.retiredParentStates = /* @__PURE__ */ new WeakSet();
		this.childStates = /* @__PURE__ */ new Map();
		this.knownChildren = /* @__PURE__ */ new Map();
		this.childThreadIdsByAgentPath = /* @__PURE__ */ new Map();
		this.parentThreadRetentions = /* @__PURE__ */ new Map();
		this.disposed = false;
		this.now = options.now ?? Date.now;
		this.retainClient = options.retainClient;
		this.retainParentThread = options.retainParentThread;
		this.claimChildThread = options.claimChildThread;
		this.retainChildThread = options.retainChildThread;
		this.releaseChildThread = options.releaseChildThread;
		this.childCloses = new CodexNativeSubagentCloseOwner(client, {
			isParentCurrent: (state) => !this.disposed && !this.retiredParentStates.has(state) && this.parentStates.get(state.parentThreadId) === state,
			isParentRetired: (state) => this.retiredParentStates.has(state),
			knownChild: (id) => this.knownChildren.get(id),
			currentChild: (id) => this.currentChild(id),
			captureForget: options.captureChildThreadForget,
			releaseDirectChild: (child) => this.releaseDirectChild(child),
			clearRecoveryTimers: (child) => this.recovery.clearRecoveryTimers(child),
			markTerminalRevision: (id) => this.recovery.markTerminalRevision(id),
			unregisterChild: (child) => this.unregisterChild(child, { retainSubscription: false }),
			releaseClientRetentionIfIdle: () => this.releaseClientRetentionIfIdle(),
			now: () => this.now(),
			pruneParent: (state) => this.pruneParentIfUnused(state)
		});
		this.historyRecovery = new CodexNativeSubagentHistoryRecovery(client, {
			getPendingTurnIds: (id) => this.knownChildren.get(id)?.pendingTurns.map((turn) => turn.turnId) ?? [],
			getCurrentAssignmentState: (id) => {
				return {
					runId: this.knownChildren.get(id)?.assignment.runId,
					nativeTurnState: this.currentChild(id)?.nativeTurnState
				};
			}
		});
		this.completionDelivery = new CodexNativeSubagentCompletionDelivery({
			deliver: (params) => runtime.deliverAgentHarnessTaskCompletion(params),
			now: this.now,
			retryDelaysMs: options.completionDeliveryRetryDelaysMs,
			maxRetries: options.completionDeliveryMaxRetries,
			isCurrentChild: (child) => this.childStates.get(child.runId) === child,
			isCurrentParent: (state) => this.parentStates.get(state.parentThreadId) === state,
			isRetiredParent: (state) => this.retiredParentStates.has(state),
			getParent: (id) => this.parentStates.get(id),
			unregisterChild: (child) => this.unregisterChild(child),
			releaseClientRetentionIfIdle: () => this.releaseClientRetentionIfIdle()
		});
		this.turnObservation = new CodexNativeSubagentTurnObservation({
			currentChild: (id) => this.currentChild(id),
			dependencyRunId: (parentThreadId, childThreadId) => {
				const receiver = this.knownChildren.get(childThreadId);
				return receiver?.parent.parentThreadId === parentThreadId ? receiver.assignment.runId : void 0;
			},
			onTurnEnded: (child) => {
				if (child.nativeTurnState) this.releaseDirectChild(child);
				const state = this.parentStates.get(child.parentThreadId);
				return state ? this.recordObservedChildTurn(state, child) : void 0;
			}
		});
		this.recovery = new CodexNativeSubagentRecoveryCoordinator({
			isDisposed: () => this.disposed,
			isRegisteredChild: (child) => this.childStates.get(child.runId) === child,
			currentChild: (id) => this.currentChild(id),
			parentState: (id) => this.parentStates.get(id),
			isRetiredParent: (state) => this.retiredParentStates.has(state),
			reconcileChildState: (child) => this.reconcileChildState(child),
			reconcileTaskCandidateOnce: (candidate) => this.reconcileTaskCandidateOnce(candidate),
			processCompletion: (state, child, completion, eventAt) => this.processCompletion(state, child, completion, eventAt),
			onCandidateSettled: (state) => {
				this.clearUnconsumablePendingChildAdmissionEvidence();
				this.pruneParentIfUnused(state);
			},
			now: this.now,
			recoveryPollDelaysMs: options.recoveryPollDelaysMs
		});
		this.removeNotificationHandler = client.addNotificationHandler(async (notification) => {
			if (!NATIVE_SUBAGENT_NOTIFICATION_METHODS.has(notification.method)) return;
			await this.handleNotification(notification);
		});
		this.submissions = new CodexNativeSubagentSubmissionOwner({
			isCurrent: (state) => {
				if (this.disposed || this.parentStates.get(state.parentThreadId) !== state || this.retiredParentStates.has(state)) return false;
				try {
					state.submissionStore?.assertCurrent();
					return true;
				} catch {
					return false;
				}
			},
			assertPersistenceCurrent: (state) => {
				if (this.retiredParentStates.has(state) || !this.disposed && this.parentStates.get(state.parentThreadId) !== state) throw new Error("Native submission parent generation is no longer current.");
				state.submissionStore?.assertCurrent();
			},
			parentOwner: (state, turnId) => this.resolveParentOwner(state, turnId),
			client: this.client,
			recovery: this.recovery,
			knownChildren: this.knownChildren,
			currentChild: (id) => this.currentChild(id),
			restoreKnownChild: (state, assignment, records) => this.restoreKnownChild(state, assignment, records),
			prepareReceiver: (state, threadId) => this.prepareReceiverChild(state, threadId),
			registerChild: (state, assignment, childOptions) => this.registerChildThread(state, assignment, childOptions),
			admitFollowup: (known, id) => this.admitFollowupChild(known, id),
			resumeChild: (child) => this.resumeChild(child),
			completeChild: (notification, child) => this.handleChildTurnCompletion(notification, child),
			retain: (state, threadId) => {
				const releases = [
					this.retainClient?.(),
					this.retainParentThread?.(state.parentThreadId),
					this.retainParentThread?.(threadId)
				];
				let retained = true;
				return () => {
					if (!retained) return;
					retained = false;
					for (const release of releases) release?.();
				};
			},
			hasObservationBacking: options.hasObservationBacking,
			acceptContinuation: (state, owner, threadId, call) => this.observeParentInteraction(state, owner, threadId, void 0, {
				parentTurnId: call.parentTurnId,
				itemId: call.callId
			}),
			onSettled: (state) => this.pruneParentIfUnused(state),
			recoveryPollDelaysMs: options.recoveryPollDelaysMs
		});
		this.removeCloseHandler = client.addCloseHandler(() => this.dispose());
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.submissions.dispose();
		this.removeNotificationHandler();
		this.removeCloseHandler();
		this.recovery.dispose();
		for (const childState of this.childStates.values()) {
			this.turnObservation.invalidate(childState);
			this.releaseDirectChild(childState);
			if (childState.terminal && childState.pendingCompletion) {
				this.recovery.clearRecoveryTimers(childState);
				continue;
			}
			this.unregisterChild(childState);
		}
		this.releaseRetainedClient();
		for (const release of this.parentThreadRetentions.values()) release();
		this.parentThreadRetentions.clear();
		for (const state of this.parentStates.values()) {
			state.owners.clear();
			state.turnIds.clear();
			this.childCloses.clear(state);
			this.completionDelivery.deliverDetached(state, this.childStates.values());
		}
		this.pendingChildAdmissionEvidence.clear();
		for (const [parentThreadId] of this.parentStates) if (![...this.childStates.values()].some((childState) => childState.parentThreadId === parentThreadId)) this.parentStates.delete(parentThreadId);
		this.knownChildren.clear();
		this.childThreadIdsByAgentPath.clear();
	}
	registerParent(params) {
		const parentThreadId = params.parentThreadId.trim();
		if (!parentThreadId) throw new Error("Codex native subagent monitor requires a parent thread id");
		if (this.disposed) throw new Error("Codex native subagent monitor is closed");
		let state = this.parentStates.get(parentThreadId);
		if (state?.requesterSessionKey && params.requesterSessionKey && state.requesterSessionKey !== params.requesterSessionKey) throw new Error(`Codex thread ${parentThreadId} is already bound to another session`);
		if (!state) {
			state = {
				parentThreadId,
				owners: /* @__PURE__ */ new Map(),
				turnIds: /* @__PURE__ */ new Set(),
				deliveryReceipts: new CodexNativeSubagentDeliveryReceipts()
			};
			this.parentStates.set(parentThreadId, state);
		}
		state.requesterSessionKey ??= params.requesterSessionKey;
		state.taskRuntimeScope ??= params.taskRuntimeScope;
		state.historyOwner ??= params.historyOwner;
		state.submissionStore ??= params.submissionStore;
		state.agentId ??= params.agentId;
		const owner = Symbol("codex-native-subagent-owner");
		state.owners.set(owner, {
			claimDirectChild: params.claimDirectChild,
			rejectPendingDirectChild: params.rejectPendingDirectChild,
			onDirectChildAccepted: params.onDirectChildAccepted
		});
		this.prepareParentTaskRuntime(state);
		for (const childState of this.childStates.values()) if (childState.parentThreadId === parentThreadId && childState.pendingCompletion) this.completionDelivery.deliverPending(state, childState);
		let registered = true;
		let settlement;
		const registeredState = state;
		this.reconcileTaskRowsForParent(registeredState).catch((error) => {
			embeddedAgentLog.warn("Failed to reconcile Codex native subagent task rows", {
				parentThreadId,
				error: formatErrorMessage(error)
			});
		});
		this.submissions.restore(registeredState);
		return {
			bindTurn: (turnIdInput) => {
				const turnId = turnIdInput.trim();
				if (!turnId || this.parentStates.get(parentThreadId) !== registeredState) return;
				const current = registeredState.owners.get(owner);
				if (!current || [...registeredState.owners.values()].some((other) => other !== current && other.turnId === turnId)) return;
				current.turnId = turnId;
				this.submissions.bind(registeredState, turnId);
				registeredState.turnIds.add(turnId);
				this.childCloses.bind(registeredState, turnId);
				this.drainPendingChildAdmissionEvidence(registeredState, current, turnId, true);
				this.clearUnconsumablePendingChildAdmissionEvidence();
			},
			unregister: () => {
				if (!registered) return settlement ?? Promise.resolve();
				registered = false;
				const current = this.parentStates.get(parentThreadId);
				if (current === registeredState) {
					const turnId = current.owners.get(owner)?.turnId;
					current.owners.delete(owner);
					this.childCloses.prune(current);
					if (turnId) current.turnIds.delete(turnId);
					if (current.owners.size === 0) {
						current.turnIds.clear();
						current.deliveryReceipts = new CodexNativeSubagentDeliveryReceipts();
					}
					this.clearUnconsumablePendingChildAdmissionEvidence();
					this.completionDelivery.deliverDetached(current, this.childStates.values());
					this.pruneParentIfUnused(current);
				}
				settlement = Promise.allSettled([this.submissions.drain(registeredState), ...this.childCloses.settlements(registeredState)]).then(() => {});
				return settlement;
			}
		};
	}
	retireParent(parentThreadIdInput) {
		const states = this.historyRecovery.parentsForRetirement(parentThreadIdInput.trim(), this.parentStates);
		for (const state of states) this.retiredParentStates.add(state);
		for (const state of states) {
			const parentThreadId = state.parentThreadId;
			this.submissions.retire(state);
			state.owners.clear();
			this.childCloses.clear(state);
			this.clearPendingChildAdmissionEvidenceForParent(parentThreadId);
			for (const childState of Array.from(this.childStates.values())) if (childState.parentThreadId === parentThreadId) this.childCloses.retireChild(state, childState, "Subagent parent session ended.");
			this.pruneParentIfUnused(state);
		}
	}
	prepareParentTaskRuntime(state) {
		if (!state.requesterSessionKey || !state.taskRuntimeScope) return;
		state.taskRuntime ??= this.runtime.createAgentHarnessTaskRuntime({
			runtime: CODEX_NATIVE_SUBAGENT_RUNTIME,
			taskKind: CODEX_NATIVE_SUBAGENT_TASK_KIND,
			scope: state.taskRuntimeScope,
			runIdPrefix: CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX,
			executionPid: this.client.getTransportPid()
		});
		state.mirror ??= new CodexNativeSubagentTaskMirror({
			parentThreadId: state.parentThreadId,
			requesterSessionKey: state.requesterSessionKey,
			historyOwner: state.historyOwner,
			agentId: state.agentId
		}, state.taskRuntime);
	}
	/** Handles one notification from the client-wide router observer. */
	async handleNotification(notification) {
		if (this.disposed) return;
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		this.captureUnregisteredChildTurn(notification, params);
		if (notification.method === "turn/started" && params && !this.observeNativeChildTurnStart(params)) return;
		if (notification.method === "turn/completed" && params) {
			const known = this.knownChildren.get(readStringField(params, "threadId") ?? "");
			const turn = isJsonObject(params.turn) ? params.turn : void 0;
			const turnId = readStringField(turn, "id");
			const pending = known?.pendingTurns.find((candidate) => candidate.turnId === turnId);
			if (pending) pending.state = readNativeTurnEnd(turn);
		}
		if (params && (notification.method === "turn/started" || notification.method === "turn/completed") && isJsonObject(params.turn)) this.submissions.observeTurn(readStringField(params, "threadId") ?? "", params.turn);
		if (notification.method === "rawResponseItem/completed" && params && isJsonObject(params.item)) {
			const parent = this.parentStates.get(readStringField(params, "threadId") ?? "");
			if (parent) this.submissions.observeOutput(parent, readStringField(params, "turnId"), params.item);
		}
		const mirrorState = this.resolveMirrorState(notification);
		const startedThread = isJsonObject(params?.thread) ? params.thread : void 0;
		const threadId = readStringField(params, "threadId")?.trim() ?? readStringField(startedThread, "id")?.trim();
		const threadStatus = isJsonObject(params?.status) ? normalizeIdentifier(readStringField(params.status, "type")) : void 0;
		const parent = threadId ? this.parentStates.get(threadId) : void 0;
		if (parent && parent.owners.size > 0 && notification.method === "turn/started") {
			const turnId = isJsonObject(params?.turn) ? readStringField(params.turn, "id") : void 0;
			if (turnId) parent.turnIds.add(turnId);
		}
		const tracksRecoveryRevision = Boolean(threadId && this.recovery.hasRevision(threadId));
		if (RECOVERY_REVISION_NOTIFICATION_METHODS.has(notification.method) && threadId && tracksRecoveryRevision) this.recovery.observeRevision(threadId);
		if (!mirrorState && (!threadId || !this.parentStates.has(threadId) && !this.currentChild(threadId) && !tracksRecoveryRevision)) return;
		const notificationTurnId = readStringField(params, "turnId") ?? (isJsonObject(params?.turn) ? readStringField(params.turn, "id") : void 0);
		const pendingTurns = threadId ? this.knownChildren.get(threadId)?.pendingTurns : void 0;
		const pendingNativeTurn = pendingTurns?.some((pending) => !notificationTurnId || pending.turnId === notificationTurnId);
		if (pendingNativeTurn && threadId) {
			const previous = this.currentChild(threadId);
			if (previous) this.recovery.reconcileRegisteredChild(previous).catch((error) => {
				logRecoveryFailure(threadId, error);
				this.recovery.scheduleRecoveryPoll(previous);
			});
		}
		const isChildClose = isCodexNativeSubagentCloseNotification(notification);
		if (mirrorState && isChildClose) await this.childCloses.observe(notification, mirrorState);
		if (mirrorState?.mirror && !pendingNativeTurn && !isChildClose) try {
			mirrorState.mirror.handleNotification(notification);
		} catch (error) {
			embeddedAgentLog.warn("Failed to mirror Codex native subagent lifecycle event", {
				method: notification.method,
				error: formatErrorMessage(error)
			});
		}
		const childState = threadId && !pendingNativeTurn ? this.currentChild(threadId) : void 0;
		if (notification.method === "turn/started" && childState) {
			childState.nativeCompletionDelivered = false;
			this.resumeChild(childState);
		}
		if (parent && parent.turnIds.has(readStringField(params, "turnId") ?? "")) observeCodexNativeSubagentDeliveryReceipts({
			state: parent,
			notification,
			knownChildren: this.knownChildren.values(),
			candidates: this.recovery.allCandidates(),
			isRetiredParent: (state) => this.retiredParentStates.has(state),
			applyReceipts: (runIds) => this.applyNativeReceipts(parent, runIds)
		});
		if (childState && !childState.terminal && (!pendingTurns?.length || notification.method === "turn/completed")) this.turnObservation.emitChildTaskActivity(notification, childState);
		if (!pendingNativeTurn) await this.handleChildTurnCompletion(notification, childState);
		if (!pendingNativeTurn && notification.method === "thread/status/changed" && threadId && threadStatus) {
			if (threadStatus !== "systemerror") {
				if (childState) this.recovery.clearSystemErrorFallback(childState);
			} else {
				if (childState) {
					this.resumeChild(childState, { scheduleRecovery: false });
					this.recovery.setRecoveryFallback(childState, systemErrorFallbackCompletion(childState.childThreadId), this.now());
				}
				this.reconcileChildThread(threadId).catch((error) => {
					logRecoveryFailure(threadId, error);
					return false;
				}).then((reconciled) => {
					if (!reconciled && childState && this.currentChild(threadId) === childState) this.recovery.scheduleRecoveryPoll(childState);
				});
			}
		}
		await this.handleCompletionNotification(notification);
	}
	resumeChild(childState, options = {}) {
		if (childState.terminal) return;
		this.observeActiveChild(childState);
		this.recovery.clearRecoveryTimers(childState);
		childState.recoveryAttempt = 0;
		if (options.scheduleRecovery !== false) this.recovery.scheduleRecoveryPoll(childState);
	}
	observeActiveChild(childState) {
		childState.settledWithoutCompletion = false;
		childState.fallbackCompletion = void 0;
		this.releaseClientRetention ??= this.retainClient?.();
	}
	settleResumableChild(childState) {
		if (childState.terminal) return;
		childState.settledWithoutCompletion = true;
		childState.fallbackCompletion = void 0;
		this.releaseDirectChild(childState);
		this.recovery.clearRecoveryTimers(childState);
		this.releaseClientRetentionIfIdle();
	}
	async handleChildTurnCompletion(notification, childState) {
		if (notification.method !== "turn/completed") return;
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const childThreadId = readStringField(params, "threadId")?.trim();
		const state = childState ? this.parentStates.get(childState.parentThreadId) : void 0;
		const turn = isJsonObject(params?.turn) ? params.turn : void 0;
		if (!state || !childState || childState.childThreadId !== childThreadId || !turn || childState.terminal) return;
		const turnId = readStringField(turn, "id");
		if (childState.nativeTurnId && turnId !== childState.nativeTurnId) return;
		const status = normalizeIdentifier(readStringField(turn, "status"));
		if (status === "interrupted") {
			this.removePendingSpawnAdmissionEvidenceForChild(childState.childThreadId);
			this.rejectPendingDirectChild(state, childState.childThreadId, "Codex child turn interrupted");
			this.settleResumableChild(childState);
			return;
		}
		if (status === "completed" || status === "failed") {
			const latestTurnId = this.knownChildren.get(childState.childThreadId)?.turnId;
			if (!latestTurnId || latestTurnId === turnId) {
				this.recovery.markTerminalRevision(childState.childThreadId);
				this.rejectPendingDirectChild(state, childState.childThreadId, "Codex child turn completed");
				this.removePendingSpawnAdmissionEvidenceForChild(childState.childThreadId);
			}
			this.releaseDirectChild(childState);
		}
		const completion = this.turnObservation.toChildTurnCompletion(childState, turn);
		if (!completion) return;
		await this.processObservedCompletion(state, childState, completion);
	}
	/** Reads one child through app-server history and delivers a terminal result when present. */
	async reconcileChildThread(childThreadIdInput) {
		const childState = this.currentChild(childThreadIdInput.trim());
		return childState ? this.recovery.reconcileRegisteredChild(childState) : false;
	}
	resolveMirrorState(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		if (notification.method === "thread/started") {
			const thread = isJsonObject(params.thread) ? params.thread : void 0;
			const parentThreadId = readThreadParentThreadId(thread);
			const childThreadId = thread ? readStringField(thread, "id")?.trim() : void 0;
			const agentPath = readStringField(readThreadSpawnSource(thread), "agent_path")?.trim();
			const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
			if (state && childThreadId && parentThreadId) return this.registerChildThread(state, childThreadId, agentPath === void 0 ? {} : { agentPath }) ? state : void 0;
			return state;
		}
		if (notification.method === "thread/status/changed" || notification.method === "turn/started" || notification.method === "turn/completed" || notification.method === "item/agentMessage/delta") {
			const childThreadId = readStringField(params, "threadId")?.trim();
			const parentThreadId = childThreadId ? this.currentChild(childThreadId)?.parentThreadId : void 0;
			return parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
		}
		if (notification.method === "item/started" || notification.method === "item/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			const parentThreadId = item ? (readStringField(item, "senderThreadId") ?? readStringField(params, "threadId"))?.trim() : void 0;
			const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
			if (state && parentThreadId) {
				const turnId = readStringField(params, "turnId");
				const owner = this.resolveParentOwner(state, turnId);
				if (notification.method === "item/completed") {
					if (readStringField(item, "type") === "subAgentActivity" && readStringField(item, "kind") === "interacted") {
						const childThreadId = readStringField(item, "agentThreadId");
						if (childThreadId) this.observeParentInteraction(state, owner, childThreadId, readStringField(item, "agentPath"), {
							parentTurnId: turnId,
							itemId: readStringField(item, "id")
						});
						return state;
					}
					if (readStringField(item, "type") === "collabAgentToolCall" && readStringField(item, "tool") === "sendInput" && readStringField(item, "status") === "completed") {
						this.submissions.observeCall(state, turnId, item);
						return;
					}
				}
				if (notification.method === "item/completed" && readStringField(item, "type") === "subAgentActivity" && normalizeIdentifier(readStringField(item, "kind")) === "started") {
					const childThreadId = readStringField(item, "agentThreadId")?.trim();
					const agentPath = readStringField(item, "agentPath");
					if (childThreadId) this.registerDirectSpawnChild(state, turnId, {
						parentThreadId,
						childThreadId,
						...agentPath === void 0 ? {} : { agentPath }
					}, owner);
					return state;
				}
				const isCompletedSpawnAgentTool = notification.method === "item/completed" && readStringField(item, "type") === "collabAgentToolCall" && normalizeIdentifier(readStringField(item, "tool")) === "spawnagent" && normalizeIdentifier(readStringField(item, "status")) === "completed";
				if (normalizeIdentifier(readStringField(item, "tool")) === "closeagent") return state;
				const childThreadIds = new Set(readNativeSubagentThreadIds(item?.receiverThreadIds));
				let accepted = true;
				for (const childThreadId of childThreadIds) accepted = Boolean(isCompletedSpawnAgentTool ? this.registerDirectSpawnChild(state, turnId, {
					parentThreadId,
					childThreadId
				}, owner) : this.registerChildThread(state, childThreadId)) && accepted;
				if (!accepted) return;
			}
			return state;
		}
	}
	async handleCompletionNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const parentThreadId = params ? readStringField(params, "threadId")?.trim() : void 0;
		const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
		if (!state) return;
		for (const nativeCompletion of codexNativeSubagentNotifications.fromNotification(notification)) {
			const childThreadId = this.childThreadIdsByAgentPath.get(buildCodexNativeSubagentAgentPathKey(state.parentThreadId, nativeCompletion.agentPath));
			const childState = childThreadId ? this.currentChild(childThreadId) : void 0;
			if (!childState || childState.parentThreadId !== state.parentThreadId || childState.terminal || this.knownChildren.get(childState.childThreadId)?.pendingTurns.length || readCodexNativeSubagentRunId(childState.runId)?.turnId) {
				embeddedAgentLog.warn("Ignoring Codex native subagent completion for unknown child thread", {
					parentThreadId: state.parentThreadId,
					agentPath: nativeCompletion.agentPath
				});
				continue;
			}
			const completion = {
				childThreadId: childState.childThreadId,
				status: nativeCompletion.status,
				statusLabel: nativeCompletion.statusLabel,
				result: nativeCompletion.result
			};
			await this.processObservedCompletion(state, childState, completion);
		}
	}
	async processObservedCompletion(state, childState, completion) {
		if (!isNoFinalCompletion(completion)) {
			await this.processCompletion(state, childState, completion);
			return;
		}
		this.resumeChild(childState, { scheduleRecovery: false });
		this.recovery.setRecoveryFallback(childState, completion, this.now());
		await this.recovery.reconcileRegisteredChild(childState).catch((error) => {
			logRecoveryFailure(childState.childThreadId, error);
			return false;
		});
	}
	async reconcileChildState(childState) {
		const state = this.parentStates.get(childState.parentThreadId);
		if (!state) return false;
		const statusRead = this.recovery.retainThreadStatusRevision(childState.childThreadId);
		try {
			const recovery = await this.historyRecovery.read(childState, {
				resumeInterrupted: !childState.terminal,
				getTaskRecords: () => this.historyRecovery.selectTaskRecords(state),
				recordedCompletion: childState.pendingCompletion
			});
			if (!statusRead.isCurrent() || this.childStates.get(childState.runId) !== childState) return false;
			if (recovery.parentThreadId && recovery.parentThreadId !== childState.nativeParentThreadId) {
				embeddedAgentLog.warn("Codex native subagent parent did not match monitor state", {
					childThreadId: childState.childThreadId,
					expectedParentThreadId: childState.nativeParentThreadId,
					actualParentThreadId: recovery.parentThreadId
				});
				this.unregisterChild(childState);
				return false;
			}
			if (recovery.agentPath) this.registerAgentPath(state, childState.childThreadId, recovery.agentPath);
			this.recordRecoveredChildTurn(state, childState, recovery);
			if (recovery.threadState === "active") {
				this.observeActiveChild(childState);
				return false;
			}
			if (recovery.threadState === "other") this.recovery.clearSystemErrorFallback(childState);
			if (recovery.resumable) {
				this.settleResumableChild(childState);
				return false;
			}
			const completion = this.processRecoveredCompletion(state, childState, recovery);
			if (!completion) return false;
			await completion;
			return true;
		} finally {
			statusRead.release();
		}
	}
	processRecoveredCompletion(state, child, recovery) {
		const completion = recovery.completion;
		if (completion && !isNoFinalCompletion(completion)) return this.processCompletion(state, child, completion, completion.completedAt);
		const fallback = completion ?? recovery.fallbackCompletion;
		if (fallback) this.recovery.setRecoveryFallback(child, fallback, fallback.completedAt ?? this.now());
	}
	recordRecoveredChildTurn(state, child, recovery) {
		if (recovery.assignmentUnresolved) child.fallbackCompletion = void 0;
		const known = this.knownChildren.get(child.childThreadId);
		if (known?.parent === state) for (const observed of recovery.observedPendingTurns) {
			const pending = known.pendingTurns.find((candidate) => candidate.turnId === observed.turnId);
			if (pending && observed.state) pending.state = observed.state === "active" && pending !== known.pendingTurns.at(-1) ? void 0 : observed.state;
		}
		const turnId = recovery.nativeTurnId;
		if (!turnId) return;
		const observedTurn = Boolean(child.nativeTurnId && child.nativeTurnId !== turnId);
		if (child.nativeTurnId !== turnId) {
			child.nativeTurnId = turnId;
			child.nativeTurnState = void 0;
			child.activityWait = void 0;
			state.mirror?.recordNativeTurn(child.runId, turnId);
		}
		child.nativeTurnState = recovery.nativeTurnState;
		if (child.nativeTurnState && child.nativeTurnState !== "active") this.releaseDirectChild(child);
		this.recordObservedChildTurn(state, child, observedTurn);
	}
	recordObservedChildTurn(state, child, observedTurn = false) {
		const known = this.knownChildren.get(child.childThreadId);
		if (!child.nativeTurnId || known?.parent !== state || known.assignment.runId !== child.runId) return child;
		known.assignment.nativeTurnId = child.nativeTurnId;
		known.assignment.unanchored = void 0;
		if (!known.observedTurns.has(child.nativeTurnId)) known.observedTurns.set(child.nativeTurnId, observedTurn ? { awaitingInteraction: true } : {});
		if (observedTurn && known.pendingTurns.length === 0) this.associatePendingChildInteraction(known, child.childThreadId, child.nativeTurnId);
		this.submissions.observeKnownChild(child.childThreadId);
		return this.admitFollowupChild(known, child.childThreadId);
	}
	async processCompletion(state, childState, completion, eventAt = this.now()) {
		if (childState.terminal) return;
		childState.terminal = true;
		const known = this.knownChildren.get(childState.childThreadId);
		if (known?.assignment.runId === childState.runId) {
			known.assignment.terminal = true;
			known.assignment.unanchored = void 0;
			known.assignment.nativeTurnId = childState.nativeTurnId;
		}
		childState.pendingCompletion = {
			...completion,
			completedAt: eventAt
		};
		childState.completionTaskPhase = "finalize";
		this.recovery.markTerminalRevision(childState.childThreadId);
		this.releaseDirectChild(childState);
		this.recovery.clearRecoveryTimers(childState);
		state.mirror?.markAuthoritativeCompletion(completion.childThreadId, childState.runId);
		this.applyNativeReceipts(state, childState.deliveryReceipts.record(childState.runId, this.knownChildren.get(childState.childThreadId)?.agentPaths ?? [childState.childThreadId], completion.result));
		await this.completionDelivery.deliverPending(state, childState);
	}
	applyNativeReceipts(state, runIds) {
		this.completionDelivery.applyReceipts(state, runIds, this.childStates);
	}
	resolveChildReceiptOwner(state, childThreadId) {
		return resolveCodexNativeSubagentReceiptOwner({
			state,
			childThreadId,
			known: this.knownChildren.get(childThreadId),
			candidates: this.recovery.allCandidates(),
			isRetiredParent: (parent) => this.retiredParentStates.has(parent)
		});
	}
	captureUnregisteredChildTurn(notification, params) {
		if (notification.method !== "turn/started" && notification.method !== "turn/completed") return;
		const threadId = readStringField(params, "threadId");
		const turn = isJsonObject(params?.turn) ? params.turn : void 0;
		const turnId = readStringField(turn, "id");
		if (!threadId || !turnId) return;
		const known = this.knownChildren.get(threadId);
		if (known && (known.assignment.terminal || known.assignment.nativeTurnId || this.currentChild(threadId))) return;
		const candidates = this.recovery.observeUnregisteredTurn(threadId, turnId, notification.method === "turn/started", readNativeTurnEnd(turn));
		for (const candidate of candidates) {
			const state = this.parentStates.get(candidate.parentState.parentThreadId);
			if (state) this.associateUnregisteredChildInteractions(state, threadId);
		}
		if (known && notification.method === "turn/started") this.applyNativeReceipts(known.parent, known.deliveryReceipts.track(codexNativeSubagentRunId(threadId, turnId), known.agentPaths));
	}
	associateUnregisteredChildInteractions(state, threadId) {
		const known = this.knownChildren.get(threadId);
		if (known && (known.assignment.terminal || known.assignment.nativeTurnId)) return;
		const candidate = this.recovery.pendingChildRecoveries(state, threadId)[0];
		if (!candidate) return;
		const currentTurnId = candidate.nativeTurnId ?? (!candidate.terminal ? candidate.observedTurns[0]?.turnId : void 0);
		const interactions = [...this.pendingChildAdmissionEvidence.values()].flat().filter((evidence) => evidence.kind === "interaction" && evidence.parentThreadId === state.parentThreadId && evidence.childThreadId === threadId);
		for (const turn of candidate.observedTurns) {
			if (turn.turnId === currentTurnId) continue;
			const interaction = interactions.find((entry) => entry.kind === "interaction" && entry.nativeTurnId === turn.turnId) ?? interactions.find((entry) => entry.kind === "interaction" && !entry.nativeTurnId);
			if (interaction?.kind !== "interaction") continue;
			interaction.nativeTurnId = turn.turnId;
			if (interaction.owner && [...state.owners.values()].includes(interaction.owner)) interaction.admittedOwner = interaction.owner;
		}
	}
	prepareReceiverChild(state, threadId) {
		const known = this.knownChildren.get(threadId);
		if (known?.parent === state) return true;
		if (this.disposed || this.parentStates.get(state.parentThreadId) !== state || this.retiredParentStates.has(state) || known && (!known.assignment.terminal || known.pendingTurns.length > 0 || this.submissions.hasChildCustody(known.parent, threadId))) return false;
		const saved = this.historyRecovery.readReceiverTask(state, threadId);
		if (!saved) return !known;
		if (!saved.restorable) return false;
		const nativeParent = this.parentStates.get(saved.nativeParentThreadId);
		for (const owner of [known?.parent, nativeParent]) if (owner && (this.retiredParentStates.has(owner) || !this.historyRecovery.acceptsParent(owner, state))) return false;
		try {
			state.submissionStore?.assertCurrent();
		} catch {
			return false;
		}
		this.restoreKnownChild(state, saved.assignment, saved.records);
		this.historyRecovery.retainRecoveryParents([known?.parent, nativeParent], state);
		restoreCodexNativeSubagentTaskReceipts({
			state,
			taskRecords: saved.records,
			knownChildren: this.knownChildren,
			applyReceipts: (runIds) => this.applyNativeReceipts(state, runIds)
		});
		for (const agentPath of this.knownChildren.get(threadId)?.agentPaths ?? []) this.registerAgentPath(state, threadId, agentPath);
		return true;
	}
	registerChildThread(state, childInput, options = {}) {
		const parentThreadId = state.parentThreadId;
		const preparedAssignment = typeof childInput === "string" ? void 0 : childInput;
		const childThreadId = typeof childInput === "string" ? childInput.trim() : childInput.childThreadId;
		if (!parentThreadId || !childThreadId || this.disposed) return;
		const claimDirectChild = options.directOwner?.claimDirectChild;
		if (claimDirectChild && this.recovery.isTerminalRevision(childThreadId)) return;
		if (!preparedAssignment && !this.prepareReceiverChild(state, childThreadId)) return;
		const known = this.knownChildren.get(childThreadId);
		const observedTurns = options.observedTurns ?? (!known ? this.recovery.resolveChildTurnBuffer(state, childThreadId) : []);
		if (known && known.parent !== state && !options.historicalAssignment) {
			embeddedAgentLog.warn("Ignoring Codex native subagent child reparenting", {
				childThreadId,
				existingParentThreadId: known.parent.parentThreadId,
				attemptedParentThreadId: parentThreadId
			});
			return;
		}
		const assignment = preparedAssignment ?? {
			runId: known?.assignment.runId ?? codexNativeSubagentRunId(childThreadId),
			childThreadId,
			nativeTurnId: void 0
		};
		const { runId } = assignment;
		let childState = this.childStates.get(runId);
		if (childState && childState.parentThreadId !== parentThreadId) return;
		if (!childState && known && !preparedAssignment) return;
		if (!childState) {
			this.updateChildThreadOwnership("claim", childThreadId, this.claimChildThread);
			this.releaseClientRetention ??= this.retainClient?.();
			if (!this.parentThreadRetentions.has(parentThreadId)) {
				const releaseParentThread = this.retainParentThread?.(parentThreadId);
				if (releaseParentThread) this.parentThreadRetentions.set(parentThreadId, releaseParentThread);
			}
			childState = {
				runId,
				nativeTurnId: assignment.nativeTurnId,
				nativeTurnState: observedTurns.find((turn) => turn.turnId === assignment.nativeTurnId)?.state,
				deliveryReceipts: this.resolveChildReceiptOwner(state, childThreadId),
				childThreadId,
				parentThreadId,
				nativeParentThreadId: known?.nativeParentThreadId ?? parentThreadId,
				agentId: state.agentId,
				recoveryAttempt: 0,
				terminal: false,
				nativeCompletionDelivered: false,
				settledWithoutCompletion: false,
				completionDeliveryAttempt: 0,
				deliveringCompletion: false
			};
			this.childStates.set(runId, childState);
			if (!known || !known.assignment.nativeTurnId && assignment.nativeTurnId && observedTurns.length > 0) {
				const taskRecords = this.historyRecovery.selectTaskRecords(state);
				this.restoreKnownChild(state, assignment, taskRecords, observedTurns);
				restoreCodexNativeSubagentTaskReceipts({
					state,
					taskRecords,
					knownChildren: this.knownChildren,
					applyReceipts: (runIds) => this.applyNativeReceipts(state, runIds)
				});
			}
			this.recovery.seedRevision(childThreadId, parentThreadId);
		}
		if (known && options.admitAssignment) {
			const previousRunId = known.assignment.runId;
			known.assignment = {
				...assignment,
				terminal: childState.terminal || known.assignment.runId === runId && known.assignment.terminal
			};
			if (previousRunId !== runId) this.refreshWaitDependency(state, childThreadId);
		}
		if (claimDirectChild && !childState.terminal && !childState.settledWithoutCompletion && !childState.releaseDirectChild) {
			childState.directOwner = options.directOwner;
			childState.releaseDirectChild = claimDirectChild(childThreadId);
		}
		this.registerAgentPath(state, childThreadId, childThreadId);
		const agentPath = normalizeOptionalString(options.agentPath);
		if (agentPath) this.registerAgentPath(state, childThreadId, agentPath);
		for (const path of this.knownChildren.get(childThreadId)?.agentPaths ?? []) this.registerAgentPath(state, childThreadId, path);
		this.applyNativeReceipts(state, childState.deliveryReceipts.track(runId, this.knownChildren.get(childThreadId)?.agentPaths ?? [childThreadId]));
		const restored = this.knownChildren.get(childThreadId);
		if (observedTurns.length > 0 && restored?.parent === state) {
			if (!restored.assignment.terminal && !this.currentChild(childThreadId)) this.registerChildThread(state, restored.assignment, { observedTurns });
			const pendingAdmissions = [...this.pendingChildAdmissionEvidence];
			for (const [parentTurnId, pending] of pendingAdmissions) {
				const owners = /* @__PURE__ */ new Set();
				for (const entry of pending) {
					if (entry.kind !== "interaction" || entry.parentThreadId !== state.parentThreadId || entry.childThreadId !== childThreadId) continue;
					const owner = entry.admittedOwner ?? entry.owner;
					if (owner) owners.add(owner);
				}
				for (const owner of owners) this.drainPendingChildAdmissionEvidence(state, owner, parentTurnId, true);
			}
			for (const candidate of this.recovery.pendingChildRecoveries(state, childThreadId)) candidate.observedTurns.length = 0;
		}
		this.recovery.scheduleRecoveryPoll(childState);
		return childState;
	}
	currentChild(threadId) {
		const runId = this.knownChildren.get(threadId)?.assignment.runId;
		return runId ? this.childStates.get(runId) : void 0;
	}
	refreshWaitDependency(state, receiverThreadId) {
		if (this.disposed || this.parentStates.get(state.parentThreadId) !== state || this.retiredParentStates.has(state)) return;
		for (const child of this.childStates.values()) if (child.parentThreadId === state.parentThreadId) this.turnObservation.refreshWaitDependency(child, receiverThreadId);
	}
	observeNativeChildTurnStart(params) {
		const threadId = readStringField(params, "threadId");
		const turn = isJsonObject(params.turn) ? params.turn : void 0;
		const turnId = readStringField(turn, "id");
		const known = threadId ? this.knownChildren.get(threadId) : void 0;
		if (!threadId || !turnId || !known || this.parentStates.get(known.parent.parentThreadId) !== known.parent) return true;
		let previous = this.currentChild(threadId);
		if (!previous && !known.assignment.terminal && !known.assignment.nativeTurnId && this.recovery.pendingChildRecoveries(known.parent, threadId).length > 0) return false;
		if (!previous && !known.assignment.terminal) previous = this.registerChildThread(known.parent, known.assignment);
		const pending = known.pendingTurns.find((candidate) => candidate.turnId === turnId);
		if (known.observedTurns.has(turnId) && (known.turnId !== turnId || known.assignment.terminal || pending || previous?.nativeTurnState !== void 0)) return false;
		const observedTurn = !known.observedTurns.has(turnId);
		const startsPendingTurn = !pending && (known.pendingTurns.length > 0 || known.assignment.unanchored || !previous || known.assignment.terminal || previous.terminal || previous.nativeTurnState === "completed" || previous.nativeTurnState === "failed" || previous.nativeTurnId && previous.nativeTurnId !== turnId);
		if (observedTurn) known.observedTurns.set(turnId, startsPendingTurn ? { awaitingInteraction: true } : {});
		if (startsPendingTurn) {
			const previousPending = known.pendingTurns.at(-1);
			if (previousPending?.state === "active") previousPending.state = void 0;
			known.pendingTurns.push({
				turnId,
				state: "active"
			});
			if (!previousPending && previous && !known.assignment.terminal && !previous.terminal && (!previous.nativeTurnState || previous.nativeTurnState === "active")) {
				previous.nativeTurnState = void 0;
				previous.activityWait = void 0;
				this.releaseDirectChild(previous);
				this.turnObservation.markActivityUnknown(previous);
			}
			this.applyNativeReceipts(known.parent, known.deliveryReceipts.track(codexNativeSubagentRunId(threadId, turnId), known.agentPaths));
		}
		known.turnId = turnId;
		if (previous && !previous.terminal && known.pendingTurns.length === 0) {
			previous.nativeTurnId = turnId;
			known.assignment.nativeTurnId = turnId;
			known.assignment.unanchored = void 0;
			previous.nativeTurnState = "active";
			known.parent.mirror?.recordNativeTurn(previous.runId, turnId);
		}
		if (observedTurn) this.associatePendingChildInteraction(known, threadId, turnId);
		this.admitFollowupChild(known, threadId);
		return true;
	}
	associatePendingChildInteraction(known, threadId, nativeTurnId) {
		for (const [parentTurnId, pending] of this.pendingChildAdmissionEvidence) {
			const interaction = pending.find((evidence) => evidence.kind === "interaction" && evidence.parentThreadId === known.parent.parentThreadId && evidence.childThreadId === threadId && !evidence.nativeTurnId);
			if (interaction?.kind !== "interaction") continue;
			interaction.nativeTurnId = nativeTurnId;
			const observed = known.observedTurns.get(nativeTurnId);
			if (observed) observed.awaitingInteraction = void 0;
			if (interaction.owner) this.drainPendingChildAdmissionEvidence(known.parent, interaction.owner, parentTurnId);
			return;
		}
	}
	observeParentInteraction(state, owner, threadId, agentPath, interaction = {}) {
		this.prepareReceiverChild(state, threadId);
		const known = this.knownChildren.get(threadId);
		if (known && known.parent !== state || !known && this.recovery.pendingChildRecoveries(state, threadId).length === 0) return;
		if (known && agentPath) this.registerAgentPath(state, threadId, agentPath);
		const parentTurnId = interaction.parentTurnId ?? owner?.turnId;
		this.bufferPendingChildAdmissionEvidence(parentTurnId, {
			kind: "interaction",
			parentThreadId: state.parentThreadId,
			childThreadId: threadId,
			...agentPath ? { agentPath } : {},
			...interaction.itemId ? { itemId: interaction.itemId } : {},
			...owner ? { owner } : {}
		});
		if (!known || !known.assignment.terminal && !known.assignment.nativeTurnId) this.associateUnregisteredChildInteractions(state, threadId);
		if (owner && parentTurnId) this.drainPendingChildAdmissionEvidence(state, owner, parentTurnId, true);
	}
	admitFollowupChild(known, threadId, owner) {
		if (this.parentStates.get(known.parent.parentThreadId) !== known.parent || this.retiredParentStates.has(known.parent)) return;
		let child = this.currentChild(threadId);
		if (!child && !known.assignment.terminal) return;
		let claimOwner = owner;
		let transitioned = false;
		while (known.pendingTurns.length > 0) {
			const pending = known.pendingTurns[0];
			const currentTurnId = child?.nativeTurnId;
			const recoveredIndex = currentTurnId ? known.pendingTurns.findIndex((candidate) => candidate.turnId === currentTurnId) : -1;
			if (child && !child.terminal && !known.assignment.terminal && (recoveredIndex >= 0 || child.nativeTurnState === "interrupted")) {
				let continuationCount = Math.max(1, recoveredIndex + 1);
				if (recoveredIndex < 0) while (continuationCount < known.pendingTurns.length && known.pendingTurns[continuationCount - 1]?.state === "interrupted") continuationCount += 1;
				const continuations = known.pendingTurns.splice(0, continuationCount);
				const resumed = continuations.at(-1);
				if (recoveredIndex < 0) {
					child.nativeTurnId = resumed.turnId;
					child.nativeTurnState = resumed.state;
					child.activityWait = void 0;
					known.parent.mirror?.recordNativeTurn(child.runId, resumed.turnId);
				}
				claimOwner = resumed.admittedOwner;
				transitioned = true;
				this.applyNativeReceipts(known.parent, known.deliveryReceipts.resumeAssignment(child.runId, continuations.map((turn) => codexNativeSubagentRunId(threadId, turn.turnId))));
				continue;
			}
			if (child && !child.terminal && !known.assignment.terminal && child.nativeTurnState !== "completed" && child.nativeTurnState !== "failed") {
				child.nativeTurnState = void 0;
				return;
			}
			if (!pending.admittedOwner && !pending.admittedSubmission) return;
			const runId = codexNativeSubagentRunId(threadId, pending.turnId);
			known.parent.mirror?.startFollowupTurn(threadId, pending.turnId, known.nativeParentThreadId);
			child = this.registerChildThread(known.parent, {
				runId,
				childThreadId: threadId,
				nativeTurnId: pending.turnId
			}, { admitAssignment: true });
			if (!child) return;
			child.nativeTurnId = pending.turnId;
			child.nativeTurnState = pending.state;
			claimOwner = pending.admittedOwner;
			transitioned = true;
			known.pendingTurns.shift();
		}
		if (!child || child.terminal || known.assignment.terminal || !child.nativeTurnId) return;
		known.assignment.nativeTurnId = child.nativeTurnId;
		known.turnId = child.nativeTurnId;
		if (child.nativeTurnState !== "active") return child;
		const currentInteraction = [...this.pendingChildAdmissionEvidence.values()].flat().findLast((evidence) => evidence.kind === "interaction" && evidence.parentThreadId === known.parent.parentThreadId && evidence.childThreadId === threadId && !evidence.nativeTurnId && evidence.owner && [...known.parent.owners.values()].includes(evidence.owner));
		if (currentInteraction?.kind === "interaction" && currentInteraction.owner) claimOwner = currentInteraction.owner;
		if (claimOwner && [...known.parent.owners.values()].includes(claimOwner)) {
			if (child.directOwner !== claimOwner) {
				this.releaseDirectChild(child);
				child.directOwner = claimOwner;
				child.releaseDirectChild = claimOwner.claimDirectChild?.(child.childThreadId);
			}
			if (!transitioned) claimOwner.onDirectChildAccepted?.();
		}
		return child;
	}
	resolveParentOwner(state, turnIdInput) {
		const turnId = turnIdInput?.trim();
		if (!turnId) return;
		const owners = [...state.owners.values()].filter((owner) => owner.turnId === turnId);
		return owners.length === 1 ? owners[0] : void 0;
	}
	registerDirectSpawnChild(state, turnIdInput, evidence, owner) {
		const childState = this.registerChildThread(state, evidence.childThreadId, {
			...evidence.agentPath === void 0 ? {} : { agentPath: evidence.agentPath },
			...owner?.claimDirectChild ? { directOwner: owner } : {}
		});
		if (!owner) this.bufferPendingChildAdmissionEvidence(turnIdInput, {
			...evidence,
			kind: "spawn"
		});
		else if (childState) owner.onDirectChildAccepted?.();
		return childState;
	}
	bufferPendingChildAdmissionEvidence(turnIdInput, evidence) {
		const turnId = turnIdInput?.trim();
		const requiresUnboundOwner = evidence.kind !== "interaction" || !evidence.owner;
		if (!turnId || requiresUnboundOwner && !this.hasUnboundParentOwner(evidence.parentThreadId)) return;
		const pending = this.pendingChildAdmissionEvidence.get(turnId) ?? [];
		if (evidence.kind === "interaction") {
			const nativeTurn = [...this.knownChildren.get(evidence.childThreadId)?.observedTurns ?? []].find(([nativeTurnId, observed]) => observed.awaitingInteraction && ![...this.pendingChildAdmissionEvidence.values()].flat().some((candidate) => candidate.kind === "interaction" && candidate.parentThreadId === evidence.parentThreadId && candidate.childThreadId === evidence.childThreadId && candidate.nativeTurnId === nativeTurnId));
			if (nativeTurn) evidence.nativeTurnId = nativeTurn[0];
		}
		if (pending.some((candidate) => candidate.parentThreadId === evidence.parentThreadId && candidate.kind === evidence.kind && candidate.childThreadId === evidence.childThreadId && candidate.agentPath === evidence.agentPath && (candidate.kind === "spawn" || evidence.kind === "spawn" || candidate.nativeTurnId !== void 0 && candidate.nativeTurnId === evidence.nativeTurnId || evidence.itemId !== void 0 && candidate.itemId === evidence.itemId)) || requiresUnboundOwner && [...this.pendingChildAdmissionEvidence.values()].reduce((count, entries) => count + entries.length, 0) >= MAX_PENDING_CHILD_ADMISSION_EVIDENCE) return;
		pending.push(evidence);
		this.pendingChildAdmissionEvidence.set(turnId, pending);
	}
	drainPendingChildAdmissionEvidence(state, owner, turnId, observeActivity = false) {
		const pending = this.pendingChildAdmissionEvidence.get(turnId);
		const ownerIsCurrent = [...state.owners.values()].includes(owner);
		if (!pending || this.parentStates.get(state.parentThreadId) !== state || this.retiredParentStates.has(state) || !ownerIsCurrent && !pending.some((entry) => entry.kind === "interaction" && entry.admittedOwner === owner)) return;
		const remaining = [];
		const affectedChildren = /* @__PURE__ */ new Set();
		const unknownChildren = /* @__PURE__ */ new Set();
		for (const evidence of pending) {
			if (evidence.parentThreadId !== state.parentThreadId) {
				remaining.push(evidence);
				continue;
			}
			if (evidence.kind === "interaction") {
				if (!ownerIsCurrent && evidence.admittedOwner !== owner) {
					remaining.push(evidence);
					continue;
				}
				if (ownerIsCurrent) evidence.owner = owner;
				const known = this.knownChildren.get(evidence.childThreadId);
				if (known && known.parent !== state) continue;
				if (!known || !known.assignment.terminal && !known.assignment.nativeTurnId && !this.currentChild(evidence.childThreadId) && this.recovery.pendingChildRecoveries(state, evidence.childThreadId).length > 0) {
					remaining.push(evidence);
					unknownChildren.add(evidence.childThreadId);
					continue;
				}
				if (evidence.agentPath && !known.agentPaths.has(evidence.agentPath)) this.registerAgentPath(state, evidence.childThreadId, evidence.agentPath);
				if (evidence.nativeTurnId) {
					const observed = known.observedTurns.get(evidence.nativeTurnId);
					if (observed) observed.awaitingInteraction = void 0;
					const nativeTurn = known.pendingTurns.find((turn) => turn.turnId === evidence.nativeTurnId);
					if (nativeTurn) {
						if (!nativeTurn.admittedOwner) {
							nativeTurn.admittedOwner = ownerIsCurrent ? owner : evidence.admittedOwner;
							if (ownerIsCurrent) owner.onDirectChildAccepted?.();
						}
					} else if (this.currentChild(evidence.childThreadId)?.nativeTurnId !== evidence.nativeTurnId) continue;
				} else if (ownerIsCurrent) remaining.push(evidence);
				else continue;
				affectedChildren.add(evidence.childThreadId);
				continue;
			}
			if (!ownerIsCurrent || !owner.claimDirectChild) continue;
			if (this.registerChildThread(state, evidence.childThreadId, {
				...evidence.agentPath === void 0 ? {} : { agentPath: evidence.agentPath },
				directOwner: owner
			})) owner.onDirectChildAccepted?.();
		}
		if (remaining.length) this.pendingChildAdmissionEvidence.set(turnId, remaining);
		else this.pendingChildAdmissionEvidence.delete(turnId);
		for (const threadId of unknownChildren) this.associateUnregisteredChildInteractions(state, threadId);
		for (const threadId of affectedChildren) {
			const known = this.knownChildren.get(threadId);
			if (known?.parent !== state) continue;
			const previous = this.currentChild(threadId);
			const child = this.admitFollowupChild(known, threadId, ownerIsCurrent ? owner : void 0);
			if (observeActivity && child && child !== previous && child.nativeTurnState === "active") this.turnObservation.emitChildTaskActivity({
				method: "turn/started",
				params: {
					threadId,
					turn: { id: child.nativeTurnId }
				}
			}, child);
		}
	}
	hasUnboundParentOwner(parentThreadId) {
		return [...this.parentStates.get(parentThreadId)?.owners.values() ?? []].some((owner) => owner.turnId === void 0);
	}
	clearUnconsumablePendingChildAdmissionEvidence() {
		this.filterPendingChildAdmissionEvidence((evidence) => {
			const known = this.knownChildren.get(evidence.childThreadId);
			if (known && known.parent.parentThreadId !== evidence.parentThreadId) return false;
			if (evidence.kind === "interaction" && evidence.owner) {
				const state = this.parentStates.get(evidence.parentThreadId);
				if (state && [...state.owners.values()].includes(evidence.owner)) return true;
				return Boolean(evidence.admittedOwner && state && this.recovery.pendingChildRecoveries(state, evidence.childThreadId).length > 0);
			}
			return this.hasUnboundParentOwner(evidence.parentThreadId);
		});
	}
	clearPendingChildAdmissionEvidenceForParent(parentThreadId) {
		this.filterPendingChildAdmissionEvidence((evidence) => evidence.parentThreadId !== parentThreadId);
	}
	removePendingSpawnAdmissionEvidenceForChild(childThreadId) {
		this.filterPendingChildAdmissionEvidence((evidence) => evidence.childThreadId !== childThreadId || evidence.kind === "interaction");
	}
	filterPendingChildAdmissionEvidence(keep) {
		for (const [turnId, pending] of this.pendingChildAdmissionEvidence) {
			const remaining = pending.filter(keep);
			if (remaining.length) this.pendingChildAdmissionEvidence.set(turnId, remaining);
			else this.pendingChildAdmissionEvidence.delete(turnId);
		}
	}
	registerAgentPath(state, childThreadId, agentPath) {
		this.applyNativeReceipts(state, registerCodexNativeSubagentReceiptAlias({
			state,
			childThreadId,
			agentPath,
			known: this.knownChildren.get(childThreadId),
			aliases: this.childThreadIdsByAgentPath
		}));
	}
	unregisterChild(childState, options = {}) {
		this.releaseDirectChild(childState);
		const known = this.knownChildren.get(childState.childThreadId);
		if (childState.terminal && !childState.subscriptionClosed && options.retainSubscription !== false && !this.disposed && known?.parent.parentThreadId === childState.parentThreadId && known.assignment.runId === childState.runId) this.updateChildThreadOwnership("retain", childState.childThreadId, this.retainChildThread);
		this.recovery.clearRecoveryTimers(childState);
		this.completionDelivery.release(childState);
		if (this.childStates.get(childState.runId) === childState) this.childStates.delete(childState.runId);
		if (![...this.childStates.values()].some((remainingChild) => remainingChild.parentThreadId === childState.parentThreadId)) {
			const releaseParentThread = this.parentThreadRetentions.get(childState.parentThreadId);
			this.parentThreadRetentions.delete(childState.parentThreadId);
			releaseParentThread?.();
		}
		this.recovery.collectThreadStatusRevision(childState.childThreadId);
		this.releaseClientRetentionIfIdle();
		const state = this.parentStates.get(childState.parentThreadId);
		if (state) this.pruneParentIfUnused(state);
		if (known && known.parent !== state) this.pruneParentIfUnused(known.parent);
	}
	releaseDirectChild(childState) {
		const release = childState.releaseDirectChild;
		childState.releaseDirectChild = void 0;
		childState.directOwner = void 0;
		release?.();
	}
	rejectPendingDirectChild(state, childThreadId, reason) {
		if ([...this.pendingChildAdmissionEvidence.values()].flat().some((evidence) => evidence.kind === "interaction" && evidence.parentThreadId === state.parentThreadId && evidence.childThreadId === childThreadId)) return;
		for (const owner of state.owners.values()) owner.rejectPendingDirectChild?.(childThreadId, reason);
	}
	updateChildThreadOwnership(operation, childThreadId, update) {
		if (!update) return;
		update(childThreadId).catch((error) => {
			embeddedAgentLog.warn("Failed to update Codex native subagent thread ownership", {
				operation,
				childThreadId,
				error: formatErrorMessage(error)
			});
		});
	}
	releaseClientRetentionIfIdle() {
		if ([...this.childStates.values()].some((childState) => !childState.terminal && !childState.settledWithoutCompletion)) return;
		this.releaseRetainedClient();
	}
	releaseRetainedClient() {
		const release = this.releaseClientRetention;
		this.releaseClientRetention = void 0;
		release?.();
	}
	pruneParentIfUnused(state) {
		if (this.submissions.hasCustody(state)) return;
		if (state.owners.size > 0) return;
		if (this.childCloses.hasPending(state)) return;
		for (const childState of this.childStates.values()) if (childState.parentThreadId === state.parentThreadId) return;
		for (const known of this.knownChildren.values()) if (known.parent === state && this.currentChild(known.assignment.childThreadId)) return;
		if (!this.retiredParentStates.has(state) && this.recovery.allCandidates().some((candidate) => candidate.parentState === state)) return;
		if (this.parentStates.get(state.parentThreadId) === state) {
			this.submissions.retire(state);
			this.childCloses.clear(state);
			this.recovery.clearTerminalRevisionsForParent(state.parentThreadId);
			this.historyRecovery.forgetRecoveredParent(state);
			this.parentStates.delete(state.parentThreadId);
			for (const [threadId, known] of this.knownChildren) if (known.parent === state) {
				this.childCloses.retireReceiver(known, () => this.updateChildThreadOwnership("release", threadId, this.releaseChildThread));
				for (const path of known.agentPaths) this.childThreadIdsByAgentPath.delete(buildCodexNativeSubagentAgentPathKey(state.parentThreadId, path));
				this.knownChildren.delete(threadId);
			}
		}
	}
	async reconcileTaskRowsForParent(state) {
		if (this.disposed || this.parentStates.get(state.parentThreadId) !== state || !state.taskRuntime || !state.requesterSessionKey || !state.taskRuntimeScope) return;
		const candidates = /* @__PURE__ */ new Map();
		const turnBuffers = /* @__PURE__ */ new Map();
		const taskRecords = this.historyRecovery.selectTaskRecords(state);
		for (const task of taskRecords) {
			const assignment = readNativeTaskAssignment(task);
			if (assignment && this.historyRecovery.canRestoreTask(task, state) && (task.deliveryStatus === "delivered" || readCodexNativeSubagentHistoryOwner(task.detail)?.parentThreadId === state.parentThreadId) && !this.knownChildren.has(assignment.childThreadId)) this.restoreKnownChild(state, assignment, taskRecords);
			if (!this.historyRecovery.shouldReconcileTask(task, this.now())) continue;
			if (!assignment) continue;
			const childThreadId = assignment.childThreadId;
			const observedTurns = turnBuffers.get(childThreadId) ?? this.recovery.resolveChildTurnBuffer(state, childThreadId);
			turnBuffers.set(childThreadId, observedTurns);
			candidates.set(assignment.runId, {
				taskId: task.taskId,
				runId: assignment.runId,
				nativeTurnId: assignment.nativeTurnId,
				terminal: task.status === "succeeded" || task.status === "failed" || task.status === "cancelled",
				observedTurns,
				parentState: state,
				deliveryReceipts: this.resolveChildReceiptOwner(state, childThreadId),
				requesterSessionKey: state.requesterSessionKey,
				childThreadId,
				recoveryAttempt: 0,
				taskRuntimeScope: state.taskRuntimeScope,
				agentId: state.agentId,
				taskRuntime: state.taskRuntime
			});
		}
		restoreCodexNativeSubagentTaskReceipts({
			state,
			taskRecords,
			knownChildren: this.knownChildren,
			applyReceipts: (runIds) => this.applyNativeReceipts(state, runIds)
		});
		let previous;
		for (const candidate of candidates.values()) previous = this.recovery.reconcileTaskCandidate(candidate, previous).catch((error) => {
			logRecoveryFailure(candidate.childThreadId, error);
		});
		await previous;
	}
	restoreKnownChild(state, assignment, taskRecords, observedTurns = []) {
		const { current, found, terminal, nativeParentThreadId, storedTurnIds, completedRunIds } = this.historyRecovery.readChildAssignments(state, assignment, taskRecords);
		for (const runId of completedRunIds) state.mirror?.markAuthoritativeCompletion(assignment.childThreadId, runId);
		if (found) state.mirror?.restoreCurrentTaskRun(assignment.childThreadId, current.runId);
		const currentIndex = observedTurns.findIndex((turn) => turn.turnId === current.nativeTurnId);
		const pendingTurns = observedTurns.filter((turn, index) => index > currentIndex && turn.turnId !== current.nativeTurnId && !storedTurnIds.has(turn.turnId)).map((turn, index, turns) => ({
			turnId: turn.turnId,
			state: turn.state === "active" && index < turns.length - 1 ? void 0 : turn.state
		}));
		const previousRunId = this.knownChildren.get(assignment.childThreadId)?.assignment.runId;
		this.knownChildren.set(assignment.childThreadId, {
			parent: state,
			nativeParentThreadId,
			deliveryReceipts: this.resolveChildReceiptOwner(state, assignment.childThreadId),
			assignment: {
				...current,
				terminal,
				unanchored: !terminal && !current.nativeTurnId && found ? true : void 0
			},
			turnId: pendingTurns.at(-1)?.turnId ?? current.nativeTurnId,
			observedTurns: new Map([...new Set([
				...storedTurnIds,
				current.nativeTurnId,
				current.initialTurnId,
				...observedTurns.map((turn) => turn.turnId)
			].filter((id) => Boolean(id)))].map((turnId) => [turnId, pendingTurns.some((turn) => turn.turnId === turnId) ? { awaitingInteraction: true } : {}])),
			pendingTurns,
			agentPaths: this.knownChildren.get(assignment.childThreadId)?.agentPaths ?? /* @__PURE__ */ new Set([assignment.childThreadId])
		});
		if (previousRunId !== current.runId) this.refreshWaitDependency(state, assignment.childThreadId);
	}
	async reconcileTaskCandidateOnce(candidate) {
		if (this.disposed || this.retiredParentStates.has(candidate.parentState)) return;
		const childBeforeRead = this.childStates.get(candidate.runId);
		const prepared = this.historyRecovery.prepareTaskRead(candidate, childBeforeRead, this.now());
		if (!prepared) return;
		const { task, historyOwner } = prepared;
		let { assignment } = prepared;
		candidate.terminal = prepared.terminal;
		candidate.nativeTurnId = assignment.nativeTurnId;
		const statusRead = this.recovery.retainThreadStatusRevision(assignment.childThreadId);
		try {
			let recovery;
			try {
				recovery = await this.historyRecovery.readTask(assignment, task, candidate);
			} catch (error) {
				logRecoveryFailure(candidate.childThreadId, error);
				this.recovery.scheduleTaskCandidateReconciliation(candidate);
				return;
			}
			if (this.disposed || this.retiredParentStates.has(candidate.parentState) || this.parentStates.get(candidate.parentState.parentThreadId) !== candidate.parentState) return;
			if (!statusRead.isCurrent() || this.childStates.get(candidate.runId) !== childBeforeRead) {
				this.recovery.scheduleTaskCandidateReconciliation(candidate);
				return;
			}
			const parentThreadId = recovery.parentThreadId;
			if (!parentThreadId) {
				this.recovery.scheduleTaskCandidateReconciliation(candidate);
				return;
			}
			if (!this.historyRecovery.isCurrentTask(candidate, task, historyOwner, parentThreadId, this.now())) return;
			if (!candidate.terminal && !assignment.nativeTurnId && candidate.observedTurns.length > 0) {
				if (!recovery.assignmentTurnId) {
					this.recovery.scheduleTaskCandidateReconciliation(candidate);
					return;
				}
				assignment = {
					...assignment,
					nativeTurnId: recovery.assignmentTurnId
				};
				candidate.nativeTurnId = recovery.assignmentTurnId;
			}
			const nativeParent = this.parentStates.get(parentThreadId);
			const controller = this.knownChildren.get(assignment.childThreadId)?.parent;
			for (const owner of [nativeParent, controller]) if (owner && (this.retiredParentStates.has(owner) || !this.historyRecovery.acceptsParent(owner, candidate.parentState))) return;
			const historicalAssignment = candidate.terminal && task.deliveryStatus !== "delivered";
			let state = historicalAssignment ? nativeParent : controller ?? nativeParent;
			if (!state) {
				state = {
					parentThreadId,
					owners: /* @__PURE__ */ new Map(),
					turnIds: /* @__PURE__ */ new Set(),
					deliveryReceipts: parentThreadId === candidate.parentState.parentThreadId ? candidate.deliveryReceipts : new CodexNativeSubagentDeliveryReceipts(),
					requesterSessionKey: candidate.requesterSessionKey,
					taskRuntimeScope: candidate.taskRuntimeScope,
					agentId: candidate.agentId,
					historyOwner: historyOwner ?? candidate.parentState.historyOwner,
					taskRuntime: candidate.taskRuntime
				};
				this.prepareParentTaskRuntime(state);
				this.parentStates.set(parentThreadId, state);
			}
			this.historyRecovery.retainRecoveryParents([state], candidate.parentState);
			const observedTurns = parentThreadId === candidate.parentState.parentThreadId ? candidate.observedTurns.map((turn) => ({
				turnId: turn.turnId,
				state: turn.state && turn.state !== "active" ? turn.state : recovery.observedPendingTurns.find((observed) => observed.turnId === turn.turnId)?.state ?? turn.state
			})) : [];
			const childState = this.registerChildThread(state, assignment, {
				...historicalAssignment ? { historicalAssignment: true } : {},
				...recovery.agentPath ? { agentPath: recovery.agentPath } : {},
				observedTurns
			});
			if (!childState) {
				this.pruneParentIfUnused(state);
				return;
			}
			childState.requiresHistoryOwner = true;
			childState.completionTaskId ??= candidate.taskId;
			candidate.observedTurns.length = 0;
			this.recordRecoveredChildTurn(state, childState, recovery);
			if (recovery.threadState === "active") this.observeActiveChild(childState);
			if (recovery.threadState === "other") this.recovery.clearSystemErrorFallback(childState);
			if (recovery.resumable) {
				this.settleResumableChild(childState);
				return;
			}
			const completion = this.processRecoveredCompletion(state, childState, recovery);
			if (completion) await completion;
			else if (!recovery.completion && !recovery.fallbackCompletion) this.recovery.scheduleRecoveryPoll(childState);
		} finally {
			statusRead.release();
		}
	}
};
const codexNativeSubagentMonitorRuntime = createCodexNativeSubagentMonitorRuntime(Monitor);
//#endregion
export { CodexToolProgressProjection as a, CodexToolTranscriptProjection as i, CodexEventProjection as n, shouldEmitTranscriptToolProgress as o, emitCodexAgentEvent as r, codexNativeSubagentMonitorRuntime as t };
