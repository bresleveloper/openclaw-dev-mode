import { o as __toESM } from "./chunk-CNf5ZN-e.js";
import { u as redactToolPayloadText } from "./redact-CQ2tlRRk.js";
import { o as isRecord$1 } from "./record-coerce-DHZ4bFlT.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { n as privateFileStoreSync } from "./private-file-store-BAvApZYp.js";
import { n as logError, t as logDebug } from "./logger-p_Dm5cGu.js";
import { v as require_ipaddr } from "./ip-0oQXo6_w.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-CcqJJIan.js";
import "./version-51ymduTn.js";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.js";
import { a as publicKeyRawBase64UrlFromPem, o as signDevicePayload, r as loadOrCreateDeviceIdentity } from "./device-identity-S-9fx48D.js";
import { t as normalizeFingerprint$1 } from "./fingerprint-BRiEKKMN.js";
import { o as resolveSafeTimeoutDelayMs, r as resolveConnectChallengeTimeoutMs } from "./timeouts-DdTImbzl.js";
import { f as readPairingConnectErrorDetails, l as readConnectErrorDetailCode, s as formatConnectErrorMessage, t as ConnectErrorDetailCodes, u as readConnectErrorRecoveryAdvice } from "./connect-error-details-BXqba0zp.js";
import { a as resolveGatewayStartupRetryAfterMs } from "./startup-unavailable-CRTM-3cy.js";
import { r as registerManagedProxyGatewayLoopbackBypass, t as ensureInheritedManagedProxyRoutingActive } from "./proxy-lifecycle-CinO33qT.js";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { WebSocket as WebSocket$1 } from "ws";
//#region src/shared/device-auth-store.ts
var import_ipaddr = /* @__PURE__ */ __toESM(require_ipaddr(), 1);
function coerceDeviceAuthEntry(role, value) {
	if (!isRecord$1(value) || typeof value.token !== "string") return null;
	const updatedAtMs = typeof value.updatedAtMs === "number" && Number.isFinite(value.updatedAtMs) ? value.updatedAtMs : 0;
	return {
		token: value.token,
		role,
		scopes: normalizeDeviceAuthScopes(Array.isArray(value.scopes) ? value.scopes : void 0),
		updatedAtMs
	};
}
function copyCanonicalDeviceAuthTokens(tokens) {
	const out = {};
	for (const [rawRole, value] of Object.entries(tokens)) {
		const role = normalizeDeviceAuthRole(rawRole);
		if (!role) continue;
		const entry = coerceDeviceAuthEntry(role, value);
		if (entry) out[role] = entry;
	}
	return out;
}
/** Coerces raw persisted device-auth JSON into the current canonical store shape. */
function coerceDeviceAuthStore(value) {
	if (!isRecord$1(value) || value.version !== 1 || typeof value.deviceId !== "string") return null;
	if (!isRecord$1(value.tokens)) return null;
	return {
		version: 1,
		deviceId: value.deviceId,
		tokens: copyCanonicalDeviceAuthTokens(value.tokens)
	};
}
/** Load one normalized role token, ignoring stores bound to a different gateway device id. */
function loadDeviceAuthTokenFromStore(params) {
	const store = params.adapter.readStore();
	if (!store || store.deviceId !== params.deviceId) return null;
	const role = normalizeDeviceAuthRole(params.role);
	return coerceDeviceAuthEntry(role, store.tokens[role]);
}
/** Store one role token while preserving canonical tokens for the same gateway device id. */
function storeDeviceAuthTokenInStore(params) {
	const role = normalizeDeviceAuthRole(params.role);
	const existing = params.adapter.readStore();
	const next = {
		version: 1,
		deviceId: params.deviceId,
		tokens: existing && existing.deviceId === params.deviceId && existing.tokens ? copyCanonicalDeviceAuthTokens(existing.tokens) : {}
	};
	const entry = {
		token: params.token,
		role,
		scopes: normalizeDeviceAuthScopes(params.scopes),
		updatedAtMs: Date.now()
	};
	next.tokens[role] = entry;
	params.adapter.writeStore(next);
	return entry;
}
/** Clear one normalized role token without rewriting missing or wrong-device stores. */
function clearDeviceAuthTokenFromStore(params) {
	const store = params.adapter.readStore();
	if (!store || store.deviceId !== params.deviceId) return;
	const role = normalizeDeviceAuthRole(params.role);
	if (!store.tokens[role]) return;
	const next = {
		version: 1,
		deviceId: store.deviceId,
		tokens: copyCanonicalDeviceAuthTokens(store.tokens)
	};
	delete next.tokens[role];
	params.adapter.writeStore(next);
}
//#endregion
//#region src/infra/device-auth-store.ts
const DEVICE_AUTH_FILE = "device-auth.json";
const storeReadCache = /* @__PURE__ */ new Map();
function storeCacheHit(cached, stat) {
	return cached !== void 0 && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size;
}
function resolveDeviceAuthPath(env = process.env) {
	return path.join(resolveStateDir(env), "identity", DEVICE_AUTH_FILE);
}
function readStore(filePath) {
	try {
		let stat = null;
		try {
			stat = fs.statSync(filePath);
		} catch {
			const cached = storeReadCache.get(filePath);
			if (cached?.mtimeMs === -1 && cached.size === -1) return cached.store;
			storeReadCache.set(filePath, {
				store: null,
				mtimeMs: -1,
				size: -1
			});
			return null;
		}
		const cached = storeReadCache.get(filePath);
		if (cached !== void 0 && storeCacheHit(cached, stat)) return cached.store;
		const store = coerceDeviceAuthStore(privateFileStoreSync(path.dirname(filePath)).readJsonIfExists(path.basename(filePath)));
		storeReadCache.set(filePath, {
			store,
			mtimeMs: stat.mtimeMs,
			size: stat.size
		});
		return store;
	} catch {
		return null;
	}
}
function writeStore(filePath, store) {
	privateFileStoreSync(path.dirname(filePath)).writeJson(path.basename(filePath), store, { trailingNewline: true });
	try {
		const stat = fs.statSync(filePath);
		storeReadCache.set(filePath, {
			store,
			mtimeMs: stat.mtimeMs,
			size: stat.size
		});
	} catch {
		storeReadCache.delete(filePath);
	}
}
/** Load a cached device-auth token from the configured OpenClaw state directory. */
function loadDeviceAuthToken(params) {
	const filePath = resolveDeviceAuthPath(params.env);
	return loadDeviceAuthTokenFromStore({
		adapter: {
			readStore: () => readStore(filePath),
			writeStore: (_store) => {}
		},
		deviceId: params.deviceId,
		role: params.role
	});
}
/** Persist or replace one device-auth role token in the private state directory. */
function storeDeviceAuthToken(params) {
	const filePath = resolveDeviceAuthPath(params.env);
	return storeDeviceAuthTokenInStore({
		adapter: {
			readStore: () => readStore(filePath),
			writeStore: (store) => writeStore(filePath, store)
		},
		deviceId: params.deviceId,
		role: params.role,
		token: params.token,
		scopes: params.scopes
	});
}
/** Remove one role token for the current gateway device from the private state directory. */
function clearDeviceAuthToken(params) {
	const filePath = resolveDeviceAuthPath(params.env);
	clearDeviceAuthTokenFromStore({
		adapter: {
			readStore: () => readStore(filePath),
			writeStore: (store) => writeStore(filePath, store)
		},
		deviceId: params.deviceId,
		role: params.role
	});
}
//#endregion
//#region packages/gateway-client/src/device-auth.ts
function normalizeDeviceMetadataForAuth(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	if (!trimmed) return "";
	return trimmed.replace(/[A-Z]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 32));
}
function buildDeviceAuthPayload(params) {
	const scopes = params.scopes.join(",");
	const token = params.token ?? "";
	return [
		"v2",
		params.deviceId,
		params.clientId,
		params.clientMode,
		params.role,
		scopes,
		String(params.signedAtMs),
		token,
		params.nonce
	].join("|");
}
function buildDeviceAuthPayloadV3(params) {
	const scopes = params.scopes.join(",");
	const token = params.token ?? "";
	const platform = normalizeDeviceMetadataForAuth(params.platform);
	const deviceFamily = normalizeDeviceMetadataForAuth(params.deviceFamily);
	return [
		"v3",
		params.deviceId,
		params.clientId,
		params.clientMode,
		params.role,
		scopes,
		String(params.signedAtMs),
		token,
		params.nonce,
		platform,
		deviceFamily
	].join("|");
}
//#endregion
//#region packages/gateway-client/src/client.ts
function normalizeOptionalString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
function isNonNegativeInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isGatewayClientErrorShape(value) {
	if (!isRecord(value)) return false;
	if (!isNonEmptyString(value.code) || !isNonEmptyString(value.message)) return false;
	if (value.retryable !== void 0 && typeof value.retryable !== "boolean") return false;
	if (value.retryAfterMs !== void 0 && !isNonNegativeInteger(value.retryAfterMs)) return false;
	return true;
}
function isGatewayEventFrame(value) {
	if (!isRecord(value) || value.type !== "event" || !isNonEmptyString(value.event)) return false;
	return value.seq === void 0 || isNonNegativeInteger(value.seq);
}
function isGatewayResponseFrame(value) {
	if (!isRecord(value) || value.type !== "res" || !isNonEmptyString(value.id) || typeof value.ok !== "boolean") return false;
	return value.error === void 0 || isGatewayClientErrorShape(value.error);
}
function validateClientRequestFrame(frame) {
	if (!isNonEmptyString(frame.id)) return "id must be a non-empty string";
	if (!isNonEmptyString(frame.method)) return "method must be a non-empty string";
	return null;
}
function normalizeLowercaseStringOrEmpty(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function rawDataToString(data) {
	if (typeof data === "string") return data;
	if (Buffer.isBuffer(data)) return data.toString("utf8");
	if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
	if (Array.isArray(data)) return Buffer.concat(data.map((entry) => Buffer.from(entry))).toString("utf8");
	return String(data);
}
function isSensitiveUrlQueryParamName(key) {
	return /(?:token|password|secret|key|auth|credential)/iu.test(key);
}
function normalizeFingerprint(fingerprint) {
	return (fingerprint ?? "").replaceAll(":", "").trim().toLowerCase();
}
function parseHostForAddressChecks(host) {
	if (!host) return null;
	const normalizedHost = host.toLowerCase().trim();
	const canonicalHost = normalizedHost.replace(/\.+$/, "");
	if (canonicalHost === "localhost") return {
		isLocalhost: true,
		unbracketedHost: canonicalHost
	};
	return {
		isLocalhost: false,
		unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
	};
}
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = new Set([
	"loopback",
	"private",
	"linkLocal",
	"carrierGradeNat"
]);
const PRIVATE_OR_LOOPBACK_IPV6_RANGES = new Set([
	"loopback",
	"linkLocal",
	"uniqueLocal",
	"deprecatedSiteLocal"
]);
function parseGatewayIpAddress(host) {
	const normalized = host.toLowerCase();
	if (import_ipaddr.default.IPv4.isValid(normalized) && !import_ipaddr.default.IPv4.isValidFourPartDecimal(normalized)) return null;
	if (!import_ipaddr.default.isValid(normalized)) return null;
	const parsed = import_ipaddr.default.parse(normalized);
	if (parsed.kind() === "ipv6") {
		const ipv6 = parsed;
		if (ipv6.isIPv4MappedAddress()) return ipv6.toIPv4Address();
	}
	return parsed;
}
function isPrivateOrLoopbackIpAddress(address) {
	return (address.kind() === "ipv4" ? PRIVATE_OR_LOOPBACK_IPV4_RANGES : PRIVATE_OR_LOOPBACK_IPV6_RANGES).has(address.range());
}
function isLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const address = parseGatewayIpAddress(parsed.unbracketedHost);
	if (!address) return false;
	return address.range() === "loopback";
}
function isPrivateOrLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const address = parseGatewayIpAddress(parsed.unbracketedHost);
	if (!address) return false;
	return isPrivateOrLoopbackIpAddress(address);
}
function isTrustedPlaintextWebSocketHost(hostname) {
	if (isPrivateOrLoopbackHost(hostname)) return true;
	const normalized = hostname.toLowerCase().trim().replace(/\.+$/, "");
	return normalized.endsWith(".local") || normalized.endsWith(".ts.net");
}
function isSecureWebSocketUrl(rawUrl, options) {
	try {
		const url = new URL(rawUrl);
		const protocol = url.protocol === "https:" ? "wss:" : url.protocol === "http:" ? "ws:" : url.protocol;
		if (protocol === "wss:") return true;
		if (protocol !== "ws:") return false;
		if (isLoopbackHost(url.hostname) || isTrustedPlaintextWebSocketHost(url.hostname)) return true;
		if (options?.allowPrivateWs === true) {
			const hostForIpCheck = url.hostname.startsWith("[") && url.hostname.endsWith("]") ? url.hostname.slice(1, -1) : url.hostname;
			return isPrivateOrLoopbackHost(url.hostname) || parseGatewayIpAddress(hostForIpCheck) === null;
		}
		return false;
	} catch {
		return false;
	}
}
const DEFAULT_GATEWAY_CLIENT_URL = "ws://127.0.0.1:18789";
const DEFAULT_CLIENT_VERSION = "0.0.0";
var GatewayClientRequestError$1 = class extends Error {
	constructor(error) {
		super(formatConnectErrorMessage({
			message: error.message,
			details: error.details
		}));
		this.name = "GatewayClientRequestError";
		this.gatewayCode = error.code ?? "UNAVAILABLE";
		this.details = error.details;
		this.retryable = error.retryable === true;
		this.retryAfterMs = error.retryAfterMs;
	}
};
var GatewayClientTransientPreHelloCloseError = class extends Error {
	constructor() {
		super("gateway transient pre-hello clean close");
		this.name = "GatewayClientTransientPreHelloCloseError";
	}
};
const GATEWAY_CONNECT_ASSEMBLY_ERROR = Symbol("gateway.connectAssemblyError");
function markGatewayConnectAssemblyError(error) {
	Object.defineProperty(error, GATEWAY_CONNECT_ASSEMBLY_ERROR, {
		configurable: true,
		value: true
	});
	return error;
}
function isGatewayConnectAssemblyError$1(value) {
	return value instanceof Error && value[GATEWAY_CONNECT_ASSEMBLY_ERROR] === true;
}
const GATEWAY_CLOSE_CODE_HINTS$1 = {
	1e3: "normal closure",
	1006: "abnormal closure (no close frame)",
	1008: "policy violation",
	1012: "service restart",
	1013: "try again later"
};
function describeGatewayCloseCode$1(code) {
	return GATEWAY_CLOSE_CODE_HINTS$1[code];
}
function readConnectChallengeTimeoutOverride(opts) {
	if (typeof opts.connectChallengeTimeoutMs === "number" && Number.isFinite(opts.connectChallengeTimeoutMs)) return opts.connectChallengeTimeoutMs;
	if (typeof opts.connectDelayMs === "number" && Number.isFinite(opts.connectDelayMs)) return opts.connectDelayMs;
}
function isGatewayClientStoppedError(err) {
	const message = err instanceof Error ? err.message : String(err);
	return message === "gateway client stopped" || message === "Error: gateway client stopped";
}
function formatGatewayClientErrorForLog(err) {
	return String(err).replace(/\/\/([^@/?#\s]+)@/g, "//***:***@").replace(/(Authorization:\s*Bearer\s+)[^\s]+/giu, "$1***").replace(/([?&])([^=&\s]+)=([^&#\s"'<>)]*)/g, (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match);
}
function resolveGatewayClientConnectChallengeTimeoutMs$1(opts) {
	return resolveConnectChallengeTimeoutMs(readConnectChallengeTimeoutOverride(opts), {
		env: opts.env,
		configuredTimeoutMs: opts.preauthHandshakeTimeoutMs
	});
}
const FORCE_STOP_TERMINATE_GRACE_MS = 250;
const STOP_AND_WAIT_TIMEOUT_MS = 1e3;
const MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES = 1;
var GatewayClient$1 = class {
	constructor(opts) {
		this.ws = null;
		this.pending = /* @__PURE__ */ new Map();
		this.backoffMs = 1e3;
		this.closed = false;
		this.lastSeq = null;
		this.connectNonce = null;
		this.connectSent = false;
		this.connectTimer = null;
		this.reconnectTimer = null;
		this.pendingDeviceTokenRetry = false;
		this.deviceTokenRetryBudgetUsed = false;
		this.approvalRuntimeTokenCompatibilityDisabled = false;
		this.approvalRuntimeTokenRetryBudgetUsed = false;
		this.pendingStartupReconnectDelayMs = null;
		this.pendingConnectErrorDetailCode = null;
		this.pendingConnectErrorDetails = null;
		this.lastTick = null;
		this.tickIntervalMs = 3e4;
		this.tickTimer = null;
		this.pendingStop = null;
		this.socketOpened = false;
		this.transportValidated = false;
		this.helloOkReceived = false;
		this.suppressedTransientPreHelloCleanCloses = 0;
		this.deps = {
			loadOrCreateDeviceIdentity: opts.hostDeps?.loadOrCreateDeviceIdentity ?? (() => void 0),
			signDevicePayload: opts.hostDeps?.signDevicePayload ?? (() => {
				throw new Error("GatewayClient device signature dependency is not configured");
			}),
			publicKeyRawBase64UrlFromPem: opts.hostDeps?.publicKeyRawBase64UrlFromPem ?? (() => {
				throw new Error("GatewayClient public key dependency is not configured");
			}),
			loadDeviceAuthToken: opts.hostDeps?.loadDeviceAuthToken ?? (() => null),
			storeDeviceAuthToken: opts.hostDeps?.storeDeviceAuthToken ?? (() => {}),
			clearDeviceAuthToken: opts.hostDeps?.clearDeviceAuthToken ?? (() => {}),
			beforeConnect: opts.hostDeps?.beforeConnect ?? (() => {}),
			registerGatewayLoopbackBypass: opts.hostDeps?.registerGatewayLoopbackBypass ?? (() => void 0),
			logDebug: opts.hostDeps?.logDebug ?? (() => {}),
			logError: opts.hostDeps?.logError ?? (() => {}),
			redactForLog: opts.hostDeps?.redactForLog ?? ((message) => message),
			normalizeTlsFingerprint: opts.hostDeps?.normalizeTlsFingerprint ?? normalizeFingerprint
		};
		this.opts = {
			...opts,
			deviceIdentity: opts.deviceIdentity === null ? void 0 : opts.deviceIdentity ?? this.deps.loadOrCreateDeviceIdentity()
		};
		this.requestTimeoutMs = typeof opts.requestTimeoutMs === "number" && Number.isFinite(opts.requestTimeoutMs) ? resolveSafeTimeoutDelayMs(opts.requestTimeoutMs, { minMs: 0 }) : 3e4;
	}
	start() {
		if (this.closed) return;
		this.clearReconnectTimer();
		this.clearConnectChallengeTimeout();
		this.connectNonce = null;
		this.connectSent = false;
		const url = this.opts.url ?? DEFAULT_GATEWAY_CLIENT_URL;
		if (this.opts.tlsFingerprint && !url.startsWith("wss://")) {
			this.notifyConnectError(/* @__PURE__ */ new Error("gateway tls fingerprint requires wss:// gateway url"));
			return;
		}
		const allowPrivateWs = (this.opts.env ?? process.env).OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
		if (!isSecureWebSocketUrl(url, { allowPrivateWs })) {
			let displayHost = url;
			try {
				displayHost = new URL(url).hostname || url;
			} catch {}
			const error = /* @__PURE__ */ new Error(`SECURITY ERROR: Cannot connect to "${displayHost}" over plaintext ws://. Both credentials and chat data would be exposed to network interception. Use wss:// for remote URLs. Safe defaults: keep gateway.bind=loopback and connect via SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host), or use Tailscale Serve/Funnel. ` + (allowPrivateWs ? "" : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1. ") + "Run `openclaw doctor --fix` for guidance.");
			this.notifyConnectError(error);
			return;
		}
		this.deps.beforeConnect();
		const wsOptions = { maxPayload: 25 * 1024 * 1024 };
		if (url.startsWith("wss://") && this.opts.tlsFingerprint) {
			wsOptions.rejectUnauthorized = false;
			wsOptions.checkServerIdentity = (_hostValue, cert) => {
				const fingerprintValue = typeof cert === "object" && cert && "fingerprint256" in cert ? cert.fingerprint256 ?? "" : "";
				const fingerprint = this.deps.normalizeTlsFingerprint(typeof fingerprintValue === "string" ? fingerprintValue : "");
				const expected = this.deps.normalizeTlsFingerprint(this.opts.tlsFingerprint ?? "");
				if (!expected) return;
				if (!fingerprint) return /* @__PURE__ */ new Error("Missing server TLS fingerprint");
				if (fingerprint !== expected) return /* @__PURE__ */ new Error("Server TLS fingerprint mismatch");
			};
		}
		let ws;
		const unregisterGatewayLoopbackBypass = this.deps.registerGatewayLoopbackBypass(url);
		try {
			ws = new WebSocket$1(url, wsOptions);
		} catch (error) {
			this.notifyConnectError(error instanceof Error ? error : new Error(String(error)));
			return;
		} finally {
			unregisterGatewayLoopbackBypass?.();
		}
		this.ws = ws;
		this.socketOpened = false;
		this.transportValidated = false;
		this.helloOkReceived = false;
		this.connectNonce = null;
		this.connectSent = false;
		this.clearConnectChallengeTimeout();
		ws.on("open", () => {
			this.socketOpened = true;
			if (url.startsWith("wss://") && this.opts.tlsFingerprint) {
				const tlsError = this.validateTlsFingerprint();
				if (tlsError) {
					this.notifyConnectError(tlsError);
					this.ws?.close(1008, tlsError.message);
					return;
				}
			}
			this.transportValidated = true;
			this.beginPreauthHandshake();
		});
		ws.on("message", (data) => this.handleMessage(rawDataToString(data)));
		ws.on("close", (code, reason) => {
			const reasonText = rawDataToString(reason);
			const closeInfo = {
				phase: this.helloOkReceived ? "post-hello" : "pre-hello",
				socketOpened: this.socketOpened,
				transportValidated: this.transportValidated,
				transientPreHelloCleanClose: !this.helloOkReceived && code === 1e3 && reasonText === ""
			};
			const connectErrorDetailCode = this.pendingConnectErrorDetailCode;
			const connectErrorDetails = this.pendingConnectErrorDetails;
			this.pendingConnectErrorDetailCode = null;
			this.pendingConnectErrorDetails = null;
			if (this.ws === ws) this.ws = null;
			this.socketOpened = false;
			this.transportValidated = false;
			this.resolvePendingStop(ws);
			if (this.pendingStartupReconnectDelayMs !== null) {
				this.scheduleReconnect();
				return;
			}
			if (closeInfo.transientPreHelloCleanClose && this.suppressedTransientPreHelloCleanCloses < MAX_SUPPRESSED_TRANSIENT_PRE_HELLO_CLEAN_CLOSES) {
				this.suppressedTransientPreHelloCleanCloses += 1;
				this.flushPendingErrors(new GatewayClientTransientPreHelloCloseError());
				this.scheduleReconnect();
				this.notifyClose(code, reasonText, closeInfo);
				return;
			}
			if (code === 1008 && normalizeLowercaseStringOrEmpty(reasonText).includes("device token mismatch") && !this.opts.token && !this.opts.password && this.opts.deviceIdentity) {
				const deviceId = this.opts.deviceIdentity.deviceId;
				const role = this.opts.role ?? "operator";
				try {
					this.deps.clearDeviceAuthToken({
						deviceId,
						role,
						env: this.opts.env
					});
					this.logDebug(`cleared stale device-auth token for device ${deviceId}`);
				} catch (err) {
					this.logDebug(`failed clearing stale device-auth token for device ${deviceId}: ${String(err)}`);
				}
			}
			this.flushPendingErrors(/* @__PURE__ */ new Error(`gateway closed (${code}): ${reasonText}`));
			if (this.shouldPauseReconnectAfterAuthFailure({
				detailCode: connectErrorDetailCode,
				details: connectErrorDetails
			})) {
				this.notifyReconnectPaused({
					code,
					reason: reasonText,
					detailCode: connectErrorDetailCode
				});
				this.notifyClose(code, reasonText, closeInfo);
				return;
			}
			this.scheduleReconnect();
			this.notifyClose(code, reasonText, closeInfo);
		});
		ws.on("error", (err) => {
			this.logDebug(`gateway client error: ${formatGatewayClientErrorForLog(err)}`);
			if (!this.connectSent) this.notifyConnectError(err instanceof Error ? err : new Error(String(err)));
		});
	}
	stop() {
		this.beginStop();
	}
	async stopAndWait(opts) {
		const stopPromise = this.beginStop();
		if (!stopPromise) return;
		const timeoutMs = opts?.timeoutMs === void 0 ? STOP_AND_WAIT_TIMEOUT_MS : resolveSafeTimeoutDelayMs(opts.timeoutMs);
		let timeout = null;
		try {
			await Promise.race([stopPromise, new Promise((_, reject) => {
				timeout = setTimeout(() => {
					reject(/* @__PURE__ */ new Error(`gateway client stop timed out after ${timeoutMs}ms`));
				}, timeoutMs);
				timeout.unref?.();
			})]);
		} finally {
			if (timeout) clearTimeout(timeout);
		}
	}
	beginStop() {
		this.closed = true;
		this.pendingDeviceTokenRetry = false;
		this.deviceTokenRetryBudgetUsed = false;
		this.pendingStartupReconnectDelayMs = null;
		this.pendingConnectErrorDetailCode = null;
		this.pendingConnectErrorDetails = null;
		this.clearReconnectTimer();
		if (this.tickTimer) {
			clearInterval(this.tickTimer);
			this.tickTimer = null;
		}
		this.clearConnectChallengeTimeout();
		if (this.pendingStop) {
			this.flushPendingErrors(/* @__PURE__ */ new Error("gateway client stopped"));
			return this.pendingStop.promise;
		}
		const ws = this.ws;
		this.ws = null;
		if (ws) {
			const pendingStop = this.createPendingStop(ws);
			const forceTerminateTimer = setTimeout(() => {
				try {
					ws.terminate();
				} catch {}
				this.resolvePendingStop(ws);
			}, FORCE_STOP_TERMINATE_GRACE_MS);
			forceTerminateTimer.unref?.();
			pendingStop.terminateTimer = forceTerminateTimer;
			ws.close();
			this.flushPendingErrors(/* @__PURE__ */ new Error("gateway client stopped"));
			return pendingStop.promise;
		}
		this.flushPendingErrors(/* @__PURE__ */ new Error("gateway client stopped"));
		return null;
	}
	createPendingStop(ws) {
		if (this.pendingStop?.ws === ws) return this.pendingStop;
		let resolve;
		const promise = new Promise((res) => {
			resolve = res;
		});
		this.pendingStop = {
			ws,
			promise,
			resolve
		};
		return this.pendingStop;
	}
	resolvePendingStop(ws) {
		if (this.pendingStop?.ws !== ws) return;
		const { resolve, terminateTimer } = this.pendingStop;
		if (terminateTimer) clearTimeout(terminateTimer);
		this.pendingStop = null;
		resolve();
	}
	logDebug(message) {
		this.deps.logDebug(this.deps.redactForLog(message));
	}
	logError(message) {
		this.deps.logError(this.deps.redactForLog(message));
	}
	sendConnect() {
		if (this.connectSent) return;
		const nonce = normalizeOptionalString(this.connectNonce) ?? "";
		if (!nonce) {
			this.notifyConnectError(/* @__PURE__ */ new Error("gateway connect challenge missing nonce"));
			this.ws?.close(1008, "connect challenge missing nonce");
			return;
		}
		const role = this.opts.role ?? "operator";
		let assembled;
		try {
			assembled = this.assembleConnectParams({
				role,
				nonce
			});
		} catch (err) {
			this.handleConnectFailure(err);
			return;
		}
		this.connectSent = true;
		this.clearConnectChallengeTimeout();
		this.request("connect", assembled.params).then((helloOk) => {
			this.helloOkReceived = true;
			this.pendingDeviceTokenRetry = false;
			this.deviceTokenRetryBudgetUsed = false;
			this.pendingStartupReconnectDelayMs = null;
			this.pendingConnectErrorDetailCode = null;
			this.pendingConnectErrorDetails = null;
			this.suppressedTransientPreHelloCleanCloses = 0;
			const authInfo = helloOk?.auth;
			if (authInfo?.deviceToken && this.opts.deviceIdentity) this.deps.storeDeviceAuthToken({
				deviceId: this.opts.deviceIdentity.deviceId,
				role: authInfo.role ?? role,
				token: authInfo.deviceToken,
				scopes: authInfo.scopes ?? [],
				env: this.opts.env
			});
			this.backoffMs = 1e3;
			this.tickIntervalMs = typeof helloOk.policy?.tickIntervalMs === "number" ? helloOk.policy.tickIntervalMs : 3e4;
			this.lastTick = Date.now();
			this.startTickWatch();
			this.notifyHelloOk(helloOk);
		}).catch((err) => {
			if (err instanceof GatewayClientTransientPreHelloCloseError) return;
			this.pendingConnectErrorDetailCode = err instanceof GatewayClientRequestError$1 ? readConnectErrorDetailCode(err.details) : null;
			this.pendingConnectErrorDetails = err instanceof GatewayClientRequestError$1 ? err.details : null;
			const shouldRetryWithDeviceToken = this.shouldRetryWithStoredDeviceToken({
				error: err,
				explicitGatewayToken: normalizeOptionalString(this.opts.token),
				resolvedDeviceToken: assembled.resolvedDeviceToken,
				storedToken: assembled.storedToken
			});
			if (this.opts.deviceIdentity && assembled.usingStoredDeviceToken && err instanceof GatewayClientRequestError$1 && readConnectErrorDetailCode(err.details) === ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH) {
				const deviceId = this.opts.deviceIdentity.deviceId;
				try {
					this.deps.clearDeviceAuthToken({
						deviceId,
						role,
						env: this.opts.env
					});
					this.logDebug(`cleared stale device-auth token for device ${deviceId}`);
				} catch (clearErr) {
					this.logDebug(`failed clearing stale device-auth token for device ${deviceId}: ${String(clearErr)}`);
				}
			}
			if (shouldRetryWithDeviceToken) {
				this.pendingDeviceTokenRetry = true;
				this.deviceTokenRetryBudgetUsed = true;
				this.backoffMs = Math.min(this.backoffMs, 250);
			}
			const startupRetryAfterMs = resolveGatewayStartupRetryAfterMs(err);
			if (startupRetryAfterMs !== null) {
				this.pendingStartupReconnectDelayMs = startupRetryAfterMs;
				this.logDebug(`gateway connect failed: ${formatGatewayClientErrorForLog(err)}`);
				this.ws?.close(1013, "gateway starting");
				return;
			}
			if (this.shouldRetryWithoutApprovalRuntimeToken({
				error: err,
				authApprovalRuntimeToken: assembled.authApprovalRuntimeToken
			})) {
				this.approvalRuntimeTokenCompatibilityDisabled = true;
				this.approvalRuntimeTokenRetryBudgetUsed = true;
				this.backoffMs = Math.min(this.backoffMs, 250);
				this.logDebug("gateway rejected approval runtime auth field; retrying without it");
				this.ws?.close(1008, "connect retry");
				return;
			}
			this.notifyConnectError(err instanceof Error ? err : new Error(String(err)));
			const msg = `gateway connect failed: ${formatGatewayClientErrorForLog(err)}`;
			if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(err)) this.logDebug(msg);
			else this.logError(msg);
			this.ws?.close(1008, "connect failed");
		});
	}
	assembleConnectParams(params) {
		const { role, nonce } = params;
		const { authToken, authBootstrapToken, authDeviceToken, authPassword, authApprovalRuntimeToken, signatureToken, resolvedDeviceToken, storedToken, storedScopes, usingStoredDeviceToken } = this.selectConnectAuth(role);
		if (this.pendingDeviceTokenRetry && authDeviceToken) this.pendingDeviceTokenRetry = false;
		const auth = authToken || authBootstrapToken || authPassword || resolvedDeviceToken || authApprovalRuntimeToken ? {
			token: authToken,
			bootstrapToken: authBootstrapToken,
			deviceToken: authDeviceToken ?? resolvedDeviceToken,
			password: authPassword,
			approvalRuntimeToken: authApprovalRuntimeToken
		} : void 0;
		const signedAtMs = Date.now();
		const scopes = this.resolveConnectScopes({
			usingStoredDeviceToken,
			storedScopes
		});
		const platform = this.opts.platform ?? process.platform;
		return {
			params: {
				minProtocol: this.opts.minProtocol ?? 4,
				maxProtocol: this.opts.maxProtocol ?? 4,
				client: {
					id: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
					displayName: this.opts.clientDisplayName,
					version: this.opts.clientVersion ?? DEFAULT_CLIENT_VERSION,
					platform,
					deviceFamily: this.opts.deviceFamily,
					mode: this.opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND,
					instanceId: this.opts.instanceId
				},
				caps: Array.isArray(this.opts.caps) ? this.opts.caps : [],
				commands: Array.isArray(this.opts.commands) ? this.opts.commands : void 0,
				permissions: this.opts.permissions && typeof this.opts.permissions === "object" ? this.opts.permissions : void 0,
				pathEnv: this.opts.pathEnv,
				auth,
				role,
				scopes,
				device: this.buildDeviceConnectParams({
					nonce,
					role,
					scopes,
					signatureToken,
					signedAtMs,
					platform
				})
			},
			authApprovalRuntimeToken,
			resolvedDeviceToken,
			storedToken,
			usingStoredDeviceToken
		};
	}
	buildDeviceConnectParams(params) {
		if (!this.opts.deviceIdentity) return;
		const { nonce, role, scopes, signatureToken, signedAtMs, platform } = params;
		const payload = buildDeviceAuthPayloadV3({
			deviceId: this.opts.deviceIdentity.deviceId,
			clientId: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
			clientMode: this.opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND,
			role,
			scopes,
			signedAtMs,
			token: signatureToken ?? null,
			nonce,
			platform,
			deviceFamily: this.opts.deviceFamily
		});
		const signature = this.deps.signDevicePayload(this.opts.deviceIdentity.privateKeyPem, payload);
		return {
			id: this.opts.deviceIdentity.deviceId,
			publicKey: this.deps.publicKeyRawBase64UrlFromPem(this.opts.deviceIdentity.publicKeyPem),
			signature,
			signedAt: signedAtMs,
			nonce
		};
	}
	handleConnectFailure(err) {
		const error = err instanceof Error ? err : new Error(String(err));
		this.clearConnectChallengeTimeout();
		this.closed = true;
		this.notifyConnectError(markGatewayConnectAssemblyError(error));
		const msg = `gateway connect failed: ${formatGatewayClientErrorForLog(error)}`;
		if (this.opts.mode === GATEWAY_CLIENT_MODES.PROBE || isGatewayClientStoppedError(error)) this.logDebug(msg);
		else this.logError(msg);
		this.ws?.close(1008, "connect failed");
	}
	notifyConnectError(error) {
		try {
			this.opts.onConnectError?.(error);
		} catch (err) {
			this.logDebug(`gateway client connect error handler error: ${formatGatewayClientErrorForLog(err)}`);
		}
	}
	notifyHelloOk(helloOk) {
		try {
			this.opts.onHelloOk?.(helloOk);
		} catch (err) {
			this.logDebug(`gateway client hello-ok handler error: ${formatGatewayClientErrorForLog(err)}`);
		}
	}
	notifyReconnectPaused(info) {
		try {
			this.opts.onReconnectPaused?.(info);
		} catch (err) {
			this.logDebug(`gateway client reconnect paused handler error: ${formatGatewayClientErrorForLog(err)}`);
		}
	}
	notifyClose(code, reason, info) {
		try {
			if (info === void 0) {
				this.opts.onClose?.(code, reason);
				return;
			}
			this.opts.onClose?.(code, reason, info);
		} catch (err) {
			this.logDebug(`gateway client close handler error: ${formatGatewayClientErrorForLog(err)}`);
		}
	}
	resolveConnectScopes(params) {
		if (Array.isArray(this.opts.scopes)) return this.opts.scopes;
		if (params.usingStoredDeviceToken && Array.isArray(params.storedScopes) && params.storedScopes.length > 0) return params.storedScopes;
		return this.opts.scopes ?? ["operator.admin"];
	}
	loadStoredDeviceAuth(role) {
		if (!this.opts.deviceIdentity) return null;
		const storedAuth = this.deps.loadDeviceAuthToken({
			deviceId: this.opts.deviceIdentity.deviceId,
			role,
			env: this.opts.env
		});
		if (!storedAuth) return null;
		return {
			token: storedAuth.token,
			scopes: storedAuth.scopes
		};
	}
	shouldPauseReconnectAfterAuthFailure(params) {
		const { detailCode, details } = params;
		if (!detailCode) return false;
		const pairingDetails = readPairingConnectErrorDetails(details);
		if (detailCode === ConnectErrorDetailCodes.PAIRING_REQUIRED && (pairingDetails?.pauseReconnect === false || pairingDetails?.recommendedNextStep === "wait_then_retry")) return false;
		if (detailCode === ConnectErrorDetailCodes.AUTH_TOKEN_MISSING || detailCode === ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID || detailCode === ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING || detailCode === ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH || detailCode === ConnectErrorDetailCodes.AUTH_RATE_LIMITED || detailCode === ConnectErrorDetailCodes.AUTH_DEVICE_TOKEN_MISMATCH || detailCode === ConnectErrorDetailCodes.AUTH_SCOPE_MISMATCH || detailCode === ConnectErrorDetailCodes.PAIRING_REQUIRED || detailCode === ConnectErrorDetailCodes.CONTROL_UI_DEVICE_IDENTITY_REQUIRED || detailCode === ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED || detailCode === ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH) return true;
		if (detailCode === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH) return !this.pendingDeviceTokenRetry;
		return false;
	}
	shouldRetryWithStoredDeviceToken(params) {
		if (this.deviceTokenRetryBudgetUsed) return false;
		if (params.resolvedDeviceToken) return false;
		if (!params.explicitGatewayToken || !params.storedToken) return false;
		if (!this.isTrustedDeviceRetryEndpoint()) return false;
		if (!(params.error instanceof GatewayClientRequestError$1)) return false;
		const detailCode = readConnectErrorDetailCode(params.error.details);
		const advice = readConnectErrorRecoveryAdvice(params.error.details);
		const retryWithDeviceTokenRecommended = advice.recommendedNextStep === "retry_with_device_token";
		return advice.canRetryWithDeviceToken === true || retryWithDeviceTokenRecommended || detailCode === ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH;
	}
	shouldRetryWithoutApprovalRuntimeToken(params) {
		if (this.approvalRuntimeTokenRetryBudgetUsed) return false;
		if (!params.authApprovalRuntimeToken) return false;
		if (!(params.error instanceof GatewayClientRequestError$1)) return false;
		if (params.error.gatewayCode !== "INVALID_REQUEST") return false;
		const message = normalizeLowercaseStringOrEmpty(params.error.message);
		return message.includes("invalid connect params") && message.includes("approvalruntimetoken");
	}
	isTrustedDeviceRetryEndpoint() {
		const rawUrl = this.opts.url ?? "ws://127.0.0.1:18789";
		try {
			const parsed = new URL(rawUrl);
			const protocol = parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
			if (isLoopbackHost(parsed.hostname)) return true;
			return protocol === "wss:" && Boolean(this.opts.tlsFingerprint?.trim());
		} catch {
			return false;
		}
	}
	selectConnectAuth(role) {
		const explicitGatewayToken = normalizeOptionalString(this.opts.token);
		const explicitBootstrapToken = normalizeOptionalString(this.opts.bootstrapToken);
		const explicitDeviceToken = normalizeOptionalString(this.opts.deviceToken);
		const authPassword = normalizeOptionalString(this.opts.password);
		const authApprovalRuntimeToken = this.approvalRuntimeTokenCompatibilityDisabled ? void 0 : normalizeOptionalString(this.opts.approvalRuntimeToken);
		const storedAuth = this.loadStoredDeviceAuth(role);
		const storedToken = storedAuth?.token ?? null;
		const storedScopes = storedAuth?.scopes;
		const shouldUseDeviceRetryToken = this.pendingDeviceTokenRetry && !explicitDeviceToken && Boolean(explicitGatewayToken) && Boolean(storedToken) && this.isTrustedDeviceRetryEndpoint();
		const resolvedDeviceToken = explicitDeviceToken ?? (shouldUseDeviceRetryToken || !(explicitGatewayToken || authPassword) && (!explicitBootstrapToken || Boolean(storedToken)) ? storedToken ?? void 0 : void 0);
		const reusingStoredDeviceToken = Boolean(resolvedDeviceToken) && !explicitDeviceToken && Boolean(storedToken) && resolvedDeviceToken === storedToken;
		const authToken = explicitGatewayToken ?? resolvedDeviceToken;
		const authBootstrapToken = !explicitGatewayToken && !resolvedDeviceToken && !authPassword ? explicitBootstrapToken : void 0;
		return {
			authToken,
			authBootstrapToken,
			authDeviceToken: shouldUseDeviceRetryToken ? storedToken ?? void 0 : void 0,
			authPassword,
			authApprovalRuntimeToken,
			signatureToken: authToken ?? authBootstrapToken ?? void 0,
			resolvedDeviceToken,
			storedToken: storedToken ?? void 0,
			storedScopes,
			usingStoredDeviceToken: reusingStoredDeviceToken
		};
	}
	handleMessage(raw) {
		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch (err) {
			this.logDebug(`gateway client parse error: ${formatGatewayClientErrorForLog(err)}`);
			return;
		}
		if (isGatewayEventFrame(parsed)) {
			this.lastTick = Date.now();
			const evt = parsed;
			if (evt.event === "connect.challenge") {
				const payload = evt.payload;
				const nonce = payload && typeof payload.nonce === "string" ? payload.nonce : null;
				if (!nonce || nonce.trim().length === 0) {
					this.notifyConnectError(/* @__PURE__ */ new Error("gateway connect challenge missing nonce"));
					this.ws?.close(1008, "connect challenge missing nonce");
					return;
				}
				this.connectNonce = nonce.trim();
				if (this.socketOpened) this.sendConnect();
				return;
			}
			try {
				const seq = typeof evt.seq === "number" ? evt.seq : null;
				if (seq !== null) {
					if (this.lastSeq !== null && seq > this.lastSeq + 1) this.opts.onGap?.({
						expected: this.lastSeq + 1,
						received: seq
					});
					this.lastSeq = seq;
				}
				if (evt.event === "tick") this.lastTick = Date.now();
				this.opts.onEvent?.(evt);
			} catch (err) {
				this.logDebug(`gateway client event handler error: ${formatGatewayClientErrorForLog(err)}`);
			}
			return;
		}
		if (isGatewayResponseFrame(parsed)) {
			this.lastTick = Date.now();
			const pending = this.pending.get(parsed.id);
			if (!pending) return;
			const status = parsed.payload?.status;
			if (pending.expectFinal && status === "accepted") {
				if (!pending.acceptedNotified) {
					pending.acceptedNotified = true;
					try {
						pending.onAccepted?.(parsed.payload);
					} catch (err) {
						this.logDebug(`gateway client accepted callback error: ${formatGatewayClientErrorForLog(err)}`);
					}
				}
				return;
			}
			this.pending.delete(parsed.id);
			pending.cleanup?.();
			if (parsed.ok) pending.resolve(parsed.payload);
			else pending.reject(new GatewayClientRequestError$1({
				code: parsed.error?.code,
				message: parsed.error?.message ?? "unknown error",
				details: parsed.error?.details,
				retryable: parsed.error?.retryable,
				retryAfterMs: parsed.error?.retryAfterMs
			}));
		}
	}
	beginPreauthHandshake() {
		if (this.connectSent) return;
		if (this.connectNonce && !this.connectSent) {
			this.armConnectChallengeTimeout();
			this.sendConnect();
			return;
		}
		this.armConnectChallengeTimeout();
	}
	clearConnectChallengeTimeout() {
		if (this.connectTimer) {
			clearTimeout(this.connectTimer);
			this.connectTimer = null;
		}
	}
	clearReconnectTimer() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
	}
	armConnectChallengeTimeout() {
		const connectChallengeTimeoutMs = resolveGatewayClientConnectChallengeTimeoutMs$1(this.opts);
		const armedAt = Date.now();
		this.clearConnectChallengeTimeout();
		this.connectTimer = setTimeout(() => {
			if (this.connectSent || this.ws?.readyState !== WebSocket$1.OPEN) return;
			const elapsedMs = Date.now() - armedAt;
			this.notifyConnectError(/* @__PURE__ */ new Error(`gateway connect challenge timeout (waited ${elapsedMs}ms, limit ${connectChallengeTimeoutMs}ms)`));
			this.ws?.close(1008, "connect challenge timeout");
		}, connectChallengeTimeoutMs);
	}
	scheduleReconnect() {
		if (this.closed) return;
		if (this.tickTimer) {
			clearInterval(this.tickTimer);
			this.tickTimer = null;
		}
		this.clearReconnectTimer();
		const startupDelay = this.pendingStartupReconnectDelayMs;
		this.pendingStartupReconnectDelayMs = null;
		const delay = startupDelay ?? this.backoffMs;
		if (startupDelay === null) this.backoffMs = Math.min(this.backoffMs * 2, 3e4);
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.start();
		}, delay);
	}
	flushPendingErrors(err) {
		for (const [, p] of this.pending) {
			p.cleanup?.();
			p.reject(err);
		}
		this.pending.clear();
	}
	startTickWatch() {
		if (this.tickTimer) clearInterval(this.tickTimer);
		const rawMinInterval = this.opts.tickWatchMinIntervalMs;
		const minInterval = typeof rawMinInterval === "number" && Number.isFinite(rawMinInterval) ? Math.max(1, Math.min(3e4, rawMinInterval)) : 1e3;
		const interval = resolveSafeTimeoutDelayMs(Math.max(this.tickIntervalMs, minInterval));
		this.tickTimer = setInterval(() => {
			if (this.closed) return;
			if (!this.lastTick) return;
			if (this.pending.size > 0) return;
			const gap = Date.now() - this.lastTick;
			const rawTimeoutMs = this.opts.tickWatchTimeoutMs;
			if (gap > (typeof rawTimeoutMs === "number" && Number.isFinite(rawTimeoutMs) ? Math.max(1, rawTimeoutMs) : this.tickIntervalMs * 2)) this.ws?.close(4e3, "tick timeout");
		}, interval);
	}
	validateTlsFingerprint() {
		if (!this.opts.tlsFingerprint || !this.ws) return null;
		const expected = this.deps.normalizeTlsFingerprint(this.opts.tlsFingerprint);
		if (!expected) return /* @__PURE__ */ new Error("gateway tls fingerprint missing");
		const socket = this.ws["_socket"];
		if (!socket || typeof socket.getPeerCertificate !== "function") return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
		const cert = socket.getPeerCertificate();
		const fingerprint = this.deps.normalizeTlsFingerprint(cert?.fingerprint256 ?? "");
		if (!fingerprint) return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
		if (fingerprint !== expected) return /* @__PURE__ */ new Error("gateway tls fingerprint mismatch");
		return null;
	}
	async request(method, params, opts) {
		if (!this.ws || this.ws.readyState !== WebSocket$1.OPEN) throw new Error("gateway not connected");
		if (opts?.signal?.aborted) throw createGatewayRequestAbortError(method);
		const id = randomUUID();
		const frame = {
			type: "req",
			id,
			method,
			params
		};
		const requestFrameError = validateClientRequestFrame(frame);
		if (requestFrameError) throw new Error(`invalid request frame: ${requestFrameError}`);
		const expectFinal = opts?.expectFinal === true;
		const timeoutMs = opts?.timeoutMs === null ? null : typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? resolveSafeTimeoutDelayMs(opts.timeoutMs, { minMs: 0 }) : expectFinal ? null : this.requestTimeoutMs;
		const signal = opts?.signal;
		const p = new Promise((resolve, reject) => {
			const timeout = timeoutMs === null ? null : setTimeout(() => {
				const pending = this.pending.get(id);
				this.pending.delete(id);
				pending?.cleanup?.();
				reject(/* @__PURE__ */ new Error(`gateway request timeout for ${method}`));
			}, timeoutMs);
			const cleanup = () => {
				if (timeout) clearTimeout(timeout);
				if (signal && abortHandler) signal.removeEventListener("abort", abortHandler);
			};
			const abortHandler = () => {
				const pending = this.pending.get(id);
				this.pending.delete(id);
				pending?.cleanup?.();
				reject(createGatewayRequestAbortError(method));
			};
			this.pending.set(id, {
				resolve: (value) => resolve(value),
				reject,
				expectFinal,
				timeout,
				cleanup,
				onAccepted: opts?.onAccepted
			});
			signal?.addEventListener("abort", abortHandler, { once: true });
		});
		try {
			this.ws.send(JSON.stringify(frame));
		} catch (error) {
			const pending = this.pending.get(id);
			this.pending.delete(id);
			pending?.cleanup?.();
			throw error;
		}
		return p;
	}
};
function createGatewayRequestAbortError(method) {
	const err = /* @__PURE__ */ new Error(`gateway request aborted for ${method}`);
	err.name = "AbortError";
	return err;
}
//#endregion
//#region src/gateway/client.ts
const GATEWAY_CLOSE_CODE_HINTS = GATEWAY_CLOSE_CODE_HINTS$1;
const GatewayClientRequestError = GatewayClientRequestError$1;
function describeGatewayCloseCode(code) {
	return describeGatewayCloseCode$1(code);
}
function isGatewayConnectAssemblyError(value) {
	return isGatewayConnectAssemblyError$1(value);
}
function createOpenClawGatewayClientHostDeps(overrides) {
	return {
		loadOrCreateDeviceIdentity,
		signDevicePayload,
		publicKeyRawBase64UrlFromPem,
		loadDeviceAuthToken,
		storeDeviceAuthToken,
		clearDeviceAuthToken,
		beforeConnect: ensureInheritedManagedProxyRoutingActive,
		registerGatewayLoopbackBypass: registerManagedProxyGatewayLoopbackBypass,
		normalizeTlsFingerprint: (fingerprint) => normalizeFingerprint$1(fingerprint ?? ""),
		logDebug,
		logError,
		redactForLog: redactToolPayloadText,
		...overrides
	};
}
function resolveGatewayClientConnectChallengeTimeoutMs(opts) {
	return resolveGatewayClientConnectChallengeTimeoutMs$1(opts);
}
var GatewayClient = class {
	#client;
	constructor(opts) {
		this.#client = new GatewayClient$1({
			...opts,
			clientVersion: opts.clientVersion ?? VERSION,
			hostDeps: createOpenClawGatewayClientHostDeps(opts.hostDeps)
		});
	}
	start() {
		this.#client.start();
	}
	stop() {
		this.#client.stop();
	}
	stopAndWait(opts) {
		return this.#client.stopAndWait(opts);
	}
	request(method, params, opts) {
		return this.#client.request(method, params, opts);
	}
	getConnectionMetadata() {
		const opts = this.#client.opts;
		return {
			clientName: opts.clientName,
			hasDeviceIdentity: Boolean(opts.deviceIdentity),
			mode: opts.mode,
			preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs
		};
	}
};
//#endregion
export { isGatewayConnectAssemblyError as a, buildDeviceAuthPayloadV3 as c, describeGatewayCloseCode as i, normalizeDeviceMetadataForAuth as l, GatewayClient as n, resolveGatewayClientConnectChallengeTimeoutMs as o, GatewayClientRequestError as r, buildDeviceAuthPayload as s, GATEWAY_CLOSE_CODE_HINTS as t, loadDeviceAuthToken as u };
