import { definePluginEntry, resolvePreferredOpenClawTmpDir } from "./api.js";
import { resolveRequestClientIp } from "./runtime-api.js";
import { a as getServedViewerAsset, r as VIEWER_RUNTIME_PATH } from "./.setup/viewer-assets-D3qrnaxI.mjs";
import { buildPluginConfigSchema } from "openclaw/plugin-sdk/plugin-entry";
import { mapPluginConfigIssues } from "openclaw/plugin-sdk/extension-shared";
import { z } from "zod";
import { resolveGatewayPublicOrigin } from "openclaw/plugin-sdk/config-contracts";
import { resolveGatewayPort } from "openclaw/plugin-sdk/gateway-config-runtime";
import fs from "node:fs";
import path from "node:path";
import { resolveLivePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { isLoopbackHost } from "openclaw/plugin-sdk/ssrf-runtime";
import { asNonArrayRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAuthRateLimiter } from "openclaw/plugin-sdk/webhook-ingress";
import crypto from "node:crypto";
import fs$1 from "node:fs/promises";
import { gunzip, gzip } from "node:zlib";
import { runTasksWithConcurrency } from "openclaw/plugin-sdk/concurrency-runtime";
import { MAX_DATE_TIMESTAMP_MS, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { optionalFiniteNumberSchema, stringEnum } from "openclaw/plugin-sdk/channel-actions";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { readFiniteNumberParam } from "openclaw/plugin-sdk/param-readers";
import { Type } from "typebox";
import { parsePatchFiles, resolveLanguage } from "@pierre/diffs";
import { preloadDiffHTML } from "@pierre/diffs/ssr";
import { escapeHtml } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/diffs/src/types.ts
const DIFF_LAYOUTS = ["unified", "split"];
const DIFF_MODES = [
	"view",
	"image",
	"file",
	"both"
];
const DIFF_THEMES = ["light", "dark"];
const DIFF_INDICATORS = [
	"bars",
	"classic",
	"none"
];
const DIFF_IMAGE_QUALITY_PRESETS = [
	"standard",
	"hq",
	"print"
];
const DIFF_OUTPUT_FORMATS = ["png", "pdf"];
const DIFF_ARTIFACT_ID_PATTERN = /^[0-9a-f]{20}$/;
const DIFF_ARTIFACT_TOKEN_PATTERN = /^[0-9a-f]{48}$/;
//#endregion
//#region extensions/diffs/src/url.ts
function buildViewerUrl(params) {
	const normalizedBase = normalizeViewerBaseUrl(params.baseUrl?.trim() || params.viewerBaseUrl?.trim() || resolveGatewayPublicOrigin(params.config) || resolveGatewayBaseUrl(params.config));
	const viewerPath = params.viewerPath.startsWith("/") ? params.viewerPath : `/${params.viewerPath}`;
	const parsedBase = new URL(normalizedBase);
	parsedBase.pathname = `${parsedBase.pathname === "/" ? "" : parsedBase.pathname.replace(/\/+$/, "")}${viewerPath}`;
	parsedBase.search = "";
	parsedBase.hash = "";
	return parsedBase.toString();
}
function normalizeViewerBaseUrl(raw, fieldName = "baseUrl") {
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error(`Invalid ${fieldName}: ${raw}`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`${fieldName} must use http or https: ${raw}`);
	if (parsed.search || parsed.hash) throw new Error(`${fieldName} must not include query/hash: ${raw}`);
	parsed.search = "";
	parsed.hash = "";
	parsed.pathname = parsed.pathname.replace(/\/+$/, "");
	return parsed.toString().replace(/\/+$/, "");
}
function resolveGatewayBaseUrl(config) {
	const scheme = config.gateway?.tls?.enabled ? "https" : "http";
	const port = resolveGatewayPort(config);
	const customHost = config.gateway?.customBindHost?.trim();
	if (config.gateway?.bind === "custom" && customHost) return `${scheme}://${customHost}:${port}`;
	return `${scheme}://127.0.0.1:${port}`;
}
//#endregion
//#region extensions/diffs/src/config.ts
const DEFAULT_IMAGE_QUALITY_PROFILES = {
	standard: {
		scale: 2,
		maxWidth: 960,
		maxPixels: 8e6
	},
	hq: {
		scale: 2.5,
		maxWidth: 1200,
		maxPixels: 14e6
	},
	print: {
		scale: 3,
		maxWidth: 1400,
		maxPixels: 24e6
	}
};
const DEFAULT_DIFFS_TOOL_DEFAULTS = {
	fontFamily: "Fira Code",
	fontSize: 15,
	lineSpacing: 1.6,
	layout: "unified",
	showLineNumbers: true,
	diffIndicators: "bars",
	wordWrap: true,
	background: true,
	theme: "dark",
	fileFormat: "png",
	fileQuality: "standard",
	fileScale: DEFAULT_IMAGE_QUALITY_PROFILES.standard.scale,
	fileMaxWidth: DEFAULT_IMAGE_QUALITY_PROFILES.standard.maxWidth,
	mode: "both",
	ttlSeconds: 1800
};
const DEFAULT_DIFFS_PLUGIN_SECURITY = { allowRemoteViewer: false };
const VIEWER_BASE_URL_JSON_SCHEMA = {
	type: "string",
	format: "uri",
	pattern: "^[Hh][Tt][Tt][Pp][Ss]?://",
	not: { pattern: "[?#]" }
};
const DiffsPluginJsonSchemaSource = z.strictObject({
	viewerBaseUrl: z.string().superRefine((value, ctx) => {
		try {
			normalizeViewerBaseUrl(value, "viewerBaseUrl");
		} catch (error) {
			ctx.addIssue({
				code: "custom",
				message: error instanceof Error ? error.message : "Invalid viewerBaseUrl"
			});
		}
	}).optional(),
	defaults: z.strictObject({
		fontFamily: z.string().default(DEFAULT_DIFFS_TOOL_DEFAULTS.fontFamily).optional(),
		fontSize: z.number().min(10).max(24).default(DEFAULT_DIFFS_TOOL_DEFAULTS.fontSize).optional(),
		lineSpacing: z.number().min(1).max(3).default(DEFAULT_DIFFS_TOOL_DEFAULTS.lineSpacing).optional(),
		layout: z.enum(DIFF_LAYOUTS).default(DEFAULT_DIFFS_TOOL_DEFAULTS.layout).optional(),
		showLineNumbers: z.boolean().default(DEFAULT_DIFFS_TOOL_DEFAULTS.showLineNumbers).optional(),
		diffIndicators: z.enum(DIFF_INDICATORS).default(DEFAULT_DIFFS_TOOL_DEFAULTS.diffIndicators).optional(),
		wordWrap: z.boolean().default(DEFAULT_DIFFS_TOOL_DEFAULTS.wordWrap).optional(),
		background: z.boolean().default(DEFAULT_DIFFS_TOOL_DEFAULTS.background).optional(),
		theme: z.enum(DIFF_THEMES).default(DEFAULT_DIFFS_TOOL_DEFAULTS.theme).optional(),
		fileFormat: z.enum(DIFF_OUTPUT_FORMATS).optional(),
		format: z.enum(DIFF_OUTPUT_FORMATS).optional().describe("Deprecated alias for fileFormat."),
		fileQuality: z.enum(DIFF_IMAGE_QUALITY_PRESETS).optional(),
		fileScale: z.number().min(1).max(4).optional(),
		fileMaxWidth: z.number().min(640).max(2400).optional(),
		imageFormat: z.enum(DIFF_OUTPUT_FORMATS).optional().describe("Deprecated alias for fileFormat."),
		imageQuality: z.enum(DIFF_IMAGE_QUALITY_PRESETS).optional().describe("Deprecated alias for fileQuality."),
		imageScale: z.number().min(1).max(4).optional().describe("Deprecated alias for fileScale."),
		imageMaxWidth: z.number().min(640).max(2400).optional().describe("Deprecated alias for fileMaxWidth."),
		mode: z.enum(DIFF_MODES).default(DEFAULT_DIFFS_TOOL_DEFAULTS.mode).optional(),
		ttlSeconds: z.number().min(1).max(21600).default(DEFAULT_DIFFS_TOOL_DEFAULTS.ttlSeconds).optional()
	}).optional(),
	security: z.strictObject({ allowRemoteViewer: z.boolean().default(DEFAULT_DIFFS_PLUGIN_SECURITY.allowRemoteViewer).optional() }).optional()
});
const diffsPluginConfigSchemaBase = buildPluginConfigSchema(DiffsPluginJsonSchemaSource, { safeParse(value) {
	if (value === void 0) return {
		success: true,
		data: void 0
	};
	const result = DiffsPluginJsonSchemaSource.safeParse(value);
	if (result.success) return {
		success: true,
		data: buildDiffsPluginConfigShape(result.data)
	};
	return {
		success: false,
		error: { issues: mapPluginConfigIssues(result.error.issues) }
	};
} });
const diffsPluginConfigSchema = {
	...diffsPluginConfigSchemaBase,
	jsonSchema: {
		...diffsPluginConfigSchemaBase.jsonSchema,
		properties: {
			...diffsPluginConfigSchemaBase.jsonSchema.properties,
			viewerBaseUrl: VIEWER_BASE_URL_JSON_SCHEMA
		}
	}
};
function resolveConfiguredValue(options) {
	const alias = options.aliases.find((value) => value !== void 0);
	return options.primary ?? alias;
}
function buildDiffsPluginConfigShape(config) {
	const viewerBaseUrl = resolveDiffsPluginViewerBaseUrl(config);
	return {
		...viewerBaseUrl !== void 0 ? { viewerBaseUrl } : {},
		...config.defaults !== void 0 ? { defaults: resolveDiffsPluginDefaults(config) } : {},
		...config.security !== void 0 ? { security: resolveDiffsPluginSecurity(config) } : {}
	};
}
function resolveDiffsPluginDefaults(config) {
	if (!config || typeof config !== "object" || Array.isArray(config)) return { ...DEFAULT_DIFFS_TOOL_DEFAULTS };
	const defaults = config.defaults;
	if (!defaults || typeof defaults !== "object" || Array.isArray(defaults)) return { ...DEFAULT_DIFFS_TOOL_DEFAULTS };
	const fileQuality = normalizeFileQuality$1(resolveConfiguredValue({
		primary: defaults.fileQuality,
		aliases: [defaults.imageQuality]
	}));
	const profile = DEFAULT_IMAGE_QUALITY_PROFILES[fileQuality];
	const fileFormat = resolveConfiguredValue({
		primary: defaults.fileFormat,
		aliases: [defaults.imageFormat, defaults.format]
	});
	const fileScale = resolveConfiguredValue({
		primary: defaults.fileScale,
		aliases: [defaults.imageScale]
	});
	const fileMaxWidth = resolveConfiguredValue({
		primary: defaults.fileMaxWidth,
		aliases: [defaults.imageMaxWidth]
	});
	return {
		fontFamily: normalizeFontFamily(defaults.fontFamily),
		fontSize: normalizeDiffFontSize(defaults.fontSize),
		lineSpacing: normalizeDiffLineSpacing(defaults.lineSpacing),
		layout: normalizeLayout$1(defaults.layout),
		showLineNumbers: defaults.showLineNumbers !== false,
		diffIndicators: normalizeDiffIndicators(defaults.diffIndicators),
		wordWrap: defaults.wordWrap !== false,
		background: defaults.background !== false,
		theme: normalizeTheme$1(defaults.theme),
		fileFormat: normalizeFileFormat(fileFormat),
		fileQuality,
		fileScale: normalizeFileScale(fileScale, profile.scale),
		fileMaxWidth: normalizeFileMaxWidth(fileMaxWidth, profile.maxWidth),
		mode: normalizeMode$1(defaults.mode),
		ttlSeconds: normalizeTtlSeconds(defaults.ttlSeconds)
	};
}
function resolveDiffsPluginSecurity(config) {
	if (!config || typeof config !== "object" || Array.isArray(config)) return { ...DEFAULT_DIFFS_PLUGIN_SECURITY };
	const security = config.security;
	if (!security || typeof security !== "object" || Array.isArray(security)) return { ...DEFAULT_DIFFS_PLUGIN_SECURITY };
	return { allowRemoteViewer: security.allowRemoteViewer === true };
}
function resolveDiffsPluginViewerBaseUrl(config) {
	if (!config || typeof config !== "object" || Array.isArray(config)) return;
	const viewerBaseUrl = config.viewerBaseUrl;
	if (typeof viewerBaseUrl !== "string") return;
	const normalized = viewerBaseUrl.trim();
	return normalized ? normalizeViewerBaseUrl(normalized) : void 0;
}
function normalizeFontFamily(fontFamily) {
	return fontFamily?.trim() || DEFAULT_DIFFS_TOOL_DEFAULTS.fontFamily;
}
function normalizeDiffFontSize(fontSize) {
	if (fontSize === void 0 || !Number.isFinite(fontSize)) return DEFAULT_DIFFS_TOOL_DEFAULTS.fontSize;
	return Math.min(Math.max(Math.floor(fontSize), 10), 24);
}
function normalizeDiffLineSpacing(lineSpacing) {
	if (lineSpacing === void 0 || !Number.isFinite(lineSpacing)) return DEFAULT_DIFFS_TOOL_DEFAULTS.lineSpacing;
	return Math.min(Math.max(lineSpacing, 1), 3);
}
function normalizeLayout$1(layout) {
	return layout && DIFF_LAYOUTS.includes(layout) ? layout : DEFAULT_DIFFS_TOOL_DEFAULTS.layout;
}
function normalizeDiffIndicators(diffIndicators) {
	return diffIndicators && DIFF_INDICATORS.includes(diffIndicators) ? diffIndicators : DEFAULT_DIFFS_TOOL_DEFAULTS.diffIndicators;
}
function normalizeTheme$1(theme) {
	return theme && DIFF_THEMES.includes(theme) ? theme : DEFAULT_DIFFS_TOOL_DEFAULTS.theme;
}
function normalizeFileFormat(fileFormat) {
	return fileFormat && DIFF_OUTPUT_FORMATS.includes(fileFormat) ? fileFormat : DEFAULT_DIFFS_TOOL_DEFAULTS.fileFormat;
}
function normalizeFileQuality$1(fileQuality) {
	return fileQuality && DIFF_IMAGE_QUALITY_PRESETS.includes(fileQuality) ? fileQuality : DEFAULT_DIFFS_TOOL_DEFAULTS.fileQuality;
}
function normalizeFileScale(fileScale, fallback) {
	if (fileScale === void 0 || !Number.isFinite(fileScale)) return fallback;
	const rounded = Math.round(fileScale * 100) / 100;
	return Math.min(Math.max(rounded, 1), 4);
}
function normalizeFileMaxWidth(fileMaxWidth, fallback) {
	if (fileMaxWidth === void 0 || !Number.isFinite(fileMaxWidth)) return fallback;
	return Math.min(Math.max(Math.round(fileMaxWidth), 640), 2400);
}
function normalizeMode$1(mode) {
	return mode && DIFF_MODES.includes(mode) ? mode : DEFAULT_DIFFS_TOOL_DEFAULTS.mode;
}
function normalizeTtlSeconds(ttlSeconds) {
	if (ttlSeconds === void 0 || !Number.isFinite(ttlSeconds)) return DEFAULT_DIFFS_TOOL_DEFAULTS.ttlSeconds;
	return Math.min(Math.max(Math.floor(ttlSeconds), 1), 21600);
}
function resolveDiffImageRenderOptions(params) {
	const format = normalizeFileFormat(params.fileFormat ?? params.defaults.fileFormat);
	const qualityOverrideProvided = params.fileQuality !== void 0;
	const qualityPreset = normalizeFileQuality$1(params.fileQuality ?? params.defaults.fileQuality);
	const profile = DEFAULT_IMAGE_QUALITY_PROFILES[qualityPreset];
	return {
		format,
		qualityPreset,
		scale: normalizeFileScale(params.fileScale, qualityOverrideProvided ? profile.scale : params.defaults.fileScale),
		maxWidth: normalizeFileMaxWidth(params.fileMaxWidth, qualityOverrideProvided ? profile.maxWidth : params.defaults.fileMaxWidth),
		maxPixels: profile.maxPixels
	};
}
//#endregion
//#region extensions/diffs/src/http.ts
const VIEW_PREFIX = "/plugins/diffs/view/";
const VIEWER_MAX_FAILURES_PER_WINDOW = 40;
const VIEWER_FAILURE_WINDOW_MS = 6e4;
const VIEWER_LOCKOUT_MS = 6e4;
const VIEWER_LIMITER_MAX_KEYS = 2048;
const VIEWER_CONTENT_SECURITY_POLICY = [
	"default-src 'none'",
	"script-src 'self'",
	"style-src 'unsafe-inline'",
	"img-src 'self' data:",
	"font-src 'self' data:",
	"connect-src 'none'",
	"base-uri 'none'",
	"frame-ancestors 'self'",
	"object-src 'none'"
].join("; ");
const IMMUTABLE_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";
function createDiffsHttpHandler(params) {
	const viewerFailureLimiter = createAuthRateLimiter({
		maxAttempts: VIEWER_MAX_FAILURES_PER_WINDOW,
		windowMs: VIEWER_FAILURE_WINDOW_MS,
		lockoutMs: VIEWER_LOCKOUT_MS,
		exemptLoopback: false,
		pruneIntervalMs: 0,
		maxEntries: VIEWER_LIMITER_MAX_KEYS
	});
	return async (req, res) => {
		const parsed = parseRequestUrl(req.url);
		if (!parsed) return false;
		if (parsed.pathname.startsWith("/plugins/diffs/assets/")) return await serveAsset(req, res, parsed.pathname, params.logger);
		if (!parsed.pathname.startsWith(VIEW_PREFIX)) return false;
		const accessConfig = params.resolveAccessConfig?.() ?? {
			allowRemoteViewer: params.allowRemoteViewer,
			trustedProxies: params.trustedProxies,
			allowRealIpFallback: params.allowRealIpFallback
		};
		const access = resolveViewerAccess(req, {
			trustedProxies: accessConfig.trustedProxies,
			allowRealIpFallback: accessConfig.allowRealIpFallback
		});
		if (!access.localRequest && accessConfig.allowRemoteViewer !== true) {
			respondText(res, 404, "Diff not found");
			return true;
		}
		if (req.method !== "GET" && req.method !== "HEAD") {
			respondText(res, 405, "Method not allowed");
			return true;
		}
		if (!access.localRequest) {
			const throttled = viewerFailureLimiter.check(access.remoteKey);
			if (!throttled.allowed) {
				res.setHeader("Retry-After", String(Math.max(1, Math.ceil(throttled.retryAfterMs / 1e3))));
				respondText(res, 429, "Too Many Requests");
				return true;
			}
		}
		const pathParts = parsed.pathname.split("/").filter(Boolean);
		const id = pathParts[3];
		const token = pathParts[4];
		if (!id || !token || !DIFF_ARTIFACT_ID_PATTERN.test(id) || !DIFF_ARTIFACT_TOKEN_PATTERN.test(token)) {
			recordRemoteFailure(viewerFailureLimiter, access);
			respondText(res, 404, "Diff not found");
			return true;
		}
		try {
			const viewer = await params.store.readAuthorizedViewer(id, token);
			if (!viewer) {
				recordRemoteFailure(viewerFailureLimiter, access);
				respondText(res, 404, "Diff not found or expired");
				return true;
			}
			resetRemoteFailures(viewerFailureLimiter, access);
			res.statusCode = 200;
			setSharedHeaders(res, "text/html; charset=utf-8");
			res.setHeader("content-security-policy", VIEWER_CONTENT_SECURITY_POLICY);
			res.setHeader("content-length", String(viewer.html.byteLength));
			if (req.method === "HEAD") res.end();
			else res.end(Buffer.from(viewer.html));
			return true;
		} catch (error) {
			recordRemoteFailure(viewerFailureLimiter, access);
			params.logger?.warn(`Failed to serve diff artifact ${id}: ${String(error)}`);
			respondText(res, 500, "Failed to load diff");
			return true;
		}
	};
}
function parseRequestUrl(rawUrl) {
	if (!rawUrl) return null;
	try {
		return new URL(rawUrl, "http://127.0.0.1");
	} catch {
		return null;
	}
}
async function serveAsset(req, res, pathname, logger) {
	if (req.method !== "GET" && req.method !== "HEAD") {
		respondText(res, 405, "Method not allowed");
		return true;
	}
	try {
		const asset = await getServedViewerAsset(pathname);
		if (!asset) {
			respondText(res, 404, "Asset not found");
			return true;
		}
		res.statusCode = 200;
		setSharedHeaders(res, asset.contentType, pathname === VIEWER_RUNTIME_PATH ? IMMUTABLE_ASSET_CACHE_CONTROL : void 0);
		res.setHeader("content-length", String(Buffer.byteLength(asset.body)));
		if (req.method === "HEAD") res.end();
		else res.end(asset.body);
		return true;
	} catch (error) {
		logger?.warn(`Failed to serve diffs asset ${pathname}: ${String(error)}`);
		respondText(res, 500, "Failed to load asset");
		return true;
	}
}
function respondText(res, statusCode, body) {
	res.statusCode = statusCode;
	setSharedHeaders(res, "text/plain; charset=utf-8");
	res.setHeader("content-length", String(Buffer.byteLength(body)));
	res.end(body);
}
function setSharedHeaders(res, contentType, cacheControl = "no-store, max-age=0") {
	res.setHeader("cache-control", cacheControl);
	res.setHeader("content-type", contentType);
	res.setHeader("x-content-type-options", "nosniff");
	res.setHeader("referrer-policy", "no-referrer");
}
function normalizeRemoteClientKey(remoteAddress) {
	const normalized = normalizeLowercaseStringOrEmpty(remoteAddress);
	if (!normalized) return "unknown";
	return normalized.startsWith("::ffff:") ? normalized.slice(7) : normalized;
}
function isLoopbackClientIp(clientIp) {
	return isLoopbackHost(clientIp);
}
function hasProxyForwardingHints(req) {
	const headers = req.headers ?? {};
	return Boolean(headers["x-forwarded-for"] || headers["x-real-ip"] || headers.forwarded || headers["x-forwarded-host"] || headers["x-forwarded-proto"]);
}
function resolveViewerAccess(req, params) {
	const proxyHintsPresent = hasProxyForwardingHints(req);
	const clientIp = proxyHintsPresent || (params.trustedProxies?.length ?? 0) > 0 ? resolveRequestClientIp(req, params.trustedProxies ? [...params.trustedProxies] : void 0, params.allowRealIpFallback === true) : req.socket?.remoteAddress;
	const remoteKey = normalizeRemoteClientKey(clientIp ?? req.socket?.remoteAddress);
	return {
		remoteKey,
		localRequest: !proxyHintsPresent && typeof clientIp === "string" && isLoopbackClientIp(remoteKey)
	};
}
function recordRemoteFailure(limiter, access) {
	if (!access.localRequest) limiter.recordFailure(access.remoteKey);
}
function resetRemoteFailures(limiter, access) {
	if (!access.localRequest) limiter.reset(access.remoteKey);
}
//#endregion
//#region extensions/diffs/src/prompt-guidance.ts
const DIFFS_AGENT_GUIDANCE = [
	"When you need to show edits as a real diff, prefer the `diffs` tool instead of writing a manual summary.",
	"It accepts either `before` + `after` text or a unified `patch`.",
	"Check `details.changed`: identical before/after input returns `false` without creating an artifact; rendered results return `true`.",
	"`mode=view` returns `details.viewerUrl` for interactive viewing; `mode=file` returns `details.filePath`; `mode=both` returns both.",
	"To send the rendered file, use an available file-sending tool to send `details.filePath` as an attachment.",
	"Include `path` when you know the filename, and omit presentation overrides unless needed."
].join("\n");
//#endregion
//#region extensions/diffs/src/store.ts
const DEFAULT_TTL_MS = 18e5;
const MAX_TTL_MS = 216e5;
const SWEEP_FALLBACK_AGE_MS = 864e5;
const DEFAULT_CLEANUP_INTERVAL_MS = 3e5;
const CLEANUP_CONCURRENCY = 4;
const MAX_DECODED_HTML_BYTES = 67108864;
const ARTIFACT_ID_ATTEMPTS = 8;
const VIEWER_PREFIX = "/plugins/diffs/view";
const EMPTY_BLOB = /* @__PURE__ */ new Uint8Array();
function isBlobLimitError(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "PLUGIN_BLOB_LIMIT_EXCEEDED";
}
var DiffArtifactStore = class {
	constructor(params) {
		this.renderingFileIds = /* @__PURE__ */ new Set();
		this.cleanupInFlight = null;
		this.cleanupStopped = false;
		this.nextCleanupAt = 0;
		this.rootDir = path.resolve(params.rootDir);
		this.blobStore = params.blobStore;
		this.logger = params.logger;
		this.cleanupIntervalMs = params.cleanupIntervalMs === void 0 ? DEFAULT_CLEANUP_INTERVAL_MS : Math.max(0, Math.floor(params.cleanupIntervalMs));
	}
	async createArtifact(params) {
		const html = Buffer.from(params.html, "utf8");
		if (html.byteLength > MAX_DECODED_HTML_BYTES) throw new Error(`Diff viewer HTML exceeds ${MAX_DECODED_HTML_BYTES} bytes.`);
		const compressedHtml = await gzipAsync(html);
		const token = crypto.randomBytes(24).toString("hex");
		const ttlMs = normalizeTtlMs$1(params.ttlMs);
		const metadata = {
			version: 1,
			kind: "viewer",
			encoding: "gzip",
			tokenHash: hashToken(token),
			title: params.title,
			inputKind: params.inputKind,
			fileCount: params.fileCount,
			decodedBytes: html.byteLength,
			...params.context ? { context: params.context } : {}
		};
		const entry = await this.registerUnique(compressedHtml, metadata, ttlMs);
		this.scheduleCleanup();
		return viewerEntryToMeta(entry, token);
	}
	async readAuthorizedViewer(id, token) {
		if (!DIFF_ARTIFACT_ID_PATTERN.test(id) || !DIFF_ARTIFACT_TOKEN_PATTERN.test(token)) return null;
		const entry = await this.blobStore.lookup(id);
		if (!entry) {
			const expired = await this.blobStore.deleteExpiredKey(id);
			if (expired) await this.deleteExpiredFile(expired);
			return null;
		}
		if (!isViewerMetadata(entry.metadata)) return null;
		const tokenHash = hashToken(token);
		if (!safeEqualSecret(tokenHash, entry.metadata.tokenHash)) return null;
		const html = await gunzipAsync(entry.bytes, MAX_DECODED_HTML_BYTES);
		if (html.byteLength !== entry.metadata.decodedBytes) throw new Error(`Diff artifact ${id} decoded size does not match its metadata.`);
		return {
			artifact: viewerEntryToMeta(entry, token),
			html
		};
	}
	async createStandaloneFileArtifact(params = {}) {
		const format = params.format ?? "png";
		const ttlMs = normalizeTtlMs$1(params.ttlMs);
		const metadata = {
			version: 1,
			kind: "rendered_file",
			format,
			...params.context ? { context: params.context } : {}
		};
		for (let attempt = 0; attempt < ARTIFACT_ID_ATTEMPTS; attempt += 1) {
			const id = crypto.randomBytes(10).toString("hex");
			if (!await this.registerIfAbsentWithCleanup(id, EMPTY_BLOB, metadata, ttlMs)) continue;
			const artifactDir = this.artifactDir(id);
			try {
				await fs$1.mkdir(this.rootDir, { recursive: true });
				await fs$1.mkdir(artifactDir);
				const entry = await this.blobStore.lookup(id);
				if (!entry || !isRenderedFileMetadata(entry.metadata)) throw new Error(`Diff file artifact expired before materialization: ${id}`);
				this.renderingFileIds.add(id);
				this.scheduleCleanup();
				return {
					id,
					filePath: path.join(artifactDir, `preview.${format}`),
					expiresAt: resolveEntryExpiresAt(entry),
					...params.context ? { context: params.context } : {}
				};
			} catch (error) {
				await this.blobStore.delete(id).catch(() => false);
				await fs$1.rm(artifactDir, {
					recursive: true,
					force: true
				}).catch(() => {});
				if (isFileExists(error)) continue;
				throw error;
			}
		}
		throw new Error("Failed to allocate a unique diff file artifact id.");
	}
	async completeFileArtifact(id) {
		try {
			const entry = await this.blobStore.lookup(id);
			if (!entry || !isRenderedFileMetadata(entry.metadata)) {
				await fs$1.rm(this.artifactDir(id), {
					recursive: true,
					force: true
				}).catch(() => {});
				throw new Error(`Diff file artifact expired during rendering: ${id}`);
			}
		} finally {
			this.renderingFileIds.delete(id);
		}
	}
	async deleteFileArtifact(id) {
		this.renderingFileIds.delete(id);
		await this.blobStore.delete(id).catch(() => false);
		await fs$1.rm(this.artifactDir(id), {
			recursive: true,
			force: true
		}).catch(() => {});
	}
	scheduleCleanup() {
		this.maybeCleanupExpired();
	}
	startCleanup() {
		this.cleanupStopped = false;
	}
	async stopCleanup() {
		this.cleanupStopped = true;
		await this.cleanupInFlight?.catch(() => void 0);
	}
	cleanupExpired() {
		if (!this.cleanupInFlight) this.cleanupInFlight = this.runCleanupExpired().finally(() => {
			this.cleanupInFlight = null;
		});
		return this.cleanupInFlight;
	}
	async runCleanupExpired() {
		const expired = await this.blobStore.deleteExpired();
		const expiredCleanup = await runTasksWithConcurrency({
			tasks: expired.map((entry) => () => this.deleteExpiredFile(entry)),
			limit: CLEANUP_CONCURRENCY
		});
		if (expiredCleanup.hasError) throw expiredCleanup.firstError;
		const entries = await fs$1.readdir(this.rootDir, { withFileTypes: true }).catch((error) => {
			if (isFileNotFound(error)) return [];
			throw error;
		});
		const now = Date.now();
		const orphanCleanup = await runTasksWithConcurrency({
			tasks: entries.filter((entry) => entry.isDirectory() && DIFF_ARTIFACT_ID_PATTERN.test(entry.name)).map((entry) => async () => {
				if (this.renderingFileIds.has(entry.name)) return;
				const artifactDir = this.artifactDir(entry.name);
				const stats = await fs$1.stat(artifactDir).catch(() => null);
				if (stats && now - stats.mtimeMs > SWEEP_FALLBACK_AGE_MS && !await this.blobStore.lookup(entry.name)) await fs$1.rm(artifactDir, {
					recursive: true,
					force: true
				}).catch(() => {});
			}),
			limit: CLEANUP_CONCURRENCY
		});
		if (orphanCleanup.hasError) throw orphanCleanup.firstError;
	}
	async registerUnique(bytes, metadata, ttlMs) {
		for (let attempt = 0; attempt < ARTIFACT_ID_ATTEMPTS; attempt += 1) {
			const id = crypto.randomBytes(10).toString("hex");
			if (!await this.registerIfAbsentWithCleanup(id, bytes, metadata, ttlMs)) continue;
			const entry = await this.blobStore.lookup(id);
			if (entry) return entry;
		}
		throw new Error("Failed to allocate a unique diff artifact id.");
	}
	async registerIfAbsentWithCleanup(id, bytes, metadata, ttlMs) {
		try {
			return await this.blobStore.registerIfAbsent(id, bytes, metadata, { ttlMs });
		} catch (error) {
			if (!isBlobLimitError(error)) throw error;
			await this.cleanupExpired();
			return await this.blobStore.registerIfAbsent(id, bytes, metadata, { ttlMs });
		}
	}
	async deleteExpiredFile(entry) {
		if (!isRenderedFileMetadata(entry.metadata) || this.renderingFileIds.has(entry.key)) return;
		if (await this.blobStore.lookup(entry.key)) return;
		await fs$1.rm(this.artifactDir(entry.key), {
			recursive: true,
			force: true
		}).catch(() => {});
	}
	maybeCleanupExpired() {
		const now = Date.now();
		if (this.cleanupStopped || this.cleanupInFlight || now < this.nextCleanupAt) return;
		this.nextCleanupAt = now + this.cleanupIntervalMs;
		this.cleanupExpired().catch((error) => {
			this.nextCleanupAt = 0;
			this.logger?.warn(`Failed to clean expired diff artifacts: ${String(error)}`);
		});
	}
	artifactDir(id) {
		if (!DIFF_ARTIFACT_ID_PATTERN.test(id)) throw new Error(`Invalid diff artifact id: ${id}`);
		return path.join(this.rootDir, id);
	}
};
function viewerEntryToMeta(entry, token) {
	if (!isViewerMetadata(entry.metadata)) throw new Error(`Diff artifact ${entry.key} is not a viewer.`);
	return {
		id: entry.key,
		token,
		createdAt: timestampMsToIsoString(entry.createdAt) ?? "1970-01-01T00:00:00.000Z",
		expiresAt: resolveEntryExpiresAt(entry),
		title: entry.metadata.title,
		inputKind: entry.metadata.inputKind,
		fileCount: entry.metadata.fileCount,
		viewerPath: `${VIEWER_PREFIX}/${entry.key}/${token}`,
		...entry.metadata.context ? { context: entry.metadata.context } : {}
	};
}
function resolveEntryExpiresAt(entry) {
	return timestampMsToIsoString(entry.expiresAt ?? MAX_DATE_TIMESTAMP_MS) ?? timestampMsToIsoString(MAX_DATE_TIMESTAMP_MS) ?? "1970-01-01T00:00:00.000Z";
}
function hashToken(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}
function normalizeTtlMs$1(value) {
	const rounded = value === void 0 || !Number.isFinite(value) ? 0 : Math.floor(value);
	const requestedTtlMs = rounded > 0 ? rounded : DEFAULT_TTL_MS;
	const remainingDateRangeMs = Math.floor(MAX_DATE_TIMESTAMP_MS - Date.now());
	return Math.min(requestedTtlMs, MAX_TTL_MS, Math.max(1, remainingDateRangeMs));
}
function isViewerMetadata(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const metadata = value;
	return metadata.version === 1 && metadata.kind === "viewer" && metadata.encoding === "gzip" && typeof metadata.tokenHash === "string" && /^[0-9a-f]{64}$/u.test(metadata.tokenHash) && typeof metadata.title === "string" && (metadata.inputKind === "before_after" || metadata.inputKind === "patch") && Number.isSafeInteger(metadata.fileCount) && typeof metadata.fileCount === "number" && metadata.fileCount >= 0 && Number.isSafeInteger(metadata.decodedBytes) && typeof metadata.decodedBytes === "number" && metadata.decodedBytes >= 0 && metadata.decodedBytes <= MAX_DECODED_HTML_BYTES && isArtifactContext(metadata.context);
}
function isRenderedFileMetadata(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const metadata = value;
	return metadata.version === 1 && metadata.kind === "rendered_file" && (metadata.format === "png" || metadata.format === "pdf") && isArtifactContext(metadata.context);
}
function isArtifactContext(value) {
	if (value === void 0) return true;
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const context = value;
	const allowed = /* @__PURE__ */ new Set([
		"agentId",
		"sessionId",
		"messageChannel",
		"agentAccountId"
	]);
	return Object.entries(context).every(([key, entry]) => allowed.has(key) && (entry === void 0 || typeof entry === "string"));
}
async function gzipAsync(input) {
	return await new Promise((resolve, reject) => {
		gzip(input, (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result);
		});
	});
}
async function gunzipAsync(input, maxOutputLength) {
	return await new Promise((resolve, reject) => {
		gunzip(input, { maxOutputLength }, (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result);
		});
	});
}
function isFileExists(error) {
	return error instanceof Error && "code" in error && error.code === "EEXIST";
}
function isFileNotFound(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
//#endregion
//#region extensions/diffs/src/shiki-curated-languages.ts
const javascript = () => import("@shikijs/langs/javascript");
const typescript = () => import("@shikijs/langs/typescript");
const tsx = () => import("@shikijs/langs/tsx");
const jsx = () => import("@shikijs/langs/jsx");
const json = () => import("@shikijs/langs/json");
const markdown = () => import("@shikijs/langs/markdown");
const yaml = () => import("@shikijs/langs/yaml");
const css = () => import("@shikijs/langs/css");
const html = () => import("@shikijs/langs/html");
const sh = () => import("@shikijs/langs/sh");
const python = () => import("@shikijs/langs/python");
const go = () => import("@shikijs/langs/go");
const rust = () => import("@shikijs/langs/rust");
const java = () => import("@shikijs/langs/java");
const c = () => import("@shikijs/langs/c");
const cpp = () => import("@shikijs/langs/cpp");
const csharp = () => import("@shikijs/langs/csharp");
const php = () => import("@shikijs/langs/php");
const sql = () => import("@shikijs/langs/sql");
const docker = () => import("@shikijs/langs/docker");
const ruby = () => import("@shikijs/langs/ruby");
const swift = () => import("@shikijs/langs/swift");
const kotlin = () => import("@shikijs/langs/kotlin");
const r = () => import("@shikijs/langs/r");
const dart = () => import("@shikijs/langs/dart");
const lua = () => import("@shikijs/langs/lua");
const powershell = () => import("@shikijs/langs/powershell");
const xml = () => import("@shikijs/langs/xml");
const toml = () => import("@shikijs/langs/toml");
const bundledLanguagesInfo = [
	{
		id: "javascript",
		name: "JavaScript",
		aliases: [
			"js",
			"mjs",
			"cjs"
		],
		import: javascript
	},
	{
		id: "typescript",
		name: "TypeScript",
		aliases: [
			"ts",
			"mts",
			"cts"
		],
		import: typescript
	},
	{
		id: "tsx",
		name: "TSX",
		import: tsx
	},
	{
		id: "jsx",
		name: "JSX",
		import: jsx
	},
	{
		id: "json",
		name: "JSON",
		aliases: [
			"jsonc",
			"json5",
			"jsonl"
		],
		import: json
	},
	{
		id: "markdown",
		name: "Markdown",
		aliases: ["md"],
		import: markdown
	},
	{
		id: "yaml",
		name: "YAML",
		aliases: ["yml"],
		import: yaml
	},
	{
		id: "css",
		name: "CSS",
		import: css
	},
	{
		id: "html",
		name: "HTML",
		import: html
	},
	{
		id: "sh",
		name: "Shell",
		aliases: [
			"bash",
			"shell",
			"shellscript",
			"zsh"
		],
		import: sh
	},
	{
		id: "python",
		name: "Python",
		aliases: ["py"],
		import: python
	},
	{
		id: "go",
		name: "Go",
		import: go
	},
	{
		id: "rust",
		name: "Rust",
		aliases: ["rs"],
		import: rust
	},
	{
		id: "java",
		name: "Java",
		import: java
	},
	{
		id: "c",
		name: "C",
		import: c
	},
	{
		id: "cpp",
		name: "C++",
		aliases: ["c++"],
		import: cpp
	},
	{
		id: "csharp",
		name: "C#",
		aliases: ["c#", "cs"],
		import: csharp
	},
	{
		id: "php",
		name: "PHP",
		import: php
	},
	{
		id: "sql",
		name: "SQL",
		import: sql
	},
	{
		id: "docker",
		name: "Docker",
		aliases: ["dockerfile"],
		import: docker
	},
	{
		id: "ruby",
		name: "Ruby",
		aliases: ["rb"],
		import: ruby
	},
	{
		id: "swift",
		name: "Swift",
		import: swift
	},
	{
		id: "kotlin",
		name: "Kotlin",
		aliases: ["kt", "kts"],
		import: kotlin
	},
	{
		id: "r",
		name: "R",
		import: r
	},
	{
		id: "dart",
		name: "Dart",
		import: dart
	},
	{
		id: "lua",
		name: "Lua",
		import: lua
	},
	{
		id: "powershell",
		name: "PowerShell",
		aliases: ["ps", "ps1"],
		import: powershell
	},
	{
		id: "xml",
		name: "XML",
		import: xml
	},
	{
		id: "toml",
		name: "TOML",
		import: toml
	}
];
const bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map((language) => [language.id, language.import]));
function getBundledLanguageAliases(language) {
	return "aliases" in language ? language.aliases : [];
}
//#endregion
//#region extensions/diffs/src/language-hints.ts
const BASE_DIFF_VIEWER_LANGUAGE_HINTS = [
	...Object.keys(bundledLanguagesBase),
	"text",
	"ansi"
];
const BASE_LANGUAGE_HINTS = new Set(BASE_DIFF_VIEWER_LANGUAGE_HINTS);
const BASE_LANGUAGE_ALIASES = new Map(bundledLanguagesInfo.flatMap((language) => getBundledLanguageAliases(language).map((alias) => [alias, language.id])));
function normalizeLanguageHint(value) {
	if (typeof value !== "string") return;
	return value.trim().toLowerCase() || void 0;
}
async function normalizeSupportedLanguageHint(value, options = {}) {
	const normalized = normalizeLanguageHint(value);
	if (!normalized) return;
	const baseAlias = BASE_LANGUAGE_ALIASES.get(normalized);
	if (baseAlias) return baseAlias;
	if (BASE_LANGUAGE_HINTS.has(normalized)) return normalized;
	if (!options.languagePackAvailable) return;
	try {
		await resolveLanguage(normalized);
		return normalized;
	} catch {
		return;
	}
}
async function normalizeSupportedLanguageHints(values, options) {
	const supported = /* @__PURE__ */ new Set();
	for (const value of values) {
		const normalized = await normalizeSupportedLanguageHint(value, options);
		if (!normalized) continue;
		supported.add(normalized);
	}
	if (options.fallbackToText && supported.size === 0) supported.add("text");
	return [...supported];
}
function collectDiffPayloadLanguageHints(payload) {
	const langs = /* @__PURE__ */ new Set();
	if (payload.fileDiff?.lang) langs.add(payload.fileDiff.lang);
	if (payload.oldFile?.lang) langs.add(payload.oldFile.lang);
	if (payload.newFile?.lang) langs.add(payload.newFile.lang);
	return [...langs];
}
async function normalizeDiffPayloadFileLanguage(file, options) {
	if (!file) return;
	if (typeof file.lang !== "string") return file;
	const normalized = await normalizeSupportedLanguageHint(file.lang, options);
	if (file.lang === normalized) return file;
	if (!normalized) return {
		...file,
		lang: "text"
	};
	return {
		...file,
		lang: normalized
	};
}
async function normalizeDiffViewerPayloadLanguages(payload, options = {}) {
	const [fileDiff, oldFile, newFile, payloadLangs] = await Promise.all([
		normalizeDiffPayloadFileLanguage(payload.fileDiff, options),
		normalizeDiffPayloadFileLanguage(payload.oldFile, options),
		normalizeDiffPayloadFileLanguage(payload.newFile, options),
		normalizeSupportedLanguageHints(payload.langs, {
			fallbackToText: false,
			...options
		})
	]);
	const langs = new Set(payloadLangs);
	for (const lang of collectDiffPayloadLanguageHints({
		fileDiff,
		oldFile,
		newFile
	})) langs.add(lang);
	if (langs.size === 0) langs.add("text");
	return {
		...payload,
		fileDiff,
		oldFile,
		newFile,
		langs: [...langs]
	};
}
function isBaseDiffViewerLanguage(lang) {
	return BASE_LANGUAGE_HINTS.has(lang);
}
//#endregion
//#region extensions/diffs/src/render.ts
const DEFAULT_FILE_NAME = "diff.txt";
const MAX_PATCH_FILE_COUNT = 128;
const MAX_PATCH_TOTAL_LINES = 12e4;
const VIEWER_LOADER_DOCUMENT_PATH = "../../assets/viewer.js";
const LANGUAGE_PACK_VIEWER_LOADER_DOCUMENT_PATH = "../../../diffs-language-pack/assets/viewer.js";
var DiffRenderInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "DiffRenderInputError";
	}
};
function escapeCssString(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
}
function escapeJsonScript(value) {
	return JSON.stringify(value).replaceAll("<", "\\u003c");
}
function buildDiffTitle(input) {
	if (input.title?.trim()) return input.title.trim();
	if (input.kind === "before_after") return input.path?.trim() || "Text diff";
	return "Patch diff";
}
function resolveBeforeAfterFileName(params) {
	const { input, lang } = params;
	if (input.path?.trim()) return input.path.trim();
	if (lang && lang !== "text") return `diff.${lang.replace(/^\.+/, "")}`;
	return DEFAULT_FILE_NAME;
}
function resolveDiffTypography(presentation) {
	const fontSize = normalizeDiffFontSize(presentation.fontSize);
	const lineSpacing = normalizeDiffLineSpacing(presentation.lineSpacing);
	return {
		fontSize,
		lineHeight: Math.max(20, Math.round(fontSize * lineSpacing))
	};
}
function buildDiffOptions(options) {
	const fontFamily = escapeCssString(options.presentation.fontFamily);
	const { fontSize, lineHeight } = resolveDiffTypography(options.presentation);
	return {
		theme: {
			light: "pierre-light",
			dark: "pierre-dark"
		},
		diffStyle: options.presentation.layout,
		diffIndicators: options.presentation.diffIndicators,
		disableLineNumbers: !options.presentation.showLineNumbers,
		expandUnchanged: options.expandUnchanged,
		themeType: options.presentation.theme,
		backgroundEnabled: options.presentation.background,
		overflow: options.presentation.wordWrap ? "wrap" : "scroll",
		unsafeCSS: `
      :host {
        --diffs-font-family: "${fontFamily}", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --diffs-header-font-family: "${fontFamily}", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --diffs-font-size: ${fontSize}px;
        --diffs-line-height: ${lineHeight}px;
      }

      [data-diffs-header] {
        min-height: 64px;
        padding-inline: 18px 14px;
      }

      [data-header-content] {
        gap: 10px;
      }

      [data-metadata] {
        gap: 10px;
      }

      .oc-diff-toolbar {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-inline-start: 6px;
        flex: 0 0 auto;
      }

      .oc-diff-toolbar-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        margin: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        opacity: 0.6;
        line-height: 0;
        overflow: visible;
        transition: opacity 120ms ease;
        flex: 0 0 auto;
      }

      .oc-diff-toolbar-button:hover {
        opacity: 1;
      }

      .oc-diff-toolbar-button[data-active="true"] {
        opacity: 0.92;
      }

      .oc-diff-toolbar-button svg {
        display: block;
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        overflow: visible;
        flex: 0 0 auto;
        color: inherit;
        fill: currentColor;
        pointer-events: none;
      }
    `
	};
}
function buildImageRenderOptions(options) {
	return {
		...options,
		presentation: {
			...options.presentation,
			fontSize: Math.max(16, normalizeDiffFontSize(options.presentation.fontSize))
		}
	};
}
function shouldRenderViewer(target) {
	return target === "viewer" || target === "both";
}
function shouldRenderImage(target) {
	return target === "image" || target === "both";
}
function buildRenderVariants(params) {
	return {
		...shouldRenderViewer(params.target) ? { viewerOptions: buildDiffOptions(params.options) } : {},
		...shouldRenderImage(params.target) ? { imageOptions: buildDiffOptions(buildImageRenderOptions(params.options)) } : {}
	};
}
function renderDiffCard(payload, anchorId) {
	return `<section class="oc-diff-card"${anchorId ? ` id="${anchorId}"` : ""}>
    <diffs-container class="oc-diff-host" data-openclaw-diff-host>
      <template shadowrootmode="open">${payload.prerenderedHTML}</template>
    </diffs-container>
    <script type="application/json" data-openclaw-diff-payload>${escapeJsonScript(payload)}<\/script>
  </section>`;
}
function computeFileDiffStats(fileDiff) {
	let additions = 0;
	let deletions = 0;
	for (const hunk of fileDiff.hunks) {
		additions += hunk.additionLines;
		deletions += hunk.deletionLines;
	}
	return {
		additions,
		deletions
	};
}
function renderNavChangeBadge(changeType) {
	const label = changeType === "new" ? "added" : changeType === "deleted" ? "deleted" : changeType === "rename-pure" || changeType === "rename-changed" ? "renamed" : void 0;
	return label ? `<span class="oc-diff-nav-badge" data-change="${label}">${label}</span>` : "";
}
function renderNavStats(stats) {
	return `<span class="oc-diff-nav-stats"><span class="oc-diff-nav-additions">+${stats.additions}</span><span class="oc-diff-nav-deletions">-${stats.deletions}</span></span>`;
}
function renderNavEntryName(fileDiff) {
	return fileDiff.prevName && fileDiff.prevName !== fileDiff.name ? `${escapeHtml(fileDiff.prevName ?? "")} &rarr; ${escapeHtml(fileDiff.name)}` : escapeHtml(fileDiff.name);
}
function renderFileSummaryNav(entries) {
	const totals = entries.reduce((sum, entry) => ({
		additions: sum.additions + entry.stats.additions,
		deletions: sum.deletions + entry.stats.deletions
	}), {
		additions: 0,
		deletions: 0
	});
	const items = entries.map((entry) => `<li><a href="#${entry.anchorId}"><code>${renderNavEntryName(entry.fileDiff)}</code></a>${renderNavChangeBadge(entry.fileDiff.type)}${renderNavStats(entry.stats)}</li>`).join("\n      ");
	return `<nav class="oc-diff-card oc-diff-nav" aria-label="Changed files">
    <p class="oc-diff-nav-summary">${entries.length} changed files${renderNavStats(totals)}</p>
    <ol class="oc-diff-nav-list">
      ${items}
    </ol>
  </nav>`;
}
function buildHtmlDocument(params) {
	const viewerLoaderPath = params.viewerRuntime === "language-pack" ? LANGUAGE_PACK_VIEWER_LOADER_DOCUMENT_PATH : VIEWER_LOADER_DOCUMENT_PATH;
	const imageTypographyCss = params.runtimeMode === "image" ? `
      .oc-frame[data-render-mode="image"] .oc-diff-host {
        --diffs-font-size: ${params.imageTypography.fontSize}px;
        --diffs-line-height: ${params.imageTypography.lineHeight}px;
      }
` : "";
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <title>${escapeHtml(params.title)}</title>
    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        min-height: 100%;
      }

      html {
        background: #05070b;
        scroll-behavior: smooth;
      }

      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }

      body {
        margin: 0;
        min-height: 100vh;
        padding: 22px;
        font-family:
          "Fira Code",
          "SF Mono",
          Monaco,
          Consolas,
          monospace;
        background: #05070b;
        color: #f8fafc;
      }

      body[data-theme="light"] {
        background: #f3f5f8;
        color: #0f172a;
      }

      .oc-frame {
        max-width: 1560px;
        margin: 0 auto;
      }

      .oc-frame[data-render-mode="image"] {
        max-width: ${Math.max(640, Math.round(params.imageMaxWidth))}px;
      }
${imageTypographyCss}

      [data-openclaw-diff-root] {
        display: grid;
        gap: 18px;
      }

      .oc-diff-card {
        overflow: hidden;
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(15, 23, 42, 0.14);
        box-shadow: 0 18px 48px rgba(2, 6, 23, 0.22);
      }

      body[data-theme="light"] .oc-diff-card {
        border-color: rgba(148, 163, 184, 0.22);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
      }

      .oc-diff-host {
        display: block;
      }

      .oc-diff-nav {
        padding: 14px 18px;
        font-size: 13px;
        line-height: 1.5;
      }

      .oc-diff-nav-summary {
        display: flex;
        align-items: center;
        margin: 0 0 10px;
        font-weight: 600;
      }

      .oc-diff-nav-list {
        display: grid;
        gap: 4px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .oc-diff-nav-list li {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .oc-diff-nav-list code {
        overflow-wrap: anywhere;
      }

      .oc-diff-nav-list a {
        color: inherit;
        text-decoration: none;
        min-width: 0;
      }

      .oc-diff-nav-list a:hover {
        text-decoration: underline;
      }

      .oc-diff-nav-stats {
        display: inline-flex;
        gap: 8px;
        margin-inline-start: auto;
        padding-inline-start: 12px;
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        white-space: nowrap;
      }

      .oc-diff-nav-summary .oc-diff-nav-stats {
        margin-inline-start: 10px;
        padding-inline-start: 0;
      }

      .oc-diff-nav-additions {
        color: #4ade80;
      }

      .oc-diff-nav-deletions {
        color: #f87171;
      }

      .oc-diff-nav-badge {
        flex: 0 0 auto;
        padding: 1px 7px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.32);
        font-size: 11px;
        opacity: 0.85;
      }

      body[data-theme="light"] .oc-diff-nav-additions {
        color: #15803d;
      }

      body[data-theme="light"] .oc-diff-nav-deletions {
        color: #b91c1c;
      }

      /* Nav summary cards are short; the diff-card floor would pad them with
         empty space in static PNG/PDF captures. */
      .oc-frame[data-render-mode="image"] .oc-diff-card:not(.oc-diff-nav) {
        min-height: 240px;
      }

      @media (max-width: 720px) {
        body {
          padding: 12px;
        }

        [data-openclaw-diff-root] {
          gap: 12px;
        }
      }
    </style>
  </head>
  <body data-theme="${params.theme}">
    <main class="oc-frame" data-render-mode="${params.runtimeMode}">
      <div data-openclaw-diff-root>
        ${params.bodyHtml}
      </div>
    </main>
    <script type="module" src="${viewerLoaderPath}"><\/script>
  </body>
</html>`;
}
function payloadUsesLanguagePack(payload) {
	return payload?.langs.some((lang) => !isBaseDiffViewerLanguage(lang)) ?? false;
}
function buildRenderedSection(params) {
	return {
		...params.viewerPayload ? { viewer: renderDiffCard(params.viewerPayload, params.anchorId) } : {},
		...params.imagePayload ? { image: renderDiffCard(params.imagePayload, params.anchorId) } : {},
		usesLanguagePack: payloadUsesLanguagePack(params.viewerPayload) || payloadUsesLanguagePack(params.imagePayload)
	};
}
function buildRenderedBodies(sections, leadingHtml) {
	const lead = leadingHtml ? [leadingHtml] : [];
	const viewerSections = sections.flatMap((section) => section.viewer ? [section.viewer] : []);
	const imageSections = sections.flatMap((section) => section.image ? [section.image] : []);
	return {
		...viewerSections.length > 0 ? { viewerBodyHtml: [...lead, ...viewerSections].join("\n") } : {},
		...imageSections.length > 0 ? { imageBodyHtml: [...lead, ...imageSections].join("\n") } : {}
	};
}
async function renderBeforeAfterDiff(input, options, target) {
	const languagePackAvailable = options.languagePackAvailable === true;
	const lang = await normalizeSupportedLanguageHint(input.lang, { languagePackAvailable });
	const fileName = resolveBeforeAfterFileName({
		input,
		lang
	});
	const oldFile = {
		name: fileName,
		contents: input.before,
		...lang ? { lang } : {}
	};
	const newFile = {
		name: fileName,
		contents: input.after,
		...lang ? { lang } : {}
	};
	const { viewerOptions, imageOptions } = buildRenderVariants({
		options,
		target
	});
	const preloadOptions = viewerOptions ?? imageOptions;
	if (!preloadOptions) throw new Error(`Unsupported diff render target: ${target}`);
	const normalizedPayload = await normalizeDiffViewerPayloadLanguages({
		prerenderedHTML: await preloadDiffHTMLWithFallback({
			oldFile,
			newFile,
			options: preloadOptions
		}),
		oldFile,
		newFile,
		options: preloadOptions,
		langs: collectDiffPayloadLanguageHints({
			oldFile,
			newFile
		})
	}, { languagePackAvailable });
	const viewerPayload = viewerOptions ? {
		...normalizedPayload,
		options: viewerOptions
	} : void 0;
	const imagePayload = imageOptions ? {
		...normalizedPayload,
		options: imageOptions
	} : void 0;
	const section = buildRenderedSection({
		...viewerPayload ? { viewerPayload } : {},
		...imagePayload ? { imagePayload } : {}
	});
	return {
		...buildRenderedBodies([section]),
		fileCount: 1,
		usesLanguagePack: section.usesLanguagePack === true
	};
}
async function renderPatchDiff(input, options, target) {
	const languagePackAvailable = options.languagePackAvailable === true;
	const files = await Promise.all(parsePatchFiles(input.patch).flatMap((entry) => entry.files ?? []).map((fileDiff) => normalizePatchFileLanguage(fileDiff, { languagePackAvailable })));
	if (files.length === 0) throw new DiffRenderInputError("Patch input did not contain any file diffs.");
	if (files.length > MAX_PATCH_FILE_COUNT) throw new DiffRenderInputError(`Patch input contains too many files (max ${MAX_PATCH_FILE_COUNT}).`);
	if (files.reduce((sum, fileDiff) => {
		const splitLines = Number.isFinite(fileDiff.splitLineCount) ? fileDiff.splitLineCount : 0;
		const unifiedLines = Number.isFinite(fileDiff.unifiedLineCount) ? fileDiff.unifiedLineCount : 0;
		return sum + Math.max(splitLines, unifiedLines, 0);
	}, 0) > MAX_PATCH_TOTAL_LINES) throw new DiffRenderInputError(`Patch input is too large to render (max ${MAX_PATCH_TOTAL_LINES} lines).`);
	const { viewerOptions, imageOptions } = buildRenderVariants({
		options,
		target
	});
	const preloadOptions = viewerOptions ?? imageOptions;
	if (!preloadOptions) throw new Error(`Unsupported diff render target: ${target}`);
	const navEntries = files.map((fileDiff, index) => ({
		anchorId: `oc-diff-file-${index + 1}`,
		fileDiff,
		stats: computeFileDiffStats(fileDiff)
	}));
	const sections = await Promise.all(files.map(async (fileDiff, index) => {
		const normalizedPayload = await normalizeDiffViewerPayloadLanguages({
			prerenderedHTML: await preloadDiffHTMLWithFallback({
				fileDiff,
				options: preloadOptions
			}),
			fileDiff,
			options: preloadOptions,
			langs: collectDiffPayloadLanguageHints({ fileDiff })
		}, { languagePackAvailable });
		const viewerPayload = viewerOptions ? {
			...normalizedPayload,
			options: viewerOptions
		} : void 0;
		const imagePayload = imageOptions ? {
			...normalizedPayload,
			options: imageOptions
		} : void 0;
		return buildRenderedSection({
			...viewerPayload ? { viewerPayload } : {},
			...imagePayload ? { imagePayload } : {},
			anchorId: navEntries[index]?.anchorId
		});
	}));
	return {
		...buildRenderedBodies(sections, files.length > 1 ? renderFileSummaryNav(navEntries) : void 0),
		fileCount: files.length,
		usesLanguagePack: sections.some((section) => section.usesLanguagePack === true)
	};
}
async function normalizePatchFileLanguage(fileDiff, options) {
	const lang = await normalizeSupportedLanguageHint(fileDiff.lang, options);
	if (lang === fileDiff.lang) return fileDiff;
	return {
		...fileDiff,
		...lang ? { lang } : { lang: "text" }
	};
}
async function renderDiffDocument(input, options, target = "both") {
	const title = buildDiffTitle(input);
	const rendered = input.kind === "before_after" ? await renderBeforeAfterDiff(input, options, target) : await renderPatchDiff(input, options, target);
	const viewerRuntime = rendered.usesLanguagePack ? "language-pack" : "base";
	const imageTypography = resolveDiffTypography(buildImageRenderOptions(options).presentation);
	return {
		...rendered.viewerBodyHtml ? { html: buildHtmlDocument({
			title,
			bodyHtml: rendered.viewerBodyHtml,
			theme: options.presentation.theme,
			imageMaxWidth: options.image.maxWidth,
			imageTypography,
			runtimeMode: "viewer",
			viewerRuntime
		}) } : {},
		...rendered.imageBodyHtml ? { imageHtml: buildHtmlDocument({
			title,
			bodyHtml: rendered.imageBodyHtml,
			theme: options.presentation.theme,
			imageMaxWidth: options.image.maxWidth,
			imageTypography,
			runtimeMode: "image",
			viewerRuntime
		}) } : {},
		title,
		fileCount: rendered.fileCount,
		inputKind: input.kind,
		viewerRuntime
	};
}
function shouldFallbackToClientHydration(error) {
	return error instanceof TypeError && error.message.includes("needs an import attribute of \"type: json\"");
}
async function preloadDiffHTMLWithFallback(params) {
	try {
		return await preloadDiffHTML(params);
	} catch (error) {
		if (!shouldFallbackToClientHydration(error)) throw error;
		return "";
	}
}
//#endregion
//#region extensions/diffs/src/tool.ts
const MAX_BEFORE_AFTER_BYTES = 524288;
const MAX_PATCH_BYTES = 2097152;
const MAX_TITLE_BYTES = 1024;
const MAX_PATH_BYTES = 2048;
const MAX_LANG_BYTES = 128;
const MAX_DIFF_ARTIFACT_TTL_SECONDS = 21600;
const loadDiffsBrowserRuntime = createLazyRuntimeModule(() => import("./.setup/browser.runtime-VjaO3wrj.mjs"));
const DiffsToolSchema = Type.Object({
	before: Type.Optional(Type.String({ description: "Original text content." })),
	after: Type.Optional(Type.String({ description: "Updated text content." })),
	patch: Type.Optional(Type.String({
		description: "Unified diff or patch text.",
		maxLength: MAX_PATCH_BYTES
	})),
	path: Type.Optional(Type.String({
		description: "Display path for before/after input.",
		maxLength: MAX_PATH_BYTES
	})),
	lang: Type.Optional(Type.String({
		description: "Optional language override for before/after input.",
		maxLength: MAX_LANG_BYTES
	})),
	title: Type.Optional(Type.String({
		description: "Optional title for the rendered diff.",
		maxLength: MAX_TITLE_BYTES
	})),
	mode: Type.Optional(stringEnum(DIFF_MODES, { description: "Output mode: view, file, image (deprecated alias for file), or both. Default: both." })),
	theme: Type.Optional(stringEnum(DIFF_THEMES, { description: "Viewer theme. Default: dark." })),
	layout: Type.Optional(stringEnum(DIFF_LAYOUTS, { description: "Diff layout. Default: unified." })),
	fileQuality: Type.Optional(stringEnum(DIFF_IMAGE_QUALITY_PRESETS, { description: "File quality preset: standard, hq, or print." })),
	fileFormat: Type.Optional(stringEnum(DIFF_OUTPUT_FORMATS, { description: "Rendered file format: png or pdf." })),
	fileScale: optionalFiniteNumberSchema({
		description: "Optional rendered-file device scale factor override (1-4).",
		minimum: 1,
		maximum: 4
	}),
	fileMaxWidth: optionalFiniteNumberSchema({
		description: "Optional rendered-file max width in CSS pixels (640-2400).",
		minimum: 640,
		maximum: 2400
	}),
	expandUnchanged: Type.Optional(Type.Boolean({ description: "Expand unchanged sections instead of collapsing them." })),
	ttlSeconds: optionalFiniteNumberSchema({
		description: "Artifact lifetime in seconds. Default: 1800. Maximum: 21600.",
		minimum: 1,
		maximum: MAX_DIFF_ARTIFACT_TTL_SECONDS
	}),
	baseUrl: Type.Optional(Type.String({ description: "Optional gateway base URL override used when building the viewer URL. Overrides configured viewerBaseUrl, for example https://gateway.example.com." }))
}, { additionalProperties: false });
function createDiffsTool(params) {
	const loadScreenshotter = async (config) => params.screenshotter ?? new (await (loadDiffsBrowserRuntime())).PlaywrightDiffScreenshotter({ config });
	return {
		name: "diffs",
		label: "Diffs",
		description: "Create a read-only diff viewer from before/after text or a unified patch. Returns a gateway viewer URL for interactive viewing and can also render the same diff to a PNG or PDF.",
		parameters: DiffsToolSchema,
		execute: async (_toolCallId, rawParams) => {
			const config = params.getConfig();
			const toolParams = asNonArrayRecord(rawParams);
			const rawRecord = toolParams;
			const artifactContext = buildArtifactContext(params.context);
			const input = normalizeDiffInput(toolParams);
			if (input.kind === "before_after" && input.before === input.after) return {
				content: [{
					type: "text",
					text: "Before and after are identical — no changes to render."
				}],
				details: {
					changed: false,
					...artifactContext ? { context: artifactContext } : {}
				}
			};
			const mode = normalizeMode(toolParams.mode, params.defaults.mode);
			const theme = normalizeTheme(toolParams.theme, params.defaults.theme);
			const layout = normalizeLayout(toolParams.layout, params.defaults.layout);
			const expandUnchanged = toolParams.expandUnchanged === true;
			const ttlSeconds = readFiniteNumberParam(rawRecord, "ttlSeconds") ?? params.defaults.ttlSeconds;
			const fileScale = readFiniteNumberParam(rawRecord, "fileScale");
			const fileMaxWidth = readFiniteNumberParam(rawRecord, "fileMaxWidth");
			const ttlMs = normalizeTtlMs(ttlSeconds);
			const image = resolveDiffImageRenderOptions({
				defaults: params.defaults,
				fileFormat: normalizeOutputFormat(toolParams.fileFormat),
				fileQuality: normalizeFileQuality(toolParams.fileQuality),
				fileScale,
				fileMaxWidth
			});
			const renderTarget = resolveRenderTarget(mode);
			const rendered = await renderDiffDocument(input, {
				presentation: {
					...params.defaults,
					layout,
					theme
				},
				image,
				expandUnchanged,
				languagePackAvailable: params.languagePackAvailable
			}, renderTarget).catch((error) => {
				if (error instanceof DiffRenderInputError) throw new PluginToolInputError(error.message);
				throw error;
			});
			if (isArtifactOnlyMode(mode)) {
				const artifactFile = await renderDiffArtifactFile({
					screenshotter: await loadScreenshotter(config),
					store: params.store,
					html: requireRenderedHtml(rendered.imageHtml, "image"),
					theme,
					image,
					ttlMs,
					context: artifactContext
				});
				return {
					content: [{
						type: "text",
						text: buildFileArtifactMessage({
							format: image.format,
							filePath: artifactFile.path
						})
					}],
					details: buildArtifactDetails({
						baseDetails: {
							changed: true,
							...artifactFile.artifactId ? { artifactId: artifactFile.artifactId } : {},
							...artifactFile.expiresAt ? { expiresAt: artifactFile.expiresAt } : {},
							title: rendered.title,
							inputKind: rendered.inputKind,
							fileCount: rendered.fileCount,
							mode,
							...artifactContext ? { context: artifactContext } : {}
						},
						artifactFile,
						image
					})
				};
			}
			const artifact = await params.store.createArtifact({
				html: requireRenderedHtml(rendered.html, "viewer"),
				title: rendered.title,
				inputKind: rendered.inputKind,
				fileCount: rendered.fileCount,
				ttlMs,
				context: artifactContext
			});
			const viewerUrl = buildViewerUrl({
				config,
				viewerPath: artifact.viewerPath,
				baseUrl: normalizeBaseUrl(toolParams.baseUrl),
				viewerBaseUrl: params.viewerBaseUrl
			});
			const baseDetails = {
				changed: true,
				artifactId: artifact.id,
				viewerUrl,
				viewerPath: artifact.viewerPath,
				title: artifact.title,
				expiresAt: artifact.expiresAt,
				inputKind: artifact.inputKind,
				fileCount: artifact.fileCount,
				mode,
				...artifactContext ? { context: artifactContext } : {}
			};
			if (mode === "view") return {
				content: [{
					type: "text",
					text: `Diff viewer ready.\n${viewerUrl}`
				}],
				details: baseDetails
			};
			try {
				const artifactFile = await renderDiffArtifactFile({
					screenshotter: await loadScreenshotter(config),
					store: params.store,
					html: requireRenderedHtml(rendered.imageHtml, "image"),
					theme,
					image,
					ttlMs,
					context: artifactContext
				});
				return {
					content: [{
						type: "text",
						text: buildFileArtifactMessage({
							format: image.format,
							filePath: artifactFile.path,
							viewerUrl
						})
					}],
					details: buildArtifactDetails({
						baseDetails,
						artifactFile,
						image
					})
				};
			} catch (error) {
				if (mode === "both") {
					const errorMessage = formatErrorMessage(error);
					return {
						content: [{
							type: "text",
							text: `Diff viewer ready.\n${viewerUrl}\nFile rendering failed: ${errorMessage}`
						}],
						details: {
							...baseDetails,
							fileError: errorMessage
						}
					};
				}
				throw error;
			}
		}
	};
}
function normalizeFileQuality(fileQuality) {
	return fileQuality && DIFF_IMAGE_QUALITY_PRESETS.includes(fileQuality) ? fileQuality : void 0;
}
function normalizeOutputFormat(format) {
	return format && DIFF_OUTPUT_FORMATS.includes(format) ? format : void 0;
}
function isArtifactOnlyMode(mode) {
	return mode === "image" || mode === "file";
}
function resolveRenderTarget(mode) {
	if (mode === "view") return "viewer";
	if (isArtifactOnlyMode(mode)) return "image";
	return "both";
}
function requireRenderedHtml(html, target) {
	if (html !== void 0) return html;
	throw new Error(`Missing ${target} render output.`);
}
function buildArtifactDetails(params) {
	return {
		...params.baseDetails,
		filePath: params.artifactFile.path,
		path: params.artifactFile.path,
		fileBytes: params.artifactFile.bytes,
		fileFormat: params.image.format,
		fileQuality: params.image.qualityPreset,
		fileScale: params.image.scale,
		fileMaxWidth: params.image.maxWidth
	};
}
function buildFileArtifactMessage(params) {
	const lines = params.viewerUrl ? [`Diff viewer: ${params.viewerUrl}`] : [];
	lines.push(`Diff ${params.format.toUpperCase()} generated at: ${params.filePath}`);
	lines.push("To send this file, use an available file-sending tool to send it as an attachment.");
	return lines.join("\n");
}
async function renderDiffArtifactFile(params) {
	const fileArtifact = await params.store.createStandaloneFileArtifact({
		format: params.image.format,
		ttlMs: params.ttlMs,
		context: params.context
	});
	try {
		await params.screenshotter.screenshotHtml({
			html: params.html,
			outputPath: fileArtifact.filePath,
			theme: params.theme,
			image: params.image
		});
		const stats = await fs$1.stat(fileArtifact.filePath);
		await params.store.completeFileArtifact(fileArtifact.id);
		return {
			path: fileArtifact.filePath,
			bytes: stats.size,
			artifactId: fileArtifact.id,
			expiresAt: fileArtifact.expiresAt
		};
	} catch (error) {
		await params.store.deleteFileArtifact(fileArtifact.id);
		throw error;
	}
}
function buildArtifactContext(context) {
	if (!context) return;
	const agentId = normalizeOptionalString(context.agentId);
	const sessionId = normalizeOptionalString(context.sessionId);
	const messageChannel = normalizeOptionalString(context.messageChannel);
	const agentAccountId = normalizeOptionalString(context.agentAccountId);
	const artifactContext = {
		...agentId ? { agentId } : {},
		...sessionId ? { sessionId } : {},
		...messageChannel ? { messageChannel } : {},
		...agentAccountId ? { agentAccountId } : {}
	};
	return Object.keys(artifactContext).length > 0 ? artifactContext : void 0;
}
function normalizeDiffInput(params) {
	const patch = params.patch?.trim();
	const before = params.before;
	const after = params.after;
	if (patch) {
		assertMaxBytes(patch, "patch", MAX_PATCH_BYTES);
		if (before !== void 0 || after !== void 0) throw new PluginToolInputError("Provide either patch or before/after input, not both.");
		const title = params.title?.trim();
		if (title) assertMaxBytes(title, "title", MAX_TITLE_BYTES);
		return {
			kind: "patch",
			patch,
			title
		};
	}
	if (before === void 0 || after === void 0) throw new PluginToolInputError("Provide patch or both before and after text.");
	assertMaxBytes(before, "before", MAX_BEFORE_AFTER_BYTES);
	assertMaxBytes(after, "after", MAX_BEFORE_AFTER_BYTES);
	const path = normalizeOptionalString(params.path);
	const lang = normalizeOptionalString(params.lang);
	const title = normalizeOptionalString(params.title);
	if (path) assertMaxBytes(path, "path", MAX_PATH_BYTES);
	if (lang) assertMaxBytes(lang, "lang", MAX_LANG_BYTES);
	if (title) assertMaxBytes(title, "title", MAX_TITLE_BYTES);
	return {
		kind: "before_after",
		before,
		after,
		path,
		lang,
		title
	};
}
function assertMaxBytes(value, label, maxBytes) {
	if (Buffer.byteLength(value, "utf8") <= maxBytes) return;
	throw new PluginToolInputError(`${label} exceeds maximum size (${maxBytes} bytes).`);
}
function normalizeBaseUrl(baseUrl) {
	const normalized = baseUrl?.trim();
	if (!normalized) return;
	try {
		return normalizeViewerBaseUrl(normalized);
	} catch {
		throw new PluginToolInputError(`Invalid baseUrl: ${normalized}`);
	}
}
function normalizeMode(mode, fallback) {
	return mode && DIFF_MODES.includes(mode) ? mode : fallback;
}
function normalizeTheme(theme, fallback) {
	return theme && DIFF_THEMES.includes(theme) ? theme : fallback;
}
function normalizeLayout(layout, fallback) {
	return layout && DIFF_LAYOUTS.includes(layout) ? layout : fallback;
}
function normalizeTtlMs(ttlSeconds) {
	if (!Number.isFinite(ttlSeconds) || ttlSeconds === void 0) return;
	return Math.floor(Math.min(Math.max(ttlSeconds, 1), MAX_DIFF_ARTIFACT_TTL_SECONDS) * 1e3);
}
var PluginToolInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ToolInputError";
	}
};
//#endregion
//#region extensions/diffs/src/plugin.ts
const DIFFS_LANGUAGE_PACK_PLUGIN_ID = "diffs-language-pack";
const DIFF_ARTIFACT_NAMESPACE = "diff-artifacts";
const DIFF_ARTIFACT_MAX_ENTRIES = 2048;
const DIFF_ARTIFACT_MAX_BYTES_PER_ENTRY = 33554432;
const DIFF_ARTIFACT_MAX_BYTES_PER_NAMESPACE = 268435456;
function registerDiffsPlugin(api) {
	if (api.registrationMode === "cli-metadata") return;
	const store = new DiffArtifactStore({
		rootDir: path.join(resolvePreferredOpenClawTmpDir(), "openclaw-diffs"),
		blobStore: api.runtime.state.openBlobStore({
			namespace: DIFF_ARTIFACT_NAMESPACE,
			maxEntries: DIFF_ARTIFACT_MAX_ENTRIES,
			maxBytesPerEntry: DIFF_ARTIFACT_MAX_BYTES_PER_ENTRY,
			maxBytesPerNamespace: DIFF_ARTIFACT_MAX_BYTES_PER_NAMESPACE,
			overflowPolicy: "reject-new"
		}),
		logger: api.logger
	});
	api.registerService({
		id: "diffs-artifact-cleanup",
		start: () => store.startCleanup(),
		stop: () => store.stopCleanup()
	});
	const resolveCurrentPluginConfig = () => resolveLivePluginConfigObject(api.runtime.config?.current ? () => api.runtime.config.current() : void 0, "diffs", api.pluginConfig) ?? {};
	const resolveCurrentAccessConfig = () => {
		const currentConfig = api.runtime.config?.current?.() ?? api.config;
		return {
			allowRemoteViewer: resolveDiffsPluginSecurity(resolveCurrentPluginConfig()).allowRemoteViewer,
			trustedProxies: currentConfig.gateway?.trustedProxies,
			allowRealIpFallback: currentConfig.gateway?.allowRealIpFallback === true
		};
	};
	const initialAccessConfig = resolveCurrentAccessConfig();
	api.registerTool((ctx) => {
		const pluginConfig = resolveCurrentPluginConfig();
		return createDiffsTool({
			getConfig: () => ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config ?? api.runtime.config.current(),
			store,
			defaults: resolveDiffsPluginDefaults(pluginConfig),
			viewerBaseUrl: resolveDiffsPluginViewerBaseUrl(pluginConfig),
			languagePackAvailable: resolveDiffsLanguagePackAvailability(api),
			context: ctx
		});
	}, { name: "diffs" });
	api.registerHttpRoute({
		path: "/plugins/diffs",
		auth: "plugin",
		match: "prefix",
		handler: createDiffsHttpHandler({
			store,
			logger: api.logger,
			allowRemoteViewer: initialAccessConfig.allowRemoteViewer,
			trustedProxies: initialAccessConfig.trustedProxies,
			allowRealIpFallback: initialAccessConfig.allowRealIpFallback,
			resolveAccessConfig: resolveCurrentAccessConfig
		})
	});
	api.on("before_prompt_build", async () => ({ prependSystemContext: DIFFS_AGENT_GUIDANCE }));
}
function resolveDiffsLanguagePackAvailability(api) {
	const plugins = (api.runtime.config?.current?.() ?? api.config).plugins;
	if (plugins?.enabled === false) return false;
	if (plugins?.deny?.includes(DIFFS_LANGUAGE_PACK_PLUGIN_ID)) return false;
	if (plugins?.allow && !plugins.allow.includes(DIFFS_LANGUAGE_PACK_PLUGIN_ID)) return false;
	if (plugins?.entries?.[DIFFS_LANGUAGE_PACK_PLUGIN_ID]?.enabled === false) return false;
	return hasSiblingLanguagePackRuntime(api.rootDir);
}
function hasSiblingLanguagePackRuntime(rootDir) {
	if (!rootDir) return false;
	const languagePackRoot = path.join(path.dirname(rootDir), DIFFS_LANGUAGE_PACK_PLUGIN_ID);
	const runtimePaths = [path.join(languagePackRoot, "assets", "viewer-runtime.js"), path.join(languagePackRoot, "dist", "assets", "viewer-runtime.js")];
	return fs.existsSync(path.join(languagePackRoot, "openclaw.plugin.json")) && runtimePaths.some((runtimePath) => fs.existsSync(runtimePath));
}
//#endregion
//#region extensions/diffs/index.ts
var diffs_default = definePluginEntry({
	id: "diffs",
	name: "Diffs",
	description: "Read-only diff viewer and PNG/PDF renderer for agents.",
	configSchema: diffsPluginConfigSchema,
	register: registerDiffsPlugin
});
//#endregion
export { diffs_default as default };
