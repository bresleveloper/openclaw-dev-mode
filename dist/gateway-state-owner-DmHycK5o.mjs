import { i as extractErrorCode, t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as isPidAlive, n as getFileLockProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { t as acquireFileLockSync } from "./file-lock-manager-D-LVVqdD.mjs";
import { i as resolveRuntimeWorkerUrl, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import "./errno-FR4CRyya.mjs";
import { v as resolveGatewayLockDir, y as resolveGatewayLockDirForCanonicalStateDir } from "./paths-DGIwWbpu.mjs";
import { t as normalizeSqliteNonNegativeInteger } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, Yt as discriminatedUnion, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DCJaEqeS.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-DU6Cf6Aq.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-BXwDVcTj.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { MessageChannel, isMainThread } from "node:worker_threads";
//#region src/infra/update-managed-service-handoff-schema.ts
const text = string().min(1).max(4096);
const nativeProcessIdentityShape = {
	pid: number().int().positive(),
	startIdentity: text.max(128)
};
const processIdentitySchema = strictObject({
	...nativeProcessIdentityShape,
	startIdentitySource: literal("argv-sha256").nullable().optional()
}).refine(({ startIdentity, startIdentitySource }) => startIdentitySource === "argv-sha256" ? /^win32-argv-sha256:[a-f0-9]{64}$/.test(startIdentity) : !startIdentity.startsWith("win32-argv-sha256:"));
const managedHandoffBootSchema = union([
	strictObject({
		platform: _enum(["linux", "darwin"]),
		identity: string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)
	}),
	strictObject({
		platform: literal("win32"),
		identity: string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{7}Z$/)
	}),
	strictObject({
		platform: literal("freebsd"),
		identity: string().regex(/^[a-f0-9]{32}$/)
	})
]);
const nativeLifetimeSchema = strictObject({
	kind: literal("native"),
	unit: text,
	scope: text,
	placement: discriminatedUnion("kind", [strictObject({ kind: literal("pending") }), strictObject({
		kind: literal("attached"),
		invocation: string().regex(/^[a-f0-9]{32}$/i)
	})])
});
const cancellationProtocol = literal("original-cancellation-v1");
const updateAction = strictObject({
	kind: literal("update"),
	mutationProtocol: cancellationProtocol
}).extend({
	mutationProtocol: cancellationProtocol.optional(),
	custody: _enum(["reserved", "bound"]).optional()
});
const actionSchema = discriminatedUnion("kind", [updateAction, strictObject({
	kind: literal("triage"),
	phase: _enum([
		"reserved",
		"running",
		"closing",
		"closed",
		"uncertain"
	]),
	lifetime: discriminatedUnion("kind", [strictObject({
		kind: literal("foreground"),
		boot: managedHandoffBootSchema
	}), nativeLifetimeSchema])
}).refine((action) => action.phase !== "running" || action.lifetime.kind !== "native" || action.lifetime.placement.kind === "attached")]);
const sourcePath = text.refine(path.isAbsolute, "Native source path must be absolute");
const digest = string().regex(/^[a-f0-9]{64}$/);
const nativeBorrowerSourceSchema = strictObject({
	runId: text,
	transactionId: text,
	claimId: text,
	revision: number().int().nonnegative(),
	recordSha256: digest,
	serviceKey: sourcePath,
	configPaths: array(sourcePath).min(1).max(512),
	lifetimeId: text
});
const nativeBorrowerSchema = strictObject({
	id: string().uuid(),
	phase: _enum(["reserved", "admitted"]),
	source: nativeBorrowerSourceSchema
});
const commonPayload = {
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: actionSchema
};
const originalUpdateSchema = strictObject({
	version: literal(2),
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: updateAction
});
const originalGenerationSchema = strictObject({
	key: text,
	owner: text,
	payload: string().min(1),
	updatedAt: number().int().nonnegative()
});
const cancellingPayloadSchema = strictObject({
	version: literal(4),
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: updateAction,
	cancellation: originalGenerationSchema
}).refine((value) => {
	const original = safeParseJsonWithSchema(originalUpdateSchema, value.cancellation.payload);
	return original !== null && JSON.stringify(original.helper) === JSON.stringify(value.helper) && JSON.stringify(original.executor) === JSON.stringify(value.executor) && JSON.stringify(original.action) === JSON.stringify(value.action) && (JSON.stringify(value.helper) === JSON.stringify(value.executor) || original.action.mutationProtocol === "original-cancellation-v1");
});
const currentPayloadSchema = strictObject({
	version: literal(2),
	...commonPayload,
	mutationOriginal: originalGenerationSchema.optional()
}).refine((value) => {
	if (!value.mutationOriginal) return true;
	const original = safeParseJsonWithSchema(originalUpdateSchema, value.mutationOriginal.payload);
	return original !== null && !value.mutationOriginal.key.includes("/.openclaw-update-child-") && original.action.mutationProtocol === "original-cancellation-v1";
});
const payloadSchema = discriminatedUnion("version", [
	cancellingPayloadSchema,
	currentPayloadSchema,
	strictObject({
		version: literal(3),
		...commonPayload,
		action: strictObject({ kind: literal("update") }),
		nativeBorrower: nativeBorrowerSchema
	})
]);
const retiredPayloadSchema = strictObject({
	version: literal(1),
	...nativeProcessIdentityShape
});
function parseManagedHandoffLeasePayload(value) {
	return safeParseJsonWithSchema(payloadSchema, value);
}
/** Distinguish an exactly decoded retired record from unreadable prospective data. */
function parseRetiredManagedHandoffLeasePayload(value) {
	return safeParseJsonWithSchema(retiredPayloadSchema, value);
}
function isRetiredManagedHandoffLeasePayload(value) {
	return parseRetiredManagedHandoffLeasePayload(value) !== null;
}
//#endregion
//#region src/infra/update-managed-service-handoff-boot.ts
/** Bind the lease environment without caching boot identity or selecting an OS early. */
function createManagedHandoffBootIdentityReader(serviceManagerEnv) {
	return function bootIdentity() {
		let value;
		if (process.platform === "linux") value = fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
		else if (process.platform === "freebsd") {
			const result = spawnSync("/sbin/sysctl", ["-b", "kern.boot_id"], {
				env: serviceManagerEnv,
				timeout: 1e3,
				maxBuffer: 16,
				killSignal: "SIGKILL",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
			if (!result.error && result.status === 0 && Buffer.isBuffer(result.stdout) && result.stdout.length === 16) value = result.stdout.toString("hex");
		} else if (process.platform === "darwin" || process.platform === "win32") {
			const windows = process.platform === "win32";
			const result = spawnSync(windows ? "powershell.exe" : "/usr/sbin/sysctl", windows ? [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				"(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime.ToUniversalTime().ToString('o')"
			] : ["-n", "kern.bootsessionuuid"], {
				env: serviceManagerEnv,
				encoding: "utf8",
				timeout: windows ? 5e3 : 1e3,
				killSignal: "SIGKILL",
				windowsHide: true,
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
			if (!result.error && result.status === 0) value = result.stdout.trim();
		}
		const boot = {
			platform: process.platform,
			identity: process.platform === "win32" ? value : value?.toLowerCase()
		};
		const parsed = managedHandoffBootSchema.safeParse(boot);
		if (!parsed.success) throw new Error("OS boot identity unavailable; run openclaw triage manually");
		return parsed.data;
	};
}
//#endregion
//#region src/infra/gateway-lock-payload.ts
const GATEWAY_OWNER_HEARTBEAT_MS = 15e3;
const GATEWAY_OWNER_HEARTBEAT_STALE_MS = 9e4;
const [uuidBoot, windowsBoot, freebsdBoot] = managedHandoffBootSchema.options;
const host = string().min(1);
const GatewayProcessNamespaceSchema = discriminatedUnion("platform", [
	uuidBoot.extend({
		host,
		platform: literal("linux"),
		pidNsInode: string().min(1)
	}),
	uuidBoot.extend({
		host,
		platform: literal("darwin")
	}),
	windowsBoot.extend({ host }),
	freebsdBoot.extend({ host })
]);
let processNamespace;
/** Cache OS subprocess failures too; only Linux's cheap /proc probes remain retryable. */
function readGatewayLockProcessNamespace() {
	if (processNamespace?.platform === process.platform && (processNamespace.value !== null || process.platform !== "linux")) return processNamespace.value;
	try {
		const boot = createManagedHandoffBootIdentityReader(process.env)();
		const value = GatewayProcessNamespaceSchema.parse({
			host: os.hostname(),
			...boot,
			...boot.platform === "linux" ? { pidNsInode: fs.statSync("/proc/self/ns/pid", { bigint: true }).ino.toString() } : {}
		});
		processNamespace = {
			platform: value.platform,
			value
		};
		return value;
	} catch {
		processNamespace = {
			platform: process.platform,
			value: null
		};
		return null;
	}
}
/** Diagnostic facts never grant ownership; callers still classify the recorded holder. */
function describeGatewayLockHolder(holder, lockPath, localState) {
	const namespace = GatewayProcessNamespaceSchema.safeParse(holder.processNamespace).data;
	let heartbeatAt = holder.heartbeatAt;
	if (lockPath) try {
		heartbeatAt = fs.statSync(lockPath).mtimeMs;
	} catch {}
	const ageMs = heartbeatAt === void 0 ? void 0 : Date.now() - heartbeatAt;
	const location = `${namespace?.host ?? holder.host ?? "unknown host"}${namespace?.platform === "linux" ? `/pid-ns ${namespace.pidNsInode}` : ""}`;
	const action = localState === "live" ? `The holder ${holder.pid} is alive on this host, stop it first` : localState === "unknown" ? "Stop the holder before retrying" : `wait ${Math.max(1, Math.floor((GATEWAY_OWNER_HEARTBEAT_STALE_MS - (ageMs ?? 0)) / 1e3) + 1)} s and retry`;
	return `holder ${holder.pid ?? "unknown"} at ${location}, last renewed ${ageMs === void 0 ? "at an unknown time" : `${Math.max(0, Math.floor(ageMs / 1e3))} s ago`}. ${action}.`;
}
var GatewayLockNamespaceError = class extends Error {
	constructor(holder, lockPath) {
		super(`cannot verify Gateway ownership from this process (different PID namespace); the owner heartbeat is fresh — run this command inside the Gateway container or with a shared PID namespace. If the previous Gateway stopped, wait up to 90 seconds after its last heartbeat. ${describeGatewayLockHolder(holder, lockPath)}`);
		this.name = "GatewayLockNamespaceError";
	}
};
/** Qualify PID evidence before any local process probe or same-PID authority shortcut. */
function classifyGatewayLockProcessNamespace(value, lockPath) {
	return classifyGatewayOwnerProcessNamespace(value, { readHeartbeatAt: () => lockPath ? fs.statSync(lockPath).mtimeMs : void 0 });
}
/** File locks and SQLite leases share one boot/namespace and heartbeat policy. */
function classifyGatewayOwnerProcessNamespace(value, options = {}) {
	const owner = GatewayProcessNamespaceSchema.safeParse(value).data;
	const ownerHost = owner?.host ?? options.ownerHost;
	const foreignHost = ownerHost !== void 0 && ownerHost !== os.hostname();
	if (value === void 0 && !foreignHost) return "same";
	const current = readGatewayLockProcessNamespace();
	if (owner && current) {
		if (owner.platform === current.platform && owner.host === current.host && owner.identity !== current.identity) return "dead";
		if (owner.platform === current.platform && owner.identity === current.identity && (owner.platform !== "linux" || current.platform === "linux" && owner.pidNsInode === current.pidNsInode)) return "same";
	} else if (process.platform !== "linux" && !foreignHost) return "same";
	try {
		const heartbeatAt = options.readHeartbeatAt?.();
		return heartbeatAt !== void 0 && Date.now() - heartbeatAt > 9e4 ? "dead" : "unknown";
	} catch {
		return "unknown";
	}
}
const LockPayloadSchema = object({
	pid: number(),
	ownerId: string().min(1).optional(),
	/** A cold opener may wait for this transient owner, never enter while it is held. */
	stateOwnerKind: literal("schema").optional(),
	/** Present when Gateway cron writes use the dynamic-default ownership projection. */
	cronOwnerProjection: literal("dynamic-default-v1").optional(),
	createdAt: string(),
	configPath: string(),
	port: number().int().min(1).max(65535).optional(),
	role: _enum([
		"gateway",
		"agent-embedded",
		"skill-workshop-apply",
		"sqlite-maintenance"
	]).optional(),
	stateDir: string().optional(),
	startTime: number().optional(),
	processNamespace: GatewayProcessNamespaceSchema.nullable().optional()
});
function parseGatewayLockPayload(raw) {
	return safeParseJsonWithSchema(LockPayloadSchema, raw);
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
	const { moduleUrl: url, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.gatewayStateOwnerHeartbeat));
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
		port1.on("message", () => void 0);
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
//#region src/infra/gateway-state-owner-record.ts
/** Admission and reclamation use the same namespace-qualified PID evidence. */
function isGatewayStateOwnerDefinitelyStale(value, lockPath) {
	const payload = isRecord(value) ? value : null;
	const namespace = classifyGatewayLockProcessNamespace(payload?.processNamespace, lockPath);
	if (namespace === "unknown") throw new GatewayLockNamespaceError(payload ?? {}, lockPath);
	return namespace === "dead" || isLockOwnerDefinitelyStale({ payload: payload ? {
		pid: payload.pid,
		starttime: payload.startTime
	} : null });
}
const StateDatabaseAdmissionPendingError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseAdmissionPendingError"), () => class extends Error {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** A live foreign process holds offline-maintenance custody of this database. */
const StateDatabaseOfflineMaintenanceError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseOfflineMaintenanceError"), () => class extends Error {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** Persisted ownership can identify a holder but cannot lend this process maintenance authority. */
function assertPersistedStateDatabaseAccessAllowed(params) {
	const { databasePath, ownerPath, assertMaintenance } = params;
	const unavailable = `OpenClaw state ownership at ${databasePath} could not be verified from ${ownerPath}; restart the Gateway.`;
	let raw;
	try {
		raw = fs.readFileSync(ownerPath, "utf8");
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
		throw new Error(unavailable, { cause: error });
	}
	const owner = parseGatewayLockPayload(raw);
	if (!owner) throw new StateDatabaseAdmissionPendingError(databasePath, unavailable);
	if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0) throw new Error(unavailable);
	if (isGatewayStateOwnerDefinitelyStale(owner, ownerPath)) return;
	if (owner.pid === process.pid && !isMainThread) return;
	if (!isPidAlive(owner.pid)) throw new Error(unavailable);
	const role = owner.role ?? "gateway";
	if (role === "gateway" || role === "agent-embedded") return;
	if (owner.pid === process.pid) {
		assertMaintenance();
		return;
	}
	if (owner.stateOwnerKind === "schema" && owner.role === "sqlite-maintenance") throw new StateDatabaseAdmissionPendingError(databasePath, `OpenClaw state at ${databasePath} is undergoing offline maintenance; retry when it finishes.`);
	throw new StateDatabaseOfflineMaintenanceError(databasePath, `OpenClaw state at ${databasePath} is undergoing offline maintenance; retry when it finishes.`);
}
function defaultPayload(databasePath) {
	const stateDir = resolveOpenClawStateDirForDatabasePath(databasePath);
	const startTime = getFileLockProcessStartTime(process.pid);
	return {
		pid: process.pid,
		ownerId: randomUUID(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		stateDir,
		configPath: path.join(stateDir, "openclaw.json"),
		role: "sqlite-maintenance",
		processNamespace: readGatewayLockProcessNamespace(),
		...startTime === null ? {} : { startTime }
	};
}
//#endregion
//#region src/infra/gateway-state-owner.ts
/** Carry the same physical sidecar through relocation and accepted schema work. */
function createGatewayStateProjection(lock) {
	let references = 1;
	let verifiedAt;
	const verify = () => {
		verifiedAt = void 0;
		if (!lock.verifyStillHeld()) return false;
		verifiedAt = performance.now();
		return true;
	};
	const reference = () => {
		let released = false;
		return {
			lockPath: lock.lockPath,
			get verifiedAt() {
				return released ? void 0 : verifiedAt;
			},
			verifyStillHeld: () => !released && verify(),
			retain() {
				if (released || !verify()) throw new Error("Gateway state projection is no longer current");
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
	owner.verifiedAt = void 0;
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
	owner.verifiedAt = performance.now();
	return true;
}
const log = createSubsystemLogger("gateway/state");
function loseOwner(owner, error) {
	if (owner.lost.signal.aborted) return;
	owner.accepting = false;
	owner.verifiedAt = void 0;
	readOwnerPaths.clear();
	owner.heartbeat?.stop();
	log.error(error.message);
	owner.lost.abort(error);
}
const READ_OWNERSHIP_MAX_AGE_MS = 1e3;
const readOwnerPaths = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateReadOwnerPaths"), () => /* @__PURE__ */ new Map());
const owners = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwners"), () => /* @__PURE__ */ new Map());
const schemaOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaOwners"), () => new AsyncLocalStorage());
/** The synchronous lexical owner is live authority, not the existence of its sidecar. */
function getStateDatabaseSchemaLease(databasePath) {
	const entry = schemaOwners.getStore()?.get(resolveGatewayStateOwnerPath(databasePath));
	if (entry && !entry.active) throw new Error("State schema maintenance scope is no longer current");
	entry?.lease.assertCurrent();
	return entry?.lease;
}
const GatewayStateOwnerContentionError = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwnerContentionError"), () => class StateOwnerContentionError extends Error {
	constructor(databasePath, cause, holderDetail) {
		super(`OpenClaw state database is busy at ${databasePath}. ${holderDetail ? `${holderDetail} ` : ""}Wait for the other OpenClaw process to finish, then retry. If it persists, run \`openclaw gateway status\` and check for other OpenClaw processes using the same state directory. A running Gateway can hold this ownership until it stops; stop it through its service manager or original terminal before retrying.`);
		this.databasePath = databasePath;
		this.cause = cause;
		this.name = "GatewayStateOwnerContentionError";
	}
});
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
	const canonical = resolveIdentityPathViaExistingAncestorSync(databasePath);
	const uid = process.getuid?.();
	const directory = process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks", uid === void 0 ? "openclaw-state-owners" : `openclaw-state-owners-${uid}`) : resolveGatewayLockDirForCanonicalStateDir(resolveOpenClawStateDirForDatabasePath(canonical));
	return path.join(resolveIdentityPathViaExistingAncestorSync(directory), `state.${sha256HexPrefixCore(canonical, 16)}.lock`);
}
function acquireOwnerFile(databasePath, pathname, payload, busyTimeoutMs = 0, createdDirectories) {
	const deadline = performance.now() + busyTimeoutMs;
	ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
	const observed = { holder: null };
	const stale = ({ payload: value }) => isGatewayStateOwnerDefinitelyStale(value, pathname);
	if (busyTimeoutMs > 0) try {
		const previous = parseGatewayLockPayload(fs.readFileSync(pathname, "utf8"));
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
			parsePayload: (raw) => observed.holder = parseGatewayLockPayload(raw),
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
			if (released || owners.get(pathname) !== owner || resolveGatewayStateOwnerPath(databasePath) !== pathname || !holdsPhysicalLease()) throw new Error("OpenClaw state maintenance does not own this database");
		},
		run(operation) {
			lease.assertCurrent();
			readOwnerPaths.clear();
			const inherited = new Map(schemaOwners.getStore());
			const entry = {
				lease,
				active: true
			};
			inherited.set(pathname, entry);
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
				if (owner.locks.size === 0 && owners.get(pathname) === owner) {
					owner.heartbeat?.stop();
					owner.accepting = false;
					owners.delete(pathname);
				}
			}
			if (owner.locks.size === 0) removeCreatedProjectionDirectories(owner.projectionDirectories);
		}
	};
	return lease;
}
/** One root owns startup or maintenance; only its registered custody can lend schema access. */
function acquireGatewayStateOwner(params) {
	const pathname = resolveGatewayStateOwnerPath(params.databasePath);
	const held = owners.get(pathname);
	if (held) throw new GatewayStateOwnerContentionError(params.databasePath, void 0, describeGatewayLockHolder(held.payload, pathname, "live"));
	const payload = params.payload ? {
		...params.payload,
		ownerId: params.payload.ownerId ?? randomUUID()
	} : defaultPayload(params.databasePath);
	const owner = {
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
	owners.set(pathname, owner);
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
			if (!owner.accepting || owners.get(pathname) !== owner) throw new Error("OpenClaw state process owner is no longer current");
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
	const pathname = resolveGatewayStateOwnerPath(databasePath);
	let owner = owners.get(pathname);
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
			kind: "schema",
			payload,
			projectionPath,
			locks: /* @__PURE__ */ new Set([lock, projection]),
			projectionDirectories,
			lost: new AbortController(),
			accepting: true
		};
		owners.set(pathname, owner);
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
	const pathname = resolveGatewayStateOwnerPath(databasePath);
	const owner = owners.get(pathname);
	if (!owner || owner.kind !== "process") return;
	if (!owner.accepting || !hasPhysicalOwnership(owner)) throw new GatewayStateOwnerContentionError(databasePath, owner.lost.signal.reason);
	assertStateDatabaseAccessAllowed(databasePath);
	return acquireStateDatabaseSchemaLease(databasePath);
}
/** Startup recovery requires this process's retained Gateway root, not a schema loan. */
function hasActiveGatewayStateOwner(databasePath) {
	const owner = owners.get(resolveGatewayStateOwnerPath(databasePath));
	return owner?.kind === "process" && owner.accepting && (owner.payload.role ?? "gateway") === "gateway" && hasPhysicalOwnership(owner);
}
/** Capture registered process custody; a PID or copied lock payload grants no authority. */
function captureGatewayStateOwner(databasePath) {
	const pathname = resolveGatewayStateOwnerPath(databasePath);
	const owner = owners.get(pathname);
	if (!owner || owner.kind !== "process") return;
	const assertCurrent = () => {
		owner.lost.signal.throwIfAborted();
		if (owners.get(pathname) !== owner || !owner.accepting || resolveGatewayStateOwnerPath(databasePath) !== pathname || !hasPhysicalOwnership(owner) || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) throw new GatewayStateOwnerContentionError(databasePath);
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
function hasRecentVerification(verifiedAt, now) {
	return verifiedAt !== void 0 && now - verifiedAt < READ_OWNERSHIP_MAX_AGE_MS;
}
/** Only explicit reads reuse recent physical verification; mutations always check freshly. */
function assertStateDatabaseReadAllowed(databasePath) {
	if (owners.size === 0) {
		assertStateDatabaseAccessAllowed(databasePath);
		return;
	}
	const key = path.resolve(databasePath);
	const now = performance.now();
	const cached = readOwnerPaths.get(key);
	cached?.owner.heartbeat?.inspect();
	const projection = cached?.owner.getProjection?.();
	if (cached && now < cached.expiresAt && owners.get(cached.pathname) === cached.owner && cached.owner.accepting && hasRecentVerification(cached.owner.verifiedAt, now) && (!cached.owner.getProjection || projection && hasRecentVerification(projection.verifiedAt, now))) return;
	readOwnerPaths.delete(key);
	const pathname = resolveGatewayStateOwnerPath(databasePath);
	const owner = owners.get(pathname);
	const role = owner?.payload.role ?? "gateway";
	if (!owner || owner.kind !== "process" || !owner.accepting || role !== "gateway" && role !== "agent-embedded") {
		assertStateDatabaseAccessAllowed(databasePath);
		return;
	}
	if (!hasPhysicalOwnership(owner) || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) {
		owner.lost.signal.throwIfAborted();
		throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
	}
	readOwnerPaths.set(key, {
		pathname,
		owner,
		expiresAt: now + READ_OWNERSHIP_MAX_AGE_MS
	});
}
/** Ordinary SQLite access observes maintenance; it never borrows schema authority. */
function assertStateDatabaseAccessAllowed(databasePath, captured) {
	const assertMaintenance = () => {
		const schemaLease = captured ? captured.schemaLease : getStateDatabaseSchemaLease(databasePath);
		if (schemaLease) {
			schemaLease.assertDatabaseAccess(databasePath);
			return;
		}
		const scope = captured ? captured.maintenanceScope : getOpenClawDatabaseMaintenanceScope();
		if (!scope) throw new Error(`OpenClaw state at ${databasePath} is undergoing offline maintenance; retry when it finishes.`);
		scope.assertDatabaseAccess(databasePath);
	};
	const pathname = resolveGatewayStateOwnerPath(databasePath);
	const local = owners.get(pathname);
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
		ownerPath: pathname,
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
export { parseGatewayLockPayload as C, parseManagedHandoffLeasePayload as D, isRetiredManagedHandoffLeasePayload as E, parseRetiredManagedHandoffLeasePayload as O, describeGatewayLockHolder as S, createManagedHandoffBootIdentityReader as T, GATEWAY_OWNER_HEARTBEAT_STALE_MS as _, assertStateDatabaseReadAllowed as a, classifyGatewayLockProcessNamespace as b, getStateDatabaseSchemaLease as c, tryAcquireGatewayStateOwner as d, tryBorrowGatewayStateOwner as f, GATEWAY_OWNER_HEARTBEAT_MS as g, StateDatabaseOfflineMaintenanceError as h, assertStateDatabaseAccessAllowed as i, hasActiveGatewayStateOwner as l, StateDatabaseAdmissionPendingError as m, acquireGatewayStateOwner as n, captureGatewayStateOwner as o, withStateDatabaseColdAdmission as p, acquireStateDatabaseSchemaLease as r, createGatewayStateProjection as s, GatewayStateOwnerContentionError as t, resolveGatewayStateOwnerPath as u, GatewayLockNamespaceError as v, readGatewayLockProcessNamespace as w, classifyGatewayOwnerProcessNamespace as x, GatewayProcessNamespaceSchema as y };
