import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as isExecLikeToolName } from "./tool-error-summary-CezRoLUS.mjs";
import { D as setReplyPayloadMetadata, c as getReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-DHFPcfdZ.mjs";
import { o as isHeartbeatAcknowledgementText } from "./heartbeat-C40cs1ec.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-79LnOCyy.mjs";
//#region src/cron/isolated-agent/helpers.ts
/** Normalizes isolated cron run output into summaries, delivery payloads, and error state. */
function formatCronFailureSignal(signal) {
	const kind = normalizeOptionalString(signal.kind) ?? "run";
	const code = normalizeOptionalString(signal.code);
	const source = normalizeOptionalString(signal.toolName) ?? normalizeOptionalString(signal.source);
	return `cron classifier: ${kind} failure${source ? ` from ${source}` : ""}${code ? ` (${code})` : ""}: ${signal.message}`;
}
function formatCronRunLevelError(error) {
	const direct = normalizeOptionalString(error);
	if (direct) return `cron isolated run failed: ${direct}`;
	if (!error || typeof error !== "object") return;
	const record = error;
	const detail = normalizeOptionalString(record.message) ?? normalizeOptionalString(record.kind);
	return detail ? `cron isolated run failed: ${detail}` : "cron isolated run failed";
}
/** Picks a bounded cron run summary from plain text output. */
function pickSummaryFromOutput(text) {
	const clean = (text ?? "").trim();
	if (!clean) return;
	const limit = 2e3;
	return clean.length > limit ? `${truncateUtf16Safe(clean, limit)}…` : clean;
}
/** Picks the last non-empty payload text while ignoring terminal error payloads first. */
function pickLastNonEmptyTextFromPayloads(payloads) {
	const successful = payloads.findLast((payload) => !payload?.isError && payload?.text?.trim())?.text?.trim();
	if (successful) return successful;
	return payloads.findLast((payload) => !isNonTerminalToolErrorWarning(payload) && payload?.text?.trim())?.text?.trim();
}
function isDeliverablePayload(payload) {
	if (!payload) return false;
	return hasOutboundReplyContent(payload, { trimText: true });
}
function payloadHasStructuredDeliveryContent(payload) {
	if (!payload) return false;
	return payload.mediaUrl !== void 0 || (payload.mediaUrls?.length ?? 0) > 0 || (payload.presentation?.blocks?.length ?? 0) > 0 || (payload.interactive?.blocks?.length ?? 0) > 0 || Object.keys(payload.channelData ?? {}).length > 0;
}
function payloadHasNonTextDeliveryContent(payload) {
	return hasOutboundReplyContent({
		...payload,
		text: void 0
	}, { trimText: true });
}
function resolveCronDeliveryPayloads(params) {
	if (params.payloads.length === 0) return {
		deliveryPayloads: [],
		deliveryDisposition: { kind: "empty" }
	};
	const hasNonTextContent = params.payloads.some(payloadHasNonTextDeliveryContent);
	const terminalText = params.finalAssistantVisibleText ?? params.payloads.at(-1)?.text;
	if (!hasNonTextContent && isHeartbeatAcknowledgementText(terminalText)) {
		const controlOnly = params.payloads.every((payload) => isHeartbeatAcknowledgementText(payload.text, 0));
		return {
			deliveryPayloads: params.payloads,
			deliveryDisposition: {
				kind: "heartbeat",
				controlOnly
			}
		};
	}
	return {
		deliveryPayloads: params.payloads.filter((payload) => payloadHasNonTextDeliveryContent(payload) || !isHeartbeatAcknowledgementText(payload.text)),
		deliveryDisposition: { kind: "visible" }
	};
}
function readToolErrorWarningName(payload) {
	return normalizeOptionalLowercaseString(payload && getReplyPayloadMetadata(payload)?.toolErrorWarning?.toolName);
}
function isNonTerminalToolErrorWarning(payload) {
	return Boolean(payload && getReplyPayloadMetadata(payload)?.nonTerminalToolErrorWarning);
}
function isSuccessfulCronPayload(payload) {
	return payload?.isError !== true && (isDeliverablePayload(payload) || payloadHasStructuredDeliveryContent(payload));
}
/** Resolves summary, output text, delivery payloads, and fatal-error state from cron run output. */
function resolveCronPayloadOutcome(params) {
	const fallbackOutputText = pickLastNonEmptyTextFromPayloads(params.payloads);
	const fallbackSummary = pickSummaryFromOutput(fallbackOutputText);
	const deliveryPayload = params.payloads.findLast((payload) => !payload?.isError && isDeliverablePayload(payload)) ?? params.payloads.findLast(isDeliverablePayload);
	const successfulDeliveryPayloads = params.payloads.filter((payload) => payload != null && payload.isError !== true && isDeliverablePayload(payload));
	const selectedDeliveryPayloads = successfulDeliveryPayloads.length ? successfulDeliveryPayloads : deliveryPayload ? [deliveryPayload] : [];
	const deliveryPayloadHasStructuredContent = payloadHasStructuredDeliveryContent(deliveryPayload);
	const lastErrorPayloadIndex = params.payloads.findLastIndex((payload) => payload?.isError === true);
	const lastTextErrorPayload = params.payloads.findLast((payload) => payload?.isError === true && Boolean(payload?.text?.trim()));
	const lastErrorPayloadText = lastTextErrorPayload?.text?.trim();
	const errorPayloads = params.payloads.filter((payload) => payload?.isError === true);
	const finalText = normalizeOptionalString(params.finalAssistantVisibleText);
	const normalizedFinalAssistantVisibleText = finalText && !isSilentReplyPayloadText(finalText) ? finalText : void 0;
	const hasSuccessfulPayloadAfterLastError = !params.runLevelError && lastErrorPayloadIndex >= 0 && params.payloads.slice(lastErrorPayloadIndex + 1).some(isSuccessfulCronPayload);
	const hasSuccessfulPayloadBeforeLastError = !params.runLevelError && lastErrorPayloadIndex > 0 && params.payloads.slice(0, lastErrorPayloadIndex).some(isSuccessfulCronPayload);
	const lastErrorPayload = lastErrorPayloadIndex >= 0 ? params.payloads[lastErrorPayloadIndex] : void 0;
	const hasRecoveringTerminalOutput = normalizedFinalAssistantVisibleText !== void 0 || hasSuccessfulPayloadAfterLastError || hasSuccessfulPayloadBeforeLastError;
	const canRecoverToolWarning = !params.runLevelError && params.failureSignal?.fatalForCron !== true;
	const hasNonTerminalToolErrorWarning = canRecoverToolWarning && hasRecoveringTerminalOutput && isNonTerminalToolErrorWarning(lastErrorPayload);
	const hasPendingPresentationWarning = canRecoverToolWarning && lastErrorPayloadIndex >= 0 && readToolErrorWarningName(lastTextErrorPayload) === "message" && (normalizedFinalAssistantVisibleText !== void 0 || hasSuccessfulPayloadBeforeLastError);
	const hasStructuredDeliveryPayloads = selectedDeliveryPayloads.some((payload) => payloadHasStructuredDeliveryContent(payload));
	const hasRecoveredToolWarning = canRecoverToolWarning && normalizedFinalAssistantVisibleText !== void 0 && !hasStructuredDeliveryPayloads && errorPayloads.length > 0 && errorPayloads.every((payload) => isExecLikeToolName(readToolErrorWarningName(payload) ?? ""));
	const hasFatalStructuredErrorPayload = errorPayloads.length > 0 && !hasSuccessfulPayloadAfterLastError && !hasPendingPresentationWarning && !hasNonTerminalToolErrorWarning && !hasRecoveredToolWarning;
	const shouldUseFinalAssistantVisibleText = (params.preferFinalAssistantVisibleText === true || hasRecoveredToolWarning) && normalizedFinalAssistantVisibleText !== void 0 && !hasFatalStructuredErrorPayload && !hasStructuredDeliveryPayloads;
	const summary = shouldUseFinalAssistantVisibleText ? pickSummaryFromOutput(normalizedFinalAssistantVisibleText) ?? fallbackSummary : fallbackSummary;
	const outputText = shouldUseFinalAssistantVisibleText ? normalizedFinalAssistantVisibleText : fallbackOutputText;
	const synthesizedText = normalizeOptionalString(outputText) ?? normalizeOptionalString(summary);
	const finalDeliveryPayload = shouldUseFinalAssistantVisibleText ? { text: normalizedFinalAssistantVisibleText } : void 0;
	if (finalDeliveryPayload && deliveryPayload && deliveryPayload.isError !== true && deliveryPayload.text === normalizedFinalAssistantVisibleText) {
		const tts = getReplyPayloadMetadata(deliveryPayload)?.tts;
		if (tts) setReplyPayloadMetadata(finalDeliveryPayload, { tts });
	}
	const resolvedDeliveryPayloads = finalDeliveryPayload ? [finalDeliveryPayload] : selectedDeliveryPayloads.length > 0 ? selectedDeliveryPayloads : synthesizedText ? [{ text: synthesizedText }] : [];
	const failureMessage = normalizeOptionalString(params.failureSignal?.message);
	const failureSignal = params.failureSignal?.fatalForCron === true && failureMessage ? {
		...params.failureSignal,
		message: failureMessage
	} : void 0;
	const runLevelError = formatCronRunLevelError(params.runLevelError);
	const hasFatalErrorPayload = hasFatalStructuredErrorPayload || failureSignal !== void 0 || runLevelError !== void 0;
	const structuredErrorText = hasFatalStructuredErrorPayload ? lastErrorPayloadText ?? "cron isolated run returned an error payload" : void 0;
	const fatalDeliveryText = structuredErrorText ?? failureSignal?.message ?? runLevelError;
	const fatalDeliveryPayload = fatalDeliveryText ? {
		text: fatalDeliveryText,
		isError: true
	} : void 0;
	const delivery = fatalDeliveryPayload ? {
		deliveryPayloads: [fatalDeliveryPayload],
		deliveryDisposition: { kind: "visible" }
	} : resolveCronDeliveryPayloads({
		payloads: resolvedDeliveryPayloads,
		finalAssistantVisibleText: normalizedFinalAssistantVisibleText
	});
	return {
		summary: fatalDeliveryText ? pickSummaryFromOutput(fatalDeliveryText) ?? summary : summary,
		outputText: fatalDeliveryText ?? outputText,
		synthesizedText: fatalDeliveryText ?? synthesizedText,
		deliveryPayload: fatalDeliveryPayload ?? deliveryPayload,
		deliveryPayloads: delivery.deliveryPayloads,
		deliveryDisposition: delivery.deliveryDisposition,
		deliveryPayloadHasStructuredContent: fatalDeliveryPayload ? false : deliveryPayloadHasStructuredContent,
		hasFatalErrorPayload,
		hasFatalStructuredErrorPayload,
		embeddedRunError: structuredErrorText ? structuredErrorText : failureSignal ? formatCronFailureSignal(failureSignal) : runLevelError,
		pendingPresentationWarningError: hasPendingPresentationWarning ? lastErrorPayloadText : void 0
	};
}
//#endregion
export { resolveCronPayloadOutcome as n, pickSummaryFromOutput as t };
