import { n as indexFirstByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, g as renderMessagePresentationChartFallbackText, i as hasReplyChannelData, n as hasLegacyInteractiveReplyBlocks, o as hasReplyPayloadContent, r as hasMessagePresentationBlocks, y as renderMessagePresentationTableFallbackText } from "./payload-qyD1vby_.mjs";
import { i as applyReplyPayloadTargetPolicy, k as shouldSuppressReasoningPayload, m as isRenderablePayload, n as addReplyPayloadMediaFailures, o as copyReplyPayloadMetadata, r as appendReplyMediaFailures, s as formatBtwTextForExternalDelivery } from "./reply-payload-BLX_BF2U.mjs";
import { i as parseInlineDirectives, l as stripInlineDirectiveTagsForDelivery } from "./directive-tags-DmdxLrNX.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-DHFPcfdZ.mjs";
import { s as stripLeadingInboundMetadata } from "./strip-inbound-meta-D65t0FgP.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-B41MzEkm.mjs";
import { t as formatLocationText } from "./location-CxESZbHi.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import { t as splitMediaFromOutput } from "./parse-BFtzJA_B.mjs";
import { trySafeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/auto-reply/reply/reply-directives.ts
function parseReplyDirectives(raw, options = {}) {
	const split = splitMediaFromOutput(raw, {
		extractMarkdownImages: options.extractMarkdownImages,
		extractMediaDirectives: options.extractMediaDirectives,
		preserveTrailingWhitespace: options.preserveTrailingWhitespace,
		onAudioDirective: options.onAudioDirective
	});
	let text = split.text ?? "";
	const replyParsed = text.includes("[[") ? parseInlineDirectives(text, {
		currentMessageId: options.currentMessageId,
		stripAudioTag: false,
		preserveTrailingWhitespace: options.preserveTrailingWhitespace
	}) : void 0;
	text = stripInlineDirectiveTagsForDelivery(replyParsed?.hasReplyTag ? replyParsed.text : text, { preserveTrailingWhitespace: options.preserveTrailingWhitespace }).text;
	const silentToken = options.silentToken ?? "NO_REPLY";
	const isSilent = isSilentReplyPayloadText(text, silentToken);
	const mediaFailures = Array.from({ length: split.rejectedMediaCount ?? 0 }, () => ({
		code: "invalid-reference",
		kind: "document",
		label: "Media not attached"
	}));
	return {
		text: appendReplyMediaFailures(isSilent ? "" : text, mediaFailures) ?? "",
		mediaUrls: split.mediaUrls?.map((source) => trySafeFileURLToPath(source) ?? source),
		...mediaFailures.length ? { mediaFailures } : {},
		replyToId: replyParsed?.replyToId,
		replyToCurrent: replyParsed?.replyToCurrent || void 0,
		replyToTag: replyParsed?.hasReplyTag ?? false,
		audioAsVoice: split.audioAsVoice,
		isSilent: isSilent && !mediaFailures.length
	};
}
//#endregion
//#region src/shared/text/citation-control-markers.ts
const UNSUPPORTED_CITATION_CONTROL_MARKER_RE = /cite(?:[^]*)?/g;
const TRAILING_UNSUPPORTED_CITATION_CONTROL_MARKER_RE = /[ \t]*cite(?:[^]*)?(?=\r?\n|$)/g;
/** Removes unsupported model citation-control markers without disturbing normal hard breaks. */
function stripUnsupportedCitationControlMarkers(text) {
	if (!text.includes("cite")) return text;
	return text.replace(TRAILING_UNSUPPORTED_CITATION_CONTROL_MARKER_RE, "").replace(UNSUPPORTED_CITATION_CONTROL_MARKER_RE, "");
}
//#endregion
//#region src/infra/outbound/payloads.ts
function appendBlockMirrorText(lines, blocks) {
	for (const block of blocks) if ((block.type === "text" || block.type === "context") && block.text.trim()) lines.push(block.text.trim());
	else if (block.type === "buttons") for (const button of block.buttons) lines.push(button.label);
	else if (block.type === "chart") lines.push(renderMessagePresentationChartFallbackText(block));
	else if (block.type === "table") lines.push(renderMessagePresentationTableFallbackText(block));
	else if (block.type === "select") {
		if (block.placeholder) lines.push(block.placeholder);
		for (const option of block.options) lines.push(option.label);
	}
}
/** Renders user-visible payload content safely for every outbound transcript mirror. */
function resolveOutboundPayloadMirrorText(payload) {
	const text = payload.text?.trim() ? payload.text : payload.location && formatLocationText(payload.location);
	const presentation = normalizeMessagePresentation(payload.presentation);
	if (text?.trim()) {
		if (!presentation) return text;
		const lines = [text];
		appendBlockMirrorText(lines, presentation.blocks.filter((block) => block.type === "chart" || block.type === "table"));
		return lines.join("\n");
	}
	const lines = [];
	const interactive = normalizeLegacyInteractiveReply(payload.interactive);
	if (presentation?.title?.trim()) lines.push(presentation.title.trim());
	if (presentation) appendBlockMirrorText(lines, presentation.blocks);
	if (interactive) appendBlockMirrorText(lines, interactive.blocks);
	return lines.join("\n");
}
function isSuppressedRelayStatusText(text) {
	const normalized = text.trim();
	return /^(?:no channel reply|replied in-thread|replied in #[-\w]+)\.?$/i.test(normalized) || /^updated\s+\[[^\]]*wiki\/[^\]]+\](?:\([^)]+\))?(?:\s+with\b[\s\S]*)?(?:\.\s*)?(?:no channel reply\.?)?$/i.test(normalized);
}
function normalizeRawOutboundPayload(payload, context = {}) {
	if (shouldSuppressReasoningPayload(payload)) return null;
	const parsed = parseReplyDirectives(stripLeadingInboundMetadata(payload.text ?? ""), { extractMarkdownImages: context.extractMarkdownImages });
	const explicitMediaUrls = payload.mediaUrls ?? parsed.mediaUrls;
	const explicitMediaUrl = payload.mediaUrl ?? parsed.mediaUrls?.[0];
	const mediaUrls = [
		...explicitMediaUrls ?? [],
		...explicitMediaUrl ? [explicitMediaUrl] : [],
		...parsed.mediaUrls ?? []
	];
	const strippedText = stripUnsupportedCitationControlMarkers(parsed.text ?? "");
	const strippedParsed = strippedText === (parsed.text ?? "") ? parsed : parseReplyDirectives(strippedText);
	const parsedText = strippedParsed.text ?? "";
	const suppressedText = strippedParsed.isSilent || isSuppressedRelayStatusText(parsedText);
	const normalizedPayload = applyReplyPayloadTargetPolicy(copyReplyPayloadMetadata(payload, {
		...payload,
		text: formatBtwTextForExternalDelivery({
			...payload,
			text: suppressedText ? "" : parsedText
		}) ?? "",
		mediaUrls,
		mediaUrl: explicitMediaUrl,
		...payload.attachments ? { attachments: collectReplyMediaEntries(payload.mediaUrls === void 0 && payload.mediaUrl === void 0 ? {
			...payload,
			mediaUrls: parsed.mediaUrls
		} : payload, mediaUrls).map(({ attachment }) => attachment ?? {}) } : {},
		replyToId: payload.replyToId ?? parsed.replyToId,
		replyToTag: payload.replyToTag || parsed.replyToTag,
		replyToCurrent: payload.replyToCurrent || parsed.replyToCurrent,
		audioAsVoice: Boolean(payload.audioAsVoice || parsed.audioAsVoice)
	}));
	addReplyPayloadMediaFailures(normalizedPayload, [...parsed.mediaFailures ?? [], ...strippedParsed === parsed ? [] : strippedParsed.mediaFailures ?? []]);
	return suppressedText && !hasReplyPayloadContent(normalizedPayload) ? null : normalizedPayload;
}
function createStructuredOutboundPayloadPlanEntry(payload) {
	const mediaEntries = indexFirstByKey(collectReplyMediaEntries(payload), ({ url }) => url.trim());
	mediaEntries.delete("");
	const mediaUrls = [...mediaEntries.keys()];
	const attachments = payload.attachments ? [...mediaEntries.values()].map(({ attachment }) => attachment ?? {}) : void 0;
	const normalizedPayload = applyReplyPayloadTargetPolicy(copyReplyPayloadMetadata(payload, {
		...payload,
		text: payload.text ?? "",
		mediaUrls: mediaUrls.length ? mediaUrls : void 0,
		mediaUrl: mediaUrls.length > 1 ? void 0 : payload.mediaUrl,
		...attachments ? { attachments } : {}
	}));
	if (!isRenderablePayload(normalizedPayload)) return null;
	return {
		payload: normalizedPayload,
		parts: resolveSendableOutboundReplyParts(normalizedPayload),
		hasPresentation: hasMessagePresentationBlocks(normalizedPayload.presentation),
		hasInteractive: hasLegacyInteractiveReplyBlocks(normalizedPayload.interactive),
		hasChannelData: hasReplyChannelData(normalizedPayload.channelData)
	};
}
function buildOutboundPayloadPlan(payloads, preparePayload) {
	const plan = [];
	for (const [sourceIndex, payload] of payloads.entries()) {
		const prepared = preparePayload ? preparePayload(payload) : payload;
		const entry = prepared ? createStructuredOutboundPayloadPlanEntry(prepared) : null;
		if (entry) plan.push({
			sourceIndex,
			...entry
		});
	}
	return plan;
}
/** Parses raw reply text before building the canonical outbound payload plan. */
function createOutboundPayloadPlan(payloads, context = {}) {
	return buildOutboundPayloadPlan(payloads, (payload) => normalizeRawOutboundPayload(payload, context));
}
/** Plans admitted payload fields without reapplying lane policy or interpreting text directives. */
function createStructuredOutboundPayloadPlan(payloads) {
	return buildOutboundPayloadPlan(payloads);
}
function projectOutboundPayloadPlanForDelivery(plan) {
	return plan.map((entry) => entry.payload);
}
function projectOutboundPayloadPlanForOutbound(plan) {
	const normalizedPayloads = [];
	for (const entry of plan) {
		const payload = entry.payload;
		const text = entry.parts.text;
		if (!entry.parts.hasContent && !entry.hasPresentation && !entry.hasInteractive && !entry.hasChannelData && payload.location == null) continue;
		normalizedPayloads.push({
			text,
			mediaUrls: entry.parts.mediaUrls,
			audioAsVoice: payload.audioAsVoice === true ? true : void 0,
			...entry.hasPresentation ? { presentation: payload.presentation } : {},
			...entry.hasPresentation && payload.presentationTextMode ? { presentationTextMode: payload.presentationTextMode } : {},
			...payload.delivery ? { delivery: payload.delivery } : {},
			...entry.hasInteractive ? { interactive: payload.interactive } : {},
			...entry.hasChannelData ? { channelData: payload.channelData } : {},
			...payload.location ? { location: payload.location } : {},
			...payload.isStatusNotice === true ? { isStatusNotice: true } : {}
		});
	}
	return normalizedPayloads;
}
function projectOutboundPayloadPlanForJson(plan) {
	return plan.map((entry) => {
		const payload = entry.payload;
		return {
			text: entry.parts.text,
			isError: payload.isError,
			mediaUrl: payload.mediaUrl ?? null,
			mediaUrls: entry.parts.mediaUrls.length ? entry.parts.mediaUrls : void 0,
			audioAsVoice: payload.audioAsVoice === true ? true : void 0,
			presentation: payload.presentation,
			...payload.presentationTextMode ? { presentationTextMode: payload.presentationTextMode } : {},
			delivery: payload.delivery,
			interactive: payload.interactive,
			channelData: payload.channelData,
			...payload.location ? { location: payload.location } : {}
		};
	});
}
function projectOutboundPayloadPlanForMirror(plan) {
	return {
		text: plan.map(({ payload }) => resolveOutboundPayloadMirrorText(payload)).filter((text) => Boolean(text)).join("\n"),
		mediaUrls: plan.flatMap((entry) => entry.parts.mediaUrls)
	};
}
function summarizeOutboundPayloadForTransport(payload) {
	const parts = resolveSendableOutboundReplyParts(payload);
	const text = stripUnsupportedCitationControlMarkers(parts.text);
	const strippedSpokenText = typeof payload.spokenText === "string" ? stripUnsupportedCitationControlMarkers(payload.spokenText) : void 0;
	const spokenText = strippedSpokenText?.trim() ? strippedSpokenText : void 0;
	return {
		text,
		mediaUrls: parts.mediaUrls,
		audioAsVoice: payload.audioAsVoice === true ? true : void 0,
		presentation: payload.presentation,
		...payload.presentationTextMode ? { presentationTextMode: payload.presentationTextMode } : {},
		delivery: payload.delivery,
		interactive: payload.interactive,
		channelData: payload.channelData,
		...payload.location ? { location: payload.location } : {},
		...text || !spokenText ? {} : { hookContent: spokenText },
		...payload.isStatusNotice === true ? { isStatusNotice: true } : {}
	};
}
function normalizeReplyPayloadsForDelivery(payloads) {
	return projectOutboundPayloadPlanForDelivery(createOutboundPayloadPlan(payloads));
}
function formatOutboundPayloadLog(payload) {
	const lines = payload.text ? [payload.text.trimEnd()] : [];
	for (const url of payload.mediaUrls) lines.push(`Attachment: ${url}`);
	return lines.join("\n");
}
//#endregion
export { projectOutboundPayloadPlanForDelivery as a, projectOutboundPayloadPlanForOutbound as c, stripUnsupportedCitationControlMarkers as d, parseReplyDirectives as f, normalizeReplyPayloadsForDelivery as i, resolveOutboundPayloadMirrorText as l, createStructuredOutboundPayloadPlan as n, projectOutboundPayloadPlanForJson as o, formatOutboundPayloadLog as r, projectOutboundPayloadPlanForMirror as s, createOutboundPayloadPlan as t, summarizeOutboundPayloadForTransport as u };
