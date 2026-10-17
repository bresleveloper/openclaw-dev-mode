import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { y as readUtilityModelSetting } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { eo as validateSystemInfoParams } from "./src-l2dWvEsN.mjs";
import { h as setSessionEventWakesEnabled, p as requestSessionEventWake } from "./heartbeat-wake-ba6LAy2M.mjs";
import { c as resolveSystemEventQueueKey, d as getLastHeartbeatEvent, l as withSystemEventOwner } from "./system-event-ownership-BkQcgSZJ.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-00MgEWj5.mjs";
import { c as isSystemEventContextChanged, i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { ot as validatePresenceActivityParams } from "./worker-admission-CNeLWzVQ.mjs";
import { C as preparedModelRuntimeConfigsMatch } from "./prepared-model-runtime-BvTeWKXf.mjs";
import { l as publicKeyRawBase64UrlFromEd25519Pem } from "./ed25519-signature-D_xiObSW.mjs";
import "./device-identity-KmxGQO-v.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import "./sessions-D_sxp1B4.mjs";
import { r as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-CWlunAqt.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-DH0HB36b.mjs";
import { i as updateSystemPresence, n as listSystemPresence } from "./system-presence-CbgT1h20.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-zUQQg0xn.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { t as getMachineDisplayName } from "./machine-name-XEOScrzy.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { t as resolveAdvertisedLanHostCore } from "./advertised-lan-host-V7bMngZk.mjs";
import { n as readPreparedCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { r as defineValidatedGatewayMethod, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as createPresenceRecipientProjection } from "./presence-projection-DuCKwLv_.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
import { n as readGatewayProcessVitals } from "./process-vitals-db5Vubdr.mjs";
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
				next.expiresAt = Date.now() + 3e4;
			})
		};
		snapshot = next;
	}
	return snapshot.pending;
}
//#endregion
//#region src/gateway/server-methods/system.ts
let advertisedLanHostPromise = null;
let stateDiskSnapshot;
const cpuInfoSnapshot = (() => {
	const cpus = os.cpus();
	return {
		cpuCount: cpus.length,
		cpuModel: cpus[0]?.model.trim() || void 0
	};
})();
function resolveCachedAdvertisedLanHost() {
	advertisedLanHostPromise ??= resolveAdvertisedLanHostCore().catch(() => null);
	return advertisedLanHostPromise;
}
async function collectSystemInfo(context) {
	const { cpuCount, cpuModel } = cpuInfoSnapshot;
	const [oneMinute = 0, fiveMinutes = 0, fifteenMinutes = 0] = os.loadavg();
	const loadAverage = [
		oneMinute,
		fiveMinutes,
		fifteenMinutes
	];
	const stateDir = resolveStateDir();
	if (!stateDiskSnapshot || stateDiskSnapshot.stateDir !== stateDir || Date.now() >= stateDiskSnapshot.expiresAt) stateDiskSnapshot = {
		stateDir,
		disk: tryReadDiskSpace(stateDir),
		expiresAt: Date.now() + 3e4
	};
	const { disk } = stateDiskSnapshot;
	const config = context.getRuntimeConfig();
	const port = resolveGatewayPort(config);
	const [lanAddress, disks] = await Promise.all([resolveCachedAdvertisedLanHost(), readSystemDisks()]);
	const soleAgentId = tryResolveLegacyCompatibilityAgentId(config);
	const defaultAgentUtilityModel = await (async () => {
		if (!soleAgentId) return { status: "unavailable" };
		const utilitySetting = readUtilityModelSetting(config, soleAgentId);
		if (utilitySetting.kind === "disabled") return { status: "disabled" };
		const prepared = await readPreparedCatalog(context, soleAgentId);
		const current = prepared && prepared.agentId === soleAgentId && preparedModelRuntimeConfigsMatch(prepared.config, config) && prepared.isCurrent();
		const model = utilitySetting.kind === "explicit" ? utilitySetting.modelRef : current ? resolveUtilityModelRefForAgent({
			cfg: prepared.config,
			agentId: soleAgentId,
			metadataSnapshot: prepared.metadataSnapshot
		}) : void 0;
		if (!model) return { status: "unavailable" };
		const { resolveUtilityCompletionRuntimeForAgent } = await import("./utility-completion-C8ERp_cj.mjs");
		const runtime = current ? await resolveUtilityCompletionRuntimeForAgent({
			cfg: prepared.config,
			agentId: soleAgentId,
			agentDir: prepared.agentDir,
			workspaceDir: prepared.workspaceDir,
			metadataSnapshot: prepared.metadataSnapshot,
			preparedAuthStore: prepared.authStore,
			preparedRuntimeAuthModes: prepared.authModes,
			preparedRuntimeAuthMaterializations: prepared.authMaterializations,
			pluginRegistry: prepared.pluginRegistry,
			snapshot: prepared,
			isCurrent: prepared.isCurrent
		}) : void 0;
		return {
			status: utilitySetting.kind === "explicit" ? "configured" : "auto",
			model,
			...runtime ? { runtime } : {}
		};
	})();
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
			publicKey: publicKeyRawBase64UrlFromEd25519Pem(identity.publicKeyPem)
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
	"presence.activity": defineValidatedGatewayMethod("presence.activity", validatePresenceActivityParams, ({ client, context, respond }) => {
		context.recordClientActivity?.(client);
		respond(true, { ok: true }, void 0);
	}),
	"system-presence": async (options) => {
		const { respond, client, context } = options;
		const projection = getSessionRowProjection(context);
		while (projection?.needsMembershipPreparation()) {
			await projection.prepareMembership();
			readGatewayRequestMutationAuthority(options).assertCurrent();
		}
		respond(true, createPresenceRecipientProjection({
			cfg: context.getRuntimeConfig(),
			presence: listSystemPresence(),
			projection
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
		const reason = params.reason;
		const lastInputSeconds = params.tags?.includes("system-presence-clear-last-input") ? null : params.lastInputSeconds;
		const presenceUpdate = updateSystemPresence({
			text,
			deviceId: params.deviceId,
			instanceId: params.instanceId,
			host: params.host,
			ip: params.ip,
			mode: params.mode,
			version: params.version,
			platform: params.platform,
			deviceFamily: params.deviceFamily,
			modelIdentifier: params.modelIdentifier,
			lastInputSeconds,
			reason,
			roles: params.roles,
			scopes: params.scopes,
			tags: params.tags
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
		context.publishPresence();
		respond(true, { ok: true }, void 0);
	}
};
//#endregion
export { systemHandlers };
