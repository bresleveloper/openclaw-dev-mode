import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { d as readSqliteNativeMutationRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { c as readSessionActorTranscriptAnchorsFromReplica, l as readSessionActorTranscriptReplica, m as readSessionActorTranscriptAnchors } from "./session-actor-replica-D_j2y4I5.mjs";
import { n as runLockedSessionTranscriptRead } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { d as readOwnedSessionTranscriptEntry, f as readOwnedSessionTranscriptState, l as getOwnedSessionTranscriptReader } from "./transcript-write-context-C02sC3zd.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-anchor-read.ts
/** Capture the physical source before discovery or history admission can yield. */
async function readSessionTranscriptAnchorsAsync(scope, selection, signal, onRead) {
	const consume = (facts) => {
		const consumed = onRead?.(facts);
		if (isPromiseLike(consumed)) {
			Promise.resolve(consumed).catch(() => {});
			throw new Error("Transcript anchor consumers must remain synchronous");
		}
	};
	const memory = captureSessionActorTranscriptRead(scope, signal);
	if (memory) {
		const facts = memory.missing ? {
			anchors: [],
			...selection.includeMetadata ? { metadata: {
				present: false,
				observedAt: null,
				updatedAt: null
			} } : {},
			...selection.replayValidation?.allowInitial ? { replayValidated: "initial" } : {}
		} : await memory.read("session.history.anchors", selection);
		memory.assertCurrent();
		consume(facts);
		return facts;
	}
	signal?.throwIfAborted();
	const hot = readOwnedSessionTranscriptState(scope);
	if (scope.storePath) {
		const target = {
			agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
			path: scope.storePath,
			sessionId: scope.sessionId
		};
		const facts = (hot && readSessionActorTranscriptAnchors(hot, target, selection, readSessionActorTranscriptReplica(hot)?.tail)) ?? readSessionActorTranscriptAnchorsFromReplica({
			...target,
			sessionKey: scope.sessionKey
		}, selection);
		if (facts) {
			consume(structuredClone(facts));
			return structuredClone(facts);
		}
	}
	const selected = selection.afterSeq === void 0 && selection.includeMessagesForRunId === void 0 && getOwnedSessionTranscriptReader(scope);
	if (selected) return selected.withRead({
		sessionKeys: [selected.sessionKey],
		snapshotFields: [],
		transcript: {
			...selection,
			sessionKey: selected.sessionKey
		}
	}, () => signal?.throwIfAborted(), (read, assertCurrent) => {
		assertCurrent();
		if ((read.entries.find((row) => row.sessionKey === selected.sessionKey)?.entry)?.sessionId !== scope.sessionId || !read.transcript) throw new Error("Transcript anchors changed their admitted session");
		consume(read.transcript);
		return read.transcript;
	});
	const captured = {
		agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const request = {
		entryIds: [...selection.entryIds],
		activePathEntryId: selection.activePathEntryId,
		afterSeq: selection.afterSeq,
		includeMessagesForRunId: selection.includeMessagesForRunId,
		includeSession: selection.includeSession,
		includeHeader: selection.includeHeader,
		includeWatermark: selection.includeWatermark,
		includeMessagePresence: selection.includeMessagePresence,
		includeMetadata: selection.includeMetadata,
		contextValidation: selection.contextValidation && structuredClone(selection.contextValidation),
		contextAuthority: selection.contextAuthority && structuredClone(selection.contextAuthority),
		replayValidation: selection.replayValidation && { ...selection.replayValidation }
	};
	const empty = {
		anchors: [],
		...request.includeMetadata ? { metadata: {
			present: false,
			observedAt: null,
			updatedAt: null
		} } : {},
		...request.replayValidation?.allowInitial ? { replayValidated: "initial" } : {}
	};
	signal?.throwIfAborted();
	return withSessionTranscriptReadSource(captured, async (source) => {
		if (!source.expectedIdentity) {
			consume(empty);
			return empty;
		}
		return readSessionTranscriptAnchorsFromSource({
			...source,
			preparedReads: request.afterSeq === void 0 ? source.preparedReads : void 0,
			scope: {
				...source.scope,
				sessionKey: captured.sessionKey
			}
		}, request, signal, onRead ? consume : void 0);
	}, signal, onRead ? targetDiscoveryLane : void 0);
}
/** Reuse a retained physical reader; final consumption keeps its writer FIFO and native witness. */
async function readSessionTranscriptAnchorsFromSource(source, selection, signal, onRead) {
	const { resolved, owner, expectedIdentity } = source;
	const reader = source.preparedReads ?? owner;
	const assertCurrent = () => {
		signal?.throwIfAborted();
		source.assertCurrent();
		owner.assertCurrent();
	};
	assertCurrent();
	if (!expectedIdentity) {
		const facts = { anchors: [] };
		onRead?.(facts);
		return facts;
	}
	const options = toDatabaseOptions(resolved);
	const read = async () => {
		const native = onRead ? getOpenClawAgentDatabaseIfOpen(options) : void 0;
		if (native?.db.isTransaction) return { anchors: [] };
		const revision = native && readSqliteNativeMutationRevision(native.db);
		const facts = await reader.readAnchors({
			resolved: {
				...resolved,
				sessionKey: resolved.sessionKey ?? source.scope.sessionKey
			},
			selection,
			expectedIdentity,
			preparedEntry: onRead ? readOwnedSessionTranscriptEntry(source.scope) : void 0
		}, signal);
		assertCurrent();
		if (onRead && getOpenClawAgentDatabaseIfOpen(options) === native && (!native || !native.db.isTransaction && revision !== void 0 && readSqliteNativeMutationRevision(native.db) === revision)) onRead(facts);
		return facts;
	};
	try {
		if (onRead) {
			const locked = runLockedSessionTranscriptRead(options, read, signal);
			if (locked) return await locked;
		}
		return onRead ? await runOpenClawAgentWriteAdmission(options, async (_identity, assertSource) => {
			assertCurrent();
			const facts = await read();
			assertSource();
			return facts;
		}, true, void 0, signal) : await read();
	} finally {
		assertCurrent();
	}
}
async function readActiveTranscriptEntryAnchorAsync(scope, signal) {
	return (await readSessionTranscriptAnchorsAsync(scope, { entryIds: [scope.entryId] }, signal)).anchors[0];
}
//#endregion
export { readSessionTranscriptAnchorsAsync as n, readSessionTranscriptAnchorsFromSource as r, readActiveTranscriptEntryAnchorAsync as t };
