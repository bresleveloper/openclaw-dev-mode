import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { n as defaultSlotIdForKey } from "./slots-DarSawuQ.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { o as isLoopbackGatewayUrl } from "./net-C6WEu3pd.mjs";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BcuL3xPn.mjs";
import { t as resolveGatewayProbeTarget } from "./probe-target-CzMPrY7s.mjs";
import { a as resolveTailscalePublishedHost } from "./tailscale-status-BA6JQcBe.mjs";
import { a as isProbeReachable, t as pickGatewaySelfPresence } from "./gateway-presence-DiwCIZHH.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-CGuGR8Uw.mjs";
import { existsSync } from "node:fs";
//#region src/commands/status.scan.shared.ts
const gatewayProbeModuleLoader = createLazyImportLoader(() => import("./status.gateway-probe-CzBxLFie.mjs"));
const probeGatewayModuleLoader = createLazyImportLoader(() => import("./probe-Cl0u_9Ie.mjs"));
const gatewayCallModuleLoader = createLazyImportLoader(() => import("./call-CWvmXO5x.mjs"));
const gatewayReadinessModuleLoader = createLazyImportLoader(() => import("./diagnostic-readiness-BhQFYllb.mjs"));
const memoryPresenceModuleLoader = createLazyImportLoader(async () => {
	const { loadBundledPluginPublicArtifactModuleSync } = await import("./public-surface-loader-DvffICdw.mjs");
	return loadBundledPluginPublicArtifactModuleSync({
		dirName: "memory-core",
		artifactBasename: "status-api.js"
	});
});
async function hasBuiltInMemoryState(databasePath) {
	if (!existsSync(databasePath)) return false;
	const { inspectMemoryIndexPresence } = await memoryPresenceModuleLoader.load();
	return await inspectMemoryIndexPresence(databasePath);
}
function shouldTryLocalStatusRpcFallback(params) {
	if (params.gatewayMode !== "local" || !params.gatewayProbe || params.gatewayProbe.ok || !isLoopbackGatewayUrl(params.gatewayUrl)) return false;
	return (params.gatewayProbe.error?.toLowerCase() ?? "").includes("timeout") || params.gatewayProbe.auth?.capability === "unknown";
}
async function applyLocalStatusRpcFallback(params) {
	if (params.enabled === false) return params.gatewayProbe;
	if (!shouldTryLocalStatusRpcFallback(params)) return params.gatewayProbe;
	const status = await gatewayCallModuleLoader.load().then(({ callGateway }) => {
		const timeoutMs = Math.min(2e3, resolveStatusGatewayProbeTimeoutMs(params));
		if (timeoutMs === 0) return null;
		return callGateway({
			config: params.cfg,
			configPath: params.configPath,
			method: "status",
			token: params.gatewayProbeAuth.token,
			password: params.gatewayProbeAuth.password,
			timeoutMs,
			mode: GATEWAY_CLIENT_MODES.BACKEND,
			clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT
		});
	}).catch(() => null);
	if (!status) return params.gatewayProbe;
	const auth = params.gatewayProbe.auth;
	return {
		...params.gatewayProbe,
		ok: true,
		status,
		...auth ? { auth: auth.capability === "unknown" ? {
			...auth,
			capability: "read_only"
		} : auth } : {}
	};
}
function hasExplicitMemorySearchConfig(cfg, agentId) {
	if (cfg.memory && Object.hasOwn(cfg.memory, "search")) return true;
	return listAgentEntries(cfg).some((agent) => normalizeAgentId(agent.id) === normalizeAgentId(agentId) && agent.memory != null && Object.hasOwn(agent.memory, "search"));
}
/** Resolves gateway connection details, probe result, auth warnings, and call overrides. */
async function resolveGatewayProbeSnapshot(params) {
	const gatewayConnection = buildGatewayConnectionDetailsWithResolvers({
		config: params.cfg,
		configPath: params.configPath
	});
	const { gatewayMode, mode, remoteUrlMissing } = resolveGatewayProbeTarget(params.cfg);
	const originScopedDeviceAuth = mode === "remote" || Boolean(process.env.OPENCLAW_GATEWAY_URL?.trim());
	const shouldResolveAuth = params.opts.skipProbe !== true && (!remoteUrlMissing || params.opts.resolveAuthWhenRemoteUrlMissing === true);
	const shouldProbe = params.opts.skipProbe !== true && (!remoteUrlMissing || params.opts.probeWhenRemoteUrlMissing === true);
	const gatewayProbeAuthResolution = shouldResolveAuth ? await gatewayProbeModuleLoader.load().then(({ resolveGatewayProbeAuthResolution }) => resolveGatewayProbeAuthResolution(params.cfg, params.env)) : {
		auth: {},
		warning: void 0
	};
	let gatewayProbeAuthWarning = gatewayProbeAuthResolution.warning;
	const remainingTimeoutMs = () => resolveStatusGatewayProbeTimeoutMs(params.opts);
	const readiness = shouldProbe && remainingTimeoutMs() > 0 ? await gatewayReadinessModuleLoader.load().then(({ waitForGatewayDiagnosticReadiness }) => waitForGatewayDiagnosticReadiness({
		config: params.cfg,
		timeoutMs: remainingTimeoutMs(),
		deadlineMs: params.opts.gatewayProbeDeadlineMs,
		onProgress: params.opts.onProgress,
		...gatewayProbeAuthResolution.auth
	})) : void 0;
	const canDiagnose = readiness?.healthy || readiness?.waitOutcome === "plugin-errors" || readiness?.waitOutcome === "channel-errors";
	const unavailableProbe = () => ({
		ok: false,
		url: gatewayConnection.url,
		connectLatencyMs: null,
		error: readiness?.waitOutcome === "still-starting" ? null : readiness?.probeError ?? (remainingTimeoutMs() === 0 ? "Gateway probe budget exhausted." : "Gateway is unreachable"),
		...readiness?.waitOutcome === "still-starting" ? { startupPhase: readiness.startupPhase ?? "startup" } : {},
		auth: {
			role: null,
			scopes: [],
			capability: "unknown"
		},
		close: null,
		health: null,
		status: null,
		presence: null,
		configSnapshot: null
	});
	const initialGatewayProbe = readiness && !canDiagnose || shouldProbe && remainingTimeoutMs() === 0 ? unavailableProbe() : shouldProbe ? await probeGatewayModuleLoader.load().then(({ probeGateway }) => {
		const timeoutMs = remainingTimeoutMs();
		return timeoutMs === 0 ? unavailableProbe() : probeGateway({
			url: gatewayConnection.url,
			config: params.cfg,
			originScopedDeviceAuth,
			configuredRemote: gatewayConnection.urlSource === "config gateway.remote.url",
			auth: gatewayProbeAuthResolution.auth,
			env: params.env,
			timeoutMs,
			detailLevel: params.opts.detailLevel ?? "presence"
		});
	}).catch(() => null) : null;
	const gatewayProbe = await applyLocalStatusRpcFallback({
		cfg: params.cfg,
		configPath: params.configPath,
		gatewayMode,
		gatewayUrl: gatewayConnection.url,
		gatewayProbe: initialGatewayProbe,
		gatewayProbeAuth: gatewayProbeAuthResolution.auth,
		timeoutMs: remainingTimeoutMs(),
		gatewayProbeDeadlineMs: params.opts.gatewayProbeDeadlineMs,
		enabled: !originScopedDeviceAuth && params.opts.localStatusRpcFallback !== false && remainingTimeoutMs() > 0 && (!readiness || canDiagnose)
	});
	if ((params.opts.mergeAuthWarningIntoProbeError ?? true) && gatewayProbeAuthWarning && gatewayProbe?.ok === false && !gatewayProbe.startupPhase) {
		gatewayProbe.error = gatewayProbe.error ? `${gatewayProbe.error}; ${gatewayProbeAuthWarning}` : gatewayProbeAuthWarning;
		gatewayProbeAuthWarning = void 0;
	}
	const gatewayReachable = gatewayProbe ? isProbeReachable(gatewayProbe) : false;
	const gatewaySelf = gatewayProbe?.presence ? pickGatewaySelfPresence(gatewayProbe.presence) : null;
	return {
		gatewayConnection,
		remoteUrlMissing,
		gatewayMode,
		gatewayProbeAuth: gatewayProbeAuthResolution.auth,
		gatewayProbeAuthWarning,
		gatewayProbe,
		gatewayReachable,
		localGatewayHealthy: readiness?.healthy === true && !readiness.activatedPluginErrors?.length && !readiness.channelProbeErrors?.length && gatewayProbe?.ok === true,
		gatewaySelf,
		...remoteUrlMissing ? { gatewayCallOverrides: {
			url: gatewayConnection.url,
			token: gatewayProbeAuthResolution.auth.token,
			password: gatewayProbeAuthResolution.auth.password
		} } : {}
	};
}
/** Builds the published Tailscale HTTPS Control UI URL when exposure is enabled. */
function buildTailscaleHttpsUrl(params) {
	const host = resolveTailscalePublishedHost({
		tailscaleMode: params.tailscaleMode,
		tailnetHost: params.tailscaleDns
	});
	return params.tailscaleMode !== "off" && host ? `https://${host}${normalizeControlUiBasePath(params.controlUiBasePath)}` : null;
}
/** Resolves memory provider status without creating default stores just for status output. */
async function resolveSharedMemoryStatusSnapshot(params) {
	const { cfg, agentStatus, memoryPlugin } = params;
	if (!memoryPlugin.enabled || !memoryPlugin.slot) return null;
	const agentId = agentStatus.defaultId;
	if (!agentId) return null;
	if (memoryPlugin.slot !== defaultSlotIdForKey("memory")) {
		if (params.isMemoryProviderNative?.({
			cfg,
			agentId
		})) return await resolveProviderStatusSnapshot(params, agentId, memoryPlugin.slot);
		return await resolveMemoryManagerStatusSnapshot(params, agentId);
	}
	const hasExplicitConfig = hasExplicitMemorySearchConfig(cfg, agentId);
	const defaultDatabasePath = params.requireDefaultDatabasePath?.(agentId);
	if (defaultDatabasePath && !hasExplicitConfig && !await hasBuiltInMemoryState(defaultDatabasePath)) return null;
	const resolvedMemory = params.resolveMemoryConfig(cfg, agentId);
	if (!resolvedMemory) return null;
	if (!(hasExplicitConfig || await hasBuiltInMemoryState(resolvedMemory.store.databasePath))) return null;
	return await resolveMemoryManagerStatusSnapshot(params, agentId);
}
async function resolveProviderStatusSnapshot(params, agentId, slot) {
	let provider = null;
	try {
		const acquired = await params.getMemoryProvider?.({
			cfg: params.cfg,
			agentId,
			purpose: "status",
			context: {
				authority: {
					kind: "host",
					operation: "status"
				},
				assertCurrent() {}
			}
		});
		provider = acquired?.provider ?? null;
		return {
			agentId,
			provider: acquired?.providerId ?? slot,
			health: provider ? await provider.health() : {
				status: "unavailable",
				message: acquired?.error ?? "provider unavailable"
			}
		};
	} catch (error) {
		return {
			agentId,
			provider: slot,
			health: {
				status: "unavailable",
				message: String(error)
			}
		};
	} finally {
		await provider?.close().catch(() => {});
	}
}
async function resolveMemoryManagerStatusSnapshot(params, agentId) {
	const { manager } = await params.getMemorySearchManager({
		cfg: params.cfg,
		agentId,
		purpose: "status",
		inspectSources: true
	});
	if (!manager) return null;
	try {
		try {
			if (manager.status().backend === "builtin" && manager.probeVectorStoreAvailability) await manager.probeVectorStoreAvailability();
			else await manager.probeVectorAvailability();
		} catch {}
		return {
			agentId,
			...manager.status()
		};
	} finally {
		await manager.close?.().catch(() => {});
	}
}
//#endregion
export { resolveGatewayProbeSnapshot as n, resolveSharedMemoryStatusSnapshot as r, buildTailscaleHttpsUrl as t };
