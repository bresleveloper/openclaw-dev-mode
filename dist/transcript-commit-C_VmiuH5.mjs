import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as createPlacementWorkerMutation } from "./placement-worker-mutation-DSJSnrd8.mjs";
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
	let store = options.store;
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
		const authority = {
			assertCurrent: params.assertCurrent,
			authorize: params.assertCurrent
		};
		const namespace = captureSessionActorStorageOwner(params.sessionTarget, authority);
		const captured = namespace ? {
			...params,
			sessionTarget: captureSessionTranscriptTargetBinding(params.sessionTarget)
		} : params;
		const execute = () => sessionOperations.enqueue(sessionId, async () => {
			const { commitWorkerTranscript } = await loadTranscriptCommitRuntime();
			return await commitWorkerTranscript(options, namespace ? void 0 : store ??= createWorkerTranscriptCommitStore(), sessionId, captured);
		});
		if (!namespace) return execute();
		return await withSessionActorStorage(captured.sessionTarget, {
			authority,
			lifetime: {
				assertCurrent: params.assertCurrent,
				assertReadable: params.assertCurrent
			}
		}, execute) ?? {
			ok: false,
			reason: "session-not-attached"
		};
	};
	return { commit };
}
//#endregion
export { createWorkerTranscriptCommitter };
