import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { a as READ_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import "./io-DuIKUcsW.mjs";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-DxY7uEcU.mjs";
import { n as inspectPortUsage } from "./ports-inspect-DXXAw_y-.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-Cv2D06JO.mjs";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-HKRZ1hRc.mjs";
import { r as loadDeviceIdentityIfPresent } from "./device-identity-B_zMrBd6.mjs";
import { o as callGateway, v as loadStoredOperatorDeviceAuthToken } from "./call-C_MP4_Gs.mjs";
import "./client-CpsABkfT.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-BaSdm1-m.mjs";
//#region src/cli/daemon-cli/restart-port-ownership.ts
function hasListenerAttributionGap(portUsage) {
	if (portUsage.status !== "busy" || portUsage.listeners.length > 0) return false;
	if (portUsage.errors?.length) return true;
	return portUsage.hints.some((hint) => hint.includes("process details are unavailable"));
}
function listenerOwnedByRuntimePid(params) {
	return params.listener.pid === params.runtimePid || params.listener.ppid === params.runtimePid;
}
function allListenersOwnedByRuntimePid(listeners, runtimePid) {
	return listeners.length > 0 && listeners.every((listener) => listenerOwnedByRuntimePid({
		listener,
		runtimePid
	}));
}
//#endregion
//#region src/cli/daemon-cli/restart-health-probe.ts
const GATEWAY_RESTART_PROBE_TIMEOUT_MS = 3e3;
async function readGatewayStartupPhase(params) {
	const response = await params.configuredProbe.requestHttp({
		host: "127.0.0.1",
		pathname: "/startupz",
		port: params.port,
		timeoutMs: Math.min(params.timeoutMs ?? GATEWAY_RESTART_PROBE_TIMEOUT_MS, GATEWAY_RESTART_PROBE_TIMEOUT_MS),
		...params.signal ? { signal: params.signal } : {}
	});
	if (response?.statusCode !== 503) return;
	try {
		const startup = asOptionalRecord(JSON.parse(response.body));
		return startup?.status === "starting" && typeof startup.pendingReason === "string" && startup.pendingReason.trim() ? formatGatewayRestartProbeError(startup.pendingReason) : void 0;
	} catch {
		return;
	}
}
/** Waits for the unauthenticated HTTP(S) readiness contracts reported by service start. */
async function waitForGatewayHttpReadiness(params) {
	params.signal?.throwIfAborted();
	const probe = createConfiguredGatewayLocalProbe(params.config ?? {});
	let latest = {
		healthz: null,
		readyz: null
	};
	for (let attempt = 0; attempt < params.attempts; attempt += 1) {
		params.signal?.throwIfAborted();
		const remainingMs = params.deadlineAt - Date.now();
		if (remainingMs <= 0) return latest;
		const [healthz, readyz] = await Promise.all([probe.requestHttp({
			host: "127.0.0.1",
			pathname: "/healthz",
			port: params.port,
			timeoutMs: Math.min(remainingMs, params.probeTimeoutMs ?? GATEWAY_RESTART_PROBE_TIMEOUT_MS),
			...params.signal ? { signal: params.signal } : {}
		}).then((result) => result?.statusCode ?? null), probe.requestHttp({
			host: "127.0.0.1",
			pathname: "/readyz",
			port: params.port,
			timeoutMs: Math.min(remainingMs, params.probeTimeoutMs ?? GATEWAY_RESTART_PROBE_TIMEOUT_MS),
			...params.signal ? { signal: params.signal } : {}
		}).then((result) => result?.statusCode ?? null)]);
		params.signal?.throwIfAborted();
		latest = {
			healthz,
			readyz
		};
		if (healthz === 200 && readyz === 200) return latest;
		if (attempt + 1 < params.attempts) {
			const remainingDelayMs = params.deadlineAt - Date.now();
			if (remainingDelayMs <= 0) return latest;
			await sleep(Math.min(params.delayMs, remainingDelayMs), params.signal);
		}
	}
	return latest;
}
function formatGatewayRestartProbeError(error) {
	return truncateUtf16Safe(sanitizeTerminalText(redactSensitiveUrlLikeString(formatErrorMessage(error))), 1024);
}
function isGatewayAuthRejection(reason) {
	const normalized = normalizeLowercaseStringOrEmpty(reason);
	if (classifyGatewayConnectFailure({ reason: normalized }).kind === "pairing-required" && (normalized === "pairing required" || normalized.startsWith("pairing required:"))) return true;
	return normalized === "auth required" || normalized === "owner auth required" || normalized === "connect failed" || normalized === "device required" || normalized.startsWith("unauthorized: gateway token missing") || normalized.startsWith("unauthorized: gateway token mismatch") || normalized.startsWith("unauthorized: gateway token not configured") || normalized.startsWith("unauthorized: gateway password missing") || normalized.startsWith("unauthorized: gateway password mismatch") || normalized.startsWith("unauthorized: gateway password not configured") || normalized.startsWith("unauthorized: bootstrap token invalid or expired") || normalized.startsWith("unauthorized: tailscale identity missing") || normalized.startsWith("unauthorized: tailscale proxy headers missing") || normalized.startsWith("unauthorized: tailscale identity check failed") || normalized.startsWith("unauthorized: tailscale identity mismatch") || normalized.startsWith("unauthorized: too many failed authentication attempts") || normalized.startsWith("unauthorized: device token mismatch") || normalized.startsWith("unauthorized: device token rejected");
}
function readActivatedPluginErrors(health) {
	const errors = asOptionalRecord(asOptionalRecord(health)?.plugins)?.errors;
	if (!Array.isArray(errors)) return [];
	return errors.flatMap((value) => {
		const entry = asOptionalRecord(value);
		if (entry?.activated !== true || typeof entry.id !== "string" || typeof entry.error !== "string") return [];
		const error = {
			id: entry.id,
			origin: typeof entry.origin === "string" ? entry.origin : "unknown",
			activated: true,
			error: entry.error
		};
		if (typeof entry.activationSource === "string") error.activationSource = entry.activationSource;
		if (typeof entry.activationReason === "string") error.activationReason = entry.activationReason;
		if (typeof entry.failurePhase === "string") error.failurePhase = entry.failurePhase;
		return [error];
	});
}
function readChannelProbeErrors(health) {
	const channels = asOptionalRecord(asOptionalRecord(health)?.channels);
	if (!channels) return [];
	const errors = [];
	for (const [id, summary] of Object.entries(channels)) {
		const probe = asOptionalRecord(asOptionalRecord(summary)?.probe);
		if (probe?.ok !== false) continue;
		const error = probe.error;
		errors.push({
			id,
			error: typeof error === "string" && error.trim() ? error : "probe failed"
		});
	}
	return errors;
}
function readUnavailablePlugins(health) {
	const unavailable = asOptionalRecord(asOptionalRecord(health)?.plugins)?.unavailable;
	if (!Array.isArray(unavailable)) return [];
	return unavailable.flatMap((entry) => {
		const plugin = asOptionalRecord(entry);
		const diagnostic = asOptionalRecord(plugin?.diagnostic);
		if (typeof plugin?.id !== "string" || plugin.state !== "configured-unavailable" || diagnostic?.kind !== "plugin-verification" || typeof diagnostic.reason !== "string" || typeof diagnostic.detail !== "string") return [];
		return [{
			id: plugin.id,
			reason: diagnostic.reason,
			detail: diagnostic.detail
		}];
	});
}
async function confirmGatewayReachable(params) {
	params.signal?.throwIfAborted();
	const result = {
		reachable: false,
		gatewayVersion: null,
		gatewayBuildId: void 0,
		activatedPluginErrors: [],
		unavailablePlugins: [],
		channelProbeErrors: []
	};
	try {
		const context = params.config ? {
			config: params.config,
			auth: params.auth
		} : await resolveGatewayRestartProbeContext(params.env, void 0, params.signal);
		params.signal?.throwIfAborted();
		const auth = params.auth ?? context.auth;
		const target = await (params.configuredProbe ?? createConfiguredGatewayLocalProbe(context.config)).resolveWebSocketTarget(params.port, params.signal);
		params.signal?.throwIfAborted();
		if (!target) return {
			...result,
			probeError: "gateway TLS certificate unavailable"
		};
		const authNone = context.config.gateway?.auth?.mode === "none";
		const identity = authNone || auth?.token || auth?.password ? null : loadDeviceIdentityIfPresent({ env: params.env });
		const preparedDeviceAuth = await loadStoredOperatorDeviceAuthToken(identity, void 0, "read-only", params.env);
		params.signal?.throwIfAborted();
		const health = await callGateway({
			config: context.config,
			localPortOverride: params.port,
			token: auth?.token,
			password: auth?.password,
			skipImplicitAuth: true,
			tlsFingerprint: target.tlsFingerprint,
			method: "health",
			scopes: [READ_SCOPE],
			clientName: authNone ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
			mode: authNone ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
			requireLocalBackendSharedAuth: authNone,
			deviceIdentity: preparedDeviceAuth ? identity : null,
			preparedDeviceAuth: preparedDeviceAuth ?? void 0,
			sharedStateMode: "read-only",
			timeoutMs: params.timeoutMs ?? GATEWAY_RESTART_PROBE_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {},
			onHelloOk: (hello) => {
				result.gatewayVersion = hello.server.version;
				result.gatewayBootId = hello.server.bootId;
				result.gatewayBuildId = hello.server.buildId ?? null;
			}
		});
		result.reachable = true;
		result.activatedPluginErrors = readActivatedPluginErrors(health);
		result.unavailablePlugins = readUnavailablePlugins(health);
		result.channelProbeErrors = readChannelProbeErrors(health);
	} catch (error) {
		params.signal?.throwIfAborted();
		result.reachable = result.gatewayVersion === null && isGatewayProtocolResponseError(error) && (isGatewayAuthRejection(error.message) || params.allowDeviceIdentityRequired === true && error.message === "device identity required");
		if (!result.reachable) result.probeError = formatGatewayRestartProbeError(error);
	}
	params.signal?.throwIfAborted();
	return result;
}
async function resolveGatewayRestartProbeContext(env, explicitAuth, signal) {
	signal?.throwIfAborted();
	const mergedEnv = {
		...process.env,
		...env
	};
	const cfg = await createConfigIO({
		env: mergedEnv,
		observe: false,
		pluginValidation: "skip",
		suppressFutureVersionWarning: true
	}).readBestEffortConfig().catch(() => ({}));
	signal?.throwIfAborted();
	const resolved = await resolveGatewayProbeAuthSafeWithSecretInputs({
		cfg,
		mode: "local",
		env: mergedEnv,
		explicitAuth
	});
	signal?.throwIfAborted();
	return {
		auth: resolved.auth,
		config: cfg
	};
}
async function inspectGatewayPortHealth(params) {
	let portUsage;
	try {
		portUsage = await inspectPortUsage(params.port, { probeHosts: LOOPBACK_PORT_PROBE_HOSTS });
	} catch (err) {
		portUsage = {
			port: params.port,
			status: "unknown",
			listeners: [],
			hints: [],
			errors: [String(err)]
		};
	}
	if (portUsage.status !== "busy") return {
		portUsage,
		healthy: false
	};
	const expectedListenerPid = params.expectedListenerPid;
	const listenerOwnershipVerified = expectedListenerPid !== void 0 && allListenersOwnedByRuntimePid(portUsage.listeners, expectedListenerPid);
	const { reachable, probeError } = await confirmGatewayReachable({
		port: params.port,
		auth: params.auth,
		...params.config ? { config: params.config } : {},
		...params.configuredProbe ? { configuredProbe: params.configuredProbe } : {},
		env: process.env,
		allowDeviceIdentityRequired: listenerOwnershipVerified
	});
	return {
		portUsage,
		healthy: reachable,
		...probeError ? { probeError } : {}
	};
}
//#endregion
export { waitForGatewayHttpReadiness as a, listenerOwnedByRuntimePid as c, resolveGatewayRestartProbeContext as i, inspectGatewayPortHealth as n, allListenersOwnedByRuntimePid as o, readGatewayStartupPhase as r, hasListenerAttributionGap as s, confirmGatewayReachable as t };
