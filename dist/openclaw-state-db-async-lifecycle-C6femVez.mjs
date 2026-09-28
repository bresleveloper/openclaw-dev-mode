import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { i as readDatabasePathIdentitySync, n as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
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
const maintenanceResources = resolveGlobalSingleton(Symbol.for("openclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getOpenClawDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
/** Delayed work acquires its own resources instead of inheriting the completed scope. */
function runOutsideOpenClawDatabaseMaintenanceScope(operation) {
	return maintenanceResources.current.exit(operation);
}
function isOpenClawDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
/** A cached handle used by an independent caller remains with the ordinary cache owner. */
function observeOpenClawDatabaseMaintenanceResource(resource) {
	if (!resource) return;
	const claim = maintenanceResources.claims.get(resource);
	const current = getOpenClawDatabaseMaintenanceScope();
	if (!claim) return;
	const owner = commonMaintenanceAncestor(claim.scope, current);
	if (owner === claim.scope) return;
	claim.release();
	maintenanceResources.claims.delete(resource);
	if (owner) owner.own(resource, claim.phase, claim.close);
}
function commonMaintenanceAncestor(owner, scope) {
	const ancestors = /* @__PURE__ */ new Set();
	for (let current = owner; current; current = maintenanceResources.parents.get(current)) ancestors.add(current);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (ancestors.has(current)) return current;
}
/** Associate lexical database work with exact resources, never all files beneath a root. */
function createOpenClawDatabaseMaintenanceScope(createSchemaFenceDelegate, assertOwnerCurrent) {
	const parent = getOpenClawDatabaseMaintenanceScope();
	const schemaDelegateFactory = createSchemaFenceDelegate ?? (parent?.ownsSchemaMaintenance ? parent.createSchemaFenceDelegate : void 0);
	const pending = /* @__PURE__ */ new Set();
	const schemaMigrationChecks = /* @__PURE__ */ new Set();
	const resources = /* @__PURE__ */ new Map();
	let closed = false;
	let closing;
	const assertOpen = () => {
		if (closed) throw new Error("Database maintenance resource scope is closed");
	};
	const scope = {
		ownsSchemaMaintenance: schemaDelegateFactory !== void 0,
		assertOwnerCurrent() {
			parent?.assertOwnerCurrent();
			assertOwnerCurrent?.();
		},
		assertAdmission() {
			assertOpen();
			scope.assertOwnerCurrent();
			const inherited = maintenanceResources.current.getStore();
			if (closing && !(inherited?.scope === scope && inherited.active)) throw new Error("Database maintenance resource admission is closed");
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
			scope.assertAdmission();
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
		createSchemaFenceDelegate(params) {
			assertOpen();
			return schemaDelegateFactory?.(params);
		},
		close() {
			return closing ??= maintenanceResources.current.run({
				scope,
				active: true
			}, async () => {
				while (pending.size || resources.size) {
					while (pending.size) await Promise.allSettled(pending);
					for (const phase of [
						"agent-resources",
						"agent-handles",
						"shared-leases",
						"shared-resources",
						"shared-references",
						"shared-handles"
					]) while ([...resources.values()].some((resource) => resource.phase === phase)) {
						while (pending.size) await Promise.allSettled(pending);
						const batch = [...resources].filter(([, resource]) => resource.phase === phase);
						const errors = (await Promise.allSettled(batch.map(async ([key, resource]) => {
							await resource.close();
							resources.delete(key);
							maintenanceResources.claims.delete(key);
						}))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
						if (errors.length === 1) throw errors[0];
						if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Maintenance resource cleanup failed", errors[0]);
					}
				}
				schemaMigrationChecks.clear();
				closed = true;
			}).catch((error) => {
				closing = void 0;
				throw error;
			});
		}
	};
	if (parent) maintenanceResources.parents.set(scope, parent);
	return scope;
}
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createOpenClawStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const known = (pathname) => {
		const resolvedPath = path.resolve(pathname);
		return [...records.values()].find((record) => record.paths.has(resolvedPath));
	};
	const overlaps = (left, right) => left.identity.key === right.identity.key || [...left.paths].some((pathname) => right.paths.has(pathname));
	const isSealed = (record) => [...seals].some((held) => held.record === void 0 || overlaps(held.record, record));
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || record.paths.has(identity.canonicalPath) || isSealed(record)) return record;
		if ([...record.paths].some((pathname) => inspectDatabasePathIdentitySync(pathname)?.key === identity.key)) return record;
		invalidate(record);
		forget(record);
	};
	const resolve = (pathname, preparedIdentity) => {
		const resolvedPath = path.resolve(pathname);
		const cached = known(resolvedPath);
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
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: {}
			};
			records.set(identity.key, record);
		}
		record.paths.add(resolvedPath).add(identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const cached = known(pathname);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(pathname);
		return identity ? resolve(pathname, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) current.generation = {};
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const forget = (record) => {
		if (!isSealed(record) && records.get(record.identity.key) === record) records.delete(record.identity.key);
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
			const previous = known(resolvedPath);
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
			record.paths.add(resolvedPath).add(identity.canonicalPath);
			return identity;
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
			const databasePath = path.resolve(pathname);
			const record = resolve(databasePath);
			assertOpen(record);
			const generation = record.generation;
			return {
				databasePath,
				get identity() {
					return record.identity;
				},
				assertCurrent() {
					assertOpen(record);
					if (records.get(record.identity.key) !== record || record.generation !== generation) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission changed");
				}
			};
		},
		holdExclusion(pathname) {
			const record = resolve(pathname);
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
				if (errors.length === 1) throw errors[0];
				if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "OpenClaw state resource drainage failed", errors[0]);
				const retired = retireNative(record?.identity);
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
export { isOpenClawDatabaseMaintenanceResourceOwned as a, runOutsideOpenClawDatabaseMaintenanceScope as c, getOpenClawDatabaseMaintenanceScope as i, createOpenClawDatabaseMaintenanceScope as n, isStateDatabaseReadAdmissionInvalidatedError as o, createOpenClawStateDatabaseAsyncLifecycle as r, observeOpenClawDatabaseMaintenanceResource as s, StateDatabaseReadAdmissionInvalidatedError as t };
