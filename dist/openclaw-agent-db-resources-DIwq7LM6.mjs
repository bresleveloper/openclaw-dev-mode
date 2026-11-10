import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as registerAgentDatabaseReaderCloser, s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { a as isSameOpenClawAgentDatabasePath, c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/agent-creation-claim.ts
const creationClaim = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaim"), () => new AsyncLocalStorage());
const creationResources = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaimResources"), () => /* @__PURE__ */ new Map());
/** Runs creation-owned staging that may write the recreated identity's databases. */
async function runWithAgentCreationClaim(target, run) {
	let active = true;
	const closers = /* @__PURE__ */ new Set();
	let pendingClose;
	const closeHandles = () => {
		pendingClose ??= (async () => {
			const errors = [];
			for (const close of [...closers].toReversed()) try {
				await close();
				closers.delete(close);
			} catch (error) {
				errors.push(error);
			}
			return errors;
		})().finally(() => {
			pendingClose = void 0;
		});
		return pendingClose;
	};
	const scope = {
		kind: "host",
		agentId: normalizeAgentId(target.agentId),
		statePath: path.resolve(resolveOpenClawStateSqlitePath(target.env ?? process.env)),
		isActive: () => active,
		registerClose: (close) => {
			if (!active) throw new Error("Agent creation claim is no longer active.");
			closers.add(close);
		},
		retryClose: async () => {
			if (active) throw new Error("Agent database belongs to an active agent creation claim.");
			await pendingClose;
			const errors = await closeHandles();
			if (errors.length > 0) throw new AggregateError(errors, "Agent creation database close retry failed.");
		}
	};
	return await creationClaim.run(scope, async () => {
		let outcome;
		const closeErrors = [];
		try {
			for (const previous of new Set(creationResources.values())) if (previous.agentId === scope.agentId && previous.statePath === scope.statePath) await previous.retryClose();
			outcome = ok(await run());
		} catch (error) {
			outcome = err(error);
		} finally {
			active = false;
			closeErrors.push(...await closeHandles());
		}
		if (!outcome.ok) throw closeErrors.length > 0 ? new AggregateError([outcome.error, ...closeErrors], "Agent creation claim failed.") : outcome.error;
		if (closeErrors.length > 0) throw closeErrors.length === 1 ? closeErrors[0] : new AggregateError(closeErrors, "Agent creation claim failed.");
		return outcome.value;
	});
}
function getActiveAgentCreationClaim(agentId, statePath) {
	const scope = creationClaim.getStore();
	if (!scope || scope.kind !== "host" || !scope.isActive() || scope.agentId !== normalizeAgentId(agentId) || scope.statePath !== path.resolve(statePath)) return;
	return scope;
}
/** The identity the live creation scope may admit beneath its own completed deletion record. */
function resolveAgentCreationClaimAgentId(claimAgentId, statePath) {
	const scope = creationClaim.getStore();
	if (scope && scope.kind === "worker" && scope.agentId === normalizeAgentId(claimAgentId) && scope.statePath === path.resolve(statePath)) {
		scope.assertCurrent();
		return scope.agentId;
	}
	return getActiveAgentCreationClaim(claimAgentId, statePath)?.agentId;
}
/** The transport carries identity; the retained host scope remains the authority. */
function captureAgentCreationClaim(options) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (!scope) return;
	return {
		witness: {
			agentId: scope.agentId,
			statePath: scope.statePath
		},
		assertCurrent() {
			if (!scope.isActive() || creationClaim.getStore() !== scope) throw new Error("Agent database belongs to an active agent creation claim.");
		}
	};
}
/** Native admission borrows the host claim; its executor already owns native cleanup. */
function withAgentCreationClaimWitness(witness, assertCurrent, run) {
	if (isMainThread) throw new Error("Agent creation witnesses require their native worker");
	assertCurrent();
	return creationClaim.run({
		kind: "worker",
		...witness,
		assertCurrent
	}, run);
}
/** Hold pending native custody until publication hands it to the handle, or disposal succeeds. */
function reserveAgentCreationClaimAdmission(admission, options, close) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (!scope) return;
	creationResources.set(admission, scope);
	scope.registerClose(async () => {
		if (creationResources.get(admission) !== scope) return;
		await close();
		creationResources.delete(admission);
	});
	return () => {
		creationResources.delete(admission);
	};
}
/** Tag a freshly opened handle as owned by the live creation scope for its identity. */
function registerAgentCreationClaimHandle(database, options) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (scope) creationResources.set(database, scope);
	return scope;
}
/** Refuse a creation-owned handle to every caller outside that same live scope. */
function assertAgentCreationClaimAccess(database, options) {
	assertAgentCreationClaimCurrent(options);
	const owner = creationResources.get(database);
	if (!owner) return;
	if (owner !== getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env))) throw new Error("Agent database belongs to an active agent creation claim.");
}
/** A retained admission must stop before resuming native work after settlement. */
function assertAgentCreationClaimCurrent(options) {
	const scope = creationClaim.getStore();
	if (scope && scope.kind === "host" && !scope.isActive() && scope.agentId === normalizeAgentId(options.agentId) && scope.statePath === path.resolve(resolveOpenClawStateSqlitePath(options.env ?? process.env))) throw new Error("Agent creation claim is no longer active.");
}
/** A different spelling or state root must not borrow a creation-owned physical store. */
function assertAgentCreationClaimAliases(options) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	for (const owned of creationResources.keys()) if (isSameOpenClawAgentDatabasePath(owned.path, pathname)) assertAgentCreationClaimAccess(owned, options);
}
/** Release the tag once the native owner has closed the handle. */
function releaseAgentCreationClaimHandle(database) {
	creationResources.delete(database);
}
//#endregion
//#region src/state/agent-database-admission-error.ts
/** A database owner refused new work; an admitted command's failure is never classified here. */
const AgentDatabaseExecutionAdmissionClosedError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseExecutionAdmissionClosedError"), () => class AdmissionClosedError extends Error {});
/** A receipt lost its publication race; fresh admission can obtain current proof. */
const AgentDatabaseSchemaAdmissionChangedError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionChangedError"), () => class SchemaAdmissionChangedError extends Error {
	constructor() {
		super("Agent schema admission changed before publication; retry the operation");
	}
});
const AgentDatabaseSchemaAdmissionInvalidError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionInvalidError"), () => class SchemaAdmissionInvalidError extends Error {
	constructor() {
		super("Invalid agent schema admission receipt");
	}
});
//#endregion
//#region src/state/agent-deletion-cleanup.ts
const databaseCleanup = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanup"), () => new AsyncLocalStorage());
const cleanupHandles = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupHandles"), () => /* @__PURE__ */ new Map());
const cleanupExecutions = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupExecutions"), () => /* @__PURE__ */ new Map());
/** The lifecycle owner supplies live closures, never a transferable operation id. */
function createAgentDeletionDatabaseCleanup(owner) {
	return async (target, run) => {
		const targetAgentId = normalizeAgentId(target.agentId);
		const targetPath = path.resolve(target.path);
		const targetIdentity = readDatabasePathIdentitySync(targetPath);
		const assertTargetCurrent = () => {
			const current = readDatabasePathIdentitySync(targetPath);
			if (current.key !== targetIdentity.key || current.birthtime !== targetIdentity.birthtime || current.canonicalPath !== targetIdentity.canonicalPath) throw new Error("Agent deletion database target changed before cleanup");
		};
		const runCleanup = async (worker) => {
			let active = true;
			const closers = /* @__PURE__ */ new Set();
			const closeHandles = async () => {
				const errors = [];
				for (const close of [...closers].toReversed()) try {
					await close();
					closers.delete(close);
				} catch (error) {
					errors.push(error);
				}
				if (errors.length === 0) cleanupExecutions.delete(scope);
				return errors;
			};
			const assertActive = () => {
				if (!active) throw new Error("Agent deletion database cleanup is no longer active.");
				assertTargetCurrent();
			};
			const assertCurrentAsync = async () => {
				assertActive();
				if (worker && owner.assertCurrentAsync) {
					await owner.assertCurrentAsync();
					assertActive();
					worker.lease.assertCurrent();
				} else owner.assertCurrent();
			};
			const scope = {
				agentId: targetAgentId,
				ownsDatabase: targetAgentId === normalizeAgentId(owner.agentId),
				path: targetPath,
				canonicalPath: targetIdentity.canonicalPath,
				statePath: path.resolve(owner.statePath),
				worker,
				assertCurrentHost: () => {
					assertActive();
					if (worker) {
						worker.lease.assertCurrent();
						owner.workerAuthority.assertCurrentHost();
					} else owner.assertCurrent();
				},
				assertCurrent: () => {
					assertActive();
					owner.assertCurrent();
				},
				assertJournal: (statePath, entries) => {
					assertActive();
					return owner.assertJournal(statePath, entries);
				},
				registerClose: (close) => {
					assertActive();
					closers.add(close);
				},
				retryClose: async () => {
					if (active) throw new Error("Agent database belongs to an active deletion cleanup.");
					const errors = await closeHandles();
					if (errors.length > 0) throw new AggregateError(errors, "Agent deletion database close retry failed.");
				},
				withCommit: (commit) => {
					assertActive();
					owner.withCommit(commit);
				}
			};
			return await databaseCleanup.run(scope, async () => {
				let outcome;
				const closeErrors = [];
				try {
					await assertCurrentAsync();
					for (const previous of /* @__PURE__ */ new Set([...cleanupHandles.values(), ...cleanupExecutions.values()])) if (previous.statePath === scope.statePath && previous.agentId === scope.agentId && previous.path === scope.path) {
						await previous.retryClose();
						await assertCurrentAsync();
					}
					await owner.assertAdmission();
					scope.assertCurrentHost();
					if (scope.ownsDatabase) cleanupExecutions.set(scope, scope);
					const value = await run();
					active = false;
					outcome = ok(value);
				} catch (error) {
					outcome = err(error);
				} finally {
					active = false;
					closeErrors.push(...await closeHandles());
				}
				if (!outcome.ok) throw closeErrors.length > 0 ? new AggregateError([outcome.error, ...closeErrors], "Agent deletion database cleanup failed.") : outcome.error;
				if (closeErrors.length > 0) throw closeErrors.length === 1 ? closeErrors[0] : new AggregateError(closeErrors, "Agent deletion database cleanup failed.");
				if (worker && owner.assertCurrentAsync) await owner.assertCurrentAsync();
				else owner.assertCurrent();
				assertTargetCurrent();
				return outcome.value;
			});
		};
		return owner.workerAuthority ? owner.workerAuthority.runWithLeaseAdmission((lease, guard) => runCleanup({
			lease,
			guard
		})) : runCleanup();
	};
}
/** The canonical agent executor owns native close and settlement in its worker. */
function withAgentDeletionWorkerDatabaseCleanup(owner, run) {
	return databaseCleanup.run({
		...owner,
		workerOwned: true,
		assertCurrentHost: owner.assertCurrent,
		registerClose: () => {},
		retryClose: async () => {}
	}, run);
}
function getAgentDeletionDatabaseCleanup(params) {
	const scope = databaseCleanup.getStore();
	if (!scope) return;
	const pathname = resolveOpenClawAgentSqlitePath(params);
	if (scope.agentId !== normalizeAgentId(params.agentId) || scope.path !== pathname && scope.canonicalPath !== pathname) return;
	const statePath = params.statePath ?? resolveOpenClawStateSqlitePath(params.env ?? process.env);
	if (scope.statePath !== path.resolve(statePath)) throw new Error("Agent deletion database cleanup belongs to another state database.");
	return scope;
}
/** Resource registration captures only the cleanup scope that admitted this target. */
function captureAgentDeletionResourceOwner(matches) {
	const scope = databaseCleanup.getStore();
	if (!scope?.ownsDatabase || !matches(scope) && (!scope.canonicalPath || !matches({
		agentId: scope.agentId,
		path: scope.canonicalPath
	}))) return;
	scope.assertCurrentHost();
	return scope;
}
function assertAgentDeletionDatabaseCleanupAccess(database, options) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	const owner = cleanupHandles.get(database);
	if (owner && owner !== scope) throw new Error("Agent database belongs to an active deletion cleanup.");
	scope?.assertCurrent();
}
function assertAgentDeletionCleanupAliases(options, isSamePath) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	for (const owned of cleanupHandles.keys()) if (isSamePath(owned.path, pathname)) assertAgentDeletionDatabaseCleanupAccess(owned, options);
	for (const scope of cleanupExecutions.values()) if (isSamePath(scope.path, pathname) && getAgentDeletionDatabaseCleanup(options) !== scope) throw new Error("Agent database belongs to an active deletion cleanup.");
}
function assertAgentDeletionExecutionCleanupAccess(execution, options) {
	const owner = cleanupExecutions.get(execution);
	const scope = getAgentDeletionDatabaseCleanup(options);
	if (owner && owner !== scope) throw new Error("Agent database belongs to an active deletion cleanup.");
	scope?.assertCurrentHost();
}
/** Only a newly created executor belongs to cleanup; borrowing never transfers ownership. */
function registerAgentDeletionExecutionCleanup(execution, options, close) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	if (!scope?.worker || !scope.ownsDatabase) return;
	scope.assertCurrentHost();
	if (cleanupExecutions.get(execution) === scope) return;
	cleanupExecutions.set(execution, scope);
	scope.registerClose(async () => {
		await close();
		cleanupExecutions.delete(execution);
	});
}
function registerAgentDeletionDatabaseCleanup(database, options) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	scope?.assertCurrent();
	if (!scope?.ownsDatabase || scope.workerOwned) return;
	cleanupHandles.set(database, scope);
	return scope;
}
/** Release the tag only after the native owner has closed and released its lease. */
function releaseAgentDeletionDatabaseCleanup(database) {
	cleanupHandles.delete(database);
}
//#endregion
//#region src/state/openclaw-agent-db-resources.ts
const resources = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseAsyncResources"), () => ({
	active: /* @__PURE__ */ new Set(),
	closing: /* @__PURE__ */ new Map(),
	selections: /* @__PURE__ */ new Map()
}));
/** CLI cleanup can skip loading native database owners when no Worker was admitted. */
function hasOpenClawAgentDatabaseAsyncResources() {
	return resources.active.size > 0 || resources.closing.size > 0;
}
/** Observe an existing full close without revoking resources or selecting a successor. */
function captureAgentDatabaseCloseFence(target) {
	const owned = {
		agentId: normalizeAgentId(target.agentId),
		path: path.resolve(target.path)
	};
	const pending = [...resources.selections].flatMap(([selection, completion]) => matchesAgentDatabaseClose(selection, owned) ? [completion] : []);
	return pending.length ? Promise.all(pending).then(() => void 0) : void 0;
}
registerAgentDatabaseReaderCloser(async (candidates, retainedPaths) => {
	const errors = (await Promise.allSettled([.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => !retainedPaths?.has(path.resolve(resource.path)) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.path))).map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Agent database resource cleanup failed");
});
function matchesAgentDatabaseClose(selection, resource) {
	return (selection.path === void 0 || selection.path === resource.path || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.path)) && (selection.rootPath === void 0 || isPathInside(selection.rootPath, resource.path) || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.rootPath)) && (selection.agentId === void 0 || resource.ownership === "unresolved" || selection.agentId === resource.agentId);
}
/** Register before admitting a Worker; revocation is synchronous, native drainage is joined. */
function registerOpenClawAgentDatabaseAsyncResource(resource, creationOptions) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "known",
		agentId: normalizeAgentId(resource.agentId)
	}, creationOptions);
}
/** Native readers close synchronously, so successful retirement leaves no asynchronous barrier. */
function registerOpenClawAgentDatabaseSyncResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "known",
		agentId: normalizeAgentId(resource.agentId),
		close: async () => resource.close(),
		closeSync: resource.close
	});
}
/** Retain discovery until the known owner is registered, then release this candidate. */
function registerOpenClawAgentDatabaseReadCandidateResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "unresolved"
	});
}
function registerAgentDatabaseResource(resource, creationOptions) {
	const owned = {
		...resource,
		path: path.resolve(resource.path)
	};
	owned.cleanupOwner = captureAgentDeletionResourceOwner((target) => matchesAgentDatabaseClose(target, owned));
	assertAgentDatabaseResourceAdmission(owned);
	const releaseCreation = creationOptions && owned.ownership === "known" ? reserveAgentCreationClaimAdmission(owned, creationOptions, () => closeAgentDatabaseResource(owned)) : void 0;
	const unregister = () => {
		resources.active.delete(owned);
		releaseCreation?.();
	};
	getOpenClawDatabaseMaintenanceScope()?.own(unregister, "agent-resources", () => closeAgentDatabaseResource(owned));
	resources.active.add(owned);
	return unregister;
}
/** Fresh native opens and resource registrations share the same close custody. */
function assertAgentDatabaseResourceAdmission(owned) {
	if ([...resources.selections.keys()].some((selection) => matchesAgentDatabaseClose(selection, owned)) || [...resources.closing.keys()].some((closing) => (closing.path === owned.path || closing.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(closing, owned.path) || owned.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(owned, closing.path)) && (closing.ownership === "unresolved" || owned.ownership === "unresolved" || closing.agentId === owned.agentId))) throw new AgentDatabaseExecutionAdmissionClosedError(`Agent database resources are closing: ${owned.path}`);
}
function closeAgentDatabaseResource(resource, onCloseError) {
	if (resource.ownership === "known" && resource.closeSync) {
		resources.closing.set(resource, void 0);
		try {
			resource.revoke();
			resource.closeSync();
			resources.active.delete(resource);
			resources.closing.delete(resource);
			return Promise.resolve();
		} catch (error) {
			if (onCloseError) onCloseError(resource.path, error);
			const failed = Promise.reject(toErrorObject(error, "Agent database cleanup failed"));
			failed.catch(() => {});
			return failed;
		}
	}
	let operation = resources.closing.get(resource);
	if (!operation) {
		operation = Promise.resolve().then(() => resource.close());
		resources.closing.set(resource, operation);
		operation.then(() => {
			resources.active.delete(resource);
			resources.closing.delete(resource);
		}, () => {
			resources.closing.set(resource, void 0);
		}).catch(() => {});
	}
	if (onCloseError) operation.catch((error) => onCloseError(resource.path, error)).catch(() => {});
	resource.revoke();
	return operation;
}
function revokeAgentDatabaseResources(selection, onCloseError) {
	const closing = /* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()]);
	const pending = [];
	for (const resource of closing) {
		if (!matchesAgentDatabaseClose(selection, resource)) continue;
		pending.push(closeAgentDatabaseResource(resource, onCloseError));
	}
	return pending;
}
async function drainAgentDatabaseResources(selection, closeNative, cleanupOwner) {
	return withAgentDatabaseCloseFence(selection, async () => {
		const selected = [.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => matchesAgentDatabaseClose(selection, resource) && (!cleanupOwner || resource.cleanupOwner === cleanupOwner));
		const nativeOwners = selected.filter((resource) => resource.retireAfterResources);
		for (const resource of nativeOwners) {
			if (!resources.closing.has(resource)) resources.closing.set(resource, void 0);
			resource.revoke();
		}
		const errors = (await Promise.allSettled(selected.filter((resource) => !resource.retireAfterResources).map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length > 0) throw new AggregateError(errors, "Agent database resource drainage failed");
		const nativeErrors = (await Promise.allSettled(nativeOwners.map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (nativeErrors.length > 0) throw new AggregateError(nativeErrors, "Agent database native retirement failed");
		return closeNative();
	});
}
/** Keep the complete selection fenced while its physical databases retire independently. */
async function withAgentDatabaseCloseFence(selection, close) {
	const ownedSelection = { ...selection };
	const completion = createDeferredCore();
	completion.promise.catch(() => {});
	resources.selections.set(ownedSelection, completion.promise);
	try {
		const result = await close([.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => matchesAgentDatabaseClose(ownedSelection, resource)).map((resource) => resource.path));
		completion.resolve();
		return result;
	} catch (error) {
		completion.reject(error);
		throw error;
	} finally {
		resources.selections.delete(ownedSelection);
	}
}
//#endregion
export { resolveAgentCreationClaimAgentId as A, assertAgentCreationClaimAccess as C, registerAgentCreationClaimHandle as D, captureAgentCreationClaim as E, withAgentCreationClaimWitness as M, releaseAgentCreationClaimHandle as O, AgentDatabaseSchemaAdmissionInvalidError as S, assertAgentCreationClaimCurrent as T, registerAgentDeletionExecutionCleanup as _, matchesAgentDatabaseClose as a, AgentDatabaseExecutionAdmissionClosedError as b, registerOpenClawAgentDatabaseSyncResource as c, assertAgentDeletionCleanupAliases as d, assertAgentDeletionDatabaseCleanupAccess as f, registerAgentDeletionDatabaseCleanup as g, getAgentDeletionDatabaseCleanup as h, hasOpenClawAgentDatabaseAsyncResources as i, runWithAgentCreationClaim as j, reserveAgentCreationClaimAdmission as k, revokeAgentDatabaseResources as l, createAgentDeletionDatabaseCleanup as m, captureAgentDatabaseCloseFence as n, registerOpenClawAgentDatabaseAsyncResource as o, assertAgentDeletionExecutionCleanupAccess as p, drainAgentDatabaseResources as r, registerOpenClawAgentDatabaseReadCandidateResource as s, assertAgentDatabaseResourceAdmission as t, withAgentDatabaseCloseFence as u, releaseAgentDeletionDatabaseCleanup as v, assertAgentCreationClaimAliases as w, AgentDatabaseSchemaAdmissionChangedError as x, withAgentDeletionWorkerDatabaseCleanup as y };
