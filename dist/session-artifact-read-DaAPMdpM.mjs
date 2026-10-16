import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as hasSqlitePostCommitScope } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-CJdQ4R61.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { a as iterateVisibleMessageRange, d as resolveVisibleMessagePositions } from "./session-accessor.sqlite-reset-window-BfaTzfLM.mjs";
import { a as MAX_PAYLOAD_BYTES } from "./server-constants-BH_EolwD.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { t as findMarkdownImageSpans } from "./image-spans-BX1wRx19.mjs";
import { n as projectTranscriptImageArtifacts, r as resolveTranscriptImageArtifactBlock, t as parseTranscriptImageArtifactId } from "./transcript-image-artifacts-DqNH9hLC.mjs";
import { r as resolveByteResponse } from "./http-byte-range-3Zwag20C.mjs";
import { o as parseManagedOutgoingArtifactId } from "./managed-outgoing-artifact-id-Ba11Ib46.mjs";
import { i as toArtifactSummary, n as resolveBlockDownload, r as resolveMessageRunId, t as mediaUrlValue } from "./artifacts-content-DvXNkzKV.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/artifact-download-projection.ts
function artifactContentDigest(artifact) {
	return createHash("sha256").update(JSON.stringify([
		artifact.id,
		artifact.type,
		artifact.title,
		artifact.mimeType
	])).update("\0").update(artifact.data ?? "").digest("hex");
}
/** Artifact extraction owns base64 validation and normalization before preparation. */
function prepareArtifactDownload(artifact) {
	if (artifact.download.mode !== "bytes" || artifact.data === void 0) return;
	return {
		artifact: toArtifactSummary(artifact),
		digest: artifactContentDigest(artifact)
	};
}
function prepareArtifactDownloadResponse(artifact, request) {
	if (artifact.download.mode !== "bytes" || artifact.data === void 0 || artifactContentDigest(artifact) !== request.expectedDigest) return;
	const response = resolveByteResponse({
		file: { size: Buffer.byteLength(artifact.data, "base64") },
		method: request.method,
		request: {
			headers: request.headers,
			headersDistinct: {}
		}
	});
	const result = {
		artifact: toArtifactSummary(artifact),
		response
	};
	if (request.method === "HEAD" || response.kind === "not-modified" || response.kind === "unsatisfiable") return result;
	const body = new Uint8Array(response.contentLength);
	if (response.kind === "partial") {
		const encodedStart = Math.floor(response.range.start / 3) * 4;
		const encodedEnd = Math.ceil((response.range.end + 1) / 3) * 4;
		const window = Buffer.from(artifact.data.slice(encodedStart, encodedEnd), "base64");
		const offset = response.range.start % 3;
		body.set(window.subarray(offset, offset + body.length));
	} else Buffer.from(body.buffer).write(artifact.data, "base64");
	return {
		...result,
		body
	};
}
//#endregion
//#region src/gateway/session-artifact-read.ts
const IMAGE_PAGE_MESSAGES = 32;
const IMAGE_PAGE_BYTES = 1048576;
const IMAGE_INLINE_PREVIEW_MAX_BYTES = 262144;
const artifactTypes = /* @__PURE__ */ new Map([
	["image", "image"],
	["input_image", "image"],
	["image_url", "image"],
	["audio", "audio"],
	["input_audio", "audio"],
	["video", "video"],
	["input_video", "video"],
	["file", "file"],
	["attachment", "file"],
	["input_file", "file"]
]);
/** Generates a stable id from transcript position plus display metadata. */
function artifactId(parts) {
	return `artifact_${createHash("sha256").update(`${parts.sessionKey}\0${parts.messageSeq}\0${parts.contentIndex}\0${parts.type}\0${parts.title}`).digest("base64url").slice(0, 18)}`;
}
function resolveMessageSeq(message, fallback) {
	const seq = asOptionalRecord(message["__openclaw"])?.seq;
	return typeof seq === "number" && Number.isInteger(seq) && seq > 0 ? seq : fallback;
}
function isArtifactBlock(block) {
	const type = normalizeOptionalString(block.type)?.toLowerCase();
	return type !== void 0 && artifactTypes.has(type) || typeof block.data === "string" || Boolean(block.url || block.openUrl || block.source || block.image_url || block.audio_url);
}
function collectArtifactsFromMessage(params) {
	const msg = asOptionalRecord(params.message);
	if (!msg) return;
	const messageSeq = resolveMessageSeq(msg, params.messageFallbackSeq);
	const messageRunId = resolveMessageRunId(msg);
	if (params.runId && messageRunId !== params.runId) return;
	const content = readAssistantDisplayContent(msg);
	if (params.imagesOnly) {
		const texts = typeof msg.content === "string" && !Array.isArray(msg["openclawDisplayContent"]) ? [msg.content] : content.flatMap((block) => block.type === "text" && typeof block.text === "string" ? [block.text] : []);
		for (const text of texts) for (const span of findMarkdownImageSpans(text)) content.push({
			type: "image",
			url: span.destination,
			title: "image"
		});
		for (const fact of readPersistedMediaFacts(msg) ?? []) {
			const url = fact.path ?? fact.url;
			if (url && isImageMediaFact(fact)) content.push({
				type: "image",
				url,
				mimeType: fact.contentType,
				fileName: fact.fileName,
				sizeBytes: fact.sizeBytes
			});
		}
	}
	for (let contentIndex = 0; contentIndex < content.length; contentIndex += 1) {
		const block = asOptionalRecord(content[contentIndex]);
		if (!block || !isArtifactBlock(block)) continue;
		params.collection.count += 1;
		if (params.messageRole && msg.role !== params.messageRole) continue;
		const attachment = asOptionalRecord(block.attachment);
		const type = params.imagesOnly && attachment?.kind === "image" ? "image" : artifactTypes.get(normalizeOptionalString(block.type)?.toLowerCase() ?? "file") ?? "file";
		if (params.imagesOnly && type !== "image") continue;
		const title = normalizeOptionalString(block.title) ?? normalizeOptionalString(block.fileName) ?? normalizeOptionalString(block.filename) ?? normalizeOptionalString(block.alt) ?? normalizeOptionalString(attachment?.label) ?? `${type} ${params.collection.count}`;
		const declaredArtifactId = normalizeOptionalString(block.artifactId) ?? normalizeOptionalString(attachment?.artifactId);
		const transcriptImage = params.imagesOnly && declaredArtifactId ? parseTranscriptImageArtifactId(declaredArtifactId) : void 0;
		const id = declaredArtifactId && (parseManagedOutgoingArtifactId(declaredArtifactId) || transcriptImage) ? declaredArtifactId : artifactId({
			sessionKey: params.sessionKey,
			messageSeq,
			contentIndex,
			title,
			type
		});
		if (params.downloadArtifactIds && !params.downloadArtifactIds.delete(id)) continue;
		const sized = params.imagesOnly ? resolveBlockDownload(attachment ?? block, { includeData: false }) : void 0;
		const previewable = !sized || sized.mode !== "bytes" || (sized.payloadSizeBytes ?? 0) <= IMAGE_INLINE_PREVIEW_MAX_BYTES;
		if (params.imagesOnly && !previewable && !transcriptImage) {
			params.collection.artifacts.push(void 0);
			continue;
		}
		const download = sized && (!previewable || sized.mode !== "bytes") ? sized : resolveBlockDownload(attachment ?? block, { includeData: params.imagesOnly || params.includeDownloadData !== false });
		const source = asOptionalRecord(block.source);
		const previewOnly = params.imagesOnly && !transcriptImage && !parseManagedOutgoingArtifactId(id);
		let imageUrl = params.imagesOnly ? download.data !== void 0 ? `data:${download.mimeType ?? "image/png"};base64,${download.data}` : normalizeOptionalString(attachment?.url) ?? normalizeOptionalString(block.url) ?? normalizeOptionalString(source?.url) ?? mediaUrlValue(block.image_url) : void 0;
		if (params.imagesOnly && (transcriptImage ? download.mode !== "bytes" : !imageUrl)) continue;
		if (params.imagesOnly && imageUrl && /^data:/i.test(imageUrl) && Buffer.byteLength(imageUrl) > IMAGE_INLINE_PREVIEW_MAX_BYTES) {
			if (transcriptImage) imageUrl = void 0;
			else {
				params.collection.artifacts.push(void 0);
				continue;
			}
		}
		const summary = {
			id: previewOnly ? `preview_${id}` : id,
			type,
			title,
			...download.mimeType ? { mimeType: download.mimeType } : {},
			...download.sizeBytes !== void 0 ? { sizeBytes: download.sizeBytes } : {},
			sessionKey: params.sessionKey,
			...messageRunId ? { runId: messageRunId } : {},
			messageSeq,
			source: previewOnly ? "session-transcript-preview" : "session-transcript",
			download: { mode: previewOnly ? "unsupported" : download.mode },
			...imageUrl ? { image: { url: imageUrl } } : {},
			...download.data !== void 0 ? { data: download.data } : {},
			...download.url ? { url: download.url } : {}
		};
		params.collection.artifacts.push(summary);
	}
}
function createArtifactListCollector(query) {
	const artifacts = [];
	const collection = {
		artifacts,
		count: 0
	};
	const downloadArtifactIds = query.downloadArtifactIds ? new Set(query.downloadArtifactIds) : void 0;
	const visit = (message, seq) => {
		collectArtifactsFromMessage({
			message,
			messageFallbackSeq: seq,
			collection,
			sessionKey: query.sessionKey,
			runId: query.runId,
			messageRole: query.messageRole,
			includeDownloadData: query.includeDownloadData,
			downloadArtifactIds
		});
	};
	return {
		artifacts,
		visit
	};
}
const summaryLists = /* @__PURE__ */ new WeakMap();
/** Reuse metadata only after admission and revision selection in the worker's current snapshot. */
function readArtifactSummariesFromProjection(projection, query) {
	const cacheable = !hasSqlitePostCommitScope(projection.database.db) && !resolveSessionTranscriptReadFence(projection.resolved);
	let cache = summaryLists.get(projection.database.db);
	if (!cache && cacheable) {
		cache = /* @__PURE__ */ new Map();
		summaryLists.set(projection.database.db, cache);
	}
	const key = JSON.stringify([
		projection.resolved.sessionId,
		query.sessionKey,
		query.runId,
		query.messageRole
	]);
	const revision = JSON.stringify([
		projection.generation,
		projection.state.indexedSeq,
		projection.state.leafEventId,
		projection.state.activeMessageCount
	]);
	const cached = cacheable ? cache?.get(key) : void 0;
	if (cached?.revision === revision) return cached.artifacts;
	const { artifacts, visit } = createArtifactListCollector({
		...query,
		includeDownloadData: false
	});
	const visible = resolveVisibleMessagePositions(projection);
	for (const entry of iterateVisibleMessageRange(projection, 0, visible.total)) {
		const message = asOptionalRecord(entry.event)?.message;
		if (message !== void 0) visit(message, entry.seq);
	}
	if (cacheable && cache) {
		cache.delete(key);
		if (Buffer.byteLength(JSON.stringify(artifacts)) <= 262144) {
			cache.set(key, {
				revision,
				artifacts
			});
			pruneMapToMaxSize(cache, 32);
		}
	}
	return artifacts;
}
async function readArtifactList(scope, query, readers) {
	const { artifacts, visit } = createArtifactListCollector(query);
	await readers.visitSessionMessagesAsync(scope, visit);
	return artifacts;
}
/** Select transcript artifacts inside the caller's admitted read owner. */
async function selectSessionArtifacts(scope, query, readers) {
	if (query.kind === "download-grant" || query.kind === "download-response") {
		const selection = {
			sessionKey: query.sessionKey,
			runId: query.runId,
			messageRole: query.messageRole
		};
		const artifact = parseTranscriptImageArtifactId(query.artifactId) ? await readTranscriptImageArtifact(scope, {
			...selection,
			kind: "image",
			artifactId: query.artifactId,
			includeData: true
		}, readers) : (await readArtifactList(scope, {
			...selection,
			kind: "list",
			includeDownloadData: true,
			downloadArtifactIds: [query.artifactId]
		}, readers))[0];
		if (query.kind === "download-response") return {
			kind: "download-response",
			response: artifact ? prepareArtifactDownloadResponse(artifact, query.response) : void 0
		};
		if (!artifact) return { kind: "download-grant" };
		if (parseManagedOutgoingArtifactId(artifact.id)) return {
			kind: "download-grant",
			selection: {
				kind: "raw",
				artifact: toArtifactSummary(artifact)
			}
		};
		const download = prepareArtifactDownload(artifact);
		return {
			kind: "download-grant",
			selection: download ? {
				kind: "prepared",
				download
			} : {
				kind: "raw",
				artifact
			}
		};
	}
	if (query.kind === "list") return {
		kind: "list",
		artifacts: await readArtifactList(scope, query, readers)
	};
	if (query.kind === "image-page") {
		const page = await readers.readSessionMessagesPageWithStatsAsync(scope, {
			offset: 0,
			beforeSeq: query.beforeSeq,
			maxMessages: IMAGE_PAGE_MESSAGES,
			maxBytes: IMAGE_PAGE_BYTES,
			allowOversizedFirst: true,
			readOnly: true,
			captureReadWindow: true,
			expectedReadWindow: query.readWindow
		});
		if (page.windowReset) throw new SessionTranscriptProjectionUnavailableError(scope.sessionId, "window-changed");
		const artifacts = [];
		let omittedOversized = false;
		let next;
		for (const message of page.messages.toReversed()) {
			const seq = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.seq;
			if (typeof seq !== "number") continue;
			const collected = [];
			collectArtifactsFromMessage({
				message: projectTranscriptImageArtifacts(message),
				messageFallbackSeq: 1,
				collection: {
					artifacts: collected,
					count: 0
				},
				sessionKey: query.sessionKey,
				runId: query.runId,
				messageRole: query.messageRole,
				imagesOnly: true
			});
			const images = collected.map((artifact) => artifact && toArtifactSummary(artifact)).toReversed();
			const start = query.beforeSeq === seq + 1 ? query.imageOffset ?? 0 : 0;
			for (let index = start; index < images.length; index++) {
				const image = images[index];
				if (!image) {
					omittedOversized = true;
					continue;
				}
				artifacts.push(image);
				if (artifacts.length === query.limit) {
					next = index + 1 < images.length ? {
						beforeSeq: seq + 1,
						imageOffset: index + 1
					} : seq > 1 ? {
						beforeSeq: seq,
						imageOffset: 0
					} : void 0;
					break;
				}
			}
			if (artifacts.length === query.limit) break;
		}
		if (artifacts.length < query.limit && page.olderOffset !== void 0) next = {
			beforeSeq: (query.beforeSeq ?? page.totalMessages + 1) - page.olderOffset,
			imageOffset: 0
		};
		return {
			kind: "image-page",
			artifacts,
			...omittedOversized ? { omittedOversized: true } : {},
			...next && next.beforeSeq > 1 && page.readWindow ? { next: {
				...next,
				readWindow: page.readWindow
			} } : {}
		};
	}
	const artifact = await readTranscriptImageArtifact(scope, query, readers);
	return artifact ? {
		kind: "image",
		artifact
	} : { kind: "image" };
}
async function readTranscriptImageArtifact(scope, query, readers) {
	const reference = parseTranscriptImageArtifactId(query.artifactId);
	if (!reference) return;
	const page = await readers.readSessionMessagesPageWithStatsAsync(scope, {
		offset: 0,
		beforeSeq: reference.messageSeq + 1,
		maxMessages: 1,
		maxBytes: MAX_PAYLOAD_BYTES - 4096,
		allowOversizedFirst: true
	});
	const message = asOptionalRecord(page.messages[0]);
	const block = resolveTranscriptImageArtifactBlock(message, query.artifactId);
	if (!message || !block || query.messageRole && message.role !== query.messageRole || query.runId && resolveMessageRunId(message) !== query.runId) return;
	const download = resolveBlockDownload(block, { includeData: query.includeData });
	if (download.mode !== "bytes") return;
	return {
		id: query.artifactId,
		type: "image",
		title: normalizeOptionalString(block.title) ?? normalizeOptionalString(block.fileName) ?? normalizeOptionalString(block.alt) ?? "Image",
		mimeType: download.mimeType ?? "image/png",
		sizeBytes: download.sizeBytes,
		sessionKey: query.sessionKey,
		messageSeq: reference.messageSeq,
		source: "session-transcript",
		download: { mode: "bytes" },
		...download.data !== void 0 ? { data: download.data } : {}
	};
}
//#endregion
export { readArtifactSummariesFromProjection, selectSessionArtifacts };
