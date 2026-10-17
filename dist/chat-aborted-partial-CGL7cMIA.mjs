import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DrLraxiU.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { n as broadcastChatError } from "./chat-broadcast-DFtZcstJ.mjs";
//#region src/gateway/server-methods/chat-aborted-partial.ts
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
/** Capture before signaling cancellation, without loading asynchronous transcript writers. */
function captureAbortedPartial(params) {
	const { runId, abortOrigin } = params;
	try {
		const session = params.session ?? {
			ok: true,
			value: loadGatewaySessionEntry(params.sessionKey, params.agentId ? { agentId: params.agentId } : void 0)
		};
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
			await producerCompleted;
			let warning;
			try {
				const { persistAbortedPartial } = await import("./chat-transcript-persistence-BEIRI5eI.mjs");
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
export { withAbortedPartialPersistenceWarning as a, deferAbortedPartialPersistence as i, abortedPartialPersistenceError as n, withQueuedCollectorWarning as o, captureAbortedPartial as r, ABORTED_PARTIAL_PERSISTENCE_WARNING as t };
