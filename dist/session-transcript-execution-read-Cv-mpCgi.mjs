import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as decodeSessionTranscriptWorkerReadError } from "./session-history-worker-errors-D75quOgT.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-transcript-lock-settlement.ts
function transcriptAbortError(signal) {
	const reason = signal.reason;
	return reason instanceof Error ? reason : createAbortError(typeof reason === "string" ? reason : "Transcript operation aborted", { cause: reason });
}
/** Keep accepted work in the reservation after the callback closes its context. */
async function withTranscriptLockSettlement(run) {
	let accepting = true;
	let tail = Promise.resolve();
	const queue = (operation, signal) => {
		if (!accepting) return Promise.reject(/* @__PURE__ */ new Error("Transcript write context is closed"));
		if (signal?.aborted) return Promise.reject(transcriptAbortError(signal));
		let detach = () => {};
		const pending = tail.then(() => {
			detach();
			signal?.throwIfAborted();
			return operation();
		});
		tail = pending.then(() => void 0, () => void 0);
		if (!signal) return pending;
		return new Promise((resolve, reject) => {
			const abort = () => reject(transcriptAbortError(signal));
			signal.addEventListener("abort", abort, { once: true });
			detach = () => signal.removeEventListener("abort", abort);
			pending.then(resolve, reject);
		});
	};
	try {
		const result = run(queue);
		if (!isPromiseLike(result)) accepting = false;
		return await result;
	} finally {
		accepting = false;
		await tail;
	}
}
//#endregion
//#region src/config/sessions/session-transcript-execution-read.ts
const lockedTranscriptReads = resolveGlobalSingleton(Symbol.for("openclaw.lockedSessionTranscriptReads"), () => new AsyncLocalStorage());
/** Borrow the lock's worker and settlement queue, never reacquire its writer reservation. */
function withLockedSessionTranscriptReads(context, run) {
	return lockedTranscriptReads.run({
		...context,
		parent: lockedTranscriptReads.getStore()
	}, run);
}
function findLockedTranscriptReads(identity) {
	let inherited = lockedTranscriptReads.getStore();
	while (inherited && `file:${inherited.claim.identity}` !== identity.key && inherited.canonicalPath !== identity.canonicalPath) inherited = inherited.parent;
	return inherited;
}
/** Keep a compound read and its synchronous acceptance in the matching lock's FIFO turn. */
function runLockedSessionTranscriptRead(options, read, signal) {
	if (!lockedTranscriptReads.getStore()) return;
	const pathname = resolveOpenClawAgentSqlitePath(options);
	const identity = readDatabasePathIdentitySync(pathname);
	const locked = findLockedTranscriptReads(identity);
	if (!locked) return;
	const assertCurrent = () => {
		signal?.throwIfAborted();
		locked.assertCurrent();
		locked.claim.assertCurrent();
		if (`file:${locked.claim.identity}` !== identity.key) throw new Error("Transcript reader belongs to another locked database generation");
	};
	return locked.queue(async () => {
		assertCurrent();
		const result = await withTranscriptLockSettlement((queue) => withLockedSessionTranscriptReads({
			...locked,
			assertCurrent,
			queue
		}, read));
		assertCurrent();
		return result;
	}, signal);
}
/** Ordinary reads use WAL snapshots; an active transcript lock lends its ordered connection. */
function createPreparedSessionTranscriptReads(params) {
	const { claim, expectedIdentity } = params;
	const assertCurrent = () => {
		params.assertCurrent();
		claim.assertCurrent();
		if (`file:${claim.identity}` !== expectedIdentity.key) throw new Error("Transcript reader belongs to another prepared database generation");
	};
	const read = async (operation, snapshot, signal) => {
		signal?.throwIfAborted();
		assertCurrent();
		const locked = findLockedTranscriptReads(expectedIdentity);
		if (locked) return locked.queue(async () => {
			signal?.throwIfAborted();
			assertCurrent();
			locked.assertCurrent();
			locked.claim.assertCurrent();
			if (locked.claim.identity !== claim.identity || locked.claim.incarnation !== claim.incarnation) throw new Error("Transcript reader belongs to another locked database generation");
			const result = await operation(locked.worker);
			signal?.throwIfAborted();
			locked.assertCurrent();
			assertCurrent();
			if (!result.ok) throw decodeSessionTranscriptWorkerReadError(result.error);
			return result.value;
		}, signal);
		const result = await snapshot();
		signal?.throwIfAborted();
		assertCurrent();
		return result;
	};
	const reader = (snapshot, operation) => (input, signal) => read((worker) => operation(worker, input, signal), () => snapshot({
		...input,
		expectedIdentity
	}, signal), signal);
	return {
		readWatermark: reader(params.reader.readWatermark, (worker, input) => worker.execute({
			type: "session.transcript.watermark.read",
			input: {
				...input,
				expectedIdentity
			}
		})),
		readRawDelta: reader(params.reader.readRawDelta, (worker, input, signal) => worker.execute({
			type: "session.transcript.rawDelta.read",
			input: {
				...input,
				expectedIdentity
			}
		}, { signal })),
		readVisibleDelta: reader(params.reader.readVisibleDelta, (worker, input, signal) => worker.execute({
			type: "session.transcript.visibleDelta.read",
			input: {
				...input,
				expectedIdentity
			}
		}, { signal })),
		readSessionMemoryCapture: reader(params.reader.readSessionMemoryCapture, (worker, input, signal) => worker.execute({
			type: "session.transcript.memoryCapture.read",
			input: {
				...input,
				expectedIdentity
			}
		}, { signal })),
		readAnchors: reader(params.reader.readAnchors, (worker, input, signal) => worker.execute({
			type: "session.transcript.anchors.read",
			input: {
				...input,
				expectedIdentity
			}
		}, { signal })),
		readColdMetadata: async (input, signal) => ({
			kind: "cold-metadata",
			archive: await read((worker) => worker.execute({
				type: "session.transcript.coldMetadata.read",
				input: {
					sessionId: input.sessionId,
					expectedIdentity
				}
			}, { signal }), async () => (await params.reader.readColdMetadata(input, signal)).archive, signal)
		})
	};
}
//#endregion
export { withTranscriptLockSettlement as i, runLockedSessionTranscriptRead as n, withLockedSessionTranscriptReads as r, createPreparedSessionTranscriptReads as t };
