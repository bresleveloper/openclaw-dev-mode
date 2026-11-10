import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { l as retainSessionTranscriptWorkerPublication, t as parseSessionTranscriptAuthorityReceipts } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { n as retainSessionEntryWorkerPublication, t as publishSessionEntryWorkerInvalidations } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { r as parseSessionEntryMetadataReceipts } from "./session-entry-metadata-receipt-Cz-lTw0a.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/sessions/session-manager-publication.ts
function unwrapSessionManagerPublication(request) {
	return isRecord(request.facts) && request.facts.kind === "session-manager-authority" ? {
		...request,
		facts: request.facts.domainFacts
	} : request;
}
/** Entry and transcript postimages share one native receipt and one observer boundary. */
function createSessionManagerPublicationHooks(params) {
	let pending;
	return {
		unwrap: unwrapSessionManagerPublication,
		onAdmitted: (request) => {
			if (request.stage !== "commit" || !isRecord(request.facts) || request.facts.kind !== "session-manager-authority") return;
			const transcriptPublication = parseSessionTranscriptAuthorityReceipts(request.facts.transcriptPublication);
			const entryPublication = parseSessionEntryMetadataReceipts(request.facts.entryPublication);
			const databaseIdentity = typeof params.databaseIdentity === "function" ? params.databaseIdentity() : params.databaseIdentity;
			if (!transcriptPublication || !entryPublication || !pending || !databaseIdentity || [...transcriptPublication, ...entryPublication].some((receipt) => receipt.source.identity !== databaseIdentity)) throw new Error("SessionManager commit omitted its authority receipt");
			pending.scope = {
				agentId: params.agentId,
				storePath: params.storePath,
				databaseIdentity
			};
			pending.expected = {
				kind: "session-manager-authority",
				transcriptPublication,
				entryPublication
			};
			pending.entry = retainSessionEntryWorkerPublication(pending.scope);
			pending.transcript = retainSessionTranscriptWorkerPublication(pending.scope);
			const unchanged = entryPublication.flatMap((receipt) => [...receipt.facts].flatMap(([key, fact]) => fact.kind === "postimage" && !fact.value.facts.lifecycleChanged ? [key] : []));
			if (entryPublication.length > 0) pending.entry.beginChanges(entryPublication.flatMap((receipt) => Array.from(receipt.facts.keys())), /* @__PURE__ */ new Map(), unchanged, void 0, new Map(entryPublication.flatMap((receipt) => [...receipt.facts].flatMap(([key, fact]) => fact.kind === "postimage" ? [[key, fact.value.entry]] : []))));
			pending.transcript.begin(transcriptPublication);
		},
		observeAdmission: (admission, retained) => {
			const owner = {};
			pending = owner;
			let committed = false;
			const unknown = () => {
				owner.entry?.settle(void 0, true, owner.transcript?.settle(false, true));
			};
			observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
				if (!isRecord(facts) || facts.kind !== "session-manager-authority") return;
				if (!owner.expected || !owner.entry || !owner.transcript || !owner.scope || !isDeepStrictEqual(owner.expected, facts)) {
					unknown();
					throw new Error("SessionManager receipt differs from its admitted postimage");
				}
				const scope = owner.scope;
				const expected = owner.expected;
				const entryPublication = expected.entryPublication;
				committed = true;
				try {
					owner.entry.settleMetadata(owner.expected.entryPublication, owner.transcript.settle(true, false, owner.expected.transcriptPublication), (previous, current) => {
						try {
							params.beforeIdentityPublication?.(expected);
							const initialWriter = params.initialWriter;
							if (initialWriter && !initialWriter.committedFence) {
								for (const receipt of entryPublication) for (const fact of receipt.facts.values()) if (fact.kind === "postimage" && fact.value.previous === void 0 && fact.value.entry.activeWriterRunId === initialWriter.writerRunId) initialWriter.recordCommitted({
									expectedWriterRunId: initialWriter.writerRunId,
									expectedLifecycleRevision: fact.value.entry.lifecycleRevision
								});
							}
						} finally {
							publishCommittedSessionIdentity(params.agentId, scope.databaseIdentity, previous, current);
						}
					});
				} catch (error) {
					publishSessionEntryWorkerInvalidations(owner.scope, owner.expected.entryPublication.flatMap((receipt) => Array.from(receipt.facts.keys())));
					const transcript = retainSessionTranscriptWorkerPublication(owner.scope);
					transcript.begin(owner.expected.transcriptPublication);
					sessionChanges.emitBatch(transcript.settle(false, true));
					throw error;
				}
			});
			retained.settled.then((outcome) => {
				const nativeCommit = admission.committed;
				if (!committed) {
					const rolledBack = outcome.kind === "not-entered" || admission.settlement?.kind === "completed" && nativeCommit === void 0 && admission.failureSource !== "protocol";
					owner.entry?.settle(void 0, !rolledBack, owner.transcript?.settle(false, !rolledBack));
				}
				if (pending === owner) pending = void 0;
			});
		}
	};
}
//#endregion
export { unwrapSessionManagerPublication as n, createSessionManagerPublicationHooks as t };
