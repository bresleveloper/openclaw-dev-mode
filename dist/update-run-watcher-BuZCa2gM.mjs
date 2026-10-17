import { t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as reconcileOpenClawStateSchemaPublication } from "./openclaw-state-db-D1jWDzK3.mjs";
import { h as reconcileAbandonedUpdateRunsAsync } from "./update-run-ledger-jBhhLo0P.mjs";
import { a as getUpdateRunAsync, u as listUpdateRunsAsync } from "./update-run-reader-B7x8dkVs.mjs";
import { t as reconcileInterruptedUpdateRuns } from "./update-run-interruption-D-Fn6H74.mjs";
import { i as GATEWAY_EVENT_UPDATE_RUN_CHANGED } from "./events-D023Lo1g.mjs";
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
	const scheduler = params.lifecycle.scheduler.scope();
	let timer;
	let publicationTimer;
	let watched;
	let notices = Promise.resolve();
	let reconciled = [];
	let polling;
	let pollAgain = false;
	let scanning;
	let scanRequested = false;
	let reconcileAllRequested = false;
	const schedulePublication = () => {
		publicationTimer?.cancel();
		publicationTimer = void 0;
		if (work.isClosing) return;
		try {
			const blocker = reconcileOpenClawStateSchemaPublication();
			if (blocker?.publishAfterMs != null) publicationTimer = scheduler.schedule({
				id: "update.schema-publication",
				atMs: blocker.publishAfterMs,
				run: schedulePublication
			});
		} catch (error) {
			params.log.warn(`state schema publication deferred: ${formatErrorMessage(error)}`);
		}
	};
	const scanOnce = async (reconcileAll) => {
		if (work.isClosing) return;
		timer?.cancel();
		timer = void 0;
		try {
			const abandoned = await reconcileAbandonedUpdateRunsAsync({ legacyOnly: !reconcileAll }, { signal: work.signal });
			if (work.isClosing) return;
			reconciled.push(...abandoned.filter((run) => run.runId !== watched?.runId));
			schedulePublication();
			const observed = watched ? await getUpdateRunAsync(watched.runId) : reconciled.shift() ?? (await listUpdateRunsAsync({
				active: true,
				limit: 1
			}))[0];
			if (work.isClosing) return;
			if (!observed) {
				watched = void 0;
				return;
			}
			const run = reconciled.reduce((latest, entry) => entry.runId === latest.runId && entry.updatedAtMs > latest.updatedAtMs ? entry : latest, observed);
			reconciled = reconciled.filter((entry) => entry.runId !== run.runId);
			watched ??= { runId: run.runId };
			const terminal = run.status !== "running";
			params.lifecycle.campaign?.reconcileRun(run);
			if (watched.revision !== run.updatedAtMs || terminal) {
				params.broadcast(GATEWAY_EVENT_UPDATE_RUN_CHANGED, {
					runId: run.runId,
					phase: run.phase,
					status: run.status,
					updatedAtMs: run.updatedAtMs
				});
				watched.revision = run.updatedAtMs;
				if (terminal && polling?.runId === run.runId) polling.terminalRevision = Math.max(polling.terminalRevision ?? 0, run.updatedAtMs);
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
			timer = scheduler.schedule({
				id: "update.run-poll",
				delayMs: UPDATE_RUN_POLL_MS,
				run: poll
			});
		} catch (error) {
			if (!work.isClosing) {
				watched = void 0;
				params.log.warn(`update run watcher stopped: ${formatErrorMessage(error)}`);
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
		polling = {};
		const cycle = polling;
		work.track(async () => {
			const settled = await reconcileInterruptedUpdateRuns({ signal: work.signal }, (runId) => {
				cycle.runId = runId;
			});
			if (work.isClosing) return;
			reconciled.push(...settled.filter((run) => run.runId !== watched?.runId && (run.runId !== cycle.runId || cycle.terminalRevision === void 0 || run.updatedAtMs > cycle.terminalRevision)));
			await scan();
		}).catch(async (error) => {
			if (!work.isClosing) {
				params.log.warn(`update run reconciliation deferred: ${formatErrorMessage(error)}`);
				await scan();
			}
		}).finally(() => {
			polling = void 0;
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
