import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as formatProviderRefusalText } from "./redact-BcXJu5HP.mjs";
import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { o as readSessionTranscriptFailureRunId, s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { l as resolveAssistantMessagePhase, o as parseAssistantTextSignature, s as readAssistantTextBlocksForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as projectChatWorkContextForDisplay } from "./work-context-Cn4SLmAO.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { C as stripSuppressedControlReplyToken, S as isSuppressedControlReplyText, _ as stripPrivateToolCallContextForDisplay, a as hasAssistantDisplayableNonTextContent, c as isAssistantInternalReasoningContentType, g as stripAssistantMediaDirectivesForDisplay, h as shouldPreserveAssistantControlReplyText, l as isAssistantTextContentType, o as hasAssistantNonTextContent, p as isProjectedForwardedMessage, r as extractAssistantTextForSilentCheck, s as hasTranscriptMediaFacts, t as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, v as takeAssistantManagedMediaUrlsForDisplay, y as truncateChatHistoryText } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { a as readNestedToolActivity, r as nestedToolActivityContent } from "./nested-tool-activity-Da7SpARz.mjs";
import { r as extractInboundSenderLabel } from "./strip-inbound-meta-D65t0FgP.mjs";
import { a as renderAssistantRequestFailureCopy, c as renderRecordedAssistantFailureCopy } from "./assistant-request-failure-copy-csnSONXK.mjs";
import { c as isTranscriptOnlyOpenClawAssistantMessage, s as isOpenClawMessageToolMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { l as readTranscriptSenderIdentity } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-CU53EX1R.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-DM667iyR.mjs";
import { t as STATE_CONTENTION_DIAGNOSTIC } from "./session-run-error-presentation-TwKM9EqW.mjs";
import { t as stripUserEnvelopeForDisplay } from "./user-envelope-display-DD6S7AbG.mjs";
import { t as buildInboundMediaUriFromPath } from "./media-reference-Dlq4zAi4.mjs";
import { c as messageHasToolResultShape, l as projectToolResultDetails, o as isToolHistoryBlockType, s as isToolResultHistoryBlockType } from "./chat-display-projection.canvas-CwC0V7fB.mjs";
import { n as projectAgentHistoryActivity } from "./agent-activity-events-D7azORwm.mjs";
import { d as projectForwardedMessages, i as filterVisibleProjectedHistoryMessages, l as mergeTtsSupplementMessages, m as mapChatDisplayMessages, n as createSubagentCoordinationHistoryProjection, p as toProjectedMessages } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-CQVfTI04.mjs";
import { n as projectTranscriptImageArtifacts } from "./transcript-image-artifacts-BNfLH5hX.mjs";
//#endregion
//#region src/shared/run-failure-notice.ts
function readRunFailureNotice(message) {
	const notice = asOptionalRecord(asOptionalRecord(message)?.openclawRunError);
	if (typeof notice?.runId !== "string" || !notice.runId.trim() || typeof notice.summary !== "string" || !notice.summary.trim()) return;
	return {
		runId: notice.runId,
		summary: notice.summary
	};
}
//#endregion
//#region src/gateway/chat-display-projection.commentary.ts
function projectAssistantCommentaryFallbacks(message, maxChars) {
	const entry = asOptionalRecord(message);
	if (!entry || entry.role !== "assistant" || !Array.isArray(entry.content) || entry.stopReason === "error" || typeof entry.errorMessage === "string") return {
		fallbacks: [],
		message
	};
	const transcriptMeta = asOptionalRecord(entry["__openclaw"]);
	const commentaryBlocks = new Set(readAssistantTextBlocksForPhase(entry, "commentary"));
	const transcriptId = typeof transcriptMeta?.id === "string" ? transcriptMeta.id.trim() : typeof entry.id === "string" ? entry.id.trim() : void 0;
	const groups = [];
	const commentaryContent = /* @__PURE__ */ new Set();
	let projectedUnphasedText = false;
	let group;
	for (const block of entry.content) {
		const content = asOptionalRecord(block);
		if (!content) continue;
		if (!isAssistantTextContentType(content.type)) {
			if (group && [
				"image",
				"audio",
				"video",
				"attachment",
				"attachment_error"
			].includes(String(content.type))) {
				group.content.push(content);
				group.sourceBlocks.push(block);
			}
			continue;
		}
		const signature = parseAssistantTextSignature(content);
		const text = typeof content.text === "string" ? content.text : "";
		const providerItemId = signature?.id?.trim();
		const itemId = providerItemId || transcriptId;
		if (!commentaryBlocks.has(block) || !itemId) {
			group = void 0;
			continue;
		}
		if (group?.itemId !== itemId) {
			group = {
				itemId,
				providerKeyed: Boolean(providerItemId),
				content: [],
				text: [],
				sourceBlocks: []
			};
			groups.push(group);
		}
		group.providerKeyed ||= Boolean(providerItemId);
		if (signature?.phase !== "commentary") group.sourceBlocks.push(block);
		if (text.trim()) {
			group.content.push({
				type: "text",
				text
			});
			group.text.push(text);
		}
	}
	const fallbacks = groups.flatMap(({ itemId, providerKeyed, content, text, sourceBlocks }) => {
		const hasMedia = content.some((block) => block.type !== "text");
		if (content.length === 0 || !providerKeyed && !hasMedia) return [];
		for (const block of sourceBlocks) {
			commentaryContent.add(block);
			projectedUnphasedText ||= isAssistantTextContentType(asOptionalRecord(block)?.type);
		}
		const projected = truncateChatHistoryText(text.join("\n"), maxChars);
		const projectedMeta = projected.truncated ? {
			...transcriptMeta,
			truncated: true,
			reason: typeof transcriptMeta?.reason === "string" ? transcriptMeta.reason : "display-cap"
		} : transcriptMeta ? { ...transcriptMeta } : void 0;
		return [{
			role: "assistant",
			content,
			...typeof entry.timestamp === "number" ? { timestamp: entry.timestamp } : {},
			openclawStreamFallback: {
				replacementText: projected.text,
				source: "segment",
				itemId
			},
			...projectedMeta ? { __openclaw: projectedMeta } : {}
		}];
	});
	if (commentaryContent.size === 0) return {
		fallbacks,
		message
	};
	const remainingContent = entry.content.filter((block) => !commentaryContent.has(block));
	const remaining = {
		...entry,
		content: remainingContent
	};
	if (projectedUnphasedText && remainingContent.some((block) => isToolHistoryBlockType(asOptionalRecord(block)?.type))) {
		remaining.content = remainingContent.filter((block) => !commentaryBlocks.has(block));
		delete remaining.phase;
	}
	return {
		fallbacks,
		message: remaining
	};
}
//#endregion
//#region src/gateway/chat-display-projection.sanitize.ts
const MEDIA_PRIVATE_FIELDS = [
	"data",
	"blob",
	"path",
	"file",
	"filePath",
	"localPath"
];
const MEDIA_REFERENCE_FIELDS = [
	"url",
	"openUrl",
	"image_url",
	"audio_url",
	"video_url"
];
const MEDIA_FACT_PRIVATE_FIELDS = ["workspaceDir", ...MEDIA_PRIVATE_FIELDS.filter((field) => field !== "path")];
function projectChatHistoryMediaReference(value) {
	if (typeof value !== "string") return;
	const reference = value.trim();
	if (/^\/(?:api\/chat\/media\/outgoing|media|__openclaw__)\//u.test(reference)) return reference.split(/[?#]/u, 1)[0];
	try {
		if (/^media:/iu.test(reference)) return parseInboundMediaUri(reference)?.normalizedSource;
		const url = new URL(reference);
		if (url.protocol !== "http:" && url.protocol !== "https:") return;
		url.username = url.password = url.search = url.hash = "";
		return url.toString();
	} catch {
		return;
	}
}
function projectChatHistoryMediaBlock(entry, fact = false) {
	if (!fact && (typeof entry.type !== "string" || !/^(?:image|audio|video)$/u.test(entry.type))) return false;
	const media = entry;
	const hasTopLevelPayload = typeof media.data === "string" || typeof media.blob === "string";
	const source = fact ? void 0 : asOptionalRecord(media.source);
	const projectedSource = source ? { ...source } : void 0;
	const records = [media, ...projectedSource ? [projectedSource] : []];
	if (projectedSource) media.source = projectedSource;
	const privateFields = fact ? MEDIA_FACT_PRIVATE_FIELDS : MEDIA_PRIVATE_FIELDS;
	const referenceFields = fact ? ["path", "url"] : MEDIA_REFERENCE_FIELDS;
	const sourceIsReference = !source && (!fact || typeof media.source !== "string" || /^(?:[a-z][a-z0-9+.-]*:|~?[\\/])|[\\/]/iu.test(media.source));
	let encodedPayload;
	for (const record of records) {
		let omitted = false;
		const payload = typeof record.data === "string" ? record.data : record.blob;
		if (encodedPayload === void 0 && typeof payload === "string") encodedPayload = payload;
		for (const field of privateFields) {
			if (!Object.hasOwn(record, field)) continue;
			delete record[field];
			omitted = true;
		}
		const recordReferences = record === media && sourceIsReference ? [...referenceFields, "source"] : referenceFields;
		for (const field of recordReferences) {
			if (!Object.hasOwn(record, field)) continue;
			const projected = (fact ? buildInboundMediaUriFromPath(String(record[field])) : void 0) ?? projectChatHistoryMediaReference(record[field]);
			record[field] = projected;
			if (projected === void 0) {
				delete record[field];
				omitted = true;
			}
		}
		if (!fact && omitted) {
			if (record === media || media.type !== "image") record.omitted = true;
			if (record === media || media.type !== "audio") media.omitted = true;
		}
	}
	if (!fact && encodedPayload !== void 0) (media.type === "audio" && !hasTopLevelPayload && projectedSource ? projectedSource : media).bytes = estimateBase64DecodedBytes(encodedPayload);
	return true;
}
function projectChatHistoryAttachmentBlock(entry) {
	if (entry.type !== "attachment") return false;
	const attachment = asOptionalRecord(entry.attachment);
	if (!attachment) return false;
	const projected = { ...attachment };
	for (const field of MEDIA_PRIVATE_FIELDS) delete projected[field];
	const url = projectChatHistoryMediaReference(projected.url);
	if (!url) delete projected.url;
	else projected.url = url;
	entry.attachment = projected;
	return true;
}
function projectChatHistoryMediaFacts(value) {
	return Array.isArray(value) ? value.map((fact) => {
		const projected = { ...asOptionalRecord(fact) };
		projectChatHistoryMediaBlock(projected, true);
		return projected;
	}) : void 0;
}
function sanitizeChatHistoryContentBlock(block, opts) {
	if (!block || typeof block !== "object") return {
		block,
		changed: false,
		truncated: false
	};
	const entry = { ...block };
	let changed = stripPrivateToolCallContextForDisplay(entry);
	let truncated = false;
	const preserveExactToolPayload = opts?.preserveExactToolPayload === true || isToolHistoryBlockType(entry.type);
	const maxChars = opts?.maxChars ?? 8e3;
	const toolResultMaxChars = opts?.preserveExactToolPayload || isToolResultHistoryBlockType(entry.type) ? opts?.toolResultMaxChars : void 0;
	if (isToolResultHistoryBlockType(entry.type) && "details" in entry) {
		const projectedDetails = projectToolResultDetails(entry.details, maxChars);
		if (projectedDetails.details) entry.details = projectedDetails.details;
		else delete entry.details;
		changed = true;
		truncated ||= projectedDetails.truncated;
	}
	if (preserveExactToolPayload && Array.isArray(entry.content)) {
		const text = entry.content.flatMap((item) => {
			const value = asOptionalRecord(item)?.text;
			return typeof value === "string" ? [value] : [];
		}).join("\n");
		if (entry.text === text) {
			delete entry.text;
			changed = true;
		}
		const content = entry.content.map((item) => sanitizeChatHistoryContentBlock(item, {
			preserveExactToolPayload: true,
			maxChars,
			toolResultMaxChars
		}));
		if (content.some((item) => item.changed)) {
			entry.content = content.map((item) => item.block);
			changed = true;
		}
		truncated ||= content.some((item) => item.truncated);
	}
	for (const field of [
		"text",
		"content",
		"partialJson",
		"arguments",
		"thinking"
	]) {
		if (typeof entry[field] !== "string" || preserveExactToolPayload && (field === "partialJson" || field === "arguments")) continue;
		const res = truncateChatHistoryText(entry[field], maxChars, preserveExactToolPayload && (field === "text" || field === "content"), field === "text" || field === "content" ? toolResultMaxChars : void 0);
		entry[field] = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	for (const field of ["thinkingSignature", "openclawReasoningReplay"]) if (field in entry) {
		delete entry[field];
		changed = true;
	}
	const mediaChanged = projectChatHistoryMediaBlock(entry);
	const attachmentChanged = projectChatHistoryAttachmentBlock(entry);
	changed ||= mediaChanged || attachmentChanged;
	return {
		block: changed ? entry : block,
		changed,
		truncated
	};
}
function sanitizeAssistantPhasedContentBlocks(content) {
	if (!content.some((block) => {
		const entry = asOptionalObjectRecord(block);
		return entry && isAssistantTextContentType(entry.type) && parseAssistantTextSignature(entry)?.phase;
	})) return content;
	const filtered = content.filter((block) => {
		const entry = asOptionalObjectRecord(block);
		return !entry || !isAssistantTextContentType(entry.type) || parseAssistantTextSignature(entry)?.phase === "final_answer";
	});
	return filtered.length === content.length ? content : filtered;
}
function projectAssistantMixedToolContent(content, maxChars) {
	if (!content.some((block) => isToolHistoryBlockType(asOptionalObjectRecord(block)?.type))) return null;
	let hasVisibleText = false;
	const projectedContent = [];
	for (const block of content) {
		const entry = asOptionalObjectRecord(block);
		if (!entry) continue;
		if (!isAssistantTextContentType(entry.type)) {
			projectedContent.push(block);
			continue;
		}
		if (parseAssistantTextSignature(entry)?.phase === "commentary") continue;
		if (typeof entry.text !== "string" || !entry.text.trim()) continue;
		const truncated = truncateChatHistoryText(entry.text, maxChars);
		if (truncated.text.trim()) {
			projectedContent.push({
				type: "text",
				text: truncated.text
			});
			hasVisibleText = true;
		}
	}
	return hasVisibleText ? projectedContent : null;
}
const COST_FIELDS = [
	"input",
	"output",
	"cacheRead",
	"cacheWrite",
	"total"
];
const USAGE_FIELDS = [
	"input",
	"output",
	"total",
	"totalTokens",
	"inputTokens",
	"outputTokens",
	"promptTokens",
	"completionTokens",
	"cacheRead",
	"cacheWrite",
	"cache_read_input_tokens",
	"cache_creation_input_tokens",
	"input_tokens",
	"output_tokens",
	"prompt_tokens",
	"completion_tokens",
	"total_tokens"
];
function sanitizeNumericMetadata(raw, fields) {
	const record = asOptionalObjectRecord(raw);
	if (!record) return;
	const projected = {};
	for (const key of fields) {
		const value = asFiniteNumber(record[key]);
		if (value !== void 0) projected[key] = value;
	}
	if (fields === USAGE_FIELDS) {
		const state = asOptionalObjectRecord(record.usageReport)?.state;
		if (state === "available" || state === "unavailable") projected.usageReport = { state };
		const cost = sanitizeNumericMetadata(record.cost, COST_FIELDS);
		if (cost) projected.cost = cost;
	}
	return Object.keys(projected).length > 0 ? projected : void 0;
}
function projectWorkspaceConflictDetails(entry) {
	if (entry.role !== "custom" || entry.customType !== "cloud-workspace-conflict") return;
	const details = asOptionalRecord(entry.details);
	if (!details || !Array.isArray(details.paths) || details.paths.length === 0 || !details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) || typeof details.stagedResultRef !== "string" || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef) || details.totalCount !== void 0 && (!Number.isSafeInteger(details.totalCount) || details.totalCount < details.paths.length)) return;
	try {
		return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
	} catch {
		return;
	}
}
function sanitizeChatHistoryMessage(message, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, toolResultMaxChars) {
	if (!message || typeof message !== "object") return {
		message,
		changed: false
	};
	const entry = { ...message };
	let changed = false;
	let truncated = false;
	if ("providerReplay" in entry) {
		delete entry.providerReplay;
		changed = true;
	}
	const openClawMeta = asOptionalRecord(entry["__openclaw"]);
	if (openClawMeta && ("upstreamUserText" in openClawMeta || "sessionSendDelivery" in openClawMeta || "media" in openClawMeta)) {
		const projectedMeta = { ...openClawMeta };
		delete projectedMeta.upstreamUserText;
		delete projectedMeta.sessionSendDelivery;
		if ("media" in projectedMeta) {
			projectedMeta.media = projectChatHistoryMediaFacts(projectedMeta.media);
			if (projectedMeta.media === void 0) delete projectedMeta.media;
		}
		if (Object.keys(projectedMeta).length > 0) entry["__openclaw"] = projectedMeta;
		else delete entry["__openclaw"];
		changed = true;
	}
	const role = typeof entry.role === "string" ? entry.role.toLowerCase() : "";
	const managedMedia = takeAssistantManagedMediaUrlsForDisplay(entry, role);
	changed ||= managedMedia.changed;
	const preserveExactToolPayload = role === "toolresult" || role === "tool_result" || role === "tool" || role === "function" || typeof entry.toolName === "string" || typeof entry.tool_name === "string" || typeof entry.toolCallId === "string" || typeof entry.tool_call_id === "string";
	const resultMaxChars = preserveExactToolPayload && messageHasToolResultShape(entry) ? toolResultMaxChars : void 0;
	if ("details" in entry) {
		const conflictDetails = projectWorkspaceConflictDetails(entry);
		const toolResultDetails = !conflictDetails && messageHasToolResultShape(entry) ? projectToolResultDetails(entry.details, maxChars) : void 0;
		const runFailureDetails = entry.role === "custom" && entry.customType === "run-failed-before-reply" && asOptionalRecord(entry.details)?.errorKind === "state_contention" ? {
			errorKind: "state_contention",
			diagnostic: STATE_CONTENTION_DIAGNOSTIC
		} : void 0;
		const projectedDetails = conflictDetails ?? toolResultDetails?.details ?? runFailureDetails;
		if (projectedDetails) entry.details = projectedDetails;
		else delete entry.details;
		changed = true;
		truncated ||= toolResultDetails?.truncated === true;
	}
	for (const field of ["usage", "cost"]) {
		if (!(field in entry)) continue;
		const sanitized = entry.role === "assistant" ? sanitizeNumericMetadata(entry[field], field === "usage" ? USAGE_FIELDS : COST_FIELDS) : void 0;
		if (sanitized) entry[field] = sanitized;
		else delete entry[field];
		changed = true;
	}
	const stripAssistantControlTokens = role === "assistant" && !shouldPreserveAssistantControlReplyText(entry);
	const projectText = (text) => {
		const controlStripped = stripAssistantControlTokens ? stripAssistantMediaDirectivesForDisplay(stripSuppressedControlReplyToken(text), managedMedia.urls) : text;
		changed ||= controlStripped !== text;
		const res = truncateChatHistoryText(controlStripped, maxChars, preserveExactToolPayload, resultMaxChars);
		changed ||= res.truncated;
		truncated ||= res.truncated;
		return res.text;
	};
	if (typeof entry.content === "string") entry.content = projectText(entry.content);
	else if (Array.isArray(entry.content)) {
		const content = entry.content;
		const commentary = asOptionalRecord(entry.openclawStreamFallback)?.source === "segment";
		let remainingText = maxChars;
		let updated;
		for (let index = 0; index < content.length; index++) {
			const rawBlock = commentary ? asOptionalRecord(content[index]) : void 0;
			const rawText = rawBlock && isAssistantTextContentType(rawBlock.type) && typeof rawBlock.text === "string" ? rawBlock.text : void 0;
			if (rawText !== void 0 && remainingText <= 0) {
				updated ??= content.slice();
				updated[index] = void 0;
				truncated ||= rawText.length > 0;
				continue;
			}
			const sanitized = sanitizeChatHistoryContentBlock(content[index], {
				preserveExactToolPayload,
				maxChars: rawText === void 0 ? maxChars : remainingText,
				toolResultMaxChars
			});
			if (rawText !== void 0) remainingText -= rawText.length + 1;
			const contentBlock = stripAssistantControlTokens ? asOptionalRecord(sanitized.block) : void 0;
			if (contentBlock && isAssistantTextContentType(contentBlock.type) && typeof contentBlock.text === "string") {
				const text = stripAssistantMediaDirectivesForDisplay(stripSuppressedControlReplyToken(contentBlock.text), managedMedia.urls);
				if (text !== contentBlock.text) {
					sanitized.block = {
						...contentBlock,
						text
					};
					sanitized.changed = true;
				}
			}
			if (sanitized.changed) {
				updated ??= content.slice();
				updated[index] = sanitized.block;
			}
			truncated ||= sanitized.truncated;
		}
		if (updated) {
			entry.content = commentary ? updated.filter((block) => block !== void 0) : updated;
			changed = true;
		}
		if (entry.role === "assistant" && Array.isArray(entry.content)) {
			const mixedToolContent = projectAssistantMixedToolContent(entry.content, maxChars);
			if (mixedToolContent) {
				entry.content = mixedToolContent;
				if (entry.phase === "commentary") delete entry.phase;
				changed = true;
			} else {
				const sanitizedPhases = sanitizeAssistantPhasedContentBlocks(entry.content);
				if (sanitizedPhases !== entry.content) {
					entry.content = sanitizedPhases;
					changed = true;
				}
			}
		}
	}
	if (typeof entry.text === "string") entry.text = projectText(entry.text);
	if (truncated) {
		const meta = asOptionalRecord(entry["__openclaw"]);
		entry["__openclaw"] = {
			...meta,
			truncated: true,
			reason: typeof meta?.reason === "string" ? meta.reason : "display-cap"
		};
		changed = true;
	}
	return {
		message: changed ? entry : message,
		changed
	};
}
function hasAssistantMixedToolVisibleText(message) {
	const content = asOptionalObjectRecord(message)?.content;
	if (!Array.isArray(content)) return false;
	let hasToolHistoryBlock = false;
	let hasText = false;
	for (const block of content) {
		const entry = asOptionalObjectRecord(block);
		if (!entry) continue;
		if (isToolHistoryBlockType(entry.type)) hasToolHistoryBlock = true;
		if (isAssistantTextContentType(entry.type) && typeof entry.text === "string" && entry.text.trim()) hasText = true;
	}
	return hasToolHistoryBlock && hasText;
}
function shouldDropAssistantHistoryMessage(message) {
	const entry = asOptionalObjectRecord(message);
	if (entry?.role !== "assistant") return false;
	if (isProjectedForwardedMessage(entry)) return false;
	if (resolveAssistantMessagePhase(message) === "commentary") return !hasAssistantMixedToolVisibleText(message);
	const text = extractAssistantTextForSilentCheck(message);
	if (text === void 0 || !isSuppressedControlReplyText(text)) return false;
	return !hasAssistantDisplayableNonTextContent(message);
}
function sanitizeChatHistoryMessages(messages, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, opts) {
	if (messages.length === 0) return messages;
	let changed = false;
	const next = [];
	for (const original of messages) {
		let message = original;
		if (opts?.includeCommentaryFallbacks === true) {
			const projection = projectAssistantCommentaryFallbacks(message, maxChars);
			message = projection.message;
			changed ||= message !== original;
			for (const commentary of projection.fallbacks) {
				changed = true;
				const hasMediaFacts = hasTranscriptMediaFacts(asOptionalRecord(commentary) ?? {});
				if (!hasMediaFacts && shouldDropAssistantHistoryMessage(commentary)) continue;
				const projected = sanitizeChatHistoryMessage(commentary, maxChars, opts?.toolResultMaxChars);
				if (hasMediaFacts || !shouldDropAssistantHistoryMessage(projected.message)) next.push(projected.message);
			}
		}
		if (shouldDropAssistantHistoryMessage(message)) {
			changed = true;
			continue;
		}
		const res = sanitizeChatHistoryMessage(message, maxChars, opts?.toolResultMaxChars);
		changed ||= res.changed;
		if (res.changed && shouldDropAssistantHistoryMessage(res.message)) {
			changed = true;
			continue;
		}
		next.push(res.message);
	}
	return changed ? next : messages;
}
//#endregion
//#region src/gateway/chat-sanitize.ts
function extractMessageSenderLabel(entry) {
	if (typeof entry.senderLabel === "string" && entry.senderLabel.trim()) return entry.senderLabel.trim();
	if (typeof entry.content === "string") return extractInboundSenderLabel(entry.content);
	if (Array.isArray(entry.content)) for (const item of entry.content) {
		if (!item || typeof item !== "object") continue;
		const text = item.text;
		if (typeof text !== "string") continue;
		const senderLabel = extractInboundSenderLabel(text);
		if (senderLabel) return senderLabel;
	}
	if (typeof entry.text === "string") return extractInboundSenderLabel(entry.text);
	return null;
}
function stripEnvelopeFromContentWithRole(content, role) {
	const stripUserEnvelope = role === "user";
	return mapChatDisplayMessages(content, (item) => {
		if (!item || typeof item !== "object") return item;
		const entry = item;
		if (!(entry.type === "text" || role === "user" && entry.type === "input_text" || role === "assistant" && (entry.type === "input_text" || entry.type === "output_text")) || typeof entry.text !== "string") return item;
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.text) : stripInternalMetadataForDisplay(entry.text);
		return stripped === entry.text ? item : {
			...entry,
			text: stripped
		};
	});
}
/** Strips OpenClaw envelope metadata from one display message without mutating it. */
function stripEnvelopeFromMessage(message) {
	if (!message || typeof message !== "object") return message;
	const projected = projectChatWorkContextForDisplay(message);
	const entry = projected;
	const role = typeof entry.role === "string" ? normalizeLowercaseStringOrEmpty(entry.role) : "";
	const stripUserEnvelope = role === "user";
	let next;
	const senderLabel = stripUserEnvelope ? extractMessageSenderLabel(entry) : null;
	if (senderLabel && entry.senderLabel !== senderLabel) next = {
		...entry,
		senderLabel
	};
	const field = typeof entry.content === "string" || Array.isArray(entry.content) ? "content" : "text";
	const content = entry[field];
	if (typeof content === "string" || field === "content" && Array.isArray(content)) {
		const stripped = Array.isArray(content) ? stripEnvelopeFromContentWithRole(content, role) : stripUserEnvelope ? stripUserEnvelopeForDisplay(content) : stripInternalMetadataForDisplay(content);
		if (stripped !== content) {
			next ??= { ...entry };
			next[field] = stripped;
		}
	}
	return next ?? projected;
}
/** Strips envelope metadata from a message array, preserving the original array when unchanged. */
function stripEnvelopeFromMessages(messages) {
	return mapChatDisplayMessages(messages, stripEnvelopeFromMessage);
}
//#endregion
//#region src/gateway/chat-display-projection.core.ts
/** Keep profile display reads local to one history page or event projection operation. */
function createCurrentUserProfileMessageProjector(resolveDisplay) {
	const displayBySenderId = /* @__PURE__ */ new Map();
	return (message) => {
		if (message.role !== "user") return message;
		const metadata = asOptionalRecord(message["__openclaw"]);
		if (!metadata) return message;
		const identity = readTranscriptSenderIdentity(metadata.senderIdentity);
		if (identity?.type !== "profile") return message;
		const senderId = identity.id;
		let display = displayBySenderId.get(senderId);
		if (!display) {
			display = resolveDisplay(senderId);
			displayBySenderId.set(senderId, display);
		}
		if (display.kind === "unresolved") return message;
		if (metadata.senderProfileAvatarUrl === display.avatarUrl && identity.id === display.profileId) return message;
		return {
			...message,
			__openclaw: {
				...metadata,
				senderIdentity: {
					type: "profile",
					id: display.profileId
				},
				senderProfileAvatarUrl: display.avatarUrl
			}
		};
	};
}
function projectCurrentUserProfileAvatars(messages, resolveDisplay) {
	if (!resolveDisplay) return messages;
	return mapChatDisplayMessages(messages, createCurrentUserProfileMessageProjector(resolveDisplay));
}
function getAssistantErrorFallbackText(message) {
	return formatProviderRefusalText(message) ?? renderAssistantRequestFailureCopy({
		storageFailure: classifyGatewayStorageFailure(message),
		code: typeof message.errorCode === "string" ? message.errorCode : void 0
	}) ?? renderRecordedAssistantFailureCopy(message) ?? "The agent run failed before producing a reply.";
}
function sanitizeAssistantErrorDisplayMessage(message, includeFailureCopy = true) {
	const { content, ...envelope } = message;
	let next = sanitizeChatHistoryMessage(envelope, Number.MAX_SAFE_INTEGER).message;
	if (Array.isArray(content)) {
		let firstTextBlock = true;
		next.content = content.flatMap((block) => {
			const sanitized = sanitizeChatHistoryContentBlock(block, { maxChars: Number.MAX_SAFE_INTEGER }).block;
			if (!sanitized || typeof sanitized !== "object" || Array.isArray(sanitized)) return [sanitized];
			const entry = sanitized;
			if (isAssistantInternalReasoningContentType(entry.type)) return [];
			if (!firstTextBlock || !isAssistantTextContentType(entry.type)) return [sanitized];
			firstTextBlock = false;
			if (typeof entry.text !== "string" || !entry.text.startsWith("[assistant turn failed before producing content]")) return [sanitized];
			const replyText = entry.text.slice(48);
			return replyText ? [{
				...entry,
				text: replyText
			}] : [];
		});
	} else next.content = typeof content === "string" && content.startsWith("[assistant turn failed before producing content]") ? content.slice(48) : content;
	if (typeof next.text === "string" && next.text.startsWith("[assistant turn failed before producing content]")) next.text = next.text.slice(48);
	const terminalCopy = formatProviderRefusalText(message) ?? renderAssistantRequestFailureCopy({ code: typeof message.errorCode === "string" ? message.errorCode : void 0 }) ?? renderRecordedAssistantFailureCopy(message);
	if (includeFailureCopy && terminalCopy) {
		next = sanitizeChatHistoryMessage(next, Number.MAX_SAFE_INTEGER).message;
		if (shouldDropAssistantHistoryMessage(next)) {
			next.content = [];
			delete next.text;
			delete next.phase;
		}
		const displayContent = Array.isArray(next.content) ? [...next.content] : typeof next.content === "string" ? [{
			type: "text",
			text: next.content
		}] : [];
		const prependText = (text) => {
			const alreadyPresent = displayContent.some((block) => {
				const entry = asOptionalRecord(block);
				return entry && isAssistantTextContentType(entry.type) && typeof entry.text === "string" && entry.text.includes(text);
			});
			if (!text || alreadyPresent) return;
			const textIndex = displayContent.findIndex((block) => {
				const entry = asOptionalRecord(block);
				return entry && isAssistantTextContentType(entry.type) && typeof entry.text === "string";
			});
			const previous = textIndex >= 0 ? asOptionalRecord(displayContent[textIndex]) : void 0;
			if (previous) displayContent[textIndex] = {
				...previous,
				text: [text, previous.text].filter(Boolean).join("\n\n")
			};
			else displayContent.push({
				type: "text",
				text
			});
		};
		if (typeof next.text === "string") prependText(next.text);
		prependText(getAssistantErrorFallbackText(message));
		next.content = displayContent;
		delete next.text;
	}
	delete next.diagnostics;
	delete next.errorBody;
	delete next.errorCode;
	delete next.errorMessage;
	delete next.errorType;
	return next;
}
function isPureStreamErrorFallbackAssistantMessage(message) {
	if (message.role !== "assistant" || message.stopReason !== "error") return false;
	const text = extractAssistantTextForSilentCheck(message);
	return text !== void 0 && text.trim() === "[assistant turn failed before producing content]" && !hasAssistantNonTextContent(message) && !hasTranscriptMediaFacts(message);
}
function hasVisibleAssistantDisplayContent(message) {
	if (message.role !== "assistant" || message.display === false || isPureStreamErrorFallbackAssistantMessage(message)) return false;
	const sanitized = sanitizeChatHistoryMessage(message, Number.MAX_SAFE_INTEGER).message;
	if (shouldDropAssistantHistoryMessage(sanitized)) return false;
	if (hasAssistantDisplayableNonTextContent(sanitized) || hasTranscriptMediaFacts(sanitized)) return true;
	return hasVisibleAssistantReplyText(sanitized);
}
function hasVisibleAssistantReplyText(message) {
	return [...Array.isArray(message.content) ? message.content.flatMap((block) => {
		const entry = asOptionalRecord(block);
		return isAssistantTextContentType(entry?.type) ? [entry?.text] : [];
	}) : [message.content], message.text].some((text) => {
		if (typeof text !== "string") return false;
		const visible = text.trim();
		return visible.length > 0 && visible !== "[assistant turn failed before producing content]" && !isSuppressedControlReplyText(visible);
	});
}
function isDiagnosticOnlyAssistantError(value) {
	const message = asOptionalRecord(value);
	return message?.role === "assistant" && message.display !== false && message.stopReason === "error" && (isPureStreamErrorFallbackAssistantMessage(message) || Boolean(readSessionTranscriptRunId(message)) && !hasAssistantDisplayableNonTextContent(message) && !hasTranscriptMediaFacts(message) && (!hasVisibleAssistantDisplayContent(message) || extractAssistantTextForSilentCheck(message)?.trim().replace(/^⚠️\s*/u, "") === "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model."));
}
function isPendingAssistantError(value) {
	const message = asOptionalRecord(value);
	return Boolean(message?.role === "assistant" && message.display !== false && message.stopReason === "error" && (readSessionTranscriptRunId(message) || isPureStreamErrorFallbackAssistantMessage(message)));
}
/** Retain authored output, never a model attempt's host-owned failure copy. */
function projectAssistantAttemptContent(message) {
	const diagnosticOnly = isDiagnosticOnlyAssistantError(message);
	const next = sanitizeAssistantErrorDisplayMessage(message, false);
	delete next.stopReason;
	delete next.openclawRunError;
	if (diagnosticOnly) {
		next.content = [];
		delete next.text;
	}
	return hasVisibleAssistantDisplayContent(next) ? next : void 0;
}
/** Hidden retry prompts continue a turn; only a real user input ends recovery matching. */
function isChatHistoryRecoveryUserBoundary(value) {
	const message = asOptionalRecord(value);
	return message?.role === "user" && !(message.display === false && asOptionalRecord(message.provenance)?.kind === "internal_system");
}
function createChatHistoryRecoveryProjection(options) {
	const projectCoordination = createSubagentCoordinationHistoryProjection(options?.subagentCoordination);
	const messages = [];
	let unseenPending = options?.assistantErrorPending ?? false;
	let recoveryObserved = false;
	let pendingIndexes = [];
	const repairedIndexes = /* @__PURE__ */ new Set();
	const append = (message) => {
		const receiptRunId = readSessionTranscriptFailureRunId(message) ?? readRunFailureNotice(message)?.runId;
		if (receiptRunId) pendingIndexes = pendingIndexes.filter((pendingIndex) => {
			if (readSessionTranscriptRunId(messages[pendingIndex]) !== receiptRunId) return true;
			repairedIndexes.add(pendingIndex);
			recoveryObserved = true;
			return false;
		});
		const index = messages.length;
		messages.push(message);
		if (isChatHistoryRecoveryUserBoundary(message)) {
			unseenPending = false;
			pendingIndexes = [];
			return;
		}
		if (isPendingAssistantError(message) || readRunFailureNotice(message)) {
			pendingIndexes.push(index);
			return;
		}
		if (!unseenPending && pendingIndexes.length === 0 || !hasVisibleAssistantDisplayContent(message)) return;
		recoveryObserved ||= unseenPending;
		unseenPending = false;
		const completedRunId = (message.stopReason === "stop" || message.stopReason === "length") && !isTranscriptOnlyOpenClawAssistantMessage(message) ? readSessionTranscriptRunId(message) : void 0;
		pendingIndexes = pendingIndexes.filter((pendingIndex) => {
			const failedRunId = readSessionTranscriptRunId(messages[pendingIndex]);
			if (failedRunId && failedRunId !== completedRunId) return true;
			repairedIndexes.add(pendingIndex);
			recoveryObserved = true;
			return false;
		});
	};
	return {
		append(input) {
			const projected = projectCoordination(prepareChatHistoryRecoveryMessages(input, options));
			for (const message of toProjectedMessages(projected)) if (!isOpenClawMessageToolMirrorAssistantMessage(message)) append(message);
		},
		get pending() {
			return unseenPending || pendingIndexes.length > 0;
		},
		result() {
			return {
				messages: repairedIndexes.size > 0 ? messages.flatMap((message, index) => {
					if (!repairedIndexes.has(index)) return [message];
					const partial = projectAssistantAttemptContent(message);
					return partial ? [partial] : [];
				}) : messages.slice(),
				pending: unseenPending || pendingIndexes.length > 0,
				recoveryObserved
			};
		}
	};
}
/** Only the terminal lifecycle owner may turn attempt diagnostics into a notice. */
function projectRunFailureNotices(messages) {
	return messages.flatMap((message) => {
		if (message.role === "custom" && message.customType === "run-failed-before-reply") {
			const runId = readSessionTranscriptFailureRunId(message) ?? readSessionTranscriptRunId(message);
			const summary = readRunFailureNotice(message)?.summary ?? (typeof message.content === "string" ? message.content.trim() : void 0);
			return runId && summary ? [{
				...message,
				openclawRunError: {
					runId,
					summary
				}
			}] : [message];
		}
		if (readSessionTranscriptRunId(message) && isPendingAssistantError(message)) {
			const partial = projectAssistantAttemptContent(message);
			return partial ? [partial] : [];
		}
		return [message];
	});
}
function projectEmptyAssistantErrorMessages(messages) {
	return mapChatDisplayMessages(messages, (message) => {
		if (message.role !== "assistant" || message.stopReason !== "error") return message;
		if (hasAssistantDisplayableNonTextContent(message) || hasTranscriptMediaFacts(message)) return sanitizeAssistantErrorDisplayMessage(message);
		const sanitized = sanitizeChatHistoryMessage(message, Number.MAX_SAFE_INTEGER).message;
		if (!shouldDropAssistantHistoryMessage(sanitized) && hasVisibleAssistantReplyText(sanitized)) return sanitizeAssistantErrorDisplayMessage(message);
		const next = {
			...sanitized,
			content: [{
				type: "text",
				text: getAssistantErrorFallbackText(message)
			}]
		};
		delete next.diagnostics;
		delete next.errorBody;
		delete next.errorCode;
		delete next.errorMessage;
		delete next.errorType;
		delete next.phase;
		delete next.text;
		return next;
	});
}
function prepareChatHistoryRecoveryMessages(messages, options) {
	const projectedMessages = messages.map((original) => {
		const message = projectTranscriptImageArtifacts(original);
		const entry = asOptionalRecord(message);
		const failureRunId = readSessionTranscriptFailureRunId(entry);
		if (failureRunId) return {
			...entry,
			__openclaw: {
				...asOptionalRecord(entry?.["__openclaw"]),
				runId: failureRunId
			}
		};
		const activity = readNestedToolActivity(message);
		if (!activity) return message;
		const [call, result] = nestedToolActivityContent(activity);
		const sanitized = sanitizeChatHistoryMessage({
			...result,
			role: "toolResult"
		}, options?.maxChars ?? 8e3).message;
		return {
			...asOptionalRecord(message),
			runId: activity.details.runId,
			__openclaw: {
				...asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]),
				runId: activity.details.runId
			},
			content: [call, sanitized]
		};
	});
	return options?.stripEnvelope === false ? projectedMessages : stripEnvelopeFromMessages(projectedMessages);
}
function projectChatDisplayMessagesWithState(messages, options) {
	options?.subagentCoordination?.assertCurrent?.();
	const recovery = createChatHistoryRecoveryProjection(options);
	recovery.append(messages);
	const recoveredErrors = recovery.result();
	const projectedErrors = projectEmptyAssistantErrorMessages(projectRunFailureNotices(recoveredErrors.messages));
	const activity = options?.activity === false ? [] : projectAgentHistoryActivity(messages.flatMap((message) => {
		const messageId = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.id;
		return typeof messageId === "string" ? [{
			messageId,
			message
		}] : [];
	}));
	const sanitizedMessages = toProjectedMessages(sanitizeChatHistoryMessages(projectedErrors, Number.MAX_SAFE_INTEGER, { includeCommentaryFallbacks: options?.includeCommentaryFallbacks }));
	const commentaryFallbacksObserved = options?.includeCommentaryFallbacks === true && sanitizedMessages.some((message) => asOptionalRecord(message.openclawStreamFallback)?.source === "segment");
	const filtered = filterVisibleProjectedHistoryMessages(projectForwardedMessages(sanitizedMessages, options?.resolveCronJobName), options?.turnBoundaryPending);
	const result = {
		activity,
		messages: projectCurrentUserProfileAvatars(sanitizeChatHistoryMessages(mergeTtsSupplementMessages(filtered.messages), options?.maxChars ?? 8e3, { toolResultMaxChars: options?.toolResultMaxChars }), options?.resolveCurrentUserProfileDisplay),
		turnBoundaryPending: filtered.turnBoundaryPending,
		assistantErrorPending: recoveredErrors.pending,
		assistantErrorRecoveryObserved: recoveredErrors.recoveryObserved
	};
	if (commentaryFallbacksObserved) result.commentaryFallbacksObserved = true;
	options?.subagentCoordination?.assertCurrent?.();
	return result;
}
function projectChatDisplayMessages(messages, options) {
	return projectChatDisplayMessagesWithState(messages, {
		...options,
		activity: false
	}).messages;
}
function projectChatDisplayMessage(message, options) {
	const projected = projectChatDisplayMessages([message], options);
	if (!options?.includeCommentaryFallbacks || !projected.some((entry) => entry.openclawStreamFallback)) return projected[0];
	const result = {
		...projected.at(-1),
		content: projected.flatMap(({ content }) => Array.isArray(content) ? content : typeof content === "string" ? [{
			type: "text",
			text: content
		}] : [])
	};
	const truncated = projected.map((entry) => asOptionalRecord(entry["__openclaw"])).find((metadata) => metadata?.truncated === true);
	if (truncated) result["__openclaw"] = {
		...asOptionalRecord(result["__openclaw"]),
		truncated: true,
		reason: truncated.reason
	};
	delete result.openclawStreamFallback;
	return result;
}
//#endregion
export { prepareChatHistoryRecoveryMessages as a, projectChatDisplayMessagesWithState as c, isPendingAssistantError as i, sanitizeChatHistoryContentBlock as l, createCurrentUserProfileMessageProjector as n, projectChatDisplayMessage as o, isChatHistoryRecoveryUserBoundary as r, projectChatDisplayMessages as s, createChatHistoryRecoveryProjection as t };
