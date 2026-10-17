import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { n as computeBackoff } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import "./backoff-BrzXG7iD.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import "./agent-limits-D-OOBnZ7.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { R as ensureDeliveryState, S as isSameSubagentRunOwner, h as compareSubagentRunGeneration, j as rowToSubagentRunRecord, z as getDeliveryLastError } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { o as subagentRunRowVersion } from "./subagent-registry.store.kernel-5Rc86AOU.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { C as applySessionEntryExactReplacements } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { a as getErrnoCode, d as resolveDeliveryRecoveryDeadlineMs, n as createDeliveryRecoveryCoordinator, r as createEmptyDeliveryRecoverySummary, s as isDeliveryRecoveryRetryEligible, t as computeBackoffMs } from "./delivery-recovery.shared-AM7vMnRv.mjs";
import "./sessions-D_sxp1B4.mjs";
import { i as getSubagentRunsForChildSession, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { a as SessionDeliveryDeferredError, i as SessionDeliveryDeadLetteredError, n as SessionDeliveryAcknowledgementFinalizeError, o as SessionDeliveryRetryChargedError, r as SessionDeliveryAttemptStartError, s as SessionDeliverySafeRetryError } from "./session-delivery-queue.records-E9Zh5OLd.mjs";
import { c as loadPendingSessionDelivery, f as moveSessionDeliveryToFailed, n as completeSessionDelivery, o as failSessionDelivery, s as loadPendingSessionDeliveries, u as markSessionDeliverySettlement } from "./session-delivery-queue-storage-CchO1Prq.mjs";
import { i as SubagentRegistryWriteError, n as SubagentRegistryMutationRejectedError, r as SubagentRegistryVersionConflictError, s as mutateSubagentRuns, t as SubagentRegistryCommitReceiptError } from "./subagent-registry-persistence-7pBNp1rN.mjs";
import { n as captureRequesterSettleRunIdentity, r as captureRequesterSettleWakeProgress } from "./subagent-requester-settle-identity-Blu5INx9.mjs";
import { n as retiredCancellationEndedAt } from "./subagent-completion-mutation.kernel-DIoaxDZ_.mjs";
import { n as resolveSubagentSessionAttachmentRootDir } from "./subagent-attachment-paths-0g-Tlw0v.mjs";
import { i as resolveSubagentSessionStatus, n as getSubagentSessionStartedAt, t as getSubagentSessionRuntimeMs } from "./subagent-session-metrics-BCHEYB6I.mjs";
import { n as resolveSessionRunError, t as recordGatewaySessionRunFailure } from "./session-run-error-CL5VRYOU.mjs";
import { r as resolveCompletionFromSessionEntry } from "./subagent-session-reconciliation-CtdzcsHV.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/infra/session-delivery-queue-recovery.ts
const MAX_SESSION_DELIVERY_RETRIES = 5;
const recoveryCoordinator = createDeliveryRecoveryCoordinator();
async function finalizeSessionDeliverySettlement(params) {
	try {
		params.queueContext.admission.assertCurrent();
		await params.onSettled?.(params.entry, params.outcome, params.queueContext);
	} catch (error) {
		params.log.error(`session delivery: settled callback failed for ${params.entry.id}: ${String(error)}`);
		return false;
	}
	try {
		if (params.outcome === "recovered") await completeSessionDelivery(params.entry.id, params.queueContext);
		else await moveSessionDeliveryToFailed(params.entry.id, params.queueContext);
		return true;
	} catch (error) {
		params.log.error(`session delivery: ${params.outcome} finalization failed for ${params.entry.id}: ${String(error)}`);
		return false;
	}
}
function resolvePendingSettlementOutcome(entry) {
	return entry.settlementOutcome ?? (entry.acknowledgedAt !== void 0 ? "recovered" : void 0);
}
function resolveSessionRetryEligibility(entry, now) {
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") {
		if (now >= entry.owner.deadlineAt) return { eligible: true };
		const remainingBackoffMs = Math.max(0, (entry.availableAt ?? 0) - now);
		return remainingBackoffMs > 0 ? {
			eligible: false,
			remainingBackoffMs
		} : { eligible: true };
	}
	return isDeliveryRecoveryRetryEligible(entry, now);
}
async function processPendingSessionDelivery(opts) {
	const { entry, context } = opts;
	const pendingSettlementOutcome = resolvePendingSettlementOutcome(entry);
	if (pendingSettlementOutcome) return {
		status: pendingSettlementOutcome,
		finalized: await finalizeSessionDeliverySettlement({
			...context,
			entry,
			outcome: pendingSettlementOutcome
		})
	};
	const maxRetries = entry.maxRetries ?? MAX_SESSION_DELIVERY_RETRIES;
	if (!(entry.kind === "agentTurn" && entry.deliveryStartedAt !== void 0 && entry.retryCount === maxRetries) && entry.retryCount >= maxRetries) {
		await markSessionDeliverySettlement(entry, "moved-to-failed", context.queueContext);
		return {
			status: "max-retries",
			finalized: await finalizeSessionDeliverySettlement({
				...context,
				entry,
				outcome: "moved-to-failed"
			})
		};
	}
	if (!opts.bypassBackoff) {
		const retryEligibility = resolveSessionRetryEligibility(entry, (context.now ?? Date.now)());
		if (!retryEligibility.eligible) return {
			status: "backoff",
			remainingMs: retryEligibility.remainingBackoffMs
		};
	}
	if (await opts.beforeDelivery?.() === "stop") return { status: "stop" };
	let result;
	try {
		context.queueContext.admission.assertCurrent();
		await context.deliver(entry, { queueContext: context.queueContext });
		await markSessionDeliverySettlement(entry, "recovered", context.queueContext);
		result = "recovered";
	} catch (err) {
		if (err instanceof SessionDeliveryDeadLetteredError) {
			try {
				await markSessionDeliverySettlement(entry, "moved-to-failed", context.queueContext);
			} catch (markError) {
				if (markError instanceof SessionDeliveryAcknowledgementFinalizeError) return { status: "deferred" };
				throw markError;
			}
			result = "moved-to-failed";
		} else if (err instanceof SessionDeliveryDeferredError || err instanceof SessionDeliveryAcknowledgementFinalizeError || err instanceof SessionDeliveryAttemptStartError) return { status: "deferred" };
		else {
			const errMsg = formatErrorMessage(err);
			opts.onFailed?.(entry, errMsg);
			if (err instanceof SessionDeliveryRetryChargedError) return { status: "failed" };
			try {
				await failSessionDelivery(entry.id, errMsg, context.queueContext, { releaseAttemptOwnership: err instanceof SessionDeliverySafeRetryError });
			} catch (failErr) {
				if (getErrnoCode(failErr) === "ENOENT") return { status: "already-gone" };
				throw failErr;
			}
			return { status: "failed" };
		}
	}
	const finalized = await finalizeSessionDeliverySettlement({
		...context,
		entry,
		outcome: result
	});
	return {
		status: result,
		finalized
	};
}
async function processDrainedSessionDelivery(entry, context, bypassBackoff) {
	const result = await processPendingSessionDelivery({
		entry,
		context,
		bypassBackoff,
		onFailed: (failedEntry, errMsg) => {
			context.log.warn(`${context.logLabel}: retry failed for entry ${failedEntry.id}: ${errMsg}`);
		}
	});
	if (result.status === "max-retries" && result.finalized) context.log.warn(`${context.logLabel}: entry ${entry.id} exceeded max retries and was moved to failed`);
	else if (result.status === "backoff") context.log.info(`${context.logLabel}: entry ${entry.id} not ready for retry yet — backoff ${result.remainingMs}ms remaining`);
	return result;
}
/** Drain one exact queued session delivery and return its final pending state. */
async function drainPendingSessionDelivery(opts) {
	const claim = await recoveryCoordinator.withClaim(opts.id, async () => {
		const entry = await loadPendingSessionDelivery(opts.id, opts.queueContext);
		if (!entry) return null;
		const result = await processDrainedSessionDelivery(entry, opts, opts.bypassBackoff);
		if (result.status === "already-gone" || "finalized" in result && result.finalized) return null;
		return result.status === "backoff" ? entry : loadPendingSessionDelivery(opts.id, opts.queueContext);
	});
	if (claim.status === "claimed-by-other-owner") {
		opts.log.info(`${opts.logLabel}: entry ${opts.id} is already being recovered`);
		return loadPendingSessionDelivery(opts.id, opts.queueContext);
	}
	return claim.value;
}
/** Replay pending session deliveries until the recovery budget is exhausted. */
async function recoverPendingSessionDeliveries(opts) {
	const pending = (await loadPendingSessionDeliveries(opts.queueContext)).filter((entry) => opts.maxEnqueuedAt == null || entry.enqueuedAt <= opts.maxEnqueuedAt);
	if (pending.length === 0) return createEmptyDeliveryRecoverySummary();
	const summary = createEmptyDeliveryRecoverySummary();
	const deadline = resolveDeliveryRecoveryDeadlineMs(opts.maxRecoveryMs);
	const onDeadlineExceeded = () => {
		opts.log.warn("Session delivery recovery time budget exceeded — remaining entries deferred");
	};
	const context = {
		...opts,
		logLabel: "Session delivery"
	};
	const beforeDelivery = async () => {
		if (await recoveryCoordinator.waitForReplay(deadline) === "deadline-exceeded") {
			onDeadlineExceeded();
			return "stop";
		}
		return "continue";
	};
	const onFailed = (_failedEntry, errMsg) => {
		summary.failed += 1;
		opts.log.warn(`Session delivery retry failed: ${errMsg}`);
	};
	await recoveryCoordinator.scan({
		entries: pending,
		loadEntry: (id) => loadPendingSessionDelivery(id, opts.queueContext),
		deadlineMs: deadline,
		onDeadlineExceeded,
		onEntry: async (currentEntry) => {
			if (opts.maxEnqueuedAt != null && currentEntry.enqueuedAt > opts.maxEnqueuedAt) return "continue";
			const result = await processPendingSessionDelivery({
				entry: currentEntry,
				context,
				beforeDelivery,
				onFailed
			});
			if (result.status === "max-retries") {
				summary.skippedMaxRetries += 1;
				return "continue";
			}
			if (result.status === "backoff") {
				summary.deferredBackoff += 1;
				return "continue";
			}
			if (result.status === "stop") return "stop";
			if (result.status === "recovered" && result.finalized) {
				summary.recovered += 1;
				opts.log.info(`Recovered session delivery ${currentEntry.id}`);
			}
			return "continue";
		}
	});
	return summary;
}
//#endregion
//#region src/infra/session-delivery-queue-runtime.ts
const RUNTIME_RELOAD_RETRY_MS = 1e3;
let runtime;
let runtimeGeneration = 0;
function armPendingScan(generation) {
	if (!runtime || generation !== runtimeGeneration) return;
	runtime.scheduler.schedule({
		id: "session-delivery:scan",
		delayMs: RUNTIME_RELOAD_RETRY_MS,
		mode: "earliest",
		run: () => schedulePendingSessionDeliveries()
	});
}
function resolveRetryDelayMs(entry, now) {
	const claimDelayMs = Math.max(0, (entry.availableAt ?? 0) - now);
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") return Math.min(claimDelayMs, Math.max(0, entry.owner.deadlineAt - now));
	if (entry.retryCount <= 0) return claimDelayMs;
	const attemptedAt = entry.lastAttemptAt ?? entry.enqueuedAt;
	return Math.max(claimDelayMs, attemptedAt + computeBackoffMs(entry.retryCount) - now);
}
function armSessionDeliveryId(id, delayMs, generation) {
	if (!runtime || generation !== runtimeGeneration) return;
	runtime.scheduler.schedule({
		id: `session-delivery:${id}`,
		delayMs,
		mode: "earliest",
		run: () => runScheduledSessionDelivery(id, generation)
	});
}
function armSessionDelivery(entry, generation, minimumDelayMs = 0) {
	if (!runtime || runtime.runningEntries.has(entry.id)) return;
	armSessionDeliveryId(entry.id, Math.max(minimumDelayMs, resolveRetryDelayMs(entry, runtime.scheduler.now())), generation);
}
async function runScheduledSessionDelivery(id, generation) {
	const activeRuntime = runtime;
	if (!activeRuntime || generation !== runtimeGeneration) return;
	if (activeRuntime.runningEntries.has(id)) return;
	activeRuntime.runningEntries.add(id);
	let pending = null;
	try {
		pending = await (activeRuntime.drain ?? drainPendingSessionDelivery)({
			id,
			queueContext: activeRuntime.queueContext,
			now: () => activeRuntime.scheduler.now(),
			logLabel: "session delivery",
			log: activeRuntime.log,
			deliver: activeRuntime.deliver,
			onSettled: activeRuntime.onSettled
		});
	} catch (error) {
		activeRuntime.log.error(`session delivery: runtime drain failed for ${id}: ${String(error)}`);
		if (runtime && generation === runtimeGeneration) armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
	} finally {
		activeRuntime.runningEntries.delete(id);
	}
	if (!runtime || generation !== runtimeGeneration) return;
	if (pending) armSessionDelivery(pending, generation, RUNTIME_RELOAD_RETRY_MS);
}
/** Register callbacks; stop fences scheduling and joins admitted reads and drains. */
function startSessionDeliveryRuntime(params) {
	runtimeGeneration += 1;
	const generation = runtimeGeneration;
	runtime?.scheduler.beginClose();
	const activeRuntime = {
		...params,
		scheduler: params.scheduler.scope(),
		runningEntries: /* @__PURE__ */ new Set(),
		pendingSchedules: /* @__PURE__ */ new Set()
	};
	runtime = activeRuntime;
	let stopPromise;
	return () => {
		if (runtimeGeneration === generation) {
			runtimeGeneration += 1;
			runtime = void 0;
		}
		stopPromise ??= Promise.all([activeRuntime.scheduler.stop(), ...activeRuntime.pendingSchedules]).then(() => {});
		return stopPromise;
	};
}
/** Schedule one durable entry when a gateway runtime is available. */
async function scheduleSessionDelivery(id, queueContext) {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return false;
	try {
		queueContext.admission.assertCurrent();
		activeRuntime.queueContext.admission.assertCurrent();
		if (queueContext.admission.identity.key !== activeRuntime.queueContext.admission.identity.key) {
			activeRuntime.log.error(`session delivery: ${id} belongs to another state database`);
			return false;
		}
	} catch (error) {
		activeRuntime.log.error(`session delivery: cannot schedule ${id} for a retired state owner: ${String(error)}`);
		return false;
	}
	const settled = createDeferredCore();
	activeRuntime.pendingSchedules.add(settled.promise);
	try {
		let entry;
		try {
			entry = await (activeRuntime.reloadPending ?? loadPendingSessionDelivery)(id, activeRuntime.queueContext);
		} catch (error) {
			activeRuntime.log.error(`session delivery: failed to load ${id}: ${String(error)}`);
			armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
			return true;
		}
		if (!entry || !runtime || generation !== runtimeGeneration) return !entry;
		armSessionDelivery(entry, generation);
		return true;
	} finally {
		activeRuntime.pendingSchedules.delete(settled.promise);
		settled.resolve();
	}
}
/** Schedule every pending entry after startup recovery installs the runtime owner. */
async function schedulePendingSessionDeliveries() {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return;
	const settled = createDeferredCore();
	activeRuntime.pendingSchedules.add(settled.promise);
	try {
		let entries;
		try {
			entries = await (activeRuntime.listPending ?? loadPendingSessionDeliveries)(activeRuntime.queueContext);
		} catch (error) {
			activeRuntime.log.error(`session delivery: failed to scan pending entries: ${String(error)}`);
			armPendingScan(generation);
			return;
		}
		if (!runtime || generation !== runtimeGeneration) return;
		for (const entry of entries) armSessionDelivery(entry, generation);
	} finally {
		activeRuntime.pendingSchedules.delete(settled.promise);
		settled.resolve();
	}
}
//#endregion
//#region src/agents/subagents/completion/subagent-completion-admission.store.ts
const log = createSubsystemLogger("subagents/completion");
var SubagentCompletionSourceChangedError = class extends SubagentRegistryMutationRejectedError {};
function parseNativeRow(row) {
	if (!isRecord(row) || typeof row.run_id !== "string" || typeof row.child_session_key !== "string" || typeof row.requester_session_key !== "string" || typeof row.created_at !== "number" || typeof row.payload_json !== "string" || row.controller_session_key !== null && typeof row.controller_session_key !== "string" || row.requester_store_path !== null && typeof row.requester_store_path !== "string" || row.controller_store_path !== null && typeof row.controller_store_path !== "string") throw new Error("Subagent completion acknowledgment has an invalid native record");
	return {
		run_id: row.run_id,
		child_session_key: row.child_session_key,
		requester_session_key: row.requester_session_key,
		controller_session_key: row.controller_session_key,
		requester_store_path: row.requester_store_path,
		controller_store_path: row.controller_store_path,
		created_at: row.created_at,
		payload_json: row.payload_json
	};
}
function parseVersionConflict(value, writeId) {
	if (isRecord(value) && value.writeId === writeId && Array.isArray(value.conflictRunIds) && value.conflictRunIds.every((id) => typeof id === "string")) throw new SubagentRegistryVersionConflictError(value.conflictRunIds);
}
function parseAdmissionReceipt(value, writeId, runId) {
	parseVersionConflict(value, writeId);
	if (!isRecord(value) || value.writeId !== writeId || typeof value.claimed !== "boolean" || typeof value.status !== "string") throw new Error("Subagent completion acknowledgment does not identify its write");
	const row = parseNativeRow(value.row);
	if (row.run_id !== runId) throw new Error("Subagent completion acknowledged another native owner");
	return {
		writeId,
		claimed: value.claimed,
		status: value.status,
		row
	};
}
function parseMutationReceipt(value, writeId, runIds) {
	parseVersionConflict(value, writeId);
	if (!isRecord(value) || value.writeId !== writeId || typeof value.applied !== "boolean" && value.applied !== null || !Array.isArray(value.records) || !Array.isArray(value.retiredRunIds) || !Array.isArray(value.queueIds) || !value.retiredRunIds.every((id) => typeof id === "string" && runIds.includes(id)) || !value.queueIds.every((id) => typeof id === "string")) throw new Error("Subagent completion mutation acknowledgment does not identify its write");
	const queueIds = value.queueIds;
	const queueReceipts = (Array.isArray(value.queueReceipts) ? value.queueReceipts : []).map((receipt) => {
		if (!isRecord(receipt) || typeof receipt.id !== "string" || !queueIds.includes(receipt.id)) throw new Error("Subagent completion acknowledged another queue intent");
		if (receipt.status === "completed" || receipt.status === "failed") return {
			id: receipt.id,
			status: receipt.status
		};
		if (receipt.status !== "pending" || typeof receipt.enqueuedAt !== "number" || !Number.isFinite(receipt.enqueuedAt) || typeof receipt.payloadJson !== "string") throw new Error("Subagent completion acknowledged an invalid pending queue intent");
		return {
			id: receipt.id,
			status: "pending",
			enqueuedAt: receipt.enqueuedAt,
			payloadJson: receipt.payloadJson
		};
	});
	if (queueReceipts.length !== value.queueIds.length || new Set(queueReceipts.map(({ id }) => id)).size !== queueReceipts.length) throw new Error("Subagent completion acknowledged incomplete queue intents");
	const records = value.records.map((record) => {
		if (!isRecord(record) || record.cleanupHandled !== void 0 && typeof record.cleanupHandled !== "boolean") throw new Error("Subagent completion acknowledgment has invalid publication facts");
		const row = parseNativeRow(record.row);
		if (!runIds.includes(row.run_id)) throw new Error("Subagent completion acknowledged another native owner");
		return {
			row,
			cleanupHandled: record.cleanupHandled
		};
	});
	return {
		writeId,
		applied: value.applied,
		records,
		retiredRunIds: value.retiredRunIds,
		queueIds: value.queueIds,
		...queueReceipts.length > 0 ? { queueReceipts } : {}
	};
}
function hasNewerGeneration(current) {
	return [...getSubagentRunsForChildSession(current.childSessionKey, current.childAgentId)].some((candidate) => compareSubagentRunGeneration(candidate, current) > 0);
}
function decodeAcknowledgedRow(row) {
	const record = rowToSubagentRunRecord(row);
	if (!record) throw new SubagentRegistryCommitReceiptError(/* @__PURE__ */ new Error("Subagent completion acknowledged an undecodable native record"));
	return record;
}
async function executeCompletionCommand(context, command, assertCurrent, parse) {
	let admission;
	let commitGranted = false;
	try {
		return await runOpenClawStateWorkerOperation(context, async (scope) => parse(await scope.execute(command)), {
			assertCurrent,
			createAdmission: () => {
				let phase = "waiting";
				admission = createSqliteWorkerOperationAdmission((request, grant) => {
					if (request.facts !== command.input.writeId || !(phase === "waiting" && request.stage === "transaction" || phase === "transaction" && request.stage === "commit")) throw new Error("Subagent completion write authority requested out of order");
					assertCurrent();
					if (!grant()) throw new Error("Subagent completion write authority expired");
					phase = request.stage === "transaction" ? "transaction" : "commit";
					commitGranted = phase === "commit";
				});
				return {
					admission,
					nativeLocations: [context.admission.databasePath, context.admission.identity.canonicalPath]
				};
			}
		});
	} catch (error) {
		const committed = admission?.committed;
		if (!committed) {
			if (error instanceof SubagentRegistryVersionConflictError || error instanceof SubagentRegistryWriteError) throw error;
			throw new SubagentRegistryWriteError(commitGranted || hasSqliteWorkerOutcomeUnknown(error) ? "unknown" : "not-committed", error);
		}
		try {
			return parse(committed.facts);
		} catch (receiptError) {
			throw new SubagentRegistryCommitReceiptError(receiptError);
		}
	}
}
async function admitSubagentCompletionDelivery(params) {
	const expected = subagentRuns.get(params.runId);
	if (!expected) throw new SubagentCompletionSourceChangedError("Subagent completion owner is unavailable");
	return mutateSubagentRuns([params.runId], (rows) => {
		const current = currentCompletionOwner(rows, expected);
		if (hasNewerGeneration(current)) throw new SubagentCompletionSourceChangedError("Subagent completion source was replaced");
		const prepared = params.plan(current);
		return {
			value: {
				id: prepared.queueEntry.id,
				claimed: false,
				status: "pending",
				subagent: current
			},
			expected: current,
			...prepared
		};
	}, {
		context: params.context,
		assertCurrent() {
			params.assertCurrent();
			if (!isSameSubagentRunOwner(subagentRuns.get(expected.runId), expected)) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed before admission");
		},
		async commit(planned, versions, authority) {
			const input = structuredClone({
				writeId: randomUUID(),
				expected: planned.expected,
				subagent: planned.subagent,
				queueEntry: planned.queueEntry,
				versions: [...versions].map(([runId, version]) => ({
					runId,
					version
				}))
			});
			const receipt = await executeCompletionCommand(params.context, {
				type: "sessionDelivery.admitSubagentCompletion",
				input
			}, authority.assertCurrent, (value) => parseAdmissionReceipt(value, input.writeId, params.runId));
			const subagent = decodeAcknowledgedRow(receipt.row);
			subagent.cleanupHandled = planned.expected.cleanupHandled;
			return {
				value: {
					id: planned.queueEntry.id,
					claimed: receipt.claimed,
					status: receipt.status,
					subagent
				},
				postimages: /* @__PURE__ */ new Map([[params.runId, subagent]]),
				versions: /* @__PURE__ */ new Map([[params.runId, subagentRunRowVersion(receipt.row)]])
			};
		}
	});
}
function currentCompletionOwner(rows, expected) {
	const current = rows.get(expected.runId);
	if (!current || !isSameSubagentRunOwner(current, expected) || !isDeepStrictEqual(captureRequesterSettleRunIdentity(current), captureRequesterSettleRunIdentity(expected)) || current.execution.lifecycleGeneration !== expected.execution.lifecycleGeneration || !isDeepStrictEqual(current.childSessionIdentity, expected.childSessionIdentity) || !isDeepStrictEqual(current.killIntent, expected.killIntent) || current.killReconciliation?.killedAt !== expected.killReconciliation?.killedAt || Boolean(current.killReconciliation?.taskCancellationAccepted) !== Boolean(expected.killReconciliation?.taskCancellationAccepted) || Boolean(current.killReconciliation?.suppressTaskDelivery) !== Boolean(expected.killReconciliation?.suppressTaskDelivery) || current.killReconciliation?.supersededAt !== expected.killReconciliation?.supersededAt || current.endedReason === "subagent-killed" !== (expected.endedReason === "subagent-killed") || current.terminalOwner !== expected.terminalOwner || current.suppressAnnounceReason !== expected.suppressAnnounceReason) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed before mutation");
	return current;
}
async function mutateCompletion(entries, plan, options = {}) {
	const runIds = entries.map((entry) => entry.runId);
	const context = options.context ?? captureOpenClawStateWorkerContext({
		path: options.databaseOptions?.database?.path ?? options.databaseOptions?.path,
		env: options.databaseOptions?.env
	});
	const result = await mutateSubagentRuns(runIds, (rows) => {
		return {
			value: {
				applied: null,
				queueIds: []
			},
			mutation: plan(rows)
		};
	}, {
		context,
		assertCurrent() {
			options.assertCurrent?.();
			for (const expected of entries) {
				const current = subagentRuns.get(expected.runId);
				if (current && !isSameSubagentRunOwner(current, expected)) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed before mutation");
			}
		},
		onPublished(_postimages, value) {
			if (value.receiptRetentionFailure) throw value.receiptRetentionFailure.error;
			options.onPublished?.();
		},
		async commit(planned, versions, authority) {
			const input = structuredClone({
				writeId: randomUUID(),
				mutation: planned.mutation,
				versions: [...versions].map(([runId, version]) => ({
					runId,
					version
				}))
			});
			const receipt = await executeCompletionCommand(context, {
				type: "sessionDelivery.mutateSubagentCompletion",
				input
			}, authority.assertCurrent, (value) => parseMutationReceipt(value, input.writeId, runIds));
			const postimages = /* @__PURE__ */ new Map();
			for (const runId of receipt.retiredRunIds) postimages.set(runId, null);
			for (const native of receipt.records) {
				const record = decodeAcknowledgedRow(native.row);
				record.cleanupHandled = native.cleanupHandled;
				postimages.set(record.runId, record);
			}
			if (receipt.applied === true && postimages.size !== runIds.length) throw new SubagentRegistryCommitReceiptError(/* @__PURE__ */ new Error("Subagent completion acknowledged an incomplete native publication"));
			let receiptRetentionFailure;
			try {
				options.onCommitted?.(receipt, planned.mutation);
			} catch (error) {
				receiptRetentionFailure = { error };
			}
			return {
				value: {
					applied: receipt.applied,
					queueIds: receipt.queueIds,
					receiptRetentionFailure
				},
				postimages,
				versions: new Map([...receipt.records.map(({ row }) => [row.run_id, subagentRunRowVersion(row)]), ...receipt.retiredRunIds.map((runId) => [runId, null])])
			};
		}
	});
	for (const id of result.queueIds) try {
		await scheduleSessionDelivery(id, context);
	} catch (error) {
		log.warn("Subagent completion remains queued after scheduling failed", {
			queueId: id,
			error
		});
	}
	return {
		applied: result.applied,
		publication: result.applied === true ? "published" : "unchanged"
	};
}
async function settleSubagentCompletionDelivery(params) {
	await mutateCompletion([params.subagent], (rows) => {
		const current = currentCompletionOwner(rows, params.subagent);
		if (current.delivery?.generation !== params.subagent.delivery?.generation) throw new SubagentCompletionSourceChangedError("Subagent completion delivery generation changed");
		const subagent = structuredClone(current);
		const delivery = ensureDeliveryState(subagent);
		if (delivery.status !== "delivered" || delivery.queueId !== void 0) {
			const now = Date.now();
			Object.assign(delivery, {
				status: "delivered",
				disposition: "delivered",
				deliveredAt: now,
				announcedAt: now,
				lastError: void 0,
				nextAttemptAt: void 0,
				queueId: void 0,
				payload: void 0
			});
		}
		return {
			kind: "settle",
			queueId: params.queueId,
			expected: current,
			subagent
		};
	}, params);
}
async function blockSubagentCompletionDelivery(params) {
	const { context: _context, databaseOptions: _databaseOptions, assertCurrent: _assertCurrent, ...request } = params;
	if (params.storeReplaced) {
		const current = currentCompletionOwner(subagentRuns, params.subagent);
		subagentRuns.retireCompletionAuthority(current);
	}
	return (await mutateCompletion([params.subagent], (rows) => {
		const current = currentCompletionOwner(rows, params.subagent);
		if ((current.delivery?.generation ?? 1) !== (params.subagent.delivery?.generation ?? 1)) throw new SubagentCompletionSourceChangedError("Subagent completion delivery generation changed");
		return {
			kind: "block",
			params: {
				...request,
				subagent: current
			},
			now: Date.now()
		};
	}, params)).applied === true;
}
async function reconcileRetiredSubagentCancellation(expected, now) {
	const endedAt = retiredCancellationEndedAt(expected, now);
	if (endedAt === void 0 || !expected.killReconciliation) return;
	try {
		return (await mutateCompletion([expected], (rows) => {
			const current = currentCompletionOwner(rows, expected);
			if (retiredCancellationEndedAt(current, now) !== endedAt || hasNewerGeneration(current)) throw new SubagentCompletionSourceChangedError("Subagent completion source was replaced");
			return {
				kind: "reconcileCancelled",
				expected: current,
				now
			};
		})).applied ?? void 0;
	} catch (error) {
		if (error instanceof SubagentCompletionSourceChangedError) return false;
		throw error;
	}
}
function currentRequesterEntries(rows, entries, committed) {
	return entries.map((expected) => {
		if (!rows.has(expected.runId) && committed?.result.retiredRunIds.includes(expected.runId)) return { subagent: expected };
		const current = currentCompletionOwner(rows, expected);
		if (!committed && (current.delivery?.generation !== expected.delivery?.generation || !isDeepStrictEqual(captureRequesterSettleWakeProgress(current), captureRequesterSettleWakeProgress(expected)))) throw new SubagentCompletionSourceChangedError("Subagent requester wake cohort changed before mutation");
		return { subagent: current };
	});
}
/** The wake episode retains this receipt until its current host owner can adopt it. */
async function mutateRequesterBatch(members, operation, options) {
	return mutateCompletion(members, (rows) => {
		const mutation = {
			...operation,
			entries: currentRequesterEntries(rows, members, options.committed),
			committed: options.committed
		};
		return mutation.kind === "requesterBatch" ? {
			...mutation,
			now: Date.now()
		} : mutation;
	}, {
		...options,
		onCommitted(result, mutation) {
			if (!options.committed && (mutation.kind === "requesterBatch" || mutation.kind === "requesterWake")) options.onCommitted?.({
				entries: mutation.entries,
				result
			});
		}
	});
}
async function settleRequesterCompletionBatch(params) {
	return mutateRequesterBatch(params.entries.map(({ subagent }) => subagent), {
		kind: "requesterBatch",
		outcome: params.outcome
	}, {
		...params,
		assertCurrent: () => {
			if (!params.isCurrent()) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed before settlement");
		}
	});
}
async function mutateRequesterSettleWakeBatch(params) {
	return mutateRequesterBatch(params.entries, {
		kind: "requesterWake",
		operation: params.operation
	}, params);
}
//#endregion
//#region src/agents/subagents/subagent-attachment-cleanup.ts
/** Removes host-owned subagent attachment artifacts by generated identity. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function removeSubagentAttachmentTree(rootDir, attachmentId, assertBeforeMutation) {
	if (!UUID_RE.test(attachmentId)) throw new Error("invalid subagent attachment identity");
	assertBeforeMutation?.();
	try {
		await (await root(rootDir)).remove(attachmentId, {
			recursive: true,
			force: true,
			...assertBeforeMutation ? { assertBeforeMutation } : {}
		});
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
	}
}
async function cleanupMaterializedSubagentAttachments(params) {
	const rootDir = resolveSubagentSessionAttachmentRootDir({
		agentId: resolveAgentIdFromSessionKey(params.childSessionKey),
		childSessionKey: params.childSessionKey
	});
	const isCurrent = params.isCurrent;
	await removeSubagentAttachmentTree(rootDir, params.attachmentId, isCurrent ? () => {
		if (!isCurrent()) throw new Error("subagent attachment cleanup owner is no longer current");
	} : void 0);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-helpers.ts
const PROVISIONAL_KILL_RECONCILIATION_MS = 3e5;
const MIN_ANNOUNCE_RETRY_DELAY_MS = 15e3;
const MAX_ANNOUNCE_RETRY_DELAY_MS = 3e5;
const ANNOUNCE_RETRY_JITTER = .2;
const ANNOUNCE_EXPIRY_MS = 3e5;
const ANNOUNCE_COMPLETION_HARD_EXPIRY_MS = 18e5;
const ANNOUNCE_RETRY_BACKOFF = {
	initialMs: MIN_ANNOUNCE_RETRY_DELAY_MS,
	maxMs: MAX_ANNOUNCE_RETRY_DELAY_MS,
	factor: 2,
	jitter: ANNOUNCE_RETRY_JITTER
};
const FROZEN_RESULT_TEXT_MAX_BYTES = 102400;
function capFrozenResultText(resultText) {
	const trimmed = resultText.trim();
	const totalBytes = Buffer.byteLength(trimmed, "utf8");
	if (totalBytes <= FROZEN_RESULT_TEXT_MAX_BYTES) return trimmed;
	const notice = `\n\n[truncated: frozen completion output exceeded ${Math.round(FROZEN_RESULT_TEXT_MAX_BYTES / 1024)}KB (${Math.round(totalBytes / 1024)}KB)]`;
	const maxPayloadBytes = Math.max(0, FROZEN_RESULT_TEXT_MAX_BYTES - Buffer.byteLength(notice, "utf8"));
	return `${truncateUtf8Prefix(trimmed, maxPayloadBytes)}${notice}`;
}
function resolveAnnounceRetryDelayMs(retryCount) {
	return computeBackoff(ANNOUNCE_RETRY_BACKOFF, Math.max(1, retryCount));
}
function formatAnnounceGiveUpLogField(value) {
	const normalized = value.replace(/\s+/g, " ").trim();
	return JSON.stringify(normalized.length > 2e3 ? `${truncateUtf16Safe(normalized, 2e3)}…` : normalized);
}
function logAnnounceGiveUp(entry, reason) {
	const retryCount = entry.delivery?.attemptCount ?? 0;
	const endedAt = entry.execution.endedAt;
	const endedAgoMs = typeof endedAt === "number" ? Math.max(0, Date.now() - endedAt) : void 0;
	const endedAgoLabel = endedAgoMs != null ? `${Math.round(endedAgoMs / 1e3)}s` : "n/a";
	const lastDeliveryError = getDeliveryLastError(entry);
	const deliveryError = lastDeliveryError ? ` deliveryError=${formatAnnounceGiveUpLogField(lastDeliveryError)}` : "";
	defaultRuntime.log(`[warn] Subagent announce give up (${reason}) run=${entry.runId} child=${entry.childSessionKey} requester=${entry.requesterSessionKey} retries=${retryCount} endedAgo=${endedAgoLabel}${deliveryError}`);
}
async function persistSubagentSessionTiming(entry, options) {
	const childSessionKey = entry.childSessionKey?.trim();
	if (!childSessionKey || options?.isCurrentGeneration?.() === false) return;
	const cfg = getRuntimeConfig();
	const agentId = resolveAgentIdFromSessionKey(childSessionKey);
	const storePath = options?.sessionEntryCurrent?.source.path ?? options?.session?.storePath ?? options?.settledQueuedCancellation?.storePath ?? resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const refused = /* @__PURE__ */ new Error("Subagent timing owner changed before commit");
	const assertGenerationCurrent = () => {
		if (options?.isCurrentGeneration?.() === false) throw refused;
		options?.assertCommitAllowed?.();
	};
	const startedAt = getSubagentSessionStartedAt(entry);
	const endedAt = asFiniteNumber(entry.execution.endedAt);
	const runtimeMs = getSubagentSessionRuntimeMs(entry, endedAt);
	const status = resolveSubagentSessionStatus(entry);
	const lastRunError = status ? resolveSessionRunError(entry.execution.outcome ?? {}, status) : void 0;
	const update = (sessionEntry) => {
		const settled = options?.settledQueuedCancellation;
		if (settled && (entry.collect !== true || entry.execution.status !== "terminal" || entry.execution.startedAt !== void 0 || sessionEntry.startedAt !== void 0 || entry.endedReason !== "subagent-killed" || !entry.killReconciliation || storePath !== settled.storePath || sessionEntry.sessionId !== settled.sessionId || sessionEntry.lifecycleRevision !== settled.lifecycleRevision || sessionEntry.activeWriterRunId !== void 0 || sessionEntry.lifecycleRunId !== void 0 || sessionEntry.lastRunId !== void 0 && sessionEntry.lastRunId !== (entry.swarmRunId ?? entry.runId))) return null;
		if (status === "killed") {
			const existingCompletion = resolveCompletionFromSessionEntry(sessionEntry, Date.now(), { notBeforeMs: entry.execution.startedAt ?? entry.createdAt });
			if (existingCompletion && existingCompletion.reason !== "subagent-killed") {
				if (sessionEntry.abortedLastRun !== true) return null;
				const completedEntry = { ...sessionEntry };
				delete completedEntry.abortedLastRun;
				return completedEntry;
			}
		}
		const next = { ...sessionEntry };
		if (settled) next.lastRunId = entry.swarmRunId ?? entry.runId;
		for (const [key, value] of [
			["startedAt", startedAt],
			["endedAt", endedAt],
			["runtimeMs", runtimeMs]
		]) if (typeof value === "number" && Number.isFinite(value)) next[key] = value;
		else delete next[key];
		if (status) next.status = status;
		else delete next.status;
		if (lastRunError) next.lastRunError = lastRunError;
		else if (status === "done" || status === "interrupted") delete next.lastRunError;
		if (status && status !== "killed") delete next.abortedLastRun;
		return next;
	};
	const persist = async (expected, assertSessionCurrent) => {
		let selected;
		let suppressed = false;
		const assertCurrent = () => {
			assertGenerationCurrent();
			assertSessionCurrent?.();
			if (selected) try {
				if (options?.sessionEntryCurrent) options.sessionEntryCurrent.assertCurrent(selected);
				else options?.assertCurrentEntry?.(selected);
			} catch (error) {
				suppressed = true;
				throw error;
			}
		};
		const persisted = await applySessionEntryExactReplacements({
			agentId,
			storePath,
			sessionKeys: [childSessionKey],
			activeSessionKey: childSessionKey,
			requireWriteSuccess: true,
			skipMaintenance: true,
			assertCommitAllowed: assertCurrent,
			update: ([row]) => {
				if (!row || options?.isCurrentGeneration?.() === false || expected && (row.entry.sessionId !== expected.sessionId || row.entry.lifecycleRevision !== expected.lifecycleRevision)) return { result: void 0 };
				selected = row.entry;
				assertCurrent();
				const next = update(selected);
				return {
					result: next ?? selected,
					...next ? { replacements: [{
						sessionKey: row.sessionKey,
						entry: next
					}] } : {}
				};
			}
		}).catch((error) => {
			if (hasSqliteWorkerOutcomeUnknown(error) || !suppressed) throw error;
		});
		if (persisted && lastRunError) await recordGatewaySessionRunFailure({
			target: {
				agentId,
				storePath,
				sessionKey: childSessionKey,
				sessionId: persisted.sessionId,
				expectedLifecycleRevision: persisted.lifecycleRevision
			},
			runId: entry.runId,
			error: entry.execution.outcome?.error,
			assertCommitAllowed: assertCurrent,
			sessionEntryCurrent: options?.sessionEntryCurrent
		});
	};
	try {
		if (options?.session) {
			options.session.assertCurrent();
			if (options.session.entry) await persist(options.session.entry, options.session.assertCurrent);
			return;
		}
		if (options?.sessionEntryCurrent) {
			await persist(void 0);
			return;
		}
		await withSessionEntryReadOnlyInWorker({
			storePath,
			sessionKey: childSessionKey,
			agentId
		}, assertGenerationCurrent, async (read, owner) => {
			if (!read.ok) throw read.error;
			if (read.value) await persist(read.value, owner.assertCurrent);
		});
	} catch (error) {
		if (error !== refused) throw error;
	}
}
/** Kept sessions may retain their attachments; every other cleanup removes them with the run. */
function shouldRemoveSubagentAttachments(entry, cleanup = entry.cleanup) {
	return cleanup === "delete" || !entry.retainAttachmentsOnKeep;
}
async function safeRemoveAttachmentsDir(entry, isCurrent) {
	if (!entry.attachmentId) return true;
	try {
		await cleanupMaterializedSubagentAttachments({
			childSessionKey: entry.childSessionKey,
			attachmentId: entry.attachmentId,
			isCurrent
		});
		return true;
	} catch {
		return false;
	}
}
function resolveArchiveAfterMs(cfg) {
	const minutes = (cfg ?? getRuntimeConfig()).agents?.defaults?.subagents?.archiveAfterMinutes ?? 60;
	if (!Number.isFinite(minutes) || minutes <= 0) return;
	return Math.max(1, Math.floor(minutes)) * 6e4;
}
/** Arms retention only after the run or its waitable collector result has completed. */
function updateSubagentArchiveAtMs(entry, cfg) {
	const endedAt = asFiniteNumber(entry.execution.endedAt);
	const completedAt = entry.collect ? endedAt === void 0 && !entry.collectorCompletion ? void 0 : typeof entry.completion?.capturedAt === "number" && Number.isFinite(entry.completion.capturedAt) ? entry.completion.capturedAt : endedAt : entry.cleanup === "delete" && entry.pauseReason !== "sessions_yield" ? entry.delivery?.discardReason === "task-missing" ? entry.delivery.discardedAt ?? endedAt : endedAt : void 0;
	const archiveAfterMs = entry.spawnMode === "session" || completedAt === void 0 ? void 0 : resolveArchiveAfterMs(cfg);
	const expectedArchiveAt = completedAt !== void 0 && archiveAfterMs !== void 0 ? completedAt + archiveAfterMs : void 0;
	if (entry.archiveAtMs === expectedArchiveAt) return false;
	if (expectedArchiveAt === void 0) delete entry.archiveAtMs;
	else entry.archiveAtMs = expectedArchiveAt;
	return true;
}
//#endregion
export { startSessionDeliveryRuntime as C, scheduleSessionDelivery as S, recoverPendingSessionDeliveries as T, mutateRequesterSettleWakeBatch as _, capFrozenResultText as a, settleSubagentCompletionDelivery as b, resolveAnnounceRetryDelayMs as c, updateSubagentArchiveAtMs as d, cleanupMaterializedSubagentAttachments as f, blockSubagentCompletionDelivery as g, admitSubagentCompletionDelivery as h, PROVISIONAL_KILL_RECONCILIATION_MS as i, safeRemoveAttachmentsDir as l, SubagentCompletionSourceChangedError as m, ANNOUNCE_EXPIRY_MS as n, logAnnounceGiveUp as o, removeSubagentAttachmentTree as p, MIN_ANNOUNCE_RETRY_DELAY_MS as r, persistSubagentSessionTiming as s, ANNOUNCE_COMPLETION_HARD_EXPIRY_MS as t, shouldRemoveSubagentAttachments as u, reconcileRetiredSubagentCancellation as v, drainPendingSessionDelivery as w, schedulePendingSessionDeliveries as x, settleRequesterCompletionBatch as y };
