import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { a as isCliPartialOutputRejected } from "./error-Bcp4ZyOv.mjs";
import { _ as retainPreparedSessionGenerationFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { i as loadIncognitoGatewaySessionEntryReadOnly } from "./session-utils-store-lW7Wu3P0.mjs";
import "./session-utils-CGx9I2of.mjs";
import { n as broadcastChatError } from "./chat-broadcast-CUWw-44C.mjs";
//#region src/gateway/server-methods/chat-aborted-partial.ts
/** Prepare fallible transcript metadata before synchronous cancellation can signal a producer. */
async function prepareChatAbortSessionSnapshot(params) {
	try {
		return {
			ok: true,
			value: await loadGatewaySessionEntryReadOnlyInWorker(params)
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
/** Follow the existing commit receipts until this run releases its cancellation owner. */
function retainChatAbortSessionSnapshot(snapshot) {
	if (!snapshot.ok) return {
		read: () => snapshot,
		release: () => {}
	};
	const selected = snapshot.value;
	if (isIncognitoSessionKey(selected.canonicalKey)) return {
		read: () => {
			try {
				return {
					ok: true,
					value: loadIncognitoGatewaySessionEntryReadOnly(selected.canonicalKey, { agentId: selected.agentId })
				};
			} catch (error) {
				return {
					ok: false,
					error
				};
			}
		},
		release: () => {}
	};
	try {
		const identity = readDatabasePathIdentitySync(resolveUnsuffixedSqliteTargetFromSessionStorePath(selected.storePath).path);
		const retained = retainPreparedSessionGenerationFacts({
			databaseIdentity: identity.key,
			sessionKey: selected.canonicalKey,
			entry: selected.entry
		});
		return {
			read: () => {
				const entry = retained.readCurrent();
				if (entry === void 0) return {
					ok: false,
					error: /* @__PURE__ */ new Error("Aborted partial transcript session is unavailable")
				};
				return {
					ok: true,
					value: {
						...selected,
						entry: entry ? selected.entry : void 0
					}
				};
			},
			release: retained.release
		};
	} catch (error) {
		return {
			read: () => ({
				ok: false,
				error
			}),
			release: () => {}
		};
	}
}
function withAbortedPartialPersistenceWarning(error, warning) {
	return warning ? {
		...error,
		message: `${error.message} ${warning}`
	} : error;
}
function withQueuedCollectorWarning(outcome, warning) {
	return outcome.ok ? {
		ok: true,
		value: {
			...outcome.value,
			warning
		}
	} : {
		ok: false,
		error: withAbortedPartialPersistenceWarning(outcome.error, warning)
	};
}
/** Retain a failed save when a later cancellation or terminal write also fails. */
function abortedPartialPersistenceError(error, warning) {
	if (!warning) return error;
	const message = `${formatErrorMessage(error)} ${warning}`;
	return error instanceof SessionMutationAuthorizationChangedError ? new SessionMutationAuthorizationChangedError({
		...error.error,
		message
	}) : new Error(message, { cause: error });
}
/** Settle already accepted persistence even when a later cancellation effect failed. */
async function settleChatAbortPersistence(finish, failure) {
	let warning;
	try {
		warning = await finish();
	} catch (error) {
		if (!failure) throw error;
		throw new AggregateError([failure.error, error], "Chat cancellation and persistence failed", { cause: error });
	}
	if (failure) throw abortedPartialPersistenceError(failure.error, warning);
	return warning;
}
/** Capture before signaling cancellation, without loading asynchronous transcript writers. */
function captureAbortedPartial(params) {
	const { runId, abortOrigin } = params;
	try {
		const session = params.session;
		if (!session.ok) throw session.error;
		const { cfg, storePath, entry, canonicalKey, agentId } = session.value;
		if (entry?.sessionId !== params.sessionId) throw new Error("Aborted partial transcript session changed before persistence");
		const producer = params.resolveTerminalProducer?.();
		return {
			runId,
			abortOrigin,
			ok: true,
			settlement: {
				deferred: false,
				producer: producer?.sessionId === params.sessionId && producer.sessionKey === params.sessionKey ? producer : void 0
			},
			value: {
				sessionKey: canonicalKey,
				sessionId: params.sessionId,
				expectedSessionId: params.sessionId,
				expectedLifecycleRevision: entry.lifecycleRevision ?? null,
				agentId,
				storePath,
				config: cfg,
				message: params.text,
				idempotencyKey: `${runId}:assistant`,
				abortMeta: {
					aborted: true,
					origin: abortOrigin,
					runId
				}
			}
		};
	} catch (error) {
		return {
			runId,
			abortOrigin,
			ok: false,
			error
		};
	}
}
/** Transfer the fallback before cancellation can clear the producer's session slot. */
function deferAbortedPartialPersistence(snapshot, context) {
	if (!snapshot?.ok || snapshot.settlement.deferred || !snapshot.settlement.producer) return;
	try {
		snapshot.settlement.deferred = snapshot.settlement.producer.handoff((producerCompleted) => context.trackExecution(async () => {
			const producerError = await producerCompleted;
			if (isCliPartialOutputRejected(producerError)) return;
			let warning;
			try {
				const { persistAbortedPartial } = await import("./chat-transcript-persistence-9U5UB00S.mjs");
				warning = await persistAbortedPartial({
					context,
					snapshot,
					producerSettled: true
				});
			} catch (error) {
				context.logGateway.warn(`chat.abort deferred transcript append failed: ${formatErrorMessage(error)}`);
				warning = ABORTED_PARTIAL_PERSISTENCE_WARNING;
			}
			if (warning) try {
				broadcastChatError({
					terminalEntry: void 0,
					context,
					runId: snapshot.runId,
					sessionKey: snapshot.value.sessionKey,
					agentId: snapshot.value.agentId,
					errorMessage: warning,
					stopReason: "aborted-partial-persistence-failed"
				});
			} catch (error) {
				context.logGateway.warn(`chat.abort persistence warning delivery failed: ${formatErrorMessage(error)}`);
			}
		}));
	} catch (error) {
		context.logGateway.warn(`chat.abort producer handoff failed: ${formatErrorMessage(error)}`);
	}
}
const ABORTED_PARTIAL_PERSISTENCE_WARNING = "Stopped, but a reply could not be saved to history. Copy any visible text before leaving this chat.";
//#endregion
export { prepareChatAbortSessionSnapshot as a, withAbortedPartialPersistenceWarning as c, deferAbortedPartialPersistence as i, withQueuedCollectorWarning as l, abortedPartialPersistenceError as n, retainChatAbortSessionSnapshot as o, captureAbortedPartial as r, settleChatAbortPersistence as s, ABORTED_PARTIAL_PERSISTENCE_WARNING as t };
