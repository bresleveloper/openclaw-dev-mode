import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { i as retainAssistantModelContent, r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { a as persistSessionTranscriptTurn } from "./session-accessor-Czw4l8kI.mjs";
import { _ as readTranscriptEventId, v as readTranscriptEventMessage } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { l as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import { i as captureOwnedTranscriptWriteAssertion, u as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-C02sC3zd.mjs";
import { t as findTranscriptEvent } from "./session-transcript-match-CM2tniQA.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-CP5xMNf9.mjs";
import { r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-B-x-73co.mjs";
import { n as readClawHubRecommendations } from "./clawhub-recommendations-Da9BiasP.mjs";
import { a as createManagedOutgoingMediaBlocks, c as prepareOutgoingMediaFromReplyPayload, n as attachManagedOutgoingMediaToMessage, u as removeManagedOutgoingMediaBlocks } from "./managed-image-attachments-BH_BBH6I.mjs";
//#region src/gateway/internal-source-reply-persistence.ts
const internalSourceReplyPersistenceLeases = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.internalSourceReplyPersistenceLeases"));
async function completePersistedInternalSourceReply(params) {
	if (!params.expectedSessionId || !params.idempotencyKey) return false;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	const scope = {
		agentId: params.agentId,
		sessionId: params.expectedSessionId,
		sessionKey: params.sessionKey,
		storePath
	};
	scope.sessionKey = resolveSessionEntry(scope).normalizedKey;
	const assertCurrent = captureOwnedTranscriptWriteAssertion(scope);
	const expected = {
		expectedSessionId: params.expectedSessionId,
		...getOwnedSessionTranscriptWriterFence({ sessionKey: scope.sessionKey })
	};
	const found = await findTranscriptEvent(scope, {
		kind: "idempotency",
		key: params.idempotencyKey,
		deliveryMirror: true
	});
	if (!found) return false;
	const messageId = readTranscriptEventId(found.event);
	const message = readTranscriptEventMessage(found.event);
	if (!messageId || !message) throw new Error("Internal source reply transcript identity is unavailable");
	const options = {
		config: params.cfg,
		...expected,
		assertCurrent,
		messages: [{
			eventId: messageId,
			message,
			idempotencyLookup: "scan",
			predicate: {
				kind: "active-entry",
				entryId: messageId,
				errorMessage: "Internal source reply no longer owns the active transcript"
			}
		}],
		touchSessionEntry: false,
		updateMode: "file-only",
		publishWhen: "always",
		onMessageCommitted: (result, acceptCompletion) => {
			assertCurrent();
			attachSourceReplyMedia(result, acceptCompletion);
		}
	};
	const replay = await persistSessionTranscriptTurn(scope, options);
	if (replay.rejectedReason || replay.messages.length === 0) throw new Error("Internal source reply no longer owns the active transcript");
	return true;
}
function attachSourceReplyMedia(result, acceptCompletion) {
	const message = result.message;
	const blocks = readAssistantDisplayContent(message).filter((block) => block.type !== "text" && block.type !== "clawhub");
	if (blocks.length > 0) acceptCompletion(async () => {
		if (!await attachManagedOutgoingMediaToMessage({
			messageId: result.messageId,
			blocks
		})) throw new Error("Internal source reply media ownership could not be persisted");
	});
}
/** Persist the private WebChat source reply before its successful tool result becomes visible. */
async function persistInternalSourceReply(params) {
	const leaseKey = params.idempotencyKey ? JSON.stringify([
		params.agentId ?? "",
		params.sessionKey,
		params.expectedSessionId ?? "",
		params.idempotencyKey
	]) : void 0;
	const lease = leaseKey ? internalSourceReplyPersistenceLeases.reserve([leaseKey]) : void 0;
	await lease?.wait();
	try {
		if (await completePersistedInternalSourceReply(params)) return;
		const media = prepareOutgoingMediaFromReplyPayload(params.payload);
		const mediaBlocks = await createManagedOutgoingMediaBlocks({
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			items: media,
			localRoots: getAgentScopedMediaLocalRootsForSources({
				cfg: params.cfg,
				agentId: params.agentId,
				mediaSources: media.map((item) => item.url)
			})
		});
		let committed = false;
		try {
			const content = [
				...readClawHubRecommendations(params.payload.channelData),
				...params.payload.text ? [{
					type: "text",
					text: params.payload.text
				}] : [],
				...mediaBlocks
			];
			const writerFence = getOwnedSessionTranscriptWriterFence({ sessionKey: params.sessionKey });
			const options = {
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
				...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
				...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
				content: retainAssistantModelContent(content),
				displayContent: content,
				mediaUrls: media.map((item) => item.url),
				idempotencyKey: params.idempotencyKey,
				runId: params.runId,
				...params.sourceReplyFinal !== void 0 ? { deliveryMirror: {
					kind: "message-tool-source-reply",
					final: params.sourceReplyFinal,
					...params.toolCallId ? { toolCallId: params.toolCallId } : {},
					...params.sourceTurnId ? { sourceTurnId: params.sourceTurnId } : {}
				} } : {},
				config: params.cfg,
				onMessageCommitted: (result, acceptCompletion) => {
					committed = result.appended;
					attachSourceReplyMedia(result, acceptCompletion);
				}
			};
			const appended = await appendAssistantMessageToSessionTranscript({
				...options,
				assertCurrent: captureOwnedTranscriptWriteAssertion({
					agentId: params.agentId,
					sessionKey: params.sessionKey,
					sessionId: params.expectedSessionId,
					storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId })
				})
			});
			if (!appended.ok) throw new Error(`Internal source reply persistence failed: ${appended.reason}`);
		} finally {
			if (!committed) await removeManagedOutgoingMediaBlocks({
				blocks: mediaBlocks,
				messageId: null
			});
		}
	} finally {
		lease?.release();
	}
}
//#endregion
export { persistInternalSourceReply };
