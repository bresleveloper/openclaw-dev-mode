const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
const require_runtime = require("./runtime-gZTAuFux.cjs");
require("../runtime-api.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-CHzaaWiC.cjs");
const require_channel_setup = require("./channel.setup-BVDfgdCc.cjs");
const require_polls = require("./polls-BJ4-4uZm.cjs");
let openclaw_plugin_sdk_lazy_runtime = require("openclaw/plugin-sdk/lazy-runtime");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_fetch_runtime = require("openclaw/plugin-sdk/fetch-runtime");
let openclaw_plugin_sdk_provider_http = require("openclaw/plugin-sdk/provider-http");
let openclaw_plugin_sdk_reply_payload = require("openclaw/plugin-sdk/reply-payload");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let openclaw_plugin_sdk_text_chunking = require("openclaw/plugin-sdk/text-chunking");
let node_dns_promises = require("node:dns/promises");
let openclaw_plugin_sdk_ssrf_policy = require("openclaw/plugin-sdk/ssrf-policy");
let openclaw_plugin_sdk_text_utility_runtime = require("openclaw/plugin-sdk/text-utility-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let openclaw_plugin_sdk_retry_runtime = require("openclaw/plugin-sdk/retry-runtime");
let node_crypto = require("node:crypto");
node_crypto = require_rolldown_runtime.__toESM(node_crypto, 1);
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let openclaw_plugin_sdk_runtime_env = require("openclaw/plugin-sdk/runtime-env");
let openclaw_plugin_sdk_markdown_table_runtime = require("openclaw/plugin-sdk/markdown-table-runtime");
let openclaw_plugin_sdk_blob_runtime = require("openclaw/plugin-sdk/blob-runtime");
let openclaw_plugin_sdk_global_singleton = require("openclaw/plugin-sdk/global-singleton");
let openclaw_plugin_sdk_expect_runtime = require("openclaw/plugin-sdk/expect-runtime");
let openclaw_plugin_sdk_reply_chunking = require("openclaw/plugin-sdk/reply-chunking");
let openclaw_plugin_sdk_web_media = require("openclaw/plugin-sdk/web-media");
let openclaw_plugin_sdk_media_runtime = require("openclaw/plugin-sdk/media-runtime");
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
const isPrivateOrReservedIP = openclaw_plugin_sdk_ssrf_policy.isPrivateIpAddress;
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
	const hostname = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(parsed.hostname);
	if (!(opts?.allowlist ?? CONSENT_UPLOAD_HOST_ALLOWLIST).some((entry) => hostname === entry || hostname.endsWith(`.${entry}`))) throw new Error(`Consent upload URL hostname "${hostname}" is not in the allowed domains`);
	const resolveFn = opts?.resolveFn ?? ((name) => (0, node_dns_promises.lookup)(name, { all: true }));
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
	const fetchFn = params.fetchFn ?? fetch;
	const res = await (0, openclaw_plugin_sdk_text_utility_runtime.fetchWithTimeout)(params.url, {
		method: "PUT",
		headers: {
			"User-Agent": require_resolve_allowlist.buildUserAgent(),
			"Content-Type": params.contentType ?? "application/octet-stream",
			"Content-Range": `bytes 0-${params.buffer.length - 1}/${params.buffer.length}`
		},
		body: new Blob([(0, openclaw_plugin_sdk_blob_runtime.bufferToBlobPart)(params.buffer)])
	}, params.timeoutMs ?? require_resolve_allowlist.resolveMSTeamsSharePointUploadTimeoutMs(params.buffer.length), fetchFn);
	await res.body?.cancel().catch(() => void 0);
	if (!res.ok) throw new Error(`File upload to consent URL failed: ${res.status} ${res.statusText}`);
}
//#endregion
//#region extensions/msteams/src/pending-uploads-fs.ts
/** TTL for persisted pending uploads (matches in-memory store). */
const PENDING_UPLOAD_TTL_MS$1 = 3e5;
/** Cap to avoid unbounded growth if a process crashes mid-flow. */
const MAX_PENDING_UPLOADS = 100;
const MAX_CHUNKS_PER_UPLOAD = 3072;
const MAX_PENDING_UPLOAD_CHUNK_ROWS = 45e3;
const RAW_CHUNK_BYTES = 36864;
const PENDING_UPLOAD_META_MAX_ENTRIES = 200;
const PENDING_UPLOAD_META_NAMESPACE = "pending-uploads";
const PENDING_UPLOAD_CHUNKS_NAMESPACE = "pending-upload-chunks";
const PENDING_UPLOAD_MUTATION_KEY = "pending-uploads";
function createMetaStore(options) {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: PENDING_UPLOAD_META_NAMESPACE,
		maxEntries: PENDING_UPLOAD_META_MAX_ENTRIES,
		env: require_polls.resolveMSTeamsSqliteStateEnv(options)
	});
}
function createChunkStore(options) {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: PENDING_UPLOAD_CHUNKS_NAMESPACE,
		maxEntries: MAX_PENDING_UPLOAD_CHUNK_ROWS,
		env: require_polls.resolveMSTeamsSqliteStateEnv(options)
	});
}
function buildUploadKey(id) {
	return `upload:${(0, node_crypto.createHash)("sha256").update(id).digest("hex")}`;
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
		await chunkStore.register(buildChunkKey(record.id, index), require_polls.toPluginJsonValue({
			id: record.id,
			index,
			dataBase64: chunk.toString("base64")
		}));
	}
	await metaStore.register(buildMetaKey(record.id), require_polls.toPluginJsonValue({
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
	return await require_polls.withMSTeamsSqliteMutationLock(options, PENDING_UPLOAD_MUTATION_KEY, run);
}
async function readUploadRows(id, metaStore, chunkStore) {
	const meta = await metaStore.lookup(buildMetaKey(id));
	if (!meta) return;
	if (!Number.isSafeInteger(meta.chunkCount) || meta.chunkCount < 1 || meta.chunkCount > MAX_CHUNKS_PER_UPLOAD) return;
	const records = await chunkStore.lookupMany?.(Array.from({ length: meta.chunkCount }, (_, index) => buildChunkKey(id, index)));
	const chunks = [];
	for (let index = 0; index < meta.chunkCount; index += 1) {
		const result = records?.[index];
		if (result && !result.ok) throw result.error;
		const chunk = records ? result?.value : await chunkStore.lookup(buildChunkKey(id, index));
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
		await metaStore.register(buildMetaKey(id), require_polls.toPluginJsonValue({
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
const { pendingUploads, pendingUploadTimers } = (0, openclaw_plugin_sdk_global_singleton.resolveGlobalSingleton)(Symbol.for("openclaw.msteams.pendingUploadState"), () => ({
	pendingUploads: /* @__PURE__ */ new Map(),
	/** Timer handles keyed by upload ID, cleared on explicit removal to prevent ghost cleanup. */
	pendingUploadTimers: /* @__PURE__ */ new Map()
}), (state) => {
	for (const timer of state.pendingUploadTimers.values()) clearTimeout(timer);
	state.pendingUploadTimers.clear();
	state.pendingUploads.clear();
});
/** TTL for pending uploads: 5 minutes */
const PENDING_UPLOAD_TTL_MS = 3e5;
/**
* Store a file pending user consent.
* Returns the upload ID to include in the FileConsentCard context.
*/
function storePendingUpload(upload) {
	const id = node_crypto.default.randomUUID();
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
	const upload = {
		buffer: media.buffer,
		filename: media.filename,
		contentType: media.contentType,
		conversationId
	};
	const uploadId = storePendingUpload(upload);
	await storePendingUploadFs({
		id: uploadId,
		...upload
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
function requiresFileConsent(params) {
	const isPersonal = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(params.conversationType) === "personal";
	const isImage = params.contentType?.startsWith("image/") ?? false;
	const isLargeFile = params.bufferSize >= params.thresholdBytes;
	return isPersonal && (isLargeFile || !isImage);
}
//#endregion
//#region extensions/msteams/src/format.ts
const ESCAPED_MARKDOWN_RE = /\\[\\`*_{}[\]()#+\-.!|>~]/gu;
const MARKDOWN_ENTITY_RE = /&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/giu;
const TOKEN_END = "";
const MSTEAMS_FORMAT_CAPABILITIES = openclaw_plugin_sdk_text_chunking.FormatCapabilityProfile.define({
	mechanism: "markdown",
	constructs: {
		underline: "strip",
		spoiler: "fallback",
		codeLanguage: "fallback",
		heading: "fallback",
		bulletList: "fallback",
		orderedList: "fallback",
		taskList: "fallback",
		table: "fallback"
	},
	chunk: {
		limit: 8e4,
		unit: "utf16",
		hardCap: 1e5
	}
});
const MSTEAMS_MARKERS = {
	bold: {
		open: "**",
		close: "**"
	},
	italic: {
		open: "*",
		close: "*"
	},
	strikethrough: {
		open: "~~",
		close: "~~"
	}
};
function createTokenPrefix(text, label) {
	const normalized = /[\u{E000}&]/u.test(text) ? (0, openclaw_plugin_sdk_text_chunking.markdownToIR)(text, {
		autolink: false,
		linkify: false
	}).text : "";
	let prefix;
	do
		prefix = `\u{E000}${label}-${(0, node_crypto.randomUUID)()}\u{E001}`;
	while (text.includes(prefix) || normalized.includes(prefix));
	return prefix;
}
function restoreTokens(text, prefix, values) {
	if (!text.includes(prefix)) return text;
	const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	return text.replace(new RegExp(`${escapedPrefix}(\\d+)${TOKEN_END}`, "gu"), (_token, index) => values[Number(index)] ?? "");
}
function rewriteMarkdownIR(ir, edits) {
	const ordered = edits.toSorted((a, b) => a.start - b.start);
	const cumulativeDeltas = [];
	const exactEdits = /* @__PURE__ */ new Map();
	let text = "";
	let cursor = 0;
	let delta = 0;
	for (const edit of ordered) {
		text += ir.text.slice(cursor, edit.start) + edit.text;
		cursor = edit.end;
		delta += edit.text.length - (edit.end - edit.start);
		cumulativeDeltas.push(delta);
		exactEdits.set(`${edit.start}:${edit.end}`, edit);
	}
	text += ir.text.slice(cursor);
	const mapOffset = (offset) => {
		let low = 0;
		let high = ordered.length;
		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);
			if ((ordered[middle]?.end ?? Number.POSITIVE_INFINITY) <= offset) low = middle + 1;
			else high = middle;
		}
		return offset + (low > 0 ? cumulativeDeltas[low - 1] ?? 0 : 0);
	};
	const mapRange = (range) => {
		const exact = exactEdits.get(`${range.start}:${range.end}`);
		const start = mapOffset(range.start);
		return {
			...range,
			start,
			end: exact ? start + exact.text.length : mapOffset(range.end)
		};
	};
	return {
		...ir,
		text,
		styles: ir.styles.map(mapRange),
		links: ir.links.map(mapRange),
		...ir.annotations ? { annotations: ir.annotations.map(mapRange) } : {},
		...ir.listItems ? { listItems: ir.listItems.map((item) => ({
			...item,
			...item.listMarker ? { listMarker: mapRange(item.listMarker) } : {},
			...item.taskMarker ? { taskMarker: mapRange(item.taskMarker) } : {}
		})) } : {}
	};
}
function prefixMSTeamsBlockquotes(ir) {
	const rewritten = rewriteMarkdownIR(ir, ir.styles.filter((span) => span.style === "blockquote").flatMap((span) => {
		const positions = [span.start];
		for (let index = span.start; index < span.end; index += 1) if (ir.text[index] === "\n" && index + 1 < span.end) positions.push(index + 1);
		return positions.map((position) => ({
			start: position,
			end: position,
			text: "> "
		}));
	}));
	return {
		...rewritten,
		styles: rewritten.styles.filter((span) => span.style !== "blockquote")
	};
}
function longestBacktickRun(text) {
	return Math.max(0, ...text.match(/`+/gu)?.map((run) => run.length) ?? []);
}
function renderMSTeamsCode(style, text) {
	const marker = "`".repeat(Math.max(style === "code_block" ? 3 : 1, longestBacktickRun(text) + 1));
	if (style === "code_block") return `${marker}\n${text}${marker}`;
	const needsPadding = text.startsWith("`") || text.endsWith("`") || text.startsWith(" ") && text.endsWith(" ") && text.trim().length > 0;
	return `${marker}${needsPadding ? " " : ""}${text}${needsPadding ? " " : ""}${marker}`;
}
function serializeMarkdownDestination(href) {
	return `<${href.replace(/([\\<>])/gu, "\\$1")}>`;
}
function blankBlockEnd(text, index) {
	if (text[index] !== "\n" && text[index] !== "\r") return;
	const match = /^(?:\r?\n)[ \t]*(?:\r?\n)/u.exec(text.slice(index));
	return match ? index + match[0].length : void 0;
}
function scanDelimitedMarkdown(text, start, nestedOpener) {
	let bracketDepth = 1;
	let altEnd;
	let fallbackNext;
	for (let index = start + 2; index < text.length; index += 1) {
		const blankEnd = blankBlockEnd(text, index);
		if (blankEnd !== void 0) return { next: fallbackNext ?? blankEnd };
		if (text[index] === "\\") index += 1;
		else if (text.startsWith(nestedOpener, index)) {
			fallbackNext = index;
			bracketDepth += 1;
			index += 1;
		} else if (text[index] === "[") bracketDepth += 1;
		else if (text[index] === "]" && --bracketDepth === 0) {
			altEnd = index;
			break;
		}
	}
	if (altEnd === void 0 || text[altEnd + 1] !== "(") {
		const next = fallbackNext ?? text.indexOf(nestedOpener, altEnd === void 0 ? start + 2 : altEnd + 1);
		return next < 0 ? void 0 : { next };
	}
	let parenDepth = 1;
	for (let index = altEnd + 2; index < text.length; index += 1) {
		const blankEnd = blankBlockEnd(text, index);
		if (blankEnd !== void 0) return { next: fallbackNext ?? blankEnd };
		if (text[index] === "\\") index += 1;
		else if (text.startsWith(nestedOpener, index)) fallbackNext = index;
		else if (text[index] === "(") parenDepth += 1;
		else if (text[index] === ")" && --parenDepth === 0) return { end: index + 1 };
	}
	return fallbackNext === void 0 ? void 0 : { next: fallbackNext };
}
function protectDelimitedMarkdown(text, opener, tokenPrefix, values) {
	let protectedText = "";
	let cursor = 0;
	let searchFrom = 0;
	while (searchFrom < text.length) {
		const start = text.indexOf(opener, searchFrom);
		if (start < 0) break;
		const scan = scanDelimitedMarkdown(text, start, opener);
		if (!scan) break;
		if ("next" in scan) {
			searchFrom = scan.next;
			continue;
		}
		protectedText += text.slice(cursor, start);
		const index = values.push(text.slice(start, scan.end)) - 1;
		protectedText += `${tokenPrefix}${index}${TOKEN_END}`;
		cursor = scan.end;
		searchFrom = scan.end;
	}
	return protectedText + text.slice(cursor);
}
function protectRawTables(text, tokenPrefix, rawTables) {
	if (!text.includes("|")) return text;
	const { tables } = (0, openclaw_plugin_sdk_text_chunking.markdownToIRWithMeta)(text, {
		autolink: false,
		linkify: false,
		tableMode: "block"
	});
	let result = "";
	let cursor = 0;
	for (const table of tables) {
		const source = (0, openclaw_plugin_sdk_expect_runtime.expectDefined)((0, openclaw_plugin_sdk_markdown_table_runtime.getMarkdownTableSource)(table), "Markdown table source");
		const lineStart = Math.max(text.lastIndexOf("\n", source.start - 1), text.lastIndexOf("\r", source.start - 1)) + 1;
		const start = lineStart + (/^(?: {0,3}>[ \t]?)*/u.exec(text.slice(lineStart, source.start))?.[0] ?? "").length;
		const end = source.end + (text.slice(source.end, source.end + 2) === "\r\n" ? 1 : 0);
		const index = rawTables.push(text.slice(start, end)) - 1;
		result += text.slice(cursor, start) + `${tokenPrefix}t${index}${TOKEN_END}`;
		cursor = end;
	}
	return result + text.slice(cursor);
}
function protectMSTeamsCode(ir, tokenPrefix, code, protectedValues) {
	const codeSpans = ir.styles.filter((span) => span.style === "code" || span.style === "code_block");
	const codeBlocks = codeSpans.filter((span) => span.style === "code_block");
	const adjustedStyles = ir.styles.flatMap((span) => {
		if (span.style !== "blockquote") return [span];
		let segments = [span];
		for (const codeBlock of codeBlocks) segments = segments.flatMap((segment) => {
			if (codeBlock.end <= segment.start || codeBlock.start >= segment.end) return [segment];
			return [...segment.start < codeBlock.start ? [{
				...segment,
				end: codeBlock.start
			}] : [], ...codeBlock.end < segment.end ? [{
				...segment,
				start: codeBlock.end
			}] : []];
		});
		return segments;
	});
	const rewritten = rewriteMarkdownIR({
		...ir,
		styles: adjustedStyles
	}, codeSpans.map((span) => {
		const codeStyle = span.style === "code_block" ? "code_block" : "code";
		const source = protectedValues.reduce((text, protectedValue) => restoreTokens(text, protectedValue.prefix, protectedValue.values), ir.text.slice(span.start, span.end));
		const quoteDepth = codeStyle === "code_block" ? ir.styles.filter((candidate) => candidate.style === "blockquote" && span.start >= candidate.start && span.start < candidate.end).length : 0;
		const rendered = renderMSTeamsCode(codeStyle, source);
		let quoted = quoteDepth > 0 ? `${"> ".repeat(quoteDepth)}${rendered.replaceAll("\n", `\n${"> ".repeat(quoteDepth)}`)}` : rendered;
		if (codeStyle === "code_block" && ir.styles.some((candidate) => candidate.style === "blockquote" && span.start >= candidate.start && candidate.end > span.end) && !quoted.endsWith("\n")) quoted += "\n";
		const index = code.push(quoted) - 1;
		return {
			start: span.start,
			end: span.end,
			text: `${tokenPrefix}c${index}${TOKEN_END}`
		};
	}));
	return {
		...rewritten,
		styles: rewritten.styles.filter((span) => span.style !== "code" && span.style !== "code_block")
	};
}
function formatMSTeamsMarkdown(markdown, tableMode) {
	if (markdown === "") return markdown;
	const rawTables = [];
	const escapedMarkdown = [];
	const codeRegions = [];
	const images = [];
	const mentions = [];
	const entities = [];
	const tokenPrefix = createTokenPrefix(markdown, "msteamsformat");
	const mentionsProtected = protectDelimitedMarkdown(protectDelimitedMarkdown(markdown.replace(MARKDOWN_ENTITY_RE, (entity) => {
		const index = entities.push(entity) - 1;
		return `${tokenPrefix}h${index}${TOKEN_END}`;
	}), "![", `${tokenPrefix}i`, images), "@[", `${tokenPrefix}m`, mentions);
	const tableInput = (0, openclaw_plugin_sdk_text_chunking.convertMarkdownTables)(mentionsProtected, tableMode);
	const protectedMarkdown = (tableMode === "off" ? protectRawTables(tableInput, tokenPrefix, rawTables) : tableInput).replace(ESCAPED_MARKDOWN_RE, (escaped) => {
		const index = escapedMarkdown.push(escaped) - 1;
		return `${tokenPrefix}e${index}${TOKEN_END}`;
	});
	const ir = prefixMSTeamsBlockquotes(protectMSTeamsCode((0, openclaw_plugin_sdk_text_chunking.markdownToIR)(protectedMarkdown, {
		autolink: false,
		enableSpoilers: true,
		enableTaskLists: true,
		headingStyle: "rich",
		linkify: false,
		blockquotePrefix: ""
	}), tokenPrefix, codeRegions, [
		{
			prefix: `${tokenPrefix}e`,
			values: escapedMarkdown
		},
		{
			prefix: `${tokenPrefix}t`,
			values: rawTables
		},
		{
			prefix: `${tokenPrefix}m`,
			values: mentions
		},
		{
			prefix: `${tokenPrefix}i`,
			values: images
		},
		{
			prefix: `${tokenPrefix}h`,
			values: entities
		}
	]));
	let restored = restoreTokens((0, openclaw_plugin_sdk_text_chunking.renderMarkdownWithMarkers)(ir, {
		styleMarkers: MSTEAMS_MARKERS,
		escapeText: (text) => text,
		buildLink: (link) => ({
			start: link.start,
			end: link.end,
			open: "[",
			close: `](${serializeMarkdownDestination(link.href)})`
		})
	}, MSTEAMS_FORMAT_CAPABILITIES), `${tokenPrefix}c`, codeRegions);
	restored = restoreTokens(restored, `${tokenPrefix}e`, escapedMarkdown);
	restored = restoreTokens(restored, `${tokenPrefix}t`, rawTables);
	restored = restoreTokens(restored, `${tokenPrefix}m`, mentions);
	restored = restoreTokens(restored, `${tokenPrefix}i`, images);
	return restoreTokens(restored, `${tokenPrefix}h`, entities);
}
//#endregion
//#region extensions/msteams/src/graph-chat.ts
function buildTeamsFileInfoCard(file) {
	const rawETag = file.eTag;
	const uniqueId = rawETag.replace(/^["']|["']$/g, "").replace(/[{}]/g, "").split(",")[0] ?? rawETag;
	const lastDot = file.name.lastIndexOf(".");
	const fileType = lastDot >= 0 ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(file.name.slice(lastDot + 1)) : "";
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
/**
* SharePoint upload utilities for MS Teams file sending.
*
* For group chats and channels, files are uploaded to SharePoint and shared via a link.
* This module provides utilities for:
* - Uploading files to SharePoint (group/channel scope)
* - Creating sharing links (organization-wide or per-user)
* - Getting chat members for per-user sharing
*/
const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
const GRAPH_BETA = "https://graph.microsoft.com/beta";
const GRAPH_SCOPE = "https://graph.microsoft.com";
async function requestSharePoint(url, init, params) {
	const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
		url,
		init,
		fetchImpl: params.fetchFn,
		mode: "trusted_env_proxy",
		beforeRequest: () => require_resolve_allowlist.assertMSTeamsSendHandoff(params),
		maxRedirects: 20,
		allowCrossOriginUnsafeRedirectReplay: true,
		auditContext: "msteams.graph-upload"
	});
	return (0, openclaw_plugin_sdk_fetch_runtime.responseWithRelease)(response, release);
}
function requireMSTeamsSharePointSiteId(siteId) {
	const normalized = siteId?.trim();
	if (!normalized) throw new Error("channels.msteams.sharePointSiteId is required to send files to group chats or channels");
	return normalized;
}
const SHAREPOINT_REQUEST_TIMEOUT_LABEL = "MS Teams SharePoint request";
const SHAREPOINT_UPLOAD_TIMEOUT_LABEL = "MS Teams SharePoint upload";
const GRAPH_TOKEN_TIMEOUT_LABEL = "MS Teams Graph token acquisition";
async function getGraphAccessToken(tokenProvider) {
	return await require_resolve_allowlist.withMSTeamsRequestDeadline({
		label: GRAPH_TOKEN_TIMEOUT_LABEL,
		work: async () => await tokenProvider.getAccessToken(GRAPH_SCOPE)
	});
}
/**
* Upload a file to a SharePoint site.
* This is used for group chats and channels where /me/drive doesn't work for bots.
*
* @param params.siteId - SharePoint site ID (e.g., "contoso.sharepoint.com,guid1,guid2")
*/
async function uploadToSharePoint(params) {
	const uploadPath = `/OpenClawShared/${encodeURIComponent(params.filename)}`;
	const uploadUrl = `${GRAPH_ROOT}/sites/${params.siteId}/drive/root:${uploadPath}:/content?@microsoft.graph.conflictBehavior=rename`;
	const timeoutMs = require_resolve_allowlist.resolveMSTeamsSharePointUploadTimeoutMs(params.buffer.length);
	const data = await require_resolve_allowlist.withMSTeamsAbortableRequestTimeout({
		label: SHAREPOINT_UPLOAD_TIMEOUT_LABEL,
		timeoutMs,
		work: async (signal) => {
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const token = await getGraphAccessToken(params.tokenProvider);
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const res = await requestSharePoint(uploadUrl, {
				method: "PUT",
				headers: {
					"User-Agent": require_resolve_allowlist.buildUserAgent(),
					Authorization: `Bearer ${token}`,
					"Content-Type": params.contentType ?? "application/octet-stream"
				},
				body: new Blob([(0, openclaw_plugin_sdk_blob_runtime.bufferToBlobPart)(params.buffer)]),
				signal
			}, params);
			if (!res.ok) throw await require_resolve_allowlist.createMSTeamsHttpError(res, "SharePoint upload failed");
			return await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(res, "msteams.graph-upload.uploadSharePointFile", { chunkTimeoutMs: timeoutMs });
		}
	});
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
	const data = await require_resolve_allowlist.withMSTeamsAbortableRequestTimeout({
		label: SHAREPOINT_REQUEST_TIMEOUT_LABEL,
		work: async (signal) => {
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const token = await getGraphAccessToken(params.tokenProvider);
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const res = await requestSharePoint(`${GRAPH_ROOT}/sites/${params.siteId}/drive/items/${params.itemId}?$select=eTag,webDavUrl,name`, {
				headers: {
					"User-Agent": require_resolve_allowlist.buildUserAgent(),
					Authorization: `Bearer ${token}`
				},
				signal
			}, params);
			if (!res.ok) throw await require_resolve_allowlist.createMSTeamsHttpError(res, "Get driveItem properties failed");
			return await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(res, "msteams.graph-upload.getDriveItemProperties");
		}
	});
	if (!data.eTag || !data.webDavUrl || !data.name) throw new Error("DriveItem response missing required properties (eTag, webDavUrl, or name)");
	return {
		eTag: data.eTag,
		webDavUrl: data.webDavUrl,
		name: data.name
	};
}
/**
* Get members of a Teams chat for per-user sharing.
* Used to create sharing links scoped to only the chat participants.
*/
async function getChatMembers(params) {
	return await require_resolve_allowlist.withMSTeamsAbortableRequestTimeout({
		label: SHAREPOINT_REQUEST_TIMEOUT_LABEL,
		work: async (signal) => {
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const token = await getGraphAccessToken(params.tokenProvider);
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const res = await requestSharePoint(`${GRAPH_ROOT}/chats/${params.chatId}/members`, {
				headers: {
					"User-Agent": require_resolve_allowlist.buildUserAgent(),
					Authorization: `Bearer ${token}`
				},
				signal
			}, params);
			if (!res.ok) {
				const message = res.status === 403 ? "Get chat members failed; verify Graph chat-member permissions and tenant access policies" : "Get chat members failed";
				throw await require_resolve_allowlist.createMSTeamsHttpError(res, message);
			}
			return ((await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(res, "msteams.graph-upload.getChatMembers")).value ?? []).map((member) => ({ aadObjectId: member.userId ?? "" })).filter((member) => member.aadObjectId);
		}
	});
}
/**
* Create a sharing link for a SharePoint drive item.
* For organization scope (default), uses v1.0 API.
* For per-user scope, uses beta API with recipients.
*/
async function createSharePointSharingLink(params) {
	const scope = params.scope ?? "organization";
	const apiRoot = scope === "users" ? GRAPH_BETA : GRAPH_ROOT;
	const body = {
		type: "view",
		scope: scope === "users" ? "users" : "organization"
	};
	if (scope === "users" && params.recipientObjectIds?.length) body.recipients = params.recipientObjectIds.map((id) => ({ objectId: id }));
	const data = await require_resolve_allowlist.withMSTeamsAbortableRequestTimeout({
		label: SHAREPOINT_REQUEST_TIMEOUT_LABEL,
		work: async (signal) => {
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const token = await getGraphAccessToken(params.tokenProvider);
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const res = await requestSharePoint(`${apiRoot}/sites/${params.siteId}/drive/items/${params.itemId}/createLink`, {
				method: "POST",
				headers: {
					"User-Agent": require_resolve_allowlist.buildUserAgent(),
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body),
				signal
			}, params);
			if (!res.ok) throw await require_resolve_allowlist.createMSTeamsHttpError(res, "Create SharePoint sharing link failed");
			return await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(res, "msteams.graph-upload.createSharePointSharingLink");
		}
	});
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
* @param params.usePerUserSharing - Whether to use per-user sharing (requires beta API + chat-member read access)
*/
async function uploadAndShareSharePoint(params) {
	const uploaded = await uploadToSharePoint({
		buffer: params.buffer,
		filename: params.filename,
		contentType: params.contentType,
		tokenProvider: params.tokenProvider,
		siteId: params.siteId,
		fetchFn: params.fetchFn,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
	});
	let scope = "organization";
	let recipientObjectIds;
	if (params.usePerUserSharing && params.chatId) {
		const members = await getChatMembers({
			chatId: params.chatId,
			tokenProvider: params.tokenProvider,
			fetchFn: params.fetchFn,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
		});
		if (members.length === 0) throw new Error("MS Teams chat member lookup returned no recipients");
		scope = "users";
		recipientObjectIds = members.map((member) => member.aadObjectId);
	}
	const shareLink = await createSharePointSharingLink({
		siteId: params.siteId,
		itemId: uploaded.id,
		tokenProvider: params.tokenProvider,
		scope,
		recipientObjectIds,
		fetchFn: params.fetchFn,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
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
	return await (0, openclaw_plugin_sdk_media_runtime.detectMime)({ filePath: url }) ?? "application/octet-stream";
}
/**
* Extract filename from URL or local path.
* For local paths, extracts original filename if stored with embedded name pattern.
* Falls back to deriving the extension from MIME type when no extension present.
*/
async function extractFilename(url) {
	if (url.startsWith("data:")) {
		const mime = await getMimeType(url);
		const ext = (0, openclaw_plugin_sdk_media_runtime.extensionForMime)(mime) ?? ".bin";
		return `${mime.startsWith("image/") ? "image" : "file"}${ext}`;
	}
	try {
		const pathname = new URL(url).pathname;
		let basename = node_path.default.basename(pathname);
		if (basename.includes("%")) try {
			const decodedBasename = decodeURIComponent(basename);
			if (!decodedBasename.includes("/") && !decodedBasename.includes("\\") && !decodedBasename.includes("\0")) basename = decodedBasename;
		} catch {}
		const existingExt = (0, openclaw_plugin_sdk_media_runtime.getFileExtension)(basename);
		if (basename && existingExt) return basename;
		const mime = await getMimeType(url);
		const ext = (0, openclaw_plugin_sdk_media_runtime.extensionForMime)(mime) ?? ".bin";
		const prefix = mime.startsWith("image/") ? "image" : "file";
		return basename ? `${basename}${ext}` : `${prefix}${ext}`;
	} catch {
		return (0, openclaw_plugin_sdk_media_runtime.extractOriginalFilename)(url);
	}
}
/**
* Check if a URL refers to a local file path.
*/
function isLocalPath(url) {
	if (/^file:\/\//iu.test(url) || url.startsWith("/") || url.startsWith("~")) return true;
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
	const mentionPattern = /@\[((?:\\[\s\S]|[^\]\\])+)\]\(([^)]+)\)/g;
	const entities = [];
	return {
		text: text.replace(mentionPattern, (match, name, id) => {
			const trimmedId = id.trim();
			if (!isValidTeamsId(trimmedId)) return match;
			const trimmedName = name.replace(/\\([\\[\]])/g, "$1").trim();
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
//#region extensions/msteams/src/message-activity.ts
const AI_GENERATED_ENTITY = {
	type: "https://schema.org/Message",
	"@type": "Message",
	"@context": "https://schema.org",
	"@id": "",
	additionalType: ["AIGeneratedContent"]
};
/** Build final transport text and its matching entities after Markdown rendering. */
function buildMSTeamsMessageActivity(text) {
	const parsed = parseMentions(text ?? "");
	return {
		type: "message",
		...text === void 0 ? {} : { text: parsed.text },
		entities: [...parsed.entities, AI_GENERATED_ENTITY]
	};
}
//#endregion
//#region extensions/msteams/src/revoked-context.ts
async function withRevokedProxyFallback(params) {
	try {
		return await params.run();
	} catch (err) {
		if (!require_channel_setup.isRevokedProxyError(err)) throw err;
		params.onRevokedLog?.();
		return await params.onRevoked();
	}
}
//#endregion
//#region extensions/msteams/src/sdk-proactive.ts
const loadMSTeamsApiModule = (0, openclaw_plugin_sdk_lazy_runtime.createLazyRuntimeModule)(() => import("@microsoft/teams.api"));
async function quoteMSTeamsActivity(activity, messageId) {
	const { MessageActivityInput } = await loadMSTeamsApiModule();
	if (typeof activity === "string") return new MessageActivityInput(activity).prependQuote(messageId);
	if (activity.type !== "message") return activity;
	return MessageActivityInput.from(activity).prependQuote(messageId);
}
function resolveThreadedConversationId(conversationId, threadActivityId) {
	if (!threadActivityId) return conversationId.split(";")[0] ?? conversationId;
	return `${conversationId.split(";")[0] ?? conversationId};messageid=${threadActivityId}`;
}
function normalizeRequiredServiceUrl(ref) {
	if (!ref.serviceUrl) throw new Error("Invalid stored reference: missing serviceUrl");
	return require_resolve_allowlist.normalizeBotFrameworkServiceUrl(ref.serviceUrl);
}
function buildSdkConversationReference(source, options) {
	const bot = source.agent ?? source.bot ?? void 0;
	if (!bot?.id) throw new Error("Invalid stored reference: missing agent.id");
	const conversationId = resolveThreadedConversationId(source.conversation.id, options?.threadActivityId);
	const tenantId = source.tenantId ?? source.conversation.tenantId;
	const serviceUrl = normalizeRequiredServiceUrl(source);
	if (options?.serviceUrlBoundary) require_resolve_allowlist.validateMSTeamsProactiveServiceUrlBoundary({
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
		return require_resolve_allowlist.normalizeBotFrameworkServiceUrl(left) === right;
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
	return require_resolve_allowlist.withMSTeamsConnectorHandoff(options ?? {}, async (handoff) => {
		require_resolve_allowlist.assertMSTeamsSendHandoff(handoff);
		const ref = buildSdkConversationReference(source, options);
		const activities = (await getApiClientForReference(app, ref)).conversations.activities(ref.conversation.id);
		const activityWithRef = mergeReferenceIntoActivity(options?.quoteActivityId ? await quoteMSTeamsActivity(activity, options.quoteActivityId) : activity, ref);
		const isTargeted = activityWithRef.recipient?.isTargeted === true;
		if (isTargeted && ref.conversation.conversationType === "personal") throw new Error("Targeted messages are not supported in 1:1 (personal) chats.");
		const activityId = typeof activityWithRef.id === "string" ? activityWithRef.id : void 0;
		require_resolve_allowlist.assertMSTeamsSendHandoff(handoff);
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
	});
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
//#region extensions/msteams/src/messenger.ts
/**
* MSTeams-specific media size limit (100MB).
* Higher than the default to support Teams file-consent and SharePoint uploads.
*/
const MSTEAMS_MAX_MEDIA_BYTES = 104857600;
/**
* Threshold for large files that require FileConsentCard flow in personal chats.
* Files >= 4MB use consent flow; smaller images can use inline base64.
*/
const FILE_CONSENT_THRESHOLD_BYTES = 4194304;
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
		for (const chunk of require_runtime.getMSTeamsRuntime().channel.text.chunkMarkdownTextWithMode(text, opts.chunkLimit, opts.chunkMode)) {
			const trimmed = chunk.trim();
			if (!trimmed || (0, openclaw_plugin_sdk_reply_chunking.isSilentReplyText)(trimmed, openclaw_plugin_sdk_reply_chunking.SILENT_REPLY_TOKEN)) continue;
			out.push({ text: trimmed });
		}
		return;
	}
	const trimmed = text.trim();
	if (!trimmed || (0, openclaw_plugin_sdk_reply_chunking.isSilentReplyText)(trimmed, openclaw_plugin_sdk_reply_chunking.SILENT_REPLY_TOKEN)) return;
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
	if (classification.kind === "replay-safe" && classification.retryAfterMs != null) return clampMs(classification.retryAfterMs, opts.maxDelayMs);
	return clampMs(opts.baseDelayMs * 2 ** Math.max(0, attempt - 1), opts.maxDelayMs);
}
function renderReplyPayloadsToMessages(replies, options) {
	const out = [];
	const chunkLimit = Math.min(options.textChunkLimit, 4e3);
	const chunkText = options.chunkText !== false;
	const chunkMode = options.chunkMode ?? "length";
	const mediaMode = options.mediaMode ?? "split";
	const tableMode = options.tableMode ?? require_runtime.getMSTeamsRuntime().channel.text.resolveMarkdownTableMode({
		cfg: require_runtime.getMSTeamsRuntime().config.current(),
		channel: "msteams"
	});
	for (const payload of replies) {
		const reply = (0, openclaw_plugin_sdk_reply_payload.resolveSendableOutboundReplyParts)(payload, { text: formatMSTeamsMarkdown(payload.text ?? "", tableMode) });
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
	const activity = buildMSTeamsMessageActivity(msg.text);
	activity.channelData = { feedbackLoopEnabled: options?.feedbackLoopEnabled ?? false };
	if (msg.mediaUrl) {
		let contentUrl = msg.mediaUrl;
		let contentType = await getMimeType(msg.mediaUrl);
		let fileName = await extractFilename(msg.mediaUrl);
		if (isLocalPath(msg.mediaUrl)) {
			const maxBytes = mediaMaxBytes ?? MSTEAMS_MAX_MEDIA_BYTES;
			const media = await (0, openclaw_plugin_sdk_web_media.loadWebMedia)(msg.mediaUrl, maxBytes);
			contentType = media.contentType ?? contentType;
			fileName = media.fileName ?? fileName;
			const conversationType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(conversationRef.conversation?.conversationType);
			const isPersonal = conversationType === "personal";
			const isImage = media.kind === "image";
			if (requiresFileConsent({
				conversationType,
				contentType,
				bufferSize: media.buffer.length,
				thresholdBytes: FILE_CONSENT_THRESHOLD_BYTES
			})) {
				const conversationId = conversationRef.conversation?.id ?? "unknown";
				require_resolve_allowlist.assertMSTeamsSendHandoff(options);
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
			if (!isPersonal && !isImage) {
				const siteId = requireMSTeamsSharePointSiteId(sharePointSiteId);
				if (!tokenProvider) throw new Error("MS Teams Graph token provider unavailable for SharePoint file send");
				const chatId = conversationRef.conversation?.id;
				const uploaded = await uploadAndShareSharePoint({
					assertDirectAdapterHandoff: options?.assertDirectAdapterHandoff,
					buffer: media.buffer,
					filename: fileName,
					contentType,
					tokenProvider,
					siteId,
					chatId: chatId ?? void 0,
					usePerUserSharing: conversationType === "groupchat"
				});
				activity.attachments = [buildTeamsFileInfoCard(await getDriveItemProperties({
					assertDirectAdapterHandoff: options?.assertDirectAdapterHandoff,
					siteId,
					itemId: uploaded.itemId,
					tokenProvider
				}))];
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
		return await (0, openclaw_plugin_sdk_retry_runtime.retryAsync)(sendOnce, {
			attempts: retryOptions.maxAttempts,
			minDelayMs: 0,
			maxDelayMs: retryOptions.maxDelayMs,
			shouldRetry: (err) => require_channel_setup.classifyMSTeamsSendError(err).kind === "replay-safe",
			delayMs: ({ attempt, err }) => computeRetryDelayMs(attempt, require_channel_setup.classifyMSTeamsSendError(err), retryOptions),
			onRetry: ({ attempt, err, delayMs }) => {
				params.onRetry?.({
					messageIndex: meta.messageIndex,
					messageCount: meta.messageCount,
					nextAttempt: attempt + 1,
					maxAttempts: retryOptions.maxAttempts,
					delayMs,
					classification: require_channel_setup.classifyMSTeamsSendError(err)
				});
			},
			sleep: (delayMs) => (0, openclaw_plugin_sdk_runtime_env.sleepWithAbort)(delayMs)
		});
	};
	let providerDispatchStarted = false;
	const sendMessageInContext = async (sendFn, message, messageIndex) => {
		let activity;
		let pendingUploadId;
		let response;
		try {
			response = await sendWithRetry(async () => {
				require_resolve_allowlist.assertMSTeamsSendHandoff(params);
				activity ??= await buildActivity(message, params.conversationRef, params.tokenProvider, params.sharePointSiteId, params.mediaMaxBytes, {
					feedbackLoopEnabled: params.feedbackLoopEnabled,
					assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
				});
				pendingUploadId ??= typeof activity["_pendingUploadId"] === "string" ? activity["_pendingUploadId"] : void 0;
				delete activity["_pendingUploadId"];
				require_resolve_allowlist.assertMSTeamsSendHandoff(params);
				providerDispatchStarted = true;
				return await sendFn(activity);
			}, {
				messageIndex,
				messageCount: messages.length
			});
		} catch (error) {
			if (!providerDispatchStarted && !(error instanceof openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError)) throw new openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Teams activity preparation failed", { cause: error });
			throw error;
		}
		const messageId = extractMessageId(response) ?? "unknown";
		await params.onMessageSent?.(messageId, messageIndex);
		if (pendingUploadId && messageId !== "unknown") setPendingUploadActivityId(pendingUploadId, messageId);
		return messageId;
	};
	const sendMessageBatchInContext = async (sendFn, batch, startIndex) => {
		const messageIds = [];
		for (const [idx, message] of batch.entries()) messageIds.push(await sendMessageInContext(sendFn, message, startIndex + idx));
		return messageIds;
	};
	const sendProactively = async (batch, startIndex, threadActivityId) => {
		let baseRef;
		try {
			baseRef = buildConversationReference(params.conversationRef);
		} catch (error) {
			if (providerDispatchStarted) throw error;
			throw new openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Teams conversation preparation failed", { cause: error });
		}
		const isChannel = params.conversationRef.conversation?.conversationType === "channel";
		const sendFn = (activity) => sendMSTeamsActivityWithReference(params.app, baseRef, activity, {
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
			onPlatformSendDispatch: params.onPlatformSendDispatch,
			threadActivityId: isChannel ? threadActivityId : void 0,
			serviceUrlBoundary: params.serviceUrlBoundary
		});
		return await sendMessageBatchInContext(sendFn, batch, startIndex);
	};
	const resolvedThreadId = params.conversationRef.threadId ?? params.conversationRef.activityId;
	if (params.replyStyle === "thread") {
		const ctx = params.context;
		if (!ctx) return await sendProactively(messages, 0, resolvedThreadId);
		const sendFn = (activity) => require_resolve_allowlist.withMSTeamsConnectorHandoff(params, () => ctx.sendActivity(activity));
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
Object.defineProperty(exports, "buildConversationReference", {
	enumerable: true,
	get: function() {
		return buildConversationReference;
	}
});
Object.defineProperty(exports, "buildFileInfoCard", {
	enumerable: true,
	get: function() {
		return buildFileInfoCard;
	}
});
Object.defineProperty(exports, "buildMSTeamsMessageActivity", {
	enumerable: true,
	get: function() {
		return buildMSTeamsMessageActivity;
	}
});
Object.defineProperty(exports, "buildTeamsFileInfoCard", {
	enumerable: true,
	get: function() {
		return buildTeamsFileInfoCard;
	}
});
Object.defineProperty(exports, "deleteMSTeamsActivityWithReference", {
	enumerable: true,
	get: function() {
		return deleteMSTeamsActivityWithReference;
	}
});
Object.defineProperty(exports, "extractFilename", {
	enumerable: true,
	get: function() {
		return extractFilename;
	}
});
Object.defineProperty(exports, "extractMessageId", {
	enumerable: true,
	get: function() {
		return extractMessageId;
	}
});
Object.defineProperty(exports, "formatMSTeamsMarkdown", {
	enumerable: true,
	get: function() {
		return formatMSTeamsMarkdown;
	}
});
Object.defineProperty(exports, "getDriveItemProperties", {
	enumerable: true,
	get: function() {
		return getDriveItemProperties;
	}
});
Object.defineProperty(exports, "getPendingUpload", {
	enumerable: true,
	get: function() {
		return getPendingUpload;
	}
});
Object.defineProperty(exports, "getPendingUploadFs", {
	enumerable: true,
	get: function() {
		return getPendingUploadFs;
	}
});
Object.defineProperty(exports, "parseFileConsentInvoke", {
	enumerable: true,
	get: function() {
		return parseFileConsentInvoke;
	}
});
Object.defineProperty(exports, "prepareFileConsentActivityFs", {
	enumerable: true,
	get: function() {
		return prepareFileConsentActivityFs;
	}
});
Object.defineProperty(exports, "removePendingUpload", {
	enumerable: true,
	get: function() {
		return removePendingUpload;
	}
});
Object.defineProperty(exports, "removePendingUploadFs", {
	enumerable: true,
	get: function() {
		return removePendingUploadFs;
	}
});
Object.defineProperty(exports, "renderReplyPayloadsToMessages", {
	enumerable: true,
	get: function() {
		return renderReplyPayloadsToMessages;
	}
});
Object.defineProperty(exports, "requireMSTeamsSharePointSiteId", {
	enumerable: true,
	get: function() {
		return requireMSTeamsSharePointSiteId;
	}
});
Object.defineProperty(exports, "requiresFileConsent", {
	enumerable: true,
	get: function() {
		return requiresFileConsent;
	}
});
Object.defineProperty(exports, "sendMSTeamsActivityWithReference", {
	enumerable: true,
	get: function() {
		return sendMSTeamsActivityWithReference;
	}
});
Object.defineProperty(exports, "sendMSTeamsMessages", {
	enumerable: true,
	get: function() {
		return sendMSTeamsMessages;
	}
});
Object.defineProperty(exports, "setPendingUploadActivityId", {
	enumerable: true,
	get: function() {
		return setPendingUploadActivityId;
	}
});
Object.defineProperty(exports, "setPendingUploadActivityIdFs", {
	enumerable: true,
	get: function() {
		return setPendingUploadActivityIdFs;
	}
});
Object.defineProperty(exports, "updateMSTeamsActivityWithReference", {
	enumerable: true,
	get: function() {
		return updateMSTeamsActivityWithReference;
	}
});
Object.defineProperty(exports, "uploadAndShareSharePoint", {
	enumerable: true,
	get: function() {
		return uploadAndShareSharePoint;
	}
});
Object.defineProperty(exports, "uploadToConsentUrl", {
	enumerable: true,
	get: function() {
		return uploadToConsentUrl;
	}
});
Object.defineProperty(exports, "withRevokedProxyFallback", {
	enumerable: true,
	get: function() {
		return withRevokedProxyFallback;
	}
});
