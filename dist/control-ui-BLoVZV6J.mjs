import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { I as resolveTimestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as FsSafeError, u as openLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-BJGPJZu6.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { n as createHttpRequestAbortSignal } from "./http-request-lifecycle-DO9mb9Gu.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { d as CONTROL_UI_BUILD_ID_ATTRIBUTE, f as CONTROL_UI_ROOT_PUBLIC_ASSETS, h as isControlUiVersionedPublicAsset, m as isControlUiRootPublicAsset, p as buildControlUiRootAssetPath, u as selectControlUiRoutePreloads } from "./control-ui-assets-CIZQnoxr.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./src-D0qIyKKg.mjs";
import { a as resolveControlUiHtmlEncoding, c as respondControlUiNotModified, d as serveControlUiAsset, f as isControlUiSharePath, g as isControlUiApprovalDocumentPath, h as classifyControlUiRequest, i as isControlUiStaticAssetExtension, l as respondHeadForControlUiFile, m as serveControlUiShareDocument, n as readControlUiRootAsset, o as resolveControlUiRepresentation, r as isControlUiFileUnmodified, s as respondControlUiNotAcceptable, u as sendControlUiHtmlBody, v as isControlUiPrecompressedAssetExtension, y as isControlUiFocusPath } from "./server-control-ui-root-CPI3EUJf.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as startsWithSvgRootElement } from "./svg-image-1iOdCRUI.mjs";
import { c as resolveAvatarMime } from "./avatar-policy-DiIdI6oM.mjs";
import { a as CONTROL_UI_BOOTSTRAP_CONFIG_PATH, i as CONTROL_UI_BASE_PATH_ATTRIBUTE, l as CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE, s as CONTROL_UI_ENVIRONMENT_ATTRIBUTE } from "./zod-schema.gateway-CHIeMx7g.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { n as isCloudWorkerPlacementState } from "./session-placement-state-BsPYZ8PU.mjs";
import { i as getUserProfileListItem } from "./user-profiles-DYQbtiqy.mjs";
import { l as kindFromMime, n as detectMime } from "./mime-CGDYrRzL.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-BrMPjfvW.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { r as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { i as getDefaultMediaLocalRoots, n as getAgentScopedMediaLocalRoots } from "./local-roots-D6JiS64U.mjs";
import { o as extractOriginalFilename } from "./store-A0dMc8iV.mjs";
import { a as resolveMediaReferenceLocalPathInfo } from "./media-reference-BIOMSmeS.mjs";
import { n as LocalMediaAccessError, r as assertLocalMediaAllowed } from "./local-media-access-BBHmTniP.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-98j7PlVT.mjs";
import { i as parseControlUiResourcePath, o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
import { i as DEFAULT_ASSISTANT_IDENTITY, n as prepareGatewayAssistantAvatar, o as resolveAssistantIdentity, r as resolveGatewayAssistantAvatar, t as gatewayAssistantAvatarUrl } from "./assistant-avatar-CM_Vhve2.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { c as createProfileSessionEntryFilter } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-OA6C5SsW.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-dF8y1aAa.mjs";
import { S as respondPlainText, b as isReadHttpMethod, x as respondNotFound } from "./http-common-D3e5uEH1.mjs";
import { i as resolvePlaybackTranscode, n as replacePlaybackFileExtension, r as resolvePlaybackMetadataForSource, t as PlaybackInspectionBusyError } from "./playback-transcode-C-N3hhLf.mjs";
import { r as resolveAssistantMediaFilename, t as buildAssistantMediaContentDisposition } from "./assistant-media-content-disposition-B3NSqIRL.mjs";
import { i as writeByteHeaders, r as resolveByteResponse, t as createGatewayByteStream } from "./http-byte-range-3Zwag20C.mjs";
import { h as resolveHttpProfile, m as applyHttpOperatorRoleScopeCeiling, t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-BhzlHO9u.mjs";
import "./http-utils-B-HtYJ8A.mjs";
import { r as applyHttpImageContentSecurityPolicy, s as sendHttpImageResponse } from "./http-image-response-CJ3oDAly.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { readFileWindowFully, safeFileURLToPath } from "@openclaw/fs-safe/advanced";
import { isWithinDir } from "@openclaw/fs-safe/path";
//#region src/infra/dev-install-branch.ts
const GIT_TIMEOUT_MS = 3e3;
const HIDDEN_BRANCHES = /* @__PURE__ */ new Set([
	"main",
	"master",
	"HEAD"
]);
async function detectDevInstallGitBranch(packageRoot) {
	const root = packageRoot ? path.resolve(packageRoot) : null;
	if (!root) return null;
	const topRes = await runCommandWithTimeout([
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
	const branchRes = await runCommandWithTimeout([
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
	}).then(detectDevInstallGitBranch).catch(() => null);
	return cached;
}
//#endregion
//#region src/gateway/assistant-media-errors.ts
function classifyAssistantMediaError(err) {
	if (err instanceof PlaybackInspectionBusyError) return {
		available: false,
		code: "attachment-unavailable",
		reason: err.message,
		retryable: true
	};
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
//#region src/gateway/control-ui-bootstrap-presentation.ts
/** Public presentation settings of the Gateway serving the UI, never model permissions. */
function resolveControlUiBootstrapPresentation(config) {
	return {
		embedSandbox: config?.gateway?.controlUi?.embedSandbox === "trusted" ? "trusted" : config?.gateway?.controlUi?.embedSandbox === "strict" ? "strict" : "scripts",
		allowExternalEmbedUrls: config?.gateway?.controlUi?.allowExternalEmbedUrls === true,
		automaticallyFetchFavicons: config?.gateway?.controlUi?.automaticallyFetchFavicons !== false,
		seamColor: config?.ui?.seamColor,
		environment: config?.gateway?.controlUi?.environment,
		communityInvite: config?.gateway?.controlUi?.communityInvite !== false,
		newSessionModelDefaults: config?.gateway?.controlUi?.newSessionModelDefaults ?? "last-used",
		uploadsEnabled: config?.gateway?.uploads?.enabled !== false
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
		"blob:",
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
		"frame-src 'self' blob: http: https:",
		`script-src ${scriptTokens.join(" ")}`,
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"img-src 'self' data: blob: https:",
		"media-src 'self' data: blob:",
		"font-src 'self' https://fonts.gstatic.com",
		"worker-src 'self'",
		`connect-src ${connectTokens.join(" ")}`
	].join("; ");
}
function applyControlUiSecurityHeaders(res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader());
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("Permissions-Policy", "camera=(self), microphone=*, geolocation=*, clipboard-write=*");
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
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-cache");
	res.end(JSON.stringify(body));
}
function respondControlUiAssetsUnavailable(res, root) {
	const message = root?.kind === "preparing" ? "Control UI assets are being prepared. Try again shortly." : root?.kind === "failed" ? "Control UI assets could not be prepared. Check the Gateway logs or run `openclaw doctor --fix`." : root?.kind === "invalid" && root.path ? `Control UI assets not found at ${root.path}. Build them with \`pnpm ui:build\` (auto-installs UI deps), or update gateway.controlUi.root.` : CONTROL_UI_ASSETS_MISSING_MESSAGE;
	if (root?.kind === "preparing") {
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
async function resolveAssistantMediaAvailability(source, policy, allowance, agentId, signal, assertCurrent) {
	try {
		assertCurrent();
		const { opened, mimeType, file } = await openAssistantMedia(source, policy, allowance);
		await opened[Symbol.asyncDispose]();
		const mediaKind = kindFromMime(mimeType);
		const playbackMetadata = mimeType && (mediaKind === "audio" || mediaKind === "video") ? await resolvePlaybackMetadataForSource({
			sourcePath: opened.realPath,
			sourceStat: opened.stat,
			mimeType,
			kind: mediaKind,
			signal,
			assertCurrent
		}) : void 0;
		return {
			available: true,
			...mimeType ? { mimeType } : {},
			sizeBytes: opened.stat.size,
			...playbackMetadata,
			...createAssistantMediaTicket({
				source,
				agentId,
				session: policy.session,
				reader: policy.reader,
				...file ? { file } : {}
			})
		};
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
	if (isMetaRequest) try {
		var _usingCtx$1 = _usingCtx();
		const requestAbort = createHttpRequestAbortSignal(res.req, res);
		_usingCtx$1.u({ [Symbol.dispose]: requestAbort.cleanup });
		const availability = await resolveAssistantMediaAvailability(source, policy, allowance, agentId, requestAbort.signal, assertCurrentPolicy);
		if (requestAbort.signal.aborted) return true;
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
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
	let byteStream;
	try {
		const media = await openAssistantMedia(source, policy, allowance);
		let opened = media.opened;
		byteStream = createGatewayByteStream(res, opened.handle, () => respondNotFound(res));
		let contentType = media.mimeType ?? "application/octet-stream";
		let filename = media.reference.kind === "inbound" ? resolveAssistantMediaFilename(extractOriginalFilename(media.reference.path), url.searchParams.get("filename")) : path.basename(media.reference.path);
		const mediaKind = kindFromMime(contentType);
		if (url.searchParams.get("playback") === "1" && (mediaKind === "audio" || mediaKind === "video")) {
			const playback = await resolvePlaybackTranscode({
				sourcePath: opened.realPath,
				sourceStat: opened.stat,
				mimeType: contentType,
				kind: mediaKind,
				signal: byteStream.signal,
				assertCurrent: assertCurrentPolicy
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
		if (!res.destroyed && !res.writableEnded) respondNotFound(res);
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
	try {
		const identity = await resolveAssistantIdentity({
			cfg: opts.config,
			agentId
		});
		const projection = await prepareGatewayAssistantAvatar({
			cfg: opts.config,
			identity,
			readBody: url.searchParams.get("meta") !== "1" && (req.method !== "HEAD" || url.searchParams.has("v"))
		});
		requestAuth.assertCurrent();
		const resolved = projection.resolution;
		if (url.searchParams.get("meta") === "1") {
			sendJson(res, 200, {
				avatarUrl: gatewayAssistantAvatarUrl(projection, basePath, agentId) ?? (resolved?.kind === "remote" ? resolved.url : null),
				...controlUiAvatarResolutionMeta(resolved)
			});
			return true;
		}
		if (url.searchParams.has("v") && projection.image) {
			const image = await (await loadAvatarThumbnail()).readGatewayAvatarThumbnail(projection.image);
			requestAuth.assertCurrent();
			res.setHeader("vary", "Authorization, Cookie");
			sendHttpImageResponse({
				req,
				res,
				image,
				filename: "avatar",
				cacheControl: url.searchParams.get("v") === projection.image.revision ? "private, max-age=31536000, immutable" : "private, no-cache"
			});
			return true;
		}
		if (resolved?.kind !== "local" || !projection.file) {
			respondNotFound(res);
			return true;
		}
		res.setHeader("Content-Type", resolveAvatarMime(projection.file.path));
		res.setHeader("Cache-Control", "no-cache");
		if (req.method === "HEAD") {
			res.statusCode = 200;
			res.setHeader("Content-Length", String(projection.file.stat.size));
			res.end();
			return true;
		}
		res.end(projection.file.body);
		return true;
	} catch {
		if (!res.writableEnded && !res.destroyed) {
			requestAuth.assertCurrent();
			respondNotFound(res);
		}
		return true;
	}
}
async function serveResolvedIndexHtml(req, res, body, uiPath, basePath, allowWasm, environment, buildId) {
	const normalizedBasePath = normalizeControlUiBasePath(basePath);
	const preloadRoute = uiPath === "/chat" || uiPath.startsWith("/chat/") ? "chat" : uiPath === "/new" || uiPath === "/new/" ? "new" : null;
	const withBasePath = rewriteControlUiIndexHtmlAssetHrefs(selectControlUiRoutePreloads(body, preloadRoute), normalizedBasePath, buildId);
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
function isSafeRelativePath(relPath) {
	if (!relPath) return false;
	const normalized = path.posix.normalize(relPath);
	return !(path.posix.isAbsolute(normalized) || path.win32.isAbsolute(normalized) || normalized.startsWith("../") || normalized === ".." || normalized.includes("\0"));
}
const CONTROL_UI_DEFAULT_NAMESPACE_BOOTSTRAP_CONFIG_PATH = `${CONTROL_UI_NAMESPACE_PREFIX.replace(/\/$/, "")}${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`;
function matchesControlUiBootstrapConfigPath(pathname, basePath) {
	return pathname === `${basePath}/control-ui-config.json` || basePath === "" && pathname === CONTROL_UI_DEFAULT_NAMESPACE_BOOTSTRAP_CONFIG_PATH;
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
		const resolvedIdentity = config ? await resolveAssistantIdentity({
			cfg: config,
			agentId: opts?.agentId
		}) : void 0;
		const identity = resolvedIdentity ?? DEFAULT_ASSISTANT_IDENTITY;
		const assistantAgentId = resolvedIdentity?.agentId;
		const avatarProjection = config && resolvedIdentity ? await resolveGatewayAssistantAvatar({
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
			...resolveControlUiBootstrapPresentation(config),
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
	if (!rootState || rootState.kind !== "bundled" && rootState.kind !== "resolved") {
		respondControlUiAssetsUnavailable(res, rootState);
		return true;
	}
	const root = rootState.path;
	if (!(rootState.realPath || await fs.promises.realpath(root).catch((error) => {
		if (isExpectedSafePathError(error)) return null;
		throw error;
	}))) {
		respondControlUiAssetsUnavailable(res);
		return true;
	}
	const uiPath = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
	const standaloneDocument = isControlUiApprovalDocumentPath({
		basePath,
		pathname
	}) || isControlUiFocusPath(pathname, basePath);
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
	const fingerprintedAsset = isBundledRoot && fileRel.startsWith("assets/");
	const publicAssetBuildId = isBundledRoot ? rootState.publicAssetBuildId : void 0;
	const immutableAsset = fingerprintedAsset || Boolean(publicAssetBuildId && url.searchParams.get("v") === publicAssetBuildId && isControlUiVersionedPublicAsset(fileRel));
	const readBody = req.method !== "HEAD" && req.headers?.["if-none-match"] === void 0 && req.headers?.["if-modified-since"] === void 0;
	let asset = await readControlUiRootAsset(rootState, fileRel, readBody);
	if (!asset) {
		if (isControlUiStaticAssetExtension(path.extname(fileRel).toLowerCase())) {
			respondNotFound(res);
			return true;
		}
		if (!route.spaFallback) return false;
		if (filePath !== path.resolve(root, "index.html")) {
			fileRel = "index.html";
			asset = await readControlUiRootAsset(rootState, fileRel, readBody);
		}
	}
	const serve = async (prepared) => {
		if (!prepared) {
			respondNotFound(res);
			return;
		}
		if (path.basename(fileRel) === "index.html" || path.basename(prepared.file.path) === "index.html") {
			if (req.method === "HEAD") {
				const encoding = resolveControlUiHtmlEncoding(req);
				if (encoding === "not-acceptable") {
					respondControlUiNotAcceptable(res);
					return;
				}
				respondHeadForControlUiFile(res, "index.html", { encoding: encoding === "identity" ? void 0 : encoding });
				return;
			}
			if (!prepared.file.body) return await serve(await readControlUiRootAsset(rootState, fileRel, true));
			await serveResolvedIndexHtml(req, res, prepared.file.body.toString("utf8"), uiPath, basePath, terminalEnabled, opts?.config?.gateway?.controlUi?.environment, publicAssetBuildId);
			return;
		}
		const originatedAtMs = Date.now();
		const lastModifiedMs = Math.floor(Math.min(prepared.file.mtimeMs, originatedAtMs) / 1e3) * 1e3;
		const representation = resolveControlUiRepresentation({
			req,
			asset: prepared,
			contentPath: fileRel,
			precompressed: fingerprintedAsset
		});
		if (!representation) {
			respondControlUiNotAcceptable(res);
			return;
		}
		if (isControlUiFileUnmodified(req, lastModifiedMs, originatedAtMs)) {
			respondControlUiNotModified(res, {
				immutable: immutableAsset,
				lastModifiedMs
			});
			return;
		}
		const headers = {
			immutable: immutableAsset,
			encoding: representation.encoding,
			lastModifiedMs
		};
		if (req.method === "HEAD") respondHeadForControlUiFile(res, fileRel, {
			...headers,
			contentLength: representation.file.size
		});
		else if (representation.file.body) serveControlUiAsset(res, fileRel, representation.file.body, headers);
		else await serve(await readControlUiRootAsset(rootState, fileRel, true));
	};
	await serve(asset);
	return true;
}
//#endregion
export { handleControlUiAssistantMediaRequest, handleControlUiAvatarRequest, handleControlUiHttpRequest };
