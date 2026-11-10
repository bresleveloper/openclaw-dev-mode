import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawAgentSqlitePath, o as resolveExplicitIncognitoAgentSqliteTarget } from "../openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as SessionTranscriptReadFenceError } from "../session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { i as isIncognitoSessionKey } from "../incognito-session-key-BWpn88lo.mjs";
import "../session-key-CSDERtm3.mjs";
import { t as warnPluginSdkDeprecation } from "../sdk-deprecation-DjTmOhOX.mjs";
import { n as captureSessionTranscriptTargetBinding } from "../transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "../session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as getSessionActorStorageBinding } from "../session-actor-storage-binding-oCtbPk00.mjs";
import { a as resolveSqliteTranscriptReadScope } from "../session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "../session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as withSessionContextAdmission, i as runWithSessionTranscriptReadFence, n as resolveSessionTranscriptReadFence } from "../session-transcript-read-fence-CgUG4J4j.mjs";
import { r as IncognitoSessionSyncAccessError } from "../incognito-session-error-Dsi9IsoJ.mjs";
import { a as validateSessionTranscriptContextVersion, r as validateSessionTranscriptContextAdmission, t as readSessionTranscriptContextMessages } from "../session-accessor.sqlite-model-context-BymThP-K.mjs";
import { i as captureOwnedTranscriptWriteAssertion, y as withSessionTranscriptWriteAssertion } from "../transcript-write-context-C02sC3zd.mjs";
import { t as captureSessionActorTranscriptRead } from "../session-actor-transcript-read-Wje_m4fK.mjs";
import { t as readSessionTranscriptContextProjectionAsync } from "../session-transcript-context-read-B-x2YFto.mjs";
//#region src/config/sessions/session-transcript-context-reader.ts
/** The owner retains scanning, consumer work, validation, and cleanup together. */
function createSessionTranscriptContextReader(owner) {
	return (target, read) => owner.retain(async () => {
		owner.assertCurrent(target);
		const snapshot = await owner.read();
		owner.assertCurrent(target);
		const messages = (function* () {
			for (const message of snapshot.messages) {
				owner.assertCurrent(target);
				yield message;
			}
		})();
		try {
			const result = await read(messages, snapshot.header);
			await owner.validate(snapshot);
			owner.assertCurrent(target);
			return result;
		} finally {
			messages.return(void 0);
		}
	});
}
//#endregion
//#region src/plugin-sdk/codex-session-transcript-runtime.ts
/** Capture the current memory owner before yielding; durable contexts use their worker reader. */
function captureCodexSessionContextReader(source, signal) {
	const memory = captureSessionActorTranscriptRead(source, signal);
	if (!memory) return;
	const target = captureSessionTranscriptTargetBinding(source);
	const assertOwned = captureOwnedTranscriptWriteAssertion(target);
	const assertCurrent = () => {
		signal?.throwIfAborted();
		memory.assertCurrent();
		assertOwned();
	};
	return async (readTarget, read) => {
		if (readTarget.agentId !== target.agentId || readTarget.sessionKey !== target.sessionKey || readTarget.sessionId !== target.sessionId) throw new SessionTranscriptReadFenceError("Context reader belongs to another transcript target");
		const snapshot = await memory.read("session.history.context-messages", {});
		const messages = (function* () {
			for (const message of snapshot.messages) {
				assertCurrent();
				yield message;
			}
		})();
		try {
			assertCurrent();
			const result = await read(messages, snapshot.header);
			assertCurrent();
			return result;
		} finally {
			messages.return(void 0);
		}
	};
}
function assertCodexSessionSyncAccess(target, method) {
	if (getSessionActorStorageBinding(target) || isIncognitoSessionKey(target.sessionKey) || target.storePath && resolveExplicitIncognitoAgentSqliteTarget(target.storePath, target)) throw new IncognitoSessionSyncAccessError(method, "captureCodexSessionContextReader");
}
/** @deprecated Use createCodexSessionContextReader with the captured admission. Final compatibility day: 2026-12-31. */
function validateCodexSessionTranscriptReadAdmission(...args) {
	warnPluginSdkDeprecation({
		family: "codex-session-context",
		method: "validateCodexSessionTranscriptReadAdmission",
		replacement: "createCodexSessionContextReader with the captured admission"
	});
	assertCodexSessionSyncAccess(args[0], "validateCodexSessionTranscriptReadAdmission");
	validateSessionTranscriptContextAdmission(...args);
}
/** @deprecated Use createCodexSessionContextReader with a prepared current source. Final compatibility day: 2026-12-31. */
function validateCodexSessionTranscriptContextVersion(...args) {
	warnPluginSdkDeprecation({
		family: "codex-session-context",
		method: "validateCodexSessionTranscriptContextVersion",
		replacement: "createCodexSessionContextReader with a prepared current source"
	});
	assertCodexSessionSyncAccess(args[0], "validateCodexSessionTranscriptContextVersion");
	validateSessionTranscriptContextVersion(...args);
}
/** @deprecated Use createCodexSessionContextReader. Final compatibility day: 2026-12-31. */
function readCodexSessionContext(target, read, admission, physicalSource) {
	warnPluginSdkDeprecation({
		family: "codex-session-context",
		method: "readCodexSessionContext",
		replacement: "createCodexSessionContextReader"
	});
	assertCodexSessionSyncAccess(target, "readCodexSessionContext");
	if (physicalSource) {
		const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteTranscriptReadScope(target)));
		const identity = physicalSource.expectedIdentity;
		if (identity) assertExistingDatabaseIdentity(databasePath, identity.key, identity.birthtime);
		else if (readDatabasePathIdentitySync(databasePath).key.startsWith("file:")) throw new Error("Session context changed its captured database owner");
	}
	return withSessionContextAdmission(target, admission, () => readSessionTranscriptContextMessages(target, read));
}
/** Reads the bundled Codex mirror strictly before one admitted user row. */
async function readCodexSessionTranscriptEventsBeforeAdmission(params, admission) {
	const { readSessionTranscriptEvents, resolveSessionTranscriptIdentity } = await import("./session-transcript-runtime.js");
	const target = await resolveSessionTranscriptIdentity(params);
	if (target.agentId !== admission.agentId || target.sessionId !== admission.sessionId || target.sessionKey !== admission.sessionKey) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different transcript target");
	return await runWithSessionTranscriptReadFence(admission, async () => await readSessionTranscriptEvents(params));
}
/** @deprecated Use withCodexSessionTranscriptMirrorWrite. Final compatibility day: 2026-12-31. */
async function withCodexSessionTranscriptMirrorWriteLock(params, run) {
	return withMirrorWrite(params, run, "lock");
}
/**
* Runs ordered optimistic mirror writes and returns each committed message's sequence.
* `assertCurrent` guards every commit; it is prepared before the writer is reserved,
* because its session-row reads cannot run while this write holds the database.
*/
async function withCodexSessionTranscriptMirrorWrite(params, run) {
	const { assertCurrent, ...scope } = params;
	return assertCurrent ? withSessionTranscriptWriteAssertion(scope, assertCurrent, () => withMirrorWrite(scope, run, "sequence")) : withMirrorWrite(scope, run, "sequence");
}
async function withMirrorWrite(params, run, mode) {
	const { withProjectedSessionTranscriptWriteLock } = await import("../session-transcript-lock-runtime-Bi11B1HX.mjs");
	return await withProjectedSessionTranscriptWriteLock(params, run, (context, locked) => ({
		...context,
		appendMessageWithMessageSequence: (options) => locked.appendMessageWithMessageSequence({
			...options,
			...params.config !== void 0 ? { config: params.config } : {}
		}),
		readMessageFacts: async (factParams) => {
			const facts = await locked.readMessageFacts(factParams);
			const messagesByIdempotencyKey = /* @__PURE__ */ new Map();
			for (const [idempotencyKey, message] of facts.messagesByIdempotencyKey) if (isAgentMessageRecord(message)) messagesByIdempotencyKey.set(idempotencyKey, message);
			return {
				...facts,
				messagesByIdempotencyKey
			};
		}
	}), mode);
}
function isAgentMessageRecord(value) {
	return isRecord(value) && typeof value.role === "string" && value.role.trim().length > 0;
}
//#endregion
export { SessionTranscriptReadFenceError, captureCodexSessionContextReader, resolveSessionTranscriptReadFence as captureCodexSessionTranscriptReadAdmission, createSessionTranscriptContextReader as createCodexSessionContextReader, readCodexSessionContext, readSessionTranscriptContextProjectionAsync as readCodexSessionContextProjection, readCodexSessionTranscriptEventsBeforeAdmission, validateCodexSessionTranscriptContextVersion, validateCodexSessionTranscriptReadAdmission, withCodexSessionTranscriptMirrorWrite, withCodexSessionTranscriptMirrorWriteLock };
