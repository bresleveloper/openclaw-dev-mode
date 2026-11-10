import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as sameTranscriptEntryAnchor } from "./transcript-entry-anchor-CzuOcGtx.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { l as getOwnedSessionTranscriptReader } from "./transcript-write-context-C02sC3zd.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import { n as readSessionTranscriptAnchorsAsync, r as readSessionTranscriptAnchorsFromSource } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { o as readSessionTranscriptModelContextInWorker } from "./session-transcript-read-worker-runtime--hfRfymd.mjs";
//#region src/config/sessions/session-transcript-context-read.ts
function assertCurrentInputAnchor(admission, current) {
	const admittedCurrent = current && current.storePath !== admission.storePath && isSameOpenClawAgentDatabasePath(admission.storePath, current.storePath) ? {
		...current,
		storePath: admission.storePath
	} : current;
	if (!sameTranscriptEntryAnchor(admission, admittedCurrent)) throw new SessionTranscriptReadFenceError("Current-turn transcript admission changed");
}
/** Keep a worker's bounded projection attached to its physical source until final acceptance. */
async function readSessionTranscriptContextProjectionAsync(target, project, signal) {
	const captured = { ...target };
	const admission = resolveSessionTranscriptReadFence(captured);
	const capturedAdmission = admission && structuredClone(admission);
	const memory = captureSessionActorTranscriptRead(captured, signal);
	if (memory) {
		const result = await project({
			target: memory.target,
			admission: capturedAdmission
		});
		memory.assertCurrent();
		return result.value;
	}
	return withSessionTranscriptReadSource(captured, async (source) => {
		const scope = {
			...source.scope,
			sessionKey: captured.sessionKey
		};
		const result = await project({
			target: {
				...captured,
				...scope
			},
			admission: capturedAdmission,
			physicalSource: { expectedIdentity: source.expectedIdentity }
		});
		source.assertCurrent();
		let accepted = false;
		await readSessionTranscriptAnchorsFromSource({
			...source,
			scope
		}, {
			entryIds: capturedAdmission ? [capturedAdmission.entryId] : [],
			contextValidation: {
				version: result.version,
				admission: capturedAdmission
			}
		}, signal, (facts) => {
			source.assertCurrent();
			if (capturedAdmission) assertCurrentInputAnchor(capturedAdmission, facts.anchors[0]);
			accepted = facts.contextValidated === true || !result.version && !capturedAdmission;
		});
		if (!accepted) throw new SessionTranscriptReadFenceError("Session transcript changed during context read");
		return result.value;
	}, signal, targetDiscoveryLane);
}
/** Accept consumed results while the original writer FIFO and native witness remain current. */
function readSessionTranscriptModelContextAsync(target, consume, admission, signal, through, limits, consumeSynchronously = false) {
	const capturedTarget = { ...target };
	const capturedAdmission = admission ? structuredClone(admission) : void 0;
	const capturedThrough = through ? structuredClone(through) : void 0;
	const capturedLimits = limits ? { ...limits } : void 0;
	const accept = async (scope, context, assertCurrent, contextAdmission = capturedAdmission, source) => {
		const contextValidation = structuredClone({
			version: context.version,
			admission: contextAdmission,
			through: capturedThrough
		});
		const admissionAnchor = source ? contextAdmission : void 0;
		const sharesThroughAnchor = admissionAnchor && capturedThrough?.entryId === admissionAnchor.entryId;
		if (sharesThroughAnchor) assertCurrentInputAnchor(admissionAnchor, capturedThrough);
		const selection = {
			entryIds: admissionAnchor && !sharesThroughAnchor ? [admissionAnchor.entryId] : [],
			contextValidation
		};
		let consumed;
		try {
			const onRead = (facts) => {
				assertCurrent();
				if (!facts.contextValidated && (contextValidation.version || contextAdmission || capturedThrough)) throw new SessionTranscriptReadFenceError("Session transcript changed during context read");
				if (admissionAnchor && !sharesThroughAnchor) assertCurrentInputAnchor(admissionAnchor, facts.anchors.find((anchor) => anchor.entryId === admissionAnchor.entryId));
				const value = Promise.resolve(consume(context));
				value.catch(() => void 0);
				consumed = { value };
			};
			if (source) await readSessionTranscriptAnchorsFromSource({
				...source,
				scope: {
					...source.scope,
					sessionKey: scope.sessionKey
				}
			}, selection, signal, onRead);
			else await readSessionTranscriptAnchorsAsync(scope, selection, signal, onRead);
		} catch (error) {
			if (consumed) await consumed.value.catch(() => void 0);
			throw error;
		}
		if (!consumed) throw new SessionTranscriptReadFenceError("Session transcript changed during context read");
		return await consumed.value;
	};
	const memory = captureSessionActorTranscriptRead(target, signal);
	if (memory) {
		if (memory.missing && (capturedAdmission || capturedThrough)) return Promise.reject(new SessionTranscriptReadFenceError("Session transcript is unavailable"));
		return (memory.missing ? Promise.resolve({ events: [] }) : memory.read("session.history.context", {
			...capturedAdmission ? { admission: capturedAdmission } : {},
			through: capturedThrough,
			limits: capturedLimits
		})).then(async (value) => {
			memory.assertCurrent();
			const result = consume(value);
			if (consumeSynchronously && isPromiseLike(result)) {
				Promise.resolve(result).catch(() => {});
				throw new Error("Prepared model-context consumers must remain synchronous");
			}
			const consumed = await result;
			memory.assertCurrent();
			return consumed;
		});
	}
	return withSessionTranscriptReadSource(capturedTarget, async (readSource) => {
		const { scope, expectedIdentity, assertCurrent } = readSource;
		const captured = {
			...scope,
			sessionKey: capturedTarget.sessionKey
		};
		const selected = !capturedAdmission && consumeSynchronously && capturedLimits && getOwnedSessionTranscriptReader(captured);
		if (selected) {
			const { captureSessionEntryNativeMutationWitness } = await import("./session-entry-read-ordered-BDuUakEp.mjs");
			assertCurrent();
			const database = selected.database;
			return runOpenClawAgentWriteAdmission(database, async (_identity, assertOwner) => {
				assertCurrent();
				const assertNative = captureSessionEntryNativeMutationWitness([database]);
				const context = await readSessionTranscriptModelContextInWorker(captured, capturedAdmission, signal, capturedThrough, capturedLimits, expectedIdentity);
				signal?.throwIfAborted();
				assertOwner();
				assertCurrent();
				assertNative();
				const value = consume(context);
				if (isPromiseLike(value)) {
					Promise.resolve(value).catch(() => {});
					throw new Error("Prepared model-context consumers must remain synchronous");
				}
				assertOwner();
				assertCurrent();
				assertNative();
				return value;
			}, true, void 0, signal, "history.model-context");
		}
		const context = await readSessionTranscriptModelContextInWorker(captured, capturedAdmission, signal, capturedThrough, capturedLimits, expectedIdentity);
		assertCurrent();
		return accept(captured, context, assertCurrent, capturedAdmission, capturedAdmission || capturedThrough ? readSource : void 0);
	}, signal, void 0, capturedThrough?.storePath);
}
//#endregion
export { readSessionTranscriptModelContextAsync as n, readSessionTranscriptContextProjectionAsync as t };
