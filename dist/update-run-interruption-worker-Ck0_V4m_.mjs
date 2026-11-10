import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
//#region src/infra/update-run-interruption-worker.ts
async function readInterruptedUpdateCandidateAsync(options, context) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, { type: "updateRuns.interruptedCandidate" }, {
		context,
		preferIndependentWarmRead: true
	}));
	if (!reply) return;
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
