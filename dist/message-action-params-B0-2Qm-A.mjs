import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { r as extensionForMime } from "./mime-C3j3dfQb.mjs";
import { n as resolveSnakeCaseParamKey } from "./param-key-BvJDza_v.mjs";
import { f as readStringArrayParam, m as readToolStringParam } from "./common-BofcG96e.mjs";
import { n as normalizeMediaReferenceSource } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-CU53EX1R.mjs";
import { f as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./sandbox-paths-CgSBSdCM.mjs";
import { t as createBoundedOutboundMediaReadFile } from "./bounded-read-file-BXBH3Nms.mjs";
import "./store-BOkrav0N.mjs";
import { n as classifyMediaReferenceSource } from "./media-reference-Dlq4zAi4.mjs";
import { n as resolveChannelAccountMediaMaxMb } from "./configured-max-bytes-BaCve0jk.mjs";
import { n as resolveOutboundMediaAccess, r as resolveOutboundMediaLocalRoots, t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "./web-media-Dv3ATZ34.mjs";
import { i as resolveChannelMessageToolMediaSourceParamKeysAsync } from "./message-action-discovery-Cx3B-j_q.mjs";
import { t as readBooleanParam } from "./boolean-param-Cb1071iT.mjs";
import { t as resolveOutboundAttachmentFromBuffer } from "./outbound-attachment-B1MK3cQ0.mjs";
import { basenameFromMediaSource } from "@openclaw/fs-safe/advanced";
//#region src/infra/outbound/message-action-param-keys.ts
const STANDARD_MESSAGE_ACTION_PARAM_KEYS = /* @__PURE__ */ new Set([
	"accountId",
	"action",
	"asDocument",
	"attachments",
	"base64",
	"bestEffort",
	"buffer",
	"caption",
	"channel",
	"channelId",
	"clawhub",
	"contentType",
	"delivery",
	"dryRun",
	"filePath",
	"fileUrl",
	"filename",
	"forceDocument",
	"gifPlayback",
	"gatewayToken",
	"gatewayUrl",
	"image",
	"idempotencyKey",
	"interactive",
	"json",
	"media",
	"mediaUrl",
	"mediaUrls",
	"media_urls",
	"message",
	"mimeType",
	"path",
	"pollAnonymous",
	"pollDurationHours",
	"pollMulti",
	"pollOption",
	"pollPublic",
	"pollQuestion",
	"pin",
	"presentation",
	"replyTo",
	"silent",
	"senderIsOwner",
	"target",
	"targets",
	"text",
	"threadId",
	"timeoutMs",
	"topLevel",
	"to"
]);
/**
* Detects non-standard message action params that may need plugin-owned handling.
*/
function hasPotentialPluginActionParam(params) {
	return Object.entries(params).some(([key, value]) => {
		if (STANDARD_MESSAGE_ACTION_PARAM_KEYS.has(key)) return false;
		return typeof value === "string" ? Boolean(normalizeOptionalString(value)) : typeof value === "number" ? Number.isFinite(value) : value !== void 0;
	});
}
//#endregion
//#region src/infra/outbound/message-action-params.ts
const BASE_ACTION_MEDIA_SOURCE_PARAM_KEYS = [
	"media",
	"path",
	"filePath",
	"mediaUrl",
	"fileUrl",
	"image"
];
const STRUCTURED_ATTACHMENT_MEDIA_SOURCE_PARAM_KEYS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl",
	"url"
];
const STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS = /* @__PURE__ */ new Set([
	"path",
	"filePath",
	"fileUrl"
]);
const SEND_BUFFER_DRY_RUN_MEDIA_URL = "buffer://message-send/attachment";
function readAttachmentContentType(args) {
	return readToolStringParam(args, "contentType") ?? readToolStringParam(args, "mimeType");
}
function resolveMediaParamEntry(args, key) {
	const resolvedKey = resolveSnakeCaseParamKey(args, key);
	if (!resolvedKey) return;
	const value = readToolStringParam(args, key, { trim: false });
	return value ? {
		key: resolvedKey,
		value
	} : void 0;
}
function hasExplicitAttachmentPayload(args, extraParamKeys) {
	return Boolean(readToolStringParam(args, "buffer", { trim: false })) || buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
		const entry = resolveMediaParamEntry(args, key);
		return Boolean(entry && normalizeOptionalString(entry.value));
	});
}
function hasExplicitSendMediaSource(args, extraParamKeys) {
	return buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
		const entry = resolveMediaParamEntry(args, key);
		const value = entry ? normalizeOptionalString(entry.value) : void 0;
		return Boolean(value && value !== SEND_BUFFER_DRY_RUN_MEDIA_URL);
	}) || readStringArrayParam(args, "mediaUrls")?.some((value) => value !== SEND_BUFFER_DRY_RUN_MEDIA_URL) === true || collectAttachmentSources(args).length > 0;
}
function collectAttachmentSources(args) {
	const attachments = args.attachments;
	if (!Array.isArray(attachments)) return [];
	const sources = [];
	for (const item of attachments) {
		if (!isRecord(item)) continue;
		for (const key of STRUCTURED_ATTACHMENT_MEDIA_SOURCE_PARAM_KEYS) {
			const entry = resolveMediaParamEntry(item, key);
			if (!entry || !normalizeOptionalString(entry.value)) continue;
			sources.push({
				attachment: item,
				key: entry.key,
				value: entry.value,
				kind: STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS.has(key) ? "file" : "media",
				contentType: readAttachmentContentType(item),
				filename: readToolStringParam(item, "filename") ?? readToolStringParam(item, "name")
			});
		}
	}
	return sources;
}
function selectStructuredAttachmentSources(args, extraParamKeys, mode) {
	if (mode !== "all" && hasExplicitAttachmentPayload(args, extraParamKeys)) return [];
	const sources = collectAttachmentSources(args);
	return mode === "all" ? sources : sources.slice(0, 1);
}
function buildActionMediaSourceParamKeys(extraParamKeys) {
	return [.../* @__PURE__ */ new Set([...BASE_ACTION_MEDIA_SOURCE_PARAM_KEYS, ...extraParamKeys ?? []])];
}
async function resolveExtraActionMediaSourceParamKeysAsync(params) {
	if (!hasPotentialPluginActionParam(params.args)) return [];
	return resolveChannelMessageToolMediaSourceParamKeysAsync(params);
}
function collectActionMediaSourceHints(args, extraParamKeys, options) {
	const sources = [];
	for (const key of buildActionMediaSourceParamKeys(extraParamKeys)) {
		const entry = resolveMediaParamEntry(args, key);
		if (entry && normalizeOptionalString(entry.value)) sources.push(entry.value);
	}
	return sources.concat(readStringArrayParam(args, "mediaUrls") ?? [], selectStructuredAttachmentSources(args, extraParamKeys, options?.structuredAttachments).map((source) => source.value));
}
/** Local references need the checkout; remote and already-managed media keep their own lifetimes. */
async function waitForLocalMessageMedia(params) {
	const readiness = params.workspaceReadiness;
	if (!readiness || !params.sources.some((source) => {
		const reference = classifyMediaReferenceSource(normalizeMediaReferenceSource(source.trim()));
		return !reference.hasUnsupportedScheme && !reference.isHttpUrl && !reference.isDataUrl && !reference.isMediaStoreUrl;
	})) return;
	params.assertCurrent?.();
	readiness.assertCurrent();
	await readiness.waitUntilReady();
	params.abortSignal?.throwIfAborted();
	params.assertCurrent?.();
	readiness.assertCurrent();
}
function resolveAttachmentMaxBytes(params) {
	const limitMb = asPositiveFiniteNumber(resolveChannelAccountMediaMaxMb(params) ?? params.cfg.agents?.defaults?.mediaMaxMb);
	return limitMb === void 0 ? void 0 : limitMb * 1024 * 1024;
}
function inferAttachmentFilename(params) {
	const mediaHint = params.mediaHint?.trim();
	if (mediaHint) {
		const base = basenameFromMediaSource(mediaHint);
		const safeBase = base ? basenameFromAnyPath(base) : void 0;
		if (safeBase) return safeBase;
	}
	const ext = params.contentType ? extensionForMime(params.contentType) : void 0;
	return ext ? `attachment${ext}` : "attachment";
}
function normalizeBase64Payload(params) {
	const match = params.base64 ? /^data:([^;,\s]+)(;(?!base64)[^,;\s]+)*;base64,(.*)$/is.exec(params.base64.trim()) : null;
	if (!match) return params;
	const [, mime, , payload] = match;
	return {
		base64: payload,
		contentType: params.contentType ?? mime
	};
}
function resolveAttachmentMediaPolicy(params) {
	const sandboxRoot = params.sandboxRoot?.trim();
	if (sandboxRoot) return {
		mode: "sandbox",
		sandboxRoot,
		...params.sandboxContainerWorkdir ? { containerWorkdir: params.sandboxContainerWorkdir } : {},
		...params.mediaReadFile ? { mediaReadFile: params.mediaReadFile } : {}
	};
	const explicitLocalRoots = resolveOutboundMediaLocalRoots(params.mediaLocalRoots);
	return {
		mode: "host",
		mediaAccess: resolveOutboundMediaAccess({
			mediaAccess: params.mediaAccess,
			mediaLocalRoots: explicitLocalRoots === "any" ? void 0 : explicitLocalRoots,
			mediaReadFile: params.mediaAccess?.readFile ? void 0 : params.mediaReadFile
		}),
		...explicitLocalRoots !== void 0 ? { mediaLocalRoots: explicitLocalRoots } : {},
		...params.mediaAccess?.readFile ? {} : params.mediaReadFile ? { mediaReadFile: params.mediaReadFile } : {}
	};
}
function buildAttachmentMediaLoadOptions(params) {
	if (params.policy.mode === "sandbox") {
		const sandboxRoot = params.policy.sandboxRoot.trim();
		let sandboxFsPromise;
		const readSandboxFile = params.policy.mediaReadFile ?? createBoundedOutboundMediaReadFile(async (filePath, options) => {
			sandboxFsPromise ??= root(sandboxRoot);
			return await (await sandboxFsPromise).readBytes(filePath, { maxBytes: options?.maxBytes });
		});
		return {
			maxBytes: params.maxBytes,
			...params.optimizeImages !== void 0 ? { optimizeImages: params.optimizeImages } : {},
			sandboxValidated: true,
			readFile: readSandboxFile
		};
	}
	return buildOutboundMediaLoadOptions({
		maxBytes: params.maxBytes,
		mediaAccess: params.policy.mediaAccess,
		mediaLocalRoots: params.policy.mediaLocalRoots,
		mediaReadFile: params.policy.mediaReadFile,
		optimizeImages: params.optimizeImages
	});
}
async function normalizeSandboxMediaParams(params) {
	const sandbox = params.mediaPolicy.mode === "sandbox" ? {
		sandboxRoot: params.mediaPolicy.sandboxRoot.trim(),
		containerWorkdir: params.mediaPolicy.containerWorkdir
	} : void 0;
	const normalize = async (target, entry) => {
		assertMediaNotDataUrl(entry.value);
		if (sandbox?.sandboxRoot) {
			const normalized = await resolveSandboxedMediaSource({
				media: entry.value,
				...sandbox
			});
			if (normalized !== entry.value) target[entry.key] = normalized;
		}
	};
	for (const key of buildActionMediaSourceParamKeys(params.extraParamKeys)) {
		const entry = resolveMediaParamEntry(params.args, key);
		if (entry) await normalize(params.args, entry);
	}
	for (const attachmentSource of selectStructuredAttachmentSources(params.args, params.extraParamKeys, params.structuredAttachments)) await normalize(attachmentSource.attachment, attachmentSource);
}
async function normalizeSandboxMediaSource(params) {
	const sandboxRoot = params.sandboxRoot?.trim();
	const raw = params.value.trim();
	assertMediaNotDataUrl(raw);
	return sandboxRoot ? await resolveSandboxedMediaSource({
		media: raw,
		sandboxRoot,
		containerWorkdir: params.sandboxContainerWorkdir
	}) : raw;
}
async function hydrateAttachmentParamsForAction(params) {
	const shouldHydrateUploadFile = params.action === "upload-file";
	if (params.action === "send") {
		const { args, preserveSendBuffer } = params;
		if (hasExplicitSendMediaSource(args, params.extraParamKeys)) {
			delete args.buffer;
			return;
		}
		const rawBuffer = readToolStringParam(args, "buffer", { trim: false });
		if (!rawBuffer) return;
		const normalized = normalizeBase64Payload({
			base64: rawBuffer,
			contentType: readAttachmentContentType(args)
		});
		if (!normalized.base64) return;
		const filename = readToolStringParam(args, "filename") ?? inferAttachmentFilename({ contentType: normalized.contentType });
		const maxBytes = resolveAttachmentMaxBytes(params) ?? 5242880;
		const estimatedBytes = estimateBase64DecodedBytes(normalized.base64);
		if (estimatedBytes > maxBytes) throw new Error(`Media too large: ${estimatedBytes} bytes (limit: ${maxBytes} bytes)`);
		const canonicalBase64 = canonicalizeBase64(normalized.base64);
		if (!canonicalBase64) throw new Error("message.send buffer has invalid base64 data");
		const staged = params.dryRun || preserveSendBuffer ? {
			path: SEND_BUFFER_DRY_RUN_MEDIA_URL,
			contentType: normalized.contentType
		} : await resolveOutboundAttachmentFromBuffer(Buffer.from(canonicalBase64, "base64"), maxBytes, {
			contentType: normalized.contentType,
			filename,
			assertCommitAllowed: params.assertClientUploadAllowed
		});
		args.media = staged.path;
		args.mediaUrl = staged.path;
		args.mediaUrls = [staged.path];
		if (!preserveSendBuffer) delete args.buffer;
		if (staged.contentType && !readToolStringParam(args, "contentType")) args.contentType = staged.contentType;
		if (!readToolStringParam(args, "filename")) args.filename = filename;
		return;
	}
	if (params.action !== "sendAttachment" && params.action !== "setGroupIcon" && params.action !== "reply" && !shouldHydrateUploadFile) return;
	const forceDocument = readBooleanParam(params.args, "forceDocument") ?? readBooleanParam(params.args, "asDocument") ?? false;
	const optimizeImages = shouldHydrateUploadFile && forceDocument ? false : void 0;
	const allowMessageCaptionFallback = params.action === "sendAttachment" || shouldHydrateUploadFile;
	const attachmentSource = selectStructuredAttachmentSources(params.args, params.extraParamKeys)[0];
	const mediaHint = readToolStringParam(params.args, "media", { trim: false }) ?? readToolStringParam(params.args, "mediaUrl", { trim: false });
	const fileHint = readToolStringParam(params.args, "path", { trim: false }) ?? readToolStringParam(params.args, "filePath", { trim: false }) ?? readToolStringParam(params.args, "fileUrl", { trim: false });
	const contentTypeParam = readAttachmentContentType(params.args) ?? attachmentSource?.contentType;
	if (attachmentSource?.filename && !readToolStringParam(params.args, "filename")) params.args.filename = attachmentSource.filename;
	if (allowMessageCaptionFallback) {
		const caption = readToolStringParam(params.args, "caption", { allowEmpty: true });
		const message = readToolStringParam(params.args, "message", { allowEmpty: true });
		if (!caption && message) params.args.caption = message;
	}
	const selectedMediaHint = mediaHint ?? (attachmentSource?.kind === "media" ? attachmentSource.value : void 0);
	const selectedFileHint = fileHint ?? (attachmentSource?.kind === "file" ? attachmentSource.value : void 0);
	const rawBuffer = readToolStringParam(params.args, "buffer", { trim: false });
	const normalized = normalizeBase64Payload({
		base64: rawBuffer,
		contentType: contentTypeParam ?? void 0
	});
	if (normalized.base64 !== rawBuffer && normalized.base64) params.args.buffer = normalized.base64;
	if (normalized.contentType && !readToolStringParam(params.args, "contentType")) params.args.contentType = normalized.contentType;
	const filename = readToolStringParam(params.args, "filename");
	const mediaSource = selectedMediaHint || selectedFileHint;
	if (!params.dryRun && !rawBuffer && mediaSource) {
		const maxBytes = resolveAttachmentMaxBytes(params);
		const media = await loadWebMedia(mediaSource, buildAttachmentMediaLoadOptions({
			policy: params.mediaPolicy,
			maxBytes,
			optimizeImages
		}));
		params.args.buffer = media.buffer.toString("base64");
		if (!contentTypeParam && media.contentType) params.args.contentType = media.contentType;
		if (!filename) params.args.filename = inferAttachmentFilename({
			mediaHint: media.fileName ?? mediaSource,
			contentType: media.contentType ?? contentTypeParam ?? void 0
		});
	} else if (!filename) params.args.filename = inferAttachmentFilename({
		mediaHint: mediaSource,
		contentType: normalized.contentType
	});
}
function parseJsonMessageParam(params, key) {
	const raw = params[key];
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	if (!trimmed) {
		delete params[key];
		return;
	}
	try {
		params[key] = JSON.parse(trimmed);
	} catch {
		throw new Error(`--${key} must be valid JSON`);
	}
}
//#endregion
export { normalizeSandboxMediaSource as a, resolveExtraActionMediaSourceParamKeysAsync as c, normalizeSandboxMediaParams as i, waitForLocalMessageMedia as l, collectAttachmentSources as n, parseJsonMessageParam as o, hydrateAttachmentParamsForAction as r, resolveAttachmentMediaPolicy as s, collectActionMediaSourceHints as t, hasPotentialPluginActionParam as u };
