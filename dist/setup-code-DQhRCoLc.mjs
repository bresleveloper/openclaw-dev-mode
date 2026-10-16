import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as normalizeSecretInputString, g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { a as isCarrierGradeNatIpv4Address, c as isIpv4Address, f as isLoopbackIpAddress, l as isIpv6Address, m as isRfc1918Ipv4Address, v as parseCanonicalIpAddress } from "./ip-jvtZlu_y.mjs";
import { i as normalizeTlsFingerprint } from "./client-address-utils-BafGwQBm.mjs";
import { n as pickMatchingExternalInterfaceAddress, r as safeNetworkInterfaces } from "./network-interfaces-5_nTDEn5.mjs";
import { t as normalizeWebSocketProtocol } from "./websocket-protocol-MDxbNIbL.mjs";
import { c as deviceBootstrapProfilesEqual, i as FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE, o as PAIRING_SETUP_BOOTSTRAP_PROFILE, v as resolvePairingSetupAccess } from "./device-bootstrap-profile-DPDpvU9k.mjs";
import { t as resolveAdvertisedLanHostCore } from "./advertised-lan-host-V7bMngZk.mjs";
import { a as resolveTailscalePublishedHost, i as resolveTailnetHostWithRunner } from "./tailscale-status-BA6JQcBe.mjs";
import { t as resolveGatewayBindUrl } from "./gateway-bind-url-Ci0exoFE.mjs";
import { r as materializeGatewayAuthSecretRefs } from "./auth-config-utils-BzcyvaQI.mjs";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-DzNSJi11.mjs";
import { c as issueDevicePairSetupBootstrapToken } from "./device-bootstrap-oFZT97Lm.mjs";
import os from "node:os";
//#region src/pairing/setup-code.ts
const PAIRING_SETUP_MAX_URLS = 8;
const PAIRING_GATEWAY_LOOPBACK_ERROR = "Gateway is only bound to loopback. Set gateway.publicOrigin to your public HTTPS origin, configure plugins.entries.device-pair.config.publicUrl, enable tailscale serve, or set gateway.bind=lan.";
function resolveConfiguredPairingPublicUrl(config) {
	const value = config.plugins?.entries?.["device-pair"]?.config?.["publicUrl"];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function describeSecureMobilePairingFix(source) {
	return "Tailscale and public mobile pairing require a secure gateway URL (wss://) or Tailscale Serve/Funnel." + (source ? ` Resolved source: ${source}.` : "") + " Fix: use a private LAN address, prefer gateway.tailscale.mode=serve, or set gateway.remote.url / plugins.entries.device-pair.config.publicUrl to a wss:// URL. ws:// is only valid for localhost, private LAN addresses, .local hosts, or the Android emulator.";
}
function normalizeMobilePairingHost(host) {
	let normalized = normalizeLowercaseStringOrEmpty(host);
	if (normalized.startsWith("[") && normalized.endsWith("]")) normalized = normalized.slice(1, -1);
	if (normalized.endsWith(".")) normalized = normalized.slice(0, -1);
	const zoneIndex = normalized.indexOf("%");
	if (zoneIndex >= 0) normalized = normalized.slice(0, zoneIndex);
	return normalized;
}
function isPrivateLanHost(host) {
	const normalized = normalizeMobilePairingHost(host);
	if (normalized.endsWith(".local")) return true;
	if (isRfc1918Ipv4Address(normalized)) return true;
	const parsed = parseCanonicalIpAddress(normalized);
	if (!parsed) return false;
	if (isIpv4Address(parsed)) {
		const normalizedIp = parsed.toString();
		return normalizedIp.startsWith("169.254.") && !isCarrierGradeNatIpv4Address(normalizedIp);
	}
	if (!isIpv6Address(parsed)) return false;
	const normalizedIp = normalizeLowercaseStringOrEmpty(parsed.toString());
	return normalizedIp.startsWith("fe80:") || normalizedIp.startsWith("fc") || normalizedIp.startsWith("fd");
}
function isMobilePairingCleartextAllowedHost(host) {
	const normalized = normalizeMobilePairingHost(host);
	return normalized === "localhost" || isLoopbackIpAddress(normalized) || normalized === "10.0.2.2" || isPrivateLanHost(normalized);
}
function isFullAccessMobilePairingUrl(url) {
	try {
		const parsed = new URL(url);
		if (parsed.protocol === "wss:") return true;
		const host = normalizeMobilePairingHost(parsed.hostname);
		return parsed.protocol === "ws:" && (host === "localhost" || isLoopbackIpAddress(host));
	} catch {
		return false;
	}
}
function validateMobilePairingUrl(url, source) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return "Resolved mobile pairing URL is invalid.";
	}
	const protocol = normalizeWebSocketProtocol(parsed.protocol);
	if (protocol === "wss:") return null;
	if (protocol !== "ws:" || isMobilePairingCleartextAllowedHost(parsed.hostname)) return null;
	return describeSecureMobilePairingFix(source);
}
const GATEWAY_SCHEME_WITHOUT_AUTHORITY_RE = /^(?:https?|wss?):(?!\/\/)/i;
const SCHEME_LIKE_PATH_RE = /^[A-Za-z][A-Za-z0-9+.-]*:\//;
function normalizeUrl(raw, schemeFallback, pathMode = "preserve") {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (GATEWAY_SCHEME_WITHOUT_AUTHORITY_RE.test(trimmed)) return null;
	const parsedUrl = parseNormalizedGatewayUrl(trimmed, pathMode);
	if (parsedUrl) return parsedUrl;
	if (trimmed.includes("://") || SCHEME_LIKE_PATH_RE.test(trimmed)) return null;
	const withoutPath = normalizeOptionalString(trimmed.split("/", 1)[0]) ?? "";
	return withoutPath ? parseNormalizedGatewayUrl(`${schemeFallback}://${withoutPath}`, pathMode) : null;
}
function parseNormalizedGatewayUrl(raw, pathMode) {
	try {
		const parsed = new URL(raw);
		if (parsed.username || parsed.password) return null;
		const protocol = normalizeWebSocketProtocol(parsed.protocol);
		if (!protocol) return null;
		const resolvedScheme = protocol.replace(":", "");
		if (resolvedScheme !== "ws" && resolvedScheme !== "wss") return null;
		const host = parsed.hostname;
		if (!host) return null;
		return `${resolvedScheme}://${host}${parsed.port ? `:${parsed.port}` : ""}${pathMode === "origin-only" || parsed.pathname === "/" ? "" : parsed.pathname}`;
	} catch {
		return null;
	}
}
function resolvePairingSetupAuthLabel(cfg, env) {
	const mode = cfg.gateway?.auth?.mode;
	const defaults = cfg.secrets?.defaults;
	const tokenRef = resolveSecretInputRef({
		value: cfg.gateway?.auth?.token,
		defaults
	}).ref;
	const passwordRef = resolveSecretInputRef({
		value: cfg.gateway?.auth?.password,
		defaults
	}).ref;
	const envToken = normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN);
	const envPassword = normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD);
	const token = envToken || (tokenRef ? void 0 : normalizeSecretInputString(cfg.gateway?.auth?.token));
	const password = envPassword || (passwordRef ? void 0 : normalizeSecretInputString(cfg.gateway?.auth?.password));
	if (mode === "password" || mode === "token") {
		if (!(mode === "password" ? password : token)) return { error: `Gateway auth is set to ${mode}, but no ${mode} is configured.` };
		return { label: mode };
	}
	if (token) return { label: "token" };
	if (password) return { label: "password" };
	if (mode === "trusted-proxy") return { label: "trusted-proxy" };
	if (mode === "none") return { error: `Pairing setup requires gateway.auth.mode "token" or "password"; current mode is "${mode}".` };
	return { error: "Gateway auth is not configured (no token or password)." };
}
async function resolvePairingGatewayUrl(cfg, opts) {
	const scheme = opts.forceSecure || cfg.gateway?.tls?.enabled === true ? "wss" : "ws";
	const port = resolveGatewayPort(cfg, opts.env);
	if (typeof opts.publicUrl === "string" && opts.publicUrl.trim()) {
		const url = normalizeUrl(opts.publicUrl, scheme, opts.urlPathMode);
		if (url) return {
			url,
			source: "plugins.entries.device-pair.config.publicUrl"
		};
		return { error: "Configured publicUrl is invalid." };
	}
	const publicOrigin = cfg.gateway?.publicOrigin?.trim();
	const publicOriginUrl = publicOrigin ? normalizeUrl(publicOrigin, scheme, opts.urlPathMode) : null;
	const publicOriginResult = publicOrigin ? publicOriginUrl ? {
		url: publicOriginUrl,
		source: "gateway.publicOrigin"
	} : { error: "Configured gateway.publicOrigin is invalid." } : void 0;
	if (opts.publicOriginPreference === "prefer" && publicOriginResult) return publicOriginResult;
	const remoteUrlRaw = opts.useLocalGateway ? void 0 : cfg.gateway?.remote?.url;
	const hasRemoteUrl = typeof remoteUrlRaw === "string" && remoteUrlRaw.trim();
	const remoteUrl = hasRemoteUrl ? normalizeUrl(remoteUrlRaw, scheme, opts.urlPathMode) : null;
	if (hasRemoteUrl && !remoteUrl) return { error: "Configured gateway.remote.url is invalid." };
	if (opts.preferRemoteUrl && remoteUrl) return {
		url: remoteUrl,
		source: "gateway.remote.url"
	};
	const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
	if (tailscaleMode === "serve" || tailscaleMode === "funnel") {
		const host = await resolveTailnetHostWithRunner(opts.runCommandWithTimeout);
		if (!host) return { error: "Tailscale Serve is enabled, but MagicDNS could not be resolved." };
		return {
			url: `wss://${resolveTailscalePublishedHost({
				tailscaleMode,
				tailnetHost: host
			})}`,
			source: `gateway.tailscale.mode=${tailscaleMode}`
		};
	}
	if (remoteUrl) return {
		url: remoteUrl,
		source: "gateway.remote.url"
	};
	const advertisedLanHost = cfg.gateway?.bind === "lan" ? await resolveAdvertisedLanHostCore({
		networkInterfaces: opts.networkInterfaces,
		runCommandWithTimeout: opts.runCommandWithTimeout
	}) : null;
	const bindResult = resolveGatewayBindUrl({
		bind: cfg.gateway?.bind,
		customBindHost: cfg.gateway?.customBindHost,
		scheme,
		port,
		pickTailnetHost: () => pickMatchingExternalInterfaceAddress(safeNetworkInterfaces(opts.networkInterfaces), {
			family: "IPv4",
			matches: isCarrierGradeNatIpv4Address
		}) ?? null,
		pickLanHost: () => advertisedLanHost
	});
	if (bindResult) return bindResult;
	return publicOriginResult ?? { error: "Gateway is only bound to loopback. Set gateway.publicOrigin to your public HTTPS origin, configure plugins.entries.device-pair.config.publicUrl, enable tailscale serve, or set gateway.bind=lan." };
}
function encodePairingSetupCode(payload) {
	return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
const PAIRING_SETUP_URL_PREFIX = "oc-pair://";
const PAIRING_SETUP_CODE_RE = /^[A-Za-z0-9_-]+$/u;
/** Decode the current setup payload plus additive fields emitted by older pairing surfaces. */
function decodePairingSetupCode(input, options = {}) {
	const trimmed = input.trim();
	const setupCode = trimmed.toLowerCase().startsWith(PAIRING_SETUP_URL_PREFIX) ? trimmed.slice(10) : trimmed;
	if (!setupCode || !PAIRING_SETUP_CODE_RE.test(setupCode)) throw new Error("Invalid pairing setup code or URL.");
	let decoded;
	try {
		decoded = JSON.parse(Buffer.from(setupCode, "base64url").toString("utf8"));
	} catch {
		throw new Error("Invalid pairing setup code or URL.");
	}
	if (!isRecord(decoded)) throw new Error("Invalid pairing setup payload.");
	const url = normalizeOptionalString(decoded.url);
	const bootstrapToken = normalizeOptionalString(decoded.bootstrapToken);
	if (!url || !bootstrapToken || normalizeUrl(url, "ws") !== url) throw new Error("Invalid pairing setup payload.");
	let urls;
	if (decoded.urls !== void 0) {
		if (!Array.isArray(decoded.urls) || decoded.urls.length === 0 || decoded.urls.length > PAIRING_SETUP_MAX_URLS || decoded.urls.some((candidate) => typeof candidate !== "string" || normalizeUrl(candidate, "ws") !== candidate)) throw new Error("Invalid pairing setup payload.");
		urls = decoded.urls;
	}
	let expiresAtMs;
	if (decoded.expiresAtMs !== void 0) {
		const candidate = decoded.expiresAtMs;
		if (typeof candidate !== "number" || !Number.isSafeInteger(candidate) || candidate < 0) throw new Error("Invalid pairing setup payload.");
		expiresAtMs = candidate;
		if (!options.allowExpired && candidate <= (options.nowMs ?? Date.now())) throw new Error("Pairing setup code has expired.");
	}
	const tlsFingerprint = typeof decoded.tlsFingerprint === "string" ? normalizeTlsFingerprint(decoded.tlsFingerprint) : void 0;
	if (decoded.tlsFingerprint !== void 0 && !tlsFingerprint) throw new Error("Invalid pairing setup payload.");
	return {
		url,
		...urls ? { urls } : {},
		bootstrapToken,
		...expiresAtMs !== void 0 ? { expiresAtMs } : {},
		...tlsFingerprint ? { tlsFingerprint } : {}
	};
}
async function resolvePairingSetupFromConfig(cfg, options = {}) {
	assertExplicitGatewayAuthModeWhenBothConfigured(cfg);
	const env = options.env ?? process.env;
	const cfgForAuth = await materializeGatewayAuthSecretRefs({
		cfg,
		env,
		mode: cfg.gateway?.auth?.mode,
		hasTokenOverride: false,
		hasPasswordOverride: false,
		hasTokenFallback: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN)),
		hasPasswordFallback: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD))
	});
	const authLabel = resolvePairingSetupAuthLabel(cfgForAuth, env);
	if (authLabel.error) return {
		ok: false,
		error: authLabel.error
	};
	const explicitPublicUrl = normalizeOptionalString(options.publicUrl);
	const urlResult = await resolvePairingGatewayUrl(cfgForAuth, {
		env,
		publicUrl: explicitPublicUrl ?? (options.preferRemoteUrl ? void 0 : resolveConfiguredPairingPublicUrl(cfgForAuth)),
		publicOriginPreference: options.publicOriginPreference,
		preferRemoteUrl: options.preferRemoteUrl,
		useLocalGateway: options.useLocalGateway,
		forceSecure: options.forceSecure,
		runCommandWithTimeout: options.runCommandWithTimeout,
		networkInterfaces: options.networkInterfaces ?? os.networkInterfaces
	});
	if (!urlResult.url) return {
		ok: false,
		error: urlResult.error ?? "Gateway URL unavailable."
	};
	const basePath = normalizeControlUiBasePath(cfgForAuth.gateway?.controlUi?.basePath);
	if (basePath && !explicitPublicUrl && urlResult.source !== "gateway.remote.url") {
		const url = new URL(urlResult.url);
		if (url.pathname === "/") {
			url.pathname = basePath;
			urlResult.url = url.toString();
		}
	}
	const mobilePairingUrlError = validateMobilePairingUrl(urlResult.url, urlResult.source);
	if (mobilePairingUrlError) return {
		ok: false,
		error: mobilePairingUrlError
	};
	if (!authLabel.label) return {
		ok: false,
		error: "Gateway auth is not configured (no token or password)."
	};
	const requestedBootstrapProfile = options.bootstrapProfile ?? FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE;
	const accessDowngraded = deviceBootstrapProfilesEqual(requestedBootstrapProfile, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE) && !isFullAccessMobilePairingUrl(urlResult.url);
	const issuedBootstrapProfile = accessDowngraded ? PAIRING_SETUP_BOOTSTRAP_PROFILE : requestedBootstrapProfile;
	const directGatewayTlsFingerprintRaw = urlResult.url.startsWith("wss://") && urlResult.source?.startsWith("gateway.bind=") ? options.localTlsFingerprint ?? await options.loadLocalTlsFingerprint?.() : urlResult.url.startsWith("wss://") && urlResult.source === "gateway.remote.url" ? cfgForAuth.gateway?.remote?.tlsFingerprint : void 0;
	const directGatewayTlsFingerprint = directGatewayTlsFingerprintRaw ? normalizeTlsFingerprint(directGatewayTlsFingerprintRaw) : void 0;
	if (directGatewayTlsFingerprintRaw !== void 0 && !directGatewayTlsFingerprint) return {
		ok: false,
		error: "Gateway TLS fingerprint is invalid."
	};
	const issued = options.issuedBootstrap ?? await issueDevicePairSetupBootstrapToken({
		baseDir: options.pairingBaseDir,
		profile: issuedBootstrapProfile
	});
	return {
		ok: true,
		payload: {
			url: urlResult.url,
			bootstrapToken: issued.token,
			expiresAtMs: issued.expiresAtMs,
			...directGatewayTlsFingerprint ? { tlsFingerprint: directGatewayTlsFingerprint } : {}
		},
		authLabel: authLabel.label,
		urlSource: urlResult.source ?? "unknown",
		access: resolvePairingSetupAccess(issuedBootstrapProfile),
		accessDowngraded,
		setupId: issued.setupId,
		expiresAtMs: issued.expiresAtMs
	};
}
//#endregion
export { resolvePairingGatewayUrl as a, resolveConfiguredPairingPublicUrl as i, decodePairingSetupCode as n, resolvePairingSetupFromConfig as o, encodePairingSetupCode as r, PAIRING_GATEWAY_LOOPBACK_ERROR as t };
