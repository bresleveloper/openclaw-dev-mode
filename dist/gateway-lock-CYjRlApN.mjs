import { F as resolveTimerTimeoutMs, I as resolveTimestampMsToIsoString, P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { r as createFileLockManager } from "./file-lock-manager-xRAOv56w.mjs";
import { Et as _enum, Fn as object, Jn as string, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir, _ as resolveGatewayLockDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as tryAcquireExclusiveSqliteCoordinator } from "./sqlite-coordinator-z2lO0ops.mjs";
import { T as StateDatabaseCoordinatorContentionError, a as acquireGatewayLifecycleCoordinator, o as acquireGatewayMaintenanceCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-CTq_p6Fk.mjs";
import { a as acquireGatewayOwnerLease, i as readWindowsProcessArgsSync } from "./windows-port-pids-Bid_Huck.mjs";
import { i as parseProcCmdline, n as isOpenClawArgv, r as isOpenClawCommandArgv, t as isGatewayArgv } from "./gateway-process-argv-BVJwTten.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-lock-payload.ts
const LockPayloadSchema = object({
	pid: number(),
	ownerId: string().min(1).optional(),
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
	startTime: number().optional()
});
function parseGatewayLockPayload(raw) {
	return safeParseJsonWithSchema(LockPayloadSchema, raw);
}
//#endregion
//#region src/infra/gateway-lock.ts
const DEFAULT_TIMEOUT_MS = 5e3;
const DEFAULT_POLL_INTERVAL_MS = 100;
const DEFAULT_STALE_MS = 3e4;
const GATEWAY_LOCKS = createFileLockManager("openclaw.gateway-lock");
const GATEWAY_LIFECYCLE_LOCK_TIMEOUT_MS = 3e5;
const log = createSubsystemLogger("gateway");
function isSameGatewayLockIdentity(previous, current) {
	if (previous.ownerId && current.ownerId) return previous.ownerId === current.ownerId;
	return previous.pid === current.pid && previous.createdAt === current.createdAt && previous.startTime === current.startTime;
}
var GatewayLockError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "GatewayLockError";
	}
};
function isGatewayLifecycleContentionError(error) {
	return error instanceof GatewayLockError && error.cause instanceof StateDatabaseCoordinatorContentionError && error.cause.family === "gateway-lifecycle";
}
function readLinuxCmdline(pid) {
	try {
		const raw = fs.readFileSync(`/proc/${pid}/cmdline`, "utf8");
		return parseProcCmdline(raw);
	} catch {
		return null;
	}
}
const CMDLINE_EXEC_TIMEOUT_MS = 1e3;
function readWindowsCmdline(pid) {
	return readWindowsProcessArgsSync(pid, CMDLINE_EXEC_TIMEOUT_MS);
}
/**
* Read the command line of a macOS/BSD process via `ps`.
*
* `ps -o command=` outputs an unquoted flat string, so the naive whitespace
* split will misparse paths containing spaces. This is acceptable because
* standard macOS install paths do not contain spaces, and when the split
* does fail the caller falls back to "alive" (conservative).
*/
function readDarwinCmdline(pid) {
	try {
		const line = execFileSync("ps", [
			"-p",
			String(pid),
			"-o",
			"command="
		], {
			env: resolveDiagnosticProcessEnv(),
			encoding: "utf8",
			timeout: CMDLINE_EXEC_TIMEOUT_MS,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		}).trim();
		if (!line) return null;
		return line.split(/\s+/).filter(Boolean);
	} catch {
		return null;
	}
}
function readProcessStartTime(pid, platform) {
	if (platform !== process.platform) return null;
	return getFileLockProcessStartTime(pid, process.env, CMDLINE_EXEC_TIMEOUT_MS);
}
function defaultReadProcessCmdline(pid, platform) {
	if (platform === "linux") return readLinuxCmdline(pid);
	if (platform === "win32") return readWindowsCmdline(pid);
	if (platform === "darwin") return readDarwinCmdline(pid);
	return null;
}
async function resolveGatewayOwnerStatus(pid, payload, platform, readCmdline, readStartTime, opts = {}) {
	const role = payload?.role ?? "gateway";
	if (!isPidAlive(pid)) return "dead";
	const payloadStartTime = payload?.startTime;
	if (Number.isFinite(payloadStartTime)) {
		const currentStartTime = (readStartTime ?? ((ownerPid) => readProcessStartTime(ownerPid, platform)))(pid);
		if (currentStartTime != null) return currentStartTime === payloadStartTime ? "alive" : "dead";
	}
	const readFn = readCmdline ?? ((p) => defaultReadProcessCmdline(p, platform));
	if (role === "agent-embedded" || role === "sqlite-maintenance" || role === "skill-workshop-apply") {
		const args = readFn(pid);
		if (!args) return "unknown";
		if (role === "agent-embedded") return isOpenClawArgv(args) ? "alive" : "dead";
		return isOpenClawCommandArgv(args, role === "sqlite-maintenance" ? "doctor" : "skills") ? "alive" : "dead";
	}
	const args = readFn(pid);
	if (!args) return platform === "linux" || opts.trustUnknownCmdlineOwner === false ? "unknown" : "alive";
	return isGatewayArgv(args, { allowGatewayBinary: true }) ? "alive" : "dead";
}
async function readLockPayload(lockPath, requireInspection = false) {
	try {
		const payload = parseGatewayLockPayload(await fs$1.readFile(lockPath, "utf8"));
		if (requireInspection && !payload) throw new GatewayLockError("Gateway lock payload could not be verified");
		return payload;
	} catch (error) {
		if (requireInspection && !hasErrnoCode(error, "ENOENT")) throw new GatewayLockError("Gateway lock inspection is unavailable", error);
		return null;
	}
}
/** Read the same lock contract while a synchronous mutation admission is held. */
function readLockPayloadSync(lockPath, requireInspection = false) {
	try {
		const payload = parseGatewayLockPayload(fs.readFileSync(lockPath, "utf8"));
		if (requireInspection && !payload) throw new GatewayLockError("Gateway lock payload could not be verified");
		return payload;
	} catch (error) {
		if (requireInspection && !hasErrnoCode(error, "ENOENT")) throw new GatewayLockError("Gateway lock inspection is unavailable", error);
		return null;
	}
}
async function shouldReclaimGatewayLock(params) {
	const ownerPid = params.payload?.pid;
	const ownerStatus = ownerPid ? await resolveGatewayOwnerStatus(ownerPid, params.payload, params.platform, params.readProcessCmdline, params.readProcessStartTime) : "unknown";
	if (ownerPid) return ownerStatus === "dead";
	if (params.payload?.createdAt) {
		const createdAt = Date.parse(params.payload.createdAt);
		if (Number.isFinite(createdAt) && params.now() - createdAt > params.staleMs) return true;
	}
	try {
		const stat = await fs$1.stat(params.lockPath);
		return params.now() - stat.mtimeMs > params.staleMs;
	} catch {
		return false;
	}
}
function resolveGatewayLockPaths(env, suppliedLockDir) {
	const resolvedStateDir = resolveStateDir(env);
	const stateDir = resolveIdentityPathViaExistingAncestorSync(resolvedStateDir);
	const lockDir = suppliedLockDir ?? resolveGatewayLockDir(stateDir);
	const configPath = resolveConfigPath(env, resolvedStateDir);
	const configHash = sha256HexPrefixCore(configPath, 8);
	return {
		configLockPath: path.join(lockDir, `gateway.${configHash}.lock`),
		configPath,
		stateDir,
		stateLockPath: path.join(lockDir, "gateway.state.lock")
	};
}
async function readActiveGatewayLockPort(opts = {}) {
	return (await readActiveGatewayLockIdentity(opts))?.port;
}
async function readActiveGatewayLockIdentity(opts = {}) {
	const { configLockPath, stateLockPath } = resolveGatewayLockPaths(opts.env ?? process.env, opts.lockDir);
	return await readVerifiedGatewayLockIdentity(configLockPath, opts) ?? await readVerifiedGatewayLockIdentity(stateLockPath, opts);
}
async function readVerifiedGatewayLockIdentity(lockPath, opts) {
	const payload = await readLockPayload(lockPath, opts.requireInspection);
	if (!payload || payload.role && payload.role !== "gateway") return;
	const ownerStatus = await resolveGatewayOwnerStatus(payload.pid, payload, opts.platform ?? process.platform, opts.readProcessCmdline, opts.readProcessStartTime, { trustUnknownCmdlineOwner: false });
	if (opts.requireInspection && ownerStatus !== "dead" && (ownerStatus === "unknown" || !payload.port)) throw new GatewayLockError("Gateway lock owner identity could not be verified");
	if (ownerStatus !== "alive" || !payload.port) return;
	return {
		pid: payload.pid,
		...payload.ownerId ? { ownerId: payload.ownerId } : {},
		...payload.cronOwnerProjection ? { cronOwnerProjection: payload.cronOwnerProjection } : {},
		createdAt: payload.createdAt,
		port: payload.port,
		...payload.startTime !== void 0 ? { startTime: payload.startTime } : {}
	};
}
async function acquireGatewayLock(opts = {}) {
	const env = opts.env ?? process.env;
	if (!(opts.allowInTests === true) && (env.VITEST || env.NODE_ENV === "test")) return null;
	const role = opts.role ?? "gateway";
	const ownerId = randomUUID();
	const paths = resolveGatewayLockPaths(env, opts.lockDir);
	const databasePath = path.join(paths.stateDir, "state", "openclaw.sqlite");
	const now = opts.now ?? performance.now.bind(performance);
	const startedAt = now();
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, role === "gateway" ? GATEWAY_LIFECYCLE_LOCK_TIMEOUT_MS : 0, 0);
	const deadlineMs = opts.lifecycleDeadlineMs ?? startedAt + timeoutMs;
	let waited = false;
	let stateLifecycle;
	let resources;
	try {
		stateLifecycle = await acquireWithWait({
			deadlineMs,
			pollIntervalMs: resolvePositiveTimerTimeoutMs(opts.pollIntervalMs, 250),
			maxPollIntervalMs: 2e3,
			now,
			sleep: opts.sleep,
			acquire: () => {
				const options = {
					databasePath,
					busyTimeoutMs: 0
				};
				if (role === "sqlite-maintenance") {
					const owner = acquireGatewayMaintenanceCoordinator(options);
					resources = createOpenClawDatabaseMaintenanceScope(owner.createSchemaFenceDelegate);
					return owner;
				}
				return acquireGatewayLifecycleCoordinator(options);
			},
			shouldRetry: (error) => {
				if (!(error instanceof StateDatabaseCoordinatorContentionError) || error.family !== "gateway-lifecycle") return false;
				if (!waited && deadlineMs > startedAt && role === "gateway") log.warn(`waiting for gateway-lifecycle ownership held by another OpenClaw process, up to ${Math.ceil((deadlineMs - startedAt) / 1e3)} s`);
				waited = true;
				return true;
			}
		});
	} catch (error) {
		throw new GatewayLockError(`failed to acquire gateway state ownership${waited && role === "gateway" ? `; waited ${Math.round(now() - startedAt)}ms for gateway-lifecycle ownership` : ""}`, error);
	}
	if (waited && role === "gateway") log.info(`gateway-lifecycle ownership acquired after ${((now() - startedAt) / 1e3).toFixed(1)} s`);
	let ownerLease;
	let stateLock;
	try {
		if (role === "gateway" && opts.listenerMode && opts.port) {
			ownerLease = acquireGatewayOwnerLease({
				env,
				port: opts.port,
				mode: opts.listenerMode,
				supervisor: opts.supervisor ?? null,
				owner: ownerId
			});
			await ownerLease.ready;
		}
		stateLock = await acquireLockFile({
			...opts,
			configPath: paths.configPath,
			env,
			lockPath: paths.stateLockPath,
			role,
			stateDir: paths.stateDir,
			ownerId
		});
	} catch (error) {
		await ownerLease?.release();
		stateLifecycle.release();
		throw error;
	}
	if (role === "gateway" && env.OPENCLAW_ALLOW_MULTI_GATEWAY === "1") {
		let inTreeReleased = false;
		const releaseInTree = async () => {
			if (inTreeReleased) return;
			inTreeReleased = true;
			await stateLock.release();
		};
		return {
			...stateLock,
			run: (operation) => operation(),
			stateDir: paths.stateDir,
			stateLockPath: stateLock.lockPath,
			releaseInTree,
			release: async () => {
				await ownerLease?.release();
				let releaseError;
				await releaseInTree().catch((error) => {
					releaseError = error;
				});
				try {
					stateLifecycle.release();
				} catch (error) {
					releaseError ??= error;
				}
				if (releaseError) throw new GatewayLockError("failed to release gateway state ownership", releaseError);
			}
		};
	}
	try {
		const configLock = await acquireLockFile({
			...opts,
			configPath: paths.configPath,
			env,
			lockPath: paths.configLockPath,
			role,
			stateDir: paths.stateDir,
			ownerId
		});
		if (role === "sqlite-maintenance") {
			let inTreeReleaseAttempt;
			const releaseInTree = () => {
				inTreeReleaseAttempt ??= (async () => {
					await resources?.close();
					await configLock.release();
					await stateLock.release();
				})().catch((error) => {
					inTreeReleaseAttempt = void 0;
					throw error;
				});
				return inTreeReleaseAttempt;
			};
			return {
				...configLock,
				run: (operation) => resources.run(operation),
				stateDir: paths.stateDir,
				stateLockPath: stateLock.lockPath,
				releaseInTree,
				release: async () => {
					await releaseInTree();
					stateLifecycle.release();
				}
			};
		}
		let inTreeReleased = false;
		const releaseInTree = async () => {
			if (inTreeReleased) return;
			inTreeReleased = true;
			let releaseError;
			try {
				await configLock.release();
			} catch (error) {
				releaseError = error instanceof Error ? error : new GatewayLockError("failed to release config lock", error);
			}
			try {
				await stateLock.release();
			} catch (error) {
				releaseError ??= error instanceof Error ? error : new GatewayLockError("failed to release state lock", error);
			}
			if (releaseError) throw releaseError;
		};
		return {
			...configLock,
			run: (operation) => operation(),
			stateDir: paths.stateDir,
			stateLockPath: stateLock.lockPath,
			releaseInTree,
			release: async () => {
				await ownerLease?.release();
				let releaseError;
				try {
					await releaseInTree();
				} catch (error) {
					releaseError = error instanceof Error ? error : new GatewayLockError("failed to release in-tree gateway locks", error);
				}
				try {
					stateLifecycle.release();
				} catch (error) {
					releaseError ??= error instanceof Error ? error : new GatewayLockError("failed to release state lifecycle", error);
				}
				if (releaseError) throw releaseError;
			}
		};
	} catch (error) {
		await stateLock.release().catch(() => void 0);
		await ownerLease?.release();
		try {
			stateLifecycle.release();
		} catch {}
		throw error;
	}
}
async function acquireLockFile(opts) {
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, DEFAULT_TIMEOUT_MS, 0);
	const pollIntervalMs = resolvePositiveTimerTimeoutMs(opts.pollIntervalMs, DEFAULT_POLL_INTERVAL_MS);
	const staleMs = resolveTimerTimeoutMs(opts.staleMs, DEFAULT_STALE_MS, 0);
	const platform = opts.platform ?? process.platform;
	const now = opts.now ?? Date.now;
	const sleep = opts.sleep ?? (async (ms) => await new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const { configPath, lockPath, stateDir } = opts;
	await fs$1.mkdir(path.dirname(lockPath), { recursive: true });
	const startedAt = now();
	let lastPayload = null;
	const buildPayload = () => {
		const startTime = (opts.readProcessStartTime ?? ((pid) => readProcessStartTime(pid, platform)))(process.pid);
		return {
			pid: process.pid,
			ownerId: opts.ownerId,
			...opts.role === "gateway" ? { cronOwnerProjection: "dynamic-default-v1" } : {},
			createdAt: resolveTimestampMsToIsoString(now()),
			configPath,
			stateDir,
			...typeof opts.port === "number" && Number.isInteger(opts.port) && opts.port > 0 && opts.port <= 65535 ? { port: opts.port } : {},
			...opts.role !== "gateway" ? { role: opts.role } : {},
			...typeof startTime === "number" && Number.isFinite(startTime) ? { startTime } : {}
		};
	};
	const shouldReclaim = (payload) => shouldReclaimGatewayLock({
		lockPath,
		payload,
		staleMs,
		now,
		platform,
		readProcessCmdline: opts.readProcessCmdline,
		readProcessStartTime: opts.readProcessStartTime
	});
	while (now() - startedAt < timeoutMs) {
		let coordinator;
		try {
			coordinator = tryAcquireExclusiveSqliteCoordinator(`${lockPath}.sqlite`);
		} catch (error) {
			throw new GatewayLockError(`failed to acquire gateway lock at ${lockPath}`, error);
		}
		if (!coordinator) lastPayload = await readLockPayload(lockPath);
		else try {
			const lock = await GATEWAY_LOCKS.acquire(lockPath, {
				lockPath,
				staleMs,
				timeoutMs: 0,
				retry: { retries: 0 },
				staleRecovery: "remove-if-unchanged",
				payload: buildPayload,
				parsePayload: parseGatewayLockPayload,
				shouldReclaim: ({ payload }) => shouldReclaim(payload),
				shouldRemoveStaleLock: ({ payload }) => shouldReclaim(payload)
			});
			return {
				lockPath,
				release: async () => {
					let releaseError;
					try {
						coordinator.release();
					} catch (error) {
						releaseError = error;
					}
					await lock.release().catch((error) => {
						releaseError ??= error;
					});
					if (releaseError) throw new GatewayLockError(`failed to release gateway lock at ${lockPath}`, releaseError);
				}
			};
		} catch (error) {
			coordinator.release();
			const code = error.code;
			if (code !== "file_lock_timeout" && code !== "file_lock_stale") throw new GatewayLockError(`failed to acquire gateway lock at ${lockPath}`, error);
			lastPayload = await readLockPayload(lockPath);
		}
		const remainingMs = timeoutMs - (now() - startedAt);
		if (remainingMs <= 0) break;
		await sleep(Math.min(pollIntervalMs, remainingMs));
	}
	const ownerPid = lastPayload?.pid ? ` (pid ${lastPayload.pid})` : "";
	throw new GatewayLockError(`${lastPayload?.role === "agent-embedded" ? `another embedded OpenClaw state writer is active${ownerPid}` : lastPayload?.role && lastPayload.role !== "gateway" ? `state directory is locked by ${lastPayload.role}${ownerPid}` : `gateway already running${ownerPid}`}; lock timeout after ${timeoutMs}ms`);
}
//#endregion
export { isSameGatewayLockIdentity as a, readLockPayload as c, resolveGatewayOwnerStatus as d, isGatewayLifecycleContentionError as i, readLockPayloadSync as l, GatewayLockError as n, readActiveGatewayLockIdentity as o, acquireGatewayLock as r, readActiveGatewayLockPort as s, GATEWAY_LIFECYCLE_LOCK_TIMEOUT_MS as t, resolveGatewayLockPaths as u };
