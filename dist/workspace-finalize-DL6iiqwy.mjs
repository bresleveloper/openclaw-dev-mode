import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as createWorkspaceReconcileMetrics } from "./workspace-hash-memo-R41irJvf.mjs";
//#region src/gateway/worker-environments/workspace-finalize.ts
const workspaceReconcileLog = createSubsystemLogger("gateway/worker-workspace");
var WorkerWorkspaceFinalFenceError = class extends Error {
	constructor(cause, reclaimDisposition) {
		super(cause instanceof Error ? cause.message : "Worker workspace quiescence failed", { cause });
		this.name = "WorkerWorkspaceFinalFenceError";
		this.reclaimDisposition = reclaimDisposition;
	}
};
async function runFinalFenceStep(operation, reclaimDisposition) {
	try {
		await operation();
	} catch (error) {
		throw new WorkerWorkspaceFinalFenceError(error, reclaimDisposition);
	}
}
const runRetryableFinalFenceStep = async (operation) => await runFinalFenceStep(operation, "retry");
const runResultPreservingFinalFenceStep = async (operation) => await runFinalFenceStep(operation, "preserve-result");
const workspaceReconcileReporters = /* @__PURE__ */ new WeakMap();
/** Runs one reconciliation with shared metrics and logs them once the final fence settles. */
async function runInstrumentedWorkspaceReconcile(run) {
	const metrics = createWorkspaceReconcileMetrics();
	const startedAt = performance.now();
	const report = (outcome) => {
		workspaceReconcileLog.debug("worker workspace reconcile completed", {
			outcome,
			durationMs: performance.now() - startedAt,
			...metrics
		});
	};
	try {
		const reconciliation = await run(metrics);
		workspaceReconcileReporters.set(reconciliation, report);
		return reconciliation;
	} catch (error) {
		report("failed");
		throw error;
	}
}
function reportWorkspaceReconcile(reconciliation, outcome) {
	const reporter = workspaceReconcileReporters.get(reconciliation);
	workspaceReconcileReporters.delete(reconciliation);
	reporter?.(outcome);
}
/** Rechecks both owners after renewing the remote quiescence lease. */
async function verifyReconciledWorkspaceFinal(reconciliation, quiescence) {
	let succeeded = false;
	try {
		if (reconciliation.publishStagedResult) try {
			await runRetryableFinalFenceStep(async () => await reconciliation.verifyStable());
			await runRetryableFinalFenceStep(async () => await quiescence.assertActive());
			await runRetryableFinalFenceStep(async () => await reconciliation.verifyStable());
			await reconciliation.applyPreparedStagedResult?.();
			await reconciliation.verifyLocalStable();
			await runResultPreservingFinalFenceStep(async () => await quiescence.assertActive());
			await runResultPreservingFinalFenceStep(async () => await reconciliation.verifyStable());
			await runResultPreservingFinalFenceStep(async () => await reconciliation.verifyLocalStable());
			await reconciliation.publishStagedResult();
			const applied = reconciliation.getAppliedWorkspaceResult?.();
			succeeded = true;
			return applied;
		} catch (error) {
			await reconciliation.discardPreparedStagedResult?.().catch(() => void 0);
			throw error;
		}
		const runFenceStep = reconciliation.changed ? runResultPreservingFinalFenceStep : runRetryableFinalFenceStep;
		await runFenceStep(async () => await reconciliation.verifyStable());
		await runFenceStep(async () => await reconciliation.verifyLocalStable());
		await runFenceStep(async () => await quiescence.assertActive());
		await runFenceStep(async () => await reconciliation.verifyStable());
		await runFenceStep(async () => await reconciliation.verifyLocalStable());
		const applied = reconciliation.getAppliedWorkspaceResult?.();
		succeeded = true;
		return applied;
	} finally {
		reportWorkspaceReconcile(reconciliation, succeeded ? "succeeded" : "failed");
	}
}
//#endregion
export { runInstrumentedWorkspaceReconcile as n, verifyReconciledWorkspaceFinal as r, WorkerWorkspaceFinalFenceError as t };
