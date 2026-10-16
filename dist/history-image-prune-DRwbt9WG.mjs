import "./src-CdRlGRnW.mjs";
import { i as asOptionalObjectRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { _ as stripLegacyMediaContextFields, d as readPersistedMediaFacts, p as readRuntimePromptMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import { n as markInboundContextLabel } from "./inbound-context-marker-DDxVZisx.mjs";
import { c as hasInterSessionUserProvenance, n as INTER_SESSION_PROMPT_PREFIX_BASE } from "./input-provenance-D1LHo5Qj.mjs";
import "./user-turn-transcript-DeadOwaM.mjs";
import { t as buildLateMediaAttachedProjection } from "./user-turn-transcript.message-D6tiOY3Z.mjs";
import { t as buildInboundMediaNoteProjection } from "./media-note-DYzuR7IB.mjs";
import { r as formatContextJsonBlock } from "./channel-prompt-context-CUFSBN-S.mjs";
import { m as resolveTranscriptPolicy } from "./helpers-DL-Vx2nx.mjs";
import { i as hydratePromptMediaMessages } from "./images-Dog21-sT.mjs";
import path from "node:path";
//#region src/agents/embedded-agent-runner/run/attempt-tool-call-block-type.ts
function isRunnerToolCallBlock(block) {
	const type = asOptionalObjectRecord(block)?.type;
	return type === "toolCall" || type === "toolUse" || type === "functionCall";
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-history.ts
const LEADING_TIMESTAMP_ENVELOPE_RE = /^\[[A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]]*\] */;
const CONVERSATION_INFO_LABEL = markInboundContextLabel("Conversation info:");
function splitLeadingTimestampEnvelope(text) {
	const envelope = text.match(LEADING_TIMESTAMP_ENVELOPE_RE)?.[0] ?? "";
	return {
		envelope,
		body: envelope ? text.slice(envelope.length) : text
	};
}
function readFirstUserText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.find(isUserTextBlock)?.text;
}
function isUserTextBlock(value) {
	if (!value || typeof value !== "object") return false;
	const block = value;
	return block.type === "text" && typeof block.text === "string";
}
function hasNonBlankUserText(content) {
	return typeof content === "string" ? Boolean(content.trim()) : Array.isArray(content) && content.some((block) => isUserTextBlock(block) && Boolean(block.text.trim()));
}
function contentMatchesTimestampOverride(content, override) {
	const text = readFirstUserText(content);
	return text !== void 0 && (text === override.text || text === override.alternateText);
}
function resolveUserTranscriptMessages(messages, contexts, override) {
	if (!contexts?.length) return;
	const resolved = Array.from({ length: messages.length }, () => void 0);
	const unusedContexts = new Set(contexts);
	const byRuntimeMessage = /* @__PURE__ */ new Map();
	for (const context of unusedContexts) {
		const bucket = byRuntimeMessage.get(context.runtimeMessage);
		if (bucket) bucket.push(context);
		else byRuntimeMessage.set(context.runtimeMessage, [context]);
	}
	for (const [index, message] of messages.entries()) {
		if (message.role !== "user" || message.operatorMessage) continue;
		const context = byRuntimeMessage.get(message)?.shift();
		if (!context) continue;
		resolved[index] = context.transcriptMessage;
		unusedContexts.delete(context);
	}
	if (unusedContexts.size === 0) return resolved;
	const byTimestamp = /* @__PURE__ */ new Map();
	for (const context of unusedContexts) {
		const timestamp = context.runtimeMessage.timestamp;
		if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) continue;
		const bucket = byTimestamp.get(timestamp);
		if (bucket) bucket.push(context);
		else byTimestamp.set(timestamp, [context]);
	}
	const activeUserMessageIndex = findActiveUserMessageIndex(messages);
	for (const [index, message] of messages.entries()) {
		if (message.role !== "user" || message.operatorMessage || resolved[index]) continue;
		const timestamp = message.timestamp;
		const context = (typeof timestamp === "number" ? byTimestamp.get(timestamp) : void 0)?.find((candidate) => unusedContexts.has(candidate) && userContentMatchesTranscriptContext(message.content, candidate.runtimeMessage.content, index === activeUserMessageIndex || typeof override?.runtimeTimestamp === "number" && override.runtimeTimestamp === timestamp ? override : void 0));
		if (!context) continue;
		resolved[index] = context.transcriptMessage;
		unusedContexts.delete(context);
	}
	return resolved;
}
function userContentMatchesTranscriptContext(messageContent, runtimeContent, override) {
	const messageText = readFirstUserText(messageContent);
	const runtimeText = readFirstUserText(runtimeContent);
	if (messageText !== void 0 && messageText === runtimeText) return true;
	if (messageText === void 0 && runtimeText === void 0 && Array.isArray(messageContent) && Array.isArray(runtimeContent) && stableStringify(messageContent) === stableStringify(runtimeContent)) return true;
	return Boolean(override && contentMatchesTimestampOverride(messageContent, override) && contentMatchesTimestampOverride(runtimeContent, override));
}
function normalizePersistedSenderValue(value) {
	if (typeof value !== "string") return;
	return value.replaceAll("\0", "").trim() || void 0;
}
function readPersistedSender(message) {
	const openclaw = Reflect.get(message, "__openclaw");
	if (!openclaw || typeof openclaw !== "object" || Array.isArray(openclaw)) return;
	const meta = openclaw;
	const sender = {
		id: normalizePersistedSenderValue(meta["senderId"]),
		name: normalizePersistedSenderValue(meta["senderName"]),
		username: normalizePersistedSenderValue(meta["senderUsername"])
	};
	if (Object.values(sender).every((value) => value === void 0)) return;
	return sender;
}
function mergeSenderIntoLeadingConversationInfo(text, sender) {
	const { body, envelope } = splitLeadingTimestampEnvelope(text);
	const jsonPrefix = `${CONVERSATION_INFO_LABEL}\n\`\`\`json\n`;
	if (!body.startsWith(jsonPrefix)) return;
	const jsonEnd = body.indexOf("\n```", jsonPrefix.length);
	if (jsonEnd === -1) return;
	const payload = safeParseJsonRecord(body.slice(jsonPrefix.length, jsonEnd));
	if (!payload) return;
	const suffix = body.slice(jsonEnd + 4);
	return `${envelope}${formatContextJsonBlock(CONVERSATION_INFO_LABEL, {
		...payload,
		sender
	})}${suffix}`;
}
function prependContextToUserMessage(message, sender) {
	const context = formatContextJsonBlock(CONVERSATION_INFO_LABEL, { sender });
	const projectText = (text) => {
		const { body, envelope } = splitLeadingTimestampEnvelope(text);
		if (body === context || body.startsWith(`${context}\n\n`)) return;
		return mergeSenderIntoLeadingConversationInfo(text, sender) ?? `${envelope}${body ? `${context}\n\n${body}` : context}`;
	};
	const content = message.content;
	if (typeof content === "string") {
		const text = projectText(content);
		return text === void 0 || text === content ? message : {
			...message,
			content: text
		};
	}
	if (!Array.isArray(content)) return message;
	const textIndex = content.findIndex(isUserTextBlock);
	if (textIndex === -1) return {
		...message,
		content: [{
			type: "text",
			text: context
		}, ...content]
	};
	const textBlock = content[textIndex];
	const text = projectText(textBlock.text);
	if (text === void 0) return message;
	const nextContent = content.slice();
	nextContent[textIndex] = {
		...textBlock,
		text
	};
	return {
		...message,
		content: nextContent
	};
}
function hasInterSessionPromptPrefix(message) {
	const text = readFirstUserText(message.content);
	if (text === void 0) return false;
	return splitLeadingTimestampEnvelope(text).body.startsWith(INTER_SESSION_PROMPT_PREFIX_BASE);
}
function projectPersistedSenderContext(messages, transcriptMessages) {
	let changed = false;
	const nextMessages = messages.map((message, index) => {
		if (message.role !== "user" || message.operatorMessage) return message;
		const transcriptMessage = transcriptMessages?.[index] ?? message;
		if (hasInterSessionUserProvenance(message) || hasInterSessionUserProvenance(transcriptMessage) || hasInterSessionPromptPrefix(message) || hasInterSessionPromptPrefix(transcriptMessage)) return message;
		const sender = readPersistedSender(transcriptMessage);
		if (!sender) return message;
		const nextMessage = prependContextToUserMessage(message, sender);
		changed ||= nextMessage !== message;
		return nextMessage;
	});
	return changed ? nextMessages : messages;
}
function findActiveUserMessageIndex(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (!message) continue;
		if (message.role === "user" && !message.operatorMessage) return index;
		if (message.role === "assistant" && (!Array.isArray(message.content) || !message.content.some(isRunnerToolCallBlock))) return -1;
	}
	return -1;
}
/**
* Resolves the transcript policy for an embedded attempt. RuntimePlan owns the
* policy when present; otherwise the older provider/config/env resolver remains
* the compatibility path for callers that have not produced a runtime plan yet.
*/
function resolveAttemptTranscriptPolicy(params) {
	return params.runtimePlan?.transcript.resolvePolicy(params.runtimePlanModelContext) ?? resolveTranscriptPolicy({
		modelApi: params.runtimePlanModelContext.modelApi,
		directApiKey: params.runtimePlanModelContext.directApiKey,
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.runtimePlanModelContext.workspaceDir,
		env: params.env ?? process.env,
		model: typeof params.runtimePlanModelContext.model?.id === "string" ? params.runtimePlanModelContext.model : void 0
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/history-image-prune.ts
/**
* Prunes already-processed image payloads from replayed prompt history.
*/
/** Replacement text for old image blocks that were already available to the model. */
const PRUNED_HISTORY_IMAGE_MARKER = "[image data removed - already processed by model]";
/** Replacement text for fact-owned late-media projections already processed by the model. */
const PRUNED_HISTORY_MEDIA_REFERENCE_MARKER = "[media reference removed - already processed by model]";
const LEGACY_MEDIA_ATTACHED_PATTERN = /\[media attached(?:\s+\d+\/\d+)?:\s*[^\]]+\]/gi;
const LEGACY_IMAGE_SOURCE_PATTERN = /\[Image:\s*source:\s*[^\]]+\]/gi;
const LEGACY_INBOUND_MEDIA_URI_PATTERN = /\bmedia:\/\/inbound\/[^\]\s/\\]+/g;
/**
* Number of most-recent completed turns whose preceding user/toolResult image
* blocks are kept intact. Counts all completed turns, not just image-bearing
* ones, so text-only turns consume the window.
*/
const PRESERVE_RECENT_COMPLETED_TURNS = 3;
function resolvePruneBeforeIndex(messages) {
	const completedTurnStarts = [];
	let currentTurnStart = -1;
	let currentTurnHasAssistantReply = false;
	for (let i = 0; i < messages.length; i++) {
		const role = messages[i]?.role;
		if (role === "user") {
			if (currentTurnStart >= 0 && currentTurnHasAssistantReply) {
				if (completedTurnStarts.length > PRESERVE_RECENT_COMPLETED_TURNS) completedTurnStarts.shift();
				completedTurnStarts.push(currentTurnStart);
			}
			currentTurnStart = i;
			currentTurnHasAssistantReply = false;
			continue;
		}
		if (role === "toolResult") {
			if (currentTurnStart < 0) currentTurnStart = i;
			continue;
		}
		if (role === "assistant" && currentTurnStart >= 0) currentTurnHasAssistantReply = true;
	}
	if (completedTurnStarts.length <= PRESERVE_RECENT_COMPLETED_TURNS) return -1;
	return completedTurnStarts.at(-3) ?? -1;
}
function wasStructurallyMediaPruned(message) {
	return asNonArrayRecord(Reflect.get(message, "__openclaw")).mediaImagePruned === true;
}
function replaceLegacyFactlessMediaText(text) {
	return text.replace(LEGACY_MEDIA_ATTACHED_PATTERN, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).replace(LEGACY_IMAGE_SOURCE_PATTERN, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).replace(LEGACY_INBOUND_MEDIA_URI_PATTERN, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER);
}
function normalizeMarkerIdentity(identity) {
	return identity.replaceAll("\\", "/");
}
function resolveWorkspaceRelativeMarkerAliases(fact) {
	if (!fact.path || !fact.workspaceDir || !path.isAbsolute(fact.path) || !path.isAbsolute(fact.workspaceDir)) return [];
	const relativePath = path.relative(fact.workspaceDir, fact.path);
	if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) return [];
	const normalizedRelativePath = normalizeMarkerIdentity(relativePath);
	return [normalizedRelativePath, `./${normalizedRelativePath}`];
}
function factOwnsMarkerIdentity(identity, media) {
	const normalizedIdentity = normalizeMarkerIdentity(identity);
	return media.some((fact) => {
		return [
			fact.path,
			fact.url,
			...resolveWorkspaceRelativeMarkerAliases(fact)
		].some((alias) => alias && normalizeMarkerIdentity(alias) === normalizedIdentity);
	});
}
function extractMediaAttachedIdentity(marker) {
	const content = marker.replace(/^\[media attached(?:\s+\d+\/\d+)?:\s*/i, "").slice(0, -1);
	const endIndexes = [content.lastIndexOf(" ("), content.indexOf(" | ")].filter((index) => index >= 0);
	const endIndex = endIndexes.length > 0 ? Math.min(...endIndexes) : content.length;
	return content.slice(0, endIndex).trim();
}
function replaceOwnedLegacyMediaMarkers(text, media) {
	return text.replace(LEGACY_MEDIA_ATTACHED_PATTERN, (marker) => factOwnsMarkerIdentity(extractMediaAttachedIdentity(marker), media) ? PRUNED_HISTORY_MEDIA_REFERENCE_MARKER : marker).replace(LEGACY_IMAGE_SOURCE_PATTERN, (marker) => {
		return factOwnsMarkerIdentity(marker.replace(/^\[Image:\s*source:\s*/i, "").slice(0, -1).trim(), media) ? PRUNED_HISTORY_MEDIA_REFERENCE_MARKER : marker;
	});
}
function replaceOwnedMediaProjection(text, media) {
	if (media.length === 0) return text;
	const projectionLines = /* @__PURE__ */ new Set();
	for (const facts of [media, ...media.map((fact) => [fact])]) {
		const projection = buildInboundMediaNoteProjection({ media: facts }).text;
		for (const line of projection?.split("\n") ?? []) if (line) projectionLines.add(line);
	}
	let redacted = text;
	for (const line of projectionLines) redacted = redacted.replaceAll(line, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER);
	for (const fact of media) for (const alias of [fact.path, fact.url].filter((value) => Boolean(value))) redacted = redacted.replaceAll(`[Image: source: ${alias}]`, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).replaceAll(`[media attached: ${alias}]`, PRUNED_HISTORY_MEDIA_REFERENCE_MARKER);
	return replaceOwnedLegacyMediaMarkers(redacted, media);
}
function cloneMessageWithContent(message, content, dropMedia = false, dropImageMetadata = dropMedia) {
	const clone = {
		...message,
		content
	};
	if (dropMedia) {
		delete clone.media;
		stripLegacyMediaContextFields(clone);
	}
	if (dropImageMetadata) {
		const nextMeta = { ...asNonArrayRecord(clone["__openclaw"]) };
		delete nextMeta.mediaImageBlockFactIndexes;
		delete nextMeta.mediaImageLayout;
		if (dropMedia) {
			delete nextMeta.media;
			nextMeta.mediaImagePruned = true;
		}
		if (Object.keys(nextMeta).length > 0) clone["__openclaw"] = nextMeta;
		else delete clone["__openclaw"];
	}
	return clone;
}
/** Prunes old image payloads and references before later LLM-boundary synthesis. */
function pruneProcessedHistoryImages(messages) {
	const pruneBeforeIndex = resolvePruneBeforeIndex(messages);
	if (pruneBeforeIndex < 0) return null;
	let prunedMessages = null;
	for (let i = 0; i < pruneBeforeIndex; i++) {
		const message = messages[i];
		if (!message || message.role !== "user" && message.role !== "toolResult") continue;
		const media = message.role === "user" ? readRuntimePromptMediaFacts(message) ?? readPersistedMediaFacts(message) ?? [] : [];
		const hasOwnedMedia = media.length > 0;
		const structuredMediaWasPruned = wasStructurallyMediaPruned(message);
		const pruneText = (text) => hasOwnedMedia ? replaceOwnedMediaProjection(text, media) : structuredMediaWasPruned ? text : replaceLegacyFactlessMediaText(text);
		const lateMediaText = (message.role === "user" && !hasNonBlankUserText(message.content) ? buildLateMediaAttachedProjection(message) : void 0)?.media.map(() => PRUNED_HISTORY_MEDIA_REFERENCE_MARKER).join("\n");
		const content = lateMediaText ? Array.isArray(message.content) ? [{
			type: "text",
			text: lateMediaText
		}, ...message.content] : lateMediaText : message.content;
		if (typeof content === "string") {
			const nextText = pruneText(content);
			if (nextText !== message.content || hasOwnedMedia) {
				prunedMessages ??= messages.slice();
				prunedMessages[i] = cloneMessageWithContent(message, nextText, hasOwnedMedia);
			}
			continue;
		}
		if (!Array.isArray(content)) continue;
		const contentLength = content.length;
		let nextContent = hasOwnedMedia || lateMediaText ? content.slice(0, contentLength) : void 0;
		let prunedImageBlock = false;
		for (let index = 0; index < contentLength; index += 1) {
			if (!(index in content)) continue;
			const block = content[index];
			let nextBlock;
			if (block?.type === "text" && typeof block.text === "string") {
				const text = pruneText(block.text);
				if (text !== block.text) nextBlock = {
					...block,
					text
				};
			} else if (block?.type === "image") {
				prunedImageBlock = true;
				nextBlock = {
					type: "text",
					text: PRUNED_HISTORY_IMAGE_MARKER
				};
			}
			if (nextBlock !== void 0) {
				nextContent ??= content.slice(0, contentLength);
				nextContent[index] = nextBlock;
			}
		}
		if (nextContent) {
			prunedMessages ??= messages.slice();
			prunedMessages[i] = cloneMessageWithContent(message, nextContent, hasOwnedMedia, hasOwnedMedia || prunedImageBlock);
		}
	}
	return prunedMessages;
}
/** Installs an agent context transform that prunes old image/media history before model input. */
function installHistoryImagePruneContextTransform(agent, mediaOptions, onPruned) {
	const originalTransformContext = agent.transformContext;
	agent.transformContext = async (messages, signal) => {
		const pruned = /* @__PURE__ */ new Map();
		const prune = (source) => {
			const projected = pruneProcessedHistoryImages(source);
			projected?.forEach((message, index) => {
				const original = source[index];
				if (original && message !== original) pruned.set(index, original);
			});
			return projected ?? source;
		};
		const prunedInput = prune(messages);
		const hydratedInput = mediaOptions ? await hydratePromptMediaMessages(prunedInput, mediaOptions) : prunedInput;
		const result = prune(originalTransformContext ? await originalTransformContext.call(agent, hydratedInput, signal) : hydratedInput);
		onPruned?.(pruned);
		return result;
	};
	return () => {
		agent.transformContext = originalTransformContext;
	};
}
//#endregion
export { hasNonBlankUserText as a, resolveAttemptTranscriptPolicy as c, findActiveUserMessageIndex as i, resolveUserTranscriptMessages as l, pruneProcessedHistoryImages as n, isUserTextBlock as o, contentMatchesTimestampOverride as r, projectPersistedSenderContext as s, installHistoryImagePruneContextTransform as t, isRunnerToolCallBlock as u };
