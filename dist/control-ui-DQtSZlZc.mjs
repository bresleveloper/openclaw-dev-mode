import { I as resolveTimestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-jg_14gWz.mjs";
import { t as FsSafeError, u as openLocalFileSafely } from "./fs-safe-6Z4UiMS4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-CSDERtm3.mjs";
import { t as isControlUiFocusPath } from "./focus-DxRHZNgd.mjs";
import { n as startsWithSvgRootElement } from "./svg-image-1iOdCRUI.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { c as resolveAvatarMime } from "./avatar-policy-DiIdI6oM.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { a as CONTROL_UI_BASE_PATH_ATTRIBUTE, c as CONTROL_UI_ENVIRONMENT_ATTRIBUTE, d as matchesControlUiBootstrapConfigPath, o as CONTROL_UI_BOOTSTRAP_CONFIG_ATTRIBUTE, u as CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE } from "./zod-schema.gateway-DYzs4yT2.mjs";
import "./io-DIF-KW3P.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { n as isCloudWorkerPlacementState } from "./session-placement-state-BsPYZ8PU.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { r as CHAT_PENDING_INPUT_MESSAGE_PREFIX } from "./chat-history-constants-BGgHv5E_.mjs";
import { t as captureResidentUserProfileAccess } from "./user-profile-list-BdNJnrJe.mjs";
import { i as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-orsENUww.mjs";
import { l as kindFromMime, n as detectMime } from "./mime-C3j3dfQb.mjs";
import { t as MAX_PAYLOAD_BYTES } from "./payload-limits-ChDi8AHf.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { f as readPersistedMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { t as sameTranscriptEntryAnchor } from "./transcript-entry-anchor-CzuOcGtx.mjs";
import { t as readRetainedSessionEntryFacts } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { n as readSessionPendingInput } from "./session-pending-input-history-DRfEA-VZ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { n as readSessionTranscriptAnchorsAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as getRemoteControlUiIngressContext, r as assertRemoteControlUiIngressCurrent } from "./ingress-attribution-CP_2XS9r.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { n as createProfileSessionEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { l as createHttpRequestAbortSignal } from "./http-body-DZQjJc2J.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { i as parseControlUiResourcePath, o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-B42sqIG-.mjs";
import { a as isControlUiVersionedPublicAsset, i as isControlUiRootPublicAsset, n as CONTROL_UI_ROOT_PUBLIC_ASSETS, r as buildControlUiRootAssetPath, t as CONTROL_UI_BUILD_ID_ATTRIBUTE } from "./control-ui-root-assets-DS7D1PNh.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
import { a as DEFAULT_ASSISTANT_IDENTITY, i as resolveGatewayAssistantAvatar, n as gatewayAssistantAvatarUrl, r as prepareGatewayAssistantAvatar, s as resolveAssistantIdentity, t as controlUiAvatarResolutionMeta } from "./assistant-avatar-DB_cUu5U.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-OPzI_0T6.mjs";
import { u as selectControlUiRoutePreloads } from "./control-ui-assets-f8KcxxVR.mjs";
import { i as respondPlainText, n as isReadHttpMethod, r as respondNotFound } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { a as resolveControlUiHtmlEncoding, c as respondControlUiNotModified, d as serveControlUiAsset, i as isControlUiStaticAssetExtension, l as respondHeadForControlUiFile, n as readControlUiRootAsset, o as resolveControlUiRepresentation, r as isControlUiFileUnmodified, s as respondControlUiNotAcceptable, u as sendControlUiHtmlBody } from "./server-control-ui-root-DH7UOjd4.mjs";
import { n as isControlUiApprovalDocumentPath, t as classifyControlUiRequest } from "./control-ui-routing-uAI8BQgZ.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import { r as serveControlUiShareDocument, t as isControlUiSharePath } from "./control-ui-share-DxzTW02e.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import { t as splitMediaFromOutput } from "./parse-BFtzJA_B.mjs";
import { i as getDefaultMediaLocalRoots, n as getAgentScopedMediaLocalRoots } from "./local-roots-B-x-73co.mjs";
import { o as extractOriginalFilename } from "./store-BOkrav0N.mjs";
import { a as resolveMediaReferenceLocalPathInfo, t as buildInboundMediaUriFromPath } from "./media-reference-Dlq4zAi4.mjs";
import { n as LocalMediaAccessError, r as assertLocalMediaAllowed } from "./local-media-access-D8o0XeaK.mjs";
import { l as readSessionWorkerPlacementAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { u as extractCanvasShortcodes } from "./chat-display-projection.canvas-CwC0V7fB.mjs";
import { o as readSessionMessageByIdAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-DJzLYZPW.mjs";
import { i as resolvePlaybackTranscode, n as replacePlaybackFileExtension, r as resolvePlaybackMetadataForSource, t as PlaybackInspectionBusyError } from "./playback-transcode-5Dvqn6Gd.mjs";
import { r as resolveAssistantMediaFilename, t as buildAssistantMediaContentDisposition } from "./assistant-media-content-disposition-wN2bcgk6.mjs";
import { i as writeByteHeaders, r as resolveByteResponse, t as createGatewayByteStream } from "./http-byte-range-Dn3lj8O7.mjs";
import { _ as resolveHttpProfile, g as prepareHttpUserProfileCatalog, h as applyHttpOperatorRoleScopeCeiling, t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-DvoR_YDD.mjs";
import "./http-utils-C7PagBsR.mjs";
import { r as applyHttpImageContentSecurityPolicy, s as sendHttpImageResponse } from "./http-image-response-W_WEsC5b.mjs";
import { t as projectPendingInputMessage } from "./chat-pending-inputs-B_VF-iWj.mjs";
import { n as buildControlUiCspHeader, r as computeInlineScriptHashes, t as applyControlUiSecurityHeaders } from "./control-ui-csp-BrS2VJKI.mjs";
import fs from "node:fs";
import { createHmac, randomBytes } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
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
	], {
		timeoutMs: GIT_TIMEOUT_MS,
		env: { GIT_NO_LAZY_FETCH: "1" }
	});
	if (topRes.code !== 0) return null;
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
	], {
		timeoutMs: GIT_TIMEOUT_MS,
		env: { GIT_NO_LAZY_FETCH: "1" }
	});
	if (branchRes.code !== 0) return null;
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
//#region src/gateway/assistant-media-policy.ts
function assertAssistantMediaPolicyCurrent(selection, policy, hasAllowance, requestAuth) {
	policy.assertCurrent?.();
	const current = resolvePreparedAssistantMediaPolicy({
		...selection,
		reader: policy.reader
	}, policy.readSession(), policy.readSession, policy.assertCurrent);
	if (current?.session) {
		const placement = policy.placementRead ? policy.placementRead.current() : resolveSessionWorkerPlacementContext().workerSessionPlacementService?.getMany([current.session.sessionId]).get(current.session.sessionId);
		current.remote ||= isCloudWorkerPlacementState(placement?.state);
	}
	if (requestAuth?.hasCurrentClientAuthority?.() === false || !current || current.session?.sessionKey !== policy.session?.sessionKey || current.session?.agentId !== policy.session?.agentId || current.session?.sessionId !== policy.session?.sessionId || current.messageId !== policy.messageId || current.remote !== policy.remote || current.executionCwd !== policy.executionCwd || current.workspaceOnly !== policy.workspaceOnly || current.localRoots.length !== policy.localRoots.length || current.localRoots.some((root, index) => root !== policy.localRoots[index]) || hasAllowance && policy.workspaceOnly && !current.canAllow) throw new FsSafeError("path-mismatch", "Media access changed");
	return current;
}
function resolveAssistantMediaReaderAuth(reader, config, messageRead) {
	try {
		const currentProfile = reader.profileId ? resolveHttpProfile(captureResidentUserProfileAccess(reader.profileId).assertCurrent().id, config) : void 0;
		const operatorScopes = applyHttpOperatorRoleScopeCeiling(reader.operatorScopes, currentProfile);
		if (!authorizeOperatorScopesForMethod(messageRead ? "chat.message.get" : "assistant.media.get", operatorScopes).allowed) return;
		return {
			authMethod: reader.authMethod,
			operatorScopes,
			...currentProfile
		};
	} catch {
		return;
	}
}
async function resolveAssistantMediaSessionPolicy(params) {
	let loaded;
	let readSession = () => loaded;
	let assertCurrent;
	if (params.sessionKey) {
		const owner = resolveRequestedSessionAgentId(params.config, params.sessionKey, params.agentId);
		if (!owner.ok) return;
		const canonicalKey = normalizeSessionKeyPreservingOpaquePeerIds(params.sessionKey);
		const source = captureSessionEntryMetadataRead({
			sessionKey: canonicalKey,
			agentId: owner.agentId
		}, () => {
			if (params.requestAuth?.hasCurrentClientAuthority?.() === false) throw new FsSafeError("path-mismatch", "Media access changed");
		});
		if (source) {
			assertCurrent = source.assertCurrent;
			readSession = () => ({
				cfg: readRuntimeConfig(),
				agentId: owner.agentId,
				canonicalKey,
				entry: source.readCurrent()
			});
			loaded = readSession();
		} else {
			const assertRoutingCurrent = captureSessionMutationRouting(readRuntimeConfig(), void 0, [{
				sessionKey: canonicalKey,
				agentId: owner.agentId
			}]);
			assertCurrent = () => assertRoutingCurrent(readRuntimeConfig());
			const { loadGatewaySessionEntryReadOnlyInWorker } = await import("./session-utils-store-worker-CmMErbaH.mjs");
			const durable = await loadGatewaySessionEntryReadOnlyInWorker({
				cfg: readRuntimeConfig(),
				key: params.sessionKey,
				agentId: owner.agentId,
				exactRead: true,
				readOnly: true,
				projection: []
			});
			readSession = () => {
				assertCurrent?.();
				return {
					...durable,
					cfg: readRuntimeConfig(),
					entry: readRetainedSessionEntryFacts({
						agentId: durable.readSource?.agentId ?? durable.agentId,
						path: durable.readSource?.path ?? durable.storePath
					}, {
						sessionKeys: [durable.canonicalKey],
						projection: "exact",
						snapshotFields: []
					})?.entries.find((row) => row.sessionKey === durable.canonicalKey)?.entry
				};
			};
			loaded = readSession();
		}
		if (!loaded?.entry?.sessionId) return;
	}
	return resolvePreparedAssistantMediaPolicy(params, loaded, readSession, assertCurrent);
}
function resolvePreparedAssistantMediaPolicy(params, loaded, readSession, assertCurrent) {
	if (params.sessionKey && !loaded?.entry?.sessionId) return;
	const config = loaded?.cfg ?? params.config;
	const reader = params.reader ?? (params.requestAuth ? {
		authMethod: params.requestAuth.authMethod,
		operatorScopes: params.requestAuth.operatorScopes,
		...params.requestAuth.authenticatedUserProfile ? { profileId: params.requestAuth.authenticatedUserProfile.profileId } : {}
	} : void 0);
	const auth = params.requestAuth ?? (reader ? resolveAssistantMediaReaderAuth(reader, config, Boolean(params.sessionKey && params.messageId)) : void 0);
	if (!auth || !reader) return;
	const standaloneRead = authorizeOperatorScopesForMethod("assistant.media.get", auth.operatorScopes).allowed;
	const messageId = standaloneRead ? void 0 : params.messageId;
	if (!standaloneRead && (!messageId || !loaded || !authorizeOperatorScopesForMethod("chat.message.get", auth.operatorScopes).allowed)) return;
	const agentId = loaded?.agentId ?? params.agentId;
	const entry = loaded?.entry;
	const remote = Boolean(entry?.execNode || entry?.repositoryWorkspaceId || entry?.deviceFolder);
	let session;
	let sessionRoot;
	let executionCwd;
	if (loaded && entry && agentId) {
		if (!auth.operatorScopes.includes("operator.admin")) {
			const profileId = auth.authenticatedUserProfile?.profileId;
			if (profileId && profileId !== "gateway-owner") {
				if (entry.incognito || isIncognitoSessionKey(loaded.canonicalKey)) return;
				if ((auth.operatorRolePolicy || messageId) && !createProfileSessionEntryFilter({
					profileId,
					sessionCap: auth.operatorRolePolicy?.sessions.others
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
	const workspaceOnly = !session || entry?.sandbox === "required" || (entry?.permissionMode ? resolveSessionPermissionCoreToolPolicy({ mode: entry.permissionMode }).workspaceOnly : resolveEffectiveToolFsWorkspaceOnly({
		cfg: config,
		agentId
	}));
	const localRoots = [...remote ? getDefaultMediaLocalRoots() : getAgentScopedMediaLocalRoots(config, agentId, workspaceOnly ? sessionRoot : void 0)];
	if (sessionRoot && !localRoots.includes(sessionRoot)) localRoots.push(sessionRoot);
	return {
		assertCurrent,
		readSession,
		messageId,
		session,
		executionCwd,
		remote,
		localRoots,
		workspaceOnly,
		reader,
		canAllow: auth.operatorScopes.includes("operator.admin")
	};
}
async function resolveAssistantMediaPolicy(params) {
	const policy = await resolveAssistantMediaSessionPolicy(params);
	if (!policy) return;
	const context = policy.session ? resolveSessionWorkerPlacementContext() : void 0;
	const placementRead = policy.session && context?.workerSessionPlacementService?.prepareSessionPlacement ? await context.workerSessionPlacementService.prepareSessionPlacement(policy.session.sessionId) : void 0;
	try {
		if (policy.session && context) {
			const placement = placementRead ? placementRead.current() : await readSessionWorkerPlacementAsync({
				context,
				sessionId: policy.session.sessionId
			});
			policy.remote ||= isCloudWorkerPlacementState(placement?.state);
		}
		return {
			...policy,
			placementRead
		};
	} catch (error) {
		placementRead?.release();
		throw error;
	}
}
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE = "assistant-media";
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_TTL_MS = 3e5;
const controlUiAssistantMediaTicketSecret = randomBytes(32);
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
		const decodedPayload = Buffer.from(encodedPayload, "base64url").toString("utf8");
		const payload = JSON.parse(decodedPayload);
		return payload.scope === CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE && typeof payload.source === "string" && (source === void 0 || payload.source === source) && payload.agentId === agentId && typeof payload.reader?.authMethod === "string" && Array.isArray(payload.reader.operatorScopes) && (payload.file === void 0 || typeof payload.file?.realPath === "string" && typeof payload.file.dev === "string" && typeof payload.file.ino === "string") && typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp >= now ? payload : void 0;
	} catch {
		return;
	}
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
	}
	else if (err instanceof Error && "code" in err) {
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
//#region src/gateway/control-ui-assistant-media-read.ts
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
			sourceStat: {
				size: opened.stat.size,
				mtimeMs: opened.stat.mtimeMs,
				ctimeMs: opened.stat.ctimeMs,
				exactIdentity: opened.exactIdentity
			},
			mimeType,
			kind: mediaKind,
			signal,
			assertCurrent
		}) : void 0;
		assertCurrent();
		return {
			available: true,
			...mimeType ? { mimeType } : {},
			sizeBytes: opened.stat.size,
			...playbackMetadata,
			...createAssistantMediaTicket({
				source,
				agentId,
				session: policy.session,
				...policy.messageId ? { messageId: policy.messageId } : {},
				reader: policy.reader,
				...file ? { file } : {}
			})
		};
	} catch (error) {
		return classifyAssistantMediaError(error);
	}
}
//#endregion
//#region src/gateway/control-ui-assistant-message-media.ts
function messageMediaSources(message) {
	const record = asOptionalRecord(message);
	if (!record) return [];
	const sources = (readPersistedMediaFacts(record) ?? []).flatMap((fact) => [fact.url, fact.path]);
	const display = record[ASSISTANT_DISPLAY_CONTENT_FIELD];
	const content = Array.isArray(display) ? display : record.content ?? record.text;
	const assistant = record.role === "assistant";
	const addDirectives = (text) => {
		sources.push(...splitMediaFromOutput(extractCanvasShortcodes(text).text, { extractAudioDirectives: false }).mediaUrls ?? []);
	};
	if (assistant && typeof content === "string") addDirectives(content);
	for (const value of Array.isArray(content) ? content : []) {
		const block = asOptionalRecord(value);
		if (!block) continue;
		const source = asOptionalRecord(block.source);
		switch (block.type) {
			case "text":
			case "input_text":
			case "output_text":
				if (assistant && typeof block.text === "string") addDirectives(block.text);
				break;
			case "attachment":
				sources.push(asOptionalRecord(block.attachment)?.url);
				break;
			case "image":
				sources.push(block.url, block.openUrl, source?.url);
				break;
			case "image_url":
				sources.push(asOptionalRecord(block.image_url)?.url);
				break;
			case "input_image":
				sources.push(block.image_url, asOptionalRecord(block.image_url)?.url, source?.url);
				break;
			case "audio":
			case "video": sources.push(block.url, source?.type === "url" ? source.url : void 0);
		}
	}
	return sources.filter((source) => typeof source === "string");
}
function mediaIdentity(source, cwd) {
	const normalized = normalizeAssistantMediaSource(source);
	if (!normalized) return;
	const inbound = parseInboundMediaUri(buildInboundMediaUriFromPath(normalized) ?? normalized);
	if (inbound) return `media://inbound/${encodeURIComponent(inbound.id)}`;
	return path.isAbsolute(normalized) ? path.resolve(normalized) : cwd && !/^[a-z][a-z0-9+.-]*:/iu.test(normalized) ? path.resolve(cwd, normalized) : void 0;
}
/** Bind narrow session readers to an existing visible message and its current media references. */
async function prepareAssistantMessageMedia(source, policy, signal) {
	if (!policy.messageId) return async (publish) => publish();
	const messageId = policy.messageId;
	const loaded = policy.readSession();
	if (!loaded?.entry?.sessionId) throw new FsSafeError("path-mismatch", "Message attachment unavailable");
	const scope = {
		agentId: loaded.readSource?.agentId ?? loaded.agentId,
		sessionKey: loaded.canonicalKey,
		sessionId: loaded.entry.sessionId,
		storePath: loaded.readSource?.path ?? loaded.storePath,
		sessionEntry: loaded.entry
	};
	const identity = mediaIdentity(source, policy.executionCwd);
	const assertAssociation = (message) => {
		signal.throwIfAborted();
		if (!identity || !messageMediaSources(message).some((candidate) => mediaIdentity(candidate, policy.executionCwd) === identity)) throw new FsSafeError("path-mismatch", "Message attachment unavailable");
	};
	if (messageId.startsWith("pending:")) {
		const inputId = messageId.slice(CHAT_PENDING_INPUT_MESSAGE_PREFIX.length);
		const project = (input) => input ? projectPendingInputMessage(input, MAX_PAYLOAD_BYTES) : void 0;
		assertAssociation(project(await readSessionPendingInput(scope, inputId)));
		return async (publish) => {
			let published = false;
			await readSessionPendingInput(scope, inputId, (current) => {
				assertAssociation(project(current));
				publish();
				published = true;
			});
			if (!published) throw new FsSafeError("path-mismatch", "Message attachment unavailable");
		};
	}
	const selection = { entryIds: [messageId] };
	const anchor = (await readSessionTranscriptAnchorsAsync(scope, selection, signal)).anchors[0];
	const selected = anchor && await readSessionMessageByIdAsync(scope, messageId, {
		currentOnly: true,
		maxBytes: 26214400,
		allowResetArchiveFallback: false,
		historyVisibility: {
			sessionStartedAt: loaded.entry.sessionStartedAt,
			requireVisible: true
		}
	}, signal);
	if (!anchor || !selected?.found || selected.oversized) throw new FsSafeError("path-mismatch", "Message attachment unavailable");
	assertAssociation(selected.message);
	return async (publish) => {
		let published = false;
		await readSessionTranscriptAnchorsAsync(scope, selection, signal, (current) => {
			if (!sameTranscriptEntryAnchor(anchor, current.anchors[0])) throw new FsSafeError("path-mismatch", "Message attachment changed");
			publish();
			published = true;
		});
		if (!published) throw new FsSafeError("path-mismatch", "Message attachment changed");
	};
}
//#endregion
//#region src/gateway/control-ui-bootstrap-presentation.ts
/** Public presentation settings of the Gateway serving the UI, never model permissions. */
function resolveControlUiBootstrapPresentation(config) {
	return {
		embedSandbox: config?.gateway?.controlUi?.embedSandbox ?? "scripts",
		allowExternalEmbedUrls: config?.gateway?.controlUi?.allowExternalEmbedUrls === true,
		automaticallyFetchFavicons: config?.gateway?.controlUi?.automaticallyFetchFavicons !== false,
		seamColor: config?.ui?.seamColor,
		environment: config?.gateway?.controlUi?.environment,
		chatBubblesEnabled: config?.gateway?.controlUi?.experimental?.chatBubbles === true,
		communityInvite: config?.gateway?.controlUi?.communityInvite !== false,
		newSessionModelDefaults: config?.gateway?.controlUi?.newSessionModelDefaults ?? "last-used",
		uploadsEnabled: config?.gateway?.uploads?.enabled !== false
	};
}
//#endregion
//#region src/gateway/control-ui-index.ts
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
async function serveControlUiIndexHtml(req, res, body, uiPath, basePath, allowWasm, environment, buildId, sessionEntryPath, isSessionEntryCurrent, proxySessionEntry = false, bootstrapConfig) {
	const ingress = getRemoteControlUiIngressContext(req);
	const normalizedBasePath = normalizeControlUiBasePath(basePath);
	const preloadRoute = uiPath === "/chat" || uiPath.startsWith("/chat/") ? "chat" : uiPath === "/new" || uiPath === "/new/" ? "new" : null;
	const withBasePath = rewriteControlUiIndexHtmlAssetHrefs(selectControlUiRoutePreloads(body, preloadRoute), normalizedBasePath, buildId);
	const basePathAttribute = ` ${CONTROL_UI_BASE_PATH_ATTRIBUTE}="${escapeHtml(normalizedBasePath)}"`;
	const bootstrapAttribute = bootstrapConfig ? ` ${CONTROL_UI_BOOTSTRAP_CONFIG_ATTRIBUTE}="${escapeHtml(JSON.stringify(bootstrapConfig))}"` : "";
	const environmentAttributes = environment ? ` ${CONTROL_UI_ENVIRONMENT_ATTRIBUTE}="${escapeHtml(JSON.stringify(environment))}"` : "";
	const buildAttribute = buildId ? ` ${CONTROL_UI_BUILD_ID_ATTRIBUTE}="${escapeHtml(buildId)}"` : "";
	const prepared = withBasePath.replace(/<html\b[^>]*>/i, (tag) => tag.replace(new RegExp(`\\s${CONTROL_UI_BUILD_ID_ATTRIBUTE}="[^"]*"`, "g"), "").replace(/<html\b/i, () => `<html${basePathAttribute}${ingress ? " data-openclaw-remote-ingress=\"true\"" : ""}${proxySessionEntry ? " data-openclaw-proxy-session-entry=\"true\"" : ""} ${CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE}="${allowWasm === true}"${environmentAttributes}${buildAttribute}${bootstrapAttribute}`));
	const document = sessionEntryPath ? prepared.replace(/<head\b[^>]*>/i, (tag) => `${tag}<script>history.replaceState(null,"",${JSON.stringify(sessionEntryPath).replaceAll("<", "\\u003c")}+location.hash);<\/script>`) : prepared;
	const hashes = computeInlineScriptHashes(document);
	if (ingress) assertRemoteControlUiIngressCurrent(ingress);
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader({
		inlineScriptHashes: hashes,
		allowWasm,
		portalHost: req.headers.host,
		frameAncestors: ingress?.frameAncestors
	}));
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", bootstrapConfig ? "private, no-store" : sessionEntryPath ? "no-store" : "no-cache");
	await sendControlUiHtmlBody(req, res, document, isSessionEntryCurrent);
}
//#endregion
//#region src/gateway/control-ui.ts
const ROOT_PREFIX = "/";
const CONTROL_UI_ASSETS_MISSING_MESSAGE = "Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.";
const loadAvatarThumbnail = createLazyRuntimeModule(() => import("./assistant-avatar-thumbnail.runtime.js"));
const CONTROL_UI_NAMESPACE_PREFIX = "/__openclaw__/";
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
async function handleControlUiAssistantMediaRequest(req, res, opts) {
	try {
		var _usingCtx$1 = _usingCtx();
		const urlRaw = req.url;
		if (!urlRaw) return false;
		const url = new URL(urlRaw, "http://localhost");
		if (url.pathname !== resolveAssistantMediaRoutePath(opts?.basePath)) return false;
		const isMetaRequest = url.searchParams.get("meta") === "1";
		const explicitAllow = req.method === "POST" && isMetaRequest && url.searchParams.get("allow") === "1";
		if (!isReadHttpMethod(req.method) && !explicitAllow) return false;
		applyControlUiSecurityHeaders(res, getRemoteControlUiIngressContext(req));
		let source = normalizeAssistantMediaSource(url.searchParams.get("source") ?? "");
		if (!source) {
			respondNotFound(res);
			return true;
		}
		const sessionKey = url.searchParams.get("sessionKey")?.trim() || void 0;
		const messageId = sessionKey ? url.searchParams.get("messageId")?.trim() || void 0 : void 0;
		const agentId = sessionKey ? url.searchParams.get("agentId")?.trim() || void 0 : opts?.agentId;
		const relativeSource = !path.isAbsolute(source) && !/^[a-z][a-z0-9+.-]*:/iu.test(source);
		const ticketCandidate = verifyAssistantMediaTicket(url.searchParams.get("mediaTicket"), relativeSource ? void 0 : source, agentId);
		const ingress = getRemoteControlUiIngressContext(req);
		if (ticketCandidate?.reader.authMethod === "remote-ingress" && !ingress) {
			respondNotFound(res);
			return true;
		}
		const needsAuthentication = Boolean(ingress) || isMetaRequest || !ticketCandidate;
		const requestAuth = needsAuthentication ? await authorizeControlUiReadRequestOrReply({
			...opts,
			req,
			res,
			cfg: opts?.cfg ?? opts?.config,
			allowQueryToken: !explicitAllow,
			requiredOperatorMethod: messageId ? "chat.message.get" : "assistant.media.get"
		}) : void 0;
		if (needsAuthentication && !requestAuth) return true;
		if (ingress && ticketCandidate && ticketCandidate.reader.profileId !== requestAuth?.authenticatedUserProfile?.profileId) {
			respondNotFound(res);
			return true;
		}
		if (requestAuth?.authenticatedUserProfile?.profileId || !isMetaRequest && ticketCandidate?.reader.profileId) {
			if (!await prepareHttpUserProfileCatalog(res) || requestAuth?.hasCurrentClientAuthority?.() === false || !isMetaRequest && ticketCandidate && !verifyAssistantMediaTicket(url.searchParams.get("mediaTicket"), relativeSource ? void 0 : source, agentId)) {
				if (!res.destroyed && !res.writableEnded) respondNotFound(res);
				return true;
			}
		}
		const policyParams = {
			config: opts?.config ?? {},
			sessionKey,
			agentId,
			messageId
		};
		const policy = await resolveAssistantMediaPolicy({
			...policyParams,
			requestAuth: requestAuth ?? void 0,
			reader: isMetaRequest || ingress ? void 0 : ticketCandidate?.reader
		});
		if (!policy) {
			respondNotFound(res);
			return true;
		}
		const mediaPolicy = _usingCtx$1.u({
			...policy,
			[Symbol.dispose]: () => policy.placementRead?.release()
		});
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
		const sameSession = ticket && ticket.session?.sessionKey === policy.session?.sessionKey && ticket.session?.agentId === policy.session?.agentId && ticket.session?.sessionId === policy.session?.sessionId && ticket.messageId === policy.messageId;
		if (!isMetaRequest && url.searchParams.has("mediaTicket") && (!ticket || !sameSession)) {
			respondNotFound(res);
			return true;
		}
		const allowance = explicitAllow ? true : ticket?.file && sameSession && policy.canAllow ? ticket.file : void 0;
		const assertCurrentPolicy = () => {
			assertRemoteControlUiIngressCurrent(getRemoteControlUiIngressContext(req));
			return assertAssistantMediaPolicyCurrent(policyParams, mediaPolicy, Boolean(allowance), requestAuth ?? void 0);
		};
		const requestAbort = createHttpRequestAbortSignal(res.req, res);
		_usingCtx$1.u({ [Symbol.dispose]: requestAbort.cleanup });
		let publishMessage;
		try {
			assertCurrentPolicy();
			publishMessage = await prepareAssistantMessageMedia(source, policy, requestAbort.signal);
			assertCurrentPolicy();
		} catch {
			respondNotFound(res);
			return true;
		}
		const publishResponse = (publish) => publishMessage(() => {
			assertCurrentPolicy();
			publish();
		});
		if (isMetaRequest) {
			const availability = await resolveAssistantMediaAvailability(source, policy, allowance, agentId, requestAbort.signal, assertCurrentPolicy);
			if (requestAbort.signal.aborted) return true;
			try {
				await publishResponse(() => sendJson(res, 200, !availability.available && availability.code === "outside-allowed-folders" ? {
					...availability,
					retryable: false,
					...policy.canAllow ? { canAllow: true } : {}
				} : availability));
			} catch {
				respondNotFound(res);
			}
			return true;
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
					sourceStat: {
						size: opened.stat.size,
						mtimeMs: opened.stat.mtimeMs,
						ctimeMs: opened.stat.ctimeMs,
						exactIdentity: opened.exactIdentity
					},
					mimeType: contentType,
					kind: mediaKind,
					signal: byteStream.signal,
					assertCurrent: assertCurrentPolicy
				});
				if (playback.kind === "preparing") {
					await byteStream.close();
					await publishResponse(() => sendJson(res, 202, { status: "preparing" }));
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
			const byteResponse = resolveByteResponse({
				file: { size: opened.stat.size },
				method: req.method,
				request: req
			});
			const emptyResponse = req.method === "HEAD" || byteResponse.kind === "not-modified" || byteResponse.contentLength === 0;
			if (emptyResponse) await byteStream.close();
			let delivery;
			const stream = byteStream;
			await publishResponse(() => {
				if (media.outsideRoots && mediaKind === "image") applyHttpImageContentSecurityPolicy(res);
				res.setHeader("Content-Type", contentType);
				res.setHeader("Content-Disposition", buildAssistantMediaContentDisposition(filename, contentType));
				res.setHeader("Cache-Control", "no-cache");
				writeByteHeaders(res, byteResponse);
				if (emptyResponse) res.end();
				else delivery = stream.pipe(byteResponse, req.method);
			});
			await delivery;
			return true;
		} catch {
			await byteStream?.close();
			if (!res.destroyed && !res.writableEnded) respondNotFound(res);
			return true;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
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
	applyControlUiSecurityHeaders(res, getRemoteControlUiIngressContext(req));
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
		if ((url.searchParams.has("v") || resolved?.kind === "data") && projection.image) {
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
			res.setHeader("Cache-Control", "private, max-age=60");
			res.setHeader("Vary", "Authorization, Cookie");
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
function isExpectedSafePathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function isSafeRelativePath(relPath) {
	if (!relPath) return false;
	const normalized = path.posix.normalize(relPath);
	return !(path.posix.isAbsolute(normalized) || path.win32.isAbsolute(normalized) || normalized.startsWith("../") || normalized === ".." || normalized.includes("\0"));
}
async function prepareControlUiBootstrapConfig(req, res, opts, basePath, terminalEnabled, replyOnFailure = true) {
	let pluginFrameGrants = [];
	const requestAuth = await authorizeControlUiReadRequestOrReply({
		...opts,
		req,
		res,
		cfg: opts?.cfg ?? opts?.config,
		replyOnFailure,
		onPluginFrameGrants: (grants) => {
			pluginFrameGrants = grants;
		}
	});
	if (!requestAuth) return null;
	requestAuth.assertCurrent();
	if (req.method === "HEAD") return {
		config: void 0,
		requestAuth
	};
	const config = opts?.config;
	const [assistant, pluginControlUiModules, devGitBranch, preferences] = await Promise.all([
		(async () => {
			const resolvedIdentity = config ? await resolveAssistantIdentity({
				cfg: config,
				agentId: opts?.agentId
			}) : void 0;
			const identity = resolvedIdentity ?? DEFAULT_ASSISTANT_IDENTITY;
			const avatarProjection = config && resolvedIdentity ? await resolveGatewayAssistantAvatar({
				cfg: config,
				identity: resolvedIdentity,
				httpBasePath: basePath
			}) : {
				avatar: identity.avatar,
				resolution: null
			};
			return {
				identity,
				agentId: resolvedIdentity?.agentId,
				avatarProjection
			};
		})(),
		import("./control-ui-plugin-assets-Bg3Uwvw2.mjs").then(({ listControlUiPluginCatalog }) => listControlUiPluginCatalog().then(({ plugins }) => plugins, () => [])),
		resolveDevInstallGitBranch(),
		import("./control-ui-bootstrap-preferences-D3Ct3AwY.mjs").then(({ prepareControlUiBootstrapPreferences }) => prepareControlUiBootstrapPreferences(config, requestAuth))
	]);
	const { identity, agentId: assistantAgentId, avatarProjection } = assistant;
	const avatarMeta = controlUiAvatarResolutionMeta(avatarProjection.resolution);
	requestAuth.assertCurrent();
	return {
		config: {
			preferences,
			basePath,
			assistantName: identity.name,
			assistantAvatar: avatarProjection.avatar,
			assistantAvatarSource: avatarMeta.avatarSource,
			assistantAvatarStatus: avatarMeta.avatarStatus,
			assistantAvatarReason: avatarMeta.avatarReason,
			...assistantAgentId ? { assistantAgentId } : {},
			serverVersion: resolveRuntimeServiceVersion(process.env),
			serverBuildId: config?.gateway?.controlUi?.root === void 0 ? resolveRuntimeServiceBuildId() ?? void 0 : void 0,
			devGitBranch: devGitBranch ?? void 0,
			...resolveControlUiBootstrapPresentation(config),
			terminalEnabled,
			cliAgentsEnabled: config?.gateway?.cliAgents?.enabled !== false,
			pluginAssetsRequireAuth: opts?.auth !== void 0 && opts.auth.mode !== "none",
			pluginControlUiModules,
			pluginFrameGrants: pluginFrameGrants.map(({ pluginId, path: grantPath, match }) => ({
				pluginId,
				path: grantPath,
				match
			}))
		},
		requestAuth
	};
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
		applyControlUiSecurityHeaders(res, getRemoteControlUiIngressContext(req));
		respondNotFound(res);
		return true;
	}
	if (route.kind === "redirect") {
		applyControlUiSecurityHeaders(res, getRemoteControlUiIngressContext(req));
		res.statusCode = 302;
		res.setHeader("Location", route.location);
		res.end();
		return true;
	}
	applyControlUiSecurityHeaders(res, getRemoteControlUiIngressContext(req));
	if (isControlUiSharePath(pathname, basePath) && pathname !== `${basePath}/share/card.png`) {
		serveControlUiShareDocument(req, res, url, basePath, resolveGatewayPublicOrigin(opts?.config));
		return true;
	}
	if (matchesControlUiBootstrapConfigPath(pathname, basePath)) {
		const bootstrap = await prepareControlUiBootstrapConfig(req, res, opts, basePath, terminalEnabled);
		if (bootstrap) {
			bootstrap.requestAuth.assertCurrent();
			sendJson(res, 200, bootstrap.config);
		}
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
	if (isBundledRoot && [".br", ".gz"].includes(path.extname(fileRel).toLowerCase())) {
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
	while (asset) {
		if (path.basename(fileRel) === "index.html" || path.basename(asset.file.path) === "index.html") {
			if (req.method === "HEAD") {
				const encoding = resolveControlUiHtmlEncoding(req);
				if (encoding === "not-acceptable") {
					respondControlUiNotAcceptable(res);
					return true;
				}
				respondHeadForControlUiFile(res, "index.html", { encoding: encoding === "identity" ? void 0 : encoding });
				return true;
			}
			if (!asset.file.body) {
				asset = await readControlUiRootAsset(rootState, fileRel, true);
				continue;
			}
			const bootstrap = opts?.auth ? await prepareControlUiBootstrapConfig(req, res, opts, basePath, terminalEnabled, false) : void 0;
			await serveControlUiIndexHtml(req, res, asset.file.body.toString("utf8"), uiPath, basePath, terminalEnabled, opts?.config?.gateway?.controlUi?.environment, publicAssetBuildId, opts?.sessionEntryPath, () => bootstrap?.requestAuth.hasCurrentClientAuthority() !== false && opts?.isSessionEntryCurrent?.() !== false, opts?.auth?.mode === "trusted-proxy", bootstrap?.config);
			return true;
		}
		const originatedAtMs = Date.now();
		const lastModifiedMs = Math.floor(Math.min(asset.file.mtimeMs, originatedAtMs) / 1e3) * 1e3;
		const representation = resolveControlUiRepresentation({
			req,
			asset,
			contentPath: fileRel,
			precompressed: fingerprintedAsset
		});
		if (!representation) {
			respondControlUiNotAcceptable(res);
			return true;
		}
		if (isControlUiFileUnmodified(req, lastModifiedMs, originatedAtMs)) {
			respondControlUiNotModified(res, {
				immutable: immutableAsset,
				lastModifiedMs
			});
			return true;
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
		else {
			asset = await readControlUiRootAsset(rootState, fileRel, true);
			continue;
		}
		return true;
	}
	respondNotFound(res);
	return true;
}
//#endregion
export { handleControlUiAssistantMediaRequest, handleControlUiAvatarRequest, handleControlUiHttpRequest };
