import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { i as onInternalSessionTranscriptUpdate, s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { s as readAssistantTextBlocksForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { l as rewritePreparedTranscriptMessageAtAnchor } from "./session-accessor-Czw4l8kI.mjs";
import { i as captureOwnedTranscriptWriteAssertion, p as runWithOwnedSessionTranscriptWrite } from "./transcript-write-context-C02sC3zd.mjs";
import { t as readActiveTranscriptEntryAnchorAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { n as recordAssistantManagedMediaUrls } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as splitMediaFromOutput } from "./parse-BFtzJA_B.mjs";
import { i as withChannelReadAuthority } from "./channel-read-authority-DeXfvJjt.mjs";
import { a as createManagedOutgoingMediaBlocks, c as prepareOutgoingMediaFromReplyPayload, n as attachManagedOutgoingMediaToMessage, r as buildManagedMediaFailureBlock, u as removeManagedOutgoingMediaBlocks } from "./managed-image-attachments-BH_BBH6I.mjs";
import { i as normalizeWebchatReplyMediaPathsForDisplay, n as captureWebchatReplyMediaScope, r as getWebchatReplyMediaLocalRoots } from "./chat-reply-media-D4qIbDgF.mjs";
import { a as publishAssistantTranscriptRewrite } from "./chat-transcript-persistence-ClpuE6I1.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/chat-send-commentary-media.ts
/** Own authored progress attachments while the caller retains its admitted run. */
function createAssistantCommentaryMediaCustody(params) {
	let preparingTranscript = false;
	let lastRewrite;
	const prepareAssistantTranscriptMessage = (message, sourceText) => {
		if (!preparingTranscript || !params.isCurrent() || params.abortSignal?.aborted || !sourceText) return message;
		const prepared = recordAssistantManagedMediaUrls(message, splitMediaFromOutput(sourceText).mediaUrls);
		return params.prepareAssistantTranscriptMessage?.(prepared, sourceText) ?? prepared;
	};
	return {
		prepareAssistantTranscriptMessage,
		get lastRewrite() {
			return lastRewrite;
		},
		async run(operation) {
			lastRewrite = void 0;
			preparingTranscript = true;
			const observer = observeChatSendCommentaryMedia(params);
			try {
				return await operation();
			} finally {
				preparingTranscript = false;
				lastRewrite = await observer.close();
			}
		}
	};
}
/** Materialize committed progress attachments within the same admitted Gateway run. */
function observeChatSendCommentaryMedia(params) {
	const { session } = params;
	const seen = /* @__PURE__ */ new Set();
	let pending = Promise.resolve();
	let uncertainRewrite = false;
	let lastRewrite;
	const reportPreparationFailure = (error) => {
		if (!(error instanceof SessionTranscriptWriterClaimReboundError)) params.logGateway.warn(`webchat commentary media preparation failed: ${formatForLog(error)}`);
	};
	const unsubscribe = onInternalSessionTranscriptUpdate((update) => {
		const message = asOptionalRecord(update.message);
		const target = update.target;
		const messageId = update.messageId;
		if (!target || target.sessionKey !== session.sessionKey || target.agentId !== session.agentId || !messageId || message?.role !== "assistant" || readSessionTranscriptRunId(message) !== params.getRunId() || !params.isCurrent() || uncertainRewrite || !Array.isArray(message.content) || Array.isArray(message["openclawDisplayContent"])) return;
		const delivery = asOptionalRecord(message.openclawDelivery);
		const authoredMedia = new Set(Array.isArray(delivery?.mediaUrls) ? delivery.mediaUrls.filter((url) => typeof url === "string") : []);
		const commentaryBlocks = new Set(readAssistantTextBlocksForPhase(message, "commentary"));
		const commentaryIndexes = /* @__PURE__ */ new Set();
		const mediaUrls = Array.from(new Set(message.content.flatMap((value, index) => {
			const block = asOptionalRecord(value);
			if (commentaryBlocks.has(value)) commentaryIndexes.add(index);
			return block && commentaryIndexes.has(index) && typeof block.text === "string" ? (splitMediaFromOutput(block.text).mediaUrls ?? []).filter((url) => authoredMedia.has(url)) : [];
		})));
		const key = `${target.sessionId}:${messageId}`;
		if (mediaUrls.length === 0 || seen.has(key)) return;
		seen.add(key);
		const runId = params.getRunId();
		const scope = {
			...target,
			storePath: session.storePath ?? resolveSessionStorePathCore(session.cfg.session?.store, { agentId: session.agentId })
		};
		const assertOwned = captureOwnedTranscriptWriteAssertion(scope);
		const assertLive = () => {
			assertOwned();
			if (uncertainRewrite || !params.isCurrent() || params.abortSignal?.aborted || params.getRunId() !== runId) throw new SessionTranscriptWriterClaimReboundError();
		};
		const originalContent = structuredClone(message.content);
		const previous = pending;
		pending = runWithOwnedSessionTranscriptWrite({ sessionTarget: scope }, () => previous.then(async () => {
			const mediaScope = await captureWebchatReplyMediaScope({
				requesterContext: params.requesterContext,
				cfg: session.cfg,
				sessionKey: scope.sessionKey,
				agentId: scope.agentId,
				sessionLoadOptions: session.sessionLoadOptions,
				accountId: params.accountId,
				assertCurrent: assertLive
			});
			try {
				if (mediaScope.sessionEntry?.sessionId !== scope.sessionId) throw new SessionTranscriptWriterClaimReboundError();
				const lifecycleRevision = mediaScope.sessionEntry.lifecycleRevision;
				const assertCurrent = mediaScope.assertCurrent;
				assertCurrent();
				let anchor = await readActiveTranscriptEntryAnchorAsync({
					...scope,
					entryId: messageId
				});
				assertCurrent();
				if (!anchor) {
					const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
					await waitForSessionTranscriptProjection(scope, params.abortSignal);
					assertCurrent();
					anchor = await readActiveTranscriptEntryAnchorAsync({
						...scope,
						entryId: messageId
					});
					assertCurrent();
				}
				if (!anchor) return;
				const managedMedia = /* @__PURE__ */ new Map();
				let committed = false;
				try {
					await withChannelReadAuthority(mediaScope.assertCurrent, async () => {
						const payloads = await normalizeWebchatReplyMediaPathsForDisplay({
							...mediaScope,
							payloads: mediaUrls.map((url) => ({ mediaUrls: [url] }))
						});
						const localRoots = getWebchatReplyMediaLocalRoots(mediaScope);
						assertCurrent();
						for (const [index, payload] of payloads.entries()) {
							const blocks = await createManagedOutgoingMediaBlocks({
								sessionKey: scope.sessionKey,
								agentId: scope.agentId,
								items: prepareOutgoingMediaFromReplyPayload(payload),
								localRoots,
								continueOnPrepareError: true,
								assertCurrent: mediaScope.assertCurrent,
								abortSignal: params.abortSignal
							});
							blocks.push(...(getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? []).map(buildManagedMediaFailureBlock));
							managedMedia.set(mediaUrls[index], blocks);
							assertCurrent();
						}
					});
					const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
					await waitForSessionTranscriptProjection(scope, params.abortSignal);
					assertCurrent();
					const rewritten = await rewritePreparedTranscriptMessageAtAnchor(anchor, (value) => {
						assertLive();
						const currentMessage = asOptionalRecord(value);
						if (!currentMessage || readSessionTranscriptRunId(currentMessage) !== runId || !isDeepStrictEqual(currentMessage.content, originalContent)) return;
						const displayContent = [];
						for (const [index, raw] of originalContent.entries()) {
							const block = asOptionalRecord(raw);
							if (!block || !commentaryIndexes.has(index) || typeof block.text !== "string") {
								displayContent.push(raw);
								continue;
							}
							const segments = splitMediaFromOutput(block.text).segments ?? [{
								type: "text",
								text: block.text
							}];
							displayContent.push({
								...block,
								text: ""
							});
							for (const segment of segments) if (segment.type === "text") displayContent.push({
								...block,
								text: segment.text
							});
							else displayContent.push(...managedMedia.get(segment.url) ?? [{
								...block,
								text: `MEDIA:${segment.url}`
							}]);
						}
						return {
							...currentMessage,
							[ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent
						};
					}, {
						active: "sequence",
						expectedEntry: { lifecycleRevision: lifecycleRevision ?? null },
						assertCurrent: assertLive,
						assertNativeCurrent: assertCurrent
					});
					if (rewritten) {
						committed = true;
						lastRewrite = {
							sessionId: scope.sessionId,
							generation: rewritten.generation
						};
						const mediaBlocks = [...managedMedia.values()].flat().filter((block) => block.type === "image" || block.type === "audio" || block.type === "video" || block.type === "attachment");
						if (mediaBlocks.length > 0 && !await attachManagedOutgoingMediaToMessage({
							messageId,
							blocks: mediaBlocks
						})) throw new Error("Webchat commentary media ownership could not be persisted");
						await publishAssistantTranscriptRewrite({
							scope,
							rewritten: [{ messageId }]
						});
					}
				} catch (error) {
					if (hasSqliteWorkerOutcomeUnknown(error)) {
						uncertainRewrite = true;
						committed = true;
						try {
							if (!await attachManagedOutgoingMediaToMessage({
								messageId,
								blocks: [...managedMedia.values()].flat()
							})) throw new Error("Uncertain commentary media ownership could not be retained", { cause: error });
						} catch (retentionError) {
							throw createSqliteLifecycleAggregateError([error, retentionError], "Transcript rewrite and media retention failed", error);
						}
					}
					throw error;
				} finally {
					if (!committed) await removeManagedOutgoingMediaBlocks({
						blocks: [...managedMedia.values()].flat(),
						messageId: null
					});
				}
			} finally {
				mediaScope.release();
			}
		}).catch(reportPreparationFailure)).catch(reportPreparationFailure);
	});
	return { async close() {
		unsubscribe();
		await pending;
		return lastRewrite;
	} };
}
//#endregion
export { createAssistantCommentaryMediaCustody as t };
