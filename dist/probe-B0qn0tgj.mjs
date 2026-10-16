import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-Th9Axx4o.mjs";
import { a as READ_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { s as readMissingScopeError } from "./gateway-error-details-DIefe7Zy.mjs";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-q_NaMExM.mjs";
import { a as loadDeviceAuthTokenReadOnly, c as loadOriginDeviceTokenReadOnly } from "./device-auth-store-BEiXAvyd.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-kkd804Uc.mjs";
import { t as gatewayOriginScope } from "./gateway-origin-scope-D4zHFrov.mjs";
import { i as resolveGatewayDeviceAuthRoute } from "./connection-details-BcuL3xPn.mjs";
import { t as GatewayClient } from "./client-CrrkVIh8.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { n as normalizeEdgeAuthHeadersConfig, r as resolveEdgeAuthHeaders, t as gatewayEdgeAuthValueForTarget } from "./edge-auth-CCWpK-_0.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/probe.ts
const MIN_PROBE_TIMEOUT_MS = 250;
const OPERATOR_READ_SCOPE = "operator.read";
const OPERATOR_WRITE_SCOPE = "operator.write";
const OPERATOR_ADMIN_SCOPE = "operator.admin";
const DEVICE_IDENTITY_REQUIRED_CLOSE_CODE = 1008;
const DEVICE_IDENTITY_REQUIRED_CLOSE_REASON = "device identity required";
const DEVICE_REQUIRED_PROBE_FAILURE_THRESHOLD = 3;
const DEVICE_REQUIRED_PROBE_TTL_MS = 3e5;
const PROBE_CLIENT_STOP_TIMEOUT_MS = 1e3;
const DEVICE_REQUIRED_PROBE_CACHE_LIMIT = 500;
const deviceRequiredProbeCache = /* @__PURE__ */ new Map();
function clampProbeTimeoutMs(timeoutMs) {
	return resolveSafeTimeoutDelayMs(timeoutMs, { minMs: MIN_PROBE_TIMEOUT_MS });
}
function formatProbeCloseError(close) {
	return `gateway closed (${close.code}): ${close.reason}`;
}
function resolveDeviceRequiredProbeCacheKey(url) {
	try {
		return new URL(url).href;
	} catch {
		return url;
	}
}
function isDeviceIdentityRequiredClose(close) {
	return close?.code === DEVICE_IDENTITY_REQUIRED_CLOSE_CODE && close.reason.trim().toLowerCase() === DEVICE_IDENTITY_REQUIRED_CLOSE_REASON;
}
function hasProbeAuth(auth) {
	return Boolean(auth?.token?.trim() || auth?.password?.trim());
}
function shouldShortCircuitDeviceRequiredProbe(cacheKey, nowMs) {
	const entry = deviceRequiredProbeCache.get(cacheKey);
	if (!entry) return false;
	if (nowMs - entry.firstFailureAtMs >= DEVICE_REQUIRED_PROBE_TTL_MS) {
		deviceRequiredProbeCache.delete(cacheKey);
		return false;
	}
	return entry.failures >= DEVICE_REQUIRED_PROBE_FAILURE_THRESHOLD;
}
function noteDeviceRequiredProbeFailure(cacheKey, nowMs) {
	const existing = deviceRequiredProbeCache.get(cacheKey);
	if (!existing || nowMs - existing.firstFailureAtMs >= DEVICE_REQUIRED_PROBE_TTL_MS) {
		deviceRequiredProbeCache.set(cacheKey, {
			failures: 1,
			firstFailureAtMs: nowMs
		});
		pruneMapToMaxSize(deviceRequiredProbeCache, DEVICE_REQUIRED_PROBE_CACHE_LIMIT);
		return;
	}
	existing.failures += 1;
}
function getDeviceRequiredProbeCacheSizeForTest() {
	return deviceRequiredProbeCache.size;
}
function emptyProbeAuth() {
	return {
		role: null,
		scopes: [],
		capability: "unknown"
	};
}
function emptyProbeServer() {
	return {
		version: null,
		connId: null
	};
}
function makeDeviceRequiredShortCircuitResult(url) {
	const close = {
		code: DEVICE_IDENTITY_REQUIRED_CLOSE_CODE,
		reason: DEVICE_IDENTITY_REQUIRED_CLOSE_REASON,
		hint: "probe short-circuited by recent device-required rejections"
	};
	return {
		ok: false,
		url,
		connectLatencyMs: null,
		error: formatProbeCloseError(close),
		close,
		auth: emptyProbeAuth(),
		server: emptyProbeServer(),
		health: null,
		status: null,
		presence: null,
		configSnapshot: null
	};
}
function resolveProbeAuthSummary(params) {
	const scopes = Array.isArray(params.scopes) ? params.scopes : [];
	let capability = "unknown";
	if (classifyGatewayConnectFailure({
		details: params.connectErrorDetails,
		reason: params.close?.reason,
		message: params.error
	}).kind === "pairing-required") capability = "pairing_pending";
	else if (scopes.includes(OPERATOR_ADMIN_SCOPE)) capability = "admin_capable";
	else if (scopes.includes(OPERATOR_WRITE_SCOPE)) capability = "write_capable";
	else if (scopes.includes(OPERATOR_READ_SCOPE) || params.verifiedRead === true) capability = "read_only";
	else if (params.connectLatencyMs != null && params.authMetadataPresent === true) capability = "connected_no_operator_scope";
	return {
		role: params.role ?? null,
		scopes,
		capability
	};
}
async function probeGateway(opts) {
	const startedAt = Date.now();
	const instanceId = randomUUID();
	let connectLatencyMs = null;
	let connectError = null;
	let connectErrorDetails = null;
	let gatewayReached = false;
	let close = null;
	let auth = emptyProbeAuth();
	let server = emptyProbeServer();
	let authMetadataPresent = false;
	const detailLevel = opts.includeDetails === false ? "none" : opts.detailLevel ?? "full";
	const tlsFingerprint = opts.tlsFingerprint || (opts.url.trim() === opts.config?.gateway?.remote?.url?.trim() ? opts.config?.gateway?.remote?.tlsFingerprint : void 0);
	const remote = Boolean(opts.originScopedDeviceAuth || opts.sshTunnel);
	const route = resolveGatewayDeviceAuthRoute({
		config: opts.config ?? {},
		url: opts.url,
		remote,
		configuredRemote: opts.configuredRemote,
		tlsFingerprint,
		sshRoute: opts.sshTunnel
	});
	let deviceAuthScope = opts.suppressStoredDeviceAuth && !route.sshTunnel ? void 0 : route.deviceAuthScope ?? gatewayOriginScope(opts.url);
	let preparedDeviceAuth;
	const deviceIdentity = await (async () => {
		try {
			if (opts.suppressStoredDeviceAuth || !deviceAuthScope || !URL.canParse(opts.url)) return null;
			const loopback = isLoopbackHost(new URL(opts.url).hostname);
			if (remote && loopback && !route.bound && !hasProbeAuth(opts.auth)) return null;
			const identityModule = await import("./device-identity-BzQH6fpe.mjs");
			const identity = identityModule.loadDeviceIdentityIfPresent({ env: opts.env });
			if (!identity) return null;
			const lookup = {
				deviceId: identity.deviceId,
				role: "operator",
				env: opts.env
			};
			let cachedOperatorToken = !remote && loopback ? await loadDeviceAuthTokenReadOnly(lookup) : null;
			if (cachedOperatorToken) deviceAuthScope = void 0;
			else {
				cachedOperatorToken = await loadOriginDeviceTokenReadOnly({
					...lookup,
					gatewayScope: deviceAuthScope
				});
				if (cachedOperatorToken && !remote && loopback && !hasProbeAuth(opts.auth)) {
					const { loadPairedDevicePairingStoreRecordReadOnly } = await import("./device-pairing-store-readonly-sdLAWsex.mjs");
					const { verifyPairingToken } = await import("./pairing-token-pJ7MhJyq.mjs");
					const paired = await loadPairedDevicePairingStoreRecordReadOnly(identity.deviceId, resolveStateDir(opts.env));
					const issuedToken = paired?.tokens?.operator;
					if (paired?.publicKey !== identityModule.publicKeyRawBase64UrlFromPem(identity.publicKeyPem) || !issuedToken || issuedToken.revokedAtMs || !verifyPairingToken(cachedOperatorToken.token.trim(), issuedToken.token)) return null;
					preparedDeviceAuth = cachedOperatorToken;
				}
			}
			return cachedOperatorToken ? identity : null;
		} catch {
			return null;
		}
	})();
	const cacheKey = resolveDeviceRequiredProbeCacheKey(remote && route.bound && deviceAuthScope ? deviceAuthScope : opts.url);
	const cacheEligible = deviceIdentity == null && !hasProbeAuth(opts.auth);
	if (cacheEligible && shouldShortCircuitDeviceRequiredProbe(cacheKey, Date.now())) return makeDeviceRequiredShortCircuitResult(opts.url);
	const initialProbeTimeoutMs = clampProbeTimeoutMs(opts.timeoutMs);
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: opts.config ?? {},
		targetUrl: opts.url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config: opts.config ?? {},
		value: edgeAuthConfig,
		targetUrl: opts.url,
		env: opts.env ?? process.env
	});
	return await new Promise((resolve) => {
		let settled = false;
		let timer = null;
		let onAbort;
		const startAbort = new AbortController();
		const clearProbeTimer = () => {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		};
		const armProbeTimer = (onTimeout, timeoutMs = initialProbeTimeoutMs) => {
			clearProbeTimer();
			timer = setTimeout(onTimeout, resolveSafeTimeoutDelayMs(timeoutMs));
		};
		const settle = (result) => {
			if (settled) return;
			settled = true;
			if (onAbort) {
				opts.signal?.removeEventListener("abort", onAbort);
				onAbort = void 0;
			}
			startAbort.abort();
			clearProbeTimer();
			(async () => {
				try {
					await client.stopAndWait({ timeoutMs: PROBE_CLIENT_STOP_TIMEOUT_MS });
				} catch {
					client.stop();
				}
				if (result.ok) deviceRequiredProbeCache.delete(cacheKey);
				else if (cacheEligible && result.gatewayReached && isDeviceIdentityRequiredClose(result.close)) noteDeviceRequiredProbeFailure(cacheKey, Date.now());
				const { connectErrorDetails: resultConnectErrorDetails, ...rest } = result;
				resolve({
					url: opts.url,
					...rest,
					...resultConnectErrorDetails != null ? { connectErrorDetails: resultConnectErrorDetails } : {}
				});
			})();
		};
		const settleProbe = (params, details = {}) => {
			settle({
				ok: params.ok,
				...gatewayReached ? { gatewayReached: true } : {},
				connectLatencyMs,
				error: params.error,
				...params.missingScopeErrorDetails ? { missingScopeErrorDetails: params.missingScopeErrorDetails } : {},
				connectErrorDetails,
				close,
				auth: resolveProbeAuthSummary({
					role: auth.role,
					scopes: auth.scopes,
					authMetadataPresent,
					connectErrorDetails,
					error: params.error,
					close,
					verifiedRead: params.verifiedRead,
					connectLatencyMs
				}),
				server,
				health: null,
				status: null,
				presence: null,
				configSnapshot: null,
				...details
			});
		};
		const client = new GatewayClient({
			url: opts.url,
			sshTunnel: route.sshTunnel,
			preparedSshTunnel: opts.preparedSshTunnel,
			...deviceAuthScope ? { deviceAuthScope } : {},
			...preparedDeviceAuth ? { preparedDeviceAuth } : {},
			token: opts.auth?.token,
			password: opts.auth?.password,
			edgeAuthHeaders,
			tlsFingerprint,
			preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
			env: opts.env,
			scopes: [READ_SCOPE],
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			clientVersion: "dev",
			mode: GATEWAY_CLIENT_MODES.PROBE,
			sharedStateMode: "read-only",
			instanceId,
			deviceIdentity,
			onConnectError: (err) => {
				connectError = formatErrorMessage(err);
				connectErrorDetails = err instanceof GatewayClientRequestError ? err.details : null;
				gatewayReached ||= isGatewayProtocolResponseError(err);
			},
			onClose: (code, reason, info) => {
				close = {
					code,
					reason
				};
				gatewayReached ||= isGatewayProtocolResponseError(info?.connectError);
				if (connectLatencyMs == null) {
					if (info?.transportValidated === true) connectLatencyMs = Date.now() - startedAt;
					settleProbe({
						ok: false,
						error: connectError || formatProbeCloseError(close)
					});
				}
			},
			onHelloOk: (hello) => {
				gatewayReached = true;
				(async () => {
					connectLatencyMs = Date.now() - startedAt;
					authMetadataPresent = typeof hello?.auth === "object" && hello.auth !== null;
					server = {
						version: typeof hello?.server?.version === "string" ? hello.server.version : null,
						...typeof hello?.server?.buildId === "string" ? { buildId: hello.server.buildId } : {},
						connId: typeof hello?.server?.connId === "string" ? hello.server.connId : null
					};
					auth = resolveProbeAuthSummary({
						role: typeof hello?.auth?.role === "string" ? hello.auth.role : null,
						scopes: Array.isArray(hello?.auth?.scopes) ? hello.auth.scopes.filter((scope) => typeof scope === "string") : [],
						authMetadataPresent
					});
					if (detailLevel === "none") {
						settleProbe({
							ok: true,
							error: null,
							verifiedRead: false
						});
						return;
					}
					armProbeTimer(() => {
						settleProbe({
							ok: false,
							error: "timeout"
						});
					});
					try {
						let details;
						if (detailLevel === "presence") {
							const presence = await client.request("system-presence");
							details = { presence: Array.isArray(presence) ? presence : null };
						} else if (detailLevel === "config") details = { configSnapshot: await client.request("config.get", {}) };
						else {
							const [health, status, presence, configSnapshot] = await Promise.all([
								client.request("health"),
								client.request("status"),
								client.request("system-presence"),
								client.request("config.get", {})
							]);
							details = {
								health,
								status,
								presence: Array.isArray(presence) ? presence : null,
								configSnapshot
							};
						}
						settleProbe({
							ok: true,
							error: null,
							verifiedRead: true
						}, details);
					} catch (err) {
						const error = formatErrorMessage(err);
						const missingScopeErrorDetails = readMissingScopeError(err);
						settleProbe({
							ok: false,
							error,
							...missingScopeErrorDetails ? { missingScopeErrorDetails } : {}
						});
					}
				})();
			}
		});
		if (opts.signal) {
			onAbort = () => {
				settleProbe({
					ok: false,
					error: "aborted"
				});
			};
			opts.signal.addEventListener("abort", onAbort, { once: true });
			if (opts.signal.aborted) onAbort();
		}
		if (settled) return;
		armProbeTimer(() => {
			const error = connectError ? `connect failed: ${connectError}` : "timeout";
			settleProbe({
				ok: false,
				error
			});
		});
		startGatewayClientWhenEventLoopReady(client, {
			timeoutMs: initialProbeTimeoutMs,
			signal: startAbort.signal
		}).then((readiness) => {
			if (settled || readiness.ready || readiness.aborted) return;
			settleProbe({
				ok: false,
				error: "timeout"
			});
		}).catch((err) => {
			if (settled) return;
			connectError = formatErrorMessage(err);
			settleProbe({
				ok: false,
				error: connectError
			});
		});
	});
}
//#endregion
export { resolveProbeAuthSummary as i, getDeviceRequiredProbeCacheSizeForTest as n, probeGateway as r, clampProbeTimeoutMs as t };
