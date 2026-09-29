import { I as resolveTimestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as FsSafeError, u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { i as matchRootFileOpenFailure, o as openRootFileSync, s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { a as isWithinDir } from "./path-safety-0BfxAYBQ.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { a as isControlUiApprovalDocumentPath, i as classifyControlUiRequest, o as isControlUiFocusDocumentPath, r as serveControlUiShareDocument, t as isControlUiSharePath } from "./control-ui-share-CXVEqSAo.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-BkM1aB4w.mjs";
import { n as startsWithSvgRootElement } from "./svg-image-1iOdCRUI.mjs";
import { t as AVATAR_MAX_BYTES } from "./avatar-limits-2506OuP3.mjs";
import { c as resolveAvatarMime } from "./avatar-policy-I2uW2Cs8.mjs";
import { f as CONTROL_UI_ENVIRONMENT_ATTRIBUTE, l as CONTROL_UI_BASE_PATH_ATTRIBUTE, m as CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE, u as CONTROL_UI_BOOTSTRAP_CONFIG_PATH } from "./zod-schema-B-u3AXjg.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { zg as isCloudWorkerPlacementState } from "./src-BRUl7oDv.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { a as isControlUiVersionedPublicAsset, i as isControlUiRootPublicAsset, n as CONTROL_UI_ROOT_PUBLIC_ASSETS, r as buildControlUiRootAssetPath, t as CONTROL_UI_BUILD_ID_ATTRIBUTE } from "./control-ui-root-assets-DS7D1PNh.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import { a as safeFileURLToPath } from "./local-file-access-B6bU8SNO.mjs";
import { i as getUserProfileListItem } from "./user-profiles-BA6bh7Le.mjs";
import { l as kindFromMime, n as detectMime } from "./mime-1zBUMwu6.mjs";
import { i as toMediaProbeResult, n as probePlaybackMediaFileDescriptor } from "./media-probe-Bdg20gzZ.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { r as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DkN5in9o.mjs";
import { i as getDefaultMediaLocalRoots, n as getAgentScopedMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { o as extractOriginalFilename } from "./store-CqRcb7T5.mjs";
import { c as resolveMediaReferenceLocalPathInfo } from "./media-reference-CtGDBk0x.mjs";
import { n as LocalMediaAccessError, r as assertLocalMediaAllowed } from "./local-media-access-Cxmjo_Ju.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-BLRgDgSo.mjs";
import { n as gatewayAvatarImageRevision } from "./assistant-avatar-cache-bW5LAJaD.mjs";
import { i as DEFAULT_ASSISTANT_IDENTITY, n as openGatewayAssistantAvatar, o as resolveAssistantIdentity, r as resolveGatewayAssistantAvatar, t as gatewayAssistantAvatarUrl } from "./assistant-avatar-D6yA4rZS.mjs";
import { i as parseControlUiResourcePath, o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import { T as createProfileSessionEntryFilter } from "./session-sharing-C4w_but1.mjs";
import "./session-utils-CJ7A982R.mjs";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-BreDg4cS.mjs";
import { g as resolveHttpProfile, h as applyHttpOperatorRoleScopeCeiling, t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-BJQtuB_7.mjs";
import { b as respondPlainText, v as isReadHttpMethod, y as respondNotFound } from "./http-common-Ckbyca3h.mjs";
import "./http-utils-BihU3mvk.mjs";
import { n as resolvePlaybackModeForSource, r as resolvePlaybackTranscode, t as replacePlaybackFileExtension } from "./playback-transcode-CcOtdCua.mjs";
import { a as buildAssistantMediaContentDisposition, i as writeByteHeaders, r as resolveByteResponse, t as createGatewayByteStream } from "./http-byte-range-k1_X9iV6.mjs";
import { t as matchesHttpIfModifiedSince } from "./http-conditional-vOFTJV-M.mjs";
import { r as applyHttpImageContentSecurityPolicy, s as sendHttpImageResponse } from "./http-image-response-DQqwbtvS.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-CdOvbmSU.mjs";
import { t as resolveHttpContentEncodings } from "./http-content-encoding-BxlZphnc.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { brotliCompress, constants as constants$1, gzip } from "node:zlib";
//#region src/infra/dev-install-branch.ts
const GIT_TIMEOUT_MS = 3e3;
const HIDDEN_BRANCHES = /* @__PURE__ */ new Set([
	"main",
	"master",
	"HEAD"
]);
async function detectDevInstallGitBranch(params) {
	const run = params.runCommand ?? runCommandWithTimeout;
	const root = params.root ? path.resolve(params.root) : null;
	if (!root) return null;
	const topRes = await run([
		"git",
		"-C",
		root,
		"rev-parse",
		"--show-toplevel"
	], { timeoutMs: GIT_TIMEOUT_MS }).catch(() => null);
	if (!topRes || topRes.code !== 0) return null;
	const rootReal = await fs$1.realpath(root).catch(() => root);
	const top = topRes.stdout.trim();
	if (!top || path.resolve(top) !== path.resolve(rootReal)) return null;
	const branchRes = await run([
		"git",
		"-C",
		root,
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	], { timeoutMs: GIT_TIMEOUT_MS }).catch(() => null);
	if (!branchRes || branchRes.code !== 0) return null;
	const branch = branchRes.stdout.trim();
	return branch && !HIDDEN_BRANCHES.has(branch) ? branch : null;
}
let cached = null;
function resolveDevInstallGitBranch() {
	cached ??= resolveOpenClawPackageRoot({
		argv1: process.argv[1],
		cwd: process.cwd(),
		moduleUrl: import.meta.url
	}).then((root) => detectDevInstallGitBranch({ root })).catch(() => null);
	return cached;
}
//#endregion
//#region src/gateway/assistant-media-policy.ts
function resolveAssistantMediaReaderAuth(reader, config) {
	try {
		const profile = reader.profileId ? getUserProfileListItem(reader.profileId) : void 0;
		const currentProfile = profile ? resolveHttpProfile(profile.id, profile.updatedAt, config) : void 0;
		const operatorScopes = applyHttpOperatorRoleScopeCeiling(reader.operatorScopes, currentProfile);
		if (!authorizeOperatorScopesForMethod("assistant.media.get", operatorScopes).allowed) return;
		return {
			authMethod: reader.authMethod,
			operatorScopes,
			...currentProfile
		};
	} catch {
		return;
	}
}
function resolveAssistantMediaPolicy(params) {
	let loaded;
	if (params.sessionKey) {
		const owner = resolveRequestedSessionAgentId(params.config, params.sessionKey, params.agentId);
		if (!owner.ok) return;
		loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: owner.agentId });
		if (!loaded.entry?.sessionId) return;
	}
	const config = loaded?.cfg ?? params.config;
	const reader = params.reader ?? (params.requestAuth ? {
		authMethod: params.requestAuth.authMethod,
		operatorScopes: params.requestAuth.operatorScopes,
		...params.requestAuth.authenticatedUserProfile ? { profileId: params.requestAuth.authenticatedUserProfile.profileId } : {}
	} : void 0);
	const auth = params.requestAuth ?? (reader ? resolveAssistantMediaReaderAuth(reader, config) : void 0);
	if (!auth || !reader) return;
	const agentId = loaded?.agentId ?? params.agentId;
	const entry = loaded?.entry;
	const remote = Boolean(entry?.execNode || entry?.repositoryWorkspaceId);
	let session;
	let sessionRoot;
	let executionCwd;
	if (loaded && entry && agentId) {
		if (!auth.operatorScopes.includes("operator.admin")) {
			const profileId = auth.authenticatedUserProfile?.profileId;
			if (profileId && profileId !== "gateway-owner") {
				if (entry.incognito || isIncognitoSessionKey(loaded.canonicalKey)) return;
				if (auth.operatorRolePolicy && !createProfileSessionEntryFilter({
					profileId,
					sessionCap: auth.operatorRolePolicy.sessions.others
				})(loaded.canonicalKey, entry)) return;
			} else if (!profileId && config.gateway?.roles) return;
		}
		session = {
			sessionKey: loaded.canonicalKey,
			agentId,
			sessionId: entry.sessionId
		};
		if (!remote) {
			const workspace = resolveSessionWorkspaceRoots(config, agentId, entry);
			sessionRoot = entry.sessionRoot ?? workspace.root;
			executionCwd = workspace.diffCwd;
		}
	}
	const workspaceOnly = !session || (entry?.permissionMode ? resolveSessionPermissionCoreToolPolicy({ mode: entry.permissionMode }).workspaceOnly : resolveEffectiveToolFsWorkspaceOnly({
		cfg: config,
		agentId
	}));
	const localRoots = [...remote ? getDefaultMediaLocalRoots() : getAgentScopedMediaLocalRoots(config, agentId, workspaceOnly ? sessionRoot : void 0)];
	if (sessionRoot && !localRoots.includes(sessionRoot)) localRoots.push(sessionRoot);
	const placement = session ? resolveSessionWorkerPlacementContext().workerSessionPlacementService?.getMany([session.sessionId]).get(session.sessionId) : void 0;
	return {
		session,
		executionCwd,
		remote: remote || isCloudWorkerPlacementState(placement?.state),
		localRoots,
		workspaceOnly,
		reader,
		canAllow: auth.operatorScopes.includes("operator.admin")
	};
}
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
		"data:",
		"https://api.openai.com",
		"https://tweakcn.com"
	];
	if (opts?.portalHost) try {
		const parsed = new URL(`http://${opts.portalHost}`);
		if (!parsed.username && !parsed.password && parsed.pathname === "/" && !parsed.search && !parsed.hash && parsed.hostname) connectTokens.push(`http://${parsed.hostname}:*`, `https://${parsed.hostname}:*`);
	} catch {}
	return [
		"default-src 'self'",
		"base-uri 'none'",
		"object-src 'none'",
		"frame-ancestors 'none'",
		"frame-src 'self' http: https:",
		`script-src ${scriptTokens.join(" ")}`,
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"img-src 'self' data: blob: https:",
		"media-src 'self' data: blob:",
		"font-src 'self' https://fonts.gstatic.com",
		"worker-src 'self'",
		`connect-src ${connectTokens.join(" ")}`
	].join("; ");
}
//#endregion
//#region src/gateway/control-ui-static.ts
const CONTROL_UI_IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const CONTROL_UI_HTML_COMPRESSION_CACHE_MAX_ENTRIES = 4;
const CONTROL_UI_COMPRESSIBLE_EXTENSIONS = /* @__PURE__ */ new Set([
	".css",
	".html",
	".js",
	".json",
	".svg",
	".txt",
	".wasm",
	".webmanifest"
]);
const CONTROL_UI_PRECOMPRESSED_ASSET_EXTENSIONS = /* @__PURE__ */ new Set([".br", ".gz"]);
const CONTROL_UI_CONTENT_TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".txt": "text/plain; charset=utf-8",
	".wasm": "application/wasm",
	".webmanifest": "application/manifest+json; charset=utf-8",
	".woff2": "font/woff2"
};
function isControlUiStaticAssetExtension(extension) {
	return extension !== ".html" && Object.hasOwn(CONTROL_UI_CONTENT_TYPES, extension);
}
function isControlUiPrecompressedAssetExtension(extension) {
	return CONTROL_UI_PRECOMPRESSED_ASSET_EXTENSIONS.has(extension);
}
const CONTROL_UI_DYNAMIC_ENCODINGS = /* @__PURE__ */ new Set(["br", "gzip"]);
const controlUiHtmlCompressionCache = /* @__PURE__ */ new Map();
function resolveControlUiHtmlEncoding(req) {
	return resolveHttpContentEncodings(req.headers?.["accept-encoding"], CONTROL_UI_DYNAMIC_ENCODINGS)[0] ?? "not-acceptable";
}
function resolveOpenedControlUiRepresentation(params) {
	const { req, sourceFile, precompressed, openPrecompressedFile } = params;
	const extension = path.extname(params.contentPath).toLowerCase();
	const encodings = resolveHttpContentEncodings(req.headers?.["accept-encoding"], precompressed && CONTROL_UI_COMPRESSIBLE_EXTENSIONS.has(extension) ? CONTROL_UI_DYNAMIC_ENCODINGS : /* @__PURE__ */ new Set());
	for (const selected of encodings) {
		if (selected === "identity") return { bodyFile: sourceFile };
		const suffix = selected === "br" ? ".br" : ".gz";
		let compressedFile;
		try {
			compressedFile = openPrecompressedFile(`${sourceFile.path}${suffix}`);
		} catch (error) {
			fs.closeSync(sourceFile.fd);
			throw error;
		}
		if (compressedFile) {
			fs.closeSync(sourceFile.fd);
			return {
				bodyFile: compressedFile,
				encoding: selected
			};
		}
	}
	fs.closeSync(sourceFile.fd);
	return null;
}
function setControlUiEncodingHeaders(res, extension, encoding) {
	res.setHeader("Vary", "Accept-Encoding");
	if (!CONTROL_UI_COMPRESSIBLE_EXTENSIONS.has(extension)) return;
	if (encoding !== "identity") res.setHeader("Content-Encoding", encoding);
}
function setControlUiFileHeaders(res, filePath, options) {
	const extension = path.extname(filePath).toLowerCase();
	res.setHeader("Content-Type", CONTROL_UI_CONTENT_TYPES[extension] ?? "application/octet-stream");
	res.setHeader("Cache-Control", options?.immutable ? CONTROL_UI_IMMUTABLE_CACHE_CONTROL : "no-cache");
	if (options?.lastModifiedMs !== void 0) res.setHeader("Last-Modified", new Date(options.lastModifiedMs).toUTCString());
	setControlUiEncodingHeaders(res, extension, options?.encoding ?? "identity");
}
/** Revalidate no-cache static assets without generating entity tags. */
function isControlUiFileUnmodified(req, lastModifiedMs, nowMs = Date.now()) {
	if (req.method !== "GET" && req.method !== "HEAD") return false;
	const ifNoneMatch = req.headers?.["if-none-match"];
	if (ifNoneMatch !== void 0) return ifNoneMatch.trim() === "*";
	return matchesHttpIfModifiedSince(req, lastModifiedMs, nowMs);
}
function respondControlUiNotModified(res, options) {
	res.statusCode = 304;
	res.setHeader("Cache-Control", options.immutable ? CONTROL_UI_IMMUTABLE_CACHE_CONTROL : "no-cache");
	res.setHeader("Last-Modified", new Date(options.lastModifiedMs).toUTCString());
	res.setHeader("Vary", "Accept-Encoding");
	res.end();
}
function respondHeadForControlUiFile(res, filePath, options) {
	res.statusCode = 200;
	setControlUiFileHeaders(res, filePath, options);
	if (options?.contentLength !== void 0) res.setHeader("Content-Length", String(options.contentLength));
	res.end();
}
function compressControlUiBody(body, encoding) {
	return new Promise((resolve, reject) => {
		const callback = (error, compressed) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(compressed);
		};
		if (encoding === "br") {
			brotliCompress(body, { params: { [constants$1.BROTLI_PARAM_QUALITY]: 4 } }, callback);
			return;
		}
		gzip(body, { level: 6 }, callback);
	});
}
async function serveControlUiAsset(res, filePath, body, options) {
	setControlUiFileHeaders(res, filePath, options);
	res.end(body);
}
function cachedCompressedControlUiHtml(body, encoding) {
	const key = `${encoding}\0${body}`;
	const cached = controlUiHtmlCompressionCache.get(key);
	if (cached) {
		controlUiHtmlCompressionCache.delete(key);
		controlUiHtmlCompressionCache.set(key, cached);
		return cached;
	}
	const compression = getOrCreatePromise(controlUiHtmlCompressionCache, key, () => compressControlUiBody(Buffer.from(body), encoding), { cacheRejections: false });
	pruneMapToMaxSize(controlUiHtmlCompressionCache, CONTROL_UI_HTML_COMPRESSION_CACHE_MAX_ENTRIES);
	return compression;
}
function respondControlUiNotAcceptable(res) {
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Vary", "Accept-Encoding");
	respondPlainText(res, 406, "Not Acceptable");
}
async function sendControlUiHtmlBody(req, res, body) {
	const encoding = resolveControlUiHtmlEncoding(req);
	if (encoding === "not-acceptable") {
		respondControlUiNotAcceptable(res);
		return;
	}
	setControlUiEncodingHeaders(res, ".html", encoding);
	res.end(encoding === "identity" ? body : await cachedCompressedControlUiHtml(body, encoding));
}
async function readAndCloseControlUiFile(file) {
	try {
		if (file.size > 2 ** 31 - 1) throw Object.assign(/* @__PURE__ */ new RangeError("Control UI file exceeds the 2 GiB read limit"), { code: "ERR_FS_FILE_TOO_LARGE" });
		const buffer = Buffer.allocUnsafe(file.size);
		let offset = 0;
		while (offset < buffer.length) {
			const length = Math.min(524288, buffer.length - offset);
			const bytesRead = await new Promise((resolve, reject) => {
				fs.read(file.fd, buffer, offset, length, null, (error, count) => {
					if (error) reject(error);
					else resolve(count);
				});
			});
			if (bytesRead === 0) break;
			offset += bytesRead;
		}
		return buffer.subarray(0, offset);
	} finally {
		fs.closeSync(file.fd);
	}
}
//#endregion
//#region src/gateway/control-ui.ts
const ROOT_PREFIX = "/";
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE = "assistant-media";
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_TTL_MS = 3e5;
const CONTROL_UI_ASSETS_MISSING_MESSAGE = "Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.";
const controlUiAssistantMediaTicketSecret = randomBytes(32);
const loadAvatarThumbnail = createLazyRuntimeModule(() => import("./assistant-avatar-thumbnail.runtime.js"));
const CONTROL_UI_NAMESPACE_PREFIX = "/__openclaw__/";
/** Anchors bundled assets before deep-linked documents begin preloading. */
function rewriteControlUiIndexHtmlAssetHrefs(html, basePath, buildId) {
	const normalized = normalizeControlUiBasePath(basePath);
	const replacements = /* @__PURE__ */ new Map([["src=\"./assets/", `src="${normalized}/assets/`], ["href=\"./assets/", `href="${normalized}/assets/`]]);
	for (const asset of CONTROL_UI_ROOT_PUBLIC_ASSETS) {
		const version = buildId && isControlUiVersionedPublicAsset(asset) ? `?v=${encodeURIComponent(buildId)}` : "";
		const assetHref = `href="${buildControlUiRootAssetPath(normalized, asset)}${version}"`;
		replacements.set(`href="./${asset}"`, assetHref);
		replacements.set(`href="/${asset}"`, assetHref);
		replacements.set(`href="${buildControlUiRootAssetPath(normalized, asset)}"`, assetHref);
	}
	const pattern = new RegExp([...replacements.keys()].map(escapeRegExp).join("|"), "g");
	return html.replace(pattern, (match) => replacements.get(match) ?? match);
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
	res.setHeader("Permissions-Policy", "camera=(self), microphone=*, geolocation=*, clipboard-write=*");
}
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-cache");
	res.end(JSON.stringify(body));
}
function respondControlUiAssetsUnavailable(res, options) {
	const message = options?.preparing ? "Control UI assets are being prepared. Try again shortly." : options?.failed ? "Control UI assets could not be prepared. Check the Gateway logs or run `openclaw doctor --fix`." : options?.configuredRootPath ? `Control UI assets not found at ${options.configuredRootPath}. Build them with \`pnpm ui:build\` (auto-installs UI deps), or update gateway.controlUi.root.` : CONTROL_UI_ASSETS_MISSING_MESSAGE;
	if (options?.preparing) {
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Retry-After", "1");
	}
	respondPlainText(res, 503, message);
}
function isValidAgentPathSegment(agentId) {
	return /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(agentId);
}
function normalizeAssistantMediaSource(source) {
	const trimmed = source.trim();
	if (!trimmed) return null;
	if (/^file:/iu.test(trimmed)) try {
		return safeFileURLToPath(trimmed);
	} catch {
		return null;
	}
	if (trimmed.startsWith("~")) return resolveUserPath(trimmed);
	return trimmed;
}
function signAssistantMediaTicketPayload(encodedPayload) {
	return createHmac("sha256", controlUiAssistantMediaTicketSecret).update(encodedPayload).digest("base64url");
}
function createAssistantMediaTicket(payloadFields, nowMs = Date.now()) {
	const now = asDateTimestampMs(nowMs);
	if (now === void 0) return {};
	const exp = asDateTimestampMs(now + CONTROL_UI_ASSISTANT_MEDIA_TICKET_TTL_MS);
	if (exp === void 0) return {};
	const payload = {
		scope: CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE,
		...payloadFields,
		exp
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	return {
		mediaTicket: `v1.${encodedPayload}.${signAssistantMediaTicketPayload(encodedPayload)}`,
		mediaTicketExpiresAt: resolveTimestampMsToIsoString(exp)
	};
}
function verifyAssistantMediaTicket(ticket, source, agentId, nowMs = Date.now()) {
	const now = asDateTimestampMs(nowMs);
	if (now === void 0) return;
	const parts = ticket?.split(".");
	if (!parts || parts.length !== 3 || parts[0] !== "v1") return;
	const [, encodedPayload, sig] = parts;
	if (!encodedPayload || !sig) return;
	const expectedSig = signAssistantMediaTicketPayload(encodedPayload);
	if (!safeEqualSecret(sig, expectedSig)) return;
	try {
		const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
		return payload.scope === CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE && typeof payload.source === "string" && (source === void 0 || payload.source === source) && payload.agentId === agentId && typeof payload.reader?.authMethod === "string" && Array.isArray(payload.reader.operatorScopes) && (payload.file === void 0 || typeof payload.file?.realPath === "string" && typeof payload.file.dev === "string" && typeof payload.file.ino === "string") && typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp >= now ? payload : void 0;
	} catch {
		return;
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
			case "unsupported-media-type": return {
				available: false,
				code: "unsupported-media-type",
				reason: "Not an image"
			};
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
		}
	}
	return {
		available: false,
		code: "attachment-unavailable",
		reason: "Attachment unavailable"
	};
}
function sameAssistantMediaFile(actual, expected) {
	return actual.realPath === expected.realPath && actual.dev === expected.dev && actual.ino === expected.ino;
}
async function openAssistantMedia(source, policy, allowance) {
	const reference = await resolveMediaReferenceLocalPathInfo(source);
	if (policy.remote && reference.kind === "local") throw new LocalMediaAccessError("invalid-path", "File is on another computer");
	let outsideRoots = false;
	try {
		await assertLocalMediaAllowed(reference.path, policy.localRoots);
	} catch (error) {
		if (!(error instanceof LocalMediaAccessError) || error.code !== "path-not-allowed") throw error;
		outsideRoots = true;
		if (policy.workspaceOnly && !allowance) throw error;
	}
	const opened = await openLocalFileSafely({ filePath: reference.path });
	try {
		let file;
		if (outsideRoots && allowance) {
			const identity = await opened.handle.stat({ bigint: true });
			const candidate = {
				realPath: opened.realPath,
				dev: identity.dev.toString(),
				ino: identity.ino.toString()
			};
			if (allowance === true || sameAssistantMediaFile(candidate, allowance)) file = candidate;
			else if (policy.workspaceOnly) throw new LocalMediaAccessError("path-not-allowed", "Outside allowed folders");
		}
		if (!outsideRoots) await assertLocalMediaAllowed(opened.realPath, policy.localRoots);
		const sniffBuffer = Buffer.alloc(Math.min(opened.stat.size, 8192));
		const bytesRead = sniffBuffer.length ? await readFileWindowFully(opened.handle, sniffBuffer, 0) : 0;
		const buffer = sniffBuffer.subarray(0, bytesRead);
		const mimeType = startsWithSvgRootElement(buffer.toString("utf8")) ? "image/svg+xml" : await detectMime({
			buffer,
			...outsideRoots ? {} : { filePath: reference.path }
		});
		if (outsideRoots && kindFromMime(mimeType) !== "image") throw new LocalMediaAccessError("unsupported-media-type", "Not an image");
		return {
			opened,
			reference,
			mimeType,
			outsideRoots,
			file
		};
	} catch (error) {
		await opened.handle.close().catch(() => {});
		throw error;
	}
}
async function resolveAssistantMediaAvailability(source, policy, allowance, agentId) {
	try {
		const { opened, mimeType, file } = await openAssistantMedia(source, policy, allowance);
		try {
			const mediaKind = kindFromMime(mimeType);
			const playbackProbe = mediaKind === "audio" || mediaKind === "video" ? await probePlaybackMediaFileDescriptor(opened.handle.fd, mediaKind) : null;
			const playback = mimeType && (mediaKind === "audio" || mediaKind === "video") ? await resolvePlaybackModeForSource({
				sourcePath: opened.realPath,
				sourceStat: opened.stat,
				mimeType,
				kind: mediaKind,
				probe: playbackProbe
			}) : void 0;
			return {
				available: true,
				...mimeType ? { mimeType } : {},
				...playback ? { playback } : {},
				sizeBytes: opened.stat.size,
				...toMediaProbeResult(playbackProbe),
				...createAssistantMediaTicket({
					source,
					agentId,
					session: policy.session,
					reader: policy.reader,
					...file ? { file } : {}
				})
			};
		} finally {
			await opened.handle.close().catch(() => {});
		}
	} catch (error) {
		return classifyAssistantMediaError(error);
	}
}
async function handleControlUiAssistantMediaRequest(req, res, opts) {
	const urlRaw = req.url;
	if (!urlRaw) return false;
	const url = new URL(urlRaw, "http://localhost");
	if (url.pathname !== resolveAssistantMediaRoutePath(opts?.basePath)) return false;
	const isMetaRequest = url.searchParams.get("meta") === "1";
	const explicitAllow = req.method === "POST" && isMetaRequest && url.searchParams.get("allow") === "1";
	if (!isReadHttpMethod(req.method) && !explicitAllow) return false;
	applyControlUiSecurityHeaders(res);
	let source = normalizeAssistantMediaSource(url.searchParams.get("source") ?? "");
	if (!source) {
		respondNotFound(res);
		return true;
	}
	const sessionKey = url.searchParams.get("sessionKey")?.trim() || void 0;
	const agentId = sessionKey ? url.searchParams.get("agentId")?.trim() || void 0 : opts?.agentId;
	const relativeSource = !path.isAbsolute(source) && !/^[a-z][a-z0-9+.-]*:/iu.test(source);
	const ticketCandidate = verifyAssistantMediaTicket(url.searchParams.get("mediaTicket"), relativeSource ? void 0 : source, agentId);
	const requestAuth = isMetaRequest || !ticketCandidate ? await authorizeControlUiReadRequestOrReply({
		...opts,
		req,
		res,
		cfg: opts?.cfg ?? opts?.config,
		allowQueryToken: !explicitAllow
	}) : void 0;
	if ((isMetaRequest || !ticketCandidate) && !requestAuth) return true;
	const policyParams = {
		config: opts?.config ?? {},
		sessionKey,
		agentId
	};
	const policy = resolveAssistantMediaPolicy({
		...policyParams,
		requestAuth: requestAuth ?? void 0,
		reader: isMetaRequest ? void 0 : ticketCandidate?.reader
	});
	if (!policy) {
		respondNotFound(res);
		return true;
	}
	if (relativeSource) {
		if (policy.remote || !policy.executionCwd || !path.isAbsolute(policy.executionCwd)) {
			respondNotFound(res);
			return true;
		}
		source = path.resolve(policy.executionCwd, source);
	}
	const ticket = ticketCandidate?.source === source ? ticketCandidate : void 0;
	if (explicitAllow && !policy.canAllow) {
		sendJson(res, 403, { error: "Allowing an outside image requires operator.admin" });
		return true;
	}
	const sameSession = ticket && ticket.session?.sessionKey === policy.session?.sessionKey && ticket.session?.agentId === policy.session?.agentId && ticket.session?.sessionId === policy.session?.sessionId;
	if (!isMetaRequest && url.searchParams.has("mediaTicket") && (!ticket || !sameSession)) {
		respondNotFound(res);
		return true;
	}
	const allowance = explicitAllow ? true : ticket?.file && sameSession && policy.canAllow ? ticket.file : void 0;
	const assertCurrentPolicy = () => {
		const current = resolveAssistantMediaPolicy({
			...policyParams,
			reader: policy.reader
		});
		if (requestAuth?.hasCurrentClientAuthority?.() === false || !current || current.session?.sessionKey !== policy.session?.sessionKey || current.session?.agentId !== policy.session?.agentId || current.session?.sessionId !== policy.session?.sessionId || current.remote !== policy.remote || current.executionCwd !== policy.executionCwd || current.workspaceOnly !== policy.workspaceOnly || current.localRoots.length !== policy.localRoots.length || current.localRoots.some((root, index) => root !== policy.localRoots[index]) || allowance && policy.workspaceOnly && !current.canAllow) throw new FsSafeError("path-mismatch", "Media access changed");
		return current;
	};
	if (isMetaRequest) {
		const availability = await resolveAssistantMediaAvailability(source, policy, allowance, agentId);
		let current;
		try {
			current = assertCurrentPolicy();
		} catch {
			respondNotFound(res);
			return true;
		}
		sendJson(res, 200, !availability.available && availability.code === "outside-allowed-folders" ? {
			...availability,
			retryable: false,
			...current.canAllow ? { canAllow: true } : {}
		} : availability);
		return true;
	}
	let byteStream;
	try {
		const media = await openAssistantMedia(source, policy, allowance);
		const resolvedReference = media.reference;
		const localPath = resolvedReference.path;
		let opened = media.opened;
		byteStream = createGatewayByteStream(res, opened.handle, () => respondNotFound(res));
		let contentType = media.mimeType ?? "application/octet-stream";
		let filename = resolvedReference.kind === "inbound" ? extractOriginalFilename(localPath) : path.basename(localPath);
		const mediaKind = kindFromMime(contentType);
		if (url.searchParams.get("playback") === "1" && (mediaKind === "audio" || mediaKind === "video")) {
			const playback = await resolvePlaybackTranscode({
				sourcePath: opened.realPath,
				sourceStat: opened.stat,
				mimeType: contentType,
				kind: mediaKind
			});
			if (playback.kind === "preparing") {
				await byteStream.close();
				assertCurrentPolicy();
				sendJson(res, 202, { status: "preparing" });
				return true;
			}
			if (playback.kind === "transcoded") {
				const transcoded = await openLocalFileSafely({ filePath: playback.path }).catch(() => null);
				if (transcoded) {
					await byteStream.close();
					opened = transcoded;
					byteStream = createGatewayByteStream(res, opened.handle, () => respondNotFound(res));
					contentType = playback.contentType;
					filename = replacePlaybackFileExtension(filename, playback.extension);
				}
			}
		}
		assertCurrentPolicy();
		if (media.outsideRoots && mediaKind === "image") applyHttpImageContentSecurityPolicy(res);
		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Disposition", buildAssistantMediaContentDisposition(filename, contentType));
		res.setHeader("Cache-Control", "no-cache");
		const byteResponse = resolveByteResponse({
			file: { size: opened.stat.size },
			method: req.method,
			request: req
		});
		writeByteHeaders(res, byteResponse);
		await byteStream.pipe(byteResponse, req.method);
		return true;
	} catch {
		await byteStream?.close();
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
	const parsed = parseControlUiResourcePath("agentAvatar", pathname, basePath);
	if (!parsed.matched) return false;
	applyControlUiSecurityHeaders(res);
	const agentId = parsed.value;
	if (!agentId || !isValidAgentPathSegment(agentId)) {
		respondNotFound(res);
		return true;
	}
	const requestAuth = await authorizeControlUiReadRequestOrReply({
		...opts,
		req,
		res,
		cfg: opts.cfg ?? opts.config
	});
	if (!requestAuth) return true;
	requestAuth.assertCurrent();
	const identity = resolveAssistantIdentity({
		cfg: opts.config,
		agentId
	});
	const projection = openGatewayAssistantAvatar({
		cfg: opts.config,
		identity
	});
	try {
		const resolved = projection.resolution;
		if (url.searchParams.get("meta") === "1") {
			const meta = controlUiAvatarResolutionMeta(resolved);
			sendJson(res, 200, {
				avatarUrl: gatewayAssistantAvatarUrl(projection, basePath, agentId) ?? (resolved?.kind === "remote" ? resolved.url : null),
				avatarSource: meta.avatarSource,
				avatarStatus: meta.avatarStatus,
				avatarReason: meta.avatarReason
			});
			return true;
		}
		if (url.searchParams.has("v") && (projection.openedFile || resolved?.kind === "data")) {
			const source = projection.openedFile ? { file: projection.openedFile } : { dataUrl: identity.avatar };
			const image = await (await loadAvatarThumbnail()).readGatewayAvatarThumbnail(source);
			requestAuth.assertCurrent();
			res.setHeader("vary", "Authorization, Cookie");
			sendHttpImageResponse({
				req,
				res,
				image,
				filename: "avatar",
				cacheControl: url.searchParams.get("v") === gatewayAvatarImageRevision(source) ? "private, max-age=31536000, immutable" : "private, no-cache"
			});
			return true;
		}
		if (resolved?.kind !== "local" || !projection.openedFile) {
			respondNotFound(res);
			return true;
		}
		const body = req.method === "HEAD" ? void 0 : await readFileDescriptorBounded(projection.openedFile.fd, AVATAR_MAX_BYTES);
		requestAuth.assertCurrent();
		res.setHeader("Content-Type", resolveAvatarMime(projection.openedFile.path));
		res.setHeader("Cache-Control", "no-cache");
		if (req.method === "HEAD") {
			res.statusCode = 200;
			res.setHeader("Content-Length", String(projection.openedFile.stat.size));
			res.end();
			return true;
		}
		res.end(body);
		return true;
	} catch {
		if (!res.writableEnded && !res.destroyed) {
			requestAuth.assertCurrent();
			respondNotFound(res);
		}
		return true;
	} finally {
		if (projection.openedFile) fs.closeSync(projection.openedFile.fd);
	}
}
async function serveResolvedIndexHtml(req, res, body, basePath, allowWasm, environment, buildId) {
	const normalizedBasePath = normalizeControlUiBasePath(basePath);
	const withBasePath = rewriteControlUiIndexHtmlAssetHrefs(body, normalizedBasePath, buildId);
	const basePathAttribute = ` ${CONTROL_UI_BASE_PATH_ATTRIBUTE}="${escapeHtml(normalizedBasePath)}"`;
	const environmentAttributes = environment ? ` ${CONTROL_UI_ENVIRONMENT_ATTRIBUTE}="${escapeHtml(JSON.stringify(environment))}"` : "";
	const buildAttribute = buildId ? ` ${CONTROL_UI_BUILD_ID_ATTRIBUTE}="${escapeHtml(buildId)}"` : "";
	const prepared = withBasePath.replace(/<html\b[^>]*>/i, (tag) => tag.replace(new RegExp(`\\s${CONTROL_UI_BUILD_ID_ATTRIBUTE}="[^"]*"`, "g"), "").replace(/<html\b/i, `<html${basePathAttribute} ${CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE}="${allowWasm === true}"${environmentAttributes}${buildAttribute}`));
	const hashes = computeInlineScriptHashes(prepared);
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader({
		inlineScriptHashes: hashes,
		allowWasm,
		portalHost: req.headers.host
	}));
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-cache");
	await sendControlUiHtmlBody(req, res, prepared);
}
function isExpectedSafePathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function resolveSafeControlUiFile(rootReal, filePath, rejectHardlinks) {
	const opened = openRootFileSync({
		absolutePath: filePath,
		rootPath: rootReal,
		rootRealPath: rootReal,
		boundaryLabel: "control ui root",
		skipLexicalRootCheck: true,
		rejectSymlinks: false,
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
		fd: opened.fd,
		size: opened.stat.size,
		mtimeMs: opened.stat.mtimeMs
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
	const terminalEnabled = opts?.terminalEnabled ?? isTerminalConfigEnabled(opts?.config);
	const route = classifyControlUiRequest({
		basePath,
		pathname,
		search: url.search,
		method: req.method,
		accept: req.headers?.accept
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
	if (isControlUiSharePath(pathname, basePath) && pathname !== `${basePath}/share/card.png`) {
		serveControlUiShareDocument(req, res, url, basePath, resolveGatewayPublicOrigin(opts?.config));
		return true;
	}
	if (matchesControlUiBootstrapConfigPath(pathname, basePath)) {
		let pluginFrameGrants = [];
		const requestAuth = await authorizeControlUiReadRequestOrReply({
			...opts,
			req,
			res,
			cfg: opts?.cfg ?? opts?.config,
			onPluginFrameGrants: (grants) => {
				pluginFrameGrants = grants;
			}
		});
		if (!requestAuth) return true;
		requestAuth.assertCurrent();
		if (req.method === "HEAD") {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.setHeader("Cache-Control", "no-cache");
			res.end();
			return true;
		}
		const config = opts?.config;
		const resolvedIdentity = config ? resolveAssistantIdentity({
			cfg: config,
			agentId: opts?.agentId
		}) : void 0;
		const identity = resolvedIdentity ?? DEFAULT_ASSISTANT_IDENTITY;
		const assistantAgentId = resolvedIdentity?.agentId;
		const avatarProjection = config && resolvedIdentity ? resolveGatewayAssistantAvatar({
			cfg: config,
			identity: resolvedIdentity,
			httpBasePath: basePath
		}) : {
			avatar: identity.avatar,
			resolution: null
		};
		const avatarMeta = controlUiAvatarResolutionMeta(avatarProjection.resolution);
		const devGitBranch = await resolveDevInstallGitBranch() ?? void 0;
		requestAuth.assertCurrent();
		sendJson(res, 200, {
			basePath,
			assistantName: identity.name,
			assistantAvatar: avatarProjection.avatar,
			assistantAvatarSource: avatarMeta.avatarSource,
			assistantAvatarStatus: avatarMeta.avatarStatus,
			assistantAvatarReason: avatarMeta.avatarReason,
			...assistantAgentId ? { assistantAgentId } : {},
			serverVersion: resolveRuntimeServiceVersion(process.env),
			serverBuildId: config?.gateway?.controlUi?.root === void 0 ? resolveRuntimeServiceBuildId() ?? void 0 : void 0,
			devGitBranch,
			embedSandbox: config?.gateway?.controlUi?.embedSandbox === "trusted" ? "trusted" : config?.gateway?.controlUi?.embedSandbox === "strict" ? "strict" : "scripts",
			allowExternalEmbedUrls: config?.gateway?.controlUi?.allowExternalEmbedUrls === true,
			automaticallyFetchFavicons: config?.gateway?.controlUi?.automaticallyFetchFavicons !== false,
			seamColor: config?.ui?.seamColor,
			environment: config?.gateway?.controlUi?.environment,
			communityInvite: config?.gateway?.controlUi?.communityInvite !== false,
			terminalEnabled,
			cliAgentsEnabled: config?.gateway?.cliAgents?.enabled !== false,
			pluginAssetsRequireAuth: opts?.auth !== void 0 && opts.auth.mode !== "none",
			pluginFrameGrants: pluginFrameGrants.map(({ pluginId, path: grantPath, match }) => ({
				pluginId,
				path: grantPath,
				match
			}))
		});
		return true;
	}
	const rootState = opts?.root;
	if (rootState?.kind === "invalid") {
		respondControlUiAssetsUnavailable(res, { configuredRootPath: rootState.path });
		return true;
	}
	if (rootState?.kind === "preparing") {
		respondControlUiAssetsUnavailable(res, { preparing: true });
		return true;
	}
	if (rootState?.kind === "failed") {
		respondControlUiAssetsUnavailable(res, { failed: true });
		return true;
	}
	if (!rootState || rootState.kind === "missing") {
		respondControlUiAssetsUnavailable(res);
		return true;
	}
	const root = rootState.path;
	const rootReal = (() => {
		if (rootState.realPath) return rootState.realPath;
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
	const standaloneDocument = isControlUiApprovalDocumentPath({
		basePath,
		pathname
	}) || isControlUiFocusDocumentPath({
		basePath,
		pathname
	});
	const rel = (() => {
		if (uiPath === "/share/card.png") return "social-card.png";
		if (uiPath === ROOT_PREFIX) return "";
		if (uiPath.startsWith(CONTROL_UI_NAMESPACE_PREFIX)) {
			const namespacedRel = uiPath.slice(14);
			if (isControlUiRootPublicAsset(namespacedRel)) return namespacedRel;
		}
		const assetsIndex = uiPath.indexOf("/assets/");
		if (assetsIndex >= 0) return uiPath.slice(assetsIndex + 1);
		return uiPath.slice(1);
	})();
	const requested = standaloneDocument ? "index.html" : rel && !rel.endsWith("/") ? rel : `${rel}index.html`;
	let fileRel;
	try {
		fileRel = decodeURIComponent(requested);
	} catch {
		respondNotFound(res);
		return true;
	}
	if (!isSafeRelativePath(fileRel)) {
		respondNotFound(res);
		return true;
	}
	const filePath = path.resolve(root, fileRel);
	if (!isWithinDir(root, filePath)) {
		respondNotFound(res);
		return true;
	}
	const isBundledRoot = rootState.kind === "bundled";
	if (isBundledRoot && isControlUiPrecompressedAssetExtension(path.extname(fileRel).toLowerCase())) {
		respondNotFound(res);
		return true;
	}
	const rejectHardlinks = !isBundledRoot;
	const fingerprintedAsset = isBundledRoot && fileRel.startsWith("assets/");
	const publicAssetBuildId = isBundledRoot ? rootState.publicAssetBuildId : void 0;
	const immutableAsset = fingerprintedAsset || Boolean(publicAssetBuildId && url.searchParams.get("v") === publicAssetBuildId && isControlUiVersionedPublicAsset(fileRel));
	let servingRootReal = rootReal;
	let rejectRepresentationHardlinks = rejectHardlinks;
	let safeFile = resolveSafeControlUiFile(rootReal, filePath, rejectHardlinks);
	if (!safeFile && fingerprintedAsset && rootState.kind === "bundled") {
		const retained = rootState.retainedAssets?.resolveAsset(fileRel);
		if (retained) {
			servingRootReal = retained.rootRealPath;
			rejectRepresentationHardlinks = true;
			safeFile = resolveSafeControlUiFile(retained.rootRealPath, retained.filePath, true);
		}
	}
	if (safeFile && path.basename(fileRel) !== "index.html" && path.basename(safeFile.path) !== "index.html") {
		const originatedAtMs = Date.now();
		const lastModifiedMs = Math.floor(Math.min(safeFile.mtimeMs, originatedAtMs) / 1e3) * 1e3;
		const representation = resolveOpenedControlUiRepresentation({
			req,
			sourceFile: safeFile,
			contentPath: fileRel,
			precompressed: fingerprintedAsset,
			openPrecompressedFile: (compressedPath) => resolveSafeControlUiFile(servingRootReal, compressedPath, rejectRepresentationHardlinks)
		});
		if (!representation) {
			respondControlUiNotAcceptable(res);
			return true;
		}
		if (isControlUiFileUnmodified(req, lastModifiedMs, originatedAtMs)) {
			fs.closeSync(representation.bodyFile.fd);
			respondControlUiNotModified(res, {
				immutable: immutableAsset,
				lastModifiedMs
			});
			return true;
		}
		if (req.method === "HEAD") try {
			respondHeadForControlUiFile(res, fileRel, {
				immutable: immutableAsset,
				encoding: representation.encoding,
				contentLength: representation.bodyFile.size,
				lastModifiedMs
			});
			return true;
		} finally {
			fs.closeSync(representation.bodyFile.fd);
		}
		const body = await readAndCloseControlUiFile(representation.bodyFile);
		await serveControlUiAsset(res, fileRel, body, {
			immutable: immutableAsset,
			encoding: representation.encoding,
			lastModifiedMs
		});
		return true;
	}
	if (!safeFile) {
		if (isControlUiStaticAssetExtension(path.extname(fileRel).toLowerCase())) {
			respondNotFound(res);
			return true;
		}
		if (!route.spaFallback) return false;
		const indexPath = path.resolve(root, "index.html");
		if (filePath !== indexPath) safeFile = resolveSafeControlUiFile(rootReal, indexPath, rejectHardlinks);
	}
	if (safeFile) {
		if (req.method === "HEAD") try {
			const encoding = resolveControlUiHtmlEncoding(req);
			if (encoding === "not-acceptable") {
				respondControlUiNotAcceptable(res);
				return true;
			}
			respondHeadForControlUiFile(res, "index.html", { encoding: encoding === "identity" ? void 0 : encoding });
			return true;
		} finally {
			fs.closeSync(safeFile.fd);
		}
		await serveResolvedIndexHtml(req, res, (await readAndCloseControlUiFile(safeFile)).toString("utf8"), basePath, terminalEnabled, opts?.config?.gateway?.controlUi?.environment, publicAssetBuildId);
		return true;
	}
	respondNotFound(res);
	return true;
}
//#endregion
export { handleControlUiAssistantMediaRequest, handleControlUiAvatarRequest, handleControlUiHttpRequest };
