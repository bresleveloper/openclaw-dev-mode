import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { g as getGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as SqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { n as enqueueSessionStateNotice } from "./session-state-notices-CICW1sDz.mjs";
import { C as copySubagentRunRuntimeOwner, D as isQueuedSubagentRunRekey, E as getSubagentRunRuntimeKey, O as isSameSubagentRun, P as retainSubagentRunRuntimeOwner, T as getSubagentRunIdentity, k as isSameSubagentRunOwner, x as bindSubagentRunRuntimeKey } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns, p as immutableSubagentRun } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { n as consumeFreshSubagentRegistryRows, v as publishSubagentRunsAfterAtomicStore, y as rememberRestoredSubagentRunNotification } from "./subagent-registry-state-DBdy-FdI.mjs";
import { r as parseSubagentRegistryWriteReceipt, t as bindSubagentRunRecord } from "./subagent-registry.store.codec-D57MwX5M.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/subagents/registry/subagent-registry-persistence.ts
const pendingWrites = /* @__PURE__ */ new Set();
const sourceQueues = /* @__PURE__ */ new Set();
function matchesSource(owner, admission) {
	return owner.admission.databasePath === admission.databasePath || owner.admission.identity.canonicalPath === admission.identity.canonicalPath || owner.admission.identity.key === admission.identity.key && owner.admission.identity.birthtime === admission.identity.birthtime;
}
function sourceQueue(admission) {
	const existing = [...sourceQueues].find((queue) => matchesSource(queue, admission));
	if (existing) return existing;
	const queue = {
		admission,
		tails: /* @__PURE__ */ new Map()
	};
	sourceQueues.add(queue);
	return queue;
}
function releaseSourceQueue(queue) {
	if (!queue.restore && queue.tails.size === 0) sourceQueues.delete(queue);
}
/** Source custody is independent of the caller that authorized the mutation. */
function assertSubagentRegistryWriteSourceCurrent(context) {
	context.maintenanceScope?.assertAdmission();
	context.admission.assertCurrent();
	if (captureOpenClawStateReadContext().admission.identity.key !== context.admission.identity.key) throw new Error("Queued registry write lost its original database");
}
function assertSubagentRegistryWriteOutcomeKnown(runIds, admission) {
	for (const pending of pendingWrites) if (pending.uncertain && matchesSource(pending, admission) && (runIds === void 0 || runIds.some((runId) => pending.runIds.has(runId)))) throw pending.uncertain;
}
function waitForPendingSubagentKillClaim(entry, admission) {
	assertSubagentRegistryWriteOutcomeKnown([entry.runId], admission);
	const claims = [...pendingWrites].filter(({ killClaim, ...pending }) => isSameSubagentRunOwner(killClaim, entry) && matchesSource(pending, admission));
	return claims.length ? Promise.all(claims.map((claim) => claim.settled.promise)).then(() => {
		assertSubagentRegistryWriteOutcomeKnown([entry.runId], admission);
	}) : void 0;
}
var SubagentRegistryMutationRejectedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SubagentRegistryMutationRejectedError";
	}
};
var SubagentRegistryWriteError = class extends Error {
	constructor(outcome, cause, publication) {
		let failure = cause;
		if (outcome === "unknown" && !hasSqliteWorkerOutcomeUnknown(cause)) {
			const unknown = new SqliteWorkerError("Queued subagent registry write has an unknown outcome", "outcome-unknown");
			unknown.cause = cause;
			failure = unknown;
		}
		super(`Queued subagent registry persistence failed: ${formatErrorMessage(cause)}`, { cause: failure });
		this.outcome = outcome;
		this.publication = publication;
		this.name = "SubagentRegistryWriteError";
	}
};
/** Known native commit whose unreadable receipt still requires canonical restoration. */
var SubagentRegistryCommitReceiptError = class extends SubagentRegistryWriteError {
	constructor(cause) {
		const unreadable = new SqliteWorkerError("Committed registry receipt is unreadable", "outcome-unknown");
		unreadable.cause = cause;
		super("committed", unreadable);
		this.name = "SubagentRegistryCommitReceiptError";
	}
};
function publishRows(runs, postimages, context, afterInstall) {
	for (const [runId, next] of postimages) if (next) {
		retainSubagentRunRuntimeOwner(runs.get(runId), next);
		runs.set(runId, immutableSubagentRun(next));
	} else runs.delete(runId);
	const failures = [];
	try {
		afterInstall?.();
	} catch (error) {
		failures.push(error);
	}
	try {
		if (postimages.size) {
			assertSubagentRegistryWriteSourceCurrent(context);
			publishSubagentRunsAfterAtomicStore(runs, [...postimages.keys()], context.admission.databasePath)();
		}
	} catch (error) {
		failures.push(error);
	}
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "Subagent registry acknowledgement settlement failed", { cause: failures[0] });
}
/** Both native writers retain admission and known receipts through worker settlement. */
async function runSubagentRegistryWorkerWrite(context, prepare) {
	const write = prepare();
	let commitGranted = false;
	let admission;
	try {
		return await runOpenClawStateWorkerOperation(context, async (scope) => write.decode(await write.execute(scope)), {
			assertCurrent: write.assertCurrent,
			createAdmission: () => {
				let phase = "waiting";
				const eventPhases = /* @__PURE__ */ new Map();
				const authorityName = write.kind === "registry" ? "Queued registry write" : "Subagent completion write";
				admission = createSqliteWorkerOperationAdmission((request, grant) => {
					const outerFacts = request.facts;
					const facts = write.kind === "registry" && isRecord(outerFacts) && outerFacts.kind === "session-entry-current" ? outerFacts.domainFacts : outerFacts;
					if (write.kind === "registry" && isRecord(facts) && facts.writeId === write.writeId && typeof facts.eventIndex === "number") {
						const event = write.terminalEvents?.[facts.eventIndex];
						if (!event || phase !== "transaction" || !(request.stage === "transaction" && !eventPhases.has(facts.eventIndex) || request.stage === "commit" && eventPhases.get(facts.eventIndex) === "transaction")) throw new Error("Subagent terminal event admission requested out of order");
						write.assertCurrent();
						assertSessionEntryCurrentAdmission(request, event.sessionEntryCurrent);
						if (!grant()) throw new Error("Subagent terminal event admission expired");
						eventPhases.set(facts.eventIndex, request.stage);
						return;
					}
					if (facts !== write.writeId || !(phase === "waiting" && request.stage === "transaction" || phase === "transaction" && request.stage === "commit")) throw new Error(`${authorityName} authority requested out of order`);
					write.assertCurrent();
					if (!grant()) throw new Error(`${authorityName} authority expired`);
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
		if (admission?.committed) try {
			return write.decode(admission.committed.facts);
		} catch (receiptError) {
			throw new SubagentRegistryCommitReceiptError(receiptError);
		}
		if (error instanceof SubagentRegistryWriteError) throw error;
		throw new SubagentRegistryWriteError(write.kind === "registry" && write.acknowledged() ? "committed" : commitGranted || hasSqliteWorkerOutcomeUnknown(error) ? "unknown" : "not-committed", error);
	}
}
function commitRows(planned, context, authority) {
	return runSubagentRegistryWorkerWrite(context, () => {
		const postimages = new Map([...planned.postimages ?? []].map(([runId, row]) => [runId, row ? copySubagentRunRuntimeOwner(row, structuredClone(row)) : null]));
		const values = [...postimages.values()].flatMap((row) => row ? [bindSubagentRunRecord(row)] : []);
		const write = {
			writeId: randomUUID(),
			values,
			deleteRunIds: [...postimages].flatMap(([id, row]) => row ? [] : [id]),
			terminalEvents: planned.terminalEvents?.map(({ input }) => structuredClone(input))
		};
		let acknowledged = false;
		const decode = (value) => {
			const receipt = parseSubagentRegistryWriteReceipt(value, write);
			acknowledged = true;
			return {
				value: planned.value,
				postimages,
				notices: receipt.notices
			};
		};
		return {
			kind: "registry",
			writeId: write.writeId,
			assertCurrent: authority.assertCurrent,
			execute: (scope) => scope.execute({
				type: "subagents.persistChanges",
				input: write
			}),
			decode,
			terminalEvents: planned.terminalEvents,
			acknowledged: () => acknowledged
		};
	});
}
/** Reserve all rows before waiting; overlapping operations plan in FIFO publication order. */
async function mutateSubagentRuns(selectedRunIds, plan, options = {}) {
	const context = options.context ?? captureOpenClawStateWorkerContext();
	const runs = options.runs ?? subagentRuns;
	const recovery = options.gatewayRecovery;
	const recoveredRuntimeKey = recovery ? {} : void 0;
	const runtimeKeyFor = (current, row) => recoveredRuntimeKey ?? (current && isSameSubagentRun(current, row) ? getSubagentRunRuntimeKey(current) : getSubagentRunRuntimeKey(row));
	const assertRecoveryCurrent = () => {
		if (!recovery) return;
		const current = runs.get(recovery.expected.runId);
		if (!current || !isSameSubagentRunOwner(current, recovery.expected) || current.execution.status !== "terminal" || !current.requesterSettleWake || getGatewayContextResolver(current) !== recovery.previousResolver || recovery.previousResolver() !== void 0 || recovery.resolver() !== recovery.gateway) throw new SubagentRegistryMutationRejectedError("Subagent Gateway recovery owner changed");
	};
	const runIds = [...new Set(selectedRunIds.map((id) => id.trim()).filter(Boolean))].toSorted();
	assertSubagentRegistryWriteOutcomeKnown(runIds, context.admission);
	const queue = sourceQueue(context.admission);
	const pending = {
		runIds: new Set(runIds),
		admission: context.admission,
		settled: createDeferredCore(),
		killClaim: options.pendingKillClaim
	};
	const predecessors = new Set(queue.restore ? [queue.restore] : []);
	for (const runId of runIds) {
		const previous = queue.tails.get(runId);
		if (previous) predecessors.add(previous);
		queue.tails.set(runId, pending.settled.promise);
	}
	pendingWrites.add(pending);
	const authority = {
		assertDatabase: () => assertSubagentRegistryWriteSourceCurrent(context),
		assertCurrent: () => {
			assertSubagentRegistryWriteSourceCurrent(context);
			assertSubagentRegistryWriteOutcomeKnown(runIds, context.admission);
			options.assertCurrent?.();
			assertRecoveryCurrent();
		}
	};
	let published = false;
	try {
		await Promise.all(predecessors);
		authority.assertCurrent();
		const rows = /* @__PURE__ */ new Map();
		const preparedRows = options.preparedRows?.();
		for (const runId of runIds) {
			const entry = runs.get(runId) ?? preparedRows?.get(runId);
			if (entry) rows.set(runId, immutableSubagentRun(entry));
		}
		const planned = plan(rows);
		if (isPromiseLike(planned)) {
			Promise.resolve(planned).catch(() => {});
			throw new Error("Subagent mutation plans must remain synchronous");
		}
		for (const [id, row] of planned.postimages ?? []) {
			if (!pending.runIds.has(id) || row && row.runId !== id) throw new SubagentRegistryMutationRejectedError("Subagent mutation writes an unadmitted row");
			if (row) bindSubagentRunRuntimeKey(row, runtimeKeyFor(rows.get(id), row));
		}
		pending.rekeys = [...planned.rekeys ?? []].map(([from, to]) => {
			const source = rows.get(from);
			const destination = planned.postimages?.get(to);
			if (!source || !destination || rows.has(to) || planned.postimages?.get(from) !== null || !pending.runIds.has(to) || !isQueuedSubagentRunRekey(source, destination) || getSubagentRunRuntimeKey(source) !== getSubagentRunRuntimeKey(destination)) throw new SubagentRegistryMutationRejectedError("Queued subagent rekey does not retain its admitted execution");
			return {
				from,
				to,
				owner: getSubagentRunRuntimeKey(source),
				sourceIdentity: getSubagentRunIdentity(source),
				destinationIdentity: getSubagentRunIdentity(destination)
			};
		});
		if (!options.commit && !planned.postimages?.size && !planned.terminalEvents?.length) return planned.value;
		const committed = options.commit ? await options.commit(planned, authority) : await commitRows(planned, context, authority);
		try {
			authority.assertDatabase();
			const postimages = committed.postimages ?? /* @__PURE__ */ new Map();
			for (const [id, row] of postimages) {
				if (!pending.runIds.has(id) || row && row.runId !== id) throw new SubagentRegistryCommitReceiptError("Registry receipt writes an unadmitted row");
				if (row) {
					const plannedRow = planned.postimages?.get(id);
					const key = plannedRow ? getSubagentRunRuntimeKey(plannedRow) : runtimeKeyFor(rows.get(id), row);
					bindSubagentRunRuntimeKey(row, key);
				}
			}
			publishRows(runs, postimages, context, () => {
				published = true;
				for (const notice of committed.notices ?? []) enqueueSessionStateNotice(notice);
				options.onPublished?.(postimages, committed.value);
			});
			return committed.value;
		} catch (error) {
			if (error instanceof SubagentRegistryCommitReceiptError) throw error;
			throw new SubagentRegistryWriteError("committed", error, published ? "published" : "superseded");
		}
	} catch (error) {
		if (error instanceof SubagentRegistryCommitReceiptError || hasSqliteWorkerOutcomeUnknown(error) && !(error instanceof SubagentRegistryWriteError && error.outcome === "committed")) pending.uncertain = error instanceof SubagentRegistryWriteError ? error : new SubagentRegistryWriteError("unknown", error);
		throw error;
	} finally {
		pending.settled.resolve();
		for (const runId of runIds) if (queue.tails.get(runId) === pending.settled.promise) queue.tails.delete(runId);
		if (!pending.uncertain) pendingWrites.delete(pending);
		releaseSourceQueue(queue);
	}
}
async function restoreSubagentRunsFromDisk(params) {
	const context = params.context ?? captureOpenClawStateWorkerContext();
	return withSubagentRegistryRestore(context, () => consumeFreshSubagentRegistryRows(context, (restored) => {
		params.assertCurrent?.();
		if (!params.mergeOnly) {
			reconcileRetiredSubagentRegistryWrites(params.runs, restored);
			for (const runId of params.runs.keys()) if (!restored.has(runId)) params.runs.delete(runId);
		}
		let added = 0;
		for (const [runId, entry] of restored) {
			if (params.mergeOnly && params.runs.has(runId)) continue;
			retainSubagentRunRuntimeOwner(params.runs.get(runId), entry);
			params.runs.set(runId, entry);
			rememberRestoredSubagentRunNotification(entry);
			subagentRuns.settleCommittedOwnership(entry);
			added += 1;
		}
		publishSubagentRunsAfterAtomicStore(params.runs, void 0, context.admission.databasePath)();
		return added;
	}));
}
/** Canonical restore is exclusive with both accepted mutations and subsequent admissions. */
async function withSubagentRegistryRestore(context, restore) {
	const queue = sourceQueue(context.admission);
	const done = createDeferredCore();
	const previous = [...queue.tails.values(), ...queue.restore ? [queue.restore] : []];
	queue.restore = done.promise;
	try {
		await Promise.all(previous);
		assertSubagentRegistryWriteSourceCurrent(context);
		return await restore();
	} finally {
		if (queue.restore === done.promise) queue.restore = void 0;
		done.resolve();
		releaseSourceQueue(queue);
	}
}
/** A source close alone cannot clear an unknown commit; only a canonical read can. */
function reconcileRetiredSubagentRegistryWrites(runs, restored) {
	const { admission } = captureOpenClawStateWorkerContext();
	for (const pending of pendingWrites) {
		if (!pending.uncertain || !matchesSource(pending, admission)) continue;
		const rekeys = (pending.rekeys ?? []).flatMap((attempted) => {
			const previous = runs.get(attempted.from);
			const accepted = restored.get(attempted.to);
			if (!previous || !accepted || restored.has(attempted.from) || getSubagentRunRuntimeKey(previous) !== attempted.owner || getSubagentRunIdentity(previous) !== attempted.sourceIdentity || getSubagentRunIdentity(accepted) !== attempted.destinationIdentity || !isQueuedSubagentRunRekey(previous, accepted)) return [];
			bindSubagentRunRuntimeKey(accepted, attempted.owner);
			return [{
				previous,
				accepted
			}];
		});
		for (const id of pending.runIds) {
			const row = restored.get(id);
			if (row) {
				retainSubagentRunRuntimeOwner(runs.get(id), row);
				runs.set(id, immutableSubagentRun(row));
			} else runs.delete(id);
		}
		for (const { previous, accepted } of rekeys) subagentRuns.publishQueuedSubagentRunRekey(previous, accepted);
		pendingWrites.delete(pending);
	}
}
//#endregion
export { assertSubagentRegistryWriteSourceCurrent as a, runSubagentRegistryWorkerWrite as c, assertSubagentRegistryWriteOutcomeKnown as i, waitForPendingSubagentKillClaim as l, SubagentRegistryMutationRejectedError as n, mutateSubagentRuns as o, SubagentRegistryWriteError as r, restoreSubagentRunsFromDisk as s, SubagentRegistryCommitReceiptError as t };
