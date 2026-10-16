import { F as resolveTimerTimeoutMs, I as resolveTimestampMsToIsoString, P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as isPidAlive } from "./pid-alive-CPS_shDt.mjs";
import { t as acquireFileLockSync } from "./file-lock-manager-D-LVVqdD.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath, v as resolveGatewayLockDir } from "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { C as parseGatewayLockPayload, S as describeGatewayLockHolder, _ as GATEWAY_OWNER_HEARTBEAT_STALE_MS, b as classifyGatewayLockProcessNamespace, f as tryBorrowGatewayStateOwner, n as acquireGatewayStateOwner, s as createGatewayStateProjection, t as GatewayStateOwnerContentionError, u as resolveGatewayStateOwnerPath, v as GatewayLockNamespaceError, w as readGatewayLockProcessNamespace } from "./gateway-state-owner-DmHycK5o.mjs";
import { o as acquireWithWait } from "./startup-migration-checkpoint-Bkqf-Qf8.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-DMAY-YPv.mjs";
import { a as readGatewayLockProcessCmdline, n as assertGatewayOwnerLeaseStopped, o as readGatewayLockProcessStartTime, t as acquireGatewayOwnerLease } from "./gateway-owner-lease-0RgOZO_d.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-lock.ts
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
	return error instanceof GatewayLockError && error.cause instanceof GatewayStateOwnerContentionError;
}
const CMDLINE_EXEC_TIMEOUT_MS = 1e3;
function resolveGatewayOwnerStatusSync(pid, payload, platform, readCmdline, readStartTime, opts = {}) {
	const remainingTimeoutMs = () => {
		opts.signal?.throwIfAborted();
		const remaining = opts.deadlineMs === void 0 ? CMDLINE_EXEC_TIMEOUT_MS : opts.deadlineMs - performance.now();
		if (remaining <= 0) throw new GatewayLockError("Gateway lock inspection deadline expired");
		return Math.max(1, Math.min(CMDLINE_EXEC_TIMEOUT_MS, Math.ceil(remaining)));
	};
	remainingTimeoutMs();
	const namespace = classifyGatewayLockProcessNamespace(payload?.processNamespace, opts.lockPath);
	if (namespace !== "same") return namespace;
	const role = payload?.role ?? "gateway";
	if (!isPidAlive(pid)) return "dead";
	const payloadStartTime = payload?.startTime;
	if (Number.isFinite(payloadStartTime)) {
		const currentStartTime = (readStartTime ?? ((ownerPid) => readGatewayLockProcessStartTime(ownerPid, platform, remainingTimeoutMs())))(pid);
		remainingTimeoutMs();
		if (currentStartTime != null) return currentStartTime === payloadStartTime ? "alive" : "dead";
	}
	const readFn = readCmdline ?? ((p) => readGatewayLockProcessCmdline(p, platform, remainingTimeoutMs(), opts.deadlineMs));
	const identityOptions = readCmdline ? void 0 : { pid };
	const embedded = role === "agent-embedded" || role === "sqlite-maintenance" || role === "skill-workshop-apply";
	const args = readFn(pid);
	remainingTimeoutMs();
	if (!args) return embedded || platform === "linux" || opts.trustUnknownCmdlineOwner === false ? "unknown" : "alive";
	const command = role === "agent-embedded" ? void 0 : role === "sqlite-maintenance" ? "doctor" : role === "skill-workshop-apply" ? "skills" : "gateway";
	const identity = classifyOpenClawArgv(args, command ? {
		command,
		...identityOptions
	} : identityOptions);
	remainingTimeoutMs();
	return identity.kind === "unclassified" ? "unknown" : identity.kind === "openclaw" ? "alive" : "dead";
}
async function resolveGatewayOwnerStatus(...args) {
	return resolveGatewayOwnerStatusSync(...args);
}
async function readLockPayload(lockPath, requireInspection = false, signal) {
	try {
		const payload = parseGatewayLockPayload(await fs$1.readFile(lockPath, {
			encoding: "utf8",
			signal
		}));
		if (requireInspection && !payload) throw new GatewayLockError("Gateway lock payload could not be verified");
		return payload;
	} catch (error) {
		signal?.throwIfAborted();
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
function shouldReclaimGatewayLock(params) {
	if (classifyGatewayLockProcessNamespace(params.payload?.processNamespace, params.lockPath) === "unknown") throw new GatewayLockNamespaceError(params.payload ?? {}, params.lockPath);
	const ownerPid = params.payload?.pid;
	const ownerStatus = ownerPid ? resolveGatewayOwnerStatusSync(ownerPid, params.payload, params.platform, params.readProcessCmdline, params.readProcessStartTime, { lockPath: params.lockPath }) : "unknown";
	if (ownerPid) return ownerStatus === "dead";
	if (params.payload?.createdAt) {
		const createdAt = Date.parse(params.payload.createdAt);
		if (Number.isFinite(createdAt) && params.now() - createdAt > params.staleMs) return true;
	}
	try {
		const stat = fs.statSync(params.lockPath);
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
		stateLockPath: path.join(lockDir, "gateway.state.lock"),
		ownerLockPath: resolveGatewayStateOwnerPath(path.join(stateDir, "state", "openclaw.sqlite"))
	};
}
async function readActiveGatewayLockPort(opts = {}) {
	return (await readActiveGatewayLockIdentity(opts))?.port;
}
async function readActiveGatewayLockIdentity(opts = {}) {
	const env = opts.env ?? process.env;
	const deadlineMs = opts.timeoutMs === void 0 ? void 0 : performance.now() + Math.max(0, opts.timeoutMs);
	const { configLockPath, stateLockPath, ownerLockPath } = resolveGatewayLockPaths(env, opts.lockDir);
	const ownerIdentity = await readVerifiedGatewayLockIdentity(ownerLockPath, opts, deadlineMs);
	if (ownerIdentity) return ownerIdentity;
	return await readVerifiedGatewayLockIdentity(configLockPath, opts, deadlineMs) ?? await readVerifiedGatewayLockIdentity(stateLockPath, opts, deadlineMs);
}
async function readVerifiedGatewayLockIdentity(lockPath, opts, deadlineMs) {
	const assertActive = () => {
		opts.signal?.throwIfAborted();
		if (deadlineMs !== void 0 && performance.now() >= deadlineMs) throw new GatewayLockError("Gateway lock inspection deadline expired");
	};
	assertActive();
	const payload = await readLockPayload(lockPath, opts.requireInspection, opts.signal);
	assertActive();
	if (!payload || payload.role && payload.role !== "gateway" && !(opts.includeEmbedded && payload.role === "agent-embedded")) return;
	if (opts.requireInspection && classifyGatewayLockProcessNamespace(payload.processNamespace, lockPath) === "unknown") {
		const error = new GatewayLockNamespaceError(payload, lockPath);
		throw new GatewayLockError(error.message, error);
	}
	const ownerStatus = await resolveGatewayOwnerStatus(payload.pid, payload, opts.platform ?? process.platform, opts.readProcessCmdline, opts.readProcessStartTime, {
		trustUnknownCmdlineOwner: false,
		deadlineMs,
		signal: opts.signal,
		lockPath
	});
	assertActive();
	if (opts.requireInspection && ownerStatus !== "dead" && (ownerStatus === "unknown" || !opts.includeEmbedded && !payload.port)) throw new GatewayLockError("Gateway lock owner identity could not be verified");
	if (ownerStatus !== "alive" || !opts.includeEmbedded && !payload.port) return;
	return {
		pid: payload.pid,
		...payload.ownerId ? { ownerId: payload.ownerId } : {},
		...payload.cronOwnerProjection ? { cronOwnerProjection: payload.cronOwnerProjection } : {},
		createdAt: payload.createdAt,
		port: payload.port,
		...payload.startTime !== void 0 ? { startTime: payload.startTime } : {}
	};
}
/** Older supported Gateways publish state-local sidecars; never start over their live owner. */
async function assertHistoricalGatewayOwnerStopped(paths, opts, ownedProjection) {
	for (const lockPath of [paths.stateLockPath, paths.configLockPath]) {
		if (lockPath === paths.stateLockPath && ownedProjection) {
			if (!ownedProjection.verifyStillHeld() || resolveIdentityPathViaExistingAncestorSync(ownedProjection.lockPath) !== resolveIdentityPathViaExistingAncestorSync(lockPath)) throw new GatewayLockError("Relocated maintenance projection is no longer current");
			continue;
		}
		const payload = await readLockPayload(lockPath, true);
		if (!payload) continue;
		if (classifyGatewayLockProcessNamespace(payload.processNamespace, lockPath) === "unknown") throw new GatewayLockNamespaceError(payload, lockPath);
		const owner = await resolveGatewayOwnerStatus(payload.pid, payload, opts.platform ?? process.platform, opts.readProcessCmdline, opts.readProcessStartTime, {
			trustUnknownCmdlineOwner: false,
			lockPath
		});
		if (owner !== "dead") throw new GatewayStateOwnerContentionError(path.join(paths.stateDir, "state", "openclaw.sqlite"), void 0, describeGatewayLockHolder(payload, lockPath, owner === "alive" ? "live" : "unknown"));
	}
}
async function acquireGatewayLock(opts = {}) {
	const env = opts.env ?? process.env;
	if (opts.allowInTests !== true && (env.VITEST || env.NODE_ENV === "test")) return null;
	const role = opts.role ?? "gateway";
	const paths = resolveGatewayLockPaths(env, opts.lockDir);
	const databasePath = path.join(paths.stateDir, "state", "openclaw.sqlite");
	const previousOwner = opts.relocatedMaintenanceOwner;
	if (previousOwner) {
		previousOwner.assertCurrent();
		if (role !== "sqlite-maintenance" || resolveIdentityPathViaExistingAncestorSync(previousOwner.stateDir) !== paths.stateDir || previousOwner.lockPath === paths.ownerLockPath) throw new GatewayLockError("Maintenance ownership transfer requires its relocated root");
	}
	const now = opts.now ?? performance.now.bind(performance);
	const startedAt = now();
	const heartbeatWaitMs = GATEWAY_OWNER_HEARTBEAT_STALE_MS + 5e3;
	const heartbeatDeadlineMs = startedAt + heartbeatWaitMs;
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, role === "gateway" ? GATEWAY_LIFECYCLE_LOCK_TIMEOUT_MS : role === "sqlite-maintenance" ? heartbeatWaitMs : 0, 0);
	const deadlineMs = Math.min(opts.lifecycleDeadlineMs ?? Infinity, startedAt + timeoutMs);
	const startTime = (opts.readProcessStartTime ?? ((pid) => readGatewayLockProcessStartTime(pid, opts.platform ?? process.platform, CMDLINE_EXEC_TIMEOUT_MS)))(process.pid);
	const payload = {
		pid: process.pid,
		ownerId: randomUUID(),
		createdAt: resolveTimestampMsToIsoString(Date.now()),
		configPath: paths.configPath,
		stateDir: paths.stateDir,
		role,
		processNamespace: readGatewayLockProcessNamespace(),
		...role === "gateway" ? { cronOwnerProjection: "dynamic-default-v1" } : {},
		...typeof opts.port === "number" && Number.isInteger(opts.port) && opts.port > 0 && opts.port <= 65535 ? { port: opts.port } : {},
		...typeof startTime === "number" && Number.isFinite(startTime) ? { startTime } : {}
	};
	const parentMaintenance = getOpenClawDatabaseMaintenanceScope();
	let borrowedOwner;
	if (role === "sqlite-maintenance" && parentMaintenance?.ownsSchemaMaintenance) {
		parentMaintenance.assertAdmission();
		borrowedOwner = tryBorrowGatewayStateOwner(databasePath);
	}
	let waited = false;
	let projection;
	let stateOwner;
	try {
		stateOwner = borrowedOwner ?? await acquireWithWait({
			deadlineMs,
			pollIntervalMs: resolvePositiveTimerTimeoutMs(opts.pollIntervalMs, 250),
			maxPollIntervalMs: 2e3,
			now,
			sleep: opts.sleep,
			acquire: async () => {
				opts.assertCurrent?.();
				const owner = acquireGatewayStateOwner({
					databasePath,
					payload,
					projectionPath: paths.stateLockPath,
					getProjection: () => projection
				});
				try {
					if (previousOwner) projection = previousOwner.retainProjection();
					await assertHistoricalGatewayOwnerStopped(paths, opts, projection);
					owner.run(() => assertGatewayOwnerLeaseStopped(env, role === "sqlite-maintenance" ? owner : void 0));
					if (previousOwner) {
						owner.run(() => opts.assertCurrent?.());
						await previousOwner.release();
					}
					return owner;
				} catch (error) {
					projection?.release();
					projection = void 0;
					owner.release();
					throw error;
				}
			},
			shouldRetry: (error) => {
				if (error instanceof GatewayLockNamespaceError && (role === "gateway" || role === "sqlite-maintenance")) {
					const remaining = Math.min(deadlineMs, heartbeatDeadlineMs) - now();
					if (remaining <= 0) return false;
					if (!waited) (opts.onWait ?? log.warn)(`Waiting for the previous Gateway's owner heartbeat to expire before reclaiming state (up to ${Math.ceil(remaining / 1e3)} seconds). ${error.message}`);
					waited = true;
					return { delayMs: Math.min(5e3, remaining) };
				}
				if (role === "sqlite-maintenance" || !(error instanceof GatewayStateOwnerContentionError)) return false;
				if (!waited && deadlineMs > startedAt && role === "gateway") log.warn(`waiting for Gateway state ownership held by another OpenClaw process, up to ${Math.ceil((deadlineMs - startedAt) / 1e3)} s`);
				waited = true;
				return true;
			}
		});
	} catch (error) {
		opts.assertCurrent?.();
		const message = `failed to acquire gateway state ownership${waited ? `; waited ${Math.round(now() - startedAt)}ms for Gateway state ownership` : ""}`;
		throw new GatewayLockError(error instanceof GatewayStateOwnerContentionError ? `${message}: ${error.message}. Stop the Gateway or wait for the current OpenClaw operation to finish, then retry.` : error instanceof GatewayLockNamespaceError ? error.message : message, error);
	}
	if (waited && role === "gateway") log.info(`Gateway state ownership acquired after ${((now() - startedAt) / 1e3).toFixed(1)} s`);
	const assertStateOwnerCurrent = (assertPolicy, access) => {
		if (borrowedOwner) parentMaintenance?.assertOwnerCurrent(access);
		stateOwner.assertCurrent();
		if (projection && !projection.verifyStillHeld()) throw new Error("OpenClaw Gateway ownership projection is no longer current");
		if (assertPolicy) {
			stateOwner.run(assertPolicy);
			assertStateOwnerCurrent(void 0, access);
		}
	};
	const assertDatabaseAccess = (requestedPath) => {
		assertStateOwnerCurrent();
		stateOwner.assertDatabaseAccess(requestedPath);
	};
	const resources = role === "sqlite-maintenance" ? createOpenClawDatabaseMaintenanceScope({
		schemaMaintenance: true,
		assertOwnerCurrent: (access) => assertStateOwnerCurrent(void 0, access),
		assertDatabaseAccess
	}) : void 0;
	let ownerLease;
	try {
		assertStateOwnerCurrent(previousOwner ? void 0 : opts.assertCurrent);
		const shouldReclaim = (previous) => shouldReclaimGatewayLock({
			lockPath: paths.stateLockPath,
			payload: previous,
			staleMs: opts.staleMs ?? 3e4,
			now: Date.now,
			platform: opts.platform ?? process.platform,
			readProcessCmdline: opts.readProcessCmdline,
			readProcessStartTime: opts.readProcessStartTime
		});
		if (!borrowedOwner && !projection) projection = createGatewayStateProjection(acquireFileLockSync(paths.stateLockPath, {
			lockPath: paths.stateLockPath,
			timeoutMs: 0,
			retry: { retries: 0 },
			staleRecovery: "remove-if-unchanged",
			reentrantOwner: payload.ownerId,
			payload: () => role === "gateway" ? payload : {
				...payload,
				role: "agent-embedded"
			},
			parsePayload: parseGatewayLockPayload,
			shouldReclaim: ({ payload: previous }) => shouldReclaim(previous),
			shouldRemoveStaleLock: ({ payload: previous }) => shouldReclaim(previous)
		}));
		assertStateOwnerCurrent();
		if (role === "gateway" && opts.listenerMode && opts.port) {
			ownerLease = acquireGatewayOwnerLease({
				env,
				port: opts.port,
				mode: opts.listenerMode,
				supervisor: opts.supervisor ?? null,
				owner: payload.ownerId
			});
			await ownerLease.ready;
		}
	} catch (error) {
		await ownerLease?.release();
		projection?.release();
		stateOwner.release();
		throw new GatewayLockError("failed to acquire gateway state ownership", error);
	}
	let drained;
	const releaseInTree = () => drained ??= Promise.resolve().then(async () => {
		await resources?.close();
		projection?.release();
		projection = void 0;
	}).catch((error) => {
		drained = void 0;
		throw error;
	});
	let released;
	return {
		lockPath: stateOwner.path,
		stateLockPath: paths.stateLockPath,
		stateDir: paths.stateDir,
		assertCurrent: assertStateOwnerCurrent,
		assertDatabaseAccess,
		run: (operation) => {
			if (resources) return resources.run(operation);
			assertStateOwnerCurrent();
			return operation();
		},
		retainProjection: () => {
			assertStateOwnerCurrent();
			if (!projection) throw new GatewayLockError("Maintenance ownership has no transferable projection");
			return projection.retain();
		},
		releaseInTree,
		release: () => released ??= (async () => {
			await ownerLease?.release();
			await releaseInTree();
			stateOwner.release();
		})().catch((error) => {
			released = void 0;
			throw error;
		})
	};
}
//#endregion
export { isSameGatewayLockIdentity as a, readLockPayload as c, resolveGatewayOwnerStatus as d, isGatewayLifecycleContentionError as i, readLockPayloadSync as l, GatewayLockError as n, readActiveGatewayLockIdentity as o, acquireGatewayLock as r, readActiveGatewayLockPort as s, GATEWAY_LIFECYCLE_LOCK_TIMEOUT_MS as t, resolveGatewayLockPaths as u };
