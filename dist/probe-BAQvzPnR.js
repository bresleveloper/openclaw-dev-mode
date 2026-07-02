import { o as __toESM } from "./chunk-CNf5ZN-e.js";
import { a as normalizeLowercaseStringOrEmpty, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { m as isFutureDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { v as sleep } from "./utils-BApvfmPs.js";
import { u as isPrivateIpAddress } from "./ssrf-DmSIVBht.js";
import { i as getFileExtension, n as detectMime, r as extensionForMime } from "./mime-C8mVE2Bw.js";
import { o as extractOriginalFilename } from "./store-MjA3hYFB.js";
import { o as isSilentReplyText } from "./tokens-Zsy11rTo.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-CBQ2d2jT.js";
import { n as loadWebMedia } from "./web-media-DnX3imnL.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BDn00i4I.js";
import { a as resolveChannelMediaMaxBytes } from "./media-runtime-BGWQwoXi.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as convertMarkdownTables } from "./tables-CNojwOtD.js";
import "./text-chunking-nijjGL3g.js";
import "./text-utility-runtime-hurZUKRN.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-BlCHMd5G.js";
import "./reply-chunking-DDVYtWXI.js";
import "./channel-outbound-BNKGCEf1.js";
import "./web-media--IgHJT4v.js";
import { n as loadOutboundMediaFromUrl } from "./outbound-media-BtSFem1l.js";
import "./ssrf-policy-B35YwKq4.js";
import "./markdown-table-runtime-BLr9kTqt.js";
import { t as getMSTeamsRuntime } from "./runtime-6g-cPOGH.js";
import "./runtime-api-BtQeJPtO.js";
import { C as describeBotFrameworkServiceUrlHost, D as resolveMSTeamsSdkCloudOptions, O as validateMSTeamsProactiveServiceUrlBoundary, T as normalizeBotFrameworkServiceUrl, _ as readAccessToken, b as loadMSTeamsSdkWithAuth, h as resolveMSTeamsCredentials, m as loadDelegatedTokens, w as isAllowedBotFrameworkServiceUrl, x as buildUserAgent, y as createMSTeamsTokenProvider } from "./graph-users-D10geJYH.js";
import { c as createMSTeamsHttpError } from "./oauth.token-C7a0Cwo_.js";
import { i as resolveMSTeamsRouteConfig, r as resolveMSTeamsReplyPolicy } from "./policy-BE1U2kL5.js";
import { i as isRevokedProxyError, n as formatMSTeamsSendErrorHint, r as formatUnknownError, t as classifyMSTeamsSendError } from "./errors-D4RthstX.js";
import { C as toPluginJsonValue, S as resolveMSTeamsSqliteStateEnv, o as buildMSTeamsPollCard, v as createMSTeamsConversationStoreState, w as withMSTeamsSqliteMutationLock } from "./polls-A4UwmS-A.js";
import path from "node:path";
import crypto, { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
//#region extensions/msteams/src/file-consent.ts
/**
* FileConsentCard utilities for MS Teams large file uploads (>4MB) in personal chats.
*
* Teams requires user consent before the bot can upload large files. This module provides
* utilities for:
* - Building FileConsentCard attachments (to request upload permission)
* - Building FileInfoCard attachments (to confirm upload completion)
* - Parsing fileConsent/invoke activities
*/
/**
* Allowlist of domains that are valid targets for file consent uploads.
* These are the Microsoft/SharePoint domains that Teams legitimately provides
* as upload destinations in the FileConsentCard flow.
*/
const CONSENT_UPLOAD_HOST_ALLOWLIST = [
	"sharepoint.com",
	"sharepoint.us",
	"sharepoint.de",
	"sharepoint.cn",
	"sharepoint-df.com",
	"storage.live.com",
	"onedrive.com",
	"1drv.ms",
	"graph.microsoft.com",
	"graph.microsoft.us",
	"graph.microsoft.de",
	"graph.microsoft.cn"
];
/**
* Returns true if the given IPv4 or IPv6 address is private, internal, or
* special-use and must never be reached via consent uploads.
*/
const isPrivateOrReservedIP = isPrivateIpAddress;
/**
* Validate that a consent upload URL is safe to PUT to.
* Checks:
* 1. Protocol is HTTPS
* 2. Hostname matches the consent upload allowlist
* 3. Resolved IP is not in a private/reserved range (anti-SSRF)
*
* @throws Error if the URL fails validation
*/
async function validateConsentUploadUrl(url, opts) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error("Consent upload URL is not a valid URL");
	}
	if (parsed.protocol !== "https:") throw new Error(`Consent upload URL must use HTTPS, got ${parsed.protocol}`);
	const hostname = normalizeLowercaseStringOrEmpty(parsed.hostname);
	if (!(opts?.allowlist ?? CONSENT_UPLOAD_HOST_ALLOWLIST).some((entry) => hostname === entry || hostname.endsWith(`.${entry}`))) throw new Error(`Consent upload URL hostname "${hostname}" is not in the allowed domains`);
	const resolveFn = opts?.resolveFn ?? ((name) => lookup(name, { all: true }));
	let resolved;
	try {
		const result = await resolveFn(hostname);
		resolved = Array.isArray(result) ? result : [result];
	} catch {
		throw new Error(`Failed to resolve consent upload URL hostname "${hostname}"`);
	}
	for (const entry of resolved) if (isPrivateOrReservedIP(entry.address)) throw new Error(`Consent upload URL resolves to a private/reserved IP (${entry.address})`);
}
/**
* Build a FileConsentCard attachment for requesting upload permission.
* Use this for files >= 4MB in personal (1:1) chats.
*/
function buildFileConsentCard(params) {
	return {
		contentType: "application/vnd.microsoft.teams.card.file.consent",
		name: params.filename,
		content: {
			description: params.description ?? `File: ${params.filename}`,
			sizeInBytes: params.sizeInBytes,
			acceptContext: {
				filename: params.filename,
				...params.context
			},
			declineContext: {
				filename: params.filename,
				...params.context
			}
		}
	};
}
/**
* Build a FileInfoCard attachment for confirming upload completion.
* Send this after successfully uploading the file to the consent URL.
*/
function buildFileInfoCard(params) {
	return {
		contentType: "application/vnd.microsoft.teams.card.file.info",
		contentUrl: params.contentUrl,
		name: params.filename,
		content: {
			uniqueId: params.uniqueId,
			fileType: params.fileType
		}
	};
}
/**
* Parse a fileConsent/invoke activity.
* Returns null if the activity is not a file consent invoke.
*/
function parseFileConsentInvoke(activity) {
	if (activity.name !== "fileConsent/invoke") return null;
	const value = activity.value;
	if (value?.type !== "fileUpload") return null;
	return {
		action: value.action === "accept" ? "accept" : "decline",
		uploadInfo: value.uploadInfo,
		context: value.context
	};
}
/**
* Upload a file to the consent URL provided by Teams.
* The URL is provided in the fileConsent/invoke response after user accepts.
*
* @throws Error if the URL fails SSRF validation (non-HTTPS, disallowed host, private IP)
*/
async function uploadToConsentUrl(params) {
	await validateConsentUploadUrl(params.url, params.validationOpts);
	const res = await (params.fetchFn ?? fetch)(params.url, {
		method: "PUT",
		headers: {
			"User-Agent": buildUserAgent(),
			"Content-Type": params.contentType ?? "application/octet-stream",
			"Content-Range": `bytes 0-${params.buffer.length - 1}/${params.buffer.length}`
		},
		body: new Uint8Array(params.buffer)
	});
	if (!res.ok) throw new Error(`File upload to consent URL failed: ${res.status} ${res.statusText}`);
}
//#endregion
//#region extensions/msteams/src/pending-uploads-fs.ts
/** TTL for persisted pending uploads (matches in-memory store). */
const PENDING_UPLOAD_TTL_MS$1 = 300 * 1e3;
/** Cap to avoid unbounded growth if a process crashes mid-flow. */
const MAX_PENDING_UPLOADS = 100;
const MAX_CHUNKS_PER_UPLOAD = 3072;
const MAX_PENDING_UPLOAD_CHUNK_ROWS = 45e3;
const RAW_CHUNK_BYTES = 36 * 1024;
const PENDING_UPLOAD_META_MAX_ENTRIES = 200;
const PENDING_UPLOAD_META_NAMESPACE = "pending-uploads";
const PENDING_UPLOAD_CHUNKS_NAMESPACE = "pending-upload-chunks";
const PENDING_UPLOAD_LOCK_FILENAME = "msteams-pending-uploads.sqlite.lock";
function createMetaStore(options) {
	return getMSTeamsRuntime().state.openKeyedStore({
		namespace: PENDING_UPLOAD_META_NAMESPACE,
		maxEntries: PENDING_UPLOAD_META_MAX_ENTRIES,
		env: resolveMSTeamsSqliteStateEnv(options)
	});
}
function createChunkStore(options) {
	return getMSTeamsRuntime().state.openKeyedStore({
		namespace: PENDING_UPLOAD_CHUNKS_NAMESPACE,
		maxEntries: MAX_PENDING_UPLOAD_CHUNK_ROWS,
		env: resolveMSTeamsSqliteStateEnv(options)
	});
}
function buildUploadKey(id) {
	return `upload:${createHash("sha256").update(id).digest("hex")}`;
}
function buildMetaKey(id) {
	return `${buildUploadKey(id)}:meta`;
}
function buildChunkKey(id, index) {
	return `${buildUploadKey(id)}:chunk:${String(index).padStart(4, "0")}`;
}
function recordToUpload(record, buffer) {
	return {
		id: record.id,
		buffer,
		filename: record.filename,
		contentType: record.contentType,
		conversationId: record.conversationId,
		consentCardActivityId: record.consentCardActivityId,
		createdAt: record.createdAt
	};
}
async function deleteUploadRows(id, metaStore, chunkStore) {
	const existing = await metaStore.lookup(buildMetaKey(id));
	await metaStore.delete(buildMetaKey(id));
	if (!existing) return;
	const chunkCount = existing.chunkCount;
	for (let index = 0; index < chunkCount; index += 1) await chunkStore.delete(buildChunkKey(id, index));
}
async function registerUploadRows(record, metaStore, chunkStore, ttlMs, overwrite) {
	const buffer = Buffer.from(record.bufferBase64, "base64");
	const chunkCount = Math.max(1, Math.ceil(buffer.byteLength / RAW_CHUNK_BYTES));
	if (chunkCount > MAX_CHUNKS_PER_UPLOAD) throw new Error(`Microsoft Teams pending upload ${record.id} exceeds SQLite chunk limit (${chunkCount}/${MAX_CHUNKS_PER_UPLOAD})`);
	if (overwrite) await deleteUploadRows(record.id, metaStore, chunkStore);
	else if (await metaStore.lookup(buildMetaKey(record.id))) return;
	await pruneUploadStore(metaStore, chunkStore, ttlMs, chunkCount);
	for (let index = 0; index < chunkCount; index += 1) {
		const chunk = buffer.subarray(index * RAW_CHUNK_BYTES, (index + 1) * RAW_CHUNK_BYTES);
		await chunkStore.register(buildChunkKey(record.id, index), toPluginJsonValue({
			id: record.id,
			index,
			dataBase64: chunk.toString("base64")
		}));
	}
	await metaStore.register(buildMetaKey(record.id), toPluginJsonValue({
		id: record.id,
		filename: record.filename,
		contentType: record.contentType,
		conversationId: record.conversationId,
		consentCardActivityId: record.consentCardActivityId,
		createdAt: record.createdAt,
		chunkCount,
		byteLength: buffer.byteLength
	}));
}
async function withPendingUploadLock(options, run) {
	return await withMSTeamsSqliteMutationLock(options, PENDING_UPLOAD_LOCK_FILENAME, run);
}
async function readUploadRows(id, metaStore, chunkStore) {
	const meta = await metaStore.lookup(buildMetaKey(id));
	if (!meta) return;
	const chunks = [];
	for (let index = 0; index < meta.chunkCount; index += 1) {
		const chunk = await chunkStore.lookup(buildChunkKey(id, index));
		if (!chunk || chunk.id !== id || chunk.index !== index) return;
		chunks.push(Buffer.from(chunk.dataBase64, "base64"));
	}
	return recordToUpload(meta, Buffer.concat(chunks, meta.byteLength));
}
async function pruneUploadStore(metaStore, chunkStore, ttlMs, extraChunkRows = 0) {
	const rows = await metaStore.entries();
	const liveRows = [];
	const now = Date.now();
	let liveChunkRows = 0;
	for (const row of rows) {
		if (now - row.value.createdAt > ttlMs) {
			await deleteUploadRows(row.value.id, metaStore, chunkStore);
			continue;
		}
		liveChunkRows += row.value.chunkCount;
		liveRows.push(row);
	}
	if (liveRows.length <= MAX_PENDING_UPLOADS && liveChunkRows + extraChunkRows <= MAX_PENDING_UPLOAD_CHUNK_ROWS) return;
	const sorted = liveRows.toSorted((a, b) => a.value.createdAt - b.value.createdAt || a.value.id.localeCompare(b.value.id));
	for (const row of sorted) {
		if (liveRows.length <= MAX_PENDING_UPLOADS && liveChunkRows + extraChunkRows <= MAX_PENDING_UPLOAD_CHUNK_ROWS) break;
		await deleteUploadRows(row.value.id, metaStore, chunkStore);
		liveChunkRows -= row.value.chunkCount;
		liveRows.pop();
	}
}
/**
* Persist a pending upload record so another process can read it back.
* Pass in the pre-generated id (same as the one placed in the consent card
* context) so the in-memory and FS stores share the same key.
*/
async function storePendingUploadFs(upload, options) {
	const ttlMs = options?.ttlMs ?? PENDING_UPLOAD_TTL_MS$1;
	const metaStore = createMetaStore(options);
	const chunkStore = createChunkStore(options);
	await withPendingUploadLock(options, async () => {
		await registerUploadRows({
			id: upload.id,
			bufferBase64: upload.buffer.toString("base64"),
			filename: upload.filename,
			contentType: upload.contentType,
			conversationId: upload.conversationId,
			consentCardActivityId: upload.consentCardActivityId,
			createdAt: Date.now()
		}, metaStore, chunkStore, ttlMs, true);
		await pruneUploadStore(metaStore, chunkStore, ttlMs);
	});
}
/**
* Retrieve a persisted pending upload. Expired entries are treated as absent.
*/
async function getPendingUploadFs(id, options) {
	if (!id) return;
	const ttlMs = options?.ttlMs ?? PENDING_UPLOAD_TTL_MS$1;
	const upload = await readUploadRows(id, createMetaStore(options), createChunkStore(options));
	if (!upload) return;
	if (Date.now() - upload.createdAt > ttlMs) {
		await removePendingUploadFs(id, options);
		return;
	}
	return upload;
}
/**
* Remove a persisted pending upload (after successful upload or decline).
* No-op if the entry is already gone.
*/
async function removePendingUploadFs(id, options) {
	if (!id) return;
	const metaStore = createMetaStore(options);
	const chunkStore = createChunkStore(options);
	await withPendingUploadLock(options, async () => {
		await deleteUploadRows(id, metaStore, chunkStore);
	});
}
/**
* Set the consent card activity ID on a persisted entry. Called after the
* FileConsentCard activity is sent and we know its message id.
*/
async function setPendingUploadActivityIdFs(id, activityId, options) {
	const ttlMs = options?.ttlMs ?? PENDING_UPLOAD_TTL_MS$1;
	const metaStore = createMetaStore(options);
	await withPendingUploadLock(options, async () => {
		const record = await metaStore.lookup(buildMetaKey(id));
		if (!record || Date.now() - record.createdAt > ttlMs) return;
		await metaStore.register(buildMetaKey(id), toPluginJsonValue({
			...record,
			consentCardActivityId: activityId
		}));
	});
}
//#endregion
//#region extensions/msteams/src/pending-uploads.ts
/**
* In-memory storage for files awaiting user consent in the FileConsentCard flow.
*
* When sending large files (>=4MB) in personal chats, Teams requires user consent
* before upload. This module stores the file data temporarily until the user
* accepts or declines, or until the TTL expires.
*/
const pendingUploads = /* @__PURE__ */ new Map();
/** Timer handles keyed by upload ID, cleared on explicit removal to prevent ghost cleanup */
const pendingUploadTimers = /* @__PURE__ */ new Map();
/** TTL for pending uploads: 5 minutes */
const PENDING_UPLOAD_TTL_MS = 300 * 1e3;
/**
* Store a file pending user consent.
* Returns the upload ID to include in the FileConsentCard context.
*/
function storePendingUpload(upload) {
	const id = crypto.randomUUID();
	const entry = {
		...upload,
		id,
		createdAt: Date.now()
	};
	pendingUploads.set(id, entry);
	const timer = setTimeout(() => {
		pendingUploads.delete(id);
		pendingUploadTimers.delete(id);
	}, PENDING_UPLOAD_TTL_MS);
	pendingUploadTimers.set(id, timer);
	return id;
}
/**
* Retrieve a pending upload by ID.
* Returns undefined if not found or expired.
*/
function getPendingUpload(id) {
	if (!id) return;
	const entry = pendingUploads.get(id);
	if (!entry) return;
	if (Date.now() - entry.createdAt > PENDING_UPLOAD_TTL_MS) {
		pendingUploads.delete(id);
		const timer = pendingUploadTimers.get(id);
		if (timer !== void 0) {
			clearTimeout(timer);
			pendingUploadTimers.delete(id);
		}
		return;
	}
	return entry;
}
/**
* Remove a pending upload (after successful upload or user decline).
* Also clears the TTL timer to prevent ghost Map deletions.
*/
function removePendingUpload(id) {
	if (id) {
		pendingUploads.delete(id);
		const timer = pendingUploadTimers.get(id);
		if (timer !== void 0) {
			clearTimeout(timer);
			pendingUploadTimers.delete(id);
		}
	}
}
/**
* Set the consent card activity ID on an existing pending upload.
* Called after the FileConsentCard is sent and we know its activity ID.
*/
function setPendingUploadActivityId(uploadId, activityId) {
	const entry = pendingUploads.get(uploadId);
	if (entry) entry.consentCardActivityId = activityId;
}
//#endregion
//#region extensions/msteams/src/file-consent-helpers.ts
function buildConsentActivity(params) {
	const { media, description, uploadId } = params;
	return {
		type: "message",
		attachments: [buildFileConsentCard({
			filename: media.filename,
			description: description || `File: ${media.filename}`,
			sizeInBytes: media.buffer.length,
			context: { uploadId }
		})]
	};
}
/**
* Prepare a FileConsentCard activity for large files or non-images in personal chats.
* Returns the activity object and uploadId - caller is responsible for sending.
*
* This variant only writes to the in-memory store. Use it when the caller and
* the `fileConsent/invoke` handler share the same process (for example the
* messenger reply path). For proactive CLI sends where the invoke arrives in
* a different process, use {@link prepareFileConsentActivityFs} instead.
*/
function prepareFileConsentActivity(params) {
	const { media, conversationId, description } = params;
	const uploadId = storePendingUpload({
		buffer: media.buffer,
		filename: media.filename,
		contentType: media.contentType,
		conversationId
	});
	return {
		activity: buildConsentActivity({
			media,
			description,
			uploadId
		}),
		uploadId
	};
}
/**
* Prepare a FileConsentCard activity and persist the pending upload to the
* filesystem so a different process can read it when the user accepts.
*
* This is used by the proactive CLI `message send --media` path: the CLI
* process sends the card and exits, but the `fileConsent/invoke` callback is
* delivered to the long-lived gateway monitor process. The FS-backed store
* bridges those two processes. The in-memory store is also populated so
* same-process flows keep the fast path.
*/
async function prepareFileConsentActivityFs(params) {
	const { media, conversationId, description } = params;
	const uploadId = storePendingUpload({
		buffer: media.buffer,
		filename: media.filename,
		contentType: media.contentType,
		conversationId
	});
	await storePendingUploadFs({
		id: uploadId,
		buffer: media.buffer,
		filename: media.filename,
		contentType: media.contentType,
		conversationId
	});
	return {
		activity: buildConsentActivity({
			media,
			description,
			uploadId
		}),
		uploadId
	};
}
/**
* Check if a file requires FileConsentCard flow.
* True for: personal chat AND (large file OR non-image)
*/
function requiresFileConsent(params) {
	const isPersonal = normalizeOptionalLowercaseString(params.conversationType) === "personal";
	const isImage = params.contentType?.startsWith("image/") ?? false;
	const isLargeFile = params.bufferSize >= params.thresholdBytes;
	return isPersonal && (isLargeFile || !isImage);
}
//#endregion
//#region extensions/msteams/src/graph-chat.ts
function buildTeamsFileInfoCard(file) {
	const rawETag = file.eTag;
	const uniqueId = rawETag.replace(/^["']|["']$/g, "").replace(/[{}]/g, "").split(",")[0] ?? rawETag;
	const lastDot = file.name.lastIndexOf(".");
	const fileType = lastDot >= 0 ? normalizeLowercaseStringOrEmpty(file.name.slice(lastDot + 1)) : "";
	return {
		contentType: "application/vnd.microsoft.teams.card.file.info",
		contentUrl: file.webDavUrl,
		name: file.name,
		content: {
			uniqueId,
			fileType
		}
	};
}
//#endregion
//#region extensions/msteams/src/graph-upload.ts
const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
const GRAPH_BETA = "https://graph.microsoft.com/beta";
const GRAPH_SCOPE = "https://graph.microsoft.com";
/**
* Upload a file to the user's OneDrive root folder.
* For larger files, this uses the simple upload endpoint (up to 4MB).
*/
async function uploadToOneDrive(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const token = await params.tokenProvider.getAccessToken(GRAPH_SCOPE);
	const res = await fetchFn(`${GRAPH_ROOT}/me/drive/root:${`/OpenClawShared/${encodeURIComponent(params.filename)}`}:/content`, {
		method: "PUT",
		headers: {
			"User-Agent": buildUserAgent(),
			Authorization: `Bearer ${token}`,
			"Content-Type": params.contentType ?? "application/octet-stream"
		},
		body: new Uint8Array(params.buffer)
	});
	if (!res.ok) throw await createMSTeamsHttpError(res, "OneDrive upload failed");
	const data = await res.json();
	if (!data.id || !data.webUrl || !data.name) throw new Error("OneDrive upload response missing required fields");
	return {
		id: data.id,
		webUrl: data.webUrl,
		name: data.name
	};
}
/**
* Create a sharing link for a OneDrive file.
* The link allows organization members to view the file.
*/
async function createSharingLink(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const token = await params.tokenProvider.getAccessToken(GRAPH_SCOPE);
	const res = await fetchFn(`${GRAPH_ROOT}/me/drive/items/${params.itemId}/createLink`, {
		method: "POST",
		headers: {
			"User-Agent": buildUserAgent(),
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			type: "view",
			scope: params.scope ?? "organization"
		})
	});
	if (!res.ok) throw await createMSTeamsHttpError(res, "Create sharing link failed");
	const data = await res.json();
	if (!data.link?.webUrl) throw new Error("Create sharing link response missing webUrl");
	return { webUrl: data.link.webUrl };
}
/**
* Upload a file to OneDrive and create a sharing link.
* Convenience function for the common case.
*/
async function uploadAndShareOneDrive(params) {
	const uploaded = await uploadToOneDrive({
		buffer: params.buffer,
		filename: params.filename,
		contentType: params.contentType,
		tokenProvider: params.tokenProvider,
		fetchFn: params.fetchFn
	});
	const shareLink = await createSharingLink({
		itemId: uploaded.id,
		tokenProvider: params.tokenProvider,
		scope: params.scope,
		fetchFn: params.fetchFn
	});
	return {
		itemId: uploaded.id,
		webUrl: uploaded.webUrl,
		shareUrl: shareLink.webUrl,
		name: uploaded.name
	};
}
/**
* Upload a file to a SharePoint site.
* This is used for group chats and channels where /me/drive doesn't work for bots.
*
* @param params.siteId - SharePoint site ID (e.g., "contoso.sharepoint.com,guid1,guid2")
*/
async function uploadToSharePoint(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const token = await params.tokenProvider.getAccessToken(GRAPH_SCOPE);
	const uploadPath = `/OpenClawShared/${encodeURIComponent(params.filename)}`;
	const res = await fetchFn(`${GRAPH_ROOT}/sites/${params.siteId}/drive/root:${uploadPath}:/content`, {
		method: "PUT",
		headers: {
			"User-Agent": buildUserAgent(),
			Authorization: `Bearer ${token}`,
			"Content-Type": params.contentType ?? "application/octet-stream"
		},
		body: new Uint8Array(params.buffer)
	});
	if (!res.ok) throw await createMSTeamsHttpError(res, "SharePoint upload failed");
	const data = await res.json();
	if (!data.id || !data.webUrl || !data.name) throw new Error("SharePoint upload response missing required fields");
	return {
		id: data.id,
		webUrl: data.webUrl,
		name: data.name
	};
}
/**
* Get driveItem properties needed for native Teams file card attachments.
* This fetches the eTag and webDavUrl which are required for "reference" type attachments.
*
* @param params.siteId - SharePoint site ID
* @param params.itemId - The driveItem ID (returned from upload)
*/
async function getDriveItemProperties(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const token = await params.tokenProvider.getAccessToken(GRAPH_SCOPE);
	const res = await fetchFn(`${GRAPH_ROOT}/sites/${params.siteId}/drive/items/${params.itemId}?$select=eTag,webDavUrl,name`, { headers: {
		"User-Agent": buildUserAgent(),
		Authorization: `Bearer ${token}`
	} });
	if (!res.ok) throw await createMSTeamsHttpError(res, "Get driveItem properties failed");
	const data = await res.json();
	if (!data.eTag || !data.webDavUrl || !data.name) throw new Error("DriveItem response missing required properties (eTag, webDavUrl, or name)");
	return {
		eTag: data.eTag,
		webDavUrl: data.webDavUrl,
		name: data.name
	};
}
/**
* Resolve the Graph API-native chat ID from a Bot Framework conversation ID.
*
* Bot Framework personal DM conversation IDs use formats like `a:1xxx@unq.gbl.spaces`
* or `8:orgid:xxx` that the Graph API does not accept. Graph API requires the
* `19:xxx@thread.tacv2` or `19:xxx@unq.gbl.spaces` format.
*
* This function looks up the matching Graph chat by querying the bot's chats filtered
* by the target user's AAD object ID.
*/
async function resolveGraphChatId(params) {
	const { botFrameworkConversationId, userAadObjectId, tokenProvider } = params;
	const fetchFn = params.fetchFn ?? fetch;
	if (botFrameworkConversationId.startsWith("19:")) return botFrameworkConversationId;
	const token = await tokenProvider.getAccessToken(GRAPH_SCOPE);
	let path;
	if (userAadObjectId) path = `/me/chats?$filter=${encodeURIComponent(`chatType eq 'oneOnOne' and members/any(m:m/microsoft.graph.aadUserConversationMember/userId eq '${userAadObjectId}')`)}&$select=id`;
	else path = `/me/chats?$filter=${encodeURIComponent("chatType eq 'oneOnOne'")}&$select=id`;
	const res = await fetchFn(`${GRAPH_ROOT}${path}`, { headers: {
		"User-Agent": buildUserAgent(),
		Authorization: `Bearer ${token}`
	} });
	if (!res.ok) return null;
	const chats = (await res.json()).value ?? [];
	if (userAadObjectId && chats.length > 0 && chats[0]?.id) return chats[0].id;
	if (!userAadObjectId && chats.length === 1 && chats[0]?.id) return chats[0].id;
	return null;
}
/**
* Get members of a Teams chat for per-user sharing.
* Used to create sharing links scoped to only the chat participants.
*/
async function getChatMembers(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const token = await params.tokenProvider.getAccessToken(GRAPH_SCOPE);
	const res = await fetchFn(`${GRAPH_ROOT}/chats/${params.chatId}/members`, { headers: {
		"User-Agent": buildUserAgent(),
		Authorization: `Bearer ${token}`
	} });
	if (!res.ok) throw await createMSTeamsHttpError(res, "Get chat members failed");
	return ((await res.json()).value ?? []).map((m) => ({
		aadObjectId: m.userId ?? "",
		displayName: m.displayName
	})).filter((m) => m.aadObjectId);
}
/**
* Create a sharing link for a SharePoint drive item.
* For organization scope (default), uses v1.0 API.
* For per-user scope, uses beta API with recipients.
*/
async function createSharePointSharingLink(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const token = await params.tokenProvider.getAccessToken(GRAPH_SCOPE);
	const scope = params.scope ?? "organization";
	const apiRoot = scope === "users" ? GRAPH_BETA : GRAPH_ROOT;
	const body = {
		type: "view",
		scope: scope === "users" ? "users" : "organization"
	};
	if (scope === "users" && params.recipientObjectIds?.length) body.recipients = params.recipientObjectIds.map((id) => ({ objectId: id }));
	const res = await fetchFn(`${apiRoot}/sites/${params.siteId}/drive/items/${params.itemId}/createLink`, {
		method: "POST",
		headers: {
			"User-Agent": buildUserAgent(),
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) throw await createMSTeamsHttpError(res, "Create SharePoint sharing link failed");
	const data = await res.json();
	if (!data.link?.webUrl) throw new Error("Create SharePoint sharing link response missing webUrl");
	return { webUrl: data.link.webUrl };
}
/**
* Upload a file to SharePoint and create a sharing link.
*
* For group chats, this creates a per-user sharing link scoped to chat members.
* For channels, this creates an organization-wide sharing link.
*
* @param params.siteId - SharePoint site ID
* @param params.chatId - Optional chat ID for per-user sharing (group chats)
* @param params.usePerUserSharing - Whether to use per-user sharing (requires beta API + Chat.Read.All)
*/
async function uploadAndShareSharePoint(params) {
	const uploaded = await uploadToSharePoint({
		buffer: params.buffer,
		filename: params.filename,
		contentType: params.contentType,
		tokenProvider: params.tokenProvider,
		siteId: params.siteId,
		fetchFn: params.fetchFn
	});
	let scope = "organization";
	let recipientObjectIds;
	if (params.usePerUserSharing && params.chatId) try {
		const members = await getChatMembers({
			chatId: params.chatId,
			tokenProvider: params.tokenProvider,
			fetchFn: params.fetchFn
		});
		if (members.length > 0) {
			scope = "users";
			recipientObjectIds = members.map((m) => m.aadObjectId);
		}
	} catch {}
	const shareLink = await createSharePointSharingLink({
		siteId: params.siteId,
		itemId: uploaded.id,
		tokenProvider: params.tokenProvider,
		scope,
		recipientObjectIds,
		fetchFn: params.fetchFn
	});
	return {
		itemId: uploaded.id,
		webUrl: uploaded.webUrl,
		shareUrl: shareLink.webUrl,
		name: uploaded.name
	};
}
//#endregion
//#region extensions/msteams/src/media-helpers.ts
/**
* MIME type detection and filename extraction for MSTeams media attachments.
*/
/**
* Detect MIME type from URL extension or data URL.
* Uses shared MIME detection for consistency with core handling.
*/
async function getMimeType(url) {
	if (url.startsWith("data:")) {
		const match = url.match(/^data:([^;,]+)/);
		if (match?.[1]) return match[1];
	}
	return await detectMime({ filePath: url }) ?? "application/octet-stream";
}
/**
* Extract filename from URL or local path.
* For local paths, extracts original filename if stored with embedded name pattern.
* Falls back to deriving the extension from MIME type when no extension present.
*/
async function extractFilename(url) {
	if (url.startsWith("data:")) {
		const mime = await getMimeType(url);
		const ext = extensionForMime(mime) ?? ".bin";
		return `${mime.startsWith("image/") ? "image" : "file"}${ext}`;
	}
	try {
		const pathname = new URL(url).pathname;
		const basename = path.basename(pathname);
		const existingExt = getFileExtension(pathname);
		if (basename && existingExt) return basename;
		const mime = await getMimeType(url);
		const ext = extensionForMime(mime) ?? ".bin";
		const prefix = mime.startsWith("image/") ? "image" : "file";
		return basename ? `${basename}${ext}` : `${prefix}${ext}`;
	} catch {
		return extractOriginalFilename(url);
	}
}
/**
* Check if a URL refers to a local file path.
*/
function isLocalPath(url) {
	if (url.startsWith("file://") || url.startsWith("/") || url.startsWith("~")) return true;
	if (url.startsWith("\\") && !url.startsWith("\\\\")) return true;
	if (/^[a-zA-Z]:[\\/]/.test(url)) return true;
	if (url.startsWith("\\\\")) return true;
	return false;
}
/**
* Extract the message ID from a Bot Framework response.
*/
function extractMessageId(response) {
	if (!response || typeof response !== "object") return null;
	if (!("id" in response)) return null;
	const { id } = response;
	if (typeof id !== "string" || !id) return null;
	return id;
}
//#endregion
//#region extensions/msteams/src/mentions.ts
/**
* Check whether an ID looks like a valid Teams user/bot identifier.
* Accepts:
* - Bot Framework IDs: "28:xxx..." / "29:xxx..." / "8:orgid:..."
* - AAD object IDs (UUIDs): "d5318c29-33ac-4e6b-bd42-57b8b793908f"
*
* Keep this permissive enough for real Teams IDs while still rejecting
* documentation placeholders like `@[表示名](ユーザーID)`.
*/
const TEAMS_BOT_ID_PATTERN = /^\d+:[a-z0-9._=-]+(?::[a-z0-9._=-]+)*$/i;
const AAD_OBJECT_ID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function isValidTeamsId(id) {
	return TEAMS_BOT_ID_PATTERN.test(id) || AAD_OBJECT_ID_PATTERN.test(id);
}
/**
* Parse mentions from text in the format @[Name](id).
* Example: "Hello @[John Doe](28:xxx-yyy-zzz)!"
*
* Only matches where the id looks like a real Teams user/bot ID are treated
* as mentions. This avoids false positives from documentation or code samples
* embedded in the message (e.g. `@[表示名](ユーザーID)` in backticks).
*
* Returns both the formatted text with <at> tags and the entities array.
*/
function parseMentions(text) {
	const mentionPattern = /@\[([^\]]+)\]\(([^)]+)\)/g;
	const entities = [];
	return {
		text: text.replace(mentionPattern, (match, name, id) => {
			const trimmedId = id.trim();
			if (!isValidTeamsId(trimmedId)) return match;
			const trimmedName = name.trim();
			const mentionTag = `<at>${trimmedName}</at>`;
			entities.push({
				type: "mention",
				text: mentionTag,
				mentioned: {
					id: trimmedId,
					name: trimmedName
				}
			});
			return mentionTag;
		}),
		entities
	};
}
//#endregion
//#region extensions/msteams/src/revoked-context.ts
async function withRevokedProxyFallback(params) {
	try {
		return await params.run();
	} catch (err) {
		if (!isRevokedProxyError(err)) throw err;
		params.onRevokedLog?.();
		return await params.onRevoked();
	}
}
//#endregion
//#region extensions/msteams/src/sdk-proactive.ts
let apiModulePromise = null;
async function loadMSTeamsApiModule() {
	apiModulePromise ??= import("./dist-UAZjIOT1.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
	return apiModulePromise;
}
function resolveThreadedConversationId(conversationId, threadActivityId) {
	if (!threadActivityId) return conversationId.split(";")[0] ?? conversationId;
	return `${conversationId.split(";")[0] ?? conversationId};messageid=${threadActivityId}`;
}
function normalizeRequiredServiceUrl(ref) {
	if (!ref.serviceUrl) throw new Error("Invalid stored reference: missing serviceUrl");
	return normalizeBotFrameworkServiceUrl(ref.serviceUrl);
}
function buildSdkConversationReference(source, options) {
	const bot = source.agent ?? source.bot ?? void 0;
	if (!bot?.id) throw new Error("Invalid stored reference: missing agent.id");
	const conversationId = resolveThreadedConversationId(source.conversation.id, options?.threadActivityId);
	const tenantId = source.tenantId ?? source.conversation.tenantId;
	const serviceUrl = normalizeRequiredServiceUrl(source);
	if (options?.serviceUrlBoundary) validateMSTeamsProactiveServiceUrlBoundary({
		cloud: options.serviceUrlBoundary.cloud,
		conversationId,
		storedServiceUrl: serviceUrl,
		configuredServiceUrl: options.serviceUrlBoundary.serviceUrl
	});
	const botRef = {
		...bot,
		id: bot.id,
		role: "bot"
	};
	return {
		activityId: source.activityId,
		channelId: "msteams",
		serviceUrl,
		bot: botRef,
		conversation: {
			id: conversationId,
			conversationType: source.conversation.conversationType,
			...tenantId ? { tenantId } : {}
		},
		locale: source.locale,
		user: source.user,
		...tenantId ? { tenantId } : {},
		...source.aadObjectId ? { aadObjectId: source.aadObjectId } : {}
	};
}
function getStructuralApiClient(app) {
	return app.api;
}
function sameServiceUrl(left, right) {
	if (!left) return false;
	try {
		return normalizeBotFrameworkServiceUrl(left) === right;
	} catch {
		return false;
	}
}
function stringifyReferenceFallbackActivity(activity) {
	if (typeof activity === "string") return activity;
	if (activity == null) return "";
	if (typeof activity === "number" || typeof activity === "boolean" || typeof activity === "bigint") return String(activity);
	return "";
}
async function getApiClientForReference(app, ref) {
	const api = getStructuralApiClient(app);
	if (sameServiceUrl(api.serviceUrl, ref.serviceUrl)) return api;
	const appInternals = app;
	const httpClient = appInternals.api?.http ?? appInternals.client;
	if (!httpClient) return api;
	const { Client } = await loadMSTeamsApiModule();
	return new Client(ref.serviceUrl, httpClient);
}
function mergeReferenceIntoActivity(activity, ref) {
	const source = activity && typeof activity === "object" && !Array.isArray(activity) ? activity : {
		type: "message",
		text: stringifyReferenceFallbackActivity(activity)
	};
	const existingChannelData = source.channelData && typeof source.channelData === "object" && !Array.isArray(source.channelData) ? source.channelData : void 0;
	const existingTenant = existingChannelData?.tenant && typeof existingChannelData.tenant === "object" && !Array.isArray(existingChannelData.tenant) ? existingChannelData.tenant : void 0;
	let channelData = existingChannelData ? { ...existingChannelData } : void 0;
	if (ref.tenantId) {
		channelData ??= {};
		channelData.tenant = existingTenant ? {
			...existingTenant,
			id: ref.tenantId
		} : { id: ref.tenantId };
	}
	return {
		...source,
		channelId: ref.channelId,
		from: ref.bot,
		recipient: ref.user,
		conversation: ref.conversation,
		...channelData ? { channelData } : {},
		locale: ref.locale,
		...ref.tenantId ? { tenantId: ref.tenantId } : {},
		...ref.aadObjectId ? { aadObjectId: ref.aadObjectId } : {}
	};
}
async function sendMSTeamsActivityWithReference(app, source, activity, options) {
	const ref = buildSdkConversationReference(source, options);
	const activities = (await getApiClientForReference(app, ref)).conversations.activities(ref.conversation.id);
	const activityWithRef = mergeReferenceIntoActivity(activity, ref);
	const isTargeted = activityWithRef.recipient?.isTargeted === true;
	if (isTargeted && ref.conversation.conversationType === "personal") throw new Error("Targeted messages are not supported in 1:1 (personal) chats.");
	const activityId = typeof activityWithRef.id === "string" ? activityWithRef.id : void 0;
	if (activityId) {
		const res = isTargeted && activities.updateTargeted ? await activities.updateTargeted(activityId, activityWithRef) : await activities.update(activityId, activityWithRef);
		return {
			...activityWithRef,
			...res && typeof res === "object" ? res : {}
		};
	}
	const res = isTargeted && activities.createTargeted ? await activities.createTargeted(activityWithRef) : await activities.create(activityWithRef);
	return {
		...activityWithRef,
		...res
	};
}
async function updateMSTeamsActivityWithReference(app, source, activityId, activity, options) {
	const ref = buildSdkConversationReference(source, options);
	return (await getApiClientForReference(app, ref)).conversations.activities(ref.conversation.id).update(activityId, activity);
}
async function deleteMSTeamsActivityWithReference(app, source, activityId, options) {
	const ref = buildSdkConversationReference(source, options);
	return (await getApiClientForReference(app, ref)).conversations.activities(ref.conversation.id).delete(activityId);
}
//#endregion
//#region extensions/msteams/src/ai-entity.ts
/** AI-generated content entity added to every outbound AI message. */
const AI_GENERATED_ENTITY = {
	type: "https://schema.org/Message",
	"@type": "Message",
	"@id": "",
	additionalType: ["AIGeneratedContent"]
};
//#endregion
//#region extensions/msteams/src/messenger.ts
/**
* MSTeams-specific media size limit (100MB).
* Higher than the default because OneDrive upload handles large files well.
*/
const MSTEAMS_MAX_MEDIA_BYTES$1 = 100 * 1024 * 1024;
/**
* Threshold for large files that require FileConsentCard flow in personal chats.
* Files >= 4MB use consent flow; smaller images can use inline base64.
*/
const FILE_CONSENT_THRESHOLD_BYTES$1 = 4 * 1024 * 1024;
function normalizeConversationId(rawId) {
	return rawId.split(";")[0] ?? rawId;
}
function buildConversationReference(ref) {
	const conversationId = ref.conversation?.id?.trim();
	if (!conversationId) throw new Error("Invalid stored reference: missing conversation.id");
	const agent = ref.agent ?? ref.bot ?? void 0;
	if (agent == null || !agent.id) throw new Error("Invalid stored reference: missing agent.id");
	const user = ref.user;
	if (!user?.id) throw new Error("Invalid stored reference: missing user.id");
	const tenantId = ref.tenantId ?? ref.conversation?.tenantId;
	const aadObjectId = ref.aadObjectId ?? user.aadObjectId;
	return {
		activityId: ref.activityId,
		user: aadObjectId ? {
			...user,
			aadObjectId
		} : user,
		agent,
		conversation: {
			id: normalizeConversationId(conversationId),
			conversationType: ref.conversation?.conversationType,
			tenantId
		},
		channelId: ref.channelId ?? "msteams",
		serviceUrl: ref.serviceUrl,
		locale: ref.locale,
		...tenantId ? { tenantId } : {},
		...aadObjectId ? { aadObjectId } : {}
	};
}
function pushTextMessages(out, text, opts) {
	if (!text) return;
	if (opts.chunkText) {
		for (const chunk of getMSTeamsRuntime().channel.text.chunkMarkdownTextWithMode(text, opts.chunkLimit, opts.chunkMode)) {
			const trimmed = chunk.trim();
			if (!trimmed || isSilentReplyText(trimmed, "NO_REPLY")) continue;
			out.push({ text: trimmed });
		}
		return;
	}
	const trimmed = text.trim();
	if (!trimmed || isSilentReplyText(trimmed, "NO_REPLY")) return;
	out.push({ text: trimmed });
}
function clampMs(value, maxMs) {
	if (!Number.isFinite(value) || value < 0) return 0;
	return Math.min(value, maxMs);
}
function resolveRetryOptions(retry) {
	if (!retry) return {
		enabled: false,
		maxAttempts: 1,
		baseDelayMs: 0,
		maxDelayMs: 0
	};
	return {
		enabled: true,
		maxAttempts: Math.max(1, retry?.maxAttempts ?? 3),
		baseDelayMs: Math.max(0, retry?.baseDelayMs ?? 250),
		maxDelayMs: Math.max(0, retry?.maxDelayMs ?? 1e4)
	};
}
function computeRetryDelayMs(attempt, classification, opts) {
	if (classification.retryAfterMs != null) return clampMs(classification.retryAfterMs, opts.maxDelayMs);
	return clampMs(opts.baseDelayMs * 2 ** Math.max(0, attempt - 1), opts.maxDelayMs);
}
function shouldRetry(classification) {
	return classification.kind === "throttled" || classification.kind === "transient";
}
function renderReplyPayloadsToMessages(replies, options) {
	const out = [];
	const chunkLimit = Math.min(options.textChunkLimit, 4e3);
	const chunkText = options.chunkText !== false;
	const chunkMode = options.chunkMode ?? "length";
	const mediaMode = options.mediaMode ?? "split";
	const tableMode = options.tableMode ?? getMSTeamsRuntime().channel.text.resolveMarkdownTableMode({
		cfg: getMSTeamsRuntime().config.current(),
		channel: "msteams"
	});
	for (const payload of replies) {
		const reply = resolveSendableOutboundReplyParts(payload, { text: getMSTeamsRuntime().channel.text.convertMarkdownTables(payload.text ?? "", tableMode) });
		if (!reply.hasContent) continue;
		if (!reply.hasMedia) {
			pushTextMessages(out, reply.text, {
				chunkText,
				chunkLimit,
				chunkMode
			});
			continue;
		}
		if (mediaMode === "inline") {
			const firstMedia = reply.mediaUrls[0];
			if (firstMedia) {
				out.push({
					text: reply.text || void 0,
					mediaUrl: firstMedia
				});
				for (let i = 1; i < reply.mediaUrls.length; i++) if (reply.mediaUrls[i]) out.push({ mediaUrl: reply.mediaUrls[i] });
			} else pushTextMessages(out, reply.text, {
				chunkText,
				chunkLimit,
				chunkMode
			});
			continue;
		}
		pushTextMessages(out, reply.text, {
			chunkText,
			chunkLimit,
			chunkMode
		});
		for (const mediaUrl of reply.mediaUrls) {
			if (!mediaUrl) continue;
			out.push({ mediaUrl });
		}
	}
	return out;
}
async function buildActivity(msg, conversationRef, tokenProvider, sharePointSiteId, mediaMaxBytes, options) {
	const activity = { type: "message" };
	activity.channelData = { feedbackLoopEnabled: options?.feedbackLoopEnabled ?? false };
	if (msg.text) {
		const { text: formattedText, entities } = parseMentions(msg.text);
		activity.text = formattedText;
		activity.entities = [...entities.length > 0 ? entities : [], AI_GENERATED_ENTITY];
	} else activity.entities = [AI_GENERATED_ENTITY];
	if (msg.mediaUrl) {
		let contentUrl = msg.mediaUrl;
		let contentType = await getMimeType(msg.mediaUrl);
		let fileName = await extractFilename(msg.mediaUrl);
		if (isLocalPath(msg.mediaUrl)) {
			const maxBytes = mediaMaxBytes ?? MSTEAMS_MAX_MEDIA_BYTES$1;
			const media = await loadWebMedia(msg.mediaUrl, maxBytes);
			contentType = media.contentType ?? contentType;
			fileName = media.fileName ?? fileName;
			const conversationType = normalizeOptionalLowercaseString(conversationRef.conversation?.conversationType);
			const isPersonal = conversationType === "personal";
			const isImage = media.kind === "image";
			if (requiresFileConsent({
				conversationType,
				contentType,
				bufferSize: media.buffer.length,
				thresholdBytes: FILE_CONSENT_THRESHOLD_BYTES$1
			})) {
				const conversationId = conversationRef.conversation?.id ?? "unknown";
				const { activity: consentActivity, uploadId } = prepareFileConsentActivity({
					media: {
						buffer: media.buffer,
						filename: fileName,
						contentType
					},
					conversationId,
					description: msg.text || void 0
				});
				consentActivity["_pendingUploadId"] = uploadId;
				return consentActivity;
			}
			if (!isPersonal && !isImage && tokenProvider && sharePointSiteId) {
				const chatId = conversationRef.graphChatId ?? conversationRef.conversation?.id;
				activity.attachments = [buildTeamsFileInfoCard(await getDriveItemProperties({
					siteId: sharePointSiteId,
					itemId: (await uploadAndShareSharePoint({
						buffer: media.buffer,
						filename: fileName,
						contentType,
						tokenProvider,
						siteId: sharePointSiteId,
						chatId: chatId ?? void 0,
						usePerUserSharing: conversationType === "groupchat"
					})).itemId,
					tokenProvider
				}))];
				return activity;
			}
			if (!isPersonal && media.kind !== "image" && tokenProvider) {
				const uploaded = await uploadAndShareOneDrive({
					buffer: media.buffer,
					filename: fileName,
					contentType,
					tokenProvider
				});
				const fileLink = `📎 [${uploaded.name}](${uploaded.shareUrl})`;
				const existingText = typeof activity.text === "string" ? activity.text : void 0;
				activity.text = existingText ? `${existingText}\n\n${fileLink}` : fileLink;
				return activity;
			}
			const base64 = media.buffer.toString("base64");
			contentUrl = `data:${media.contentType};base64,${base64}`;
		}
		activity.attachments = [{
			name: fileName,
			contentType,
			contentUrl
		}];
	}
	return activity;
}
async function sendMSTeamsMessages(params) {
	const messages = params.messages.filter((m) => m.text && m.text.trim().length > 0 || m.mediaUrl);
	if (messages.length === 0) return [];
	const retryOptions = resolveRetryOptions(params.retry);
	const sendWithRetry = async (sendOnce, meta) => {
		if (!retryOptions.enabled) return await sendOnce();
		for (const attempt of Array.from({ length: retryOptions.maxAttempts }, (_, index) => index + 1)) try {
			return await sendOnce();
		} catch (err) {
			const classification = classifyMSTeamsSendError(err);
			if (!(attempt < retryOptions.maxAttempts && shouldRetry(classification))) throw err;
			const delayMs = computeRetryDelayMs(attempt, classification, retryOptions);
			const nextAttempt = attempt + 1;
			params.onRetry?.({
				messageIndex: meta.messageIndex,
				messageCount: meta.messageCount,
				nextAttempt,
				maxAttempts: retryOptions.maxAttempts,
				delayMs,
				classification
			});
			await sleep(delayMs);
		}
		throw new Error("unreachable Teams send retry loop exit");
	};
	const sendMessageInContext = async (sendFn, message, messageIndex) => {
		let pendingUploadId;
		const messageId = extractMessageId(await sendWithRetry(async () => {
			const activity = await buildActivity(message, params.conversationRef, params.tokenProvider, params.sharePointSiteId, params.mediaMaxBytes, { feedbackLoopEnabled: params.feedbackLoopEnabled });
			pendingUploadId = typeof activity["_pendingUploadId"] === "string" ? activity["_pendingUploadId"] : void 0;
			if (pendingUploadId) delete activity["_pendingUploadId"];
			return await sendFn(activity);
		}, {
			messageIndex,
			messageCount: messages.length
		})) ?? "unknown";
		if (pendingUploadId && messageId !== "unknown") setPendingUploadActivityId(pendingUploadId, messageId);
		return messageId;
	};
	const sendMessageBatchInContext = async (sendFn, batch, startIndex) => {
		const messageIds = [];
		for (const [idx, message] of batch.entries()) messageIds.push(await sendMessageInContext(sendFn, message, startIndex + idx));
		return messageIds;
	};
	const sendProactively = async (batch, startIndex, threadActivityId) => {
		const baseRef = buildConversationReference(params.conversationRef);
		const isChannel = params.conversationRef.conversation?.conversationType === "channel";
		const sendFn = (activity) => sendMSTeamsActivityWithReference(params.app, baseRef, activity, {
			threadActivityId: isChannel ? threadActivityId : void 0,
			serviceUrlBoundary: params.serviceUrlBoundary
		});
		return await sendMessageBatchInContext(sendFn, batch, startIndex);
	};
	const resolvedThreadId = params.conversationRef.threadId ?? params.conversationRef.activityId;
	if (params.replyStyle === "thread") {
		const ctx = params.context;
		if (!ctx) return await sendProactively(messages, 0, resolvedThreadId);
		const sendFn = ctx.sendActivity;
		const messageIds = [];
		for (const [idx, message] of messages.entries()) {
			const result = await withRevokedProxyFallback({
				run: async () => ({
					ids: [await sendMessageInContext(sendFn, message, idx)],
					fellBack: false
				}),
				onRevoked: async () => {
					const remaining = messages.slice(idx);
					return {
						ids: remaining.length > 0 ? await sendProactively(remaining, idx, resolvedThreadId) : [],
						fellBack: true
					};
				}
			});
			messageIds.push(...result.ids);
			if (result.fellBack) return messageIds;
		}
		return messageIds;
	}
	return await sendProactively(messages, 0);
}
//#endregion
//#region extensions/msteams/src/send-context.ts
function resolveMSTeamsProactiveReplyStyle(params) {
	const threadRootId = params.ref.threadId ?? params.ref.activityId;
	if (params.conversationType !== "channel" || !threadRootId) return "top-level";
	const routeConfig = resolveMSTeamsRouteConfig({
		cfg: params.cfg,
		teamId: params.ref.teamId,
		conversationId: params.conversationId,
		allowNameMatching: false
	});
	const { replyStyle } = resolveMSTeamsReplyPolicy({
		isDirectMessage: false,
		globalConfig: params.cfg,
		teamConfig: routeConfig.teamConfig,
		channelConfig: routeConfig.channelConfig
	});
	return replyStyle;
}
/**
* Parse the target value into a conversation reference lookup key.
* Supported formats:
* - conversation:19:abc@thread.tacv2 → lookup by conversation ID
* - user:aad-object-id → lookup by user AAD object ID
* - 19:abc@thread.tacv2 → direct conversation ID
*/
function parseRecipient(to) {
	const trimmed = to.trim();
	const finalize = (type, id) => {
		const normalized = id.trim();
		if (!normalized) throw new Error(`Invalid target value: missing ${type} id`);
		return {
			type,
			id: normalized
		};
	};
	if (trimmed.startsWith("conversation:")) return finalize("conversation", trimmed.slice(13));
	if (trimmed.startsWith("user:")) return finalize("user", trimmed.slice(5));
	if (trimmed.startsWith("19:") || trimmed.includes("@thread")) return finalize("conversation", trimmed);
	return finalize("user", trimmed);
}
/**
* Find a stored conversation reference for the given recipient.
*/
async function findConversationReference(recipient) {
	if (recipient.type === "conversation") {
		const ref = await recipient.store.get(recipient.id);
		if (ref) return {
			conversationId: recipient.id,
			ref
		};
		return null;
	}
	const found = await recipient.store.findPreferredDmByUserId(recipient.id);
	if (!found) return null;
	return {
		conversationId: found.conversationId,
		ref: found.reference
	};
}
async function resolveMSTeamsSendContext(params) {
	const msteamsCfg = params.cfg.channels?.msteams;
	if (!msteamsCfg?.enabled) throw new Error("msteams provider is not enabled");
	const creds = resolveMSTeamsCredentials(msteamsCfg);
	if (!creds) throw new Error("msteams credentials not configured");
	const store = createMSTeamsConversationStoreState();
	const recipient = parseRecipient(params.to);
	const found = await findConversationReference({
		...recipient,
		store
	});
	if (!found) throw new Error(`No conversation reference found for ${recipient.type}:${recipient.id}. The bot must receive a message from this conversation before it can send proactively.`);
	const { conversationId, ref } = found;
	const log = getMSTeamsRuntime().logging.getChildLogger({ name: "msteams:send" });
	if (ref.serviceUrl && !isAllowedBotFrameworkServiceUrl(ref.serviceUrl)) {
		try {
			await store.remove(conversationId);
		} catch (err) {
			log.warn?.("failed to remove blocked msteams conversation reference", {
				conversationId,
				error: formatUnknownError(err)
			});
		}
		throw new Error(`Stored Microsoft Teams conversation reference has blocked serviceUrl host: ${describeBotFrameworkServiceUrlHost(ref.serviceUrl)}. The bot must receive a new message from this conversation before it can send proactively.`);
	}
	const safeRef = ref.serviceUrl ? {
		...ref,
		serviceUrl: normalizeBotFrameworkServiceUrl(ref.serviceUrl)
	} : ref;
	if (recipient.type === "user") {
		const resolvedType = normalizeLowercaseStringOrEmpty(safeRef.conversation?.conversationType ?? "");
		if (resolvedType && resolvedType !== "personal") throw new Error(`Conversation reference for user:${recipient.id} resolved to a ${resolvedType} conversation (${conversationId}) instead of a personal DM. The bot must receive a DM from this user before it can send proactively.`);
	}
	const sdkCloudOptions = resolveMSTeamsSdkCloudOptions(msteamsCfg);
	const { app } = await loadMSTeamsSdkWithAuth(creds, sdkCloudOptions);
	validateMSTeamsProactiveServiceUrlBoundary({
		cloud: sdkCloudOptions.cloud,
		conversationId,
		storedServiceUrl: safeRef.serviceUrl,
		configuredServiceUrl: sdkCloudOptions.serviceUrl
	});
	const tokenProvider = createMSTeamsTokenProvider(app);
	const storedConversationType = normalizeLowercaseStringOrEmpty(safeRef.conversation?.conversationType ?? "");
	let conversationType;
	if (storedConversationType === "personal") conversationType = "personal";
	else if (storedConversationType === "channel") conversationType = "channel";
	else conversationType = "groupChat";
	const replyStyle = resolveMSTeamsProactiveReplyStyle({
		cfg: msteamsCfg,
		conversationId,
		ref: safeRef,
		conversationType
	});
	const sharePointSiteId = msteamsCfg.sharePointSiteId;
	const mediaMaxBytes = resolveChannelMediaMaxBytes({
		cfg: params.cfg,
		resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb
	});
	let graphChatId = safeRef.graphChatId ?? void 0;
	if (graphChatId === void 0 && sharePointSiteId) try {
		const resolved = await resolveGraphChatId({
			botFrameworkConversationId: conversationId,
			userAadObjectId: safeRef.user?.aadObjectId,
			tokenProvider
		});
		graphChatId = resolved;
		if (resolved) await store.upsert(conversationId, {
			...safeRef,
			graphChatId: resolved
		});
		else log.warn?.("could not resolve Graph chat ID; file uploads may fail for this conversation", { conversationId });
	} catch (err) {
		log.warn?.("failed to resolve Graph chat ID; file uploads may fall back to Bot Framework ID", {
			conversationId,
			error: formatUnknownError(err)
		});
		graphChatId = null;
	}
	return {
		appId: creds.appId,
		conversationId,
		ref: safeRef,
		app,
		log,
		conversationType,
		replyStyle,
		sdkCloudOptions,
		tokenProvider,
		sharePointSiteId,
		mediaMaxBytes,
		graphChatId
	};
}
//#endregion
//#region extensions/msteams/src/send.ts
/** Threshold for large files that require FileConsentCard flow in personal chats */
const FILE_CONSENT_THRESHOLD_BYTES = 4 * 1024 * 1024;
/**
* MSTeams-specific media size limit (100MB).
* Higher than the default because OneDrive upload handles large files well.
*/
const MSTEAMS_MAX_MEDIA_BYTES = 100 * 1024 * 1024;
function createMSTeamsSendReceipt(params) {
	return createMessageReceiptFromOutboundResults({
		kind: params.kind,
		results: params.platformMessageIds.map((messageId) => ({
			channel: "msteams",
			messageId,
			conversationId: params.conversationId
		}))
	});
}
function createMSTeamsSendResult(params) {
	const platformMessageIds = (params.platformMessageIds?.length ? [...params.platformMessageIds] : [params.messageId]).map((messageId) => messageId.trim()).filter((messageId) => messageId && messageId !== "unknown");
	return {
		messageId: params.messageId,
		conversationId: params.conversationId,
		receipt: createMSTeamsSendReceipt({
			conversationId: params.conversationId,
			platformMessageIds,
			kind: params.kind
		}),
		...params.pendingUploadId ? { pendingUploadId: params.pendingUploadId } : {}
	};
}
/**
* Send a message to a Teams conversation or user.
*
* Uses the stored ConversationReference from previous interactions.
* The bot must have received at least one message from the conversation
* before proactive messaging works.
*
* File handling by conversation type:
* - Personal (1:1) chats: small images (<4MB) use base64, large files and non-images use FileConsentCard
* - Group chats / channels: files are uploaded to OneDrive and shared via link
*/
async function sendMessageMSTeams(params) {
	const { cfg, to, text, mediaUrl, filename, mediaLocalRoots, mediaReadFile } = params;
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "msteams"
	});
	const messageText = convertMarkdownTables(text ?? "", tableMode);
	const ctx = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const { app, conversationId, ref, log, conversationType, tokenProvider, sharePointSiteId, sdkCloudOptions } = ctx;
	log.debug?.("sending proactive message", {
		conversationId,
		conversationType,
		textLength: messageText.length,
		hasMedia: Boolean(mediaUrl)
	});
	if (mediaUrl) {
		const media = await loadOutboundMediaFromUrl(mediaUrl, {
			maxBytes: ctx.mediaMaxBytes ?? MSTEAMS_MAX_MEDIA_BYTES,
			mediaLocalRoots,
			mediaReadFile
		});
		const isLargeFile = media.buffer.length >= FILE_CONSENT_THRESHOLD_BYTES;
		const isImage = media.contentType?.startsWith("image/") ?? false;
		const fallbackFileName = await extractFilename(mediaUrl);
		const fileName = filename?.trim() || media.fileName || fallbackFileName;
		log.debug?.("processing media", {
			fileName,
			contentType: media.contentType,
			size: media.buffer.length,
			isLargeFile,
			isImage,
			conversationType
		});
		if (requiresFileConsent({
			conversationType,
			contentType: media.contentType,
			bufferSize: media.buffer.length,
			thresholdBytes: FILE_CONSENT_THRESHOLD_BYTES
		})) {
			const { activity, uploadId } = await prepareFileConsentActivityFs({
				media: {
					buffer: media.buffer,
					filename: fileName,
					contentType: media.contentType
				},
				conversationId,
				description: messageText || void 0
			});
			log.debug?.("sending file consent card", {
				uploadId,
				fileName,
				size: media.buffer.length
			});
			const messageId = await sendProactiveActivity({
				app,
				ref,
				activity,
				errorPrefix: "msteams consent card send",
				serviceUrlBoundary: sdkCloudOptions
			});
			setPendingUploadActivityId(uploadId, messageId);
			await setPendingUploadActivityIdFs(uploadId, messageId);
			log.info("sent file consent card", {
				conversationId,
				messageId,
				uploadId
			});
			return createMSTeamsSendResult({
				messageId,
				conversationId,
				kind: "card",
				pendingUploadId: uploadId
			});
		}
		if (conversationType === "personal") {
			const base64 = media.buffer.toString("base64");
			return sendTextWithMedia(ctx, messageText, `data:${media.contentType};base64,${base64}`);
		}
		if (isImage && !sharePointSiteId) {
			const base64 = media.buffer.toString("base64");
			return sendTextWithMedia(ctx, messageText, `data:${media.contentType};base64,${base64}`);
		}
		try {
			if (sharePointSiteId) {
				log.debug?.("uploading to SharePoint for native file card", {
					fileName,
					conversationType,
					siteId: sharePointSiteId
				});
				const uploaded = await uploadAndShareSharePoint({
					buffer: media.buffer,
					filename: fileName,
					contentType: media.contentType,
					tokenProvider,
					siteId: sharePointSiteId,
					chatId: ctx.graphChatId ?? conversationId,
					usePerUserSharing: conversationType === "groupChat"
				});
				log.debug?.("SharePoint upload complete", {
					itemId: uploaded.itemId,
					shareUrl: uploaded.shareUrl
				});
				const driveItem = await getDriveItemProperties({
					siteId: sharePointSiteId,
					itemId: uploaded.itemId,
					tokenProvider
				});
				log.debug?.("driveItem properties retrieved", {
					eTag: driveItem.eTag,
					webDavUrl: driveItem.webDavUrl
				});
				const fileCardAttachment = buildTeamsFileInfoCard(driveItem);
				const messageId = await sendProactiveActivityRaw({
					app,
					ref,
					activity: {
						type: "message",
						text: messageText || void 0,
						attachments: [fileCardAttachment]
					},
					serviceUrlBoundary: sdkCloudOptions
				});
				log.info("sent native file card", {
					conversationId,
					messageId,
					fileName: driveItem.name
				});
				return createMSTeamsSendResult({
					messageId,
					conversationId,
					kind: "media"
				});
			}
			log.debug?.("uploading to OneDrive (no SharePoint site configured)", {
				fileName,
				conversationType
			});
			const uploaded = await uploadAndShareOneDrive({
				buffer: media.buffer,
				filename: fileName,
				contentType: media.contentType,
				tokenProvider
			});
			log.debug?.("OneDrive upload complete", {
				itemId: uploaded.itemId,
				shareUrl: uploaded.shareUrl
			});
			const fileLink = `📎 [${uploaded.name}](${uploaded.shareUrl})`;
			const messageId = await sendProactiveActivityRaw({
				app,
				ref,
				activity: {
					type: "message",
					text: messageText ? `${messageText}\n\n${fileLink}` : fileLink
				},
				serviceUrlBoundary: sdkCloudOptions
			});
			log.info("sent message with OneDrive file link", {
				conversationId,
				messageId,
				shareUrl: uploaded.shareUrl
			});
			return createMSTeamsSendResult({
				messageId,
				conversationId,
				kind: "media"
			});
		} catch (err) {
			const classification = classifyMSTeamsSendError(err);
			const hint = formatMSTeamsSendErrorHint(classification);
			const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
			throw new Error(`msteams file send failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`, { cause: err });
		}
	}
	return sendTextWithMedia(ctx, messageText, void 0);
}
/**
* Send a text message with optional base64 media URL.
*/
async function sendTextWithMedia(ctx, text, mediaUrl) {
	const { app, appId, conversationId, ref, log, tokenProvider, sharePointSiteId, mediaMaxBytes, replyStyle } = ctx;
	let platformMessageIds;
	try {
		platformMessageIds = await sendMSTeamsMessages({
			replyStyle,
			app,
			appId,
			conversationRef: ref,
			messages: [{
				text: text || void 0,
				mediaUrl
			}],
			retry: {},
			onRetry: (event) => {
				log.debug?.("retrying send", {
					conversationId,
					...event
				});
			},
			tokenProvider,
			sharePointSiteId,
			mediaMaxBytes,
			serviceUrlBoundary: ctx.sdkCloudOptions
		});
	} catch (err) {
		const classification = classifyMSTeamsSendError(err);
		const hint = formatMSTeamsSendErrorHint(classification);
		const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
		throw new Error(`msteams send failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`, { cause: err });
	}
	const messageId = platformMessageIds[0] ?? "unknown";
	log.info("sent proactive message", {
		conversationId,
		messageId
	});
	return {
		messageId,
		conversationId,
		receipt: createMSTeamsSendReceipt({
			conversationId,
			platformMessageIds,
			kind: mediaUrl ? "media" : "text"
		})
	};
}
async function sendProactiveActivityRaw({ app, ref, activity, serviceUrlBoundary }) {
	return extractMessageId(await sendMSTeamsActivityWithReference(app, buildConversationReference(ref), activity, { serviceUrlBoundary })) ?? "unknown";
}
async function sendProactiveActivity({ app, ref, activity, errorPrefix, serviceUrlBoundary }) {
	try {
		return await sendProactiveActivityRaw({
			app,
			ref,
			activity,
			serviceUrlBoundary
		});
	} catch (err) {
		const classification = classifyMSTeamsSendError(err);
		const hint = formatMSTeamsSendErrorHint(classification);
		const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
		throw new Error(`${errorPrefix} failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`, { cause: err });
	}
}
/**
* Send a poll (Adaptive Card) to a Teams conversation or user.
*/
async function sendPollMSTeams(params) {
	const { cfg, to, question, options, maxSelections } = params;
	const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	const pollCard = buildMSTeamsPollCard({
		question,
		options,
		maxSelections
	});
	log.debug?.("sending poll", {
		conversationId,
		pollId: pollCard.pollId,
		optionCount: pollCard.options.length
	});
	const messageId = await sendProactiveActivity({
		app,
		ref,
		activity: {
			type: "message",
			attachments: [{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: pollCard.card
			}]
		},
		errorPrefix: "msteams poll send",
		serviceUrlBoundary: sdkCloudOptions
	});
	log.info("sent poll", {
		conversationId,
		pollId: pollCard.pollId,
		messageId
	});
	return {
		pollId: pollCard.pollId,
		messageId,
		conversationId
	};
}
/**
* Send an arbitrary Adaptive Card to a Teams conversation or user.
*/
async function sendAdaptiveCardMSTeams(params) {
	const { cfg, to, card } = params;
	const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	log.debug?.("sending adaptive card", {
		conversationId,
		cardType: card.type,
		cardVersion: card.version
	});
	const messageId = await sendProactiveActivity({
		app,
		ref,
		activity: {
			type: "message",
			attachments: [{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: card
			}]
		},
		errorPrefix: "msteams card send",
		serviceUrlBoundary: sdkCloudOptions
	});
	log.info("sent adaptive card", {
		conversationId,
		messageId
	});
	return {
		messageId,
		conversationId
	};
}
/**
* Edit (update) a previously sent message in a Teams conversation.
*
* Uses the Bot Framework REST API for proactive edits outside of the
* original turn context.
*/
async function editMessageMSTeams(params) {
	const { cfg, to, activityId, text } = params;
	const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	log.debug?.("editing proactive message", {
		conversationId,
		activityId,
		textLength: text.length
	});
	try {
		await updateMSTeamsActivityWithReference(app, buildConversationReference(ref), activityId, {
			type: "message",
			id: activityId,
			text
		}, { serviceUrlBoundary: sdkCloudOptions });
	} catch (err) {
		const classification = classifyMSTeamsSendError(err);
		const hint = formatMSTeamsSendErrorHint(classification);
		const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
		throw new Error(`msteams edit failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`, { cause: err });
	}
	log.info("edited proactive message", {
		conversationId,
		activityId
	});
	return { conversationId };
}
/**
* Delete a previously sent message in a Teams conversation.
*
* Uses the Bot Framework REST API for proactive deletes outside of the
* original turn context.
*/
async function deleteMessageMSTeams(params) {
	const { cfg, to, activityId } = params;
	const { app, conversationId, ref, log, sdkCloudOptions } = await resolveMSTeamsSendContext({
		cfg,
		to
	});
	log.debug?.("deleting proactive message", {
		conversationId,
		activityId
	});
	try {
		await deleteMSTeamsActivityWithReference(app, buildConversationReference(ref), activityId, { serviceUrlBoundary: sdkCloudOptions });
	} catch (err) {
		const classification = classifyMSTeamsSendError(err);
		const hint = formatMSTeamsSendErrorHint(classification);
		const status = classification.statusCode ? ` (HTTP ${classification.statusCode})` : "";
		throw new Error(`msteams delete failed${status}: ${formatUnknownError(err)}${hint ? ` (${hint})` : ""}`, { cause: err });
	}
	log.info("deleted proactive message", {
		conversationId,
		activityId
	});
	return { conversationId };
}
//#endregion
//#region extensions/msteams/src/probe.ts
function decodeJwtPayload(token) {
	const parts = token.split(".");
	if (parts.length < 2) return null;
	const payload = parts[1] ?? "";
	const normalized = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, "=").replace(/-/g, "+").replace(/_/g, "/");
	try {
		const decoded = Buffer.from(normalized, "base64").toString("utf8");
		const parsed = JSON.parse(decoded);
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function readStringArray(value) {
	if (!Array.isArray(value)) return;
	const out = normalizeStringEntries(value);
	return out.length > 0 ? out : void 0;
}
function readScopes(value) {
	if (typeof value !== "string") return;
	const out = normalizeStringEntries(value.split(/\s+/));
	return out.length > 0 ? out : void 0;
}
async function probeMSTeams(cfg) {
	const creds = resolveMSTeamsCredentials(cfg);
	if (!creds) return {
		ok: false,
		error: "missing credentials (appId, appPassword, tenantId)"
	};
	try {
		const { app } = await loadMSTeamsSdkWithAuth(creds, resolveMSTeamsSdkCloudOptions(cfg));
		const tokenProvider = createMSTeamsTokenProvider(app);
		if (!await tokenProvider.getAccessToken("https://api.botframework.com")) throw new Error("Failed to acquire bot token");
		let graph;
		try {
			const accessToken = readAccessToken(await tokenProvider.getAccessToken("https://graph.microsoft.com"));
			const payload = accessToken ? decodeJwtPayload(accessToken) : null;
			graph = {
				ok: true,
				roles: readStringArray(payload?.roles),
				scopes: readScopes(payload?.scp)
			};
		} catch (err) {
			graph = {
				ok: false,
				error: formatUnknownError(err)
			};
		}
		let delegatedAuth;
		if (cfg?.delegatedAuth?.enabled) try {
			const tokens = loadDelegatedTokens();
			if (tokens) {
				const isExpired = !isFutureDateTimestampMs(tokens.expiresAt);
				delegatedAuth = {
					ok: !isExpired,
					scopes: tokens.scopes,
					userPrincipalName: tokens.userPrincipalName,
					...isExpired ? { error: "token expired (will auto-refresh on next use)" } : {}
				};
			} else delegatedAuth = {
				ok: false,
				error: "no delegated tokens found (run setup wizard)"
			};
		} catch {
			delegatedAuth = {
				ok: false,
				error: "failed to load delegated tokens"
			};
		}
		return {
			ok: true,
			appId: creds.appId,
			...graph ? { graph } : {},
			...delegatedAuth ? { delegatedAuth } : {}
		};
	} catch (err) {
		return {
			ok: false,
			appId: creds.appId,
			error: formatUnknownError(err)
		};
	}
}
//#endregion
export { buildFileInfoCard as _, sendMessageMSTeams as a, renderReplyPayloadsToMessages as c, withRevokedProxyFallback as d, resolveGraphChatId as f, removePendingUploadFs as g, getPendingUploadFs as h, sendAdaptiveCardMSTeams as i, sendMSTeamsMessages as l, removePendingUpload as m, deleteMessageMSTeams as n, sendPollMSTeams as o, getPendingUpload as p, editMessageMSTeams as r, buildConversationReference as s, probeMSTeams as t, sendMSTeamsActivityWithReference as u, parseFileConsentInvoke as v, uploadToConsentUrl as y };
