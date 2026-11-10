import { a as extractErrorCode, n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import "./errno-FR4CRyya.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-CH7noY0Z.mjs";
import { v as resolveGatewayLockDir, y as resolveGatewayLockDirForCanonicalStateDir } from "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { i as isPidAlive } from "./pid-alive-dd7OR8F6.mjs";
import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { t as acquireFileLockSync } from "./file-lock-manager-D-LVVqdD.mjs";
import { a as assertPersistedStateDatabaseAccessAllowed, g as parseGatewayLockPayload, h as describeGatewayLockHolder, l as GATEWAY_OWNER_HEARTBEAT_MS, n as StateDatabaseAdmissionPendingError, o as defaultPayload, r as StateDatabaseMaintenanceScopeError, s as isGatewayStateOwnerDefinitelyStale, t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-c5lFIb1t.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { t as normalizeSqliteNonNegativeInteger } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import fs, { chmodSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { MessageChannel } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
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
	const firstCreated = fs.mkdirSync(directory, {
		recursive: true,
		mode: 448
	});
	if (firstCreated && created) {
		const boundary = path.toNamespacedPath(firstCreated);
		const directories = [];
		for (let current = directory;;) {
			const { dev, ino } = fs.lstatSync(current, { bigint: true });
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
	const observed = fs.lstatSync(directory);
	const uid = process.getuid?.();
	if (!observed.isDirectory() || uid !== void 0 && observed.uid !== uid) throw new Error("State ownership directory must be a user-owned real directory");
	if (process.platform !== "win32" && (observed.mode & 4095) !== 448) {
		applyPrivateModeSync(directory, 448);
		if ((fs.lstatSync(directory).mode & 63) !== 0) throw new Error("State ownership directory permissions are not private");
	}
}
function removeCreatedProjectionDirectories(directories) {
	let directory = directories[0];
	while (directory) {
		try {
			const observed = fs.lstatSync(directory.path, { bigint: true });
			if (observed.isDirectory() && observed.dev === directory.dev && observed.ino === directory.ino) fs.rmdirSync(directory.path);
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
		key: process.platform === "win32" ? normalizeWindowsPathForComparison(canonicalPath) : canonicalPath
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
	const held = fs.fstatSync(fd, { bigint: true });
	const current = fs.statSync(lockPath, { bigint: true });
	const bytes = Buffer.alloc(Buffer.byteLength(raw) + 1);
	const length = fs.readSync(fd, bytes, 0, bytes.length, 0);
	if (held.nlink === 0n || held.dev !== current.dev || held.ino !== current.ino || bytes.subarray(0, length).toString("utf8") !== raw) return false;
	fs.futimesSync(fd, stamp, stamp);
	return true;
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.ts
const now = Date.now.bind(Date);
/** Process and schema owners share one renewal worker and one failure deadline. */
function startGatewayStateOwnerHeartbeat(heldLocks, onLost) {
	const locks = {};
	for (const lock of heldLocks) {
		locks[lock.lockPath] = fs.readFileSync(lock.lockPath, "utf8");
		if (!lock.verifyStillHeld()) throw new Error("OpenClaw state ownership is no longer current");
	}
	const rootPath = Object.keys(locks)[0];
	if (!rootPath) throw new Error("Gateway state ownership requires a held lock");
	const rootIdentity = fs.statSync(rootPath, { bigint: true });
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
					const fd = fs.openSync(lock.lockPath, "r+");
					try {
						const held = fs.fstatSync(fd, { bigint: true });
						if (lock.lockPath === rootPath && (held.dev !== rootIdentity.dev || held.ino !== rootIdentity.ino)) throw new Error("owner lock was removed or replaced");
						const raw = fs.readFileSync(fd, "utf8");
						if (!lock.verifyStillHeld() || !renewGatewayStateOwnerLock(fd, lock.lockPath, raw, stamp)) throw new Error("owner lock was removed or replaced");
					} finally {
						fs.closeSync(fd);
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
/** Carry the same physical sidecar through relocation and accepted schema work. */
function createGatewayStateProjection(lock) {
	let references = 1;
	const reference = () => {
		let released = false;
		return {
			lockPath: lock.lockPath,
			verifyStillHeld: () => !released && lock.verifyStillHeld(),
			retain() {
				if (released || !lock.verifyStillHeld()) throw new Error("Gateway state projection is no longer current");
				references += 1;
				return reference();
			},
			release() {
				readOwnerPaths.clear();
				if (released) return;
				if (references === 1) lock.release();
				references -= 1;
				released = true;
			}
		};
	};
	return reference();
}
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
		const raw = fs.readFileSync(projection.lockPath, "utf8");
		if (!projection.verifyStillHeld()) return false;
		owner.heartbeat.worker.postMessage([projection.lockPath, raw], []);
		owner.heartbeat.paths.add(projection.lockPath);
	}
	return true;
}
const log = createSubsystemLogger("gateway/state");
function loseOwner(owner, error) {
	if (owner.lost.signal.aborted) return;
	owner.accepting = false;
	readOwnerPaths.clear();
	owner.heartbeat?.stop();
	log.error(error.message);
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
/** State cleanup preserves this owner until destructive work and native handles settle. */
function resolveGatewayStateOwnerPath(databasePath) {
	return resolveStateOwnerIdentity(databasePath).ownerPath;
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
		const previous = parsePayload(fs.readFileSync(pathname, "utf8"));
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
/** One root owns startup or maintenance; only its registered custody can lend schema access. */
function acquireGatewayStateOwner(params) {
	const identity = resolveStateOwnerIdentity(params.databasePath);
	const pathname = identity.ownerPath;
	const held = owners.get(identity.key);
	if (held) throw new GatewayStateOwnerContentionError(params.databasePath, void 0, describeGatewayLockHolder(held.payload, pathname, "live"));
	const payload = params.payload ? {
		...params.payload,
		ownerId: params.payload.ownerId ?? randomUUID()
	} : defaultPayload(params.databasePath);
	const owner = {
		key: identity.key,
		path: pathname,
		kind: "process",
		payload,
		projectionPath: params.projectionPath,
		getProjection: params.getProjection,
		locks: /* @__PURE__ */ new Set(),
		projectionDirectories: [],
		lost: new AbortController(),
		accepting: true
	};
	const lock = acquireOwnerFile(params.databasePath, pathname, payload);
	owner.locks.add(lock);
	readOwnerPaths.clear();
	owners.set(owner.key, owner);
	const lease = leaseForFile(pathname, lock, owner);
	try {
		owner.heartbeat = startGatewayStateOwnerHeartbeat(owner.locks, (error) => loseOwner(owner, error));
		lease.assertCurrent();
	} catch (error) {
		return runWithSqliteCleanup(lease, "state process ownership verification", () => {
			throw error;
		});
	}
	return {
		path: pathname,
		assertCurrent() {
			owner.lost.signal.throwIfAborted();
			if (!owner.accepting || owners.get(owner.key) !== owner) throw new Error("OpenClaw state process owner is no longer current");
			lease.assertCurrent();
		},
		assertDatabaseAccess: lease.assertDatabaseAccess,
		run: lease.run,
		release() {
			owner.accepting = false;
			lease.release();
		}
	};
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
		const raw = fs.readFileSync(projection.lockPath, "utf8");
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
/** A nested maintenance scope can retain only an already-held process root for its exact database. */
function tryBorrowGatewayStateOwner(databasePath) {
	const owner = owners.get(resolveStateOwnerIdentity(databasePath).key);
	if (!owner || owner.kind !== "process") return;
	if (!owner.accepting || !hasPhysicalOwnership(owner)) throw new GatewayStateOwnerContentionError(databasePath, owner.lost.signal.reason);
	assertStateDatabaseAccessAllowed(databasePath);
	return acquireStateDatabaseSchemaLease(databasePath);
}
/** Startup recovery requires this process's retained Gateway root, not a schema loan. */
function hasActiveGatewayStateOwner(databasePath) {
	const owner = owners.get(resolveStateOwnerIdentity(databasePath).key);
	return owner?.kind === "process" && owner.accepting && (owner.payload.role ?? "gateway") === "gateway" && hasPhysicalOwnership(owner);
}
/** Capture registered process custody; a PID or copied lock payload grants no authority. */
function captureGatewayStateOwner(databasePath) {
	const key = resolveStateOwnerIdentity(databasePath).key;
	const owner = owners.get(key);
	if (!owner || owner.kind !== "process") return;
	const assertCurrent = () => {
		owner.lost.signal.throwIfAborted();
		if (owners.get(key) !== owner || !owner.accepting || resolveStateOwnerIdentity(databasePath).key !== key || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) throw new GatewayStateOwnerContentionError(databasePath);
		assertStateDatabaseAccessAllowed(databasePath);
	};
	assertCurrent();
	return {
		ownerId: owner.payload.ownerId,
		role: owner.payload.role ?? "gateway",
		assertCurrent,
		signal: owner.lost.signal
	};
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
/** Cleanup must compete with local roots too; it cannot borrow a live Gateway's authority. */
function tryAcquireGatewayStateOwner(databasePath) {
	try {
		return acquireGatewayStateOwner({ databasePath });
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) return null;
		throw error;
	}
}
//#endregion
export { captureGatewayStateOwner as a, getStateDatabaseSchemaLease as c, tryAcquireGatewayStateOwner as d, tryBorrowGatewayStateOwner as f, assertStateDatabaseReadAllowed as i, hasActiveGatewayStateOwner as l, applyPrivateModeSync as m, acquireStateDatabaseSchemaLease as n, captureStateDatabaseAccess as o, withStateDatabaseColdAdmission as p, assertStateDatabaseAccessAllowed as r, createGatewayStateProjection as s, acquireGatewayStateOwner as t, resolveGatewayStateOwnerPath as u };
