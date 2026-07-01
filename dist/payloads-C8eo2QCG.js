import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as isCronSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { m as setReplyPayloadMetadata, p as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-HLWc9ssO.js";
import { r as formatRawAssistantErrorForUi } from "./assistant-error-format-CuUvHfKt.js";
import { l as isRawApiErrorPayload, o as getApiErrorPayloadFingerprint, t as BILLING_ERROR_USER_MESSAGE } from "./sanitize-user-facing-text-CRgdQ8Wr.js";
import { i as isSilentReplyPayloadText } from "./tokens-Zsy11rTo.js";
import { t as extractAssistantTextForPhase } from "./chat-message-content-DjYNz8gU.js";
import { t as parseInlineDirectives } from "./directive-tags-B64FytPi.js";
import { c as formatAssistantErrorText, l as formatUserFacingAssistantErrorText } from "./errors-C4-qHiKh.js";
import { a as hasReplyPayloadContent } from "./payload-BCsfdv86.js";
import { i as createHeartbeatToolResponsePayload } from "./heartbeat-tool-response-lbHtsids.js";
import { s as normalizeTextForComparison } from "./embedded-agent-helpers-D_zioqUQ.js";
import { M as formatToolAggregate } from "./streaming-DDEnlnFD.js";
import { f as parseReplyDirectives } from "./payloads-DE8cWmMT.js";
import { i as extractAssistantVisibleText, r as extractAssistantThinking } from "./embedded-agent-utils-B9lC4_IJ.js";
import { n as isLikelyMutatingToolName } from "./tool-mutation-BioMabQh.js";
//#region src/agents/tool-error-summary.ts
/**
* Compact tool error summary types.
*
* Stores failure metadata used by transcripts, retry behavior, and mutation recovery logic.
*/
const EXEC_LIKE_TOOL_NAMES = new Set(["exec", "bash"]);
/** Detects shell-execution tools that share retry and mutation semantics. */
function isExecLikeToolName(toolName) {
	return EXEC_LIKE_TOOL_NAMES.has(normalizeOptionalLowercaseString(toolName) ?? "");
}
//#endregion
//#region src/agents/embedded-agent-runner/run/payloads.ts
/**
* Builds embedded-agent payload objects from attempt inputs and outcomes.
*/
const RECOVERABLE_TOOL_ERROR_KEYWORDS = [
	"required",
	"missing",
	"invalid",
	"must be",
	"must have",
	"needs",
	"requires"
];
const MUTATING_FAILURE_ACTION_PATTERN = "(?:write|edit|update|save|create|delete|remove|modify|change|apply|patch|move|rename|send|reply|message|run|execute|execution|command|script|shell|bash|exec|tool|action|operation)";
const MUTATING_FAILURE_INABILITY_PATTERN = new RegExp(`\\b(?:couldn't|could not|can't|cannot|unable to|am unable to|wasn't able to|was not able to|were unable to)\\b.{0,100}\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b`, "u");
const MUTATING_FAILURE_ACTION_THEN_FAILURE_PATTERN = new RegExp(`\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b.{0,100}\\b(?:failed|failure|errored)\\b`, "u");
const MUTATING_FAILURE_FAILURE_THEN_ACTION_PATTERN = new RegExp(`\\b(?:failed|failure)\\b.{0,100}\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b`, "u");
const MUTATING_FAILURE_ERROR_WHILE_ACTION_PATTERN = new RegExp(`\\b(?:hit|encountered|ran into)\\b.{0,60}\\berror\\b.{0,100}\\b(?:while|trying to|when)\\b.{0,100}\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b`, "u");
const DID_NOT_FAIL_PATTERN = /\b(?:did not|didn't)\s+fail\b/u;
const NEGATED_FAILURE_PATTERN = /\b(?:no|not|without)\s+(?:failures?|errors?)\b/u;
function isRecoverableToolError(error) {
	const errorLower = normalizeOptionalLowercaseString(error) ?? "";
	return RECOVERABLE_TOOL_ERROR_KEYWORDS.some((keyword) => errorLower.includes(keyword));
}
function hasExplicitMutatingToolFailureAcknowledgement(text) {
	const normalizedText = normalizeTextForComparison(text);
	if (!normalizedText) return false;
	if (DID_NOT_FAIL_PATTERN.test(normalizedText)) return false;
	if (MUTATING_FAILURE_INABILITY_PATTERN.test(normalizedText)) return true;
	if (NEGATED_FAILURE_PATTERN.test(normalizedText)) return false;
	return MUTATING_FAILURE_ACTION_THEN_FAILURE_PATTERN.test(normalizedText) || MUTATING_FAILURE_FAILURE_THEN_ACTION_PATTERN.test(normalizedText) || MUTATING_FAILURE_ERROR_WHILE_ACTION_PATTERN.test(normalizedText);
}
function isVerboseToolDetailEnabled(level) {
	return level === "full";
}
function resolveRawAssistantAnswerText(lastAssistant) {
	if (!lastAssistant) return "";
	return normalizeOptionalString(extractAssistantTextForPhase(lastAssistant, { phase: "final_answer" }) ?? extractAssistantTextForPhase(lastAssistant)) ?? "";
}
function normalizeReplyTextForComparison(text) {
	return normalizeTextForComparison(parseReplyDirectives(text).text ?? "");
}
function shouldIncludeToolErrorDetails(params) {
	if (isVerboseToolDetailEnabled(params.verboseLevel)) return true;
	if (!isExecLikeToolName(params.lastToolError.toolName)) return false;
	if (params.isHeartbeatTrigger === true) return true;
	return params.lastToolError.timedOut === true && (params.isCronTrigger === true || isCronSessionKey(params.sessionKey));
}
function shouldMarkNonTerminalToolErrorWarning(lastToolError) {
	return lastToolError.middlewareError === true;
}
/**
* Chooses whether a tool failure needs a separate user-visible warning and
* whether to include raw details. Mutating failures are stricter because a
* silent failed write/send/delete can make the assistant look successful.
*/
function resolveToolErrorWarningPolicy(params) {
	const normalizedToolName = normalizeOptionalLowercaseString(params.lastToolError.toolName) ?? "";
	let toolErrorWarningOverride;
	let dynamicToolErrorWarningsDisabled = false;
	if (typeof params.suppressToolErrorWarnings === "function") {
		toolErrorWarningOverride = params.suppressToolErrorWarnings();
		dynamicToolErrorWarningsDisabled = toolErrorWarningOverride === false;
	} else toolErrorWarningOverride = params.suppressToolErrorWarnings;
	const includeDetails = shouldIncludeToolErrorDetails({
		...params,
		verboseLevel: dynamicToolErrorWarningsDisabled ? "off" : params.verboseLevel
	});
	if (toolErrorWarningOverride === true) return {
		showWarning: false,
		includeDetails
	};
	if (normalizedToolName === "sessions_send") return {
		showWarning: false,
		includeDetails
	};
	if (params.suppressToolErrors) return {
		showWarning: false,
		includeDetails
	};
	if (params.lastToolError.mutatingAction ?? isLikelyMutatingToolName(params.lastToolError.toolName)) return {
		showWarning: !params.hasUserFacingErrorReply && !params.hasUserFacingFailureAcknowledgement,
		includeDetails
	};
	if (isExecLikeToolName(params.lastToolError.toolName) && !includeDetails) return {
		showWarning: false,
		includeDetails
	};
	return {
		showWarning: !params.hasUserFacingReply && !isRecoverableToolError(params.lastToolError.error),
		includeDetails
	};
}
/**
* Converts a completed embedded attempt into reply payloads for channels. This
* is the boundary that suppresses duplicate source replies, filters raw API
* errors, preserves directive metadata, and decides when tool failures must be
* surfaced to the user.
*/
function buildEmbeddedRunPayloads(params) {
	if (params.heartbeatToolResponse) return [createHeartbeatToolResponsePayload(params.heartbeatToolResponse)];
	const replyItems = [];
	const sourceReplyPayloads = params.sourceReplyDeliveryMode === "message_tool_only" ? params.messagingToolSourceReplyPayloads ?? [] : [];
	const sourceReplyStartIndex = replyItems.length;
	sourceReplyPayloads.forEach((payload, index) => {
		const text = normalizeOptionalString(payload.text) ?? "";
		const media = Array.from(new Set([...payload.mediaUrl ? [payload.mediaUrl] : [], ...payload.mediaUrls ?? []])).filter((value) => value.trim().length > 0);
		if (!text && media.length === 0 && !payload.presentation && !payload.interactive && !payload.channelData) return;
		replyItems.push({
			text,
			...payload.mediaUrl ? { mediaUrl: payload.mediaUrl } : {},
			...media.length ? { media } : {},
			...payload.audioAsVoice ? { audioAsVoice: true } : {},
			...payload.presentation ? { presentation: payload.presentation } : {},
			...payload.interactive ? { interactive: payload.interactive } : {},
			...payload.channelData ? { channelData: payload.channelData } : {},
			sourceReplyMirror: { idempotencyKey: payload.idempotencyKey ?? (params.runId ? `${params.runId}:internal-source-reply:${index}` : void 0) }
		});
	});
	const hasSourceReplyPayload = replyItems.length > sourceReplyStartIndex;
	const deliveredSourceReplyViaMessageTool = params.sourceReplyDeliveryMode === "message_tool_only" && params.didDeliverSourceReplyViaMessageTool === true;
	const useMarkdown = params.toolResultFormat === "markdown";
	const suppressAssistantArtifacts = params.didSendDeterministicApprovalPrompt === true || hasSourceReplyPayload || deliveredSourceReplyViaMessageTool;
	const nonEmptyAssistantTexts = params.assistantTexts.filter((text) => text.trim().length > 0);
	const assistantForPayload = params.currentAssistant ?? void 0 ?? (nonEmptyAssistantTexts.length === 1 ? void 0 : params.lastAssistant);
	const lastAssistantStopReason = assistantForPayload?.stopReason;
	const lastAssistantErrored = lastAssistantStopReason === "error";
	const lastAssistantAborted = lastAssistantStopReason === "aborted";
	const runAborted = params.runAborted === true || lastAssistantAborted;
	const lastAssistantNeedsErrorSurface = lastAssistantErrored || lastAssistantAborted;
	const rawErrorMessage = lastAssistantNeedsErrorSurface ? normalizeOptionalString(assistantForPayload?.errorMessage) : void 0;
	const errorText = assistantForPayload && lastAssistantNeedsErrorSurface ? suppressAssistantArtifacts ? void 0 : lastAssistantErrored || rawErrorMessage ? formatUserFacingAssistantErrorText(assistantForPayload, {
		cfg: params.config,
		sessionKey: params.sessionKey,
		provider: params.provider,
		model: params.model,
		authMode: params.authMode
	}) : formatAssistantErrorText(assistantForPayload, {
		cfg: params.config,
		sessionKey: params.sessionKey,
		provider: params.provider,
		model: params.model,
		authMode: params.authMode
	}) : void 0;
	const rawErrorFingerprint = rawErrorMessage ? getApiErrorPayloadFingerprint(rawErrorMessage) : null;
	const formattedRawErrorMessage = rawErrorMessage ? formatRawAssistantErrorForUi(rawErrorMessage) : null;
	const normalizedFormattedRawErrorMessage = formattedRawErrorMessage ? normalizeTextForComparison(formattedRawErrorMessage) : null;
	const normalizedRawErrorText = rawErrorMessage ? normalizeTextForComparison(rawErrorMessage) : null;
	const normalizedErrorText = errorText ? normalizeTextForComparison(errorText) : null;
	const normalizedGenericBillingErrorText = normalizeTextForComparison(BILLING_ERROR_USER_MESSAGE);
	const genericErrorText = "The AI service returned an error. Please try again.";
	if (errorText) replyItems.push({
		text: errorText,
		isError: true
	});
	if (params.inlineToolResultsAllowed && params.verboseLevel !== "off" && params.toolMetas.length > 0) for (const { toolName, meta } of params.toolMetas) {
		const parsedAggregate = parseInlineDirectives(formatToolAggregate(toolName, meta ? [meta] : [], { markdown: useMarkdown }), {
			stripAudioTag: true,
			stripReplyTags: true
		});
		const cleanedText = parsedAggregate.text;
		if (cleanedText) replyItems.push({
			text: cleanedText,
			audioAsVoice: parsedAggregate.audioAsVoice,
			replyToId: parsedAggregate.replyToId,
			replyToTag: parsedAggregate.hasReplyTag,
			replyToCurrent: parsedAggregate.replyToCurrent
		});
	}
	const reasoningText = suppressAssistantArtifacts || runAborted ? "" : assistantForPayload && params.reasoningLevel === "on" && params.thinkingLevel !== "off" ? extractAssistantThinking(assistantForPayload) : "";
	if (reasoningText) replyItems.push({
		text: reasoningText,
		isReasoning: true
	});
	const fallbackAnswerText = assistantForPayload ? extractAssistantVisibleText(assistantForPayload) : "";
	const fallbackRawAnswerText = resolveRawAssistantAnswerText(assistantForPayload);
	const shouldSuppressRawErrorText = (text) => {
		if (!lastAssistantNeedsErrorSurface) return false;
		const trimmed = text.trim();
		if (!trimmed) return false;
		if (errorText) {
			const normalized = normalizeTextForComparison(trimmed);
			if (normalized && normalizedErrorText && normalized === normalizedErrorText) return true;
			if (trimmed === genericErrorText) return true;
			if (normalized && normalizedGenericBillingErrorText && normalized === normalizedGenericBillingErrorText) return true;
		}
		if (rawErrorMessage && trimmed === rawErrorMessage) return true;
		if (formattedRawErrorMessage && trimmed === formattedRawErrorMessage) return true;
		if (normalizedRawErrorText) {
			const normalized = normalizeTextForComparison(trimmed);
			if (normalized && normalized === normalizedRawErrorText) return true;
		}
		if (normalizedFormattedRawErrorMessage) {
			const normalized = normalizeTextForComparison(trimmed);
			if (normalized && normalized === normalizedFormattedRawErrorMessage) return true;
		}
		if (rawErrorFingerprint) {
			const fingerprint = getApiErrorPayloadFingerprint(trimmed);
			if (fingerprint && fingerprint === rawErrorFingerprint) return true;
		}
		return isRawApiErrorPayload(trimmed);
	};
	const rawAnswerDirectiveState = fallbackRawAnswerText ? parseReplyDirectives(fallbackRawAnswerText) : null;
	const rawAnswerHasMedia = (rawAnswerDirectiveState?.mediaUrls?.length ?? 0) > 0 || rawAnswerDirectiveState?.audioAsVoice;
	const assistantTextsHaveMedia = params.assistantTexts.some((text) => {
		const parsed = parseReplyDirectives(text);
		return (parsed.mediaUrls?.length ?? 0) > 0 || parsed.audioAsVoice;
	});
	const normalizedAssistantTexts = normalizeTextForComparison(nonEmptyAssistantTexts.join("\n\n"));
	const normalizedRawAnswerText = normalizeTextForComparison(rawAnswerDirectiveState?.text ?? "");
	const shouldPreferRawAnswerText = rawAnswerHasMedia && (!nonEmptyAssistantTexts.length || !assistantTextsHaveMedia && normalizedAssistantTexts.length > 0 && normalizedAssistantTexts === normalizedRawAnswerText);
	const fallbackAnswerSourceText = shouldPreferRawAnswerText && fallbackRawAnswerText ? fallbackRawAnswerText : fallbackAnswerText;
	const normalizedFallbackAnswerSourceText = fallbackAnswerSourceText ? normalizeReplyTextForComparison(fallbackAnswerSourceText) : "";
	const shouldUseCanonicalFinalAnswer = !lastAssistantNeedsErrorSurface && fallbackAnswerSourceText.length > 0 && normalizedFallbackAnswerSourceText.length > 0;
	const hasAssistantTextPayload = nonEmptyAssistantTexts.length > 0;
	const answerTexts = suppressAssistantArtifacts || runAborted ? [] : (shouldUseCanonicalFinalAnswer ? [fallbackAnswerSourceText] : shouldPreferRawAnswerText && fallbackRawAnswerText ? [fallbackRawAnswerText] : hasAssistantTextPayload ? nonEmptyAssistantTexts : fallbackAnswerText ? [fallbackAnswerText] : []).filter((text) => !shouldSuppressRawErrorText(text));
	let hasUserFacingAssistantReply = hasSourceReplyPayload || deliveredSourceReplyViaMessageTool;
	const hasUserFacingErrorReply = replyItems.some((item) => item.isError === true);
	let hasUserFacingFailureAcknowledgement = false;
	for (const text of answerTexts) {
		const { text: cleanedText, mediaUrls, audioAsVoice, replyToId, replyToTag, replyToCurrent } = parseReplyDirectives(text);
		if (!cleanedText && (!mediaUrls || mediaUrls.length === 0) && !audioAsVoice) continue;
		replyItems.push({
			text: cleanedText,
			media: mediaUrls,
			audioAsVoice,
			replyToId,
			replyToTag,
			replyToCurrent
		});
		hasUserFacingAssistantReply = true;
		if (cleanedText && hasExplicitMutatingToolFailureAcknowledgement(cleanedText)) hasUserFacingFailureAcknowledgement = true;
	}
	if (params.lastToolError) {
		const warningPolicy = resolveToolErrorWarningPolicy({
			lastToolError: params.lastToolError,
			hasUserFacingReply: hasUserFacingAssistantReply,
			hasUserFacingErrorReply,
			hasUserFacingFailureAcknowledgement,
			suppressToolErrors: Boolean(params.config?.messages?.suppressToolErrors),
			suppressToolErrorWarnings: params.suppressToolErrorWarnings,
			isCronTrigger: params.isCronTrigger,
			isHeartbeatTrigger: params.isHeartbeatTrigger,
			sessionKey: params.sessionKey,
			verboseLevel: params.verboseLevel
		});
		if (warningPolicy.showWarning) {
			const warningText = `⚠️ ${formatToolAggregate(params.lastToolError.toolName, params.lastToolError.meta ? [params.lastToolError.meta] : void 0, { markdown: useMarkdown })} failed${warningPolicy.includeDetails && params.lastToolError.error ? `: ${params.lastToolError.error}` : ""}`;
			const normalizedWarning = normalizeTextForComparison(warningText);
			if (!(normalizedWarning ? replyItems.some((item) => {
				if (!item.text) return false;
				const normalizedExisting = normalizeTextForComparison(item.text);
				return normalizedExisting.length > 0 && normalizedExisting === normalizedWarning;
			}) : false)) replyItems.push({
				text: warningText,
				isError: true,
				nonTerminalToolErrorWarning: hasUserFacingAssistantReply && shouldMarkNonTerminalToolErrorWarning(params.lastToolError)
			});
		}
	}
	const hasAudioAsVoiceTag = replyItems.some((item) => item.audioAsVoice);
	return replyItems.map((item) => {
		const payload = { text: normalizeOptionalString(item.text) };
		const mediaUrl = item.mediaUrl ?? item.media?.[0];
		if (mediaUrl) payload.mediaUrl = mediaUrl;
		if (item.media?.length) payload.mediaUrls = item.media;
		if (item.isError !== void 0) payload.isError = item.isError;
		if (item.nonTerminalToolErrorWarning) setReplyPayloadMetadata(payload, { nonTerminalToolErrorWarning: true });
		if (!item.isError && !item.isReasoning && params.assistantMessageIndex !== void 0) setReplyPayloadMetadata(payload, { assistantMessageIndex: params.assistantMessageIndex });
		if (item.replyToId) payload.replyToId = item.replyToId;
		if (item.replyToTag !== void 0) payload.replyToTag = item.replyToTag;
		if (item.replyToCurrent !== void 0) payload.replyToCurrent = item.replyToCurrent;
		if (item.audioAsVoice || Boolean(hasAudioAsVoiceTag && item.media?.length)) payload.audioAsVoice = true;
		if (item.presentation) payload.presentation = item.presentation;
		if (item.interactive) payload.interactive = item.interactive;
		if (item.channelData) payload.channelData = item.channelData;
		if (item.sourceReplyMirror) {
			markReplyPayloadForSourceSuppressionDelivery(payload);
			if (params.sessionKey) {
				const sourceReplyTranscriptMirror = { sessionKey: params.sessionKey };
				if (params.agentId) sourceReplyTranscriptMirror.agentId = params.agentId;
				if (payload.text) sourceReplyTranscriptMirror.text = payload.text;
				if (payload.mediaUrls?.length) sourceReplyTranscriptMirror.mediaUrls = payload.mediaUrls;
				if (item.sourceReplyMirror.idempotencyKey) sourceReplyTranscriptMirror.idempotencyKey = item.sourceReplyMirror.idempotencyKey;
				setReplyPayloadMetadata(payload, { sourceReplyTranscriptMirror });
			}
		}
		if (payload.text && isSilentReplyPayloadText(payload.text, "NO_REPLY")) {
			const silentText = payload.text;
			payload.text = void 0;
			if (hasReplyPayloadContent(payload)) return payload;
			payload.text = silentText;
		}
		return payload;
	}).filter((p) => {
		if (!hasReplyPayloadContent(p)) return false;
		if (p.text && isSilentReplyPayloadText(p.text, "NO_REPLY")) return false;
		return true;
	});
}
//#endregion
export { isExecLikeToolName as n, buildEmbeddedRunPayloads as t };
