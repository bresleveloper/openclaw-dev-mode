import { O as hasErrnoCode, _ as resolveStateDir, at as expectDefined, f as resolveGatewayLockDir, ft as toErrorObject, j as resolveIdentityPathViaExistingAncestorSync, lt as extractErrorCode, ot as coerceErrorMessage, p as resolveGatewayLockDirForCanonicalStateDir, rt as sliceUtf16Safe } from "./redact-tYkqLD33.mjs";
import { A as resolveTimerTimeoutMs, B as resolveGlobalSingleton, G as isRecord, a as normalizeWindowsPathForComparison$1, i as isPathInside$1, n as shortenHomePath, p as tryProcessCwd } from "./utils-c2rFzEZe.mjs";
import { C as isSqliteNativeOpenFailure, S as isSqliteLockError, T as markSqliteNativeOpenFailure, a as StartupMaintenanceRequiredError, k as withSqliteNativeOpen, t as SqliteSchemaVersionError } from "./sqlite-user-version-Cr9fhNQ-.mjs";
import { r as isPidAlive } from "./pid-alive-B0Qv4xHQ.mjs";
import { r as racePromiseWithAbortSignal } from "./src-Dpfm4nnc.mjs";
import { r as getChildLogger, s as registerSignalExitFinalizer, t as createSubsystemLogger } from "./subsystem-Y9GXTYwe.mjs";
import { k as runInDetachedAsyncContext, l as readDatabasePathIdentitySync, m as VERSION, n as findChangedDatabasePaths, o as readDatabaseFileIdentity, r as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-BvirgyPs.mjs";
import { n as createDeferredCore, t as isPromiseLike } from "./promise-like-ByIJ_1fR.mjs";
import { a as resolveOpenClawStateDirForDatabasePath, r as resolveDatabasePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { B as runWithSqliteCleanup, F as OpenClawStateExternalOwnershipError, I as OpenClawStateOwnershipError, L as OpenClawStateOwnershipMetadataError, R as SqliteCoordinatorError, T as retireSqliteDatabaseAdmissionForPath, V as throwSqliteLifecycleErrors, l as getSqliteDatabaseAdmissionIdentityForPath, s as getOrLoadSqliteDatabaseAdmissionForPath, ut as getSqliteRuntimeCapabilities, z as createSqliteLifecycleAggregateError } from "./sqlite-database-admission-BHBZtMyW.mjs";
import { D as getNodeSqliteKysely, E as executeSqliteQueryTakeFirstSync, d as resolveExistingSqliteFileUri, l as openNodeSqliteDatabase, r as normalizeSqliteNonNegativeInteger, t as OpenClawStateDatabaseSchemaMigrationRequiredError, x as schemaAdmission } from "./openclaw-state-db-schema-migration-required-DX3ZK7SD.mjs";
import { i as sha256HexPrefixCore } from "./crypto-digest-DqNCiRzt.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { A as StateDatabaseAdmissionPendingError, B as GATEWAY_OWNER_HEARTBEAT_MS, C as matchesAgentDatabaseReadCandidatePath, D as flatMapRetainedOperation, E as finallyRetainedOperation, F as isGatewayStateOwnerDefinitelyStale, H as parseGatewayLockPayload, I as createCpuTrackedWorker, L as recordWorkerMessage, N as assertPersistedStateDatabaseAccessAllowed, O as mapRetainedOperation, P as defaultPayload, S as trackWorkerRequest, T as createRetainedOperation, V as describeGatewayLockHolder, b as captureRetainedNativeWorkerSource, j as StateDatabaseMaintenanceScopeError, k as GatewayStateOwnerContentionError, n as createOwnedWorkerTaskPool, w as registerAgentDatabaseReaderCloser, x as classifyWorkerRequest, y as DEFAULT_WORKER_PENDING_BYTES, z as captureRuntimeWorkerSource } from "./worker-task-pool-Cn7mBBG4.mjs";
import { t as SQLITE_READONLY_CHILD_ARG } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as resolveRuntimeWorkerArgv, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-BOuHXXbo.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-C6BkyDvx.mjs";
import { a as BrokerChild } from "./host-ChyoilB1.mjs";
import { n as getSpawnBroker, t as recordChildProcessSpawn } from "./spawn-diagnostics-lab2oq3I.mjs";
import { execFile, spawn, spawnSync } from "node:child_process";
import fsSync, { chmodSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import "@openclaw/fs-safe/advanced";
import { AsyncLocalStorage } from "node:async_hooks";
import { isPathInside } from "@openclaw/fs-safe/path";
import os, { tmpdir } from "node:os";
import { performance as performance$1 } from "node:perf_hooks";
import { MessageChannel, isMainThread, receiveMessageOnPort, threadId, workerData } from "node:worker_threads";
import fsPromises from "node:fs/promises";
import { toUSVString } from "node:util";
import { sql } from "kysely";
import { acquireFileLockSync } from "@openclaw/fs-safe/file-lock";
import { deserialize, serialize } from "node:v8";
import { Socket } from "node:net";
//#region packages/normalization-core/src/format.ts
const BYTE_SIZE_UNITS = [
	"byte",
	"kilo",
	"mega",
	"giga",
	"tera"
];
const BYTE_SIZE_STYLES = {
	iec: {
		base: 1024,
		labels: [
			"B",
			"KiB",
			"MiB",
			"GiB",
			"TiB"
		]
	},
	"legacy-binary": {
		base: 1024,
		labels: [
			"B",
			"KB",
			"MB",
			"GB",
			"TB"
		]
	}
};
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
function formatByteSize(bytes, options) {
	const { base, labels } = BYTE_SIZE_STYLES[options.style];
	const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
	let unitIndex = 0;
	let value = bytes;
	while (value >= base && unitIndex < maxUnitIndex) {
		value /= base;
		unitIndex += 1;
	}
	const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
	const label = expectDefined(labels[unitIndex], "byte-size label");
	const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
	if (fractionDigits === null) return `${value}${options.separator}${label}`;
	if (options.floorUnits?.includes(unit)) value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
	return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}
//#endregion
//#region src/state/openclaw-state-maintenance-context.ts
const liveAuthorityReads = resolveGlobalSingleton(Symbol.for("openclaw.maintenanceLiveAuthorityReads"), () => /* @__PURE__ */ new WeakMap());
function allowsMaintenanceLiveAuthorityReads(scope, pathname) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(pathname);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (liveAuthorityReads.get(current)?.has(canonicalPath)) return true;
	return false;
}
const maintenanceResources = resolveGlobalSingleton(Symbol.for("openclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getOpenClawDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
/** Background work retains command custody without borrowing its native execution path. */
function isOpenClawDatabaseMaintenanceWorkerAccess() {
	return maintenanceResources.current.getStore()?.workerAccess === true;
}
function isOpenClawDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
function getOpenClawDatabaseMaintenanceResourceScope(resource) {
	return maintenanceResources.claims.get(resource)?.scope;
}
function runMaintenance(scope, operation, workerAccess = isOpenClawDatabaseMaintenanceWorkerAccess()) {
	const accepted = {
		scope,
		active: true,
		workerAccess
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
		},
		async runWorker(operation) {
			assertCurrent();
			return runMaintenance(expectedScope, operation, true);
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
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createOpenClawStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const recordsByPath = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const proofFor = () => {
		const proof = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		new BigInt64Array(proof)[0] = -1n;
		return proof;
	};
	const generationFor = (identity) => {
		const revision = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		return { integrity: {
			identity,
			lifetime: {
				revision: new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT),
				epoch: 0n
			},
			revision,
			epoch: 0n,
			proof: proofFor()
		} };
	};
	const publishCreatedIdentity = (record, identity) => {
		Atomics.add(new BigInt64Array(record.generation.integrity.revision), 0, 1n);
		Atomics.add(new BigInt64Array(record.generation.integrity.lifetime.revision), 0, 1n);
		records.delete(record.identity.key);
		record.identity = identity;
		record.generation.integrity.identity = identity;
		records.set(identity.key, record);
	};
	const known = (pathname) => recordsByPath.get(pathname) ?? recordsByPath.get(resolveDatabasePath({ path: pathname }));
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
	const hasCloseCustody = (record) => isSealed(record) || attempts.has(record);
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || hasCloseCustody(record)) return record;
		for (const pathname of findChangedDatabasePaths(record.paths, identity)) {
			record.admissions.delete(pathname);
			record.paths.delete(pathname);
			if (recordsByPath.get(pathname) === record) recordsByPath.delete(pathname);
		}
		if (record.paths.size > 0) {
			if (!record.paths.has(record.identity.canonicalPath)) {
				record.identity = identity;
				record.generation.integrity.identity = identity;
			}
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
			if (record) publishCreatedIdentity(record, identity);
		}
		if (!record) {
			record = {
				coordinationKey: identity.key,
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: generationFor(identity),
				admissions: /* @__PURE__ */ new Map()
			};
			records.set(identity.key, record);
		}
		bindPath(record, resolvedPath);
		bindPath(record, identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const resolvedPath = resolveDatabasePath({ path: pathname });
		const cached = recordsByPath.get(resolvedPath);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(resolvedPath);
		return identity ? resolve(resolvedPath, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) {
			Atomics.store(new BigInt64Array(current.generation.integrity.revision), 0, -1n);
			Atomics.store(new BigInt64Array(current.generation.integrity.lifetime.revision), 0, -1n);
			current.generation = generationFor(current.identity);
			current.admissions.clear();
		}
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const release = (attempt) => {
		if (attempt.seal) {
			seals.delete(attempt.seal);
			attempt.seal = void 0;
		}
	};
	const forget = (record) => {
		if (!hasCloseCustody(record) && records.get(record.identity.key) === record) {
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
			captureIntegrity() {
				admission.assertCurrent();
				const current = generation.integrity;
				const epoch = Atomics.load(new BigInt64Array(current.revision), 0);
				const lifetimeEpoch = Atomics.load(new BigInt64Array(current.lifetime.revision), 0);
				if (epoch !== current.epoch || lifetimeEpoch !== current.lifetime.epoch) generation.integrity = {
					...current,
					identity: record.identity,
					lifetime: {
						revision: current.lifetime.revision,
						epoch: lifetimeEpoch
					},
					epoch,
					proof: proofFor()
				};
				return generation.integrity;
			},
			assertCurrent() {
				assertOpen(record);
				if (records.get(record.identity.key) !== record || record.generation !== generation || record.admissions.get(databasePath) !== admission) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission changed");
			}
		});
		record.admissions.set(databasePath, admission);
		return admission;
	};
	return {
		identity(pathname) {
			return known(pathname)?.identity ?? inspectDatabasePathIdentitySync(pathname);
		},
		knownIdentity(pathname) {
			return known(pathname)?.identity;
		},
		integrity(pathname) {
			const record = resolveForNative(pathname);
			return record && !isSealed(record) ? captureRecord(record, resolveDatabasePath({ path: pathname })).captureIntegrity?.() : void 0;
		},
		publish(pathname) {
			const resolvedPath = resolveDatabasePath({ path: pathname });
			const identity = readDatabasePathIdentitySync(resolvedPath);
			const previous = recordsByPath.get(resolvedPath);
			let record = findPhysicalRecord(identity);
			if (previous && previous.identity.key !== identity.key) {
				if (previous.identity.key.startsWith("path:") && !record) {
					publishCreatedIdentity(previous, identity);
					record = previous;
				} else {
					const failed = attempts.get(previous);
					if (failed) {
						failed.superseded = true;
						failed.seal ??= seal(previous);
					} else invalidate(previous);
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
			const databasePath = resolveDatabasePath({ path: pathname });
			const record = resolve(databasePath);
			assertOpen(record);
			return captureRecord(record, databasePath);
		},
		holdExclusion(pathname) {
			const record = resolve(resolveDatabasePath({ path: pathname }));
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
				attempt = { retained: /* @__PURE__ */ new Set() };
				attempts.set(record, attempt);
			}
			attempt.seal ??= seal(record);
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
				if (errors.length && !current.superseded) release(current);
				throwSqliteLifecycleErrors(errors, "OpenClaw state resource drainage failed");
				const retired = await retireNative(record?.identity);
				attempts.delete(record);
				release(current);
				if (record === void 0) {
					for (const [key, entry] of attempts) if (!entry.pending) {
						attempts.delete(key);
						release(entry);
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
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code !== "EROFS" && code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || code === "EPERM" && filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/gateway-state-owner-directory.ts
function ensureOwnerDirectory(directory, created) {
	const firstCreated = fsSync.mkdirSync(directory, {
		recursive: true,
		mode: 448
	});
	if (firstCreated && created) {
		const boundary = path.toNamespacedPath(firstCreated);
		const directories = [];
		for (let current = directory;;) {
			const { dev, ino } = fsSync.lstatSync(current, { bigint: true });
			directories.push({
				path: current,
				dev,
				ino
			});
			if (path.toNamespacedPath(current) === boundary) break;
			const parent = path.dirname(current);
			if (parent === current) throw new Error("Created state ownership directory is outside its expected ancestry");
			current = parent;
		}
		for (const entry of directories) {
			const previous = created.findIndex((candidate) => candidate.path === entry.path);
			if (previous < 0) created.push(entry);
			else created[previous] = entry;
		}
	}
	const observed = fsSync.lstatSync(directory);
	const uid = process.getuid?.();
	if (!observed.isDirectory() || uid !== void 0 && observed.uid !== uid) throw new Error("State ownership directory must be a user-owned real directory");
	if (process.platform !== "win32" && (observed.mode & 4095) !== 448) {
		applyPrivateModeSync(directory, 448);
		if ((fsSync.lstatSync(directory).mode & 63) !== 0) throw new Error("State ownership directory permissions are not private");
	}
}
function removeCreatedProjectionDirectories(directories) {
	let directory = directories[0];
	while (directory) {
		try {
			const observed = fsSync.lstatSync(directory.path, { bigint: true });
			if (observed.isDirectory() && observed.dev === directory.dev && observed.ino === directory.ino) fsSync.rmdirSync(directory.path);
		} catch (error) {
			const code = extractErrorCode(error);
			if (code !== "ENOENT" && code !== "ENOTEMPTY" && code !== "EEXIST") throw error;
		}
		directories.shift();
		directory = directories[0];
	}
}
/** In-process identity is independent of the on-disk lock spelling used by older versions. */
function resolveStateOwnerIdentity(databasePath) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(databasePath);
	return {
		canonicalPath,
		ownerPath: resolveCanonicalStateOwnerPath(canonicalPath),
		key: process.platform === "win32" ? normalizeWindowsPathForComparison$1(canonicalPath) : canonicalPath
	};
}
function resolveCanonicalStateOwnerPath(canonical) {
	const uid = process.getuid?.();
	const directory = process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks", uid === void 0 ? "openclaw-state-owners" : `openclaw-state-owners-${uid}`) : resolveGatewayLockDirForCanonicalStateDir(resolveOpenClawStateDirForDatabasePath(canonical));
	return path.join(resolveIdentityPathViaExistingAncestorSync(directory), `state.${sha256HexPrefixCore(canonical, 16)}.lock`);
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.runtime.ts
/** Verify the held inode and exact acquisition bytes before touching it. */
function renewGatewayStateOwnerLock(fd, lockPath, raw, stamp) {
	const held = fsSync.fstatSync(fd, { bigint: true });
	const current = fsSync.statSync(lockPath, { bigint: true });
	const bytes = Buffer.alloc(Buffer.byteLength(raw) + 1);
	const length = fsSync.readSync(fd, bytes, 0, bytes.length, 0);
	if (held.nlink === 0n || held.dev !== current.dev || held.ino !== current.ino || bytes.subarray(0, length).toString("utf8") !== raw) return false;
	fsSync.futimesSync(fd, stamp, stamp);
	return true;
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.ts
const now = Date.now.bind(Date);
/** Process and schema owners share one renewal worker and one failure deadline. */
function startGatewayStateOwnerHeartbeat(heldLocks, onLost) {
	const locks = {};
	for (const lock of heldLocks) {
		locks[lock.lockPath] = fsSync.readFileSync(lock.lockPath, "utf8");
		if (!lock.verifyStillHeld()) throw new Error("OpenClaw state ownership is no longer current");
	}
	const rootPath = Object.keys(locks)[0];
	if (!rootPath) throw new Error("Gateway state ownership requires a held lock");
	const rootIdentity = fsSync.statSync(rootPath, { bigint: true });
	const { moduleUrl: url, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("gatewayStateOwnerHeartbeat"));
	return runInDetachedAsyncContext(() => {
		const lastBeat = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT));
		Atomics.store(lastBeat, 0, BigInt(now()));
		const { port1, port2 } = new MessageChannel();
		const worker = createCpuTrackedWorker(url, {
			workerData: {
				clock: "epoch",
				locks,
				intervalMs: GATEWAY_OWNER_HEARTBEAT_MS,
				failureMs: 6e4,
				lastBeat: lastBeat.buffer,
				events: port2
			},
			transferList: [port2],
			execArgv: resolveRuntimeWorkerThreadExecArgv(url)
		});
		worker.unref();
		port1.on("message", () => recordWorkerMessage("lifecycle", "from_worker"));
		port1.unref();
		worker.on("error", (err) => onLost(/* @__PURE__ */ new Error(`${coerceErrorMessage(err)}; restart Gateway.`)));
		const inspect = () => {
			const renewedAt = Atomics.load(lastBeat, 0);
			const age = now() - Number(renewedAt);
			const remaining = age < 0 ? 0 : 6e4 - age;
			if (remaining <= 0) try {
				const renewalStartedAt = now();
				const stamp = new Date(renewalStartedAt);
				for (const lock of heldLocks) {
					if (!lock.verifyStillHeld()) {
						if (lock.lockPath !== rootPath) continue;
						throw new Error("owner lock was removed or replaced");
					}
					const fd = fsSync.openSync(lock.lockPath, "r+");
					try {
						const held = fsSync.fstatSync(fd, { bigint: true });
						if (lock.lockPath === rootPath && (held.dev !== rootIdentity.dev || held.ino !== rootIdentity.ino)) throw new Error("owner lock was removed or replaced");
						const raw = fsSync.readFileSync(fd, "utf8");
						if (!lock.verifyStillHeld() || !renewGatewayStateOwnerLock(fd, lock.lockPath, raw, stamp)) throw new Error("owner lock was removed or replaced");
					} finally {
						fsSync.closeSync(fd);
					}
				}
				Atomics.store(lastBeat, 0, BigInt(renewalStartedAt));
				return 6e4;
			} catch (error) {
				onLost(/* @__PURE__ */ new Error(`Gateway state ownership is no longer current at ${rootPath}: ${coerceErrorMessage(error)}; restart the Gateway.`));
			}
			return remaining;
		};
		let timer;
		const watch = () => {
			const remaining = inspect();
			if (remaining > 0) {
				timer = setTimeout(watch, remaining);
				timer.unref();
			}
		};
		watch();
		let termination;
		const stop = () => {
			if (termination) return;
			clearTimeout(timer);
			port1.close();
			worker.postMessage("stop", []);
			termination ??= worker.terminate();
		};
		runtimeGeneration?.retain(worker, async () => async () => {
			stop();
			await termination;
		});
		return {
			worker,
			paths: new Set(Object.keys(locks)),
			inspect,
			stop
		};
	});
}
//#endregion
//#region src/infra/gateway-state-owner.ts
function hasPhysicalOwnership(owner) {
	try {
		return verifyOwnerLock(owner, owner.locks.values().next().value);
	} catch (error) {
		if (owner.lost.signal.aborted) return false;
		throw error;
	}
}
function verifyOwnerLock(owner, lock) {
	owner.lost.signal.throwIfAborted();
	owner.heartbeat?.inspect();
	owner.lost.signal.throwIfAborted();
	if (!lock) return false;
	if (!lock.verifyStillHeld()) {
		loseOwner(owner, /* @__PURE__ */ new Error(`${lock.lockPath}: no longer current; lock removed/replaced; restart the Gateway.`));
		return false;
	}
	const projection = owner.getProjection?.();
	if (projection && owner.heartbeat && !owner.heartbeat.paths.has(projection.lockPath)) {
		const raw = fsSync.readFileSync(projection.lockPath, "utf8");
		if (!projection.verifyStillHeld()) return false;
		owner.heartbeat.worker.postMessage([projection.lockPath, raw], []);
		owner.heartbeat.paths.add(projection.lockPath);
	}
	return true;
}
const log$2 = createSubsystemLogger("gateway/state");
function loseOwner(owner, error) {
	if (owner.lost.signal.aborted) return;
	owner.accepting = false;
	readOwnerPaths.clear();
	owner.heartbeat?.stop();
	log$2.error(error.message);
	owner.lost.abort(error);
}
const readOwnerPaths = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateReadOwnerPaths"), () => /* @__PURE__ */ new Map());
const owners = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwners"), () => /* @__PURE__ */ new Map());
const schemaOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaOwners"), () => new AsyncLocalStorage());
/** The synchronous lexical owner is live authority, not the existence of its sidecar. */
function getStateDatabaseSchemaLease(databasePath) {
	const entry = schemaOwners.getStore()?.get(resolveStateOwnerIdentity(databasePath).key);
	if (entry && !entry.active) throw new Error("State schema maintenance scope is no longer current");
	entry?.lease.assertCurrent();
	return entry?.lease;
}
/** Retry cold admission only; the same budget covers opening and its first unentered write. */
function withStateDatabaseColdAdmission(params, open) {
	const budget = normalizeSqliteNonNegativeInteger(params.busyTimeoutMs, "busyTimeoutMs");
	const deadline = performance.now() + budget;
	const canonical = resolveIdentityPathViaExistingAncestorSync(params.databasePath);
	const remainingBusyTimeoutMs = () => Math.max(0, Math.ceil(deadline - performance.now()));
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	for (;;) try {
		assertStateDatabaseAccessAllowed(params.databasePath);
		return open(remainingBusyTimeoutMs);
	} catch (error) {
		if (!(error instanceof StateDatabaseAdmissionPendingError) || resolveIdentityPathViaExistingAncestorSync(error.databasePath) !== canonical || params.canRetry?.() === false) throw error;
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw error;
		Atomics.wait(waiting, 0, 0, Math.min(10, remaining));
	}
}
function acquireOwnerFile(databasePath, pathname, payload, busyTimeoutMs = 0, createdDirectories) {
	const deadline = performance.now() + busyTimeoutMs;
	ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
	const observed = { holder: null };
	const parsePayload = (raw) => {
		if (raw !== observed.raw) {
			observed.holder = parseGatewayLockPayload(raw);
			observed.raw = raw;
		}
		return observed.holder;
	};
	const stale = ({ payload: value }) => isGatewayStateOwnerDefinitelyStale(value, pathname);
	if (busyTimeoutMs > 0) try {
		const previous = parsePayload(fsSync.readFileSync(pathname, "utf8"));
		if (previous && !stale({ payload: previous }) && (previous.pid === process.pid || (previous.role ?? "gateway") === "gateway" && isPidAlive(previous.pid))) throw new GatewayStateOwnerContentionError(databasePath);
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") throw error;
	}
	for (let retriedMissingParent = false;;) try {
		return acquireFileLockSync(pathname, {
			lockPath: pathname,
			retry: busyTimeoutMs > 0 ? {
				factor: 1.25,
				minTimeout: 10,
				maxTimeout: 25,
				randomize: false
			} : { retries: 0 },
			timeoutMs: Math.max(0, Math.ceil(deadline - performance.now())),
			staleMs: Infinity,
			staleRecovery: "remove-if-unchanged",
			reentrantOwner: payload.ownerId,
			payload: () => payload,
			parsePayload,
			shouldReclaim: stale,
			shouldRemoveStaleLock: stale
		});
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" && !retriedMissingParent) {
			retriedMissingParent = true;
			ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
			continue;
		}
		if (code === "file_lock_timeout" || code === "file_lock_stale") {
			const { holder } = observed;
			const holderDetail = describeGatewayLockHolder(holder ?? {}, pathname, holder && isPidAlive(holder.pid) ? "live" : "unknown");
			throw new GatewayStateOwnerContentionError(databasePath, error, holderDetail);
		}
		throw error;
	}
}
function leaseForFile(pathname, lock, owner, projection) {
	let released = false;
	const holdsPhysicalLease = () => verifyOwnerLock(owner, lock) && (!projection || projection.verifyStillHeld());
	const lease = {
		path: pathname,
		assertCurrent() {
			if (released || !holdsPhysicalLease()) throw new Error("OpenClaw state ownership is no longer current");
		},
		assertDatabaseAccess(databasePath) {
			if (released || owners.get(owner.key) !== owner || resolveStateOwnerIdentity(databasePath).key !== owner.key || !holdsPhysicalLease()) throw new Error("OpenClaw state maintenance does not own this database");
		},
		run(operation) {
			lease.assertCurrent();
			readOwnerPaths.clear();
			const inherited = new Map(schemaOwners.getStore());
			const entry = {
				lease,
				active: true
			};
			inherited.set(owner.key, entry);
			try {
				return schemaOwners.run(inherited, operation);
			} finally {
				entry.active = false;
				readOwnerPaths.clear();
			}
		},
		release() {
			readOwnerPaths.clear();
			if (!released) {
				projection?.release();
				lock.release();
				released = true;
				owner.locks.delete(lock);
				if (projection) owner.locks.delete(projection);
				if (owner.locks.size === 0 && owners.get(owner.key) === owner) {
					owner.heartbeat?.stop();
					owner.accepting = false;
					owners.delete(owner.key);
				}
			}
			if (owner.locks.size === 0) removeCreatedProjectionDirectories(owner.projectionDirectories);
		}
	};
	return lease;
}
/** Accepted schema work retains the sidecar even when its process owner stops lending. */
function acquireStateDatabaseSchemaLease(databasePath, options = {}) {
	readOwnerPaths.clear();
	const identity = resolveStateOwnerIdentity(databasePath);
	let owner = owners.get(identity.key);
	const pathname = owner?.path ?? identity.ownerPath;
	if (owner && (!owner.accepting || !hasPhysicalOwnership(owner))) throw new GatewayStateOwnerContentionError(databasePath, owner.lost.signal.reason);
	if (owner) assertStateDatabaseAccessAllowed(databasePath);
	const payload = owner?.payload ?? {
		...defaultPayload(databasePath),
		stateOwnerKind: "schema"
	};
	let lock;
	const projectionDirectories = [];
	try {
		lock = acquireOwnerFile(databasePath, pathname, payload, owner ? 0 : options.busyTimeoutMs ?? 5e3, projectionDirectories);
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) try {
			assertStateDatabaseAccessAllowed(databasePath);
		} catch (currentOwnerError) {
			if (currentOwnerError instanceof StateDatabaseAdmissionPendingError) throw currentOwnerError;
		}
		throw error;
	}
	const projectionPath = owner?.projectionPath ?? path.join(resolveGatewayLockDir(resolveOpenClawStateDirForDatabasePath(resolveIdentityPathViaExistingAncestorSync(databasePath))), "gateway.state.lock");
	let projection;
	try {
		projection = owner?.getProjection?.()?.retain() ?? acquireOwnerFile(databasePath, projectionPath, {
			...payload,
			role: payload.role === "gateway" ? "gateway" : "agent-embedded"
		}, 0, projectionDirectories);
	} catch (error) {
		return runWithSqliteCleanup({ release() {
			lock.release();
			removeCreatedProjectionDirectories(projectionDirectories);
		} }, "state schema projection admission", () => {
			throw error;
		});
	}
	if (owner) {
		owner.locks.add(lock);
		owner.locks.add(projection);
		owner.projectionDirectories.push(...projectionDirectories);
	} else {
		owner = {
			key: identity.key,
			path: pathname,
			kind: "schema",
			payload,
			projectionPath,
			locks: /* @__PURE__ */ new Set([lock, projection]),
			projectionDirectories,
			lost: new AbortController(),
			accepting: true
		};
		owners.set(owner.key, owner);
	}
	const lease = leaseForFile(pathname, lock, owner, projection);
	try {
		const heartbeat = owner.heartbeat ??= startGatewayStateOwnerHeartbeat(owner.locks, (error) => loseOwner(owner, error));
		const raw = fsSync.readFileSync(projection.lockPath, "utf8");
		lease.assertCurrent();
		heartbeat.worker.postMessage([projection.lockPath, raw], []);
		heartbeat.paths.add(projection.lockPath);
		return lease;
	} catch (error) {
		return runWithSqliteCleanup(lease, "state schema ownership verification", () => {
			throw error;
		});
	}
}
/** Reads within an admission reuse process custody; the next admission verifies the lock. */
function assertStateDatabaseReadAllowed(databasePath, captured) {
	assertStateDatabaseReadAtOwnerPath(databasePath, captured);
}
function assertStateDatabaseReadAtOwnerPath(databasePath, captured, prepared) {
	if (owners.size === 0) {
		assertStateDatabaseAccessAtOwnerPath(databasePath, prepared ?? resolveStateOwnerIdentity(databasePath), captured);
		return;
	}
	const key = path.resolve(databasePath);
	if (readOwnerPaths.get(key)?.accepting) return;
	readOwnerPaths.delete(key);
	const identity = prepared ?? resolveStateOwnerIdentity(databasePath);
	const owner = owners.get(identity.key);
	const role = owner?.payload.role ?? "gateway";
	if (!owner || owner.kind !== "process" || !owner.accepting || role !== "gateway" && role !== "agent-embedded") {
		assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured);
		return;
	}
	if (!hasPhysicalOwnership(owner) || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) {
		owner.lost.signal.throwIfAborted();
		throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
	}
	readOwnerPaths.set(key, owner);
}
/** Ordinary SQLite access observes maintenance; it never borrows schema authority. */
function assertStateDatabaseAccessAllowed(databasePath, captured) {
	assertStateDatabaseAccessAtOwnerPath(databasePath, resolveStateOwnerIdentity(databasePath), captured);
}
/** Retained handles keep their admitted paths; reopening captures a fresh identity. */
function captureStateDatabaseAccess(databasePath) {
	const identity = resolveStateOwnerIdentity(databasePath);
	const { canonicalPath } = identity;
	return {
		canonicalPath,
		assertAccessAllowed(captured) {
			assertStateDatabaseAccessAtOwnerPath(canonicalPath, identity, captured);
		},
		assertReadAllowed(captured) {
			assertStateDatabaseReadAtOwnerPath(canonicalPath, captured, identity);
		}
	};
}
function assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured) {
	const assertMaintenance = () => {
		const schemaLease = captured ? captured.schemaLease : getStateDatabaseSchemaLease(databasePath);
		if (schemaLease) {
			schemaLease.assertDatabaseAccess(databasePath);
			return;
		}
		const scope = captured ? captured.maintenanceScope : getOpenClawDatabaseMaintenanceScope();
		if (!scope) throw new StateDatabaseMaintenanceScopeError(databasePath);
		scope.assertDatabaseAccess(databasePath);
	};
	const local = owners.get(identity.key);
	if (local) {
		if (!hasPhysicalOwnership(local)) {
			local.lost.signal.throwIfAborted();
			throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
		}
		const role = local.payload.role ?? "gateway";
		if (!local.accepting || role !== "gateway" && role !== "agent-embedded") assertMaintenance();
		return;
	}
	assertPersistedStateDatabaseAccessAllowed({
		databasePath,
		ownerPath: identity.ownerPath,
		assertMaintenance
	});
}
//#endregion
//#region src/bootstrap/node-compiler-args.ts
const COMPILER_FLAGS = /* @__PURE__ */ new Set([
	"--no-maglev",
	"--maglev",
	"--no-concurrent-sparkplug",
	"--concurrent-sparkplug"
]);
/** Forward explicit compiler policy into OpenClaw-owned Node workers. */
function resolveForwardedNodeCompilerArgs(execArgv = process.execArgv) {
	return execArgv.filter((arg) => COMPILER_FLAGS.has(arg.replaceAll("_", "-")));
}
//#endregion
//#region src/state/artifact-preserving-state-reads.ts
const artifactPreservingReads = resolveGlobalSingleton(Symbol.for("openclaw.artifactPreservingStateReads"), () => new AsyncLocalStorage());
function withArtifactPreservingStateReads(operation, options = {}) {
	if (isArtifactPreservingStateRead("agent")) return operation();
	const scope = {
		agentDatabases: options.agentDatabases === true,
		readers: /* @__PURE__ */ new Set(),
		privateRoots: /* @__PURE__ */ new Set()
	};
	const finish = (value, errors = []) => {
		for (const close of scope.readers) try {
			close();
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "Artifact-preserving inspection and cleanup failed.");
		return value;
	};
	let result;
	try {
		result = artifactPreservingReads.run(scope, operation);
	} catch (error) {
		return finish(void 0, [error]);
	}
	return isPromiseLike(result) ? Promise.resolve(result).then(finish, (error) => finish(void 0, [error])) : finish(result);
}
function isArtifactPreservingStateRead(kind = "shared", pathname) {
	const scope = artifactPreservingReads.getStore();
	return Boolean(scope && (kind === "shared" || scope.agentDatabases) && (!pathname || ![...scope.privateRoots].some((root) => isPathInside(root, pathname))));
}
//#endregion
//#region node-compile-cache.mjs
if (isMainThread && process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED === "gateway") {
	delete process.env.NODE_DISABLE_COMPILE_CACHE;
	delete process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED;
}
const MAX_BYTES = 536870912;
const MAX_AGE_MS = 6048e5;
const MAINTENANCE_INTERVAL_MS = 36e5;
const BUILD_MARKER_RE = /^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/;
const sanitize = (value) => {
	const segment = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return segment && segment !== "." && segment !== ".." ? segment : "unknown";
};
function resolveSafeNodeCompileCacheDirectory(directory) {
	if (process.platform === "win32" && path.resolve(directory).length > 200) {
		process.stderr.write("[openclaw] Compile cache disabled: Windows cache path exceeds 200 characters.\n");
		return;
	}
	return directory;
}
async function maintain(directory) {
	const root = path.dirname(path.dirname(directory));
	const version = path.basename(path.dirname(directory));
	if (path.basename(root) !== "openclaw" || sanitize(version) !== version || !BUILD_MARKER_RE.test(path.basename(directory))) return;
	const now = Date.now();
	const previous = await fsPromises.lstat(root).catch(() => void 0);
	for (const target of [
		root,
		path.dirname(directory),
		directory
	]) {
		const stat = target === root ? previous : await fsPromises.lstat(target).catch(() => void 0);
		if (stat && !stat.isDirectory()) return;
	}
	await fsPromises.mkdir(directory, { recursive: true });
	if (previous && now - previous.mtimeMs < MAINTENANCE_INTERVAL_MS) return;
	await fsPromises.utimes(root, new Date(now), new Date(now));
	const files = [];
	let bytes = 0;
	async function visit(dir) {
		for (const entry of await fsPromises.readdir(dir, { withFileTypes: true })) {
			const file = path.join(dir, entry.name);
			if (entry.isDirectory()) await visit(file);
			else if (entry.isFile()) {
				const stat = await fsPromises.lstat(file);
				bytes += stat.size;
				files.push({
					file,
					size: stat.size,
					mtimeMs: stat.mtimeMs
				});
			}
		}
	}
	await visit(root);
	files.sort((left, right) => left.mtimeMs - right.mtimeMs);
	for (const file of files) if (bytes > MAX_BYTES || now - file.mtimeMs > MAX_AGE_MS) {
		await fsPromises.unlink(file.file);
		bytes -= file.size;
	}
}
if (!isMainThread && typeof workerData?.openclawCompileCacheDirectory === "string") maintain(workerData.openclawCompileCacheDirectory).catch(() => {});
//#endregion
//#region src/infra/node-compile-cache-env.ts
const COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = env.NODE_COMPILE_CACHE ?? compileCacheOwner().baseDirectory;
	if (directory && !resolveSafeNodeCompileCacheDirectory(directory)) {
		const disabled = {
			...env,
			NODE_DISABLE_COMPILE_CACHE: "1"
		};
		delete disabled.NODE_COMPILE_CACHE;
		return disabled;
	}
	if (env.NODE_COMPILE_CACHE !== void 0) return env;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
}
//#endregion
//#region src/infra/sqlite-staging-token.ts
const SQLITE_STAGING_TOKEN_FILES = [
	"owner.sqlite",
	"owner.sqlite-journal",
	"owner.sqlite-wal",
	"owner.sqlite-shm"
];
var SqliteStagingRetiredError = class extends Error {
	constructor() {
		super("SQLite snapshot parent retired; aborting snapshot allocation");
	}
};
/** Native transactions fence private staging admission and committed retirement. */
function acquireSqliteStagingToken(directory, mode, options = {}) {
	const location = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const readIdentity = (pathname, kind) => {
		const stat = fsSync.lstatSync(pathname, { bigint: true });
		if (!(kind === "directory" ? stat.isDirectory() : stat.isFile()) || process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw new Error("SQLite staging ownership is unknown");
		return stat;
	};
	const directoryIdentity = readIdentity(directory, "directory");
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fsSync.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const existing = family[0];
	if (family.some((file) => file && (!file.isFile() || process.getuid && file.uid !== process.getuid())) || !existing && mode !== "create" && !options.allowMissing) throw new Error("SQLite snapshot token ownership is unknown");
	if (mode === "create" && !existing) fsSync.writeFileSync(location, "", {
		flag: "wx",
		mode: 420
	});
	const tokenExists = existing !== void 0 || mode === "create";
	const existingIdentity = tokenExists ? readIdentity(location, "file") : void 0;
	const db = withSqliteNativeOpen(() => openNodeSqliteDatabase(tokenExists ? resolveExistingSqliteFileUri(location) : location));
	let tokenIdentity;
	const kysely = getNodeSqliteKysely(db);
	const execute = (statement) => executeSqliteQueryTakeFirstSync(db, { compile: () => statement.compile(kysely) });
	let exclusive = mode === "reclaim";
	let retired = false;
	const assertIdentity = () => {
		const currentDirectory = readIdentity(directory, "directory");
		if (directoryIdentity.dev !== currentDirectory.dev || directoryIdentity.ino !== currentDirectory.ino) throw new Error("SQLite staging ownership changed before retirement");
		const currentToken = readIdentity(location, "file");
		if (tokenIdentity.dev !== currentToken.dev || tokenIdentity.ino !== currentToken.ino) throw new Error("SQLite staging ownership changed before retirement");
	};
	const readVersion = () => {
		const row = execute(sql`PRAGMA user_version`);
		return isRecord(row) ? row.user_version : void 0;
	};
	const beginRetirement = () => {
		assertIdentity();
		if (!db.isTransaction || !exclusive) {
			if (db.isTransaction) execute(sql`ROLLBACK`);
			execute(sql`BEGIN EXCLUSIVE`);
			exclusive = true;
		}
		return token;
	};
	const release = (retiring = false) => {
		if (!db.isOpen) return;
		if (retiring) {
			beginRetirement();
			if (!retired) execute(sql`PRAGMA user_version=1`);
			execute(sql`COMMIT`);
			retired = true;
		} else if (db.isTransaction) execute(sql`ROLLBACK`);
		db.close();
		if (retiring) retireSqliteDatabaseAdmissionForPath(location);
	};
	const token = Object.assign(release, { beginRetirement });
	try {
		tokenIdentity = existingIdentity ?? readIdentity(location, "file");
		execute(sql`PRAGMA busy_timeout=0`);
		if (mode === "create") execute(sql`BEGIN IMMEDIATE`);
		else if (mode === "reclaim") execute(sql`BEGIN EXCLUSIVE`);
		else {
			execute(sql`BEGIN`);
			execute(sql`SELECT rootpage FROM sqlite_schema LIMIT 1`);
		}
		const journalMode = execute(sql`PRAGMA journal_mode`);
		if (!isRecord(journalMode) || journalMode.journal_mode !== "delete") throw new Error("SQLite snapshot token journal mode is unknown");
		const version = readVersion();
		if (version !== 0 && (mode !== "reclaim" || version !== 1)) throw new SqliteStagingRetiredError();
		retired = version === 1;
		assertIdentity();
		return token;
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-retirement.ts
const SQLITE_SNAPSHOT_PREFIX = "openclaw-sqlite-readonly-v2-";
const suffix = "(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$";
const SQLITE_SNAPSHOT_LEGACY_MARKER = new RegExp(`^openclaw-sqlite-readonly-[1-9]\\d*-${suffix}`, "u");
const tokenMarker = new RegExp(`^${SQLITE_SNAPSHOT_PREFIX}${suffix}`, "u");
const SQLITE_SNAPSHOT_LEGACY_AGE_MS = 864e5;
function releaseTokens(tokens) {
	const failures = [];
	for (const token of tokens) try {
		token();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length) throw new AggregateError(failures, "SQLite snapshot retirement token release failed");
}
const isSqliteSnapshotStagingName = (name) => SQLITE_SNAPSHOT_LEGACY_MARKER.test(name) || tokenMarker.test(name);
function acquireSqliteSnapshotToken(directory, mode) {
	return acquireSqliteStagingToken(directory, mode, { allowMissing: SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(directory)) });
}
/** Hold every nested lifetime before selecting payload; a parent lock alone cannot fence children. */
function beginSqliteSnapshotRetirement(directory, options = {}) {
	const tokens = [];
	const payload = [];
	const release = () => releaseTokens(tokens.filter((token) => token !== options.token));
	if (!fsSync.existsSync(directory)) {
		options.token?.();
		return {
			bytes: 0,
			payload,
			release,
			retire: () => {}
		};
	}
	function inspect(current, inheritedCutoff, layout = "", lock = true) {
		const stat = fsSync.lstatSync(current);
		if (!stat.isDirectory() || process.getuid && stat.uid !== process.getuid()) throw new Error("Snapshot directory ownership is unknown");
		const legacy = !layout && SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(current));
		const cutoff = options.cutoff !== void 0 && legacy ? Math.min(inheritedCutoff, Date.now() - SQLITE_SNAPSHOT_LEGACY_AGE_MS) : inheritedCutoff;
		if (legacy && lock && options.cutoff !== void 0) inspect(current, cutoff, layout, false);
		if (!layout && lock) tokens.push(current === directory && options.token ? options.token.beginRetirement() : acquireSqliteSnapshotToken(current, "reclaim"));
		let bytes = 0;
		let newest = stat.mtimeMs;
		for (const entry of fsSync.readdirSync(current, { withFileTypes: true })) {
			const location = path.join(current, entry.name);
			const item = fsSync.lstatSync(location);
			if (process.getuid && item.uid !== process.getuid()) throw new Error("Snapshot file ownership is unknown");
			if ((!layout || options.cutoff === void 0) && item.isFile() && SQLITE_STAGING_TOKEN_FILES.some((file) => file === entry.name)) continue;
			newest = Math.max(newest, item.mtimeMs);
			if (item.isDirectory()) {
				const nested = isSqliteSnapshotStagingName(entry.name);
				const childLayout = nested ? "" : [layout, entry.name].filter(Boolean).join("/");
				if (options.cutoff !== void 0 && (!nested && ![
					"openclaw",
					"openclaw-state",
					"openclaw-state/state"
				].includes(childLayout) || nested && layout !== "" && layout !== "openclaw")) throw new Error("Unrecognized snapshot directory");
				const child = inspect(location, cutoff, childLayout, lock);
				bytes += child.bytes;
				newest = Math.max(newest, child.newest);
			} else if (options.cutoff === void 0 || item.isFile() && (layout === "openclaw-state/state" ? /^openclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(entry.name) : !layout && /^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(entry.name))) {
				bytes += item.size;
				if (lock) payload.push(location);
			} else throw new Error("Unrecognized snapshot artifact");
		}
		if (newest >= cutoff) throw new Error(legacy ? "Legacy snapshot contains activity newer than 24 hours" : "Snapshot contains activity within the reclamation grace period");
		return {
			bytes,
			newest
		};
	}
	try {
		const { bytes } = inspect(directory, options.cutoff ?? Number.POSITIVE_INFINITY);
		return {
			bytes,
			payload,
			release,
			retire: () => {
				for (const token of tokens) token(true);
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-readonly-location-cleanup.ts
var SqliteSnapshotCleanupError = class extends Error {};
/** A failed result does not discharge the original request's native cleanup custody. */
function settleSqliteSnapshotRequest(request) {
	return request.result.catch(async (error) => {
		try {
			await request.startClose().result;
		} catch (cleanupError) {
			if (cleanupError === error) throw error;
			const combined = createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot allocation and cleanup failed", error);
			throw error instanceof SqliteSnapshotCleanupError ? new SqliteSnapshotCleanupError(error.message, { cause: combined }) : combined;
		}
		throw error;
	});
}
const cleanupState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotCleanup"), () => ({
	directories: /* @__PURE__ */ new Map(),
	activeWork: /* @__PURE__ */ new Map(),
	exitHandlerInstalled: false,
	pendingSignalCleanup: void 0,
	signalCleanup: cleanupSnapshotOperations
}));
const snapshotDirectories = cleanupState.directories;
const activeSnapshotWork = cleanupState.activeWork;
function snapshotDirectory(directory) {
	let owner = snapshotDirectories.get(directory);
	if (!owner) {
		owner = { readers: /* @__PURE__ */ new Set() };
		snapshotDirectories.set(directory, owner);
	}
	return owner;
}
function completeSnapshotDirectoryRemoval(directory) {
	snapshotDirectories.delete(directory);
	return true;
}
function cleanupSnapshotOperations() {
	cleanupState.pendingSignalCleanup ??= (async () => {
		const directories = snapshotDirectories.entries();
		while (true) {
			while (activeSnapshotWork.size > 0) {
				for (const stop of activeSnapshotWork.values()) stop();
				await Promise.allSettled(activeSnapshotWork.keys());
			}
			const next = directories.next();
			if (next.done) break;
			const [directory] = next.value;
			await removeTempDirectoryAsync(directory, (error) => emitSnapshotCleanupFailure({
				cleanupRoot: directory,
				operation: "rm",
				code: extractErrorCode(error)
			}));
		}
	})().finally(() => {
		cleanupState.pendingSignalCleanup = void 0;
	});
	return cleanupState.pendingSignalCleanup;
}
/** Join native backup work or a terminated child before removing its private bytes. */
function retainSnapshotWork(work, stop = () => {}) {
	registerSnapshotCleanup();
	activeSnapshotWork.set(work, stop);
	const release = () => activeSnapshotWork.delete(work);
	work.then(release, release);
	return work;
}
function registerSnapshotTempDirectory(directory, release) {
	const owner = snapshotDirectory(directory);
	owner.release = release ?? owner.release;
	registerSnapshotCleanup();
}
function registerSnapshotCleanup() {
	if (!cleanupState.exitHandlerInstalled) {
		cleanupState.exitHandlerInstalled = true;
		process.once("exit", () => {
			for (const stop of activeSnapshotWork.values()) stop();
			if (activeSnapshotWork.size === 0) for (const pendingDir of snapshotDirectories.keys()) removeTempDirectory(pendingDir);
		});
	}
	registerSignalExitFinalizer(cleanupState.signalCleanup);
}
/** This owner joins token retirement and directory removal in its worker. */
function registerRetainedSnapshotTempDirectory(directory, release) {
	snapshotDirectory(directory).releaseRetained = release;
	registerSnapshotCleanup();
}
/** Rejection is not retirement: only the reader's successful close releases custody. */
function retainSnapshotTempDirectory(directory) {
	registerSnapshotTempDirectory(directory);
	const owner = snapshotDirectory(directory);
	if (owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot retirement has started");
	const reader = Symbol("sqlite.snapshot.reader");
	owner.readers.add(reader);
	return () => owner.readers.delete(reader);
}
const tempDirectoryRemovalOptions = {
	force: true,
	maxRetries: 3,
	recursive: true,
	retryDelay: 20
};
function emitSnapshotCleanupFailure(report, onCleanupFailure) {
	if (onCleanupFailure) try {
		onCleanupFailure(report);
		return;
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: report.cleanupRoot,
			operation: report.operation,
			errorCode: report.code
		}, "SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.");
	} catch {}
}
function assertSnapshotReadersRetired(owner) {
	if (owner?.readers.size) throw new SqliteSnapshotCleanupError("SQLite snapshot still belongs to an active reader");
}
function prepareSnapshotRetirement(directory, owner) {
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	if (owner?.retired || !owner?.release && !fsSync.existsSync(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]))) return;
	if (owner) owner.retirementStarted = true;
	return beginSqliteSnapshotRetirement(directory, { token: owner?.release });
}
/** Delete in the token process: owner death must stop unlinking when its locks disappear. */
function retireSqliteSnapshotPayload(retirement) {
	for (const file of retirement.payload) {
		retireSqliteDatabaseAdmissionForPath(file);
		fsSync.rmSync(file, tempDirectoryRemovalOptions);
	}
	retirement.retire();
}
function removeTempDirectory(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	try {
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			if (retirement) {
				retireSqliteSnapshotPayload(retirement);
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			fsSync.rmSync(tempDir, tempDirectoryRemovalOptions);
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
async function removeTempDirectoryAsync(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	if (owner?.releaseRetained) {
		const removed = await startRemoveTempDirectory(tempDir, onFailure, owner).result;
		if (removed) snapshotDirectories.delete(tempDir);
		return removed;
	}
	try {
		assertSnapshotReadersRetired(owner);
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			for (const file of retirement?.payload ?? []) {
				retireSqliteDatabaseAdmissionForPath(file);
				await retainSnapshotWork(fsSync.promises.rm(file, tempDirectoryRemovalOptions));
			}
			if (retirement) {
				retirement.retire();
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			await retainSnapshotWork(fsSync.promises.rm(tempDir, tempDirectoryRemovalOptions));
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
function startRemoveTempDirectory(directory, onFailure, owner = snapshotDirectories.get(directory)) {
	if (owner?.retiringRetained) return owner.retiringRetained;
	let release;
	const retained = createRetainedOperation(() => {
		if (!release || retained.operation.read().status !== "pending") return;
		release.service();
		const outcome = release.read();
		if (outcome.status === "pending") return;
		if (owner) owner.retiringRetained = void 0;
		if (outcome.status === "rejected") {
			onFailure?.(outcome.error);
			retained.resolve(false);
		} else retained.resolve(completeSnapshotDirectoryRemoval(directory));
	});
	try {
		sealRetainedSnapshotTempDirectory(directory);
		if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
		owner.retiringRetained = retained.operation;
		release = owner.releaseRetained();
		release.result.then(() => retained.operation.service(), () => retained.operation.service());
		retained.operation.service();
	} catch (error) {
		if (owner) owner.retiringRetained = void 0;
		onFailure?.(error);
		retained.resolve(false);
	}
	return retained.operation;
}
/** A surviving native owner may retire bytes only after their original host readers leave. */
function sealRetainedSnapshotTempDirectory(directory, options) {
	const owner = snapshotDirectories.get(directory);
	if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
	if (options?.requireRequested && !owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot is still owned; cleanup has not been requested");
	assertSnapshotReadersRetired(owner);
	owner.retirementStarted = true;
}
function adoptPreparedLocation(location, ownedRoot, requireCleanup = false, onCleanupFailure) {
	const tempDir = ownedRoot ?? path.dirname(location);
	registerSnapshotTempDirectory(tempDir);
	let active = true;
	let pending;
	let retainedCleanup;
	let reported = false;
	let cleanupFailure;
	const reportFailure = (error) => {
		cleanupFailure = error;
		if (!requireCleanup && !reported) {
			reported = true;
			emitSnapshotCleanupFailure({
				cleanupRoot: tempDir,
				operation: "rm",
				code: extractErrorCode(error)
			}, onCleanupFailure);
		}
	};
	const complete = (removed) => {
		if (removed) {
			active = false;
			snapshotDirectories.delete(tempDir);
		} else if (requireCleanup) throw new SqliteSnapshotCleanupError(`SQLite read-only worker snapshot cleanup failed: ${tempDir}`, { cause: cleanupFailure });
		return removed;
	};
	const startCleanup = () => {
		if (retainedCleanup?.read().status === "pending") return retainedCleanup;
		if (!active) {
			const retained = createRetainedOperation(() => {});
			retained.resolve(complete(true));
			return retainedCleanup = retained.operation;
		}
		return retainedCleanup = mapRetainedOperation(startRemoveTempDirectory(tempDir, reportFailure), complete);
	};
	return {
		location,
		cleanupRoot: tempDir,
		cleanup: () => {
			if (pending || retainedCleanup?.read().status === "pending") return requireCleanup ? complete(false) : false;
			if (!active) return complete(true);
			return complete(removeTempDirectory(tempDir, reportFailure));
		},
		cleanupAsync: () => {
			if (snapshotDirectories.get(tempDir)?.releaseRetained || retainedCleanup) return startCleanup().result;
			if (pending) return pending;
			if (!active) return Promise.resolve(complete(true));
			pending = Promise.resolve().then(() => removeTempDirectoryAsync(tempDir, reportFailure)).then(complete).finally(() => {
				pending = void 0;
			});
			return pending;
		},
		startCleanup
	};
}
//#endregion
//#region src/infra/sqlite-readonly-worker-context.ts
const readOnlyWorkerScope = new AsyncLocalStorage();
//#endregion
//#region packages/normalization-core/src/agent-id.ts
const DEFAULT_AGENT_ID = "main";
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
function normalizeAgentId(value) {
	const result = normalizeAgentIdStrict(value);
	return result.ok ? result.value : DEFAULT_AGENT_ID;
}
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
function normalizeAgentIdStrict(value) {
	const trimmed = (value ?? "").trim();
	const normalized = trimmed.toLowerCase();
	if (VALID_ID_RE.test(trimmed)) return ok(normalized);
	const agentId = normalized.replace(INVALID_CHARS_RE, "-").replace(LEADING_DASH_RE, "").replace(TRAILING_DASH_RE, "").slice(0, 64);
	return agentId ? ok(agentId) : err("unrepresentable");
}
//#endregion
//#region src/state/openclaw-agent-db.paths.ts
const INCOGNITO_AGENT_SQLITE_BASENAME = "incognito-openclaw-agent.sqlite";
const agentSqlitePaths = /* @__PURE__ */ new Map();
const agentSqlitePathKeys = agentSqlitePaths.keys();
function resolveOpenClawAgentSqlitePath(options) {
	const agentId = normalizeAgentId(options.agentId);
	if (options.path != null) return path.resolve(options.path);
	const stateDir = resolveStateDir(options.env ?? process.env);
	const cacheKey = `${agentId}:${stateDir}`;
	const cached = agentSqlitePaths.get(cacheKey);
	if (cached !== void 0) return cached;
	const resolved = path.resolve(stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite");
	agentSqlitePaths.set(cacheKey, resolved);
	if (agentSqlitePaths.size > 256) {
		const oldest = agentSqlitePathKeys.next();
		if (!oldest.done) agentSqlitePaths.delete(oldest.value);
	}
	return resolved;
}
/** Resolve the lexical sentinel path used by an agent's memory session owner. */
function resolveIncognitoOpenClawAgentSqlitePath(options) {
	return path.join(path.dirname(resolveOpenClawAgentSqlitePath(options)), INCOGNITO_AGENT_SQLITE_BASENAME);
}
//#endregion
//#region src/state/agent-creation-claim.ts
const creationClaim = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaim"), () => new AsyncLocalStorage());
const creationResources = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaimResources"), () => /* @__PURE__ */ new Map());
function getActiveAgentCreationClaim(agentId, statePath) {
	const scope = creationClaim.getStore();
	if (!scope || scope.kind !== "host" || !scope.isActive() || scope.agentId !== normalizeAgentId(agentId) || scope.statePath !== path.resolve(statePath)) return;
	return scope;
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
//#endregion
//#region src/state/agent-database-admission-error.ts
/** A database owner refused new work; an admitted command's failure is never classified here. */
const AgentDatabaseExecutionAdmissionClosedError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseExecutionAdmissionClosedError"), () => class AdmissionClosedError extends Error {});
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionChangedError"), () => class SchemaAdmissionChangedError extends Error {
	constructor() {
		super("Agent schema admission changed before publication; retry the operation");
	}
});
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionInvalidError"), () => class SchemaAdmissionInvalidError extends Error {
	constructor() {
		super("Invalid agent schema admission receipt");
	}
});
//#endregion
//#region src/state/agent-deletion-cleanup.ts
const databaseCleanup = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanup"), () => new AsyncLocalStorage());
resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupHandles"), () => /* @__PURE__ */ new Map());
resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupExecutions"), () => /* @__PURE__ */ new Map());
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
//#endregion
//#region src/state/openclaw-agent-db-resources.ts
const resources = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseAsyncResources"), () => ({
	active: /* @__PURE__ */ new Set(),
	closing: /* @__PURE__ */ new Map(),
	selections: /* @__PURE__ */ new Map()
}));
registerAgentDatabaseReaderCloser(async (candidates, retainedPaths) => {
	const errors = (await Promise.allSettled([.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => !retainedPaths?.has(path.resolve(resource.path)) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.path))).map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Agent database resource cleanup failed");
});
function matchesAgentDatabaseClose(selection, resource) {
	return (selection.path === void 0 || selection.path === resource.path || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.path)) && (selection.rootPath === void 0 || isPathInside$1(selection.rootPath, resource.path) || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.rootPath)) && (selection.agentId === void 0 || resource.ownership === "unresolved" || selection.agentId === resource.agentId);
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
//#endregion
//#region src/infra/sqlite-readonly-auth-schema.ts
/** Project live owner facts; never retain a closed database's schema in the child. */
function captureSqliteAuthSchema(pathname, expectedIdentity) {
	if (getSqliteDatabaseAdmissionIdentityForPath(pathname)?.key !== expectedIdentity) return;
	const schema = getOrLoadSqliteDatabaseAdmissionForPath(pathname, schemaAdmission, () => void 0);
	if (!schema) return;
	const kind = (name) => schema.tables.has(name) ? "table" : schema.views.has(name) || schema.indexes.has(name) || schema.triggers.has(name) ? "other" : "missing";
	return {
		userVersion: schema.userVersion,
		store: kind("auth_profile_store"),
		state: kind("auth_profile_state")
	};
}
//#endregion
//#region src/infra/json-field-transfer.ts
const JSON_FIELD_TRANSFER_BYTES = 65536;
function isJsonTransferField(field) {
	if (!isRecord(field)) return false;
	if (field.kind === "object" || field.kind === "array" || field.kind === "end") return true;
	return (field.kind === "key" || field.kind === "value") && (field.append === void 0 || field.append === true && typeof field.value === "string") && (typeof field.value === "string" || field.kind === "value" && (field.value === null || typeof field.value === "boolean" || typeof field.value === "number"));
}
function createJsonFieldReceiver() {
	let root;
	let hasRoot = false;
	const stack = [];
	let pending;
	const write = (value) => {
		const parent = stack.at(-1);
		if (parent) {
			if (parent.key === void 0) throw new Error("JSON field has no property key");
			Object.defineProperty(parent.container, parent.key, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
			parent.key = void 0;
		} else {
			if (hasRoot) throw new Error("JSON transfer has more than one root");
			root = value;
			hasRoot = true;
		}
	};
	const flush = () => {
		if (!pending) return;
		const value = pending.chunks.join("");
		if (pending.kind === "key") {
			const parent = stack.at(-1);
			if (!parent || parent.key !== void 0) throw new Error("JSON property key has no value or container");
			parent.key = value;
		} else write(value);
		pending = void 0;
	};
	return {
		accept(field) {
			if (!isJsonTransferField(field)) throw new Error("Invalid JSON transfer field");
			if (field.kind === "key" || field.kind === "value") {
				if (field.append) {
					if (!pending || pending.kind !== field.kind || typeof field.value !== "string") throw new Error("Invalid JSON string continuation");
					pending.chunks.push(field.value);
					return;
				}
				flush();
				if (typeof field.value === "string") pending = {
					kind: field.kind,
					chunks: [field.value]
				};
				else write(field.value);
			} else {
				flush();
				if (field.kind === "end") {
					const parent = stack.pop();
					if (!parent || parent.key !== void 0) throw new Error("JSON container ended with an incomplete field");
				} else {
					const container = field.kind === "array" ? [] : {};
					write(container);
					stack.push({ container });
				}
			}
		},
		finish() {
			flush();
			if (stack.length) throw new Error("JSON transfer ended with an incomplete container");
			return root;
		}
	};
}
//#endregion
//#region src/infra/sqlite-worker-transfer.ts
const SQLITE_WORKER_TRANSFER_FRAME_BYTES = 8388608;
/** One owned result cursor; callers supply records and any associated cleanup. */
function createSqliteWorkerTransferOwner() {
	let nextId = 0;
	let current;
	const cleanup = (transfer) => {
		const errors = [];
		for (const [completed, close] of [["iteratorClosed", () => transfer.iterator.return?.()], ["cleaned", () => transfer.cleanup?.()]]) if (!transfer[completed]) try {
			close();
			transfer[completed] = true;
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "SQLite read transfer cleanup failed");
	};
	const cancel = () => {
		if (current) {
			cleanup(current);
			current = void 0;
		}
	};
	const requireTransfer = (id) => {
		if (!current || current.id !== id) throw new Error("SQLite read transfer is no longer active");
		return current;
	};
	return {
		start(iterator, options) {
			if (current) throw new Error("The preceding SQLite read transfer was not released");
			current = {
				id: ++nextId,
				iterator,
				cleanup: options.cleanup,
				iteratorClosed: false,
				cleaned: false,
				counts: new Map(options.kinds.map((kind) => [kind, 0])),
				sequence: 0,
				finished: false
			};
			return {
				id: current.id,
				kinds: [...current.counts.keys()]
			};
		},
		next(id) {
			const transfer = requireTransfer(id);
			if (transfer.finished) throw new Error("SQLite read transfer has already reached its end");
			if (transfer.record && transfer.record.offset === transfer.record.bytes.byteLength) transfer.record = void 0;
			if (!transfer.record) {
				const next = transfer.iterator.next();
				if (next.done) {
					cleanup(transfer);
					transfer.finished = true;
					return {
						id,
						sequence: transfer.sequence++,
						done: true,
						counts: [...transfer.counts]
					};
				}
				const { kind } = next.value;
				const count = transfer.counts.get(kind);
				if (count === void 0) throw new Error("SQLite read transfer returned an unexpected record kind");
				transfer.record = {
					kind,
					bytes: "serialized" in next.value ? next.value.serialized : serialize(next.value.value),
					offset: 0
				};
				transfer.counts.set(kind, count + 1);
			}
			const record = transfer.record;
			const offset = record.offset;
			const end = Math.min(record.bytes.byteLength, offset + SQLITE_WORKER_TRANSFER_FRAME_BYTES);
			record.offset = end;
			return {
				id,
				sequence: transfer.sequence++,
				done: false,
				kind: record.kind,
				recordBytes: record.bytes.byteLength,
				offset,
				recordDone: end === record.bytes.byteLength,
				bytes: new Uint8Array(record.bytes.subarray(offset, end))
			};
		},
		end(id) {
			if (!requireTransfer(id).finished) throw new Error("SQLite read transfer ended before its complete result");
			cancel();
		},
		cancel,
		close: cancel
	};
}
/** Reassembles one transfer; its caller owns transport completion and cancellation. */
function createSqliteWorkerTransferReceiver(handle, consume) {
	const counts = new Map(handle.kinds.map((kind) => [kind, 0]));
	let sequence = 0;
	let finished = false;
	let record;
	return { accept(frame) {
		try {
			if (finished || frame.id !== handle.id || frame.sequence !== sequence++) throw new Error("SQLite read transfer frame is out of order");
			if (frame.done) {
				if (record || frame.counts.length !== counts.size || frame.counts.some(([kind, count]) => counts.get(kind) !== count) || new Set(frame.counts.map(([kind]) => kind)).size !== counts.size) throw new Error("SQLite read transfer ended with an incomplete result");
				finished = true;
				return frame.counts;
			}
			const count = counts.get(frame.kind);
			if (count === void 0 || !Number.isSafeInteger(frame.recordBytes) || frame.recordBytes < 1 || !Number.isSafeInteger(frame.offset) || frame.offset < 0 || frame.bytes.byteLength < 1 || frame.bytes.byteLength > 8388608) throw new Error("SQLite read transfer returned an invalid frame");
			if (!record) {
				if (frame.offset !== 0) throw new Error("SQLite read transfer omitted the start of a record");
				record = {
					kind: frame.kind,
					bytes: new Uint8Array(frame.recordBytes),
					offset: 0
				};
			}
			const end = frame.offset + frame.bytes.byteLength;
			if (record.kind !== frame.kind || record.bytes.byteLength !== frame.recordBytes || record.offset !== frame.offset || end > frame.recordBytes || frame.recordDone !== (end === frame.recordBytes)) throw new Error("SQLite read transfer returned a discontinuous record");
			record.bytes.set(frame.bytes, frame.offset);
			record.offset = end;
			if (frame.recordDone) {
				const value = deserialize(record.bytes);
				const kind = record.kind;
				record = void 0;
				consume({
					kind,
					value
				});
				counts.set(kind, count + 1);
			}
			return;
		} catch (error) {
			record = void 0;
			finished = true;
			throw error;
		}
	} };
}
//#endregion
//#region src/infra/sqlite-readonly-auth-transfer.ts
function decodeFrame(value, label) {
	if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence)) throw new Error(`Invalid ${label} transfer frame`);
	const { id, sequence } = value;
	if (value.done === true && Array.isArray(value.counts)) {
		const counts = [];
		for (const entry of value.counts) {
			if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || typeof entry[1] !== "number" || !Number.isSafeInteger(entry[1]) || entry[1] < 0) throw new Error(`Invalid ${label} transfer counts`);
			counts.push([entry[0], entry[1]]);
		}
		return {
			id,
			sequence,
			done: true,
			counts
		};
	}
	if (value.done !== false || typeof value.kind !== "string" || typeof value.recordBytes !== "number" || typeof value.offset !== "number" || typeof value.recordDone !== "boolean" || typeof value.bytes !== "string" || value.bytes.length > 4 * Math.ceil(8388608 / 3)) throw new Error(`Invalid ${label} transfer bytes`);
	const bytes = Buffer.from(value.bytes, "base64");
	if (bytes.toString("base64") !== value.bytes) throw new Error(`Invalid ${label} transfer encoding`);
	return {
		id,
		sequence,
		done: false,
		kind: value.kind,
		recordBytes: value.recordBytes,
		offset: value.offset,
		recordDone: value.recordDone,
		bytes
	};
}
function createSqliteReadOnlyTransferReceiver(options) {
	let receiver;
	let transferId;
	let ending = false;
	let completed = false;
	return { accept(value) {
		if (!isRecord(value) || completed) throw new Error(`Invalid ${options.label} transfer response`);
		if (value.type === "start" && !receiver) {
			const handle = value.handle;
			if (!isRecord(handle) || typeof handle.id !== "number" || !Number.isSafeInteger(handle.id) || handle.id < 1 || !Array.isArray(handle.kinds) || handle.kinds.length !== options.kinds.length || handle.kinds.some((kind, index) => kind !== options.kinds[index])) throw new Error(`Invalid ${options.label} transfer handle`);
			transferId = handle.id;
			receiver = createSqliteWorkerTransferReceiver({
				id: transferId,
				kinds: options.kinds
			}, ({ kind, value: record }) => options.acceptRecord(kind, record));
			return { request: {
				type: "next",
				transferId
			} };
		}
		if (!receiver || transferId === void 0) throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer has not started`);
		if (value.type === "frame" && !ending) {
			const frame = decodeFrame(value.frame, options.label);
			if (!frame.done && options.maxRecordBytes && frame.recordBytes > options.maxRecordBytes) throw new Error(`${options.label} transfer record exceeds its bound`);
			const counts = receiver.accept(frame);
			if (counts) {
				if (counts.length !== options.kinds.length || counts.some(([, count]) => count < 1)) throw new Error(`Incomplete ${options.label} transfer result`);
				ending = true;
			}
			return { request: {
				type: ending ? "end" : "next",
				transferId
			} };
		}
		if (value.type === "complete" && ending) {
			completed = true;
			return { value: options.readResult() };
		}
		throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer response is out of order`);
	} };
}
function createSqliteAuthTransferReceiver() {
	const receiver = createJsonFieldReceiver();
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["fields"],
		label: "auth profile",
		maxRecordBytes: JSON_FIELD_TRANSFER_BYTES,
		acceptRecord(_kind, batch) {
			if (!Array.isArray(batch)) throw new Error("Invalid auth profile field batch");
			for (const field of batch) receiver.accept(field);
		},
		readResult() {
			const rows = receiver.finish();
			if (!isRecord(rows) || !("store" in rows) || !("state" in rows) || typeof rows.cacheable !== "boolean") throw new Error("Invalid auth profile transfer rows");
			return {
				store: rows.store,
				state: rows.state,
				cacheable: rows.cacheable
			};
		}
	});
}
function createSqliteOperationTransferReceiver(operation) {
	let result;
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["result"],
		label: "SQLite operation",
		acceptRecord(_kind, record) {
			if (result || !isRecord(record) || record.operation !== operation || !("value" in record)) throw new Error("SQLite read-only worker returned a different or duplicate operation");
			result = {
				operation,
				value: record.value
			};
		},
		readResult() {
			if (!result) throw new Error("SQLite read-only worker returned no operation");
			return result;
		}
	});
}
//#endregion
//#region src/infra/private-directory-creation.ts
const refusedCreations = /* @__PURE__ */ new WeakSet();
/** Record a completed native refusal without replacing its semantic code, diagnostics, or identity. */
function markPrivateDirectoryCreationRefused(error) {
	if (error !== null && typeof error === "object") refusedCreations.add(error);
	return error;
}
function isPrivateDirectoryCreationRefused(error) {
	return error !== null && typeof error === "object" && refusedCreations.has(error);
}
//#endregion
//#region src/infra/sqlite-readonly-worker-protocol.ts
const SQLITE_READONLY_WORKER_MAX_BUFFER = 1048576;
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
var SqliteReadOnlyInspectionContentionError = class extends Error {};
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	const args = [options.mode, path.resolve(pathname)];
	const stagingRoot = options.stagingRoot && path.resolve(options.stagingRoot);
	const expected = options.mode === "auth-profile-rows" || options.mode === "operation" ? void 0 : options.expectedSourceIdentity;
	if (expected !== void 0) {
		if (options.mode !== "sync") throw new Error("SQLite source identity is supported only for artifact-preserving sync copies");
		args.push(stagingRoot ?? "", JSON.stringify(readDatabaseFileIdentity(expected)));
	} else if (stagingRoot) args.push(stagingRoot);
	return args;
}
function isSqliteReadOnlyWorkerResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (Object.keys(value).length !== 2 || !("ok" in value)) return false;
	return value.ok === true && "location" in value && typeof value.location === "string" || value.ok === true && "contentVersion" in value && typeof value.contentVersion === "string" && /^(?:[a-f0-9]{64})?$/.test(value.contentVersion) || value.ok === true && "generation" in value && typeof value.generation === "string" || value.ok === true && "warnings" in value && Array.isArray(value.warnings) && value.warnings.every((warning) => typeof warning === "string") || value.ok === false && "message" in value && typeof value.message === "string";
}
function createSqliteReadOnlyWorkerError(message, stderr, options) {
	const stderrTail = toUSVString(sliceUtf16Safe(stderr.trim(), -4e3));
	return new Error(`SQLite read-only worker ${message}${stderrTail ? `\nstderr (tail): ${stderrTail}` : ""}`, options);
}
function parseSqliteReadOnlyWorkerResult(stdout, stderr) {
	if (!stdout.trim()) throw createSqliteReadOnlyWorkerError("returned no JSON result", stderr);
	let message;
	try {
		message = JSON.parse(stdout);
	} catch {
		throw createSqliteReadOnlyWorkerError("returned invalid JSON", stderr);
	}
	if (!isSqliteReadOnlyWorkerResult(message)) throw createSqliteReadOnlyWorkerError("returned an invalid result", stderr);
	return message;
}
function readSqliteReadOnlyWorkerValue(params, mode) {
	if (params.kind === "launch-failed") throw params.error;
	let result;
	try {
		result = parseSqliteReadOnlyWorkerResult(params.stdout, params.stderr);
	} catch (error) {
		if (params.failure) throw createSqliteReadOnlyWorkerError(params.failure, params.stderr, { cause: params.cause });
		throw error;
	}
	if (params.status !== 0 || params.failure || !result.ok) {
		const contention = !result.ok && result.message.startsWith("Retryable SQLite inspection contention: ");
		const message = !result.ok ? contention ? result.message.slice(40) : result.message : params.failure ?? `exited with code ${params.status}`;
		const allocationRefused = params.failure === void 0 && !result.ok && (mode === "staging-create" || mode === "staging-create-legacy") && message.startsWith("SQLite snapshot directory creation refused: ");
		const error = createSqliteReadOnlyWorkerError(allocationRefused ? message.slice(44) : message, params.stderr, { cause: params.cause });
		if (contention) {
			const failure = new SqliteReadOnlyInspectionContentionError(error.message);
			throw allocationRefused ? markPrivateDirectoryCreationRefused(failure) : failure;
		}
		throw error;
	}
	if ((mode === "sync" || mode === "async" || mode === "consolidated" || isSqliteSnapshotStagingMode(mode)) && "location" in result) return result.location;
	if (mode === "content-version" && "contentVersion" in result) return result.contentVersion;
	if ((mode === "file-generation" || mode === "update-generation") && "generation" in result) return result.generation;
	if (mode === "reclaim" && "warnings" in result) return result.warnings;
	throw createSqliteReadOnlyWorkerError("returned a result for a different operation", params.stderr);
}
//#endregion
//#region src/infra/sqlite-readonly-worker-session.ts
function isSameSqliteReadOnlyWorkerLaunch(captured, requested) {
	const keys = Object.keys(requested.env);
	return captured.runtimeGeneration === requested.runtimeGeneration && captured.transport.kind === requested.transport.kind && (captured.transport.kind === "native" || requested.transport.kind === "broker" && captured.transport.owner === requested.transport.owner) && requested.cwd === captured.cwd && keys.length === Object.keys(captured.env).length && keys.every((key) => requested.env[key] === captured.env[key]);
}
function createSqliteReadOnlyWorkerSession(host) {
	const env = { ...host.env };
	const cwd = host.cwd;
	const executable = process.execPath;
	const transport = host.transport.kind === "broker" ? {
		kind: "broker",
		owner: host.transport.owner
	} : { kind: "native" };
	const capturedLaunch = {
		env,
		cwd,
		transport,
		runtimeGeneration: host.runtimeGeneration
	};
	const argv = [...host.argv];
	const spawnOptions = {
		env,
		...transport.kind === "native" && cwd === tryProcessCwd() ? {} : { cwd },
		stdio: [
			"ignore",
			"pipe",
			"pipe",
			"ipc"
		],
		windowsHide: true
	};
	const child = transport.kind === "broker" ? transport.owner.spawn(executable, argv, spawnOptions) : spawn(executable, argv, spawnOptions);
	recordChildProcessSpawn(executable, child, host.pooledRead ? `sqlite.scoped-read.${transport.kind}` : `sqlite.session.${transport.kind}`);
	const setIdle = (idle) => {
		if (transport.kind !== "native") return;
		const method = idle ? "unref" : "ref";
		child[method]();
		child.channel?.[method]?.();
		for (const stream of [child.stdout, child.stderr]) if (stream instanceof Socket) stream[method]();
	};
	let retired = false;
	let sequence = 0;
	let pendingOperation;
	let stderr = "";
	let outputBytes = 0;
	let pending;
	const { promise: closeSignal, resolve: resolveClosed } = createDeferredCore();
	const authReaderResources = /* @__PURE__ */ new Map();
	const closed = closeSignal.then(async () => {
		if (transport.kind === "broker" && child instanceof BrokerChild && !child.notStarted && child.exitCode === null && child.signalCode === null) await transport.owner.waitForCleanup();
		for (const unregister of authReaderResources.values()) unregister();
		authReaderResources.clear();
	});
	const retire = (error) => {
		setIdle(false);
		retired = true;
		if (pending && error !== void 0) pending.failure ??= error;
		child.kill("SIGKILL");
	};
	const sendMessage = (message) => child.send(message, (error) => {
		if (error) retire(error);
	});
	const releasePending = (request) => {
		pending = void 0;
		pendingOperation = void 0;
		request.cleanup();
		if (host.pooledRead) {
			for (const unregister of authReaderResources.values()) unregister();
			authReaderResources.clear();
		}
		return request;
	};
	if (host.retainLifetime !== false) retainSnapshotWork(closed, () => retire(/* @__PURE__ */ new Error("SQLite snapshot owner stopped")));
	let spawned = false;
	let nativeClosed = false;
	child.once("spawn", () => {
		spawned = true;
	});
	child.on("error", (error) => retire(spawned ? error : Object.assign(new Error([[
		"EACCES",
		"ENOENT",
		"EPERM"
	].includes(error.code ?? "") ? `SQLite read-only worker runtime binary not executable: ${executable} (${error.code}, cwd ${cwd}). Check runtime execute permissions and access to the working directory` : `SQLite read-only worker failed to start (executable ${executable}, cwd ${cwd})`, error.message].join(": "), { cause: error }), { code: error.code })));
	child.once("close", (code, signal) => {
		nativeClosed = true;
		retired = true;
		if (pending) {
			const request = releasePending(pending);
			request.reject(request.failure ?? createSqliteReadOnlyWorkerError(`exited with ${signal ? `signal ${signal}` : `code ${code}`}`, stderr));
		}
		resolveClosed();
	});
	const captureOutput = (data, isStderr) => {
		outputBytes += data.length;
		if (isStderr) stderr = sliceUtf16Safe(stderr + data.toString("utf8"), -4e3);
		if (outputBytes > 1048576) retire(createSqliteReadOnlyWorkerError("exceeded its output buffer", stderr));
	};
	const attachOutput = () => {
		child.stdout?.on("data", (data) => captureOutput(data, false));
		child.stderr?.on("data", (data) => captureOutput(data, true));
	};
	const ready = child instanceof BrokerChild ? child.ready().then(attachOutput).catch(retire) : void 0;
	if (!ready) attachOutput();
	child.on("message", (message) => {
		if (retired) return;
		if (!pending || !message || typeof message !== "object" || Object.keys(message).length !== 2 || !("id" in message) || message.id !== pending.id || !("result" in message)) {
			retire(createSqliteReadOnlyWorkerError("returned an unexpected response", stderr));
			return;
		}
		try {
			let value;
			if (pending.transfer && !(typeof message.result === "object" && message.result !== null && "ok" in message.result && message.result.ok === false)) {
				const reply = pending.transfer.accept(message.result);
				if ("request" in reply) {
					sendMessage({
						id: pending.id,
						transfer: reply.request
					});
					return;
				}
				value = reply.value;
			} else value = readSqliteReadOnlyWorkerValue({
				kind: "launched",
				stdout: JSON.stringify(message.result),
				stderr,
				status: 0
			}, pending.mode);
			releasePending(pending).resolve(value);
		} catch (error) {
			if (pending && host.retainOnOperationError && isSqliteSnapshotStagingMode(pending.mode) && isSqliteReadOnlyWorkerResult(message.result) && !message.result.ok) {
				releasePending(pending).reject(error);
				return;
			}
			retire(error);
		}
	});
	const session = {
		closed,
		isRetired() {
			return retired;
		},
		get notStarted() {
			return child instanceof BrokerChild ? child.notStarted : nativeClosed && !spawned;
		},
		createNativeReplacement() {
			return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
				...host,
				env,
				cwd,
				argv,
				transport: { kind: "native" }
			}));
		},
		compatible(launch) {
			return !retired && isSameSqliteReadOnlyWorkerLaunch(capturedLaunch, launch);
		},
		run(pathname, options) {
			if (retired) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker is closed"));
			if (options.mode === "auth-profile-rows" && options.source === "canonical" && !options.artifactPreserving) {
				const databasePath = path.resolve(pathname);
				if (!authReaderResources.has(databasePath)) authReaderResources.set(databasePath, registerOpenClawAgentDatabaseReadCandidateResource({
					path: databasePath,
					revoke: () => retire(/* @__PURE__ */ new Error("Auth profile reader owner was revoked")),
					close: () => session.close()
				}));
			}
			return pendingOperation = new Promise((resolve, reject) => {
				const { timeoutMs, size } = host.readBudget(pathname);
				stderr = "";
				outputBytes = 0;
				const abort = () => retire(options.signal?.reason);
				const timer = host.deadlineOwnedByCaller() ? void 0 : setTimeout(() => retire(host.timeoutError(pathname, timeoutMs, size)), timeoutMs);
				const id = ++sequence;
				pending = {
					id,
					mode: options.mode,
					...options.mode === "auth-profile-rows" ? { transfer: createSqliteAuthTransferReceiver() } : options.mode === "operation" ? { transfer: createSqliteOperationTransferReceiver(options.command.type) } : {},
					resolve,
					reject,
					cleanup: () => {
						clearTimeout(timer);
						options.signal?.removeEventListener("abort", abort);
					}
				};
				options.signal?.addEventListener("abort", abort, { once: true });
				if (options.signal?.aborted) {
					abort();
					return;
				}
				const send = () => {
					if (retired) return;
					try {
						const request = {
							id,
							args: host.requestArgs(pathname, options),
							...options.mode === "auth-profile-rows" || options.mode === "operation" ? { [options.mode === "operation" ? "operation" : "auth"]: {
								expectedIdentity: options.expectedIdentity,
								artifactPreserving: options.artifactPreserving,
								...options.mode === "operation" ? { command: serialize(options.command).toString("base64") } : {
									retainReader: !host.pooledRead && options.source === "canonical" && !options.artifactPreserving,
									schema: options.source === "canonical" && !options.artifactPreserving ? captureSqliteAuthSchema(pathname, options.expectedIdentity) : void 0
								}
							} } : {}
						};
						if (options.mode === "operation" && Buffer.byteLength(JSON.stringify(request)) > 1048576) throw new Error("SQLite read-only operation exceeded its request buffer");
						sendMessage(request);
					} catch (error) {
						retire(error);
					}
				};
				if (ready) ready.then(send);
				else send();
			});
		},
		setIdle,
		async close() {
			session.setIdle(false);
			if (retired) {
				await closed;
				return;
			}
			retired = true;
			const timer = setTimeout(() => retire(), host.closeTimeoutMs);
			try {
				sendMessage("close");
			} catch (error) {
				retire(error);
			}
			try {
				await closed;
			} finally {
				clearTimeout(timer);
			}
		}
	};
	host.runtimeGeneration?.retain(session, async () => {
		await pendingOperation?.catch(() => void 0);
		return () => session.close();
	});
	return session;
}
//#endregion
//#region src/infra/sqlite-readonly-worker-pool.ts
const log$1 = createSubsystemLogger("state/sqlite");
function trackSqliteRead(options) {
	return trackWorkerRequest("sqlite_read", classifyWorkerRequest(options.mode === "operation" ? options.command.type : options.mode), options.signal);
}
function createSqliteReadOnlyWorkerPool(createSession) {
	const scopedReadWorkers = [];
	const SCOPED_READ_WORKER_LIMIT = 4;
	const SCOPED_READ_WORKER_IDLE_MS = 6e4;
	const statefulReadWorkers = /* @__PURE__ */ new WeakMap();
	const readWorkerReleaseWaiters = /* @__PURE__ */ new Set();
	const closingBrokers = /* @__PURE__ */ new WeakSet();
	const assertBrokerOpen = (launch) => {
		if (launch.transport.kind === "broker" && closingBrokers.has(launch.transport.owner)) throw new Error("SQLite read-only worker broker is closing");
	};
	async function closeSlot(slot) {
		const worker = slot.session;
		try {
			await worker?.close();
			slot.session = void 0;
		} catch (error) {
			slot.quarantined = { error };
			for (const released of readWorkerReleaseWaiters) released();
			throw error;
		}
	}
	async function selectScopedReadWorker(options, launch) {
		assertBrokerOpen(launch);
		const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
		const scope = readOnlyWorkerScope.getStore();
		if (stateful) {
			if (!scope?.active) throw new Error("Database page-cache warm requires an active read-only worker scope");
			const retained = statefulReadWorkers.get(scope);
			if (retained) {
				if (!isSameSqliteReadOnlyWorkerLaunch(retained.launch, launch)) throw new Error("Database page-cache warm worker launch changed during its scope");
				return retained;
			}
			if (options.command.type === "pageCache.step") throw new Error("Database page-cache warm is no longer active");
		}
		for (;;) {
			assertBrokerOpen(launch);
			options.signal?.throwIfAborted();
			const available = scopedReadWorkers.filter((candidate) => !candidate.leased && !candidate.quarantined);
			let slot = available.find((candidate) => isSameSqliteReadOnlyWorkerLaunch(candidate.launch, launch));
			if (!slot && scopedReadWorkers.length < SCOPED_READ_WORKER_LIMIT) {
				slot = {
					launch,
					tail: Promise.resolve(),
					queued: 0
				};
				scopedReadWorkers.push(slot);
			}
			slot ??= available.find((candidate) => candidate.queued === 0 && !candidate.session);
			slot ??= available.reduce((best, candidate) => !best || candidate.queued < best.queued ? candidate : best, void 0);
			if (slot) {
				if (stateful && scope) {
					const retained = slot;
					const lease = { started: false };
					retained.leased = lease;
					statefulReadWorkers.set(scope, retained);
					scope.releaseReadWorker = async () => {
						try {
							if (lease.started) {
								await retained.tail;
								await closeSlot(retained);
							}
						} finally {
							retained.leased = void 0;
							statefulReadWorkers.delete(scope);
							scope.releaseReadWorker = void 0;
							if (!retained.quarantined && retained.queued === 0 && retained.session && !retained.session.isRetired()) {
								retained.session.setIdle(true);
								armScopedReadWorkerIdle(retained);
							}
							for (const released of readWorkerReleaseWaiters) released();
						}
					};
				}
				return slot;
			}
			if (scopedReadWorkers.every((candidate) => candidate.quarantined)) throw new AggregateError(scopedReadWorkers.map((candidate) => candidate.quarantined?.error), "SQLite read-only worker capacity is held by unconfirmed cleanup");
			let released;
			const availableWorker = runInDetachedAsyncContext(() => new Promise((resolve) => {
				released = resolve;
			}));
			readWorkerReleaseWaiters.add(released);
			try {
				await racePromiseWithAbortSignal(availableWorker, options.signal, (signal) => signal.reason);
			} finally {
				readWorkerReleaseWaiters.delete(released);
			}
		}
	}
	function retireIdleSlot(slot) {
		clearTimeout(slot.idle);
		const closing = runInDetachedAsyncContext(() => closeSlot(slot));
		slot.tail = closing.catch(() => {
			log$1.warn("Idle SQLite read-only worker cleanup failed");
		});
		return closing;
	}
	function armScopedReadWorkerIdle(slot) {
		if (slot.launch.transport.kind === "broker" && closingBrokers.has(slot.launch.transport.owner)) {
			retireIdleSlot(slot);
			return;
		}
		slot.idle = runInDetachedAsyncContext(() => setTimeout(() => {
			retireIdleSlot(slot);
		}, SCOPED_READ_WORKER_IDLE_MS));
		slot.idle.unref();
	}
	return {
		run: async function runSqliteScopedReadWorker(pathname, options, launch, observation = trackSqliteRead(options)) {
			const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
			let selected;
			try {
				selected = await selectScopedReadWorker(options, launch);
				assertBrokerOpen(launch);
			} catch (error) {
				observation.completed();
				throw error;
			}
			clearTimeout(selected.idle);
			selected.queued++;
			const previous = selected.tail;
			const operation = runInDetachedAsyncContext(() => racePromiseWithAbortSignal(previous, options.signal, (signal) => signal.reason)).then(async () => {
				options.signal?.throwIfAborted();
				if (selected.quarantined) throw selected.quarantined.error;
				observation.started();
				if (selected.leased && options.mode === "operation" && options.command.type === "pageCache.begin") selected.leased.started = true;
				if (!isSameSqliteReadOnlyWorkerLaunch(selected.launch, launch) || selected.session?.isRetired()) await closeSlot(selected);
				options.signal?.throwIfAborted();
				selected.launch = launch;
				const worker = selected.session ??= createSession({
					...launch,
					pooledRead: true
				});
				worker.setIdle(false);
				try {
					const value = await worker.run(pathname, options);
					options.signal?.throwIfAborted();
					if (!stateful && !getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources) await closeSlot(selected);
					return value;
				} catch (error) {
					try {
						await closeSlot(selected);
					} catch (cleanupError) {
						throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite read and child cleanup failed", error);
					}
					throw error;
				}
			}).finally(() => {
				observation.completed();
				selected.queued--;
				if (!selected.leased && !selected.quarantined && selected.queued === 0 && selected.session && !selected.session.isRetired()) {
					selected.session?.setIdle(true);
					armScopedReadWorkerIdle(selected);
				}
			});
			selected.tail = runInDetachedAsyncContext(() => Promise.allSettled([previous, operation]).then(() => {}));
			return operation;
		},
		async closeBroker(broker) {
			closingBrokers.add(broker);
			const failures = (await Promise.allSettled(scopedReadWorkers.filter((slot) => slot.launch.transport.kind === "broker" && slot.launch.transport.owner === broker && slot.session && slot.queued === 0 && !slot.leased && !slot.quarantined).map(retireIdleSlot))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
			if (failures.length) throw new AggregateError(failures, "SQLite read-only broker worker cleanup failed");
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-worker.ts
const SQLITE_INSPECTION_TIMEOUT_MS = 3e5;
const SQLITE_INSPECTION_BYTES_PER_SECOND = 33554432;
const log = createSubsystemLogger("state/sqlite");
function resolveSqliteInspectionBudget(operation, pathname, sizeBytes) {
	const timeoutMs = resolveTimerTimeoutMs(SQLITE_INSPECTION_TIMEOUT_MS + Math.ceil(40 * Number(sizeBytes ?? 0) / SQLITE_INSPECTION_BYTES_PER_SECOND) * 1e3, SQLITE_INSPECTION_TIMEOUT_MS);
	const size = sizeBytes === void 0 ? "unknown size" : formatByteSize(Number(sizeBytes), {
		style: "iec",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: sizeBytes < 1024n ? 0 : 1
	});
	if (timeoutMs > SQLITE_INSPECTION_TIMEOUT_MS) log.debug(`SQLite ${operation} for ${pathname}: ${size}, budget ${timeoutMs / 1e3} seconds`);
	return {
		timeoutMs,
		size
	};
}
function readSqliteInspectionBudget(operation, pathname, mainSizeBytes) {
	let sizeBytes = mainSizeBytes;
	try {
		sizeBytes ??= fsSync.statSync(pathname, { bigint: true }).size;
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += fsSync.statSync(pathname + suffix, { bigint: true }).size;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	} catch {}
	return resolveSqliteInspectionBudget(operation, pathname, sizeBytes);
}
function sqliteInspectionTimeoutError(operation, pathname, timeoutMs, size) {
	return /* @__PURE__ */ new Error(`SQLite ${operation} timed out after ${timeoutMs / 1e3} seconds (budget for ${size}) for ${pathname}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`);
}
/** A retained startup inspection is cancelled by its Gateway, not by its foreground wait. */
function isSqliteInspectionDeadlineOwnedByCaller() {
	return readOnlyWorkerScope.getStore()?.deadlineOwnedByCaller === true;
}
function resolveSqliteInspectionSignal(signal) {
	const scope = readOnlyWorkerScope.getStore();
	return scope ? signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal : signal;
}
/** Bind a one-shot inspection to the active scope's cancellation and close join. */
function runScopedSqliteInspection(signal, inspect) {
	const scope = readOnlyWorkerScope.getStore();
	if (!scope) return inspect(signal);
	if (!scope.active) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
	const operation = inspect(signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal);
	scope.pending.add(operation);
	operation.then(() => scope.pending.delete(operation), () => scope.pending.delete(operation));
	return operation;
}
function sqliteReadOnlyWorkerArgv(pathname, options) {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl(options.mode === "content-version" || options.mode === "file-generation" ? "sqliteSourceRevision" : "sqliteReadOnly"));
	return {
		runtimeGeneration,
		argv: [
			...resolveForwardedNodeCompilerArgs(),
			...resolveRuntimeWorkerArgv(moduleUrl),
			SQLITE_READONLY_CHILD_ARG,
			...sqliteReadOnlyWorkerRequestArgs(pathname, options)
		]
	};
}
/** Capture launch facts before awaiting another session's retirement. */
function captureSqliteReadOnlyWorkerLaunch(env, source) {
	const broker = source === void 0 ? void 0 : getSpawnBroker();
	return {
		runtimeGeneration: captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnly")).runtimeGeneration,
		env: {
			...resolveNodeCompileCacheEnv(env),
			OPENCLAW_STATE_DIR: resolveStateDir(env)
		},
		cwd: tryProcessCwd() ?? tmpdir(),
		transport: broker ? {
			kind: "broker",
			owner: broker
		} : { kind: "native" }
	};
}
function createScopedSqliteReadOnlyWorker(launch) {
	const workerUrl = resolveRuntimeProcessEntrypointUrl("sqliteReadOnly");
	return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
		...launch,
		argv: [
			...resolveRuntimeWorkerArgv(launch.runtimeGeneration?.resolve(workerUrl) ?? workerUrl),
			SQLITE_READONLY_CHILD_ARG,
			"session"
		],
		requestArgs: sqliteReadOnlyWorkerRequestArgs,
		readBudget: (pathname) => readSqliteInspectionBudget("read-only snapshot", pathname),
		deadlineOwnedByCaller: launch.retainLifetime === false ? () => false : isSqliteInspectionDeadlineOwnedByCaller,
		timeoutError: (pathname, timeoutMs, size) => sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size),
		closeTimeoutMs: SQLITE_INSPECTION_TIMEOUT_MS
	}));
}
/** Reuse a caller-owned native session without creating a canonical-read broker. */
async function runScopedSqliteReadOnlyOperation(worker, pathname, command, options) {
	const capturedCommand = structuredClone(command);
	const result = await worker.run(pathname, {
		...options,
		mode: "operation",
		command: capturedCommand
	});
	return readOperationResult(capturedCommand.type, result);
}
function readOperationResult(type, result) {
	if (typeof result !== "object" || !("operation" in result) || result.operation !== type) throw new Error("SQLite read-only worker returned a different operation");
	return result.value;
}
function runSqliteReadOnlyWorker(pathname, inputOptions) {
	const options = (inputOptions.mode === "auth-profile-rows" || inputOptions.mode === "operation") && isArtifactPreservingStateRead("agent", pathname) ? {
		...inputOptions,
		artifactPreserving: true
	} : inputOptions;
	if (options.mode === "reclaim") return readOnlyWorkerScope.exit(() => runSqliteReadOnlyWorkerOnce(pathname, options));
	return runScopedSqliteInspection(options.signal, (signal) => {
		const scope = readOnlyWorkerScope.getStore();
		if (!scope) return runSqliteReadOnlyWorkerOnce(pathname, options);
		const scopedOptions = {
			...options,
			signal
		};
		const useScopedWorker = options.mode === "sync" && !scope.busy;
		if (useScopedWorker) scope.busy = true;
		if (scopedOptions.mode === "auth-profile-rows" || scopedOptions.mode === "operation") {
			const launch = captureSqliteReadOnlyWorkerLaunch(scopedOptions.env, scopedOptions.source);
			return sqliteReadOnlyWorkerPool.run(pathname, scopedOptions, launch);
		}
		return (async () => {
			if (!useScopedWorker) return runSqliteReadOnlyWorkerOnce(pathname, scopedOptions);
			try {
				const launch = captureSqliteReadOnlyWorkerLaunch();
				if (!scope.worker?.compatible(launch)) {
					await scope.worker?.close();
					scopedOptions.signal?.throwIfAborted();
					scope.worker = createScopedSqliteReadOnlyWorker(launch);
				}
				return await scope.worker.run(pathname, scopedOptions);
			} finally {
				scope.busy = false;
			}
		})();
	});
}
const sqliteReadOnlyWorkerPool = createSqliteReadOnlyWorkerPool(createScopedSqliteReadOnlyWorker);
function runSqliteReadOnlyWorkerOnce(pathname, options, launch) {
	if (options.mode === "auth-profile-rows" || options.mode === "operation") return sqliteReadOnlyWorkerPool.run(pathname, options, captureSqliteReadOnlyWorkerLaunch(options.env, options.source));
	const reclaim = options.mode === "reclaim";
	const { argv, runtimeGeneration } = sqliteReadOnlyWorkerArgv(pathname, options);
	return runOneShotSqliteInspection({
		pathname,
		operation: reclaim ? "reclamation" : "read-only snapshot",
		argv,
		runtimeGeneration,
		signal: options.signal,
		deadlineOwnedByCaller: !reclaim && (launch?.deadlineOwnedByCaller ?? isSqliteInspectionDeadlineOwnedByCaller()),
		deadlineStopsOwner: reclaim,
		env: launch?.env,
		cwd: launch?.cwd,
		stoppedFailure: "snapshot owner stopped",
		...reclaim ? { interrupt: (child) => child.stdin?.end() } : {},
		read: (output, deadlineReached) => {
			if (reclaim) {
				const warnings = readSqliteReadOnlyWorkerValue(output, "reclaim");
				if (deadlineReached) {
					const { timeoutMs, size } = readSqliteInspectionBudget("reclamation", pathname);
					warnings.push(sqliteInspectionTimeoutError("reclamation", pathname, timeoutMs, size).message);
				}
				return warnings;
			}
			options.signal?.throwIfAborted();
			return readSqliteReadOnlyWorkerValue(output, options.mode);
		}
	});
}
function runOneShotSqliteInspection(params) {
	const { timeoutMs, size } = readSqliteInspectionBudget(params.operation, params.pathname);
	return new Promise((resolve, reject) => {
		let output = {
			kind: "launched",
			stderr: "",
			stdout: "",
			status: null
		};
		let stopped = false;
		let deadlineReached = false;
		const child = execFile(process.execPath, params.argv, {
			encoding: "utf8",
			windowsHide: true,
			env: params.env ?? resolveNodeCompileCacheEnv(),
			cwd: params.cwd,
			maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
			timeout: params.deadlineStopsOwner || params.deadlineOwnedByCaller ? void 0 : timeoutMs,
			killSignal: "SIGKILL"
		}, (error, stdout, stderr) => {
			const timedOut = error?.killed && error.signal === "SIGKILL" && error.code == null;
			if (timedOut) deadlineReached = true;
			output = {
				kind: "launched",
				status: child.exitCode,
				failure: error ? stopped ? params.stoppedFailure : timedOut ? sqliteInspectionTimeoutError(params.operation, params.pathname, timeoutMs, size).message : `exited unsuccessfully: ${error.message}` : void 0,
				stderr,
				stdout,
				cause: error ?? void 0
			};
		});
		const interrupt = () => {
			if (params.interrupt) params.interrupt(child);
			else child.kill("SIGKILL");
		};
		const abort = () => {
			if (!stopped) {
				stopped = true;
				interrupt();
			}
		};
		const timer = params.deadlineStopsOwner ? setTimeout(() => {
			deadlineReached = true;
			stopped = true;
			interrupt();
		}, timeoutMs) : void 0;
		const closed = retainSnapshotWork(new Promise((resolveClosed) => {
			child.once("close", () => resolveClosed());
		}), abort);
		params.runtimeGeneration?.retain(child, async () => {
			await closed;
		});
		params.signal?.addEventListener("abort", abort, { once: true });
		if (params.signal?.aborted) abort();
		child.once("close", () => {
			clearTimeout(timer);
			params.signal?.removeEventListener("abort", abort);
			try {
				resolve(params.read(output, deadlineReached));
			} catch (workerError) {
				reject(workerError instanceof Error ? workerError : new Error(String(workerError)));
			}
		});
	});
}
function runSqliteReadOnlyWorkerSync(pathname, stagingRoot, mode = "sync") {
	const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
	const started = log.isEnabled("trace") ? performance$1.now() : void 0;
	const result = spawnSync(process.execPath, sqliteReadOnlyWorkerArgv(pathname, {
		mode,
		stagingRoot
	}).argv, {
		encoding: "utf8",
		windowsHide: true,
		stdio: "pipe",
		env: resolveNodeCompileCacheEnv(),
		maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	});
	if (started !== void 0) log.trace(`SQLite read-only snapshot child durationMs=${performance$1.now() - started}`);
	return readSqliteReadOnlyWorkerValue(result.error ? {
		kind: "launch-failed",
		error: new Error(hasErrnoCode(result.error, "ETIMEDOUT") ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `SQLite read-only worker failed to start for ${pathname}: ${result.error.message}`, { cause: result.error })
	} : {
		kind: "launched",
		stdout: result.stdout,
		stderr: result.stderr,
		status: result.status,
		failure: result.status === 0 ? void 0 : `exited with ${result.signal ? `signal ${result.signal}` : `code ${result.status}`}`
	}, mode);
}
//#endregion
//#region src/state/openclaw-quarantine-error.ts
const DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME = "OpenClawQuarantineReadCleanupError";
const OpenClawQuarantineReadCleanupError = resolveGlobalSingleton(Symbol.for("openclaw.quarantineReadCleanupError"), () => class QuarantineReadCleanupError extends AggregateError {
	constructor(errors, quarantine) {
		super(errors, "OpenClaw quarantine reader cleanup failed.", { cause: errors[0] });
		this.quarantine = quarantine;
		this.name = DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME;
	}
});
//#endregion
//#region src/state/openclaw-state-db-failure.ts
const failurePaths = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseFailurePaths"), () => /* @__PURE__ */ new WeakMap());
/** Preserve the terminal admission owner's path through worker error transport. */
function markOpenClawStateDatabaseFailure(error, pathname) {
	failurePaths.set(error, pathname);
}
function readOpenClawStateDatabaseFailurePath(error) {
	return failurePaths.get(error);
}
/** Cleanup aggregates must retain the original refusal without attributing unrelated errors. */
function findOpenClawStateDatabaseFailure(error, pathname) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (const current of pending) {
		if (!(current instanceof Error) || seen.has(current)) continue;
		seen.add(current);
		if (failurePaths.get(current) === pathname) return current;
		pending.push(current.cause);
		if (current instanceof AggregateError) pending.push(...current.errors);
	}
}
//#endregion
//#region src/agents/agent-create-error.ts
var DuplicateAgentError = class extends Error {};
//#endregion
//#region src/agents/auth-profiles/store-unreadable-error.ts
const AUTH_PROFILE_MIGRATION_COMMAND = "openclaw doctor --fix";
var AuthProfileStoreUnreadableError = class extends Error {
	constructor(databasePath) {
		super(`Auth profile store ${shortenHomePath(databasePath)} is unreadable; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.databasePath = databasePath;
		this.code = "AUTH_PROFILE_STORE_UNREADABLE";
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileStoreUnreadableError";
	}
};
//#endregion
//#region src/agents/mcp-oauth-store-error.ts
var McpOAuthStoreCorruptionError = class extends Error {
	constructor(storeKey, detail, options) {
		super(`MCP OAuth store ${storeKey} is invalid: ${detail}`, options);
		this.name = "McpOAuthStoreCorruptionError";
	}
};
//#endregion
//#region src/agents/workspace-state-identity.ts
const WORKSPACE_ALIAS_REPOINTED_ERROR_CODE = "WORKSPACE_ALIAS_REPOINTED";
var WorkspaceAliasRepointedError = class extends Error {
	constructor(params) {
		super(`workspace path alias points to a different current target: ${params.aliasPath} now resolves to ${params.currentWorkspacePath}, but its stored workspace state belongs to ${params.storedWorkspacePath}. Run \`openclaw doctor --fix\` and confirm the move, or use \`openclaw doctor --fix --force\`.`);
		this.code = WORKSPACE_ALIAS_REPOINTED_ERROR_CODE;
		this.name = "WorkspaceAliasRepointedError";
		this.aliasPath = params.aliasPath;
		this.storedWorkspacePath = params.storedWorkspacePath;
		this.currentWorkspacePath = params.currentWorkspacePath;
	}
};
//#endregion
//#region src/agents/worktrees/errors.ts
var WorktreeRemovalContentionError = class extends Error {
	constructor(kind, message, blockedByRun) {
		super(message);
		this.kind = kind;
		this.blockedByRun = blockedByRun;
		this.name = "WorktreeRemovalContentionError";
	}
};
var WorktreeRemovalLockError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "WorktreeRemovalLockError";
	}
};
var SessionWorktreeSourceChangedError = class extends Error {};
var SessionWorktreeLifecycleError = class extends Error {
	constructor(message, reason) {
		super(message);
		this.reason = reason;
	}
};
//#endregion
//#region src/config/sessions/goals-operations.types.ts
var SessionGoalOperationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SessionGoalOperationError";
	}
};
//#endregion
//#region src/config/sessions/session-canonical-key-error.ts
var SessionCanonicalKeyMigrationRequiredError = class extends Error {
	constructor(detail) {
		super(`${detail}; stop the Gateway and run openclaw doctor --fix`);
		this.code = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
		this.name = "SessionCanonicalKeyMigrationRequiredError";
	}
};
//#endregion
//#region src/config/sessions/session-mutation-conflict-error.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.operationLabel = operationLabel;
		this.name = "SqliteSessionMutationConflictError";
	}
};
var SqliteTranscriptMutationConflictError = class extends Error {
	constructor(sessionId) {
		super(`SQLite transcript changed while preparing rewrite for ${sessionId}`);
		this.sessionId = sessionId;
		this.name = "SqliteTranscriptMutationConflictError";
	}
};
var SessionEntryLifecycleUpsertConflictError = class extends Error {
	constructor(sessionKey) {
		super(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
		this.sessionKey = sessionKey;
		this.name = "SessionEntryLifecycleUpsertConflictError";
	}
};
//#endregion
//#region src/config/sessions/session-pending-input-custody-error.ts
/** Custody refusal must not release already accepted input for another dispatch. */
var SessionPendingInputCustodyError = class extends Error {};
//#endregion
//#region src/config/sessions/session-transcript-read-fence-error.ts
var SessionTranscriptReadFenceError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SessionTranscriptReadFenceError";
	}
};
//#endregion
//#region src/config/sessions/session-transcript-writer-claim-error.ts
function isRedactedIdentifier(value) {
	return typeof value === "string" && /^(?:-|sha256:[0-9a-f]{12})$/.test(value);
}
/** Transport only the refusal owner's redacted identifiers, never incidental cause fields. */
function parseTranscriptAppendRefusal(value) {
	if (!isRecord(value) || !isRedactedIdentifier(value.agentIdHash) || !isRedactedIdentifier(value.expectedSessionIdHash) || !isRedactedIdentifier(value.sessionKeyHash)) return;
	const identity = {
		agentIdHash: value.agentIdHash,
		expectedSessionIdHash: value.expectedSessionIdHash,
		sessionKeyHash: value.sessionKeyHash
	};
	if (value.code === "session-entry-missing") return {
		...identity,
		code: value.code
	};
	if (value.code === "session-rebound" && isRedactedIdentifier(value.actualSessionIdHash)) return {
		...identity,
		code: value.code,
		actualSessionIdHash: value.actualSessionIdHash
	};
}
var SessionTranscriptWriterClaimReboundError = class extends Error {
	constructor(cause) {
		super("session writer claim changed before transcript persistence", { cause });
		this.name = "SessionTranscriptWriterClaimReboundError";
	}
};
//#endregion
//#region src/gateway/model-account-connect-errors.ts
var ModelAccountConnectAuthorityError = class extends Error {
	constructor() {
		super("This account action requires a current authorized connection; reconnect and try again.");
	}
};
//#endregion
//#region src/gateway/worker-environments/session-attachment.ts
var WorkerSessionAlreadyAttachedError = class extends Error {
	constructor(sessionId, environmentId) {
		super(`Session ${sessionId} is already attached to worker environment ${environmentId}`);
		this.sessionId = sessionId;
		this.environmentId = environmentId;
	}
};
//#endregion
//#region src/plugin-state/plugin-blob-store.types.ts
var PluginBlobStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginBlobStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
//#region src/plugin-state/plugin-state-error-cause.ts
function capturePluginStateErrorCause(value, encodeCanonical, seen = /* @__PURE__ */ new Set()) {
	if (value === void 0) return;
	const canonical = encodeCanonical?.(value);
	if (canonical) return { canonical };
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return {
		name: "Error",
		message: String(value)
	};
	if (typeof value !== "object") return {
		name: "Error",
		message: "Unknown SQLite error cause"
	};
	if (seen.has(value) || seen.size >= 8) return {
		name: "Error",
		message: "Additional SQLite error cause omitted"
	};
	seen.add(value);
	const name = "name" in value && typeof value.name === "string" ? value.name : "Error";
	const message = "message" in value && typeof value.message === "string" ? value.message : name;
	const code = "code" in value ? value.code : void 0;
	const errcode = "errcode" in value ? value.errcode : void 0;
	const errno = "errno" in value ? value.errno : void 0;
	return {
		name,
		message,
		...typeof code === "string" || typeof code === "number" ? { errorCode: code } : {},
		...typeof errcode === "number" ? { errcode } : {},
		...typeof errno === "number" ? { errno } : {},
		..."cause" in value ? { cause: capturePluginStateErrorCause(value.cause, encodeCanonical, seen) } : {},
		...value instanceof AggregateError ? { errors: value.errors.slice(0, 8).map((error) => capturePluginStateErrorCause(error, encodeCanonical, seen)) } : {}
	};
}
//#endregion
//#region src/plugin-state/plugin-state-error.ts
/** Typed error thrown for plugin-state validation and sqlite failures. */
var PluginStateStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginStateStoreError";
		this.code = options.code;
		this.operation = options.operation;
		this.owner = options.owner ?? {
			pid: process.pid,
			threadId,
			version: VERSION
		};
		if (options.path) this.path = options.path;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			operation: this.operation,
			path: this.path,
			owner: this.owner,
			cause: capturePluginStateErrorCause(this.cause)
		};
	}
};
//#endregion
//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
const SECRET_STORE_VALUE_MAX_BYTES = 65536;
//#endregion
//#region src/sessions/model-selection-error.ts
const MODEL_SELECTION_LOCKED_MESSAGE = "Model selection is locked for this session.";
/** Retains the caller-visible refusal across the database worker boundary. */
var ModelSelectionLockedError = class extends Error {
	constructor(message = MODEL_SELECTION_LOCKED_MESSAGE) {
		super(message);
		this.name = "ModelSelectionLockedError";
	}
};
//#endregion
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SkillUploadRequestError";
	}
};
//#endregion
//#region src/skills/skill-library-error.ts
var SkillLibraryError = class extends Error {
	constructor(code, message, currentRevision, options) {
		super(message, options);
		this.code = code;
		this.currentRevision = currentRevision;
		this.name = "SkillLibraryError";
	}
};
//#endregion
//#region src/state/openclaw-agent-db-migration-required.ts
var OpenClawAgentDatabaseMediaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(pathname, schemaVersion) {
		super("agent-media", `OpenClaw agent database ${pathname} uses schema version ${schemaVersion}; run openclaw doctor --fix to migrate persisted media before using it.`);
		this.pathname = pathname;
		this.schemaVersion = schemaVersion;
		this.name = "OpenClawAgentDatabaseMediaMigrationRequiredError";
	}
};
//#endregion
//#region src/state/openclaw-state-lease-error.ts
var OpenClawStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OpenClawStateLeaseError";
		this.code = options.code;
	}
};
//#endregion
//#region src/state/session-metadata-unavailable-error.ts
var SessionMetadataUnavailableError = class extends Error {
	constructor(reason, options, missingTables = []) {
		super(`Session metadata unavailable (${[reason, ...missingTables].join(": ")}); retry after the agent store is ready.`, options);
		this.reason = reason;
		this.missingTables = missingTables;
		this.name = "SessionMetadataUnavailableError";
	}
};
//#endregion
//#region src/state/openclaw-state-worker-error-identity.ts
const MESSAGE_ONLY_ERRORS = {
	"worktree-source-changed": SessionWorktreeSourceChangedError,
	"model-account-authority": ModelAccountConnectAuthorityError,
	"duplicate-agent": DuplicateAgentError,
	"model-selection-locked": ModelSelectionLockedError,
	"session-canonical-key-migration": SessionCanonicalKeyMigrationRequiredError,
	"session-pending-input-custody": SessionPendingInputCustodyError,
	"session-transcript-read-fence": SessionTranscriptReadFenceError,
	"skill-upload-request": SkillUploadRequestError,
	coordinator: SqliteCoordinatorError,
	ownership: OpenClawStateOwnershipError,
	"newer-schema": SqliteSchemaVersionError,
	"range-error": RangeError,
	"syntax-error": SyntaxError,
	"type-error": TypeError
};
function isMessageOnlyErrorIdentity(node) {
	return typeof node.type === "string" && Object.hasOwn(MESSAGE_ONLY_ERRORS, node.type);
}
function identifyError(error) {
	if (error instanceof AuthProfileStoreUnreadableError) return {
		type: "auth-profile-store-unreadable",
		databasePath: error.databasePath
	};
	if (error instanceof SessionWorktreeLifecycleError && error.reason === "owner-mismatch") return { type: "session-worktree-owner-mismatch" };
	if (error instanceof WorktreeRemovalContentionError) return {
		type: "worktree-removal-contention",
		kind: error.kind,
		...error.blockedByRun ? { blockedByRun: {
			worktreeId: error.blockedByRun.worktreeId,
			pid: error.blockedByRun.pid
		} } : {}
	};
	if (error instanceof WorktreeRemovalLockError) return {
		type: "worktree-removal-lock",
		kind: error.kind
	};
	if (error instanceof PluginStateStoreError) return {
		type: "plugin-state",
		stateCode: error.code,
		operation: error.operation,
		path: error.path,
		owner: {
			pid: error.owner.pid,
			threadId: error.owner.threadId,
			version: error.owner.version
		}
	};
	if (error instanceof SkillLibraryError) return {
		type: "skill-library",
		libraryCode: error.code,
		...error.currentRevision === void 0 ? {} : { currentRevision: error.currentRevision }
	};
	if (error instanceof SecretStoreValidationError) return {
		type: "secret-store-validation",
		secretCode: error.code
	};
	if (error instanceof WorkerSessionAlreadyAttachedError) return {
		type: "worker-session-already-attached",
		sessionId: error.sessionId,
		environmentId: error.environmentId
	};
	if (error instanceof PluginBlobStoreError) return {
		type: "plugin-blob",
		blobCode: error.code,
		operation: error.operation,
		...error.path === void 0 ? {} : { path: error.path }
	};
	if (error instanceof WorkspaceAliasRepointedError) return {
		type: "workspace-alias-repointed",
		aliasPath: error.aliasPath,
		storedWorkspacePath: error.storedWorkspacePath,
		currentWorkspacePath: error.currentWorkspacePath
	};
	if (error instanceof McpOAuthStoreCorruptionError) return { type: "mcp-oauth-corruption" };
	if (error instanceof SessionGoalOperationError) return {
		type: "session-goal-operation",
		goalCode: error.code
	};
	if (error instanceof SessionEntryLifecycleUpsertConflictError) return {
		type: "session-lifecycle-upsert-conflict",
		sessionKey: error.sessionKey
	};
	if (error instanceof SessionTranscriptWriterClaimReboundError) {
		const refusal = parseTranscriptAppendRefusal(error.cause);
		return {
			type: "session-transcript-writer-claim-rebound",
			...refusal ? { refusal } : {}
		};
	}
	if (error instanceof SqliteSessionMutationConflictError) return {
		type: "session-mutation-conflict",
		operationLabel: error.operationLabel
	};
	if (error instanceof SqliteTranscriptMutationConflictError) return {
		type: "session-transcript-mutation-conflict",
		sessionId: error.sessionId
	};
	if (error instanceof SessionMetadataUnavailableError) return {
		type: "session-metadata",
		reason: error.reason,
		missingTables: [...error.missingTables]
	};
	if (error instanceof GatewayStateOwnerContentionError) return {
		type: "state-owner-contention",
		databasePath: error.databasePath
	};
	if (error instanceof OpenClawStateLeaseError) return {
		type: "state-lease",
		leaseCode: error.code
	};
	if (error instanceof OpenClawStateOwnershipMetadataError) return {
		type: "ownership-metadata",
		databasePath: error.databasePath
	};
	if (error instanceof OpenClawStateExternalOwnershipError) return {
		type: "external-ownership",
		databasePath: error.databasePath,
		managerId: error.managerId
	};
	if (error instanceof OpenClawStateDatabaseSchemaMigrationRequiredError) return {
		type: "state-migration",
		kind: error.kind,
		pathname: error.pathname
	};
	if (error instanceof OpenClawAgentDatabaseMediaMigrationRequiredError) return {
		type: "agent-media-migration",
		pathname: error.pathname,
		schemaVersion: error.schemaVersion
	};
	for (const [type, ErrorType] of Object.entries(MESSAGE_ONLY_ERRORS)) if (error instanceof ErrorType) return { type };
	if (error instanceof StartupMaintenanceRequiredError) return {
		type: "maintenance",
		kind: error.kind
	};
	return { type: error instanceof AggregateError ? "aggregate" : "error" };
}
function unreachableErrorNode(node) {
	throw new Error(`Unexpected shared-state worker error node: ${String(node)}`);
}
function createError(node) {
	if (isMessageOnlyErrorIdentity(node)) {
		const ErrorType = MESSAGE_ONLY_ERRORS[node.type];
		return new ErrorType(node.message);
	}
	switch (node.type) {
		case "session-worktree-owner-mismatch": return new SessionWorktreeLifecycleError(node.message, "owner-mismatch");
		case "worktree-removal-contention": return new WorktreeRemovalContentionError(node.kind, node.message, node.blockedByRun);
		case "worktree-removal-lock": return new WorktreeRemovalLockError(node.kind, node.message);
		case "plugin-state": return new PluginStateStoreError(node.message, {
			code: node.stateCode,
			operation: node.operation,
			path: node.path,
			owner: node.owner
		});
		case "skill-library": return new SkillLibraryError(node.libraryCode, node.message, node.currentRevision);
		case "secret-store-validation": return new SecretStoreValidationError(node.secretCode, node.message);
		case "worker-session-already-attached": return new WorkerSessionAlreadyAttachedError(node.sessionId, node.environmentId);
		case "workspace-alias-repointed": return new WorkspaceAliasRepointedError(node);
		case "session-goal-operation": return new SessionGoalOperationError(node.goalCode, node.message);
		case "session-lifecycle-upsert-conflict": return new SessionEntryLifecycleUpsertConflictError(node.sessionKey);
		case "session-mutation-conflict": return new SqliteSessionMutationConflictError(node.operationLabel);
		case "session-transcript-mutation-conflict": return new SqliteTranscriptMutationConflictError(node.sessionId);
		case "session-transcript-writer-claim-rebound": return new SessionTranscriptWriterClaimReboundError(node.refusal);
		case "session-metadata": return new SessionMetadataUnavailableError(node.reason, void 0, node.missingTables);
		case "error": return new Error(node.message);
		case "mcp-oauth-corruption": return new McpOAuthStoreCorruptionError("", "");
		case "aggregate": return new AggregateError([], node.message);
		case "auth-profile-store-unreadable": return new AuthProfileStoreUnreadableError(node.databasePath);
		case "state-owner-contention": return new GatewayStateOwnerContentionError(node.databasePath);
		case "ownership-metadata": return new OpenClawStateOwnershipMetadataError(node.databasePath, "");
		case "external-ownership": return new OpenClawStateExternalOwnershipError(node.databasePath, node.managerId);
		case "plugin-blob": return new PluginBlobStoreError(node.message, {
			code: node.blobCode,
			operation: node.operation,
			...node.path === void 0 ? {} : { path: node.path }
		});
		case "state-lease": return new OpenClawStateLeaseError(node.message, { code: node.leaseCode });
		case "maintenance": return new StartupMaintenanceRequiredError(node.kind, node.message);
		case "state-migration": return new OpenClawStateDatabaseSchemaMigrationRequiredError(node.kind, node.pathname);
		case "agent-media-migration": return new OpenClawAgentDatabaseMediaMigrationRequiredError(node.pathname, node.schemaVersion);
	}
	return unreachableErrorNode(node);
}
//#endregion
//#region src/state/openclaw-state-worker-error.ts
function isScalar(value) {
	return value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
}
function isNativeErrorCode(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2147483647;
}
function encodeOpenClawStateWorkerError(error, options = {}) {
	if (!(error instanceof Error)) return;
	const nodes = [];
	const errors = [];
	const references = /* @__PURE__ */ new Map();
	let canonical = false;
	const encodeValue = (value) => {
		if (!(value instanceof Error)) return isScalar(value) ? { value } : { undefined: true };
		const known = references.get(value);
		if (known !== void 0) return { ref: known };
		const ref = errors.length;
		references.set(value, ref);
		errors.push(value);
		return { ref };
	};
	try {
		encodeValue(error);
		for (const current of errors) {
			const { name, message } = current;
			if (typeof name !== "string" || typeof message !== "string") return;
			const identity = identifyError(current);
			if (Object.entries(identity).some(([key, value]) => {
				return (key === "owner" || key === "blockedByRun" || key === "refusal" ? Object.values(value) : key === "missingTables" && Array.isArray(value) ? value : [value]).some((field) => field !== void 0 && !isScalar(field));
			})) return;
			const nativeOpen = isSqliteNativeOpenFailure(current);
			const stateDatabasePath = readOpenClawStateDatabaseFailurePath(current);
			const errcode = "errcode" in current ? current.errcode : void 0;
			canonical ||= stateDatabasePath !== void 0 || nativeOpen || isNativeErrorCode(errcode) || isSqliteLockError(current) || current instanceof OpenClawQuarantineReadCleanupError || identity.type !== "error" && identity.type !== "aggregate";
			const code = "code" in current ? current.code : void 0;
			const errno = "errno" in current ? current.errno : void 0;
			nodes.push({
				...identity,
				name,
				message,
				...typeof code === "string" || typeof code === "number" && Number.isFinite(code) ? { code } : {},
				...isNativeErrorCode(errcode) ? { errcode } : {},
				...typeof errno === "number" && Number.isInteger(errno) ? { errno } : {},
				...nativeOpen ? { nativeOpen: true } : {},
				...stateDatabasePath === void 0 ? {} : { stateDatabasePath },
				..."cause" in current && !(identity.type === "session-transcript-writer-claim-rebound" && identity.refusal) ? { cause: encodeValue(current.cause) } : {},
				...current instanceof AggregateError ? { errors: current.errors.map(encodeValue) } : {}
			});
		}
		return canonical || options.includeOrdinary === true ? {
			version: 1,
			root: 0,
			nodes
		} : void 0;
	} catch {
		return;
	}
}
function decodeErrorGraph(value, options) {
	try {
		if (value.version !== 1) return;
		const nodes = value.nodes;
		if (options.includeOrdinary !== true && !nodes.some((node) => node.stateDatabasePath !== void 0 || node.nativeOpen === true || isNativeErrorCode(node.errcode) || isSqliteLockError(node) || node.type === "aggregate" && node.name === "OpenClawQuarantineReadCleanupError" || node.type !== "error" && node.type !== "aggregate")) return;
		const errors = nodes.map(createError);
		const decodeValue = (entry) => "ref" in entry ? errors[entry.ref] : "value" in entry ? entry.value : void 0;
		for (const [index, node] of nodes.entries()) {
			const error = errors[index];
			error.name = node.name;
			error.message = node.message;
			if (node.nativeOpen) markSqliteNativeOpenFailure(error);
			if (node.stateDatabasePath !== void 0) markOpenClawStateDatabaseFailure(error, node.stateDatabasePath);
			for (const [key, propertyValue] of Object.entries({
				...node.code !== void 0 ? { code: node.code } : {},
				...node.errcode !== void 0 ? { errcode: node.errcode } : {},
				...node.errno !== void 0 ? { errno: node.errno } : {},
				...node.cause ? { cause: decodeValue(node.cause) } : {}
			})) Object.defineProperty(error, key, {
				value: propertyValue,
				configurable: true,
				writable: true
			});
			if (error instanceof AggregateError) error.errors = (node.errors ?? []).map(decodeValue);
		}
		return {
			errors,
			root: value.root
		};
	} catch {
		return;
	}
}
const retainedPayloads = resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerErrorPayloads"), () => /* @__PURE__ */ new WeakMap());
/** Keep the closed wire graph until the receiving caller hydrates it. */
function retainOpenClawStateWorkerErrorPayload(error, payload) {
	if (payload) retainedPayloads.set(error, payload);
}
function hydrateOpenClawStateWorkerError(value, options = {}) {
	if (!(value instanceof Error)) return value;
	const replacements = /* @__PURE__ */ new Map();
	const pending = [{
		error: value,
		finish: false
	}];
	const replace = (child) => child instanceof Error ? replacements.get(child) ?? child : child;
	while (pending.length > 0) {
		const entry = pending.pop();
		const { error } = entry;
		if (!entry.finish) {
			if (replacements.has(error)) continue;
			replacements.set(error, error);
			const payload = retainedPayloads.get(error);
			const graph = payload === void 0 ? void 0 : decodeErrorGraph(payload, options);
			if (graph) {
				replacements.set(error, graph.errors[graph.root]);
				continue;
			}
			pending.push({
				error,
				finish: true
			});
			if (error.cause instanceof Error) pending.push({
				error: error.cause,
				finish: false
			});
			if (error instanceof AggregateError) {
				for (const child of error.errors) if (child instanceof Error) pending.push({
					error: child,
					finish: false
				});
			}
			continue;
		}
		const cause = replace(error.cause);
		const originalErrors = error instanceof AggregateError ? error.errors : void 0;
		const errors = originalErrors?.map(replace);
		if (cause === error.cause && (!errors || errors.every((child, index) => child === originalErrors?.[index]))) continue;
		const replacement = error instanceof AggregateError ? new AggregateError([], error.message) : new Error(error.message);
		Object.setPrototypeOf(replacement, Object.getPrototypeOf(error));
		const descriptors = Object.getOwnPropertyDescriptors(error);
		if ("cause" in error) descriptors.cause = {
			configurable: true,
			writable: true,
			...descriptors.cause,
			value: cause
		};
		if (errors) descriptors.errors = {
			configurable: true,
			writable: true,
			...descriptors.errors,
			value: errors
		};
		Object.defineProperties(replacement, descriptors);
		replacements.set(error, replacement);
	}
	return replacements.get(value);
}
//#endregion
//#region src/infra/sqlite-readonly-native-resource.client.ts
/** Host-port framing; the staging owner alone admits readers and retires directories. */
function createSqliteReadOnlyNativeResourceConnection(callbacks) {
	const { port1, port2 } = new MessageChannel();
	const owner = { disposed: false };
	const receive = (request) => {
		let reply;
		try {
			callbacks.receive(request, owner);
			reply = {
				id: request.id,
				ok: true
			};
		} catch (error) {
			const encoded = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
			if (!encoded) throw error;
			reply = {
				id: request.id,
				ok: false,
				error: encoded
			};
		}
		port1.postMessage(reply);
	};
	const fail = (error) => {
		callbacks.onFailure(error);
		port1.close();
	};
	const onMessage = (value) => {
		try {
			receive(value);
		} catch (error) {
			fail(error);
		}
	};
	port1.on("message", onMessage);
	port1.on("messageerror", fail);
	return {
		port: port2,
		service() {
			if (owner.disposed) return;
			for (;;) {
				const next = receiveMessageOnPort(port1);
				if (!next) return;
				try {
					receive(next.message);
				} catch (error) {
					fail(error);
					throw error;
				}
			}
		},
		decodeCloseError(payload) {
			const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
			retainOpenClawStateWorkerErrorPayload(remote, payload);
			const error = hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
			return error instanceof AggregateError ? error : new SqliteSnapshotCleanupError(error.message, { cause: error });
		},
		dispose() {
			owner.disposed = true;
			callbacks.onDispose(owner);
			port1.removeAllListeners();
			port1.close();
			port2.close();
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-native-resource.types.ts
const SQLITE_NATIVE_RESOURCE_PORT = "sqliteSnapshotNativeResource";
//#endregion
//#region src/infra/sqlite-snapshot-staging-error.ts
function decodeSqliteSnapshotStagingError(payload) {
	const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
	retainOpenClawStateWorkerErrorPayload(remote, payload);
	return hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
}
//#endregion
//#region src/infra/sqlite-snapshot-staging-owner.ts
function completed() {
	const retained = createRetainedOperation(() => {});
	retained.resolve(void 0);
	return retained.operation;
}
/** The existing staging owner retains its child; this transport only moves its event loop. */
function createStagingOwner(workerUrl, nativeSource) {
	const nativeResource = nativeSource.captureResource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnlyNativeResource"), SQLITE_NATIVE_RESOURCE_PORT, void 0, connectNativeResource);
	const pool = createOwnedWorkerTaskPool({
		workerUrl,
		workerClass: "writer",
		idleTimeoutMs: 0,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, {
		retainedTransport: true,
		nativeSource,
		nativeResource,
		databaseAccess: "read-only",
		decodeResourceError: (payload) => decodeSqliteSnapshotStagingError(payload)
	});
	const directories = /* @__PURE__ */ new Map();
	const preparations = /* @__PURE__ */ new Map();
	let preparationSequence = 0;
	const activeRequests = /* @__PURE__ */ new Set();
	let servicingRequests = false;
	let requests = 0;
	let admissionClosed = false;
	let idleClose;
	let unavailable;
	function connectNativeResource() {
		return createSqliteReadOnlyNativeResourceConnection({
			receive(value) {
				const directory = value.directory;
				if (value.type === "allocated") {
					const preparation = preparations.get(value.preparationId);
					if (!preparation) throw new SqliteSnapshotCleanupError("SQLite snapshot preparation custody is unavailable");
					preparation.directories.add(directory);
					retainDirectory(directory, value.preparationId);
				} else if (value.type === "retire") {
					if (!directories.has(directory)) throw new SqliteSnapshotCleanupError("SQLite snapshot native custody is unavailable");
					sealRetainedSnapshotTempDirectory(directory, { requireRequested: true });
				}
			},
			onFailure(error) {
				unavailable ??= { error };
			},
			onDispose() {}
		});
	}
	const serviceRequests = () => {
		if (servicingRequests) return;
		servicingRequests = true;
		try {
			for (const request of activeRequests) request.service();
			for (const preparation of Array.from(preparations.values())) preparation.serviceClose();
		} finally {
			servicingRequests = false;
		}
	};
	const closeWhenIdle = () => {
		if (idleClose?.read().status === "pending") return idleClose;
		if (requests > 0 || directories.size > 0) return completed();
		return idleClose = mapRetainedOperation(flatMapRetainedOperation(pool.startCloseResources(), () => requests > 0 || directories.size > 0 ? completed() : pool.startRotate()), () => {
			unavailable = void 0;
		});
	};
	const retainDirectory = (directory, preparationId) => {
		const existing = directories.get(directory);
		if (existing) return existing;
		let pending;
		const startRetire = () => {
			if (pending && pending.read().status !== "rejected") return pending;
			try {
				sealRetainedSnapshotTempDirectory(directory);
			} catch (error) {
				const refused = createRetainedOperation(() => {});
				refused.reject(error);
				return refused.operation;
			}
			return pending = flatMapRetainedOperation(pool.startCloseResources(directory), () => {
				directories.delete(directory);
				if (preparationId !== void 0) {
					const preparation = preparations.get(preparationId);
					preparation?.directories.delete(directory);
					preparation?.releaseIfComplete();
				}
				return closeWhenIdle();
			});
		};
		const owned = {
			directory,
			startRetire
		};
		directories.set(directory, owned);
		registerRetainedSnapshotTempDirectory(directory, startRetire);
		return owned;
	};
	const start = (command, signal) => {
		if (admissionClosed) throw new Error("SQLite snapshot staging owner is closing");
		const preparationId = ++preparationSequence;
		const inputBytes = Buffer.byteLength(JSON.stringify({
			...command,
			preparationId
		}));
		const cancellation = command.type === "prepare" ? new MessageChannel() : void 0;
		const abort = () => {
			if (cancellation) {
				cancellation.port1.postMessage({ type: "abort" });
				recordWorkerMessage("resource", "to_worker");
			}
		};
		const input = command.type === "prepare" && cancellation ? {
			...command,
			preparationId,
			abortPort: cancellation.port2
		} : {
			...command,
			preparationId
		};
		requests++;
		let pendingClose;
		const preparation = {
			directories: /* @__PURE__ */ new Set(),
			abort() {
				if (task.read().status === "pending") abort();
			},
			startClose,
			serviceClose: () => pendingClose?.service(),
			releaseIfComplete() {
				if (request?.read().status !== "pending" && preparation.directories.size === 0) preparations.delete(preparationId);
			}
		};
		preparations.set(preparationId, preparation);
		let task;
		try {
			task = pool.startTask(() => {
				if (unavailable !== void 0) throw unavailable.error;
				signal?.throwIfAborted();
				signal?.addEventListener("abort", abort, { once: true });
				return input;
			}, {
				inputBytes,
				transferList: () => cancellation ? [cancellation.port2] : []
			});
		} catch (error) {
			const refused = createRetainedOperation(() => {});
			refused.reject(error);
			task = {
				...refused.operation,
				release: completed
			};
		}
		let release;
		const result = mapRetainedOperation(task, (reply) => {
			if (reply.type === "failed") {
				const error = decodeSqliteSnapshotStagingError(reply.error);
				throw reply.cleanupFailure && !(error instanceof AggregateError) ? new SqliteSnapshotCleanupError(String(error), { cause: error }) : error;
			}
			return reply;
		});
		const request = finallyRetainedOperation(result, () => release = finallyRetainedOperation(task.release(), () => {
			signal?.removeEventListener("abort", abort);
			cancellation?.port1.close();
			cancellation?.port2.close();
			requests--;
			return closeWhenIdle();
		}), (error, cleanupError) => createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot staging failed", error));
		function startClose() {
			if (pendingClose?.read().status === "pending") return pendingClose;
			let removals;
			let servicing = false;
			const closing = createRetainedOperation(() => {
				if (servicing || closing.operation.read().status !== "pending") return;
				servicing = true;
				try {
					serviceRequests();
					request.service();
					if (request.read().status === "pending") return;
					removals ??= [...preparation.directories].map((directory) => {
						const removal = startRemoveTempDirectory(directory);
						removal.result.then(() => closing.operation.service(), () => closing.operation.service());
						return [directory, removal];
					});
					for (const [directory, removal] of removals) {
						removal.service();
						const outcome = removal.read();
						if (outcome.status === "pending") return;
						if (outcome.status === "rejected") throw outcome.error;
						if (!outcome.value) throw new SqliteSnapshotCleanupError(`SQLite staging preparation cleanup failed: ${directory}`);
					}
					const released = release?.read();
					if (released?.status === "rejected") throw released.error;
					preparation.releaseIfComplete();
					closing.resolve(void 0);
				} catch (error) {
					closing.reject(error);
				} finally {
					servicing = false;
				}
			});
			pendingClose = closing.operation;
			request.result.then(() => closing.operation.service(), () => closing.operation.service());
			closing.operation.service();
			return closing.operation;
		}
		const finish = () => {
			activeRequests.delete(request);
			preparation.releaseIfComplete();
		};
		request.result.then(finish, finish);
		if (request.read().status === "pending") activeRequests.add(request);
		else finish();
		return {
			...request,
			service: serviceRequests,
			startClose
		};
	};
	const owner = {
		start,
		retainDirectory
	};
	nativeSource.retain(owner, async () => {
		admissionClosed = true;
		for (const preparation of preparations.values()) preparation.abort();
		await Promise.allSettled([...activeRequests].map((request) => request.result));
		const closures = Array.from(preparations.values()).map((preparation) => preparation.startClose());
		const failures = (await Promise.allSettled(closures.map((close) => close.result))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
		if (failures.length) throw createSqliteLifecycleAggregateError(failures, "SQLite snapshot generation cleanup failed", failures[0]);
		await closeWhenIdle().result;
		await pool.close();
	});
	return owner;
}
function captureSqliteSnapshotStagingOwner() {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("sqliteSnapshotStaging"));
	const nativeSource = captureRetainedNativeWorkerSource({ runtimeGeneration });
	const owners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotStagingOwner"), () => /* @__PURE__ */ new WeakMap());
	let owner = owners.get(nativeSource);
	if (!owner) {
		owner = runInDetachedAsyncContext(() => createStagingOwner(moduleUrl, nativeSource));
		owners.set(nativeSource, owner);
	}
	return owner;
}
//#endregion
export { getOpenClawDatabaseMaintenanceResourceScope as $, retainSnapshotTempDirectory as A, withArtifactPreservingStateReads as B, normalizeAgentId as C, registerSnapshotTempDirectory as D, registerRetainedSnapshotTempDirectory as E, SQLITE_STAGING_TOKEN_FILES as F, getStateDatabaseSchemaLease as G, assertStateDatabaseAccessAllowed as H, acquireSqliteStagingToken as I, StateDatabaseReadAdmissionInvalidatedError as J, withStateDatabaseColdAdmission as K, resolveNodeCompileCacheEnv as L, settleSqliteSnapshotRequest as M, SQLITE_SNAPSHOT_PREFIX as N, removeTempDirectory as O, acquireSqliteSnapshotToken as P, captureOpenClawDatabaseMaintenanceResource as Q, artifactPreservingReads as R, resolveOpenClawAgentSqlitePath as S, adoptPreparedLocation as T, assertStateDatabaseReadAllowed as U, acquireStateDatabaseSchemaLease as V, captureStateDatabaseAccess as W, isStateDatabaseReadAdmissionInvalidatedError as X, createOpenClawStateDatabaseAsyncLifecycle as Y, allowsMaintenanceLiveAuthorityReads as Z, markPrivateDirectoryCreationRefused as _, SecretStoreValidationError as a, INCOGNITO_AGENT_SQLITE_BASENAME as b, OpenClawQuarantineReadCleanupError as c, isSqliteInspectionDeadlineOwnedByCaller as d, getOpenClawDatabaseMaintenanceScope as et, resolveSqliteInspectionSignal as f, isPrivateDirectoryCreationRefused as g, runSqliteReadOnlyWorkerSync as h, SECRET_STORE_VALUE_MAX_BYTES as i, retainSnapshotWork as j, removeTempDirectoryAsync as k, captureSqliteReadOnlyWorkerLaunch as l, runSqliteReadOnlyWorker as m, hydrateOpenClawStateWorkerError as n, observeOpenClawDatabaseMaintenanceResource as nt, findOpenClawStateDatabaseFailure as o, runScopedSqliteReadOnlyOperation as p, applyPrivateModeSync as q, retainOpenClawStateWorkerErrorPayload as r, markOpenClawStateDatabaseFailure as s, captureSqliteSnapshotStagingOwner as t, isOpenClawDatabaseMaintenanceResourceOwned as tt, createScopedSqliteReadOnlyWorker as u, createSqliteWorkerTransferOwner as v, SqliteSnapshotCleanupError as w, resolveIncognitoOpenClawAgentSqlitePath as x, createSqliteWorkerTransferReceiver as y, isArtifactPreservingStateRead as z };
