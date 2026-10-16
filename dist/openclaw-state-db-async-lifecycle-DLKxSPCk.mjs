import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { a as inspectDatabasePathIdentitySync, i as findChangedDatabasePaths, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-state-maintenance-context.ts
const liveAuthorityReads = resolveGlobalSingleton(Symbol.for("openclaw.maintenanceLiveAuthorityReads"), () => /* @__PURE__ */ new WeakMap());
function allowsMaintenanceLiveAuthorityReads(scope, pathname) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(pathname);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (liveAuthorityReads.get(current)?.has(canonicalPath)) return true;
	return false;
}
/** Raw source descriptor closes are safe only before maintenance admits native source reads. */
function maintenanceOwnerHasSourceCustody(scope, pathname) {
	if (!scope?.ownsSchemaMaintenance) return false;
	scope.assertReadAdmission();
	return !allowsMaintenanceLiveAuthorityReads(scope, pathname);
}
const MAINTENANCE_IN_PROCESS_COPY_MAX_BYTES = 67108864;
function maintenanceOwnerMayCopySourcesInProcess(scope, pathname) {
	if (!maintenanceOwnerHasSourceCustody(scope, pathname)) return false;
	let bytes = 0;
	for (const suffix of [
		"",
		"-wal",
		"-shm",
		"-journal"
	]) {
		bytes += fs.statSync(`${pathname}${suffix}`, { throwIfNoEntry: false })?.size ?? 0;
		if (bytes > MAINTENANCE_IN_PROCESS_COPY_MAX_BYTES) return false;
	}
	return true;
}
const maintenanceResources = resolveGlobalSingleton(Symbol.for("openclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getOpenClawDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
/** Doctor selects live source reads only after its pre-mutation backup boundary. */
function admitOpenClawMaintenanceLiveAuthorityReads(pathname) {
	const scope = getOpenClawDatabaseMaintenanceScope();
	if (!scope?.ownsSchemaMaintenance) throw new Error("Live authority reads require database maintenance ownership");
	scope.assertDatabaseAccess(pathname);
	let admitted = liveAuthorityReads.get(scope);
	if (!admitted) {
		admitted = /* @__PURE__ */ new Set();
		liveAuthorityReads.set(scope, admitted);
	}
	admitted.add(resolveIdentityPathViaExistingAncestorSync(pathname));
}
/** Delayed work acquires its own resources instead of inheriting the completed scope. */
function runOutsideOpenClawDatabaseMaintenanceScope(operation) {
	return maintenanceResources.current.exit(operation);
}
function isOpenClawDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
function getOpenClawDatabaseMaintenanceResourceScope(resource) {
	return maintenanceResources.claims.get(resource)?.scope;
}
function runMaintenance(scope, operation) {
	const accepted = {
		scope,
		active: true
	};
	try {
		const result = maintenanceResources.current.run(accepted, operation);
		if (result instanceof Promise) {
			const settled = () => {
				accepted.active = false;
			};
			result.then(settled, settled);
			scope.track(result);
		} else accepted.active = false;
		return result;
	} catch (error) {
		accepted.active = false;
		throw error;
	}
}
/** Retain one exact resource claim for finite commands while its maintenance scope drains. */
function captureOpenClawDatabaseMaintenanceResource(resource, expectedScope) {
	const claim = maintenanceResources.claims.get(resource);
	const assertCurrent = () => {
		expectedScope.assertOwnerCurrent();
		if (claim?.scope !== expectedScope || maintenanceResources.claims.get(resource) !== claim) throw new Error("Database maintenance resource owner changed");
	};
	assertCurrent();
	return {
		assertCurrent,
		async run(operation) {
			assertCurrent();
			return runMaintenance(expectedScope, operation);
		}
	};
}
/** A cached handle used by an independent caller remains with the ordinary cache owner. */
function observeOpenClawDatabaseMaintenanceResource(resource) {
	if (!resource) return;
	const claim = maintenanceResources.claims.get(resource);
	const current = getOpenClawDatabaseMaintenanceScope();
	if (!claim) return;
	const owner = commonMaintenanceAncestor(claim.scope, current);
	if (owner === claim.scope) return;
	claim.scope.assertAdmission();
	claim.release();
	maintenanceResources.claims.delete(resource);
	if (owner) owner.own(resource, claim.phase, claim.close);
}
function commonMaintenanceAncestor(owner, scope) {
	const ancestors = /* @__PURE__ */ new Set();
	for (let current = owner; current; current = maintenanceResources.parents.get(current)) ancestors.add(current);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (ancestors.has(current)) return current;
}
//#endregion
//#region src/state/openclaw-state-db-async-lifecycle.ts
const STATE_DATABASE_READ_ADMISSION_INVALIDATED = "STATE_DATABASE_READ_ADMISSION_INVALIDATED";
var StateDatabaseReadAdmissionInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = STATE_DATABASE_READ_ADMISSION_INVALIDATED;
	}
};
function isStateDatabaseReadAdmissionInvalidatedError(error) {
	return extractErrorCode(error) === STATE_DATABASE_READ_ADMISSION_INVALIDATED;
}
/** Associate lexical database work with exact resources, never all files beneath a root. */
function createOpenClawDatabaseMaintenanceScope(options) {
	const parent = getOpenClawDatabaseMaintenanceScope();
	const assertOwnerCurrent = options?.assertOwnerCurrent;
	const assertDatabaseAccess = options?.assertDatabaseAccess;
	const pending = /* @__PURE__ */ new Set();
	const schemaMigrationChecks = /* @__PURE__ */ new Set();
	const resources = /* @__PURE__ */ new Map();
	let closed = false;
	let checkingOwner = false;
	let closing;
	const assertOpen = () => {
		if (closed) throw new Error("Database maintenance resource scope is closed");
	};
	const assertAdmissionLifecycle = () => {
		assertOpen();
		const inherited = maintenanceResources.current.getStore();
		if (closing && !(inherited?.scope === scope && inherited.active)) throw new Error("Database maintenance resource admission is closed");
	};
	const scope = {
		ownsSchemaMaintenance: options?.schemaMaintenance === true || parent?.ownsSchemaMaintenance === true,
		assertOwnerCurrent(access) {
			assertOpen();
			if (checkingOwner) {
				if (access === "read") return;
				throw new Error("Database maintenance authority check cannot admit a nested effect");
			}
			checkingOwner = true;
			try {
				parent?.assertOwnerCurrent(access);
				assertOwnerCurrent?.(access);
			} finally {
				checkingOwner = false;
			}
		},
		assertAdmission() {
			assertOpen();
			scope.assertOwnerCurrent();
			assertAdmissionLifecycle();
		},
		assertReadAdmission() {
			assertAdmissionLifecycle();
			scope.assertOwnerCurrent("read");
			assertAdmissionLifecycle();
		},
		assertDatabaseAccess(databasePath) {
			scope.assertAdmission();
			if (assertDatabaseAccess) assertDatabaseAccess(databasePath);
			else if (parent) parent.assertDatabaseAccess(databasePath);
			else throw new Error("Database maintenance scope does not own this database");
		},
		addAgentSchemaMigrationCheck(check) {
			scope.assertAdmission();
			schemaMigrationChecks.add(check);
		},
		assertAgentSchemaMigration(migration) {
			assertOpen();
			scope.assertOwnerCurrent();
			parent?.assertAgentSchemaMigration(migration);
			for (const check of schemaMigrationChecks) check(migration);
		},
		run(operation) {
			assertAdmissionLifecycle();
			return runMaintenance(scope, () => {
				scope.assertAdmission();
				return operation();
			});
		},
		track(operation) {
			assertOpen();
			pending.add(operation);
			const settled = () => pending.delete(operation);
			operation.then(settled, settled);
			return operation;
		},
		own(resource, phase, close) {
			assertOpen();
			resources.set(resource, {
				phase,
				close
			});
			maintenanceResources.claims.set(resource, {
				scope,
				phase,
				close,
				release: () => resources.delete(resource)
			});
		},
		close(beforeResources) {
			if (closing) return closing;
			const completion = createDeferredCore();
			closing = completion.promise;
			maintenanceResources.current.run({
				scope,
				active: true
			}, async () => {
				let beforeSharedResources = beforeResources;
				while (pending.size || resources.size || beforeSharedResources) {
					while (pending.size) await Promise.allSettled(pending);
					for (const phase of [
						"agent-resources",
						"agent-handles",
						"shared-leases",
						"shared-resources",
						"shared-references",
						"shared-handles"
					]) {
						if (phase === "shared-leases" && beforeSharedResources) {
							await beforeSharedResources();
							beforeSharedResources = void 0;
						}
						while ([...resources.values()].some((resource) => resource.phase === phase)) {
							while (pending.size) await Promise.allSettled(pending);
							const batch = [...resources].filter(([, resource]) => resource.phase === phase);
							const results = await Promise.allSettled(batch.map(async ([key, resource]) => {
								const claim = maintenanceResources.claims.get(key);
								await resource.close();
								if (resources.get(key) === resource) resources.delete(key);
								if (maintenanceResources.claims.get(key) === claim) maintenanceResources.claims.delete(key);
							}));
							while (pending.size) await Promise.allSettled(pending);
							const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
							throwSqliteLifecycleErrors(errors, "Maintenance resource cleanup failed");
						}
					}
				}
				schemaMigrationChecks.clear();
				closed = true;
			}).then(completion.resolve, (error) => {
				closing = void 0;
				completion.reject(error);
			});
			return completion.promise;
		}
	};
	if (parent) maintenanceResources.parents.set(scope, parent);
	return scope;
}
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createOpenClawStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const recordsByPath = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const known = (pathname) => recordsByPath.get(pathname) ?? recordsByPath.get(path.resolve(pathname));
	const bindPath = (record, pathname) => {
		record.paths.add(pathname);
		if (!recordsByPath.has(pathname)) recordsByPath.set(pathname, record);
	};
	const overlaps = (left, right) => {
		if (left.identity.key === right.identity.key) return true;
		for (const pathname of left.paths) if (right.paths.has(pathname)) return true;
		return false;
	};
	const isSealed = (record) => {
		if (seals.size === 0) return false;
		for (const held of seals) if (held.record === void 0 || overlaps(held.record, record)) return true;
		return false;
	};
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || isSealed(record)) return record;
		for (const pathname of findChangedDatabasePaths(record.paths, identity)) {
			record.admissions.delete(pathname);
			record.paths.delete(pathname);
			if (recordsByPath.get(pathname) === record) recordsByPath.delete(pathname);
		}
		if (record.paths.size > 0) {
			if (!record.paths.has(record.identity.canonicalPath)) record.identity = identity;
			return record;
		}
		invalidate(record);
		forget(record);
	};
	const resolve = (resolvedPath, preparedIdentity) => {
		const cached = recordsByPath.get(resolvedPath);
		if (cached && (!preparedIdentity || cached.identity.key === preparedIdentity.key)) return !preparedIdentity && cached.identity.key.startsWith("path:") ? resolve(resolvedPath, readDatabasePathIdentitySync(resolvedPath)) : cached;
		const identity = preparedIdentity ?? readDatabasePathIdentitySync(resolvedPath);
		let record = findPhysicalRecord(identity);
		if (!record && identity.key.startsWith("file:")) {
			record = [...records.values()].find((candidate) => {
				if (!candidate.identity.key.startsWith("path:")) return false;
				try {
					return readDatabasePathIdentitySync(candidate.identity.canonicalPath).key === identity.key;
				} catch {
					return false;
				}
			});
			if (record) {
				records.delete(record.identity.key);
				record.identity = identity;
				records.set(identity.key, record);
			}
		}
		if (!record) {
			record = {
				coordinationKey: identity.key,
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: {},
				admissions: /* @__PURE__ */ new Map()
			};
			records.set(identity.key, record);
		}
		bindPath(record, resolvedPath);
		bindPath(record, identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const resolvedPath = path.resolve(pathname);
		const cached = recordsByPath.get(resolvedPath);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(resolvedPath);
		return identity ? resolve(resolvedPath, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) {
			current.generation = {};
			current.admissions.clear();
		}
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const forget = (record) => {
		if (!isSealed(record) && records.get(record.identity.key) === record) {
			records.delete(record.identity.key);
			for (const pathname of record.paths) if (recordsByPath.get(pathname) === record) {
				recordsByPath.delete(pathname);
				for (const replacement of records.values()) if (replacement.paths.has(pathname)) {
					recordsByPath.set(pathname, replacement);
					break;
				}
			}
		}
	};
	const captureRecord = (record, databasePath) => {
		const previous = record.admissions.get(databasePath);
		if (previous) return previous;
		const generation = record.generation;
		const admission = Object.freeze({
			databasePath,
			coordinationKey: record.coordinationKey,
			get identity() {
				return record.identity;
			},
			assertCurrent() {
				assertOpen(record);
				if (records.get(record.identity.key) !== record || record.generation !== generation || record.admissions.get(databasePath) !== admission) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission changed");
			}
		});
		record.admissions.set(databasePath, admission);
		return admission;
	};
	const captureResolved = (databasePath) => {
		const record = resolve(databasePath);
		assertOpen(record);
		return captureRecord(record, databasePath);
	};
	return {
		identity(pathname) {
			return known(pathname)?.identity ?? inspectDatabasePathIdentitySync(pathname);
		},
		knownIdentity(pathname) {
			return known(pathname)?.identity;
		},
		publish(pathname) {
			const resolvedPath = path.resolve(pathname);
			const identity = readDatabasePathIdentitySync(resolvedPath);
			const previous = recordsByPath.get(resolvedPath);
			let record = findPhysicalRecord(identity);
			if (previous && previous.identity.key !== identity.key) {
				if (previous.identity.key.startsWith("path:") && !record) {
					records.delete(previous.identity.key);
					previous.identity = identity;
					records.set(identity.key, previous);
					record = previous;
				} else {
					invalidate(previous);
					forget(previous);
				}
			}
			if (!record) record = resolve(resolvedPath, identity);
			bindPath(record, resolvedPath);
			bindPath(record, identity.canonicalPath);
			return {
				identity,
				admission: captureRecord(record, resolvedPath)
			};
		},
		invalidate(pathname) {
			if (pathname === void 0) invalidate();
			else {
				const record = known(pathname);
				if (record) invalidate(record);
			}
		},
		register(resource) {
			resources.add(resource);
			for (const attempt of attempts.values()) attempt.queue?.add(resource);
			return () => {
				resources.delete(resource);
			};
		},
		capture(pathname) {
			const cached = recordsByPath.get(pathname);
			const retained = cached?.admissions.get(pathname);
			if (cached && retained && cached.identity.key.startsWith("file:")) {
				retained.assertCurrent();
				return retained;
			}
			return captureResolved(path.resolve(pathname));
		},
		holdExclusion(pathname) {
			const record = resolve(path.resolve(pathname));
			const held = seal(record);
			return () => {
				seals.delete(held);
				for (const current of records.values()) if (overlaps(record, current)) forget(current);
			};
		},
		close(pathname, retireNative) {
			const record = pathname === void 0 ? void 0 : resolveForNative(pathname);
			if (pathname !== void 0 && !record) return Promise.resolve(retireNative());
			let attempt = attempts.get(record);
			if (attempt?.pending) return attempt.pending;
			if (!attempt) {
				attempt = {
					seal: seal(record),
					retained: /* @__PURE__ */ new Set()
				};
				attempts.set(record, attempt);
			}
			const current = attempt;
			const pending = tail.then(async () => {
				const closing = /* @__PURE__ */ new Set([...resources, ...current.retained]);
				for (const entry of attempts.values()) for (const resource of entry.retained) closing.add(resource);
				current.queue = closing;
				const errors = [];
				while (current.queue.size) {
					const ordinary = [...current.queue].filter((resource) => resource.phase !== "after-resources");
					if (!ordinary.length && errors.length) {
						for (const resource of current.queue) current.retained.add(resource);
						break;
					}
					const batch = ordinary.length ? ordinary : [...current.queue];
					for (const resource of batch) current.queue.delete(resource);
					await Promise.all(batch.map(async (resource) => {
						try {
							await resource.close(record?.identity);
							current.retained.delete(resource);
						} catch (error) {
							current.retained.add(resource);
							errors.push(error);
						}
					}));
				}
				throwSqliteLifecycleErrors(errors, "OpenClaw state resource drainage failed");
				const retired = await retireNative(record?.identity);
				attempts.delete(record);
				seals.delete(current.seal);
				if (record === void 0) {
					for (const [key, entry] of attempts) if (!entry.pending) {
						attempts.delete(key);
						seals.delete(entry.seal);
					}
					for (const entry of records.values()) forget(entry);
				} else forget(record);
				return retired;
			}).finally(() => {
				current.queue = void 0;
			});
			current.pending = pending;
			tail = pending.then(() => void 0, () => void 0);
			pending.catch(() => {
				current.pending = void 0;
			});
			return pending;
		}
	};
}
//#endregion
export { admitOpenClawMaintenanceLiveAuthorityReads as a, getOpenClawDatabaseMaintenanceResourceScope as c, maintenanceOwnerHasSourceCustody as d, maintenanceOwnerMayCopySourcesInProcess as f, isStateDatabaseReadAdmissionInvalidatedError as i, getOpenClawDatabaseMaintenanceScope as l, runOutsideOpenClawDatabaseMaintenanceScope as m, createOpenClawDatabaseMaintenanceScope as n, allowsMaintenanceLiveAuthorityReads as o, observeOpenClawDatabaseMaintenanceResource as p, createOpenClawStateDatabaseAsyncLifecycle as r, captureOpenClawDatabaseMaintenanceResource as s, StateDatabaseReadAdmissionInvalidatedError as t, isOpenClawDatabaseMaintenanceResourceOwned as u };
