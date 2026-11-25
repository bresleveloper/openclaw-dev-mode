const require_rolldown_runtime = require("./rolldown-runtime-CiKaZLfC.cjs");
const require_bot_framework_service_url = require("./bot-framework-service-url-CgVuKiIR.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-Dc_BnhPP.cjs");
const require_runtime = require("./runtime-CbKazLGv.cjs");
require("../runtime-api.cjs");
const require_delegated_state = require("./delegated-state-DhIHahf1.cjs");
const require_presentation = require("./presentation-jgjPRHyN.cjs");
const require_channel_setup = require("./channel.setup-PrElmCN5.cjs");
let openclaw_plugin_sdk_lazy_runtime = require("openclaw/plugin-sdk/lazy-runtime");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_fetch_runtime = require("openclaw/plugin-sdk/fetch-runtime");
let openclaw_plugin_sdk_provider_http = require("openclaw/plugin-sdk/provider-http");
let openclaw_plugin_sdk_reply_payload = require("openclaw/plugin-sdk/reply-payload");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let openclaw_plugin_sdk_text_chunking = require("openclaw/plugin-sdk/text-chunking");
let openclaw_plugin_sdk_ssrf_policy = require("openclaw/plugin-sdk/ssrf-policy");
let openclaw_plugin_sdk_number_runtime = require("openclaw/plugin-sdk/number-runtime");
let openclaw_plugin_sdk_text_utility_runtime = require("openclaw/plugin-sdk/text-utility-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let node_crypto = require("node:crypto");
node_crypto = require_rolldown_runtime.__toESM(node_crypto, 1);
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let openclaw_plugin_sdk_node_crypto_runtime = require("openclaw/plugin-sdk/node-crypto-runtime");
let openclaw_plugin_sdk_retry_runtime = require("openclaw/plugin-sdk/retry-runtime");
let openclaw_plugin_sdk_runtime_env = require("openclaw/plugin-sdk/runtime-env");
let openclaw_plugin_sdk_markdown_table_runtime = require("openclaw/plugin-sdk/markdown-table-runtime");
let node_dns_promises = require("node:dns/promises");
let openclaw_plugin_sdk_global_singleton = require("openclaw/plugin-sdk/global-singleton");
let openclaw_plugin_sdk_expect_runtime = require("openclaw/plugin-sdk/expect-runtime");
let openclaw_plugin_sdk_blob_runtime = require("openclaw/plugin-sdk/blob-runtime");
let openclaw_plugin_sdk_collection_runtime = require("openclaw/plugin-sdk/collection-runtime");
let openclaw_plugin_sdk_dedupe_runtime = require("openclaw/plugin-sdk/dedupe-runtime");
let openclaw_plugin_sdk_plugin_state_runtime = require("openclaw/plugin-sdk/plugin-state-runtime");
let openclaw_plugin_sdk_reply_chunking = require("openclaw/plugin-sdk/reply-chunking");
let openclaw_plugin_sdk_web_media = require("openclaw/plugin-sdk/web-media");
let openclaw_plugin_sdk_media_runtime = require("openclaw/plugin-sdk/media-runtime");
// extensions/msteams/src/file-consent.ts
/**
* Allowlist of domains that are valid targets for file consent uploads.
* These are the Microsoft/SharePoint domains that Teams legitimately provides
* as upload destinations in the FileConsentCard flow.
*/
const CONSENT_UPLOAD_HOST_ALLOWLIST = [
	...require_resolve_allowlist.SHAREPOINT_HOSTS,
	"storage.live.com",
	"onedrive.com",
	"1drv.ms",
	...require_resolve_allowlist.GRAPH_HOSTS
];
async function validateConsentUploadUrl(url) {
	const parsed = URL.parse(url);
	if (!parsed) throw new Error("Consent upload URL is not a valid URL");
	if (parsed.protocol !== "https:") throw new Error(`Consent upload URL must use HTTPS, got ${parsed.protocol}`);
	const hostname = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(parsed.hostname);
	if (!CONSENT_UPLOAD_HOST_ALLOWLIST.some((entry) => hostname === entry || hostname.endsWith(`.${entry}`))) throw new Error(`Consent upload URL hostname "${hostname}" is not in the allowed domains`);
	let resolved;
	try {
		resolved = await (0, node_dns_promises.lookup)(hostname, { all: true });
	} catch {
		throw new Error(`Failed to resolve consent upload URL hostname "${hostname}"`);
	}
	for (const entry of resolved) if ((0, openclaw_plugin_sdk_ssrf_policy.isPrivateIpAddress)(entry.address)) throw new Error(`Consent upload URL resolves to a private/reserved IP (${entry.address})`);
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
*/
async function uploadToConsentUrl(params) {
	await validateConsentUploadUrl(params.url);
	const res = await (0, openclaw_plugin_sdk_text_utility_runtime.fetchWithTimeout)(params.url, {
		method: "PUT",
		headers: {
			"User-Agent": require_resolve_allowlist.buildUserAgent(),
			"Content-Type": params.contentType ?? "application/octet-stream",
			"Content-Range": `bytes 0-${params.buffer.length - 1}/${params.buffer.length}`
		},
		body: Uint8Array.from(params.buffer)
	}, require_resolve_allowlist.resolveMSTeamsSharePointUploadTimeoutMs(params.buffer.length));
	await res.body?.cancel().catch(() => void 0);
	if (!res.ok) throw new Error(`File upload to consent URL failed: ${res.status} ${res.statusText}`);
}
// extensions/msteams/src/pending-uploads-fs.ts
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
function createMetaStore() {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStoreV2({
		namespace: PENDING_UPLOAD_META_NAMESPACE,
		maxEntries: PENDING_UPLOAD_META_MAX_ENTRIES
	});
}
function createChunkStore() {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStoreV2({
		namespace: PENDING_UPLOAD_CHUNKS_NAMESPACE,
		maxEntries: MAX_PENDING_UPLOAD_CHUNK_ROWS
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
async function deleteUploadRows(id, metaStore, chunkStore) {
	const existing = await metaStore.lookup(buildMetaKey(id));
	await metaStore.delete(buildMetaKey(id));
	if (!existing) return;
	const chunkCount = existing.chunkCount;
	for (let index = 0; index < chunkCount; index += 1) await chunkStore.delete(buildChunkKey(id, index));
}
async function registerUploadRows(record, metaStore, chunkStore) {
	const buffer = Buffer.from(record.buffer);
	const chunkCount = Math.max(1, Math.ceil(buffer.byteLength / RAW_CHUNK_BYTES));
	if (chunkCount > MAX_CHUNKS_PER_UPLOAD) throw new Error(`Microsoft Teams pending upload ${record.id} exceeds SQLite chunk limit (${chunkCount}/${MAX_CHUNKS_PER_UPLOAD})`);
	await deleteUploadRows(record.id, metaStore, chunkStore);
	await pruneUploadStore(metaStore, chunkStore, chunkCount);
	for (let index = 0; index < chunkCount; index += 1) {
		const chunk = buffer.subarray(index * RAW_CHUNK_BYTES, (index + 1) * RAW_CHUNK_BYTES);
		await chunkStore.register(buildChunkKey(record.id, index), {
			id: record.id,
			index,
			dataBase64: chunk.toString("base64")
		});
	}
	await metaStore.register(buildMetaKey(record.id), require_delegated_state.toPluginJsonValue({
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
async function readUploadRows(id, metaStore, chunkStore) {
	const meta = await metaStore.lookup(buildMetaKey(id));
	if (!meta) return;
	if (!Number.isSafeInteger(meta.chunkCount) || meta.chunkCount < 1 || meta.chunkCount > MAX_CHUNKS_PER_UPLOAD) return;
	const records = await chunkStore.lookupMany(Array.from({ length: meta.chunkCount }, (_, index) => buildChunkKey(id, index)));
	const chunks = [];
	for (let index = 0; index < meta.chunkCount; index += 1) {
		const result = records[index];
		if (result && !result.ok) throw result.error;
		const chunk = result?.value;
		if (!chunk || chunk.id !== id || chunk.index !== index) return;
		chunks.push(Buffer.from(chunk.dataBase64, "base64"));
	}
	const buffer = Buffer.concat(chunks, meta.byteLength);
	return {
		id: meta.id,
		buffer,
		filename: meta.filename,
		contentType: meta.contentType,
		conversationId: meta.conversationId,
		consentCardActivityId: meta.consentCardActivityId,
		createdAt: meta.createdAt
	};
}
async function pruneUploadStore(metaStore, chunkStore, extraChunkRows = 0) {
	const rows = await metaStore.entries();
	const liveRows = [];
	const now = Date.now();
	let liveChunkRows = 0;
	for (const row of rows) {
		if (now - row.value.createdAt > PENDING_UPLOAD_TTL_MS$1) {
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
async function storePendingUploadFs(upload) {
	const metaStore = createMetaStore();
	const chunkStore = createChunkStore();
	await require_delegated_state.withMSTeamsSqliteMutationLock(PENDING_UPLOAD_MUTATION_KEY, async () => {
		await registerUploadRows({
			id: upload.id,
			buffer: upload.buffer,
			filename: upload.filename,
			contentType: upload.contentType,
			conversationId: upload.conversationId,
			consentCardActivityId: upload.consentCardActivityId,
			createdAt: Date.now()
		}, metaStore, chunkStore);
		await pruneUploadStore(metaStore, chunkStore);
	});
}
async function getPendingUploadFs(id) {
	if (!id) return;
	const upload = await readUploadRows(id, createMetaStore(), createChunkStore());
	if (!upload) return;
	if (Date.now() - upload.createdAt > PENDING_UPLOAD_TTL_MS$1) {
		await removePendingUploadFs(id);
		return;
	}
	return upload;
}
async function removePendingUploadFs(id) {
	if (!id) return;
	const metaStore = createMetaStore();
	const chunkStore = createChunkStore();
	await require_delegated_state.withMSTeamsSqliteMutationLock(PENDING_UPLOAD_MUTATION_KEY, async () => {
		await deleteUploadRows(id, metaStore, chunkStore);
	});
}
async function setPendingUploadActivityIdFs(id, activityId) {
	const metaStore = createMetaStore();
	await require_delegated_state.withMSTeamsSqliteMutationLock(PENDING_UPLOAD_MUTATION_KEY, async () => {
		const record = await metaStore.lookup(buildMetaKey(id));
		if (!record || Date.now() - record.createdAt > PENDING_UPLOAD_TTL_MS$1) return;
		await metaStore.register(buildMetaKey(id), {
			...record,
			consentCardActivityId: activityId
		});
	});
}
// extensions/msteams/src/pending-uploads.ts
/**
* In-memory storage for files awaiting user consent in the FileConsentCard flow.
*
* When sending large files (>=4MB) in personal chats, Teams requires user consent
* before upload. This module stores the file data temporarily until the user
* accepts or declines, or until the TTL expires.
*/
const pendingUploads = (0, openclaw_plugin_sdk_global_singleton.resolveGlobalSingleton)(Symbol.for("openclaw.msteams.pendingUploadState"), () => /* @__PURE__ */ new Map(), (state) => {
	for (const { timer } of state.values()) clearTimeout(timer);
	state.clear();
});
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
	const timer = setTimeout(() => {
		pendingUploads.delete(id);
	}, PENDING_UPLOAD_TTL_MS);
	pendingUploads.set(id, {
		upload: entry,
		timer,
		expiresAtMonotonic: performance.now() + PENDING_UPLOAD_TTL_MS
	});
	return id;
}
function getPendingUpload(id) {
	if (!id) return;
	const slot = pendingUploads.get(id);
	if (!slot) return;
	if (performance.now() > slot.expiresAtMonotonic) {
		removePendingUpload(id);
		return;
	}
	return slot.upload;
}
/**
* Remove a pending upload (after successful upload or user decline).
* Also clears the TTL timer to prevent ghost Map deletions.
*/
function removePendingUpload(id) {
	if (id) {
		clearTimeout(pendingUploads.get(id)?.timer);
		pendingUploads.delete(id);
	}
}
function setPendingUploadActivityId(uploadId, activityId) {
	const entry = pendingUploads.get(uploadId)?.upload;
	if (entry) entry.consentCardActivityId = activityId;
}
// extensions/msteams/src/file-consent-helpers.ts
const FILE_CONSENT_THRESHOLD_BYTES = 4194304;
/** In-process replies keep consent bytes in memory; CLI sends use the persisted variant below. */
function prepareFileConsentActivity(params) {
	const { media, conversationId, description } = params;
	const uploadId = storePendingUpload({
		buffer: media.buffer,
		filename: media.filename,
		contentType: media.contentType,
		conversationId
	});
	return {
		activity: {
			type: "message",
			attachments: [buildFileConsentCard({
				filename: media.filename,
				description: description || `File: ${media.filename}`,
				sizeInBytes: media.buffer.length,
				context: { uploadId }
			})]
		},
		uploadId
	};
}
/** Persist consent bytes for callbacks received by another process after the CLI exits. */
async function prepareFileConsentActivityFs(params) {
	const result = prepareFileConsentActivity(params);
	await storePendingUploadFs({
		id: result.uploadId,
		...params.media,
		conversationId: params.conversationId
	});
	return result;
}
function requiresFileConsent(params) {
	const isPersonal = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(params.conversationType) === "personal";
	const isImage = params.contentType?.startsWith("image/") ?? false;
	const isLargeFile = params.bufferSize >= FILE_CONSENT_THRESHOLD_BYTES;
	return isPersonal && (isLargeFile || !isImage);
}
// extensions/msteams/src/format.ts
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
function restoreTokens(text, prefix, values) {
	if (!text.includes(prefix)) return text;
	const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	return text.replace(new RegExp(`${escapedPrefix}(\\d+)${TOKEN_END}`, "gu"), (_token, index) => values[Number(index)] ?? "");
}
function rewriteMarkdownIR(ir, edits) {
	const { text, mapOffset } = (0, openclaw_plugin_sdk_text_chunking.applyMarkdownTextEdits)(ir.text, edits);
	const exactEdits = new Map(edits.map((edit) => [`${edit.start}:${edit.end}`, edit]));
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
function formatMSTeamsMarkdown(markdown, tableMode) {
	if (markdown === "") return markdown;
	const rawTables = [];
	const escapedMarkdown = [];
	const codeRegions = [];
	const images = [];
	const mentions = [];
	const entities = [];
	const tokenPrefix = `\u{E000}msteamsformat-${(0, node_crypto.randomUUID)()}\u{E001}`;
	const mentionsProtected = protectDelimitedMarkdown(protectDelimitedMarkdown(markdown.replace(MARKDOWN_ENTITY_RE, (entity) => {
		const index = entities.push(entity) - 1;
		return `${tokenPrefix}h${index}${TOKEN_END}`;
	}), "![", `${tokenPrefix}i`, images), "@[", `${tokenPrefix}m`, mentions);
	const tableInput = (0, openclaw_plugin_sdk_text_chunking.convertMarkdownTables)(mentionsProtected, tableMode);
	let converted = tableInput;
	if (tableMode === "off" && tableInput.includes("|")) {
		const { tables } = (0, openclaw_plugin_sdk_text_chunking.markdownToIRWithMeta)(tableInput, {
			autolink: false,
			linkify: false,
			tableMode: "block"
		});
		let result = "";
		let cursor = 0;
		for (const table of tables) {
			const source = (0, openclaw_plugin_sdk_expect_runtime.expectDefined)((0, openclaw_plugin_sdk_markdown_table_runtime.getMarkdownTableSource)(table), "Markdown table source");
			const lineStart = Math.max(tableInput.lastIndexOf("\n", source.start - 1), tableInput.lastIndexOf("\r", source.start - 1)) + 1;
			const start = lineStart + (/^(?: {0,3}>[ \t]?)*/u.exec(tableInput.slice(lineStart, source.start))?.[0] ?? "").length;
			const end = source.end + (tableInput.slice(source.end, source.end + 2) === "\r\n" ? 1 : 0);
			const index = rawTables.push(tableInput.slice(start, end)) - 1;
			result += tableInput.slice(cursor, start) + `${tokenPrefix}t${index}${TOKEN_END}`;
			cursor = end;
		}
		converted = result + tableInput.slice(cursor);
	}
	const protectedMarkdown = converted.replace(ESCAPED_MARKDOWN_RE, (escaped) => {
		const index = escapedMarkdown.push(escaped) - 1;
		return `${tokenPrefix}e${index}${TOKEN_END}`;
	});
	const parsed = (0, openclaw_plugin_sdk_text_chunking.markdownToIR)(protectedMarkdown, {
		autolink: false,
		enableSpoilers: true,
		enableTaskLists: true,
		headingStyle: "rich",
		linkify: false,
		blockquotePrefix: ""
	});
	const protectedValues = [
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
	];
	const codeSpans = parsed.styles.filter((span) => span.style === "code" || span.style === "code_block");
	const codeBlocks = codeSpans.filter((span) => span.style === "code_block");
	const adjustedStyles = parsed.styles.flatMap((span) => {
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
	const codeRewritten = rewriteMarkdownIR({
		...parsed,
		styles: adjustedStyles
	}, codeSpans.map((span) => {
		const codeStyle = span.style === "code_block" ? "code_block" : "code";
		const source = protectedValues.reduce((text, protectedValue) => restoreTokens(text, protectedValue.prefix, protectedValue.values), parsed.text.slice(span.start, span.end));
		let quoteDepth = 0;
		let hasTrailingQuotedText = false;
		if (codeStyle === "code_block") {
			for (const candidate of parsed.styles) if (candidate.style === "blockquote" && span.start >= candidate.start) {
				if (span.start < candidate.end) quoteDepth += 1;
				hasTrailingQuotedText ||= candidate.end > span.end;
			}
		}
		const marker = "`".repeat(Math.max(codeStyle === "code_block" ? 3 : 1, Math.max(0, ...source.match(/`+/gu)?.map((run) => run.length) ?? []) + 1));
		let rendered;
		if (codeStyle === "code_block") rendered = `${marker}\n${source}${marker}`;
		else {
			const needsPadding = source.startsWith("`") || source.endsWith("`") || source.startsWith(" ") && source.endsWith(" ") && source.trim().length > 0;
			rendered = `${marker}${needsPadding ? " " : ""}${source}${needsPadding ? " " : ""}${marker}`;
		}
		let quoted = quoteDepth > 0 ? `${"> ".repeat(quoteDepth)}${rendered.replaceAll("\n", `\n${"> ".repeat(quoteDepth)}`)}` : rendered;
		const followedByText = codeStyle === "code_block" && span.end < parsed.text.length && parsed.text[span.end] !== "\n";
		if ((hasTrailingQuotedText || followedByText) && !quoted.endsWith("\n")) quoted += "\n";
		const index = codeRegions.push(quoted) - 1;
		return {
			start: span.start,
			end: span.end,
			text: `${tokenPrefix}c${index}${TOKEN_END}`
		};
	}));
	const codeProtected = {
		...codeRewritten,
		styles: codeRewritten.styles.filter((span) => span.style !== "code" && span.style !== "code_block")
	};
	const rewritten = rewriteMarkdownIR(codeProtected, codeProtected.styles.filter((span) => span.style === "blockquote").flatMap((span) => {
		const positions = [span.start];
		for (let index = span.start; index < span.end; index += 1) if (codeProtected.text[index] === "\n" && index + 1 < span.end) positions.push(index + 1);
		return positions.map((position) => ({
			start: position,
			end: position,
			text: "> "
		}));
	}));
	const ir = {
		...rewritten,
		styles: rewritten.styles.filter((span) => span.style !== "blockquote")
	};
	const rendered = (0, openclaw_plugin_sdk_text_chunking.renderMarkdownWithMarkers)(ir, {
		styleMarkers: MSTEAMS_MARKERS,
		escapeText: (text) => text,
		buildLink: (link) => ({
			start: link.start,
			end: link.end,
			open: "[",
			close: `](<${link.href.replace(/([\\<>])/gu, "\\$1")}>)`
		})
	}, MSTEAMS_FORMAT_CAPABILITIES);
	return protectedValues.reduce((text, { prefix, values }) => restoreTokens(text, prefix, values), restoreTokens(rendered, `${tokenPrefix}c`, codeRegions));
}
// extensions/msteams/src/graph-chat.ts
function buildTeamsFileInfoCard(file) {
	const rawETag = file.eTag;
	const uniqueId = rawETag.replace(/^["']|["']$/g, "").replace(/[{}]/g, "").split(",")[0] ?? rawETag;
	const lastDot = file.name.lastIndexOf(".");
	const fileType = lastDot >= 0 ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(file.name.slice(lastDot + 1)) : "";
	return buildFileInfoCard({
		filename: file.name,
		contentUrl: file.webDavUrl,
		uniqueId,
		fileType
	});
}
// extensions/msteams/src/sent-message-cache.ts
const TTL_MS = 864e5;
const MAX_ENTRIES = 2e4;
const PERSISTENT_MAX_ENTRIES = 1e3;
const PERSISTENT_NAMESPACE = "msteams.sent-messages";
const MSTEAMS_SENT_MESSAGES_KEY = Symbol.for("openclaw.msteamsSentMessages");
const namedAccountCaches = /* @__PURE__ */ new Map();
function createSentMessageCache(accountId) {
	const isDefault = accountId === "default";
	const accountDigest = isDefault ? void 0 : (0, openclaw_plugin_sdk_node_crypto_runtime.sha256Hex)(accountId);
	return (0, openclaw_plugin_sdk_dedupe_runtime.createPersistentDedupeCache)({
		globalKey: isDefault ? MSTEAMS_SENT_MESSAGES_KEY : Symbol.for(`openclaw.msteamsSentMessages.account.v1.${accountDigest}`),
		ttlMs: TTL_MS,
		maxSize: MAX_ENTRIES,
		persistent: {
			namespace: isDefault ? PERSISTENT_NAMESPACE : `${PERSISTENT_NAMESPACE}.account.v1.${accountDigest}`,
			maxEntries: PERSISTENT_MAX_ENTRIES,
			openStore: (options) => require_runtime.getOptionalMSTeamsRuntime()?.state.openKeyedStoreV2(options),
			logError: (0, openclaw_plugin_sdk_plugin_state_runtime.createPluginStateErrorReporter)(require_runtime.getOptionalMSTeamsRuntime, "msteams", "sent-message-state", "Microsoft Teams persistent sent-message state failed"),
			readTimestamp: (record) => record.sentAt
		}
	});
}
const defaultSentMessages = createSentMessageCache("default");
function getSentMessageCache(accountId) {
	if (accountId === "default") return defaultSentMessages;
	let cache = namedAccountCaches.get(accountId);
	if (!cache) {
		cache = createSentMessageCache(accountId);
		namedAccountCaches.set(accountId, cache);
	}
	return cache;
}
function makeKey(conversationId, messageId, botId) {
	return botId ? JSON.stringify([
		botId,
		conversationId,
		messageId
	]) : `${conversationId}:${messageId}`;
}
function recordMSTeamsSentMessage(conversationId, messageId, options) {
	if (!conversationId || !messageId || messageId === "unknown") return;
	const sentAt = Date.now();
	getSentMessageCache((0, openclaw_plugin_sdk_account_id.normalizeAccountId)(options?.accountId)).register(makeKey(conversationId, messageId, options?.botId), { sentAt }, { at: sentAt });
}
async function wasMSTeamsMessageSentWithPersistence(params) {
	if (!params.conversationId || !params.messageId) return false;
	return await getSentMessageCache((0, openclaw_plugin_sdk_account_id.normalizeAccountId)(params.accountId)).lookup(makeKey(params.conversationId, params.messageId, params.botId));
}
// extensions/msteams/src/sdk-proactive.ts
const loadMSTeamsApiModule = (0, openclaw_plugin_sdk_lazy_runtime.createLazyRuntimeModule)(() => import("@microsoft/teams.api"));
async function quoteMSTeamsActivity(activity, messageId) {
	const { MessageActivityInput } = await loadMSTeamsApiModule();
	if (typeof activity === "string") return new MessageActivityInput(activity).prependQuote(messageId);
	if (activity.type !== "message") return activity;
	return MessageActivityInput.from(activity).prependQuote(messageId);
}
function buildSdkConversationReference(source, options) {
	const bot = source.agent ?? source.bot;
	if (!bot?.id) throw new Error("Invalid stored reference: missing agent.id");
	const baseId = source.conversation.id.split(";")[0] ?? source.conversation.id;
	const threadActivityId = options?.threadActivityId;
	const conversationId = threadActivityId ? `${baseId};messageid=${threadActivityId}` : baseId;
	const tenantId = source.tenantId ?? source.conversation.tenantId;
	if (!source.serviceUrl) throw new Error("Invalid stored reference: missing serviceUrl");
	const serviceUrl = require_bot_framework_service_url.normalizeBotFrameworkServiceUrl(source.serviceUrl);
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
function getApiClientForReference(app, ref) {
	return app.api.serviceUrl === ref.serviceUrl ? app.api : app.api.fromServiceUrl({ serviceUrl: ref.serviceUrl });
}
async function getMSTeamsTeamDetailsWithReference(app, source, teamId, options) {
	return require_resolve_allowlist.withMSTeamsConnectorHandoff({ assertDirectAdapterHandoff: options?.assertDirectAdapterHandoff }, async (handoff) => {
		const api = getApiClientForReference(app, buildSdkConversationReference(source, options));
		require_resolve_allowlist.assertMSTeamsSendHandoff(handoff);
		return api.teams.getById(teamId);
	});
}
/** Opens (or returns) the bot's personal chat with a user who has the app installed. */
async function createMSTeamsPersonalConversation(app, params, options) {
	return require_resolve_allowlist.withMSTeamsConnectorHandoff(options, async (handoff) => {
		require_resolve_allowlist.assertMSTeamsSendHandoff(handoff);
		return app.api.fromServiceUrl({ serviceUrl: params.serviceUrl }).conversations.create({
			isGroup: false,
			members: [{ id: params.userId }],
			tenantId: params.tenantId,
			channelData: { tenant: { id: params.tenantId } }
		});
	});
}
async function sendMSTeamsActivityWithReference(app, source, activity, options) {
	return require_resolve_allowlist.withMSTeamsConnectorHandoff(options ?? {}, async (handoff) => {
		require_resolve_allowlist.assertMSTeamsSendHandoff(handoff);
		const ref = buildSdkConversationReference(source, options);
		const activities = getApiClientForReference(app, ref).conversations.activities(ref.conversation.id);
		const quotedActivity = options?.quoteActivityId ? await quoteMSTeamsActivity(activity, options.quoteActivityId) : activity;
		const activitySource = typeof quotedActivity === "string" ? {
			type: "message",
			text: quotedActivity
		} : quotedActivity;
		const existingChannelData = (0, openclaw_plugin_sdk_string_coerce_runtime.asOptionalRecord)(activitySource.channelData);
		const existingTenant = (0, openclaw_plugin_sdk_string_coerce_runtime.asOptionalRecord)(existingChannelData?.tenant);
		let channelData = existingChannelData ? { ...existingChannelData } : void 0;
		if (ref.tenantId) {
			channelData ??= {};
			channelData.tenant = existingTenant ? {
				...existingTenant,
				id: ref.tenantId
			} : { id: ref.tenantId };
		}
		const activityWithRef = {
			...activitySource,
			channelId: ref.channelId,
			from: ref.bot,
			recipient: ref.user,
			conversation: ref.conversation,
			...channelData ? { channelData } : {},
			locale: ref.locale,
			...ref.tenantId ? { tenantId: ref.tenantId } : {},
			...ref.aadObjectId ? { aadObjectId: ref.aadObjectId } : {}
		};
		const isTargeted = activityWithRef.recipient?.isTargeted === true;
		if (isTargeted && ref.conversation.conversationType === "personal") throw new Error("Targeted messages are not supported in 1:1 (personal) chats.");
		const activityId = typeof activityWithRef.id === "string" ? activityWithRef.id : void 0;
		require_resolve_allowlist.assertMSTeamsSendHandoff(handoff);
		if (activityId) {
			const res = isTargeted ? await activities.updateTargeted(activityId, activityWithRef) : await activities.update(activityId, activityWithRef);
			return {
				...activityWithRef,
				...res && typeof res === "object" ? res : {}
			};
		}
		const res = isTargeted ? await activities.createTargeted(activityWithRef) : await activities.create(activityWithRef);
		const conversationId = ref.conversation.id.split(";")[0] ?? ref.conversation.id;
		if (res.id && activityWithRef.type === "message" && ref.conversation.conversationType === "channel" && ref.conversation.id === conversationId) recordMSTeamsSentMessage(conversationId, res.id, {
			accountId: options?.accountId,
			botId: ref.bot.id
		});
		return {
			...activityWithRef,
			...res
		};
	});
}
async function updateMSTeamsActivityWithReference(app, source, activityId, activity, options) {
	const ref = buildSdkConversationReference(source, options);
	return getApiClientForReference(app, ref).conversations.activities(ref.conversation.id).update(activityId, activity);
}
async function deleteMSTeamsActivityWithReference(app, source, activityId, options) {
	const ref = buildSdkConversationReference(source, options);
	return getApiClientForReference(app, ref).conversations.activities(ref.conversation.id).delete(activityId);
}
// extensions/msteams/src/team-identity.ts
const teamGroupIdCache = /* @__PURE__ */ new Map();
const TEAM_GROUP_ID_CACHE_MAX_ENTRIES = 500;
function cacheTeamGroupId(conversationTeamId, groupId) {
	teamGroupIdCache.set(conversationTeamId, groupId);
	(0, openclaw_plugin_sdk_collection_runtime.pruneMapToMaxSize)(teamGroupIdCache, TEAM_GROUP_ID_CACHE_MAX_ENTRIES);
}
/** Resolve the Graph team GUID without ever treating a Bot Framework team ID as equivalent. */
async function resolveTeamGroupId(params) {
	const activityGroupId = params.aadGroupId?.trim();
	if (activityGroupId) {
		cacheTeamGroupId(params.conversationTeamId, activityGroupId);
		return activityGroupId;
	}
	const cached = teamGroupIdCache.get(params.conversationTeamId);
	if (cached) return cached;
	const getTeamDetails = params.getTeamDetails;
	if (!getTeamDetails) return;
	const groupId = (await require_resolve_allowlist.withMSTeamsRequestDeadline({
		deadline: params.deadline,
		label: "MS Teams team details",
		work: () => getTeamDetails(params.conversationTeamId)
	})).aadGroupId?.trim();
	if (!groupId) return;
	cacheTeamGroupId(params.conversationTeamId, groupId);
	return groupId;
}
// extensions/msteams/src/graph-upload.ts
const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
const GRAPH_BETA = "https://graph.microsoft.com/beta";
const GRAPH_SCOPE = "https://graph.microsoft.com";
const teamSiteIds = /* @__PURE__ */ new Map();
const TEAM_SITE_CACHE_MAX_ENTRIES = 500;
async function resolveMSTeamsSharePointSiteId(params) {
	if (params.siteId !== void 0) {
		const siteId = params.siteId.trim();
		if (!siteId) throw new Error("channels.msteams.sharePointSiteId must not be blank");
		return siteId;
	}
	const ref = params.conversationRef;
	const conversation = ref.conversation;
	const conversationId = conversation?.id;
	if (conversation?.conversationType?.toLowerCase() !== "channel" || !conversationId || !ref.teamId) throw new Error("channels.msteams.sharePointSiteId is required to send files to group chats or channels");
	require_resolve_allowlist.assertMSTeamsSendHandoff(params);
	const teamId = await resolveTeamGroupId({
		conversationTeamId: ref.teamId,
		getTeamDetails: (conversationTeamId) => getMSTeamsTeamDetailsWithReference(params.app, {
			...ref,
			conversation: {
				...conversation,
				id: conversationId
			}
		}, conversationTeamId, params)
	});
	if (!teamId) throw new Error("Unable to resolve the Teams group; set channels.msteams.sharePointSiteId");
	const channelId = conversationId.split(";")[0] ?? conversationId;
	if ((await requestSharePointJson(params, {
		url: `${GRAPH_ROOT}/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}?$select=membershipType`,
		error: "Get Teams channel failed; verify the existing ChannelSettings.Read.Group RSC grant",
		label: "msteams.graph-upload.channel"
	})).membershipType !== "standard") throw new Error("Automatic SharePoint site discovery supports standard channels only; set channels.msteams.sharePointSiteId");
	const cacheKey = JSON.stringify([
		params.accountId ?? "default",
		ref.tenantId ?? conversation.tenantId,
		(ref.agent ?? ref.bot)?.id,
		teamId
	]);
	const cached = teamSiteIds.get(cacheKey);
	if (cached) return cached;
	const site = await requestSharePointJson(params, {
		url: `${GRAPH_ROOT}/groups/${encodeURIComponent(teamId)}/sites/root`,
		error: "Resolve Teams SharePoint site failed",
		label: "msteams.graph-upload.teamSite"
	});
	if (!site.id?.trim()) throw new Error("Teams SharePoint site response missing id; set channels.msteams.sharePointSiteId");
	teamSiteIds.set(cacheKey, site.id);
	(0, openclaw_plugin_sdk_collection_runtime.pruneMapToMaxSize)(teamSiteIds, TEAM_SITE_CACHE_MAX_ENTRIES);
	return site.id;
}
const SHAREPOINT_REQUEST_TIMEOUT_LABEL = "MS Teams SharePoint request";
const SHAREPOINT_UPLOAD_TIMEOUT_LABEL = "MS Teams SharePoint upload";
const GRAPH_TOKEN_TIMEOUT_LABEL = "MS Teams Graph token acquisition";
async function requestSharePointJson(params, request) {
	return await require_resolve_allowlist.withMSTeamsAbortableRequestTimeout({
		label: request.timeoutMs !== void 0 ? SHAREPOINT_UPLOAD_TIMEOUT_LABEL : SHAREPOINT_REQUEST_TIMEOUT_LABEL,
		timeoutMs: request.timeoutMs,
		work: async (signal) => {
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const token = await require_resolve_allowlist.withMSTeamsRequestDeadline({
				label: GRAPH_TOKEN_TIMEOUT_LABEL,
				work: () => params.tokenProvider.getAccessToken(GRAPH_SCOPE)
			});
			require_resolve_allowlist.assertMSTeamsSendHandoff(params);
			const init = request.init?.();
			const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
				url: request.url,
				init: {
					...init,
					headers: {
						"User-Agent": require_resolve_allowlist.buildUserAgent(),
						Authorization: `Bearer ${token}`,
						...init?.headers
					},
					signal
				},
				mode: "trusted_env_proxy",
				beforeRequest: () => require_resolve_allowlist.assertMSTeamsSendHandoff(params),
				maxRedirects: 20,
				allowCrossOriginUnsafeRedirectReplay: true,
				auditContext: "msteams.graph-upload"
			});
			const res = (0, openclaw_plugin_sdk_fetch_runtime.responseWithRelease)(response, release);
			if (!res.ok) throw await (0, openclaw_plugin_sdk_provider_http.createProviderHttpError)(res, typeof request.error === "string" ? request.error : request.error(res));
			return await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(res, request.label, { chunkTimeoutMs: request.timeoutMs });
		}
	});
}
async function getDriveItemProperties(params) {
	const data = await requestSharePointJson(params, {
		url: `${GRAPH_ROOT}/sites/${params.siteId}/drive/items/${params.itemId}?$select=eTag,webDavUrl,name`,
		error: "Get driveItem properties failed",
		label: "msteams.graph-upload.getDriveItemProperties"
	});
	if (!data.eTag || !data.webDavUrl || !data.name) throw new Error("DriveItem response missing required properties (eTag, webDavUrl, or name)");
	return {
		eTag: data.eTag,
		webDavUrl: data.webDavUrl,
		name: data.name
	};
}
/**
* Upload a file to SharePoint and create a sharing link.
*
* For group chats, this creates a per-user sharing link scoped to chat members.
* For channels, this creates an organization-wide sharing link.
*/
async function uploadAndShareSharePoint(params) {
	const uploadPath = `/OpenClawShared/${encodeURIComponent(params.filename)}`;
	const data = await requestSharePointJson(params, {
		url: `${GRAPH_ROOT}/sites/${params.siteId}/drive/root:${uploadPath}:/content?@microsoft.graph.conflictBehavior=rename`,
		timeoutMs: require_resolve_allowlist.resolveMSTeamsSharePointUploadTimeoutMs(params.buffer.length),
		init: () => ({
			method: "PUT",
			headers: { "Content-Type": params.contentType ?? "application/octet-stream" },
			body: new Blob([(0, openclaw_plugin_sdk_blob_runtime.bufferToBlobPart)(params.buffer)])
		}),
		error: "SharePoint upload failed",
		label: "msteams.graph-upload.uploadSharePointFile"
	});
	if (!data.id) throw new Error("SharePoint upload response missing required fields");
	const itemId = data.id;
	let recipientObjectIds;
	if (params.usePerUserSharing && params.chatId) {
		recipientObjectIds = ((await requestSharePointJson(params, {
			url: `${GRAPH_ROOT}/chats/${params.chatId}/members`,
			error: (res) => res.status === 403 ? "Get chat members failed; verify Graph chat-member permissions and tenant access policies" : "Get chat members failed",
			label: "msteams.graph-upload.getChatMembers"
		})).value ?? []).flatMap((member) => member.userId ? [member.userId] : []);
		if (recipientObjectIds.length === 0) throw new Error("MS Teams chat member lookup returned no recipients");
	}
	const apiRoot = recipientObjectIds ? GRAPH_BETA : GRAPH_ROOT;
	const body = {
		type: "view",
		scope: recipientObjectIds ? "users" : "organization"
	};
	if (recipientObjectIds) body.recipients = recipientObjectIds.map((id) => ({ objectId: id }));
	await requestSharePointJson(params, {
		url: `${apiRoot}/sites/${params.siteId}/drive/items/${itemId}/createLink`,
		init: () => ({
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		}),
		error: "Create SharePoint sharing link failed",
		label: "msteams.graph-upload.createSharePointSharingLink"
	});
	return { itemId };
}
// extensions/msteams/src/media-helpers.ts
const MSTEAMS_MAX_MEDIA_BYTES = 104857600;
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
function isLocalPath(url) {
	return /^file:\/\//iu.test(url) || url.startsWith("/") || url.startsWith("~") || url.startsWith("\\") || /^[a-zA-Z]:[\\/]/.test(url);
}
function extractMessageId(response) {
	if (!response || typeof response !== "object" || !("id" in response)) return null;
	const { id } = response;
	return typeof id === "string" && id ? id : null;
}
// extensions/msteams/src/message-activity.ts
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
const AI_GENERATED_ENTITY = {
	type: "https://schema.org/Message",
	"@type": "Message",
	"@context": "https://schema.org",
	"@id": "",
	additionalType: ["AIGeneratedContent"]
};
/**
* Convert @[Name](id) into matching <at> text and mention entities.
* Only matches where the id looks like a real Teams user/bot ID are treated
* as mentions. This avoids false positives from documentation or code samples
* embedded in the message (e.g. `@[表示名](ユーザーID)` in backticks).
*/
/** Build final transport text and its matching entities after Markdown rendering. */
function buildMSTeamsMessageActivity(text) {
	const sourceText = text ?? "";
	const entities = [];
	let formattedText = "";
	let copiedUntil = 0;
	let start = sourceText.indexOf("@[");
	while (start !== -1) {
		let close = start + 2;
		while (close < sourceText.length && sourceText[close] !== "]") close += sourceText[close] === "\\" ? 2 : 1;
		if (close >= sourceText.length) break;
		if (close === start + 2 || sourceText[close + 1] !== "(" || sourceText[close + 2] === ")") {
			start = sourceText.indexOf("@[", close + 1);
			continue;
		}
		const idEnd = sourceText.indexOf(")", close + 2);
		if (idEnd === -1) break;
		const trimmedId = sourceText.slice(close + 2, idEnd).trim();
		if (TEAMS_BOT_ID_PATTERN.test(trimmedId) || AAD_OBJECT_ID_PATTERN.test(trimmedId)) {
			const trimmedName = sourceText.slice(start + 2, close).replace(/\\([\\[\]])/g, "$1").trim();
			const mentionTag = `<at>${trimmedName}</at>`;
			entities.push({
				type: "mention",
				text: mentionTag,
				mentioned: {
					id: trimmedId,
					name: trimmedName
				}
			});
			formattedText += sourceText.slice(copiedUntil, start) + mentionTag;
			copiedUntil = idEnd + 1;
		}
		start = sourceText.indexOf("@[", idEnd + 1);
	}
	formattedText += sourceText.slice(copiedUntil);
	return {
		type: "message",
		...text === void 0 ? {} : { text: formattedText },
		entities: [...entities, AI_GENERATED_ENTITY]
	};
}
function buildMSTeamsAdaptiveCardActivity(card) {
	return {
		type: "message",
		attachments: [{
			contentType: "application/vnd.microsoft.card.adaptive",
			content: card
		}]
	};
}
// extensions/msteams/src/messenger.ts
const MSTEAMS_SEND_ATTEMPTS = 3;
const MSTEAMS_SEND_RETRY_MAX_DELAY_MS = 1e4;
function buildConversationReference(ref) {
	const conversationId = ref.conversation?.id?.trim();
	if (!conversationId) throw new Error("Invalid stored reference: missing conversation.id");
	const agent = ref.agent ?? ref.bot;
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
			id: require_resolve_allowlist.normalizeMSTeamsConversationId(conversationId),
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
function renderReplyPayloadsToMessages(replies, options) {
	const out = [];
	const chunkLimit = Math.min(options.textChunkLimit, 4e3);
	const chunkMode = options.chunkMode ?? "length";
	for (const payload of replies) {
		const reply = (0, openclaw_plugin_sdk_reply_payload.resolveSendableOutboundReplyParts)(payload, { text: formatMSTeamsMarkdown(payload.text ?? "", options.tableMode) });
		if (!reply.hasContent && !payload.presentation) continue;
		if (reply.text) {
			const chunks = (0, openclaw_plugin_sdk_reply_chunking.chunkMarkdownTextWithMode)(reply.text, chunkLimit, chunkMode);
			for (const chunk of chunks) {
				const text = chunk.trim();
				if (text) out.push({ text });
			}
		}
		if (payload.presentation) out.push({ adaptiveCard: require_presentation.buildMSTeamsPresentationCard({ presentation: payload.presentation }) });
		out.push(...reply.mediaUrls.map((mediaUrl) => ({ mediaUrl })));
	}
	return out;
}
async function sendMSTeamsMessages(params) {
	const messages = params.messages.filter((m) => m.text && m.text.trim().length > 0 || m.mediaUrl || m.adaptiveCard);
	if (messages.length === 0) return [];
	let providerDispatchStarted = false;
	const sendMessageInContext = async (sendFn, message, messageIndex) => {
		async function buildActivity() {
			const msg = message;
			const { conversationRef, tokenProvider, sharePointSiteId, mediaMaxBytes } = params;
			const options = {
				feedbackLoopEnabled: params.feedbackLoopEnabled,
				assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
			};
			const activity = buildMSTeamsMessageActivity(msg.text);
			if (msg.adaptiveCard) Object.assign(activity, buildMSTeamsAdaptiveCardActivity(msg.adaptiveCard));
			activity.channelData = { feedbackLoopEnabled: options?.feedbackLoopEnabled ?? false };
			if (msg.mediaUrl) {
				let contentUrl = msg.mediaUrl;
				let contentType = await getMimeType(msg.mediaUrl);
				let fileName = await extractFilename(msg.mediaUrl);
				if (isLocalPath(msg.mediaUrl)) {
					const maxBytes = mediaMaxBytes ?? 104857600;
					const media = await (0, openclaw_plugin_sdk_web_media.loadWebMedia)(msg.mediaUrl, maxBytes);
					contentType = media.contentType ?? contentType;
					fileName = media.fileName ?? fileName;
					const conversationType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(conversationRef.conversation?.conversationType);
					const isPersonal = conversationType === "personal";
					const isImage = media.kind === "image";
					if (requiresFileConsent({
						conversationType,
						contentType,
						bufferSize: media.buffer.length
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
						return {
							activity: consentActivity,
							pendingUploadId: uploadId
						};
					}
					if (!isPersonal && !isImage) {
						if (!tokenProvider) throw new Error("MS Teams Graph token provider unavailable for SharePoint file send");
						const siteId = await resolveMSTeamsSharePointSiteId({
							...options,
							siteId: sharePointSiteId,
							accountId: params.accountId,
							app: params.app,
							conversationRef,
							tokenProvider,
							serviceUrlBoundary: params.serviceUrlBoundary
						});
						const chatId = conversationRef.conversation?.id;
						const uploaded = await uploadAndShareSharePoint({
							assertDirectAdapterHandoff: options?.assertDirectAdapterHandoff,
							buffer: media.buffer,
							filename: fileName,
							contentType,
							tokenProvider,
							siteId,
							chatId,
							usePerUserSharing: conversationType === "groupchat"
						});
						activity.attachments = [buildTeamsFileInfoCard(await getDriveItemProperties({
							assertDirectAdapterHandoff: options?.assertDirectAdapterHandoff,
							siteId,
							itemId: uploaded.itemId,
							tokenProvider
						}))];
						return { activity };
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
			return { activity };
		}
		let prepared;
		let response;
		try {
			response = await (0, openclaw_plugin_sdk_retry_runtime.retryAsync)(async () => {
				require_resolve_allowlist.assertMSTeamsSendHandoff(params);
				prepared ??= await buildActivity();
				require_resolve_allowlist.assertMSTeamsSendHandoff(params);
				providerDispatchStarted = true;
				return await sendFn(prepared.activity);
			}, {
				attempts: MSTEAMS_SEND_ATTEMPTS,
				minDelayMs: 0,
				maxDelayMs: MSTEAMS_SEND_RETRY_MAX_DELAY_MS,
				shouldRetry: (err) => require_channel_setup.classifyMSTeamsSendError(err).kind === "replay-safe",
				delayMs: ({ attempt, err }) => {
					const classification = require_channel_setup.classifyMSTeamsSendError(err);
					const retryAfterMs = classification.kind === "replay-safe" ? classification.retryAfterMs : void 0;
					return Math.min(retryAfterMs ?? 250 * 2 ** (attempt - 1), MSTEAMS_SEND_RETRY_MAX_DELAY_MS);
				},
				onRetry: ({ attempt, err, delayMs }) => {
					params.onRetry?.({
						messageIndex,
						messageCount: messages.length,
						nextAttempt: attempt + 1,
						maxAttempts: MSTEAMS_SEND_ATTEMPTS,
						delayMs,
						classification: require_channel_setup.classifyMSTeamsSendError(err)
					});
				},
				sleep: (delayMs) => (0, openclaw_plugin_sdk_runtime_env.sleepWithAbort)(delayMs)
			});
		} catch (error) {
			if (!providerDispatchStarted && !(error instanceof openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError)) throw new openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Teams activity preparation failed", { cause: error });
			throw error;
		}
		const messageId = extractMessageId(response) ?? "unknown";
		await params.onMessageSent?.(messageId, messageIndex);
		const pendingUploadId = prepared?.pendingUploadId;
		if (pendingUploadId && messageId !== "unknown") setPendingUploadActivityId(pendingUploadId, messageId);
		return messageId;
	};
	let sendFn;
	const ctx = params.replyStyle === "thread" ? params.context : void 0;
	if (ctx) sendFn = (activity) => require_resolve_allowlist.withMSTeamsConnectorHandoff(params, () => ctx.sendActivity(activity));
	else {
		let baseRef;
		try {
			baseRef = buildConversationReference(params.conversationRef);
		} catch (error) {
			throw new openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError(error instanceof Error ? error.message : "Teams conversation preparation failed", { cause: error });
		}
		const isChannel = params.conversationRef.conversation?.conversationType === "channel";
		const threadActivityId = params.replyStyle === "thread" && isChannel ? params.conversationRef.threadId ?? params.conversationRef.activityId : void 0;
		sendFn = (activity) => sendMSTeamsActivityWithReference(params.app, baseRef, activity, {
			accountId: params.accountId,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
			onPlatformSendDispatch: params.onPlatformSendDispatch,
			threadActivityId,
			serviceUrlBoundary: params.serviceUrlBoundary
		});
	}
	const messageIds = [];
	for (const [idx, message] of messages.entries()) messageIds.push(await sendMessageInContext(sendFn, message, idx));
	return messageIds;
}
// extensions/msteams/src/polls.ts
const MSTEAMS_POLLS_NAMESPACE = "polls";
const MSTEAMS_POLL_VOTE_BUCKETS_NAMESPACE = "poll-vote-buckets";
const MSTEAMS_MAX_POLLS = 1e3;
const MSTEAMS_SQLITE_MAX_POLL_ROWS = 2e3;
const MSTEAMS_POLL_VOTE_BUCKET_COUNT = 32;
const MSTEAMS_MAX_POLL_VOTE_BUCKET_ROWS = 1001 * MSTEAMS_POLL_VOTE_BUCKET_COUNT;
const MSTEAMS_POLL_TTL_MS = 2592e6;
function normalizeChoiceValue(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed ? trimmed : null;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return null;
}
function extractSelections(value) {
	if (Array.isArray(value)) return value.map(normalizeChoiceValue).filter((entry) => Boolean(entry));
	const normalized = normalizeChoiceValue(value);
	if (!normalized) return [];
	if (normalized.includes(",")) return (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeStringEntries)(normalized.split(","));
	return [normalized];
}
function readNestedValue(value, keys) {
	let current = value;
	for (const key of keys) {
		if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(current)) return;
		current = current[key];
	}
	return current;
}
function readNestedString(value, keys) {
	return (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(readNestedValue(value, keys));
}
function extractMSTeamsPollVote(activity) {
	const value = activity?.value;
	if (!value || !(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value)) return null;
	const pollId = readNestedString(value, ["openclawPollId"]) ?? readNestedString(value, ["pollId"]) ?? readNestedString(value, ["openclaw", "pollId"]) ?? readNestedString(value, [
		"openclaw",
		"poll",
		"id"
	]) ?? readNestedString(value, ["data", "openclawPollId"]) ?? readNestedString(value, ["data", "pollId"]) ?? readNestedString(value, [
		"data",
		"openclaw",
		"pollId"
	]) ?? readNestedString(value, [
		"action",
		"data",
		"openclawPollId"
	]) ?? readNestedString(value, [
		"action",
		"data",
		"pollId"
	]);
	if (!pollId) return null;
	const selections = [
		value.choices,
		readNestedValue(value, ["data", "choices"]),
		readNestedValue(value, [
			"action",
			"data",
			"choices"
		])
	].map(extractSelections).find((choices) => choices.length > 0) ?? [];
	if (selections.length === 0) return null;
	return {
		pollId,
		selections
	};
}
function buildMSTeamsPollCard(params) {
	const pollId = node_crypto.default.randomUUID();
	const maxSelections = params.maxSelections !== void 0 && params.maxSelections > 1 ? Math.floor(params.maxSelections) : 1;
	const cappedMaxSelections = Math.min(Math.max(1, maxSelections), params.options.length);
	const choices = params.options.map((option, index) => ({
		title: option,
		value: String(index)
	}));
	const hint = cappedMaxSelections > 1 ? `Select up to ${cappedMaxSelections} options.` : "Select one option.";
	return {
		pollId,
		card: {
			type: "AdaptiveCard",
			version: "1.5",
			body: [
				{
					type: "TextBlock",
					text: params.question,
					wrap: true,
					weight: "Bolder",
					size: "Medium"
				},
				{
					type: "Input.ChoiceSet",
					id: "choices",
					isMultiSelect: cappedMaxSelections > 1,
					style: "expanded",
					choices
				},
				{
					type: "TextBlock",
					text: hint,
					wrap: true,
					isSubtle: true,
					spacing: "Small"
				}
			],
			actions: [{
				type: "Action.Execute",
				title: "Vote",
				verb: "openclaw.poll.vote",
				data: {
					openclawPollId: pollId,
					pollId
				}
			}]
		}
	};
}
function isPollExpired(poll) {
	const cutoff = Date.now() - MSTEAMS_POLL_TTL_MS;
	return !(((0, openclaw_plugin_sdk_number_runtime.parseDateStringTimestampMs)(poll.updatedAt ?? poll.createdAt) ?? 0) >= cutoff);
}
function normalizeMSTeamsPollSelections(poll, selections) {
	const maxSelections = Math.max(1, poll.maxSelections);
	const mapped = selections.map((entry) => (0, openclaw_plugin_sdk_number_runtime.parseStrictNonNegativeInteger)(entry)).filter((value) => value !== void 0 && value < poll.options.length).map((value) => String(value));
	return (0, openclaw_plugin_sdk_string_coerce_runtime.uniqueStrings)(mapped).slice(0, maxSelections);
}
function hashMSTeamsPollVote(pollId, voterId) {
	return node_crypto.default.createHash("sha256").update(pollId).update("\0").update(voterId).digest("hex");
}
function buildMSTeamsPollStateKey(pollId) {
	return node_crypto.default.createHash("sha256").update(pollId).digest("hex");
}
function selectMSTeamsPollVoteBucket(pollId, voterId) {
	const bucket = Number.parseInt(hashMSTeamsPollVote(pollId, voterId).slice(0, 8), 16);
	return String(bucket % MSTEAMS_POLL_VOTE_BUCKET_COUNT).padStart(4, "0");
}
function buildMSTeamsPollVoteBucketKey(pollId, bucket) {
	return `${buildMSTeamsPollStateKey(pollId)}:${bucket}`;
}
function createMSTeamsPollStoreState(params) {
	const namespace = require_delegated_state.resolveMSTeamsAccountStateNamespace(MSTEAMS_POLLS_NAMESPACE, params?.accountId);
	const pollStore = require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace,
		maxEntries: MSTEAMS_SQLITE_MAX_POLL_ROWS
	});
	const voteBucketStore = require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: require_delegated_state.resolveMSTeamsAccountStateNamespace(MSTEAMS_POLL_VOTE_BUCKETS_NAMESPACE, params?.accountId),
		maxEntries: MSTEAMS_MAX_POLL_VOTE_BUCKET_ROWS
	});
	const deletePollVotes = async (pollId, cachedRows) => {
		for (const row of cachedRows?.values() ?? await voteBucketStore.entries()) if (row.value.pollId === pollId) {
			await voteBucketStore.delete(row.key);
			cachedRows?.delete(row.key);
		}
	};
	const prunePollStoreToLimit = async () => {
		let voteRows;
		const deletePrunedPollVotes = async (pollId) => {
			voteRows ??= new Map((await voteBucketStore.entries()).map((row) => [row.key, row]));
			await deletePollVotes(pollId, voteRows);
		};
		const rows = [];
		for (const row of await pollStore.entries()) {
			if (isPollExpired(row.value)) {
				await pollStore.delete(row.key);
				await deletePrunedPollVotes(row.value.id);
				continue;
			}
			rows.push(row);
		}
		if (rows.length <= MSTEAMS_MAX_POLLS) return;
		const sorted = rows.toSorted((a, b) => {
			return ((0, openclaw_plugin_sdk_number_runtime.parseDateStringTimestampMs)(a.value.updatedAt ?? a.value.createdAt) ?? 0) - ((0, openclaw_plugin_sdk_number_runtime.parseDateStringTimestampMs)(b.value.updatedAt ?? b.value.createdAt) ?? 0) || a.key.localeCompare(b.key);
		});
		for (const row of sorted.slice(0, rows.length - MSTEAMS_MAX_POLLS)) {
			await pollStore.delete(row.key);
			await deletePrunedPollVotes(row.value.id);
		}
	};
	const createPoll = async (poll) => {
		await require_delegated_state.withMSTeamsSqliteMutationLock(namespace, async () => {
			await pollStore.register(buildMSTeamsPollStateKey(poll.id), require_delegated_state.toPluginJsonValue(poll));
			await deletePollVotes(poll.id);
			await prunePollStoreToLimit();
		});
	};
	const getPoll = async (pollId) => {
		const poll = await pollStore.lookup(buildMSTeamsPollStateKey(pollId));
		if (!poll) return null;
		if (isPollExpired(poll)) return null;
		return poll;
	};
	const recordVote = async (vote) => {
		return await require_delegated_state.withMSTeamsSqliteMutationLock(namespace, async () => {
			const pollKey = buildMSTeamsPollStateKey(vote.pollId);
			const poll = await pollStore.lookup(pollKey);
			if (!poll) return null;
			if (isPollExpired(poll)) {
				await pollStore.delete(pollKey);
				await deletePollVotes(vote.pollId);
				return null;
			}
			const normalized = normalizeMSTeamsPollSelections(poll, vote.selections);
			const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
			poll.updatedAt = updatedAt;
			await pollStore.register(pollKey, poll);
			const pollId = vote.pollId;
			const voterId = vote.voterId;
			const bucket = selectMSTeamsPollVoteBucket(pollId, voterId);
			const key = buildMSTeamsPollVoteBucketKey(pollId, bucket);
			const existing = await voteBucketStore.lookup(key);
			await voteBucketStore.register(key, {
				pollId,
				bucket,
				votes: {
					...existing?.votes,
					[voterId]: normalized
				},
				updatedAt
			});
			await prunePollStoreToLimit();
			return true;
		});
	};
	return {
		createPoll,
		getPoll,
		recordVote
	};
}
// extensions/msteams/src/conversation-store-state.ts
const MSTEAMS_CONVERSATIONS_NAMESPACE = "conversations";
const MSTEAMS_MAX_CONVERSATIONS = 1e3;
const MSTEAMS_SQLITE_MAX_CONVERSATION_ROWS = 2e3;
const MSTEAMS_CONVERSATION_TTL_MS = 31536e6;
function getStoredConversationId(reference) {
	const rawId = reference.conversation?.id;
	return rawId ? require_resolve_allowlist.normalizeMSTeamsConversationId(rawId) : null;
}
function createMSTeamsConversationStoreState(params) {
	const namespace = require_delegated_state.resolveMSTeamsAccountStateNamespace(MSTEAMS_CONVERSATIONS_NAMESPACE, params?.accountId);
	const conversationStore = require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace,
		maxEntries: MSTEAMS_SQLITE_MAX_CONVERSATION_ROWS
	});
	const isExpired = (reference) => {
		const lastSeenAt = (0, openclaw_plugin_sdk_number_runtime.parseDateStringTimestampMs)(reference.lastSeenAt);
		return lastSeenAt != null && Date.now() - lastSeenAt > MSTEAMS_CONVERSATION_TTL_MS;
	};
	const lookupStored = async (conversationId) => {
		const normalizedId = require_resolve_allowlist.normalizeMSTeamsConversationId(conversationId);
		const value = await conversationStore.lookup((0, openclaw_plugin_sdk_node_crypto_runtime.sha256Hex)(normalizedId));
		return value && !isExpired(value) ? value : null;
	};
	const list = async () => {
		const rows = await conversationStore.entries();
		const kept = [];
		for (const row of rows) {
			if (isExpired(row.value)) continue;
			const conversationId = getStoredConversationId(row.value);
			if (conversationId) kept.push({
				conversationId,
				reference: row.value
			});
		}
		return kept;
	};
	const register = async (conversationId, reference) => {
		const normalizedId = require_resolve_allowlist.normalizeMSTeamsConversationId(conversationId);
		await conversationStore.register((0, openclaw_plugin_sdk_node_crypto_runtime.sha256Hex)(normalizedId), require_delegated_state.toPluginJsonValue({
			...reference,
			conversation: {
				...reference.conversation,
				id: normalizedId
			}
		}));
		const rows = [];
		for (const row of await conversationStore.entries()) {
			if (isExpired(row.value)) {
				await conversationStore.delete(row.key);
				continue;
			}
			rows.push(row);
		}
		if (rows.length <= MSTEAMS_MAX_CONVERSATIONS) return;
		rows.sort((a, b) => {
			const aTs = (0, openclaw_plugin_sdk_number_runtime.parseDateStringTimestampMs)(a.value.lastSeenAt) ?? 0;
			const bTs = (0, openclaw_plugin_sdk_number_runtime.parseDateStringTimestampMs)(b.value.lastSeenAt) ?? 0;
			const aId = getStoredConversationId(a.value) ?? a.key;
			const bId = getStoredConversationId(b.value) ?? b.key;
			return aTs - bTs || aId.localeCompare(bId);
		});
		for (const row of rows.slice(0, rows.length - MSTEAMS_MAX_CONVERSATIONS)) await conversationStore.delete(row.key);
	};
	const findPreferredDmByUserId = async (id) => {
		const entries = await list();
		const target = id.trim();
		if (!target) return null;
		let preferred = null;
		let preferredIsPersonal = false;
		let preferredTimestamp = 0;
		for (const entry of entries) {
			if (entry.reference.user?.aadObjectId !== target && entry.reference.user?.id !== target) continue;
			const convType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(entry.reference.conversation?.conversationType);
			if (convType === "channel" || convType === "groupchat") continue;
			const isPersonal = convType === "personal";
			const timestamp = (0, openclaw_plugin_sdk_number_runtime.parseDateStringTimestampMs)(entry.reference.lastSeenAt) ?? 0;
			if (!preferred || isPersonal && !preferredIsPersonal || isPersonal === preferredIsPersonal && timestamp > preferredTimestamp) {
				preferred = entry;
				preferredIsPersonal = isPersonal;
				preferredTimestamp = timestamp;
			}
		}
		return preferred;
	};
	const upsert = async (conversationId, reference) => {
		const normalizedId = require_resolve_allowlist.normalizeMSTeamsConversationId(conversationId);
		await require_delegated_state.withMSTeamsSqliteMutationLock(namespace, async () => {
			const previous = await lookupStored(normalizedId) ?? void 0;
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			await register(normalizedId, {
				...previous?.timezone && !reference.timezone ? { timezone: previous.timezone } : {},
				...previous?.tenantId && !reference.tenantId ? { tenantId: previous.tenantId } : {},
				...previous?.aadObjectId && !reference.aadObjectId ? { aadObjectId: previous.aadObjectId } : {},
				...reference,
				lastSeenAt: nowIso
			});
		});
	};
	const remove = async (conversationId) => {
		const normalizedId = require_resolve_allowlist.normalizeMSTeamsConversationId(conversationId);
		return await require_delegated_state.withMSTeamsSqliteMutationLock(namespace, async () => {
			return await conversationStore.delete((0, openclaw_plugin_sdk_node_crypto_runtime.sha256Hex)(normalizedId));
		});
	};
	return {
		upsert,
		get: lookupStored,
		list,
		remove,
		findPreferredDmByUserId
	};
}
Object.defineProperty(exports, "MSTEAMS_MAX_MEDIA_BYTES", {
	enumerable: true,
	get: function() {
		return MSTEAMS_MAX_MEDIA_BYTES;
	}
});
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
Object.defineProperty(exports, "buildMSTeamsAdaptiveCardActivity", {
	enumerable: true,
	get: function() {
		return buildMSTeamsAdaptiveCardActivity;
	}
});
Object.defineProperty(exports, "buildMSTeamsMessageActivity", {
	enumerable: true,
	get: function() {
		return buildMSTeamsMessageActivity;
	}
});
Object.defineProperty(exports, "buildMSTeamsPollCard", {
	enumerable: true,
	get: function() {
		return buildMSTeamsPollCard;
	}
});
Object.defineProperty(exports, "buildTeamsFileInfoCard", {
	enumerable: true,
	get: function() {
		return buildTeamsFileInfoCard;
	}
});
Object.defineProperty(exports, "createMSTeamsConversationStoreState", {
	enumerable: true,
	get: function() {
		return createMSTeamsConversationStoreState;
	}
});
Object.defineProperty(exports, "createMSTeamsPersonalConversation", {
	enumerable: true,
	get: function() {
		return createMSTeamsPersonalConversation;
	}
});
Object.defineProperty(exports, "createMSTeamsPollStoreState", {
	enumerable: true,
	get: function() {
		return createMSTeamsPollStoreState;
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
Object.defineProperty(exports, "extractMSTeamsPollVote", {
	enumerable: true,
	get: function() {
		return extractMSTeamsPollVote;
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
Object.defineProperty(exports, "recordMSTeamsSentMessage", {
	enumerable: true,
	get: function() {
		return recordMSTeamsSentMessage;
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
Object.defineProperty(exports, "requiresFileConsent", {
	enumerable: true,
	get: function() {
		return requiresFileConsent;
	}
});
Object.defineProperty(exports, "resolveMSTeamsSharePointSiteId", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsSharePointSiteId;
	}
});
Object.defineProperty(exports, "resolveTeamGroupId", {
	enumerable: true,
	get: function() {
		return resolveTeamGroupId;
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
Object.defineProperty(exports, "wasMSTeamsMessageSentWithPersistence", {
	enumerable: true,
	get: function() {
		return wasMSTeamsMessageSentWithPersistence;
	}
});
