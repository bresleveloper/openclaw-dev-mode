import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import { a as READ_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import "./io-B0OAIqw3.mjs";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-DMGtt9dg.mjs";
import { n as inspectPortUsage } from "./ports-inspect-54fwKbFD.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-q_NaMExM.mjs";
import { r as callGateway, y as resolveReadOnlyLocalGatewayAuth } from "./call-DnqhP17M.mjs";
import "./client-CrrkVIh8.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-CR5N1X89.mjs";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-CUiOEilG.mjs";
import { r as classifyGatewayStaleConnectionError } from "./stale-install-CLeiGj_K.mjs";
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
		timeoutMs: Math.min(params.timeoutMs ?? 3e3, GATEWAY_RESTART_PROBE_TIMEOUT_MS),
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
		const probeStatus = async (pathname) => {
			return (await probe.requestHttp({
				host: "127.0.0.1",
				pathname,
				port: params.port,
				timeoutMs: Math.min(remainingMs, params.probeTimeoutMs ?? 3e3),
				...params.signal ? { signal: params.signal } : {}
			}))?.statusCode ?? null;
		};
		const [healthz, readyz] = await Promise.all([probeStatus("/healthz"), probeStatus("/readyz")]);
		params.signal?.throwIfAborted();
		latest = {
			healthz,
			readyz
		};
		params.onObservation?.(latest);
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
		for (const key of [
			"activationSource",
			"activationReason",
			"failurePhase"
		]) if (typeof entry[key] === "string") error[key] = entry[key];
		return [error];
	});
}
function readChannelProbeFailures(health) {
	const errors = [];
	const warnings = [];
	const channels = asOptionalRecord(asOptionalRecord(health)?.channels);
	for (const [id, summary] of Object.entries(channels ?? {})) {
		const accounts = Object.entries(asOptionalRecord(asOptionalRecord(summary)?.accounts) ?? {});
		for (const [accountId, value] of accounts.length ? accounts : Object.entries({ "": summary })) {
			const account = asOptionalRecord(value);
			if (account?.enabled === false || account?.configured === false) continue;
			if (account?.running === false || account?.healthState === "not-running") warnings.push({
				id: accountId ? `${id}/${accountId}` : id,
				error: typeof account.lastError === "string" && account.lastError.trim() ? account.lastError : "not running"
			});
		}
		const probe = asOptionalRecord(asOptionalRecord(summary)?.probe);
		if (probe?.ok !== false) continue;
		const error = probe.error;
		errors.push({
			id,
			error: typeof error === "string" && error.trim() ? error : "probe failed"
		});
	}
	return {
		errors,
		warnings
	};
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
		const controlAuth = await resolveReadOnlyLocalGatewayAuth({
			auth,
			authNone: context.config.gateway?.auth?.mode === "none",
			env: params.env
		});
		params.signal?.throwIfAborted();
		const health = await callGateway({
			config: context.config,
			localPortOverride: params.port,
			...controlAuth,
			tlsFingerprint: target.tlsFingerprint,
			method: "health",
			scopes: [READ_SCOPE],
			timeoutMs: params.timeoutMs ?? 3e3,
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
		const { errors, warnings } = readChannelProbeFailures(health);
		result.channelProbeErrors = errors;
		result.channelRuntimeWarnings = warnings.length ? warnings : void 0;
	} catch (error) {
		params.signal?.throwIfAborted();
		result.reachable = result.gatewayVersion === null && isGatewayProtocolResponseError(error) && (isGatewayAuthRejection(error.message) || params.allowDeviceIdentityRequired === true && error.message === "device identity required");
		if (!result.reachable) {
			result.staleConnection = classifyGatewayStaleConnectionError(error);
			result.probeError = formatGatewayRestartProbeError(error);
		}
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
export { resolveGatewayRestartProbeContext as a, hasListenerAttributionGap as c, readGatewayStartupPhase as i, listenerOwnedByRuntimePid as l, confirmGatewayReachable as n, waitForGatewayHttpReadiness as o, inspectGatewayPortHealth as r, allListenersOwnedByRuntimePid as s, GATEWAY_RESTART_PROBE_TIMEOUT_MS as t };
