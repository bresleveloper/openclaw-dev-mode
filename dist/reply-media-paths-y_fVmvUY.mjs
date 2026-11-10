import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as FsSafeError } from "./fs-safe-6Z4UiMS4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { D as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata, r as appendReplyMediaFailures } from "./reply-payload-BLX_BF2U.mjs";
import { o as mediaKindFromMime } from "./constants-GzjKtFvA.mjs";
import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { n as detectMime, u as mimeTypeFromFilePath } from "./mime-C3j3dfQb.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-B41MzEkm.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { s as withSandboxRuntimeStatusInWorker } from "./runtime-status-DWm-5zUj.mjs";
import "./reply-payload-79LnOCyy.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-DeXfvJjt.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BdNs7xa2.mjs";
import { c as resolveAllowedManagedMediaPath, f as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./sandbox-paths-CgSBSdCM.mjs";
import { i as resolveSandboxPathMapping, o as toRelativeWorkspacePath, r as resolvePathFromInput } from "./path-policy-Llwd1FHK.mjs";
import { t as resolveLocalMediaPath } from "./local-media-path-CHGj9vZy.mjs";
import { p as saveMediaFile } from "./store-BOkrav0N.mjs";
import { r as resolveInboundMediaReference } from "./media-reference-Dlq4zAi4.mjs";
import { n as LocalMediaAccessError, t as HostReadMediaTypeError } from "./local-media-access-D8o0XeaK.mjs";
import { t as resolveAgentScopedHostOutboundMediaAccess } from "./read-capability-DeAXXMuF.mjs";
import { a as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-BaCve0jk.mjs";
import { t as createSandboxBridgeReadFile } from "./sandbox-media-paths-BmuUpaoy.mjs";
import { n as resolveOutboundAttachmentFromUrl } from "./outbound-attachment-B1MK3cQ0.mjs";
import { n as resolveSandboxContext, t as ensureSandboxWorkspaceForSession } from "./context-Dz5vxKlZ.mjs";
import "./sandbox-4O9XYRNc.mjs";
import path from "node:path";
import { sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
//#region src/media/webchat-attachment.ts
/** Stages webchat display media, streaming native audio/video beyond channel caps. */
async function resolveWebchatAttachmentFromUrl(mediaUrl, maxBytes, options) {
	const localPath = resolveLocalMediaPath(mediaUrl);
	const localKind = localPath ? mediaKindFromMime(mimeTypeFromFilePath(localPath)) : void 0;
	if (localPath && (localKind === "audio" || localKind === "video") && options.localMediaMaxBytes && options.mediaAccess.openFile) try {
		var _usingCtx$2 = _usingCtx();
		const opened = _usingCtx$2.a(await options.mediaAccess.openFile(localPath, { maxBytes: options.localMediaMaxBytes }));
		if (opened) {
			const header = Buffer.alloc(8192);
			const { bytesRead } = await opened.handle.read(header, 0, header.length, 0);
			const prefix = header.subarray(0, bytesRead);
			const kind = mediaKindFromMime(await detectMime({ buffer: prefix }));
			if (kind !== "audio" && kind !== "video") throw new HostReadMediaTypeError("Host-local audio/video sends require a buffer-verified media type.");
			const saved = await saveMediaFile(opened, "outbound", options.localMediaMaxBytes, path.basename(localPath), prefix);
			return {
				path: saved.path,
				contentType: saved.contentType
			};
		}
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		await _usingCtx$2.d();
	}
	return await resolveOutboundAttachmentFromUrl(mediaUrl, maxBytes, { mediaAccess: options.mediaAccess });
}
//#endregion
//#region src/auto-reply/reply/reply-media-paths.ts
const FILE_URL_RE = /^file:/i;
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const HAS_FILE_EXT_RE = /\.\w{1,10}$/;
const MAX_FAILURE_LABEL_LENGTH = 180;
const HOST_FILE_URL_BLOCKED = "Host-local MEDIA file URLs are blocked in normal replies. Use a safe path or the message tool.";
function resolveReplyMediaFailureLabel(media, index) {
	const trimmed = media.trim();
	let source = trimmed;
	if (SCHEME_RE.test(trimmed)) try {
		source = new URL(trimmed).pathname;
	} catch {}
	return truncateUtf16Safe(sanitizeUntrustedFileName(basenameFromAnyPath(source), `Attachment ${index + 1}`), MAX_FAILURE_LABEL_LENGTH);
}
function resolveReplyMediaFailureCode(error) {
	let current = error;
	for (let depth = 0; current instanceof Error && depth < 4; depth += 1) {
		if ((current instanceof LocalMediaAccessError || current instanceof FsSafeError) && current.code === "not-found") return "file-not-found";
		if (current instanceof HostReadMediaTypeError || current instanceof LocalMediaAccessError && current.code === "unsupported-media-type") return "unsupported-format";
		current = current.cause;
	}
	return "delivery-failed";
}
function createReplyMediaFailure(media, index, error) {
	const mimeType = mimeTypeFromFilePath(media);
	const kind = mediaKindFromMime(mimeType);
	return {
		code: resolveReplyMediaFailureCode(error),
		kind: kind === "image" || kind === "audio" || kind === "video" ? kind : "document",
		label: resolveReplyMediaFailureLabel(media, index),
		...mimeType ? { mimeType } : {}
	};
}
function isLikelyLocalMediaSource(media) {
	return FILE_URL_RE.test(media) || media.startsWith("~") || WINDOWS_DRIVE_RE.test(media) || !SCHEME_RE.test(media) && (media.includes("/") || media.includes("\\") || HAS_FILE_EXT_RE.test(media));
}
function createReplyMediaSourcePreparer(params, readSource) {
	const agentId = params.agentId ?? (params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	}) : void 0);
	const maxBytes = resolveOutboundMediaMaxBytes({
		cfg: params.cfg,
		channel: params.messageProvider,
		accountId: params.accountId
	});
	const explicitSandboxRoot = params.sandboxRoot?.trim();
	let sandboxWorkspacePromise = explicitSandboxRoot ? Promise.resolve({
		root: explicitSandboxRoot,
		containerWorkdir: params.sandboxContainerWorkdir,
		workspaceAccess: params.workspaceMediaAccess?.readFile ? "ro" : "none"
	}) : void 0;
	const persistedMediaBySource = /* @__PURE__ */ new Map();
	const resolveSandboxWorkspace = async () => {
		sandboxWorkspacePromise ??= ensureSandboxWorkspaceForSession({
			config: params.cfg,
			agentId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir
		}, readSource).then((sandbox) => sandbox ? {
			root: sandbox.workspaceDir,
			containerWorkdir: sandbox.containerWorkdir,
			workspaceAccess: sandbox.workspaceAccess ?? "none"
		} : void 0);
		return await sandboxWorkspacePromise;
	};
	const persistLocalReplyMedia = async (media, sessionWorkspaceDir, workspaceDir) => {
		const managedMediaPath = await resolveAllowedManagedMediaPath(media);
		if (managedMediaPath) return {
			path: managedMediaPath,
			contentType: mimeTypeFromFilePath(managedMediaPath)
		};
		if (params.workspaceMediaRoot && !resolveAbsoluteWorkspaceMedia(media) && !await resolveInboundMediaReference(media)) throw new Error("Attachment path is outside the remote workspace.");
		const cached = persistedMediaBySource.get(media);
		if (cached) return await cached;
		const mediaAccess = resolveAgentScopedHostOutboundMediaAccess({
			cfg: params.cfg,
			agentId,
			workspaceDir: workspaceDir ?? params.workspaceDir,
			sessionWorkspaceDir: sessionWorkspaceDir ?? params.sessionWorkspaceDir,
			workspaceOnly: params.workspaceOnly,
			allowHostWorkspace: params.allowHostWorkspace,
			mediaSources: [media],
			mediaAccess: params.mediaAccess,
			workspaceMediaAccess: params.workspaceMediaAccess,
			sessionKey: params.sessionKey,
			messageProvider: params.sessionKey ? void 0 : params.messageProvider,
			accountId: params.accountId,
			requesterSenderId: params.requesterSenderId,
			requesterSenderName: params.requesterSenderName,
			requesterSenderUsername: params.requesterSenderUsername,
			requesterSenderE164: params.requesterSenderE164,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace
		});
		const persistPromise = (params.localMediaMaxBytes ? resolveWebchatAttachmentFromUrl(media, maxBytes, {
			mediaAccess,
			localMediaMaxBytes: params.localMediaMaxBytes
		}) : resolveOutboundAttachmentFromUrl(media, maxBytes, { mediaAccess })).then((saved) => ({
			...saved,
			contentType: saved.contentType ?? mimeTypeFromFilePath(media) ?? "application/octet-stream"
		})).catch((err) => {
			persistedMediaBySource.delete(media);
			throw err;
		});
		persistedMediaBySource.set(media, persistPromise);
		return await persistPromise;
	};
	const prepareLocalReplyMedia = async (media, sessionWorkspaceDir, workspaceDir) => {
		const persisted = await persistLocalReplyMedia(media, sessionWorkspaceDir, workspaceDir);
		return {
			mediaUrl: persisted.path,
			trustedLocalMedia: true,
			fileName: path.basename(media),
			...persisted.contentType ? { mimeType: persisted.contentType } : {}
		};
	};
	const resolveWorkspaceRelativeMedia = (media) => {
		const relativeWorkspacePath = toRelativeWorkspacePath(params.workspaceDir, media, { cwd: params.workspaceDir });
		return resolvePathFromInput(relativeWorkspacePath, params.workspaceDir);
	};
	const resolveAbsoluteWorkspaceMedia = (media) => {
		if (FILE_URL_RE.test(media) || !path.isAbsolute(media) && !WINDOWS_DRIVE_RE.test(media)) return;
		try {
			return resolveWorkspaceRelativeMedia(media);
		} catch {
			return;
		}
	};
	const normalizeMediaSource = async (raw) => {
		const trimmed = raw.trim();
		const source = /^media:\/\//i.test(trimmed) ? (await resolveInboundMediaReference(trimmed))?.physicalPath ?? trimmed : trimmed;
		const media = (params.workspaceMediaRoot ? resolveSandboxPathMapping([{
			hostRoot: params.workspaceDir,
			containerRoot: params.workspaceMediaRoot
		}], source) : null)?.hostPath ?? source;
		if (media) assertMediaNotDataUrl(media);
		if (!media || isPassThroughRemoteMediaSource(media)) return {
			mediaUrl: media,
			trustedLocalMedia: false
		};
		const sandboxWorkspace = await resolveSandboxWorkspace();
		const workspaceMounted = !sandboxWorkspace || sandboxWorkspace.workspaceAccess !== "none";
		const absoluteWorkspaceMedia = workspaceMounted ? resolveAbsoluteWorkspaceMedia(media) : void 0;
		if (absoluteWorkspaceMedia) return prepareLocalReplyMedia(absoluteWorkspaceMedia);
		const isRelativeLocalMedia = isLikelyLocalMediaSource(media) && !FILE_URL_RE.test(media) && !media.startsWith("~") && !path.isAbsolute(media) && !WINDOWS_DRIVE_RE.test(media);
		const useRemoteWorkspace = workspaceMounted && isRelativeLocalMedia && params.workspaceMediaRoot && params.workspaceMediaAccess?.readFile;
		if (sandboxWorkspace && !useRemoteWorkspace) {
			let sandboxResolvedMedia;
			try {
				sandboxResolvedMedia = await resolveSandboxedMediaSource({
					media,
					sandboxRoot: sandboxWorkspace.root,
					containerWorkdir: sandboxWorkspace.containerWorkdir
				});
			} catch (err) {
				if (FILE_URL_RE.test(media)) throw new Error(HOST_FILE_URL_BLOCKED, { cause: err });
				throw err;
			}
			return prepareLocalReplyMedia(sandboxResolvedMedia, sandboxWorkspace.root, workspaceMounted ? void 0 : sandboxWorkspace.root);
		}
		if (isRelativeLocalMedia) return prepareLocalReplyMedia(resolveWorkspaceRelativeMedia(media));
		if (!isLikelyLocalMediaSource(media)) return {
			mediaUrl: media,
			trustedLocalMedia: false
		};
		if (FILE_URL_RE.test(media)) throw new Error(HOST_FILE_URL_BLOCKED);
		return prepareLocalReplyMedia(media);
	};
	const prepareSources = async (sources, normalize = normalizeMediaSource) => {
		const prepared = [];
		for (const [index, source] of sources.entries()) try {
			prepared.push({
				source,
				outcome: await normalize(source)
			});
		} catch (error) {
			const failure = createReplyMediaFailure(source, index, error);
			if (params.workspaceMediaRoot && isLikelyLocalMediaSource(source)) failure.label = truncateUtf16Safe(`Remote file: ${failure.label}`, MAX_FAILURE_LABEL_LENGTH);
			prepared.push({
				source,
				outcome: { failure }
			});
			logVerbose(`dropping blocked reply media ${source}: ${String(error)}`);
		}
		return prepared;
	};
	if (explicitSandboxRoot || params.workspaceMediaAccess || params.allowHostWorkspace === false || resolveSandboxConfigForAgent(params.cfg, agentId).backend !== "ssh") return prepareSources;
	return async (sources) => {
		if (!sources.some(isLikelyLocalMediaSource)) return prepareSources(sources);
		const assertCurrent = captureChannelReadAuthority() ?? (() => {});
		return withSandboxRuntimeStatusInWorker({
			cfg: params.cfg,
			agentId,
			sessionKey: params.sessionKey
		}, {
			env: process.env,
			cwd: process.cwd(),
			assertCurrent,
			readSource
		}, async (preparedRuntimeStatus) => {
			try {
				var _usingCtx$1 = _usingCtx();
				let sandbox = null;
				try {
					sandbox = await resolveSandboxContext({
						config: params.cfg,
						agentId,
						sessionKey: params.sessionKey,
						workspaceDir: params.workspaceDir,
						preparedRuntimeStatus,
						assertCurrent
					});
					if (sandbox && !sandbox.fsBridge) throw new Error("SSH sandbox has no filesystem bridge for reply media");
				} catch (error) {
					sandbox?.[Symbol.dispose]?.();
					assertCurrent();
					return prepareSources(sources, async (source) => {
						const managedPath = await resolveAllowedManagedMediaPath((await resolveInboundMediaReference(source))?.physicalPath ?? source);
						if (managedPath) return prepareLocalReplyMedia(managedPath);
						if (isLikelyLocalMediaSource(source)) throw error;
						return normalizeMediaSource(source);
					});
				}
				_usingCtx$1.u({ [Symbol.dispose]: () => sandbox?.[Symbol.dispose]?.() });
				if (!sandbox) return prepareSources(sources);
				const readable = sandbox.workspaceAccess !== "none";
				return await createReplyMediaSourcePreparer({
					...params,
					workspaceDir: sandbox.workspaceDir,
					sandboxRoot: sandbox.workspaceDir,
					sandboxContainerWorkdir: sandbox.containerWorkdir,
					workspaceMediaRoot: sandbox.containerWorkdir,
					allowHostWorkspace: readable,
					workspaceMediaAccess: readable ? {
						localRoots: [sandbox.workspaceDir],
						workspaceDir: sandbox.workspaceDir,
						readFile: createSandboxBridgeReadFile({ sandbox: {
							root: sandbox.workspaceDir,
							bridge: sandbox.fsBridge
						} })
					} : void 0
				})(sources);
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		});
	};
}
/** Applies already-prepared bytes after final answer selection, without reopening files. */
function applyPreparedReplyMedia(payload, prepared) {
	const mediaList = resolveSendableOutboundReplyParts(payload).mediaUrls;
	if (!mediaList.length || !prepared.length) return payload;
	const bySource = new Map(prepared.map(({ source, outcome }) => [source, outcome]));
	const normalizedMedia = [];
	const normalizedAttachments = [];
	const previousSourceUrls = getReplyPayloadMetadata(payload)?.replyMediaSourceUrls;
	const sourcesByReference = /* @__PURE__ */ new Map();
	const seen = /* @__PURE__ */ new Set();
	let hasTrustedLocalMedia = payload.trustedLocalMedia === true;
	const mediaFailures = [];
	const mediaEntries = collectReplyMediaEntries(payload, mediaList);
	for (const { url: media, attachment } of mediaEntries) {
		const normalized = bySource.get(media) ?? {
			mediaUrl: media,
			trustedLocalMedia: false
		};
		if ("failure" in normalized) {
			mediaFailures.push(normalized.failure);
			continue;
		}
		if (!normalized.mediaUrl) continue;
		const normalizedKey = normalizeMediaReferenceForComparison(normalized.mediaUrl);
		const sourceKey = normalizeMediaReferenceForComparison(media);
		const sourceUrls = sourcesByReference.get(normalizedKey) ?? /* @__PURE__ */ new Set();
		for (const source of previousSourceUrls?.get(sourceKey) ?? []) sourceUrls.add(source);
		if (normalized.mediaUrl !== media) sourceUrls.add(media);
		if (sourceUrls.size > 0) sourcesByReference.set(normalizedKey, sourceUrls);
		if (seen.has(normalized.mediaUrl)) continue;
		seen.add(normalized.mediaUrl);
		normalizedMedia.push(normalized.mediaUrl);
		hasTrustedLocalMedia ||= normalized.trustedLocalMedia;
		const existingAttachment = attachment ?? {};
		const normalizedAttachment = {
			...existingAttachment,
			...normalized.fileName && !existingAttachment.name ? { name: normalized.fileName } : {},
			...normalized.mimeType && !existingAttachment.mimeType ? { mimeType: normalized.mimeType } : {},
			...normalized.trustedLocalMedia ? { trustedLocalMedia: true } : {}
		};
		if (normalized.mediaUrl !== media) {
			for (const field of [
				"path",
				"url",
				"mediaUrl",
				"filePath"
			]) if (normalizedAttachment[field] !== void 0) normalizedAttachment[field] = normalized.mediaUrl;
		}
		normalizedAttachments.push(normalizedAttachment);
	}
	const replyMediaSourceUrls = sourcesByReference.size > 0 ? new Map([...sourcesByReference].map(([key, sources]) => [key, [...sources]])) : void 0;
	const text = appendReplyMediaFailures(payload.text, mediaFailures);
	const assistantMediaFailures = [...getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? [], ...mediaFailures];
	const normalized = copyReplyPayloadMetadata(payload, {
		...payload,
		text,
		mediaUrl: normalizedMedia[0],
		mediaUrls: normalizedMedia.length > 0 ? normalizedMedia : void 0,
		attachments: normalizedAttachments.some((attachment) => Object.keys(attachment).length > 0) ? normalizedAttachments : void 0,
		...normalizedMedia.length > 0 && hasTrustedLocalMedia ? { trustedLocalMedia: true } : {}
	});
	return setReplyPayloadMetadata(normalized, {
		replyMediaSourceUrls,
		...mediaFailures.length > 0 ? { assistantMediaFailures } : {}
	});
}
function createReplyMediaPathNormalizer(params, readSource) {
	const prepare = createReplyMediaSourcePreparer(params, readSource);
	return async (payload) => applyPreparedReplyMedia(payload, await prepare(resolveSendableOutboundReplyParts(payload).mediaUrls));
}
function createReplyMediaContext(params) {
	return { normalizePayload: params.mediaNormalizationOwner === "gateway" ? async (payload) => payload : createReplyMediaPathNormalizer(params) };
}
//#endregion
export { createReplyMediaSourcePreparer as i, createReplyMediaContext as n, createReplyMediaPathNormalizer as r, applyPreparedReplyMedia as t };
