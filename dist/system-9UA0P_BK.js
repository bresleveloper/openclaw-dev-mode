import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { d as resolveGatewayPort, v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { i as loadOrCreateProcessDeviceIdentity, o as publicKeyRawBase64UrlFromPem } from "./device-identity-UW4cZXf5.js";
import { a as resolveAdvertisedLanHost } from "./advertised-lan-host-Bqt8QCKr.js";
import { c as setHeartbeatsEnabled } from "./heartbeat-wake-DibZKDF_.js";
import { a as enqueueSystemEvent, c as isSystemEventContextChanged } from "./system-events-BfmWSF2P.js";
import { o as resolveMainSessionKeyFromConfig } from "./sessions-BIAJdhW6.js";
import { t as getMachineDisplayName } from "./machine-name-DaF-eeRE.js";
import { n as resolveRuntimeOsLabel } from "./os-summary-CVk_nSu8.js";
import { Fn as validateSystemInfoParams } from "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import "./heartbeat-runner-BR4y_0kU.js";
import { n as getLastHeartbeatEvent } from "./heartbeat-events-DlT3VAUF.js";
import { n as tryReadDiskSpace } from "./disk-space-3_oNOOzX.js";
import { n as updateSystemPresence, t as listSystemPresence } from "./system-presence-D0ief7yP.js";
import { t as assertValidParams } from "./validation-BlJXIosl.js";
import { t as broadcastPresenceSnapshot } from "./presence-events-iHVz8t0I.js";
import os from "node:os";
//#region src/gateway/server-methods/system.ts
let advertisedLanHostPromise = null;
function resolveCachedAdvertisedLanHost() {
	advertisedLanHostPromise ??= resolveAdvertisedLanHost().catch(() => null);
	return advertisedLanHostPromise;
}
async function collectSystemInfo(context) {
	const cpus = os.cpus();
	const cpuModel = cpus[0]?.model.trim() || void 0;
	const [oneMinute = 0, fiveMinutes = 0, fifteenMinutes = 0] = os.loadavg();
	const loadAverage = [
		oneMinute,
		fiveMinutes,
		fifteenMinutes
	];
	const stateDir = resolveStateDir();
	const disk = tryReadDiskSpace(stateDir);
	const port = resolveGatewayPort(context.getRuntimeConfig());
	const lanAddress = await resolveCachedAdvertisedLanHost() ?? void 0;
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
		uptimeMs: Math.round(process.uptime() * 1e3),
		cpuCount: cpus.length,
		...cpuModel ? { cpuModel } : {},
		...loadAverage.some((value) => value !== 0) ? { loadAverage } : {},
		memoryTotalBytes: os.totalmem(),
		memoryFreeBytes: os.freemem(),
		...disk?.totalBytes != null ? {
			diskTotalBytes: disk.totalBytes,
			diskAvailableBytes: disk.availableBytes,
			diskPath: stateDir
		} : {}
	};
}
/** Gateway handlers for identity, host information, heartbeat toggles, and presence events. */
const systemHandlers = {
	"gateway.identity.get": ({ respond }) => {
		const identity = loadOrCreateProcessDeviceIdentity();
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
		setHeartbeatsEnabled(enabled);
		respond(true, {
			ok: true,
			enabled
		}, void 0);
	},
	"system-presence": ({ respond }) => {
		respond(true, listSystemPresence(), void 0);
	},
	"system.info": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemInfoParams, "system.info", respond)) return;
		respond(true, await collectSystemInfo(context), void 0);
	},
	"system-event": ({ params, respond, context }) => {
		const text = normalizeOptionalString(params.text) ?? "";
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "text required"));
			return;
		}
		const sessionKey = resolveMainSessionKeyFromConfig();
		const deviceId = readStringValue(params.deviceId);
		const instanceId = readStringValue(params.instanceId);
		const host = readStringValue(params.host);
		const ip = readStringValue(params.ip);
		const mode = readStringValue(params.mode);
		const version = readStringValue(params.version);
		const platform = readStringValue(params.platform);
		const deviceFamily = readStringValue(params.deviceFamily);
		const modelIdentifier = readStringValue(params.modelIdentifier);
		const lastInputSeconds = typeof params.lastInputSeconds === "number" && Number.isFinite(params.lastInputSeconds) ? params.lastInputSeconds : void 0;
		const reason = readStringValue(params.reason);
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
			roles: Array.isArray(params.roles) && params.roles.every((t) => typeof t === "string") ? params.roles : void 0,
			scopes: Array.isArray(params.scopes) && params.scopes.every((t) => typeof t === "string") ? params.scopes : void 0,
			tags: Array.isArray(params.tags) && params.tags.every((t) => typeof t === "string") ? params.tags : void 0
		});
		if (text.startsWith("Node:")) {
			const next = presenceUpdate.next;
			const changed = new Set(presenceUpdate.changedKeys);
			const reasonValue = next.reason ?? reason;
			const normalizedReason = normalizeLowercaseStringOrEmpty(reasonValue);
			const ignoreReason = normalizedReason.startsWith("periodic") || normalizedReason === "heartbeat";
			const hostChanged = changed.has("host");
			const ipChanged = changed.has("ip");
			const versionChanged = changed.has("version");
			const modeChanged = changed.has("mode");
			const reasonChanged = changed.has("reason") && !ignoreReason;
			if (hostChanged || ipChanged || versionChanged || modeChanged || reasonChanged) {
				const contextChanged = isSystemEventContextChanged(sessionKey, presenceUpdate.key);
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
				if (deltaText) enqueueSystemEvent(deltaText, {
					sessionKey,
					contextKey: presenceUpdate.key
				});
			}
		} else enqueueSystemEvent(text, { sessionKey });
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
