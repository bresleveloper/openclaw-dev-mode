import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { l as GATEWAY_OWNER_HEARTBEAT_MS } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as awaitWithinDeadline, r as scheduleAbsoluteDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DaL1xmcH.mjs";
import { n as UPDATE_ACTIVATION_TIMEOUT_REASON } from "./update-outcome-DLbo5ecI.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-BITMm5ft.mjs";
import { n as prepareManagedHandoffLeaseStore, r as resolveManagedUpdateLeaseDatabasePath } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { i as captureManagedUpdateLeaseDatabaseIdentity } from "./update-managed-service-handoff-database-DQAEU12_.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { r as GATEWAY_SHUTDOWN_RESERVE_MS } from "./gateway-shutdown-budget-Drh-C246.mjs";
import "./gateway-shutdown-budget-c8dOC7fR.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { f as recordUpdateRunStep } from "./update-run-ledger-C3oL-g8r.mjs";
import { c as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/update-cli/update-command-recovery-error.ts
var UpdateCommandRecoveryPendingError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "UpdateCommandRecoveryPendingError";
	}
};
//#endregion
//#region src/cli/update-cli/update-command-activation.ts
var UpdateActivationTimeoutError = class extends UpdateCommandRecoveryPendingError {
	constructor(root, timeoutMs) {
		super(`Update activation exceeded its ${timeoutMs / 1e3}-second budget.`);
		this.root = root;
		this.timeoutMs = timeoutMs;
		this.reason = UPDATE_ACTIVATION_TIMEOUT_REASON;
		this.name = "UpdateActivationTimeoutError";
	}
};
//#endregion
//#region src/cli/update-cli/update-command-executor-state.ts
const admittedAuthorities = /* @__PURE__ */ new WeakMap();
const preflightReleases = /* @__PURE__ */ new WeakMap();
const slotReservations = /* @__PURE__ */ new WeakMap();
function occupiedSlotKey(root) {
	const absolute = path.resolve(root);
	return path.join(fs.realpathSync.native(path.dirname(absolute)), path.basename(absolute));
}
const childOwners = /* @__PURE__ */ new WeakMap();
const originalCancellations = /* @__PURE__ */ new WeakMap();
//#endregion
//#region src/cli/update-cli/update-command-executor-cancellation.ts
/** The original executor retains this record and remains the sole release owner. */
function createUpdateCommandOriginalCancellation(params) {
	const cancellation = { successor: null };
	return {
		get cause() {
			return cancellation.cause;
		},
		get successor() {
			return cancellation.successor;
		},
		register(fence) {
			const runId = params.runId;
			originalCancellations.set(fence, (requestedRunId, cause) => {
				const { active, store, lease, serviceLease } = params.current();
				if (!active || requestedRunId !== runId || !(cause instanceof Error) || !store || !lease || lease.version !== 2 || serviceLease && !cancellation.successor && !store.owns(serviceLease, "executor")) throw new UpdateCommandRecoveryPendingError("Original cancellation owner changed.");
				const successor = store.cancelUpdate(lease, serviceLease);
				if (!successor) throw new UpdateCommandRecoveryPendingError("Original cancellation generation changed.");
				cancellation.successor = successor;
				cancellation.cause ??= cause;
				params.closeChildren();
				preflightReleases.delete(fence);
				params.signal.abort(cause);
			});
		},
		mergeOutcome(outcome) {
			if (!cancellation.cause) return outcome;
			return { error: "error" in outcome && outcome.error !== cancellation.cause ? new AggregateError([outcome.error, cancellation.cause], "Update cancelled while execution failed", { cause: cancellation.cause }) : cancellation.cause };
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-executor-capabilities.ts
function requireCapability(capability, message) {
	if (!capability) throw new UpdateCommandRecoveryPendingError(message);
	return capability;
}
function requireUpdateCommandAcquisition(acquired, message) {
	if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError(typeof message === "string" ? message : message());
	return acquired;
}
/** Revoke effects now; the owning invocation retains physical custody until it
* and every admitted descendant join. Never returns a settlement capability. */
function requestUpdateCommandExecutorCancellation(fence, runId, cause) {
	requireCapability(originalCancellations.get(fence), "Cancellation requires its direct original executor.")(runId, cause);
}
function captureUpdateCommandExecutorAuthority(fence, runId) {
	fence.assertCurrent();
	const admitted = admittedAuthorities.get(fence);
	if (!admitted || runId !== void 0 && admitted.runId !== runId) throw new UpdateCommandRecoveryPendingError("Package recovery requires its admitted executor.");
	return admitted.authority;
}
/** Requester checks also run while a bound child suspends its parent's mutation fence. */
function assertUpdateRequesterContinuationOwner(fence, runId) {
	const admitted = admittedAuthorities.get(fence);
	if (!admitted?.managedHandoff || admitted.runId !== runId) throw new UpdateCommandRecoveryPendingError("Requester continuation requires its admitted Gateway update owner.");
	admitted.assertCurrent();
}
/** Compatibility requirement from a live admission, never a serialized claim. */
function requiresRetainedUpdateCommandOwner(fence) {
	captureUpdateCommandExecutorAuthority(fence);
	return admittedAuthorities.get(fence)?.retainedRoot !== void 0;
}
function assertRetainedUpdateCommandRoot(fence, root) {
	captureUpdateCommandExecutorAuthority(fence);
	if (admittedAuthorities.get(fence)?.retainedRoot !== resolveUpdateInstallRoot(root)) throw new UpdateCommandRecoveryPendingError("Service recovery requires its retained executor root.");
}
function releaseUpdateCommandPreflightForHandoff(fence) {
	requireCapability(preflightReleases.get(fence), "Update preflight handoff is not current.")();
}
/** Reserve a prospective package slot without replacing the original domain. */
function reserveUpdateCommandExecutorSlot(fence, root) {
	requireCapability(slotReservations.get(fence), "Slot reservation requires its live executor.")(root);
}
async function withUpdateCommandExecutorChild(fence, root, operation, purpose) {
	return await requireCapability(childOwners.get(fence), "Child continuation requires its live executor.")(root, operation, purpose);
}
//#endregion
//#region src/cli/update-cli/update-command-executor-children.ts
function childLineageDigest(original, spawner, parent, database, retained, slot) {
	const fields = (lease) => [
		lease.key,
		lease.owner,
		lease.payload,
		lease.updatedAt
	];
	const lineage = [
		database.databasePath,
		database.databaseIdentity,
		database.parentIdentity,
		[
			original,
			spawner,
			parent
		].map((lease) => lease.version === 1 ? [
			lease.key,
			lease.owner,
			lease.payload,
			lease.updatedAt,
			lease.helper,
			lease.executor
		] : fields(lease))
	];
	if (slot) lineage.push([
		"occupied-slot-v1",
		fields(slot.parent),
		fields(slot.spawner),
		...slot.reserver ? [["legacy-slot-reserver-v1", ...fields(slot.reserver)]] : []
	]);
	if (retained) lineage.push(["retained-owner-v1", ...fields(retained)]);
	return createHash("sha256").update(JSON.stringify(lineage)).digest("hex");
}
/** One child interval, shared by direct and delegated executors. */
function createChildOwner(params) {
	let admissionOpen = true;
	let delegating = false;
	let pending;
	let failure;
	const assertIdle = () => {
		if (delegating) throw new UpdateCommandRecoveryPendingError("The update process is still running.");
	};
	return {
		assertIdle,
		get pending() {
			return pending;
		},
		close() {
			admissionOpen = false;
		},
		async settle() {
			await pending;
			if (failure) throw failure;
		},
		run(root, operation, purpose) {
			params.assertBase();
			assertIdle();
			if (!admissionOpen) throw new UpdateCommandRecoveryPendingError("Child executor admission is closed.");
			const { store, parent, original, spawner, slot, retainedParent, databasePath, databaseIdentity } = params.binding();
			if (!databaseIdentity) throw new UpdateCommandRecoveryPendingError("Native child requires its pinned lease database.");
			params.onStart?.(purpose);
			const candidateRoot = resolveUpdateInstallRoot(root);
			let candidateParent = parent;
			let acquiredParent = false;
			let children = [];
			let bound = false;
			delegating = true;
			const assertOwners = () => {
				params.assertBase();
				if (!store.current(candidateParent) || slot && (!store.current(slot.parent) || !store.current(slot.spawner)) || retainedParent && !store.current(retainedParent) || resolveUpdateInstallRoot(root) !== candidateParent.key && !(slot && candidateParent.key === original.key && resolveUpdateInstallRoot(root) === slot.parent.key)) throw new UpdateCommandRecoveryPendingError("Update installation ownership changed.");
			};
			const running = async () => {
				let outcome;
				try {
					if (retainedParent && candidateRoot === retainedParent.key) throw new UpdateCommandRecoveryPendingError("Retained service root is not a candidate executor.");
					if (slot && candidateRoot === slot.parent.key) candidateParent = slot.parent;
					else if (candidateRoot !== parent.key) {
						const acquired = store.acquire(candidateRoot, randomUUID(), { kind: "update" }, false, void 0, original);
						if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Another update executor owns the update installation.");
						candidateParent = acquired.lease;
						acquiredParent = true;
					}
					assertOwners();
					const parents = [...new Map([
						spawner,
						...slot ? [slot.spawner] : [],
						...retainedParent ? [retainedParent] : [],
						...candidateParent.key === original.key || candidateParent.key === slot?.parent.key ? [] : [candidateParent]
					].map((owner) => [owner.key, owner])).values()];
					const candidateSpawnerKey = candidateParent.key === slot?.parent.key ? slot.spawner.key : candidateParent.key;
					const candidateChildIndex = candidateParent.key === original.key ? 0 : parents.findIndex((owner) => owner.key === candidateSpawnerKey);
					const childName = `${randomUUID()}-lineage-${childLineageDigest(original, spawner, candidateParent, databaseIdentity, retainedParent, slot)}`;
					for (const childParent of parents) {
						const acquired = store.acquire(`${childParent.key}/.openclaw-update-child-${childName}`, params.runId, {
							kind: "update",
							...(childParent.key === original.key || childParent.key.startsWith(`${original.key}/.openclaw-update-child-`)) && original.version === 2 && original.action.kind === "update" && original.action.mutationProtocol ? { mutationProtocol: original.action.mutationProtocol } : {}
						}, false, original.version === 1 && childParent.key.startsWith(`${original.key}/.openclaw-update-child-`) ? original : void 0, original);
						if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Could not reserve the installation for this update.");
						children.push(acquired.lease);
					}
					const grant = {
						runId: params.runId,
						root: candidateParent.key,
						databasePath,
						parent: candidateParent,
						originalParent: original,
						spawner,
						originalChildKey: children[0].key,
						childKey: children[candidateChildIndex].key,
						databaseIdentity,
						...slot ? { slot: {
							...slot,
							childKey: children[parents.findIndex((owner) => owner.key === slot.spawner.key)].key
						} } : {},
						...retainedParent ? {
							retainedParent,
							retainedChildKey: children[parents.findIndex((owner) => owner.key === retainedParent.key)].key
						} : {}
					};
					const result = await withCommandProcessScope(() => operation(grant, (pid, argv) => {
						assertOwners();
						if (pid === process.pid) throw new UpdateCommandRecoveryPendingError("Update process can be bound only once.");
						const assigned = store.bindUpdateChildren(children, store.processIdentity(pid, argv));
						if (!assigned) throw new UpdateCommandRecoveryPendingError("Update process binding failed.");
						children = assigned;
						bound = true;
					}));
					if (!bound) throw new UpdateCommandRecoveryPendingError("The update worker did not confirm startup.");
					outcome = { result };
				} catch (error) {
					outcome = { error };
				}
				if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) {
					admissionOpen = false;
					throw outcome.error;
				}
				try {
					const lineageCount = slot ? 2 : 1;
					const destinations = children.slice(lineageCount);
					if (destinations.length > 0 && !store.releaseAll(destinations)) throw new UpdateCommandRecoveryPendingError("The update process has not finished.");
					if (acquiredParent && (candidateParent.version === 1 || !store.release(candidateParent))) throw new UpdateCommandRecoveryPendingError("Update installation release failed.");
					const lineage = children.slice(0, lineageCount);
					if (lineage.length > 0 && !store.releaseAll(lineage)) throw new UpdateCommandRecoveryPendingError("The update process has not finished.");
					delegating = false;
				} catch (cause) {
					if ("error" in outcome) throw new AggregateError([outcome.error, cause], "Update and its executor cleanup failed", { cause });
					throw cause;
				}
				if ("error" in outcome) throw outcome.error;
				return outcome.result;
			};
			const work = Promise.resolve().then(running);
			pending = work;
			work.catch((cause) => {
				failure = cause instanceof Error ? cause : new Error("Update failed", { cause });
			}).finally(() => {
				pending = void 0;
			});
			return work;
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-executor-legacy.ts
/** Retire only this child's temporary bridge, after the lease owner proves no descendants remain. */
function releaseLegacyPackageUpdateParent(store, lease, paired = []) {
	const settled = store.bind(lease, process.pid);
	return settled !== null && store.releaseAll([settled, ...paired]);
}
/** Keep a shipped parent's lifetime in the same lineage checked by native grandchildren. */
function acquireLegacyUpdateExecutorParent(params) {
	const { store, key, runId, parent } = params;
	let lease;
	let child;
	let target;
	let borrowed = parent.kind === "managed";
	try {
		if (parent.kind === "managed") {
			const found = store.read(key);
			if (found.kind !== "current" || parent.runId !== runId || parent.root !== key || found.lease.owner !== parent.handoffId || found.lease.version !== 2 || found.lease.action.kind !== "update" || found.lease.executor.pid !== process.ppid || !store.isProcessIdentityCurrent(found.lease.helper) || !store.isProcessIdentityCurrent(found.lease.executor) || store.hasUnsettledChildren(found.lease)) throw new UpdateCommandRecoveryPendingError("Legacy finalizer does not match its live managed parent.");
			lease = found.lease;
		} else {
			if (parent.identity.pid !== process.ppid || !store.isProcessIdentityCurrent(parent.identity)) throw new UpdateCommandRecoveryPendingError("Legacy package updater is no longer live.");
			const sourceKey = parent.handoff?.root ?? key;
			const found = store.read(sourceKey);
			if (parent.handoff) {
				const legacy = store.readLegacyParent(sourceKey, parent.identity);
				if (found.kind !== "unreadable" || !legacy || parent.handoff.handoffId !== legacy.owner || !store.current(legacy)) throw new UpdateCommandRecoveryPendingError("Legacy managed parent binding changed.");
				lease = legacy;
				borrowed = true;
			} else {
				lease = requireUpdateCommandAcquisition(store.acquire(key, runId, { kind: "update" }), "Another update executor owns this installation.").lease;
				const bound = store.bind(lease, parent.identity.pid);
				if (!bound) throw new UpdateCommandRecoveryPendingError("Legacy package parent binding failed.");
				lease = bound;
				if (!isDeepStrictEqual(lease.executor, parent.identity)) throw new UpdateCommandRecoveryPendingError("Legacy package parent identity changed.");
			}
		}
		child = requireUpdateCommandAcquisition(store.acquire(`${lease.key}/.openclaw-update-child-${params.childName}`, runId, { kind: "update" }, false, lease.version === 1 ? lease : void 0), "Legacy finalizer lifetime could not be acquired.").lease;
		if (lease.key !== key) {
			if (!store.current(lease)) throw new UpdateCommandRecoveryPendingError("Legacy source generation changed.");
			target = requireUpdateCommandAcquisition(store.acquire(key, runId, { kind: "update" }), "Active package generation is already owned.").lease;
		}
		return {
			lease,
			child,
			target,
			borrowed
		};
	} catch (error) {
		if (target && !store.release(target) || child && !store.release(child)) throw new UpdateCommandRecoveryPendingError("Legacy generation admission cleanup is pending.", { cause: error });
		if (!borrowed && lease && (lease.version === 1 || !releaseLegacyPackageUpdateParent(store, lease))) throw new UpdateCommandRecoveryPendingError("Legacy parent admission cleanup is pending.", { cause: error });
		throw error;
	}
}
//#endregion
//#region src/cli/update-cli/update-command-executor-operation.ts
const asUpdateError = (cause, message = "Update execution failed") => cause instanceof Error ? cause : new Error(message, { cause });
/** Join admitted descendants before the command scope settles, retaining each owner's errors. */
function withUpdateCommandExecutorOperation(params, owner) {
	return withCommandProcessScope(async () => {
		let outcome;
		try {
			outcome = { result: await params.operation() };
		} catch (cause) {
			outcome = { error: owner === "direct" ? asUpdateError(cause) : cause };
		}
		params.children.close();
		try {
			await params.children.settle();
		} catch (cause) {
			outcome = { error: "error" in outcome && outcome.error !== cause ? new AggregateError([outcome.error, cause], owner === "direct" ? "Update cleanup failed" : "Unable to finish stopping the update process and its children", { cause }) : owner === "direct" ? asUpdateError(cause, "Update settlement failed") : cause };
		}
		if ("error" in outcome) throw outcome.error;
		return outcome.result;
	});
}
async function runUpdateCommandExecutorOperation(params) {
	try {
		return { result: await withUpdateCommandExecutorOperation(params, "direct") };
	} catch (cause) {
		return { error: asUpdateError(cause) };
	}
}
//#endregion
//#region src/cli/update-cli/update-command-executor-options.ts
function resolveUpdateCommandRetainedRoot(root, key, recovering) {
	const requested = root ? resolveUpdateInstallRoot(root) : void 0;
	const distinct = requested === key ? void 0 : requested;
	if (recovering && distinct) throw new UpdateCommandRecoveryPendingError("Recovery cannot acquire a new service root.");
	return distinct;
}
//#endregion
//#region src/cli/update-cli/update-command-identity-warning.ts
function createUpdateIdentityWarningReporter(runId) {
	const warned = /* @__PURE__ */ new Set();
	const pending = /* @__PURE__ */ new Map();
	const flush = () => {
		for (const [pid, detail] of pending) try {
			recordUpdateRunStep(runId, {
				step: `warning:process-start-identity:${pid}`,
				status: "completed",
				endedAtMs: Date.now(),
				detail
			});
			pending.delete(pid);
		} catch {}
	};
	return {
		flush,
		warn: (pid, message) => {
			if (warned.has(pid)) return;
			warned.add(pid);
			console.warn(`[update] ${message}`);
			pending.set(pid, message);
			flush();
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-operation-deadline.ts
/** Cancellation revokes this operation before bounded settlement and caller recovery. */
function createUpdateOperationDeadline(onExpired) {
	const controller = new AbortController();
	let closed = false;
	let cancelDeadline;
	let admission;
	let failure;
	const expired = createDeferredCore();
	const inspectDeadline = () => {
		if (!closed && !failure && admission && performance.now() >= admission.deadlineAtMs) {
			failure = admission.error;
			try {
				onExpired?.(failure);
			} catch (error) {
				failure.cause = error;
				failure.message += " Cancellation could not be requested completely.";
			} finally {
				controller.abort(failure);
				expired.resolve({ error: failure });
			}
		}
	};
	const assertCurrent = () => {
		if (closed) throw failure ?? /* @__PURE__ */ new Error("Update operation ownership has closed.");
		inspectDeadline();
		if (failure) throw failure;
		controller.signal.throwIfAborted();
	};
	return {
		signal: controller.signal,
		assertCurrent,
		get failure() {
			return failure;
		},
		start(error, timeoutMs, absoluteDeadlineAtMs) {
			assertCurrent();
			if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error("Update operation requires a finite positive budget.");
			if (absoluteDeadlineAtMs !== void 0 && !Number.isFinite(absoluteDeadlineAtMs)) throw new Error("Update operation requires a finite deadline.");
			if (admission) return;
			admission = {
				error,
				timeoutMs,
				deadlineAtMs: absoluteDeadlineAtMs ?? performance.now() + timeoutMs
			};
			inspectDeadline();
			if (!failure) cancelDeadline = scheduleAbsoluteDeadline(admission.deadlineAtMs, inspectDeadline, () => performance.now());
		},
		async run(operation, acceptSettledTimeout) {
			return await withCommandProcessScope(async () => {
				assertCurrent();
				const work = Promise.resolve().then(operation).then((value) => ({ value }), (error) => ({ error }));
				try {
					const outcome = await Promise.race([work, expired.promise]);
					inspectDeadline();
					const timeout = failure;
					if (timeout) {
						const joined = await awaitWithinDeadline(() => work, admission.deadlineAtMs + admission.timeoutMs, () => performance.now());
						timeout.message += joined === ABSOLUTE_DEADLINE_EXPIRED ? " Cancellation did not settle within the same budget; outstanding writers retain update ownership." : " Cancellation settled before recovery.";
						if (joined !== ABSOLUTE_DEADLINE_EXPIRED && "error" in joined && hasCommandProcessCleanupError(joined.error)) throw new AggregateError([timeout, joined.error], "Update operation cleanup failed", { cause: timeout });
						if (joined !== ABSOLUTE_DEADLINE_EXPIRED && "value" in joined && acceptSettledTimeout?.(joined.value)) return joined.value;
						throw timeout;
					}
					if ("error" in outcome) throw outcome.error;
					return outcome.value;
				} finally {
					closed = true;
					cancelDeadline?.();
				}
			}, controller.signal);
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-executor-grant.ts
async function resolveUpdateCommandChildBinding(grant, runId, root, onProcessIdentityWarning) {
	const slot = grant.slot;
	if (Object.hasOwn(grant, "slot") && (!isRecord(slot) || !isRecord(slot.parent) || !isRecord(slot.spawner) || typeof slot.parent.key !== "string" || typeof slot.spawner.key !== "string" || typeof slot.childKey !== "string" || Object.hasOwn(slot, "reserver") && (!isRecord(slot.reserver) || typeof slot.reserver.key !== "string"))) throw new UpdateCommandRecoveryPendingError("Candidate occupied slot pair is malformed.");
	const retainedFields = Object.hasOwn(grant, "retainedParent") || Object.hasOwn(grant, "retainedChildKey");
	if (retainedFields && (!isRecord(grant.retainedParent) || typeof grant.retainedParent.key !== "string" || typeof grant.retainedChildKey !== "string")) throw new UpdateCommandRecoveryPendingError("Candidate retained owner pair is malformed.");
	const original = grant.originalParent ?? grant.parent;
	const spawner = grant.spawner ?? original;
	const slotReserver = slot?.reserver;
	const slotCreator = slotReserver ?? original;
	const childPrefix = `${original.key}/.openclaw-update-child-`;
	const childName = grant.childKey.slice(grant.childKey.lastIndexOf("/.openclaw-update-child-") + 24);
	const legacyGrant = !slot && !retainedFields && !grant.originalParent && !grant.spawner && !grant.originalChildKey && !grant.databaseIdentity && grant.childKey === `${grant.parent.key}/.openclaw-update-child-${childName}` && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(childName);
	let databaseIdentity = legacyGrant ? captureManagedUpdateLeaseDatabaseIdentity(grant.databasePath) : grant.databaseIdentity;
	const databasePath = databaseIdentity?.databasePath ?? grant.databasePath;
	if (!Boolean(grant.originalParent && grant.databaseIdentity && grant.spawner && grant.originalChildKey && grant.originalChildKey === `${spawner.key}/.openclaw-update-child-${childName}` && (!slot || slot.childKey === `${slot.spawner.key}/.openclaw-update-child-${childName}`) && (!retainedFields || grant.retainedChildKey === `${grant.retainedParent.key}/.openclaw-update-child-${childName}`) && grant.childKey === `${grant.parent.key === original.key ? spawner.key : grant.parent.key === slot?.parent.key ? slot.spawner.key : grant.parent.key}/.openclaw-update-child-${childName}` && /^[0-9a-f-]{36}-lineage-[0-9a-f]{64}$/.test(childName) && childName.endsWith(`-lineage-${childLineageDigest(original, spawner, grant.parent, grant.databaseIdentity, grant.retainedParent, slot)}`)) && !legacyGrant || !legacyGrant && databasePath !== grant.databasePath) throw new UpdateCommandRecoveryPendingError("Candidate executor lineage is missing or invalid.");
	databaseIdentity = captureManagedUpdateLeaseDatabaseIdentity(databasePath, databaseIdentity, (spawner.key === original.key || spawner.key.startsWith(childPrefix) && isDeepStrictEqual(spawner.helper, spawner.executor) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(spawner.key.slice(childPrefix.length))) && original.action.kind === "update" && (original.version === 1 || original.version === 2 && original.action.mutationProtocol === void 0));
	const store = await prepareManagedHandoffLeaseStore({
		databasePath,
		serviceManagerEnv: resolveServiceManagerEnv(),
		existingIdentity: databaseIdentity,
		onProcessIdentityWarning
	});
	const parent = grant.parent.version === 1 && grant.parent.key === resolveUpdateInstallRoot(root) ? {
		kind: "current",
		lease: store.readLegacyParent(grant.parent.key, grant.parent.executor)
	} : store.read(resolveUpdateInstallRoot(root));
	const originalChild = store.read(grant.originalChildKey ?? grant.childKey);
	const child = store.read(grant.childKey);
	const slotChild = slot ? store.read(slot.childKey) : void 0;
	const retained = retainedFields ? store.read(grant.retainedParent.key) : void 0;
	const retainedChild = retainedFields ? store.read(grant.retainedChildKey) : void 0;
	const parentIsCurrent = (lease, version) => store.current(lease) && (version === 2 ? lease.version === 2 && lease.action.kind === "update" : lease.action.kind === "update" && lease.version !== 3);
	const childIsCurrent = (observed, helper, version) => observed?.kind === "current" && observed.lease.owner === runId && observed.lease.action.kind === "update" && (version === 2 ? observed.lease.version === 2 : observed.lease.version !== 3) && isDeepStrictEqual(observed.lease.helper, helper);
	for (const read of [
		parent,
		originalChild,
		child,
		slotChild,
		retained,
		retainedChild
	]) if (read?.kind === "unreadable") throw new UpdateCommandRecoveryPendingError(`Candidate executor lease is unreadable: ${formatErrorMessage(read.error)}`, { cause: read.error });
	if (slot && (slot.parent.key === original.key || !parentIsCurrent(slot.parent, 2) || slot.parent.owner !== original.owner || !isDeepStrictEqual(slot.parent.helper, slotCreator.executor) || !isDeepStrictEqual(slot.parent.executor, slotCreator.executor) || slotReserver && (!parentIsCurrent(slotReserver, 2) || slotReserver.owner !== runId || !slotReserver.key.startsWith(childPrefix) || !isDeepStrictEqual(slotReserver.helper, slotReserver.executor) || spawner.key !== slotReserver.key && !spawner.key.startsWith(`${slotReserver.key}/.openclaw-update-child-`)) || !parentIsCurrent(slot.spawner, 2) || !isDeepStrictEqual(slot.spawner.executor, spawner.executor) || slot.spawner.key !== slot.parent.key && (!slot.spawner.key.startsWith(`${slot.parent.key}/.openclaw-update-child-`) || slot.spawner.owner !== runId) || !childIsCurrent(slotChild, slot.spawner.executor, 2)) || retainedFields && (retained?.kind !== "current" || !isDeepStrictEqual(retained.lease, grant.retainedParent) || retained.lease.key === original.key || retained.lease.action.kind !== "update" || retained.lease.version === 3 || !isDeepStrictEqual(retained.lease.executor, original.executor) || !isDeepStrictEqual(retained.lease.helper, original.executor) || !childIsCurrent(retainedChild, spawner.executor)) || !legacyGrant && databasePath !== grant.databasePath || grant.runId !== runId || grant.root !== resolveUpdateInstallRoot(root) || parent.kind !== "current" || !parent.lease || !isDeepStrictEqual(parent.lease, grant.parent) || parent.lease.action.kind !== "update" || parent.lease.version === 3 || !parentIsCurrent(original) || !parentIsCurrent(spawner) || spawner.key !== original.key && (!spawner.key.startsWith(childPrefix) || spawner.owner !== runId) || process.platform !== "win32" && process.ppid !== spawner.executor.pid || !(grant.originalChildKey ?? grant.childKey).startsWith(`${spawner.key}/.openclaw-update-child-`) || !grant.childKey.startsWith(`${parent.lease.key}/.openclaw-update-child-`) || !childIsCurrent(originalChild, spawner.executor) || !childIsCurrent(child, spawner.executor)) throw new UpdateCommandRecoveryPendingError("Candidate executor binding does not match its parent.");
	return {
		original,
		spawner,
		databaseIdentity,
		databasePath,
		store,
		parent: parent.lease,
		originalChild: originalChild.lease,
		child: child.lease,
		slot,
		slotChild: slotChild?.kind === "current" ? slotChild.lease : void 0,
		retained: retained?.kind === "current" ? retained.lease : void 0,
		retainedChild: retainedChild?.kind === "current" ? retainedChild.lease : void 0
	};
}
//#endregion
//#region src/cli/update-cli/update-command-executor-delegated.ts
function memoizeSuccessfulLeaseCheck(check) {
	const checked = [];
	return (lease) => {
		if (checked.some((previous) => isDeepStrictEqual(previous, lease))) return true;
		if (!check(lease)) return false;
		checked.push(lease);
		return true;
	};
}
/** A delegated executor retains both its original root and immediate spawner.
* Neither the transported grant nor a lease row without live identity grants effects. */
async function withDelegatedUpdateCommandExecutor(grant, runId, root, operation, options) {
	const activation = createUpdateOperationDeadline();
	return await activation.run(() => withCommandProcessScope(async () => {
		try {
			var _usingCtx$2 = _usingCtx();
			const identityWarnings = createUpdateIdentityWarningReporter(runId);
			const { original, spawner, databaseIdentity, databasePath, store, parent, originalChild, child, retained, retainedChild, slot, slotChild } = await resolveUpdateCommandChildBinding(grant, runId, root, identityWarnings.warn);
			_usingCtx$2.u(new DisposableStack()).use(store.retainReadConnection());
			let active = true;
			const isLive = (identity) => store.isProcessIdentityCurrent(identity);
			if (![
				originalChild,
				child,
				...slotChild ? [slotChild] : [],
				...retainedChild ? [retainedChild] : []
			].every((lease) => process.platform === "win32" && store.owns(lease, "executor") || store.acceptParentBoundExecutor(lease))) throw new UpdateCommandRecoveryPendingError("The update process no longer has permission to continue.");
			const assertBase = () => {
				if (active || activation.failure) activation.assertCurrent();
				const parentIsCurrent = memoizeSuccessfulLeaseCheck((lease) => store.current(lease) && isLive(lease.helper) && isLive(lease.executor));
				const receiverIsCurrent = memoizeSuccessfulLeaseCheck((lease) => store.owns(lease, "executor"));
				if (!active || !parentIsCurrent(original) || !parentIsCurrent(parent) || !parentIsCurrent(spawner) || !receiverIsCurrent(originalChild) || !receiverIsCurrent(child) || slot && (!slotChild || !parentIsCurrent(slot.parent) || !parentIsCurrent(slot.spawner) || slot.reserver && !parentIsCurrent(slot.reserver) || !receiverIsCurrent(slotChild)) || retained && (!retainedChild || !parentIsCurrent(retained) || !receiverIsCurrent(retainedChild))) throw new UpdateCommandRecoveryPendingError("The update process no longer has permission to continue.");
			};
			const owner = createChildOwner({
				runId,
				binding: () => ({
					store,
					parent,
					original,
					spawner: originalChild,
					...slot && slotChild ? { slot: {
						parent: slot.parent,
						spawner: slotChild,
						...slot.reserver ? { reserver: slot.reserver } : {}
					} } : {},
					...retained ? { retainedParent: retained } : {},
					databasePath,
					databaseIdentity
				}),
				assertBase
			});
			activation.signal.addEventListener("abort", () => owner.close(), { once: true });
			const fence = { assertCurrent() {
				assertBase();
				owner.assertIdle();
			} };
			slotReservations.set(fence, (slotRoot) => {
				fence.assertCurrent();
				if (path.resolve(slotRoot) === original.key) return;
				const key = occupiedSlotKey(slotRoot);
				if (key !== original.key && key !== slot?.parent.key) throw new UpdateCommandRecoveryPendingError("Candidate cannot reserve an ungranted installation slot.");
			});
			const meta = await readControlPlaneUpdateSentinelMeta();
			assertBase();
			const managedHandoff = original.version !== 1 && original.helper.pid !== original.executor.pid && meta?.runId === runId && meta.handoffId === original.owner && meta.root !== void 0 && [original.key, parent.key].includes(resolveUpdateInstallRoot(meta.root));
			childOwners.set(fence, (childRoot, childOperation, purpose) => owner.run(childRoot, childOperation, purpose));
			const parents = [
				original,
				parent,
				spawner,
				retained,
				slot?.parent,
				slot?.spawner,
				slot?.reserver
			];
			const processes = new Map(parents.flatMap((lease) => lease ? [lease.helper, lease.executor].map((identity) => [`${identity.pid}:${identity.startIdentity}`, identity]) : []));
			let parentTerminationRequested = false;
			const requestCliParentTermination = () => {
				if (parentTerminationRequested) return;
				parentTerminationRequested = true;
				setTimeout(() => process.kill(process.pid, "SIGKILL"), GATEWAY_SHUTDOWN_RESERVE_MS).unref();
				if (!process.emit("SIGTERM")) process.kill(process.pid, "SIGTERM");
			};
			const parentWatch = setInterval(() => {
				for (const identity of processes.values()) {
					const state = store.inspectProcessIdentity(identity);
					if (state === "dead" || state === "mismatch") {
						requestCliParentTermination();
						break;
					}
				}
			}, GATEWAY_OWNER_HEARTBEAT_MS);
			parentWatch.unref();
			try {
				return await withUpdateCommandExecutorOperation({
					children: owner,
					operation: () => {
						fence.assertCurrent();
						admittedAuthorities.set(fence, {
							authority: Object.freeze({
								...databaseIdentity,
								installKey: original.key,
								owner: original.owner
							}),
							assertCurrent: assertBase,
							managedHandoff,
							runId,
							retainedRoot: retained?.key
						});
						if (options) activation.start(new UpdateActivationTimeoutError(root, options.activationTimeoutMs), options.activationTimeoutMs);
						return operation(fence, {
							runId,
							databaseIdentity,
							parents: [
								originalChild,
								child,
								...retainedChild ? [retainedChild] : [],
								...slotChild ? [slotChild] : []
							]
						});
					}
				}, "delegated");
			} finally {
				clearInterval(parentWatch);
				identityWarnings.flush();
				active = false;
				childOwners.delete(fence);
				slotReservations.delete(fence);
				admittedAuthorities.delete(fence);
			}
		} catch (_) {
			_usingCtx$2.e = _;
		} finally {
			_usingCtx$2.d();
		}
	}, activation.signal));
}
//#endregion
//#region src/cli/update-cli/update-command-executor.ts
/**
* Reuse the native handoff owner for direct invocations too. Its database is
* outside the canonical state family, so checking this fence never opens a
* displaced/migrated source. Physical source exclusion remains a separate duty.
*/
async function withUpdateCommandExecutor(runId, operation, options) {
	let originalFence;
	const activation = createUpdateOperationDeadline((cause) => {
		if (originalFence) requestUpdateCommandExecutorCancellation(originalFence, runId, cause);
	});
	const cancellationSignal = new AbortController();
	const operationSignal = AbortSignal.any([activation.signal, cancellationSignal.signal]);
	return await activation.run(() => withCommandProcessScope(async () => {
		try {
			var _usingCtx$1 = _usingCtx();
			let active = true;
			let databasePath;
			let store;
			const readConnections = _usingCtx$1.u(new DisposableStack());
			let lease;
			let slotLease;
			let borrowed = false;
			let managedHandoff = false;
			let serviceLease;
			let serviceKey;
			let admissionComplete = false;
			let legacyChild;
			let legacyTarget;
			const cancellation = createUpdateCommandOriginalCancellation({
				runId,
				signal: cancellationSignal,
				current: () => ({
					active,
					store,
					lease,
					serviceLease
				}),
				closeChildren: () => children.close()
			});
			const identityWarnings = createUpdateIdentityWarningReporter(runId);
			const assertBase = () => {
				const cancelled = cancellation.cause;
				if (cancelled) throw cancelled;
				if (active || activation.failure) activation.assertCurrent();
				if (!active || !admissionComplete || !store || !lease || serviceLease && !store.owns(serviceLease, "executor") || legacyTarget && !store.owns(legacyTarget, "executor") || slotLease && !store.owns(slotLease, "executor") || (legacyChild ? !store.current(lease) || lease.executor.pid !== process.ppid || !store.isProcessIdentityCurrent(lease.helper) || !store.isProcessIdentityCurrent(lease.executor) || !store.owns(legacyChild, "executor") : lease.version === 1 || !store.owns(lease, "executor"))) throw new UpdateCommandRecoveryPendingError("Update executor ownership is no longer current.");
			};
			const assertCurrent = () => {
				assertBase();
				if (lease?.version === 3 || serviceLease?.version === 3) throw new UpdateCommandRecoveryPendingError("Parent executor has unresolved native custody.");
				children.assertIdle();
			};
			const fence = { assertCurrent };
			const retireFence = () => {
				originalFence = void 0;
				originalCancellations.delete(fence);
				active = false;
				preflightReleases.delete(fence);
				childOwners.delete(fence);
				slotReservations.delete(fence);
				admittedAuthorities.delete(fence);
			};
			const children = createChildOwner({
				runId,
				assertBase,
				onStart: (purpose) => {
					if (!purpose?.auxiliaryPreflight) preflightReleases.delete(fence);
				},
				binding: () => {
					if (!store || !lease || !databasePath) throw new UpdateCommandRecoveryPendingError("Child executor admission is closed.");
					const spawner = legacyChild ?? lease;
					if (spawner.version === 1) throw new UpdateCommandRecoveryPendingError("Borrowed parent has no child lifetime.");
					return {
						store,
						parent: legacyTarget ?? lease,
						original: lease,
						spawner,
						...slotLease ? { slot: {
							parent: slotLease,
							spawner: slotLease,
							...legacyChild ? { reserver: legacyChild } : {}
						} } : {},
						...serviceLease ? { retainedParent: serviceLease } : {},
						databasePath,
						databaseIdentity: admittedAuthorities.get(fence)?.authority
					};
				}
			});
			activation.signal.addEventListener("abort", () => children.close(), { once: true });
			childOwners.set(fence, async (root, childOperation, purpose) => {
				try {
					assertCurrent();
					return await children.run(root, childOperation, purpose);
				} catch (error) {
					preflightReleases.delete(fence);
					throw error;
				}
			});
			slotReservations.set(fence, (root) => {
				assertCurrent();
				if (!store || !lease) throw new UpdateCommandRecoveryPendingError("Slot reservation requires its live executor.");
				const installLease = legacyTarget ?? lease;
				if (path.resolve(root) === installLease.key) return;
				const key = occupiedSlotKey(root);
				if (key === installLease.key) return;
				if (slotLease) {
					if (slotLease.key !== key) throw new UpdateCommandRecoveryPendingError("Update executor occupied slot changed.");
					return;
				}
				if (fs.realpathSync.native(key) !== installLease.key) throw new UpdateCommandRecoveryPendingError("Occupied slot does not resolve to its original installation.");
				slotLease = requireUpdateCommandAcquisition(store.acquire(key, lease.owner, { kind: "update" }, false, void 0, lease), "Another update executor owns the occupied slot.").lease;
				preflightReleases.delete(fence);
				assertCurrent();
			});
			const executor = { async enter(root, enterOptions) {
				if (active || activation.failure) activation.assertCurrent();
				if (!active) throw new UpdateCommandRecoveryPendingError("Update executor admission is closed or busy.");
				const key = options?.existingAuthority?.installKey ?? resolveUpdateInstallRoot(root);
				if (options?.existingAuthority && root !== key) throw new UpdateCommandRecoveryPendingError("Recovery installation key changed.");
				const distinctServiceKey = resolveUpdateCommandRetainedRoot(enterOptions?.serviceRoot, key, Boolean(options?.existingAuthority));
				const finishAdmission = () => {
					if (!enterOptions?.preflight) {
						preflightReleases.delete(fence);
						reserveUpdateCommandExecutorSlot(fence, root);
					}
					if (enterOptions?.activationTimeoutMs !== void 0) activation.start(new UpdateActivationTimeoutError(key, enterOptions.activationTimeoutMs), enterOptions.activationTimeoutMs);
					return fence;
				};
				if (lease) {
					assertCurrent();
					identityWarnings.flush();
					if ((legacyTarget ?? lease).key !== key && slotLease?.key !== key || serviceKey !== distinctServiceKey) throw new UpdateCommandRecoveryPendingError("Update executor installation changed.");
					return finishAdmission();
				}
				databasePath = options?.existingAuthority?.databasePath ?? resolveManagedUpdateLeaseDatabasePath();
				let existingIdentity = options?.existingAuthority ?? (options?.legacyPackageHandoff ? captureManagedUpdateLeaseDatabaseIdentity(databasePath) : void 0);
				databasePath = existingIdentity?.databasePath ?? databasePath;
				const initialDatabasePath = databasePath;
				const openStore = async (identity, originalUpdateKey) => {
					const prepared = await prepareManagedHandoffLeaseStore({
						databasePath: identity?.databasePath ?? initialDatabasePath,
						serviceManagerEnv: resolveServiceManagerEnv(),
						existingIdentity: identity,
						originalUpdateKey,
						onProcessIdentityWarning: identityWarnings.warn
					});
					activation.assertCurrent();
					if (!active) throw new UpdateCommandRecoveryPendingError("Update executor admission is closed.");
					return prepared;
				};
				store = await openStore(existingIdentity, !options?.legacyManagedParent && !options?.legacyPackageParent ? key : void 0);
				const found = store.read(key);
				if (found.kind === "unreadable" && !options?.legacyPackageParent) throw new UpdateCommandRecoveryPendingError("Update executor state is unreadable.");
				const legacyParent = options?.legacyManagedParent ? {
					kind: "managed",
					...options.legacyManagedParent
				} : options?.legacyPackageParent ? {
					kind: "package",
					identity: options.legacyPackageParent,
					handoff: options.legacyPackageHandoff
				} : void 0;
				if (legacyParent) {
					const admitted = acquireLegacyUpdateExecutorParent({
						store,
						key,
						runId,
						parent: legacyParent,
						childName: randomUUID()
					});
					lease = admitted.lease;
					borrowed = admitted.borrowed;
					legacyChild = admitted.child;
					legacyTarget = admitted.target;
				} else if (found.kind === "current" && !options?.existingAuthority && found.lease.helper.pid !== process.pid && found.lease.executor.pid === process.pid) {
					const { isCurrentManagedServiceUpdateHandoffProcess } = await import("./update-managed-service-handoff-current-C4ksw-io.mjs");
					const handedOff = await isCurrentManagedServiceUpdateHandoffProcess({
						root: key,
						runId,
						store
					});
					if (!active || !handedOff || found.lease.action.kind !== "update" || !store.owns(found.lease, "executor") && !(process.connected && store.acceptParentBoundExecutor(found.lease))) throw new UpdateCommandRecoveryPendingError("Managed update executor changed during admission.");
					lease = found.lease;
					borrowed = true;
					managedHandoff = true;
				} else {
					const admissionStore = store;
					const acquired = requireUpdateCommandAcquisition(store.acquire(key, randomUUID(), { kind: "update" }), () => {
						const retained = admissionStore.read(key);
						return retained.kind === "current" && retained.lease.version === 4 ? `Another update executor owns this installation. It retains cancelled update custody (owner ${retained.lease.owner}, lease version 4, last activity ${new Date(retained.lease.updatedAt).toISOString()}). If that update has exited, run ${formatCliCommand("openclaw update repair")} to settle it.` : "Another update executor owns this installation.";
					});
					lease = acquired.lease;
					if (acquired.originalDatabaseIdentity) {
						existingIdentity = acquired.originalDatabaseIdentity;
						databasePath = existingIdentity.databasePath;
						store = await openStore(existingIdentity);
					}
				}
				serviceKey = distinctServiceKey;
				if (serviceKey) serviceLease = requireUpdateCommandAcquisition(store.acquire(serviceKey, randomUUID(), { kind: "update" }), "Another update executor owns the managed service installation.").lease;
				admissionComplete = true;
				assertCurrent();
				const authority = Object.freeze({
					...existingIdentity ?? captureManagedUpdateLeaseDatabaseIdentity(databasePath),
					installKey: lease.key,
					owner: lease.owner
				});
				databasePath = authority.databasePath;
				store = await openStore(authority);
				readConnections.use(store.retainReadConnection());
				if (borrowed && !legacyChild && (lease.version === 1 || !store.owns(lease, "executor")) && !(lease.version !== 1 && process.connected && store.acceptParentBoundExecutor(lease))) throw new UpdateCommandRecoveryPendingError("Managed update executor changed during admission.");
				assertCurrent();
				admittedAuthorities.set(fence, {
					authority,
					assertCurrent: assertBase,
					managedHandoff,
					runId,
					retainedRoot: serviceLease?.key
				});
				if (!borrowed && !legacyParent && lease.version === 2 && !lease.key.includes("/.openclaw-update-child-")) {
					originalFence = fence;
					cancellation.register(fence);
				}
				if (enterOptions?.preflight && !borrowed) preflightReleases.set(fence, () => {
					assertCurrent();
					if (!store || !lease || children.pending || slotLease) throw new UpdateCommandRecoveryPendingError("Preflight executor release failed.");
					retireFence();
					children.close();
					if (serviceLease && !store.release(serviceLease)) throw new UpdateCommandRecoveryPendingError("Preflight service owner release failed.");
					serviceLease = void 0;
					if (lease.version === 1 || !store.release(lease)) throw new UpdateCommandRecoveryPendingError("Preflight executor release failed.");
					lease = void 0;
					readConnections.dispose();
				});
				return finishAdmission();
			} };
			const operationOutcome = await runUpdateCommandExecutorOperation({
				operation: () => operation(executor),
				children
			});
			identityWarnings.flush();
			const outcome = cancellation.mergeOutcome(operationOutcome);
			retireFence();
			if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw new UpdateCommandRecoveryPendingError("Command cleanup is unconfirmed; update ownership remains retained.", { cause: outcome.error });
			try {
				if (serviceLease && store && !cancellation.successor && (serviceLease.version === 3 || !store.release(serviceLease))) throw new UpdateCommandRecoveryPendingError("Managed service executor release could not be confirmed.");
				if (legacyTarget && store && !store.release(legacyTarget)) throw new UpdateCommandRecoveryPendingError("Active package generation has not settled.");
				if (legacyChild && store && !store.release(legacyChild)) throw new UpdateCommandRecoveryPendingError("Legacy finalizer has not settled.");
				if (lease && store && (lease.version === 3 || !borrowed && lease.version === 1 || (!borrowed || slotLease) && !(cancellation.successor ? cancellation.successor.release(slotLease ? [slotLease] : []) : options?.legacyPackageParent && !borrowed && lease.version !== 1 ? releaseLegacyPackageUpdateParent(store, lease, slotLease ? [slotLease] : []) : store.releaseAll([...!borrowed && lease.version !== 1 ? [lease] : [], ...slotLease ? [slotLease] : []])))) throw new UpdateCommandRecoveryPendingError("Update executor release could not be confirmed.");
			} catch (cause) {
				if ("error" in outcome) throw new UpdateCommandRecoveryPendingError("Update failed and executor release remains pending", { cause: new AggregateError([outcome.error, cause], "Update executor cleanup failed", { cause: outcome.error }) });
				throw cause;
			}
			if ("error" in outcome) throw outcome.error;
			return outcome.result;
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	}, operationSignal));
}
//#endregion
export { assertUpdateRequesterContinuationOwner as a, requestUpdateCommandExecutorCancellation as c, reserveUpdateCommandExecutorSlot as d, withUpdateCommandExecutorChild as f, assertRetainedUpdateCommandRoot as i, requireUpdateCommandAcquisition as l, UpdateCommandRecoveryPendingError as m, withDelegatedUpdateCommandExecutor as n, captureUpdateCommandExecutorAuthority as o, UpdateActivationTimeoutError as p, createUpdateOperationDeadline as r, releaseUpdateCommandPreflightForHandoff as s, withUpdateCommandExecutor as t, requiresRetainedUpdateCommandOwner as u };
