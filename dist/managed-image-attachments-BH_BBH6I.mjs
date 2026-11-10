import { I as resolveTimestampMsToIsoString, l as asNonNegativeFiniteNumber, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { h as readLocalFileSafely, u as openLocalFileSafely } from "./fs-safe-6Z4UiMS4.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-De2aQ55s.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { a as maxBytesForKind, o as mediaKindFromMime } from "./constants-GzjKtFvA.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-C3j3dfQb.mjs";
import { i as iterateSessionTranscriptSourcePages, t as SOURCE_PAGE_MAX_BYTES } from "./session-transcript-source-pages-DzseyJB5.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { s as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
import { s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import "./config-B3oiWDlr.mjs";
import { a as getRemoteControlUiIngressContext } from "./ingress-attribution-CP_2XS9r.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-B41MzEkm.mjs";
import { d as sendMethodNotAllowed, f as sendMissingScopeForbidden, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import "./media-services-B_p88lUH.mjs";
import { h as createImageProcessor, s as getImageMetadata } from "./image-ops-DM5GUpDi.mjs";
import { i as withChannelReadAuthority, n as captureChannelReadScope } from "./channel-read-authority-DeXfvJjt.mjs";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { t as resolveLocalMediaPath } from "./local-media-path-CHGj9vZy.mjs";
import { f as saveMediaBuffer, m as saveMediaSource, s as getMediaDir, t as MEDIA_MAX_BYTES } from "./store-BOkrav0N.mjs";
import { o as resolveLocalMediaRoots, r as assertLocalMediaAllowed } from "./local-media-access-D8o0XeaK.mjs";
import { t as WEBCHAT_LOCAL_MEDIA_MAX_BYTES } from "./configured-max-bytes-BaCve0jk.mjs";
import { f as readSessionMessagesWithSourceAsync, u as readSessionMessagesMatchingIdAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { s as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-BfVLAorZ.mjs";
import { t as unlinkIfExists } from "./temp-files-C2l3bgiy.mjs";
import { c as listManagedImageRecordEntries, l as readManagedImageRecord, n as attachManagedImageRecordsToMessage, r as captureManagedImageContext, s as listManagedImageOriginalMediaIds, t as MANAGED_OUTGOING_ORIGINALS_SUBDIR } from "./managed-image-record-store-bCbJK0yf.mjs";
import { i as resolvePlaybackTranscode, n as replacePlaybackFileExtension, r as resolvePlaybackMetadataForSource, t as PlaybackInspectionBusyError } from "./playback-transcode-5Dvqn6Gd.mjs";
import { n as buildManagedMediaContentDisposition } from "./assistant-media-content-disposition-wN2bcgk6.mjs";
import { i as writeByteHeaders, n as createImmutableFileValidators, r as resolveByteResponse, t as createGatewayByteStream } from "./http-byte-range-Dn3lj8O7.mjs";
import { l as resolveOpenAiCompatibleHttpSenderIsOwner, r as authorizeGatewayHttpRequestOrReply, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-DvoR_YDD.mjs";
import "./http-utils-C7PagBsR.mjs";
import { n as insertManagedImageRecordWithFile, r as resolveManagedImageOriginalPath, t as deleteManagedImageRecordArtifacts } from "./managed-image-attachments.custody-BWJ0HX-o.mjs";
import { n as resolveManagedImageThumbnail, t as encodeImageThumbnail } from "./managed-image-thumbnail-cache-C884K5d5.mjs";
import { a as buildOutgoingVariantUrl, i as buildManagedOutgoingArtifactId, o as parseManagedOutgoingArtifactId, t as MANAGED_OUTGOING_ATTACHMENT_ID_RE } from "./managed-outgoing-artifact-id-Ba11Ib46.mjs";
import { t as prepareRemoteIngressSessionRead } from "./remote-ingress-session-read-DHaxwFZQ.mjs";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
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
	const incognitoScope = {
		agentId,
		sessionKey: normalizeSessionKeyPreservingOpaquePeerIds(sessionKey),
		storePath: cfg.session?.store,
		env: {
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		}
	};
	if (isIncognitoSessionKey(incognitoScope.sessionKey)) {
		const assertCurrent = params.assertCurrent;
		return await withSessionActorStorage(incognitoScope, {
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			authority: {
				assertCurrent,
				authorize: assertCurrent
			}
		}, (binding) => {
			const entry = binding.actor.snapshot(binding.authority)?.entry;
			if (!entry) return null;
			return consume({
				...incognitoScope,
				storePath: binding.path,
				sessionEntry: entry,
				sessionId: entry.sessionId
			}, () => {
				const current = binding.actor.snapshot(binding.authority)?.entry;
				if (current?.sessionId !== entry.sessionId || current?.lifecycleRevision !== entry.lifecycleRevision) throw new Error("Managed media session authority changed");
			});
		}) ?? null;
	}
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
		if (!source?.result.available) return params.unavailable ?? null;
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
					if (params.unavailable !== void 0 || extractErrorCode(error) === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED" || error instanceof SessionMetadataUnavailableError && error.reason === "schema-missing") return params.unavailable ?? null;
					throw error;
				}
				if (exact.sharing) identities.set(database.path, exact.sharing.databaseIdentity);
				assertCurrent();
				if (exact.sharing?.placeholders.length) return params.unavailable ?? null;
				let entry = exact.entries[0]?.entry;
				if (!entry) {
					const read = await reader.readEntryResult({ scope }).catch((error) => {
						if (params.unavailable !== void 0) return;
						throw error;
					});
					assertCurrent();
					if (!read?.ok) return params.unavailable ?? null;
					entry = read.value;
				}
				if (entry) {
					if (matched) return params.unavailable ?? null;
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
				const read = await reader.readEntryResult({ scope }).catch((error) => {
					if (params.unavailable !== void 0) return;
					throw error;
				});
				const assertFallbackCurrent = () => {
					assertCurrent();
					reader.assertCurrent();
				};
				assertFallbackCurrent();
				if (!read?.ok) return params.unavailable ?? null;
				if (!read.value) return null;
				return consume({
					...scope,
					sessionKey,
					sessionId: read.value.sessionId,
					sessionEntry: read.value
				}, assertFallbackCurrent);
			});
		});
	}, assertSelectionCurrent).catch((error) => {
		if (params.unavailable !== void 0 && (error instanceof SessionMetadataUnavailableError || extractErrorCode(error) === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED")) return params.unavailable;
		throw error;
	});
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
const EMPTY_MANAGED_ATTACHMENT_REFS = [];
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
async function cleanupManagedOutgoingMediaRecords(params) {
	const stateDir = params?.stateDir ?? resolveStateDir();
	const nowMs = params?.nowMs ?? Date.now();
	const transientMaxAgeMs = params?.transientMaxAgeMs ?? DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS;
	const sessionKeyFilter = params?.sessionKey ?? null;
	const agentIdFilter = params?.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const globalCompatibilityOwnerAgentId = sessionKeyFilter === "global" && agentIdFilter ? tryResolveSessionCompatibilityOwnerAgentId(readRuntimeConfig(), "global") : void 0;
	const forceDeleteSessionRecords = params?.forceDeleteSessionRecords === true;
	const entries = await listManagedImageRecordEntries({ stateDir });
	let pendingPreparedAttachmentIds;
	let deletedRecordCount = 0;
	let deletedFileCount = 0;
	let retainedCount = 0;
	const transcriptAttachmentIndexCache = /* @__PURE__ */ new Map();
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
		else if (!entry.cleanupPending && record.messageId) shouldDelete = await recordMatchesTranscriptMessage(record, transcriptAttachmentIndexCache, stateDir) === "missing";
		else if (!entry.cleanupPending) {
			const createdAtMs = Date.parse(record.createdAt);
			if (Number.isFinite(createdAtMs) && nowMs - createdAtMs >= transientMaxAgeMs && params?.hasActiveSessionRun?.(record.sessionKey, record.agentId?.trim() || void 0) !== true) {
				if (pendingPreparedAttachmentIds === void 0) pendingPreparedAttachmentIds = await loadPendingPreparedAttachmentIds(stateDir);
				shouldDelete = pendingPreparedAttachmentIds !== null && !pendingPreparedAttachmentIds.has(record.attachmentId);
			}
		}
		const deleted = shouldDelete ? await deleteManagedImageRecordArtifacts(record, stateDir, entry.cleanupPending) : void 0;
		if (deleted?.deletedRecord) {
			deletedRecordCount += 1;
			deletedFileCount += deleted.deletedFileCount;
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
	if (!blocks) return EMPTY_MANAGED_ATTACHMENT_REFS;
	let refs;
	for (const block of blocks) {
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
			(refs ??= /* @__PURE__ */ new Map()).set(parsed.attachmentId, parsed);
		}
	}
	return refs ? [...refs.values()] : EMPTY_MANAGED_ATTACHMENT_REFS;
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
async function recordMatchesTranscriptMessage(record, cache, stateDir) {
	if (!record.messageId) return "missing";
	const { sessionKey, agentId, messageId: requestedMessageId } = record;
	const refKey = buildManagedOutgoingAttachmentRefKey(requestedMessageId, record.attachmentId);
	const cacheKey = sessionKey === "global" && agentId ? `agent:${agentId}:global` : sessionKey;
	if (cache.has(cacheKey)) {
		const index = cache.get(cacheKey);
		return index === null ? "unavailable" : index?.has(refKey) ? "match" : "missing";
	}
	const cfg = readRuntimeConfig();
	const ownerAgentId = resolveManagedSessionOwnerAgentId(sessionKey, agentId) ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
	if (!ownerAgentId) return "unavailable";
	const result = await withManagedImageSessionRead({
		cfg,
		agentId: ownerAgentId,
		sessionKey,
		stateDir,
		assertCurrent: captureChannelReadScope()?.assertCurrent ?? (() => {}),
		unavailable: "unavailable"
	}, async (scope, assertCurrent) => {
		const index = await readManagedOutgoingAttachmentIndex(scope);
		assertCurrent();
		cache.set(cacheKey, index);
		return index === null ? "unavailable" : index.has(refKey) ? "match" : "missing";
	});
	if (result === null) cache.set(cacheKey, /* @__PURE__ */ new Set());
	return result ?? "missing";
}
async function readManagedOutgoingAttachmentIndex(scope) {
	const pages = iterateSessionTranscriptSourcePages(readSessionMessagesWithSourceAsync, scope, {
		allowResetArchiveFallback: true,
		includeOffPathMessages: true
	});
	const index = /* @__PURE__ */ new Set();
	try {
		for await (const { messages } of pages) for (const message of messages) {
			const messageId = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.id;
			if (typeof messageId !== "string" || !messageId) continue;
			for (const ref of collectManagedOutgoingAttachmentRefs(readAssistantDisplayContent(message), scope.sessionKey)) index.add(buildManagedOutgoingAttachmentRefKey(messageId, ref.attachmentId));
		}
	} catch (error) {
		if (extractErrorCode(error) !== "TRANSCRIPT_SOURCE_MESSAGE_TOO_LARGE") throw error;
		createSubsystemLogger("media").warn(`Retaining managed outgoing media for a session whose transcript exceeds the ${SOURCE_PAGE_MAX_BYTES}-byte page limit`);
		return null;
	}
	return index;
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
	const cfg = readRuntimeConfig();
	const agentId = resolveManagedSessionOwnerAgentId(record.sessionKey, record.agentId) ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, record.sessionKey);
	if (!agentId) return null;
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
async function resolveManagedOutgoingMediaArtifactRecord(params) {
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
	return record;
}
/** Resolve one transcript-backed media artifact to a short-lived HTTP capability. */
async function resolveManagedOutgoingMediaArtifactDownload(params) {
	const record = await resolveManagedOutgoingMediaArtifactRecord(params);
	return record ? resolveManagedOutgoingMediaArtifactDownloadForRecord(record, params.stateDir) : null;
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
	const { maxBytes, signal } = params;
	const stateDir = params.stateDir ?? resolveStateDir();
	signal.throwIfAborted();
	const record = await resolveManagedOutgoingMediaArtifactRecord({
		...params,
		stateDir
	});
	signal.throwIfAborted();
	if (!record || resolveManagedMediaKind(record.original.contentType) !== "image") return null;
	return await withManagedOutgoingMediaRead(record, stateDir, async (assertCurrent) => {
		const opened = await openLocalFileSafely({ filePath: resolveManagedImageOriginalPath(record) });
		try {
			const thumbnail = await readManagedImageThumbnailFromFile(opened, maxBytes);
			assertCurrent();
			signal.throwIfAborted();
			return thumbnail;
		} finally {
			await opened.handle.close();
		}
	}, () => signal.throwIfAborted());
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
		const discardBlocks = () => removeManagedOutgoingMediaBlocks({
			blocks,
			messageId: params.messageId ?? null,
			stateDir
		}, context);
		let resolvedLocalRoots;
		for (const [index, item] of items.entries()) {
			const groupStart = blocks.length;
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
					const originalBuffer = parsedDataUrl ? parsedDataUrl.buffer : (await readLocalFileSafely({ filePath: savedOriginal.path })).buffer;
					assertManagedMediaByteLimit(originalBuffer.byteLength, "image", label, limits.maxBytes);
					const metadata = await getImageMetadata(originalBuffer);
					originalStats = {
						width: metadata?.width ?? null,
						height: metadata?.height ?? null,
						sizeBytes: savedOriginal.size
					};
					const metadataLimitError = getManagedImageMetadataLimitError(metadata, label, limits);
					if (metadataLimitError) {
						if (!metadata) throw createManagedImageAttachmentError(metadataLimitError);
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
						const resizedLimitError = getManagedImageMetadataLimitError(resized, label, limits);
						if (resizedLimitError) throw createManagedImageAttachmentError(resizedLimitError);
						assertManagedMediaByteLimit(resized.data.byteLength, "image", label, limits.maxBytes);
						const replacement = await saveMediaBuffer(resized.data, resized.mimeType, "outgoing/originals", limits.maxBytes, toRecordFilename(savedOriginal.path) ?? `generated-image-${index + 1}`);
						await unlinkIfExists(savedOriginal.path);
						savedOriginal = replacement;
						savedOriginalContentType = replacement.contentType ?? resized.mimeType;
						savedOriginalPath = savedOriginal.path;
						originalStats = {
							width: resized.width,
							height: resized.height,
							sizeBytes: replacement.size
						};
						resizeWarning = {
							type: "text",
							text: `[Image warning] ${label} exceeded gateway dimension/pixel limits and was resized from ${metadata.width}×${metadata.height} to ${resized.width}×${resized.height}.`
						};
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
							sourceStat: {
								size: opened.stat.size,
								mtimeMs: opened.stat.mtimeMs,
								ctimeMs: opened.stat.ctimeMs,
								exactIdentity: opened.exactIdentity
							},
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
					await discardBlocks();
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
					params.onPrepared?.(item, blocks.slice(groupStart));
					continue;
				}
				await discardBlocks();
				throw sanitizedError;
			}
			params.onPrepared?.(item, blocks.slice(groupStart));
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
	const respondNotFound = () => {
		sendStatus(res, 404, "not found");
		return true;
	};
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const encodedSessionKey = match[1];
	const attachmentId = match[2];
	const variant = match[3];
	if (!encodedSessionKey || !attachmentId || variant !== "full" && variant !== "thumbnail") return false;
	if (!MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(attachmentId)) return respondNotFound();
	let sessionKey;
	try {
		sessionKey = decodeURIComponent(encodedSessionKey);
	} catch {
		return respondNotFound();
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
			respondNotFound();
			throw new Error("Managed media ticket expired during retrieval");
		}
	};
	const stateDir = opts.stateDir ?? resolveStateDir();
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const ingressRead = _usingCtx$1.u(await prepareRemoteIngressSessionRead(getRemoteControlUiIngressContext(req)?.resolvePrincipal(), sessionKey));
			const assertRequest = assertRequestCurrent;
			assertRequestCurrent = () => {
				assertRequest?.();
				ingressRead.assertCurrent();
			};
			const record = await readManagedImageRecord(attachmentId, stateDir);
			assertCallerCurrent();
			if (!record || record.sessionKey !== sessionKey) return respondNotFound();
			if (await withManagedOutgoingMediaRead(record, stateDir, async (assertCurrent) => {
				const mediaKind = resolveManagedMediaKind(record.original.contentType);
				if (!mediaKind) return respondNotFound();
				let opened;
				try {
					opened = await openLocalFileSafely({ filePath: resolveManagedImageOriginalPath(record) });
				} catch {
					return respondNotFound();
				}
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
							sourceStat: {
								size: opened.stat.size,
								mtimeMs: opened.stat.mtimeMs,
								ctimeMs: opened.stat.ctimeMs,
								exactIdentity: opened.exactIdentity
							},
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
				respondNotFound();
			}
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} catch (error) {
		if (!res.writableEnded && !res.destroyed) throw error;
	}
	return true;
}
//#endregion
export { createManagedOutgoingMediaBlocks as a, prepareOutgoingMediaFromReplyPayload as c, resolveManagedOutgoingMediaArtifactDownload as d, resolveManagedOutgoingMediaUrlDownload as f, cleanupManagedOutgoingMediaRecords as i, readManagedOutgoingImageThumbnail as l, attachManagedOutgoingMediaToMessage as n, handleManagedOutgoingMediaHttpRequest as o, buildManagedMediaFailureBlock as r, parseManagedOutgoingRoute as s, DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS as t, removeManagedOutgoingMediaBlocks as u };
