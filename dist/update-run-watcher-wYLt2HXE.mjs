import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { i as GATEWAY_EVENT_UPDATE_RUN_CHANGED } from "./events-ds0bML-H.mjs";
import { h as reconcileAbandonedUpdateRunsAsync } from "./update-run-ledger-C3oL-g8r.mjs";
import { a as getUpdateRunAsync, u as listUpdateRunsAsync } from "./update-run-reader-BOC3s3Sk.mjs";
import { o as isPendingControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { t as reconcileInterruptedUpdateRuns } from "./update-run-interruption-DoE7kEcq.mjs";
//#region src/state/openclaw-state-schema-publication.async.ts
/** Publish deferred schema metadata through the existing shared-state writer. */
function reconcileOpenClawStateSchemaPublicationAsync(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "database.publishSchema",
		input: void 0
	}), {
		existingOnly: true,
		signal: options.signal,
		createAdmission: createSqliteWorkerWriteAdmission(context.admission.assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
//#region src/gateway/update-run-watcher.ts
const UPDATE_RUN_POLL_MS = 2e3;
const TERMINAL_SENTINEL_WAIT_MS = 18e5;
let wakeCurrentWatcher;
/** Wake the Gateway-owned watcher when this process admits an update. */
function wakeUpdateRunWatcher() {
	wakeCurrentWatcher?.();
}
/** The update-check lifecycle joins notices and their transport tails before Gateway teardown. */
function startUpdateRunWatcher(params) {
	const work = new AsyncWorkScope();
	const scheduler = params.lifecycle.scheduler.scope();
	let timer;
	let publicationTimer;
	let watched;
	let notices = Promise.resolve();
	let reconciled = [];
	let polling = false;
	let pollAgain = false;
	let scanning;
	let scanRequested = false;
	let reconcileAllRequested = false;
	const schedulePublication = async () => {
		publicationTimer?.cancel();
		publicationTimer = void 0;
		if (work.isClosing) return;
		try {
			const blocker = await reconcileOpenClawStateSchemaPublicationAsync({ signal: work.signal });
			if (!work.isClosing && blocker?.publishAfterMs != null) publicationTimer = scheduler.schedule({
				id: "update.schema-publication",
				atMs: blocker.publishAfterMs,
				run: () => work.track(schedulePublication)
			});
		} catch (error) {
			if (!work.isClosing) params.log.warn(`state schema publication deferred: ${formatErrorMessage(error)}`);
		}
	};
	const schedulePoll = () => {
		timer = scheduler.schedule({
			id: "update.run-poll",
			delayMs: UPDATE_RUN_POLL_MS,
			run: poll
		});
	};
	const scanOnce = async (reconcileAll) => {
		if (work.isClosing) return;
		timer?.cancel();
		timer = void 0;
		try {
			const abandoned = await reconcileAbandonedUpdateRunsAsync({ legacyOnly: !reconcileAll }, { signal: work.signal });
			if (work.isClosing) return;
			reconciled.push(...abandoned.filter((run) => run.runId !== watched?.runId));
			await schedulePublication();
			if (work.isClosing) return;
			const run = (watched?.sentinelDeadline ? (await listUpdateRunsAsync({
				active: true,
				limit: 1
			}))[0] : void 0) ?? (watched ? await getUpdateRunAsync(watched.runId) : reconciled.shift() ?? (await listUpdateRunsAsync({
				active: true,
				limit: 1
			}))[0]);
			if (work.isClosing) return;
			if (!run) {
				watched = void 0;
				return;
			}
			reconciled = reconciled.filter((entry) => entry.runId !== run.runId);
			if (watched?.runId !== run.runId) watched = { runId: run.runId };
			const terminal = run.status !== "running";
			params.lifecycle.campaign?.reconcileRun(run);
			let awaitingSentinel = false;
			if (watched.revision !== run.updatedAtMs || terminal) {
				const { refreshLatestUpdateRestartSentinel, getLatestUpdateRestartSentinel } = await import("./server-update-sentinel-C5zUPwMW.mjs");
				let sentinelFailed = false;
				const sentinel = await refreshLatestUpdateRestartSentinel(void 0, () => !work.isClosing && params.lifecycle.isCurrent()).catch((error) => {
					sentinelFailed = true;
					params.log.warn(`update sentinel refresh failed: ${formatErrorMessage(error)}`);
					return getLatestUpdateRestartSentinel();
				});
				if (work.isClosing || !params.lifecycle.isCurrent()) return;
				if (terminal && (sentinelFailed || sentinel?.stats?.runId === run.runId && isPendingControlPlaneUpdateRestartSentinel(sentinel))) {
					watched.sentinelDeadline ??= scheduler.now() + TERMINAL_SENTINEL_WAIT_MS;
					awaitingSentinel = scheduler.now() < watched.sentinelDeadline;
					if (!awaitingSentinel) params.log.warn(`update run ${run.runId} terminal notification remained pending`);
				}
				params.broadcast(GATEWAY_EVENT_UPDATE_RUN_CHANGED, {
					runId: run.runId,
					phase: run.phase,
					status: run.status,
					updatedAtMs: run.updatedAtMs
				});
				watched.revision = run.updatedAtMs;
			}
			if (watched.phase !== run.phase) {
				watched.phase = run.phase;
				const acknowledged = run.steps.some((step) => step.step === "notice:ack" && step.status === "completed");
				if (run.phase === "activating" || terminal && acknowledged) notices = work.track(() => notices.then(async () => {
					if (work.isClosing) return;
					const { notifyUpdateRunPhase } = await import("./update-run-notice.runtime.js");
					if (!work.isClosing) await notifyUpdateRunPhase(run);
				}).catch((error) => {
					params.log.warn(`update run notice failed: ${formatErrorMessage(error)}`);
				}));
			}
			if (terminal && !awaitingSentinel) {
				watched = void 0;
				scan(reconcileAll);
				return;
			}
			schedulePoll();
		} catch (error) {
			if (!work.isClosing) {
				params.log.warn(`update run watcher ${watched ? "deferred" : "stopped"}: ${formatErrorMessage(error)}`);
				if (watched) schedulePoll();
			}
		}
	};
	const scan = (requestReconciliation = true) => {
		if (work.isClosing) return Promise.resolve();
		scanRequested = true;
		reconcileAllRequested ||= requestReconciliation;
		if (scanning) return scanning;
		scanning = work.track(async () => {
			try {
				while (scanRequested && !work.isClosing) {
					const reconcileAll = reconcileAllRequested;
					scanRequested = false;
					reconcileAllRequested = false;
					await scanOnce(reconcileAll);
				}
			} finally {
				scanning = void 0;
			}
		});
		return scanning;
	};
	const poll = () => {
		if (work.isClosing) return;
		timer = void 0;
		scan(false);
		if (polling) {
			pollAgain = true;
			return;
		}
		polling = true;
		work.track(async () => {
			const settled = await reconcileInterruptedUpdateRuns({ signal: work.signal });
			if (work.isClosing) return;
			reconciled.push(...settled.filter((run) => run.runId !== watched?.runId));
			await scan();
		}).catch(async (error) => {
			if (!work.isClosing) {
				params.log.warn(`update run reconciliation deferred: ${formatErrorMessage(error)}`);
				await scan();
			}
		}).finally(() => {
			polling = false;
			if (pollAgain) {
				pollAgain = false;
				if (!timer) poll();
			}
		});
	};
	const wake = () => {
		if (!timer && !watched) poll();
	};
	wakeCurrentWatcher = wake;
	wake();
	return { stop: async () => {
		work.beginClose();
		if (wakeCurrentWatcher === wake) wakeCurrentWatcher = void 0;
		await Promise.all([scheduler.stop(), work.drain()]);
	} };
}
//#endregion
export { wakeUpdateRunWatcher as n, startUpdateRunWatcher as t };
