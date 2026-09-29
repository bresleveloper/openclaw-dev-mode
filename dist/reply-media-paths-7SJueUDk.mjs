import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { f as sanitizeUntrustedFileName } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { o as mediaKindFromMime } from "./constants-DUxuqQz8.mjs";
import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, n as appendReplyMediaFailures, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-DeX5XiDx.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-BifhlC95.mjs";
import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.mjs";
import { c as resolveAllowedManagedMediaPath, f as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./sandbox-paths-BZ4BvxS2.mjs";
import { i as resolveSandboxPathMapping, o as toRelativeWorkspacePath, r as resolvePathFromInput } from "./path-policy-BUkUD6xH.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import "./reply-payload-RBmrGrXG.mjs";
import { n as LocalMediaAccessError, t as HostReadMediaTypeError } from "./local-media-access-Cxmjo_Ju.mjs";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-UK6nXoD0.mjs";
import { r as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-CWCWnxsU.mjs";
import { t as ensureSandboxWorkspaceForSession } from "./context-CiLAV5T3.mjs";
import "./sandbox-BnX1IPPh.mjs";
import { n as resolveOutboundAttachmentFromUrl } from "./outbound-attachment-BRWs8pl9.mjs";
import path from "node:path";
//#region src/auto-reply/reply/reply-media-paths.ts
const FILE_URL_RE = /^file:/i;
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const HAS_FILE_EXT_RE = /\.\w{1,10}$/;
const MAX_FAILURE_LABEL_LENGTH = 180;
function resolveReplyMediaFailureLabel(media, index) {
	const trimmed = media.trim();
	let source = trimmed;
	if (SCHEME_RE.test(trimmed)) try {
		source = new URL(trimmed).pathname;
	} catch {}
	const basename = basenameFromAnyPath(source).trim();
	const fallback = `Attachment ${index + 1}`;
	return truncateUtf16Safe(sanitizeUntrustedFileName(basename, fallback) || fallback, MAX_FAILURE_LABEL_LENGTH);
}
function resolveReplyMediaFailureKind(media) {
	const kind = mediaKindFromMime(mimeTypeFromFilePath(media));
	return kind === "image" || kind === "audio" || kind === "video" ? kind : "document";
}
function resolveReplyMediaFailureCode(error) {
	let current = error;
	for (let depth = 0; current instanceof Error && depth < 4; depth += 1) {
		if (current instanceof LocalMediaAccessError && current.code === "not-found" || current instanceof FsSafeError && current.code === "not-found") return "file-not-found";
		if (current instanceof HostReadMediaTypeError || current instanceof LocalMediaAccessError && current.code === "unsupported-media-type") return "unsupported-format";
		current = current.cause;
	}
	return "delivery-failed";
}
function createReplyMediaFailure(media, index, error) {
	const mimeType = mimeTypeFromFilePath(media);
	return {
		code: resolveReplyMediaFailureCode(error),
		kind: resolveReplyMediaFailureKind(media),
		label: resolveReplyMediaFailureLabel(media, index),
		...mimeType ? { mimeType } : {}
	};
}
function isLikelyLocalMediaSource(media) {
	return FILE_URL_RE.test(media) || media.startsWith("/") || media.startsWith("./") || media.startsWith("../") || media.startsWith("~") || WINDOWS_DRIVE_RE.test(media) || media.startsWith("\\\\") || !SCHEME_RE.test(media) && (media.includes("/") || media.includes("\\") || HAS_FILE_EXT_RE.test(media));
}
function getPayloadMediaList(payload) {
	return resolveSendableOutboundReplyParts(payload).mediaUrls;
}
function createReplyMediaSourcePreparer(params) {
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
		if (!sandboxWorkspacePromise) sandboxWorkspacePromise = ensureSandboxWorkspaceForSession({
			config: params.cfg,
			agentId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir
		}).then((sandbox) => sandbox ? {
			root: sandbox.workspaceDir,
			containerWorkdir: sandbox.containerWorkdir,
			workspaceAccess: sandbox.workspaceAccess ?? "none"
		} : void 0);
		return await sandboxWorkspacePromise;
	};
	const resolveMediaAccessForSource = (media, sessionWorkspaceDir, workspaceDir) => resolveAgentScopedOutboundMediaAccess({
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
	const persistLocalReplyMedia = async (media, sessionWorkspaceDir, workspaceDir) => {
		if (!isLikelyLocalMediaSource(media)) return { path: media };
		const managedMediaPath = await resolveAllowedManagedMediaPath(media);
		if (managedMediaPath) return {
			path: managedMediaPath,
			contentType: mimeTypeFromFilePath(managedMediaPath)
		};
		const cached = persistedMediaBySource.get(media);
		if (cached) return await cached;
		const persistPromise = resolveOutboundAttachmentFromUrl(media, maxBytes, { mediaAccess: resolveMediaAccessForSource(media, sessionWorkspaceDir, workspaceDir) }).then((saved) => ({
			...saved,
			contentType: saved.contentType ?? mimeTypeFromFilePath(media) ?? "application/octet-stream"
		})).catch((err) => {
			persistedMediaBySource.delete(media);
			throw err;
		});
		persistedMediaBySource.set(media, persistPromise);
		return await persistPromise;
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
		const source = raw.trim();
		const media = (params.workspaceMediaRoot ? resolveSandboxPathMapping([{
			hostRoot: params.workspaceDir,
			containerRoot: params.workspaceMediaRoot
		}], source) : null)?.hostPath ?? source;
		if (!media) return {
			mediaUrl: media,
			trustedLocalMedia: false
		};
		assertMediaNotDataUrl(media);
		if (isPassThroughRemoteMediaSource(media)) return {
			mediaUrl: media,
			trustedLocalMedia: false
		};
		const sandboxWorkspace = await resolveSandboxWorkspace();
		const workspaceMounted = !sandboxWorkspace || sandboxWorkspace.workspaceAccess !== "none";
		const absoluteWorkspaceMedia = workspaceMounted ? resolveAbsoluteWorkspaceMedia(media) : void 0;
		if (absoluteWorkspaceMedia) {
			const persisted = await persistLocalReplyMedia(absoluteWorkspaceMedia);
			return {
				mediaUrl: persisted.path,
				trustedLocalMedia: true,
				fileName: path.basename(absoluteWorkspaceMedia),
				...persisted.contentType ? { mimeType: persisted.contentType } : {}
			};
		}
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
				if (FILE_URL_RE.test(media)) throw new Error("Host-local MEDIA file URLs are blocked in normal replies. Use a safe path or the message tool.", { cause: err });
				throw err;
			}
			const persisted = await persistLocalReplyMedia(sandboxResolvedMedia, sandboxWorkspace.root, workspaceMounted ? void 0 : sandboxWorkspace.root);
			return {
				mediaUrl: persisted.path,
				trustedLocalMedia: true,
				fileName: path.basename(sandboxResolvedMedia),
				...persisted.contentType ? { mimeType: persisted.contentType } : {}
			};
		}
		if (isRelativeLocalMedia) {
			const workspaceMedia = resolveWorkspaceRelativeMedia(media);
			const persisted = await persistLocalReplyMedia(workspaceMedia);
			return {
				mediaUrl: persisted.path,
				trustedLocalMedia: true,
				fileName: path.basename(workspaceMedia),
				...persisted.contentType ? { mimeType: persisted.contentType } : {}
			};
		}
		if (!isLikelyLocalMediaSource(media)) return {
			mediaUrl: media,
			trustedLocalMedia: false
		};
		if (FILE_URL_RE.test(media)) throw new Error("Host-local MEDIA file URLs are blocked in normal replies. Use a safe path or the message tool.");
		const persisted = await persistLocalReplyMedia(media);
		return {
			mediaUrl: persisted.path,
			trustedLocalMedia: true,
			fileName: path.basename(media),
			...persisted.contentType ? { mimeType: persisted.contentType } : {}
		};
	};
	return async (sources) => {
		const prepared = [];
		for (const [index, source] of sources.entries()) try {
			prepared.push({
				source,
				outcome: await normalizeMediaSource(source)
			});
		} catch (error) {
			prepared.push({
				source,
				outcome: { failure: createReplyMediaFailure(source, index, error) }
			});
			logVerbose(`dropping blocked reply media ${source}: ${String(error)}`);
		}
		return prepared;
	};
}
/** Applies already-prepared bytes after final answer selection, without reopening files. */
function applyPreparedReplyMedia(payload, prepared) {
	const mediaList = getPayloadMediaList(payload);
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
		if (normalized.mediaUrl !== media.trim()) sourceUrls.add(media.trim());
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
	if (normalizedMedia.length === 0) {
		const normalized = copyReplyPayloadMetadata(payload, {
			...payload,
			text,
			mediaUrl: void 0,
			mediaUrls: void 0,
			attachments: void 0
		});
		return setReplyPayloadMetadata(normalized, {
			replyMediaSourceUrls: void 0,
			...mediaFailures.length > 0 ? { assistantMediaFailures } : {}
		});
	}
	const normalized = copyReplyPayloadMetadata(payload, {
		...payload,
		text,
		mediaUrl: normalizedMedia[0],
		mediaUrls: normalizedMedia,
		attachments: normalizedAttachments.some((attachment) => Object.keys(attachment).length > 0) ? normalizedAttachments : void 0,
		...hasTrustedLocalMedia ? { trustedLocalMedia: true } : {}
	});
	return setReplyPayloadMetadata(normalized, {
		replyMediaSourceUrls,
		...mediaFailures.length > 0 ? { assistantMediaFailures } : {}
	});
}
function createReplyMediaPathNormalizer(params) {
	const prepare = createReplyMediaSourcePreparer(params);
	return async (payload) => applyPreparedReplyMedia(payload, await prepare(getPayloadMediaList(payload)));
}
function createReplyMediaContext(params) {
	return { normalizePayload: params.mediaNormalizationOwner === "gateway" ? async (payload) => payload : createReplyMediaPathNormalizer(params) };
}
//#endregion
export { createReplyMediaSourcePreparer as i, createReplyMediaContext as n, createReplyMediaPathNormalizer as r, applyPreparedReplyMedia as t };
