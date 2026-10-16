import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as extractErrorCodeOrErrno } from "./error-coercion-CvJK4lmH.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as SUBAGENT_EXEC_ENV_VAR } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { a as isGatewayTransportError, n as createGatewayCloseTransportError, r as createGatewayTimeoutTransportError, t as GatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { i as createAbortError } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { b as resolveGatewayPort, m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { c as resolveSafeTimeoutDelayMs, s as resolvePreauthHandshakeTimeoutMs } from "./timeouts-Th9Axx4o.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { c as readMissingScopeErrorDetails } from "./gateway-error-details-DIefe7Zy.mjs";
import "./version-CwNT1gaY.mjs";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "./device-identity-KmxGQO-v.mjs";
import { o as isLoopbackGatewayUrl } from "./net-C6WEu3pd.mjs";
import { t as ConnectErrorDetailCodes, u as readConnectErrorDetailCode } from "./connect-error-details-q_NaMExM.mjs";
import { a as loadDeviceAuthTokenReadOnly, c as loadOriginDeviceTokenReadOnly, i as loadDeviceAuthToken, s as loadOriginDeviceToken } from "./device-auth-store-BEiXAvyd.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-kkd804Uc.mjs";
import { n as readGatewayDispatchConfigWithShellEnvFallback, t as readGatewayDispatchConfig } from "./gateway-dispatch-config-DIC_vPET.mjs";
import { r as trimToUndefined } from "./credential-planner-qXtujUeq.mjs";
import { n as isGatewaySecretRefUnavailableError, r as resolveExplicitGatewayAuth } from "./credentials-lHQ7_oVm.mjs";
import { i as resolveGatewayAuthForConfig } from "./auth-resolve-BmUDP1m_.mjs";
import { n as projectGatewayConnectionDetailsForDiagnostics, r as projectGatewayUrlForDiagnostics, t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BcuL3xPn.mjs";
import "./credentials-secret-inputs-DxDUO_P2.mjs";
import { i as resolveGatewayUrlOverride, r as resolveGatewayClientBootstrap } from "./client-bootstrap-D-pUrrKi.mjs";
import { n as prepareGatewayClientDeviceAuth, t as GatewayClient } from "./client-CrrkVIh8.mjs";
import { n as isGatewayConnectAssemblyError } from "./request-error-Clu0Uyey.mjs";
import { n as normalizeEdgeAuthHeadersConfig, r as resolveEdgeAuthHeaders, t as gatewayEdgeAuthValueForTarget } from "./edge-auth-CCWpK-_0.mjs";
import { a as isGatewayMethodClassified, s as resolveLeastPrivilegeOperatorScopesForMethod, t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-BrMPjfvW.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/call-device-auth.ts
var GatewayCredentialsRequiredError = class extends Error {
	constructor(params) {
		super([
			`gateway ${params.method} requires credentials before opening a websocket`,
			"Fix: configure gateway.auth token/password, pair this device, or pass --token/--password.",
			`Config: ${params.configPath}`
		].join("\n"));
		this.name = "GatewayCredentialsRequiredError";
		this.method = params.method;
		this.configPath = params.configPath;
	}
};
var GatewayStoredDeviceAuthUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayStoredDeviceAuthUnavailableError";
	}
};
var GatewayLocalBackendSharedAuthUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayLocalBackendSharedAuthUnavailableError";
	}
};
async function resolveReadOnlyLocalGatewayAuth(params) {
	const { auth, authNone, env } = params;
	const identity = authNone || auth?.token || auth?.password ? null : loadDeviceIdentityIfPresent({ env });
	const preparedDeviceAuth = await loadStoredOperatorDeviceAuthToken(identity, void 0, "read-only", env);
	return {
		token: auth?.token,
		password: auth?.password,
		skipImplicitAuth: true,
		clientName: authNone ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
		mode: authNone ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
		requireLocalBackendSharedAuth: authNone,
		deviceIdentity: preparedDeviceAuth ? identity : null,
		preparedDeviceAuth: preparedDeviceAuth ?? void 0,
		sharedStateMode: "read-only"
	};
}
function resolveDeviceIdentityForGatewayCall(sharedStateMode) {
	try {
		return sharedStateMode === "read-only" ? loadDeviceIdentityIfPresent() : loadOrCreateDeviceIdentity();
	} catch {
		return null;
	}
}
function resolveGatewayCallDeviceAuth(params) {
	const { opts } = params;
	const isLoopback = isLoopbackGatewayUrl(params.url);
	const clientOptions = {
		clientName: opts.clientName,
		mode: opts.mode,
		requireLocalBackendSharedAuth: opts.requireLocalBackendSharedAuth
	};
	if (opts.allowLocalBackendAuthNone && params.authMode === "none" && params.isImplicitLocalTarget && isLoopback && opts.clientName === GATEWAY_CLIENT_NAMES.CLI && opts.mode === GATEWAY_CLIENT_MODES.CLI && opts.deviceIdentity === void 0 && !opts.useStoredDeviceAuth && !opts.preparedDeviceAuth && !opts.approvalRuntimeToken && !opts.agentRuntimeIdentityToken) {
		clientOptions.clientName = GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT;
		clientOptions.mode = GATEWAY_CLIENT_MODES.BACKEND;
		clientOptions.requireLocalBackendSharedAuth = true;
	}
	const mode = clientOptions.mode ?? GATEWAY_CLIENT_MODES.CLI;
	const clientName = clientOptions.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	const allowAuthNone = clientOptions.requireLocalBackendSharedAuth === true && params.authMode === "none";
	const hasSharedSecretAuth = params.authMode === "token" && Boolean(params.token) || params.authMode === "password" && Boolean(params.password);
	const isLocalBackendSharedAuth = mode === GATEWAY_CLIENT_MODES.BACKEND && clientName === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT && (hasSharedSecretAuth || allowAuthNone) && isLoopback;
	const isLocalCliSharedAuth = mode === GATEWAY_CLIENT_MODES.CLI && clientName === GATEWAY_CLIENT_NAMES.CLI && hasSharedSecretAuth && isLoopback;
	const omitDeviceIdentity = isLocalBackendSharedAuth || isLocalCliSharedAuth;
	if (clientOptions.requireLocalBackendSharedAuth && !omitDeviceIdentity) throw new GatewayLocalBackendSharedAuthUnavailableError("local backend shared auth requires a loopback gateway with token/password credentials or auth mode none");
	return {
		clientOptions,
		omitDeviceIdentity,
		deviceIdentity: opts.deviceIdentity === void 0 ? omitDeviceIdentity ? null : resolveDeviceIdentityForGatewayCall(opts.sharedStateMode) : opts.deviceIdentity
	};
}
async function loadStoredOperatorDeviceAuthToken(deviceIdentity, deviceAuthScope, sharedStateMode, env = process.env) {
	if (!deviceIdentity) return null;
	try {
		if (deviceAuthScope) return await (sharedStateMode === "read-only" ? loadOriginDeviceTokenReadOnly : loadOriginDeviceToken)({
			gatewayScope: deviceAuthScope,
			deviceId: deviceIdentity.deviceId,
			role: "operator",
			env
		});
		return await (sharedStateMode === "read-only" ? loadDeviceAuthTokenReadOnly : loadDeviceAuthToken)({
			deviceId: deviceIdentity.deviceId,
			role: "operator",
			env
		});
	} catch {
		return null;
	}
}
//#endregion
//#region src/gateway/call-required-features.ts
function ensureGatewaySupportsRequiredFeatures(params) {
	const required = (params.required ?? []).map((entry) => entry.trim()).filter(Boolean);
	if (required.length === 0) return;
	const supported = new Set((params.supported ?? []).map((entry) => entry.trim()).filter(Boolean));
	for (const feature of required) if (!supported.has(feature)) throw new Error(`active gateway does not support required ${params.kind} "${feature}" for "${params.attemptedMethod}". Update or restart the active gateway and try again.`);
}
//#endregion
//#region src/gateway/explicit-connection-policy.ts
function hasExplicitGatewayConnectionAuth(auth) {
	return Boolean(trimToUndefined(auth?.token) || trimToUndefined(auth?.password));
}
function targetMayRequireConfiguredEdgeAuth(url) {
	try {
		const protocol = new URL(url).protocol;
		return protocol === "wss:" || protocol === "https:";
	} catch {
		return false;
	}
}
/**
* True when the caller fully addressed the Gateway with flags. Config is then
* consulted only for gateway.remote.edgeAuth, so a broken config must not block
* the connection: this is the historical recovery path for an invalid config.
*/
function isExplicitGatewayConnection(params) {
	return !params.config && Boolean(trimToUndefined(params.urlOverride)) && hasExplicitGatewayConnectionAuth(params.explicitAuth);
}
/** Returns true when url/auth flags are sufficient and loading OpenClaw config is unnecessary. */
function canSkipGatewayConfigLoad(params) {
	const urlOverride = trimToUndefined(params.urlOverride);
	if (!urlOverride || params.config || !hasExplicitGatewayConnectionAuth(params.explicitAuth)) return false;
	return !targetMayRequireConfiguredEdgeAuth(urlOverride);
}
//#endregion
//#region src/gateway/operator-cli-message-input.ts
/** Operator message RPCs cannot preserve the source of an agent's shell report. */
function assertGatewayCliMessageContext(method, params) {
	const agentExec = process.env.OPENCLAW_SHELL === "exec";
	const subagentExec = process.env[SUBAGENT_EXEC_ENV_VAR] === "1";
	if (!agentExec && !subagentExec) return;
	const sessionMessage = [
		"sessions.send",
		"sessions.steer",
		"chat.send"
	].includes(method);
	if (subagentExec && sessionMessage) throw new Error("Subagent session messages must use the task completion path. Return your result or blocker in the child turn; do not use the CLI to contact other sessions.");
	if (!agentExec) return;
	const input = method === "sessions.create" ? asNullableRecord(params) : null;
	if (input && ([input.message, input.task].some((value) => typeof value === "string" && value.trim()) || Array.isArray(input.attachments) && input.attachments.length > 0) || sessionMessage || method === "agent") throw new Error(`Gateway ${method} from agent exec would lose inter-session attribution. Use the attributed session-messaging tool available to this run, or return the result through normal subagent completion. Do not retry through another CLI route or remove the exec marker.`);
}
//#endregion
//#region src/gateway/call.ts
function firstGatewayErrorLine(message) {
	return message.split("\n", 1)[0]?.trim() || message;
}
const GATEWAY_UNREACHABLE_SOCKET_CODES = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"ETIMEDOUT"
]);
function isGatewayUnreachableSocketError(error) {
	const code = extractErrorCodeOrErrno(error);
	return code !== void 0 && GATEWAY_UNREACHABLE_SOCKET_CODES.has(code);
}
function formatGatewayTransportErrorJson(value) {
	if (!isGatewayTransportError(value)) return null;
	const connectionDetails = projectGatewayConnectionDetailsForDiagnostics(value.connectionDetails);
	return {
		ok: false,
		error: {
			type: "gateway_transport_error",
			kind: value.kind,
			message: redactSensitiveUrlLikeString(firstGatewayErrorLine(value.message)),
			...value.code !== void 0 ? { code: value.code } : {},
			...value.reason !== void 0 ? { reason: redactSensitiveUrlLikeString(value.reason) } : {},
			...value.timeoutMs !== void 0 ? { timeoutMs: value.timeoutMs } : {}
		},
		gateway: {
			url: connectionDetails.url,
			urlSource: connectionDetails.urlSource,
			...connectionDetails.bindDetail ? { bindDetail: connectionDetails.bindDetail } : {},
			...connectionDetails.remoteFallbackNote ? { remoteFallbackNote: connectionDetails.remoteFallbackNote } : {}
		}
	};
}
function formatGatewayClientRequestErrorJson(value) {
	if (!isGatewayClientRequestError(value)) return null;
	const requestError = value;
	return {
		ok: false,
		error: {
			type: "gateway_request_error",
			code: requestError.gatewayCode,
			message: requestError.message,
			...requestError.details !== void 0 ? { details: requestError.details } : {},
			retryable: requestError.retryable,
			...requestError.retryAfterMs !== void 0 ? { retryAfterMs: requestError.retryAfterMs } : {}
		}
	};
}
function isGatewayClientRequestError(value) {
	if (!(value instanceof Error) || value.name !== "GatewayClientRequestError") return false;
	const requestError = value;
	if (typeof requestError.gatewayCode !== "string" || requestError.gatewayCode.length === 0 || requestError.message.length === 0 || typeof requestError.retryable !== "boolean" || requestError.retryAfterMs !== void 0 && (typeof requestError.retryAfterMs !== "number" || !Number.isInteger(requestError.retryAfterMs) || requestError.retryAfterMs < 0)) return false;
	return true;
}
/** Preserve machine-readable output for auth failures raised before transport startup. */
function formatGatewayAuthErrorJson(value) {
	if (!isGatewayCredentialsRequiredError(value) && !isGatewayExplicitAuthRequiredError(value) && !isGatewaySecretRefUnavailableError(value)) return null;
	return {
		ok: false,
		error: {
			type: "gateway_credentials_required",
			message: value.message
		}
	};
}
function isGatewayCredentialsRequiredError(value) {
	if (value instanceof GatewayCredentialsRequiredError) return true;
	if (!(value instanceof Error) || value.name !== "GatewayCredentialsRequiredError") return false;
	const candidate = value;
	return typeof candidate.method === "string" && typeof candidate.configPath === "string";
}
function isGatewayExplicitAuthRequiredError(value) {
	return value instanceof Error && value.name === "GatewayExplicitAuthRequiredError";
}
async function loadGatewayConfig() {
	return getRuntimeConfigSnapshot() ?? await readGatewayDispatchConfigWithShellEnvFallback();
}
async function stopGatewayClient(client) {
	try {
		await client.stopAndWait({ timeoutMs: 1e3 });
	} catch {
		client.stop();
	}
}
function resolveGatewayClientDisplayName(opts) {
	if (opts.clientDisplayName) return opts.clientDisplayName;
	const clientName = opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	if ((opts.mode ?? GATEWAY_CLIENT_MODES.CLI) !== GATEWAY_CLIENT_MODES.BACKEND && clientName !== GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT) return;
	const method = opts.method.trim();
	return method ? `gateway:${method}` : "gateway:request";
}
/**
* Load config for a fully flag-addressed connection. Config only supplies
* gateway.remote.edgeAuth here, so an unreadable or invalid config degrades to
* empty rather than blocking a connection the flags already describe.
*/
async function loadGatewayConfigForExplicitConnection() {
	try {
		return await loadGatewayConfig();
	} catch {
		return {};
	}
}
function resolveGatewayConfigPath(env) {
	return resolveConfigPath(env, resolveStateDir(env));
}
function buildGatewayConnectionDetails(options = {}) {
	return buildGatewayConnectionDetailsWithResolvers(options, {
		getRuntimeConfig: readGatewayDispatchConfig,
		resolveConfigPath: resolveGatewayConfigPath,
		resolveGatewayPort
	});
}
function resolveGatewayCallAuth(config) {
	return resolveGatewayAuthForConfig({
		config,
		env: process.env,
		tailscaleMode: config.gateway?.tailscale?.mode
	});
}
async function ensureGatewayCallCanAuthenticate(params) {
	const resolvedAuth = resolveGatewayCallAuth(params.context.config);
	const authMode = resolvedAuth.mode;
	if (authMode !== "token" && authMode !== "password") return;
	if (params.token || params.password || params.opts.approvalRuntimeToken) return;
	if (resolvedAuth.allowTailscale) return;
	if ((params.storedAuth === void 0 ? await loadStoredOperatorDeviceAuthToken(params.deviceIdentity, params.deviceAuthScope, params.opts.sharedStateMode) : params.storedAuth)?.token) return;
	throw new GatewayCredentialsRequiredError({
		method: params.opts.method,
		configPath: params.context.configPath
	});
}
function resolveGatewayCallTimeout(timeoutValue) {
	const resolvedHandshakeTimeoutMs = Boolean(process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS) || Boolean(isVitestRuntimeEnv() && process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS) ? resolvePreauthHandshakeTimeoutMs() : void 0;
	const defaultTimeoutMs = typeof resolvedHandshakeTimeoutMs === "number" && resolvedHandshakeTimeoutMs > 1e4 ? resolvedHandshakeTimeoutMs : 1e4;
	const explicitTimeoutMs = typeof timeoutValue === "number" && Number.isFinite(timeoutValue) ? timeoutValue : void 0;
	const startupTimeoutMs = explicitTimeoutMs ?? defaultTimeoutMs;
	const timeoutMs = timeoutValue === null ? null : explicitTimeoutMs ?? defaultTimeoutMs;
	return {
		timeoutMs,
		startupTimeoutMs,
		safeTimerTimeoutMs: resolveSafeTimeoutDelayMs(timeoutMs ?? startupTimeoutMs)
	};
}
async function resolveGatewayCallContext(opts) {
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).url;
	const canSkipConfigLoad = canSkipGatewayConfigLoad({
		config: opts.config,
		urlOverride,
		explicitAuth
	});
	const explicitConnection = isExplicitGatewayConnection({
		config: opts.config,
		urlOverride,
		explicitAuth
	});
	const config = opts.config ?? (canSkipConfigLoad ? {} : explicitConnection ? await loadGatewayConfigForExplicitConnection() : await loadGatewayConfig());
	return {
		config,
		configPath: opts.configPath ?? resolveGatewayConfigPath(process.env),
		isRemoteMode: opts.localPortOverride === void 0 && config.gateway?.mode === "remote",
		explicitAuth
	};
}
/** Whether the caller selected the configured local Gateway without a URL override. */
async function isImplicitLocalGatewayTarget(opts) {
	if (resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).url) return false;
	const config = opts.config ?? await loadGatewayConfig();
	return opts.localPortOverride !== void 0 || config.gateway?.mode !== "remote";
}
function ensureRemoteModeUrlConfigured(params) {
	if (!params.context.isRemoteMode || params.urlOverrideSource || trimToUndefined(params.context.config.gateway?.remote?.url)) return;
	throw new Error([
		"gateway remote mode misconfigured: gateway.remote.url missing",
		`Config: ${params.context.configPath}`,
		"Fix: set gateway.remote.url, or set gateway.mode=local."
	].join("\n"));
}
/** Wrap raw socket-level connect failures (ECONNREFUSED etc.) into one actionable message. */
function createGatewayUnreachableTransportError(params) {
	const code = extractErrorCodeOrErrno(params.cause);
	return new GatewayTransportError({
		kind: "closed",
		reason: firstGatewayErrorLine(params.cause.message),
		connectionDetails: params.connectionDetails,
		message: [
			`Gateway not reachable at ${projectGatewayUrlForDiagnostics(params.connectionDetails.url)}${code ? ` (${code})` : ""}.`,
			"Start it with `openclaw gateway run` or check `openclaw gateway status`.",
			params.connectionDetails.message
		].join("\n")
	});
}
function createGatewayRequestAbortError(method) {
	return createAbortError(`gateway request aborted for ${method}`);
}
function isRequiredAgentRuntimeIdentityConnectError(err) {
	return err.message.includes("gateway rejected required agent runtime identity auth field; refusing to retry without it");
}
function isAllowlistedGatewayConnectRequestError(err) {
	if (err.name !== "GatewayClientRequestError") return false;
	return readConnectErrorDetailCode(err.details) === ConnectErrorDetailCodes.AUTH_RATE_LIMITED;
}
async function executeGatewayRequestWithScopes(params) {
	const { opts, scopes, url, token, password, edgeAuthHeaders, tlsFingerprint, timeoutMs, startupTimeoutMs, safeTimerTimeoutMs, deviceIdentity, deviceAuthScope, sshTunnel, storedAuth, surfaceGatewayClientRequestErrors } = params;
	return await new Promise((resolve, reject) => {
		if (opts.signal?.aborted) {
			reject(createGatewayRequestAbortError(opts.method));
			return;
		}
		let settled = false;
		let timer;
		const startAbort = new AbortController();
		let primaryRequestStarted = false;
		let suppressedPreHelloCleanCloses = 0;
		let connectionGeneration = 0;
		const cleanup = () => {
			startAbort.abort();
			opts.signal?.removeEventListener("abort", abortHandler);
			if (timer) clearTimeout(timer);
		};
		const stopClientThenSettle = (err, value) => {
			const complete = () => {
				if (err) reject(err);
				else resolve(value);
			};
			stopGatewayClient(client).finally(complete);
		};
		const stop = (err, value) => {
			if (settled) return;
			settled = true;
			cleanup();
			stopClientThenSettle(err, value);
		};
		const abortHandler = () => {
			if (settled) return;
			settled = true;
			cleanup();
			const err = createGatewayRequestAbortError(opts.method);
			const stopAfterAbortHook = () => stopClientThenSettle(err);
			if (!opts.onSignalAbort || !primaryRequestStarted) {
				stopAfterAbortHook();
				return;
			}
			const request = client.request.bind(client);
			Promise.resolve().then(() => opts.onSignalAbort?.(request)).catch(() => {}).finally(stopAfterAbortHook);
		};
		opts.signal?.addEventListener("abort", abortHandler, { once: true });
		const client = new GatewayClient({
			url,
			sshTunnel,
			token,
			password,
			edgeAuthHeaders,
			tlsFingerprint,
			preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
			instanceId: opts.instanceId ?? randomUUID(),
			clientName: opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
			clientDisplayName: resolveGatewayClientDisplayName(opts),
			clientVersion: opts.clientVersion ?? VERSION,
			caps: ["ultrafast", ...opts.caps ?? []],
			platform: opts.platform,
			mode: opts.mode ?? GATEWAY_CLIENT_MODES.CLI,
			...opts.approvalRuntimeToken ? { approvalRuntimeToken: opts.approvalRuntimeToken } : {},
			...opts.agentRuntimeIdentityToken ? { agentRuntimeIdentityToken: opts.agentRuntimeIdentityToken } : {},
			role: "operator",
			...Array.isArray(scopes) ? { scopes } : {},
			deviceIdentity,
			...deviceAuthScope ? { deviceAuthScope } : {},
			...storedAuth ? { preparedDeviceAuth: storedAuth } : {},
			...opts.sharedStateMode ? { sharedStateMode: opts.sharedStateMode } : {},
			minProtocol: opts.minProtocol ?? 4,
			maxProtocol: opts.maxProtocol ?? 4,
			onHelloOk: (hello) => {
				const dispatchGeneration = ++connectionGeneration;
				if (timeoutMs === null && timer) {
					clearTimeout(timer);
					timer = void 0;
				}
				try {
					opts.onHelloOk?.(hello);
				} catch {}
				if (settled) return;
				(async () => {
					try {
						ensureGatewaySupportsRequiredFeatures({
							kind: "method",
							required: Array.isArray(opts.requiredMethods) ? opts.requiredMethods : [],
							supported: Array.isArray(hello.features?.methods) ? hello.features.methods : [],
							attemptedMethod: opts.method
						});
						ensureGatewaySupportsRequiredFeatures({
							kind: "capability",
							required: opts.requiredCapabilities,
							supported: hello.features?.capabilities,
							attemptedMethod: opts.method
						});
						if (opts.prepareDispatchCurrent) await opts.prepareDispatchCurrent();
						if (settled || opts.signal?.aborted || dispatchGeneration !== connectionGeneration) return;
						opts.assertDispatchCurrent?.();
						primaryRequestStarted = true;
						const result = await client.request(opts.method, opts.params, {
							expectFinal: opts.expectFinal,
							timeoutMs: opts.timeoutMs,
							signal: opts.signal,
							onAccepted: opts.onAccepted
						});
						stop(void 0, result);
					} catch (err) {
						if (settled || dispatchGeneration !== connectionGeneration) return;
						stop(err);
					}
				})();
			},
			onClose: (code, reason, info) => {
				connectionGeneration += 1;
				if (settled) return;
				if (info?.connectError) {
					stop(isGatewayUnreachableSocketError(info.connectError) ? createGatewayUnreachableTransportError({
						cause: info.connectError,
						connectionDetails: params.connectionDetails
					}) : info.connectError);
					return;
				}
				if (!primaryRequestStarted && info?.transientPreHelloCleanClose === true && suppressedPreHelloCleanCloses < 1) {
					suppressedPreHelloCleanCloses += 1;
					return;
				}
				stop(createGatewayCloseTransportError({
					code,
					reason,
					connectionDetails: params.connectionDetails,
					requestDispatched: primaryRequestStarted
				}));
			},
			onConnectError: (err) => {
				const gatewayClientRequestError = err.name === "GatewayClientRequestError";
				const isAgentRuntimeIdentityConnectError = Boolean(opts.agentRuntimeIdentityToken) && isRequiredAgentRuntimeIdentityConnectError(err);
				const shouldSurface = isGatewayConnectAssemblyError(err) || isAgentRuntimeIdentityConnectError || isAllowlistedGatewayConnectRequestError(err) || surfaceGatewayClientRequestErrors && gatewayClientRequestError;
				if (settled || !shouldSurface) return;
				stop(err);
			}
		});
		const wrapperTimeoutMs = timeoutMs ?? startupTimeoutMs;
		timer = setTimeout(() => {
			stop(createGatewayTimeoutTransportError({
				timeoutMs: wrapperTimeoutMs,
				connectionDetails: params.connectionDetails,
				requestDispatched: primaryRequestStarted
			}));
		}, safeTimerTimeoutMs);
		startGatewayClientWhenEventLoopReady(client, {
			timeoutMs: safeTimerTimeoutMs,
			signal: startAbort.signal
		}).then((readiness) => {
			if (settled || readiness.ready || readiness.aborted) return;
			stop(createGatewayTimeoutTransportError({
				timeoutMs: startupTimeoutMs,
				connectionDetails: params.connectionDetails,
				requestDispatched: false
			}));
		}).catch((err) => {
			if (settled) return;
			stop(err instanceof Error ? err : new Error(String(err)));
		});
	});
}
async function callGatewayWithScopes(opts, scopes, localCliAbort = false) {
	const context = await resolveGatewayCallContext(opts);
	const { timeoutMs, startupTimeoutMs, safeTimerTimeoutMs } = resolveGatewayCallTimeout(opts.timeoutMs);
	const urlOverrideSource = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).source;
	if (opts.requireLocalBackendSharedAuth && (urlOverrideSource || context.isRemoteMode)) throw new GatewayLocalBackendSharedAuthUnavailableError("local backend shared auth is limited to the configured local gateway");
	const requestedStoredDeviceAuth = opts.useStoredDeviceAuth === true;
	const hasExplicitAuth = Boolean(context.explicitAuth.token || context.explicitAuth.password);
	const useStoredDeviceAuth = requestedStoredDeviceAuth && !hasExplicitAuth;
	const bootstrap = await resolveGatewayClientBootstrap({
		config: context.config,
		gatewayUrl: opts.url,
		explicitAuth: context.explicitAuth,
		env: process.env,
		configPath: context.configPath,
		ignoreEnvUrlOverride: opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true || opts.serviceTargetUrl !== void 0,
		localPortOverride: opts.localPortOverride,
		explicitTlsFingerprint: opts.tlsFingerprint,
		skipImplicitAuth: useStoredDeviceAuth || opts.skipImplicitAuth === true,
		...useStoredDeviceAuth ? {} : { overrideAuthErrorHint: "Fix: pass --token or --password with --url (or gatewayToken in tools)." },
		buildConnectionDetails: buildGatewayConnectionDetails,
		...opts.serviceTargetUrl ? { serviceTargetUrl: opts.serviceTargetUrl } : {}
	});
	ensureRemoteModeUrlConfigured({
		context,
		urlOverrideSource: bootstrap.urlOverrideSource
	});
	const connectionDetails = bootstrap.connectionDetails;
	const url = bootstrap.url;
	if (opts.expectUrl !== void 0 && url !== opts.expectUrl) throw new Error("Gateway destination changed. Refresh the selected Gateway before retrying.");
	const deviceAuthScope = bootstrap.deviceAuthScope;
	const token = useStoredDeviceAuth ? void 0 : bootstrap.auth.token;
	const password = useStoredDeviceAuth ? void 0 : bootstrap.auth.password;
	const { clientOptions, omitDeviceIdentity, deviceIdentity } = resolveGatewayCallDeviceAuth({
		opts,
		url,
		authMode: resolveGatewayCallAuth(context.config).mode,
		isImplicitLocalTarget: !urlOverrideSource && !context.isRemoteMode,
		token,
		password
	});
	const connectionOpts = {
		...opts,
		...clientOptions
	};
	let storedAuth = connectionOpts.preparedDeviceAuth;
	if (useStoredDeviceAuth) {
		storedAuth ??= await loadStoredOperatorDeviceAuthToken(deviceIdentity, deviceAuthScope, connectionOpts.sharedStateMode);
		if (!storedAuth?.token && deviceAuthScope) throw new GatewayStoredDeviceAuthUnavailableError(["No stored device auth for this gateway origin.", `Run \`openclaw tui${bootstrap.sshTunnel ? "" : ` --url ${projectGatewayUrlForDiagnostics(url)}`}\` to send a pairing request, approve it in that gateway's Control UI (Settings -> Devices) or run \`openclaw devices approve --latest\` on the gateway host, then retry.`].join("\n"));
	}
	const tlsFingerprint = bootstrap.tlsFingerprint;
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: context.config,
		targetUrl: url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config: context.config,
		value: edgeAuthConfig,
		targetUrl: url,
		env: process.env
	});
	if (useStoredDeviceAuth) {
		if (!storedAuth?.token) throw new GatewayCredentialsRequiredError({
			method: connectionOpts.method,
			configPath: context.configPath
		});
		if (Array.isArray(connectionOpts.requiredStoredDeviceAuthScopes) && !roleScopesAllow({
			role: "operator",
			requestedScopes: connectionOpts.requiredStoredDeviceAuthScopes,
			allowedScopes: storedAuth.scopes
		})) throw new GatewayStoredDeviceAuthUnavailableError("stored device auth does not grant the required operator scopes");
	}
	await ensureGatewayCallCanAuthenticate({
		opts: connectionOpts,
		context,
		token,
		password,
		deviceIdentity,
		deviceAuthScope,
		storedAuth
	});
	try {
		await prepareGatewayClientDeviceAuth({
			url,
			token,
			password,
			edgeAuthHeaders,
			tlsFingerprint,
			deviceIdentity,
			deviceAuthScope,
			sharedStateMode: connectionOpts.sharedStateMode,
			preparedDeviceAuth: storedAuth ?? void 0,
			approvalRuntimeToken: connectionOpts.approvalRuntimeToken,
			agentRuntimeIdentityToken: connectionOpts.agentRuntimeIdentityToken
		}, connectionOpts.signal);
	} catch (error) {
		if (connectionOpts.signal?.aborted) throw createGatewayRequestAbortError(connectionOpts.method);
		throw error;
	}
	return await executeGatewayRequestWithScopes({
		opts: connectionOpts,
		scopes: requestedStoredDeviceAuth && hasExplicitAuth && connectionOpts.requiredStoredDeviceAuthScopes ? connectionOpts.requiredStoredDeviceAuthScopes : useStoredDeviceAuth ? void 0 : localCliAbort && omitDeviceIdentity && !deviceIdentity ? [ADMIN_SCOPE] : scopes,
		url,
		token,
		password,
		edgeAuthHeaders,
		tlsFingerprint,
		timeoutMs,
		startupTimeoutMs,
		safeTimerTimeoutMs,
		connectionDetails,
		deviceIdentity,
		deviceAuthScope,
		sshTunnel: bootstrap.sshTunnel,
		...storedAuth ? { storedAuth } : {},
		surfaceGatewayClientRequestErrors: useStoredDeviceAuth || connectionOpts.requireLocalBackendSharedAuth === true || Boolean(connectionOpts.agentRuntimeIdentityToken)
	});
}
async function buildGatewayProbeConnectionDetails(opts = {}) {
	const context = await resolveGatewayCallContext({
		...opts,
		method: "status"
	});
	const bootstrap = await resolveGatewayClientBootstrap({
		config: context.config,
		gatewayUrl: opts.url,
		explicitAuth: context.explicitAuth,
		env: process.env,
		configPath: context.configPath,
		ignoreEnvUrlOverride: opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true || opts.serviceTargetUrl !== void 0,
		localPortOverride: opts.localPortOverride,
		explicitTlsFingerprint: opts.tlsFingerprint,
		skipImplicitAuth: true,
		buildConnectionDetails: buildGatewayConnectionDetails,
		...opts.serviceTargetUrl ? { serviceTargetUrl: opts.serviceTargetUrl } : {}
	});
	ensureRemoteModeUrlConfigured({
		context,
		urlOverrideSource: bootstrap.urlOverrideSource
	});
	return {
		...bootstrap.connectionDetails,
		...bootstrap.tlsFingerprint ? { tlsFingerprint: bootstrap.tlsFingerprint } : {}
	};
}
function shouldEscalateSessionCreateCwdScope(params) {
	if (params.opts.method !== "sessions.create" || !isRecord(params.opts.params) || !normalizeOptionalString(params.opts.params.cwd) || params.scopes.length !== 1 || params.scopes[0] !== "operator.write") return false;
	const errorRecord = isRecord(params.error) ? params.error : void 0;
	const missingScope = readMissingScopeErrorDetails(errorRecord?.details);
	return missingScope?.missingScope === "operator.admin" && missingScope.requiredScopes.includes("operator.admin");
}
async function callGatewayWithScopeEscalation(opts, scopes) {
	try {
		return await callGatewayWithScopes(opts, scopes);
	} catch (error) {
		if (!shouldEscalateSessionCreateCwdScope({
			opts,
			scopes,
			error
		})) throw error;
		return await callGatewayWithScopes(opts, [ADMIN_SCOPE]);
	}
}
async function callGatewayCli(opts) {
	assertGatewayCliMessageContext(opts.method, opts.params);
	if (Array.isArray(opts.scopes)) return await callGatewayWithScopes(opts, opts.scopes);
	const scopes = isGatewayMethodClassified(opts.method) ? resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params) : CLI_DEFAULT_OPERATOR_SCOPES;
	if (opts.method === "chat.abort" || opts.method === "sessions.abort") return await callGatewayWithScopes(opts, scopes, true);
	return await callGatewayWithScopeEscalation(opts, scopes);
}
async function callGatewayLeastPrivilege(opts) {
	return await callGatewayWithScopeEscalation(opts, resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params));
}
async function callGateway(opts) {
	const callerMode = opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND;
	const callerName = opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT;
	if (callerMode === GATEWAY_CLIENT_MODES.CLI || callerName === GATEWAY_CLIENT_NAMES.CLI) return await callGatewayCli(opts);
	if (Array.isArray(opts.scopes)) return await callGatewayWithScopes({
		...opts,
		mode: callerMode,
		clientName: callerName
	}, opts.scopes);
	return await callGatewayLeastPrivilege({
		...opts,
		mode: callerMode,
		clientName: callerName
	});
}
function randomIdempotencyKey() {
	return randomUUID();
}
//#endregion
export { GatewayStoredDeviceAuthUnavailableError as _, callGatewayLeastPrivilege as a, formatGatewayTransportErrorJson as c, isGatewayExplicitAuthRequiredError as d, isImplicitLocalGatewayTarget as f, GatewayLocalBackendSharedAuthUnavailableError as g, GatewayCredentialsRequiredError as h, callGatewayCli as i, isGatewayClientRequestError as l, assertGatewayCliMessageContext as m, buildGatewayProbeConnectionDetails as n, formatGatewayAuthErrorJson as o, randomIdempotencyKey as p, callGateway as r, formatGatewayClientRequestErrorJson as s, buildGatewayConnectionDetails as t, isGatewayCredentialsRequiredError as u, resolveDeviceIdentityForGatewayCall as v, resolveReadOnlyLocalGatewayAuth as y };
