import { I as resolveTimestampMsToIsoString, l as asNonNegativeFiniteNumber, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as readLocalFileSafely, u as openLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { a as maxBytesForKind, o as mediaKindFromMime } from "./constants-GzjKtFvA.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-Ce3gllsX.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-CGDYrRzL.mjs";
import "./media-services-BkfwjOhK.mjs";
import { m as createImageProcessor, o as getImageMetadata } from "./image-ops-D7Ua5lUp.mjs";
import { c as captureSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { c as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { u as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-BrMPjfvW.mjs";
import { y as prepareSessionStoreTargetInventoryRead } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { o as resolveExistingAgentSessionStoreTargetsReadOnlyResult, r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { t as loadExactSessionEntryReadOnlyResult } from "./session-accessor.sqlite-entry-availability-GjNU-pZO.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { i as withChannelReadAuthority, n as captureChannelReadScope } from "./channel-read-authority-CyorchNP.mjs";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import "./delivery-queue-sqlite-CZH3GILC.mjs";
import { t as resolveLocalMediaPath } from "./local-media-path-DneQarct.mjs";
import { f as saveMediaBuffer, m as saveMediaSource, s as getMediaDir, t as MEDIA_MAX_BYTES } from "./store-A0dMc8iV.mjs";
import { o as resolveLocalMediaRoots, r as assertLocalMediaAllowed } from "./local-media-access-BBHmTniP.mjs";
import { t as WEBCHAT_LOCAL_MEDIA_MAX_BYTES } from "./configured-max-bytes-CtwRSse3.mjs";
import { c as readSessionMessagesMatchingIdAsync, u as readSessionMessagesWithSourceAsync } from "./session-transcript-readers-CDyCeaj9.mjs";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-rherQwwt.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-BX-eWQU_.mjs";
import { t as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-Dc1i92s7.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as unlinkIfExists } from "./temp-files-BXB-NNDY.mjs";
import { d as sendMethodNotAllowed, f as sendMissingScopeForbidden, u as sendJson } from "./http-common-DJ7rKVvj.mjs";
import { a as deleteClaimedManagedImageRecord, c as listManagedImageRecordEntries, i as claimManagedImageRecordCleanupIfCurrent, l as readManagedImageRecord, n as attachManagedImageRecordsToMessage, o as insertManagedImageRecord, r as captureManagedImageContext, s as listManagedImageOriginalMediaIds, t as MANAGED_OUTGOING_ORIGINALS_SUBDIR } from "./managed-image-record-store-DQdkYONY.mjs";
import { i as resolvePlaybackTranscode, n as replacePlaybackFileExtension, r as resolvePlaybackMetadataForSource, t as PlaybackInspectionBusyError } from "./playback-transcode-C-N3hhLf.mjs";
import { n as buildManagedMediaContentDisposition } from "./assistant-media-content-disposition-B3NSqIRL.mjs";
import { i as writeByteHeaders, n as createImmutableFileValidators, r as resolveByteResponse, t as createGatewayByteStream } from "./http-byte-range-3Zwag20C.mjs";
import { l as resolveOpenAiCompatibleHttpSenderIsOwner, r as authorizeGatewayHttpRequestOrReply, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-Bk1YwS0V.mjs";
import "./http-utils-yY7ta13a.mjs";
import { n as resolveManagedImageThumbnail, t as encodeImageThumbnail } from "./managed-image-thumbnail-cache-zJv36Ylu.mjs";
import { a as buildOutgoingVariantUrl, i as buildManagedOutgoingArtifactId, o as parseManagedOutgoingArtifactId, t as MANAGED_OUTGOING_ATTACHMENT_ID_RE } from "./managed-outgoing-artifact-id-Ba11Ib46.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
//#region src/gateway/managed-image-attachments.custody.ts
function resolveManagedImageOriginalPath(record) {
	if (!path.isAbsolute(record.original.mediaRoot) || record.original.mediaSubdir !== "outgoing/originals" || !record.original.mediaId || record.original.mediaId.includes("/") || record.original.mediaId.includes("\\") || record.original.mediaId.includes("\0")) throw new Error("Managed image record has an unsafe media identity");
	return path.join(record.original.mediaRoot, record.original.mediaSubdir, record.original.mediaId);
}
async function deleteManagedImageRecordArtifacts(record, stateDir = resolveStateDir(), alreadyClaimed = false, context = captureManagedImageContext(stateDir)) {
	if (!alreadyClaimed && !await claimManagedImageRecordCleanupIfCurrent(record, stateDir, context)) return {
		deletedRecord: false,
		deletedFileCount: 0
	};
	context.admission.assertCurrent();
	try {
		await fs.rm(resolveManagedImageOriginalPath(record), { force: true });
	} catch {
		return {
			deletedRecord: false,
			deletedFileCount: 0
		};
	}
	return {
		deletedRecord: await deleteClaimedManagedImageRecord(record, stateDir, context),
		deletedFileCount: 1
	};
}
async function insertManagedImageRecordWithFile(record, originalPath, stateDir, context) {
	const readScope = captureChannelReadScope();
	let settlement;
	if (readScope && !readScope.delegateResource(originalPath, (accepted, settleFile) => settlement ??= (async () => {
		try {
			await insertion;
		} catch (error) {
			await settleFile(hasSqliteWorkerOutcomeUnknown(error));
			return;
		}
		if (accepted) {
			await settleFile(true);
			return;
		}
		let claimed = false;
		try {
			const applied = await claimManagedImageRecordCleanupIfCurrent(record, stateDir, context);
			context.admission.assertCurrent();
			claimed = applied;
		} finally {
			await settleFile(!claimed);
		}
		if (claimed) try {
			await fs.lstat(originalPath);
		} catch (error) {
			if (error instanceof Error && "code" in error && error.code === "ENOENT") {
				await deleteClaimedManagedImageRecord(record, stateDir, context);
				return;
			}
			throw error;
		}
	})(), context.admission.assertCurrent)) throw new Error("Managed media has no retained file resource");
	const insertion = insertManagedImageRecord(record, stateDir, context);
	await insertion;
}
//#endregion
//#region src/gateway/managed-image-attachments.media-kind.ts
function maxBytesForManagedMediaKind(kind, imageMaxBytes, local = false) {
	return kind === "image" ? imageMaxBytes : local && (kind === "audio" || kind === "video") ? WEBCHAT_LOCAL_MEDIA_MAX_BYTES : maxBytesForKind(kind);
}
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
function formatLimitMiB(bytes) {
	if (bytes < 1048576) return `${bytes} bytes`;
	return Number.isInteger(bytes / 1048576) ? `${bytes / 1048576} MiB` : `${(bytes / 1048576).toFixed(1)} MiB`;
}
//#endregion
//#region src/gateway/managed-image-session-read.ts
/** Serving keeps discovery and physical readers alive through response publication. */
async function withManagedImageSessionRead(params, consume) {
	const { cfg, sessionKey, agentId, stateDir } = params;
	params.assertCurrent();
	const { candidates, ...prepared } = prepareSessionStoreTargetInventory(cfg, [agentId], {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	});
	const inventoryRead = prepareSessionStoreTargetInventoryRead({
		...prepared,
		candidates
	});
	const assertSelectionCurrent = () => {
		params.assertCurrent();
		for (const candidate of candidates) if (captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath !== candidate.physicalPath) throw new Error("Managed media session store changed during read");
	};
	return inventoryRead.withRead(async (inventory, assertDiscoveryCurrent) => {
		const source = inventory.agents[0];
		if (!source?.result.available) return null;
		return withSessionHistoryWorkerDatabases(source.reads.map(({ database }) => ({
			...database,
			env: prepared.env
		})), async (readers) => {
			const identities = /* @__PURE__ */ new Map();
			const assertCurrent = () => {
				assertDiscoveryCurrent();
				for (const reader of readers) reader.assertCurrent();
				for (const [pathname, identity] of identities) assertExistingDatabaseIdentity(pathname, identity);
			};
			let matched;
			for (const [index, { database }] of source.reads.entries()) {
				const scope = {
					agentId,
					databaseAgentId: database.agentId,
					storePath: database.path,
					env: prepared.env,
					sessionKey
				};
				const reader = readers[index];
				let exact;
				try {
					exact = await reader.readExactEntries({
						sessionKeys: [sessionKey],
						projection: "sharing",
						env: prepared.env
					});
				} catch (error) {
					assertCurrent();
					if (extractErrorCode(error) === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED" || error instanceof SessionMetadataUnavailableError && error.reason === "schema-missing") return null;
					throw error;
				}
				if (exact.sharing) identities.set(database.path, exact.sharing.databaseIdentity);
				assertCurrent();
				if (exact.sharing?.placeholders.length) return null;
				let entry = exact.entries[0]?.entry;
				if (!entry) {
					const read = await reader.readEntryResult({ scope });
					assertCurrent();
					if (!read.ok) return null;
					entry = read.value;
				}
				if (entry) {
					if (matched) return null;
					matched = {
						...scope,
						sessionEntry: entry,
						sessionId: entry.sessionId
					};
				}
			}
			if (matched) return consume(matched, assertCurrent);
			if (path.resolve(stateDir) !== path.resolve(resolveStateDir())) return null;
			const fallback = await resolveGatewaySessionStoreTargetInWorker({
				cfg: prepared.config,
				key: sessionKey,
				agentId,
				env: prepared.env,
				assertActive: assertCurrent
			});
			assertCurrent();
			if (!fallback.readSource) return null;
			const database = fallback.readSource;
			return withSessionHistoryWorkerDatabases([{
				...database,
				env: prepared.env
			}], async ([reader]) => {
				const scope = {
					agentId,
					databaseAgentId: database.agentId,
					sessionKey: fallback.canonicalKey,
					storePath: database.path,
					env: prepared.env
				};
				const read = await reader.readEntryResult({ scope });
				const assertFallbackCurrent = () => {
					assertCurrent();
					reader.assertCurrent();
				};
				assertFallbackCurrent();
				if (!read.ok || !read.value) return null;
				return consume({
					...scope,
					sessionKey,
					sessionId: read.value.sessionId,
					sessionEntry: read.value
				}, assertFallbackCurrent);
			});
		});
	}, assertSelectionCurrent);
}
//#endregion
//#region src/gateway/managed-image-tickets.ts
const MANAGED_OUTGOING_IMAGE_TICKET_SCOPE = "managed-outgoing-image";
const MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS = 3e5;
const managedOutgoingImageTicketSecret = randomBytes(32);
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
		const payload = asOptionalRecord(JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")));
		return payload?.scope === MANAGED_OUTGOING_IMAGE_TICKET_SCOPE && payload.sessionKey === params.sessionKey && payload.attachmentId === params.attachmentId && payload.variant === "full" && typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp >= now;
	} catch {
		return false;
	}
}
//#endregion
//#region src/gateway/managed-image-attachments.ts
const DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS = 9e5;
const DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS = {
	maxBytes: 12582912,
	maxWidth: 4096,
	maxHeight: 4096,
	maxPixels: 2e7
};
function resolveManagedImageAttachmentLimits(config) {
	return {
		maxBytes: config?.maxBytes ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxBytes,
		maxWidth: config?.maxWidth ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxWidth,
		maxHeight: config?.maxHeight ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxHeight,
		maxPixels: config?.maxPixels ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxPixels
	};
}
function createManagedImageAttachmentError(message) {
	const error = new Error(message);
	error.name = "ManagedImageAttachmentError";
	return error;
}
function getSanitizedManagedImageAttachmentError(error, label, kind) {
	if (error instanceof Error && (error.name === "ManagedImageAttachmentError" || error.message.startsWith("Managed image attachment ") || error.message.startsWith("Invalid image data URL"))) return error;
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
function assertManagedMediaByteLimit(size, kind, label, maxBytes) {
	if (size > maxBytes) throw createManagedImageAttachmentError(`Managed ${kind} attachment ${JSON.stringify(label)} exceeds the ${formatLimitMiB(maxBytes)} byte limit`);
}
function getManagedImageMetadataLimitError(metadata, alt, limits) {
	if (!metadata) return `Managed image attachment ${JSON.stringify(alt)} is missing readable dimensions`;
	if (metadata.width > limits.maxWidth) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxWidth}px width limit`;
	if (metadata.height > limits.maxHeight) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxHeight}px height limit`;
	if (metadata.width * metadata.height > limits.maxPixels) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxPixels.toLocaleString("en-US")} pixel limit`;
	return null;
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
			if (!stat.isFile() || params.nowMs - stat.mtimeMs < params.minAgeMs) continue;
			await fs.rm(filePath, { force: true });
			deletedCount += 1;
		} catch {}
	}
	return deletedCount;
}
function deriveAltText(source, index) {
	const fallback = `Generated image ${index + 1}`;
	try {
		if (hasHttpUrlPrefix(source)) {
			const parsed = new URL(source);
			return path.basename(parsed.pathname || "").trim() || fallback;
		}
	} catch {}
	return path.basename(source).trim() || fallback;
}
function parseMediaDataUrl(source, label, imageLimits) {
	const trimmed = source.trim();
	if (!trimmed.startsWith("data:")) return;
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
	if (mediaKind !== "image" && mediaKind !== "audio" && mediaKind !== "video") throw new Error("Managed media attachment has an unsupported data URL content type");
	const maxBytes = maxBytesForManagedMediaKind(mediaKind, imageLimits.maxBytes);
	const base64 = base64Part.replace(/\s+/g, "");
	const padding = Math.min(/=+$/u.exec(base64)?.[0].length ?? 0, 2);
	assertManagedMediaByteLimit(Math.floor(base64.length * 3 / 4) - padding, mediaKind, label, maxBytes);
	return {
		buffer: Buffer.from(base64, "base64"),
		contentType,
		mediaKind
	};
}
async function getVariantStats(params) {
	const metadata = await getImageMetadata(params.buffer).catch(() => null);
	return {
		width: metadata?.width ?? null,
		height: metadata?.height ?? null,
		sizeBytes: Number.isFinite(params.sizeBytes) ? params.sizeBytes : null
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
		if (!entry.cleanupPending && forceDeleteSessionRecords) shouldDelete = true;
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
async function removeManagedOutgoingMediaBlocks(params, context) {
	const stateDir = params.stateDir ?? resolveStateDir();
	const messageId = params.messageId;
	const refs = collectManagedOutgoingAttachmentRefs(params.blocks);
	if (refs.length === 0) return;
	const captured = context ?? captureManagedImageContext(stateDir);
	await Promise.all(refs.map(async ({ attachmentId }) => {
		const record = await readManagedImageRecord(attachmentId, stateDir, captured);
		if (record?.messageId === messageId) {
			if (await captureChannelReadScope()?.discardResource(resolveManagedImageOriginalPath(record))) return;
			await deleteManagedImageRecordArtifacts(record, stateDir, false, captured);
		}
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
		const [, encodedSessionKey, attachmentId] = match;
		if (!encodedSessionKey || !attachmentId || !MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(attachmentId)) return null;
		return {
			sessionKey: decodeURIComponent(encodedSessionKey),
			attachmentId
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
			refs.set(parsed.attachmentId, parsed);
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
	const cacheKey = sessionKey === "global" && agentId ? `agent:${agentId}:global` : sessionKey;
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
	const { messages } = cache ? await readSessionMessagesWithSourceAsync(scope, {
		mode: "full",
		reason: "managed outgoing attachment index",
		allowResetArchiveFallback: true,
		includeOffPathMessages: true
	}) : { messages: await readSessionMessagesMatchingIdAsync(scope, requestedMessageId) };
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
	return withManagedOutgoingMediaRead(record, stateDir ?? resolveStateDir(), async (assertCurrent) => {
		const kind = resolveManagedMediaKind(record.original.contentType);
		if (!kind) return null;
		try {
			if (!(await fs.stat(resolveManagedImageOriginalPath(record))).isFile()) return null;
		} catch {
			return null;
		}
		assertCurrent();
		const ticket = createManagedOutgoingImageTicket({
			sessionKey: record.sessionKey,
			attachmentId: record.attachmentId
		});
		if (!ticket) return null;
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
	});
}
async function withManagedOutgoingMediaRead(record, stateDir, consume, assertCallerCurrent = captureChannelReadScope()?.assertCurrent ?? (() => {})) {
	assertCallerCurrent();
	if (!record.messageId) return null;
	const cfg = getRuntimeConfig();
	const agentId = resolveManagedSessionOwnerAgentId(record.sessionKey, record.agentId) ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, record.sessionKey);
	if (!agentId) return null;
	if (isIncognitoSessionKey(record.sessionKey) || cfg.session?.store && isIncognitoOpenClawAgentSqlitePath(cfg.session.store, {
		agentId,
		env: {
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		}
	})) {
		const match = await recordMatchesTranscriptMessage(record, void 0, void 0, void 0, stateDir);
		assertCallerCurrent();
		return match === "match" ? consume(assertCallerCurrent) : null;
	}
	return withManagedImageSessionRead({
		cfg,
		agentId,
		sessionKey: record.sessionKey,
		stateDir,
		assertCurrent: assertCallerCurrent
	}, async (scope, assertCurrent) => {
		const messages = await readSessionMessagesMatchingIdAsync(scope, record.messageId);
		assertCurrent();
		return messages.some((message) => collectManagedOutgoingAttachmentRefs(readAssistantDisplayContent(message), record.sessionKey).some((ref) => ref.attachmentId === record.attachmentId)) ? consume(assertCurrent) : null;
	});
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
	const cacheKey = `${opened.realPath}\0${opened.stat.mtimeMs}\0${opened.stat.size}`;
	return await resolveManagedImageThumbnail(cacheKey, async () => {
		const source = await opened.handle.readFile();
		if (maxBytes !== void 0 && source.byteLength > maxBytes) throw new Error("Managed image exceeds the preview byte limit");
		return await encodeImageThumbnail(source);
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
		return await withManagedOutgoingMediaRead(record, stateDir, async (assertCurrent) => {
			assertCurrent();
			signal.throwIfAborted();
			return thumbnail;
		}, () => signal.throwIfAborted());
	} finally {
		await opened.handle.close();
	}
}
function attachManagedOutgoingMediaToMessage(params) {
	const messageId = params.messageId.trim();
	const refs = collectManagedOutgoingAttachmentRefs(params.blocks);
	if (!messageId || refs.length === 0) return Promise.resolve(false);
	return attachManagedImageRecordsToMessage({
		attachments: refs,
		messageId,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		stateDir: params.stateDir
	});
}
async function createManagedOutgoingMediaBlocks(params) {
	return await withChannelReadAuthority(params.assertCurrent, async () => {
		const sessionKey = params.sessionKey.trim();
		if (!sessionKey) return [];
		const items = params.items ?? [];
		if (items.length === 0) return [];
		const stateDir = params.stateDir ?? resolveStateDir();
		const context = captureManagedImageContext(stateDir);
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
			const hintedKind = dataUrlKind === "image" || dataUrlKind === "audio" || dataUrlKind === "video" ? dataUrlKind : inferredKind ?? "media";
			let savedOriginalPath = null;
			let insertedRecord;
			try {
				params.assertCurrent?.();
				const parsedDataUrl = parseMediaDataUrl(mediaUrl, fallbackLabel, limits);
				if (localMediaPath && (hintedKind === "audio" || hintedKind === "video") && !item.trustedLocal) throw new Error("Local audio/video media requires an explicitly trusted reply payload");
				let resizeWarning = null;
				let savedOriginal = parsedDataUrl ? await saveMediaBuffer(parsedDataUrl.buffer, parsedDataUrl.contentType, "outgoing/originals", maxBytesForManagedMediaKind(parsedDataUrl.mediaKind, limits.maxBytes), `generated-${parsedDataUrl.mediaKind}-${index + 1}`) : await (async () => {
					if (localMediaPath) {
						const localRoots = params.localRoots;
						await assertLocalMediaAllowed(localMediaPath, localRoots, localRoots === "any" ? void 0 : { resolveRoots: async () => {
							resolvedLocalRoots ??= await resolveLocalMediaRoots(localRoots);
							return resolvedLocalRoots;
						} });
					}
					const ingestSource = localMediaPath ?? mediaUrl;
					const maxBytes = Math.max(limits.maxBytes, localMediaPath && (inferredKind === "audio" || inferredKind === "video") ? WEBCHAT_LOCAL_MEDIA_MAX_BYTES : 0, maxBytesForKind("audio"), maxBytesForKind("video"), maxBytesForKind("document"), MEDIA_MAX_BYTES);
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
				const maxBytes = maxBytesForManagedMediaKind(mediaKind, limits.maxBytes, Boolean(localMediaPath));
				assertManagedMediaByteLimit(savedOriginal.size, mediaKind, label, maxBytes);
				let originalStats = {
					width: null,
					height: null,
					sizeBytes: savedOriginal.size
				};
				if (mediaKind === "image") {
					let originalBuffer = parsedDataUrl ? parsedDataUrl.buffer : (await readLocalFileSafely({ filePath: savedOriginal.path })).buffer;
					assertManagedMediaByteLimit(originalBuffer.byteLength, "image", label, limits.maxBytes);
					let originalDisplayMetadata;
					for (let resizeAttempt = 0;; resizeAttempt += 1) {
						originalStats = await getVariantStats({
							buffer: originalBuffer,
							sizeBytes: savedOriginal.size
						});
						const effectiveMetadata = originalStats.width != null && originalStats.height != null ? {
							width: originalStats.width,
							height: originalStats.height
						} : await getImageMetadata(originalBuffer);
						const metadataLimitError = getManagedImageMetadataLimitError(effectiveMetadata, label, limits);
						if (!metadataLimitError) {
							if (originalDisplayMetadata && effectiveMetadata) resizeWarning = {
								type: "text",
								text: `[Image warning] ${label} exceeded gateway dimension/pixel limits and was resized from ${originalDisplayMetadata.width}×${originalDisplayMetadata.height} to ${effectiveMetadata.width}×${effectiveMetadata.height}.`
							};
							break;
						}
						if (!effectiveMetadata || resizeAttempt >= 3) throw createManagedImageAttachmentError(metadataLimitError);
						originalDisplayMetadata ??= effectiveMetadata;
						const resized = await createImageProcessor().encode(originalBuffer, {
							format: "auto",
							limits: {
								maxWidth: limits.maxWidth,
								maxHeight: limits.maxHeight,
								maxPixels: limits.maxPixels
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
						assertManagedMediaByteLimit(resized.data.byteLength, "image", label, limits.maxBytes);
						const replacement = await saveMediaBuffer(resized.data, resized.mimeType, "outgoing/originals", limits.maxBytes, toRecordFilename(savedOriginal.path) ?? `generated-image-${index + 1}`);
						await unlinkIfExists(savedOriginal.path);
						savedOriginal = replacement;
						savedOriginalContentType = replacement.contentType ?? resized.mimeType;
						savedOriginalPath = savedOriginal.path;
						originalBuffer = resized.data;
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
					await opened[Symbol.asyncDispose]();
					try {
						playback = (await resolvePlaybackMetadataForSource({
							sourcePath: opened.realPath,
							sourceStat: opened.stat,
							mimeType: savedOriginalContentType,
							kind: mediaKind,
							signal: params.abortSignal,
							assertCurrent: params.assertCurrent,
							admission: "immediate"
						})).playback;
					} catch (error) {
						if (!(error instanceof PlaybackInspectionBusyError)) throw error;
					}
				}
				const block = buildManagedMediaBlock(record, playback);
				await insertManagedImageRecordWithFile(record, savedOriginal.path, stateDir, context);
				insertedRecord = record;
				context.admission.assertCurrent();
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
				if (savedOriginalPath) {
					if (captureChannelReadScope()) await unlinkIfExists(savedOriginalPath);
					else if (insertedRecord) await deleteManagedImageRecordArtifacts(insertedRecord, stateDir, false, context);
					else if (!hasSqliteWorkerOutcomeUnknown(error)) await unlinkIfExists(savedOriginalPath);
				}
				try {
					params.assertCurrent?.();
				} catch (authorityError) {
					await removeManagedOutgoingMediaBlocks({
						blocks,
						messageId: params.messageId ?? null,
						stateDir
					}, context);
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
				}, context);
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
	let assertRequestCurrent;
	if (!hasValidMediaTicket) {
		const requestAuth = await authorizeGatewayHttpRequestOrReply({
			...opts,
			req,
			res
		});
		if (!requestAuth) return true;
		assertRequestCurrent = requestAuth.assertCurrent;
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
	const assertCallerCurrent = () => {
		if (res.writableEnded || res.destroyed) throw new Error("Managed media request ended");
		assertRequestCurrent?.();
		if (hasValidMediaTicket && !verifyManagedOutgoingImageTicket({
			ticket: requestUrl.searchParams.get("mediaTicket"),
			sessionKey,
			attachmentId
		})) {
			sendStatus(res, 404, "not found");
			throw new Error("Managed media ticket expired during retrieval");
		}
	};
	const stateDir = opts.stateDir ?? resolveStateDir();
	try {
		const record = await readManagedImageRecord(attachmentId, stateDir);
		assertCallerCurrent();
		if (!record || record.sessionKey !== sessionKey) {
			sendStatus(res, 404, "not found");
			return true;
		}
		if (await withManagedOutgoingMediaRead(record, stateDir, async (assertCurrent) => {
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
			const immutableCacheControl = hasValidMediaTicket ? `private, max-age=300, immutable` : "private, max-age=31536000, immutable";
			const writeMediaHeaders = (contentType, filename, cacheControl = immutableCacheControl) => {
				res.setHeader("content-type", contentType);
				res.setHeader("x-content-type-options", "nosniff");
				res.setHeader("referrer-policy", "no-referrer");
				res.setHeader("cache-control", cacheControl);
				res.setHeader("content-disposition", buildManagedMediaContentDisposition(filename, contentType));
			};
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
					res.setHeader("content-length", String(thumbnail.byteLength));
					writeMediaHeaders("image/png", `${sourceName}-thumbnail.png`);
					res.end(req.method === "HEAD" ? void 0 : thumbnail);
					return true;
				}
				const isPlayback = requestUrl.searchParams.get("playback") === "1" && (mediaKind === "audio" || mediaKind === "video");
				if (isPlayback) {
					const playback = await resolvePlaybackTranscode({
						sourcePath: opened.realPath,
						sourceStat: opened.stat,
						mimeType: responseContentType,
						kind: mediaKind,
						signal: byteStream.signal,
						assertCurrent
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
					writeMediaHeaders(responseContentType, responseFilename, isPlayback ? "private, no-cache" : immutableCacheControl);
					writeByteHeaders(res, byteResponse);
				});
			} catch (error) {
				await byteStream.close();
				if (!res.writableEnded && !res.destroyed) throw error;
			}
			return true;
		}, assertCallerCurrent) === null) {
			assertCallerCurrent();
			sendStatus(res, 404, "not found");
		}
	} catch (error) {
		if (!res.writableEnded && !res.destroyed) throw error;
	}
	return true;
}
//#endregion
export { createManagedOutgoingMediaBlocks as a, prepareOutgoingMediaFromReplyPayload as c, resolveManagedOutgoingMediaArtifactDownload as d, resolveManagedOutgoingMediaUrlDownload as f, cleanupManagedOutgoingMediaRecords as i, readManagedOutgoingImageThumbnail as l, attachManagedOutgoingMediaToMessage as n, handleManagedOutgoingMediaHttpRequest as o, buildManagedMediaFailureBlock as r, parseManagedOutgoingRoute as s, DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS as t, removeManagedOutgoingMediaBlocks as u };
