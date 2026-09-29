import { I as resolveTimestampMsToIsoString, l as asNonNegativeFiniteNumber, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { f as sanitizeUntrustedFileName } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { h as readLocalFileSafely, u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { a as maxBytesForKind, o as mediaKindFromMime } from "./constants-DUxuqQz8.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-BifhlC95.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import "./media-services-VTwDQdlk.mjs";
import { o as getImageMetadata, p as createImageProcessor } from "./image-ops-CU4vxSlO.mjs";
import { n as probePlaybackMediaFileDescriptor } from "./media-probe-Bdg20gzZ.mjs";
import { s as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { t as loadExactSessionEntryReadOnlyResult } from "./session-accessor.sqlite-entry-availability-B64pRX3U.mjs";
import { a as resolveExistingAgentSessionStoreTargetsReadOnlyResult } from "./session-store-target-inventory-BnUpfTCG.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-DotKkoz0.mjs";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import "./delivery-queue-sqlite-BghoE75G.mjs";
import { i as withChannelReadAuthority, n as captureChannelReadScope } from "./channel-read-authority-CLJnqxr1.mjs";
import { t as resolveLocalMediaPath } from "./local-media-path-Buj_gOGY.mjs";
import { f as saveMediaBuffer, p as saveMediaSource, s as getMediaDir, t as MEDIA_MAX_BYTES } from "./store-CqRcb7T5.mjs";
import { o as resolveLocalMediaRoots, r as assertLocalMediaAllowed } from "./local-media-access-Cxmjo_Ju.mjs";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-DSTuGS2l.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import { c as readSessionMessagesWithSourceAsync, o as readSessionMessagesMatchingIdAsync } from "./session-transcript-readers-Bmg2Zjrq.mjs";
import { t as unlinkIfExists } from "./temp-files-Dwz8r2k2.mjs";
import { l as resolveOpenAiCompatibleHttpSenderIsOwner, r as authorizeGatewayHttpRequestOrReply, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-BJQtuB_7.mjs";
import { c as sendJson, l as sendMethodNotAllowed, u as sendMissingScopeForbidden } from "./http-common-Ckbyca3h.mjs";
import "./http-utils-BihU3mvk.mjs";
import { a as insertManagedImageRecord, c as readManagedImageRecord, i as deleteClaimedManagedImageRecord, n as attachManagedImageRecordToMessage, o as listManagedImageOriginalMediaIds, r as claimManagedImageRecordCleanupIfCurrent, s as listManagedImageRecordEntries, t as MANAGED_OUTGOING_ORIGINALS_SUBDIR } from "./managed-image-record-store-CqV242wA.mjs";
import { n as resolvePlaybackModeForSource, r as resolvePlaybackTranscode, t as replacePlaybackFileExtension } from "./playback-transcode-CcOtdCua.mjs";
import { a as buildAssistantMediaContentDisposition, i as writeByteHeaders, n as createImmutableFileValidators, r as resolveByteResponse, t as createGatewayByteStream } from "./http-byte-range-k1_X9iV6.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import pLimit from "p-limit";
//#region src/gateway/managed-image-thumbnail-cache.ts
const MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_ENTRIES = 128;
const MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_BYTES = 16777216;
const MANAGED_IMAGE_THUMBNAIL_MAX_PENDING = 128;
const managedImageThumbnailCache = /* @__PURE__ */ new Map();
const managedImageThumbnailJobs = /* @__PURE__ */ new Map();
const limitManagedImageThumbnails = pLimit(4);
let managedImageThumbnailCacheBytes = 0;
function readManagedImageThumbnail(cacheKey) {
	const thumbnail = managedImageThumbnailCache.get(cacheKey);
	if (!thumbnail) return;
	managedImageThumbnailCache.delete(cacheKey);
	managedImageThumbnailCache.set(cacheKey, thumbnail);
	return thumbnail;
}
function cacheManagedImageThumbnail(cacheKey, thumbnail) {
	const previous = managedImageThumbnailCache.get(cacheKey);
	if (previous) {
		managedImageThumbnailCache.delete(cacheKey);
		managedImageThumbnailCacheBytes -= previous.byteLength;
	}
	managedImageThumbnailCache.set(cacheKey, thumbnail);
	managedImageThumbnailCacheBytes += thumbnail.byteLength;
	while (managedImageThumbnailCache.size > MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_ENTRIES || managedImageThumbnailCacheBytes > MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_BYTES) {
		const oldest = managedImageThumbnailCache.entries().next().value;
		if (!oldest) break;
		managedImageThumbnailCache.delete(oldest[0]);
		managedImageThumbnailCacheBytes -= oldest[1].byteLength;
	}
}
async function resolveManagedImageThumbnail(cacheKey, create) {
	const cached = readManagedImageThumbnail(cacheKey);
	if (cached) return cached;
	const active = managedImageThumbnailJobs.get(cacheKey);
	if (active) return await active;
	if (limitManagedImageThumbnails.pendingCount >= MANAGED_IMAGE_THUMBNAIL_MAX_PENDING) throw new Error("managed image thumbnail queue is full");
	const pending = limitManagedImageThumbnails(create).then((thumbnail) => {
		cacheManagedImageThumbnail(cacheKey, thumbnail);
		return thumbnail;
	}).finally(() => {
		managedImageThumbnailJobs.delete(cacheKey);
	});
	managedImageThumbnailJobs.set(cacheKey, pending);
	return await pending;
}
//#endregion
//#region src/gateway/managed-image-attachments.ts
const OUTGOING_IMAGE_ROUTE_PREFIX = "/api/chat/media/outgoing";
const DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS = 9e5;
const MANAGED_OUTGOING_IMAGE_TICKET_SCOPE = "managed-outgoing-image";
const MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS = 3e5;
const MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX = "artifact_managed_image_";
const MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX = "artifact_managed_media_";
const MANAGED_IMAGE_THUMBNAIL_MAX_SIDE = 1200;
const MANAGED_OUTGOING_ATTACHMENT_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const managedOutgoingImageTicketSecret = randomBytes(32);
const DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS = {
	maxBytes: 12582912,
	maxWidth: 4096,
	maxHeight: 4096,
	maxPixels: 2e7
};
const MANAGED_DOCUMENT_MIME_TYPES = /* @__PURE__ */ new Set([
	"application/json",
	"application/msword",
	"application/pdf",
	"application/vnd.ms-excel",
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/x-cfb",
	"application/yaml",
	"application/zip",
	"text/csv",
	"text/html",
	"text/markdown",
	"text/plain"
]);
function resolveManagedMediaKind(contentType) {
	const normalized = normalizeMimeType(contentType);
	if (normalized === "image/svg+xml") return null;
	const kind = mediaKindFromMime(normalized);
	if (kind === "image" || kind === "audio" || kind === "video") return kind;
	return normalized && MANAGED_DOCUMENT_MIME_TYPES.has(normalized) ? "document" : null;
}
function buildSessionManagedOutgoingAttachmentIndexCacheKey(sessionKey, agentId) {
	return sessionKey === "global" && agentId ? `agent:${agentId}:global` : sessionKey;
}
function resolveManagedImageAttachmentLimits(config) {
	return {
		maxBytes: config?.maxBytes ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxBytes,
		maxWidth: config?.maxWidth ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxWidth,
		maxHeight: config?.maxHeight ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxHeight,
		maxPixels: config?.maxPixels ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxPixels
	};
}
function formatLimitMiB(bytes) {
	if (bytes < 1048576) return `${bytes} bytes`;
	return Number.isInteger(bytes / 1048576) ? `${bytes / 1048576} MiB` : `${(bytes / 1048576).toFixed(1)} MiB`;
}
function createManagedImageAttachmentError(message) {
	const error = new Error(message);
	error.name = "ManagedImageAttachmentError";
	return error;
}
function isManagedImageAttachmentSafeError(error) {
	if (!(error instanceof Error)) return false;
	if (error.name === "ManagedImageAttachmentError") return true;
	return error.message.startsWith("Managed image attachment ") || error.message.startsWith("Invalid image data URL");
}
function getSanitizedManagedImageAttachmentError(error, label, kind) {
	if (isManagedImageAttachmentSafeError(error)) return error;
	return createManagedImageAttachmentError(`Managed ${kind} attachment ${JSON.stringify(label)} could not be prepared`);
}
function buildManagedMediaFailureBlock(params) {
	return {
		type: "attachment_error",
		attachment: {
			code: params.code,
			kind: params.kind === "media" ? "document" : params.kind,
			label: params.label,
			...params.mimeType ? { mimeType: params.mimeType } : {}
		}
	};
}
function validateManagedImageBuffer(buffer, alt, limits) {
	if (buffer.byteLength > limits.maxBytes) throw createManagedImageAttachmentError(`Managed image attachment ${JSON.stringify(alt)} exceeds the ${formatLimitMiB(limits.maxBytes)} byte limit`);
}
function maxBytesForManagedMediaKind(kind, imageLimits) {
	return kind === "image" ? imageLimits.maxBytes : maxBytesForKind(kind);
}
function createManagedMediaByteLimitError(params) {
	return createManagedImageAttachmentError(`Managed ${params.kind} attachment ${JSON.stringify(params.label)} exceeds the ${formatLimitMiB(params.maxBytes)} byte limit`);
}
function estimateBase64DecodedByteLength(base64) {
	const normalized = base64.replace(/\s+/g, "");
	const paddingMatch = /=+$/u.exec(normalized);
	const padding = Math.min(paddingMatch?.[0].length ?? 0, 2);
	return Math.floor(normalized.length * 3 / 4) - padding;
}
function getManagedImageMetadataLimitError(metadata, alt, limits) {
	if (!metadata) return `Managed image attachment ${JSON.stringify(alt)} is missing readable dimensions`;
	if (metadata.width > limits.maxWidth) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxWidth}px width limit`;
	if (metadata.height > limits.maxHeight) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxHeight}px height limit`;
	if (metadata.width * metadata.height > limits.maxPixels) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxPixels.toLocaleString("en-US")} pixel limit`;
	return null;
}
async function resizeManagedImageBufferToLimits(params) {
	const resized = await createImageProcessor().encode(params.buffer, {
		format: "auto",
		limits: {
			maxWidth: params.limits.maxWidth,
			maxHeight: params.limits.maxHeight,
			maxPixels: params.limits.maxPixels
		},
		opaque: {
			format: "jpeg",
			quality: 92
		},
		transparent: {
			format: "png",
			compressionLevel: 9
		},
		transparency: "auto"
	});
	return {
		buffer: resized.data,
		contentType: resized.mimeType,
		width: resized.width,
		height: resized.height
	};
}
function resolveManagedImageOriginalPath(record) {
	if (!path.isAbsolute(record.original.mediaRoot) || record.original.mediaSubdir !== "outgoing/originals" || !record.original.mediaId || record.original.mediaId.includes("/") || record.original.mediaId.includes("\\") || record.original.mediaId.includes("\0")) throw new Error("Managed image record has an unsafe media identity");
	return path.join(record.original.mediaRoot, record.original.mediaSubdir, record.original.mediaId);
}
function resolveManagedImageOriginalsDir(stateDir) {
	const runtimeMediaRoot = path.resolve(stateDir) === path.resolve(resolveStateDir()) ? getMediaDir() : path.join(stateDir, "media");
	return path.join(runtimeMediaRoot, MANAGED_OUTGOING_ORIGINALS_SUBDIR);
}
async function hasUnmigratedManagedImageMetadata(stateDir) {
	try {
		return (await fs.readdir(path.join(stateDir, "media", "outgoing", "records"))).some((name) => name.endsWith(".json") || name.includes(".json.doctor-importing-"));
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
async function deleteAgedOrphanManagedImageFiles(params) {
	if (await hasUnmigratedManagedImageMetadata(params.stateDir)) return 0;
	const referencedMediaIds = new Set(await listManagedImageOriginalMediaIds(params.stateDir));
	const originalsDir = resolveManagedImageOriginalsDir(params.stateDir);
	let names;
	try {
		names = await fs.readdir(originalsDir);
	} catch {
		return 0;
	}
	let deletedCount = 0;
	for (const name of names) {
		if (referencedMediaIds.has(name)) continue;
		const filePath = path.join(originalsDir, name);
		try {
			const stat = await fs.lstat(filePath);
			if (!stat.isFile() || stat.isSymbolicLink() || params.nowMs - stat.mtimeMs < params.minAgeMs) continue;
			await fs.rm(filePath, { force: true });
			deletedCount += 1;
		} catch {}
	}
	return deletedCount;
}
function buildOutgoingVariantUrl(sessionKey, attachmentId, variant) {
	return `${OUTGOING_IMAGE_ROUTE_PREFIX}/${encodeURIComponent(sessionKey)}/${attachmentId}/${variant}`;
}
function buildManagedOutgoingArtifactId(attachmentId, kind) {
	return `${kind === "image" ? MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX : MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX}${attachmentId}`;
}
function parseManagedOutgoingArtifactId(value) {
	const family = value.startsWith("artifact_managed_image_") ? "image" : value.startsWith("artifact_managed_media_") ? "media" : null;
	if (!family) return null;
	const prefix = family === "image" ? MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX : MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX;
	const attachmentId = value.slice(prefix.length);
	return MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(attachmentId) ? {
		attachmentId,
		family
	} : null;
}
function signManagedOutgoingImageTicketPayload(encodedPayload) {
	return createHmac("sha256", managedOutgoingImageTicketSecret).update(encodedPayload).digest("base64url");
}
function createManagedOutgoingImageTicket(params) {
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return null;
	const exp = asDateTimestampMs(now + MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS);
	if (exp === void 0) return null;
	const payload = {
		scope: MANAGED_OUTGOING_IMAGE_TICKET_SCOPE,
		sessionKey: params.sessionKey,
		attachmentId: params.attachmentId,
		variant: "full",
		exp
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	return {
		ticket: `v1.${encodedPayload}.${signManagedOutgoingImageTicketPayload(encodedPayload)}`,
		expiresAt: resolveTimestampMsToIsoString(exp)
	};
}
function verifyManagedOutgoingImageTicket(params) {
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return false;
	const parts = params.ticket?.split(".");
	if (!parts || parts.length !== 3 || parts[0] !== "v1") return false;
	const [, encodedPayload, signature] = parts;
	if (!encodedPayload || !signature) return false;
	if (!safeEqualSecret(signature, signManagedOutgoingImageTicketPayload(encodedPayload))) return false;
	try {
		const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
		return payload.scope === MANAGED_OUTGOING_IMAGE_TICKET_SCOPE && payload.sessionKey === params.sessionKey && payload.attachmentId === params.attachmentId && payload.variant === "full" && typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp >= now;
	} catch {
		return false;
	}
}
function deriveAltText(source, index) {
	const fallback = `Generated image ${index + 1}`;
	try {
		if (/^https?:\/\//i.test(source)) {
			const parsed = new URL(source);
			return path.basename(parsed.pathname || "").trim() || fallback;
		}
	} catch {}
	return path.basename(source).trim() || fallback;
}
function parseMediaDataUrl(source, label, imageLimits) {
	const trimmed = source.trim();
	if (!trimmed.startsWith("data:")) return { kind: "not-data-url" };
	const afterPrefix = trimmed.slice(5);
	const commaIdx = afterPrefix.indexOf(",");
	const mimeAndParams = commaIdx < 0 ? "" : afterPrefix.slice(0, commaIdx);
	if (mimeAndParams.slice(-7).toLowerCase() !== ";base64") throw new Error("Invalid image data URL");
	const semicolonIdx = mimeAndParams.indexOf(";");
	const contentType = (semicolonIdx < 0 ? mimeAndParams : mimeAndParams.slice(0, semicolonIdx)).trim().toLowerCase();
	if (!contentType) throw new Error("Invalid image data URL");
	const base64Part = afterPrefix.slice(commaIdx + 1);
	if (!base64Part || /[^A-Za-z0-9+/=\s]/.test(base64Part)) throw new Error("Invalid image data URL");
	const mediaKind = mediaKindFromMime(contentType);
	if (mediaKind !== "image" && mediaKind !== "audio" && mediaKind !== "video") return { kind: "unsupported-data-url" };
	const maxBytes = maxBytesForManagedMediaKind(mediaKind, imageLimits);
	if (estimateBase64DecodedByteLength(base64Part) > maxBytes) throw createManagedMediaByteLimitError({
		kind: mediaKind,
		label,
		maxBytes
	});
	return {
		kind: "media-data-url",
		buffer: Buffer.from(base64Part.replace(/\s+/g, ""), "base64"),
		contentType,
		mediaKind
	};
}
async function getVariantStats(params) {
	const loaded = params.buffer ? {
		buffer: params.buffer,
		sizeBytes: params.sizeBytes ?? params.buffer.byteLength
	} : await (async () => {
		const { buffer, stat } = await readLocalFileSafely({ filePath: params.filePath });
		return {
			buffer,
			sizeBytes: stat.size
		};
	})();
	const metadataBuffer = loaded.buffer;
	const metadata = await getImageMetadata(metadataBuffer).catch(() => null) ?? {
		width: null,
		height: null
	};
	return {
		width: metadata.width ?? null,
		height: metadata.height ?? null,
		sizeBytes: Number.isFinite(loaded.sizeBytes) ? loaded.sizeBytes : null
	};
}
async function deleteManagedImageRecordArtifacts(record, stateDir = resolveStateDir(), alreadyClaimed = false) {
	if (!alreadyClaimed && !claimManagedImageRecordCleanupIfCurrent(record, stateDir)) return {
		deletedRecord: false,
		deletedFileCount: 0
	};
	try {
		await fs.rm(resolveManagedImageOriginalPath(record), { force: true });
	} catch {
		return {
			deletedRecord: false,
			deletedFileCount: 0
		};
	}
	return {
		deletedRecord: deleteClaimedManagedImageRecord(record, stateDir),
		deletedFileCount: 1
	};
}
async function cleanupManagedOutgoingMediaRecords(params) {
	const stateDir = params?.stateDir ?? resolveStateDir();
	const nowMs = params?.nowMs ?? Date.now();
	const transientMaxAgeMs = params?.transientMaxAgeMs ?? DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS;
	const sessionKeyFilter = params?.sessionKey ?? null;
	const agentIdFilter = params?.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const globalCompatibilityOwnerAgentId = sessionKeyFilter === "global" && agentIdFilter ? tryResolveSessionCompatibilityOwnerAgentId(getRuntimeConfig(), "global") : void 0;
	const forceDeleteSessionRecords = params?.forceDeleteSessionRecords === true;
	const entries = await listManagedImageRecordEntries({ stateDir });
	let pendingPreparedAttachmentIds;
	let deletedRecordCount = 0;
	let deletedFileCount = 0;
	let retainedCount = 0;
	const transcriptAttachmentIndexCache = /* @__PURE__ */ new Map();
	const sessionStoreAvailabilityCache = /* @__PURE__ */ new Map();
	const sessionStoreTargetsReadCache = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const { record } = entry;
		if (sessionKeyFilter && record.sessionKey !== sessionKeyFilter) {
			retainedCount += 1;
			continue;
		}
		if (sessionKeyFilter === "global" && record.sessionKey === "global" && (!agentIdFilter || resolveManagedSessionOwnerAgentId(record.sessionKey, record.agentId, globalCompatibilityOwnerAgentId) !== agentIdFilter)) {
			retainedCount += 1;
			continue;
		}
		let shouldDelete = entry.cleanupPending;
		if (!entry.cleanupPending && forceDeleteSessionRecords && (!sessionKeyFilter || record.sessionKey === sessionKeyFilter)) shouldDelete = true;
		else if (!entry.cleanupPending && record.messageId) shouldDelete = await recordMatchesTranscriptMessage(record, transcriptAttachmentIndexCache, sessionStoreAvailabilityCache, sessionStoreTargetsReadCache, stateDir) === "missing";
		else if (!entry.cleanupPending) {
			const createdAtMs = Date.parse(record.createdAt);
			if (Number.isFinite(createdAtMs) && nowMs - createdAtMs >= transientMaxAgeMs && params?.hasActiveSessionRun?.(record.sessionKey, record.agentId?.trim() || void 0) !== true) {
				if (pendingPreparedAttachmentIds === void 0) pendingPreparedAttachmentIds = await loadPendingPreparedAttachmentIds(stateDir);
				shouldDelete = pendingPreparedAttachmentIds !== null && !pendingPreparedAttachmentIds.has(record.attachmentId);
			}
		}
		if (shouldDelete) {
			const deleted = await deleteManagedImageRecordArtifacts(record, stateDir, entry.cleanupPending);
			if (deleted.deletedRecord) {
				deletedRecordCount += 1;
				deletedFileCount += deleted.deletedFileCount;
			} else retainedCount += 1;
		} else retainedCount += 1;
	}
	deletedFileCount += await deleteAgedOrphanManagedImageFiles({
		stateDir,
		nowMs,
		minAgeMs: Math.max(transientMaxAgeMs, DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS)
	});
	return {
		deletedRecordCount,
		deletedFileCount,
		retainedCount
	};
}
async function removeManagedOutgoingMediaBlocks(params) {
	const stateDir = params.stateDir ?? resolveStateDir();
	const messageId = params.messageId;
	await Promise.all(collectManagedOutgoingAttachmentRefs(params.blocks).map(async ({ attachmentId }) => {
		const record = await readManagedImageRecord(attachmentId, stateDir);
		if (record?.messageId === messageId) await deleteManagedImageRecordArtifacts(record, stateDir);
	}));
}
function resolveManagedSessionOwnerAgentId(sessionKey, explicitAgentId, compatibilityAgentId) {
	const ownerAgentId = explicitAgentId?.trim() || parseAgentSessionKey(sessionKey)?.agentId || compatibilityAgentId?.trim();
	return ownerAgentId ? normalizeAgentId(ownerAgentId) : void 0;
}
function buildManagedMediaBlock(record, playback) {
	const kind = resolveManagedMediaKind(record.original.contentType);
	if (!kind) throw new Error("Managed media record has an unsupported content type");
	const fullUrl = buildOutgoingVariantUrl(record.sessionKey, record.attachmentId, "full");
	const artifactId = buildManagedOutgoingArtifactId(record.attachmentId, kind);
	if (kind === "document") return {
		type: "attachment",
		attachment: {
			artifactId,
			url: fullUrl,
			kind,
			label: record.original.filename ?? record.alt,
			mimeType: record.original.contentType,
			sizeBytes: record.original.sizeBytes
		}
	};
	return {
		type: kind,
		artifactId,
		url: fullUrl,
		openUrl: fullUrl,
		...kind === "image" ? { alt: record.alt } : { fileName: record.original.filename },
		mimeType: record.original.contentType,
		...playback ? { playback } : {},
		...kind === "image" ? {
			width: record.original.width,
			height: record.original.height
		} : {},
		sizeBytes: record.original.sizeBytes
	};
}
function buildManagedOutgoingAttachmentRefKey(messageId, attachmentId) {
	return `${messageId}::${attachmentId}`;
}
function buildManagedImageResizeWarningBlock(params) {
	return {
		type: "text",
		text: `[Image warning] ${params.alt} exceeded gateway dimension/pixel limits and was resized from ${params.originalWidth}×${params.originalHeight} to ${params.resizedWidth}×${params.resizedHeight}.`
	};
}
function toRecordFilename(filePath, attachmentName, fallbackName, contentType) {
	const fallback = fallbackName ?? path.basename(filePath).trim();
	if (!attachmentName?.trim()) return fallback || null;
	const safeName = sanitizeUntrustedFileName(attachmentName, fallback);
	const extension = contentType === "application/octet-stream" || mimeTypeFromFilePath(safeName) === contentType ? path.extname(safeName) : path.extname(filePath);
	return `${path.parse(safeName).name}${extension}`;
}
function prepareOutgoingMediaFromReplyPayload(payload, metadataSource = payload) {
	const metadataByUrl = /* @__PURE__ */ new Map();
	for (const entry of collectReplyMediaEntries(metadataSource)) {
		const key = entry.url.trim();
		if (key && entry.attachment && !metadataByUrl.has(key)) metadataByUrl.set(key, entry.attachment);
	}
	const seen = /* @__PURE__ */ new Set();
	return collectReplyMediaEntries(payload).flatMap((entry) => {
		const key = entry.url.trim();
		if (!key || seen.has(key)) return [];
		seen.add(key);
		const attachment = metadataByUrl.get(key) ?? entry.attachment;
		return [{
			url: entry.url,
			...attachment?.name ? { filename: attachment.name } : {},
			...attachment?.mimeType ? { mimeType: attachment.mimeType } : {},
			trustedLocal: attachment?.trustedLocalMedia ?? payload.trustedLocalMedia === true,
			...attachment?.durationMs !== void 0 ? { durationMs: attachment.durationMs } : {},
			...attachment?.width !== void 0 ? { width: attachment.width } : {},
			...attachment?.height !== void 0 ? { height: attachment.height } : {}
		}];
	});
}
function parseManagedOutgoingRoute(value) {
	try {
		const match = new URL(value, "http://localhost").pathname.match(/^\/api\/chat\/media\/outgoing\/([^/]+)\/([^/]+)\/full$/);
		if (!match) return null;
		if (!MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(expectDefined(match[2], "managed image attachments regex capture 2"))) return null;
		return {
			sessionKey: decodeURIComponent(expectDefined(match[1], "managed image attachments regex capture 1")),
			attachmentId: expectDefined(match[2], "managed image attachments regex capture 2")
		};
	} catch {
		return null;
	}
}
function collectManagedOutgoingAttachmentRefs(blocks, expectedSessionKey) {
	const refs = /* @__PURE__ */ new Map();
	for (const block of blocks ?? []) {
		const attachment = block?.type === "attachment" ? asOptionalRecord(block.attachment) : void 0;
		if (block?.type !== "image" && block?.type !== "audio" && block?.type !== "video" && !attachment) continue;
		for (const candidate of [
			block.url,
			block.openUrl,
			attachment?.url
		]) {
			if (typeof candidate !== "string") continue;
			const parsed = parseManagedOutgoingRoute(candidate);
			if (!parsed) continue;
			if (expectedSessionKey && parsed.sessionKey !== expectedSessionKey) continue;
			const attachmentId = expectDefined(parsed.attachmentId, "managed image attachment id");
			refs.set(attachmentId, {
				attachmentId,
				sessionKey: parsed.sessionKey
			});
		}
	}
	return [...refs.values()];
}
async function loadPendingPreparedAttachmentIds(stateDir) {
	try {
		const queueContext = captureOpenClawStateWorkerContext({ env: resolveDeliveryQueueStateEnv(stateDir) });
		const attachmentIds = /* @__PURE__ */ new Set();
		for (const entry of await loadPendingSessionDeliveries(queueContext)) {
			if (entry.kind !== "agentTurn") continue;
			for (const blocks of Object.values(entry.preparedMediaBlocks ?? {})) for (const ref of collectManagedOutgoingAttachmentRefs(blocks, entry.sessionKey)) attachmentIds.add(ref.attachmentId);
		}
		return attachmentIds;
	} catch {
		return null;
	}
}
async function recordMatchesTranscriptMessage(record, cache, storeAvailabilityCache, storeTargetsReadCache, stateDir) {
	if (!record.messageId) return "missing";
	const { sessionKey, agentId, messageId: requestedMessageId } = record;
	const refKey = buildManagedOutgoingAttachmentRefKey(requestedMessageId, record.attachmentId);
	const cacheKey = buildSessionManagedOutgoingAttachmentIndexCacheKey(sessionKey, agentId);
	if (cache?.has(cacheKey)) return cache.get(cacheKey)?.has(refKey) ? "match" : "missing";
	const cfg = getRuntimeConfig();
	const ownerAgentId = resolveManagedSessionOwnerAgentId(sessionKey, agentId) ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
	if (!ownerAgentId) return "unavailable";
	const discovery = storeAvailabilityCache?.get(ownerAgentId) ?? resolveExistingAgentSessionStoreTargetsReadOnlyResult(cfg, ownerAgentId, {
		cache: storeTargetsReadCache,
		...stateDir ? { env: {
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		} } : {}
	});
	storeAvailabilityCache?.set(ownerAgentId, discovery);
	if (!discovery.available) return "unavailable";
	const usesRuntimeState = !stateDir || path.resolve(stateDir) === path.resolve(resolveStateDir());
	const env = stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} : process.env;
	let matched;
	for (const target of discovery.targets) {
		const exact = loadExactSessionEntryReadOnlyResult({
			agentId: ownerAgentId,
			clone: false,
			env,
			sessionKey,
			storePath: target.storePath
		});
		if (!exact.found) return "unavailable";
		let targetEntry = exact.value?.entry;
		if (!targetEntry) try {
			targetEntry = resolveSessionEntry({
				agentId: ownerAgentId,
				clone: false,
				env,
				sessionKey,
				storePath: target.storePath
			}, { readOnly: true }).existing;
		} catch {
			return "unavailable";
		}
		if (targetEntry) {
			if (matched) return "unavailable";
			matched = {
				entry: targetEntry,
				storePath: target.storePath
			};
		}
	}
	let entry = matched?.entry;
	let storePath = matched?.storePath ?? discovery.targets[0]?.storePath ?? "";
	if (!entry && usesRuntimeState) {
		const loaded = loadGatewaySessionEntryReadOnly(sessionKey, { agentId: ownerAgentId });
		const exact = loadExactSessionEntryReadOnlyResult({
			agentId: ownerAgentId,
			clone: false,
			sessionKey,
			storePath: loaded.storePath
		});
		if (!exact.found) return "unavailable";
		entry = exact.value?.entry ?? loaded.entry;
		storePath = loaded.storePath;
	}
	const sessionId = entry?.sessionId;
	if (!sessionId) {
		cache?.set(cacheKey, null);
		return "missing";
	}
	const scope = {
		agentId,
		sessionEntry: entry,
		sessionId,
		sessionKey,
		storePath
	};
	const messages = cache ? (await readSessionMessagesWithSourceAsync(scope, {
		mode: "full",
		reason: "managed outgoing attachment index",
		allowResetArchiveFallback: true
	})).messages : await readSessionMessagesMatchingIdAsync(scope, requestedMessageId);
	const index = /* @__PURE__ */ new Set();
	for (const message of messages) {
		const messageId = (message?.["__openclaw"])?.id;
		if (typeof messageId !== "string" || !messageId) continue;
		for (const ref of collectManagedOutgoingAttachmentRefs(readAssistantDisplayContent(message), sessionKey)) index.add(buildManagedOutgoingAttachmentRefKey(messageId, ref.attachmentId));
	}
	cache?.set(cacheKey, index);
	return index.has(refKey) ? "match" : "missing";
}
async function resolveManagedOutgoingMediaArtifactDownloadForRecord(record, stateDir) {
	if (await recordMatchesTranscriptMessage(record, void 0, void 0, void 0, stateDir) !== "match") return null;
	const kind = resolveManagedMediaKind(record.original.contentType);
	if (!kind) return null;
	const ticket = createManagedOutgoingImageTicket({
		sessionKey: record.sessionKey,
		attachmentId: record.attachmentId
	});
	if (!ticket) return null;
	try {
		if (!(await fs.stat(resolveManagedImageOriginalPath(record))).isFile()) return null;
	} catch {
		return null;
	}
	const canonicalUrl = buildOutgoingVariantUrl(record.sessionKey, record.attachmentId, "full");
	const params = new URLSearchParams({ mediaTicket: ticket.ticket });
	return {
		artifactId: buildManagedOutgoingArtifactId(record.attachmentId, kind),
		sessionKey: record.sessionKey,
		type: kind === "document" ? "file" : kind,
		title: kind === "image" ? record.alt : record.original.filename ?? record.alt,
		...record.original.contentType ? { mimeType: record.original.contentType } : {},
		...record.original.sizeBytes != null ? { sizeBytes: record.original.sizeBytes } : {},
		url: `${canonicalUrl}?${params.toString()}`,
		expiresAt: ticket.expiresAt
	};
}
/** Resolve one transcript-backed media artifact to a short-lived HTTP capability. */
async function resolveManagedOutgoingMediaArtifactDownload(params) {
	const { artifactId, sessionKey, agentId, defaultAgentId } = params;
	const stateDir = params.stateDir ?? resolveStateDir();
	const parsed = parseManagedOutgoingArtifactId(artifactId);
	if (!parsed) return null;
	const record = await readManagedImageRecord(parsed.attachmentId, stateDir);
	if (!record || record.sessionKey !== sessionKey) return null;
	const requestedAgentId = agentId ? normalizeAgentId(agentId) : void 0;
	const recordAgentId = resolveManagedSessionOwnerAgentId(record.sessionKey, record.agentId, defaultAgentId);
	if (requestedAgentId && recordAgentId !== requestedAgentId) return null;
	const kind = resolveManagedMediaKind(record.original.contentType);
	if (!kind || parsed.family === "image" !== (kind === "image")) return null;
	return await resolveManagedOutgoingMediaArtifactDownloadForRecord(record, stateDir);
}
/** Upgrade legacy managed-image URLs that predate stable artifact ids. */
async function resolveManagedOutgoingMediaUrlDownload(params) {
	const { url, sessionKey } = params;
	const stateDir = params.stateDir ?? resolveStateDir();
	const parsed = parseManagedOutgoingRoute(url);
	if (!parsed || parsed.sessionKey !== sessionKey) return null;
	const record = await readManagedImageRecord(parsed.attachmentId, stateDir);
	if (!record || record.sessionKey !== sessionKey) return null;
	return await resolveManagedOutgoingMediaArtifactDownloadForRecord(record, stateDir);
}
async function readManagedImageThumbnailFromFile(opened, maxBytes) {
	if (maxBytes !== void 0 && opened.stat.size > maxBytes) throw new Error("Managed image exceeds the preview byte limit");
	return await resolveManagedImageThumbnail(`${opened.realPath}\0${opened.stat.mtimeMs}\0${opened.stat.size}`, async () => {
		const source = await opened.handle.readFile();
		if (maxBytes !== void 0 && source.byteLength > maxBytes) throw new Error("Managed image exceeds the preview byte limit");
		return (await createImageProcessor().encode(source, {
			format: "png",
			resize: {
				maxSide: MANAGED_IMAGE_THUMBNAIL_MAX_SIDE,
				enlarge: false
			},
			compressionLevel: 8
		})).data;
	});
}
/** Read a local preview through the same transcript ownership and thumbnail cache as HTTP. */
async function readManagedOutgoingImageThumbnail(params) {
	const { artifactId, sessionKey, maxBytes, signal } = params;
	const stateDir = params.stateDir ?? resolveStateDir();
	signal.throwIfAborted();
	const download = await resolveManagedOutgoingMediaArtifactDownload({
		...params,
		stateDir
	});
	const parsed = parseManagedOutgoingArtifactId(artifactId);
	if (!download || download.type !== "image" || !parsed) return null;
	signal.throwIfAborted();
	const record = await readManagedImageRecord(parsed.attachmentId, stateDir);
	signal.throwIfAborted();
	if (!record || record.sessionKey !== sessionKey) return null;
	const opened = await openLocalFileSafely({ filePath: resolveManagedImageOriginalPath(record) });
	try {
		const thumbnail = await readManagedImageThumbnailFromFile(opened, maxBytes);
		signal.throwIfAborted();
		if (await recordMatchesTranscriptMessage(record, void 0, void 0, void 0, stateDir) !== "match") return null;
		signal.throwIfAborted();
		return thumbnail;
	} finally {
		await opened.handle.close();
	}
}
function attachManagedOutgoingMediaToMessage(params) {
	const messageId = params.messageId.trim();
	if (!messageId) return false;
	const refs = collectManagedOutgoingAttachmentRefs(params.blocks);
	if (refs.length === 0) return false;
	return refs.map(({ attachmentId, sessionKey }) => attachManagedImageRecordToMessage({
		attachmentId,
		sessionKey,
		messageId,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		stateDir: params.stateDir
	})).every(Boolean);
}
async function createManagedOutgoingMediaBlocks(params) {
	return await withChannelReadAuthority(params.assertCurrent, async () => {
		const sessionKey = params.sessionKey.trim();
		if (!sessionKey) return [];
		const items = params.items ?? [];
		if (items.length === 0) return [];
		const stateDir = params.stateDir ?? resolveStateDir();
		const limits = resolveManagedImageAttachmentLimits(params.limits);
		const blocks = [];
		let resolvedLocalRoots;
		for (const [index, item] of items.entries()) {
			const mediaUrl = item.url;
			const trimmedMediaUrl = mediaUrl.trim();
			const dataUrlKind = /^data:(image|audio|video)\//iu.exec(trimmedMediaUrl)?.[1];
			const fallbackLabel = `Generated ${dataUrlKind ?? "media"} ${index + 1}`;
			const isDataUrl = trimmedMediaUrl.startsWith("data:");
			const localMediaPath = isDataUrl ? void 0 : resolveLocalMediaPath(mediaUrl);
			const label = isDataUrl ? fallbackLabel : item.filename?.trim() || deriveAltText(localMediaPath ?? mediaUrl, index);
			const inferredKind = resolveManagedMediaKind(item.mimeType ?? mimeTypeFromFilePath(localMediaPath ?? mediaUrl));
			const hintedKind = dataUrlKind === "image" || dataUrlKind === "audio" || dataUrlKind === "video" ? dataUrlKind : inferredKind === "image" || inferredKind === "audio" || inferredKind === "video" || inferredKind === "document" ? inferredKind : "media";
			let savedOriginalPath = null;
			try {
				params.assertCurrent?.();
				const parsedDataUrl = parseMediaDataUrl(mediaUrl, fallbackLabel, limits);
				if (parsedDataUrl.kind === "unsupported-data-url") throw new Error("Managed media attachment has an unsupported data URL content type");
				if (localMediaPath && (hintedKind === "audio" || hintedKind === "video") && !item.trustedLocal) throw new Error("Local audio/video media requires an explicitly trusted reply payload");
				let resizeWarning = null;
				let savedOriginal = parsedDataUrl.kind === "media-data-url" ? await saveMediaBuffer(parsedDataUrl.buffer, parsedDataUrl.contentType, "outgoing/originals", maxBytesForManagedMediaKind(parsedDataUrl.mediaKind, limits), `generated-${parsedDataUrl.mediaKind}-${index + 1}`) : await (async () => {
					if (localMediaPath) {
						const localRoots = params.localRoots;
						await assertLocalMediaAllowed(localMediaPath, localRoots, localRoots === "any" ? void 0 : { resolveRoots: async () => {
							resolvedLocalRoots ??= await resolveLocalMediaRoots(localRoots);
							return resolvedLocalRoots;
						} });
					}
					const ingestSource = localMediaPath ?? mediaUrl;
					const maxBytes = Math.max(limits.maxBytes, maxBytesForKind("audio"), maxBytesForKind("video"), maxBytesForKind("document"), MEDIA_MAX_BYTES);
					if (hasHttpUrlPrefix(ingestSource)) {
						const { saveRemoteMediaForStore } = await import("./store.remote.runtime.js");
						return await saveRemoteMediaForStore({
							source: ingestSource,
							subdir: "outgoing/originals",
							maxBytes,
							abortSignal: params.abortSignal
						});
					}
					return await saveMediaSource(ingestSource, void 0, "outgoing/originals", maxBytes);
				})();
				savedOriginalPath = savedOriginal.path;
				let savedOriginalContentType = savedOriginal.contentType ?? item.mimeType;
				if (!savedOriginalContentType) throw new Error("Managed media attachment has no detectable content type");
				const mediaKind = resolveManagedMediaKind(savedOriginalContentType);
				if (!mediaKind) throw new Error("Managed media attachment has an unsupported content type");
				if (localMediaPath && mediaKind !== "image" && !item.trustedLocal) throw new Error("Local audio/video media requires an explicitly trusted reply payload");
				const maxBytes = maxBytesForManagedMediaKind(mediaKind, limits);
				if (savedOriginal.size > maxBytes) throw createManagedMediaByteLimitError({
					kind: mediaKind,
					label,
					maxBytes
				});
				let originalStats = {
					width: null,
					height: null,
					sizeBytes: savedOriginal.size
				};
				if (mediaKind === "image") {
					let originalBuffer = parsedDataUrl.kind === "media-data-url" ? parsedDataUrl.buffer : (await readLocalFileSafely({ filePath: savedOriginal.path })).buffer;
					validateManagedImageBuffer(originalBuffer, label, limits);
					originalStats = await getVariantStats({
						filePath: savedOriginal.path,
						buffer: originalBuffer,
						sizeBytes: savedOriginal.size
					});
					if (originalStats.sizeBytes != null && originalStats.sizeBytes > maxBytes) throw createManagedMediaByteLimitError({
						kind: mediaKind,
						label,
						maxBytes
					});
					const originalDisplayMetadata = originalStats.width != null && originalStats.height != null ? {
						width: originalStats.width,
						height: originalStats.height
					} : await getImageMetadata(originalBuffer);
					let effectiveMetadata = originalDisplayMetadata;
					let metadataLimitError = getManagedImageMetadataLimitError(effectiveMetadata, label, limits);
					for (let resizeAttempt = 0; metadataLimitError; resizeAttempt += 1) {
						if (!effectiveMetadata || resizeAttempt >= 3) throw createManagedImageAttachmentError(metadataLimitError);
						const resized = await resizeManagedImageBufferToLimits({
							buffer: originalBuffer,
							limits
						});
						validateManagedImageBuffer(resized.buffer, label, limits);
						const replacement = await saveMediaBuffer(resized.buffer, resized.contentType, "outgoing/originals", limits.maxBytes, toRecordFilename(savedOriginal.path) ?? `generated-image-${index + 1}`);
						await unlinkIfExists(savedOriginal.path);
						savedOriginal = replacement;
						savedOriginalContentType = replacement.contentType ?? resized.contentType;
						savedOriginalPath = savedOriginal.path;
						originalBuffer = resized.buffer;
						originalStats = await getVariantStats({
							filePath: savedOriginal.path,
							buffer: originalBuffer,
							sizeBytes: savedOriginal.size
						});
						effectiveMetadata = originalStats.width != null && originalStats.height != null ? {
							width: originalStats.width,
							height: originalStats.height
						} : await getImageMetadata(originalBuffer);
						metadataLimitError = getManagedImageMetadataLimitError(effectiveMetadata, label, limits);
						if (!metadataLimitError) resizeWarning = buildManagedImageResizeWarningBlock({
							alt: label,
							originalWidth: originalDisplayMetadata?.width ?? effectiveMetadata?.width ?? resized.width,
							originalHeight: originalDisplayMetadata?.height ?? effectiveMetadata?.height ?? resized.height,
							resizedWidth: effectiveMetadata?.width ?? resized.width,
							resizedHeight: effectiveMetadata?.height ?? resized.height
						});
					}
				}
				const record = {
					attachmentId: randomUUID(),
					sessionKey,
					...sessionKey === "global" && params.agentId?.trim() ? { agentId: params.agentId.trim() } : {},
					messageId: params.messageId ?? null,
					createdAt: (/* @__PURE__ */ new Date()).toISOString(),
					retentionClass: params.messageId ? "history" : "transient",
					alt: label,
					original: {
						mediaRoot: path.dirname(path.dirname(path.dirname(path.resolve(savedOriginal.path)))),
						mediaId: savedOriginal.id,
						mediaSubdir: MANAGED_OUTGOING_ORIGINALS_SUBDIR,
						contentType: savedOriginalContentType,
						width: originalStats.width,
						height: originalStats.height,
						sizeBytes: originalStats.sizeBytes,
						filename: toRecordFilename(savedOriginal.path, item.filename, mediaKind === "image" ? void 0 : label, savedOriginalContentType)
					}
				};
				let playback;
				if (mediaKind === "audio" || mediaKind === "video") {
					const opened = await openLocalFileSafely({ filePath: savedOriginal.path });
					try {
						const probe = await probePlaybackMediaFileDescriptor(opened.handle.fd, mediaKind);
						playback = await resolvePlaybackModeForSource({
							sourcePath: opened.realPath,
							sourceStat: opened.stat,
							mimeType: savedOriginalContentType,
							kind: mediaKind,
							probe
						});
					} finally {
						await opened.handle.close().catch(() => {});
					}
				}
				const block = buildManagedMediaBlock(record, playback);
				const readScope = captureChannelReadScope();
				const originalPath = savedOriginal.path;
				readScope?.registerResource({
					key: `managed-media-record:${stateDir}:${record.attachmentId}`,
					settle: async (accepted) => {
						if (accepted || !claimManagedImageRecordCleanupIfCurrent(record, stateDir)) return;
						await readScope.discardResource(originalPath);
						try {
							await fs.lstat(originalPath);
						} catch (error) {
							if (error instanceof Error && "code" in error && error.code === "ENOENT") {
								deleteClaimedManagedImageRecord(record, stateDir);
								return;
							}
							throw error;
						}
					}
				});
				insertManagedImageRecord(record, stateDir);
				const durationMs = asNonNegativeFiniteNumber(item.durationMs);
				const width = asNonNegativeFiniteNumber(item.width);
				const height = asNonNegativeFiniteNumber(item.height);
				blocks.push({
					...block,
					...durationMs !== void 0 ? { durationMs } : {},
					...mediaKind === "video" && width !== void 0 ? { width } : {},
					...mediaKind === "video" && height !== void 0 ? { height } : {}
				});
				if (resizeWarning) blocks.push(resizeWarning);
			} catch (error) {
				if (savedOriginalPath) await unlinkIfExists(savedOriginalPath);
				try {
					params.assertCurrent?.();
				} catch (authorityError) {
					await removeManagedOutgoingMediaBlocks({
						blocks,
						messageId: params.messageId ?? null,
						stateDir
					});
					throw authorityError;
				}
				const sanitizedError = getSanitizedManagedImageAttachmentError(error, label, hintedKind);
				if (params.continueOnPrepareError) {
					blocks.push(buildManagedMediaFailureBlock({
						code: "delivery-failed",
						kind: hintedKind,
						label,
						mimeType: item.mimeType ?? mimeTypeFromFilePath(localMediaPath ?? mediaUrl)
					}));
					params.onPrepareError?.(sanitizedError);
					continue;
				}
				await removeManagedOutgoingMediaBlocks({
					blocks,
					messageId: params.messageId ?? null,
					stateDir
				});
				throw sanitizedError;
			}
		}
		return blocks;
	});
}
function sendStatus(res, statusCode, body) {
	if (res.writableEnded) return;
	res.statusCode = statusCode;
	res.setHeader("content-type", "text/plain; charset=utf-8");
	res.end(body);
}
function buildManagedMediaContentDisposition(value, contentType) {
	const fallback = contentType.startsWith("image/") ? "generated-image" : "generated-media";
	return buildAssistantMediaContentDisposition(value?.trim() || fallback, contentType);
}
async function handleManagedOutgoingMediaHttpRequest(req, res, opts) {
	const requestUrl = new URL(req.url ?? "/", "http://localhost");
	const match = (opts.basePath && requestUrl.pathname.startsWith(`${opts.basePath}/`) ? requestUrl.pathname.slice(opts.basePath.length) : requestUrl.pathname).match(/^\/api\/chat\/media\/outgoing\/([^/]+)\/([^/]+)\/(full|thumbnail)$/);
	if (!match) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const encodedSessionKey = match[1];
	const attachmentId = match[2];
	const variant = match[3];
	if (!encodedSessionKey || !attachmentId || variant !== "full" && variant !== "thumbnail") return false;
	if (!MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(attachmentId)) {
		sendStatus(res, 404, "not found");
		return true;
	}
	let sessionKey;
	try {
		sessionKey = decodeURIComponent(encodedSessionKey);
	} catch {
		sendStatus(res, 404, "not found");
		return true;
	}
	const hasValidMediaTicket = verifyManagedOutgoingImageTicket({
		ticket: requestUrl.searchParams.get("mediaTicket"),
		sessionKey,
		attachmentId
	});
	let assertCurrent;
	if (!hasValidMediaTicket) {
		const requestAuth = await authorizeGatewayHttpRequestOrReply({
			...opts,
			req,
			res
		});
		if (!requestAuth) return true;
		assertCurrent = requestAuth.assertCurrent;
		const requestedScopes = resolveSharedSecretHttpOperatorScopes(req, requestAuth);
		const scopeAuth = authorizeOperatorScopesForMethod("chat.history", requestedScopes);
		if (!scopeAuth.allowed) {
			sendMissingScopeForbidden(res, scopeAuth.missingScope);
			return true;
		}
		if (!resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth)) {
			sendJson(res, 403, {
				ok: false,
				error: {
					type: "forbidden",
					message: "owner access required"
				}
			});
			return true;
		}
	}
	const stateDir = opts.stateDir ?? resolveStateDir();
	const record = await readManagedImageRecord(attachmentId, stateDir);
	if (!record || record.sessionKey !== sessionKey) {
		sendStatus(res, 404, "not found");
		return true;
	}
	if (await recordMatchesTranscriptMessage(record, void 0, void 0, void 0, stateDir) !== "match") {
		sendStatus(res, 404, "not found");
		return true;
	}
	const mediaKind = resolveManagedMediaKind(record.original.contentType);
	if (!mediaKind) {
		sendStatus(res, 404, "not found");
		return true;
	}
	let opened;
	try {
		opened = await openLocalFileSafely({ filePath: resolveManagedImageOriginalPath(record) });
	} catch {
		sendStatus(res, 404, "not found");
		return true;
	}
	const respondNotFound = () => sendStatus(res, 404, "not found");
	let byteStream = createGatewayByteStream(res, opened.handle, respondNotFound);
	try {
		let responseContentType = record.original.contentType || "application/octet-stream";
		let responseFilename = record.original.filename;
		if (variant === "thumbnail") {
			const thumbnail = mediaKind === "image" ? await readManagedImageThumbnailFromFile(opened).catch(() => null) : null;
			await byteStream.close();
			assertCurrent?.();
			if (!thumbnail) {
				respondNotFound();
				return true;
			}
			const sourceName = path.parse(responseFilename ?? "generated-image").name;
			res.statusCode = 200;
			res.setHeader("content-type", "image/png");
			res.setHeader("content-length", String(thumbnail.byteLength));
			res.setHeader("x-content-type-options", "nosniff");
			res.setHeader("referrer-policy", "no-referrer");
			res.setHeader("cache-control", hasValidMediaTicket ? `private, max-age=${MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS / 1e3}, immutable` : "private, max-age=31536000, immutable");
			res.setHeader("content-disposition", buildManagedMediaContentDisposition(`${sourceName}-thumbnail.png`, "image/png"));
			res.end(req.method === "HEAD" ? void 0 : thumbnail);
			return true;
		}
		const isPlayback = requestUrl.searchParams.get("playback") === "1" && (mediaKind === "audio" || mediaKind === "video");
		if (isPlayback) {
			const playback = await resolvePlaybackTranscode({
				sourcePath: opened.realPath,
				sourceStat: opened.stat,
				mimeType: responseContentType,
				kind: mediaKind
			});
			if (playback.kind === "preparing") {
				await byteStream.close();
				assertCurrent?.();
				sendJson(res, 202, { status: "preparing" });
				return true;
			}
			if (playback.kind === "transcoded") {
				const transcoded = await openLocalFileSafely({ filePath: playback.path }).catch(() => null);
				if (transcoded) {
					await byteStream.close();
					opened = transcoded;
					byteStream = createGatewayByteStream(res, opened.handle, respondNotFound);
					responseContentType = playback.contentType;
					responseFilename = replacePlaybackFileExtension(responseFilename ?? "generated-media", playback.extension);
				}
			}
		}
		const byteResponse = resolveByteResponse({
			file: opened.stat,
			validators: isPlayback ? void 0 : createImmutableFileValidators(opened.stat),
			method: req.method,
			request: req
		});
		await byteStream.pipe(byteResponse, req.method, () => {
			assertCurrent?.();
			res.setHeader("content-type", responseContentType);
			res.setHeader("x-content-type-options", "nosniff");
			res.setHeader("referrer-policy", "no-referrer");
			res.setHeader("cache-control", isPlayback ? "private, no-cache" : hasValidMediaTicket ? `private, max-age=${MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS / 1e3}, immutable` : "private, max-age=31536000, immutable");
			res.setHeader("content-disposition", buildManagedMediaContentDisposition(responseFilename, responseContentType));
			writeByteHeaders(res, byteResponse);
		});
	} catch (error) {
		await byteStream.close();
		if (!res.writableEnded && !res.destroyed) throw error;
	}
	return true;
}
//#endregion
export { buildManagedMediaFailureBlock as a, handleManagedOutgoingMediaHttpRequest as c, prepareOutgoingMediaFromReplyPayload as d, readManagedOutgoingImageThumbnail as f, resolveManagedOutgoingMediaUrlDownload as g, resolveManagedOutgoingMediaArtifactDownload as h, attachManagedOutgoingMediaToMessage as i, parseManagedOutgoingArtifactId as l, resolveManagedImageAttachmentLimits as m, MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX as n, cleanupManagedOutgoingMediaRecords as o, removeManagedOutgoingMediaBlocks as p, MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX as r, createManagedOutgoingMediaBlocks as s, DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS as t, parseManagedOutgoingRoute as u };
