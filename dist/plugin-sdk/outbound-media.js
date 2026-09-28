import { f as sanitizeUntrustedFileName } from "../fs-safe-advanced-CJC-NYf3.mjs";
import { d as normalizeMimeType } from "../mime-1zBUMwu6.mjs";
import { t as buildOutboundMediaLoadOptions } from "../load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "../web-media-BGRqIyLZ.mjs";
import "../web-media-C2tn59_W.mjs";
import { randomBytes } from "node:crypto";
//#region src/plugin-sdk/outbound-media.ts
/** Load outbound media from a remote URL or approved local path using the shared web-media policy. */
async function loadOutboundMediaFromUrl(mediaUrl, options = {}) {
	return await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes: options.maxBytes,
		mediaAccess: options.mediaAccess,
		mediaLocalRoots: options.mediaLocalRoots,
		mediaReadFile: options.mediaReadFile,
		workspaceDir: options.workspaceDir,
		proxyUrl: options.proxyUrl,
		fetchImpl: options.fetchImpl,
		requestInit: options.requestInit,
		optimizeImages: options.optimizeImages,
		trustExplicitProxyDns: options.trustExplicitProxyDns
	}));
}
const DEFAULT_HOSTED_OUTBOUND_MEDIA_RAW_CHUNK_BYTES = 36864;
const DEFAULT_HOSTED_OUTBOUND_MEDIA_MAX_ENTRIES = 64;
const DEFAULT_HOSTED_OUTBOUND_MEDIA_CHUNK_ROWS_PER_ENTRY_BUDGET = 512;
const HOSTED_OUTBOUND_MEDIA_METADATA_TTL_GRACE_MS = 6e4;
function createHostedOutboundMediaId() {
	return randomBytes(12).toString("hex");
}
function createHostedOutboundMediaToken() {
	return randomBytes(24).toString("hex");
}
function buildHostedOutboundMediaMetaKey(id) {
	return `media:${id}:meta`;
}
function buildHostedOutboundMediaChunkKey(id, index) {
	return `media:${id}:chunk:${String(index).padStart(4, "0")}`;
}
function parseHostedOutboundMediaMetaKey(key) {
	if (!key.startsWith("media:") || !key.endsWith(":meta")) return;
	return key.slice(6, -5) || void 0;
}
function isFutureHostedOutboundMediaExpiry(expiresAt, nowMs) {
	return typeof expiresAt === "number" && Number.isSafeInteger(expiresAt) && expiresAt > nowMs;
}
function isRetainedHostedOutboundMediaExpiry(expiresAt, nowMs, postExpiryRetentionMs) {
	return typeof expiresAt === "number" && Number.isSafeInteger(expiresAt) && (expiresAt > nowMs || nowMs - expiresAt < postExpiryRetentionMs);
}
function createHostedOutboundMediaMetaRecord(params) {
	return {
		id: params.id,
		routePath: params.routePath,
		token: params.token,
		...params.contentType ? { contentType: params.contentType } : {},
		...params.fileName ? { fileName: params.fileName } : {},
		expiresAt: params.expiresAt,
		chunkCount: params.chunkCount,
		byteLength: params.byteLength
	};
}
function createHostedOutboundMediaMetadata(meta) {
	return {
		routePath: meta.routePath,
		token: meta.token,
		...meta.contentType ? { contentType: meta.contentType } : {},
		...meta.fileName ? { fileName: meta.fileName } : {},
		expiresAt: meta.expiresAt,
		byteLength: meta.byteLength
	};
}
async function deleteHostedOutboundMediaRows(id, metadataStore, chunkStore, knownChunkCount) {
	const metaKey = buildHostedOutboundMediaMetaKey(id);
	const chunkCount = (await metadataStore.lookup(metaKey))?.chunkCount ?? knownChunkCount;
	if (chunkCount != null) for (let index = 0; index < chunkCount; index += 1) await chunkStore.delete(buildHostedOutboundMediaChunkKey(id, index));
	await metadataStore.delete(metaKey);
}
function createHostedOutboundMediaStore(options) {
	const rawChunkBytes = options.rawChunkBytes ?? DEFAULT_HOSTED_OUTBOUND_MEDIA_RAW_CHUNK_BYTES;
	const maxEntries = options.maxEntries ?? DEFAULT_HOSTED_OUTBOUND_MEDIA_MAX_ENTRIES;
	const chunkRowsPerEntryBudget = options.chunkRowsPerEntryBudget ?? DEFAULT_HOSTED_OUTBOUND_MEDIA_CHUNK_ROWS_PER_ENTRY_BUDGET;
	const maxChunkRows = options.maxChunkRows ?? maxEntries * chunkRowsPerEntryBudget;
	const overflowPolicy = options.overflowPolicy ?? "evict-oldest";
	const postExpiryRetentionMs = options.postExpiryRetentionMs ?? 0;
	if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) throw new Error("hosted outbound media maxEntries must be a positive integer");
	if (!Number.isSafeInteger(maxChunkRows) || maxChunkRows < 1) throw new Error("hosted outbound media maxChunkRows must be a positive integer");
	if (!Number.isSafeInteger(postExpiryRetentionMs) || postExpiryRetentionMs < 0) throw new Error("hosted outbound media postExpiryRetentionMs must be a non-negative integer");
	if (options.maxTotalBytes !== void 0 && (!Number.isSafeInteger(options.maxTotalBytes) || options.maxTotalBytes < 1)) throw new Error("hosted outbound media maxTotalBytes must be a positive integer");
	if (overflowPolicy !== "evict-oldest" && overflowPolicy !== "reject-new") throw new Error("hosted outbound media overflowPolicy must be evict-oldest or reject-new");
	const createId = options.createId ?? createHostedOutboundMediaId;
	const createToken = options.createToken ?? createHostedOutboundMediaToken;
	const chunkPhysicalTtlMs = options.ttlMs + postExpiryRetentionMs;
	const metadataPhysicalTtlMs = options.ttlMs + Math.max(postExpiryRetentionMs, Math.min(options.ttlMs, HOSTED_OUTBOUND_MEDIA_METADATA_TTL_GRACE_MS));
	if (!Number.isSafeInteger(chunkPhysicalTtlMs) || chunkPhysicalTtlMs < 1 || !Number.isSafeInteger(metadataPhysicalTtlMs) || metadataPhysicalTtlMs < 1) throw new Error("hosted outbound media physical TTL must be a positive safe integer");
	let capacityMutation = Promise.resolve();
	const activeReaders = /* @__PURE__ */ new Map();
	const deferredDeletes = /* @__PURE__ */ new Set();
	const deletingEntries = /* @__PURE__ */ new Set();
	async function withCapacityMutation(operation) {
		const result = capacityMutation.then(operation, operation);
		capacityMutation = result.then(() => void 0, () => void 0);
		return await result;
	}
	async function deleteEntry(id) {
		deferredDeletes.add(id);
		if ((activeReaders.get(id) ?? 0) > 0) return false;
		deletingEntries.add(id);
		try {
			await deleteHostedOutboundMediaRows(id, options.metadataStore, options.chunkStore);
			deferredDeletes.delete(id);
			return true;
		} finally {
			deletingEntries.delete(id);
		}
	}
	async function deleteEntryRows(id, chunkCount) {
		await deleteHostedOutboundMediaRows(id, options.metadataStore, options.chunkStore, chunkCount);
	}
	async function readMetadataRecord(id, nowMs) {
		const meta = await options.metadataStore.lookup(buildHostedOutboundMediaMetaKey(id));
		if (!meta) return null;
		if (!isFutureHostedOutboundMediaExpiry(meta.expiresAt, nowMs)) {
			if (!isRetainedHostedOutboundMediaExpiry(meta.expiresAt, nowMs, postExpiryRetentionMs)) await withCapacityMutation(async () => await deleteEntry(id));
			return null;
		}
		return meta;
	}
	async function deleteStoredRow(row) {
		const id = parseHostedOutboundMediaMetaKey(row.key);
		if (!id || !Number.isSafeInteger(row.value.chunkCount) || row.value.chunkCount < 1 || row.value.chunkCount > maxChunkRows) {
			await options.metadataStore.delete(row.key);
			return;
		}
		await deleteEntry(id);
	}
	async function cleanupExpired(nowMs = Date.now()) {
		await withCapacityMutation(async () => {
			for (const row of await options.metadataStore.entries()) if (!isRetainedHostedOutboundMediaExpiry(row.value.expiresAt, nowMs, postExpiryRetentionMs)) await deleteStoredRow(row);
		});
	}
	async function acquireReader(id, nowMs) {
		activeReaders.set(id, (activeReaders.get(id) ?? 0) + 1);
		let closed = false;
		const close = async () => {
			if (closed) return;
			closed = true;
			const remaining = (activeReaders.get(id) ?? 1) - 1;
			if (remaining > 0) {
				activeReaders.set(id, remaining);
				return;
			}
			activeReaders.delete(id);
			if (deferredDeletes.has(id)) await withCapacityMutation(async () => await deleteEntry(id));
		};
		if (deferredDeletes.has(id) || deletingEntries.has(id)) {
			await close();
			return null;
		}
		const meta = await readMetadataRecord(id, nowMs);
		if (!meta) {
			await close();
			return null;
		}
		return {
			meta,
			close
		};
	}
	async function pruneForCapacity(incomingChunkCount, incomingByteLength, nowMs = Date.now()) {
		if (options.maxTotalBytes !== void 0 && incomingByteLength > options.maxTotalBytes) throw new Error(`hosted outbound media payload exceeds aggregate byte capacity (${incomingByteLength}/${options.maxTotalBytes} bytes)`);
		const rows = await options.metadataStore.entries();
		const validRows = rows.filter((row) => {
			const id = parseHostedOutboundMediaMetaKey(row.key);
			return id !== void 0 && row.value.id === id && Number.isSafeInteger(row.value.chunkCount) && row.value.chunkCount > 0 && row.value.chunkCount <= maxChunkRows && Number.isSafeInteger(row.value.byteLength) && row.value.byteLength >= 0 && isRetainedHostedOutboundMediaExpiry(row.value.expiresAt, nowMs, postExpiryRetentionMs);
		});
		const validKeys = new Set(validRows.map((row) => row.key));
		const orderedRows = validRows.toSorted((a, b) => a.createdAt - b.createdAt || a.key.localeCompare(b.key));
		const invalidRows = rows.filter((row) => !validKeys.has(row.key));
		for (const row of invalidRows) await deleteStoredRow(row);
		let entryCount = orderedRows.length;
		let chunkCount = orderedRows.reduce((total, row) => total + row.value.chunkCount, 0);
		let totalBytes = orderedRows.reduce((total, row) => total + row.value.byteLength, 0);
		if (overflowPolicy === "reject-new" && (entryCount >= maxEntries || chunkCount + incomingChunkCount > maxChunkRows || options.maxTotalBytes !== void 0 && totalBytes + incomingByteLength > options.maxTotalBytes)) throw new Error(`hosted outbound media capacity is full (${entryCount}/${maxEntries} entries, ${chunkCount + incomingChunkCount}/${maxChunkRows} chunk rows, ${totalBytes + incomingByteLength}/${options.maxTotalBytes ?? "unbounded"} bytes)`);
		for (const row of orderedRows) {
			if (entryCount < maxEntries && chunkCount + incomingChunkCount <= maxChunkRows && (options.maxTotalBytes === void 0 || totalBytes + incomingByteLength <= options.maxTotalBytes)) break;
			const id = parseHostedOutboundMediaMetaKey(row.key);
			if (!id) continue;
			if ((activeReaders.get(id) ?? 0) > 0) continue;
			if (await deleteEntry(id)) {
				entryCount -= 1;
				chunkCount -= row.value.chunkCount;
				totalBytes -= row.value.byteLength;
			}
		}
		if (entryCount >= maxEntries || chunkCount + incomingChunkCount > maxChunkRows || options.maxTotalBytes !== void 0 && totalBytes + incomingByteLength > options.maxTotalBytes) throw new Error("hosted outbound media capacity is full while active readers retain entries");
	}
	return {
		async prepareUrl(params) {
			const expiresAt = options.resolveExpiresAtMs(options.ttlMs);
			if (expiresAt === void 0) throw new Error("hosted outbound media expiry could not be resolved");
			const media = await loadOutboundMediaFromUrl(params.mediaUrl, {
				maxBytes: params.maxBytes,
				mediaAccess: params.mediaAccess,
				...params.proxyUrl ? { proxyUrl: params.proxyUrl } : {},
				...params.requestInit ? { requestInit: params.requestInit } : {}
			});
			await params.validateBeforePersist?.(media);
			const id = createId();
			const token = createToken();
			const chunkCount = Math.max(1, Math.ceil(media.buffer.byteLength / rawChunkBytes));
			if (chunkCount > maxChunkRows) throw new Error(`hosted outbound media exceeds SQLite chunk row limit (${chunkCount}/${maxChunkRows})`);
			return await withCapacityMutation(async () => {
				await pruneForCapacity(chunkCount, media.buffer.byteLength);
				try {
					for (let index = 0; index < chunkCount; index += 1) {
						const chunk = media.buffer.subarray(index * rawChunkBytes, (index + 1) * rawChunkBytes);
						await options.chunkStore.register(buildHostedOutboundMediaChunkKey(id, index), {
							id,
							index,
							dataBase64: chunk.toString("base64")
						}, { ttlMs: chunkPhysicalTtlMs });
					}
					await options.metadataStore.register(buildHostedOutboundMediaMetaKey(id), createHostedOutboundMediaMetaRecord({
						id,
						routePath: params.routePath,
						token,
						contentType: media.contentType,
						fileName: media.fileName,
						expiresAt,
						chunkCount,
						byteLength: media.buffer.byteLength
					}), { ttlMs: metadataPhysicalTtlMs });
				} catch (error) {
					await deleteEntryRows(id, chunkCount);
					throw error;
				}
				return `${params.publicBaseUrl}${params.routePath}${id}?token=${token}`;
			});
		},
		async readMetadata(id, nowMs = Date.now()) {
			const reader = await acquireReader(id, nowMs);
			if (!reader) return null;
			try {
				return deferredDeletes.has(id) || deletingEntries.has(id) ? null : createHostedOutboundMediaMetadata(reader.meta);
			} finally {
				await reader.close();
			}
		},
		async read(id, nowMs = Date.now()) {
			const reader = await acquireReader(id, nowMs);
			if (!reader) return null;
			const { close, meta } = reader;
			try {
				const expectedChunkCount = Math.max(1, Math.ceil(meta.byteLength / rawChunkBytes));
				if (!Number.isSafeInteger(meta.byteLength) || meta.byteLength < 0 || meta.chunkCount !== expectedChunkCount || meta.chunkCount > maxChunkRows) {
					await withCapacityMutation(async () => await deleteEntry(id));
					return null;
				}
				const buffer = Buffer.allocUnsafe(meta.byteLength);
				let offset = 0;
				let chunkBatch;
				const lookupBatchSize = 1e4;
				for (let index = 0; index < meta.chunkCount; index += 1) {
					if (options.chunkStore.lookupMany && index % lookupBatchSize === 0) chunkBatch = await options.chunkStore.lookupMany(Array.from({ length: Math.min(lookupBatchSize, meta.chunkCount - index) }, (_, chunkOffset) => buildHostedOutboundMediaChunkKey(id, index + chunkOffset)));
					const result = chunkBatch?.[index % lookupBatchSize];
					if (result && !result.ok) throw result.error;
					const chunk = chunkBatch ? result?.value : await options.chunkStore.lookup(buildHostedOutboundMediaChunkKey(id, index));
					if (!chunk || chunk.id !== id || chunk.index !== index) {
						await withCapacityMutation(async () => await deleteEntry(id));
						return null;
					}
					const decoded = Buffer.from(chunk.dataBase64, "base64");
					const expectedBytes = index === meta.chunkCount - 1 ? meta.byteLength - rawChunkBytes * (meta.chunkCount - 1) : rawChunkBytes;
					if (decoded.byteLength !== expectedBytes) {
						await withCapacityMutation(async () => await deleteEntry(id));
						return null;
					}
					decoded.copy(buffer, offset);
					offset += decoded.byteLength;
				}
				return {
					metadata: createHostedOutboundMediaMetadata(meta),
					buffer
				};
			} finally {
				await close();
			}
		},
		async delete(id) {
			deferredDeletes.add(id);
			await withCapacityMutation(async () => await deleteEntry(id));
		},
		cleanupExpired,
		async clear() {
			await withCapacityMutation(async () => await Promise.all([options.metadataStore.clear(), options.chunkStore.clear()]));
		}
	};
}
function encodeHostedOutboundMediaFileName(fileName) {
	return encodeURIComponent(fileName).replace(/[\x27()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}
/** Build download-only response headers for immutable hosted outbound media. */
function buildHostedOutboundMediaResponseHeaders(metadata, options = {}) {
	const contentType = normalizeMimeType(metadata.contentType?.split(";", 1)[0]?.trim()) ?? "application/octet-stream";
	const fileName = sanitizeUntrustedFileName(metadata.fileName ?? options.fallbackFileName ?? "attachment.bin", "attachment.bin");
	const asciiFallback = fileName.replace(/[^\x20-\x7e]|[%"\\]/g, "_").trim() || "attachment.bin";
	return {
		"Content-Type": contentType,
		"Content-Length": String(metadata.byteLength),
		"Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeHostedOutboundMediaFileName(fileName)}`,
		"Cache-Control": "no-store",
		"X-Content-Type-Options": "nosniff"
	};
}
//#endregion
export { buildHostedOutboundMediaResponseHeaders, createHostedOutboundMediaStore, loadOutboundMediaFromUrl };
