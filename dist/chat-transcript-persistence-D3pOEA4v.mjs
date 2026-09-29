import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as readSessionTranscriptRunId, s as resolveTerminalAssistantTranscriptRunId } from "./transcript-events-DukKauix.mjs";
import "./reply-payload-B2ZQhznY.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-DeX5XiDx.mjs";
import { f as withTranscriptWriteLock, u as rewriteTranscriptEventRowsExact } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { k as applyAssistantDeliveryDirectives, n as findTranscriptEvent, s as loadTranscriptEventRowsAfterSeqSync } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { s as readAssistantTextBlocksForPhase, t as extractAssistantPhaseText } from "./chat-message-content-D14VlZZc.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import { E as rewriteAssistantTranscriptMessageForRun, l as readSessionTranscriptWatermark, p as persistSessionTranscriptTurn } from "./session-accessor-l-4ZHvKn.mjs";
import { i as retainAssistantModelContent, n as projectAssistantDisplayContent, r as readAssistantDisplayContent, t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-DotKkoz0.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-DgtCkbrJ.mjs";
import { n as splitMediaFromOutput } from "./reply-directives-CeJbvk_b.mjs";
import { u as sanitizeAssistantDisplayText } from "./chat-assistant-content-D3mKi3AD.mjs";
//#region src/gateway/server-methods/chat-transcript-inject.ts
function resolveInjectedAssistantContent(params) {
	const labelPrefix = params.label ? `[${params.label}]\n\n` : "";
	if (params.content && params.content.length > 0) {
		if (!labelPrefix) return params.content;
		const first = params.content[0];
		if (first && typeof first === "object" && first.type === "text" && typeof first.text === "string") return [{
			...first,
			text: `${labelPrefix}${first.text}`
		}, ...params.content.slice(1)];
		return [{
			type: "text",
			text: labelPrefix.trim()
		}, ...params.content];
	}
	return [{
		type: "text",
		text: `${labelPrefix}${params.message}`
	}];
}
/** Append a gateway-authored assistant message while preserving transcript parent links. */
async function appendInjectedAssistantMessageToTranscript(params) {
	const now = params.now ?? Date.now();
	const usage = {
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
	const displayMessage = {
		role: "assistant",
		content: resolveInjectedAssistantContent({
			message: params.message,
			label: params.label,
			content: params.content
		}).map((block) => Object.assign({}, block))
	};
	const preparedDisplayMessage = applyAssistantDeliveryDirectives(displayMessage);
	const displayContent = preparedDisplayMessage.content;
	const canonicalContent = retainAssistantModelContent(displayContent);
	const rawDeliveryFacts = preparedDisplayMessage.openclawDelivery;
	const abortRunId = params.abortMeta?.runId;
	const messageBody = applyAssistantDeliveryDirectives({
		role: "assistant",
		content: canonicalContent,
		[ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent,
		timestamp: now,
		stopReason: params.stopReason ?? "stop",
		usage,
		api: "openai-responses",
		provider: "openclaw",
		model: "gateway-injected",
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...params.ttsSupplement ? { openclawTtsSupplement: params.ttsSupplement } : {},
		...params.contextFreeCommand === true ? {
			excludeFromContext: true,
			__openclaw: { contextFreeCommand: true }
		} : {},
		...params.abortMeta ? { openclawAbort: {
			aborted: true,
			origin: params.abortMeta.origin,
			runId: params.abortMeta.runId
		} } : {}
	});
	if (rawDeliveryFacts && messageBody.openclawDelivery === void 0) messageBody.openclawDelivery = rawDeliveryFacts;
	try {
		if (!params.transcriptPath && (!params.storePath || !params.sessionId || !params.sessionKey)) return {
			ok: false,
			error: "transcript identity not resolved"
		};
		let predicateDeclined = false;
		const turn = await persistSessionTranscriptTurn({
			sessionKey: params.sessionKey ?? "",
			...params.transcriptPath ? { sessionFile: params.transcriptPath } : {},
			...params.storePath ? { storePath: params.storePath } : {},
			...params.sessionId ? { sessionId: params.sessionId } : {},
			...params.agentId ? { agentId: params.agentId } : {}
		}, {
			expectedSessionId: params.expectedSessionId,
			expectedLifecycleRevision: params.expectedLifecycleRevision,
			updateMode: "inline",
			...params.abortMeta ? { runId: params.abortMeta.runId } : {},
			touchSessionEntry: Boolean(params.storePath && params.sessionId && params.sessionKey),
			...params.config ? { config: params.config } : {},
			messages: [{
				message: messageBody,
				idempotencyLookup: "scan-assistant",
				...params.abortMeta ? { shouldAppendInTransaction: (latestAssistantMessage) => {
					const committedRunId = resolveTerminalAssistantTranscriptRunId(latestAssistantMessage, readSessionTranscriptRunId(latestAssistantMessage));
					const committedText = extractAssistantPhaseText(latestAssistantMessage)?.trim();
					predicateDeclined = committedRunId === abortRunId && committedText === params.message.trim();
					return !predicateDeclined;
				} } : {},
				now,
				useRawWhenLinear: true
			}]
		});
		if (turn.rejectedReason) return {
			ok: false,
			error: turn.rejectedReason
		};
		const appended = turn.messages[0];
		if (!appended) {
			if (predicateDeclined) return {
				ok: true,
				skipped: true
			};
			return {
				ok: false,
				error: "gateway-injected assistant message was not appended"
			};
		}
		return {
			ok: true,
			messageId: appended.messageId,
			message: projectAssistantDisplayContent(appended.message)
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
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
	const managedMediaUrls = previousDisplay ? [...Array.isArray(previousMedia) ? previousMedia.filter((value) => typeof value === "string") : [], ...params.managedMediaUrls ?? []] : params.managedMediaUrls;
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
		if (inCommentary) {
			content.push(block);
			continue;
		}
		if (block.type === "thinking" || block.type === "toolCall") {
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
	const id = asOptionalRecord(event)?.id;
	return typeof id === "string" && id.trim().length > 0 ? id : void 0;
}
function transcriptEventMessage(event) {
	return asOptionalRecord(asOptionalRecord(event)?.message);
}
function findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey) {
	const trimmedIdempotencyKey = idempotencyKey.trim();
	if (!trimmedIdempotencyKey) return null;
	const target = events.toReversed().find((event) => {
		const message = transcriptEventMessage(event);
		return message?.role === "assistant" && message.idempotencyKey === trimmedIdempotencyKey;
	});
	const message = target ? transcriptEventMessage(target) : void 0;
	const messageId = target ? transcriptEventId(target) : void 0;
	if (!messageId || !message) return null;
	return {
		messageId,
		message
	};
}
function findAssistantTranscriptMessageByTurnIndexAndMediaInEvents(events, params) {
	const expectedMedia = new Set(params.mediaUrls.map((value) => normalizeMediaReferenceForComparison(value)).filter((value) => value.length > 0));
	if (expectedMedia.size === 0 || !Number.isSafeInteger(params.assistantMessageIndex) || params.assistantMessageIndex < 1) return null;
	const target = events.filter((event) => transcriptEventMessage(event)?.role === "assistant")[params.assistantMessageIndex - 1];
	const message = target ? transcriptEventMessage(target) : void 0;
	const messageId = target ? transcriptEventId(target) : void 0;
	const text = message ? extractAssistantPhaseText(message) : void 0;
	if (!messageId || !message || !text) return null;
	const actualMedia = new Set((splitMediaFromOutput(text).mediaUrls ?? []).map((value) => normalizeMediaReferenceForComparison(value)).filter((value) => value.length > 0));
	return actualMedia.size === expectedMedia.size && [...expectedMedia].every((value) => actualMedia.has(value)) ? {
		messageId,
		message
	} : null;
}
function findSourceReplyTranscriptMirrorByIdempotencyKeyInEvents(events, idempotencyKey) {
	const found = findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey);
	if (found?.message.provider !== "openclaw" || found.message.model !== "delivery-mirror") return null;
	return found;
}
function extractAssistantTranscriptText(message) {
	const content = message.content;
	if (!Array.isArray(content)) return;
	return content.map((block) => block && typeof block === "object" && block.type === "text" && typeof block.text === "string" ? block.text.trim() ?? "" : "").filter(Boolean).join("\n").trim() || void 0;
}
function findSourceReplyTranscriptMirrorByMetadataInEvents(params) {
	const byIdempotencyKey = findSourceReplyTranscriptMirrorByIdempotencyKeyInEvents(params.events, params.idempotencyKey);
	if (byIdempotencyKey) return byIdempotencyKey;
	const expectedText = resolveMirroredTranscriptText({
		text: params.metadata?.text,
		mediaUrls: params.metadata?.mediaUrls
	});
	if (!expectedText) return null;
	const target = params.events.toReversed().find((event) => {
		const message = transcriptEventMessage(event);
		return typeof transcriptEventId(event) === "string" && message?.role === "assistant" && message.provider === "openclaw" && message.model === "delivery-mirror" && extractAssistantTranscriptText(message) === expectedText;
	});
	const message = target ? transcriptEventMessage(target) : void 0;
	const messageId = target ? transcriptEventId(target) : void 0;
	if (!messageId || !message) return null;
	return {
		messageId,
		message
	};
}
async function transcriptExists(scope) {
	const sessionId = scope.sessionId;
	if (!sessionId) return false;
	return await findTranscriptEvent({
		...scope,
		sessionId
	}, () => true).catch(() => void 0) !== void 0;
}
async function appendAssistantTranscriptMessage(params) {
	const scope = assistantTranscriptScope(params);
	if (!scope) return {
		ok: false,
		error: "transcript identity not resolved"
	};
	if (!params.createIfMissing && !await transcriptExists(scope)) return {
		ok: false,
		error: "transcript not found"
	};
	return await appendInjectedAssistantMessageToTranscript({
		expectedSessionId: params.expectedSessionId,
		expectedLifecycleRevision: params.expectedLifecycleRevision,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		storePath: params.storePath,
		...params.agentId ? { agentId: params.agentId } : {},
		message: params.message,
		label: params.label,
		content: params.content,
		idempotencyKey: params.idempotencyKey,
		stopReason: params.stopReason,
		abortMeta: params.abortMeta,
		ttsSupplement: params.ttsSupplement,
		...params.contextFreeCommand === true ? { contextFreeCommand: true } : {},
		config: params.cfg
	});
}
async function persistAbortedPartials(params) {
	for (const snapshot of params.snapshots) {
		if (!snapshot.ok) throw snapshot.error;
		const appended = await appendAssistantTranscriptMessage(snapshot.value);
		if (appended.skipped) continue;
		if (!appended.ok) {
			const error = `chat.abort transcript append failed: ${appended.error ?? "unknown error"}`;
			params.context.logGateway.warn(error);
			if (snapshot.abortOrigin === "placement-abandon") throw new Error(error);
		}
	}
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
	if (params.content.length === 0 || params.mediaUrls.length === 0) return null;
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
export { publishAssistantTranscriptRewrite as a, rewriteSourceReplyTranscriptMirrors as c, persistAbortedPartials as i, assistantTranscriptScope as n, rewriteAssistantTranscriptMessageByIdempotencyKey as o, enrichAssistantTranscriptMediaForRun as r, rewriteAssistantTranscriptMessageByTurnIndexAndMedia as s, appendAssistantTranscriptMessage as t };
