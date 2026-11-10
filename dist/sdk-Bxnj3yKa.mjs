import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as consumeRootOptionToken } from "./cli-root-options-DGcy1qRg.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord, o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { n as filterStringEntries, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as appendRegularFile } from "./fs-safe-6Z4UiMS4.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { _ as readAgentAssistantSource, a as emitAgentEvent, l as emitAgentEventWithAssistantSourceIfCurrent, n as bindAgentAssistantSource, s as emitAgentEventForRunContext, u as emitAgentRunOutputTokens } from "./agent-events-Bf3Js0D3.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { Vt as projectChatErrorDetail } from "./sessions-CVESrViJ.mjs";
import "./types-BXd0kI8-.mjs";
import { _ as resolveSessionAgentIds, s as resolveAgentExecutionContract } from "./agent-scope-DXrnO3F4.mjs";
import { n as isAutomationsToolName } from "./automations-tool-name-DaxQ5QU2.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { r as splitShellArgs, t as hasTopLevelShellControlOperator } from "./shell-argv-Dy8gqirH.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { l as resolveAssistantMessagePhase, o as parseAssistantTextSignature, s as readAssistantTextBlocksForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { l as recordSessionCompacted } from "./session-state-events-BCzDVKh0.mjs";
import { l as isPreDispatchToolCallRejectionMessage } from "./message-patterns-DSkmGYcR.mjs";
import { t as isProviderRefusalAssistantError } from "./diagnostics-CAGhEztD.mjs";
import { a as summarizeToolValidationError, n as hasTerminalControlCharacter, t as createToolValidationErrorSummary } from "./tool-error-summary-CezRoLUS.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { C as markReplyPayloadForSourceSuppressionDelivery, D as setReplyPayloadMetadata, O as shouldKeepPayloadDuringSilentTurn, c as getReplyPayloadMetadata, n as addReplyPayloadMediaFailures, o as copyReplyPayloadMetadata, r as appendReplyMediaFailures } from "./reply-payload-BLX_BF2U.mjs";
import { i as deriveSessionTotalTokens, l as makeZeroUsageSnapshot, o as hasNonzeroUsage, s as hasObservedModelUsage, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { _ as getInternalToolTurnCompletion, v as setInternalBeforeToolBatch, y as setInternalToolTurnCompletion } from "./internal-hooks-CSjTREUl.mjs";
import { i as readToolEffectReceipt, n as consumeToolExecutionNotStarted, r as markToolExecutionNotStarted, t as buildToolEffectReceipt } from "./tool-effect-receipt-BHVAm8DM.mjs";
import { o as convertToLlm } from "./messages-Cdi_z_94.mjs";
import { t as Agent } from "./agent-core-BbGXCiXw.mjs";
import { a as scanReasoningTags, i as parseReasoningTagAt, n as findMarkdownCodeRegions } from "./reasoning-tags-DOZ8HVZL.mjs";
import "./code-regions-Cy_WAn7O.mjs";
import { a as createTextProjection, c as trimTextFilter, l as trimTextPreservingCode, t as applyTextFilters } from "./text-projection-mdP9TY8k.mjs";
import { i as parseInlineDirectives, t as findDirectiveCodePrefix } from "./directive-tags-DmdxLrNX.mjs";
import { o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { c as detectToolCallShapedText } from "./src-DkL06zvq.mjs";
import { g as findFinalTagMatches, m as hasOrphanReasoningCloseBoundary, n as assistantVisibleTextFilters, p as toolCallXmlTextFilter, v as downgradedToolCallTextFilter, y as stripDowngradedToolCallText } from "./assistant-visible-text-DZwixI8b.mjs";
import { i as sanitizeUserFacingText, s as extractTextFromChatContent } from "./user-facing-text-BNFEPbYx.mjs";
import { k as parseExecApprovalResultText } from "./user-copy-BAz4s3EV.mjs";
import { _ as withSessionMetadataPublication, y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { o as resolveProviderRequestPolicy } from "./provider-attribution-Dr21G8q1.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { A as consumePreExecutionBlockedToolCall, M as consumeTrackedToolExecutionStarted, N as peekAdjustedParamsForToolCall, P as peekPreExecutionBlockedToolCall, j as consumeStructuredReplaySafeToolCall, k as consumeAdjustedParamsForToolCall } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { a as readToolResultDetails, n as isToolResultError } from "./tool-result-error-IpvGgAny.mjs";
import { a as findMediaGenerationOperation, d as isTerminalMediaGenerationStatus } from "./media-generation-activity-CdYWMYrm.mjs";
import "./reply-payload-79LnOCyy.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import { n as splitTrailingDirective, t as createStreamingDirectiveAccumulator } from "./streaming-directives-Bc5NTbqS.mjs";
import { r as resolveCompletedActivityWrappers } from "./agent-activity-presentation-0UzpmALS.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-Cjgdy85s.mjs";
import { i as isToolCallBlockType } from "./tool-block-contract-CgqnHcSD.mjs";
import { o as normalizeHeartbeatToolResponse } from "./heartbeat-tool-response-ByRAuVDa.mjs";
import { t as sanitizeForConsole } from "./console-sanitize-CaBHLewO.mjs";
import { n as getModelRegistryRuntime } from "./model-registry-pyM1O0Zs.mjs";
import { r as bindStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { f as parseReplyDirectives } from "./payloads-CZkv8Yff.mjs";
import { n as isTerminalAssistantError } from "./retry-2KnjF4V1.mjs";
import { n as classifyAssistantFailoverReason } from "./assistant-message-failures-LYMR8J6z.mjs";
import { m as formatUserFacingAssistantErrorText } from "./embedded-agent-helpers-CRUmVsjM.mjs";
import { i as resolveCurrentSourceMessagingToolPartial, n as isMessagingToolDuplicateNormalized, r as normalizeTextForComparison } from "./messaging-dedupe-D188k2i5.mjs";
import { n as buildTextObservationFields, r as shouldSuppressRawErrorConsoleSuffix, t as buildApiErrorObservationFields } from "./embedded-agent-error-observation-D3FVUug5.mjs";
import { n as createInlineCodeState, t as buildCodeSpanIndex } from "./code-spans-CZQEb2AV.mjs";
import { i as formatUnknownCompactionReasonDetail, r as classifyCompactionReason } from "./compact-reasons-DEvuk_7a.mjs";
import { i as REQUIRED_PARAM_GROUPS, o as missingRequiredParamLabels } from "./agent-tools.before-tool-call.decision-DlE5PesW.mjs";
import { a as isMessagingToolTargetEvidenceAction, i as isMessagingToolSendAction, n as isMessagingTool, o as isPluginNativeMessagingTool } from "./embedded-agent-messaging-BHfhPlTk.mjs";
import { t as buildToolMutationState } from "./tool-mutation-BTW6eoAN.mjs";
import { r as normalizeAskUserParams } from "./ask-user-tool-normalization-Cqh2rKIa.mjs";
import { i as isCommandBearingToolCall, r as inferToolMetaFromArgsCore } from "./tool-display-cHpG_xAK.mjs";
import { t as formatToolAggregate } from "./tool-meta-CaIUBl4r.mjs";
import { t as resolveFileMutationToolName } from "./tool-mutation-names-C0vN6seH.mjs";
import { a as reserveAskUserPromptDelivery, l as sendQuestionToolPrompt, n as cancelAskUserPromptDelivery, o as settleAskUserPromptDelivery, s as waitForAskUserPromptReady } from "./ask-user-tool-CIppZGJ0.mjs";
import { i as resolveReplyExpectation, r as resolveReplyCompletion } from "./reply-completion-B5n1Cnxm.mjs";
import { s as readMcpAppChannelView } from "./mcp-ui-resource-JMA05gzV.mjs";
import { r as projectAgentToolActivity, t as emitAgentActivityEvent } from "./agent-activity-events-D7azORwm.mjs";
import { o as markdownToIR } from "./ir-zdhOg5S3.mjs";
import { n as normalizeSecretsRequestParams } from "./secrets-tool-vT5mBKZ0.mjs";
import { r as resolveAgentAssistantTurnId } from "./tool-execution-context-BwYF5HLu.mjs";
import { r as collectAgentInternalEventMedia } from "./internal-events-Crl175ti.mjs";
import { b as resolveSourceReplyDelivery, c as hasCommittedMessagingToolDeliveryEvidence, m as hasMessagingToolDeliveryEvidence } from "./delivery-evidence-Do1wex_l.mjs";
import { a as extractAssistantThinking, c as extractThinkingFromTaggedStream, d as isAssistantMessage, f as prepareAssistantVisibleText, i as extractAssistantCommentaryText, l as extractThinkingFromTaggedText, n as createAssistantVisibleStreamText, o as extractAssistantVisibleText, p as promoteThinkingTagsToBlocks, r as createThinkingTagStreamState, s as extractEmbeddedAssistantText, t as createAssistantStreamBlockState } from "./embedded-agent-utils-Bl20r92X.mjs";
import { c as readEmbeddedMessageDeliveryFact, r as isDeliveredCoreCurrentChannelWidgetResult, s as projectPluginMessageDeliveryFact } from "./embedded-agent-message-delivery-DeQ0PPQm.mjs";
import { o as parseJsonMessageParam } from "./message-action-params-B0-2Qm-A.mjs";
import { i as normalizeAcceptedSessionSpawnResult, n as hasCompletionMessageSessionSpawn, t as hasAcceptedSessionSpawn } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { r as getCoreTtsToolResultMediaUrls } from "./tts-tool-result-provenance-BbSbWcUn.mjs";
import { t as runBestEffortCallback } from "./embedded-agent-subscribe.callback-BBye3ou6.mjs";
import { n as setSessionModelUsageSink, r as createSessionManagerRuntimeRegistry } from "./session-model-usage-C52vsLrM.mjs";
import "./context-token-pressure-II9nRGTn.mjs";
import { m as assessLastAssistantMessage } from "./tool-result-truncation-B6wvsjzz.mjs";
import { C as stripStaleAssistantUsageBeforeLatestCompaction, S as sanitizeCompactionReplayMessages, o as AgentSession } from "./settings-manager-D9ggLoN1.mjs";
import { c as sessionManagerReadTranscriptStart, d as withSessionManagerAppend, f as SessionMetadataCommittedError, s as sessionManagerReadInitialContext } from "./session-manager-Mve5HWCW.mjs";
import { i as toNormalizedUsage, r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-Cd3yWsMu.mjs";
import { u as resolveFinalAssistantVisibleText } from "./helpers-3t21Jnao.mjs";
import { r as isZeroUsageEmptyStopAssistantTurn } from "./messages-CZ7XNOd9.mjs";
import { n as recordEmbeddedSessionForkMessage } from "./session-fork-11GSQ2uI.mjs";
import { t as resolveRawAssistantAnswerText } from "./assistant-answer-text-B4DvBXWx.mjs";
import { t as TOOL_FAILURE_INSTRUCTION } from "./tool-outcome-instructions-D1-OxlK6.mjs";
import { a as isDeliveredMessagingToolSendToCurrentSource, n as extractMessagingToolSendResult, r as extractMessagingToolSourceReplyPayload, t as extractMessagingToolSend } from "./embedded-agent-messaging-extraction-DjEst-db.mjs";
import { t as captureToolAuthoredSourceReply } from "./embedded-agent-tool-authored-source-reply-DttnXWht.mjs";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-Cq8C8pJJ.mjs";
import { i as resolveMessageToolSourceReplyFinal, n as isDeliveredMessagingToolResult, r as readMessageToolSourceReplyText, t as isDeliveredMessageToolOnlySourceReplyResult } from "./embedded-agent-message-tool-source-reply-CiWOpEbo.mjs";
import { t as updateLiveEditDiffProgress } from "./embedded-agent-live-edit-diff-DDt8S0kd.mjs";
import { t as projectProgressCardChannelUpdate } from "./progress-card-channel-summary-dxOwRAaX.mjs";
import { a as extractToolResultText, c as prepareToolResult, d as truncateLiveExecOutput, i as extractToolErrorMessage, l as readAsyncStartedTaskIds, n as capLiveExecResult, o as isAsyncStartedToolResult, r as extractToolErrorCode, s as isToolResultTimedOut, t as buildToolLifecycleErrorResult, u as sanitizeToolResult } from "./embedded-agent-tool-results-0KH5a_sR.mjs";
import { i as filterToolResultMediaUrls, n as collectMessagingMediaUrlsFromToolResult, r as extractToolResultMediaArtifact, t as collectMessagingMediaUrlsFromRecord } from "./embedded-agent-tool-media-BiXZn9vg.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isResponsesOutputLimitToolCallError } from "@openclaw/ai/diagnostics";
import { OPENAI_RESPONSES_APIS } from "@openclaw/ai/internal/openai-responses-payload-policy";
import { hasOnlyAssistantReasoningContent, isReasoningOnlyLengthAssistantTurn, readAssistantThinkingAppend } from "@openclaw/ai/internal/shared";
import { clampThinkingLevel } from "@openclaw/ai/internal/runtime";
//#region src/agents/embedded-agent-subscribe.handlers.tools.start.ts
const TRACE_REQUIRED_PARAM_GROUPS = {
	read: [{
		keys: ["path", "file_path"],
		label: "path"
	}],
	write: REQUIRED_PARAM_GROUPS.write,
	edit: REQUIRED_PARAM_GROUPS.edit
};
function reserveQuestionPromptDelivery(toolName, toolCallId, sessionKey, runId, agentId, args) {
	try {
		const { questions, timeoutSeconds } = toolName === "secrets" ? normalizeSecretsRequestParams(args) : normalizeAskUserParams(args);
		return reserveAskUserPromptDelivery({
			toolCallId,
			sessionKey,
			runId,
			agentId,
			questions,
			timeoutSeconds
		});
	} catch {
		return;
	}
}
function traceToolExecutionStart(params) {
	if (!params.ctx.log.trace || params.ctx.log.isEnabled?.("trace") !== true) return;
	const args = params.args;
	const argsType = Array.isArray(args) ? "array" : typeof args;
	const argsKeys = args && typeof args === "object" && !Array.isArray(args) ? Object.keys(args).toSorted() : void 0;
	const groups = TRACE_REQUIRED_PARAM_GROUPS[params.toolName];
	const record = args && typeof args === "object" ? args : void 0;
	const requiredParamsMissing = groups?.length ? missingRequiredParamLabels(record, groups) : [];
	params.ctx.log.trace("embedded run tool start", {
		event: "embedded_tool_execution_start",
		tags: [
			"tool_start",
			"embedded",
			"trace"
		],
		runId: params.ctx.params.runId,
		toolName: params.toolName,
		toolCallId: params.toolCallId,
		argsType,
		...argsKeys?.length ? { argsKeys } : {},
		...params.ctx.params.sessionKey ? { sessionKey: params.ctx.params.sessionKey } : {},
		...params.ctx.params.sessionId ? { sessionId: params.ctx.params.sessionId } : {},
		...params.ctx.params.agentId ? { agentId: params.ctx.params.agentId } : {},
		...requiredParamsMissing.length ? { requiredParamsMissing } : {}
	});
}
const TOOL_START_WARNING_PREVIEW_MAX_CHARS = 200;
function buildToolStartWarningArgsPreview(rawArgsPreview) {
	if (rawArgsPreview == null) return;
	const wasTruncated = rawArgsPreview.length > TOOL_START_WARNING_PREVIEW_MAX_CHARS;
	const bounded = truncateUtf16Safe(rawArgsPreview, TOOL_START_WARNING_PREVIEW_MAX_CHARS);
	const preview = sanitizeForConsole(bounded, TOOL_START_WARNING_PREVIEW_MAX_CHARS);
	return wasTruncated && preview ? `${preview}…` : preview;
}
/** Track tool execution start data for after_tool_call hook. */
const toolStartData = /* @__PURE__ */ new Map();
function buildToolStartKey(runId, toolCallId) {
	return `${runId}:${toolCallId}`;
}
function* iterateRunToolStarts(runId) {
	const prefix = `${runId}:`;
	for (const entry of toolStartData) if (entry[0].startsWith(prefix)) yield entry;
}
function countActiveToolExecutions(runId) {
	const entries = iterateRunToolStarts(runId);
	let count = 0;
	while (!entries.next().done) count += 1;
	return count;
}
/** Cleans up tool start data for a run that has been unsubscribed or aborted. */
function cleanupRunToolStartData(runId) {
	for (const [key] of iterateRunToolStarts(runId)) toolStartData.delete(key);
}
function buildToolCallSummary(toolName, args, meta, instanceReplaySafe, ownerKey, structuredReplaySafe) {
	const mutation = buildToolMutationState(toolName, args, ownerKey ? { ownerKey } : void 0);
	return {
		meta,
		commandBearing: isCommandBearingToolCall(toolName, args),
		instanceReplaySafe,
		mutatingAction: mutation.mutatingAction,
		...ownerKey ? { ownerKey } : {},
		replaySafe: instanceReplaySafe && !mutation.mutatingAction || structuredReplaySafe && mutation.replaySafe
	};
}
function isExecToolName(toolName) {
	return toolName === "exec" || toolName === "bash";
}
function buildCommandItemId(toolCallId) {
	return `command:${toolCallId}`;
}
function buildCommandItemTitle(toolName, meta) {
	return meta ? `command ${meta}` : `${toolName} command`;
}
function emitTrackedItemEvent(ctx, itemData, emitLiveUpdate = true) {
	if (itemData.phase === "start") {
		ctx.state.itemActiveIds.add(itemData.itemId);
		ctx.state.itemStartedCount += 1;
	} else if (itemData.phase === "end") {
		ctx.state.itemActiveIds.delete(itemData.itemId);
		ctx.state.itemCompletedCount += 1;
	}
	if (itemData.phase !== "update" || emitLiveUpdate) emitToolActivityEvent(ctx, {
		stream: "item",
		data: itemData
	});
	else emitAgentEventCallbackBestEffort(ctx, {
		stream: "item",
		data: itemData
	});
}
function emitAgentEventCallbackBestEffort(ctx, event) {
	runBestEffortCallback({
		label: "tool agent event",
		log: ctx.log,
		callback: () => ctx.params.onAgentEvent?.(event)
	});
}
function emitToolActivityEvent(ctx, event) {
	emitAgentActivityEvent({
		runId: ctx.params.runId,
		...ctx.params.sessionKey ? { sessionKey: ctx.params.sessionKey } : {},
		...event
	});
	emitAgentEventCallbackBestEffort(ctx, {
		stream: event.stream,
		data: event.data
	});
}
function finalizeToolActivity(ctx) {
	const runId = ctx.params.runId;
	const active = [...iterateRunToolStarts(runId)].map(([key, start]) => ({
		runId: ctx.params.runId,
		callId: key.slice(runId.length + 1),
		parentToolCallId: start.parentToolCallId,
		activity: void 0
	}));
	if (active.length !== ctx.state.itemActiveIds.size || ctx.state.itemStartedCount !== ctx.state.itemCompletedCount + active.length || ctx.state.toolMetas.length !== ctx.state.itemCompletedCount) return;
	const calls = [...ctx.state.toolMetas.map((meta) => ({
		runId: ctx.params.runId,
		callId: meta.toolCallId,
		parentToolCallId: meta.parentToolCallId,
		activity: meta.activity
	})), ...active];
	for (const call of resolveCompletedActivityWrappers(calls)) if (call.activity && !call.activity.hideFromChannelProgress) emitToolActivityEvent(ctx, {
		stream: "item",
		data: {
			...call.activity,
			hideFromChannelProgress: true
		}
	});
}
function extendExecMeta(toolName, args, meta) {
	if (!isExecToolName(toolName) || !args || typeof args !== "object") return meta;
	const record = args;
	const flags = ["pty", "elevated"].filter((flag) => record[flag] === true);
	if (flags.length === 0) return meta;
	const suffix = flags.join(" · ");
	return meta ? `${meta} · ${suffix}` : suffix;
}
function handleToolExecutionStart(ctx, evt) {
	const startToolName = normalizeToolPolicyName(evt.toolName);
	ctx.state.liveEditDiffStateById.delete(evt.toolCallId);
	const questionPromptReservation = (startToolName === "ask_user" || startToolName === "secrets" && evt.args !== null && typeof evt.args === "object" && "action" in evt.args && evt.args.action === "request") && ctx.params.onToolResult && (startToolName === "ask_user" || isDeliverableMessageChannel(ctx.params.messageChannel ?? "")) ? reserveQuestionPromptDelivery(startToolName === "ask_user" ? "ask_user" : "secrets", evt.toolCallId, ctx.params.sessionKey, ctx.params.runId, ctx.params.agentId, evt.args) : void 0;
	const cancelQuestionPromptReservation = () => {
		if (questionPromptReservation) cancelAskUserPromptDelivery(evt.toolCallId, ctx.params.sessionKey, ctx.params.runId, ctx.params.agentId);
	};
	const flushBeforeStart = (flush, next) => {
		let result;
		try {
			result = flush();
		} catch (error) {
			cancelQuestionPromptReservation();
			throw error;
		}
		if (isPromiseLike(result)) return result.then(next, (error) => {
			cancelQuestionPromptReservation();
			throw error;
		});
		return next();
	};
	const continueToolExecutionStart = () => {
		const rawToolName = evt.toolName;
		const toolName = normalizeToolPolicyName(rawToolName);
		const toolCallId = evt.toolCallId;
		const args = evt.args;
		const runId = ctx.params.runId;
		ctx.state.toolExecutionSinceLastBlockReply = true;
		runBestEffortCallback({
			label: "tool execution phase",
			log: ctx.log,
			callback: () => ctx.params.onExecutionPhase?.({
				phase: "tool_execution_started",
				tool: toolName,
				toolCallId,
				source: "embedded-agent"
			})
		});
		const startedAt = Date.now();
		toolStartData.set(buildToolStartKey(runId, toolCallId), {
			startTime: startedAt,
			args,
			hideFromChannelProgress: evt.hideFromChannelProgress,
			parentToolCallId: evt.parentToolCallId,
			...ctx.params.hasRepliedRef ? { hasRepliedRef: { value: ctx.params.hasRepliedRef.value } } : {}
		});
		traceToolExecutionStart({
			ctx,
			toolName,
			toolCallId,
			args
		});
		if (toolName === "read") {
			const record = args && typeof args === "object" ? args : {};
			if (!(typeof record.path === "string" ? record.path : typeof record.file_path === "string" ? record.file_path : "").trim()) {
				const argsType = typeof args;
				const argsPreview = buildToolStartWarningArgsPreview(readStringValue(args));
				const safeRunId = sanitizeForConsole(runId) ?? "-";
				const safeSessionKey = sanitizeForConsole(ctx.params.sessionKey);
				const safeSessionId = sanitizeForConsole(ctx.params.sessionId);
				const safeAgentId = sanitizeForConsole(ctx.params.agentId);
				const consoleMessageParts = [
					"read tool called without path:",
					`runId=${safeRunId}`,
					`toolCallId=${sanitizeForConsole(toolCallId) ?? "tool-call"}`,
					`argsType=${argsType}`
				];
				if (safeSessionKey) consoleMessageParts.push(`sessionKey=${safeSessionKey}`);
				if (safeSessionId) consoleMessageParts.push(`sessionId=${safeSessionId}`);
				if (safeAgentId) consoleMessageParts.push(`agentId=${safeAgentId}`);
				if (argsPreview) consoleMessageParts.push(`argsPreview=${argsPreview}`);
				const consoleMessage = consoleMessageParts.join(" ");
				const message = `read tool called without path: toolCallId=${toolCallId} argsType=${argsType}${argsPreview ? ` argsPreview=${argsPreview}` : ""}`;
				ctx.log.warn(message, {
					event: "embedded_read_tool_start_warning",
					tags: [
						"tool_start",
						"read",
						"embedded",
						"validation"
					],
					runId: ctx.params.runId,
					toolCallId,
					argsType,
					...safeSessionKey ? { sessionKey: ctx.params.sessionKey } : {},
					...safeSessionId ? { sessionId: ctx.params.sessionId } : {},
					...safeAgentId ? { agentId: ctx.params.agentId } : {},
					...argsPreview ? { argsPreview } : {},
					consoleMessage
				});
			}
		}
		const meta = extendExecMeta(toolName, args, inferToolMetaFromArgsCore(toolName, args, { detailMode: ctx.params.toolProgressDetail ?? "explain" }));
		const callSummary = buildToolCallSummary(toolName, args, meta, evt.replaySafe === true || ctx.params.replaySafeToolNames?.has(rawToolName) === true || ctx.params.replaySafeToolNames?.has(toolName) === true, ctx.params.sideEffectToolOwners?.get(toolName), false);
		ctx.state.toolMetaById.set(toolCallId, callSummary);
		ctx.log.debug(`embedded run tool start: runId=${ctx.params.runId} tool=${toolName} toolCallId=${toolCallId}`);
		const shouldEmitToolEvents = ctx.shouldEmitToolResult();
		const itemData = {
			...projectAgentToolActivity({
				toolCallId,
				name: toolName,
				phase: "start",
				args,
				meta,
				hideFromChannelProgress: evt.hideFromChannelProgress
			}),
			startedAt
		};
		const hideFromChannelProgress = evt.hideFromChannelProgress === true;
		emitTrackedItemEvent(ctx, itemData);
		const createStartEvent = () => ({
			stream: "tool",
			data: {
				phase: "start",
				name: toolName,
				toolCallId,
				...evt.parentToolCallId ? { parentToolCallId: evt.parentToolCallId } : {},
				args: asOptionalObjectRecord(args),
				...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
			}
		});
		emitAgentEvent({
			runId: ctx.params.runId,
			...createStartEvent()
		});
		emitAgentEventCallbackBestEffort(ctx, createStartEvent());
		if (ctx.params.onToolResult && shouldEmitToolEvents && !isAgentPlanProgressToolName(toolName) && !ctx.state.toolSummaryById.has(toolCallId)) {
			ctx.state.toolSummaryById.add(toolCallId);
			ctx.emitToolSummary(toolName, meta, callSummary.commandBearing);
		}
		const publishPrompt = ctx.params.onToolResult;
		if (questionPromptReservation && publishPrompt) {
			const questionId = questionPromptReservation.questionId;
			waitForAskUserPromptReady(questionId).then(async (questions) => {
				if (!questions) return;
				await sendQuestionToolPrompt({
					toolName: toolName === "secrets" ? "secrets" : "ask_user",
					questionId,
					questions,
					config: ctx.params.config,
					send: publishPrompt
				});
			}).then(() => settleAskUserPromptDelivery(questionId), (error) => {
				settleAskUserPromptDelivery(questionId, error);
				ctx.log.warn(`failed to deliver ${toolName} prompt: ${String(error)}`);
			});
		}
	};
	if (evt.lifecycleProvenance === "nested") return continueToolExecutionStart();
	return flushBeforeStart(() => ctx.flushBlockReplyBuffer(), () => flushBeforeStart(() => ctx.params.onBlockReplyFlush?.({
		reason: "tool_start",
		assistantMessageIndex: ctx.state.assistantMessageIndex
	}), continueToolExecutionStart));
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-terminal-evidence.ts
/** Reads this attempt's response without reviving an older transcript turn. */
function resolveCurrentAttemptAssistant(attempt) {
	return attempt.currentAttemptAssistant ?? attempt.currentAttemptCompletedAssistant;
}
/** Uses current-attempt evidence when available and otherwise preserves fail-closed legacy state. */
function isCurrentAttemptReplaySafe(attempt) {
	const replayMetadata = attempt.currentAttemptReplayMetadata ?? attempt.replayMetadata;
	return replayMetadata.replaySafe && !replayMetadata.hadPotentialSideEffects;
}
/**
* Marks whether retrying the attempt can safely replay the prompt. Concrete
* tool-instance policy, async work, committed delivery, spawned sessions, and
* cron writes all contribute side-effect evidence.
*/
function buildAttemptReplayMetadata(params) {
	const hadPotentialSideEffects = params.toolMetas.some((entry) => entry.replaySafe !== true || entry.asyncStarted === true) || hasMessagingToolDeliveryEvidence(params) || hasAcceptedSessionSpawn(params.acceptedSessionSpawns) || (params.successfulCronAdds ?? 0) > 0;
	return {
		hadPotentialSideEffects,
		replaySafe: !hadPotentialSideEffects
	};
}
/** A failed tool is not delivery or durable progress for the turn. */
function hasAttemptTerminalState(attempt) {
	return Boolean(attempt.clientToolCalls || attempt.yieldDetected || attempt.didSendDeterministicApprovalPrompt || attempt.heartbeatToolResponse || attempt.toolMediaUrls?.some((url) => url.trim().length > 0) || attempt.toolAudioAsVoice || attempt.toolTrustedLocalMedia || attempt.hasToolMediaBlockReply || attempt.didDeliverSourceReplyViaMessageTool || attempt.messagingToolSourceReplyPayloads?.length || hasMessagingToolDeliveryEvidence(attempt) || hasAcceptedSessionSpawn(attempt.acceptedSessionSpawns) || hasAsyncActivity(attempt.toolMetas) || (attempt.successfulCronAdds ?? 0) > 0);
}
function hasAsyncActivity(toolMetas) {
	return (toolMetas ?? []).some((entry) => entry.asyncStarted === true);
}
/**
* A visible parent that delegates its entire response to completion children or
* to a still-running detached media run must remain alive for completion delivery.
* Existing output, explicit silence, and non-user turns keep their established
* terminal ownership instead.
*/
function shouldContinueInteractiveAcceptedSessionSpawns(params) {
	const { attempt, run } = params;
	const delegatedToMediaRun = resolveSourceReplyDelivery(attempt) === "missing" && attempt.toolMetas.some((entry) => {
		const runId = entry.asyncStarted === true ? entry.asyncTaskRunId?.trim() : void 0;
		const operation = runId ? findMediaGenerationOperation(runId) : void 0;
		return operation !== void 0 && !isTerminalMediaGenerationStatus(operation.status);
	});
	if (!(hasCompletionMessageSessionSpawn(attempt.acceptedSessionSpawns) || delegatedToMediaRun) || attempt.terminal.kind !== "ok" || attempt.yieldDetected === true || run.replyOperation?.turnKind !== "visible" || run.currentInboundEventKind === "room_event" || run.silentExpected === true || run.inputProvenance?.kind !== void 0 && run.inputProvenance.kind !== "external_user") return false;
	if (attempt.assistantTexts.some((text) => text.trim().length > 0 && !isSilentReplyText(text, "NO_REPLY"))) return false;
	return !hasAttemptTerminalState({
		...attempt,
		acceptedSessionSpawns: [],
		...delegatedToMediaRun ? {
			toolMetas: [],
			didSendViaMessagingTool: false,
			didDeliverSourceReplyViaMessageTool: false,
			messagingToolSentTexts: [],
			messagingToolSentMediaUrls: [],
			messagingToolSentTargets: [],
			messagingToolSourceReplyPayloads: []
		} : {}
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/replay-state.ts
function createEmbeddedRunReplayState(state) {
	return {
		replayInvalid: state?.replayInvalid === true,
		hadPotentialSideEffects: state?.hadPotentialSideEffects === true
	};
}
/** Merges replay state monotonically so unsafe observations cannot be cleared accidentally. */
function mergeEmbeddedRunReplayState(current, next) {
	if (!next) return current;
	return {
		replayInvalid: current.replayInvalid || next.replayInvalid === true,
		hadPotentialSideEffects: current.hadPotentialSideEffects || next.hadPotentialSideEffects === true
	};
}
function observeReplayMetadata(current, metadata) {
	return mergeEmbeddedRunReplayState(current, {
		replayInvalid: !metadata?.replaySafe,
		hadPotentialSideEffects: metadata ? metadata.hadPotentialSideEffects : true
	});
}
function replayMetadataFromState(state) {
	return {
		hadPotentialSideEffects: state.hadPotentialSideEffects,
		replaySafe: !state.replayInvalid && !state.hadPotentialSideEffects
	};
}
//#endregion
//#region src/agents/execution-contract.ts
/**
* Resolves strict agentic execution contracts for provider/model pairs.
*/
/** Match bare model names consistently with provider/name and provider:name references. */
function stripProviderPrefix(modelId) {
	const normalizedModelId = modelId.trim();
	return (/^([^/:]+)[/:](.+)$/.exec(normalizedModelId)?.[2] ?? normalizedModelId).toLowerCase();
}
const STRICT_AGENTIC_MODEL_ID_PATTERN = /^gpt-5(?:[.o-]|$)/i;
/** The embedded mock provider exercises the same incomplete-turn recovery as OpenAI. */
function isStrictAgenticSupportedProviderModel(params) {
	const provider = normalizeLowercaseStringOrEmpty(params.provider ?? "");
	if (provider !== "openai" && provider !== "mock-openai") return false;
	const bareModelId = stripProviderPrefix(typeof params.modelId === "string" ? params.modelId : "");
	return STRICT_AGENTIC_MODEL_ID_PATTERN.test(bareModelId);
}
/** Unsupported routes remain inert; supported routes honor an explicit default opt-out. */
function isStrictAgenticExecutionContractActive(params) {
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId ?? void 0
	});
	const explicit = resolveAgentExecutionContract(params.config, sessionAgentId);
	return isStrictAgenticSupportedProviderModel({
		provider: params.provider,
		modelId: params.modelId
	}) && explicit !== "default";
}
//#endregion
//#region src/agents/embedded-agent-runner/run/incomplete-turn-classification.ts
function readAssistantSnapshotText(message) {
	return message.role === "assistant" ? parseReplyDirectives(extractEmbeddedAssistantText(message)).text.trim() : "";
}
/** Keeps pre-tool commentary distinct from a composed answer at both recovery gates. */
function hasComposedVisibleAnswerAfterSettledTools(params) {
	const latestUserIndex = params.messagesSnapshot.findLastIndex((message) => message.role === "user");
	const currentMessages = params.messagesSnapshot.slice(latestUserIndex + 1);
	const hasMediaOutput = (text) => {
		const parsed = parseReplyDirectives(text);
		return Boolean(parsed.mediaUrls?.length || parsed.audioAsVoice);
	};
	if (params.assistantTexts.some(hasMediaOutput) || currentMessages.some((message) => message.role === "assistant" && hasMediaOutput(resolveRawAssistantAnswerText(message)))) return true;
	const lastToolResultIndex = currentMessages.findLastIndex((message) => message.role === "toolResult");
	if (lastToolResultIndex < 0) return params.assistantTexts.some((text) => parseReplyDirectives(text).text.trim().length > 0);
	if (currentMessages.slice(lastToolResultIndex + 1).some((message) => readAssistantSnapshotText(message).length > 0)) return true;
	const preToolTexts = new Set(currentMessages.slice(0, lastToolResultIndex).map(readAssistantSnapshotText));
	return params.assistantTexts.some((text) => {
		const trimmed = parseReplyDirectives(text).text.trim();
		return trimmed.length > 0 && !preToolTexts.has(trimmed);
	});
}
/** Excludes pre-tool progress and generated failures; structured delivery remains evidence. */
function countSettledTurnDeliveryPayloads(params) {
	const hasComposedVisibleAnswer = params.attempt.keptAnswer !== void 0 || hasComposedVisibleAnswerAfterSettledTools(params.attempt);
	const canFinalizeProviderError = params.attempt.settledTurnFinalizationContext && !hasComposedVisibleAnswer;
	return (params.payloads ?? []).filter((payload) => {
		const metadata = getReplyPayloadMetadata(payload);
		if (payload.isError === true && Object.keys(payload).every((key) => key === "text" || key === "isError") && (!hasComposedVisibleAnswer && metadata?.toolErrorWarning || canFinalizeProviderError && metadata?.terminalProviderError)) return false;
		const hasDeliveryMetadata = metadata && Object.keys(metadata).some((key) => key !== "assistantMessageIndex" && key !== "assistantTranscriptOwned" && key !== "assistantTranscriptIdempotencyKey");
		if (hasComposedVisibleAnswer || hasDeliveryMetadata) return true;
		const text = typeof payload.text === "string" ? payload.text.trim() : "";
		return Object.entries(payload).some(([key, value]) => key !== "text" && value !== void 0 && value !== false) || !text || !params.attempt.assistantTexts.some((candidate) => candidate.trim() === text);
	}).length;
}
function hasPositiveOutputTokenUsage(message) {
	return asPositiveFiniteNumber(message?.usage?.output) !== void 0;
}
function isIncompleteTerminalAssistantTurn(params) {
	const stopReason = params.lastAssistant?.stopReason;
	return stopReason === "toolUse" || stopReason === "length" && !params.hasTerminalOutput && !params.hasAssistantVisibleText;
}
const GEMINI_INCOMPLETE_TURN_PROVIDER_IDS = /* @__PURE__ */ new Set([
	"google",
	"google-vertex",
	"google-antigravity",
	"google-gemini-cli"
]);
const GEMINI_INCOMPLETE_TURN_MODEL_ID_PATTERN = /^gemini(?:[.-]|$)/;
const OLLAMA_INCOMPLETE_TURN_PROVIDER_ID_PATTERN = /^ollama(?:-|$)/;
function isOllamaIncompleteTurnProvider(provider) {
	return OLLAMA_INCOMPLETE_TURN_PROVIDER_ID_PATTERN.test(normalizeLowercaseStringOrEmpty(provider ?? ""));
}
const RETRY_GUARD_MODEL_APIS = /* @__PURE__ */ new Set([
	"openai-completions",
	"anthropic-messages",
	"bedrock-converse-stream",
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses",
	"openclaw-openai-responses-transport",
	"openclaw-openai-chatgpt-responses-transport",
	"openclaw-azure-openai-responses-transport"
]);
function joinAssistantTexts(assistantTexts) {
	return (assistantTexts ?? []).join("\n\n").trim();
}
function shouldApplyNonVisibleTurnRetryGuard(params) {
	return params.executionContract === "strict-agentic" || isStrictAgenticSupportedProviderModel(params) || GEMINI_INCOMPLETE_TURN_PROVIDER_IDS.has(normalizeLowercaseStringOrEmpty(params.provider ?? "")) && GEMINI_INCOMPLETE_TURN_MODEL_ID_PATTERN.test(stripProviderPrefix(typeof params.modelId === "string" ? params.modelId : "")) || RETRY_GUARD_MODEL_APIS.has(normalizeLowercaseStringOrEmpty(params.modelApi ?? "")) || isOllamaIncompleteTurnProvider(params.provider);
}
function classifyAssistantTurn(params) {
	const assistant = resolveCurrentAttemptAssistant(params.attempt);
	const output = parseReplyDirectives(assistant ? resolveRawAssistantAnswerText(assistant) : joinAssistantTexts(params.attempt.assistantTexts));
	const visibleText = output.text.trim();
	const reasoningOnly = Boolean(assistant && assessLastAssistantMessage(assistant) === "incomplete-text");
	const nonVisibleEligibleForSilentReply = !params.attempt.textToolCallAttempt && params.payloadCount === 0 && visibleText.length === 0 && assistant?.stopReason !== "error" && assistant?.stopReason !== "aborted" && !isIncompleteTerminalAssistantTurn({
		hasAssistantVisibleText: false,
		lastAssistant: assistant
	});
	return {
		assistant,
		visibleText,
		silent: output.isSilent,
		reasoningOnly,
		emptyResponse: nonVisibleEligibleForSilentReply && !reasoningOnly,
		nonVisibleEligibleForSilentReply
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/incomplete-turn-recovery.ts
const REASONING_ONLY_RETRY_INSTRUCTION = "Your turn ended without a final reply. Continue from the current conversation and answer the user's request now. Do not repeat completed actions or restart the task. Do not restate your reasoning.";
const EMPTY_RESPONSE_RETRY_INSTRUCTION = "The previous attempt did not produce a user-visible answer. Continue from the current state and produce the visible answer now. Do not restart from scratch.";
const TEXT_TOOL_CALL_RETRY_INSTRUCTION = "You wrote a tool call as text, so nothing ran for that call. Continue from the current state and call the tool natively through the tool interface. Do not print tool-call JSON or markup as your answer.";
const TOOL_USE_WITHOUT_CALL_RETRY_INSTRUCTION = "The previous assistant turn stopped for tool use but contained no tool call, so nothing ran. Continue from the current state: call the tool you need through the tool interface instead of writing the call as text, or produce the visible answer now. Do not restart from scratch.";
const REJECTED_TOOL_CALL_RETRY_INSTRUCTION = "The previous assistant turn's tool call was rejected before it ran because the provider returned incomplete or malformed tool-call arguments, so nothing ran for that call. Continue from the current state: re-issue the call you need through the tool interface with complete, valid JSON arguments, or produce the visible answer now. Do not repeat completed tool calls or restart from scratch.";
const SETTLED_TOOL_TERMINAL_CONTINUATION_INSTRUCTION = "The previous assistant turn completed its tool calls but did not produce a user-visible answer. Continue from the current transcript and produce the final user-visible answer now. Do not repeat completed tool calls or restart from scratch. Tools are unavailable in this step: it is a text-only pass, so reply with plain text and do not attempt any tool call.";
function shouldRetrySilentErrorAssistantTurn(params) {
	if (joinAssistantTexts(params.attempt.assistantTexts).length > 0 || params.attempt.lastToolError || hasAttemptTerminalState(params.attempt) || !isCurrentAttemptReplaySafe(params.attempt)) return false;
	const assistant = params.assistant;
	if (!assistant || assistant.stopReason !== "error" || isTerminalAssistantError(assistant) || isResponsesOutputLimitToolCallError(assistant)) return false;
	const { content } = assistant;
	if (!Array.isArray(content)) return false;
	if (content.every((block) => block.type === "text" && !block.text.trim())) return !hasPositiveOutputTokenUsage(assistant) || assistant.errorCode === "malformed_tool_call_arguments" || isPreDispatchToolCallRejectionMessage(assistant.errorMessage);
	return hasOnlyAssistantReasoningContent(assistant);
}
function shouldSkipNonVisibleTurnRetry(params) {
	return Boolean(params.aborted || params.timedOut || params.attempt.terminal.kind === "failed" || params.attempt.clientToolCalls || params.attempt.yieldDetected || params.attempt.didSendDeterministicApprovalPrompt || params.attempt.lastToolError && !params.consumedToolFailure || hasAcceptedSessionSpawn(params.attempt.acceptedSessionSpawns) || params.attempt.itemLifecycle.activeCount > 0 || params.attempt.itemLifecycle.completedCount < params.attempt.itemLifecycle.startedCount || hasAsyncActivity(params.attempt.toolMetas) || params.tolerateSideEffects !== true && params.attempt.replayMetadata.hadPotentialSideEffects);
}
/** Allows configured silent handling for replay-safe empty, reasoning-only, or explicit silent turns. */
function shouldTreatEmptyAssistantReplyAsSilent(params) {
	const completion = resolveReplyCompletion(resolveReplyExpectation(params), params.payloadCount === 0 ? "empty" : "ready");
	const assistant = classifyAssistantTurn(params);
	return completion.outcome === "silent" && !shouldSkipNonVisibleTurnRetry({
		...params,
		tolerateSideEffects: true
	}) && resolveSourceReplyDelivery(params.attempt) === "missing" && (!params.onlyExplicitSilentReply || assistant.silent) && assistant.nonVisibleEligibleForSilentReply;
}
/**
* Builds the retry instruction for reasoning-only turns that consumed provider
* output budget but produced no visible assistant text.
*/
function resolveReasoningOnlyRetryInstruction(params) {
	if (shouldSkipNonVisibleTurnRetry(params) || !shouldApplyNonVisibleTurnRetryGuard(params)) return null;
	const assistant = resolveCurrentAttemptAssistant(params.attempt);
	return joinAssistantTexts(params.attempt.assistantTexts).length === 0 && assistant && assistant.stopReason !== "error" && !isReasoningOnlyLengthAssistantTurn(assistant) && !assistant.openclawDelivery?.tts?.text?.trim() && Array.isArray(assistant.content) && assistant.content.length > 0 && assessLastAssistantMessage(assistant) !== "valid" ? REASONING_ONLY_RETRY_INSTRUCTION : null;
}
function readSettledToolCalls(message) {
	if (!Array.isArray(message?.content)) return [];
	return message.content.flatMap((item) => {
		const block = item;
		return block?.type === "toolCall" ? [{
			id: typeof block.id === "string" ? block.id : null,
			name: typeof block.name === "string" ? block.name : null
		}] : [];
	});
}
/** Proves settlement and intentional termination for the exact current-turn tool-call batch. */
function resolveSettledToolBatchEvidence(attempt, options) {
	const snapshot = attempt.messagesSnapshot ?? [];
	let assistant = attempt.currentAttemptAssistant;
	let assistantIndex = assistant ? snapshot.indexOf(assistant) : -1;
	const latestUserIndex = snapshot.findLastIndex((message, index) => message.role === "user" && !(options?.midTurn && assistantIndex >= 0 && index > assistantIndex));
	if (assistantIndex <= latestUserIndex || readSettledToolCalls(assistant).length === 0) {
		assistantIndex = snapshot.findLastIndex((message, index) => index > latestUserIndex && message.role === "assistant" && readSettledToolCalls(message).length > 0);
		const candidate = assistantIndex >= 0 ? snapshot[assistantIndex] : void 0;
		assistant = candidate?.role === "assistant" ? candidate : void 0;
	}
	const requestedToolCalls = readSettledToolCalls(assistant);
	const settledToolResults = new Map((assistantIndex >= 0 ? snapshot.slice(assistantIndex + 1) : []).flatMap((message) => {
		const { toolCallId, toolName, isError } = message;
		return message.role === "toolResult" && typeof toolCallId === "string" && typeof toolName === "string" ? [[toolCallId, {
			toolName,
			isError: isError === true
		}]] : [];
	}));
	const allToolCallsRecorded = requestedToolCalls.length > 0 && requestedToolCalls.every(({ id, name }) => id !== null && name !== null && settledToolResults.get(id)?.toolName === name);
	const allToolsProvenSettled = allToolCallsRecorded && attempt.itemLifecycle.startedCount > 0 && attempt.itemLifecycle.completedCount === attempt.itemLifecycle.startedCount && attempt.itemLifecycle.activeCount === 0;
	const parkedCodeModeRun = allToolCallsRecorded && requestedToolCalls.some(({ id }) => attempt.toolMetas.some((entry) => entry.toolCallId === id && entry.codeModeSuspended === true));
	const failedToolNames = new Set(requestedToolCalls.flatMap(({ id, name }) => id !== null && name !== null && settledToolResults.get(id)?.isError === true ? [name] : []));
	const hasStaleToolError = Boolean(attempt.lastToolError && assistant?.stopReason === "toolUse" && allToolsProvenSettled && failedToolNames.size === 0);
	const hasUnsettledToolError = Boolean(attempt.lastToolError && !hasStaleToolError && (assistant?.stopReason !== "toolUse" || !allToolsProvenSettled || !failedToolNames.has(attempt.lastToolError.toolName)));
	const intentionalTermination = allToolsProvenSettled && assistant?.stopReason === "toolUse" && failedToolNames.size === 0 && !hasUnsettledToolError && !hasAsyncActivity(attempt.toolMetas) && requestedToolCalls.every(({ id, name }) => {
		const metadata = attempt.toolMetas.findLast((entry) => entry.toolCallId === id && entry.toolName === name);
		return metadata?.terminate === true && metadata.isError !== true;
	});
	return {
		assistant,
		allToolCallsRecorded,
		allToolsProvenSettled,
		parkedCodeModeRun,
		failedToolNames,
		hasStaleToolError,
		hasUnsettledToolError,
		intentionalTermination
	};
}
/** Builds one fresh continuation after settled tools ended without a visible final answer. */
function resolveSettledToolTerminalContinuationInstruction(params) {
	const { attempt } = params;
	const { assistant: toolBatchAssistant, allToolsProvenSettled, parkedCodeModeRun, failedToolNames, hasUnsettledToolError, intentionalTermination } = resolveSettledToolBatchEvidence(attempt);
	const terminal = attempt.terminal;
	const idlePromptTimeout = terminal.kind === "timeout" && terminal.phase === "prompt" && terminal.source === "idle" && attempt.currentAttemptReplayMetadata?.hadPotentialSideEffects === true;
	const assistantState = classifyAssistantTurn(params);
	const emptyStopAfterSettledTools = Boolean(params.allowEmptyStopContinuation && attempt.currentAttemptAssistant?.stopReason === "stop" && attempt.toolMetas.length > 0 && attempt.toolMetas.every((tool) => tool.isError !== true && tool.asyncStarted !== true) && attempt.itemLifecycle.startedCount > 0 && attempt.itemLifecycle.completedCount === attempt.itemLifecycle.startedCount && attempt.itemLifecycle.activeCount === 0 && !hasAcceptedSessionSpawn(attempt.acceptedSessionSpawns) && assistantState.emptyResponse);
	if (params.payloadCount !== 0 || !params.allowEmptyStopContinuation && assistantState.silent && assistantState.nonVisibleEligibleForSilentReply || params.hasTerminalToolPresentation || params.aborted || (params.timedOut || terminal.kind === "timeout") && !idlePromptTimeout || terminal.kind === "failed" && !attempt.settledTurnFinalizationContext || (toolBatchAssistant?.stopReason === "toolUse" ? !allToolsProvenSettled : !emptyStopAfterSettledTools) || intentionalTermination || parkedCodeModeRun || hasUnsettledToolError || attempt.lastToolError?.executionStarted === false && assistantState.assistant?.stopReason !== "toolUse" || hasAsyncActivity(attempt.toolMetas) || hasAcceptedSessionSpawn(attempt.acceptedSessionSpawns) || attempt.clientToolCalls || attempt.yieldDetected || attempt.didSendDeterministicApprovalPrompt || attempt.hasToolMediaBlockReply || resolveSourceReplyDelivery(attempt) !== "missing" || !shouldApplyNonVisibleTurnRetryGuard(params)) return null;
	return allToolsProvenSettled && failedToolNames.size > 0 ? `${SETTLED_TOOL_TERMINAL_CONTINUATION_INSTRUCTION} ${TOOL_FAILURE_INSTRUCTION}` : SETTLED_TOOL_TERMINAL_CONTINUATION_INSTRUCTION;
}
/**
* Builds the retry instruction for empty assistant turns when the provider/model
* is eligible for non-visible turn recovery.
*/
function resolveEmptyResponseRetryInstruction(params) {
	const assistantState = classifyAssistantTurn(params);
	const assistant = assistantState.assistant ?? null;
	const rejectedBeforeDispatch = params.attempt.itemLifecycle.completedCount > 0 && assistantState.visibleText.length === 0 && !params.attempt.hasToolMediaBlockReply && resolveSourceReplyDelivery(params.attempt) === "missing" && assistant?.stopReason === "error" && (assistant.errorCode === "malformed_tool_call_arguments" || isPreDispatchToolCallRejectionMessage(assistant.errorMessage)) && readSettledToolCalls(assistant).length === 0;
	let consumedToolFailure = false;
	if (rejectedBeforeDispatch && params.attempt.lastToolError?.executionStarted === false) {
		const messages = params.attempt.messagesSnapshot;
		const failureIndex = messages.findLastIndex((message) => message.role === "toolResult" && message.isError);
		const failure = messages[failureIndex];
		const latestUserIndex = messages.findLastIndex((message) => message.role === "user");
		consumedToolFailure = failureIndex > latestUserIndex && failureIndex < messages.indexOf(assistant) && failure?.role === "toolResult" && failure.toolName === params.attempt.lastToolError.toolName && messages.slice(latestUserIndex + 1, failureIndex + 1).every((message) => message.role !== "toolResult" || !message.isError || readToolEffectReceipt(message)?.state === "not_started");
	}
	if (shouldSkipNonVisibleTurnRetry({
		...params,
		tolerateSideEffects: rejectedBeforeDispatch,
		consumedToolFailure
	})) return null;
	if (params.attempt.textToolCallAttempt) return TEXT_TOOL_CALL_RETRY_INSTRUCTION;
	const toolUseWithoutCall = assistant?.stopReason === "toolUse" && readSettledToolCalls(assistant).length === 0 && params.attempt.toolMetas.length === 0 && params.attempt.itemLifecycle.startedCount === 0;
	if (!assistantState.emptyResponse && !toolUseWithoutCall && !rejectedBeforeDispatch) return null;
	if (assistant?.stopReason === "stop" && isOllamaIncompleteTurnProvider(params.provider) && !hasPositiveOutputTokenUsage(assistant)) return null;
	if (shouldApplyNonVisibleTurnRetryGuard(params) || isZeroUsageEmptyStopAssistantTurn(assistant)) {
		if (rejectedBeforeDispatch) return REJECTED_TOOL_CALL_RETRY_INSTRUCTION;
		return toolUseWithoutCall ? TOOL_USE_WITHOUT_CALL_RETRY_INSTRUCTION : EMPTY_RESPONSE_RETRY_INSTRUCTION;
	}
	return null;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/subscription-completion-evidence.ts
function readSubscriptionCompletionEvidence(subscription) {
	const media = subscription.getPendingToolMediaReply();
	return {
		assistantTexts: subscription.assistantTexts,
		keptAnswer: subscription.getKeptAnswer(),
		toolMetas: subscription.toolMetas.filter((entry) => entry.toolName.trim().length > 0).map(({ parentToolCallId: _parentToolCallId, activity: _activity, ...entry }) => Object.assign(entry, { replaySafe: entry.replaySafe === true })),
		itemLifecycle: subscription.getItemLifecycle(),
		acceptedSessionSpawns: subscription.getAcceptedSessionSpawns(),
		lastToolError: subscription.getLastToolError(),
		didSendViaMessagingTool: subscription.didSendViaMessagingTool(),
		didSendDeterministicApprovalPrompt: subscription.didSendDeterministicApprovalPrompt(),
		messagingToolSentTexts: subscription.getMessagingToolSentTexts(),
		messagingToolSentMediaUrls: subscription.getMessagingToolSentMediaUrls(),
		messagingToolSentTargets: subscription.getMessagingToolSentTargets(),
		messagingToolSourceReplyPayloads: subscription.getMessagingToolSourceReplyPayloads(),
		heartbeatToolResponse: subscription.getHeartbeatToolResponse(),
		sourceReplyDelivered: subscription.getSourceReplyDelivered(),
		sourceReplyDeliveryState: subscription.getSourceReplyDeliveryState(),
		toolMediaUrls: media?.mediaUrls,
		toolAudioAsVoice: media?.audioAsVoice,
		toolTrustedLocalMedia: media?.trustedLocalMedia,
		hasToolMediaBlockReply: subscription.hasToolMediaBlockReply(),
		successfulCronAdds: subscription.getSuccessfulCronAdds(),
		replayMetadata: replayMetadataFromState(subscription.getReplayState())
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/message-tool-terminal.ts
function argsRecordForToolCall(context) {
	return asOptionalRecord(context.args) ?? asOptionalRecord(context.toolCall.arguments) ?? {};
}
/**
* Admits a complete batch of direct tool-authored replies from the finalized
* message results, after message_end extensions and persistence have settled.
* Any failed or unhandled sibling leaves the entire batch with the model; no
* partial reply is queued that could hide the continuation or its failure.
*/
function installToolAuthoredSourceReplyTerminalHook(params) {
	const capableToolNames = params.sourceReplyCapableToolNames;
	if (!capableToolNames?.size) return () => {};
	const previous = getInternalToolTurnCompletion(params.agent);
	const complete = (context) => {
		const previousComplete = previous?.(context) === true;
		const replies = [];
		for (const result of context.toolResults) {
			if (result.isError || isToolResultError(result)) return previousComplete;
			if (!capableToolNames.has(normalizeToolPolicyName(result.toolName))) {
				if (context.terminalToolCallIds.has(result.toolCallId)) continue;
				return previousComplete;
			}
			const reply = captureToolAuthoredSourceReply({
				result,
				toolCallId: result.toolCallId,
				idempotencyScope: resolveAgentAssistantTurnId(context.message) ?? params.idempotencyScope
			});
			if (!reply) {
				if (asOptionalRecord(readToolResultDetails(result)?.sourceReply)?.final !== false && context.terminalToolCallIds.has(result.toolCallId)) continue;
				return previousComplete;
			}
			replies.push({
				...reply,
				toolAuthoredForTurnId: resolveAgentAssistantTurnId(context.message)
			});
		}
		if (replies.length === 0) return previousComplete;
		params.onSourceReplies(replies);
		return true;
	};
	setInternalToolTurnCompletion(params.agent, complete);
	return () => {
		if (getInternalToolTurnCompletion(params.agent) === complete) setInternalToolTurnCompletion(params.agent, previous);
	};
}
function installMessageToolTerminalHook(params) {
	let finalSourceReplyDelivered = false;
	const previousCompletion = getInternalToolTurnCompletion(params.agent);
	setInternalToolTurnCompletion(params.agent, (context) => {
		const completed = finalSourceReplyDelivered;
		finalSourceReplyDelivered = false;
		return previousCompletion?.(context) === true || completed;
	});
	const previousAfterToolCall = params.agent.afterToolCall?.bind(params.agent);
	params.agent.afterToolCall = async (context, signal) => {
		const toolName = context.toolCall.name;
		const toolArgs = argsRecordForToolCall(context);
		const final = resolveMessageToolSourceReplyFinal(toolArgs);
		const extractionArgs = toolName === "message" && params.currentProvider && typeof toolArgs.provider !== "string" && typeof toolArgs.channel !== "string" ? {
			...toolArgs,
			provider: params.currentProvider
		} : toolArgs;
		const pendingSend = extractMessagingToolSend(toolName, extractionArgs, params);
		const confirmedSend = pendingSend && extractMessagingToolSendResult(pendingSend, context.result);
		const isDelivered = (hookResult) => isDeliveredMessageToolOnlySourceReplyResult({
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			toolName,
			args: toolArgs,
			result: hookResult ?? context.result,
			hookResult: context.result,
			isError: hookResult?.isError ?? context.isError,
			allowExplicitSourceRoute: isDeliveredMessagingToolSendToCurrentSource({
				...params,
				send: confirmedSend,
				deliveredPayload: context.result
			})
		});
		let delivered = isDelivered();
		let hookResult;
		try {
			hookResult = await previousAfterToolCall?.(context, signal);
		} finally {
			delivered ||= isDelivered(hookResult);
			if (delivered) {
				finalSourceReplyDelivered ||= final;
				params.onDeliveredSourceReply?.();
			}
		}
		return delivered && final ? {
			...hookResult,
			terminate: true
		} : hookResult;
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-send-receipts.ts
const registry = createSessionManagerRuntimeRegistry();
function recordEmbeddedToolReceipt(sessionManager, toolCallId, details, includeMessageDelivery) {
	const record = asOptionalRecord(details);
	const snapshot = (value) => {
		const valueRecord = asOptionalRecord(value);
		return valueRecord ? { ...valueRecord } : value;
	};
	const toolSend = record?.toolSend;
	const messageDelivery = includeMessageDelivery ? record?.messageDelivery : void 0;
	if (toolSend === void 0 && messageDelivery === void 0) return;
	const receipts = registry.get(sessionManager) ?? /* @__PURE__ */ new Map();
	receipts.set(toolCallId, { details: {
		...toolSend !== void 0 ? { toolSend: snapshot(toolSend) } : {},
		...messageDelivery !== void 0 ? { messageDelivery: snapshot(messageDelivery) } : {}
	} });
	registry.set(sessionManager, receipts);
}
function consumeEmbeddedToolReceipt(sessionManager, toolCallId) {
	const receipts = registry.get(sessionManager);
	const receipt = receipts?.get(toolCallId);
	if (!receipts || !receipt) return;
	receipts.delete(toolCallId);
	if (receipts.size === 0) registry.set(sessionManager, null);
	return receipt;
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.messages.replies.ts
/**
* Owns pending assistant reply directives and tool-media handoff.
*/
function hasReplyDirectiveMetadata(parsed) {
	return Boolean(parsed && (parsed.audioAsVoice || parsed.replyToId || parsed.replyToTag || parsed.replyToCurrent));
}
function mergeReplyDirectiveResults(first, second) {
	if (!first) return second ?? null;
	if (!second) return first;
	return {
		text: `${first.text ?? ""}${second.text ?? ""}`,
		replyToId: second.replyToId ?? first.replyToId,
		replyToCurrent: first.replyToCurrent || second.replyToCurrent,
		replyToTag: first.replyToTag || second.replyToTag,
		audioAsVoice: first.audioAsVoice || second.audioAsVoice || void 0,
		isSilent: first.isSilent || second.isSilent
	};
}
/** Moves queued tool media into a non-reasoning assistant reply payload. */
function consumePendingToolMediaIntoReply(state, payload) {
	if (payload.isReasoning) return payload;
	const pendingMedia = readPendingToolMediaReply(state);
	if (!pendingMedia) return payload;
	let mergedPayload;
	if ((payload.mediaUrls ?? []).some((url) => url.trim().length > 0)) {
		const metadataByUrl = new Map((pendingMedia.mediaUrls ?? []).map((url, index) => [url, pendingMedia.attachments?.[index] ?? {}]));
		const selectedAttachments = (payload.mediaUrls ?? []).map((url) => metadataByUrl.get(url.trim()) ?? {});
		const allSelectedMediaIsPending = (payload.mediaUrls?.length ?? 0) > 0 && (payload.mediaUrls ?? []).every((url) => metadataByUrl.has(url.trim()));
		const payloadWithMetadata = payload.attachments?.length || selectedAttachments.every((entry) => Object.keys(entry).length === 0) ? payload : {
			...payload,
			attachments: selectedAttachments
		};
		mergedPayload = allSelectedMediaIsPending && (payload.mediaUrls ?? []).every((url) => state.pendingToolMediaTrustByUrl.get(url.trim()) === true) ? {
			...payloadWithMetadata,
			trustedLocalMedia: true
		} : payloadWithMetadata;
	} else mergedPayload = {
		...payload,
		...pendingMedia,
		audioAsVoice: payload.audioAsVoice || pendingMedia.audioAsVoice || void 0,
		...payload.trustedLocalMedia ? { trustedLocalMedia: true } : {}
	};
	state.pendingToolMediaUrls = [];
	state.pendingToolMediaAttachments = [];
	state.pendingToolMediaTrustByUrl.clear();
	state.pendingToolAudioAsVoice = false;
	return mergedPayload;
}
/** Restores reserved tool media after its outbound delivery was rejected. */
function restorePendingToolMediaReply(state, payload) {
	const pendingUrls = state.pendingToolMediaUrls;
	const pendingAttachments = state.pendingToolMediaAttachments ?? [];
	const restoredUrls = payload.mediaUrls ?? [];
	const restoredAttachments = payload.attachments ?? [];
	const seen = new Set(restoredUrls);
	state.pendingToolMediaUrls = [...restoredUrls, ...pendingUrls.filter((url) => !seen.has(url))];
	state.pendingToolMediaAttachments = [...restoredUrls.map((_, index) => restoredAttachments[index] ?? {}), ...pendingUrls.flatMap((url, index) => seen.has(url) ? [] : [pendingAttachments[index] ?? {}])];
	for (const [index, url] of restoredUrls.entries()) if (payload.trustedLocalMedia || restoredAttachments[index]?.trustedLocalMedia) state.pendingToolMediaTrustByUrl.set(url, true);
	else if (!state.pendingToolMediaTrustByUrl.has(url)) state.pendingToolMediaTrustByUrl.set(url, false);
	state.pendingToolAudioAsVoice ||= payload.audioAsVoice === true;
	state.pendingToolMediaDeliveryFailed = true;
}
/** Reads queued tool media without clearing it. */
function readPendingToolMediaReply(state) {
	if (state.pendingToolMediaUrls.length === 0 && !state.pendingToolAudioAsVoice) return null;
	const seen = /* @__PURE__ */ new Set();
	const mediaUrls = [];
	const attachments = [];
	for (const [index, url] of state.pendingToolMediaUrls.entries()) {
		if (seen.has(url)) continue;
		seen.add(url);
		mediaUrls.push(url);
		const { trustedLocalMedia: _untrustedInput, ...attachment } = state.pendingToolMediaAttachments?.[index] ?? {};
		attachments.push({
			...attachment,
			...state.pendingToolMediaTrustByUrl.get(url) === true ? { trustedLocalMedia: true } : {}
		});
	}
	const alignedAttachments = attachments.some((entry) => Object.keys(entry).length > 0) ? attachments : void 0;
	const allPendingMediaTrusted = mediaUrls.length > 0 && mediaUrls.every((url) => state.pendingToolMediaTrustByUrl.get(url) === true);
	return {
		mediaUrls: mediaUrls.length ? mediaUrls : void 0,
		attachments: alignedAttachments,
		audioAsVoice: state.pendingToolAudioAsVoice || void 0,
		...allPendingMediaTrusted ? { trustedLocalMedia: true } : {}
	};
}
function recordPendingAssistantReplyDirectives(state, parsed, audioDirectiveCounts) {
	if (!parsed) return;
	const current = state.pendingAssistantReplyDirectives;
	const audioAsVoice = Boolean(parsed.audioAsVoice || current?.audioAsVoice && audioDirectiveCounts && audioDirectiveCounts.current > (current.audioDirectiveStart ?? 0));
	if (!audioAsVoice && !hasReplyDirectiveMetadata(parsed)) {
		state.pendingAssistantReplyDirectives = void 0;
		return;
	}
	state.pendingAssistantReplyDirectives = {
		audioAsVoice: audioAsVoice || void 0,
		...audioAsVoice && audioDirectiveCounts ? { audioDirectiveStart: current?.audioDirectiveStart ?? audioDirectiveCounts.previous } : {},
		replyToId: parsed.replyToId,
		replyToTag: parsed.replyToTag || void 0,
		replyToCurrent: parsed.replyToCurrent || void 0
	};
}
/** Merges pending reply directives into one reply payload and clears them. */
function consumePendingAssistantReplyDirectivesIntoReply(state, payload) {
	if (payload.isReasoning || !state.pendingAssistantReplyDirectives) return payload;
	const pending = state.pendingAssistantReplyDirectives;
	state.pendingAssistantReplyDirectives = void 0;
	return {
		...payload,
		audioAsVoice: payload.audioAsVoice || pending.audioAsVoice || void 0,
		replyToId: payload.replyToId ?? pending.replyToId,
		replyToTag: Boolean(payload.replyToTag || pending.replyToTag) || void 0,
		replyToCurrent: Boolean(payload.replyToCurrent || pending.replyToCurrent) || void 0
	};
}
function hasAssistantVisibleReply(params) {
	return resolveSendableOutboundReplyParts(params).hasContent || Boolean(params.audioAsVoice);
}
/** Exact tool-owned media that the managed WebChat pipeline may hide from display text. */
function resolveManagedStreamMediaUrls(state, mediaUrls) {
	return uniqueStrings(mediaUrls.filter((url) => state.pendingToolMediaTrustByUrl.get(url.trim()) === true));
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.compaction.ts
function emitCompactionAgentEvent(ctx, data) {
	const event = {
		stream: "compaction",
		data
	};
	emitAgentEvent({
		runId: ctx.params.runId,
		...event
	});
	runBestEffortCallback({
		label: "compaction agent event",
		log: ctx.log,
		callback: () => ctx.params.onAgentEvent?.(event)
	});
}
function runBestEffortCompactionHook(ctx, phase) {
	if (ctx.state.unsubscribed || ctx.params.isTerminalAborted?.()) return;
	const hookRunner = getGlobalHookRunner();
	const hookName = phase === "before" ? "before_compaction" : "after_compaction";
	if (!hookRunner?.hasHooks(hookName)) return;
	const metrics = {
		messageCount: ctx.params.session.messages?.length ?? 0,
		sessionFile: ctx.params.session.sessionFile
	};
	const context = { sessionKey: ctx.params.sessionKey };
	(phase === "before" ? hookRunner.runBeforeCompaction({
		...metrics,
		messages: ctx.params.session.messages
	}, context) : hookRunner.runAfterCompaction({
		...metrics,
		compactedCount: ctx.getCompactionCount()
	}, context)).catch((err) => {
		ctx.log.warn(`${hookName} hook failed: ${String(err)}`);
	});
}
function handleCompactionStart(ctx, evt) {
	const rawReason = evt.reason;
	const reason = rawReason === "manual" || rawReason === "threshold" || rawReason === "overflow" ? rawReason : "threshold";
	const kind = reason === "manual" ? "manual compaction" : "auto-compaction";
	ctx.state.compactionInFlight = true;
	ctx.state.livenessState = "paused";
	ctx.ensureCompactionPromise();
	ctx.log.info(`embedded run ${kind} start`, {
		event: "embedded_run_compaction_start",
		runId: ctx.params.runId,
		reason,
		consoleMessage: `embedded run ${kind} start: runId=${ctx.params.runId} reason=${reason}`
	});
	emitCompactionAgentEvent(ctx, {
		phase: "start",
		...evt.itemId ? { itemId: evt.itemId } : {}
	});
	if (!evt.hooksHandled) runBestEffortCompactionHook(ctx, "before");
}
function handleCompactionEnd(ctx, evt) {
	const reason = evt.reason;
	const kind = reason === "manual" ? "manual compaction" : "auto-compaction";
	const outcome = evt.outcome;
	ctx.state.compactionInFlight = false;
	const completed = outcome.status === "completed";
	const willRetry = completed && outcome.willRetry;
	let recording;
	if (completed) {
		ctx.incrementCompactionCount();
		ctx.noteCompactionTokensAfter(outcome.tokensAfter);
		const observedCompactionCount = ctx.getCompactionCount();
		if (ctx.params.sessionPersistence !== "detached") recording = recordSessionCompacted({
			sessionKey: ctx.params.sessionKey,
			operationId: `${ctx.params.runId}:${observedCompactionCount}`,
			agentId: ctx.params.agentId,
			runId: ctx.params.runId
		});
		ctx.log.info(`embedded run ${kind} complete`, {
			event: "embedded_run_compaction_end",
			runId: ctx.params.runId,
			reason,
			completed: true,
			willRetry,
			compactionCount: observedCompactionCount,
			consoleMessage: `embedded run ${kind} complete: runId=${ctx.params.runId} reason=${reason} compactionCount=${observedCompactionCount} willRetry=${willRetry}`
		});
		if (ctx.params.compactionCountOwner !== "caller" && ctx.params.sessionPersistence !== "detached") import("./embedded-agent-subscribe.handlers.compaction.runtime.js").then(({ default: reconcile }) => reconcile({
			sessionKey: ctx.params.sessionKey,
			agentId: ctx.params.agentId,
			configStore: ctx.params.config?.session?.store,
			observedCompactionCount
		})).catch((err) => {
			ctx.log.warn(`late compaction count reconcile failed: ${String(err)}`);
		});
	}
	if (willRetry) {
		ctx.noteCompactionRetry();
		ctx.resetForCompactionRetry();
		ctx.log.debug(`embedded run compaction retry: runId=${ctx.params.runId}`);
	} else {
		if (outcome.status !== "aborted") ctx.state.livenessState = "working";
		ctx.maybeResolveCompactionWait();
		const messages = ctx.params.session.messages;
		if (completed && Array.isArray(messages)) stripStaleAssistantUsageBeforeLatestCompaction(messages, {
			mutate: true,
			whenMissingCompactionSummary: "zeroAssistantUsage"
		});
	}
	const outcomeReason = outcome.status === "skipped" || outcome.status === "failed" ? outcome.reason : void 0;
	if (!completed) {
		const reasonClass = outcomeReason ? classifyCompactionReason(outcomeReason) : "aborted";
		const reasonDetail = reasonClass === "unknown" ? formatUnknownCompactionReasonDetail(outcomeReason) : void 0;
		const metadata = {
			event: "embedded_run_compaction_end",
			runId: ctx.params.runId,
			reason,
			outcome: outcome.status,
			completed: false,
			willRetry: false,
			reasonClass,
			...outcomeReason ? { outcomeReason } : {},
			...reasonDetail ? { reasonDetail } : {},
			consoleMessage: `embedded run ${kind} ${outcome.status}: runId=${ctx.params.runId} reason=${reasonClass}${reasonDetail ? ` detail=${reasonDetail}` : ""}`
		};
		const benign = outcome.status === "aborted" || outcome.status === "skipped" && (reasonClass === "no_compactable_entries" || reasonClass === "below_threshold" || reasonClass === "already_compacted");
		ctx.log[benign ? "info" : "warn"](`embedded run ${kind} ${outcome.status}`, metadata);
	}
	emitCompactionAgentEvent(ctx, {
		phase: "end",
		...evt.itemId ? { itemId: evt.itemId } : {},
		completed,
		willRetry,
		outcome: outcome.status,
		...completed && outcome.qualityDegraded ? { qualityDegraded: true } : {},
		...outcomeReason ? { reason: outcomeReason } : {}
	});
	if (completed && !willRetry && !evt.hooksHandled) runBestEffortCompactionHook(ctx, "after");
	return recording;
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.lifecycle.ts
/**
* Handles lifecycle and compaction events from subscribed embedded-agent sessions.
*/
function runTerminalHook(callback, failed) {
	let result;
	try {
		result = callback();
	} catch (error) {
		failed(error);
		return;
	}
	return isPromiseLike(result) ? Promise.resolve(result).catch((error) => {
		failed(error);
	}) : result;
}
function emitLifecycleAgentEvent(ctx, data, eventData = data) {
	emitAgentEvent({
		runId: ctx.params.runId,
		...ctx.params.sessionKey ? { sessionKey: ctx.params.sessionKey } : {},
		...ctx.params.sessionId ? { sessionId: ctx.params.sessionId } : {},
		...ctx.params.agentId ? { agentId: ctx.params.agentId } : {},
		...ctx.params.lifecycleGeneration ? { lifecycleGeneration: ctx.params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data: eventData
	});
	runBestEffortCallback({
		label: "lifecycle agent event",
		log: ctx.log,
		callback: () => ctx.params.onAgentEvent?.({
			stream: "lifecycle",
			data
		})
	});
}
function handleAgentStart(ctx) {
	ctx.state.deferBlockReplyDelivery = typeof ctx.params.onBeforeTerminalDelivery === "function" && ctx.params.deferTerminalDelivery !== false;
	ctx.log.debug(`embedded run agent start: runId=${ctx.params.runId}`);
	emitLifecycleAgentEvent(ctx, {
		phase: "start",
		startedAt: Date.now()
	});
}
function handleAgentEnd(ctx, evt) {
	ctx.state.liveEditDiffStateById.clear();
	const lastAssistant = ctx.state.lastAssistant;
	const isError = isAssistantMessage(lastAssistant) && lastAssistant.stopReason === "error";
	let lifecycleErrorText;
	let errorObservation;
	const hasStreamedAssistantVisibleText = Array.isArray(ctx.state.assistantTexts) && ctx.state.assistantTexts.some((text) => hasAssistantVisibleReply({ text }));
	const completedAssistantFallbackText = isAssistantMessage(lastAssistant) && lastAssistant.stopReason !== "error" && lastAssistant.stopReason !== "aborted" ? resolveFinalAssistantVisibleText(lastAssistant) : void 0;
	const hasAssistantVisibleText = hasStreamedAssistantVisibleText || hasAssistantVisibleReply({ text: completedAssistantFallbackText ?? "" });
	const hadLivenessPreservingSideEffect = ctx.state.hadDeterministicSideEffect === true || hasCommittedMessagingToolDeliveryEvidence(ctx.state) || hasAcceptedSessionSpawn(ctx.state.acceptedSessionSpawns) || (ctx.state.successfulCronAdds ?? 0) > 0;
	const deferredMediaUrls = ctx.state.deferredBlockReplies.flatMap((payload) => payload.mediaUrls ?? []);
	const hasTerminalOutput = hasAttemptTerminalState({
		yieldDetected: ctx.state.yielded,
		didSendDeterministicApprovalPrompt: ctx.state.deterministicApprovalPromptSent,
		heartbeatToolResponse: ctx.state.heartbeatToolResponse,
		toolMediaUrls: [...ctx.state.pendingToolMediaUrls, ...deferredMediaUrls],
		toolAudioAsVoice: ctx.state.pendingToolAudioAsVoice || ctx.state.deferredBlockReplies.some((payload) => payload.audioAsVoice),
		hasToolMediaBlockReply: ctx.state.hasToolMediaBlockReply,
		didDeliverSourceReplyViaMessageTool: ctx.state.messageToolOnlySourceReplyDelivered || ctx.params.hasDeliveredMessageToolOnlySourceReply?.() === true,
		messagingToolSourceReplyPayloads: ctx.state.messagingToolSourceReplyPayloads,
		messagingToolSentTexts: ctx.state.messagingToolSentTexts,
		messagingToolSentMediaUrls: ctx.state.messagingToolSentMediaUrls,
		messagingToolSentTargets: ctx.state.messagingToolSentTargets,
		successfulCronAdds: ctx.state.successfulCronAdds,
		acceptedSessionSpawns: ctx.state.acceptedSessionSpawns,
		toolMetas: ctx.state.toolMetas
	});
	const hadBeforeFinalizeSideEffect = hadLivenessPreservingSideEffect || ctx.state.replayState.hadPotentialSideEffects;
	const incompleteTerminalAssistant = isIncompleteTerminalAssistantTurn({
		hasAssistantVisibleText,
		hasTerminalOutput,
		lastAssistant: isAssistantMessage(lastAssistant) ? lastAssistant : null
	});
	const replayInvalid = ctx.state.replayState.replayInvalid || incompleteTerminalAssistant ? true : void 0;
	const derivedWorkingTerminalState = isError ? "blocked" : replayInvalid && !hadLivenessPreservingSideEffect && (!hasAssistantVisibleText || incompleteTerminalAssistant) ? "abandoned" : ctx.state.livenessState;
	const livenessState = ctx.state.livenessState === "working" ? derivedWorkingTerminalState : ctx.state.livenessState;
	if (isError && lastAssistant) {
		const rawError = lastAssistant.errorMessage?.trim();
		const failoverReason = classifyAssistantFailoverReason(lastAssistant, { providerOwner: ctx.params.providerOwner ?? null });
		const errorText = formatUserFacingAssistantErrorText(lastAssistant, {
			cfg: ctx.params.config,
			sessionKey: ctx.params.sessionKey,
			agentId: ctx.params.agentId,
			provider: lastAssistant.provider,
			model: lastAssistant.model,
			providerOwner: ctx.params.providerOwner
		});
		const observedError = buildApiErrorObservationFields(rawError, {
			provider: lastAssistant.provider,
			providerOwner: ctx.params.providerOwner
		});
		const safeErrorText = buildTextObservationFields(errorText, { provider: lastAssistant.provider }).textPreview ?? "LLM request failed.";
		lifecycleErrorText = safeErrorText;
		errorObservation = projectChatErrorDetail({
			provider: lastAssistant.provider,
			model: lastAssistant.model,
			failoverReason,
			...observedError,
			httpStatus: observedError.httpCode ? Number(observedError.httpCode) : void 0
		});
		const safeRunId = sanitizeForConsole(ctx.params.runId) ?? "-";
		const safeModel = sanitizeForConsole(lastAssistant.model) ?? "unknown";
		const safeProvider = sanitizeForConsole(lastAssistant.provider) ?? "unknown";
		const safeRawErrorPreview = sanitizeForConsole(observedError.rawErrorPreview);
		const rawErrorConsoleSuffix = safeRawErrorPreview && !shouldSuppressRawErrorConsoleSuffix(observedError.providerRuntimeFailureKind) ? ` rawError=${safeRawErrorPreview}` : "";
		ctx.log.warn("embedded run agent end", {
			event: "embedded_run_agent_end",
			tags: [
				"error_handling",
				"lifecycle",
				"agent_end",
				"assistant_error"
			],
			runId: ctx.params.runId,
			isError: true,
			error: safeErrorText,
			failoverReason,
			model: lastAssistant.model,
			provider: lastAssistant.provider,
			...observedError,
			consoleMessage: `embedded run agent end: runId=${safeRunId} isError=true model=${safeModel} provider=${safeProvider} error=${safeErrorText}${rawErrorConsoleSuffix}`
		});
	} else ctx.log.debug(`embedded run agent end: runId=${ctx.params.runId} isError=${isError}`);
	const emitLifecycleTerminal = () => {
		finalizeToolActivity(ctx);
		const terminalStopReason = ctx.params.resolveTerminalStopReason?.() ?? ctx.state.terminalStopReason ?? (!isError && isAssistantMessage(lastAssistant) ? lastAssistant.stopReason : void 0);
		const terminalAborted = typeof ctx.state.terminalAborted === "boolean" ? ctx.state.terminalAborted : ctx.params.isTerminalAborted?.();
		const toolErrorSummary = terminalAborted === true && ctx.state.lastToolError ? summarizeToolValidationError(ctx.state.lastToolError) : void 0;
		const data = {
			phase: ctx.params.terminalLifecyclePhase === "finishing" ? "finishing" : isError ? "error" : "end",
			...isError ? { error: lifecycleErrorText ?? "LLM request failed." } : {},
			...errorObservation ? { errorObservation } : {},
			...terminalStopReason ? { stopReason: terminalStopReason } : {},
			...ctx.state.yielded === true ? { yielded: true } : {},
			...ctx.state.timeoutPhase ? { timeoutPhase: ctx.state.timeoutPhase } : {},
			...typeof ctx.state.providerStarted === "boolean" ? { providerStarted: ctx.state.providerStarted } : {},
			...typeof terminalAborted === "boolean" ? { aborted: terminalAborted } : {},
			...toolErrorSummary ? { toolErrorSummary } : {},
			...livenessState ? { livenessState } : {},
			...replayInvalid ? { replayInvalid } : {}
		};
		emitLifecycleAgentEvent(ctx, data, {
			...data,
			endedAt: Date.now()
		});
	};
	const finalizeAgentEnd = () => {
		if (ctx.state.pendingCompactionRetry > 0) ctx.resolveCompactionRetry();
		else ctx.maybeResolveCompactionWait();
	};
	const flushPendingMediaAndChannel = () => {
		if (ctx.params.onBlockReply && !ctx.state.pendingToolMediaDeliveryFailed) {
			const pendingToolMediaReply = readPendingToolMediaReply(ctx.state);
			if (pendingToolMediaReply && hasAssistantVisibleReply(pendingToolMediaReply)) ctx.emitBlockReply(pendingToolMediaReply);
		}
		const flushChannel = () => {
			const result = ctx.params.onBlockReplyFlush?.({ reason: "terminal" });
			return isPromiseLike(result) ? result : void 0;
		};
		const postMediaFlushResult = ctx.flushBlockReplyBuffer();
		return isPromiseLike(postMediaFlushResult) ? postMediaFlushResult.then(flushChannel) : flushChannel();
	};
	const rethrowAfterLifecycleTerminal = (error) => {
		const emitted = emitLifecycleTerminalOnce();
		if (isPromiseLike(emitted)) return Promise.resolve(emitted).then(() => {
			throw error;
		});
		throw error;
	};
	let lifecycleTerminalEmitted = false;
	const emitLifecycleTerminalOnce = () => {
		if (lifecycleTerminalEmitted) return;
		lifecycleTerminalEmitted = true;
		const beforeLifecycleTerminal = runTerminalHook(() => ctx.params.onBeforeLifecycleTerminal?.(), (err) => ctx.log.debug(`before lifecycle terminal failed: ${String(err)}`));
		if (isPromiseLike(beforeLifecycleTerminal)) return Promise.resolve(beforeLifecycleTerminal).then(emitLifecycleTerminal);
		emitLifecycleTerminal();
	};
	const applyBeforeTerminalDecision = (decision) => {
		if (decision?.suppressTerminalDelivery === true) {
			ctx.clearAssistantStream();
			ctx.clearDeferredBlockReplies();
			finalizeAgentEnd();
			return;
		}
		if (decision?.continueCurrentTurn === true) {
			ctx.releaseDeferredReplies();
			finalizeAgentEnd();
			return ctx.flushBlockReplyBuffer();
		}
		try {
			ctx.releaseDeferredReplies();
			const flushBlockReplyBufferResult = ctx.flushBlockReplyBuffer({ final: true });
			finalizeAgentEnd();
			const flushPendingMediaAndChannelResult = isPromiseLike(flushBlockReplyBufferResult) ? Promise.resolve(flushBlockReplyBufferResult).then(flushPendingMediaAndChannel) : flushPendingMediaAndChannel();
			if (isPromiseLike(flushPendingMediaAndChannelResult)) return Promise.resolve(flushPendingMediaAndChannelResult).then(emitLifecycleTerminalOnce, rethrowAfterLifecycleTerminal);
			return emitLifecycleTerminalOnce();
		} catch (error) {
			return rethrowAfterLifecycleTerminal(error);
		}
	};
	const beforeTerminalDelivery = runTerminalHook(() => {
		const answerAssistant = ctx.state.keptAnswer?.assistant ?? lastAssistant;
		return ctx.params.onBeforeTerminalDelivery?.({
			messages: evt?.messages ?? [],
			willRetry: evt?.willRetry === true,
			...evt?.assistantEntryId ? { assistantEntryId: evt.assistantEntryId } : {},
			...answerAssistant ? { lastAssistant: answerAssistant } : {},
			assistantTexts: ctx.state.assistantTexts,
			hasAssistantVisibleText,
			isError,
			incompleteTerminalAssistant,
			hadDeterministicSideEffect: hadBeforeFinalizeSideEffect,
			hasPendingContinuation: ctx.state.yielded || ctx.state.deterministicApprovalPromptPending || ctx.state.deterministicApprovalPromptSent || hasCompletionMessageSessionSpawn(ctx.state.acceptedSessionSpawns) || hasAsyncActivity(ctx.state.toolMetas)
		});
	}, (error) => ctx.log.warn(`before terminal delivery failed: ${String(error)}`));
	if (isPromiseLike(beforeTerminalDelivery)) return Promise.resolve(beforeTerminalDelivery).then(applyBeforeTerminalDecision);
	return applyBeforeTerminalDecision(beforeTerminalDelivery);
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.messages.stream.ts
function isSubscribeTranscriptOnlyOpenClawAssistantMessage(message) {
	if (!message || message.role !== "assistant") return false;
	const provider = normalizeOptionalString(message.provider) ?? "";
	const model = normalizeOptionalString(message.model) ?? "";
	return provider === "openclaw" && (model === "delivery-mirror" || model === "gateway-injected");
}
function readAssistantMessageApi(message) {
	return message?.role === "assistant" ? normalizeOptionalString(message.api) : void 0;
}
function isResponsesApiAssistantMessage(message) {
	return OPENAI_RESPONSES_APIS.has(readAssistantMessageApi(message) ?? "");
}
function isOpenAiCompletionsAssistantMessage(message) {
	const api = readAssistantMessageApi(message);
	return api === "openai-completions" || api === "openclaw-openai-completions-transport";
}
function extractStandaloneMessageToolText(text, params = {}) {
	if (!params.allowCurrentSourceReply && !params.allowRoutedReply) return;
	const record = safeParseJsonRecord(text.trim());
	const args = asOptionalRecord(record?.arguments);
	const hasRoute = Boolean(normalizeOptionalString(args?.target) || normalizeOptionalString(args?.to) || normalizeOptionalString(args?.channel) || normalizeOptionalString(args?.accountId) || Array.isArray(args?.targets));
	if (normalizeOptionalString(record?.name) !== "message" || normalizeOptionalString(args?.action) !== "send" || (hasRoute ? !params.allowRoutedReply : !params.allowCurrentSourceReply)) return;
	return normalizeOptionalString(args?.message);
}
function isAssistantTextBlock(value) {
	return asOptionalObjectRecord(value)?.type === "text";
}
function resolveAssistantStreamItemId(params) {
	const content = params.message?.content;
	if (!Array.isArray(content)) return;
	const contentIndex = resolveAssistantStreamContentIndex(params.contentIndex);
	const hasIndexedTextBlock = isAssistantTextBlock(contentIndex !== void 0 ? content[contentIndex] : void 0);
	const candidateStart = hasIndexedTextBlock && contentIndex !== void 0 ? contentIndex : content.length - 1;
	const candidateEnd = hasIndexedTextBlock ? candidateStart : 0;
	for (let index = candidateStart; index >= candidateEnd; index -= 1) {
		const block = content[index];
		if (!isAssistantTextBlock(block)) continue;
		const signature = parseAssistantTextSignature(block);
		if (signature?.id) return signature.id;
	}
}
function resolveAssistantStreamContentIndex(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : void 0;
}
function resolveAssistantStreamBlockIndex(message, contentIndex, itemId) {
	if (!Array.isArray(message.content)) return;
	if (isAssistantTextBlock(contentIndex === void 0 ? void 0 : message.content[contentIndex])) return contentIndex;
	const index = itemId ? message.content.findLastIndex((candidate) => isAssistantTextBlock(candidate) && parseAssistantTextSignature(candidate)?.id === itemId) : -1;
	return index >= 0 ? index : void 0;
}
function scopeAssistantMessageToStreamBlock(message, contentIndex, itemId) {
	const index = resolveAssistantStreamBlockIndex(message, contentIndex, itemId);
	if (index === void 0 || !Array.isArray(message.content)) return message;
	const block = message.content[index];
	if (!block) return message;
	return {
		...message,
		content: [block]
	};
}
function emitAssistantCommentaryStreamData(ctx, message, finalMessage = false) {
	const isResponsesCommentary = isResponsesApiAssistantMessage(message);
	const { lastAssistantStreamContentIndex: index, lastAssistantStreamItemId: itemId } = ctx.state;
	let commentaryMessages = [scopeAssistantMessageToStreamBlock(message, index, itemId)];
	if (!isResponsesCommentary) {
		const blocks = readAssistantTextBlocksForPhase(message, "commentary");
		commentaryMessages = [message];
		if (Array.isArray(message.content)) {
			commentaryMessages = [];
			for (const id of new Set(blocks.map((block) => parseAssistantTextSignature(block)?.id))) {
				const content = message.content.filter((block) => block.type === "text" && blocks.some((selected) => selected === block) && parseAssistantTextSignature(block)?.id === id);
				commentaryMessages.push({
					...message,
					content
				});
			}
		}
	}
	for (const commentaryMessage of commentaryMessages) {
		const text = extractAssistantCommentaryText(commentaryMessage);
		if (!text || !finalMessage && isResponsesCommentary && ctx.state.deltaBuffer === text) continue;
		const commentaryItemId = isResponsesCommentary ? itemId : resolveAssistantStreamItemId({ message: commentaryMessage });
		ctx.emitAssistantStreamData({
			text,
			delta: "",
			replace: true,
			phase: "commentary",
			itemId: commentaryItemId
		}, { finalMessage });
	}
}
function emitReasoningEnd(ctx) {
	if (!ctx.state.reasoningStreamOpen) return;
	ctx.flushAssistantStream();
	ctx.state.reasoningStreamOpen = false;
	runBestEffortCallback({
		label: "reasoning end",
		log: ctx.log,
		callback: () => ctx.params.onReasoningEnd?.()
	});
}
function emitPersistentReasoning(ctx, text) {
	if (!ctx.state.includeReasoning || !text || !ctx.params.onBlockReply || ctx.params.silentExpected || shouldSuppressDeterministicApprovalOutput(ctx.state) || shouldSuppressSourceReplyOutput(ctx) || text === ctx.state.lastReasoningSent) return;
	const previous = ctx.state.lastReasoningSent;
	const pending = previous && text.startsWith(previous) ? text.slice(previous.length).trimStart() : text;
	ctx.state.lastReasoningSent = text;
	if (pending) ctx.emitBlockReply({
		text: pending,
		isReasoning: true
	});
}
function emitAssistantMessageStart(ctx) {
	ctx.flushAssistantStream();
	runBestEffortCallback({
		label: "assistant message start",
		log: ctx.log,
		callback: () => ctx.params.onAssistantMessageStart?.()
	});
}
function openReasoningStream(ctx) {
	if (!ctx.state.reasoningStreamOpen) ctx.flushAssistantStream();
	ctx.state.reasoningStreamOpen = true;
}
function shouldSuppressDeterministicApprovalOutput(state) {
	return state.deterministicApprovalPromptPending || state.deterministicApprovalPromptSent;
}
function shouldSuppressSourceReplyOutput(ctx) {
	return ctx.state.sourceReplyDeliveryState === "delivered" || ctx.params.sourceReplyDeliveryMode === "message_tool_only" && (ctx.state.messageToolOnlySourceReplyDelivered || ctx.params.hasDeliveredMessageToolOnlySourceReply?.() === true || (ctx.state.messagingToolSourceReplyPayloads?.length ?? 0) > 0);
}
function resolveAssistantTextChunk(params) {
	const { evtType, delta, content, accumulatedText } = params;
	if (evtType === "text_delta" || delta) return delta;
	if (!content) return "";
	if (content.startsWith(accumulatedText)) return content.slice(accumulatedText.length);
	return accumulatedText.includes(content) ? "" : content;
}
function resolveStreamingReply(params) {
	let directiveCodePrefix = params.appendDelta !== null ? params.directiveCodePrefix : void 0;
	if (!params.parsedStreamDirectives && params.evtType === "text_delta") {
		const text = params.previousCleaned;
		return {
			text,
			delta: "",
			replace: false,
			hasText: Boolean(text.trim()),
			replyDirectives: null,
			audioDirectiveCount: params.previousAudioDirectiveCount,
			directiveCodePrefix: directiveCodePrefix && params.rawDirectiveSource?.length === directiveCodePrefix.checkedRawLength ? directiveCodePrefix : void 0
		};
	}
	let text;
	let delta;
	let isAppend = false;
	let replyDirectives = params.parsedStreamDirectives;
	let audioDirectiveCount = params.previousAudioDirectiveCount;
	if (directiveCodePrefix && params.rawDirectiveSource?.includes("[[", Math.max(0, directiveCodePrefix.checkedRawLength - 1))) directiveCodePrefix = void 0;
	if (params.evtType !== "text_end" && params.parsedStreamDirectives && !params.parsedStreamDirectives.isSilent && !hasReplyDirectiveMetadata(params.parsedStreamDirectives) && !/(?:^|\n)[^\S\n]*MEDIA:\s*\S[^\n]*(?:\n|$)/i.test(params.visibleDelta) && params.parsedStreamDirectives.text === params.visibleDelta && params.appendDelta !== null && params.previousText === params.previousCleaned && (directiveCodePrefix || !params.rawDirectiveSource?.includes("[["))) {
		text = params.next;
		delta = params.appendDelta;
		isAppend = true;
		if (directiveCodePrefix && params.rawDirectiveSource !== void 0) directiveCodePrefix = {
			...directiveCodePrefix,
			checkedRawLength: params.rawDirectiveSource.length
		};
	}
	if (text === void 0 && params.evtType !== "text_end" && params.parsedStreamDirectives && !params.parsedStreamDirectives.isSilent && params.parsedStreamDirectives.text === params.visibleDelta && params.appendDelta !== null && params.previousCleaned && params.previousText.length > params.previousCleaned.length && !/(?:^|\n)[^\S\n]*MEDIA:\s*\S[^\n]*(?:\n|$)/i.test(params.visibleDelta)) {
		const marker = params.previousText.lastIndexOf("[[");
		const tailStart = params.previousText.indexOf("]]", marker + 2) + 2;
		const tail = params.previousText.slice(tailStart);
		const source = params.rawDirectiveSource ?? params.next;
		if (marker >= 0 && tailStart > marker + 2 && tail.trim() && params.previousCleaned.endsWith(tail.trimStart()) && !/[`~\t]| {4}/u.test(params.previousText.slice(0, marker)) && !source.includes("[[", params.previousText.length - 1) && !source.includes("]:")) {
			text = params.previousCleaned + params.appendDelta;
			delta = params.appendDelta;
			isAppend = true;
		}
	}
	if (text === void 0) {
		directiveCodePrefix = void 0;
		audioDirectiveCount = 0;
		const source = params.rawDirectiveSource === void 0 ? params.next : params.evtType !== "text_end" && params.rawProjectionText !== void 0 ? params.rawProjectionText : toolCallXmlTextFilter({ stripFunctionCallsXmlPayloads: true }, params.evtType !== "text_end").transform(stripDowngradedToolCallText(params.rawDirectiveSource));
		const parsed = parseReplyDirectives(params.evtType === "text_end" ? source : splitTrailingDirective(source).text, { onAudioDirective: () => {
			audioDirectiveCount += 1;
		} });
		text = params.rawDirectiveSource === void 0 ? parsed.text : trimTextPreservingCode(parsed.text);
		if (params.evtType !== "text_end" && params.appendDelta !== null && source === params.rawDirectiveSource && text === params.next && !parsed.isSilent && !hasReplyDirectiveMetadata(parsed) && !parsed.mediaUrls?.length) {
			const prefix = findDirectiveCodePrefix(source, params.visibleDelta);
			if (prefix && params.next.startsWith(source.slice(0, prefix.end))) directiveCodePrefix = prefix;
		}
		if (replyDirectives) replyDirectives = {
			...replyDirectives,
			replyToId: parsed.replyToId,
			replyToCurrent: parsed.replyToCurrent,
			replyToTag: parsed.replyToTag,
			audioAsVoice: audioDirectiveCount > params.previousAudioDirectiveCount
		};
	}
	const replace = Boolean(!isAppend && params.previousCleaned && !text.startsWith(params.previousCleaned));
	return {
		text,
		delta: replace ? "" : delta ?? text.slice(params.previousCleaned.length),
		replace,
		hasText: Boolean(isAppend ? text : text.trim()),
		replyDirectives,
		audioDirectiveCount,
		directiveCodePrefix
	};
}
/** Retain raw pre-trim XML ownership independently of visible directive trimming. */
function createStreamingReplyResolver() {
	const rawProjection = createTextProjection([downgradedToolCallTextFilter(), toolCallXmlTextFilter({ stripFunctionCallsXmlPayloads: true }, true)]);
	return (params) => {
		const rawProjectionText = params.rawDirectiveSource === void 0 ? void 0 : params.rawDirectiveDelta === void 0 ? rawProjection.replace(params.rawDirectiveSource).text : rawProjection.append(params.rawDirectiveDelta, params.rawDirectiveSource).text;
		return resolveStreamingReply({
			...params,
			rawProjectionText
		});
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.messages.snapshot.ts
function extractAssistantStreamSnapshot(ctx, message, options) {
	let observedMessage = message;
	if (options?.throughIndex !== void 0 && Array.isArray(message.content)) {
		const content = message.content.slice(0, options.throughIndex + 1);
		if (options.observedText !== void 0) {
			const current = content[options.throughIndex];
			if (current?.type === "text") content[options.throughIndex] = {
				type: "text",
				text: options.observedText,
				textSignature: current.textSignature
			};
			else if (content.length === 0) content.push({
				type: "text",
				text: options.observedText
			});
		}
		observedMessage = {
			...message,
			content
		};
	} else if (options?.observedText !== void 0) observedMessage = {
		...message,
		content: [{
			type: "text",
			text: options.observedText
		}]
	};
	const state = createAssistantStreamBlockState();
	let rawText = "";
	const blockSources = [];
	const parts = [];
	const renderText = prepareAssistantVisibleText(observedMessage, (part, final, phase, index) => {
		const separator = rawText && !state.pendingTagFragment && !state.pendingFenceFragment ? "\n" : "";
		const previousIndex = parts.at(-1)?.index;
		parts.push({
			separator,
			index
		});
		rawText += `${separator}${part}`;
		const preparedFinal = phase === "final_answer" && !ctx.params.enforceFinalTag;
		const visible = preparedFinal ? `${separator}${part}` : ctx.stripBlockTags(`${separator}${part}`, state, { final: final && options?.final !== false });
		const previous = blockSources.at(-1);
		if (previous && previousIndex !== void 0 && index === previousIndex + 1 && previous.finalAnswer === preparedFinal) previous.text += visible;
		else blockSources.push({
			text: visible.startsWith(separator) ? visible.slice(separator.length) : visible,
			separator,
			finalAnswer: preparedFinal
		});
		return preparedFinal ? part : visible;
	});
	const visibleBlockSource = blockSources.map(({ text, separator, finalAnswer }) => ({
		separator,
		text: finalAnswer ? sanitizeUserFacingText(applyTextFilters(text, assistantVisibleTextFilters("final-answer-delivery", options?.final === false, { preserveTrailingWhitespace: true })), { streaming: options?.final === false }) : toolCallXmlTextFilter({ stripFunctionCallsXmlPayloads: true }, options?.final === false).transform(stripDowngradedToolCallText(text, { preserveTrailingWhitespace: true }))
	})).filter(({ text }, index) => text.trim() || options?.observedText === "" && index === blockSources.length - 1).map(({ text, separator }, index) => `${index > 0 ? separator : ""}${text}`).join("");
	const blockReply = parseReplyDirectives(options?.final === false ? splitTrailingDirective(visibleBlockSource, { preserveTrailingWhitespace: true }).text : visibleBlockSource, { preserveTrailingWhitespace: true });
	let text;
	return {
		get text() {
			return text ??= renderText();
		},
		rawText,
		state,
		parts,
		blockText: blockReply.text,
		message: observedMessage
	};
}
/** Reconcile one prepared source frame without translating raw or rendered offsets. */
function reconcileBlockReplySnapshot(ctx, previous, next) {
	const prefixAt = (snapshot, index) => {
		if (index === 0) return "";
		if (index > (snapshot.parts.at(-1)?.index ?? 0)) return snapshot.blockText;
		return extractAssistantStreamSnapshot(ctx, snapshot.message, {
			throughIndex: index - 1,
			final: false
		}).blockText + (snapshot.parts.find((part) => part.index === index)?.separator ?? "");
	};
	const scope = ctx.state.blockReplyScopeStart;
	const scopePosition = (snapshot) => {
		if (!scope) return {
			index: 0,
			valid: true
		};
		const indexed = resolveAssistantStreamBlockIndex(snapshot.message, scope.contentIndex, void 0);
		const anchor = indexed !== void 0 && (!scope.itemId || resolveAssistantStreamItemId({
			contentIndex: indexed,
			message: snapshot.message
		}) === scope.itemId) ? indexed : resolveAssistantStreamBlockIndex(snapshot.message, void 0, scope.itemId) ?? indexed;
		return {
			index: (anchor ?? scope.contentIndex) + (scope.after ? 1 : 0),
			valid: anchor !== void 0
		};
	};
	const oldScope = scopePosition(previous);
	const nextScope = scopePosition(next);
	const origin = oldScope.index;
	const oldPrefix = prefixAt(previous, origin);
	const nextPrefix = prefixAt(next, nextScope.index);
	const oldText = previous.blockText.slice(oldPrefix.length);
	const nextText = next.blockText.slice(nextPrefix.length);
	const consumed = ctx.blockChunker.consumedLength;
	let oldCode;
	let nextCode;
	const crossesCode = (snapshot, offset, includeCodeEnd = false) => {
		if (offset <= 0 || offset > snapshot.blockText.length || offset === snapshot.blockText.length && !includeCodeEnd) return false;
		return (snapshot === previous ? oldCode ??= findMarkdownCodeRegions(previous.blockText) : nextCode ??= findMarkdownCodeRegions(next.blockText)).some((region) => region.start < offset && (offset < region.end || includeCodeEnd && offset === region.end));
	};
	const scopeRetained = oldScope.valid && nextScope.valid && !crossesCode(previous, oldPrefix.length) && !crossesCode(next, nextPrefix.length);
	if (scopeRetained && origin > 0 && consumed === 0 && !ctx.blockChunker.hasBuffered()) {
		if (next.blockText.startsWith(nextPrefix)) {
			ctx.blockChunker.append(nextText);
			return;
		}
	}
	const retained = Math.min(consumed, nextText.length);
	const retainedPrefix = scopeRetained && oldPrefix === nextPrefix && previous.blockText.startsWith(oldPrefix) && next.blockText.startsWith(nextPrefix) && oldText.slice(0, retained) === nextText.slice(0, retained);
	if (retainedPrefix && (nextText.length >= consumed || !oldText.slice(retained, consumed).trim())) {
		if (consumed === oldText.length && !ctx.blockChunker.hasBuffered()) for (const part of next.parts) {
			const index = part.index ?? 0;
			if (!index || !part.separator) continue;
			const boundary = prefixAt(next, index);
			const padding = boundary.slice(previous.blockText.length);
			if (boundary.startsWith(previous.blockText) && padding && !padding.trim() && !crossesCode(next, boundary.length)) {
				ctx.blockChunker.append(padding);
				ctx.blockChunker.drain({
					force: true,
					emit: () => {}
				});
				break;
			}
		}
		ctx.blockChunker.replace(nextText, 0, retainedPrefix);
		return;
	}
	let restartIndex = next.parts[0]?.index ?? 0;
	let restartPrefix = "";
	for (const part of next.parts) {
		const index = part.index ?? 0;
		if (!index || !part.separator) continue;
		const oldBoundary = prefixAt(previous, index);
		const nextBoundary = prefixAt(next, index);
		if (oldBoundary === nextBoundary && previous.blockText.startsWith(oldBoundary) && next.blockText.startsWith(nextBoundary) && oldBoundary.length <= oldPrefix.length + consumed && !crossesCode(previous, oldBoundary.length) && !crossesCode(next, nextBoundary.length)) {
			restartIndex = index;
			restartPrefix = nextBoundary;
		}
	}
	if (retainedPrefix && nextText.length < consumed && restartPrefix !== next.blockText) {
		ctx.blockChunker.replace(nextText, 0, retainedPrefix);
		return;
	}
	const sourceBreaks = [];
	if (scopeRetained && oldScope.index === nextScope.index && oldPrefix === nextPrefix && consumed > 0) {
		const limit = Math.min(oldText.length, nextText.length);
		let prefixLength = 0;
		while (prefixLength < limit && oldText.charCodeAt(prefixLength) === nextText.charCodeAt(prefixLength)) prefixLength += 1;
		let suffixLength = 0;
		while (suffixLength < limit - prefixLength && oldText.charCodeAt(oldText.length - suffixLength - 1) === nextText.charCodeAt(nextText.length - suffixLength - 1)) suffixLength += 1;
		const suffixStart = oldText.length - suffixLength;
		const shift = next.blockText.length - previous.blockText.length;
		for (const end of ctx.blockChunker.preparedSourceBreaks) {
			const unchangedPrefix = end <= prefixLength;
			const oldBoundary = oldPrefix.length + end;
			const nextBoundary = oldBoundary + (unchangedPrefix ? 0 : shift);
			if (!unchangedPrefix && (suffixLength === 0 || end < suffixStart) || end > Math.min(consumed, oldText.length) || nextBoundary <= restartPrefix.length || crossesCode(previous, oldBoundary, true) || crossesCode(next, nextBoundary, true)) continue;
			sourceBreaks.push(nextBoundary - restartPrefix.length);
		}
	}
	ctx.state.blockReplyScopeStart = {
		contentIndex: restartIndex,
		itemId: resolveAssistantStreamItemId({
			contentIndex: restartIndex,
			message: next.message
		})
	};
	ctx.blockChunker.reset(sourceBreaks, restartPrefix.length);
	ctx.blockChunker.append(next.blockText.slice(restartPrefix.length));
}
//#endregion
//#region src/agents/embedded-agent-subscribe.raw-stream.ts
/**
* Appends raw embedded-agent stream payloads for diagnostics when enabled.
*/
let rawStreamReady = false;
function appendRawStream(createPayload, sessionKey) {
	if (!isTruthyEnvValue(process.env.OPENCLAW_RAW_STREAM) || isIncognitoSessionKey(sessionKey)) return;
	const rawStreamPath = process.env.OPENCLAW_RAW_STREAM_PATH?.trim() || path.join(resolveStateDir(), "logs", "raw-stream.jsonl");
	if (!rawStreamReady) {
		rawStreamReady = true;
		try {
			fs.mkdirSync(path.dirname(rawStreamPath), { recursive: true });
		} catch {}
	}
	try {
		appendRegularFile({
			filePath: rawStreamPath,
			content: `${JSON.stringify(createPayload())}\n`,
			rejectSymlinkParents: true
		}).catch(() => {});
	} catch {}
}
//#endregion
//#region src/shared/text/assistant-transcript-role-headers.ts
/** Detect transcript-role headers in assistant Markdown through the canonical parser. */
function detectAssistantTranscriptRoleHeaderText(text) {
	if (!text.includes("[") && !text.includes("<") && !text.includes("&")) return null;
	const annotation = markdownToIR(text, {
		assistantTranscriptRoleHeaders: true,
		enableSpoilers: true,
		linkify: false,
		tableMode: "off"
	}).annotations?.[0];
	if (!annotation || annotation.type !== "assistant_transcript_role") return null;
	return {
		kind: annotation.kind,
		role: annotation.role
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.tool-text-diagnostics.ts
/**
* Warns when assistant text appears to expose raw tool-call syntax.
*/
function isRegisteredToolName(toolName, registeredToolNames) {
	if (!toolName || !registeredToolNames) return;
	const normalized = normalizeToolPolicyName(toolName);
	for (const registeredToolName of registeredToolNames) if (normalizeToolPolicyName(registeredToolName) === normalized) return true;
	return false;
}
/** Log safe metadata for suspicious assistant-authored text shapes. */
function warnIfAssistantEmittedSuspiciousText(ctx, assistantMessage) {
	const structuredToolInvocation = assistantMessage.content.some((block) => isToolCallBlockType(block.type));
	const text = extractTextFromChatContent(assistantMessage.content, {
		joinWith: "\n",
		normalizeText: (chunk) => chunk.trim()
	}) ?? "";
	const toolDetection = structuredToolInvocation ? null : detectToolCallShapedText(text);
	if (toolDetection) {
		const provider = normalizeOptionalString(assistantMessage.provider);
		const model = normalizeOptionalString(assistantMessage.model);
		const registeredTool = isRegisteredToolName(toolDetection.toolName, ctx.builtinToolNames);
		const sessionId = normalizeOptionalString(ctx.params.session.id);
		ctx.log.warn("Assistant reply looks like a tool call, but no structured tool invocation was emitted; treating it as text.", {
			runId: ctx.params.runId,
			...sessionId ? { sessionId } : {},
			...provider ? { provider } : {},
			...model ? { model } : {},
			pattern: toolDetection.kind,
			...toolDetection.toolName ? { toolName: toolDetection.toolName } : {},
			...registeredTool !== void 0 ? { registeredTool } : {}
		});
	}
	const roleDetection = detectAssistantTranscriptRoleHeaderText(text);
	if (!roleDetection) return;
	const provider = normalizeOptionalString(assistantMessage.provider);
	const model = normalizeOptionalString(assistantMessage.model);
	const sessionId = normalizeOptionalString(ctx.params.session.id);
	ctx.log.warn("Assistant reply contains transcript-role-looking text; treating it as inert assistant text.", {
		runId: ctx.params.runId,
		...sessionId ? { sessionId } : {},
		...provider ? { provider } : {},
		...model ? { model } : {},
		pattern: roleDetection.kind,
		role: roleDetection.role
	});
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.messages.lifecycle.ts
function handleMessageStart(ctx, evt) {
	const msg = evt.message;
	if (msg?.role !== "assistant" || isSubscribeTranscriptOnlyOpenClawAssistantMessage(msg)) return;
	ctx.state.lastReasoningSent = void 0;
	ctx.resetAssistantMessageState(ctx.state.assistantTexts.length);
	ctx.state.assistantMessageStartIndex = ctx.state.assistantMessageIndex;
	emitAssistantMessageStart(ctx);
}
function handleMessageEnd(ctx, evt) {
	const msg = evt.message;
	if (msg.role === "user" && ctx.state.lastAssistant) {
		ctx.state.answerSegments.push({
			textEnd: ctx.state.assistantTexts.length,
			messageEnd: ctx.state.assistantMessageIndex,
			finalMessageStart: ctx.state.assistantMessageStartIndex,
			lastAssistant: ctx.state.lastAssistant,
			keptAnswer: ctx.state.keptAnswer,
			sourceReplyDeliveryState: ctx.state.sourceReplyDeliveryState
		});
		ctx.state.inputAnswer = void 0;
		ctx.state.keptAnswer = void 0;
		ctx.state.sourceReplyDeliveryState = "missing";
		ctx.state.messageToolOnlySourceReplyDelivered = false;
		ctx.state.deterministicApprovalPromptPending = false;
		ctx.state.deterministicApprovalPromptSent = false;
		ctx.state.currentSourceMessagingToolSentTextsNormalized.length = 0;
		ctx.state.lastToolTurnOnlySourceProgress = void 0;
		ctx.state.lastAssistant = void 0;
		return;
	}
	if (msg?.role !== "assistant" || isSubscribeTranscriptOnlyOpenClawAssistantMessage(msg)) return;
	ctx.state.assistantTurnCount += 1;
	const assistantMessage = msg;
	const assistantPhase = resolveAssistantMessagePhase(assistantMessage);
	const suppressVisibleAssistantOutput = assistantPhase === "commentary";
	const suppressDeterministicApprovalOutput = shouldSuppressDeterministicApprovalOutput(ctx.state);
	const suppressSourceReplyOutput = shouldSuppressSourceReplyOutput(ctx);
	const canEmitReply = () => !ctx.params.silentExpected && !suppressDeterministicApprovalOutput && !suppressSourceReplyOutput;
	const appendRawMessage = (getText) => appendRawStream(() => ({
		ts: Date.now(),
		event: "assistant_message_end",
		runId: ctx.params.runId,
		sessionId: ctx.params.session.id,
		rawText: getText(),
		rawThinking: extractAssistantThinking(assistantMessage)
	}), ctx.params.sessionKey);
	if (!suppressSourceReplyOutput) emitReasoningEnd(ctx);
	ctx.noteLastAssistant(assistantMessage);
	ctx.state.keptAnswer = void 0;
	if (suppressVisibleAssistantOutput) {
		appendRawMessage(() => extractEmbeddedAssistantText(assistantMessage));
		emitAssistantCommentaryStreamData(ctx, assistantMessage, true);
		emitPersistentReasoning(ctx, ctx.state.includeReasoning ? extractAssistantThinking(assistantMessage) : "");
		return;
	}
	const sourceContent = assistantMessage.content;
	promoteThinkingTagsToBlocks(assistantMessage);
	let rawText;
	const getRawText = () => rawText ??= extractEmbeddedAssistantText(assistantMessage);
	const snapshot = extractAssistantStreamSnapshot(ctx, assistantMessage);
	const rawVisibleText = snapshot.text;
	appendRawMessage(getRawText);
	warnIfAssistantEmittedSuspiciousText(ctx, assistantMessage);
	const messageToolText = extractStandaloneMessageToolText(rawVisibleText, {
		allowRoutedReply: isOpenAiCompletionsAssistantMessage(assistantMessage),
		allowCurrentSourceReply: ctx.params.sourceReplyDeliveryMode === "message_tool_only" && ctx.builtinToolNames?.has("message") === true
	});
	const text = messageToolText === void 0 ? rawVisibleText : extractAssistantVisibleText(scopeAssistantMessageToStreamBlock(assistantMessage, snapshot.parts[0]?.index, void 0), () => messageToolText);
	const rawThinking = ctx.state.includeReasoning || ctx.state.streamReasoning ? extractAssistantThinking(assistantMessage) || extractThinkingFromTaggedText(getRawText()) : "";
	const trimmedText = text.trim();
	ctx.resetPartialReplyDirectives();
	const parsedText = parseReplyDirectives(text);
	recordPendingAssistantReplyDirectives(ctx.state, parsedText);
	const cleanedText = parsedText.text;
	const { mediaUrls } = resolveSendableOutboundReplyParts(parsedText, { text: "" });
	const managedMediaUrls = resolveManagedStreamMediaUrls(ctx.state, mediaUrls);
	const sourceMessage = {
		...assistantMessage,
		content: sourceContent
	};
	const sourceSnapshot = sourceContent === assistantMessage.content ? snapshot : extractAssistantStreamSnapshot(ctx, sourceMessage);
	const resolveSourceIndex = (contentIndex, itemId) => resolveAssistantStreamBlockIndex(sourceMessage, contentIndex, itemId) ?? -1;
	const lastIndex = resolveSourceIndex(ctx.state.lastAssistantStreamContentIndex, ctx.state.lastAssistantStreamItemId);
	if (ctx.state.lastBlockReplyText == null) {
		ctx.blockChunker.reset();
		ctx.state.blockReplyScopeStart = void 0;
	}
	if (ctx.blockChunker.consumedLength === 0 && !ctx.blockChunker.hasBuffered()) {
		const preparedIndex = ctx.state.lastAssistantTextMessageIndex >= ctx.state.assistantMessageStartIndex ? resolveSourceIndex(ctx.state.lastAssistantTextContentIndex, ctx.state.lastAssistantTextItemId) : -1;
		if (preparedIndex >= 0) ctx.state.blockReplyScopeStart = {
			contentIndex: preparedIndex,
			itemId: resolveAssistantStreamItemId({
				contentIndex: preparedIndex,
				message: sourceMessage
			}),
			after: true
		};
	}
	reconcileBlockReplySnapshot(ctx, extractAssistantStreamSnapshot(ctx, sourceMessage, {
		throughIndex: lastIndex >= 0 ? lastIndex : void 0,
		observedText: ctx.state.streamBlockText,
		final: ctx.state.streamBlockFinal
	}), text === rawVisibleText ? sourceSnapshot : {
		...snapshot,
		blockText: cleanedText
	});
	const lastSourceIndex = sourceSnapshot.parts.at(-1)?.index;
	if (lastIndex >= 0 && lastSourceIndex !== void 0 && lastSourceIndex > lastIndex) ctx.state.lastAssistantStreamContentIndex = lastSourceIndex;
	const finalizeMessageEnd = () => {
		ctx.state.deltaBuffer = "";
		ctx.state.streamBlockText = "";
		ctx.state.streamBlockFinal = false;
		ctx.state.blockReplyScopeStart = void 0;
		ctx.state.thinkingTagStream = createThinkingTagStreamState();
		ctx.state.deltaBufferIsCommentary = false;
		ctx.state.hasFlushedPartialText = false;
		ctx.blockChunker.reset();
		const { reasoningDepth, final, inlineCode } = ctx.state.partialBlockState;
		ctx.state.partialBlockState = {
			reasoningDepth,
			final,
			inlineCode
		};
		ctx.state.assistantStream = void 0;
		ctx.state.reasoningStreamOpen = false;
	};
	if (canEmitReply()) ctx.emitAssistantStreamData({
		text: cleanedText,
		delta: "",
		mediaUrls: mediaUrls.length ? mediaUrls : void 0,
		managedMediaUrls: managedMediaUrls.length ? managedMediaUrls : void 0,
		phase: assistantPhase
	}, { finalMessage: true });
	const finalAssistantText = ctx.params.silentExpected && !isSilentReplyText(trimmedText, "NO_REPLY") ? "" : text;
	const lastVisibleItemRecorded = lastSourceIndex !== void 0 && ctx.state.lastAssistantTextMessageIndex >= ctx.state.assistantMessageStartIndex && resolveSourceIndex(ctx.state.lastAssistantTextContentIndex, ctx.state.lastAssistantTextItemId) === lastSourceIndex;
	const addedDuringMessage = ctx.state.assistantTexts.length > ctx.state.assistantTextBaseline || lastVisibleItemRecorded;
	const chunkerHasBuffered = Boolean(ctx.params.onBlockReply) && ctx.blockChunker.hasBuffered();
	ctx.finalizeAssistantTexts({
		text: finalAssistantText,
		addedDuringMessage,
		chunkerHasBuffered
	});
	const answersInput = !ctx.params.silentExpected && assistantMessage.stopReason === "stop" && assistantMessage.endTurn !== false && !parsedText.isSilent && Boolean(cleanedText.trim() || mediaUrls.length > 0);
	const addsNothing = assistantMessage.stopReason === "stop" && (parsedText.isSilent || !cleanedText.trim()) && mediaUrls.length === 0 && !parsedText.audioAsVoice && !assistantMessage.openclawDelivery?.audioAsVoice && !assistantMessage.openclawDelivery?.tts?.text?.trim();
	ctx.state.keptAnswer = addsNothing ? ctx.state.inputAnswer : void 0;
	if (!addsNothing && assistantMessage.stopReason !== "toolUse" && assistantMessage.endTurn !== false) ctx.state.inputAnswer = void 0;
	const onBlockReply = ctx.params.onBlockReply;
	emitPersistentReasoning(ctx, rawThinking);
	if (canEmitReply() && onBlockReply) {
		const pending = ctx.flushBlockReplyBuffer({
			assistantMessageIndex: ctx.state.assistantMessageIndex,
			final: true,
			finalReply: parsedText
		});
		if (pending) pending.catch((err) => {
			ctx.log.debug(`message_end block reply flush failed: ${String(err)}`);
		});
	}
	if (answersInput) ctx.state.inputAnswer = {
		assistant: applyAssistantDeliveryDirectives(structuredClone(assistantMessage)),
		messageIndex: ctx.state.lastAssistantTextMessageIndex
	};
	if (!ctx.params.silentExpected && rawThinking) ctx.emitReasoningStream(rawThinking);
	if (!ctx.params.silentExpected && ctx.state.blockReplyBreak === "message_end" && ctx.params.onBlockReplyFlush) {
		const flushBlockReplyBufferResult = ctx.flushBlockReplyBuffer();
		if (isPromiseLike(flushBlockReplyBufferResult)) return flushBlockReplyBufferResult.then(() => ctx.params.onBlockReplyFlush?.({ reason: "message_end" })).finally(finalizeMessageEnd);
		const onBlockReplyFlushResult = ctx.params.onBlockReplyFlush({ reason: "message_end" });
		if (isPromiseLike(onBlockReplyFlushResult)) return onBlockReplyFlushResult.finally(finalizeMessageEnd);
	}
	finalizeMessageEnd();
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.messages.update.ts
function handleMessageUpdate(ctx, evt) {
	const msg = evt.message;
	if (msg?.role !== "assistant" || isSubscribeTranscriptOnlyOpenClawAssistantMessage(msg)) return;
	ctx.noteLastAssistant(msg);
	const assistantRecord = asOptionalObjectRecord(evt.assistantMessageEvent);
	const evtType = typeof assistantRecord?.type === "string" ? assistantRecord.type : "";
	if (evtType !== "text_delta") ctx.flushAssistantStream();
	const liveEditDiff = updateLiveEditDiffProgress(ctx.state.liveEditDiffStateById, assistantRecord);
	if (liveEditDiff) {
		const data = {
			phase: "input_delta",
			...liveEditDiff
		};
		emitAgentEvent({
			runId: ctx.params.runId,
			stream: "tool",
			data
		});
		runBestEffortCallback({
			label: "live edit diff agent event",
			log: ctx.log,
			callback: () => ctx.params.onAgentEvent?.({
				stream: "tool",
				data
			})
		});
	}
	const eventAssistantMessage = assistantRecord?.partial && typeof assistantRecord.partial === "object" ? assistantRecord.partial : msg;
	const isResponsesTextEvent = isResponsesApiAssistantMessage(eventAssistantMessage) && (evtType === "text_start" || evtType === "text_delta" || evtType === "text_end");
	const recordRawStream = (event, eventType, delta, content) => appendRawStream(() => ({
		ts: Date.now(),
		event,
		runId: ctx.params.runId,
		sessionId: ctx.params.session.id,
		evtType: eventType,
		delta,
		content
	}), ctx.params.sessionKey);
	if (resolveAssistantMessagePhase(msg) === "commentary" && !isResponsesTextEvent) {
		ctx.flushAssistantStream();
		const commentaryText = extractAssistantCommentaryText(msg);
		if (commentaryText) {
			recordRawStream("assistant_text_stream", "commentary_update", "", commentaryText);
			emitAssistantCommentaryStreamData(ctx, msg);
		}
		return;
	}
	const suppressDeterministicApprovalOutput = shouldSuppressDeterministicApprovalOutput(ctx.state);
	const suppressSourceReplyOutput = shouldSuppressSourceReplyOutput(ctx);
	if (evtType === "thinking_start" || evtType === "thinking_delta" || evtType === "thinking_end") {
		if (!suppressSourceReplyOutput && (evtType === "thinking_start" || evtType === "thinking_delta")) openReasoningStream(ctx);
		const thinkingDelta = typeof assistantRecord?.delta === "string" ? assistantRecord.delta : "";
		const thinkingContent = typeof assistantRecord?.content === "string" ? assistantRecord.content : "";
		recordRawStream("assistant_thinking_stream", evtType, thinkingDelta, thinkingContent);
		const block = Array.isArray(msg.content) && msg.content.length === 1 ? msg.content[0] : void 0;
		const nativeThinking = block?.type === "thinking" ? block : void 0;
		ctx.emitReasoningStream(nativeThinking ?? (extractAssistantThinking(msg) || thinkingContent || thinkingDelta), nativeThinking ? thinkingContent || thinkingDelta : void 0);
		if (evtType === "thinking_end" && !suppressSourceReplyOutput) {
			if (!ctx.state.reasoningStreamOpen) openReasoningStream(ctx);
			emitReasoningEnd(ctx);
			if (ctx.state.includeReasoning && ctx.state.blockReplyBreak === "text_end") emitPersistentReasoning(ctx, extractAssistantThinking(msg) || thinkingContent);
		}
		return;
	}
	if (evtType !== "text_delta" && evtType !== "text_start" && evtType !== "text_end") return;
	const delta = typeof assistantRecord?.delta === "string" ? assistantRecord.delta : "";
	const content = typeof assistantRecord?.content === "string" ? assistantRecord.content : "";
	recordRawStream("assistant_text_stream", evtType, delta, content);
	const partialAssistant = eventAssistantMessage;
	const priorBlockText = ctx.state.streamBlockText;
	const priorBlockFinal = ctx.state.streamBlockFinal;
	const priorBlockIndex = ctx.state.lastAssistantStreamContentIndex;
	const streamContentIndex = resolveAssistantStreamContentIndex(assistantRecord?.contentIndex);
	const streamItemId = resolveAssistantStreamItemId({
		contentIndex: streamContentIndex,
		message: partialAssistant
	});
	const blockSourceIndex = resolveAssistantStreamBlockIndex(partialAssistant, streamContentIndex, streamItemId) ?? streamContentIndex;
	const priorSourceIndex = resolveAssistantStreamBlockIndex(partialAssistant, priorBlockIndex, ctx.state.lastAssistantStreamItemId) ?? priorBlockIndex;
	const streamAssistant = scopeAssistantMessageToStreamBlock(partialAssistant, streamContentIndex, streamItemId);
	const deliveryPhase = resolveAssistantMessagePhase(streamAssistant);
	const isPhasePendingResponsesTextItem = evtType !== "text_end" && !deliveryPhase && Boolean(streamItemId) && isResponsesApiAssistantMessage(partialAssistant);
	const hasResponsesContentIndex = streamContentIndex !== void 0 && isResponsesApiAssistantMessage(partialAssistant);
	let streamItemChanged = false;
	let deliveryItemId = streamItemId;
	if ((deliveryPhase || isPhasePendingResponsesTextItem || hasResponsesContentIndex) && (streamContentIndex !== void 0 || streamItemId)) {
		const previousStreamContentIndex = ctx.state.lastAssistantStreamContentIndex;
		const previousStreamItemId = ctx.state.lastAssistantStreamItemId;
		if (previousStreamContentIndex !== void 0 && streamContentIndex !== void 0 && previousStreamContentIndex !== streamContentIndex || (previousStreamContentIndex === void 0 || streamContentIndex === void 0) && Boolean(previousStreamItemId && streamItemId && previousStreamItemId !== streamItemId)) {
			streamItemChanged = true;
			ctx.flushBlockReplyBuffer({ assistantMessageIndex: ctx.state.assistantMessageIndex });
			ctx.resetAssistantMessageState(ctx.state.assistantTexts.length);
			ctx.state.blockReplyScopeStart = {
				contentIndex: streamContentIndex ?? blockSourceIndex ?? 0,
				itemId: streamItemId
			};
			emitAssistantMessageStart(ctx);
		} else if (previousStreamContentIndex !== void 0 && streamContentIndex === previousStreamContentIndex && previousStreamItemId) deliveryItemId = previousStreamItemId;
		ctx.state.lastAssistantStreamItemId = deliveryItemId;
	}
	if (streamContentIndex !== void 0) {
		if (streamContentIndex !== ctx.state.lastAssistantStreamContentIndex) {
			ctx.flushAssistantStream();
			ctx.state.streamBlockText = "";
			ctx.state.streamBlockFinal = false;
		}
		ctx.state.lastAssistantStreamContentIndex = streamContentIndex;
	}
	const chunk = resolveAssistantTextChunk({
		evtType,
		delta,
		content,
		accumulatedText: ctx.state.streamBlockText
	});
	ctx.state.streamBlockText += chunk;
	ctx.state.streamBlockFinal = evtType === "text_end";
	if (evtType === "text_start" && isResponsesApiAssistantMessage(partialAssistant)) return;
	if (deliveryPhase === "commentary") {
		if (ctx.state.assistantStream?.projection) ctx.state.assistantStream.projection.directiveCodePrefix = void 0;
		const isResponsesCommentary = isResponsesApiAssistantMessage(partialAssistant);
		const hadResponsesCommentaryText = isResponsesCommentary && Boolean(ctx.state.deltaBuffer);
		if (isResponsesCommentary && chunk) {
			ctx.state.deltaBuffer += chunk;
			ctx.state.deltaBufferIsCommentary = true;
		}
		const commentaryText = isResponsesCommentary ? ctx.state.deltaBuffer : extractAssistantCommentaryText(streamAssistant);
		if (commentaryText && (chunk || !hadResponsesCommentaryText || evtType === "text_end")) ctx.emitAssistantStreamData({
			text: commentaryText,
			delta: "",
			replace: true,
			phase: "commentary",
			itemId: deliveryItemId
		}, { finalMessage: evtType === "text_end" });
		return;
	}
	if (isPhasePendingResponsesTextItem) return;
	const skipLiveStream = ctx.params.suppressLiveStreamOutput === true;
	const shouldUsePhaseAwareBlockReply = Boolean(deliveryPhase);
	const reprojectBlockReply = shouldUsePhaseAwareBlockReply && !ctx.params.enforceFinalTag && ctx.state.assistantStream?.projection?.kind !== "final" && ctx.blockChunker.consumedLength === 0;
	const finalText = evtType === "text_end";
	if (chunk) {
		ctx.state.deltaBuffer += chunk;
		ctx.state.deltaBufferIsCommentary = false;
	}
	if (skipLiveStream) return;
	ctx.emitReasoningStream(extractThinkingFromTaggedStream(ctx.state.deltaBuffer, ctx.state.thinkingTagStream, chunk));
	const wasThinking = ctx.state.partialBlockState.reasoningDepth > 0;
	let visibleDelta = "";
	let textIsAppend = false;
	let appendDelta = null;
	let previousText = ctx.state.assistantStream?.raw ?? "";
	const shouldReadPartialText = streamItemChanged || evtType === "text_end" && assistantRecord?.partial !== void 0 || shouldUsePhaseAwareBlockReply && (evtType === "text_end" || !chunk);
	const isTerminalSnapshot = evtType === "text_end" && shouldReadPartialText;
	let selectedAssistant = shouldUsePhaseAwareBlockReply || isResponsesTextEvent ? streamAssistant : partialAssistant;
	if (isTerminalSnapshot && selectedAssistant === partialAssistant && streamContentIndex !== void 0 && Array.isArray(partialAssistant.content) && streamContentIndex + 1 < partialAssistant.content.length) selectedAssistant = {
		...partialAssistant,
		content: partialAssistant.content.slice(0, streamContentIndex + 1)
	};
	const snapshot = isTerminalSnapshot ? extractAssistantStreamSnapshot(ctx, selectedAssistant) : void 0;
	let next = shouldReadPartialText ? (snapshot?.text ?? extractAssistantVisibleText(selectedAssistant)).trimEnd() : void 0;
	if (snapshot) {
		ctx.state.deltaBuffer = snapshot.rawText;
		ctx.state.thinkingTagStream = createThinkingTagStreamState();
		ctx.state.partialBlockState = snapshot.state;
		ctx.resetPartialReplyDirectives();
	}
	if (!next && evtType !== "text_end") next = void 0;
	const hasSnapshotText = next !== void 0;
	let nextRawStreamText = next ?? "";
	let projection;
	if (next === void 0 && deliveryPhase === "final_answer" && (reprojectBlockReply || chunk)) {
		visibleDelta = reprojectBlockReply ? ctx.state.deltaBuffer : ctx.params.enforceFinalTag ? ctx.stripBlockTags(chunk, ctx.state.partialBlockState, { final: finalText }) : chunk;
		next = visibleDelta;
		textIsAppend = true;
		if (reprojectBlockReply) ctx.resetPartialReplyDirectives();
	} else if (next === void 0 && deliveryPhase !== "final_answer") {
		const pendingTagFragment = ctx.state.partialBlockState.pendingTagFragment;
		const reasoningTags = scanReasoningTags(chunk, false);
		if (Boolean(pendingTagFragment) || reasoningTags.tags.length > 0 || reasoningTags.pendingStart !== void 0) {
			const recomputeState = createAssistantStreamBlockState();
			const recomputedRawText = ctx.stripBlockTags(ctx.state.deltaBuffer, recomputeState, { final: finalText });
			const isFullStreamReplacement = !recomputedRawText.startsWith(previousText);
			if (isFullStreamReplacement) ctx.resetPartialReplyDirectives();
			textIsAppend = !isFullStreamReplacement;
			next = recomputedRawText;
			visibleDelta = isFullStreamReplacement ? recomputedRawText : recomputedRawText.slice(previousText.length);
			nextRawStreamText = recomputedRawText;
			ctx.state.partialBlockState = recomputeState;
		} else {
			visibleDelta = chunk || evtType === "text_end" ? ctx.stripBlockTags(chunk, ctx.state.partialBlockState, { final: finalText }) : "";
			if (ctx.state.partialBlockState.pendingTagFragment) {
				visibleDelta = "";
				next = ctx.state.assistantStream?.text ?? "";
				nextRawStreamText = ctx.state.assistantStream?.raw ?? "";
			} else {
				next = visibleDelta;
				textIsAppend = true;
			}
		}
	} else if (!isTerminalSnapshot && next !== void 0 && (chunk || evtType === "text_end")) visibleDelta = ctx.stripBlockTags(chunk, ctx.state.partialBlockState, { final: finalText });
	if (next !== void 0) {
		const unchangedBlockAppend = textIsAppend && visibleDelta === chunk;
		if (!hasSnapshotText) {
			const kind = deliveryPhase !== "final_answer" ? "raw" : ctx.params.enforceFinalTag ? "delivery" : "final";
			const previousStream = reprojectBlockReply ? void 0 : ctx.state.assistantStream;
			projection = previousStream?.projection;
			if (!projection || projection.kind !== kind) {
				projection = {
					kind,
					projector: kind === "raw" ? createTextProjection([
						downgradedToolCallTextFilter(),
						toolCallXmlTextFilter({ stripFunctionCallsXmlPayloads: true }, true),
						trimTextFilter("both", { preserveCodeIndentation: true })
					]) : createAssistantVisibleStreamText(kind === "final" ? "final_answer" : void 0)
				};
				projection.projector.replace(previousStream?.raw ?? "");
			}
			previousText = projection.projector.text;
			if (!textIsAppend) projection.directiveCodePrefix = void 0;
			const projected = textIsAppend ? projection.projector.append(visibleDelta) : projection.projector.replace(nextRawStreamText);
			nextRawStreamText = projection.projector.source;
			next = projected.text;
			appendDelta = projected.delta;
			if (kind !== "raw" || next !== nextRawStreamText.trim()) visibleDelta = projected.delta ?? (previousText.startsWith(next) ? "" : next);
		}
		if (!suppressSourceReplyOutput) {
			if (!wasThinking && ctx.state.partialBlockState.reasoningDepth > 0) openReasoningStream(ctx);
			else if (wasThinking && ctx.state.partialBlockState.reasoningDepth === 0) emitReasoningEnd(ctx);
		}
		const parsedStreamDirectives = isTerminalSnapshot ? ctx.consumePartialReplyDirectives(next, { final: finalText }) : mergeReplyDirectiveResults(visibleDelta ? ctx.consumePartialReplyDirectives(visibleDelta) : null, evtType === "text_end" ? ctx.consumePartialReplyDirectives("", { final: finalText }) : null);
		const previousCleaned = ctx.state.assistantStream?.text ?? "";
		const { text: cleanedText, delta: replyDelta, replace, hasText, replyDirectives, audioDirectiveCount, directiveCodePrefix } = (projection?.kind === "raw" ? projection.replyResolver ??= createStreamingReplyResolver() : resolveStreamingReply)({
			evtType,
			next,
			previousText,
			previousCleaned,
			visibleDelta,
			appendDelta,
			parsedStreamDirectives,
			previousAudioDirectiveCount: ctx.state.lastAssistantAudioDirectiveCount,
			rawDirectiveSource: projection?.kind === "raw" ? nextRawStreamText : void 0,
			rawDirectiveDelta: projection?.kind === "raw" && unchangedBlockAppend ? chunk : void 0,
			directiveCodePrefix: projection?.kind === "raw" ? projection.directiveCodePrefix : void 0
		});
		if (projection?.kind === "raw") projection.directiveCodePrefix = directiveCodePrefix;
		recordPendingAssistantReplyDirectives(ctx.state, replyDirectives, {
			previous: ctx.state.lastAssistantAudioDirectiveCount,
			current: audioDirectiveCount
		});
		ctx.state.lastAssistantAudioDirectiveCount = audioDirectiveCount;
		const hasAudio = Boolean(replyDirectives?.audioAsVoice);
		const hasVisibleReply = hasText || hasAudio;
		const deltaText = hasVisibleReply ? replyDelta : "";
		let shouldEmit = (hasVisibleReply || replace) && (replace ? cleanedText !== previousCleaned || hasAudio : Boolean(deltaText || hasAudio));
		const plainAppend = evtType === "text_delta" && unchangedBlockAppend && !snapshot && !reprojectBlockReply && !replace && !ctx.params.enforceFinalTag && (priorBlockIndex === streamContentIndex || priorBlockIndex === void 0 && !priorBlockText) && next === nextRawStreamText.trim() && (previousText === previousCleaned && next === cleanedText || appendDelta !== null && replyDelta === appendDelta);
		if (ctx.params.onBlockReply && plainAppend) ctx.blockChunker.append(chunk);
		else if (ctx.params.onBlockReply) reconcileBlockReplySnapshot(ctx, extractAssistantStreamSnapshot(ctx, partialAssistant, {
			throughIndex: streamItemChanged ? blockSourceIndex : priorSourceIndex,
			observedText: streamItemChanged ? "" : priorBlockText,
			final: streamItemChanged ? false : priorBlockFinal
		}), extractAssistantStreamSnapshot(ctx, partialAssistant, {
			throughIndex: blockSourceIndex,
			...snapshot ? {} : { observedText: ctx.state.streamBlockText },
			final: finalText
		}));
		if (isTerminalSnapshot) ctx.state.streamBlockText = content;
		ctx.state.assistantStream = {
			raw: nextRawStreamText,
			text: cleanedText,
			projection
		};
		if (ctx.params.silentExpected || suppressDeterministicApprovalOutput || suppressSourceReplyOutput) shouldEmit = false;
		if (shouldEmit) {
			const currentSourcePartial = ctx.params.sourceReplyDeliveryMode !== "message_tool_only" ? resolveCurrentSourceMessagingToolPartial(ctx.state, {
				evtType,
				text: cleanedText,
				visibleDelta
			}) : {
				hold: false,
				text: cleanedText
			};
			const releaseHeldSnapshot = currentSourcePartial.text !== cleanedText;
			ctx.emitAssistantStreamData({
				text: currentSourcePartial.text,
				delta: releaseHeldSnapshot ? currentSourcePartial.text : deltaText,
				replace: releaseHeldSnapshot || replace || void 0,
				phase: deliveryPhase
			}, { emitPartialReply: !currentSourcePartial.hold });
		}
	}
	if (ctx.params.silentExpected || suppressDeterministicApprovalOutput || suppressSourceReplyOutput || ctx.state.blockReplyBreak !== "text_end") return;
	if (ctx.params.onBlockReply && ctx.blockChunking) ctx.blockChunker.drain({
		force: false,
		emit: ctx.emitBlockChunk
	});
	if (evtType === "text_end") {
		const assistantMessageIndex = ctx.state.assistantMessageIndex;
		const onFlushError = (err) => {
			ctx.log.debug(`text_end block reply flush failed: ${String(err)}`);
		};
		try {
			const pending = ctx.flushBlockReplyBuffer({
				assistantMessageIndex,
				final: finalText
			});
			if (pending) return pending.catch(onFlushError);
		} catch (err) {
			onFlushError(err);
		}
	}
}
//#endregion
//#region src/agents/tool-error-state.ts
/** Track the run's last tool failure until the same tool succeeds. */
function createToolErrorState() {
	let lastToolError;
	const terminalState = () => lastToolError ? { lastToolError } : {};
	return {
		read: terminalState,
		recordFailure(failure) {
			lastToolError = failure;
			return terminalState();
		},
		recordSuccess(toolName) {
			if (lastToolError && normalizeLowercaseStringOrEmpty(lastToolError.toolName) === normalizeLowercaseStringOrEmpty(toolName)) lastToolError = void 0;
			return terminalState();
		}
	};
}
//#endregion
//#region src/agents/tool-terminal-outcome.ts
function readTimeoutDiagnostic(result) {
	const details = readToolResultDetails(result);
	const timeoutMs = details?.timeoutMs;
	if (details?.timedOut !== true || typeof timeoutMs !== "number" || !Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) return;
	return {
		kind: "timeout",
		timeoutMs,
		...details.partial === true && Array.isArray(details.results) && details.results.length > 0 ? { partialResults: details.results.length } : {}
	};
}
/** Build one attempt-scoped facts-in/state-out terminal observer for every harness. */
function createToolTerminalObserver(runId) {
	const errors = createToolErrorState();
	return (observation) => {
		const effectReceipt = readToolEffectReceipt(observation.result);
		const trackedExecutionStarted = observation.toolCallId ? consumeTrackedToolExecutionStarted(observation.toolCallId, runId) : void 0;
		const trackedArguments = observation.toolCallId ? peekAdjustedParamsForToolCall(observation.toolCallId, runId) : void 0;
		const executionPrevented = observation.toolCallId ? peekPreExecutionBlockedToolCall(observation.toolCallId, runId) : false;
		const executionStarted = (trackedExecutionStarted ?? observation.executionStarted ?? true) && !executionPrevented && effectReceipt?.state !== "not_started";
		const executedArguments = asOptionalRecord(trackedArguments) ?? asOptionalRecord(observation.arguments);
		const mutation = observation.ownerMutation ? buildToolMutationState(observation.toolName, executedArguments, { ownerKey: observation.ownerMutation.ownerKey }) : observation.nativeMutation ?? buildToolMutationState(observation.toolName, executedArguments);
		const replaySafe = observation.replaySafe ?? mutation.replaySafe;
		const details = readToolResultDetails(observation.result);
		let lastToolError;
		if (!executionStarted && details?.status === "skipped" && details.deniedReason === "steering") lastToolError = errors.read().lastToolError;
		else if (observation.outcome === "failure") {
			const mutatingAction = executionStarted && mutation.mutatingAction;
			const terminalDiagnostic = observation.failure?.terminalDiagnostic ?? (executionStarted ? readTimeoutDiagnostic(observation.result) : void 0);
			const failure = {
				toolName: observation.toolName,
				...observation.meta ? { meta: observation.meta } : {},
				...observation.failure,
				...terminalDiagnostic ? { terminalDiagnostic } : {},
				executionStarted,
				mutatingAction
			};
			lastToolError = errors.recordFailure(failure).lastToolError;
		} else if (observation.toolName === "message" && projectPluginMessageDeliveryFact(observation.result)?.status === "suppressed") lastToolError = errors.read().lastToolError;
		else lastToolError = errors.recordSuccess(observation.toolName).lastToolError;
		return {
			...lastToolError ? { lastToolError } : {},
			executionStarted,
			...executedArguments ? { executedArguments } : {},
			sideEffectEvidence: executionStarted && !replaySafe,
			effectReceipt: effectReceipt ?? buildToolEffectReceipt({
				executionStarted,
				mutatingAction: mutation.mutatingAction,
				replaySafe,
				outcome: observation.outcome
			})
		};
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.tools.results.ts
const execApprovalReplyModuleLoader = createLazyImportLoader(() => import("./exec-approval-reply-DISLmJpv.mjs"));
const hookRunnerGlobalModuleLoader = createLazyImportLoader(() => import("./plugins/hook-runner-global.js"));
const fallbackToolTerminalObservers = /* @__PURE__ */ new WeakMap();
function resolveFallbackToolTerminalObserver(ctx) {
	const existing = fallbackToolTerminalObservers.get(ctx.state);
	if (existing) return existing;
	const created = createToolTerminalObserver(ctx.params.runId);
	fallbackToolTerminalObservers.set(ctx.state, created);
	return created;
}
function isMiddlewareToolResultError(result) {
	return asOptionalRecord(asOptionalObjectRecord(result)?.details)?.middlewareError === true;
}
const PROCESS_TERMINATION_REASONS = /* @__PURE__ */ new Set([
	"manual-cancel",
	"overall-timeout",
	"no-output-timeout",
	"spawn-error",
	"signal",
	"exit"
]);
function readSafeProcessSessionId(value) {
	const sessionId = readStringValue(value)?.trim();
	if (!sessionId || sessionId.length > 160 || hasTerminalControlCharacter(sessionId)) return;
	return sessionId;
}
function buildProcessTerminalDiagnostic(toolName, args, sanitizedResult) {
	if (toolName !== "process") return;
	const action = normalizeOptionalLowercaseString(args.action);
	if (action !== "poll" && action !== "log") return;
	const details = readToolResultDetails(sanitizedResult);
	const sessionId = readSafeProcessSessionId(details?.sessionId);
	if (!sessionId) return;
	const exitReason = normalizeOptionalLowercaseString(details?.exitReason);
	const hasCanonicalExitReason = PROCESS_TERMINATION_REASONS.has(exitReason ?? "");
	if (action === "log" && !hasCanonicalExitReason) return;
	const timeoutKind = exitReason === "overall-timeout" || exitReason === "no-output-timeout" ? exitReason : void 0;
	let reason;
	if (details?.timedOut === true || timeoutKind) reason = {
		kind: "timeout",
		...timeoutKind ? { timeoutKind } : {}
	};
	else if (typeof details?.exitSignal === "string" && details.exitSignal.trim().length > 0 && details.exitSignal.trim().length <= 32 || typeof details?.exitSignal === "number" && Number.isFinite(details.exitSignal)) {
		const signal = typeof details.exitSignal === "string" ? details.exitSignal.trim() : details.exitSignal;
		if (!hasTerminalControlCharacter(String(signal))) reason = {
			kind: "signal",
			signal
		};
	} else if (typeof details?.exitCode === "number" && Number.isSafeInteger(details.exitCode) && details.exitCode !== 0) reason = {
		kind: "exit",
		exitCode: details.exitCode
	};
	if (!reason) return;
	return {
		kind: "process",
		sessionId,
		reason
	};
}
function loadHookRunnerGlobal() {
	return hookRunnerGlobalModuleLoader.load();
}
function isCronAddAction(args) {
	return normalizeOptionalLowercaseString(asOptionalObjectRecord(args)?.action) === "add";
}
function applyCurrentMessageProvider(toolName, args, currentProvider) {
	if (toolName !== "message" || readStringValue(args.provider) || readStringValue(args.channel) || !currentProvider) return args;
	return {
		...args,
		provider: currentProvider
	};
}
function applyToolSendReceiptForExtraction(result, receiptResult) {
	const toolSend = readToolResultDetails(receiptResult)?.toolSend;
	if (toolSend === void 0) return result;
	return {
		...asOptionalRecord(result),
		details: {
			...readToolResultDetails(result),
			toolSend
		}
	};
}
function readExecToolDetails(result) {
	const details = readToolResultDetails(result);
	if (!details || typeof details.status !== "string") return null;
	return details;
}
function extractExecOutput(result) {
	const execDetails = readExecToolDetails(result);
	const output = execDetails && "aggregated" in execDetails ? execDetails.aggregated : extractToolResultText(result);
	return typeof output === "string" ? output : void 0;
}
function extractLiveExecOutput(result) {
	const output = extractExecOutput(result);
	return typeof output === "string" ? truncateLiveExecOutput(output) : void 0;
}
function isOpenClawExecutable(token) {
	return normalizeOptionalLowercaseString(token)?.split(/[\\/]/).at(-1) === "openclaw";
}
function isOpenClawPackageSpec(token) {
	const packageSpec = normalizeOptionalLowercaseString(token);
	return packageSpec?.startsWith("openclaw@") === true && packageSpec.length > 9;
}
function skipOpenClawPackageRunner(tokens, startIndex) {
	let commandIndex = startIndex;
	let acceptsPackageSpec = false;
	let runner = normalizeOptionalLowercaseString(tokens[commandIndex]);
	if (runner === "corepack" && normalizeOptionalLowercaseString(tokens[commandIndex + 1]) === "pnpm") {
		commandIndex += 1;
		runner = "pnpm";
	}
	if (runner === "pnpm") {
		const subcommand = normalizeOptionalLowercaseString(tokens[commandIndex + 1]);
		if (subcommand === "exec" || subcommand === "dlx") {
			commandIndex += 2;
			acceptsPackageSpec = subcommand === "dlx";
		} else commandIndex = startIndex;
	} else if (runner === "npx" || runner === "bunx") {
		commandIndex += 1;
		acceptsPackageSpec = true;
		while (true) {
			const option = normalizeOptionalLowercaseString(tokens[commandIndex]);
			if (option === "-y" || option === "--yes" || option === "--no-install" || option === "--bun" || option?.startsWith("--package=") || option?.startsWith("--yes=")) {
				commandIndex += 1;
				continue;
			}
			if (option === "-p" || option === "--package") {
				commandIndex += 2;
				continue;
			}
			break;
		}
	}
	if (tokens[commandIndex] === "--") commandIndex += 1;
	return {
		commandIndex,
		acceptsPackageSpec
	};
}
function isOpenClawCronAddShellCommand(args) {
	const record = asOptionalObjectRecord(args);
	const command = readStringValue(record?.command) ?? readStringValue(record?.cmd);
	if (!command || hasTopLevelShellControlOperator(command)) return false;
	const tokens = splitShellArgs(command);
	if (!tokens || tokens.length < 3) return false;
	let commandIndex = 0;
	if (normalizeOptionalLowercaseString(tokens[commandIndex]) === "env") commandIndex += 1;
	while (/^[A-Za-z_][A-Za-z0-9_]*=/u.test(tokens[commandIndex] ?? "")) commandIndex += 1;
	const packageRunner = skipOpenClawPackageRunner(tokens, commandIndex);
	commandIndex = packageRunner.commandIndex;
	let cliArgIndex = commandIndex + 1;
	for (let consumed = consumeRootOptionToken(tokens, cliArgIndex); consumed > 0; consumed = consumeRootOptionToken(tokens, cliArgIndex)) cliArgIndex += consumed;
	const action = normalizeOptionalLowercaseString(tokens[cliArgIndex + 1]);
	const actionArgs = tokens.slice(cliArgIndex + 2);
	return (isOpenClawExecutable(tokens[commandIndex]) || packageRunner.acceptsPackageSpec && isOpenClawPackageSpec(tokens[commandIndex])) && (normalizeOptionalLowercaseString(tokens[cliArgIndex]) === "cron" || normalizeOptionalLowercaseString(tokens[cliArgIndex]) === "automations") && (action === "add" || action === "create") && !actionArgs.some((token) => token === "-h" || token === "--help");
}
function didShellCronAddSucceed(args, result) {
	if (!isOpenClawCronAddShellCommand(args)) return false;
	const details = readExecToolDetails(result);
	return details?.status === "completed" && details.exitCode === 0;
}
function readApplyPatchSummary(result) {
	const details = readToolResultDetails(result);
	const summary = asOptionalRecord(details?.summary);
	if (!summary) return null;
	return {
		added: filterStringEntries(summary.added),
		modified: filterStringEntries(summary.modified),
		deleted: filterStringEntries(summary.deleted)
	};
}
function buildPatchSummaryText(summary) {
	const parts = [
		"added",
		"modified",
		"deleted"
	].flatMap((kind) => summary[kind].length > 0 ? [`${summary[kind].length} ${kind}`] : []);
	return parts.length > 0 ? parts.join(", ") : "no file changes recorded";
}
function readMessagingText(record) {
	for (const key of [
		"content",
		"message",
		"text",
		"body"
	]) {
		const value = readStringValue(record[key]);
		if (value) return value;
	}
}
function hasMessagingRichContent(record) {
	const payload = {
		presentation: record.presentation,
		interactive: record.interactive,
		channelData: record.channelData
	};
	try {
		parseJsonMessageParam(payload, "presentation");
		parseJsonMessageParam(payload, "interactive");
	} catch {
		return false;
	}
	return hasReplyPayloadContent(payload);
}
function queuePendingToolMedia(ctx, mediaReply, allowedMediaUrls, autoDeliveryMediaUrls) {
	const indexByUrl = new Map(ctx.state.pendingToolMediaUrls.map((url, index) => [url.trim(), index]));
	const attachments = ctx.state.pendingToolMediaAttachments ??= ctx.state.pendingToolMediaUrls.map(() => ({}));
	const attachmentsByUrl = new Map(mediaReply.mediaUrls.map((url, index) => [url.trim(), mediaReply.attachments?.[index]]));
	for (const mediaUrl of allowedMediaUrls) {
		const normalized = mediaUrl.trim();
		if (!normalized) continue;
		if (mediaReply.trustedLocalMedia) ctx.state.pendingToolMediaTrustByUrl.set(normalized, true);
		else if (!ctx.state.pendingToolMediaTrustByUrl.has(normalized)) ctx.state.pendingToolMediaTrustByUrl.set(normalized, false);
		if (autoDeliveryMediaUrls.has(normalized)) ctx.state.toolAutoDeliveryMediaUrls.add(normalized);
		else ctx.state.toolAutoDeliveryMediaUrls.delete(normalized);
		const attachment = attachmentsByUrl.get(normalized);
		const existingIndex = indexByUrl.get(normalized);
		if (existingIndex !== void 0) {
			if (attachment && Object.keys(attachments[existingIndex] ?? {}).length === 0) attachments[existingIndex] = attachment;
			continue;
		}
		indexByUrl.set(normalized, ctx.state.pendingToolMediaUrls.length);
		ctx.state.pendingToolMediaUrls.push(normalized);
		attachments.push(attachment ?? {});
	}
	if (mediaReply.audioAsVoice) ctx.state.pendingToolAudioAsVoice = true;
}
function readExecApprovalPendingDetails(result) {
	const outer = asOptionalObjectRecord(result);
	const details = asOptionalRecord(outer?.details) ?? outer;
	if (details?.status !== "approval-pending") return null;
	const approvalId = readStringValue(details.approvalId) ?? "";
	const approvalSlug = readStringValue(details.approvalSlug) ?? "";
	const command = typeof details.command === "string" ? details.command : "";
	const host = details.host === "node" ? "node" : details.host === "gateway" ? "gateway" : null;
	if (!approvalId || !approvalSlug || !command || !host) return null;
	return {
		approvalId,
		approvalSlug,
		expiresAtMs: typeof details.expiresAtMs === "number" ? details.expiresAtMs : void 0,
		allowedDecisions: Array.isArray(details.allowedDecisions) ? details.allowedDecisions.filter((decision) => decision === "allow-once" || decision === "allow-always" || decision === "deny") : void 0,
		host,
		command,
		cwd: readStringValue(details.cwd),
		nodeId: readStringValue(details.nodeId),
		warningText: readStringValue(details.warningText)
	};
}
function readExecApprovalUnavailableDetails(result) {
	const outer = asOptionalObjectRecord(result);
	const details = asOptionalRecord(outer?.details) ?? outer;
	if (details?.status !== "approval-unavailable") return null;
	const reason = details.reason === "initiating-platform-disabled" || details.reason === "initiating-platform-unsupported" || details.reason === "no-approval-route" ? details.reason : null;
	if (!reason) return null;
	return {
		reason,
		warningText: readStringValue(details.warningText),
		channel: readStringValue(details.channel),
		channelLabel: readStringValue(details.channelLabel),
		accountId: readStringValue(details.accountId),
		sentApproverDms: details.sentApproverDms === true,
		host: details.host === "gateway" || details.host === "node" ? details.host : void 0,
		nodeId: readStringValue(details.nodeId)
	};
}
async function emitToolResultOutput(params) {
	const { ctx, toolName, rawToolName, meta, isToolError, result, sanitizedResult } = params;
	const details = asOptionalRecord(asOptionalObjectRecord(result)?.details);
	const hasStructuredMedia = asOptionalRecord(details?.media) !== void 0;
	const approvalPending = readExecApprovalPendingDetails(result);
	const approvalUnavailable = !isToolError && approvalPending ? null : readExecApprovalUnavailableDetails(result);
	if (!isToolError && (approvalPending || approvalUnavailable)) {
		if (!ctx.params.onToolResult) return;
		if (approvalPending) ctx.state.deterministicApprovalPromptPending = true;
		try {
			const replies = await execApprovalReplyModuleLoader.load();
			if (approvalPending) {
				await ctx.params.onToolResult(replies.buildTypedExecApprovalPendingReplyPayload(approvalPending));
				ctx.state.deterministicApprovalPromptSent = true;
			} else if (approvalUnavailable) await ctx.params.onToolResult?.(replies.buildExecApprovalUnavailableReplyPayload(approvalUnavailable));
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			ctx.log.warn(`failed to deliver exec approval prompt: ${message}`);
			const approvalMeta = meta ? `${meta} · approval prompt delivery` : "approval prompt delivery";
			const terminal = (ctx.params.observeToolTerminal ?? resolveFallbackToolTerminalObserver(ctx))({
				toolName,
				meta: approvalMeta,
				executionStarted: false,
				outcome: "failure",
				failure: { error: `Approval prompt delivery failed: ${message}` }
			});
			ctx.state.lastToolError = terminal.lastToolError;
		} finally {
			if (approvalPending) ctx.state.deterministicApprovalPromptPending = false;
		}
		return;
	}
	const mediaReply = isToolError ? void 0 : extractToolResultMediaArtifact(result);
	const mediaUrls = mediaReply ? filterToolResultMediaUrls(rawToolName, mediaReply.mediaUrls, result, ctx.trustedLocalMediaToolNames) : [];
	if (!(toolName === "tts" && rawToolName.trim() === "tts" && ctx.builtinToolNames?.has("tts") === true && !isToolError && hasStructuredMedia && mediaUrls.length > 0) && ctx.shouldEmitToolOutput()) {
		const outputText = extractToolResultText(sanitizedResult);
		if (outputText) ctx.emitToolOutput(rawToolName, meta, outputText, hasStructuredMedia ? void 0 : result);
		if (!hasStructuredMedia) return;
	}
	if (isToolError || !mediaReply || mediaUrls.length === 0) return;
	queuePendingToolMedia(ctx, mediaReply, mediaUrls, new Set(mediaReply.trustedLocalMedia === true ? getCoreTtsToolResultMediaUrls(result) : []));
}
//#endregion
//#region src/agents/mcp-connect-action.ts
function readMcpConnectAction(result) {
	const connect = asOptionalRecord(asOptionalRecord(asOptionalRecord(result)?.details)?.mcpConnect);
	const serverName = typeof connect?.serverName === "string" ? connect.serverName.trim() : "";
	const authorizationUrl = typeof connect?.authorizationUrl === "string" ? connect.authorizationUrl.trim() : "";
	const parsed = URL.parse(authorizationUrl);
	if (!serverName || parsed?.protocol !== "http:" && parsed?.protocol !== "https:") return;
	return {
		serverName,
		authorizationUrl
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.tools.completion.ts
/** Handles a tool-execution result and commits replay, media, hook, and error state. */
async function handleToolExecutionEnd(ctx, evt, readResult) {
	const toolName = normalizeToolPolicyName(evt.toolName);
	const toolCallId = evt.toolCallId;
	ctx.state.liveEditDiffStateById.delete(toolCallId);
	if (toolName === "ask_user") cancelAskUserPromptDelivery(toolCallId, ctx.params.sessionKey, ctx.params.runId);
	const runId = ctx.params.runId;
	const result = evt.result;
	const toolSendReceiptResult = ctx.consumeToolSendReceipt?.(toolCallId);
	const observerIsError = evt.isError || isToolResultError(result);
	const sanitizedResult = readResult();
	const approvalUnavailable = isExecToolName(toolName) && readExecToolDetails(sanitizedResult)?.status === "approval-unavailable";
	const isToolError = observerIsError && !approvalUnavailable;
	if (!isToolError) {
		const channelView = readMcpAppChannelView(result);
		if (channelView) ctx.state.latestMcpAppChannelView = channelView;
		const connectAction = readMcpConnectAction(result);
		if (connectAction) ctx.state.latestMcpConnectAction = connectAction;
	}
	try {
		ctx.params.onAgentToolResult?.({
			toolName,
			result: sanitizedResult,
			isError: observerIsError
		});
	} catch (error) {
		ctx.log.warn(`onAgentToolResult handler failed: tool=${toolName} error=${String(error)}`);
	}
	const eventResult = isExecToolName(toolName) ? capLiveExecResult(sanitizedResult) : sanitizedResult;
	const toolStartKey = buildToolStartKey(runId, toolCallId);
	const startData = toolStartData.get(toolStartKey);
	toolStartData.delete(toolStartKey);
	ctx.state.execLiveUpdateStateById?.delete(toolCallId);
	const initialCallSummary = ctx.state.toolMetaById.get(toolCallId);
	const initialArgs = asRecord(startData?.args);
	const adjustedArgs = consumeAdjustedParamsForToolCall(toolCallId, runId);
	const trackedExecutionStarted = consumeTrackedToolExecutionStarted(toolCallId, runId);
	const executionPrevented = consumePreExecutionBlockedToolCall(toolCallId, runId);
	const structuredReplaySafe = consumeStructuredReplaySafeToolCall(toolCallId, runId);
	const startArgs = asOptionalObjectRecord(adjustedArgs) ?? initialArgs;
	const explicitHideFromChannelProgress = evt.hideFromChannelProgress === true || startData?.hideFromChannelProgress === true;
	const callSummary = buildToolCallSummary(toolName, startArgs, initialCallSummary?.meta, initialCallSummary?.instanceReplaySafe === true, initialCallSummary?.ownerKey, structuredReplaySafe);
	const executionStarted = (trackedExecutionStarted ?? evt.executionStarted ?? true) && !executionPrevented;
	const meta = callSummary.meta;
	const asyncStarted = !isToolError && isAsyncStartedToolResult(sanitizedResult);
	const asyncTaskIds = asyncStarted ? readAsyncStartedTaskIds(sanitizedResult) : {};
	const codeModeSuspended = !isToolError && ctx.params.codeModeExecToolNames?.has(toolName) === true && readToolResultDetails(sanitizedResult)?.status === "waiting";
	const resultRecord = asOptionalObjectRecord(result);
	const terminate = resultRecord !== void 0 && "terminate" in resultRecord && resultRecord.terminate === true;
	const terminalMeta = {
		toolName,
		toolCallId,
		...startData?.parentToolCallId ? { parentToolCallId: startData.parentToolCallId } : {},
		meta,
		replaySafe: callSummary.replaySafe,
		isError: observerIsError,
		...terminate ? { terminate: true } : {},
		...asyncStarted ? {
			asyncStarted: true,
			...asyncTaskIds
		} : {},
		...codeModeSuspended ? { codeModeSuspended: true } : {}
	};
	ctx.state.toolMetas.push(terminalMeta);
	const acceptedSessionSpawn = toolName === "sessions_spawn" && !isToolError ? normalizeAcceptedSessionSpawnResult(sanitizedResult) : null;
	if (acceptedSessionSpawn) ctx.state.acceptedSessionSpawns.push(acceptedSessionSpawn);
	ctx.state.toolMetaById.delete(toolCallId);
	ctx.state.toolSummaryById.delete(toolCallId);
	const errorMessage = isToolError ? extractToolErrorMessage(sanitizedResult) : void 0;
	const errorCode = isToolError ? extractToolErrorCode(sanitizedResult) : void 0;
	const terminalDiagnostic = isToolError ? buildProcessTerminalDiagnostic(toolName, startArgs, sanitizedResult) : void 0;
	const terminalErrorMessage = terminalDiagnostic && errorMessage && hasTerminalControlCharacter(errorMessage) ? void 0 : errorMessage;
	const validationErrorSummary = isToolError && evt.executionStarted === false && evt.errorKind === "argument-validation" ? createToolValidationErrorSummary(toolName) : void 0;
	const terminal = (ctx.params.observeToolTerminal ?? resolveFallbackToolTerminalObserver(ctx))({
		toolCallId,
		toolName,
		arguments: startArgs,
		result,
		...meta ? { meta } : {},
		executionStarted,
		replaySafe: callSummary.replaySafe,
		outcome: isToolError ? "failure" : "success",
		...callSummary.ownerKey ? { ownerMutation: { ownerKey: callSummary.ownerKey } } : {},
		...isToolError ? { failure: {
			...errorCode ? { errorCode } : {},
			...terminalErrorMessage ? { error: terminalErrorMessage } : {},
			...terminalDiagnostic ? { terminalDiagnostic } : {},
			...validationErrorSummary ? { validationErrorSummary } : {},
			timedOut: isToolResultTimedOut(sanitizedResult) || void 0,
			middlewareError: isMiddlewareToolResultError(sanitizedResult) || void 0
		} } : {}
	});
	ctx.state.lastToolError = terminal.lastToolError;
	const terminalErrorStatus = terminal.executionStarted ? "failed" : "blocked";
	const toolErrorSummary = ctx.state.lastToolError ? summarizeToolValidationError(ctx.state.lastToolError) : void 0;
	if (asyncStarted) ctx.state.hadDeterministicSideEffect = true;
	if (terminal.sideEffectEvidence || acceptedSessionSpawn || asyncStarted) ctx.state.replayState = mergeEmbeddedRunReplayState(ctx.state.replayState, {
		replayInvalid: true,
		hadPotentialSideEffects: true
	});
	const messagingArgs = applyCurrentMessageProvider(toolName, startArgs, ctx.params.messageChannel);
	const isMessagingInvocation = isMessagingTool(toolName);
	const isMessagingSend = isMessagingInvocation && isMessagingToolSendAction(toolName, startArgs);
	const hasMessagingTargetEvidence = isMessagingInvocation && isMessagingToolTargetEvidenceAction(toolName, startArgs);
	const messageDelivery = readEmbeddedMessageDeliveryFact(readToolResultDetails(toolSendReceiptResult)?.messageDelivery);
	const didDeliverMessagingResult = isMessagingInvocation && (messageDelivery ? messageDelivery.status === "settled" && (!isToolError || messageDelivery.partialDelivery) : isPluginNativeMessagingTool(toolName) && isDeliveredMessagingToolResult({
		toolName,
		args: startArgs,
		result,
		hookResult: toolSendReceiptResult,
		isError: isToolError
	}));
	const messageText = isMessagingSend ? readMessagingText(startArgs) : void 0;
	const argumentMediaUrls = isMessagingSend ? collectMessagingMediaUrlsFromRecord(startArgs) : [];
	const hasRichContent = isMessagingSend && hasMessagingRichContent(startArgs);
	const messageTarget = hasMessagingTargetEvidence ? extractMessagingToolSend(toolName, messagingArgs, {
		config: ctx.params.config,
		currentChannelId: ctx.params.currentChannelId,
		currentMessagingTarget: ctx.params.currentMessagingTarget,
		currentThreadId: ctx.params.currentThreadId,
		currentMessageId: ctx.params.currentMessageId,
		replyToMode: ctx.params.replyToMode,
		hasRepliedRef: startData?.hasRepliedRef
	}) : void 0;
	const committedMediaUrls = didDeliverMessagingResult && isMessagingSend ? [...argumentMediaUrls, ...collectMessagingMediaUrlsFromToolResult(result)] : [];
	const extractionResult = applyToolSendReceiptForExtraction(result, toolSendReceiptResult);
	const confirmedMessageTarget = messageTarget && extractMessagingToolSendResult(messageTarget, extractionResult);
	const deliveredMessageToolSourceReply = didDeliverMessagingResult && isDeliveredMessageToolOnlySourceReplyResult({
		sourceReplyDeliveryMode: ctx.params.sourceReplyDeliveryMode,
		toolName,
		args: startArgs,
		result,
		hookResult: toolSendReceiptResult,
		isError: isToolError,
		allowExplicitSourceRoute: isDeliveredMessagingToolSendToCurrentSource({
			send: confirmedMessageTarget,
			config: ctx.params.config,
			currentProvider: ctx.params.messageChannel,
			currentAccountId: ctx.params.currentAccountId,
			currentChannelId: ctx.params.currentChannelId,
			currentMessagingTarget: ctx.params.currentMessagingTarget,
			currentThreadId: ctx.params.currentThreadId,
			sessionKey: ctx.params.sessionKey,
			deliveredPayload: extractionResult
		}),
		deliveryConfirmed: didDeliverMessagingResult
	});
	const deliveredCurrentSourceReply = deliveredMessageToolSourceReply || isDeliveredCoreCurrentChannelWidgetResult({
		coreBuiltinToolNames: ctx.params.coreBuiltinToolNames,
		sourceReplyDeliveryMode: ctx.params.sourceReplyDeliveryMode,
		toolName,
		result,
		isToolError
	});
	const sourceReplyFinal = deliveredMessageToolSourceReply || messageDelivery?.sourceReplyDelivered ? resolveMessageToolSourceReplyFinal(startArgs) : void 0;
	ctx.state.sourceReplyDelivered ||= messageDelivery?.sourceReplyDelivered;
	if (sourceReplyFinal !== false && (messageDelivery?.sourceReplyDelivered || deliveredCurrentSourceReply)) ctx.state.sourceReplyDeliveryState = "delivered";
	if (didDeliverMessagingResult && messageText) {
		ctx.state.messagingToolSentTexts.push(messageText);
		ctx.state.messagingToolSentTextsNormalized.push(normalizeTextForComparison(messageText));
		ctx.log.debug(`Committed messaging text: tool=${toolName} len=${messageText.length}`);
		ctx.trimMessagingToolSent();
	}
	if (didDeliverMessagingResult && confirmedMessageTarget) {
		ctx.state.messagingToolSentTargets.push({
			...confirmedMessageTarget,
			...messageText ? { text: messageText } : {},
			...committedMediaUrls.length > 0 ? { mediaUrls: committedMediaUrls.slice() } : {},
			...hasRichContent ? { hasRichContent: true } : {},
			...sourceReplyFinal !== void 0 ? { sourceReplyFinal } : {}
		});
		ctx.trimMessagingToolSent();
	}
	if (deliveredCurrentSourceReply) {
		ctx.state.messageToolOnlySourceReplyDelivered = true;
		if (deliveredMessageToolSourceReply) {
			const sourceReplyText = readMessageToolSourceReplyText(startArgs);
			const normalizedSourceReplyText = sourceReplyText ? normalizeTextForComparison(sourceReplyText) : "";
			if (normalizedSourceReplyText) {
				ctx.state.currentSourceMessagingToolSentTextsNormalized.push(normalizedSourceReplyText);
				ctx.trimMessagingToolSent();
			}
		}
		ctx.params.onDeliveredMessageToolOnlySourceReply?.();
	}
	if (didDeliverMessagingResult && isMessagingSend) {
		if (committedMediaUrls.length > 0) {
			ctx.state.messagingToolSentMediaUrls.push(...committedMediaUrls);
			ctx.trimMessagingToolSent();
		}
		const sourceReplyPayload = extractMessagingToolSourceReplyPayload(result);
		if (sourceReplyPayload) {
			ctx.state.messagingToolSourceReplyPayloads.push({
				...sourceReplyPayload,
				...sourceReplyFinal !== void 0 ? { sourceReplyFinal } : {}
			});
			ctx.trimMessagingToolSent();
		}
	}
	ctx.state.turnToolsOnlySourceProgress = (ctx.state.turnToolsOnlySourceProgress ?? true) && sourceReplyFinal === false && isMessagingSend && !isToolError && !messageDelivery?.partialDelivery;
	ctx.state.lastToolTurnOnlySourceProgress = ctx.state.turnToolsOnlySourceProgress;
	if (!isToolError && (isAutomationsToolName(toolName) && isCronAddAction(startArgs) || isExecToolName(toolName) && didShellCronAddSucceed(startArgs, result))) ctx.state.successfulCronAdds += 1;
	if (!isToolError && toolName === "heartbeat_respond") {
		const response = normalizeHeartbeatToolResponse(resultRecord?.details);
		if (response) {
			const isFirstHeartbeatResponse = ctx.state.heartbeatToolResponse === void 0;
			ctx.state.heartbeatToolResponse = response;
			if (isFirstHeartbeatResponse) runBestEffortCallback({
				label: "heartbeat tool response",
				log: ctx.log,
				callback: () => ctx.params.onHeartbeatToolResponse?.(response)
			});
		}
	}
	const planUpdate = !isToolError && toolName === "progress_card" ? projectProgressCardChannelUpdate(startArgs) : void 0;
	if (planUpdate) {
		const planEvent = {
			stream: "plan",
			data: {
				phase: "update",
				title: "Plan updated",
				source: "openclaw",
				...planUpdate
			}
		};
		emitAgentEvent({
			runId: ctx.params.runId,
			...planEvent
		});
		emitAgentEventCallbackBestEffort(ctx, planEvent);
	}
	const endedAt = Date.now();
	const execDetails = readExecToolDetails(sanitizedResult);
	const itemData = {
		...projectAgentToolActivity({
			toolCallId,
			name: toolName,
			phase: "result",
			args: startArgs,
			meta,
			result: sanitizedResult,
			status: isToolError ? terminalErrorStatus : "completed",
			hideFromChannelProgress: explicitHideFromChannelProgress
		}),
		startedAt: startData?.startTime,
		endedAt,
		...errorMessage ? { error: errorMessage } : {}
	};
	const hideFromChannelProgress = explicitHideFromChannelProgress;
	terminalMeta.activity = itemData;
	const createResultData = () => ({
		phase: "result",
		name: toolName,
		toolCallId,
		...startData?.parentToolCallId ? { parentToolCallId: startData.parentToolCallId } : {},
		meta,
		isError: isToolError,
		commandBearing: callSummary.commandBearing,
		...toolErrorSummary ? { toolErrorSummary } : {},
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	});
	emitAgentEvent({
		runId: ctx.params.runId,
		stream: "tool",
		data: {
			...createResultData(),
			result: eventResult
		}
	});
	emitTrackedItemEvent(ctx, itemData);
	emitAgentEventCallbackBestEffort(ctx, {
		stream: "tool",
		data: createResultData()
	});
	if (isExecToolName(toolName)) {
		const commandItemId = buildCommandItemId(toolCallId);
		if (execDetails?.status === "approval-pending" || execDetails?.status === "approval-unavailable") {
			const approvalStatus = execDetails.status === "approval-pending" ? "pending" : "unavailable";
			emitToolActivityEvent(ctx, {
				stream: "approval",
				data: {
					phase: "requested",
					kind: "exec",
					status: approvalStatus,
					title: approvalStatus === "pending" ? "Command approval requested" : "Command approval unavailable",
					itemId: commandItemId,
					toolCallId,
					...execDetails.status === "approval-pending" ? {
						approvalId: execDetails.approvalId,
						approvalSlug: execDetails.approvalSlug
					} : {},
					command: execDetails.command,
					host: execDetails.host,
					...execDetails.status === "approval-unavailable" ? { reason: execDetails.reason } : {},
					message: execDetails.warningText
				}
			});
		} else {
			const output = extractLiveExecOutput(eventResult);
			const rawOutput = extractExecOutput(sanitizedResult);
			const commandStatus = execDetails?.status === "failed" || isToolError ? terminalErrorStatus : "completed";
			emitToolActivityEvent(ctx, {
				stream: "command_output",
				data: {
					itemId: commandItemId,
					phase: "end",
					title: buildCommandItemTitle(toolName, meta),
					toolCallId,
					name: toolName,
					...output ? { output } : {},
					status: commandStatus,
					...execDetails && "exitCode" in execDetails ? { exitCode: execDetails.exitCode } : {},
					...execDetails && "durationMs" in execDetails && typeof execDetails.durationMs === "number" && Number.isFinite(execDetails.durationMs) && execDetails.durationMs >= 0 ? { durationMs: execDetails.durationMs } : {},
					...execDetails && "cwd" in execDetails && typeof execDetails.cwd === "string" ? { cwd: execDetails.cwd } : {}
				}
			});
			if (typeof rawOutput === "string") {
				const parsedApprovalResult = parseExecApprovalResultText(rawOutput);
				if (parsedApprovalResult.kind === "denied") emitToolActivityEvent(ctx, {
					stream: "approval",
					data: {
						phase: "resolved",
						kind: "exec",
						status: normalizeOptionalLowercaseString(parsedApprovalResult.metadata)?.includes("approval-request-failed") ? "failed" : "denied",
						title: "Command approval resolved",
						itemId: commandItemId,
						toolCallId,
						message: parsedApprovalResult.body || parsedApprovalResult.raw
					}
				});
			}
		}
	}
	if (resolveFileMutationToolName(toolName) === "apply_patch") {
		const patchSummary = readApplyPatchSummary(sanitizedResult);
		const patchItemId = `patch:${toolCallId}`;
		if (patchSummary) emitToolActivityEvent(ctx, {
			stream: "patch",
			data: {
				itemId: patchItemId,
				phase: "end",
				title: meta ? `patch ${meta}` : "apply patch",
				toolCallId,
				name: toolName,
				added: patchSummary.added,
				modified: patchSummary.modified,
				deleted: patchSummary.deleted,
				summary: buildPatchSummaryText(patchSummary)
			}
		});
	}
	ctx.log.debug(`embedded run tool end: runId=${ctx.params.runId} tool=${toolName} toolCallId=${toolCallId}`);
	if (!planUpdate) await emitToolResultOutput({
		ctx,
		toolName,
		rawToolName: evt.toolName,
		meta,
		isToolError,
		result,
		sanitizedResult
	});
	await Promise.resolve(ctx.params.onToolStreamBoundary?.()).catch((error) => {
		ctx.log.debug(`embedded run tool stream boundary callback failed: ${String(error)}`);
	});
	const hookRunnerAfter = ctx.hookRunner ?? (await loadHookRunnerGlobal()).getGlobalHookRunner();
	if (hookRunnerAfter?.hasHooks("after_tool_call")) {
		const durationMs = startData?.startTime != null ? Date.now() - startData.startTime : void 0;
		const hookEvent = {
			toolName,
			params: startArgs,
			runId,
			toolCallId,
			result: sanitizedResult,
			error: isToolError ? extractToolErrorMessage(sanitizedResult) : void 0,
			durationMs
		};
		hookRunnerAfter.runAfterToolCall(hookEvent, {
			toolName,
			agentId: ctx.params.agentId,
			sessionKey: ctx.params.sessionKey,
			sessionId: ctx.params.sessionId,
			runId,
			toolCallId
		}).catch((err) => {
			ctx.log.warn(`after_tool_call hook failed: tool=${toolName} error=${String(err)}`);
		});
	}
	terminal.executedArguments ??= startArgs;
	return Object.assign(terminal, { isError: observerIsError });
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.tools.progress.ts
const LIVE_EXEC_UPDATE_MIN_INTERVAL_MS = 250;
function readChannelToolProgress(result) {
	const progress = asOptionalRecord(asOptionalObjectRecord(result)?.progress);
	if (progress?.visibility !== "channel" || progress.privacy !== "public") return;
	const text = readStringValue(progress.text)?.trim();
	return text ? truncateLiveExecOutput(text) : void 0;
}
function prepareLiveExecUpdate(ctx, toolCallId, partialResult, itemMetadata) {
	const now = Date.now();
	const state = ctx.state.execLiveUpdateStateById ??= /* @__PURE__ */ new Map();
	const previous = state.get(toolCallId);
	if (previous && now - previous.lastEmittedAtMs < LIVE_EXEC_UPDATE_MIN_INTERVAL_MS) {
		const emitItems = previous.itemMetadata.name !== itemMetadata.name || previous.itemMetadata.meta !== itemMetadata.meta || previous.itemMetadata.commandBearing !== itemMetadata.commandBearing || previous.itemMetadata.hideFromChannelProgress !== itemMetadata.hideFromChannelProgress;
		if (emitItems) previous.itemMetadata = itemMetadata;
		return { emitItems };
	}
	const result = capLiveExecResult(sanitizeToolResult(partialResult));
	state.set(toolCallId, {
		lastEmittedAtMs: Date.now(),
		itemMetadata
	});
	return {
		update: { result },
		emitItems: true
	};
}
/** Handles partial tool output and emits throttled live UI updates. */
function handleToolExecutionUpdate(ctx, evt) {
	const toolName = normalizeToolPolicyName(evt.toolName);
	const toolCallId = evt.toolCallId;
	const startData = toolStartData.get(buildToolStartKey(ctx.params.runId, toolCallId));
	const parentToolCallId = startData?.parentToolCallId;
	const args = peekAdjustedParamsForToolCall(toolCallId, ctx.params.runId) ?? startData?.args;
	if (startData && evt.hideFromChannelProgress === true) startData.hideFromChannelProgress = true;
	const explicitHideFromChannelProgress = evt.hideFromChannelProgress === true || startData?.hideFromChannelProgress === true;
	const partial = evt.partialResult;
	const isExecTool = isExecToolName(toolName);
	const toolMeta = ctx.state.toolMetaById.get(toolCallId);
	const execProgress = isExecTool ? prepareLiveExecUpdate(ctx, toolCallId, partial, {
		name: toolName,
		meta: toolMeta?.meta,
		commandBearing: toolMeta?.commandBearing,
		hideFromChannelProgress: explicitHideFromChannelProgress
	}) : void 0;
	const execUpdate = execProgress?.update;
	const liveResult = isExecTool ? execUpdate?.result : sanitizeToolResult(partial);
	const toolProgress = isExecTool ? void 0 : readChannelToolProgress(liveResult);
	const itemData = {
		...projectAgentToolActivity({
			toolCallId,
			name: toolName,
			phase: "update",
			args,
			meta: toolMeta?.meta,
			hideFromChannelProgress: explicitHideFromChannelProgress
		}),
		commandBearing: toolMeta?.commandBearing,
		...toolProgress ? {
			progressText: toolProgress,
			meta: void 0
		} : {}
	};
	const updateData = (includeResult) => ({
		phase: "update",
		name: toolName,
		toolCallId,
		...parentToolCallId ? { parentToolCallId } : {},
		...includeResult ? { partialResult: liveResult } : {},
		...explicitHideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	});
	const emitDetailedLiveUpdate = !toolProgress && (!isExecTool || execUpdate !== void 0);
	if (emitDetailedLiveUpdate) emitAgentEvent({
		runId: ctx.params.runId,
		stream: "tool",
		data: updateData(true)
	});
	emitTrackedItemEvent(ctx, itemData, execProgress?.emitItems);
	if (!toolProgress) emitAgentEventCallbackBestEffort(ctx, {
		stream: "tool",
		data: updateData(false)
	});
	if (isExecTool) {
		const output = extractLiveExecOutput(liveResult);
		if (emitDetailedLiveUpdate && output) emitToolActivityEvent(ctx, {
			stream: "command_output",
			data: {
				itemId: buildCommandItemId(toolCallId),
				phase: "delta",
				title: buildCommandItemTitle(toolName, toolMeta?.meta),
				toolCallId,
				name: toolName,
				output,
				status: "running"
			}
		});
	}
}
//#endregion
//#region src/agents/embedded-agent-subscribe.trajectory.ts
function recordEmbeddedToolTrajectoryEvent(ctx, event, readResult) {
	const recorder = ctx.params.trajectoryRecorder;
	if (!recorder) return;
	try {
		if (event.type === "tool_execution_start") recorder.recordEvent("tool.call", {
			toolCallId: event.toolCallId,
			name: normalizeToolPolicyName(event.toolName),
			args: event.args
		});
		else if (event.type === "tool_execution_end") {
			const name = normalizeToolPolicyName(event.toolName);
			const result = readResult();
			recorder.recordEvent("tool.result", {
				toolCallId: event.toolCallId,
				name,
				success: !(event.isError || isToolResultError(event.result)),
				result: isExecToolName(name) ? capLiveExecResult(result) : result
			});
		}
	} catch (error) {
		ctx.log.debug(`tool trajectory capture failed: ${String(error)}`);
	}
}
//#endregion
//#region src/agents/embedded-agent-subscribe.handlers.ts
/**
* Dispatches serialized embedded-agent subscription events to specific handlers.
*/
/** Create the serialized event dispatcher for subscribed embedded-agent sessions. */
function createEmbeddedAgentSessionEventHandler(ctx) {
	let assistantSource;
	const scheduleEvent = (evt, handler) => {
		const onError = (err) => {
			ctx.log.debug(`${evt.type} handler failed: ${String(err)}`);
		};
		const run = () => {
			try {
				if (evt.type !== "message_update") ctx.flushAssistantStream();
				return handler();
			} catch (err) {
				onError(err);
				return;
			}
		};
		const result = ctx.state.pendingEventChain ? ctx.state.pendingEventChain.then(run) : run();
		if (!isPromiseLike(result)) return;
		const task = Promise.resolve(result).then(() => {}, onError).finally(() => {
			if (ctx.state.pendingEventChain === task) ctx.state.pendingEventChain = null;
		});
		ctx.state.pendingEventChain = task;
		return task;
	};
	return (evt) => {
		if ((evt.type === "message_start" || evt.type === "message_update" || evt.type === "message_end") && evt.message.role === "assistant" && !isSubscribeTranscriptOnlyOpenClawAssistantMessage(evt.message)) {
			if (evt.type === "message_start" || !assistantSource) assistantSource = {};
			bindAgentAssistantSource(evt.message, assistantSource);
		}
		ctx.captureModelEvent(evt);
		if (evt.type === "message_end" && ctx.params.sessionId && !ctx.state.unsubscribed && (evt.message.role === "user" || evt.message.role === "toolResult" || evt.message.role === "assistant" && !isSubscribeTranscriptOnlyOpenClawAssistantMessage(evt.message))) recordEmbeddedSessionForkMessage(ctx.params.sessionId, ctx.params.runId, evt.message);
		const readResult = evt.type === "tool_execution_end" ? prepareToolResult(evt.result) : void 0;
		recordEmbeddedToolTrajectoryEvent(ctx, evt, readResult);
		switch (evt.type) {
			case "message_start":
				scheduleEvent(evt, () => handleMessageStart(ctx, evt));
				return;
			case "message_update":
				scheduleEvent(evt, () => handleMessageUpdate(ctx, evt));
				return;
			case "message_end":
				scheduleEvent(evt, () => handleMessageEnd(ctx, evt));
				return;
			case "turn_start":
				scheduleEvent(evt, () => {
					ctx.state.turnToolsOnlySourceProgress = void 0;
				});
				return;
			case "turn_end":
				scheduleEvent(evt, () => ctx.noteLastAssistant(evt.message));
				return;
			case "tool_execution_start":
				scheduleEvent(evt, () => handleToolExecutionStart(ctx, evt));
				return;
			case "tool_execution_update":
				scheduleEvent(evt, () => handleToolExecutionUpdate(ctx, evt));
				return;
			case "tool_execution_end":
				scheduleEvent(evt, () => handleToolExecutionEnd(ctx, evt, readResult));
				return;
			case "agent_start":
				scheduleEvent(evt, () => handleAgentStart(ctx));
				return;
			case "compaction_start":
				scheduleEvent(evt, () => handleCompactionStart(ctx, evt));
				return;
			case "compaction_end":
				scheduleEvent(evt, () => handleCompactionEnd(ctx, evt));
				return;
			case "agent_end": return scheduleEvent(evt, () => handleAgentEnd(ctx, evt));
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.model-state.ts
function preserveAssistantUsage(message, pending) {
	if (!pending || message.usage.usageReport?.state === "unavailable") return;
	const final = normalizeUsage(message.usage);
	if (hasNonzeroUsage(final)) {
		if (pending.cost?.totalOrigin === "provider-billed" && final.cost?.totalOrigin !== "provider-billed") message.usage.cost = {
			...makeZeroUsageSnapshot().cost,
			...message.usage.cost,
			...pending.cost
		};
		return;
	}
	const input = pending.input ?? 0;
	const output = pending.output ?? 0;
	const cacheRead = pending.cacheRead ?? 0;
	const cacheWrite = pending.cacheWrite ?? 0;
	message.usage = {
		...makeZeroUsageSnapshot(),
		input,
		output,
		cacheRead,
		cacheWrite,
		...pending.cacheWrite1h !== void 0 ? { cacheWrite1h: pending.cacheWrite1h } : {},
		...pending.contextUsage ? { contextUsage: { ...pending.contextUsage } } : {},
		...pending.usageReport ? { usageReport: { ...pending.usageReport } } : {},
		totalTokens: pending.total ?? input + output + cacheRead + cacheWrite,
		...pending.reasoningTokens !== void 0 ? { reasoningTokens: pending.reasoningTokens } : {}
	};
	Object.assign(message.usage.cost, pending.cost);
}
/** Owns model facts at event ingress, independently of queued reply delivery. */
function createEmbeddedModelState(params, log) {
	const totals = createUsageAccumulator();
	let pending;
	let lastUsage;
	let retryUsage;
	let completed;
	let successfulModelResponse = false;
	let publishedMessageModel;
	const runContext = getAgentRunContext(params.runId);
	const publishMessageModel = (message, reset) => {
		if (reset) publishedMessageModel = void 0;
		const provider = message.provider?.trim();
		const model = message.responseModel?.trim() || message.model?.trim();
		const identity = provider && model ? `${provider}\0${model}` : void 0;
		if (!identity || identity === publishedMessageModel) return;
		const event = {
			runId: params.runId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentId: params.agentId,
			lifecycleGeneration: params.lifecycleGeneration,
			stream: "lifecycle",
			data: {
				phase: "model",
				provider,
				model
			}
		};
		if (runContext) emitAgentEventForRunContext(event, runContext);
		else emitAgentEvent(event);
		publishedMessageModel = identity;
	};
	const recordPendingUsage = (raw) => {
		const usage = normalizeUsage(raw);
		if (!hasObservedModelUsage(usage)) return;
		const cost = usage.cost;
		const next = !usage.usageReport && pending && !hasNonzeroUsage(usage) ? {
			...pending,
			cost
		} : usage;
		if (usage.usageReport?.state !== "unavailable" && pending?.cost?.totalOrigin === "provider-billed" && cost?.totalOrigin !== "provider-billed") next.cost = pending.cost;
		pending = next;
	};
	const recordModelUsage = (usage) => {
		if (!hasObservedModelUsage(usage)) return;
		mergeUsageIntoAccumulator(totals, usage);
		if (!usage.usageReport && !hasNonzeroUsage(usage) || !params.lifecycleGeneration) return;
		const data = emitAgentRunOutputTokens({
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration,
			outputTokens: usage.output ?? 0,
			usageReport: usage.usageReport
		});
		if (data && params.onAgentEvent) runBestEffortCallback({
			label: "usage agent event",
			log,
			callback: () => params.onAgentEvent?.({
				stream: "usage",
				data
			})
		});
	};
	const recordContextAccounting = (message, successful) => params.onContextAccountingEvent?.({
		kind: "model",
		contextTokens: deriveSessionTotalTokens({ lastCallUsage: normalizeUsage(message.usage) }),
		successful
	});
	return {
		captureModelEvent: (evt) => {
			if (evt.type === "compaction_end") {
				if (evt.outcome.status === "completed" && evt.outcome.willRetry) {
					completed = void 0;
					retryUsage = lastUsage ?? retryUsage;
					lastUsage = void 0;
				}
				return;
			}
			if (evt.type !== "message_start" && evt.type !== "message_update" && evt.type !== "message_end" && evt.type !== "turn_end") return;
			const message = evt.message;
			if (message.role !== "assistant" || isSubscribeTranscriptOnlyOpenClawAssistantMessage(message)) return;
			publishMessageModel(message, evt.type === "message_start");
			switch (evt.type) {
				case "turn_end":
					if (!successfulModelResponse && (message.stopReason === "stop" || message.stopReason === "toolUse") && !isProviderRefusalAssistantError(message)) {
						successfulModelResponse = true;
						recordContextAccounting(message, true);
					}
					return;
				case "message_start":
					pending = void 0;
					return;
				case "message_update":
					if (evt.assistantMessageEvent.type === "text_end") recordPendingUsage(message.usage);
					return;
				case "message_end":
					recordPendingUsage(message.usage);
					preserveAssistantUsage(message, pending);
					if (pending?.usageReport || hasNonzeroUsage(pending)) lastUsage = { ...pending };
					recordModelUsage(pending);
					runBestEffortCallback({
						label: "model usage observation",
						log,
						callback: () => params.onModelUsage?.(pending, {
							responseId: message.responseId,
							turnId: message.turnId
						})
					});
					pending = void 0;
					completed = applyAssistantDeliveryDirectives(structuredClone(message));
					lastUsage ??= message.stopReason === "error" ? retryUsage : void 0;
					retryUsage = void 0;
					recordContextAccounting(message, false);
			}
		},
		recordAuxiliaryUsage: (usage) => recordModelUsage(normalizeUsage(usage)),
		getUsageTotals: () => toNormalizedUsage(totals),
		getLastAssistantUsage: () => normalizeUsage(lastUsage),
		getCurrentAttemptAssistant: () => completed ? structuredClone(completed) : void 0,
		hasSuccessfulModelResponse: () => successfulModelResponse
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.reply-delivery.ts
const isStreamAppend = ({ data, finalMessage }) => !finalMessage && !data.replace && !data.mediaUrls?.length && !data.managedMediaUrls?.length;
const mergeStreamAppend = (previous, next) => ({
	...next,
	delta: previous.delta + next.delta
});
function createReplyDelivery({ params, state, log }) {
	const assistantTexts = state.assistantTexts;
	const deferredAssistantScopes = [];
	const lastEmittedCommentaryByItem = /* @__PURE__ */ new Map();
	const pendingBlockReplyTasks = /* @__PURE__ */ new Set();
	const pendingPartialReplyTasks = /* @__PURE__ */ new Set();
	let streamScope = {};
	const drainPartialReply = (scope) => {
		if (!scope.delivery || !scope.pending || state.unsubscribed || scope === streamScope && scope.active) return;
		const data = scope.delivery.data;
		scope.pending = false;
		scope.active = true;
		const settled = () => {
			if (scope === streamScope) {
				scope.active = false;
				drainPartialReply(scope);
			}
		};
		runBestEffortCallback({
			callback: () => params.onPartialReply?.(data),
			label: "assistant partial reply",
			log,
			pending: pendingPartialReplyTasks,
			onSuccess: settled,
			onError: settled
		});
	};
	const streamId = randomUUID();
	let messageIndex = -1;
	let assistantItemId = "";
	const raw = {
		text: "",
		prefix: "",
		blockIndex: -1
	};
	const display = { ...raw };
	let finalText = "";
	let finalized = false;
	const advanceStream = (stream, data, finalMessage) => {
		if (stream.blockIndex !== state.assistantMessageIndex) {
			stream.prefix = stream.text;
			stream.blockIndex = state.assistantMessageIndex;
		}
		const text = finalMessage ? data.text : stream.prefix && data.text ? `${stream.prefix}\n${data.text}` : stream.prefix || data.text;
		const replace = finalMessage ? !text.startsWith(stream.text) : data.replace === true;
		const delta = finalMessage ? replace ? "" : text.slice(stream.text.length) : stream.prefix && stream.text.length === stream.prefix.length && data.delta ? `\n${data.delta}` : data.delta;
		const eventData = text !== stream.text || data.mediaUrls?.length || data.managedMediaUrls?.length ? {
			...data,
			text,
			delta,
			replace: replace || void 0,
			itemId: assistantItemId
		} : void 0;
		stream.text = text;
		return eventData;
	};
	const publishAgentEvent = (event, assistantSource, assistantProjection) => {
		const owned = {
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration,
			...event
		};
		if (!emitAgentEventWithAssistantSourceIfCurrent(owned, assistantSource, assistantProjection)) return;
		if (params.onAgentEvent) runBestEffortCallback({
			label: "assistant agent event",
			log,
			callback: () => params.onAgentEvent?.(event)
		});
	};
	const emitAssistantStreamDataSafely = (scope) => {
		if (!scope.delivery || scope.emitted || state.unsubscribed) return;
		const delivery = scope.delivery;
		const { eventData } = delivery;
		scope.emitted = true;
		scope.pending ||= delivery.emitPartialReply && Boolean(params.onPartialReply) && state.shouldEmitPartialReplies;
		const itemId = eventData?.itemId ?? "";
		const progressText = eventData?.phase === "commentary" ? eventData.text.trimEnd() : "";
		const preamblePhase = delivery.finalMessage ? "end" : "update";
		const commentarySignature = `${preamblePhase}\0${progressText}`;
		const event = progressText.trim() ? {
			stream: "item",
			data: {
				kind: "preamble",
				title: "Preamble",
				phase: preamblePhase,
				progressText,
				...itemId ? { itemId } : {}
			}
		} : !eventData || eventData.phase === "commentary" ? void 0 : {
			stream: "assistant",
			data: eventData
		};
		if (event && (event.stream !== "item" || lastEmittedCommentaryByItem.get(itemId) !== commentarySignature)) {
			if (event.stream === "item") lastEmittedCommentaryByItem.set(itemId, commentarySignature);
			publishAgentEvent(event, delivery.assistantSource, delivery.assistantProjection);
		}
		drainPartialReply(scope);
	};
	const emitAssistantStreamData = (data, options) => {
		if (state.unsubscribed) return;
		const assistantSource = readAgentAssistantSource(state.lastAssistant);
		let eventData;
		let assistantProjection;
		if (data.phase === "commentary") {
			if (messageIndex === state.assistantMessageStartIndex && display.text !== finalText) {
				display.prefix = display.text = finalText;
				assistantProjection = {
					itemId: assistantItemId,
					text: finalText,
					replace: true
				};
				for (const scope of [streamScope, ...deferredAssistantScopes]) {
					const delivery = scope.delivery;
					if (delivery && delivery.blockIndex >= messageIndex && delivery.data.phase !== "final_answer") delivery.assistantProjection = assistantProjection;
				}
			}
			eventData = data;
		} else {
			if (messageIndex !== state.assistantMessageStartIndex) {
				messageIndex = state.assistantMessageStartIndex;
				assistantItemId = `${streamId}:${messageIndex}`;
				for (const stream of [raw, display]) {
					stream.prefix = stream.text = "";
					stream.blockIndex = state.assistantMessageIndex;
				}
				finalText = "";
				finalized = false;
			}
			if (!finalized || options?.finalMessage) {
				eventData = advanceStream(raw, data, options?.finalMessage === true);
				const displayData = advanceStream(display, data, options?.finalMessage === true);
				assistantProjection = {
					itemId: assistantItemId,
					text: display.text,
					replace: displayData?.replace === true
				};
				finalText = data.phase === "final_answer" ? display.text : display.text.startsWith(finalText) ? finalText : "";
				finalized = options?.finalMessage === true;
			}
			if (options?.finalMessage && state.lastAssistant?.stopReason === "error") {
				const itemId = assistantItemId;
				const text = raw.text;
				const displayText = display.text;
				params.assistantErrorTranscript?.bindStream(state.lastAssistant, (visible) => {
					clearAssistantStream();
					publishAgentEvent({
						stream: "assistant",
						data: {
							itemId,
							text: visible ? text : "",
							delta: "",
							replace: true
						}
					}, assistantSource, {
						itemId,
						text: visible ? displayText : "",
						replace: true
					});
				});
			}
		}
		const delivery = {
			assistantSource,
			assistantProjection,
			data,
			eventData,
			emitPartialReply: options?.emitPartialReply === true,
			finalMessage: options?.finalMessage === true,
			blockIndex: state.assistantMessageIndex
		};
		if (!eventData && !delivery.emitPartialReply) return;
		const previous = streamScope.delivery;
		const deferred = state.deferBlockReplyDelivery && data.phase !== "commentary";
		const coalesce = previous && isStreamAppend(previous) && isStreamAppend(delivery) && previous.blockIndex === delivery.blockIndex && previous.assistantSource === delivery.assistantSource && previous.data.phase === data.phase && previous.data.itemId === data.itemId && previous.emitPartialReply === delivery.emitPartialReply && Boolean(previous.eventData) === Boolean(eventData);
		const scope = coalesce ? streamScope : flushAssistantStream(delivery);
		if (coalesce) {
			if (!scope.emitted || scope.pending) delivery.data = mergeStreamAppend(previous.data, data);
			if (!scope.emitted && previous.eventData && eventData) delivery.eventData = mergeStreamAppend(previous.eventData, eventData);
			scope.delivery = delivery;
			scope.emitted = false;
		}
		if (!deferred) emitAssistantStreamDataSafely(scope);
	};
	const flushAssistantStream = (delivery) => {
		const previous = streamScope;
		const scope = { delivery };
		streamScope = scope;
		if (delivery && state.deferBlockReplyDelivery && delivery.data.phase !== "commentary") deferredAssistantScopes.push(scope);
		if (!state.deferBlockReplyDelivery) for (const deferred of deferredAssistantScopes.splice(0)) {
			emitAssistantStreamDataSafely(deferred);
			deferred.delivery = void 0;
		}
		if (!state.deferBlockReplyDelivery || previous.delivery?.data.phase === "commentary") {
			emitAssistantStreamDataSafely(previous);
			drainPartialReply(previous);
			previous.delivery = void 0;
		}
		return scope;
	};
	const clearAssistantStream = () => {
		streamScope.delivery = void 0;
		streamScope = {};
		deferredAssistantScopes.length = 0;
	};
	const noteLastAssistant = (msg) => {
		if (msg.role === "assistant") state.lastAssistant = msg;
	};
	const deferredToolMediaReplies = /* @__PURE__ */ new WeakMap();
	const emitBlockReplySafely = (payload, options) => {
		if (!params.onBlockReply) return;
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		runBestEffortCallback({
			callback: () => assistantMessageIndex === void 0 ? params.onBlockReply?.(payload) : params.onBlockReply?.(payload, { assistantMessageIndex }),
			label: "block reply",
			log,
			pending: pendingBlockReplyTasks,
			onSuccess: () => {
				if (!payload.isReasoning && hasAssistantVisibleReply(payload)) {
					state.visibleBlockReplyCount += 1;
					if (options?.pendingToolMedia) {
						state.pendingToolMediaDeliveryFailed = false;
						state.hasToolMediaBlockReply = true;
					}
					for (const url of options?.autoDeliveryMediaUrls ?? []) state.toolAutoDeliveryMediaUrls.delete(url);
				}
			},
			onError: () => {
				if (options?.pendingToolMedia) restorePendingToolMediaReply(state, options.pendingToolMedia);
			}
		});
	};
	const emitBlockReply = (payload, options) => {
		flushAssistantStream();
		const withAssistantDirectives = consumePendingAssistantReplyDirectivesIntoReply(state, payload);
		const pendingToolMedia = payload.isReasoning || options?.consumePendingToolMedia === false ? null : readPendingToolMediaReply(state);
		const withToolMedia = options?.consumePendingToolMedia === false ? withAssistantDirectives : consumePendingToolMediaIntoReply(state, withAssistantDirectives);
		const sentMediaUrls = new Set(state.messagingToolSentMediaUrls.map((url) => url.trim()));
		const autoDeliveryMediaUrls = params.sourceReplyDeliveryMode === "message_tool_only" ? (pendingToolMedia?.mediaUrls ?? []).filter((url) => state.toolAutoDeliveryMediaUrls.has(url.trim()) && !sentMediaUrls.has(url.trim())) : [];
		const pendingAttachments = new Map((pendingToolMedia?.mediaUrls ?? []).map((url, index) => [url.trim(), pendingToolMedia?.attachments?.[index] ?? {}]));
		const blockPayload = autoDeliveryMediaUrls.length === 0 ? withToolMedia : markReplyPayloadForSourceSuppressionDelivery({
			mediaUrls: autoDeliveryMediaUrls,
			mediaUrl: autoDeliveryMediaUrls[0],
			attachments: autoDeliveryMediaUrls.map((url) => pendingAttachments.get(url.trim()) ?? {}),
			audioAsVoice: pendingToolMedia?.audioAsVoice || void 0,
			trustedLocalMedia: true
		});
		const assistantTranscriptMediaUrls = Array.from(new Set(payload.mediaUrls ?? []));
		copyReplyPayloadMetadata(payload, blockPayload);
		if (params.silentExpected && !shouldKeepPayloadDuringSilentTurn(blockPayload)) return;
		const taggedPayload = options?.assistantMessageIndex !== void 0 ? setReplyPayloadMetadata(blockPayload, {
			assistantMessageIndex: options.assistantMessageIndex,
			assistantMessageStartIndex: state.assistantMessageStartIndex,
			...assistantTranscriptMediaUrls.length > 0 ? { assistantTranscriptMediaUrls } : {}
		}) : blockPayload;
		if (blockPayload.text && options?.blockSourceText !== void 0) setReplyPayloadMetadata(taggedPayload, {
			blockSourceText: options.blockSourceText,
			blockSourceRange: options.blockSourceRange
		});
		if (state.deferBlockReplyDelivery) {
			if (pendingToolMedia) deferredToolMediaReplies.set(taggedPayload, {
				pendingToolMedia,
				autoDeliveryMediaUrls
			});
			state.deferredBlockReplies.push(taggedPayload);
			return;
		}
		emitBlockReplySafely(taggedPayload, {
			pendingToolMedia,
			autoDeliveryMediaUrls
		});
	};
	const releaseDeferredReplies = () => {
		const isSuperseded = (index) => {
			if (index === void 0) return false;
			return index < (state.answerSegments.find((candidate) => index <= candidate.messageEnd)?.finalMessageStart ?? state.assistantMessageStartIndex);
		};
		for (const scope of deferredAssistantScopes) {
			const delivery = scope.delivery;
			if (delivery && isSuperseded(delivery.blockIndex)) {
				if (!delivery.data.mediaUrls?.length) scope.delivery = void 0;
				else {
					delivery.data = {
						...delivery.data,
						text: "",
						delta: ""
					};
					if (delivery.eventData) delivery.eventData = {
						...delivery.eventData,
						text: "",
						delta: ""
					};
					if (delivery.assistantProjection) delivery.assistantProjection = {
						...delivery.assistantProjection,
						text: ""
					};
				}
			}
		}
		const replies = state.deferredBlockReplies.splice(0);
		for (const payload of replies) {
			const index = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
			if (!payload.isReasoning && isSuperseded(index)) {
				payload.text = void 0;
				setReplyPayloadMetadata(payload, { blockSourceText: void 0 });
			}
		}
		state.deferBlockReplyDelivery = false;
		flushAssistantStream();
		for (const payload of replies) {
			if (!hasAssistantVisibleReply(payload)) continue;
			const deferredToolMedia = deferredToolMediaReplies.get(payload);
			emitBlockReplySafely(payload, deferredToolMedia);
		}
	};
	const clearDeferredBlockReplies = () => {
		state.deferredBlockReplies.length = 0;
	};
	const rememberAssistantText = (text, normalizedText) => {
		state.lastAssistantTextMessageIndex = state.assistantMessageIndex;
		state.lastAssistantTextContentIndex = state.lastAssistantStreamContentIndex;
		state.lastAssistantTextItemId = state.lastAssistantStreamItemId;
		state.lastAssistantTextTrimmed = text.trimEnd();
		const normalized = normalizedText ?? normalizeTextForComparison(text);
		state.lastAssistantTextNormalized = normalized.length > 0 ? normalized : void 0;
	};
	const shouldSkipAssistantText = (text, normalizedText) => {
		if (state.lastAssistantTextMessageIndex !== state.assistantMessageIndex || state.lastAssistantTextContentIndex !== state.lastAssistantStreamContentIndex) return false;
		const trimmed = text.trimEnd();
		if (trimmed && trimmed === state.lastAssistantTextTrimmed) return true;
		const normalized = normalizedText ?? normalizeTextForComparison(text);
		return normalized.length > 0 && normalized === state.lastAssistantTextNormalized;
	};
	const pushAssistantText = (text, normalizedText) => {
		if (!text || params.silentExpected && !isSilentReplyText(text, "NO_REPLY") || shouldSkipAssistantText(text, normalizedText)) return;
		assistantTexts.push(text);
		rememberAssistantText(text, normalizedText);
	};
	const replaceCurrentAssistantText = (text) => {
		const count = assistantTexts.length - state.assistantTextBaseline;
		if (!text) assistantTexts.splice(state.assistantTextBaseline, count);
		else if (count > 0) {
			assistantTexts.splice(state.assistantTextBaseline, count, text);
			rememberAssistantText(text);
		} else pushAssistantText(text);
	};
	const finalizeAssistantTexts = (args) => {
		const { text, addedDuringMessage, chunkerHasBuffered } = args;
		if (state.hasFlushedPartialText) {
			replaceCurrentAssistantText(text);
			state.hasFlushedPartialText = false;
		} else if (state.includeReasoning && text && !params.onBlockReply) {
			replaceCurrentAssistantText(text);
			state.suppressBlockChunks = true;
		} else if (!addedDuringMessage && text && (!chunkerHasBuffered || isSilentReplyText(text, "NO_REPLY"))) pushAssistantText(text);
		state.assistantTextBaseline = assistantTexts.length;
	};
	const waitForPendingEvents = async (options) => {
		const includePartialReplies = options?.includePartialReplies !== false;
		while (true) {
			const eventChain = state.pendingEventChain;
			const partialReplyTasks = includePartialReplies ? [...pendingPartialReplyTasks] : [];
			if (!eventChain && partialReplyTasks.length === 0) return;
			await Promise.allSettled([...eventChain ? [eventChain] : [], ...partialReplyTasks]);
		}
	};
	return {
		assistantTexts,
		clearAssistantStream,
		clearDeferredBlockReplies,
		emitAssistantStreamData,
		emitBlockReply,
		finalizeAssistantTexts,
		flushAssistantStream,
		noteLastAssistant,
		releaseDeferredReplies,
		pendingBlockReplyTasks,
		pushAssistantText,
		replaceCurrentAssistantText,
		shouldSkipAssistantText,
		waitForPendingEvents
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.run-state.ts
function createEmbeddedAgentSubscribeState(params) {
	const reasoningMode = params.reasoningMode ?? "off";
	const canShowReasoning = params.thinkingLevel !== "off";
	const initialPendingToolMedia = collectAgentInternalEventMedia(params.internalEvents);
	return {
		assistantTexts: [],
		answerSegments: [],
		toolMetas: [],
		acceptedSessionSpawns: [],
		toolMetaById: /* @__PURE__ */ new Map(),
		toolSummaryById: /* @__PURE__ */ new Set(),
		liveEditDiffStateById: /* @__PURE__ */ new Map(),
		itemActiveIds: /* @__PURE__ */ new Set(),
		itemStartedCount: 0,
		itemCompletedCount: 0,
		assistantTurnCount: 0,
		lastToolError: void 0,
		blockReplyBreak: params.blockReplyBreak ?? "text_end",
		reasoningMode,
		includeReasoning: reasoningMode === "on" && canShowReasoning,
		shouldEmitPartialReplies: !(reasoningMode === "on" && !params.onBlockReply),
		streamReasoning: (params.streamReasoningInNonStreamModes === true ? reasoningMode !== "on" : reasoningMode === "stream") && canShowReasoning && typeof params.onReasoningStream === "function",
		deltaBuffer: "",
		streamBlockText: "",
		streamBlockFinal: false,
		blockReplyScopeStart: void 0,
		thinkingTagStream: createThinkingTagStreamState(),
		deltaBufferIsCommentary: false,
		hasFlushedPartialText: false,
		partialBlockState: createAssistantStreamBlockState(),
		lastAssistantAudioDirectiveCount: 0,
		assistantStream: void 0,
		lastStreamedReasoning: void 0,
		lastBlockReplyText: void 0,
		lastDeliveredBlockReplyText: void 0,
		deferBlockReplyDelivery: typeof params.onBeforeTerminalDelivery === "function" && params.deferTerminalDelivery !== false,
		deferredBlockReplies: [],
		toolExecutionSinceLastBlockReply: false,
		reasoningStreamOpen: false,
		assistantMessageIndex: 0,
		assistantMessageStartIndex: 0,
		lastAssistantStreamContentIndex: void 0,
		lastAssistantStreamItemId: void 0,
		lastAssistantTextMessageIndex: -1,
		lastAssistantTextContentIndex: void 0,
		lastAssistantTextItemId: void 0,
		lastAssistantTextNormalized: void 0,
		lastAssistantTextTrimmed: void 0,
		assistantTextBaseline: 0,
		suppressBlockChunks: false,
		lastReasoningSent: void 0,
		compactionInFlight: false,
		lastCompactionTokensAfter: void 0,
		pendingCompactionRetry: 0,
		unsubscribed: false,
		replayState: createEmbeddedRunReplayState(params.initialReplayState),
		livenessState: "working",
		hadDeterministicSideEffect: false,
		pendingEventChain: null,
		messagingToolSentTexts: [],
		messagingToolSentTextsNormalized: [],
		currentSourceMessagingToolSentTextsNormalized: [],
		currentSourceMessagingToolHeldPartial: void 0,
		messagingToolSentTargets: [],
		heartbeatToolResponse: void 0,
		messagingToolSentMediaUrls: [],
		messagingToolSourceReplyPayloads: [],
		messageToolOnlySourceReplyDelivered: false,
		sourceReplyDeliveryState: "missing",
		successfulCronAdds: 0,
		pendingToolMediaUrls: initialPendingToolMedia.mediaUrls,
		pendingToolMediaAttachments: initialPendingToolMedia.attachments,
		pendingToolMediaTrustByUrl: initialPendingToolMedia.trustByUrl,
		toolAutoDeliveryMediaUrls: /* @__PURE__ */ new Set(),
		pendingToolAudioAsVoice: false,
		pendingToolMediaDeliveryFailed: false,
		hasToolMediaBlockReply: false,
		visibleBlockReplyCount: 0,
		pendingAssistantReplyDirectives: void 0,
		deterministicApprovalPromptPending: false,
		deterministicApprovalPromptSent: false
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.stream-rendering.ts
function isPotentialTrailingFinalTagFragment(fragment) {
	if (!fragment.startsWith("<") || fragment.includes(">")) return false;
	const body = fragment.toLowerCase().slice(1).trimStart().replace(/^\//, "").trimStart();
	if (!body) return true;
	const namePart = body.split(/[\s/>]/, 1)[0] ?? "";
	if (!namePart) return true;
	return "final".startsWith(namePart);
}
function splitTrailingBlockTagFragment(text, isInsideCodeSpan) {
	for (let cursor = 0; cursor < text.length;) {
		const start = text.indexOf("<", cursor);
		if (start === -1) break;
		cursor = start + 1;
		if (isInsideCodeSpan(start)) continue;
		const parsed = parseReasoningTagAt(text, start, false);
		if (parsed.kind === "pending") return {
			text: text.slice(0, start),
			pendingTagFragment: text.slice(start)
		};
		if (parsed.kind === "tag") cursor = start + parsed.tag.text.length;
	}
	const fragmentStart = text.lastIndexOf("<");
	if (fragmentStart === -1 || isInsideCodeSpan(fragmentStart)) return { text };
	const fragment = text.slice(fragmentStart);
	if (!isPotentialTrailingFinalTagFragment(fragment)) return { text };
	return {
		text: text.slice(0, fragmentStart),
		pendingTagFragment: fragment
	};
}
function splitTrailingFenceFragment(text, startsAtLineStart) {
	const lineStart = text.lastIndexOf("\n") + 1;
	const line = text.slice(lineStart);
	if (!startsAtLineStart && lineStart === 0 || !/^(?: {0,3})(?:`+|~+)$/.test(line)) return { text };
	return {
		text: text.slice(0, lineStart),
		pendingFenceFragment: line
	};
}
function createStreamRendering({ params, state, log, blockChunker, emitBlockReply, flushAssistantStream, pendingBlockReplyTasks, pushAssistantText, shouldSkipAssistantText }) {
	const messagingToolSentTextsNormalized = state.messagingToolSentTextsNormalized;
	const partialReplyDirectiveAccumulator = createStreamingDirectiveAccumulator();
	let reasoningProjection = createTextProjection([trimTextFilter("both")]);
	const coveredBlockSources = /* @__PURE__ */ new Map();
	const acceptedBlockSourceGenerations = /* @__PURE__ */ new Map();
	let reasoningRaw;
	const stripBlockTags = (text, stateLocal, options) => {
		const input = `${stateLocal.pendingFenceFragment ?? ""}${stateLocal.pendingTagFragment ?? ""}${text}`;
		stateLocal.pendingFenceFragment = void 0;
		stateLocal.pendingTagFragment = void 0;
		if (!input) return text;
		const { text: fenceInput, pendingFenceFragment } = options?.final ? {
			text: input,
			pendingFenceFragment: void 0
		} : splitTrailingFenceFragment(input, stateLocal.fence?.atLineStart ?? true);
		stateLocal.pendingFenceFragment = pendingFenceFragment;
		if (!fenceInput) return "";
		const inlineStateStart = stateLocal.inlineCode ?? createInlineCodeState();
		const fenceStateStart = stateLocal.fence;
		const initialCodeSpans = buildCodeSpanIndex(fenceInput, inlineStateStart, fenceStateStart);
		const { text: scanText, pendingTagFragment } = options?.final ? {
			text: fenceInput,
			pendingTagFragment: void 0
		} : splitTrailingBlockTagFragment(fenceInput, initialCodeSpans.isInside);
		stateLocal.pendingTagFragment = pendingTagFragment;
		if (!scanText) return "";
		const codeSpans = scanText === fenceInput ? initialCodeSpans : buildCodeSpanIndex(scanText, inlineStateStart, fenceStateStart);
		let processed = "";
		let lastIndex = 0;
		let lastCodeIndex = 0;
		let reasoningDepth = stateLocal.reasoningDepth;
		let hiddenInlineState = stateLocal.reasoningInlineCode ? { ...stateLocal.reasoningInlineCode } : createInlineCodeState();
		let hiddenFenceState = stateLocal.reasoningFence?.open ? {
			atLineStart: stateLocal.reasoningFence.atLineStart,
			open: { ...stateLocal.reasoningFence.open }
		} : stateLocal.reasoningFence ? { atLineStart: stateLocal.reasoningFence.atLineStart } : void 0;
		let hiddenPendingFenceFragment = stateLocal.reasoningPendingFenceFragment;
		stateLocal.reasoningPendingFenceFragment = void 0;
		const advanceHiddenCodeState = (segment) => {
			const hiddenInput = `${hiddenPendingFenceFragment ?? ""}${segment}`;
			hiddenPendingFenceFragment = void 0;
			if (!hiddenInput) return;
			const { text: hiddenFenceInput, pendingFenceFragment: pendingFenceFragmentLocal } = options?.final ? {
				text: hiddenInput,
				pendingFenceFragment: void 0
			} : splitTrailingFenceFragment(hiddenInput, hiddenFenceState?.atLineStart ?? true);
			hiddenPendingFenceFragment = pendingFenceFragmentLocal;
			if (!hiddenFenceInput) return;
			const next = buildCodeSpanIndex(hiddenFenceInput, hiddenInlineState, hiddenFenceState);
			hiddenInlineState = next.inlineState;
			hiddenFenceState = next.fenceState;
		};
		for (let cursor = 0; cursor < scanText.length;) {
			const idx = scanText.indexOf("<", cursor);
			if (idx === -1) break;
			cursor = idx + 1;
			if (reasoningDepth > 0) advanceHiddenCodeState(scanText.slice(lastCodeIndex, idx));
			const isInsideHiddenCode = reasoningDepth > 0 && (hiddenInlineState.open || Boolean(hiddenFenceState?.open));
			lastCodeIndex = idx;
			if (reasoningDepth === 0 && codeSpans.isInside(idx) || isInsideHiddenCode) continue;
			const parsed = parseReasoningTagAt(scanText, idx, true);
			if (parsed.kind !== "tag") continue;
			const match = parsed.tag;
			const isClose = match.isClose;
			cursor = idx + match.text.length;
			lastCodeIndex = cursor;
			if (match.isSelfClosing) {
				if (reasoningDepth === 0) processed += scanText.slice(lastIndex, idx);
				lastIndex = cursor;
				continue;
			}
			if (reasoningDepth === 0) {
				if (isClose) {
					const afterIndex = cursor;
					const before = scanText.slice(lastIndex, idx);
					const after = scanText.slice(afterIndex);
					if (hasOrphanReasoningCloseBoundary({
						before,
						after
					})) processed = "";
					else processed += before;
					lastIndex = afterIndex;
					continue;
				}
				processed += scanText.slice(lastIndex, idx);
			}
			reasoningDepth += isClose ? -1 : 1;
			if (reasoningDepth === 1 && !isClose) {
				hiddenInlineState = createInlineCodeState();
				hiddenFenceState = void 0;
				hiddenPendingFenceFragment = void 0;
			}
			lastIndex = cursor;
		}
		if (reasoningDepth > 0) advanceHiddenCodeState(scanText.slice(lastCodeIndex));
		if (reasoningDepth === 0) processed += scanText.slice(lastIndex);
		stateLocal.reasoningDepth = reasoningDepth;
		stateLocal.reasoningInlineCode = reasoningDepth > 0 ? hiddenInlineState : void 0;
		stateLocal.reasoningFence = reasoningDepth > 0 ? hiddenFenceState : void 0;
		stateLocal.reasoningPendingFenceFragment = reasoningDepth > 0 ? hiddenPendingFenceFragment : void 0;
		const finalCodeSpans = processed === scanText ? codeSpans : buildCodeSpanIndex(processed, inlineStateStart, fenceStateStart);
		if (!params.enforceFinalTag) {
			stateLocal.inlineCode = finalCodeSpans.inlineState;
			stateLocal.fence = finalCodeSpans.fenceState;
			return stripFinalTagsOutsideCodeSpans(processed, finalCodeSpans.isInside);
		}
		let result = "";
		let lastFinalIndex = 0;
		let inFinal = stateLocal.final;
		let everInFinal = stateLocal.final;
		for (const match of findFinalTagMatches(processed)) {
			const idx = match.index;
			if (finalCodeSpans.isInside(idx)) continue;
			const isClose = match.isClose;
			const isSelfClosing = match.isSelfClosing;
			if (inFinal && (isSelfClosing || isClose)) {
				result += processed.slice(lastFinalIndex, idx);
				inFinal = false;
			} else if (!inFinal && (isSelfClosing || !isClose)) {
				inFinal = true;
				everInFinal = true;
			} else continue;
			lastFinalIndex = idx + match.text.length;
		}
		if (inFinal) result += processed.slice(lastFinalIndex);
		stateLocal.final = inFinal;
		if (!everInFinal) {
			stateLocal.inlineCode = createInlineCodeState();
			stateLocal.fence = finalCodeSpans.fenceState;
			stateLocal.finalInlineCode = void 0;
			stateLocal.finalFence = void 0;
			return "";
		}
		const finalResultInlineStateStart = stateLocal.finalInlineCode ?? createInlineCodeState();
		const finalResultFenceStateStart = stateLocal.finalFence;
		const resultCodeSpans = buildCodeSpanIndex(result, finalResultInlineStateStart, finalResultFenceStateStart);
		stateLocal.inlineCode = finalCodeSpans.inlineState;
		stateLocal.fence = finalCodeSpans.fenceState;
		stateLocal.finalInlineCode = inFinal ? resultCodeSpans.inlineState : void 0;
		stateLocal.finalFence = inFinal ? resultCodeSpans.fenceState : void 0;
		return stripFinalTagsOutsideCodeSpans(result, resultCodeSpans.isInside);
	};
	const stripFinalTagsOutsideCodeSpans = (text, isInside) => {
		let output = "";
		let lastIndex = 0;
		for (const match of findFinalTagMatches(text)) {
			const idx = match.index;
			if (isInside(idx)) continue;
			output += text.slice(lastIndex, idx);
			lastIndex = idx + match.text.length;
		}
		output += text.slice(lastIndex);
		return output;
	};
	const emitBlockChunk = (text, options) => {
		if (state.suppressBlockChunks || params.silentExpected || shouldSuppressDeterministicApprovalOutput(state)) return;
		const blockReplyText = options?.final === false ? text : text.trimEnd();
		const hasPendingAudioDirective = state.pendingAssistantReplyDirectives?.audioAsVoice === true;
		if (!blockReplyText.trim() && !options?.finalReply && !hasPendingAudioDirective) return;
		const markBlockReplyTextHandled = () => {
			if (blockReplyText) {
				state.lastBlockReplyText = blockReplyText;
				state.lastDeliveredBlockReplyText = blockReplyText;
			}
			state.toolExecutionSinceLastBlockReply = false;
		};
		if (shouldSuppressSourceReplyOutput({
			params,
			state
		})) {
			markBlockReplyTextHandled();
			return;
		}
		let chunk = blockReplyText;
		let slicedPrefixReplay = false;
		const lastDeliveredBlockReplyText = state.lastDeliveredBlockReplyText;
		const blockReplySuffix = lastDeliveredBlockReplyText ? blockReplyText.slice(lastDeliveredBlockReplyText.length) : "";
		const prefixReplayCandidate = Boolean(!state.deferBlockReplyDelivery && state.blockReplyBreak === "text_end" && state.toolExecutionSinceLastBlockReply && lastDeliveredBlockReplyText && lastDeliveredBlockReplyText.trimEnd().endsWith(":") && blockReplyText.length > lastDeliveredBlockReplyText.length && blockReplyText.startsWith(lastDeliveredBlockReplyText));
		if (prefixReplayCandidate && !/^\s/.test(blockReplySuffix)) {
			chunk = blockReplySuffix;
			slicedPrefixReplay = true;
		}
		if (!chunk && !options?.finalReply && !hasPendingAudioDirective) return;
		const normalizedChunk = normalizeTextForComparison(chunk);
		const normalizedReplaySuffix = prefixReplayCandidate ? normalizeTextForComparison(blockReplySuffix.trimStart()) : "";
		if (isMessagingToolDuplicateNormalized(normalizedChunk, messagingToolSentTextsNormalized) || prefixReplayCandidate && isMessagingToolDuplicateNormalized(normalizedReplaySuffix, messagingToolSentTextsNormalized)) {
			log.debug(`Skipping block reply - already sent via messaging tool: ${truncateUtf16Safe(chunk, 50)}...`);
			if (prefixReplayCandidate) markBlockReplyTextHandled();
			return;
		}
		let sourceRangeAlreadyCovered = false;
		const assistantMessageIndex = options?.assistantMessageIndex ?? state.assistantMessageIndex;
		const blockSourceText = options?.sourceText;
		const sourceStart = options?.sourceStart;
		const sourceEnd = options?.sourceEnd;
		const blockSourceRange = blockSourceText !== void 0 && sourceStart !== void 0 && sourceEnd !== void 0 ? [sourceStart, sourceEnd] : void 0;
		if (blockSourceRange) {
			const covered = coveredBlockSources.get(assistantMessageIndex) ?? [];
			const [start, end] = blockSourceRange;
			let cursor = start;
			let coveredText = "";
			for (const entry of covered.toSorted((a, b) => a.range[0] - b.range[0])) {
				const [coveredStart, coveredEnd] = entry.range;
				if (coveredEnd <= cursor) continue;
				if (coveredStart > cursor) break;
				const overlap = cursor - coveredStart;
				const length = Math.min(end, coveredEnd) - cursor;
				coveredText += entry.text.slice(overlap, overlap + length);
				cursor += length;
				if (cursor >= end) break;
			}
			if (cursor >= end && coveredText === blockSourceText) sourceRangeAlreadyCovered = true;
		}
		if (options?.reconciledSourceBreak && options.sourceGeneration !== void 0) acceptedBlockSourceGenerations.set(assistantMessageIndex, options.sourceGeneration);
		const sameSourceGeneration = options?.sourceGeneration !== void 0 && acceptedBlockSourceGenerations.get(assistantMessageIndex) === options.sourceGeneration;
		if (chunk && (sourceRangeAlreadyCovered || (!blockSourceRange || !sameSourceGeneration || options?.reconciledSourceBreak) && shouldSkipAssistantText(chunk, normalizedChunk))) {
			if (slicedPrefixReplay) markBlockReplyTextHandled();
			if (!options?.finalReply) return;
			chunk = "";
		}
		if (!params.onBlockReply) {
			pushAssistantText(chunk, normalizedChunk);
			markBlockReplyTextHandled();
			return;
		}
		let splitResult = {
			text: chunk,
			replyToTag: false,
			isSilent: false
		};
		if (options?.finalReply) {
			let pendingText = splitResult.text;
			if (trimTextPreservingCode(pendingText) === options.finalReply.text) {
				pendingText = options.finalReply.text;
				chunk = pendingText;
			}
			splitResult = {
				...splitResult,
				...options.finalReply,
				text: pendingText
			};
		}
		const { text: cleanedText, mediaUrls, mediaFailures, audioAsVoice, replyToId, replyToTag, replyToCurrent } = splitResult;
		const hasPendingFinalMedia = Boolean(options?.finalReply?.text && state.pendingToolMediaUrls.length);
		if (!cleanedText && !mediaFailures?.length && (!mediaUrls || mediaUrls.length === 0) && !audioAsVoice && !hasPendingAudioDirective && !hasPendingFinalMedia) {
			if (slicedPrefixReplay) markBlockReplyTextHandled();
			return;
		}
		pushAssistantText(chunk, normalizedChunk);
		const payload = {
			text: cleanedText || appendReplyMediaFailures(cleanedText, mediaFailures ?? []),
			mediaUrls: mediaUrls?.length ? mediaUrls : void 0,
			audioAsVoice,
			replyToId,
			replyToTag,
			replyToCurrent
		};
		addReplyPayloadMediaFailures(payload, mediaFailures);
		if (splitResult.isSilent) setReplyPayloadMetadata(payload, { silentReply: true });
		const emittedBlockSourceRange = chunk === text.trimEnd() && cleanedText === chunk && !sourceRangeAlreadyCovered && !options?.reconciledSourceBreak ? blockSourceRange : void 0;
		emitBlockReply(payload, {
			assistantMessageIndex,
			blockSourceText: chunk === text.trimEnd() && cleanedText === chunk && (options?.sourceStart === void 0 || emittedBlockSourceRange !== void 0) ? blockSourceText : void 0,
			blockSourceRange: emittedBlockSourceRange,
			consumePendingToolMedia: options?.finalReply !== void 0 || hasPendingAudioDirective || Boolean(mediaUrls?.length || audioAsVoice)
		});
		if (emittedBlockSourceRange) {
			const covered = coveredBlockSources.get(assistantMessageIndex) ?? [];
			covered.push({
				range: emittedBlockSourceRange,
				text: blockSourceText ?? ""
			});
			coveredBlockSources.set(assistantMessageIndex, covered);
			if (options?.sourceGeneration !== void 0) acceptedBlockSourceGenerations.set(assistantMessageIndex, options.sourceGeneration);
		}
		markBlockReplyTextHandled();
	};
	const consumePartialReplyDirectives = (text, options) => partialReplyDirectiveAccumulator.consume(text, options);
	const resetPartialReplyDirectives = () => {
		partialReplyDirectiveAccumulator.reset();
		state.lastAssistantAudioDirectiveCount = 0;
		state.pendingAssistantReplyDirectives = void 0;
	};
	const flushBlockReplyBuffer = (options) => {
		flushAssistantStream();
		if (!params.onBlockReply) return;
		let pendingChunk;
		if (blockChunker.hasBuffered()) blockChunker.drain({
			force: true,
			emit: (text, metadata) => {
				if (pendingChunk !== void 0) emitBlockChunk(pendingChunk.text, {
					sourceText: pendingChunk.sourceText,
					sourceGeneration: pendingChunk.sourceGeneration,
					reconciledSourceBreak: pendingChunk.reconciledSourceBreak,
					sourceStart: pendingChunk.sourceStart,
					sourceEnd: pendingChunk.sourceEnd,
					assistantMessageIndex: options?.assistantMessageIndex
				});
				pendingChunk = {
					text,
					...metadata
				};
			}
		});
		if (pendingChunk !== void 0 || options?.final || state.pendingAssistantReplyDirectives?.audioAsVoice === true) emitBlockChunk(pendingChunk?.text ?? "", {
			...options,
			final: options?.final === true,
			sourceText: pendingChunk?.sourceText,
			sourceGeneration: pendingChunk?.sourceGeneration,
			reconciledSourceBreak: pendingChunk?.reconciledSourceBreak,
			sourceStart: pendingChunk?.sourceStart,
			sourceEnd: pendingChunk?.sourceEnd
		});
		if (pendingBlockReplyTasks.size === 0) return;
		return (async () => {
			while (pendingBlockReplyTasks.size > 0) await Promise.allSettled(pendingBlockReplyTasks);
		})();
	};
	const emitReasoningStream = (input, fallback) => {
		if (params.silentExpected) return;
		const text = typeof input === "string" ? input : input.thinking;
		const append = typeof input !== "string" && reasoningRaw !== void 0 ? readAssistantThinkingAppend(input, reasoningRaw) : void 0;
		const previousProjectedText = reasoningProjection.text;
		let projected = append !== void 0 ? reasoningProjection.append(append) : reasoningProjection.replace(text);
		reasoningRaw = text;
		if (!projected.text && fallback?.trim()) {
			projected = reasoningProjection.replace(fallback);
			reasoningRaw = void 0;
		}
		const trimmed = projected.text;
		if (!trimmed || trimmed === state.lastStreamedReasoning) return;
		const source = readAgentAssistantSource(state.lastAssistant);
		const itemId = source ? source.itemId ??= randomUUID() : void 0;
		flushAssistantStream();
		const prior = state.lastStreamedReasoning ?? "";
		const delta = previousProjectedText === prior && projected.delta !== null ? projected.delta : trimmed.startsWith(prior) ? trimmed.slice(prior.length) : trimmed;
		state.lastStreamedReasoning = trimmed;
		emitAgentEventWithAssistantSourceIfCurrent({
			runId: params.runId,
			stream: "thinking",
			data: {
				text: trimmed,
				delta,
				...itemId ? { itemId } : {}
			}
		}, source);
		if (state.streamReasoning && !shouldSuppressSourceReplyOutput({
			params,
			state
		}) && params.onReasoningStream) runBestEffortCallback({
			label: "reasoning stream",
			log,
			callback: () => params.onReasoningStream?.({
				text: trimmed,
				...state.reasoningMode === "stream" ? {} : { requiresReasoningProgressOptIn: true }
			})
		});
	};
	const resetAssistantMessageState = (nextAssistantTextBaseline) => {
		flushAssistantStream();
		state.deltaBuffer = "";
		state.streamBlockText = "";
		state.streamBlockFinal = false;
		state.blockReplyScopeStart = void 0;
		state.thinkingTagStream = createThinkingTagStreamState();
		state.deltaBufferIsCommentary = false;
		state.hasFlushedPartialText = false;
		blockChunker.reset();
		resetPartialReplyDirectives();
		state.partialBlockState = createAssistantStreamBlockState();
		state.assistantStream = void 0;
		state.currentSourceMessagingToolHeldPartial = void 0;
		state.lastBlockReplyText = void 0;
		state.lastStreamedReasoning = void 0;
		reasoningProjection = createTextProjection([trimTextFilter("both")]);
		reasoningRaw = void 0;
		state.reasoningStreamOpen = false;
		state.suppressBlockChunks = false;
		state.assistantMessageIndex += 1;
		state.lastAssistantStreamContentIndex = void 0;
		state.lastAssistantStreamItemId = void 0;
		state.assistantTextBaseline = nextAssistantTextBaseline;
	};
	return {
		consumePartialReplyDirectives,
		resetPartialReplyDirectives,
		emitBlockChunk,
		emitReasoningStream,
		flushBlockReplyBuffer,
		resetAssistantMessageState,
		stripBlockTags
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.tool-lifecycle.ts
function createEmbeddedToolLifecycleRunner(ctx) {
	return async (toolParams) => {
		ctx.flushAssistantStream();
		const startEvent = {
			type: "tool_execution_start",
			toolName: toolParams.toolName,
			toolCallId: toolParams.toolCallId,
			parentToolCallId: toolParams.parentToolCallId,
			args: toolParams.args,
			replaySafe: toolParams.replaySafe,
			hideFromChannelProgress: toolParams.hideFromChannelProgress,
			lifecycleProvenance: "nested"
		};
		recordEmbeddedToolTrajectoryEvent(ctx, startEvent, void 0);
		await handleToolExecutionStart(ctx, startEvent);
		let executionStarted = false;
		const finishToolLifecycle = async (isError, result) => {
			const wasExecuted = executionStarted;
			ctx.flushAssistantStream();
			const endEvent = {
				type: "tool_execution_end",
				toolName: toolParams.toolName,
				toolCallId: toolParams.toolCallId,
				isError,
				executionStarted: wasExecuted,
				result,
				hideFromChannelProgress: toolParams.hideFromChannelProgress
			};
			const readSanitizedResult = prepareToolResult(result);
			recordEmbeddedToolTrajectoryEvent(ctx, endEvent, readSanitizedResult);
			const terminal = await handleToolExecutionEnd(ctx, endEvent, readSanitizedResult);
			return {
				result,
				readSanitizedResult,
				isError: terminal.isError,
				executedArguments: terminal.executedArguments ?? toolParams.args,
				effectReceipt: terminal.effectReceipt
			};
		};
		let completedResult;
		try {
			completedResult = await toolParams.execute(() => {
				executionStarted = true;
			});
		} catch (error) {
			const trustedNoStart = consumeToolExecutionNotStarted(error);
			const result = buildToolLifecycleErrorResult(error);
			if (trustedNoStart) markToolExecutionNotStarted(result);
			const terminal = await finishToolLifecycle(true, result);
			await toolParams.onTerminal?.(terminal);
			throw error;
		}
		const terminal = await finishToolLifecycle(false, completedResult);
		await toolParams.onTerminal?.(terminal);
		return completedResult;
	};
}
//#endregion
//#region src/agents/embedded-agent-subscribe.ts
/**
* Subscribes to embedded-agent sessions and streams formatted replies/events.
*/
const embeddedLog = createSubsystemLogger("agent/embedded");
function resolveEmbeddedAgentSessionLogger(messageChannel) {
	const normalizedChannel = normalizeMessageChannel(messageChannel);
	if (normalizedChannel && isDeliverableMessageChannel(normalizedChannel)) return createSubsystemLogger(`gateway/channels/${normalizedChannel}`);
	return embeddedLog;
}
function subscribeEmbeddedAgentSession(input) {
	let params = input;
	const onAgentEvent = params.onAgentEvent;
	if (onAgentEvent) {
		let transcriptStartPublished = false;
		const sessionManager = params.session.sessionManager;
		params = {
			...params,
			onAgentEvent: (event) => {
				if (transcriptStartPublished || event.stream === "lifecycle" && typeof event.data.phase !== "string") return onAgentEvent(event);
				const transcriptStart = sessionManager[sessionManagerReadTranscriptStart]();
				transcriptStartPublished = true;
				return onAgentEvent({
					...event,
					transcriptStart
				});
			}
		};
	}
	const log = resolveEmbeddedAgentSessionLogger(params.messageChannel);
	const useMarkdown = (params.toolResultFormat ?? "markdown") === "markdown";
	const state = createEmbeddedAgentSubscribeState(params);
	const { captureModelEvent, recordAuxiliaryUsage, getUsageTotals, getLastAssistantUsage, getCurrentAttemptAssistant, hasSuccessfulModelResponse } = createEmbeddedModelState(params, log);
	let compactionCount = 0;
	let compactionRetry;
	const assistantTexts = state.assistantTexts;
	const toolMetas = state.toolMetas;
	const toolMetaById = state.toolMetaById;
	const toolSummaryById = state.toolSummaryById;
	const messagingToolSentTexts = state.messagingToolSentTexts;
	const messagingToolSentTextsNormalized = state.messagingToolSentTextsNormalized;
	const messagingToolSentTargets = state.messagingToolSentTargets;
	const messagingToolSentMediaUrls = state.messagingToolSentMediaUrls;
	const messagingToolSourceReplyPayloads = state.messagingToolSourceReplyPayloads;
	const didSendViaMessagingTool = () => hasCommittedMessagingToolDeliveryEvidence({
		messagingToolSentTexts,
		messagingToolSentMediaUrls,
		messagingToolSentTargets
	});
	const replyDelivery = createReplyDelivery({
		params,
		state,
		log
	});
	const { clearAssistantStream, clearDeferredBlockReplies, emitAssistantStreamData, emitBlockReply, finalizeAssistantTexts, flushAssistantStream, noteLastAssistant, releaseDeferredReplies } = replyDelivery;
	const trimMessagingToolSent = () => {
		if (messagingToolSentTexts.length > 200) {
			const overflow = messagingToolSentTexts.length - 200;
			messagingToolSentTexts.splice(0, overflow);
			messagingToolSentTextsNormalized.splice(0, overflow);
		}
		for (const history of [
			state.currentSourceMessagingToolSentTextsNormalized,
			messagingToolSentTargets,
			messagingToolSentMediaUrls,
			messagingToolSourceReplyPayloads
		]) if (history.length > 200) history.splice(0, history.length - 200);
	};
	const ensureCompactionPromise = () => {
		if (!compactionRetry) {
			compactionRetry = createDeferredCore();
			compactionRetry.promise.catch((err) => {
				log.debug(`compaction promise rejected (no waiter): ${String(err)}`);
			});
		}
	};
	const noteCompactionRetry = () => {
		state.pendingCompactionRetry += 1;
		ensureCompactionPromise();
	};
	const maybeResolveCompactionWait = () => {
		if (state.pendingCompactionRetry !== 0 || state.compactionInFlight) return;
		compactionRetry?.resolve();
		compactionRetry = void 0;
	};
	const resolveCompactionRetry = () => {
		if (state.pendingCompactionRetry <= 0) return;
		state.pendingCompactionRetry -= 1;
		maybeResolveCompactionWait();
	};
	const incrementCompactionCount = () => {
		compactionCount += 1;
	};
	const noteCompactionTokensAfter = (value) => {
		if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
		state.lastCompactionTokensAfter = Math.floor(value);
	};
	const blockChunking = params.blockReplyChunking;
	const blockChunker = new EmbeddedBlockChunker(blockChunking);
	const shouldEmitToolResult = () => typeof params.shouldEmitToolResult === "function" ? params.shouldEmitToolResult() : params.verboseLevel === "on" || params.verboseLevel === "full";
	const shouldEmitToolOutput = () => typeof params.shouldEmitToolOutput === "function" ? params.shouldEmitToolOutput() : params.verboseLevel === "full";
	const emitToolResultMessage = (toolName, message, result) => {
		if (!params.onToolResult) return;
		const parsed = parseInlineDirectives(message, {
			stripAudioTag: true,
			stripReplyTags: true
		});
		const mediaArtifact = result ? extractToolResultMediaArtifact(result) : void 0;
		const filteredMediaUrls = filterToolResultMediaUrls(toolName, mediaArtifact?.mediaUrls ?? [], result, params.trustedLocalMediaToolNames);
		if (params.sourceReplyDeliveryMode === "message_tool_only" && parsed.text && filteredMediaUrls.length === 0 && didSendViaMessagingTool()) return;
		if (!parsed.text && filteredMediaUrls.length === 0) return;
		runBestEffortCallback({
			label: "tool result",
			log,
			callback: () => params.onToolResult?.({
				text: parsed.text,
				mediaUrls: filteredMediaUrls.length ? filteredMediaUrls : void 0,
				...mediaArtifact?.audioAsVoice ? { audioAsVoice: true } : {}
			})
		});
	};
	const emitToolSummary = (toolName, meta, commandBearing) => {
		const visibleMeta = params.verboseLevel === "full" || !commandBearing ? meta : void 0;
		const agg = formatToolAggregate(toolName, visibleMeta ? [visibleMeta] : void 0, { markdown: useMarkdown });
		emitToolResultMessage(toolName, agg);
	};
	const emitToolOutput = (toolName, meta, output, result) => {
		if (!output) return;
		const agg = formatToolAggregate(toolName, meta ? [meta] : void 0, { markdown: useMarkdown });
		const trimmed = output.trim();
		const message = `${agg}\n${trimmed ? useMarkdown ? `\`\`\`txt\n${trimmed}\n\`\`\`` : trimmed : "(no output)"}`;
		emitToolResultMessage(toolName, message, result);
	};
	const streamRendering = createStreamRendering({
		params,
		state,
		log,
		blockChunker,
		emitBlockReply: replyDelivery.emitBlockReply,
		flushAssistantStream,
		pendingBlockReplyTasks: replyDelivery.pendingBlockReplyTasks,
		pushAssistantText: replyDelivery.pushAssistantText,
		shouldSkipAssistantText: replyDelivery.shouldSkipAssistantText
	});
	const resetForCompactionRetry = () => {
		state.hadDeterministicSideEffect = state.hadDeterministicSideEffect === true || didSendViaMessagingTool() || state.successfulCronAdds > 0 || state.acceptedSessionSpawns.length > 0 || state.visibleBlockReplyCount > 0;
		assistantTexts.length = 0;
		state.answerSegments.length = 0;
		state.inputAnswer = void 0;
		state.keptAnswer = void 0;
		state.lastAssistant = void 0;
		state.lastAssistantTextMessageIndex = -1;
		state.lastAssistantTextContentIndex = void 0;
		state.lastAssistantTextItemId = void 0;
		state.lastAssistantTextNormalized = void 0;
		state.lastAssistantTextTrimmed = void 0;
		toolMetas.length = 0;
		toolMetaById.clear();
		toolSummaryById.clear();
		state.liveEditDiffStateById.clear();
		state.itemActiveIds.clear();
		state.itemStartedCount = 0;
		state.itemCompletedCount = 0;
		if (state.lastToolError?.mutatingAction !== true) state.lastToolError = void 0;
		messagingToolSentTexts.length = 0;
		messagingToolSentTextsNormalized.length = 0;
		state.currentSourceMessagingToolSentTextsNormalized.length = 0;
		messagingToolSentTargets.length = 0;
		messagingToolSentMediaUrls.length = 0;
		state.pendingToolMediaUrls = [];
		state.pendingToolMediaAttachments = [];
		state.pendingToolMediaTrustByUrl.clear();
		state.toolAutoDeliveryMediaUrls.clear();
		state.pendingToolAudioAsVoice = false;
		state.pendingToolMediaDeliveryFailed = false;
		state.visibleBlockReplyCount = 0;
		state.deferBlockReplyDelivery = typeof params.onBeforeTerminalDelivery === "function" && params.deferTerminalDelivery !== false;
		clearAssistantStream();
		clearDeferredBlockReplies();
		state.deterministicApprovalPromptPending = false;
		state.deterministicApprovalPromptSent = false;
		state.lastDeliveredBlockReplyText = void 0;
		state.lastReasoningSent = void 0;
		state.toolExecutionSinceLastBlockReply = false;
		state.replayState = mergeEmbeddedRunReplayState(state.replayState, params.initialReplayState);
		state.livenessState = "working";
		streamRendering.resetAssistantMessageState(0);
	};
	const flushPartialAssistantText = () => {
		const text = state.deltaBuffer;
		if (!text) return;
		if (state.deltaBufferIsCommentary) {
			state.hasFlushedPartialText = false;
			return;
		}
		const visibleText = stripDowngradedToolCallText(streamRendering.stripBlockTags(text, createAssistantStreamBlockState(), { final: true })).trimEnd();
		if (assistantTexts.length > state.assistantTextBaseline || state.hasFlushedPartialText) replyDelivery.replaceCurrentAssistantText(visibleText);
		else if (visibleText) replyDelivery.pushAssistantText(visibleText);
		state.hasFlushedPartialText = Boolean(visibleText);
	};
	const ctx = {
		...streamRendering,
		params,
		state,
		log,
		blockChunking,
		blockChunker,
		hookRunner: params.hookRunner,
		builtinToolNames: params.builtinToolNames,
		trustedLocalMediaToolNames: params.trustedLocalMediaToolNames,
		noteLastAssistant,
		shouldEmitToolResult,
		shouldEmitToolOutput,
		emitToolSummary,
		emitToolOutput,
		emitAssistantStreamData,
		emitBlockReply,
		flushAssistantStream,
		releaseDeferredReplies,
		clearAssistantStream,
		clearDeferredBlockReplies,
		resetForCompactionRetry,
		finalizeAssistantTexts,
		trimMessagingToolSent,
		consumeToolSendReceipt: (toolCallId) => consumeEmbeddedToolReceipt(params.session.sessionManager, toolCallId),
		ensureCompactionPromise,
		noteCompactionRetry,
		resolveCompactionRetry,
		maybeResolveCompactionWait,
		captureModelEvent,
		incrementCompactionCount,
		noteCompactionTokensAfter,
		getUsageTotals,
		getLastAssistantUsage,
		getCompactionCount: () => compactionCount,
		getLastCompactionTokensAfter: () => state.lastCompactionTokensAfter
	};
	const removeSourceReplyTerminalHook = installToolAuthoredSourceReplyTerminalHook({
		agent: params.session.agent,
		sourceReplyCapableToolNames: params.sourceReplyCapableToolNames,
		idempotencyScope: params.runId,
		onSourceReplies: (payloads) => {
			state.messagingToolSourceReplyPayloads.push(...payloads);
		}
	});
	const sessionUnsubscribe = params.session.subscribe(createEmbeddedAgentSessionEventHandler(ctx));
	setSessionModelUsageSink(params.session.sessionManager, recordAuxiliaryUsage);
	const unsubscribe = () => {
		if (state.unsubscribed) return;
		state.unsubscribed = true;
		removeSourceReplyTerminalHook();
		clearAssistantStream();
		cleanupRunToolStartData(params.runId);
		state.liveEditDiffStateById.clear();
		if (compactionRetry) {
			log.debug(`unsubscribe: rejecting compaction wait runId=${params.runId}`);
			const { reject } = compactionRetry;
			compactionRetry = void 0;
			reject(createAbortError("Unsubscribed during compaction"));
		}
		if (params.session.isCompacting) {
			log.debug(`unsubscribe: aborting in-flight compaction runId=${params.runId}`);
			try {
				params.session.abortCompaction();
			} catch (err) {
				log.warn(`unsubscribe: compaction abort failed runId=${params.runId} err=${String(err)}`);
			}
		}
		setSessionModelUsageSink(params.session.sessionManager, null);
		sessionUnsubscribe();
	};
	return {
		assistantTexts,
		answerSegments: state.answerSegments,
		getCurrentAttemptAssistant,
		getKeptAnswer: () => state.keptAnswer,
		hasSuccessfulModelResponse,
		getLastAssistantTextMessageIndex: () => state.lastAssistantTextMessageIndex >= 0 ? state.lastAssistantTextMessageIndex : void 0,
		toolMetas,
		getAcceptedSessionSpawns: () => state.acceptedSessionSpawns.slice(),
		getLatestMcpAppChannelView: () => state.latestMcpAppChannelView ? { ...state.latestMcpAppChannelView } : void 0,
		getLatestMcpConnectAction: () => state.latestMcpConnectAction ? { ...state.latestMcpConnectAction } : void 0,
		runToolLifecycle: createEmbeddedToolLifecycleRunner(ctx),
		unsubscribe,
		setTerminalLifecycleMeta: (meta) => {
			if (typeof meta.replayInvalid === "boolean") state.replayState = {
				...state.replayState,
				replayInvalid: meta.replayInvalid
			};
			if (meta.livenessState) state.livenessState = meta.livenessState;
			if (typeof meta.stopReason === "string") state.terminalStopReason = meta.stopReason;
			if (typeof meta.yielded === "boolean") state.yielded = meta.yielded;
			if (meta.timeoutPhase) state.timeoutPhase = meta.timeoutPhase;
			if (typeof meta.providerStarted === "boolean") state.providerStarted = meta.providerStarted;
			if (typeof meta.aborted === "boolean") state.terminalAborted = meta.aborted;
		},
		isCompacting: () => state.compactionInFlight || state.pendingCompactionRetry > 0,
		isCompactionInFlight: () => state.compactionInFlight,
		getMessagingToolSentTexts: () => messagingToolSentTexts.slice(),
		getMessagingToolSentMediaUrls: () => messagingToolSentMediaUrls.slice(),
		getMessagingToolSentTargets: () => messagingToolSentTargets.slice(),
		getMessagingToolSourceReplyPayloads: () => messagingToolSourceReplyPayloads.slice(),
		getSourceReplyDelivered: () => state.sourceReplyDelivered,
		getSourceReplyDeliveryState: () => state.sourceReplyDeliveryState,
		endsWithSourceProgress: () => state.lastToolTurnOnlySourceProgress === true,
		getHeartbeatToolResponse: () => state.heartbeatToolResponse ? { ...state.heartbeatToolResponse } : void 0,
		getPendingToolMediaReply: () => readPendingToolMediaReply(state),
		getToolAutoDeliveryMediaUrls: () => [...state.toolAutoDeliveryMediaUrls],
		hasToolMediaBlockReply: () => state.hasToolMediaBlockReply,
		getVisibleBlockReplyCount: () => state.visibleBlockReplyCount,
		getSuccessfulCronAdds: () => state.successfulCronAdds,
		getReplayState: () => ({ ...state.replayState }),
		didSendViaMessagingTool,
		didSendDeterministicApprovalPrompt: () => state.deterministicApprovalPromptSent,
		getLastToolError: () => state.lastToolError ? { ...state.lastToolError } : void 0,
		getUsageTotals,
		getLastAssistantUsage,
		getCompactionCount: () => compactionCount,
		getLastCompactionTokensAfter: () => state.lastCompactionTokensAfter,
		getAssistantTurnCount: () => state.assistantTurnCount,
		waitForPendingEvents: replyDelivery.waitForPendingEvents,
		flushPartialAssistantText,
		getItemLifecycle: () => ({
			startedCount: state.itemStartedCount,
			completedCount: state.itemCompletedCount,
			activeCount: state.itemActiveIds.size
		}),
		waitForCompactionRetry: () => {
			if (state.unsubscribed) return Promise.reject(createAbortError("Unsubscribed during compaction wait"));
			if (state.compactionInFlight || state.pendingCompactionRetry > 0) {
				ensureCompactionPromise();
				return compactionRetry?.promise ?? Promise.resolve();
			}
			return new Promise((resolve, reject) => {
				queueMicrotask(() => {
					if (state.unsubscribed) {
						reject(createAbortError("Unsubscribed during compaction wait"));
						return;
					}
					if (state.compactionInFlight || state.pendingCompactionRetry > 0) {
						ensureCompactionPromise();
						(compactionRetry?.promise ?? Promise.resolve()).then(resolve, reject);
					} else resolve();
				});
			});
		}
	};
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
	const { modelRegistry, settingsManager, sessionManager } = options;
	const cwd = options.cwd ?? sessionManager.getCwd();
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
	const convertToLlmWithBlockImages = (messages) => {
		const converted = convertToLlm(messages);
		if (!settingsManager.getBlockImages()) return converted;
		return converted.map((msg) => {
			if (msg.role !== "user" && msg.role !== "toolResult") return msg;
			const content = msg.content;
			if (!Array.isArray(content) || !content.some((c) => c.type === "image")) return msg;
			const filteredContent = content.map((c) => c.type === "image" ? {
				type: "text",
				text: "Image reading is disabled."
			} : c).filter((c, i, arr) => {
				const previous = arr.at(i - 1);
				return !(c.type === "text" && c.text === "Image reading is disabled." && i > 0 && previous?.type === "text" && previous.text === "Image reading is disabled.");
			});
			return Object.assign({}, msg, { content: filteredContent });
		});
	};
	const extensionRunnerRef = {};
	const runWithSessionWriteSettlement = async (run) => options.withSessionWriteSettlement ? await options.withSessionWriteSettlement(run) : await run();
	const modelRegistryRuntime = getModelRegistryRuntime(modelRegistry);
	const agent = new Agent({
		initialState: {
			systemPrompt: options.systemPrompt,
			model,
			thinkingLevel,
			tools: []
		},
		convertToLlm: convertToLlmWithBlockImages,
		streamFn: async (modelResult, context, optionsLocal) => {
			const auth = await modelRegistry.getApiKeyAndHeaders(modelResult);
			if (!auth.ok) throw new Error(auth.error);
			await import("./ai-transport-runtime-host-GelzpX4Y.mjs");
			optionsLocal?.signal?.throwIfAborted();
			const providerRetrySettings = settingsManager.getProviderRetrySettings();
			const attributionHeaders = getAttributionHeaders(modelResult, settingsManager);
			const providerOptions = {
				...optionsLocal,
				openclawThinkingExplicit: options.thinkingExplicit,
				apiKey: auth.apiKey,
				timeoutMs: optionsLocal?.timeoutMs ?? providerRetrySettings.timeoutMs,
				maxRetryDelayMs: optionsLocal?.maxRetryDelayMs ?? providerRetrySettings.maxRetryDelayMs,
				headers: attributionHeaders || auth.headers || optionsLocal?.headers ? {
					...attributionHeaders,
					...auth.headers,
					...optionsLocal?.headers
				} : void 0
			};
			return modelRegistryRuntime.llmRuntime.streamSimple(modelResult, context, providerOptions);
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
	setInternalBeforeToolBatch(agent, options.beforeToolBatch);
	if (agent.streamFn) bindStreamLlmRuntime(agent.streamFn, modelRegistryRuntime.llmRuntime);
	let metadataCommit;
	const appendInitialMetadata = (change, append) => withSessionMetadataPublication(sessionManager, change, (commit) => {
		metadataCommit = commit;
	}, append);
	const initializeMetadata = () => {
		if (hasExistingSession && hasThinkingEntry) return Promise.resolve();
		return withSessionManagerAppend(sessionManager, async () => {
			assertInitialSessionCurrent();
			if (!hasExistingSession) {
				await appendInitialMetadata({
					type: "model_change",
					provider: model.provider,
					modelId: model.id
				}, () => sessionManager.appendModelChange(model.provider, model.id));
				assertInitialSessionCurrent();
			}
			await appendInitialMetadata({
				type: "thinking_level_change",
				thinkingLevel
			}, () => sessionManager.appendThinkingLevelChange(thinkingLevel));
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
	return { session: new AgentSession({
		...options,
		agent,
		cwd,
		allowedToolNames: options.tools,
		extensionRunnerRef
	}) };
}
//#endregion
export { hasAsyncActivity as C, shouldContinueInteractiveAcceptedSessionSpawns as D, resolveCurrentAttemptAssistant as E, countActiveToolExecutions as O, buildAttemptReplayMetadata as S, isCurrentAttemptReplaySafe as T, joinAssistantTexts as _, installMessageToolTerminalHook as a, observeReplayMetadata as b, resolveReasoningOnlyRetryInstruction as c, shouldRetrySilentErrorAssistantTurn as d, shouldTreatEmptyAssistantReplyAsSilent as f, isIncompleteTerminalAssistantTurn as g, hasComposedVisibleAnswerAfterSettledTools as h, recordEmbeddedToolReceipt as i, resolveSettledToolBatchEvidence as l, countSettledTurnDeliveryPayloads as m, subscribeEmbeddedAgentSession as n, readSubscriptionCompletionEvidence as o, classifyAssistantTurn as p, createToolTerminalObserver as r, resolveEmptyResponseRetryInstruction as s, createAgentSession as t, resolveSettledToolTerminalContinuationInstruction as u, isStrictAgenticExecutionContractActive as v, hasAttemptTerminalState as w, replayMetadataFromState as x, createEmbeddedRunReplayState as y };
