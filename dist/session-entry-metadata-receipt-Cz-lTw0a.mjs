import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as hasSqliteCommitReceiptCoverage, t as createSqliteCommitReceipt } from "./sqlite-commit-receipt-DafgyYOc.mjs";
import { a as preparedSharingChanges } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as sealSessionEntryPublicationSource, n as discardSessionEntryPublicationSource, r as hasSessionEntryPublicationCapacity } from "./session-entry-publication-source-BkCFKM-k.mjs";
//#region src/config/sessions/session-entry-metadata-receipt.ts
/** Reuse the native entry owner's already selected postimage and exact delta semantics. */
function captureSessionEntryMetadataReceipts(changes) {
	const latest = /* @__PURE__ */ new Map();
	for (const change of changes) {
		if (!("sessionKey" in change) || change.facts?.kind !== "entry") continue;
		const publication = preparedSharingChanges.changes.get(change);
		const entry = publication?.kind === "metadata" ? publication.prepared.entries.get(change.sessionKey) : void 0;
		if (!entry || publication?.kind !== "metadata" || typeof publication.prepared.source.identity !== "string") continue;
		const previous = latest.get(change.sessionKey);
		latest.set(change.sessionKey, {
			source: publication.prepared.source,
			value: {
				entry,
				fullEntry: publication.prepared.fullEntries?.get(change.sessionKey),
				previous: previous ? previous.value.previous : publication.previous,
				sharingChange: previous?.value.sharingChange === "changed" ? "changed" : publication.sharingChange,
				facts: {
					...change.facts,
					lifecycleChanged: previous?.value.facts.lifecycleChanged || change.facts.lifecycleChanged,
					previousSessionId: previous ? previous.value.facts.previousSessionId : change.facts.previousSessionId,
					clearMembers: previous?.value.facts.clearMembers || change.facts.clearMembers
				}
			}
		});
	}
	const receipts = [...latest].map(([key, { source, value }]) => {
		sealSessionEntryPublicationSource(source);
		return createSqliteCommitReceipt({
			source,
			domain: "session-entry-metadata",
			keys: [key],
			readFact: () => ({
				kind: "postimage",
				value
			})
		});
	});
	boundSessionEntryMetadataReceipts(receipts);
	return receipts;
}
/** Metadata shares an envelope with transcript authority; only full-entry enrichment may be shed. */
function boundSessionEntryMetadataReceipts(receipts, envelope = receipts) {
	if (!receipts.some((receipt) => [...receipt.facts.values()].some((fact) => fact.kind === "postimage" && fact.value.fullEntry !== void 0)) || hasSessionEntryPublicationCapacity(envelope)) return;
	for (const receipt of receipts) {
		discardSessionEntryPublicationSource(receipt.source);
		for (const fact of receipt.facts.values()) if (fact.kind === "postimage") delete fact.value.fullEntry;
	}
}
function parseSessionEntryMetadataReceipts(value) {
	if (!Array.isArray(value)) return;
	for (const receipt of value) {
		if (!isRecord(receipt) || !isRecord(receipt.source) || typeof receipt.source.identity !== "string" || typeof receipt.source.incarnation !== "string" || !(receipt.facts instanceof Map)) return;
		const keys = [...receipt.facts.keys()];
		if (!keys.every((key) => typeof key === "string") || !hasSqliteCommitReceiptCoverage(receipt, {
			source: {
				identity: receipt.source.identity,
				incarnation: receipt.source.incarnation
			},
			domain: "session-entry-metadata",
			keys
		})) return;
		for (const [, fact] of receipt.facts) {
			if (!isRecord(fact) || fact.kind !== "postimage" || !isRecord(fact.value)) return;
			const row = fact.value;
			if (row.previous !== void 0 && (!isRecord(row.previous) || typeof row.previous.sessionId !== "string" || row.previous.lifecycleRevision !== void 0 && typeof row.previous.lifecycleRevision !== "string") || !isRecord(row.entry) || typeof row.entry.sessionId !== "string" || typeof row.entry.updatedAt !== "number" || row.fullEntry !== void 0 && (!isRecord(row.fullEntry) || row.fullEntry.sessionId !== row.entry.sessionId || row.fullEntry.updatedAt !== row.entry.updatedAt) || !isRecord(row.facts) || row.facts.kind !== "entry" || row.facts.sessionId !== row.entry.sessionId || row.facts.previousSessionId !== void 0 && typeof row.facts.previousSessionId !== "string" || typeof row.facts.clearMembers !== "boolean" || row.facts.lifecycleChanged !== void 0 && typeof row.facts.lifecycleChanged !== "boolean" || row.sharingChange !== "changed" && row.sharingChange !== "unchanged") return;
		}
	}
	return value;
}
//#endregion
export { captureSessionEntryMetadataReceipts as n, parseSessionEntryMetadataReceipts as r, boundSessionEntryMetadataReceipts as t };
