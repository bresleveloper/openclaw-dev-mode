import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { y as readUtilityModelSetting } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { s as publicKeyRawBase64UrlFromPem } from "./device-identity-B_zMrBd6.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ba as validateSystemInfoParams } from "./src-BRUl7oDv.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as resolveAdvertisedLanHostCore } from "./advertised-lan-host-Dt_Dr31t.mjs";
import { h as setSessionEventWakesEnabled, p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { l as getLastHeartbeatEvent, o as resolveSystemEventQueueKey, s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-De-bcoks.mjs";
import { c as isSystemEventContextChanged, i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import "./sessions-Cesa3L0p.mjs";
import { r as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-CB1i57hb.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-B-12bRQs.mjs";
import { r as updateSystemPresence, t as listSystemPresence } from "./system-presence-BhyW53Ym.mjs";
import { i as resolveUtilityModelRefForAgent } from "./utility-model-Bk8FTgwT.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as getMachineDisplayName } from "./machine-name-BYeXMPA1.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as createPresenceRecipientProjection } from "./presence-projection-DadwbRQf.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
import { n as readGatewayProcessVitals } from "./process-vitals-DfDosB9-.mjs";
import { t as broadcastPresenceSnapshot } from "./presence-events-gFR-cYCD.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import { withTimeout } from "@openclaw/fs-safe/advanced";
import { Type } from "typebox";
/** Operator event plus optional presence metadata and exact-session wake routing. */
const SystemEventParamsSchema = closedObject({
	text: Type.String(),
	idempotencyKey: Type.Optional(Type.String({ minLength: 1 })),
	sessionKey: Type.Optional(Type.String()),
	wake: Type.Optional(Type.Boolean()),
	deviceId: Type.Optional(Type.String()),
	instanceId: Type.Optional(Type.String()),
	host: Type.Optional(Type.String()),
	ip: Type.Optional(Type.String()),
	mode: Type.Optional(Type.String()),
	version: Type.Optional(Type.String()),
	platform: Type.Optional(Type.String()),
	deviceFamily: Type.Optional(Type.String()),
	modelIdentifier: Type.Optional(Type.String()),
	lastInputSeconds: Type.Optional(Type.Number()),
	reason: Type.Optional(Type.String()),
	roles: Type.Optional(Type.Array(Type.String())),
	scopes: Type.Optional(Type.Array(Type.String())),
	tags: Type.Optional(Type.Array(Type.String()))
});
const validateSystemEventParams = /* @__PURE__ */ lazyCompile(SystemEventParamsSchema);
//#endregion
//#region src/infra/system-disks.ts
const windowsVolumeSchema = object({
	Path: string().min(1),
	Capacity: number().int().positive(),
	FreeSpace: number().int().nonnegative()
});
const commandOptions = {
	timeoutMs: 3e3,
	maxOutputBytes: 1048576
};
let snapshot;
let pendingCollection;
function visibleLinuxMounts(mounts) {
	const childPaths = /* @__PURE__ */ new Map();
	for (const mount of mounts.values()) if (mount.parentId !== mount.identity) {
		const paths = childPaths.get(mount.parentId) ?? /* @__PURE__ */ new Set();
		paths.add(mount.path);
		childPaths.set(mount.parentId, paths);
	}
	const visiblePaths = /* @__PURE__ */ new Map();
	for (const mount of mounts.values()) {
		if (childPaths.get(mount.identity)?.has(mount.path)) continue;
		let hidden = false;
		let child = mount;
		let parent = mounts.get(child.parentId);
		while (parent && parent !== child) {
			const siblings = childPaths.get(parent.identity);
			for (let end = child.path.lastIndexOf("/"); end >= 0;) {
				const ancestorPath = child.path.slice(0, end) || "/";
				if (ancestorPath !== child.path && siblings?.has(ancestorPath)) {
					hidden = true;
					break;
				}
				if (end === 0) break;
				end = child.path.lastIndexOf("/", end - 1);
			}
			if (hidden) break;
			child = parent;
			parent = mounts.get(child.parentId);
		}
		if (!hidden) visiblePaths.set(mount.path, mount);
	}
	return [...visiblePaths.values()];
}
async function readMountedDiskPaths(platform) {
	if (platform === "linux") {
		const mountInfo = await fs.readFile("/proc/self/mountinfo", "utf8");
		const mounts = /* @__PURE__ */ new Map();
		for (const line of mountInfo.split("\n")) {
			const [mount, filesystem] = line.split(" - ");
			const [mountId, parentId, device, root, encodedPath] = (mount ?? "").split(" ");
			const [type, source] = (filesystem ?? "").split(" ");
			if (!mountId || !parentId || !device || !root || !encodedPath || !type || !source) continue;
			mounts.set(mountId, {
				identity: mountId,
				parentId,
				device,
				root,
				path: decodeMountInfoPath(encodedPath),
				type,
				source
			});
		}
		const devices = /* @__PURE__ */ new Map();
		for (const { identity, device, root, path: mountPath, type, source } of visibleLinuxMounts(mounts)) {
			if (type === "squashfs" || mountPath === "/boot/efi" || mountPath === "/efi") continue;
			if (!(source.startsWith("/dev/") || type === "zfs") && !(mountPath === "/" && type === "overlay")) continue;
			const existing = devices.get(device);
			const wholeFilesystem = root === "/";
			const existingWholeFilesystem = existing?.root === "/";
			if (!existing || wholeFilesystem && !existingWholeFilesystem || wholeFilesystem === existingWholeFilesystem && (mountPath.length < existing.path.length || mountPath.length === existing.path.length && mountPath < existing.path)) devices.set(device, {
				path: mountPath,
				root,
				identity
			});
		}
		return [...devices.values()].map(({ path, identity }) => ({
			path,
			identity
		}));
	}
	const { stdout, code } = await runCommandWithTimeout(["mount"], commandOptions);
	if (code !== 0) return;
	return stdout.split("\n").flatMap((line) => {
		const match = /^(\/dev\/\S+) on (.+) \(([^)]+)\)$/.exec(line);
		if (!match) return [];
		const [, device, mountPath, flags] = match;
		return device && mountPath && flags?.split(", ").includes("local") && (mountPath === "/" || !flags.split(", ").includes("nobrowse")) ? [{
			path: mountPath,
			identity: device
		}] : [];
	});
}
async function readMountedDisk(mount, platform, signal) {
	signal.throwIfAborted();
	const device = platform === "darwin" ? (await fs.stat(mount.path, { bigint: true })).dev : void 0;
	signal.throwIfAborted();
	if (device !== void 0 && mount.path !== "/" && device !== (await fs.stat(mount.identity, { bigint: true })).rdev) return;
	signal.throwIfAborted();
	const stats = await fs.statfs(mount.path, { bigint: true });
	signal.throwIfAborted();
	if (device !== void 0 && (await fs.stat(mount.path, { bigint: true })).dev !== device) return;
	const totalBytes = Number((stats.blocks * stats.frsize + 1023n) / 1024n * 1024n);
	const available = BigInt.asIntN(64, stats.bavail) * stats.frsize;
	const availableBytes = available <= 0n ? 0 : Number((available + 1023n) / 1024n * 1024n);
	return Number.isSafeInteger(totalBytes) && totalBytes > 0 && Number.isSafeInteger(availableBytes) ? {
		path: mount.path,
		totalBytes,
		availableBytes
	} : void 0;
}
async function collectSystemDisks(disks, signal) {
	const platform = os.platform();
	if (platform === "win32") {
		const { stdout, code } = await runCommandWithTimeout([
			"powershell.exe",
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			"[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); Get-CimInstance Win32_Volume -Filter 'DriveType=2 OR DriveType=3' | ForEach-Object { $volume = $_; $mount = if ($volume.DriveLetter) { $volume.DriveLetter + '\\' } else { Get-CimAssociatedInstance -InputObject $volume -Association Win32_MountPoint -ResultClassName Win32_Directory | Select-Object -ExpandProperty Name | Sort-Object | Select-Object -First 1 }; if ($mount) { [pscustomobject]@{Path=$mount;Capacity=$volume.Capacity;FreeSpace=$volume.FreeSpace} } } | ConvertTo-Json -Compress"
		], commandOptions);
		if (code !== 0) return;
		const parsed = stdout.trim() ? JSON.parse(stdout) : [];
		return (Array.isArray(parsed) ? parsed : [parsed]).flatMap((row) => {
			const result = windowsVolumeSchema.safeParse(row);
			return result.success ? [{
				path: result.data.Path,
				totalBytes: result.data.Capacity,
				availableBytes: result.data.FreeSpace
			}] : [];
		});
	}
	if (platform !== "linux" && platform !== "darwin") return;
	const paths = await readMountedDiskPaths(platform);
	if (!paths?.length) return paths ? [] : void 0;
	let failed = false;
	for (const mount of paths) {
		if (signal.aborted) break;
		try {
			const disk = await readMountedDisk(mount, platform, signal);
			signal.throwIfAborted();
			const currentPaths = platform === "linux" ? await readMountedDiskPaths(platform) : paths;
			signal.throwIfAborted();
			if (disk && currentPaths?.some((current) => current.path === mount.path && current.identity === mount.identity)) disks.push(disk);
		} catch {
			failed = true;
		}
	}
	return failed && disks.length === 0 ? void 0 : disks;
}
async function collectDiskSnapshot() {
	if (pendingCollection) return;
	const disks = [];
	const controller = new AbortController();
	const pending = collectSystemDisks(disks, controller.signal).finally(() => {
		pendingCollection = void 0;
	});
	pendingCollection = pending;
	try {
		const timeoutMs = os.platform() === "darwin" ? commandOptions.timeoutMs * 2 : commandOptions.timeoutMs;
		return await withTimeout(pending, timeoutMs);
	} catch {
		controller.abort();
		return disks.length > 0 ? disks : void 0;
	}
}
function readSystemDisks() {
	if (!snapshot || Date.now() >= snapshot.expiresAt) {
		const next = {
			expiresAt: Infinity,
			pending: collectDiskSnapshot().then((disks) => disks?.toSorted((left, right) => left.path.localeCompare(right.path))).catch(() => void 0).finally(() => {
				next.expiresAt = Date.now() + 1e4;
			})
		};
		snapshot = next;
	}
	return snapshot.pending;
}
//#endregion
//#region src/gateway/server-methods/system.ts
let advertisedLanHostPromise = null;
let cpuInfoSnapshot;
function resolveCachedAdvertisedLanHost() {
	advertisedLanHostPromise ??= resolveAdvertisedLanHostCore().catch(() => null);
	return advertisedLanHostPromise;
}
async function collectSystemInfo(context) {
	const now = Date.now();
	if (!cpuInfoSnapshot || now < cpuInfoSnapshot.sampledAtMs || now - cpuInfoSnapshot.sampledAtMs >= 2e3) {
		const cpus = os.cpus();
		cpuInfoSnapshot = {
			sampledAtMs: now,
			cpuCount: cpus.length,
			cpuModel: cpus[0]?.model.trim() || void 0
		};
	}
	const { cpuCount, cpuModel } = cpuInfoSnapshot;
	const [oneMinute = 0, fiveMinutes = 0, fifteenMinutes = 0] = os.loadavg();
	const loadAverage = [
		oneMinute,
		fiveMinutes,
		fifteenMinutes
	];
	const stateDir = resolveStateDir();
	const disk = tryReadDiskSpace(stateDir);
	const config = context.getRuntimeConfig();
	const port = resolveGatewayPort(config);
	const [lanAddress, disks] = await Promise.all([resolveCachedAdvertisedLanHost(), readSystemDisks()]);
	const soleAgentId = tryResolveLegacyCompatibilityAgentId(config);
	const defaultAgentUtilityModel = soleAgentId ? (() => {
		const utilitySetting = readUtilityModelSetting(config, soleAgentId);
		const utilityModel = resolveUtilityModelRefForAgent({
			cfg: config,
			agentId: soleAgentId
		});
		return utilitySetting.kind === "disabled" ? { status: "disabled" } : utilitySetting.kind === "explicit" ? {
			status: "configured",
			model: utilitySetting.modelRef
		} : utilityModel ? {
			status: "auto",
			model: utilityModel
		} : { status: "unavailable" };
	})() : { status: "unavailable" };
	return {
		machineName: await getMachineDisplayName(),
		hostname: os.hostname(),
		platform: os.platform(),
		release: os.release(),
		arch: os.arch(),
		osLabel: resolveRuntimeOsLabel(),
		...lanAddress ? { lanAddress } : {},
		port,
		nodeVersion: process.version,
		pid: process.pid,
		processInstanceId: getGatewayProcessInstanceId(),
		uptimeMs: Math.round(process.uptime() * 1e3),
		cpuCount,
		...cpuModel ? { cpuModel } : {},
		...loadAverage.some((value) => value !== 0) ? { loadAverage } : {},
		memoryTotalBytes: os.totalmem(),
		memoryFreeBytes: os.freemem(),
		...readGatewayProcessVitals(context.getEventLoopHealth),
		disks: disks ?? (disk?.totalBytes != null && disk.totalBytes > 0 ? [{
			path: stateDir,
			totalBytes: disk.totalBytes,
			availableBytes: disk.availableBytes
		}] : void 0),
		...disk?.totalBytes != null ? {
			diskTotalBytes: disk.totalBytes,
			diskAvailableBytes: disk.availableBytes,
			diskPath: stateDir
		} : {},
		defaultAgentUtilityModel
	};
}
/** Gateway handlers for identity, host information, heartbeat toggles, and presence events. */
const systemHandlers = {
	"gateway.identity.get": async ({ respond }) => {
		const identity = await loadOrCreateProcessDeviceIdentityAsync();
		respond(true, {
			deviceId: identity.deviceId,
			publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem)
		}, void 0);
	},
	"last-heartbeat": ({ respond }) => {
		respond(true, getLastHeartbeatEvent(), void 0);
	},
	"set-heartbeats": ({ params, respond }) => {
		const enabled = params.enabled;
		if (typeof enabled !== "boolean") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid set-heartbeats params: enabled (boolean) required"));
			return;
		}
		setSessionEventWakesEnabled(enabled);
		respond(true, {
			ok: true,
			enabled
		}, void 0);
	},
	"system-presence": ({ respond, client, context }) => {
		respond(true, createPresenceRecipientProjection({
			cfg: context.getRuntimeConfig(),
			presence: listSystemPresence()
		})(client), void 0);
	},
	"system.info": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemInfoParams, "system.info", respond)) return;
		respond(true, await collectSystemInfo(context), void 0);
	},
	"system-event": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemEventParams, "system-event", respond)) return;
		const text = normalizeOptionalString(params.text) ?? "";
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "text required"));
			return;
		}
		const requestedSessionKey = normalizeOptionalString(params.sessionKey);
		const cfg = context.getRuntimeConfig();
		const requestedOwner = requestedSessionKey ? resolveRequestedSessionAgentId(cfg, requestedSessionKey) : void 0;
		if (requestedOwner && !requestedOwner.ok) {
			respond(false, void 0, requestedOwner.error);
			return;
		}
		const { agentId: eventOwnerAgentId, sessionKey } = requestedSessionKey ? {
			agentId: requestedOwner?.agentId,
			sessionKey: requestedSessionKey
		} : resolveSystemMainSessionTarget(cfg);
		const wake = params.wake === true;
		const isNodePresenceLine = text.startsWith("Node:");
		if (wake && isNodePresenceLine) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake is not supported for node presence events"));
			return;
		}
		if (wake && requestedSessionKey) {
			const requestedAgentId = normalizeAgentId(requestedOwner?.agentId ?? resolveAgentIdFromSessionKey(requestedSessionKey));
			if (!listAgentIds(cfg).map(normalizeAgentId).includes(requestedAgentId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${requestedAgentId}"`));
				return;
			}
			const { entry: targetSession } = loadGatewaySessionEntryReadOnly(requestedSessionKey, { agentId: requestedAgentId });
			if (!targetSession || targetSession.archivedAt !== void 0) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Unknown or archived session "${requestedSessionKey}"`));
				return;
			}
		}
		const deviceId = readStringValue(params.deviceId);
		const instanceId = readStringValue(params.instanceId);
		const host = readStringValue(params.host);
		const ip = readStringValue(params.ip);
		const mode = readStringValue(params.mode);
		const version = readStringValue(params.version);
		const platform = readStringValue(params.platform);
		const deviceFamily = readStringValue(params.deviceFamily);
		const modelIdentifier = readStringValue(params.modelIdentifier);
		const reason = readStringValue(params.reason);
		const roles = Array.isArray(params.roles) && params.roles.every((t) => typeof t === "string") ? params.roles : void 0;
		const scopes = Array.isArray(params.scopes) && params.scopes.every((t) => typeof t === "string") ? params.scopes : void 0;
		const tags = Array.isArray(params.tags) && params.tags.every((t) => typeof t === "string") ? params.tags : void 0;
		const lastInputSeconds = tags?.includes("system-presence-clear-last-input") ? null : typeof params.lastInputSeconds === "number" && Number.isFinite(params.lastInputSeconds) ? params.lastInputSeconds : void 0;
		const presenceUpdate = updateSystemPresence({
			text,
			deviceId,
			instanceId,
			host,
			ip,
			mode,
			version,
			platform,
			deviceFamily,
			modelIdentifier,
			lastInputSeconds,
			reason,
			roles,
			scopes,
			tags
		});
		if (isNodePresenceLine) {
			const next = presenceUpdate.next;
			const changed = new Set(presenceUpdate.changedKeys);
			const reasonValue = next.reason ?? reason;
			const normalizedReason = normalizeLowercaseStringOrEmpty(reasonValue);
			const ignoreReason = normalizedReason.startsWith("periodic") || normalizedReason === "heartbeat" || normalizedReason === "connect" || normalizedReason === "launch" || normalizedReason === "instances-refresh";
			const hostChanged = changed.has("host");
			const ipChanged = changed.has("ip");
			const versionChanged = changed.has("version");
			const modeChanged = changed.has("mode");
			const reasonChanged = changed.has("reason") && !ignoreReason;
			if (hostChanged || ipChanged || versionChanged || modeChanged || reasonChanged) {
				const contextChanged = isSystemEventContextChanged(resolveSystemEventQueueKey(sessionKey, eventOwnerAgentId), presenceUpdate.key);
				const parts = [];
				if (contextChanged || hostChanged || ipChanged) {
					const hostLabel = normalizeOptionalString(next.host) ?? "Unknown";
					const ipLabel = normalizeOptionalString(next.ip);
					parts.push(`Node: ${hostLabel}${ipLabel ? ` (${ipLabel})` : ""}`);
				}
				if (versionChanged) parts.push(`app ${normalizeOptionalString(next.version) ?? "unknown"}`);
				if (modeChanged) parts.push(`mode ${normalizeOptionalString(next.mode) ?? "unknown"}`);
				if (reasonChanged) parts.push(`reason ${normalizeOptionalString(reasonValue) ?? "event"}`);
				const deltaText = parts.join(" · ");
				if (deltaText) {
					const eventOptions = {
						sessionKey,
						contextKey: presenceUpdate.key
					};
					enqueueSystemEvent(deltaText, eventOwnerAgentId ? withSystemEventOwner(eventOptions, eventOwnerAgentId) : eventOptions);
				}
			}
		} else {
			const eventOptions = { sessionKey };
			enqueueSystemEvent(text, eventOwnerAgentId ? withSystemEventOwner(eventOptions, eventOwnerAgentId) : eventOptions);
			if (wake) requestSessionEventWake({
				source: "notifications-event",
				intent: "immediate",
				reason: "wake",
				...!requestedSessionKey && eventOwnerAgentId ? { agentId: eventOwnerAgentId } : {},
				sessionKey,
				heartbeat: { target: "last" }
			});
		}
		broadcastPresenceSnapshot({
			broadcast: context.broadcast,
			incrementPresenceVersion: context.incrementPresenceVersion,
			getHealthVersion: context.getHealthVersion
		});
		respond(true, { ok: true }, void 0);
	}
};
//#endregion
export { systemHandlers };
