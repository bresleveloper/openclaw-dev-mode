import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import "./io-DIF-KW3P.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { u as withGatewaySessionEntry } from "./session-utils-store-lW7Wu3P0.mjs";
import { x as prepareSessionPlacementRead } from "./placement-row-codec-DhdW6tSs.mjs";
import { a as selectSourceDeliverablePayloads } from "./delivery-result-2UZHQJ-q.mjs";
import { n as attachManagedOutgoingMediaToMessage, u as removeManagedOutgoingMediaBlocks } from "./managed-image-attachments-BH_BBH6I.mjs";
import { i as hasAssistantDisplayMediaContent } from "./chat-assistant-content-D60Lu4da.mjs";
import { a as prepareWebchatReplyMediaForDisplay, t as captureWebchatReplyMediaAuthority } from "./chat-reply-media-D4qIbDgF.mjs";
import { a as publishAssistantTranscriptRewrite, n as enrichAssistantTranscriptMediaForRun } from "./chat-transcript-persistence-ClpuE6I1.mjs";
//#region src/gateway/agent-turn/agent-run-final-media.ts
/** Materialize one visible agent final before its Gateway run releases custody. */
async function finalizeAgentRunMedia(params, reply, candidates) {
	const { options, session } = params;
	const visible = new Set(selectSourceDeliverablePayloads(candidates.map((entry) => entry.payload), options));
	const plan = candidates.filter((entry) => visible.has(entry.payload));
	if (!plan.some(({ parts }) => parts.mediaUrls.length > 0)) return;
	const runId = params.getRunId();
	const assertCurrent = () => {
		params.abortSignal?.throwIfAborted();
		if (!params.isCurrent() || params.getRunId() !== runId) throw new SessionTranscriptWriterClaimReboundError();
	};
	assertCurrent();
	let active = true;
	let predicate;
	let releaseSource;
	let releasePlacement;
	let work;
	const release = () => {
		active = false;
		predicate?.release();
		releaseSource?.();
		releasePlacement?.();
	};
	try {
		const state = captureOpenClawStateWorkerContext();
		const placement = await prepareSessionPlacementRead(state.admission.databasePath, reply.sessionId, async () => {
			return (await executeOpenClawStateWorker(state, {
				type: "workerPlacements.read",
				input: { sessionIds: [reply.sessionId] }
			}))[0];
		});
		releasePlacement = placement.release;
		assertCurrent();
		const initialPlacement = placement.current();
		const prepared = await withGatewaySessionEntry(session.sessionKey, { agentId: session.agentId }, (selected) => {
			assertCurrent();
			const source = selected.capturedReadSource;
			if (selected.storePath !== reply.storePath || selected.entry?.sessionId !== reply.sessionId || selected.entry.lifecycleRevision !== reply.lifecycleRevision || !source || typeof source.databaseIdentity !== "string") throw new SessionTranscriptWriterClaimReboundError();
			const databaseIdentity = `file:${source.databaseIdentity}`;
			const scope = {
				...session,
				sessionEntry: selected.entry,
				requesterContext: params.requesterContext,
				accountId: params.accountId
			};
			const authority = captureWebchatReplyMediaAuthority(scope, initialPlacement);
			predicate = retainPreparedSessionEntryPredicate({
				databaseIdentity,
				sessionKey: selected.legacyKey ?? selected.canonicalKey,
				entry: selected.entry,
				matches: (_before, after) => authority.matches(after, initialPlacement)
			});
			releaseSource = registerOpenClawAgentDatabaseAsyncResource({
				agentId: source.agentId,
				path: source.path,
				revoke: () => {
					active = false;
				},
				close: async () => {
					active = false;
					await Promise.allSettled(work ? [work] : []);
				}
			});
			return {
				...scope,
				readSource: source,
				workspace: authority.workspace,
				prepareRead: predicate.prepareRead,
				release,
				assertCurrent: () => {
					assertCurrent();
					assertExistingDatabaseIdentity(source.path, databaseIdentity, source.databaseBirthtime);
					if (!active || !predicate?.isCurrent() || !authority.matches(scope.sessionEntry, placement.current(), readRuntimeConfig())) throw new SessionTranscriptWriterClaimReboundError();
				}
			};
		}, session.cfg);
		work = (async () => {
			const scope = {
				sessionKey: session.sessionKey,
				agentId: session.agentId,
				sessionId: reply.sessionId,
				storePath: reply.storePath
			};
			const { persistedAssistantContent: content, mediaBySource } = await prepareWebchatReplyMediaForDisplay({
				scope: prepared,
				storePath: scope.storePath,
				inputs: plan.map((entry) => ({
					kind: "prepared",
					plan: entry
				})),
				abortSignal: params.abortSignal,
				includeSensitiveMedia: false,
				includeSensitiveDisplay: false
			});
			if (!content || !hasAssistantDisplayMediaContent(content)) throw new Error("WebChat final media could not be prepared");
			let retained = false;
			try {
				const rewritten = await withSessionTranscriptWriteAssertion(scope, prepared.assertCurrent, () => enrichAssistantTranscriptMediaForRun({
					scope,
					readSource: prepared.readSource,
					runId,
					expectedLifecycleRevision: reply.lifecycleRevision ?? null,
					content,
					mediaBySource,
					mediaUrls: plan.flatMap((entry) => entry.parts.mediaUrls)
				}));
				if (!rewritten) throw new Error("WebChat final media has no owning assistant transcript message");
				retained = true;
				if (content.some((block) => block.type === "image" || block.type === "audio" || block.type === "video" || block.type === "attachment") && !await attachManagedOutgoingMediaToMessage({
					messageId: rewritten.messageId,
					blocks: content
				})) throw new Error("WebChat final media ownership could not be persisted");
				await publishAssistantTranscriptRewrite({
					scope,
					readSource: prepared.readSource,
					rewritten: [rewritten]
				});
			} catch (error) {
				retained ||= hasSqliteWorkerOutcomeUnknown(error);
				throw error;
			} finally {
				if (!retained) await removeManagedOutgoingMediaBlocks({
					blocks: content,
					messageId: null
				});
			}
		})();
		await work;
	} finally {
		release();
	}
}
//#endregion
export { finalizeAgentRunMedia };
