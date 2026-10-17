import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries } from "./string-normalization-CECOqf64.mjs";
import "./reply-payload-NzglYOOT.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { s as readAssistantTextBlocksForPhase, t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-D6jaTF6N.mjs";
import { s as loadTranscriptEventRowsAfterSeqSync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import { l as rewriteAssistantTranscriptMessageForRun } from "./session-accessor-CQ-g9yb2.mjs";
import { d as rewriteTranscriptEventRowsExact, p as withTranscriptWriteLock } from "./session-accessor.sqlite-transcript-write-CPk6xFA-.mjs";
import { r as readAssistantDisplayContent, t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-DPQX-jTt.mjs";
import { n as splitMediaFromOutput } from "./reply-directives-Ciui4dZv.mjs";
import { u as sanitizeAssistantDisplayText } from "./chat-assistant-content-DIH8LIPH.mjs";
import { n as abortedPartialPersistenceError, t as ABORTED_PARTIAL_PERSISTENCE_WARNING } from "./chat-aborted-partial-CGL7cMIA.mjs";
import { t as appendInjectedAssistantMessageToTranscript } from "./chat-transcript-inject-DM_DBukq.mjs";
//#region src/gateway/server-methods/chat-transcript-persistence.ts
function mergeAssistantDisplayContent(modelContent, preparedDisplayContent, retainedCommentary) {
	const remainingDisplayContent = [...preparedDisplayContent];
	const content = [];
	for (const block of modelContent) {
		if (block.type !== "text" || typeof block.text !== "string" || retainedCommentary.has(block)) {
			content.push(block);
			continue;
		}
		const matchingTextIndex = remainingDisplayContent.findIndex((candidate) => candidate.type === "text" && candidate.text === block.text);
		if (matchingTextIndex < 0) {
			content.push(block);
			continue;
		}
		const nextTextOffset = remainingDisplayContent.slice(matchingTextIndex + 1).findIndex((candidate) => candidate.type === "text");
		const segmentEnd = nextTextOffset < 0 ? remainingDisplayContent.length : matchingTextIndex + nextTextOffset + 1;
		content.push(...remainingDisplayContent.splice(0, segmentEnd));
	}
	content.push(...remainingDisplayContent);
	return content;
}
function buildAssistantDisplayRewrite(params) {
	const previousDisplay = Array.isArray(params.message["openclawDisplayContent"]) ? readAssistantDisplayContent(params.message) : void 0;
	const previousMedia = asOptionalRecord(params.message.openclawDelivery)?.mediaUrls;
	const managedMediaUrls = previousDisplay ? [...filterStringEntries(previousMedia), ...params.managedMediaUrls ?? []] : params.managedMediaUrls;
	const prepared = applyAssistantDeliveryDirectives({
		...params.message,
		content: params.displayContent.map((block) => Object.assign({}, block))
	}, { managedMediaUrls });
	const original = previousDisplay ?? (Array.isArray(params.message.content) ? params.message.content : []);
	const retainedCommentary = new Set(previousDisplay ? readAssistantTextBlocksForPhase({
		...params.message,
		content: original
	}, "commentary") : []);
	let inCommentary = false;
	const content = [];
	const seenText = /* @__PURE__ */ new Set();
	for (const block of original) {
		if (block.type === "text") inCommentary = retainedCommentary.has(block);
		if (inCommentary || block.type === "thinking" || block.type === "toolCall") {
			content.push(block);
			continue;
		}
		if (block.type !== "text" || typeof block.text !== "string" || !params.retainOriginalText && !prepared.content.some((candidate) => candidate.type === "text" && candidate.text === block.text)) continue;
		const splitText = splitMediaFromOutput(block.text).text;
		if (splitText === block.text && /\bMEDIA:/iu.test(block.text)) continue;
		const text = sanitizeAssistantDisplayText(splitText, { preserveBoundaries: true });
		if (text) {
			if (text === block.text || previousDisplay) content.push(text === block.text ? block : {
				...block,
				text
			});
			else {
				const { textSignature: _textSignature, ...rest } = block;
				content.push({
					...rest,
					text
				});
			}
			seenText.add(text);
		} else if (previousDisplay) content.push({
			...block,
			text: ""
		});
	}
	for (const block of prepared.content) if (block.type === "text" && typeof block.text === "string" && !seenText.has(block.text)) content.push(block);
	return {
		...prepared,
		content: previousDisplay ? params.message.content : content,
		[ASSISTANT_DISPLAY_CONTENT_FIELD]: mergeAssistantDisplayContent(content, prepared.content, retainedCommentary)
	};
}
function assistantTranscriptScope(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey || !params.sessionId.trim()) return null;
	return {
		sessionKey,
		sessionId: params.sessionId,
		...params.storePath ? { storePath: params.storePath } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	};
}
function transcriptEventId(event) {
	return readNonBlankString(asOptionalRecord(event)?.id);
}
function transcriptEventMessage(event) {
	return asOptionalRecord(asOptionalRecord(event)?.message);
}
function transcriptMessageTarget(event) {
	const message = event ? transcriptEventMessage(event) : void 0;
	const messageId = event ? transcriptEventId(event) : void 0;
	return messageId && message ? {
		messageId,
		message
	} : null;
}
function findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey) {
	const trimmedIdempotencyKey = idempotencyKey.trim();
	if (!trimmedIdempotencyKey) return null;
	return transcriptMessageTarget(events.findLast((event) => {
		const message = transcriptEventMessage(event);
		return message?.role === "assistant" && message.idempotencyKey === trimmedIdempotencyKey;
	}));
}
function findAssistantTranscriptMessageByTurnIndexAndMediaInEvents(events, params) {
	const expectedMedia = new Set(params.mediaUrls.map((value) => normalizeMediaReferenceForComparison(value)).filter((value) => value.length > 0));
	if (expectedMedia.size === 0 && params.rejectedMediaCount === 0 || !Number.isSafeInteger(params.assistantMessageIndex) || params.assistantMessageIndex < 1) return null;
	const target = events.filter((event) => transcriptEventMessage(event)?.role === "assistant")[params.assistantMessageIndex - 1];
	const found = transcriptMessageTarget(target);
	const text = found ? extractAssistantPhaseText(found.message) : void 0;
	if (!found || !text) return null;
	const parsed = splitMediaFromOutput(text);
	const actualMedia = new Set((parsed.mediaUrls ?? []).map((value) => normalizeMediaReferenceForComparison(value)).filter((value) => value.length > 0));
	return actualMedia.size === expectedMedia.size && [...expectedMedia].every((value) => actualMedia.has(value)) && (parsed.rejectedMediaCount ?? 0) === params.rejectedMediaCount ? found : null;
}
function extractAssistantTranscriptText(message) {
	const content = message.content;
	if (!Array.isArray(content)) return;
	return content.map((value) => {
		const block = asOptionalObjectRecord(value);
		return block?.type === "text" && typeof block.text === "string" ? block.text.trim() : "";
	}).filter(Boolean).join("\n").trim() || void 0;
}
function findSourceReplyTranscriptMirrorByMetadataInEvents(params) {
	const byIdempotencyKey = findAssistantTranscriptMessageByIdempotencyKeyInEvents(params.events, params.idempotencyKey);
	if (byIdempotencyKey?.message.provider === "openclaw" && byIdempotencyKey.message.model === "delivery-mirror") return byIdempotencyKey;
	const expectedText = resolveMirroredTranscriptText({
		text: params.metadata?.text,
		mediaUrls: params.metadata?.mediaUrls
	});
	if (!expectedText) return null;
	return transcriptMessageTarget(params.events.findLast((event) => {
		const message = transcriptEventMessage(event);
		return typeof transcriptEventId(event) === "string" && message?.role === "assistant" && message.provider === "openclaw" && message.model === "delivery-mirror" && extractAssistantTranscriptText(message) === expectedText;
	}));
}
async function persistAbortedPartials(params) {
	let warning;
	for (const snapshot of params.snapshots) {
		if (snapshot.ok && snapshot.settlement.deferred) continue;
		try {
			warning = await persistAbortedPartial({
				context: params.context,
				snapshot
			}) ?? warning;
		} catch (error) {
			throw abortedPartialPersistenceError(error, warning);
		}
	}
	return warning;
}
async function persistAbortedPartial(params) {
	const { snapshot } = params;
	if (!snapshot.ok) throw snapshot.error;
	const appended = await appendInjectedAssistantMessageToTranscript({
		...snapshot.value,
		abortMeta: {
			...snapshot.value.abortMeta,
			...params.producerSettled ? { producerSettled: true } : {}
		}
	});
	if (appended.skipped || appended.ok) return;
	const error = `chat.abort transcript append failed: ${appended.error ?? "unknown error"}`;
	params.context.logGateway.warn(error);
	if (snapshot.abortOrigin === "placement-abandon") throw new Error(error);
	return ABORTED_PARTIAL_PERSISTENCE_WARNING;
}
async function touchAssistantTranscriptSessionEntry(scope) {
	if (!scope.storePath || !scope.sessionKey || !scope.sessionId) return;
	const transcriptMarkerUpdatedAt = Date.now();
	await patchSessionEntryCore({
		storePath: scope.storePath,
		sessionKey: scope.sessionKey,
		...scope.agentId ? { agentId: scope.agentId } : {}
	}, (current) => current.sessionId === scope.sessionId ? { updatedAt: transcriptMarkerUpdatedAt } : null, { skipMaintenance: true });
}
async function rewriteSourceReplyTranscriptMirrors(params) {
	if (params.requests.length === 0 || params.candidates.length === 0) return [];
	return await withTranscriptWriteLock(params.scope, async (transcript) => {
		const events = await transcript.readEvents();
		const allowedSourceReplyMirrorIds = /* @__PURE__ */ new Set();
		for (const candidate of params.candidates) {
			const target = findSourceReplyTranscriptMirrorByMetadataInEvents({
				events,
				idempotencyKey: candidate.idempotencyKey,
				metadata: candidate.metadata
			});
			if (target) allowedSourceReplyMirrorIds.add(target.messageId);
		}
		const rewriteTargets = [];
		for (const request of params.requests) {
			const target = findSourceReplyTranscriptMirrorByMetadataInEvents({
				events,
				idempotencyKey: request.idempotencyKey,
				metadata: request.metadata
			});
			if (target) rewriteTargets.push({
				request,
				...target
			});
		}
		if (rewriteTargets.length === 0) return [];
		const rewriteTargetIds = new Set(rewriteTargets.map((target) => target.messageId));
		const firstRewriteEntryIndex = events.findIndex((event) => {
			const id = transcriptEventId(event);
			return id ? rewriteTargetIds.has(id) : false;
		});
		if (!(firstRewriteEntryIndex >= 0 && events.slice(firstRewriteEntryIndex).every((event) => {
			const id = transcriptEventId(event);
			return !id || allowedSourceReplyMirrorIds.has(id);
		}))) return [];
		const replacementsById = new Map(rewriteTargets.map((target) => [target.messageId, target]));
		const rewrittenEvents = events.map((event) => {
			const id = transcriptEventId(event);
			const replacement = id ? replacementsById.get(id) : void 0;
			if (!replacement) return event;
			const message = buildAssistantDisplayRewrite({
				message: {
					...replacement.message,
					idempotencyKey: replacement.request.idempotencyKey
				},
				displayContent: replacement.request.state.persistedContent,
				managedMediaUrls: replacement.request.metadata?.mediaUrls
			});
			return Object.assign({}, event, { message });
		});
		await transcript.replaceEvents(rewrittenEvents);
		return rewriteTargets.map((target) => ({
			messageId: target.messageId,
			request: target.request
		}));
	});
}
async function rewriteAssistantTranscriptMessageByIdempotencyKey(params) {
	const idempotencyKey = params.idempotencyKey.trim();
	if (!idempotencyKey || params.content.length === 0) return null;
	return await withTranscriptWriteLock(params.scope, async (transcript) => {
		const events = await transcript.readEvents();
		const target = findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey);
		if (!target) return null;
		const rewrittenEvents = events.map((event) => transcriptEventId(event) === target.messageId ? Object.assign({}, event, { message: buildAssistantDisplayRewrite({
			message: target.message,
			displayContent: params.content,
			managedMediaUrls: params.managedMediaUrls
		}) }) : event);
		await transcript.replaceEvents(rewrittenEvents);
		return { messageId: target.messageId };
	});
}
async function rewriteAssistantTranscriptMessageByTurnIndexAndMedia(params) {
	if (params.content.length === 0 || params.mediaUrls.length === 0 && params.rejectedMediaCount === 0) return null;
	const currentWatermark = readSessionTranscriptWatermark(params.scope);
	const initialGenerationMaterialized = params.expectedGeneration === null && params.afterSeq === 0;
	if (currentWatermark.generation !== params.expectedGeneration && !initialGenerationMaterialized) return null;
	const currentTurnRows = loadTranscriptEventRowsAfterSeqSync(params.scope, params.afterSeq);
	const target = findAssistantTranscriptMessageByTurnIndexAndMediaInEvents(currentTurnRows.map((row) => row.event), params);
	if (!target) return null;
	const targetRow = currentTurnRows.find((row) => transcriptEventId(row.event) === target.messageId);
	if (!targetRow) return null;
	const rewrittenMessage = buildAssistantDisplayRewrite({
		message: target.message,
		displayContent: params.content,
		managedMediaUrls: params.mediaUrls,
		retainOriginalText: true
	});
	const rewrittenEvent = Object.assign({}, targetRow.event, { message: rewrittenMessage });
	const rewritten = await rewriteTranscriptEventRowsExact(params.scope, {
		allowInitialGenerationMaterialization: initialGenerationMaterialized,
		expectedGeneration: params.expectedGeneration,
		rows: [{
			event: rewrittenEvent,
			expectedEventJson: JSON.stringify(targetRow.event),
			seq: targetRow.seq
		}]
	});
	return rewritten ? {
		generation: rewritten.generation,
		messageId: target.messageId
	} : null;
}
/** Adds managed display media to the completion reply without rewriting model content. */
async function enrichAssistantTranscriptMediaForRun(params) {
	return await rewriteAssistantTranscriptMessageForRun({
		scope: params.scope,
		runId: params.runId,
		expectedLifecycleRevision: params.expectedLifecycleRevision,
		rewriteMessage: (message) => ({
			...buildAssistantDisplayRewrite({
				message,
				displayContent: params.content,
				managedMediaUrls: params.mediaUrls,
				retainOriginalText: true
			}),
			content: message.content
		})
	});
}
async function publishAssistantTranscriptRewrite(params) {
	if (params.rewritten.length === 0) return;
	await touchAssistantTranscriptSessionEntry(params.scope);
	await publishTranscriptUpdate(params.scope, { messageId: params.rewritten.at(-1)?.messageId });
}
//#endregion
export { publishAssistantTranscriptRewrite as a, rewriteSourceReplyTranscriptMirrors as c, persistAbortedPartials as i, enrichAssistantTranscriptMediaForRun as n, rewriteAssistantTranscriptMessageByIdempotencyKey as o, persistAbortedPartial as r, rewriteAssistantTranscriptMessageByTurnIndexAndMedia as s, assistantTranscriptScope as t };
