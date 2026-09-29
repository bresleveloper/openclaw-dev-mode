import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as reconcileOpenClawStateSchemaPublication } from "./openclaw-state-db-BFK9cMiV.mjs";
import { c as reconcileAbandonedUpdateRuns } from "./update-run-ledger-CwAEg-5V.mjs";
import { r as getUpdateRun, t as findActiveUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { t as reconcileInterruptedUpdateRuns } from "./update-run-interruption-CDQSg-nC.mjs";
import { i as GATEWAY_EVENT_UPDATE_RUN_CHANGED } from "./events-J-3spXBQ.mjs";
//#region src/gateway/update-run-watcher.ts
const UPDATE_RUN_POLL_MS = 2e3;
let wakeCurrentWatcher;
/** Wake the Gateway-owned watcher when this process admits an update. */
function wakeUpdateRunWatcher() {
	wakeCurrentWatcher?.();
}
/** The update-check lifecycle joins notices and their transport tails before Gateway teardown. */
function startUpdateRunWatcher(params) {
	const work = new AsyncWorkScope();
	let timer;
	let publicationTimer;
	let watched;
	let notices = Promise.resolve();
	const reconciled = [];
	let polling = false;
	let pollAgain = false;
	const schedulePublication = () => {
		if (publicationTimer) {
			clearTimeout(publicationTimer);
			publicationTimer = void 0;
		}
		if (work.isClosing) return;
		try {
			const blocker = reconcileOpenClawStateSchemaPublication();
			if (blocker?.publishAfterMs != null) {
				publicationTimer = setTimeout(schedulePublication, Math.min(2147483647, Math.max(0, blocker.publishAfterMs - Date.now())));
				publicationTimer.unref?.();
			}
		} catch (error) {
			params.log.warn(`state schema publication deferred: ${formatErrorMessage(error)}`);
		}
	};
	const scan = (reconcileAll = true) => {
		if (work.isClosing) return;
		if (timer) clearTimeout(timer);
		timer = void 0;
		try {
			reconciled.push(...reconcileAbandonedUpdateRuns({ legacyOnly: !reconcileAll }).filter((run) => run.runId !== watched?.runId));
			schedulePublication();
			const run = watched ? getUpdateRun(watched.runId) : reconciled.shift() ?? findActiveUpdateRun();
			if (!run) {
				watched = void 0;
				return;
			}
			watched ??= { runId: run.runId };
			const terminal = run.status !== "running";
			if (watched.revision !== run.updatedAtMs || terminal) {
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
			if (terminal) {
				watched = void 0;
				scan(reconcileAll);
				return;
			}
			timer = setTimeout(poll, UPDATE_RUN_POLL_MS);
			timer.unref?.();
		} catch (error) {
			watched = void 0;
			params.log.warn(`update run watcher stopped: ${formatErrorMessage(error)}`);
		}
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
			if (settled.length || watched || pollAgain) scan();
		}).catch((error) => {
			if (!work.isClosing) {
				params.log.warn(`update run reconciliation deferred: ${formatErrorMessage(error)}`);
				scan();
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
	return { stop: () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		if (publicationTimer) {
			clearTimeout(publicationTimer);
			publicationTimer = void 0;
		}
		if (wakeCurrentWatcher === wake) wakeCurrentWatcher = void 0;
		return work.drain();
	} };
}
//#endregion
export { wakeUpdateRunWatcher as n, startUpdateRunWatcher as t };
