import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { _ as validateArtifactsGetParams, g as validateArtifactsDownloadParams, v as validateArtifactsListParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { o as readSessionTranscriptUpdateVersion } from "./transcript-events-DukKauix.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-BEHTU0wM.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { a as MAX_PAYLOAD_BYTES } from "./server-constants-Dx_kHnY5.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId } from "./session-store-key-BoleEY7N.mjs";
import "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { n as prepareTaskRegistryRead } from "./task-registry-read-BpKCOEEj.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-DotKkoz0.mjs";
import { t as findMarkdownImageSpans } from "./image-spans-DUAc_qyr.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-DivkApLb.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import { E as createSessionListEntryFilter, K as resolveSessionSharingTarget, j as authorizeIncognitoSessionTarget } from "./session-sharing-C4w_but1.mjs";
import "./session-utils-CJ7A982R.mjs";
import { s as readSessionMessagesPageWithStatsAsync, u as visitSessionMessagesAsync } from "./session-transcript-readers-Bmg2Zjrq.mjs";
import { r as resolveTranscriptImageArtifactBlock, t as parseTranscriptImageArtifactId } from "./transcript-image-artifacts-BJipDW7F.mjs";
import { g as resolveManagedOutgoingMediaUrlDownload, h as resolveManagedOutgoingMediaArtifactDownload, l as parseManagedOutgoingArtifactId } from "./managed-image-attachments-esuKWCel.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as createArtifactDownload } from "./artifact-downloads-LLSep7yc.mjs";
import { n as resolveSessionKeyForRun } from "./server-session-key-C285F4Vb.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/server-methods/artifacts-base64.ts
function mimeFromDataUrl(value) {
	return /^data:([^;,]+)(?:;[^,]*)?,/i.exec(value.trim())?.[1]?.toLowerCase();
}
function base64FromDataUrl(value) {
	const trimmed = value.trim();
	const commaIndex = trimmed.indexOf(",");
	if (commaIndex < 0 || trimmed.slice(0, 5).toLowerCase() !== "data:") return;
	if (!trimmed.slice(0, commaIndex).toLowerCase().includes(";base64")) return;
	return trimmed.slice(commaIndex + 1);
}
function normalizeArtifactBase64Alphabet(value) {
	if (!/[-_]/.test(value)) return value;
	const bytes = Buffer.from(value, "ascii");
	for (let index = 0; index < bytes.length; index++) if (bytes[index] === 45) bytes[index] = 43;
	else if (bytes[index] === 95) bytes[index] = 47;
	return bytes.toString("ascii");
}
function readArtifactBase64Payload(value, opts) {
	if (value === void 0) return;
	if (/[^A-Za-z0-9+/_= \n\r\t-]/.test(value)) return;
	const paddingStart = value.indexOf("=");
	if (paddingStart >= 0 && !/^(?:=[ \n\r\t]*){1,2}$/.test(value.slice(paddingStart))) return;
	const padding = paddingStart < 0 ? 0 : value.lastIndexOf("=") === paddingStart ? 1 : 2;
	const hasWhitespace = /[ \n\r\t]/.test(value);
	let encodedLength = value.length;
	if (hasWhitespace) for (let index = 0; index < value.length; index++) {
		const code = value.charCodeAt(index);
		if (code === 32 || code === 10 || code === 13 || code === 9) encodedLength -= 1;
	}
	const remainder = encodedLength % 4;
	if (padding > 0 && remainder !== 0 || remainder === 1) return;
	let data = opts.includeData ? normalizeArtifactBase64Alphabet(hasWhitespace ? value.replace(/[ \n\r\t]/g, "") : value) : void 0;
	if (data !== void 0 && padding === 0 && remainder > 0) data += "=".repeat(4 - remainder);
	return {
		...data !== void 0 ? { data } : {},
		sizeBytes: Math.max(0, Math.floor(encodedLength * 3 / 4) - padding)
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts-content.ts
function mediaUrlValue(value) {
	if (typeof value === "string") return normalizeOptionalString(value);
	const record = asOptionalRecord(value);
	return normalizeOptionalString(record?.url);
}
function isSafeDownloadUrl(value) {
	const trimmed = value.trim();
	if (!trimmed || /^data:/i.test(trimmed)) return false;
	if (trimmed.startsWith("/")) return !trimmed.startsWith("//") && trimmed.startsWith("/api/");
	return isHttpUrl(trimmed);
}
function resolveMessageRunId(message) {
	const meta = asOptionalRecord(message["__openclaw"]);
	return normalizeOptionalString(meta?.runId) ?? normalizeOptionalString(message.runId);
}
function resolveMessageTaskId(message) {
	const meta = asOptionalRecord(message["__openclaw"]);
	return normalizeOptionalString(meta?.messageTaskId) ?? normalizeOptionalString(meta?.taskId) ?? normalizeOptionalString(message.messageTaskId) ?? normalizeOptionalString(message.taskId);
}
function resolveBlockDownload(block, opts) {
	const data = readStringValue(block.data)?.trim();
	const content = readStringValue(block.content)?.trim();
	const url = normalizeOptionalString(block.url) ?? normalizeOptionalString(block.openUrl);
	const imageUrl = mediaUrlValue(block.image_url);
	const audioUrl = normalizeOptionalString(block.audio_url);
	const source = asOptionalRecord(block.source);
	const sourceData = readStringValue(source?.data)?.trim();
	const sourceUrl = normalizeOptionalString(source?.url);
	const dataUrl = [
		url,
		sourceUrl,
		imageUrl,
		audioUrl,
		data,
		content,
		sourceData
	].find((value) => typeof value === "string" && /^data:/i.test(value));
	const base64FromDetectedDataUrl = readArtifactBase64Payload(dataUrl ? base64FromDataUrl(dataUrl) : void 0, opts);
	const directBase64 = [
		data,
		sourceData,
		content
	].filter((value) => typeof value === "string" && !/^data:/i.test(value)).map((value) => readArtifactBase64Payload(value, opts)).find((value) => value !== void 0);
	const base64 = base64FromDetectedDataUrl ?? directBase64;
	const remoteUrl = [
		url,
		sourceUrl,
		imageUrl,
		audioUrl
	].find((value) => typeof value === "string" && isSafeDownloadUrl(value));
	const mimeType = normalizeOptionalString(block.mimeType) ?? normalizeOptionalString(block.media_type) ?? normalizeOptionalString(source?.media_type) ?? normalizeOptionalString(source?.mimeType) ?? (dataUrl ? mimeFromDataUrl(dataUrl) : void 0);
	const explicitSize = block.sizeBytes ?? source?.sizeBytes;
	const sizeBytes = typeof explicitSize === "number" && Number.isFinite(explicitSize) && explicitSize >= 0 ? Math.floor(explicitSize) : base64?.sizeBytes;
	if (base64) return {
		mode: "bytes",
		data: base64.data,
		mimeType,
		sizeBytes
	};
	if (remoteUrl) return {
		mode: "url",
		url: remoteUrl,
		mimeType,
		sizeBytes
	};
	return {
		mode: "unsupported",
		mimeType,
		sizeBytes
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts-session-resolution.ts
function resolveArtifactSessionAgentId(sessionKey, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	const parsed = parseAgentSessionKey(key);
	if (!parsed && key.toLowerCase().startsWith("agent:")) return;
	if (cfg) {
		const owner = resolveRequestedSessionAgentId(cfg, key);
		if (!owner.ok) throw new ArtifactSessionResolutionError(owner.error);
		return owner.agentId;
	}
	return parsed?.agentId ?? resolveAgentIdFromSessionKey(key);
}
function resolveScopedArtifactSessionKey(sessionKey, agentId, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	const scopedAgentId = normalizeOptionalString(agentId);
	if (!scopedAgentId) return key;
	const parsed = parseAgentSessionKey(key);
	if (!parsed && key.toLowerCase().startsWith("agent:")) return;
	if (!cfg) return parsed && parsed.agentId !== normalizeAgentId(scopedAgentId) ? void 0 : toAgentStoreSessionKey({
		agentId: scopedAgentId,
		requestKey: key
	});
	const scopedKey = resolveStoredSessionKeyForAgentStore({
		cfg,
		agentId: scopedAgentId,
		sessionKey: key
	});
	return scopedKey !== "global" && scopedKey !== "unknown" && resolveSessionStoreAgentId(cfg, scopedKey) !== normalizeAgentId(scopedAgentId) ? void 0 : scopedKey;
}
function resolveQuerySession(query, cfg, task) {
	if (query.sessionKey) {
		const sessionKey = resolveScopedArtifactSessionKey(query.sessionKey, query.agentId, cfg);
		return sessionKey ? {
			sessionKey,
			...query.agentId ? { agentId: query.agentId } : {}
		} : void 0;
	}
	if (query.runId) {
		const sessionKey = resolveSessionKeyForRun(query.runId, query.agentId ? { agentId: query.agentId } : {});
		const agentId = query.agentId ?? resolveArtifactSessionAgentId(sessionKey, cfg) ?? resolveSessionAgentId({ config: cfg });
		const scopedSessionKey = resolveScopedArtifactSessionKey(sessionKey, agentId, cfg);
		return scopedSessionKey ? {
			sessionKey: scopedSessionKey,
			agentId
		} : void 0;
	}
	if (!query.taskId) return;
	const requesterSessionKey = normalizeOptionalString(task?.requesterSessionKey);
	const ownerAgentId = parseAgentSessionKey(task?.ownerKey)?.agentId;
	const persistedRequesterOwner = requesterSessionKey ? resolvePersistedSessionStoreOwnerForKey(cfg ?? {}, requesterSessionKey) : { kind: "none" };
	const requesterAgentId = normalizeOptionalString(task?.requesterAgentId) ?? ownerAgentId ?? (persistedRequesterOwner.kind === "configured" ? persistedRequesterOwner.agentId : resolveArtifactSessionAgentId(requesterSessionKey, cfg));
	const taskAgentId = normalizeOptionalString(task?.agentId) ?? requesterAgentId;
	if (query.agentId && taskAgentId && normalizeAgentId(query.agentId) !== normalizeAgentId(taskAgentId)) return;
	if (requesterSessionKey) {
		const sessionAgentId = requesterAgentId ?? resolveArtifactSessionAgentId(requesterSessionKey, cfg);
		const scopedSessionKey = sessionAgentId ? resolveScopedArtifactSessionKey(requesterSessionKey, sessionAgentId, cfg) : void 0;
		return scopedSessionKey ? {
			sessionKey: scopedSessionKey,
			agentId: sessionAgentId
		} : void 0;
	}
	const agentId = query.agentId ?? taskAgentId ?? resolveSessionAgentId({ config: cfg });
	const runId = normalizeOptionalString(task?.runId);
	const scopedSessionKey = resolveScopedArtifactSessionKey(runId ? resolveSessionKeyForRun(runId, { agentId }) : void 0, agentId, cfg);
	return scopedSessionKey ? {
		sessionKey: scopedSessionKey,
		agentId
	} : void 0;
}
var ArtifactSessionResolutionError = class extends Error {
	constructor(shape) {
		super(shape.message);
		this.shape = shape;
	}
};
function artifactResponseIsCurrent(found, respond) {
	try {
		found.assertCurrent?.();
		return true;
	} catch (error) {
		if (!(error instanceof ArtifactSessionResolutionError)) throw error;
		respond(false, void 0, error.shape);
		return false;
	}
}
async function prepareArtifactSessionResolution(input) {
	const query = { ...input };
	const taskId = !query.sessionKey && !query.runId ? query.taskId : void 0;
	const read = taskId ? await prepareTaskRegistryRead() : void 0;
	if (taskId && !read) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.UNAVAILABLE, "Task activity did not stabilize. Refresh the artifacts."));
	return (cfg, client) => {
		const task = taskId ? read?.getTaskById(taskId) : void 0;
		const sessionKey = normalizeOptionalString(query.sessionKey);
		let scopedQuery = query;
		if (sessionKey && cfg) {
			const owner = resolveRequestedSessionAgentId(cfg, sessionKey, query.agentId);
			if (!owner.ok) throw new ArtifactSessionResolutionError(owner.error);
			scopedQuery = {
				...query,
				agentId: owner.agentId
			};
		}
		const resolved = resolveQuerySession(scopedQuery, cfg, task);
		if (!resolved) return;
		const target = resolveSessionSharingTarget({
			cfg: cfg ?? {},
			sessionKey: resolved.sessionKey,
			agentId: resolved.agentId
		});
		const error = authorizeIncognitoSessionTarget({
			client,
			sessionKey: query.sessionKey ?? resolved.sessionKey,
			target
		});
		const visibilityDenied = Boolean(target && createSessionListEntryFilter({
			client,
			cfg
		})?.(target.storeKey, target.entry) === false);
		if (!error && !visibilityDenied) return resolved;
		throw new ArtifactSessionResolutionError(query.sessionKey && error ? error : errorShape(ErrorCodes.INVALID_REQUEST, "no session found for artifact query", { details: { type: "artifact_scope_not_found" } }));
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts-image-page.ts
const IMAGE_PAGE_MESSAGES = 32;
const IMAGE_PAGE_BYTES = 262144;
const CURSOR_TTL_MS = 9e5;
const cursors = /* @__PURE__ */ new WeakMap();
const internalCaller = {};
async function readArtifactImagePage(params) {
	const owner = params.client ?? internalCaller;
	let state = cursors.get(owner);
	if (!state) {
		state = /* @__PURE__ */ new Map();
		cursors.set(owner, state);
	}
	const now = Date.now();
	for (const [key, value] of state) if (value.expiresAt <= now) state.delete(key);
	const cursor = params.cursor ? state.get(params.cursor) : void 0;
	if (params.cursor && (!cursor || cursor.binding !== params.binding)) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.INVALID_REQUEST, "Image cursor expired or belongs to another session; restart artifacts.list", { details: { type: "artifact_cursor_invalid" } }));
	const page = await readSessionMessagesPageWithStatsAsync(params.scope, {
		offset: 0,
		beforeSeq: cursor?.beforeSeq,
		maxMessages: IMAGE_PAGE_MESSAGES,
		maxBytes: IMAGE_PAGE_BYTES,
		readOnly: true,
		captureReadWindow: true,
		expectedReadWindow: cursor?.readWindow
	}).catch((error) => {
		if (cursor && isSessionTranscriptProjectionUnavailableError(error)) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.INVALID_REQUEST, "Transcript changed; restart artifacts.list", { details: { type: "artifact_cursor_invalid" } }));
		throw error;
	});
	const artifacts = [];
	let next;
	for (const message of page.messages.toReversed()) {
		const seq = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.seq;
		if (typeof seq !== "number") continue;
		const images = params.collect(message);
		const start = cursor?.beforeSeq === seq + 1 ? cursor.imageOffset : 0;
		for (let index = start; index < images.length; index++) {
			const image = images[index];
			if (image) artifacts.push(image);
			if (artifacts.length === params.limit) {
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
		if (artifacts.length === params.limit) break;
	}
	if (artifacts.length < params.limit && page.olderOffset !== void 0) next = {
		beforeSeq: (cursor?.beforeSeq ?? page.totalMessages + 1) - page.olderOffset,
		imageOffset: 0
	};
	let nextCursor;
	if (next && next.beforeSeq > 1 && page.readWindow) {
		nextCursor = randomUUID();
		state.set(nextCursor, {
			...next,
			binding: params.binding,
			readWindow: page.readWindow,
			expiresAt: now + CURSOR_TTL_MS
		});
		while (state.size > 128) {
			const oldest = state.keys().next().value;
			if (oldest) state.delete(oldest);
		}
	}
	return {
		artifacts,
		...nextCursor ? { nextCursor } : {},
		...page.omittedOversized ? { omittedOversized: true } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts-transcript-images.ts
/** Recover only the referenced persisted bitmap; transcript bytes remain in their existing owner. */
async function findTranscriptImageArtifact(params, getRuntimeConfig, includeData, client) {
	const reference = parseTranscriptImageArtifactId(params.artifactId);
	const resolveSession = await prepareArtifactSessionResolution(params);
	const resolved = resolveSession(getRuntimeConfig(), client);
	if (!reference || !resolved) return {};
	const { sessionKey, agentId } = resolved;
	const { entry, storePath } = loadGatewaySessionEntryReadOnly(sessionKey, { agentId });
	if (!entry?.sessionId || !storePath) return { sessionKey };
	const page = await readSessionMessagesPageWithStatsAsync({
		agentId,
		sessionKey,
		sessionId: entry.sessionId,
		sessionEntry: entry,
		storePath
	}, {
		offset: 0,
		beforeSeq: reference.messageSeq + 1,
		maxMessages: 1,
		maxBytes: MAX_PAYLOAD_BYTES - 4096
	});
	const message = asOptionalRecord(page.messages[0]);
	const block = resolveTranscriptImageArtifactBlock(message, params.artifactId);
	if (!message || !block || params.messageRole && message.role !== params.messageRole || params.runId && resolveMessageRunId(message) !== params.runId || params.taskId && resolveMessageTaskId(message) !== params.taskId) return { sessionKey };
	const download = resolveBlockDownload(block, { includeData });
	if (download.mode !== "bytes") return { sessionKey };
	return {
		sessionKey,
		assertCurrent: () => {
			const authorized = resolveSession(getRuntimeConfig(), client);
			const current = loadGatewaySessionEntryReadOnly(sessionKey, { agentId });
			if (authorized?.sessionKey !== sessionKey || authorized.agentId !== agentId || current.storePath !== storePath || current.entry?.sessionId !== entry.sessionId || current.entry.lifecycleRevision !== entry.lifecycleRevision) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.UNAVAILABLE, "session changed while reading image; reload the conversation", { retryable: true }));
		},
		artifact: {
			id: params.artifactId,
			type: "image",
			title: normalizeOptionalString(block.title) ?? normalizeOptionalString(block.fileName) ?? normalizeOptionalString(block.alt) ?? "Image",
			mimeType: download.mimeType ?? "image/png",
			sizeBytes: download.sizeBytes,
			sessionKey,
			messageSeq: reference.messageSeq,
			source: "session-transcript",
			download: { mode: "bytes" },
			...download.data !== void 0 ? { data: download.data } : {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/artifacts.ts
const queuedArtifactDownloads = /* @__PURE__ */ new Map();
function createArtifactRequestAccess(request) {
	const { assertCurrent } = readGatewayRequestMutationAuthority(request);
	const { context, respond } = request;
	assertCurrent();
	return {
		assertCurrent,
		getRuntimeConfig: () => {
			assertCurrent();
			return context.getRuntimeConfig?.();
		},
		respond: (...args) => {
			assertCurrent();
			respond(...args);
		}
	};
}
function artifactError(type, message, details) {
	return errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
		type,
		...details
	} });
}
function normalizeArtifactType(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "image" || normalized === "input_image" || normalized === "image_url") return "image";
	if (normalized === "audio" || normalized === "input_audio") return "audio";
	if (normalized === "video" || normalized === "input_video") return "video";
	if (normalized === "file" || normalized === "input_file") return "file";
	if (normalized === "attachment") return "file";
	return "file";
}
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
	if (type === "image" || type === "audio" || type === "video" || type === "file" || type === "attachment" || type === "input_image" || type === "input_audio" || type === "input_video" || type === "input_file" || type === "image_url") return true;
	return typeof block.data === "string" || Boolean(block.url || block.openUrl || block.source || block.image_url || block.audio_url);
}
function collectArtifactsFromMessage(params) {
	const msg = asOptionalRecord(params.message);
	if (!msg) return;
	const messageSeq = resolveMessageSeq(msg, params.messageFallbackSeq);
	const messageRunId = resolveMessageRunId(msg);
	const messageTaskId = resolveMessageTaskId(msg);
	if (params.runId && messageRunId !== params.runId) return;
	if (params.taskId && messageTaskId !== params.taskId) return;
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
		const type = params.imagesOnly && attachment?.kind === "image" ? "image" : normalizeArtifactType(normalizeOptionalString(block.type) ?? "file");
		if (params.imagesOnly && type !== "image") continue;
		const title = normalizeOptionalString(block.title) ?? normalizeOptionalString(block.fileName) ?? normalizeOptionalString(block.filename) ?? normalizeOptionalString(block.alt) ?? normalizeOptionalString(attachment?.label) ?? `${type} ${params.collection.count}`;
		const declaredArtifactId = normalizeOptionalString(block.artifactId) ?? normalizeOptionalString(attachment?.artifactId);
		const id = declaredArtifactId && parseManagedOutgoingArtifactId(declaredArtifactId) ? declaredArtifactId : artifactId({
			sessionKey: params.sessionKey,
			messageSeq,
			contentIndex,
			title,
			type
		});
		if (params.downloadArtifactIds && !params.downloadArtifactIds.delete(id)) continue;
		const includeData = params.includeDownloadData !== false;
		const download = resolveBlockDownload(attachment ?? block, { includeData });
		const source = asOptionalRecord(block.source);
		const previewOnly = params.imagesOnly && !parseManagedOutgoingArtifactId(id);
		const imageUrl = params.imagesOnly ? download.data !== void 0 ? `data:${download.mimeType ?? "image/png"};base64,${download.data}` : normalizeOptionalString(attachment?.url) ?? normalizeOptionalString(block.url) ?? normalizeOptionalString(source?.url) ?? mediaUrlValue(block.image_url) : void 0;
		const summary = {
			id: previewOnly ? `preview_${id}` : id,
			type,
			title,
			...download.mimeType ? { mimeType: download.mimeType } : {},
			...download.sizeBytes !== void 0 ? { sizeBytes: download.sizeBytes } : {},
			sessionKey: params.sessionKey,
			...messageRunId ? { runId: messageRunId } : {},
			...messageTaskId ? { taskId: messageTaskId } : {},
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
/** Loads artifacts from the transcript selected by sessionKey, runId, or taskId. */
async function loadArtifacts(query, getRuntimeConfig, opts = {}, client = null) {
	const resolveSession = await prepareArtifactSessionResolution(query);
	const resolved = resolveSession(getRuntimeConfig(), client);
	if (!resolved) return { artifacts: [] };
	const { sessionKey } = resolved;
	const unscopedAgentId = parseAgentSessionKey(sessionKey) ? void 0 : resolved.agentId;
	const { storePath, entry } = unscopedAgentId ? loadGatewaySessionEntryReadOnly(sessionKey, { agentId: unscopedAgentId }) : loadGatewaySessionEntryReadOnly(sessionKey);
	const sessionId = entry?.sessionId;
	if (!sessionId || !storePath) return {
		sessionKey,
		artifacts: []
	};
	const lifecycleRevision = entry.lifecycleRevision;
	const assertCurrent = () => {
		const authorized = resolveSession(getRuntimeConfig(), client);
		const current = loadGatewaySessionEntryReadOnly(sessionKey, unscopedAgentId ? { agentId: unscopedAgentId } : {});
		if (authorized?.sessionKey !== sessionKey || authorized.agentId !== resolved.agentId || current.storePath !== storePath || current.entry?.sessionId !== sessionId || current.entry.lifecycleRevision !== lifecycleRevision) throw new ArtifactSessionResolutionError(errorShape(ErrorCodes.UNAVAILABLE, "session changed while reading artifact; reload the conversation", { retryable: true }));
	};
	const artifacts = [];
	const collection = {
		artifacts,
		count: 0
	};
	const scope = {
		agentId: resolved.agentId ?? resolveAgentIdFromSessionKey(sessionKey),
		sessionEntry: entry,
		sessionId,
		sessionKey,
		storePath
	};
	if (query.type === "image") {
		const page = await readArtifactImagePage({
			scope,
			binding: JSON.stringify([
				sessionKey,
				scope.agentId,
				sessionId,
				query.runId,
				query.taskId,
				query.messageRole
			]),
			client,
			cursor: query.cursor,
			limit: query.limit ?? 4,
			collect: (message) => {
				const images = [];
				collectArtifactsFromMessage({
					message,
					messageFallbackSeq: 1,
					collection: {
						artifacts: images,
						count: 0
					},
					sessionKey,
					runId: query.runId,
					taskId: query.taskId,
					messageRole: query.messageRole,
					imagesOnly: true
				});
				return images.filter((artifact) => artifact.image).map(toSummary).toReversed();
			}
		});
		assertCurrent();
		return {
			...page,
			sessionKey,
			assertCurrent
		};
	}
	const downloadIds = opts.downloadArtifactId ? /* @__PURE__ */ new Set([opts.downloadArtifactId]) : void 0;
	const queuedKey = downloadIds && !resolveSessionTranscriptReadFence(scope) ? JSON.stringify([
		storePath,
		scope.agentId,
		sessionKey,
		sessionId,
		entry.lifecycleRevision,
		query.runId,
		query.taskId,
		query.messageRole,
		readSessionTranscriptUpdateVersion()
	]) : void 0;
	const queued = queuedKey ? queuedArtifactDownloads.get(queuedKey) : void 0;
	if (queued && opts.downloadArtifactId) {
		queued.ids.add(opts.downloadArtifactId);
		const loaded = await queued.result;
		assertCurrent();
		return {
			...loaded,
			assertCurrent
		};
	}
	const collect = async () => {
		if (queuedKey) queuedArtifactDownloads.delete(queuedKey);
		await visitSessionMessagesAsync(scope, (message, seq) => {
			collectArtifactsFromMessage({
				message,
				messageFallbackSeq: seq,
				collection,
				sessionKey,
				runId: query.runId,
				taskId: query.taskId,
				messageRole: query.messageRole,
				includeDownloadData: opts.includeDownloadData,
				downloadArtifactIds: downloadIds
			});
		});
		return {
			sessionKey,
			artifacts
		};
	};
	const result = queuedKey && downloadIds ? Promise.resolve().then(collect) : collect();
	if (queuedKey && downloadIds) queuedArtifactDownloads.set(queuedKey, {
		ids: downloadIds,
		result
	});
	const loaded = await result;
	assertCurrent();
	return {
		...loaded,
		assertCurrent
	};
}
function requireQueryable(params, respond) {
	if (params.sessionKey || params.runId || params.taskId) return true;
	respond(false, void 0, artifactError("artifact_query_unsupported", "artifacts require one of sessionKey, runId, or taskId"));
	return false;
}
function respondArtifactNotFound(respond, requestedArtifactId) {
	respond(false, void 0, artifactError("artifact_not_found", "artifact not found", { artifactId: requestedArtifactId }));
}
async function runArtifactSessionOperation(respond, operation) {
	try {
		return {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		if (error instanceof ArtifactSessionResolutionError) {
			respond(false, void 0, error.shape);
			return { ok: false };
		}
		if (error instanceof AgentSelectionRequiredError) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
			return { ok: false };
		}
		throw error;
	}
}
async function findArtifact(params, getRuntimeConfig, opts = {}, client = null) {
	if (parseTranscriptImageArtifactId(params.artifactId)) return findTranscriptImageArtifact(params, getRuntimeConfig, opts.includeDownloadData !== false, client);
	const loaded = await loadArtifacts(params, getRuntimeConfig, opts, client);
	return {
		sessionKey: loaded.sessionKey,
		artifact: loaded.artifacts.find((artifact) => artifact.id === params.artifactId),
		assertCurrent: loaded.assertCurrent
	};
}
function toSummary(artifact) {
	const { data: _dataValue, url: _url, ...summary } = artifact;
	return summary;
}
async function respondManagedArtifactDownload(query, getRuntimeConfig, client, respond, matched) {
	await runArtifactSessionOperation(respond, async () => {
		const resolveSession = await prepareArtifactSessionResolution(query);
		const cfg = getRuntimeConfig();
		const resolved = resolveSession(cfg, client);
		const defaultAgentId = resolved ? tryResolveSessionCompatibilityOwnerAgentId(cfg ?? {}, resolved.sessionKey) : void 0;
		const managed = resolved && (!matched || matched.sessionKey === resolved.sessionKey) ? await resolveManagedOutgoingMediaArtifactDownload({
			sessionKey: resolved.sessionKey,
			...resolved.agentId ? { agentId: resolved.agentId } : {},
			...defaultAgentId ? { defaultAgentId } : {},
			artifactId: query.artifactId
		}) : null;
		if (!managed) {
			respondArtifactNotFound(respond, query.artifactId);
			return;
		}
		respond(true, {
			artifact: {
				id: managed.artifactId,
				type: managed.type,
				title: managed.title,
				...managed.mimeType ? { mimeType: managed.mimeType } : {},
				...managed.sizeBytes !== void 0 ? { sizeBytes: managed.sizeBytes } : {},
				sessionKey: managed.sessionKey,
				...matched?.runId ? { runId: matched.runId } : {},
				...matched?.taskId ? { taskId: matched.taskId } : {},
				...matched?.messageSeq !== void 0 ? { messageSeq: matched.messageSeq } : {},
				source: "session-transcript",
				download: { mode: "url" }
			},
			url: managed.url,
			expiresAt: managed.expiresAt
		});
	});
}
/** Gateway handlers for listing, summarizing, and downloading transcript artifacts. */
const artifactsHandlers = {
	"artifacts.list": async (request) => {
		const { params, client } = request;
		const { getRuntimeConfig, respond } = createArtifactRequestAccess(request);
		if (!assertValidParams(params, validateArtifactsListParams, "artifacts.list", respond)) return;
		if (!requireQueryable(params, respond)) return;
		if (params.type !== "image" && (params.limit !== void 0 || params.cursor !== void 0)) {
			respond(false, void 0, artifactError("artifact_query_unsupported", "limit and cursor require type image"));
			return;
		}
		const query = { ...params };
		const loaded = await runArtifactSessionOperation(respond, () => loadArtifacts(query, getRuntimeConfig, { includeDownloadData: false }, client));
		if (!loaded.ok) return;
		const { artifacts, sessionKey, nextCursor, omittedOversized } = loaded.value;
		if (!sessionKey && (query.runId || query.taskId)) {
			respond(false, void 0, artifactError("artifact_scope_not_found", "no session found for artifact query"));
			return;
		}
		respond(true, {
			artifacts: artifacts.map(toSummary),
			...nextCursor ? { nextCursor } : {},
			...omittedOversized ? { omittedOversized: true } : {}
		});
	},
	"artifacts.get": async (request) => {
		const { params, client } = request;
		const { getRuntimeConfig, respond } = createArtifactRequestAccess(request);
		if (!assertValidParams(params, validateArtifactsGetParams, "artifacts.get", respond)) return;
		if (!requireQueryable(params, respond)) return;
		const query = { ...params };
		const found = await runArtifactSessionOperation(respond, () => findArtifact(query, getRuntimeConfig, { includeDownloadData: false }, client));
		if (!found.ok) return;
		const { artifact } = found.value;
		if (!artifact) {
			respondArtifactNotFound(respond, query.artifactId);
			return;
		}
		if (artifactResponseIsCurrent(found.value, respond)) respond(true, { artifact: toSummary(artifact) });
	},
	"artifacts.download": async (request) => {
		const { params, client } = request;
		const { getRuntimeConfig, respond, assertCurrent } = createArtifactRequestAccess(request);
		if (!assertValidParams(params, validateArtifactsDownloadParams, "artifacts.download", respond)) return;
		if (!requireQueryable(params, respond)) return;
		const query = { ...params };
		if (query.sessionKey && !query.runId && !query.taskId && !query.messageRole && parseManagedOutgoingArtifactId(query.artifactId)) {
			await respondManagedArtifactDownload(query, getRuntimeConfig, client, respond);
			return;
		}
		const found = await runArtifactSessionOperation(respond, () => findArtifact(query, getRuntimeConfig, { downloadArtifactId: query.artifactId }, client));
		assertCurrent();
		if (!found.ok) return;
		const { artifact } = found.value;
		if (!artifact) {
			respondArtifactNotFound(respond, query.artifactId);
			return;
		}
		if (parseManagedOutgoingArtifactId(artifact.id)) {
			await respondManagedArtifactDownload(query, getRuntimeConfig, client, respond, artifact);
			return;
		}
		if (artifact.download.mode === "unsupported") {
			respond(false, void 0, artifactError("artifact_download_unsupported", "artifact download is unsupported", { artifactId: artifact.id }));
			return;
		}
		if (query.transport === "http") {
			const assertArtifactCurrent = found.value.assertCurrent;
			const download = createArtifactDownload({
				client,
				artifact,
				assertCurrent: () => {
					assertCurrent();
					assertArtifactCurrent?.();
				},
				read: async () => {
					const current = await findArtifact(query, getRuntimeConfig, { downloadArtifactId: query.artifactId }, client);
					current.assertCurrent?.();
					return current.artifact;
				}
			});
			if (download) {
				respond(true, {
					artifact: {
						...toSummary(artifact),
						download: { mode: "url" }
					},
					...download
				});
				return;
			}
		}
		const managedUrl = artifact.download.mode === "url" && artifact.url && artifact.sessionKey ? await resolveManagedOutgoingMediaUrlDownload({
			sessionKey: artifact.sessionKey,
			url: artifact.url
		}) : null;
		if (!artifactResponseIsCurrent(found.value, respond)) return;
		respond(true, {
			artifact: toSummary(artifact),
			...artifact.download.mode === "bytes" ? {
				encoding: "base64",
				data: artifact.data
			} : {},
			...artifact.download.mode === "url" ? {
				url: managedUrl?.url ?? artifact.url,
				...managedUrl ? { expiresAt: managedUrl.expiresAt } : {}
			} : {}
		});
	}
};
//#endregion
export { artifactsHandlers };
