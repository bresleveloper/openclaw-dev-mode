import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as hasSqlitePostCommitScope, s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows, o as sessionRowChangeSource } from "./session-row-changes-vFaNnKNM.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { n as hasSqliteCommitReceiptCoverage, t as createSqliteCommitReceipt } from "./sqlite-commit-receipt-DafgyYOc.mjs";
import { s as readSessionTranscriptRunId, t as advanceSessionTranscriptUpdateVersion } from "./transcript-events-D3brcRJS.mjs";
import { a as preparedSharingChanges, u as readPreparedSessionEntryPublicationSource } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-DDhSj356.mjs";
import { n as prepareSessionActorTranscriptAuthority } from "./session-actor-transaction-BIR0_goz.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/transcript-terminal-model.ts
/** Retain transcript facts independently of the current row's selected model and run. */
function readSessionTranscriptTerminalModel(event) {
	const message = asOptionalRecord(asOptionalRecord(event)?.message);
	const runId = readSessionTranscriptRunId(message);
	return message && runId && (message.stopReason === "stop" || message.stopReason === "length") && message.display !== false && projectSessionDisplayMessage(message, { view: "model-context" })?.role === "assistant" && typeof message.provider === "string" && typeof message.model === "string" ? {
		runId,
		modelProvider: message.provider,
		model: message.model
	} : null;
}
function isSessionTranscriptTerminalModel(value) {
	const model = asOptionalRecord(value);
	return Boolean(model && typeof model.runId === "string" && typeof model.modelProvider === "string" && typeof model.model === "string");
}
//#endregion
//#region src/config/sessions/session-transcript-authority.ts
const staged = resolveGlobalSingleton(Symbol.for("openclaw.transcriptAuthorityStaged"), () => /* @__PURE__ */ new WeakMap());
const prepared = resolveGlobalSingleton(Symbol.for("openclaw.transcriptAuthorityChanges"), () => /* @__PURE__ */ new WeakMap());
function readPreparedSessionTranscriptChange(change) {
	return prepared.get(sessionRowChangeSource(change));
}
function receiptChanges(receipt, agentId, storePath) {
	return [...receipt.facts].map(([sessionKey, fact]) => {
		const change = sessionChanges.markFactsOnly({
			agentId,
			storePath,
			sessionKey,
			scope: "transcript",
			facts: { kind: "unchanged" }
		}, fact.kind === "unchanged" ? void 0 : advanceSessionTranscriptUpdateVersion);
		prepared.set(change, fact);
		preparedSharingChanges.changes.set(change, {
			kind: "source",
			databaseIdentity: receipt.source.identity,
			canonicalPath: receipt.source.canonicalPath
		});
		return change;
	});
}
function publishTranscriptFact(database, sessionKey, fact) {
	if (database.db.isTransaction && !hasSqlitePostCommitScope(database.db)) return;
	const source = findOpenClawAgentDatabaseIdentity(database);
	if (!source) return;
	const receipt = createSqliteCommitReceipt({
		source,
		domain: "session-transcript-context",
		keys: [sessionKey],
		readFact: () => fact
	});
	const records = staged.get(database.db) ?? /* @__PURE__ */ new Map();
	const previous = records.get(sessionKey);
	if (fact.kind === "unchanged" && previous) return;
	const remove = () => {
		if (records.get(sessionKey) === receipt) records.delete(sessionKey);
		if (records.size === 0) staged.delete(database.db);
	};
	stageSqliteTransactionState(database.db, {
		stage() {
			staged.set(database.db, records);
			records.set(sessionKey, receipt);
		},
		commit: remove,
		rollback() {
			if (previous) records.set(sessionKey, previous);
			else remove();
		}
	});
	sessionChanges.emitBatch(receiptChanges(receipt, database.agentId, database.path), database.db);
}
/** Capture in the existing mutation statement, before COMMIT or savepoint release. */
function publishSessionTranscriptAuthority(database, context) {
	publishTranscriptFact(database, context.sessionKey, {
		kind: "postimage",
		value: Object.freeze(prepareSessionActorTranscriptAuthority(database, context))
	});
}
/** Cold materialization and derived-index repair preserve the transcript's content authority. */
function publishUnchangedSessionTranscriptAuthority(database, sessionKey) {
	publishTranscriptFact(database, sessionKey, { kind: "unchanged" });
}
function readStagedSessionTranscriptAuthority(database) {
	const transferable = [...staged.get(database.db)?.values() ?? []].filter((receipt) => typeof receipt.source.identity === "string");
	return transferable.length ? transferable : void 0;
}
/** A following entry write consumes the transcript owner's staged watermark. */
function readStagedSessionTranscriptUpdatedAt(database, sessionId) {
	let updatedAt;
	for (const receipt of readStagedSessionTranscriptAuthority(database) ?? []) for (const fact of receipt.facts.values()) if (fact.kind === "postimage" && fact.value.sessionId === sessionId && fact.value.updatedAt !== null) updatedAt = Math.max(updatedAt ?? 0, fact.value.updatedAt);
	return updatedAt;
}
function parseSessionTranscriptAuthorityReceipts(value) {
	return Array.isArray(value) && value.every(isTranscriptReceipt) ? value : void 0;
}
/** Confirmed content-preserving operations cannot install or restore a context postimage. */
function publishUnchangedSessionTranscriptReceipts(receipts) {
	if (!receipts) return;
	if (!parseSessionTranscriptAuthorityReceipts(receipts) || receipts.some((receipt) => [...receipt.facts.values()].some((fact) => fact.kind !== "unchanged"))) throw new Error("Transcript materialization changed its content authority receipt");
	publishCommittedSessionTranscriptReceipts(receipts);
}
/** The native settlement owner publishes these while it still holds the writer FIFO. */
function publishCommittedSessionTranscriptReceipts(receipts) {
	sessionChanges.emitBatch((receipts ?? []).flatMap((receipt) => receiptChanges(receipt, void 0, receipt.source.canonicalPath ?? receipt.source.filename)));
}
function isTranscriptReceipt(value) {
	if (!isRecord(value) || !isRecord(value.source) || !(value.facts instanceof Map)) return false;
	const keys = [...value.facts.keys()];
	if (!keys.every((key) => typeof key === "string") || typeof value.source.identity !== "string" || typeof value.source.incarnation !== "string") return false;
	if (!hasSqliteCommitReceiptCoverage(value, {
		source: {
			identity: value.source.identity,
			incarnation: value.source.incarnation
		},
		domain: "session-transcript-context",
		keys
	})) return false;
	const nullableNumber = (number) => number === null || typeof number === "number" && Number.isSafeInteger(number);
	for (const [key, fact] of value.facts) {
		if (!isRecord(fact)) return false;
		if (fact.kind !== "postimage") continue;
		const row = fact.value;
		if (!isRecord(row) || row.sessionKey !== key || typeof row.sessionId !== "string" || row.generation !== null && typeof row.generation !== "string" || row.leafEventId !== null && typeof row.leafEventId !== "string" || ![
			row.rawSeq,
			row.updatedAt,
			row.indexedSeq,
			row.activeMessageCount
		].every(nullableNumber) || row.needsRebuild !== null && row.needsRebuild !== 0 && row.needsRebuild !== 1 || row.lastMessagePreview !== void 0 && row.lastMessagePreview !== null && typeof row.lastMessagePreview !== "string" || row.terminalModel !== void 0 && row.terminalModel !== null && !isSessionTranscriptTerminalModel(row.terminalModel)) return false;
	}
	return true;
}
/** Only pending operations retain supersession state; committed facts use the session owner. */
function retainSessionTranscriptWorkerPublication(params) {
	let receipts = [];
	const superseded = /* @__PURE__ */ new Set();
	let stop;
	return {
		begin(value) {
			if (value && (!Array.isArray(value) || !value.every(isTranscriptReceipt))) throw new Error("Transcript worker omitted its authority postimage");
			receipts = value ?? [];
			superseded.clear();
			stop?.();
			stop = receipts.length ? sessionChanges.subscribeFacts((change) => {
				if (!sessionChangeScopeAffectsStoredRows(change)) return;
				const source = readPreparedSessionEntryPublicationSource(change);
				if (source.identity !== void 0 && source.identity !== params.databaseIdentity) return;
				if (source.identity === void 0) {
					const scope = "all" in change ? change.scope : change;
					if (typeof scope === "object" && (scope.storePath && scope.storePath !== params.storePath || scope.agentId && scope.agentId !== params.agentId)) return;
				}
				const transcript = readPreparedSessionTranscriptChange(change);
				if (!change.factsInvalidated && transcript?.kind === "unchanged") return;
				if (!transcript && "sessionKey" in change && change.facts?.kind !== "removed" && !((change.facts?.kind === "entry" || change.facts?.kind === "replacement") && change.facts.lifecycleChanged) && !change.factsInvalidated) return;
				for (const receipt of receipts) for (const key of receipt.facts.keys()) if ("all" in change || change.sessionKey === key) superseded.add(key);
			}) : void 0;
		},
		settle(committed, outcomeUnknown, confirmation = receipts) {
			const unknown = outcomeUnknown || committed && !isDeepStrictEqual(receipts, confirmation);
			stop?.();
			stop = void 0;
			const changes = [];
			for (const receipt of receipts) {
				const valid = receipt.source.identity === params.databaseIdentity;
				for (const [key, fact] of receipt.facts) {
					if (superseded.has(key)) continue;
					const installed = committed && !unknown && valid ? fact : unknown || !valid ? { kind: "unknown" } : void 0;
					if (installed) changes.push(...receiptChanges({
						...receipt,
						facts: /* @__PURE__ */ new Map([[key, installed]])
					}, params.agentId, params.storePath));
				}
			}
			receipts = [];
			return changes;
		}
	};
}
//#endregion
export { publishUnchangedSessionTranscriptReceipts as a, readStagedSessionTranscriptUpdatedAt as c, readSessionTranscriptTerminalModel as d, publishUnchangedSessionTranscriptAuthority as i, retainSessionTranscriptWorkerPublication as l, publishCommittedSessionTranscriptReceipts as n, readPreparedSessionTranscriptChange as o, publishSessionTranscriptAuthority as r, readStagedSessionTranscriptAuthority as s, parseSessionTranscriptAuthorityReceipts as t, isSessionTranscriptTerminalModel as u };
