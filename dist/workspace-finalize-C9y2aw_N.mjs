import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createWorkspaceReconcileMetrics } from "./workspace-hash-memo-CLHlwU2N.mjs";
//#region src/gateway/worker-environments/workspace-finalize.ts
const workspaceReconcileLog = createSubsystemLogger("gateway/worker-workspace");
var WorkerWorkspaceFinalFenceError = class extends Error {
	constructor(cause, reclaimDisposition) {
		super(cause instanceof Error ? cause.message : "Worker workspace quiescence failed", { cause });
		this.name = "WorkerWorkspaceFinalFenceError";
		this.reclaimDisposition = reclaimDisposition;
	}
};
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
/** Rechecks both owners after renewing the remote quiescence lease. */
async function verifyReconciledWorkspaceFinal(reconciliation, quiescence) {
	let succeeded = false;
	const acceptUnchanged = reconciliation.acceptUnchangedStagedResult;
	let disposition = "retry";
	const fence = async (operation) => {
		try {
			await operation();
		} catch (error) {
			throw new WorkerWorkspaceFinalFenceError(error, disposition);
		}
	};
	try {
		await fence(() => quiescence.assertActive());
		await fence(() => reconciliation.verifyStable());
		if (acceptUnchanged) await fence(acceptUnchanged);
		else {
			await reconciliation.applyPreparedStagedResult?.();
			await reconciliation.verifyLocalStable();
			disposition = "preserve-result";
			await fence(() => quiescence.assertActive());
			await fence(() => reconciliation.verifyStable());
			await fence(() => reconciliation.verifyLocalStable());
		}
		await reconciliation.publishStagedResult();
		const applied = reconciliation.getAppliedWorkspaceResult?.();
		succeeded = true;
		return applied;
	} catch (error) {
		await reconciliation.discardPreparedStagedResult().catch(() => void 0);
		throw error;
	} finally {
		const reporter = workspaceReconcileReporters.get(reconciliation);
		workspaceReconcileReporters.delete(reconciliation);
		reporter?.(succeeded ? "succeeded" : "failed");
	}
}
//#endregion
export { runInstrumentedWorkspaceReconcile as n, verifyReconciledWorkspaceFinal as r, WorkerWorkspaceFinalFenceError as t };
