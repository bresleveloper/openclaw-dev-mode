import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as createPlacementWorkerMutation } from "./placement-worker-mutation-BBWzgFFJ.mjs";
import { n as isWorkerTranscriptCommitOutcome, t as isWorkerTranscriptCommitBeginResult } from "./transcript-commit-store.worker-contract-BALHXoPT.mjs";
//#region src/gateway/worker-environments/transcript-commit-ledger.ts
function createWorkerTranscriptCommitStore(options = {}) {
	const context = captureOpenClawStateWorkerContext({ path: options.database?.path });
	const now = options.now ?? Date.now;
	const execute = (command, readReceipt, assertCurrent) => {
		const captured = structuredClone(command);
		return createPlacementWorkerMutation({
			context,
			label: "Worker transcript ledger",
			nativeLocation: context.admission.databasePath,
			assertCurrent,
			stageCommit: () => void 0,
			readReceipt
		}).run((scope) => scope.execute(captured));
	};
	return {
		begin(input, assertCurrent) {
			return execute({
				type: "placementTranscript.begin",
				input: {
					...input,
					nowMs: now()
				}
			}, (facts) => isWorkerTranscriptCommitBeginResult(facts) ? facts : void 0, assertCurrent);
		},
		complete(input, assertCurrent) {
			return execute({
				type: "placementTranscript.complete",
				input: {
					...input,
					nowMs: now()
				}
			}, (facts) => isWorkerTranscriptCommitOutcome(facts) ? facts : void 0, assertCurrent);
		},
		async discardUncommitted(input) {
			await execute({
				type: "placementTranscript.discard",
				input: {
					...input,
					nowMs: now()
				}
			}, (facts) => facts === true ? facts : void 0);
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/transcript-commit.ts
const loadTranscriptCommitRuntime = createLazyRuntimeModule(() => import("./transcript-commit.runtime.js"));
/** Applies ordered, idempotent semantic worker turns to the canonical session transcript. */
function createWorkerTranscriptCommitter(options) {
	const store = options.store ?? createWorkerTranscriptCommitStore();
	const sessionOperations = new KeyedAsyncQueue();
	const commit = async (params) => {
		const sessionId = params.identity.sessionId;
		if (!sessionId) return {
			ok: false,
			reason: "session-not-attached"
		};
		if (params.request.runEpoch !== params.identity.ownerEpoch) return {
			ok: false,
			reason: "epoch-mismatch"
		};
		return await sessionOperations.enqueue(sessionId, async () => {
			const { commitWorkerTranscript } = await loadTranscriptCommitRuntime();
			return await commitWorkerTranscript(options, store, sessionId, params);
		});
	};
	return { commit };
}
//#endregion
export { createWorkerTranscriptCommitter };
