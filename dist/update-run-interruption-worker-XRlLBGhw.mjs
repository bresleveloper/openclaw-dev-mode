import { o as withArtifactPreservingStateReads, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
//#region src/infra/update-run-interruption-worker.ts
async function readInterruptedUpdateCandidateAsync(options, context) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, { type: "updateRuns.interruptedCandidate" }, {
		context,
		preferIndependentWarmRead: true
	}));
	if (!reply) return;
	if (!reply.ok || reply.type !== "updateRuns.interruptedCandidate") throw new Error("Unexpected interrupted update lookup result");
	return reply.run;
}
function persistInterruptedUpdateObservationAsync(context, input, signal) {
	const assertCurrent = () => {
		context.admission.assertCurrent();
		signal?.throwIfAborted();
	};
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "updateRuns.reconcileInterrupted",
		input
	}), {
		existingOnly: true,
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
export { readInterruptedUpdateCandidateAsync as n, persistInterruptedUpdateObservationAsync as t };
