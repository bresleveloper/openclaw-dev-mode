import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.mjs";
import { o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { a as isSilentReplyPayloadText, n as HEARTBEAT_TOKEN } from "./tokens-D4ghQG_g.mjs";
import { o as hasReplyPayloadContent } from "./payload-DfZ7JVGs.mjs";
import { E as setReplyPayloadMetadata, S as markReplyPayloadForSourceSuppressionDelivery, c as getReplyPayloadMetadata, n as addReplyPayloadMediaFailures, o as copyReplyPayloadMetadata, u as hasReplyPayloadSpeechContent } from "./reply-payload-NzglYOOT.mjs";
import { m as isTimeoutErrorMessage } from "./message-patterns-Oyttjfxg.mjs";
import { c as trimTextPreservingCode } from "./text-projection-BTFPDH-Z.mjs";
import { i as createHeartbeatToolResponsePayload } from "./heartbeat-tool-response-BAjLTEaX.mjs";
import { t as parseReplyDirectives } from "./reply-directives-Ciui4dZv.mjs";
import "./classify-kizCSGkY.mjs";
import { n as classifyAssistantFailoverReason } from "./assistant-message-failures-BLQdlE0c.mjs";
import { h as formatUserFacingAssistantErrorText, m as formatAssistantErrorText } from "./embedded-agent-helpers-B7llO2Rm.mjs";
import { r as normalizeTextForComparison } from "./messaging-dedupe-BZwL08kZ.mjs";
import { t as buildProviderLoginRecovery } from "./provider-login-recovery-gHCWblhB.mjs";
import { o as resolveToolDisplay } from "./tool-display-B85JC1BH.mjs";
import { n as formatToolAggregateParts } from "./tool-meta-usuYe6-z.mjs";
import { r as isExecLikeToolName } from "./tool-error-summary-64MNk8zq.mjs";
import { _ as hasVisibleCommittedMessagingToolDeliveryEvidence, f as hasCompletedMessagingToolDeliveryEvidence, y as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-BEVHUW11.mjs";
import { a as extractAssistantThinking, m as sanitizeAssistantVisibleStreamText, o as extractAssistantVisibleText } from "./embedded-agent-utils-BYhIvAvm.mjs";
import { t as resolveRawAssistantAnswerText } from "./assistant-answer-text-BDCP6yWU.mjs";
//#region src/agents/embedded-agent-runner/run/source-reply-payloads.ts
/** Builds transcript mirrors and completion evidence for message-tool source replies. */
function buildSourceReplyPayloadState(params) {
	const sourceReplyPayloads = params.payloads ?? [];
	const replyItems = sourceReplyPayloads.flatMap((payload, index) => {
		const text = normalizeOptionalString(payload.text) ?? "";
		const media = (payload.mediaUrls?.length ? payload.mediaUrls : payload.mediaUrl ? [payload.mediaUrl] : []).filter((value) => value.trim().length > 0);
		if (!text && media.length === 0 && !payload.presentation && !payload.interactive && !payload.channelData) return [];
		const reply = markReplyPayloadForSourceSuppressionDelivery({
			text,
			...payload.mediaUrl || media[0] ? { mediaUrl: payload.mediaUrl || media[0] } : {},
			...media.length ? { mediaUrls: media } : {},
			...payload.audioAsVoice ? { audioAsVoice: true } : {},
			...payload.attachments?.length ? { attachments: payload.attachments } : {},
			...payload.trustedLocalMedia !== void 0 ? { trustedLocalMedia: payload.trustedLocalMedia } : {},
			...payload.presentation ? { presentation: payload.presentation } : {},
			...payload.interactive ? { interactive: payload.interactive } : {},
			...payload.channelData ? { channelData: payload.channelData } : {}
		});
		if (params.sessionKey) {
			const idempotencyKey = payload.idempotencyKey ?? (params.runId ? `${params.runId}:internal-source-reply:${index}` : void 0);
			setReplyPayloadMetadata(reply, { sourceReplyTranscriptMirror: {
				sessionKey: params.sessionKey,
				...params.agentId ? { agentId: params.agentId } : {},
				...text ? { text } : {},
				...media.length ? { mediaUrls: media } : {},
				...idempotencyKey ? { idempotencyKey } : {},
				...payload.transcriptOwner ? { transcriptOwner: true } : {}
			} });
		}
		return [reply];
	});
	const hasSourceReplyPayload = replyItems.length > 0;
	const deliveredSourceReplyViaMessageTool = params.sourceReplyDeliveryMode === "message_tool_only" && params.didDeliverSourceReplyViaMessageTool === true;
	return {
		replyItems,
		hasSourceReplyPayload,
		deliveredSourceReplyViaMessageTool,
		completedSourceReplyViaMessageTool: resolveExplicitFinalSourceReplyDeliveryEvidence({
			messagingToolSentTargets: params.sentTargets,
			messagingToolSourceReplyPayloads: sourceReplyPayloads
		}) ?? (hasSourceReplyPayload || deliveredSourceReplyViaMessageTool)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-error-warning.ts
function formatWarningToolLabel(toolName, metas, markdown) {
	const { label } = resolveToolDisplay({ name: toolName });
	const { detail } = formatToolAggregateParts(toolName, metas, { markdown });
	return detail ? `${label}: ${detail}` : label;
}
/** Always warn when a tool failure would otherwise leave the user with no reply. */
function buildFailureWarning(params) {
	if (params.hasUserFacingReply) return;
	const includeDetails = params.verboseLevel === "full";
	const failureVerb = params.lastToolError.executionStarted === false ? "blocked" : "failed";
	const terminalDiagnostic = params.lastToolError.terminalDiagnostic;
	if (terminalDiagnostic?.kind === "timeout") {
		const toolLabel = resolveToolDisplay({ name: params.lastToolError.toolName }).label;
		const count = terminalDiagnostic.partialResults;
		const partialSuffix = count ? `; ${count} partial ${count === 1 ? "result is" : "results are"} available` : "";
		const errorSuffix = includeDetails && params.lastToolError.error ? `: ${params.lastToolError.error}` : ".";
		return `⚠️ ${toolLabel} timed out after ${terminalDiagnostic.timeoutMs / 1e3}s${partialSuffix}${errorSuffix}`;
	}
	if (terminalDiagnostic?.kind === "process") return `⚠️ ${formatWarningToolLabel("process", includeDetails ? [terminalDiagnostic.sessionId] : void 0, params.useMarkdown)} failed (${terminalDiagnostic.reason.kind === "exit" ? `exit ${terminalDiagnostic.reason.exitCode}` : terminalDiagnostic.reason.kind === "signal" ? `signal ${terminalDiagnostic.reason.signal}` : terminalDiagnostic.reason.timeoutKind === "no-output-timeout" ? "timed out waiting for output" : "timed out"})${includeDetails && params.lastToolError.error ? `: ${params.lastToolError.error}` : ""}.`;
	const errorSuffix = (includeDetails || params.lastToolError.errorCode === "approval_timeout") && params.lastToolError.error ? `: ${params.lastToolError.error}` : "";
	if (isExecLikeToolName(params.lastToolError.toolName)) {
		const toolLabel = resolveToolDisplay({ name: params.lastToolError.toolName }).label;
		const subject = includeDetails ? formatExecLikeFailureSubject(params.lastToolError.meta, params.useMarkdown) : "";
		const conciseExitSuffix = includeDetails ? "" : formatConciseExecExitSuffix(params.lastToolError.error);
		return `⚠️ ${toolLabel} ${failureVerb}${subject ? `: ${subject}` : ""}${conciseExitSuffix}${errorSuffix}`;
	}
	return `⚠️ ${formatWarningToolLabel(params.lastToolError.toolName, includeDetails && params.lastToolError.meta ? [params.lastToolError.meta] : void 0, params.useMarkdown)} ${failureVerb}${errorSuffix}`;
}
function formatExecLikeFailureSubject(meta, markdown) {
	const normalized = normalizeOptionalString(meta);
	if (!normalized) return "";
	const { flags, body } = splitExecLikeFailureMeta(normalized);
	if (!body) return flags.join(" · ");
	const { text, suffix } = splitDisplayContextSuffix(body);
	const command = extractLiteralExecCommand(text) ?? text;
	const subject = `${markdown ? formatInlineCodeSpan(command) : command}${suffix}`;
	return flags.length > 0 ? `${flags.join(" · ")} · ${subject}` : subject;
}
function splitExecLikeFailureMeta(meta) {
	const flags = [];
	const bodyParts = [];
	for (const part of meta.split(" · ").map((candidate) => candidate.trim()).filter(Boolean)) {
		if (part === "elevated" || part === "pty") {
			flags.push(part);
			continue;
		}
		bodyParts.push(part);
	}
	return {
		flags,
		body: bodyParts.join(" · ")
	};
}
const SEMANTIC_RUN_SUMMARIES = /* @__PURE__ */ new Set([
	"tests",
	"build",
	"lint",
	"script",
	"command"
]);
const LITERAL_RUN_SUMMARY_PREFIXES = /* @__PURE__ */ new Set([
	"python",
	"python3",
	"ruby",
	"php",
	"git",
	"npm",
	"pnpm",
	"yarn",
	"bun",
	"openclaw",
	"make",
	"cargo",
	"go",
	"docker",
	"npx",
	"uv",
	"poetry",
	"pytest",
	"vitest",
	"jest",
	"deno"
]);
function extractLiteralExecCommand(body) {
	const rawCommand = extractRawExecCommand(body);
	if (rawCommand) return rawCommand;
	const nodeScript = body.match(/^run node script (.+)$/u);
	if (nodeScript?.[1]) return `node ${nodeScript[1]}`;
	const runSubject = body.match(/^run (.+)$/u)?.[1];
	if (runSubject && isKnownLiteralRunSummary(runSubject)) return runSubject;
}
function extractRawExecCommand(body) {
	const codeSpan = extractTrailingMarkdownCodeSpan(body);
	if (!codeSpan) return;
	const context = extractRawExecContext(codeSpan.prefix, codeSpan.value);
	const command = context.trailing.reduce((value, suffix) => `${value} ${suffix}`, codeSpan.value);
	return context.leading.length > 0 ? `${context.leading.join(" · ")} · ${command}` : command;
}
function extractTrailingMarkdownCodeSpan(body) {
	const trimmed = body.trimEnd();
	if (!trimmed.endsWith("`")) return;
	let delimiterLength = 0;
	for (let index = trimmed.length - 1; index >= 0 && trimmed[index] === "`"; index -= 1) delimiterLength += 1;
	const delimiter = "`".repeat(delimiterLength);
	const valueEnd = trimmed.length - delimiterLength;
	let searchIndex = 0;
	while (searchIndex < valueEnd) {
		const openIndex = trimmed.indexOf(delimiter, searchIndex);
		if (openIndex < 0 || openIndex >= valueEnd) return;
		const prefixMatch = trimmed.slice(0, openIndex).match(/^(?:(.*)(?:,\s*| · ))?$/u);
		if (prefixMatch) return {
			prefix: prefixMatch[1],
			value: unwrapMarkdownInlineCodePadding(trimmed.slice(openIndex + delimiterLength, valueEnd))
		};
		searchIndex = openIndex + delimiterLength;
	}
}
function unwrapMarkdownInlineCodePadding(value) {
	if (value.length < 2 || !value.startsWith(" ") || !value.endsWith(" ")) return value;
	const unwrapped = value.slice(1, -1);
	return /\S/u.test(unwrapped) ? unwrapped : value;
}
function extractRawExecContext(prefix, inlineCode) {
	const value = prefix ?? "";
	return {
		leading: [...value.matchAll(/(?:^|,\s*| · )(node:\s*[^,·]+)(?=,\s*| · |$)/gu)].map((match) => match[1]?.trim()).filter((part) => Boolean(part)),
		trailing: [...value.matchAll(/(\((?:agent|repo|sandbox|workspace)\)|\(in [^)\r\n]+\))(?=\s*(?:,\s*| · |$))/gu)].filter((match) => shouldKeepRawExecTrailingContext(value, match, inlineCode)).map((match) => match[1]?.trim()).filter((part) => Boolean(part))
	};
}
function shouldKeepRawExecTrailingContext(prefix, match, inlineCode) {
	const suffix = match[1]?.trim();
	if (!suffix || inlineCode.includes(suffix)) return false;
	const segment = prefix.slice(0, match.index ?? 0).trimEnd().split(/,\s*| · /u).at(-1)?.trim();
	return (segment ? extractLiteralExecCommand(segment) : void 0) === inlineCode || segment === inlineCode || /^\((?:agent|repo|workspace)\)$/u.test(suffix) || isPathLikeCwdSuffix(suffix);
}
function isPathLikeCwdSuffix(suffix) {
	const cwd = suffix.match(/^\(in ([^)\r\n]+)\)$/u)?.[1]?.trim();
	return Boolean(cwd && (/^(?:\/|~|\.{1,2}(?:\/|$)|[A-Za-z]:[\\/]|\\\\)/u.test(cwd) || cwd.includes("/")));
}
function isKnownLiteralRunSummary(subject) {
	if (SEMANTIC_RUN_SUMMARIES.has(subject) || subject.includes("→") || subject.includes("->") || /^(?:node|python3?|ruby|php) inline script(?: \(heredoc\))?$/u.test(subject)) return false;
	const match = subject.match(/^(\S+)\s+(.+)$/u);
	const command = match?.[1];
	const remainder = match?.[2];
	if (!command || !remainder || remainder === "command") return false;
	return LITERAL_RUN_SUMMARY_PREFIXES.has(command);
}
function splitDisplayContextSuffix(value) {
	const match = /^(.*?)( \((?:agent|repo|workspace|sandbox)\))$/u.exec(value);
	if (!match) return {
		text: value,
		suffix: ""
	};
	return {
		text: match[1] ?? value,
		suffix: match[2] ?? ""
	};
}
function formatConciseExecExitSuffix(error) {
	const code = normalizeOptionalString(error)?.match(/\b(?:command\s+)?(?:failed\s+with\s+exit\s+code|exited\s+with\s+code|exit(?:ed)?\s+code|exit\s+status)\s+(-?\d+)\b/iu)?.[1];
	return code ? ` (exit ${code})` : "";
}
//#endregion
//#region src/agents/embedded-agent-runner/run/payloads.ts
/**
* Converts a completed embedded attempt into reply payloads for channels. This
* is the boundary that suppresses duplicate source replies, filters raw API
* errors, preserves directive metadata, and decides when tool failures must be
* surfaced to the user.
*/
function buildEmbeddedRunPayloads(params) {
	const heartbeatTerminalToolFailure = params.isHeartbeatTrigger === true && params.lastToolError && params.lastToolError.mutatingAction === true ? { toolName: params.lastToolError.toolName } : void 0;
	if (params.heartbeatToolResponse && !heartbeatTerminalToolFailure) return [createHeartbeatToolResponsePayload(params.heartbeatToolResponse)];
	const { replyItems, hasSourceReplyPayload, deliveredSourceReplyViaMessageTool, completedSourceReplyViaMessageTool } = buildSourceReplyPayloadState({
		payloads: params.messagingToolSourceReplyPayloads,
		sentTargets: params.messagingToolSentTargets,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		didDeliverSourceReplyViaMessageTool: params.didDeliverSourceReplyViaMessageTool,
		runId: params.runId,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (params.heartbeatToolResponse) {
		const heartbeatPayload = createHeartbeatToolResponsePayload(params.heartbeatToolResponse);
		replyItems.push({
			text: heartbeatPayload.text ?? "",
			...heartbeatPayload.channelData ? { channelData: heartbeatPayload.channelData } : {}
		});
	}
	const useMarkdown = params.toolResultFormat === "markdown";
	const suppressAssistantArtifacts = params.heartbeatToolResponse !== void 0 || params.didSendDeterministicApprovalPrompt === true || params.sourceReplyDeliveryMode === "message_tool_only" && hasSourceReplyPayload || deliveredSourceReplyViaMessageTool;
	const suppressFailureArtifacts = params.didSendDeterministicApprovalPrompt === true || params.sourceReplyDeliveryMode === "message_tool_only" && completedSourceReplyViaMessageTool;
	let hasUserFacingReply = completedSourceReplyViaMessageTool || params.heartbeatToolResponse?.notify === true;
	let hasIntentionalSilentFinal = false;
	const appendSegmentAnswer = ({ assistantTexts, lastAssistant, currentAssistant, assistantMessageIndex: terminalMessageIndex, keptAnswer }) => {
		hasIntentionalSilentFinal = false;
		const nonEmptyAssistantTexts = assistantTexts.map((text) => sanitizeAssistantVisibleStreamText(text)).filter((text) => text.trim().length > 0);
		const terminalAssistant = currentAssistant ?? (nonEmptyAssistantTexts.length === 1 ? void 0 : lastAssistant);
		const assistantForPayload = keptAnswer?.assistant ?? terminalAssistant;
		const assistantMessageIndex = keptAnswer?.messageIndex ?? terminalMessageIndex;
		const storedDelivery = assistantForPayload?.openclawDelivery;
		const lastAssistantStopReason = assistantForPayload?.stopReason;
		const lastAssistantErrored = lastAssistantStopReason === "error";
		const lastAssistantAborted = lastAssistantStopReason === "aborted";
		const runAborted = params.runAborted === true || lastAssistantAborted;
		const lastAssistantNeedsErrorSurface = lastAssistantErrored || lastAssistantAborted;
		const rawErrorMessage = lastAssistantNeedsErrorSurface ? normalizeOptionalString(assistantForPayload?.errorMessage) : void 0;
		const oauthRefreshFailure = rawErrorMessage ? classifyOAuthRefreshFailure(rawErrorMessage) : null;
		const providerLoginRecovery = buildProviderLoginRecovery({
			provider: oauthRefreshFailure?.provider ?? params.provider,
			oauthReason: oauthRefreshFailure?.reason
		});
		const errorContext = {
			cfg: params.config,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			provider: params.provider,
			providerOwner: params.providerOwner,
			model: params.model,
			authMode: params.authMode
		};
		const errorText = assistantForPayload && lastAssistantNeedsErrorSurface ? suppressFailureArtifacts ? void 0 : lastAssistantErrored || rawErrorMessage ? providerLoginRecovery?.hint ?? formatUserFacingAssistantErrorText(assistantForPayload, errorContext) : formatAssistantErrorText(assistantForPayload, errorContext) : void 0;
		const deferAssistantTimeoutError = params.deferAssistantTimeoutError === true && rawErrorMessage !== void 0 && isTimeoutErrorMessage(rawErrorMessage) && errorText === "LLM request timed out.";
		if (errorText && !deferAssistantTimeoutError) {
			const errorPayload = {
				text: errorText,
				isError: true,
				...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {}
			};
			replyItems.push(setReplyPayloadMetadata(errorPayload, {
				terminalProviderError: true,
				...assistantForPayload && (rawErrorMessage || assistantForPayload.errorCode || assistantForPayload.errorType || assistantForPayload.errorBody) ? { providerFailure: {
					reason: classifyAssistantFailoverReason(assistantForPayload, errorContext),
					rawError: rawErrorMessage
				} } : {}
			}));
		}
		const reasoningText = suppressAssistantArtifacts || runAborted || lastAssistantNeedsErrorSurface ? "" : terminalAssistant && params.reasoningLevel === "on" && params.thinkingLevel !== "off" ? extractAssistantThinking(terminalAssistant) : "";
		if (reasoningText) replyItems.push({
			text: reasoningText,
			isReasoning: true
		});
		hasUserFacingReply ||= Boolean(errorText);
		if (!suppressAssistantArtifacts && !runAborted && !lastAssistantNeedsErrorSurface) {
			const fallbackAnswerText = assistantForPayload ? extractAssistantVisibleText(assistantForPayload) : "";
			const fallbackRawAnswerText = resolveRawAssistantAnswerText(assistantForPayload);
			const rawAnswerDirectiveState = fallbackRawAnswerText ? parseReplyDirectives(fallbackRawAnswerText) : null;
			const rawAnswerHasMedia = (rawAnswerDirectiveState?.mediaUrls?.length ?? 0) > 0 || rawAnswerDirectiveState?.audioAsVoice;
			const normalizedAssistantTexts = rawAnswerHasMedia && nonEmptyAssistantTexts.length > 0 && !assistantTexts.some((text) => {
				const parsed = parseReplyDirectives(text);
				return (parsed.mediaUrls?.length ?? 0) > 0 || parsed.audioAsVoice;
			}) ? normalizeTextForComparison(nonEmptyAssistantTexts.join("\n\n")) : "";
			const shouldPreferRawAnswerText = rawAnswerDirectiveState?.isSilent || rawAnswerHasMedia && (!nonEmptyAssistantTexts.length || normalizedAssistantTexts.length > 0 && normalizedAssistantTexts === normalizeTextForComparison(rawAnswerDirectiveState?.text ?? ""));
			const fallbackAnswerSourceText = shouldPreferRawAnswerText && fallbackRawAnswerText ? fallbackRawAnswerText : fallbackAnswerText;
			const fallbackAnswerDirectiveState = fallbackAnswerSourceText === fallbackRawAnswerText ? rawAnswerDirectiveState : fallbackAnswerSourceText ? parseReplyDirectives(fallbackAnswerSourceText) : null;
			const shouldUseCanonicalFinalAnswer = Boolean(fallbackAnswerDirectiveState && (normalizeTextForComparison(fallbackAnswerDirectiveState.text) || fallbackAnswerDirectiveState.mediaUrls?.length) || storedDelivery?.tts?.text?.trim());
			const hasAssistantTextPayload = nonEmptyAssistantTexts.length > 0;
			const answerTexts = shouldUseCanonicalFinalAnswer || shouldPreferRawAnswerText ? [fallbackAnswerSourceText] : hasAssistantTextPayload ? nonEmptyAssistantTexts : fallbackAnswerText ? [fallbackAnswerText] : [];
			const preparedAnswerDirectives = shouldUseCanonicalFinalAnswer || shouldPreferRawAnswerText || !hasAssistantTextPayload ? fallbackAnswerDirectiveState : null;
			for (const text of answerTexts) {
				const { text: cleanedText, mediaUrls, mediaFailures, audioAsVoice, replyToId, replyToTag, replyToCurrent, isSilent } = preparedAnswerDirectives ?? parseReplyDirectives(text);
				hasIntentionalSilentFinal = isSilent;
				const ttsFacts = shouldUseCanonicalFinalAnswer ? storedDelivery?.tts : void 0;
				const delivery = shouldUseCanonicalFinalAnswer ? {
					audioAsVoice: storedDelivery?.audioAsVoice,
					replyToCurrent: storedDelivery?.replyToCurrent,
					replyToId: storedDelivery?.replyToId,
					replyToTag: Boolean(storedDelivery?.replyToCurrent || storedDelivery?.replyToId)
				} : {
					audioAsVoice,
					replyToId,
					replyToTag,
					replyToCurrent
				};
				if (!cleanedText && (!mediaUrls || mediaUrls.length === 0) && !delivery.audioAsVoice && !ttsFacts) continue;
				const replyPayload = {
					text: cleanedText,
					...mediaUrls?.[0] ? { mediaUrl: mediaUrls[0] } : {},
					...mediaUrls?.length ? { mediaUrls } : {},
					...delivery.audioAsVoice ? { audioAsVoice: true } : {},
					...delivery.replyToId ? { replyToId: delivery.replyToId } : {},
					...delivery.replyToTag !== void 0 ? { replyToTag: delivery.replyToTag } : {},
					...delivery.replyToCurrent !== void 0 ? { replyToCurrent: delivery.replyToCurrent } : {}
				};
				addReplyPayloadMediaFailures(replyPayload, mediaFailures);
				if (assistantMessageIndex !== void 0) setReplyPayloadMetadata(replyPayload, { assistantMessageIndex });
				replyItems.push(ttsFacts ? setReplyPayloadMetadata(replyPayload, { tts: ttsFacts }) : replyPayload);
				hasUserFacingReply = true;
			}
		}
	};
	let textStart = 0;
	for (const segment of params.answerSegments ?? []) {
		const replyStart = replyItems.length;
		appendSegmentAnswer({
			assistantTexts: params.assistantTexts.slice(textStart, segment.textEnd),
			lastAssistant: segment.lastAssistant,
			currentAssistant: segment.lastAssistant,
			assistantMessageIndex: segment.messageEnd,
			keptAnswer: segment.keptAnswer
		});
		for (const reply of replyItems.slice(replyStart)) setReplyPayloadMetadata(reply, { precedingInputAnswer: true });
		textStart = segment.textEnd;
	}
	appendSegmentAnswer({
		assistantTexts: params.assistantTexts.slice(textStart),
		lastAssistant: params.lastAssistant,
		currentAssistant: params.currentAssistant,
		assistantMessageIndex: params.assistantMessageIndex,
		keptAnswer: params.keptAnswer
	});
	const respectIntentionalSilence = hasIntentionalSilentFinal && (!params.isCronTrigger || hasVisibleCommittedMessagingToolDeliveryEvidence(params) && hasCompletedMessagingToolDeliveryEvidence(params)) && !params.isHeartbeatTrigger && !params.runAborted;
	if (params.lastToolError && !respectIntentionalSilence) {
		const isRestartStatus = params.runStopReason === "restart";
		const warningText = isRestartStatus ? "Gateway restarting…" : buildFailureWarning({
			lastToolError: params.lastToolError,
			hasUserFacingReply,
			verboseLevel: params.verboseLevel,
			useMarkdown
		});
		if (warningText) {
			const normalizedWarning = normalizeTextForComparison(warningText);
			if (!(normalizedWarning ? replyItems.some((item) => item.text && normalizeTextForComparison(item.text) === normalizedWarning) : false)) {
				const warning = {
					text: warningText,
					...!isRestartStatus ? { isError: true } : {}
				};
				if (!isRestartStatus) setReplyPayloadMetadata(warning, { toolErrorWarning: { toolName: params.lastToolError.toolName } });
				replyItems.push(warning);
			}
		}
	}
	if (heartbeatTerminalToolFailure && !replyItems.some((item) => item.isReasoning !== true)) replyItems.push({ text: HEARTBEAT_TOKEN });
	const hasAudioAsVoiceTag = replyItems.some((item) => item.audioAsVoice);
	return replyItems.map((item) => {
		const assistantMessageIndex = getReplyPayloadMetadata(item)?.assistantMessageIndex ?? params.assistantMessageIndex;
		const payload = copyReplyPayloadMetadata(item, {
			...item,
			text: trimTextPreservingCode(item.text ?? "") || void 0
		});
		if (item.isError === true && params.sourceReplyDeliveryMode === "message_tool_only" && !suppressFailureArtifacts) markReplyPayloadForSourceSuppressionDelivery(payload);
		if (heartbeatTerminalToolFailure) setReplyPayloadMetadata(payload, { heartbeatTerminalToolFailure });
		if (!item.isError && !item.isReasoning && (assistantMessageIndex !== void 0 || params.assistantTranscriptOwned === true)) setReplyPayloadMetadata(payload, {
			...assistantMessageIndex !== void 0 ? { assistantMessageIndex } : {},
			...item.mediaUrls?.length ? { assistantTranscriptMediaUrls: [...item.mediaUrls] } : {},
			...params.assistantTranscriptOwned === true ? { assistantTranscriptOwned: true } : {},
			...params.assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey: params.assistantTranscriptIdempotencyKey } : {}
		});
		if (hasAudioAsVoiceTag && item.mediaUrls?.length) payload.audioAsVoice = true;
		if (payload.text && isSilentReplyPayloadText(payload.text, "NO_REPLY")) payload.text = void 0;
		return payload;
	}).filter((payload) => hasReplyPayloadContent(payload) || hasReplyPayloadSpeechContent(payload));
}
//#endregion
export { buildEmbeddedRunPayloads as t };
