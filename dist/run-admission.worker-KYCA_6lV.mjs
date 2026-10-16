import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { h as updateCronRuntimeRow, n as deleteCronJobRowInDatabase, o as loadCronRows, r as deleteStaleCronJobFamilyRows, s as loadedCronStoreFromRows, y as tryCronScheduleIdentity } from "./row-codec-DgIrj0Uv.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-Dhn3MVqB.mjs";
import { o as isAgentDeletionBlocked } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-uYw1RFJQ.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-BU6jc44f.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { T as readActiveCronRunReceiptsInDatabase, a as adjudicateActiveCronRunReceiptInDatabase, c as assertCronRunReceiptOwnedInDatabase, f as ensureCronRunReceiptSchema, g as finishCronRunReceiptInDatabase, i as activateCronRunReceiptInDatabase, m as findActiveCronRunReceiptInDatabase, n as CronRunReceiptConflictError, r as CronRunReceiptRevisionError, s as assertCronRunReceiptCurrentInDatabase, u as claimCronRunReceiptInDatabase } from "./run-receipt-store-BI8RC7qi.mjs";
import { D as retainManualOneShotOccurrence, M as resolveCronNotificationQueueOwner, S as resolveNextRunAtMsOrDisable, h as recomputeJobNextRunAtMs, l as isJobEnabled } from "./jobs-scheduling-CBskypsm.mjs";
import { n as prepareCronRuntimeMutation, r as retainCronRuntimeMutationOutcome, t as createCronMutationLogger } from "./runtime-mutation.worker-Cxvhz87W.mjs";
import { t as mutateCronRuntimeRowsInDatabase } from "./runtime-rows.kernel-BTIrsXI5.mjs";
import { t as isCronRunTriggerStateRetiredInDatabase } from "./run-receipt-trigger-state-CWhPzp_b.mjs";
import { t as markCronDeliveryStartedInDatabase } from "./run-receipt-delivery-SySDc7lb.mjs";
//#region src/cron/store/scheduler-reservation.worker.ts
function clearMatchingReservationMarkers(job, reservation) {
	let changed = false;
	if (reservation.markerAtMs === job.state.queuedAtMs) {
		delete job.state.queuedAtMs;
		changed = true;
	}
	if (reservation.markerAtMs === job.state.runningAtMs) {
		delete job.state.runningAtMs;
		delete job.state.runningReceiptId;
		delete job.state.runningScheduleChangeId;
		changed = true;
	}
	return changed;
}
/** Named scheduler cleanup policies retain their distinct marker and receipt predicates. */
function releaseSchedulerReservationsInWorker(database, input) {
	const { policy } = input;
	const jobIds = /* @__PURE__ */ new Set([...input.jobIds, ...policy.kind === "startup-settlement" ? policy.deferredJobs.map((job) => job.jobId) : []]);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const committed = mutateCronRuntimeRowsInDatabase({
			database: db,
			storeKey: input.storeKey,
			jobIds,
			mutate({ jobs, receiptSchema }) {
				const preparation = prepareCronRuntimeMutation("cron.releaseReservations", input.nonce, {
					deletionBlocked: false,
					notificationNeedsDefault: policy.kind === "startup-settlement" && policy.deferredJobs.some(({ jobId }) => {
						const job = jobs.get(jobId);
						return job !== void 0 && isJobEnabled(job) && !resolveCronNotificationQueueOwner(job, "auto-disabled").agentId;
					})
				});
				const outcome = {
					jobs: [],
					notifications: [],
					logs: []
				};
				const finish = (reservation, error) => {
					finishCronRunReceiptInDatabase({
						receiptSchema,
						database: db,
						handle: reservation.runReceipt,
						status: "skipped",
						finishedAtMs: preparation.nowMs,
						error
					});
				};
				if (policy.kind === "startup-settlement") {
					const reservations = new Map(preparation.reservations.map((reservation) => [reservation.jobId, reservation]));
					const deferredJobs = new Map(policy.deferredJobs.map((deferred) => [deferred.jobId, deferred]));
					const state = { deps: {
						nowMs: () => preparation.nowMs,
						log: createCronMutationLogger(outcome.logs)
					} };
					let offset = policy.staggerMs;
					for (const job of jobs.values()) {
						let changed = false;
						const reservation = reservations.get(job.id);
						if (reservation) {
							finish(reservation, "cron startup reservation abandoned before completion");
							if (reservation.activationPreviousLastError) job.state.lastError = reservation.activationPreviousLastError.value;
							changed = clearMatchingReservationMarkers(job, reservation);
						}
						const deferred = deferredJobs.get(job.id);
						if (deferred && isJobEnabled(job) && job.state.queuedAtMs === void 0 && job.state.runningAtMs === void 0 && job.state.nextRunAtMs === deferred.nextRunAtMs && job.state.lastRunAtMs === deferred.lastRunAtMs && job.state.lastRunStatus === deferred.lastRunStatus && job.state.scheduleActivatedAtMs === deferred.scheduleActivatedAtMs && job.createdAtMs === deferred.createdAtMs && job.payload.kind === deferred.payloadKind && deferred.scheduleIdentity !== void 0 && tryCronScheduleIdentity(job) === deferred.scheduleIdentity && !findActiveCronRunReceiptInDatabase({
							database: db,
							storePath: input.storeKey,
							jobId: job.id
						})) {
							const candidate = typeof deferred.delayMs === "number" ? preparation.nowMs + deferred.delayMs + offset - policy.staggerMs : preparation.nowMs + offset;
							const runAtMs = resolveNextRunAtMsOrDisable({
								state,
								job,
								candidate,
								deferredNotifications: outcome.notifications
							});
							job.state.nextRunAtMs = runAtMs;
							job.state.startupCatchupAtMs = runAtMs;
							offset += policy.staggerMs;
							changed = true;
						}
						if (changed) outcome.jobs.push(job);
					}
				} else for (const reservation of preparation.reservations) {
					const job = jobs.get(reservation.jobId);
					if (policy.kind === "scheduled-ineligible") {
						if (!job || reservation.markerAtMs !== job.state.queuedAtMs) continue;
						finish(reservation, "cron scheduled reservation became ineligible");
						delete job.state.queuedAtMs;
					} else {
						finish(reservation, "cron manual reservation abandoned before completion");
						if (!job || !clearMatchingReservationMarkers(job, reservation)) continue;
						if (reservation.activationPreviousLastError) job.state.lastError = reservation.activationPreviousLastError.value;
					}
					outcome.jobs.push(job);
				}
				for (const notification of outcome.notifications) notification.routing = preparation.notificationRouting;
				return {
					upsertJobIds: outcome.jobs.map((job) => job.id),
					value: outcome
				};
			}
		});
		return retainCronRuntimeMutationOutcome("cron.releaseReservations", db, input.nonce, committed.value);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: {
		"manual-abandon": "cron.manual-reservation-cleanup",
		"scheduled-ineligible": "cron.skipped-reservation-cleanup",
		"startup-settlement": "cron.startup-catchup-state"
	}[policy.kind] });
}
//#endregion
//#region src/cron/store/run-admission.worker.ts
function loadRuntimeRows(db, storeKey, jobIds) {
	const rows = loadCronRows(db, storeKey, new Set(jobIds), { includeGrantDefinitionProjection: true });
	const jobs = loadedCronStoreFromRows(rows).store.jobs;
	const { repairJobIds } = loadCronRuntimeAuthorities({
		db,
		storeKey,
		jobs
	});
	if (repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
		db,
		storeKey,
		jobs,
		jobIds: repairJobIds
	});
	return {
		rows: new Map(rows.map((row) => [row.job_id, row])),
		jobs: new Map(jobs.map((job) => [job.id, job]))
	};
}
function reserveCronRunsInWorker(database, input) {
	let transactionConflict;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			try {
				const proposals = new Map(input.proposals.map((proposal) => [proposal.jobId, proposal]));
				const jobIds = [...proposals.keys()].toSorted();
				const { rows, jobs } = loadRuntimeRows(db, input.storeKey, jobIds);
				const receiptSchema = prepareCronRunReceiptWriteSchema(db);
				ensureCronRunReceiptSchema(db);
				const preparation = prepareCronRuntimeMutation("cron.reserveRuns", input.nonce, { receipts: readActiveCronRunReceiptsInDatabase(db, input.storeKey, jobIds) });
				const claims = new Map(preparation.claims.map((claim) => [claim.handle.jobId, claim]));
				const replacements = new Map(preparation.replacements.map((receipt) => [receipt.jobId, receipt]));
				for (const jobId of jobIds) if (!replacements.has(jobId)) adjudicateActiveCronRunReceiptInDatabase({
					database: db,
					jobId,
					prepared: claims.get(jobId),
					finishedAtMs: input.reservedAtMs
				});
				const outcome = {
					reservations: [],
					replacedReceipts: []
				};
				for (const jobId of jobIds) {
					const job = jobs.get(jobId);
					const row = rows.get(jobId);
					const planned = proposals.get(jobId);
					if (!job || !row || job.enabled !== planned.enabled || !planned.immediate && job.state.nextRunAtMs !== planned.nextRunAtMs || job.state.lastRunAtMs !== planned.lastRunAtMs || job.state.lastRunStatus !== planned.lastRunStatus || job.state.queuedAtMs !== void 0 || job.state.runningAtMs !== void 0 || resolveCronJobConfigRevision(job) !== planned.configRevision) continue;
					const prior = replacements.get(jobId);
					if (prior) {
						finishCronRunReceiptInDatabase({
							database: db,
							receiptSchema,
							handle: prior,
							status: "superseded",
							finishedAtMs: input.reservedAtMs,
							error: "cron reservation replaced before activation"
						});
						outcome.replacedReceipts.push(prior);
					}
					const runReceipt = claimCronRunReceiptInDatabase({
						database: db,
						receiptSchema,
						prepared: claims.get(jobId),
						resolveAgentId: (current) => resolveCronJobEffectiveAgentId(current, preparation.defaultAgentId)
					});
					const previousEnabled = job.enabled ?? true;
					if (input.onExit) {
						job.enabled = false;
						job.updatedAtMs = input.reservedAtMs;
						job.state.scheduleActivatedAtMs = input.reservedAtMs;
						delete job.state.nextRunAtMs;
						delete job.state.startupCatchupAtMs;
						delete job.state.pacedNextRunAtMs;
						delete job.state.forcePreservedNextRunAtMs;
					} else if (input.preserveSchedule) retainManualOneShotOccurrence(job, input.scheduleOwnershipAtMs);
					job.state.queuedAtMs = input.reservedAtMs;
					updateCronRuntimeRow(db, input.storeKey, job, previousEnabled);
					outcome.reservations.push({
						job,
						runReceipt
					});
				}
				return retainCronRuntimeMutationOutcome("cron.reserveRuns", db, input.nonce, outcome);
			} catch (error) {
				if (error instanceof CronRunReceiptConflictError) transactionConflict = error;
				throw error;
			}
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.run-reservation" });
	} catch (error) {
		if (!transactionConflict || error !== transactionConflict) throw error;
		assertTransactionUsable(database.db);
		if (!database.db.isOpen || database.db.isTransaction) throw error;
		return {
			nonce: input.nonce,
			conflict: transactionConflict.receipt
		};
	}
}
function activateCronRunInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const { rows, jobs } = loadRuntimeRows(db, input.storeKey, [input.handle.jobId]);
		const current = jobs.get(input.handle.jobId);
		const preparation = prepareCronRuntimeMutation("cron.activateRun", input.nonce, {});
		const outcome = {};
		const row = rows.get(input.handle.jobId);
		const matchesExit = !input.onExitSchedule || current?.schedule.kind === "on-exit" && current.schedule.command === input.onExitSchedule.command && current.schedule.cwd === input.onExitSchedule.cwd;
		if (current && row && current.state.queuedAtMs === preparation.markerAtMs && matchesExit) try {
			const receipt = activateCronRunReceiptInDatabase({
				database: db,
				handle: input.handle,
				startedAtMs: input.startedAtMs,
				resolveAgentId: (job) => resolveCronJobEffectiveAgentId(job, preparation.defaultAgentId)
			});
			outcome.activation = {
				job: current,
				receipt,
				previousLastError: current.state.lastError
			};
			delete current.state.queuedAtMs;
			current.state.runningAtMs = input.startedAtMs;
			current.state.runningReceiptId = receipt.receiptId;
			delete current.state.runningScheduleChangeId;
			current.state.lastError = void 0;
			updateCronRuntimeRow(db, input.storeKey, current);
		} catch (error) {
			if (!(error instanceof CronRunReceiptRevisionError)) throw error;
		}
		return retainCronRuntimeMutationOutcome("cron.activateRun", db, input.nonce, outcome);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-activation" });
}
function releaseCronReservationsInWorker(database, input) {
	const { policy } = input;
	if (policy.kind !== "general") return releaseSchedulerReservationsInWorker(database, {
		...input,
		policy
	});
	return runOpenClawStateWriteTransaction(({ db }) => {
		const { rows, jobs } = loadRuntimeRows(db, input.storeKey, input.jobIds);
		const receiptSchema = prepareCronRunReceiptWriteSchema(db);
		const preparation = prepareCronRuntimeMutation("cron.releaseReservations", input.nonce, {
			notificationNeedsDefault: false,
			deletionBlocked: policy.requireCurrentReceipt === true && policy.terminal !== void 0 && isAgentDeletionBlocked(policy.terminal.handle.agentId, {}, db)
		});
		const outcome = {
			jobs: [],
			notifications: [],
			logs: []
		};
		const state = { deps: {
			nowMs: () => preparation.nowMs,
			log: createCronMutationLogger(outcome.logs)
		} };
		if (policy.requireCurrentReceipt && policy.terminal) assertCronRunReceiptCurrentInDatabase({
			database: db,
			handle: policy.terminal.handle,
			resolveAgentId: (job) => resolveCronJobEffectiveAgentId(job, preparation.defaultAgentId)
		});
		for (const reservation of preparation.reservations) {
			if (!policy.terminal) finishCronRunReceiptInDatabase({
				database: db,
				receiptSchema,
				handle: reservation.runReceipt,
				status: "skipped",
				finishedAtMs: preparation.nowMs,
				error: "cron reservation released before completion"
			});
			const job = jobs.get(reservation.jobId);
			const row = rows.get(reservation.jobId);
			if (!job || !row) continue;
			const queuedMatches = reservation.markerAtMs === job.state.queuedAtMs;
			const runningMatches = reservation.markerAtMs === job.state.runningAtMs;
			if (!queuedMatches && !runningMatches) continue;
			const previousEnabled = job.enabled ?? true;
			if (policy.restoreLastError && reservation.activationPreviousLastError) job.state.lastError = reservation.activationPreviousLastError.value;
			if (queuedMatches) delete job.state.queuedAtMs;
			if (runningMatches) {
				delete job.state.runningAtMs;
				delete job.state.runningReceiptId;
				delete job.state.runningScheduleChangeId;
			}
			if (policy.recompute && job.enabled && job.state.nextRunAtMs === void 0) recomputeJobNextRunAtMs({
				state,
				job,
				nowMs: preparation.nowMs,
				deferredNotifications: outcome.notifications
			});
			updateCronRuntimeRow(db, input.storeKey, job, previousEnabled);
			outcome.jobs.push(job);
		}
		if (policy.terminal && !preparation.deferTerminal) finishCronRunReceiptInDatabase({
			database: db,
			receiptSchema,
			...policy.terminal
		});
		return retainCronRuntimeMutationOutcome("cron.releaseReservations", db, input.nonce, outcome);
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-reservation-cleanup" });
}
function markCronDeliveryStartedInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (input.storeKey !== input.handle.storeKey) throw new CronRunReceiptRevisionError(input.handle.receiptId);
		const deletionBlocked = isAgentDeletionBlocked(input.handle.agentId, {}, db);
		const preparation = prepareCronRuntimeMutation("cron.markDeliveryStarted", input.nonce, { deletionBlocked });
		if (deletionBlocked) throw new CronRunReceiptRevisionError(input.handle.receiptId, "cron agent is unavailable", "owner-unavailable");
		markCronDeliveryStartedInDatabase({
			database: db,
			handle: input.handle,
			allowMissingJob: preparation.allowMissingJob,
			resolveAgentId: (job) => resolveCronJobEffectiveAgentId(job, preparation.defaultAgentId)
		});
		return retainCronRuntimeMutationOutcome("cron.markDeliveryStarted", db, input.nonce, {});
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-receipt.mark-delivery-started" });
}
function finishCronReceiptInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		prepareCronRuntimeMutation("cron.finishReceipt", input.nonce, {});
		finishCronRunReceiptInDatabase({
			database: db,
			receiptSchema: prepareCronRunReceiptWriteSchema(db),
			...input.terminal
		});
		return retainCronRuntimeMutationOutcome("cron.finishReceipt", db, input.nonce, {});
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.run-receipt.finish" });
}
/** Job state and its terminal receipt share the same authoritative write transaction. */
function finalizeCronRunsInWorker(database, input) {
	let transactionRefusal;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			try {
				const { rows, jobs } = loadRuntimeRows(db, input.storeKey, input.jobIds);
				const receiptSchema = prepareCronRunReceiptWriteSchema(db);
				const preparation = prepareCronRuntimeMutation("cron.finalizeRuns", input.nonce, {
					jobs: [...jobs.values()],
					receipts: input.receipts.map(({ terminal }) => ({
						receiptId: terminal.handle.receiptId,
						deletionBlocked: isAgentDeletionBlocked(terminal.handle.agentId, {}, db),
						triggerStateRetired: isCronRunTriggerStateRetiredInDatabase({
							database: db,
							handle: terminal.handle
						})
					}))
				});
				for (const { terminal, allowMissingJob } of input.receipts) if (allowMissingJob) assertCronRunReceiptOwnedInDatabase({
					database: db,
					handle: terminal.handle
				});
				else assertCronRunReceiptCurrentInDatabase({
					database: db,
					handle: terminal.handle,
					resolveAgentId: (job) => resolveCronJobEffectiveAgentId(job, preparation.defaultAgentId)
				});
				const deleted = new Set(preparation.deletedJobIds);
				for (const jobId of deleted) {
					if (!input.jobIds.includes(jobId)) throw new Error("Cron finalization attempted to delete an unrelated job");
					deleteCronJobRowInDatabase(db, input.storeKey, jobId);
				}
				for (const job of preparation.jobs) if (rows.get(job.id) && !deleted.has(job.id)) updateCronRuntimeRow(db, input.storeKey, job, jobs.get(job.id)?.enabled ?? true);
				for (const { terminal } of input.receipts) if (!preparation.deferredReceiptIds.includes(terminal.handle.receiptId)) finishCronRunReceiptInDatabase({
					database: db,
					receiptSchema,
					...terminal
				});
				return retainCronRuntimeMutationOutcome("cron.finalizeRuns", db, input.nonce, { changed: preparation.jobs.length > 0 || deleted.size > 0 });
			} catch (error) {
				if (error instanceof CronRunReceiptRevisionError) transactionRefusal = error;
				throw error;
			}
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.run-finalization" });
	} catch (error) {
		if (!transactionRefusal || error !== transactionRefusal) throw error;
		assertTransactionUsable(database.db);
		if (!database.db.isOpen || database.db.isTransaction) throw error;
		return {
			nonce: input.nonce,
			receiptRevision: {
				receiptId: transactionRefusal.receiptId,
				message: transactionRefusal.message,
				reason: transactionRefusal.reason
			}
		};
	}
}
function removeStaleCronFamilyInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		prepareCronRuntimeMutation("cron.removeStaleFamily", input.nonce, {});
		const removed = deleteStaleCronJobFamilyRows(db, input.storeKey, input.family);
		return retainCronRuntimeMutationOutcome("cron.removeStaleFamily", db, input.nonce, { removed });
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.job-family-adoption" });
}
//#endregion
export { activateCronRunInWorker, finalizeCronRunsInWorker, finishCronReceiptInWorker, markCronDeliveryStartedInWorker, releaseCronReservationsInWorker, removeStaleCronFamilyInWorker, reserveCronRunsInWorker };
