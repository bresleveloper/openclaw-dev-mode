import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as UPDATE_ACTIVATION_TIMEOUT_REASON } from "./update-outcome-ZpL2Kt9B.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-B2RAsQsF.mjs";
import { n as resolveManagedUpdateLeaseDatabasePath, o as captureManagedUpdateLeaseDatabaseIdentity, t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-B6JBgh1M.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { n as awaitWithinDeadline, r as scheduleAbsoluteDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { D as resolveUpdateInstallRoot } from "./restart-sentinel-KM6PPxhT.mjs";
import { s as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-BWZUhXdG.mjs";
import { h as recordUpdateRunStep } from "./update-run-ledger-DE3m4CLB.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
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
//#region src/cli/update-cli/update-command-executor-children.ts
function childLineageDigest(original, spawner, parent, database, retained) {
	return createHash("sha256").update(JSON.stringify([
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
		] : [
			lease.key,
			lease.owner,
			lease.payload,
			lease.updatedAt
		]),
		...retained ? [[
			"retained-owner-v1",
			retained.key,
			retained.owner,
			retained.payload,
			retained.updatedAt
		]] : []
	])).digest("hex");
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
			const { store, parent, original, spawner, retainedParent, databasePath, databaseIdentity } = params.binding();
			if (!databaseIdentity) throw new UpdateCommandRecoveryPendingError("Native child requires its pinned lease database.");
			params.onStart?.(purpose);
			const candidateRoot = resolveUpdateInstallRoot(root);
			let candidateParent = parent;
			let acquiredParent = false;
			const children = [];
			let bound = false;
			delegating = true;
			const assertOwners = () => {
				params.assertBase();
				if (!store.current(candidateParent) || retainedParent && !store.current(retainedParent) || resolveUpdateInstallRoot(root) !== candidateParent.key) throw new UpdateCommandRecoveryPendingError("Update installation ownership changed.");
			};
			const running = async () => {
				let outcome;
				try {
					params.assertBase();
					if (retainedParent && candidateRoot === retainedParent.key) throw new UpdateCommandRecoveryPendingError("Retained service root is not a candidate executor.");
					if (candidateRoot !== parent.key) {
						const acquired = store.acquire(candidateRoot, randomUUID(), { kind: "update" });
						if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Another update executor owns the update installation.");
						candidateParent = acquired.lease;
						acquiredParent = true;
					}
					assertOwners();
					const parents = [...new Map([
						spawner,
						...retainedParent ? [retainedParent] : [],
						...candidateParent.key === original.key ? [] : [candidateParent]
					].map((owner) => [owner.key, owner])).values()];
					const candidateChildIndex = candidateParent.key === original.key ? 0 : parents.findIndex((owner) => owner.key === candidateParent.key);
					const childName = `${randomUUID()}-lineage-${childLineageDigest(original, spawner, candidateParent, databaseIdentity, retainedParent)}`;
					for (const childParent of parents) {
						const acquired = store.acquire(`${childParent.key}/.openclaw-update-child-${childName}`, params.runId, { kind: "update" }, false, original.version === 1 && childParent.key.startsWith(`${original.key}/.openclaw-update-child-`) ? original : void 0);
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
						...retainedParent ? {
							retainedParent,
							retainedChildKey: children[parents.findIndex((owner) => owner.key === retainedParent.key)].key
						} : {}
					};
					const result = await withCommandProcessScope(() => operation(grant, (pid, argv) => {
						assertOwners();
						if (bound || pid === process.pid) throw new UpdateCommandRecoveryPendingError("Update process can be bound only once.");
						for (let index = 0; index < children.length; index++) {
							const assigned = store.bind(children[index], pid, void 0, argv);
							if (!assigned) throw new UpdateCommandRecoveryPendingError("Update process binding failed.");
							children[index] = assigned;
						}
						bound = true;
					}));
					if (!bound) throw new UpdateCommandRecoveryPendingError("The update worker did not confirm startup.");
					assertOwners();
					outcome = { result };
				} catch (error) {
					outcome = { error };
				}
				if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) {
					admissionOpen = false;
					throw outcome.error;
				}
				try {
					for (let index = children.length - 1; index > 0; index--) if (!store.release(children[index])) throw new UpdateCommandRecoveryPendingError("The update process has not finished.");
					if (acquiredParent && (candidateParent.version === 1 || !store.release(candidateParent))) throw new UpdateCommandRecoveryPendingError("Update installation release failed.");
					if (children.length > 0 && !store.release(children[0])) throw new UpdateCommandRecoveryPendingError("The update process has not finished.");
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
				if (pending === work) pending = void 0;
			});
			return work;
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-executor-grant.ts
function resolveUpdateCommandChildBinding(grant, runId, root, onProcessIdentityWarning) {
	const retainedFields = Object.hasOwn(grant, "retainedParent") || Object.hasOwn(grant, "retainedChildKey");
	if (retainedFields && (!isRecord(grant.retainedParent) || typeof grant.retainedParent.key !== "string" || typeof grant.retainedChildKey !== "string")) throw new UpdateCommandRecoveryPendingError("Candidate retained owner pair is malformed.");
	const original = grant.originalParent ?? grant.parent;
	const spawner = grant.spawner ?? original;
	const childPrefix = `${original.key}/.openclaw-update-child-`;
	const childName = grant.childKey.slice(grant.childKey.lastIndexOf("/.openclaw-update-child-") + 24);
	const legacyGrant = !retainedFields && !grant.originalParent && !grant.spawner && !grant.originalChildKey && !grant.databaseIdentity && grant.childKey === `${grant.parent.key}/.openclaw-update-child-${childName}` && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(childName);
	const databaseIdentity = legacyGrant ? captureManagedUpdateLeaseDatabaseIdentity(grant.databasePath) : grant.databaseIdentity;
	const databasePath = databaseIdentity?.databasePath ?? grant.databasePath;
	const store = createManagedHandoffLeaseStore({
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
	const retained = retainedFields ? store.read(grant.retainedParent.key) : void 0;
	const retainedChild = retainedFields ? store.read(grant.retainedChildKey) : void 0;
	if (!Boolean(grant.originalParent && grant.databaseIdentity && grant.spawner && grant.originalChildKey && grant.originalChildKey === `${spawner.key}/.openclaw-update-child-${childName}` && (!retainedFields || grant.retainedChildKey === `${grant.retainedParent.key}/.openclaw-update-child-${childName}`) && grant.childKey === `${grant.parent.key === original.key ? spawner.key : grant.parent.key}/.openclaw-update-child-${childName}` && /^[0-9a-f-]{36}-lineage-[0-9a-f]{64}$/.test(childName) && childName.endsWith(`-lineage-${childLineageDigest(original, spawner, grant.parent, grant.databaseIdentity, grant.retainedParent)}`)) && !legacyGrant || retainedFields && (retained?.kind !== "current" || !isDeepStrictEqual(retained.lease, grant.retainedParent) || retained.lease.key === original.key || retained.lease.action.kind !== "update" || retained.lease.version === 3 || !isDeepStrictEqual(retained.lease.executor, original.executor) || !isDeepStrictEqual(retained.lease.helper, original.executor) || retainedChild?.kind !== "current" || retainedChild.lease.owner !== runId || retainedChild.lease.action.kind !== "update" || retainedChild.lease.version === 3 || !isDeepStrictEqual(retainedChild.lease.helper, spawner.executor)) || !legacyGrant && databasePath !== grant.databasePath || grant.runId !== runId || grant.root !== resolveUpdateInstallRoot(root) || parent.kind !== "current" || !parent.lease || !isDeepStrictEqual(parent.lease, grant.parent) || parent.lease.action.kind !== "update" || parent.lease.version === 3 || !store.current(original) || original.action.kind !== "update" || original.version === 3 || !store.current(spawner) || spawner.action.kind !== "update" || spawner.version === 3 || spawner.key !== original.key && (!spawner.key.startsWith(childPrefix) || spawner.owner !== runId) || process.ppid !== spawner.executor.pid || !(grant.originalChildKey ?? grant.childKey).startsWith(`${spawner.key}/.openclaw-update-child-`) || !grant.childKey.startsWith(`${parent.lease.key}/.openclaw-update-child-`) || originalChild.kind !== "current" || originalChild.lease.owner !== runId || originalChild.lease.action.kind !== "update" || originalChild.lease.version === 3 || !isDeepStrictEqual(originalChild.lease.helper, spawner.executor) || child.kind !== "current" || child.lease.owner !== runId || child.lease.action.kind !== "update" || child.lease.version === 3 || !isDeepStrictEqual(child.lease.helper, spawner.executor)) throw new UpdateCommandRecoveryPendingError("Candidate executor binding does not match its parent.");
	return {
		original,
		spawner,
		databaseIdentity,
		databasePath,
		store,
		parent: parent.lease,
		originalChild: originalChild.lease,
		child: child.lease,
		retained: retained?.kind === "current" ? retained.lease : void 0,
		retainedChild: retainedChild?.kind === "current" ? retainedChild.lease : void 0
	};
}
//#endregion
//#region src/cli/update-cli/update-command-executor-legacy.ts
/** Retire only this child's temporary bridge, after the lease owner proves no descendants remain. */
function releaseLegacyPackageUpdateParent(store, lease) {
	const settled = store.bind(lease, process.pid);
	return settled !== null && store.release(settled);
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
				const acquired = store.acquire(key, runId, { kind: "update" });
				if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Another update executor owns this installation.");
				lease = acquired.lease;
				const bound = store.bind(lease, parent.identity.pid);
				if (!bound) throw new UpdateCommandRecoveryPendingError("Legacy package parent binding failed.");
				lease = bound;
				if (!isDeepStrictEqual(lease.executor, parent.identity)) throw new UpdateCommandRecoveryPendingError("Legacy package parent identity changed.");
			}
		}
		const acquiredChild = store.acquire(`${lease.key}/.openclaw-update-child-${params.childName}`, runId, { kind: "update" }, false, lease.version === 1 ? lease : void 0);
		if (acquiredChild.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Legacy finalizer lifetime could not be acquired.");
		child = acquiredChild.lease;
		if (lease.key !== key) {
			if (!store.current(lease)) throw new UpdateCommandRecoveryPendingError("Legacy source generation changed.");
			const acquired = store.acquire(key, runId, { kind: "update" });
			if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Active package generation is already owned.");
			target = acquired.lease;
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
	let expire = () => {};
	const expired = new Promise((resolve) => {
		expire = (error) => resolve({ error });
	});
	const inspectDeadline = () => {
		if (!closed && !failure && admission && Date.now() >= admission.deadlineAtMs) {
			failure = admission.error;
			try {
				onExpired?.(failure);
			} catch (error) {
				failure.cause = error;
				failure.message += " Cancellation could not be requested completely.";
			} finally {
				controller.abort(failure);
				expire(failure);
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
		start(error, timeoutMs) {
			assertCurrent();
			if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error("Update operation requires a finite positive budget.");
			if (admission) return;
			admission = {
				error,
				timeoutMs,
				deadlineAtMs: Date.now() + timeoutMs
			};
			cancelDeadline = scheduleAbsoluteDeadline(admission.deadlineAtMs, inspectDeadline);
		},
		async run(operation) {
			return await withCommandProcessScope(async () => {
				assertCurrent();
				const work = Promise.resolve().then(operation).then((value) => ({ value }), (error) => ({ error }));
				try {
					const outcome = await Promise.race([work, expired]);
					inspectDeadline();
					const timeout = failure;
					if (timeout) {
						const joined = await awaitWithinDeadline(() => work, admission.deadlineAtMs + admission.timeoutMs);
						timeout.message += joined === ABSOLUTE_DEADLINE_EXPIRED ? " Cancellation did not settle within the same budget; outstanding writers retain update ownership." : " Cancellation settled before recovery.";
						if (joined !== ABSOLUTE_DEADLINE_EXPIRED && "error" in joined && hasCommandProcessCleanupError(joined.error)) throw new AggregateError([timeout, joined.error], "Update operation cleanup failed", { cause: timeout });
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
//#region src/cli/update-cli/update-command-executor.ts
const admittedAuthorities = /* @__PURE__ */ new WeakMap();
const admittedRunIds = /* @__PURE__ */ new WeakMap();
const retainedOwners = /* @__PURE__ */ new WeakMap();
function captureUpdateCommandExecutorAuthority(fence, runId) {
	fence.assertCurrent();
	const admitted = admittedAuthorities.get(fence);
	if (!admitted || runId !== void 0 && admittedRunIds.get(fence) !== runId) throw new UpdateCommandRecoveryPendingError("Package recovery requires its admitted executor.");
	return admitted.authority;
}
/** Requester checks also run while a bound child suspends its parent's mutation fence. */
function assertUpdateRequesterContinuationOwner(fence, runId) {
	const admitted = admittedAuthorities.get(fence);
	if (!admitted?.managedHandoff || admittedRunIds.get(fence) !== runId) throw new UpdateCommandRecoveryPendingError("Requester continuation requires its admitted Gateway update owner.");
	admitted.assertCurrent();
}
/** Compatibility requirement from a live admission, never a serialized claim. */
function requiresRetainedUpdateCommandOwner(fence) {
	captureUpdateCommandExecutorAuthority(fence);
	return retainedOwners.has(fence);
}
function assertRetainedUpdateCommandRoot(fence, root) {
	captureUpdateCommandExecutorAuthority(fence);
	if (retainedOwners.get(fence) !== resolveUpdateInstallRoot(root)) throw new UpdateCommandRecoveryPendingError("Service recovery requires its retained executor root.");
}
const preflightReleases = /* @__PURE__ */ new WeakMap();
function releaseUpdateCommandPreflightForHandoff(fence) {
	const release = preflightReleases.get(fence);
	if (!release) throw new UpdateCommandRecoveryPendingError("Update preflight handoff is not current.");
	release();
}
const childOwners = /* @__PURE__ */ new WeakMap();
async function withUpdateCommandExecutorChild(fence, root, operation, purpose) {
	const owner = childOwners.get(fence);
	if (!owner) throw new UpdateCommandRecoveryPendingError("Child continuation requires its live executor.");
	return await owner(root, operation, purpose);
}
/** A delegated executor retains both its original root and immediate spawner.
* Neither the transported grant nor a lease row without live identity grants effects. */
async function withDelegatedUpdateCommandExecutor(grant, runId, root, operation, options) {
	const activation = createUpdateOperationDeadline();
	return await activation.run(() => withCommandProcessScope(async () => {
		const identityWarnings = createUpdateIdentityWarningReporter(runId);
		const { original, spawner, databaseIdentity, databasePath, store, parent, originalChild, child, retained, retainedChild } = resolveUpdateCommandChildBinding(grant, runId, root, identityWarnings.warn);
		let active = true;
		const isLive = (identity) => store.isProcessIdentityCurrent(identity);
		if (!store.acceptParentBoundExecutor(originalChild) || !store.acceptParentBoundExecutor(child) || retainedChild && !store.acceptParentBoundExecutor(retainedChild)) throw new UpdateCommandRecoveryPendingError("The update process no longer has permission to continue.");
		const assertBase = () => {
			if (active || activation.failure) activation.assertCurrent();
			const checkedParents = [];
			const checkedReceivers = [];
			const parentIsCurrent = (lease) => {
				if (checkedParents.some((checked) => isDeepStrictEqual(checked, lease))) return true;
				if (!store.current(lease) || !isLive(lease.helper) || !isLive(lease.executor)) return false;
				checkedParents.push(lease);
				return true;
			};
			const receiverIsCurrent = (lease) => {
				if (checkedReceivers.some((checked) => isDeepStrictEqual(checked, lease))) return true;
				if (!store.owns(lease, "executor")) return false;
				checkedReceivers.push(lease);
				return true;
			};
			if (!active || !parentIsCurrent(original) || !parentIsCurrent(parent) || !parentIsCurrent(spawner) || !receiverIsCurrent(originalChild) || !receiverIsCurrent(child) || retained && (!retainedChild || !parentIsCurrent(retained) || !receiverIsCurrent(retainedChild))) throw new UpdateCommandRecoveryPendingError("The update process no longer has permission to continue.");
		};
		const owner = createChildOwner({
			runId,
			binding: () => ({
				store,
				parent,
				original,
				spawner: originalChild,
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
		const meta = await readControlPlaneUpdateSentinelMeta();
		assertBase();
		const managedHandoff = original.version !== 1 && original.helper.pid !== original.executor.pid && meta?.runId === runId && meta.handoffId === original.owner && meta.root !== void 0 && resolveUpdateInstallRoot(meta.root) === original.key;
		childOwners.set(fence, (childRoot, childOperation, purpose) => owner.run(childRoot, childOperation, purpose));
		try {
			return await withCommandProcessScope(async () => {
				let outcome;
				try {
					fence.assertCurrent();
					if (databaseIdentity) {
						admittedRunIds.set(fence, runId);
						admittedAuthorities.set(fence, {
							authority: Object.freeze({
								...databaseIdentity,
								installKey: original.key,
								owner: original.owner
							}),
							assertCurrent: assertBase,
							managedHandoff
						});
					}
					if (retained) retainedOwners.set(fence, retained.key);
					if (options) activation.start(new UpdateActivationTimeoutError(root, options.activationTimeoutMs), options.activationTimeoutMs);
					outcome = { result: await operation(fence) };
				} catch (error) {
					outcome = { error };
				}
				owner.close();
				try {
					await owner.settle();
					fence.assertCurrent();
					identityWarnings.flush();
				} catch (cause) {
					outcome = { error: "error" in outcome && outcome.error !== cause ? new AggregateError([outcome.error, cause], "Unable to finish stopping the update process and its children", { cause }) : cause };
				}
				if ("error" in outcome) throw outcome.error;
				return outcome.result;
			});
		} finally {
			active = false;
			childOwners.delete(fence);
			admittedAuthorities.delete(fence);
			admittedRunIds.delete(fence);
			retainedOwners.delete(fence);
		}
	}, activation.signal));
}
/**
* Reuse the native handoff owner for direct invocations too. Its database is
* outside the canonical state family, so checking this fence never opens a
* displaced/migrated source. Physical source exclusion remains a separate duty.
*/
async function withUpdateCommandExecutor(runId, operation, options) {
	const activation = createUpdateOperationDeadline();
	return await activation.run(() => withCommandProcessScope(async () => {
		let active = true;
		let entering = false;
		let databasePath;
		let store;
		let lease;
		let borrowed = false;
		let managedHandoff = false;
		let serviceLease;
		let serviceKey;
		let admissionComplete = false;
		let legacyChild;
		let legacyTarget;
		const identityWarnings = createUpdateIdentityWarningReporter(runId);
		const assertBase = () => {
			if (active || activation.failure) activation.assertCurrent();
			if (!active || !admissionComplete || !store || !lease || serviceLease && !store.owns(serviceLease, "executor") || legacyTarget && !store.owns(legacyTarget, "executor") || (legacyChild ? !store.current(lease) || lease.executor.pid !== process.ppid || !store.isProcessIdentityCurrent(lease.helper) || !store.isProcessIdentityCurrent(lease.executor) || !store.owns(legacyChild, "executor") : lease.version === 1 || !store.owns(lease, "executor"))) throw new UpdateCommandRecoveryPendingError("Update executor ownership is no longer current.");
		};
		const assertCurrent = () => {
			assertBase();
			if (lease?.version === 3 || serviceLease?.version === 3) throw new UpdateCommandRecoveryPendingError("Parent executor has unresolved native custody.");
			children.assertIdle();
		};
		const fence = { assertCurrent };
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
		const executor = { async enter(root, enterOptions) {
			if (active || activation.failure) activation.assertCurrent();
			if (!active || entering) throw new UpdateCommandRecoveryPendingError("Update executor admission is closed or busy.");
			const key = options?.existingAuthority?.installKey ?? resolveUpdateInstallRoot(root);
			if (options?.existingAuthority && root !== key) throw new UpdateCommandRecoveryPendingError("Recovery installation key changed.");
			const requestedServiceKey = enterOptions?.serviceRoot ? resolveUpdateInstallRoot(enterOptions.serviceRoot) : void 0;
			const distinctServiceKey = requestedServiceKey === key ? void 0 : requestedServiceKey;
			if (options?.existingAuthority && distinctServiceKey) throw new UpdateCommandRecoveryPendingError("Recovery cannot acquire a new service root.");
			if (lease) {
				assertCurrent();
				identityWarnings.flush();
				if ((legacyTarget ?? lease).key !== key || serviceKey !== distinctServiceKey) throw new UpdateCommandRecoveryPendingError("Update executor installation changed.");
				if (!enterOptions?.preflight) preflightReleases.delete(fence);
				if (enterOptions?.activationTimeoutMs !== void 0) activation.start(new UpdateActivationTimeoutError(key, enterOptions.activationTimeoutMs), enterOptions.activationTimeoutMs);
				return fence;
			}
			entering = true;
			try {
				databasePath = options?.existingAuthority?.databasePath ?? resolveManagedUpdateLeaseDatabasePath();
				const existingIdentity = options?.existingAuthority ?? (options?.legacyPackageHandoff ? captureManagedUpdateLeaseDatabaseIdentity(databasePath) : void 0);
				databasePath = existingIdentity?.databasePath ?? databasePath;
				store = createManagedHandoffLeaseStore({
					databasePath,
					serviceManagerEnv: resolveServiceManagerEnv(),
					existingIdentity,
					onProcessIdentityWarning: identityWarnings.warn
				});
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
					const { isCurrentManagedServiceUpdateHandoffProcess } = await import("./update-managed-service-handoff-B8Mr7hKl.mjs");
					const handedOff = await isCurrentManagedServiceUpdateHandoffProcess({
						root: key,
						runId
					});
					if (!active || !handedOff || found.lease.action.kind !== "update" || !store.owns(found.lease, "executor") && !(process.connected && store.acceptParentBoundExecutor(found.lease))) throw new UpdateCommandRecoveryPendingError("Managed update executor changed during admission.");
					lease = found.lease;
					borrowed = true;
					managedHandoff = true;
				} else {
					const acquired = store.acquire(key, randomUUID(), { kind: "update" });
					if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Another update executor owns this installation.");
					lease = acquired.lease;
				}
				serviceKey = distinctServiceKey;
				if (serviceKey) {
					const acquired = store.acquire(serviceKey, randomUUID(), { kind: "update" });
					if (acquired.kind !== "acquired") throw new UpdateCommandRecoveryPendingError("Another update executor owns the managed service installation.");
					serviceLease = acquired.lease;
				}
				admissionComplete = true;
				assertCurrent();
				const authority = Object.freeze({
					...existingIdentity ?? captureManagedUpdateLeaseDatabaseIdentity(databasePath),
					installKey: lease.key,
					owner: lease.owner
				});
				databasePath = authority.databasePath;
				store = createManagedHandoffLeaseStore({
					databasePath,
					serviceManagerEnv: resolveServiceManagerEnv(),
					existingIdentity: authority,
					onProcessIdentityWarning: identityWarnings.warn
				});
				if (borrowed && !legacyChild && (lease.version === 1 || !store.owns(lease, "executor")) && !(lease.version !== 1 && process.connected && store.acceptParentBoundExecutor(lease))) throw new UpdateCommandRecoveryPendingError("Managed update executor changed during admission.");
				assertCurrent();
				admittedAuthorities.set(fence, {
					authority,
					assertCurrent: assertBase,
					managedHandoff
				});
				admittedRunIds.set(fence, runId);
				if (serviceLease) retainedOwners.set(fence, serviceLease.key);
				if (enterOptions?.preflight && !borrowed) preflightReleases.set(fence, () => {
					assertCurrent();
					if (!store || !lease || children.pending) throw new UpdateCommandRecoveryPendingError("Preflight executor release failed.");
					active = false;
					children.close();
					childOwners.delete(fence);
					admittedAuthorities.delete(fence);
					admittedRunIds.delete(fence);
					retainedOwners.delete(fence);
					preflightReleases.delete(fence);
					if (serviceLease) {
						if (!store.release(serviceLease)) throw new UpdateCommandRecoveryPendingError("Preflight service owner release failed.");
						serviceLease = void 0;
					}
					if (lease.version === 1 || !store.release(lease)) throw new UpdateCommandRecoveryPendingError("Preflight executor release failed.");
					lease = void 0;
				});
				if (enterOptions?.activationTimeoutMs !== void 0) activation.start(new UpdateActivationTimeoutError(key, enterOptions.activationTimeoutMs), enterOptions.activationTimeoutMs);
				return fence;
			} finally {
				entering = false;
			}
		} };
		let outcome;
		try {
			outcome = { result: await withCommandProcessScope(async () => {
				let operationOutcome;
				try {
					operationOutcome = { result: await operation(executor) };
				} catch (cause) {
					operationOutcome = { error: cause instanceof Error ? cause : new Error("Update execution failed", { cause }) };
				}
				children.close();
				try {
					await children.settle();
					if ("result" in operationOutcome) {
						if (lease) assertCurrent();
						identityWarnings.flush();
					}
				} catch (cause) {
					operationOutcome = { error: "error" in operationOutcome && operationOutcome.error !== cause ? new AggregateError([operationOutcome.error, cause], "Update cleanup failed", { cause }) : cause instanceof Error ? cause : new Error("Update settlement failed", { cause }) };
				}
				if ("error" in operationOutcome) throw operationOutcome.error;
				return operationOutcome.result;
			}) };
		} catch (cause) {
			outcome = { error: cause instanceof Error ? cause : new Error("Update execution failed", { cause }) };
		}
		active = false;
		preflightReleases.delete(fence);
		childOwners.delete(fence);
		admittedAuthorities.delete(fence);
		admittedRunIds.delete(fence);
		retainedOwners.delete(fence);
		if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw new UpdateCommandRecoveryPendingError("Command cleanup is unconfirmed; update ownership remains retained.", { cause: outcome.error });
		try {
			if (serviceLease && store && (serviceLease.version === 3 || !store.release(serviceLease))) throw new UpdateCommandRecoveryPendingError("Managed service executor release could not be confirmed.");
			if (legacyTarget && store && !store.release(legacyTarget)) throw new UpdateCommandRecoveryPendingError("Active package generation has not settled.");
			if (legacyChild && store && !store.release(legacyChild)) throw new UpdateCommandRecoveryPendingError("Legacy finalizer has not settled.");
			if (lease && store && (lease.version === 3 || !borrowed && (lease.version === 1 || !(options?.legacyPackageParent ? releaseLegacyPackageUpdateParent(store, lease) : store.release(lease))))) throw new UpdateCommandRecoveryPendingError("Update executor release could not be confirmed.");
		} catch (cause) {
			if ("error" in outcome) throw new UpdateCommandRecoveryPendingError("Update failed and executor release remains pending", { cause: new AggregateError([outcome.error, cause], "Update executor cleanup failed", { cause: outcome.error }) });
			throw cause;
		}
		if ("error" in outcome) throw outcome.error;
		return outcome.result;
	}, activation.signal));
}
//#endregion
export { requiresRetainedUpdateCommandOwner as a, withUpdateCommandExecutorChild as c, UpdateCommandRecoveryPendingError as d, releaseUpdateCommandPreflightForHandoff as i, createUpdateOperationDeadline as l, assertUpdateRequesterContinuationOwner as n, withDelegatedUpdateCommandExecutor as o, captureUpdateCommandExecutorAuthority as r, withUpdateCommandExecutor as s, assertRetainedUpdateCommandRoot as t, UpdateActivationTimeoutError as u };
