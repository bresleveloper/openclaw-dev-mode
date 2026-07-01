import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { y as basenameFromMediaSource } from "./fs-safe-aqmM_n6V.js";
import { a as root } from "./secure-temp-dir-XAWcZnE2.js";
import { s as hasPotentialPluginActionParam } from "./channel-target-C1SvT627.js";
import { r as extensionForMime } from "./mime-C8mVE2Bw.js";
import { o as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./sandbox-paths-_3aaGW_c.js";
import "./local-file-access-CBe_wA_B.js";
import { t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import "./plugins-DnKj2WmH.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-l6yrCyHc.js";
import { t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import "./store-MjA3hYFB.js";
import { a as resolveChannelMessageToolMediaSourceParamKeys } from "./message-action-discovery-Cssm6Brv.js";
import { E as resolveSnakeCaseParamKey, b as readStringParam, v as readStringArrayParam } from "./common-B2QjWqqG.js";
import { t as resolveChannelAccountMediaMaxMb } from "./configured-max-bytes-RHpfttuD.js";
import { n as loadWebMedia } from "./web-media-DnX3imnL.js";
import { n as resolveOutboundMediaAccess, r as resolveOutboundMediaLocalRoots, t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { t as resolveOutboundAttachmentFromBuffer } from "./outbound-attachment-Cf_wZW0K.js";
import { t as readBooleanParam$1 } from "./boolean-param-BTKsvsxj.js";
//#region src/infra/outbound/message-action-params.ts
/** Shared boolean param reader used by message-action argument normalization. */
const readBooleanParam = readBooleanParam$1;
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
const STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS = new Set([
	"path",
	"filePath",
	"fileUrl"
]);
const SEND_BUFFER_DRY_RUN_MEDIA_URL = "buffer://message-send/attachment";
function readMediaParam(args, key) {
	return readStringParam(args, key, { trim: false });
}
function isRecord(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function resolveMediaParamEntry(args, key) {
	const resolvedKey = resolveSnakeCaseParamKey(args, key);
	if (!resolvedKey) return;
	const value = readMediaParam(args, key);
	if (!value) return;
	return {
		key: resolvedKey,
		value
	};
}
function hasExplicitAttachmentPayload(args, extraParamKeys) {
	if (readStringParam(args, "buffer", { trim: false })) return true;
	return buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
		const entry = resolveMediaParamEntry(args, key);
		return Boolean(entry && normalizeOptionalString(entry.value));
	});
}
function hasExplicitSendMediaSource(args, extraParamKeys) {
	if (buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
		const entry = resolveMediaParamEntry(args, key);
		const value = entry ? normalizeOptionalString(entry.value) : void 0;
		return Boolean(value && value !== SEND_BUFFER_DRY_RUN_MEDIA_URL);
	})) return true;
	if (readStringArrayParam(args, "mediaUrls")?.some((value) => {
		const normalized = normalizeOptionalString(value);
		return Boolean(normalized && normalized !== SEND_BUFFER_DRY_RUN_MEDIA_URL);
	})) return true;
	return collectStructuredAttachmentSources(args).some((source) => Boolean(normalizeOptionalString(source.value)));
}
function collectStructuredAttachmentSources(args) {
	const attachments = args.attachments;
	if (!Array.isArray(attachments)) return [];
	const sources = [];
	for (const attachment of attachments) {
		if (!isRecord(attachment)) continue;
		for (const key of STRUCTURED_ATTACHMENT_MEDIA_SOURCE_PARAM_KEYS) {
			const entry = resolveMediaParamEntry(attachment, key);
			if (!entry || !normalizeOptionalString(entry.value)) continue;
			sources.push({
				attachment,
				key: entry.key,
				value: entry.value,
				kind: STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS.has(key) ? "file" : "media",
				contentType: readStringParam(attachment, "contentType") ?? readStringParam(attachment, "mimeType"),
				filename: readStringParam(attachment, "filename") ?? readStringParam(attachment, "name")
			});
			break;
		}
	}
	return sources;
}
function resolveStructuredAttachmentSource(args, extraParamKeys) {
	if (hasExplicitAttachmentPayload(args, extraParamKeys)) return;
	return collectStructuredAttachmentSources(args)[0];
}
function buildActionMediaSourceParamKeys(extraParamKeys) {
	const keys = new Set(BASE_ACTION_MEDIA_SOURCE_PARAM_KEYS);
	extraParamKeys?.forEach((key) => keys.add(key));
	return Array.from(keys);
}
/** Resolves plugin-declared media source param aliases for a message action. */
function resolveExtraActionMediaSourceParamKeys(params) {
	if (!hasPotentialPluginActionParam(params.args)) return [];
	return resolveChannelMessageToolMediaSourceParamKeys({
		cfg: params.cfg,
		action: params.action,
		channel: params.channel,
		accountId: params.accountId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId,
		requesterSenderId: params.requesterSenderId,
		senderIsOwner: params.senderIsOwner
	});
}
/** Collects candidate media source strings from message-action args. */
function collectActionMediaSourceHints(args, extraParamKeys, options) {
	const sources = [];
	for (const key of buildActionMediaSourceParamKeys(extraParamKeys)) {
		const entry = resolveMediaParamEntry(args, key);
		if (entry && normalizeOptionalString(entry.value)) sources.push(entry.value);
	}
	for (const value of readStringArrayParam(args, "mediaUrls") ?? []) if (normalizeOptionalString(value)) sources.push(value);
	if (options?.structuredAttachments === "all") sources.push(...collectStructuredAttachmentSources(args).map((source) => source.value));
	else {
		const attachmentSource = resolveStructuredAttachmentSource(args, extraParamKeys);
		if (attachmentSource) sources.push(attachmentSource.value);
	}
	return sources;
}
function readAttachmentMediaHint(args) {
	return readMediaParam(args, "media") ?? readMediaParam(args, "mediaUrl");
}
function readAttachmentFileHint(args) {
	return readMediaParam(args, "path") ?? readMediaParam(args, "filePath") ?? readMediaParam(args, "fileUrl");
}
function resolveAttachmentMaxBytes(params) {
	const limitMb = resolveChannelAccountMediaMaxMb(params) ?? params.cfg.agents?.defaults?.mediaMaxMb;
	return typeof limitMb === "number" ? limitMb * 1024 * 1024 : void 0;
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
	if (!params.base64) return {
		base64: params.base64,
		contentType: params.contentType
	};
	const match = /^data:([^;]+);base64,(.*)$/i.exec(params.base64.trim());
	if (!match) return {
		base64: params.base64,
		contentType: params.contentType
	};
	const [, mime, payload] = match;
	return {
		base64: payload,
		contentType: params.contentType ?? mime
	};
}
function resolveSendBufferMaxBytes(params) {
	return resolveAttachmentMaxBytes({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId
	}) ?? 5242880;
}
function decodeBoundedBase64Attachment(params) {
	const estimatedBytes = estimateBase64DecodedBytes(params.base64);
	if (estimatedBytes > params.maxBytes) throw new Error(`Media too large: ${estimatedBytes} bytes (limit: ${params.maxBytes} bytes)`);
	const canonicalBase64 = canonicalizeBase64(params.base64);
	if (!canonicalBase64) throw new Error("message.send buffer has invalid base64 data");
	const buffer = Buffer.from(canonicalBase64, "base64");
	if (buffer.byteLength > params.maxBytes) throw new Error(`Media too large: ${buffer.byteLength} bytes (limit: ${params.maxBytes} bytes)`);
	return buffer;
}
async function hydrateSendBufferMediaParams(params) {
	if (hasExplicitSendMediaSource(params.args, params.extraParamKeys)) {
		delete params.args.buffer;
		return;
	}
	const rawBuffer = readStringParam(params.args, "buffer", { trim: false });
	if (!rawBuffer) return;
	const normalized = normalizeBase64Payload({
		base64: rawBuffer,
		contentType: readStringParam(params.args, "contentType") ?? void 0
	});
	if (!normalized.base64) return;
	const contentType = readStringParam(params.args, "contentType") ?? readStringParam(params.args, "mimeType") ?? normalized.contentType;
	const filename = readStringParam(params.args, "filename") ?? inferAttachmentFilename({ contentType: contentType ?? void 0 });
	const maxBytes = resolveSendBufferMaxBytes(params);
	if (params.dryRun || params.preserveBuffer) {
		decodeBoundedBase64Attachment({
			base64: normalized.base64,
			maxBytes
		});
		params.args.media = SEND_BUFFER_DRY_RUN_MEDIA_URL;
		params.args.mediaUrl = SEND_BUFFER_DRY_RUN_MEDIA_URL;
		params.args.mediaUrls = [SEND_BUFFER_DRY_RUN_MEDIA_URL];
		if (!params.preserveBuffer) delete params.args.buffer;
		if (normalized.contentType && !readStringParam(params.args, "contentType")) params.args.contentType = normalized.contentType;
		if (filename && !readStringParam(params.args, "filename")) params.args.filename = filename;
		return;
	}
	const staged = await resolveOutboundAttachmentFromBuffer(decodeBoundedBase64Attachment({
		base64: normalized.base64,
		maxBytes
	}), maxBytes, {
		contentType: contentType ?? void 0,
		filename
	});
	params.args.media = staged.path;
	params.args.mediaUrl = staged.path;
	params.args.mediaUrls = [staged.path];
	delete params.args.buffer;
	if (staged.contentType && !readStringParam(params.args, "contentType")) params.args.contentType = staged.contentType;
	if (filename && !readStringParam(params.args, "filename")) params.args.filename = filename;
}
/** Chooses sandbox or host media loading policy for attachment hydration. */
function resolveAttachmentMediaPolicy(params) {
	const sandboxRoot = params.sandboxRoot?.trim();
	if (sandboxRoot) return {
		mode: "sandbox",
		sandboxRoot
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
		const readSandboxFile = async (filePath) => {
			sandboxFsPromise ??= root(sandboxRoot);
			return await (await sandboxFsPromise).readBytes(filePath);
		};
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
async function hydrateAttachmentPayload(params) {
	const contentTypeParam = params.contentTypeParam ?? void 0;
	const rawBuffer = readStringParam(params.args, "buffer", { trim: false });
	const normalized = normalizeBase64Payload({
		base64: rawBuffer,
		contentType: contentTypeParam ?? void 0
	});
	if (normalized.base64 !== rawBuffer && normalized.base64) {
		params.args.buffer = normalized.base64;
		if (normalized.contentType && !contentTypeParam) params.args.contentType = normalized.contentType;
	}
	const filename = readStringParam(params.args, "filename");
	const mediaSource = (params.mediaHint ?? void 0) || (params.fileHint ?? void 0);
	if (!params.dryRun && !readStringParam(params.args, "buffer", { trim: false }) && mediaSource) {
		const maxBytes = resolveAttachmentMaxBytes({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId
		});
		const media = await loadWebMedia(mediaSource, buildAttachmentMediaLoadOptions({
			policy: params.mediaPolicy,
			maxBytes,
			optimizeImages: params.optimizeImages
		}));
		params.args.buffer = media.buffer.toString("base64");
		if (!contentTypeParam && media.contentType) params.args.contentType = media.contentType;
		if (!filename) params.args.filename = inferAttachmentFilename({
			mediaHint: media.fileName ?? mediaSource,
			contentType: media.contentType ?? contentTypeParam ?? void 0
		});
	} else if (!filename) params.args.filename = inferAttachmentFilename({
		mediaHint: mediaSource,
		contentType: contentTypeParam ?? void 0
	});
}
/** Rewrites action media params to sandbox-safe paths and rejects data URLs. */
async function normalizeSandboxMediaParams(params) {
	const sandboxRoot = params.mediaPolicy.mode === "sandbox" ? params.mediaPolicy.sandboxRoot.trim() : void 0;
	for (const key of buildActionMediaSourceParamKeys(params.extraParamKeys)) {
		const entry = resolveMediaParamEntry(params.args, key);
		if (!entry) continue;
		assertMediaNotDataUrl(entry.value);
		if (!sandboxRoot) continue;
		const normalized = await resolveSandboxedMediaSource({
			media: entry.value,
			sandboxRoot
		});
		if (normalized !== entry.value) params.args[entry.key] = normalized;
	}
	const attachmentSources = params.structuredAttachments === "all" ? collectStructuredAttachmentSources(params.args) : [resolveStructuredAttachmentSource(params.args, params.extraParamKeys)].filter((source) => Boolean(source));
	if (attachmentSources.length === 0) return;
	for (const attachmentSource of attachmentSources) {
		assertMediaNotDataUrl(attachmentSource.value);
		if (!sandboxRoot) continue;
		const normalized = await resolveSandboxedMediaSource({
			media: attachmentSource.value,
			sandboxRoot
		});
		if (normalized !== attachmentSource.value) attachmentSource.attachment[attachmentSource.key] = normalized;
	}
}
/** Normalizes a list of media hints against an optional sandbox root. */
async function normalizeSandboxMediaList(params) {
	const sandboxRoot = params.sandboxRoot?.trim();
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const value of params.values) {
		const raw = value?.trim();
		if (!raw) continue;
		assertMediaNotDataUrl(raw);
		const resolved = sandboxRoot ? await resolveSandboxedMediaSource({
			media: raw,
			sandboxRoot
		}) : raw;
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		normalized.push(resolved);
	}
	return normalized;
}
async function hydrateAttachmentActionPayload(params) {
	const attachmentSource = resolveStructuredAttachmentSource(params.args, params.extraParamKeys);
	const mediaHint = readAttachmentMediaHint(params.args);
	const fileHint = readAttachmentFileHint(params.args);
	const contentTypeParam = readStringParam(params.args, "contentType") ?? readStringParam(params.args, "mimeType") ?? attachmentSource?.contentType;
	if (attachmentSource?.filename && !readStringParam(params.args, "filename")) params.args.filename = attachmentSource.filename;
	if (attachmentSource?.contentType && !readStringParam(params.args, "contentType")) params.args.contentType = attachmentSource.contentType;
	if (params.allowMessageCaptionFallback) {
		const caption = readStringParam(params.args, "caption", { allowEmpty: true })?.trim();
		const message = readStringParam(params.args, "message", { allowEmpty: true })?.trim();
		if (!caption && message) params.args.caption = message;
	}
	await hydrateAttachmentPayload({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		args: params.args,
		dryRun: params.dryRun,
		contentTypeParam,
		mediaHint: mediaHint ?? (attachmentSource?.kind === "media" ? attachmentSource.value : void 0),
		fileHint: fileHint ?? (attachmentSource?.kind === "file" ? attachmentSource.value : void 0),
		mediaPolicy: params.mediaPolicy,
		optimizeImages: params.optimizeImages
	});
}
/** Hydrates attachment-bearing message actions with base64 buffers and metadata. */
async function hydrateAttachmentParamsForAction(params) {
	const shouldHydrateUploadFile = params.action === "upload-file";
	if (params.action === "send") {
		await hydrateSendBufferMediaParams({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId,
			args: params.args,
			dryRun: params.dryRun,
			preserveBuffer: params.preserveSendBuffer,
			extraParamKeys: params.extraParamKeys
		});
		return;
	}
	if (params.action !== "sendAttachment" && params.action !== "setGroupIcon" && params.action !== "reply" && !shouldHydrateUploadFile) return;
	const forceDocument = readBooleanParam$1(params.args, "forceDocument") ?? readBooleanParam$1(params.args, "asDocument") ?? false;
	await hydrateAttachmentActionPayload({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		args: params.args,
		dryRun: params.dryRun,
		mediaPolicy: params.mediaPolicy,
		extraParamKeys: params.extraParamKeys,
		optimizeImages: shouldHydrateUploadFile && forceDocument ? false : void 0,
		allowMessageCaptionFallback: params.action === "sendAttachment" || shouldHydrateUploadFile
	});
}
/** Parses a named string param as JSON for structured message action fields. */
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
/** Parses the interactive message action param as JSON when provided as a string. */
function parseInteractiveParam(params) {
	const raw = params.interactive;
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	if (!trimmed) {
		delete params.interactive;
		return;
	}
	try {
		params.interactive = JSON.parse(trimmed);
	} catch {
		throw new Error("--interactive must be valid JSON");
	}
}
//#endregion
//#region src/channels/plugins/message-action-dispatch.ts
function requiresTrustedRequesterSender(ctx) {
	const plugin = getChannelPlugin(ctx.channel);
	return Boolean(plugin?.actions?.requiresTrustedRequesterSender?.({
		action: ctx.action,
		toolContext: ctx.toolContext
	}));
}
/**
* Runs a channel message action if the target plugin supports it.
*/
async function dispatchChannelMessageAction(ctx) {
	if (requiresTrustedRequesterSender(ctx) && !ctx.requesterSenderId?.trim()) throw new Error(`Trusted sender identity is required for ${ctx.channel}:${ctx.action} in tool-driven contexts.`);
	const plugin = getChannelPlugin(ctx.channel);
	if (!plugin?.actions?.handleAction) return null;
	if (plugin.actions.supportsAction && !plugin.actions.supportsAction({ action: ctx.action })) return null;
	return await plugin.actions.handleAction(ctx);
}
//#endregion
export { normalizeSandboxMediaParams as a, readBooleanParam as c, normalizeSandboxMediaList as i, resolveAttachmentMediaPolicy as l, collectActionMediaSourceHints as n, parseInteractiveParam as o, hydrateAttachmentParamsForAction as r, parseJsonMessageParam as s, dispatchChannelMessageAction as t, resolveExtraActionMediaSourceParamKeys as u };
