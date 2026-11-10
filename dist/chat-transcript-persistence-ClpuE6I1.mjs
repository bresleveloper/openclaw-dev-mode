import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { s as readAssistantTextBlocksForPhase, t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import "./reply-payload-BLX_BF2U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as readAssistantDisplayContent, t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { s as withoutSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { i as withTranscriptLockSettlement } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { c as rewritePreparedAssistantTranscriptMessageForRun } from "./session-accessor-Czw4l8kI.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { c as loadTranscriptEventRowsAfterSeqSync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { n as applySessionEntryTargetOperation, t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import { l as withTranscriptWriteSequence, s as rewriteTranscriptEventRowsExact } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { t as executeSessionMessageRewriteOperation } from "./session-message-rewrite-domain-D1FyYmve.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-BSOdHT4f.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { t as splitMediaFromOutput } from "./parse-BFtzJA_B.mjs";
import { l as sanitizeAssistantDisplayText } from "./chat-assistant-content-D60Lu4da.mjs";
import { n as abortedPartialPersistenceError, t as ABORTED_PARTIAL_PERSISTENCE_WARNING } from "./chat-aborted-partial-BuPGs0tJ.mjs";
import { t as appendInjectedAssistantMessageToTranscript } from "./chat-transcript-inject-BjZUebz7.mjs";
import { isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-transcript-correction.ts
function selectCorrectionRows(events, replacement, eventJson) {
	if (replacement.length !== events.length) throw new Error("Transcript correction cannot add or remove events");
	return replacement.flatMap((event, index) => {
		const original = events[index];
		if (event === original) return [];
		if (!isRecord(original) || typeof original.id !== "string") throw new Error("Transcript correction requires an identified event");
		return [{
			entryId: original.id,
			expectedEventJson: eventJson[index],
			event
		}];
	});
}
/** Pure display preparation retains its source until exact-row commit and cleanup settle. */
async function withPreparedTranscriptCorrection(requested, run, afterSeq) {
	const assertCaller = captureOwnedTranscriptWriteAssertion(requested);
	const callerAuthority = {
		assertCurrent: assertCaller,
		authorize: assertCaller
	};
	if (captureSessionActorStorageOwner(requested, callerAuthority)) {
		const result = await withSessionActorStorage(requested, {
			authority: callerAuthority,
			lifetime: {
				assertCurrent: assertCaller,
				assertReadable: assertCaller
			}
		}, async () => ({ value: await runPreparedTranscriptCorrection(requested, run, afterSeq) }));
		if (!result) throw new Error("Session transcript window is unavailable");
		return result.value;
	}
	return runPreparedTranscriptCorrection(requested, run, afterSeq);
}
async function runPreparedTranscriptCorrection(requested, run, afterSeq) {
	const fenced = withOwnedSessionTranscriptWriterFence(requested);
	const memory = getSessionActorStorageBinding(fenced);
	const selectedSessionId = fenced.sessionId ?? memory?.actor.snapshot(memory.authority)?.entry?.sessionId;
	if (memory && !selectedSessionId) throw new Error("Transcript correction requires its selected session window");
	const target = memory ? {
		agentId: memory.agentId,
		path: memory.path,
		sessionKey: memory.actor.target.sessionKey,
		sessionId: selectedSessionId,
		env: fenced.env
	} : resolveSqliteTranscriptScope(fenced);
	const scope = {
		...fenced,
		sessionId: target.sessionId
	};
	const assertOwned = captureOwnedTranscriptWriteAssertion(scope);
	if (memory) {
		const authority = {
			...memory.authority,
			assertCurrent() {
				memory.authority.assertCurrent();
				memory.actor.assertReadable();
				assertOwned();
			}
		};
		const snapshot = await memory.actor.storage.read({
			type: "session.correction.prepare",
			input: {
				scope,
				afterSeq
			}
		}, authority);
		const eventJson = snapshot.rows.map((row) => row.eventJson);
		const events = eventJson.map((json) => JSON.parse(json));
		let generation = snapshot.version.generation;
		const value = await withTranscriptLockSettlement((enqueue) => {
			const queue = AsyncLocalStorage.bind(enqueue);
			return run({
				get generation() {
					return generation;
				},
				readEvents: () => queue(async () => {
					authority.assertCurrent();
					return events;
				}),
				replaceEvents: (replacement) => queue(async () => {
					const outcome = await memory.actor.storage.mutate({
						type: "session.correction.commit",
						input: {
							scope,
							version: snapshot.version,
							rows: selectCorrectionRows(events, replacement, eventJson),
							allowLaterAppends: afterSeq !== void 0
						}
					}, authority);
					generation = readSessionActorStorageResult(outcome).generation;
				})
			});
		});
		authority.assertCurrent();
		return value;
	}
	const runNative = async (native) => {
		if (afterSeq !== void 0) {
			const rows = loadTranscriptEventRowsAfterSeqSync(native, afterSeq);
			const context = {
				generation: readSessionTranscriptWatermark(native).generation,
				readEvents: async () => rows.map((row) => row.event),
				replaceEvents: async (events) => {
					const rewritten = await rewriteTranscriptEventRowsExact(native, {
						expectedGeneration: context.generation,
						rows: events.flatMap((event, index) => event === rows[index]?.event ? [] : [{
							event,
							expectedEventJson: JSON.stringify(rows[index].event),
							seq: rows[index].seq
						}])
					});
					context.generation = rewritten?.generation ?? null;
				}
			};
			return run(context);
		}
		return withTranscriptWriteSequence({
			...scope,
			...native
		}, (locked) => run({
			...locked,
			generation: readSessionTranscriptWatermark(native).generation
		}));
	};
	if (!isMainThread) return runNative(scope);
	return withSessionTranscriptReadSource(scope, async (source) => {
		const assertCurrent = () => {
			source.assertCurrent();
			assertOwned();
		};
		const database = {
			...toDatabaseOptions(source.resolved),
			path: source.scope.storePath
		};
		const resolved = {
			...source.resolved,
			sessionKey: source.resolved.sessionKey ?? target.sessionKey
		};
		if (!source.expectedIdentity) return run({
			generation: null,
			readEvents: async () => [],
			replaceEvents: async () => {
				throw new Error("Cannot correct a missing transcript");
			}
		});
		const result = await runSessionEntryWorkerOperation({
			database,
			agentId: resolved.agentId,
			assertCurrent,
			candidateKind: "session-transcript-correction",
			prepareWorker: () => ({
				async prepare() {
					const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
					await restoreSessionColdTranscript(source.scope, assertCurrent);
				},
				beforeWrite: assertCurrent,
				async release() {}
			}),
			async run(worker, commit) {
				const hydration = await source.owner.readTranscript({
					target: source.scope,
					resolvedScope: resolved,
					expectedIdentity: source.expectedIdentity,
					afterSeq,
					includeEventJson: true
				});
				assertCurrent();
				if (hydration.kind !== "full" || !hydration.snapshot.eventJson) throw new Error("Transcript correction requires its complete source bytes");
				const { events, eventJson, version } = hydration.snapshot;
				const context = {
					generation: version.generation,
					readEvents: async () => events,
					replaceEvents: async (replacement) => {
						assertCurrent();
						const rows = selectCorrectionRows(events, replacement, eventJson);
						const committed = await commit(() => executeSessionMessageRewriteOperation(worker, database.agentId, {
							type: "session.transcript.correct",
							input: {
								scope: resolved,
								fence: scope,
								version,
								rows,
								allowLaterAppends: afterSeq !== void 0
							}
						}));
						if (!("generation" in committed)) throw new Error("Transcript correction omitted its committed generation");
						context.generation = committed.generation;
					}
				};
				const value = await run(context);
				assertCurrent();
				return { value };
			},
			onCommitted: ({ generation }) => ({ generation })
		});
		if (!("value" in result)) throw new Error("Transcript correction omitted its selected result");
		return result.value;
	}, void 0, targetDiscoveryLane);
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
	const managedMediaUrls = previousDisplay ? [...filterStringEntries(previousMedia), ...params.managedMediaUrls ?? []] : params.managedMediaUrls;
	const preparedBlocks = /* @__PURE__ */ new Map();
	const prepared = applyAssistantDeliveryDirectives({
		...params.message,
		content: params.displayContent.map((block) => {
			const preparedBlock = Object.assign({}, block);
			preparedBlocks.set(block, preparedBlock);
			return preparedBlock;
		})
	}, { managedMediaUrls });
	const modelContent = Array.isArray(params.message.content) ? params.message.content : [];
	let original = previousDisplay ?? modelContent;
	if (previousDisplay && params.mediaBySource?.size) {
		const phasedFinal = readAssistantTextBlocksForPhase(params.message, "final_answer");
		const finalText = phasedFinal.length ? phasedFinal : readAssistantTextBlocksForPhase(params.message);
		const previousCommentary = new Set(readAssistantTextBlocksForPhase({
			...params.message,
			content: previousDisplay
		}, "commentary"));
		let restored = false;
		original = previousDisplay.flatMap((block) => {
			if (block.type !== "text" || previousCommentary.has(block)) return [block];
			const replacement = restored ? [] : finalText;
			restored = true;
			return replacement;
		});
	}
	const retainedCommentary = new Set(previousDisplay ? readAssistantTextBlocksForPhase({
		...params.message,
		content: original
	}, "commentary") : []);
	const authoredText = extractAssistantPhaseText(params.message);
	const joinedCaption = authoredText ? sanitizeAssistantDisplayText(splitMediaFromOutput(authoredText).text) : void 0;
	const matchingCaptions = params.mediaBySource?.size && joinedCaption ? prepared.content.filter((block) => block.type === "text" && typeof block.text === "string" && sanitizeAssistantDisplayText(block.text) === joinedCaption) : [];
	const retainOriginalText = params.retainOriginalText || matchingCaptions.length > 0;
	let inCommentary = false;
	const content = [];
	const seenText = /* @__PURE__ */ new Set();
	const consumedDisplay = new Set(matchingCaptions);
	for (const block of original) {
		if (block.type === "text") inCommentary = retainedCommentary.has(block);
		if (inCommentary || block.type === "thinking" || block.type === "toolCall") {
			content.push(block);
			continue;
		}
		if (block.type === "text" && typeof block.text === "string" && params.mediaBySource) {
			const parsed = splitMediaFromOutput(block.text);
			const segments = parsed.segments ?? [];
			const visibleText = sanitizeAssistantDisplayText(parsed.text);
			const hasManagedSlot = segments.some((segment) => segment.type === "media" && params.mediaBySource?.has(normalizeMediaReferenceForComparison(segment.url)));
			const matchingText = prepared.content.filter((candidate) => candidate.type === "text" && typeof candidate.text === "string" && sanitizeAssistantDisplayText(candidate.text) === visibleText);
			if (hasManagedSlot && (retainOriginalText || matchingText.length > 0 || !visibleText)) {
				for (const segment of segments) if (segment.type === "media") {
					const group = params.mediaBySource.get(normalizeMediaReferenceForComparison(segment.url));
					for (const sourceBlock of group ?? []) {
						const media = preparedBlocks.get(sourceBlock);
						if (media && !consumedDisplay.has(media)) {
							content.push(media);
							consumedDisplay.add(media);
						}
					}
				} else {
					const text = sanitizeAssistantDisplayText(segment.text, { preserveBoundaries: true });
					if (text) {
						const { textSignature: _textSignature, ...rest } = block;
						content.push({
							...rest,
							text
						});
					}
				}
				seenText.add(parsed.text);
				matchingText.forEach((candidate) => consumedDisplay.add(candidate));
				continue;
			}
		}
		if (block.type !== "text" || typeof block.text !== "string" || !retainOriginalText && !prepared.content.some((candidate) => candidate.type === "text" && candidate.text === block.text)) continue;
		const splitText = splitMediaFromOutput(block.text).text;
		if (splitText === block.text && /\bMEDIA:/iu.test(block.text)) continue;
		const text = sanitizeAssistantDisplayText(splitText, { preserveBoundaries: true });
		if (text) {
			if (text === block.text) content.push(block);
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
	for (const block of prepared.content) if (block.type === "text" && typeof block.text === "string" && !seenText.has(block.text) && !consumedDisplay.has(block)) content.push(block);
	return {
		...prepared,
		content: params.message.content,
		[ASSISTANT_DISPLAY_CONTENT_FIELD]: mergeAssistantDisplayContent(content, prepared.content.filter((block) => !consumedDisplay.has(block)), retainedCommentary)
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
function mediaReferenceSet(mediaUrls) {
	return new Set(mediaUrls.map(normalizeMediaReferenceForComparison).filter((value) => value.length > 0));
}
function findAssistantTranscriptMessageByTurnIndexAndMediaInEvents(events, params) {
	const expectedMedia = mediaReferenceSet(params.mediaUrls);
	if (expectedMedia.size === 0 && params.rejectedMediaCount === 0 || !Number.isSafeInteger(params.assistantMessageIndex) || params.assistantMessageIndex < 1) return null;
	const target = events.filter((event) => transcriptEventMessage(event)?.role === "assistant")[params.assistantMessageIndex - 1];
	const found = transcriptMessageTarget(target);
	const text = found ? extractAssistantPhaseText(found.message) : void 0;
	if (!found || !text) return null;
	const parsed = splitMediaFromOutput(text);
	const actualMedia = mediaReferenceSet(parsed.mediaUrls ?? []);
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
				...params,
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
	if (params.missingToolResultText) {
		const [{ SessionManager }, { repairToolUseResultPairing }] = await Promise.all([import("./session-manager-B8wSD1pF.mjs"), import("./session-transcript-repair-CegdIOCG.mjs")]);
		const target = {
			...snapshot.value,
			expectedWriterRunId: snapshot.runId,
			expectedLifecycleRevision: snapshot.value.expectedLifecycleRevision ?? void 0,
			expectedOwner: {
				lifecycleRevision: snapshot.value.expectedLifecycleRevision ?? void 0,
				activeWriterRunId: snapshot.runId
			}
		};
		const manager = await withoutSessionTranscriptReadFence(() => SessionManager.openAsync(target));
		const messages = manager.buildSessionContext().messages;
		const start = messages.findLastIndex((message) => message.role === "user");
		for (const result of repairToolUseResultPairing(messages.slice(Math.max(0, start)), { missingToolResultText: params.missingToolResultText }).added) await manager.appendMessageAsync(result);
		if (!snapshot.value.message.trim()) return;
	}
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
async function touchAssistantTranscriptSessionEntry(scope, readSource) {
	if (!scope.storePath || !scope.sessionKey || !scope.sessionId) return;
	const transcriptMarkerUpdatedAt = Date.now();
	const target = {
		storePath: scope.storePath,
		sessionKey: scope.sessionKey,
		...scope.agentId ? { agentId: scope.agentId } : {}
	};
	const operation = {
		kind: "fields",
		expected: { sessionId: scope.sessionId },
		patch: { updatedAt: transcriptMarkerUpdatedAt }
	};
	if (readSource) await applySessionEntryTargetOperation({
		...target,
		readSource,
		target: {
			canonicalKey: scope.sessionKey,
			storeKeys: [scope.sessionKey]
		}
	}, operation, { skipMaintenance: true });
	else await applySessionEntryOperation(target, operation, { skipMaintenance: true });
}
async function rewriteSourceReplyTranscriptMirrors(params) {
	if (params.requests.length === 0 || params.candidates.length === 0) return [];
	return await withPreparedTranscriptCorrection(params.scope, async (transcript) => {
		const events = await transcript.readEvents();
		const findMirror = (mirror) => findSourceReplyTranscriptMirrorByMetadataInEvents({
			...mirror,
			events
		});
		const allowedSourceReplyMirrorIds = /* @__PURE__ */ new Set();
		for (const candidate of params.candidates) {
			const target = findMirror(candidate);
			if (target) allowedSourceReplyMirrorIds.add(target.messageId);
		}
		const rewriteTargets = params.requests.flatMap((request) => {
			const target = findMirror(request);
			return target ? [{
				request,
				...target
			}] : [];
		});
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
	return await withPreparedTranscriptCorrection(params.scope, async (transcript) => {
		const events = await transcript.readEvents();
		const target = findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey);
		if (!target) return null;
		const rewrittenEvents = events.map((event) => transcriptEventId(event) === target.messageId ? Object.assign({}, event, { message: buildAssistantDisplayRewrite({
			message: target.message,
			displayContent: params.content,
			mediaBySource: params.mediaBySource,
			managedMediaUrls: params.managedMediaUrls
		}) }) : event);
		await transcript.replaceEvents(rewrittenEvents);
		return { messageId: target.messageId };
	});
}
async function rewriteAssistantTranscriptMessageByTurnIndexAndMedia(params) {
	if (params.content.length === 0 || params.mediaUrls.length === 0 && params.rejectedMediaCount === 0) return null;
	return withPreparedTranscriptCorrection(params.scope, async (transcript) => {
		const initialGenerationMaterialized = params.expectedGeneration === null && params.afterSeq === 0;
		if (transcript.generation !== params.expectedGeneration && !initialGenerationMaterialized) return null;
		const events = await transcript.readEvents();
		const target = findAssistantTranscriptMessageByTurnIndexAndMediaInEvents(events, params);
		if (!target) return null;
		const rewrittenMessage = buildAssistantDisplayRewrite({
			message: target.message,
			displayContent: params.content,
			mediaBySource: params.mediaBySource,
			managedMediaUrls: params.mediaUrls,
			retainOriginalText: true
		});
		await transcript.replaceEvents(events.map((event) => transcriptEventId(event) === target.messageId ? Object.assign({}, event, { message: rewrittenMessage }) : event));
		return transcript.generation ? {
			generation: transcript.generation,
			messageId: target.messageId
		} : null;
	}, params.afterSeq);
}
/** Adds managed display media to the completion reply without rewriting model content. */
async function enrichAssistantTranscriptMediaForRun(params) {
	return await rewritePreparedAssistantTranscriptMessageForRun({
		scope: params.scope,
		readSource: params.readSource,
		runId: params.runId,
		expectedLifecycleRevision: params.expectedLifecycleRevision,
		rewriteMessage: (message) => ({
			...buildAssistantDisplayRewrite({
				message,
				displayContent: params.content,
				mediaBySource: params.mediaBySource,
				managedMediaUrls: params.mediaUrls,
				retainOriginalText: true
			}),
			content: message.content
		})
	});
}
async function publishAssistantTranscriptRewrite(params) {
	if (params.rewritten.length === 0) return;
	await touchAssistantTranscriptSessionEntry(params.scope, params.readSource);
	await publishTranscriptUpdate(params.scope, { messageId: params.rewritten.at(-1)?.messageId }, params.readSource);
}
//#endregion
export { publishAssistantTranscriptRewrite as a, rewriteSourceReplyTranscriptMirrors as c, persistAbortedPartials as i, enrichAssistantTranscriptMediaForRun as n, rewriteAssistantTranscriptMessageByIdempotencyKey as o, persistAbortedPartial as r, rewriteAssistantTranscriptMessageByTurnIndexAndMedia as s, assistantTranscriptScope as t };
