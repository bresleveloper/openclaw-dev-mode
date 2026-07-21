import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { M as resolveTimestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { C as FsSafeError, c as isWithinDir, x as safeFileURLToPath } from "./path-DILYn_gk.js";
import { s as readSecureFile } from "./fs-safe-RNq3oO57.js";
import { r as openLocalFileSafely } from "./secure-temp-dir-DMUMnweR.js";
import { i as openRootFileSync, n as matchRootFileOpenFailure } from "./root-file-9jkyxRTl.js";
import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
import "./boundary-file-read-CBe_wA_B.js";
import "./path-safety-CBe_wA_B.js";
import { _ as resolveRequestClientIp } from "./net-BOKtNTf8.js";
import { r as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN, s as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET } from "./auth-rate-limit-DczU2XgX.js";
import { r as authorizeHttpGatewayConnect } from "./auth-CrLWKxN2.js";
import { t as AVATAR_MAX_BYTES } from "./avatar-policy-3iKUCXyV.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-CwW_Szsp.js";
import { i as resolveAssistantAvatarUrl, n as buildControlUiAvatarUrl, r as normalizeControlUiBasePath, t as CONTROL_UI_AVATAR_PREFIX } from "./control-ui-shared-BxIfxICx.js";
import { c as kindFromMime, n as detectMime } from "./mime-BaK8UYea.js";
import "./local-file-access-CBe_wA_B.js";
import { o as extractOriginalFilename } from "./store-VcV5Hs9C.js";
import { o as resolveMediaReferenceLocalPath, s as resolveMediaReferenceLocalPathInfo } from "./media-reference-Cswh9n78.js";
import { r as getAgentScopedMediaLocalRoots } from "./local-roots-CAoJyC6u.js";
import { n as assertLocalMediaAllowed, r as getDefaultLocalRoots } from "./local-media-access-Be6C1Gk2.js";
import { n as resolvePublicAgentAvatarSource, t as resolveAgentAvatar } from "./identity-avatar-B4N7sk0k.js";
import { c as resolveControlUiRootSync, n as isPackageProvenControlUiRootSync } from "./control-ui-assets-zJppiM7x.js";
import { n as verifyPairingToken } from "./pairing-token-BOKSkEPP.js";
import { l as listDevicePairing, y as verifyDeviceToken } from "./device-pairing-Dw7KWdQ7.js";
import { r as sendGatewayAuthFailure, t as buildMissingScopeForbiddenBody } from "./http-common-CX1WCKcv.js";
import { a as getBearerToken, c as resolveHttpBrowserOriginPolicy, p as resolveTrustedHttpOperatorScopes } from "./http-auth-utils-_q1_NJpv.js";
import "./http-utils-ClqNWXeK.js";
import { n as resolveAssistantIdentity, t as DEFAULT_ASSISTANT_IDENTITY } from "./assistant-identity-CMgdiIsp.js";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-DruWzfsQ.js";
import fs from "node:fs";
import path from "node:path";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
//#region src/gateway/control-ui-contract.ts
/** HTTP path for the Control UI bootstrap config payload. */
const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/control-ui-config.json";
/** Carries the gateway-configured Control UI mount path into browser bootstrap. */
const CONTROL_UI_BASE_PATH_ATTRIBUTE = "data-openclaw-control-ui-base-path";
/** Marks whether the served document CSP permits the terminal WASM runtime. */
const CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE = "data-openclaw-terminal-enabled";
//#endregion
//#region src/gateway/control-ui-csp.ts
const SCRIPT_ATTRIBUTE_NAME_RE = /\s([^\s=/>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;
/**
* Compute SHA-256 CSP hashes for inline `<script>` blocks in an HTML string.
* Only scripts without a `src` attribute are considered inline.
*/
function computeInlineScriptHashes(html) {
	const hashes = [];
	const re = /<script(?:\s[^>]*)?>([^]*?)<\/script>/gi;
	let match;
	while ((match = re.exec(html)) !== null) {
		if (hasScriptSrcAttribute(match[0].slice(0, match[0].indexOf(">") + 1))) continue;
		const content = match[1];
		if (!content) continue;
		const hash = createHash("sha256").update(content, "utf8").digest("base64");
		hashes.push(`sha256-${hash}`);
	}
	return hashes;
}
function hasScriptSrcAttribute(openTag) {
	return Array.from(openTag.matchAll(SCRIPT_ATTRIBUTE_NAME_RE)).some((match) => normalizeLowercaseStringOrEmpty(match[1]) === "src");
}
/** Build the CSP header applied to Gateway-served Control UI HTML. */
function buildControlUiCspHeader(opts) {
	const hashes = opts?.inlineScriptHashes;
	const scriptTokens = ["'self'"];
	if (hashes?.length) scriptTokens.push(...hashes.map((h) => `'${h}'`));
	if (opts?.allowWasm) scriptTokens.push("'wasm-unsafe-eval'");
	const connectTokens = [
		"'self'",
		"ws:",
		"wss:",
		"https://api.openai.com",
		"https://tweakcn.com"
	];
	if (opts?.allowWasm) connectTokens.push("data:");
	return [
		"default-src 'self'",
		"base-uri 'none'",
		"object-src 'none'",
		"frame-ancestors 'none'",
		`script-src ${scriptTokens.join(" ")}`,
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"img-src 'self' data: blob:",
		"media-src 'self' data: blob:",
		"font-src 'self' https://fonts.gstatic.com",
		"worker-src 'self'",
		`connect-src ${connectTokens.join(" ")}`
	].join("; ");
}
//#endregion
//#region src/gateway/control-ui-http-utils.ts
/** Returns true for idempotent HTTP methods that can read Control UI assets. */
function isReadHttpMethod(method) {
	return method === "GET" || method === "HEAD";
}
/** Sends a plain-text response with the standard UTF-8 content type. */
function respondPlainText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.end(body);
}
/** Sends the shared plain-text 404 response for Control UI routes. */
function respondNotFound(res) {
	respondPlainText(res, 404, "Not Found");
}
//#endregion
//#region src/gateway/control-ui-routing.ts
const ROOT_MOUNTED_GATEWAY_PROBE_PATHS = /* @__PURE__ */ new Set([
	"/health",
	"/healthz",
	"/ready",
	"/readyz"
]);
/** Classify an HTTP request as Control UI serving, redirect, 404, or non-Control-UI. */
function classifyControlUiRequest(params) {
	const { basePath, pathname, search, method } = params;
	if (!basePath) {
		if (pathname === "/ui" || pathname.startsWith("/ui/")) return { kind: "not-found" };
		if (ROOT_MOUNTED_GATEWAY_PROBE_PATHS.has(pathname)) return { kind: "not-control-ui" };
		if (pathname === "/plugins" || pathname.startsWith("/plugins/")) return { kind: "not-control-ui" };
		if (pathname === "/api" || pathname.startsWith("/api/")) return { kind: "not-control-ui" };
		if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
		return { kind: "serve" };
	}
	if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return { kind: "not-control-ui" };
	if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
	if (pathname === basePath) return {
		kind: "redirect",
		location: `${basePath}/${search}`
	};
	return { kind: "serve" };
}
//#endregion
//#region src/gateway/control-ui.ts
const ROOT_PREFIX = "/";
const CONTROL_UI_ASSISTANT_MEDIA_PREFIX = "/__openclaw__/assistant-media";
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE = "assistant-media";
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_TTL_MS = 300 * 1e3;
const CONTROL_UI_ASSETS_MISSING_MESSAGE = "Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.";
const CONTROL_UI_OPERATOR_READ_SCOPE = "operator.read";
const CONTROL_UI_OPERATOR_ROLE = "operator";
const controlUiAssistantMediaTicketSecret = randomBytes(32);
function buildAssistantMediaContentDisposition(filename, mime) {
	const fallback = filename.replace(/[^\x20-\x7e]|[%"\\]/g, "_") || "download";
	const extended = encodeURIComponent(filename).replace(/[\x27()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
	const kind = kindFromMime(mime);
	return `${kind === "image" || kind === "audio" || kind === "video" ? "inline" : "attachment"}; filename="${fallback}"; filename*=UTF-8''${extended}`;
}
function contentTypeForExt(ext) {
	switch (ext) {
		case ".html": return "text/html; charset=utf-8";
		case ".js": return "application/javascript; charset=utf-8";
		case ".css": return "text/css; charset=utf-8";
		case ".json":
		case ".map": return "application/json; charset=utf-8";
		case ".svg": return "image/svg+xml";
		case ".png": return "image/png";
		case ".jpg":
		case ".jpeg": return "image/jpeg";
		case ".gif": return "image/gif";
		case ".webp": return "image/webp";
		case ".ico": return "image/x-icon";
		case ".txt": return "text/plain; charset=utf-8";
		case ".webmanifest": return "application/manifest+json; charset=utf-8";
		default: return "application/octet-stream";
	}
}
/**
* Extensions recognised as static assets.  Missing files with these extensions
* return 404 instead of the SPA index.html fallback.  `.html` is intentionally
* excluded — actual HTML files on disk are served earlier, and missing `.html`
* paths should fall through to the SPA router (client-side routers may use
* `.html`-suffixed routes).
*/
const STATIC_ASSET_EXTENSIONS = /* @__PURE__ */ new Set([
	".js",
	".css",
	".json",
	".map",
	".svg",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".ico",
	".txt",
	".webmanifest"
]);
const CONTROL_UI_NAMESPACE_PREFIX = "/__openclaw__/";
const CONTROL_UI_ROOT_PUBLIC_ASSETS = /* @__PURE__ */ new Set([
	"apple-touch-icon.png",
	"favicon-32.png",
	"favicon.ico",
	"favicon.svg",
	"manifest.webmanifest",
	"sw.js"
]);
/** Rewrites root-absolute Control UI public asset hrefs for configured base paths. */
function rewriteControlUiIndexHtmlPublicAssetHrefs(html, basePath) {
	const normalized = normalizeControlUiBasePath(basePath);
	if (!normalized) return html;
	let next = html;
	for (const asset of CONTROL_UI_ROOT_PUBLIC_ASSETS) {
		const rootHref = `href="/${asset}"`;
		const baseHref = `href="${normalized}/${asset}"`;
		next = next.split(rootHref).join(baseHref);
	}
	return next;
}
function escapeHtmlAttribute(value) {
	return value.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
}
function controlUiAvatarResolutionMeta(resolved) {
	if (!resolved) return {
		avatarSource: null,
		avatarStatus: null,
		avatarReason: null
	};
	return {
		avatarSource: resolvePublicAgentAvatarSource(resolved) ?? null,
		avatarStatus: resolved.kind,
		avatarReason: resolved.kind === "none" ? resolved.reason : null
	};
}
function applyControlUiSecurityHeaders(res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader());
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
}
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-cache");
	res.end(JSON.stringify(body));
}
function respondControlUiAssetsUnavailable(res, options) {
	if (options?.configuredRootPath) {
		respondPlainText(res, 503, `Control UI assets not found at ${options.configuredRootPath}. Build them with \`pnpm ui:build\` (auto-installs UI deps), or update gateway.controlUi.root.`);
		return;
	}
	respondPlainText(res, 503, CONTROL_UI_ASSETS_MISSING_MESSAGE);
}
function respondHeadForFile(req, res, filePath) {
	if (req.method !== "HEAD") return false;
	res.statusCode = 200;
	setStaticFileHeaders(res, filePath);
	res.end();
	return true;
}
function isValidAgentId(agentId) {
	return /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(agentId);
}
function normalizeAssistantMediaSource(source) {
	const trimmed = source.trim();
	if (!trimmed) return null;
	if (trimmed.startsWith("file://")) try {
		return safeFileURLToPath(trimmed);
	} catch {
		return null;
	}
	if (trimmed.startsWith("~")) return resolveUserPath(trimmed);
	return trimmed;
}
function resolveAssistantMediaRoutePath(basePath) {
	return `${basePath && basePath !== "/" ? basePath.endsWith("/") ? basePath.slice(0, -1) : basePath : ""}${CONTROL_UI_ASSISTANT_MEDIA_PREFIX}`;
}
function resolveAssistantMediaAuthToken(req) {
	const bearer = getBearerToken(req);
	if (bearer) return bearer;
	const urlRaw = req.url;
	if (!urlRaw) return;
	try {
		return new URL(urlRaw, "http://localhost").searchParams.get("token")?.trim() || void 0;
	} catch {
		return;
	}
}
function resolveControlUiReadAuthToken(req, opts) {
	const bearer = getBearerToken(req);
	if (bearer) return bearer;
	if (!opts?.allowQueryToken) return;
	return resolveAssistantMediaAuthToken(req);
}
async function authorizeControlUiReadRequest(req, res, opts) {
	if (!opts?.auth) return true;
	const token = resolveControlUiReadAuthToken(req, { allowQueryToken: opts.allowQueryToken });
	const clientIp = resolveRequestClientIp(req, opts.trustedProxies, opts.allowRealIpFallback === true) ?? req.socket?.remoteAddress;
	let resolvedAuthResult = await authorizeHttpGatewayConnect({
		auth: opts.auth,
		connectAuth: token ? {
			token,
			password: token
		} : null,
		req,
		browserOriginPolicy: resolveHttpBrowserOriginPolicy(req),
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: token ? opts.rateLimiter : void 0,
		clientIp,
		rateLimitScope: AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET
	});
	if (!resolvedAuthResult.ok && token && opts.auth.mode !== "trusted-proxy" && opts.auth.mode !== "none") {
		const deviceRateCheck = opts.rateLimiter?.check(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
		if (deviceRateCheck && !deviceRateCheck.allowed) resolvedAuthResult = {
			ok: false,
			reason: "rate_limited",
			rateLimited: true,
			retryAfterMs: deviceRateCheck.retryAfterMs
		};
		else if (await authorizeControlUiDeviceReadToken(token, { requiredSharedGatewaySessionGeneration: resolveSharedGatewaySessionGeneration(opts.auth, opts.trustedProxies) })) {
			opts.rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
			opts.rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
			resolvedAuthResult = {
				ok: true,
				method: "device-token"
			};
		} else opts.rateLimiter?.recordFailure(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
	}
	if (!resolvedAuthResult.ok) {
		sendGatewayAuthFailure(res, resolvedAuthResult);
		return false;
	}
	const trustDeclaredOperatorScopes = resolvedAuthResult.method === "trusted-proxy";
	if (!trustDeclaredOperatorScopes) return true;
	const requestedScopes = resolveTrustedHttpOperatorScopes(req, { trustDeclaredOperatorScopes });
	const scopeAuth = authorizeOperatorScopesForMethod(opts.requiredOperatorMethod ?? "assistant.media.get", requestedScopes);
	if (!scopeAuth.allowed) {
		sendJson(res, 403, buildMissingScopeForbiddenBody(scopeAuth.missingScope));
		return false;
	}
	return true;
}
async function authorizeControlUiDeviceReadToken(token, opts) {
	const pairing = await listDevicePairing();
	for (const device of pairing.paired) {
		const operatorToken = device.tokens?.[CONTROL_UI_OPERATOR_ROLE];
		if (!operatorToken || operatorToken.revokedAtMs) continue;
		if (!verifyPairingToken(token, operatorToken.token)) continue;
		if ((await verifyDeviceToken({
			deviceId: device.deviceId,
			token,
			role: CONTROL_UI_OPERATOR_ROLE,
			scopes: [CONTROL_UI_OPERATOR_READ_SCOPE],
			requiredSharedGatewaySessionGeneration: opts.requiredSharedGatewaySessionGeneration
		})).ok) return true;
	}
	return false;
}
function signAssistantMediaTicketPayload(encodedPayload) {
	return createHmac("sha256", controlUiAssistantMediaTicketSecret).update(encodedPayload).digest("base64url");
}
function createAssistantMediaTicket(source, nowMs = Date.now()) {
	const now = asDateTimestampMs(nowMs);
	if (now === void 0) return {};
	const exp = asDateTimestampMs(now + CONTROL_UI_ASSISTANT_MEDIA_TICKET_TTL_MS);
	if (exp === void 0) return {};
	const payload = {
		scope: CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE,
		source,
		exp
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	return {
		mediaTicket: `v1.${encodedPayload}.${signAssistantMediaTicketPayload(encodedPayload)}`,
		mediaTicketExpiresAt: resolveTimestampMsToIsoString(exp)
	};
}
function verifyAssistantMediaTicket(ticket, source, nowMs = Date.now()) {
	const now = asDateTimestampMs(nowMs);
	if (now === void 0) return false;
	const parts = ticket?.split(".");
	if (!parts || parts.length !== 3 || parts[0] !== "v1") return false;
	const [, encodedPayload, sig] = parts;
	if (!encodedPayload || !sig) return false;
	const expectedSig = signAssistantMediaTicketPayload(encodedPayload);
	const sigBuffer = Buffer.from(sig, "base64url");
	const expectedBuffer = Buffer.from(expectedSig, "base64url");
	if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) return false;
	try {
		const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
		return payload.scope === CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE && payload.source === source && typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp >= now;
	} catch {
		return false;
	}
}
function classifyAssistantMediaError(err) {
	if (err instanceof FsSafeError) switch (err.code) {
		case "not-found": return {
			available: false,
			code: "file-not-found",
			reason: "File not found"
		};
		case "not-file": return {
			available: false,
			code: "not-a-file",
			reason: "Not a file"
		};
		case "invalid-path":
		case "path-mismatch":
		case "symlink": return {
			available: false,
			code: "invalid-file",
			reason: "Invalid file"
		};
		default: return {
			available: false,
			code: "attachment-unavailable",
			reason: "Attachment unavailable"
		};
	}
	if (err instanceof Error && "code" in err) {
		const errorCode = err.code;
		switch (typeof errorCode === "string" ? errorCode : "") {
			case "path-not-allowed": return {
				available: false,
				code: "outside-allowed-folders",
				reason: "Outside allowed folders"
			};
			case "invalid-file-url":
			case "invalid-path":
			case "unsafe-bypass":
			case "network-path-not-allowed":
			case "invalid-root": return {
				available: false,
				code: "blocked-local-file",
				reason: "Blocked local file"
			};
			case "not-found": return {
				available: false,
				code: "file-not-found",
				reason: "File not found"
			};
			case "not-file": return {
				available: false,
				code: "not-a-file",
				reason: "Not a file"
			};
			default: break;
		}
	}
	return {
		available: false,
		code: "attachment-unavailable",
		reason: "Attachment unavailable"
	};
}
async function resolveAssistantMediaAvailability(source, localRoots) {
	try {
		const localPath = await resolveMediaReferenceLocalPath(source);
		await assertLocalMediaAllowed(localPath, localRoots);
		await (await openLocalFileSafely({ filePath: localPath })).handle.close();
		return { available: true };
	} catch (err) {
		return classifyAssistantMediaError(err);
	}
}
async function handleControlUiAssistantMediaRequest(req, res, opts) {
	const urlRaw = req.url;
	if (!urlRaw || !isReadHttpMethod(req.method)) return false;
	const url = new URL(urlRaw, "http://localhost");
	if (url.pathname !== resolveAssistantMediaRoutePath(opts?.basePath)) return false;
	applyControlUiSecurityHeaders(res);
	const source = normalizeAssistantMediaSource(url.searchParams.get("source") ?? "");
	if (!source) {
		respondNotFound(res);
		return true;
	}
	const isMetaRequest = url.searchParams.get("meta") === "1";
	if (!(!isMetaRequest && verifyAssistantMediaTicket(url.searchParams.get("mediaTicket"), source)) && !await authorizeControlUiReadRequest(req, res, {
		auth: opts?.auth,
		trustedProxies: opts?.trustedProxies,
		allowRealIpFallback: opts?.allowRealIpFallback,
		rateLimiter: opts?.rateLimiter,
		allowQueryToken: true
	})) return true;
	const localRoots = opts?.config ? getAgentScopedMediaLocalRoots(opts.config, opts.agentId) : getDefaultLocalRoots();
	if (isMetaRequest) {
		const availability = await resolveAssistantMediaAvailability(source, localRoots);
		sendJson(res, 200, availability.available ? {
			...availability,
			...createAssistantMediaTicket(source)
		} : availability);
		return true;
	}
	let opened = null;
	let localPath;
	let handleClosed = false;
	const closeOpenedHandle = async () => {
		if (!opened || handleClosed) return;
		handleClosed = true;
		await opened.handle.close().catch(() => {});
	};
	try {
		const resolvedReference = await resolveMediaReferenceLocalPathInfo(source);
		localPath = resolvedReference.path;
		await assertLocalMediaAllowed(localPath, localRoots);
		opened = await openLocalFileSafely({ filePath: localPath });
		const sniffLength = Math.min(opened.stat.size, 8192);
		const sniffBuffer = sniffLength > 0 ? Buffer.allocUnsafe(sniffLength) : void 0;
		const bytesRead = sniffBuffer && sniffLength > 0 ? (await opened.handle.read(sniffBuffer, 0, sniffLength, 0)).bytesRead : 0;
		const contentType = await detectMime({
			buffer: sniffBuffer?.subarray(0, bytesRead),
			filePath: localPath
		}) ?? "application/octet-stream";
		const filename = resolvedReference.kind === "inbound" ? extractOriginalFilename(localPath) : path.basename(localPath);
		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Disposition", buildAssistantMediaContentDisposition(filename, contentType));
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Content-Length", String(opened.stat.size));
		const stream = opened.handle.createReadStream({
			start: 0,
			autoClose: false
		});
		const finishClose = () => {
			closeOpenedHandle();
		};
		stream.once("end", finishClose);
		stream.once("close", finishClose);
		stream.once("error", () => {
			closeOpenedHandle();
			if (!res.headersSent) respondNotFound(res);
			else res.destroy();
		});
		res.once("close", finishClose);
		stream.pipe(res);
		return true;
	} catch {
		await closeOpenedHandle();
		respondNotFound(res);
		return true;
	}
}
async function handleControlUiAvatarRequest(req, res, opts) {
	const urlRaw = req.url;
	if (!urlRaw) return false;
	if (!isReadHttpMethod(req.method)) return false;
	const url = new URL(urlRaw, "http://localhost");
	const basePath = normalizeControlUiBasePath(opts.basePath);
	const pathname = url.pathname;
	const pathWithBase = basePath ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/` : `${CONTROL_UI_AVATAR_PREFIX}/`;
	if (!pathname.startsWith(pathWithBase)) return false;
	applyControlUiSecurityHeaders(res);
	const agentIdParts = pathname.slice(pathWithBase.length).split("/").filter(Boolean);
	const agentId = agentIdParts[0] ?? "";
	if (agentIdParts.length !== 1 || !agentId || !isValidAgentId(agentId)) {
		respondNotFound(res);
		return true;
	}
	if (!await authorizeControlUiReadRequest(req, res, {
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	})) return true;
	if (url.searchParams.get("meta") === "1") {
		const resolved = opts.resolveAvatar(agentId);
		const meta = controlUiAvatarResolutionMeta(resolved);
		sendJson(res, 200, {
			avatarUrl: resolved.kind === "local" ? buildControlUiAvatarUrl(basePath, agentId) : resolved.kind === "remote" || resolved.kind === "data" ? resolved.url : null,
			avatarSource: meta.avatarSource,
			avatarStatus: meta.avatarStatus ?? resolved.kind,
			avatarReason: meta.avatarReason
		});
		return true;
	}
	const resolved = opts.resolveAvatar(agentId);
	if (resolved.kind !== "local") {
		respondNotFound(res);
		return true;
	}
	const safeAvatar = await resolveSafeAvatarFile(resolved.filePath);
	if (!safeAvatar) {
		respondNotFound(res);
		return true;
	}
	if (respondHeadForFile(req, res, safeAvatar.path)) return true;
	serveResolvedFile(res, safeAvatar.path, safeAvatar.buffer);
	return true;
}
function setStaticFileHeaders(res, filePath) {
	const ext = path.extname(filePath).toLowerCase();
	res.setHeader("Content-Type", contentTypeForExt(ext));
	res.setHeader("Cache-Control", "no-cache");
}
function serveResolvedFile(res, filePath, body) {
	setStaticFileHeaders(res, filePath);
	res.end(body);
}
function serveResolvedIndexHtml(res, body, basePath, allowWasm) {
	const normalizedBasePath = normalizeControlUiBasePath(basePath);
	const withBasePath = rewriteControlUiIndexHtmlPublicAssetHrefs(body, normalizedBasePath);
	const basePathAttribute = normalizedBasePath ? ` ${CONTROL_UI_BASE_PATH_ATTRIBUTE}="${escapeHtmlAttribute(normalizedBasePath)}"` : "";
	const prepared = withBasePath.replace(/<html\b/i, `<html${basePathAttribute} ${CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE}="${allowWasm === true}"`);
	const hashes = computeInlineScriptHashes(prepared);
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader({
		inlineScriptHashes: hashes,
		allowWasm
	}));
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-cache");
	res.end(prepared);
}
function readOpenedFile(fd) {
	return new Promise((resolve, reject) => {
		fs.readFile(fd, (error, data) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(data);
		});
	});
}
async function readOpenedFileText(fd) {
	return (await readOpenedFile(fd)).toString("utf8");
}
function isExpectedSafePathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
async function resolveSafeAvatarFile(filePath) {
	try {
		const read = await readSecureFile({
			filePath,
			label: "Control UI avatar",
			permissions: {
				allowInsecure: true,
				allowReadableByOthers: true
			},
			io: { maxBytes: AVATAR_MAX_BYTES }
		});
		return {
			path: read.realPath,
			buffer: read.buffer
		};
	} catch {
		return null;
	}
}
function resolveSafeControlUiFile(rootReal, filePath, rejectHardlinks) {
	const opened = openRootFileSync({
		absolutePath: filePath,
		rootPath: rootReal,
		rootRealPath: rootReal,
		boundaryLabel: "control ui root",
		skipLexicalRootCheck: true,
		rejectHardlinks
	});
	if (!opened.ok) return matchRootFileOpenFailure(opened, {
		io: (failure) => {
			throw failure.error;
		},
		fallback: () => null
	});
	return {
		path: opened.path,
		fd: opened.fd
	};
}
function isSafeRelativePath(relPath) {
	if (!relPath) return false;
	const normalized = path.posix.normalize(relPath);
	if (path.posix.isAbsolute(normalized) || path.win32.isAbsolute(normalized)) return false;
	if (normalized.startsWith("../") || normalized === "..") return false;
	if (normalized.includes("\0")) return false;
	return true;
}
const CONTROL_UI_DEFAULT_NAMESPACE_BOOTSTRAP_CONFIG_PATH = `${CONTROL_UI_NAMESPACE_PREFIX.replace(/\/$/, "")}${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`;
const LEGACY_BOOTSTRAP_CONFIG_PATH = `/__openclaw${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`;
/**
* Whether `pathname` should be served the Control UI bootstrap config payload.
*
* The canonical endpoint is the configured base path joined with the shared
* bootstrap constant (or the bare constant when no base path is configured).
* For every base path (configured or empty) we additionally accept the legacy
* single-underscore suffix `${basePath}/__openclaw/control-ui-config.json` that
* current main and v2026.6.1 serve and document, so older bundles and clients
* that still request the pre-#66946 endpoint keep receiving config after an
* upgrade instead of 404ing. When no base path is configured we further accept
* the default-namespace alias `/__openclaw__/control-ui-config.json`, which is
* what the default `/__openclaw__/` entry requests after inferring its base path
* from the URL. All compatibility endpoints are preserved; no path is removed.
*/
function matchesControlUiBootstrapConfigPath(pathname, basePath) {
	if (pathname === `${basePath}/control-ui-config.json` || pathname === `${basePath}${LEGACY_BOOTSTRAP_CONFIG_PATH}`) return true;
	return basePath === "" && pathname === CONTROL_UI_DEFAULT_NAMESPACE_BOOTSTRAP_CONFIG_PATH;
}
async function handleControlUiHttpRequest(req, res, opts) {
	const urlRaw = req.url;
	if (!urlRaw) return false;
	const url = new URL(urlRaw, "http://localhost");
	const basePath = normalizeControlUiBasePath(opts?.basePath);
	const pathname = url.pathname;
	const terminalEnabled = opts?.terminalEnabled ?? opts?.config?.gateway?.terminal?.enabled === true;
	const route = classifyControlUiRequest({
		basePath,
		pathname,
		search: url.search,
		method: req.method
	});
	if (route.kind === "not-control-ui") return false;
	if (route.kind === "not-found") {
		applyControlUiSecurityHeaders(res);
		respondNotFound(res);
		return true;
	}
	if (route.kind === "redirect") {
		applyControlUiSecurityHeaders(res);
		res.statusCode = 302;
		res.setHeader("Location", route.location);
		res.end();
		return true;
	}
	applyControlUiSecurityHeaders(res);
	if (matchesControlUiBootstrapConfigPath(pathname, basePath)) {
		if (!await authorizeControlUiReadRequest(req, res, {
			auth: opts?.auth,
			trustedProxies: opts?.trustedProxies,
			allowRealIpFallback: opts?.allowRealIpFallback,
			rateLimiter: opts?.rateLimiter
		})) return true;
		const config = opts?.config;
		const identity = config ? resolveAssistantIdentity({
			cfg: config,
			agentId: opts?.agentId
		}) : DEFAULT_ASSISTANT_IDENTITY;
		const avatarValue = resolveAssistantAvatarUrl({
			avatar: identity.avatar,
			agentId: identity.agentId,
			basePath
		});
		const avatarMeta = config ? controlUiAvatarResolutionMeta(resolveAgentAvatar(config, identity.agentId, { includeUiOverride: true })) : controlUiAvatarResolutionMeta(null);
		if (req.method === "HEAD") {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.setHeader("Cache-Control", "no-cache");
			res.end();
			return true;
		}
		sendJson(res, 200, {
			basePath,
			assistantName: identity.name,
			assistantAvatar: avatarValue ?? identity.avatar,
			assistantAvatarSource: avatarMeta.avatarSource,
			assistantAvatarStatus: avatarMeta.avatarStatus,
			assistantAvatarReason: avatarMeta.avatarReason,
			assistantAgentId: identity.agentId,
			serverVersion: resolveRuntimeServiceVersion(process.env),
			localMediaPreviewRoots: [...getAgentScopedMediaLocalRoots(config ?? {}, identity.agentId)],
			embedSandbox: config?.gateway?.controlUi?.embedSandbox === "trusted" ? "trusted" : config?.gateway?.controlUi?.embedSandbox === "strict" ? "strict" : "scripts",
			allowExternalEmbedUrls: config?.gateway?.controlUi?.allowExternalEmbedUrls === true,
			chatMessageMaxWidth: config?.gateway?.controlUi?.chatMessageMaxWidth,
			seamColor: config?.ui?.seamColor,
			timeFormat: config?.agents?.defaults?.timeFormat,
			terminalEnabled
		});
		return true;
	}
	const rootState = opts?.root;
	if (rootState?.kind === "invalid") {
		respondControlUiAssetsUnavailable(res, { configuredRootPath: rootState.path });
		return true;
	}
	if (rootState?.kind === "missing") {
		respondControlUiAssetsUnavailable(res);
		return true;
	}
	const root = rootState?.kind === "resolved" || rootState?.kind === "bundled" ? rootState.path : resolveControlUiRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (!root) {
		respondControlUiAssetsUnavailable(res);
		return true;
	}
	const rootReal = (() => {
		try {
			return fs.realpathSync(root);
		} catch (error) {
			if (isExpectedSafePathError(error)) return null;
			throw error;
		}
	})();
	if (!rootReal) {
		respondControlUiAssetsUnavailable(res);
		return true;
	}
	const uiPath = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
	const rel = (() => {
		if (uiPath === ROOT_PREFIX) return "";
		if (uiPath.startsWith(CONTROL_UI_NAMESPACE_PREFIX)) {
			const namespacedRel = uiPath.slice(14);
			if (CONTROL_UI_ROOT_PUBLIC_ASSETS.has(namespacedRel)) return namespacedRel;
		}
		const assetsIndex = uiPath.indexOf("/assets/");
		if (assetsIndex >= 0) return uiPath.slice(assetsIndex + 1);
		return uiPath.slice(1);
	})();
	const fileRel = (rel && !rel.endsWith("/") ? rel : `${rel}index.html`) || "index.html";
	if (!isSafeRelativePath(fileRel)) {
		respondNotFound(res);
		return true;
	}
	const filePath = path.resolve(root, fileRel);
	if (!isWithinDir(root, filePath)) {
		respondNotFound(res);
		return true;
	}
	const rejectHardlinks = !(rootState?.kind === "bundled" || rootState === void 0 && isPackageProvenControlUiRootSync(root, {
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	}));
	const safeFile = resolveSafeControlUiFile(rootReal, filePath, rejectHardlinks);
	if (safeFile) try {
		if (respondHeadForFile(req, res, safeFile.path)) return true;
		if (path.basename(safeFile.path) === "index.html") {
			serveResolvedIndexHtml(res, await readOpenedFileText(safeFile.fd), basePath, terminalEnabled);
			return true;
		}
		serveResolvedFile(res, safeFile.path, await readOpenedFile(safeFile.fd));
		return true;
	} finally {
		fs.closeSync(safeFile.fd);
	}
	if (STATIC_ASSET_EXTENSIONS.has(path.extname(fileRel).toLowerCase())) {
		respondNotFound(res);
		return true;
	}
	const safeIndex = resolveSafeControlUiFile(rootReal, path.join(root, "index.html"), rejectHardlinks);
	if (safeIndex) try {
		if (respondHeadForFile(req, res, safeIndex.path)) return true;
		serveResolvedIndexHtml(res, await readOpenedFileText(safeIndex.fd), basePath, terminalEnabled);
		return true;
	} finally {
		fs.closeSync(safeIndex.fd);
	}
	respondNotFound(res);
	return true;
}
//#endregion
export { handleControlUiAssistantMediaRequest, handleControlUiAvatarRequest, handleControlUiHttpRequest };
