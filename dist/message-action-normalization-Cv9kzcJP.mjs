import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, t as hasNonEmptyString, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-Rvdo_TFm.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as basenameFromMediaSource } from "./local-file-access-B6bU8SNO.mjs";
import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import { a as resolveChannelPluginRegistration } from "./registry-D3wOWFDo.mjs";
import { n as resolveSnakeCaseParamKey } from "./param-key-J0cnwxlA.mjs";
import { h as readToolStringParam, p as readStringArrayParam } from "./common-XfKigJno.mjs";
import { f as resolveSandboxedMediaSource, t as assertMediaNotDataUrl } from "./sandbox-paths-BZ4BvxS2.mjs";
import { t as createBoundedOutboundMediaReadFile } from "./bounded-read-file-BXBH3Nms.mjs";
import { i as withChannelReadAuthority } from "./channel-read-authority-CLJnqxr1.mjs";
import "./store-CqRcb7T5.mjs";
import { s as assertOutboundHandoffCurrent } from "./delivery-queue-reconciliation-CRIys7F4.mjs";
import { i as missingMessageActionTargetError } from "./target-errors-BPI2bPFa.mjs";
import { i as enforceMessageActionAllowlist } from "./outbound-policy-FGZ3SIts.mjs";
import { t as resolveChannelAccountMediaMaxMb } from "./configured-max-bytes-CWCWnxsU.mjs";
import { n as resolveOutboundMediaAccess, r as resolveOutboundMediaLocalRoots, t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "./web-media-wGhP3Hri.mjs";
import { o as resolveChannelMessageToolMediaSourceParamKeys } from "./message-action-discovery-mbmtKLEH.mjs";
import { t as resolveOutboundAttachmentFromBuffer } from "./outbound-attachment-BRWs8pl9.mjs";
import { t as readBooleanParam } from "./boolean-param-DmR0WqRm.mjs";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { r as validateExplicitMessageAccountSelection } from "./message-account-selection-DKo1WWcf.mjs";
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
		if (typeof value === "string") return Boolean(normalizeOptionalString(value));
		if (typeof value === "number") return Number.isFinite(value);
		return value !== void 0;
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
function readMediaParam(args, key) {
	return readToolStringParam(args, key, { trim: false });
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
	if (readToolStringParam(args, "buffer", { trim: false })) return true;
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
	return collectAttachmentSources(args).some((source) => Boolean(normalizeOptionalString(source.value)));
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
				contentType: readToolStringParam(item, "contentType") ?? readToolStringParam(item, "mimeType"),
				filename: readToolStringParam(item, "filename") ?? readToolStringParam(item, "name")
			});
		}
	}
	return sources;
}
function resolveStructuredAttachmentSource(args, extraParamKeys) {
	if (hasExplicitAttachmentPayload(args, extraParamKeys)) return;
	return collectAttachmentSources(args)[0];
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
	if (options?.structuredAttachments === "all") sources.push(...collectAttachmentSources(args).map((source) => source.value));
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
	const match = /^data:([^;,\s]+)(;(?!base64)[^,;\s]+)*;base64,(.*)$/is.exec(params.base64.trim());
	if (!match) return {
		base64: params.base64,
		contentType: params.contentType
	};
	const [, mime, , payload] = match;
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
function validateBoundedBase64Attachment(params) {
	const estimatedBytes = estimateBase64DecodedBytes(params.base64);
	if (estimatedBytes > params.maxBytes) throw new Error(`Media too large: ${estimatedBytes} bytes (limit: ${params.maxBytes} bytes)`);
	const canonicalBase64 = canonicalizeBase64(params.base64);
	if (!canonicalBase64) throw new Error("message.send buffer has invalid base64 data");
	return canonicalBase64;
}
async function hydrateSendBufferMediaParams(params) {
	if (hasExplicitSendMediaSource(params.args, params.extraParamKeys)) {
		delete params.args.buffer;
		return;
	}
	const rawBuffer = readToolStringParam(params.args, "buffer", { trim: false });
	if (!rawBuffer) return;
	const normalized = normalizeBase64Payload({
		base64: rawBuffer,
		contentType: readToolStringParam(params.args, "contentType") ?? readToolStringParam(params.args, "mimeType")
	});
	if (!normalized.base64) return;
	const filename = readToolStringParam(params.args, "filename") ?? inferAttachmentFilename({ contentType: normalized.contentType });
	const maxBytes = resolveSendBufferMaxBytes(params);
	const canonicalBase64 = validateBoundedBase64Attachment({
		base64: normalized.base64,
		maxBytes
	});
	if (params.dryRun || params.preserveBuffer) {
		params.args.media = SEND_BUFFER_DRY_RUN_MEDIA_URL;
		params.args.mediaUrl = SEND_BUFFER_DRY_RUN_MEDIA_URL;
		params.args.mediaUrls = [SEND_BUFFER_DRY_RUN_MEDIA_URL];
		if (!params.preserveBuffer) delete params.args.buffer;
		if (normalized.contentType && !readToolStringParam(params.args, "contentType")) params.args.contentType = normalized.contentType;
		if (filename && !readToolStringParam(params.args, "filename")) params.args.filename = filename;
		return;
	}
	const staged = await resolveOutboundAttachmentFromBuffer(Buffer.from(canonicalBase64, "base64"), maxBytes, {
		contentType: normalized.contentType,
		filename
	});
	params.args.media = staged.path;
	params.args.mediaUrl = staged.path;
	params.args.mediaUrls = [staged.path];
	delete params.args.buffer;
	if (staged.contentType && !readToolStringParam(params.args, "contentType")) params.args.contentType = staged.contentType;
	if (filename && !readToolStringParam(params.args, "filename")) params.args.filename = filename;
}
/** Chooses sandbox or host media loading policy for attachment hydration. */
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
/** Rewrites action media params to sandbox-safe paths and rejects data URLs. */
async function normalizeSandboxMediaParams(params) {
	const sandbox = params.mediaPolicy.mode === "sandbox" ? {
		sandboxRoot: params.mediaPolicy.sandboxRoot.trim(),
		containerWorkdir: params.mediaPolicy.containerWorkdir
	} : void 0;
	for (const key of buildActionMediaSourceParamKeys(params.extraParamKeys)) {
		const entry = resolveMediaParamEntry(params.args, key);
		if (!entry) continue;
		assertMediaNotDataUrl(entry.value);
		if (!sandbox?.sandboxRoot) continue;
		const normalized = await resolveSandboxedMediaSource({
			media: entry.value,
			...sandbox
		});
		if (normalized !== entry.value) params.args[entry.key] = normalized;
	}
	const attachmentSources = params.structuredAttachments === "all" ? collectAttachmentSources(params.args) : [resolveStructuredAttachmentSource(params.args, params.extraParamKeys)].filter((source) => Boolean(source));
	if (attachmentSources.length === 0) return;
	for (const attachmentSource of attachmentSources) {
		assertMediaNotDataUrl(attachmentSource.value);
		if (!sandbox?.sandboxRoot) continue;
		const normalized = await resolveSandboxedMediaSource({
			media: attachmentSource.value,
			...sandbox
		});
		if (normalized !== attachmentSource.value) attachmentSource.attachment[attachmentSource.key] = normalized;
	}
}
/** Normalizes a media hint against an optional sandbox root. */
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
	const forceDocument = readBooleanParam(params.args, "forceDocument") ?? readBooleanParam(params.args, "asDocument") ?? false;
	const optimizeImages = shouldHydrateUploadFile && forceDocument ? false : void 0;
	const allowMessageCaptionFallback = params.action === "sendAttachment" || shouldHydrateUploadFile;
	const attachmentSource = resolveStructuredAttachmentSource(params.args, params.extraParamKeys);
	const mediaHint = readAttachmentMediaHint(params.args);
	const fileHint = readAttachmentFileHint(params.args);
	const contentTypeParam = readToolStringParam(params.args, "contentType") ?? readToolStringParam(params.args, "mimeType") ?? attachmentSource?.contentType;
	if (attachmentSource?.filename && !readToolStringParam(params.args, "filename")) params.args.filename = attachmentSource.filename;
	if (allowMessageCaptionFallback) {
		const caption = readToolStringParam(params.args, "caption", { allowEmpty: true })?.trim();
		const message = readToolStringParam(params.args, "message", { allowEmpty: true })?.trim();
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
		const maxBytes = resolveAttachmentMaxBytes({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId
		});
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
	parseJsonMessageParam(params, "interactive");
}
//#endregion
//#region src/infra/outbound/message-action-write-authority.ts
/** Admit preparation and execution against the same invocation configuration. */
function prepareMessageActionWriteAuthority(params) {
	const { context, plugin } = params;
	const { action, channel, accountId } = context;
	if (!params.hasRegistrationAuthority || !plugin.actions?.writeAuthorityActions?.includes(action)) throw new Error(`Scheduled ${channel}:${action} requires an active bundled or verified official plugin with write authorization support. Update and reload a supported plugin, then retry.`);
	const assertCurrent = () => {
		params.assertCurrent();
		context.assertDirectAdapterHandoff?.();
	};
	assertCurrent();
	const cfg = context.cfg;
	enforceMessageActionAllowlist({
		cfg,
		agentId: context.agentId,
		action
	});
	validateExplicitMessageAccountSelection({
		cfg,
		channel,
		accountId,
		plugin
	});
	if (!(plugin.actions?.describeMessageTool({
		cfg,
		accountId,
		agentId: context.agentId ?? void 0,
		sessionKey: context.sessionKey ?? void 0,
		sessionId: context.sessionId ?? void 0,
		requesterSenderId: context.requesterSenderId ?? void 0,
		senderIsOwner: context.senderIsOwner
	}))?.actions?.includes(action)) throw new Error(`Scheduled ${channel}:${action} is disabled for this account.`);
	return {
		...context,
		accountId,
		assertDirectAdapterHandoff: assertCurrent
	};
}
/** Retain an admitted writer's request guard through provider settlement. */
async function withMessageActionWriteAuthority(params) {
	const { context } = params;
	let open = true;
	const assertCurrent = () => {
		if (!open) throw new Error(`Scheduled ${context.channel}:${context.action} invocation is no longer active.`);
		context.assertDirectAdapterHandoff?.();
	};
	try {
		assertCurrent();
		return await params.run({
			...context,
			assertDirectAdapterHandoff: assertCurrent
		});
	} finally {
		open = false;
	}
}
//#endregion
//#region src/channels/plugins/message-action-current-conversation.ts
const HOST_TARGET_KIND_PREFIXES = [
	"user",
	"channel",
	"room",
	"chat",
	"group",
	"dm",
	"conversation"
];
function isHostConversationTargetKind(value) {
	return HOST_TARGET_KIND_PREFIXES.some((kind) => kind === value);
}
function stripHostProviderPrefix(params) {
	const prefixes = [params.channel, ...params.providerPrefixes ?? []].map((prefix) => prefix.trim().toLowerCase()).filter((prefix) => Boolean(prefix) && !isHostConversationTargetKind(prefix));
	const lowered = params.value.toLowerCase();
	const prefix = prefixes.find((candidate) => lowered.startsWith(`${candidate}:`));
	return prefix ? params.value.slice(prefix.length + 1).trim() : params.value;
}
function normalizeHostConversationTarget(params) {
	if (typeof params.value !== "string") return;
	const rawValue = params.value.trim();
	const value = params.normalizeTarget ? params.normalizeTarget(rawValue)?.trim() : rawValue;
	if (!value) return;
	const withoutProvider = stripHostProviderPrefix({
		value,
		channel: params.channel,
		providerPrefixes: params.providerPrefixes
	});
	if (!withoutProvider) return;
	const typedTarget = withoutProvider.match(/^(user|channel|room|chat|group|dm|conversation):(.*)$/i);
	if (typedTarget) {
		const id = typedTarget[2]?.trim();
		const kind = typedTarget[1]?.toLowerCase();
		if (!id || !kind || !isHostConversationTargetKind(kind)) return;
		return {
			id,
			kind
		};
	}
	return {
		id: withoutProvider,
		...params.impliedKind ? { kind: params.impliedKind } : {}
	};
}
function targetKey(target) {
	return `${target.kind ?? ""}\0${target.id}`;
}
function addHostConversationTarget(targets, target) {
	if (target) targets.set(targetKey(target), target);
}
function hasConflictingTargetKinds(targets) {
	const kindsById = /* @__PURE__ */ new Map();
	for (const target of targets) {
		if (!target.kind) continue;
		const kinds = kindsById.get(target.id) ?? /* @__PURE__ */ new Set();
		kinds.add(target.kind);
		kindsById.set(target.id, kinds);
	}
	return Array.from(kindsById.values()).some((kinds) => kinds.size > 1);
}
function currentTargetsMatchRequested(params) {
	const sameId = params.currentTargets.filter((currentTarget) => currentTarget.id === params.requestedTarget.id);
	if (sameId.length === 0 || !params.requestedTarget.kind) return sameId.length > 0;
	const typedCurrentTargets = sameId.filter((currentTarget) => currentTarget.kind);
	if (typedCurrentTargets.length === 0) {
		if (!params.requestedTargets.some((requestedTarget) => requestedTarget.id === params.requestedTarget.id && !requestedTarget.kind)) return false;
		if (params.currentChatType === "direct") return params.requestedTarget.kind === "user" || params.requestedTarget.kind === "dm";
		if (params.currentChatType === "group") return params.requestedTarget.kind === "group" || params.requestedTarget.kind === "room";
		if (params.currentChatType === "channel") return params.requestedTarget.kind === "channel";
		return false;
	}
	return typedCurrentTargets.some((currentTarget) => currentTarget.kind === params.requestedTarget.kind);
}
function hasMatchingCurrentAccountContext(ctx) {
	const rawAccountId = ctx.accountId?.trim() ?? "";
	const rawRequesterAccountId = ctx.requesterAccountId?.trim() ?? "";
	if (!rawRequesterAccountId) return false;
	if (rawAccountId && !normalizeOptionalAccountId(rawAccountId) || !normalizeOptionalAccountId(rawRequesterAccountId)) return false;
	return normalizeAccountId(rawAccountId) === normalizeAccountId(rawRequesterAccountId);
}
function hasMatchingCurrentProviderContext(ctx) {
	const currentProvider = ctx.toolContext?.currentChannelProvider?.trim().toLowerCase();
	return Boolean(currentProvider && currentProvider === ctx.channel.trim().toLowerCase());
}
function hasCurrentConversationTarget(ctx) {
	return [ctx.toolContext?.currentChannelId, ctx.toolContext?.currentMessagingTarget].some((value) => typeof value === "string" && Boolean(value.trim()));
}
function hasTargetInput(value) {
	if (typeof value === "string") return Boolean(value.trim());
	return typeof value === "number" && Number.isFinite(value);
}
function resolveExactCurrentConversationMatch(params) {
	if (!hasMatchingCurrentProviderContext(params.ctx) || !hasMatchingCurrentAccountContext(params.ctx)) return false;
	const normalizeTarget = params.pluginTrust === "bundled" ? params.plugin.messaging?.normalizeTarget : void 0;
	const providerPrefixes = params.plugin.messaging?.targetPrefixes;
	const aliasSpec = params.pluginTrust === "bundled" ? params.plugin.actions?.messageActionTargetAliases?.[params.ctx.action] : void 0;
	const deliveryTargetAliases = new Set(aliasSpec?.deliveryTargetAliases ?? []);
	const requestedTargets = /* @__PURE__ */ new Map();
	for (const [key, impliedKind] of [
		["target", void 0],
		["to", void 0],
		["channelId", "channel"],
		["roomId", "room"],
		["chatId", "chat"]
	]) {
		const rawTarget = params.ctx.params[key];
		if (deliveryTargetAliases.has(key)) continue;
		const normalizedTarget = normalizeHostConversationTarget({
			value: rawTarget,
			channel: params.ctx.channel,
			impliedKind,
			normalizeTarget,
			providerPrefixes
		});
		if (hasTargetInput(rawTarget) && !normalizedTarget) return false;
		addHostConversationTarget(requestedTargets, normalizedTarget);
	}
	let hasDeliveryAliasInput = false;
	let normalizedAliasTarget;
	if (params.pluginTrust === "bundled") {
		hasDeliveryAliasInput = (aliasSpec?.deliveryTargetAliases ?? []).some((alias) => hasTargetInput(params.ctx.params[alias]));
		const resolvedAliasTarget = aliasSpec?.resolveDeliveryTarget?.({ args: params.ctx.params });
		normalizedAliasTarget = normalizeHostConversationTarget({
			value: resolvedAliasTarget,
			channel: params.ctx.channel,
			normalizeTarget,
			providerPrefixes
		});
		if (hasDeliveryAliasInput && !resolvedAliasTarget || resolvedAliasTarget !== void 0 && !normalizedAliasTarget) return false;
		addHostConversationTarget(requestedTargets, normalizedAliasTarget);
	}
	const normalizedAliasTargetKey = normalizedAliasTarget ? targetKey(normalizedAliasTarget) : void 0;
	const nonAliasRequestedTargets = Array.from(requestedTargets.values()).filter((target) => targetKey(target) !== normalizedAliasTargetKey);
	const requestedTargetList = Array.from(requestedTargets.values());
	if (hasConflictingTargetKinds(requestedTargetList)) return false;
	const currentTargets = /* @__PURE__ */ new Map();
	for (const value of [params.ctx.toolContext?.currentChannelId, params.ctx.toolContext?.currentMessagingTarget]) addHostConversationTarget(currentTargets, normalizeHostConversationTarget({
		value,
		channel: params.ctx.channel,
		normalizeTarget,
		providerPrefixes
	}));
	const currentTargetList = Array.from(currentTargets.values());
	if (currentTargetList.length === 0 || hasConflictingTargetKinds(currentTargetList)) return false;
	if (requestedTargetList.length === 0) return false;
	const currentChatType = normalizeChatType(params.ctx.toolContext?.currentChatType);
	const matchesCurrentTarget = (requestedTarget) => currentTargetsMatchRequested({
		currentTargets: currentTargetList,
		requestedTargets: requestedTargetList,
		requestedTarget,
		currentChatType
	});
	if (requestedTargetList.every(matchesCurrentTarget)) return true;
	if (params.pluginTrust !== "bundled" || !hasDeliveryAliasInput || !params.ctx.toolContext || !aliasSpec?.matchesCurrentConversationAsync && !aliasSpec?.matchesCurrentConversation || !nonAliasRequestedTargets.every(matchesCurrentTarget)) return false;
	const matchParams = {
		args: params.ctx.params,
		accountId: normalizeAccountId(params.ctx.accountId),
		toolContext: params.ctx.toolContext
	};
	const matchAsync = aliasSpec.matchesCurrentConversationAsync;
	if (matchAsync) return () => matchAsync(matchParams);
	return aliasSpec.matchesCurrentConversation?.(matchParams) === true;
}
//#endregion
//#region src/channels/plugins/message-action-dispatch.ts
const NO_CONVERSATION_READ = { kind: "none" };
const CONVERSATION_READ = {
	kind: "conversation-read",
	targetlessCache: "deny"
};
const CHANNEL_MESSAGE_ACTION_READ_POLICIES = {
	send: NO_CONVERSATION_READ,
	broadcast: NO_CONVERSATION_READ,
	poll: NO_CONVERSATION_READ,
	"poll-vote": CONVERSATION_READ,
	react: CONVERSATION_READ,
	reactions: CONVERSATION_READ,
	read: CONVERSATION_READ,
	edit: CONVERSATION_READ,
	unsend: CONVERSATION_READ,
	reply: NO_CONVERSATION_READ,
	sendWithEffect: NO_CONVERSATION_READ,
	renameGroup: NO_CONVERSATION_READ,
	setGroupIcon: NO_CONVERSATION_READ,
	addParticipant: NO_CONVERSATION_READ,
	removeParticipant: NO_CONVERSATION_READ,
	leaveGroup: NO_CONVERSATION_READ,
	sendAttachment: NO_CONVERSATION_READ,
	delete: CONVERSATION_READ,
	pin: CONVERSATION_READ,
	unpin: CONVERSATION_READ,
	"list-pins": CONVERSATION_READ,
	permissions: CONVERSATION_READ,
	"thread-create": NO_CONVERSATION_READ,
	"thread-list": CONVERSATION_READ,
	"thread-reply": NO_CONVERSATION_READ,
	search: CONVERSATION_READ,
	sticker: NO_CONVERSATION_READ,
	"sticker-search": {
		kind: "conversation-read",
		targetlessCache: "bundled-current-context"
	},
	"member-info": CONVERSATION_READ,
	"role-info": CONVERSATION_READ,
	"emoji-list": CONVERSATION_READ,
	"emoji-upload": NO_CONVERSATION_READ,
	"sticker-upload": NO_CONVERSATION_READ,
	"role-add": NO_CONVERSATION_READ,
	"role-remove": NO_CONVERSATION_READ,
	"channel-info": CONVERSATION_READ,
	"channel-list": CONVERSATION_READ,
	"channel-create": NO_CONVERSATION_READ,
	"conversation-open": NO_CONVERSATION_READ,
	"channel-edit": NO_CONVERSATION_READ,
	"channel-delete": NO_CONVERSATION_READ,
	"channel-move": NO_CONVERSATION_READ,
	"category-create": NO_CONVERSATION_READ,
	"category-edit": NO_CONVERSATION_READ,
	"category-delete": NO_CONVERSATION_READ,
	"topic-create": NO_CONVERSATION_READ,
	"topic-edit": NO_CONVERSATION_READ,
	"voice-status": CONVERSATION_READ,
	"event-list": CONVERSATION_READ,
	"event-create": NO_CONVERSATION_READ,
	timeout: NO_CONVERSATION_READ,
	kick: NO_CONVERSATION_READ,
	ban: NO_CONVERSATION_READ,
	"set-profile": NO_CONVERSATION_READ,
	"set-presence": NO_CONVERSATION_READ,
	"download-file": CONVERSATION_READ,
	"upload-file": NO_CONVERSATION_READ
};
function resolveChannelMessageActionReadPolicy(action) {
	if (typeof action !== "string" || !Object.hasOwn(CHANNEL_MESSAGE_ACTION_READ_POLICIES, action)) return;
	return CHANNEL_MESSAGE_ACTION_READ_POLICIES[action];
}
const FENCED_PROVIDER_READ_ACTIONS = /* @__PURE__ */ new Set([
	"read",
	"search",
	"reactions",
	"list-pins",
	"thread-list",
	"channel-info",
	"permissions",
	"member-info",
	"role-info",
	"emoji-list",
	"channel-list",
	"voice-status",
	"event-list",
	"sticker-search",
	"download-file"
]);
function isFencedProviderReadAction(action) {
	return FENCED_PROVIDER_READ_ACTIONS.has(action);
}
const SCHEDULED_MESSAGE_WRITE_POLICIES = /* @__PURE__ */ new Map([
	["channel-edit", "operator"],
	["delete", "provider"],
	["edit", "provider"],
	["pin", "provider"],
	["unpin", "provider"]
]);
/** Host admission stays action-specific; a plugin declaration never adds actions. */
function isScheduledMessageWriteAction(action) {
	return SCHEDULED_MESSAGE_WRITE_POLICIES.has(action);
}
/** Validates a live scheduled grant's scope; each action consumer owns admission. */
function resolveScheduledMessageActionAccess(params) {
	const authority = params.authorization?.scheduled;
	if (!authority) return;
	const assertCurrent = authority.assertSourceCurrent ?? authority.assertCurrent;
	assertCurrent();
	const policy = authority.policy;
	if (policy.mode === "trusted") return {
		kind: "trusted-operator",
		assertCurrent
	};
	if (!params.accountId || normalizeAccountId(params.accountId) !== policy.ownerAccountId) throw new Error(`Scheduled ${params.channel}:${params.action} cannot use another creator account.`);
	if (params.action === "channel-edit" && normalizeMessageChannel(params.channel) === "discord") {
		const requester = authority.channelRequester;
		if (!requester) throw new Error("This account-bound automation needs fresh Discord requester authorization for channel-edit. From its original Discord conversation and account, edit it with an explicit toolsAllow cap including message, or recreate it there.");
		if (requester.channel !== "discord" || requester.accountId !== policy.ownerAccountId) throw new Error("Scheduled Discord channel-edit requires its authenticated requester account and channel.");
		return {
			kind: "account",
			channelRequester: requester,
			assertCurrent
		};
	}
	const origin = policy.ownerOrigin;
	if (!origin || origin.kind === "unknown" || origin.kind === "external" && normalizeMessageChannel(params.channel) !== origin.channel) throw new Error(`Scheduled ${params.channel}:${params.action} requires matching recorded creator origin.`);
	return {
		kind: "account",
		assertCurrent
	};
}
function resolveMessageActionReadEnforcement(params) {
	const providerOwnedReadGates = params.actions?.providerOwnedReadGates;
	if (providerOwnedReadGates === true || providerOwnedReadGates?.includes(params.action) === true) {
		const fencedReadAction = params.actions?.readAuthorityActions?.includes(params.action) === true && isFencedProviderReadAction(params.action);
		if (params.pluginOrigin === "bundled") return {
			kind: "provider-owned",
			pluginTrust: "bundled",
			fenced: fencedReadAction
		};
		if (params.hasReadAuthority && fencedReadAction) return {
			kind: "provider-owned",
			pluginTrust: "external",
			fenced: true
		};
	}
	return {
		kind: "host-exact-current",
		pluginTrust: params.pluginOrigin === "bundled" ? "bundled" : "external"
	};
}
function attachExternalCurrentTargetSibling(params) {
	if (params.origin === "direct-operator" || params.actionPolicy.kind !== "conversation-read" || params.enforcement.kind !== "host-exact-current" || params.enforcement.pluginTrust !== "external") return params.ctx;
	const target = typeof params.ctx.params.target === "string" ? params.ctx.params.target.trim() : "";
	if (!target) return params.ctx;
	const mirroredTo = params.ctx.params.to;
	if (typeof mirroredTo !== "string" || mirroredTo.trim() !== target) return params.ctx;
	const providerPrefixes = params.plugin.messaging?.targetPrefixes;
	const requestedTarget = normalizeHostConversationTarget({
		value: target,
		channel: params.ctx.channel,
		providerPrefixes
	});
	if (!requestedTarget) return params.ctx;
	const trustedCurrentTarget = [params.ctx.toolContext?.currentMessagingTarget, params.ctx.toolContext?.currentChannelId].find((value) => {
		const normalized = normalizeHostConversationTarget({
			value,
			channel: params.ctx.channel,
			providerPrefixes
		});
		return normalized?.id === requestedTarget.id && (!requestedTarget.kind || !normalized.kind || normalized.kind === requestedTarget.kind);
	});
	if (typeof trustedCurrentTarget !== "string" || !trustedCurrentTarget.trim()) return params.ctx;
	return {
		...params.ctx,
		params: {
			...params.ctx.params,
			to: trustedCurrentTarget.trim()
		}
	};
}
function canonicalizeExternalExactCurrentTarget(ctx) {
	const target = ctx.params.target;
	const resolvedTarget = [ctx.params.to, ctx.params.channelId].find((value) => typeof value === "string" && Boolean(value.trim()));
	if (typeof target === "string" && target.trim() && resolvedTarget) ctx.params.target = resolvedTarget;
}
function prepareMessageActionReadContext(ctx) {
	const actionPolicy = resolveChannelMessageActionReadPolicy(ctx.action);
	if (!actionPolicy) return;
	const registration = resolveChannelPluginRegistration(ctx.channel);
	if (!registration) return;
	const action = ctx.action;
	const authority = registration.captureReadAuthority?.();
	const hasRegistrationAuthority = authority?.() === true;
	const enforcement = resolveMessageActionReadEnforcement({
		action,
		actions: registration.plugin.actions,
		pluginOrigin: registration.origin,
		hasReadAuthority: hasRegistrationAuthority
	});
	const scheduledAccess = isFencedProviderReadAction(action) && enforcement.kind === "provider-owned" && enforcement.fenced ? resolveScheduledMessageActionAccess({
		authorization: ctx.messageActionAuthorization,
		action,
		channel: ctx.channel,
		accountId: ctx.accountId
	}) : void 0;
	const origin = scheduledAccess ? scheduledAccess.kind === "trusted-operator" ? "direct-operator" : "delegated" : normalizeConversationReadInvocationOrigin(ctx.conversationReadOrigin);
	const { messageActionAuthorization: _authorization, ...pluginContext } = ctx;
	const actionContext = {
		...pluginContext,
		action,
		conversationReadOrigin: origin
	};
	const assertCallerCurrent = ctx.assertDirectAdapterHandoff;
	const assertDashboardReadCurrent = enforcement.kind === "provider-owned" && enforcement.fenced && !ctx.messageActionAuthorization?.scheduled && ctx.toolContext === void 0 && ctx.requesterAccountId === void 0 ? ctx.messageActionAuthorization?.assertDashboardReadCurrent : void 0;
	const assertReadAuthorityCurrent = (origin !== "direct-operator" || scheduledAccess) && enforcement.kind === "provider-owned" && enforcement.fenced ? () => {
		assertCallerCurrent?.();
		assertDashboardReadCurrent?.();
		scheduledAccess?.assertCurrent();
		if (!authority?.()) throw new Error(`Plugin ${ctx.channel} read authority is no longer active.`);
	} : void 0;
	return {
		actionContext,
		plugin: registration.plugin,
		origin,
		actionPolicy,
		enforcement,
		scheduledAccess,
		assertDashboardReadCurrent,
		hasRegistrationAuthority,
		assertReadAuthorityCurrent,
		assertAliasAuthorityCurrent: () => {
			assertCallerCurrent?.();
			assertDashboardReadCurrent?.();
			scheduledAccess?.assertCurrent();
			const current = registration.captureReadAuthority && !authority?.() ? void 0 : resolveChannelPluginRegistration(ctx.channel, { loadedOnly: true });
			if (current?.plugin !== registration.plugin || current.origin !== registration.origin) throw new Error(`Plugin ${ctx.channel} alias authority is no longer active.`);
		}
	};
}
function isExternalDelegatedMessageActionRead(prepared) {
	return Boolean(prepared && prepared.origin !== "direct-operator" && prepared.actionPolicy.kind === "conversation-read" && prepared.enforcement.kind === "host-exact-current" && prepared.enforcement.pluginTrust === "external");
}
/** The shared host decision before any read-capable plugin callback runs. */
function resolveMessageActionConversationReadGate(params) {
	if (params.actionPolicy.kind === "none" || params.origin === "direct-operator") return true;
	if (params.enforcement.kind === "provider-owned") {
		if (params.enforcement.fenced && params.enforcement.pluginTrust === "external" && !params.scheduledAccess && !params.assertDashboardReadCurrent && (!hasMatchingCurrentProviderContext(params.ctx) || !hasMatchingCurrentAccountContext(params.ctx) || !hasCurrentConversationTarget(params.ctx))) throw new Error(`Delegated ${params.ctx.channel}:${params.ctx.action} requires current provider and account context.`);
		return true;
	}
	return params.enforcement.pluginTrust === "bundled" && params.actionPolicy.targetlessCache === "bundled-current-context" && hasMatchingCurrentProviderContext(params.ctx) && hasMatchingCurrentAccountContext(params.ctx) && hasCurrentConversationTarget(params.ctx) || resolveExactCurrentConversationMatch({
		ctx: params.ctx,
		plugin: params.plugin,
		pluginTrust: params.enforcement.pluginTrust
	});
}
function enforceMessageActionConversationReadMatch(params, matches) {
	if (!matches) throw new Error(`Delegated ${params.ctx.channel}:${params.ctx.action} requires the exact current conversation and account for this plugin.`);
	if (params.actionPolicy.kind === "conversation-read" && params.origin !== "direct-operator" && params.enforcement.kind === "host-exact-current" && params.enforcement.pluginTrust === "external") canonicalizeExternalExactCurrentTarget(params.ctx);
}
function enforceMessageActionConversationReadGate(params) {
	enforceMessageActionConversationReadMatch(params, resolveMessageActionConversationReadGate(params) === true);
}
function prepareScheduledMessageWriteContext(ctx, prepared) {
	const action = prepared.actionContext.action;
	const policy = SCHEDULED_MESSAGE_WRITE_POLICIES.get(action);
	if (!policy || !ctx.messageActionAuthorization?.scheduled) return;
	const accountId = ctx.accountId ?? resolveChannelDefaultAccountId({
		plugin: prepared.plugin,
		cfg: ctx.cfg
	});
	const access = resolveScheduledMessageActionAccess({
		authorization: ctx.messageActionAuthorization,
		action,
		channel: ctx.channel,
		accountId
	});
	if (!access) return;
	const channelRequester = access.kind === "account" ? access.channelRequester : void 0;
	if (policy === "operator" && access.kind !== "trusted-operator" && !channelRequester) throw new Error(`Scheduled ${ctx.channel}:${action} requires a job authorized by an operator. Account jobs cannot inherit operator administration.`);
	if (policy === "provider") {
		const providerGates = prepared.plugin.actions?.providerOwnedReadGates;
		if (providerGates !== true && !providerGates?.includes(action)) throw new Error(`Scheduled ${ctx.channel}:${action} requires provider-owned target authorization.`);
	}
	return prepareMessageActionWriteAuthority({
		context: {
			...prepared.actionContext,
			accountId,
			...channelRequester ? {
				requesterAccountId: channelRequester.accountId,
				requesterSenderId: channelRequester.senderId,
				senderIsOwner: false,
				toolContext: void 0
			} : { senderIsOwner: policy === "operator" ? true : prepared.actionContext.senderIsOwner },
			conversationReadOrigin: policy === "operator" ? prepared.actionContext.conversationReadOrigin : access.kind === "trusted-operator" ? "direct-operator" : "delegated",
			assertDirectAdapterHandoff: prepared.assertAliasAuthorityCurrent
		},
		plugin: prepared.plugin,
		hasRegistrationAuthority: prepared.hasRegistrationAuthority,
		assertCurrent: access.assertCurrent
	});
}
/** Admit provider preparation before resolving an external target. */
function prepareExternalMessageActionTargetForResolution(ctx) {
	const prepared = prepareMessageActionReadContext(ctx);
	const scheduledWrite = prepared && prepareScheduledMessageWriteContext(ctx, prepared);
	if (scheduledWrite) return {
		params: ctx.params,
		accountId: scheduledWrite.accountId,
		assertTargetAuthorityCurrent: scheduledWrite.assertDirectAdapterHandoff
	};
	if (prepared?.assertReadAuthorityCurrent) {
		prepared.assertReadAuthorityCurrent();
		enforceMessageActionConversationReadGate({
			ctx: prepared.actionContext,
			...prepared
		});
		return {
			params: ctx.params,
			assertReadAuthorityCurrent: prepared.assertReadAuthorityCurrent
		};
	}
	if (!isExternalDelegatedMessageActionRead(prepared)) return { params: ctx.params };
	const authorizedActionContext = attachExternalCurrentTargetSibling({
		ctx: prepared.actionContext,
		...prepared
	});
	enforceMessageActionConversationReadGate({
		ctx: authorizedActionContext,
		...prepared
	});
	return { params: authorizedActionContext.params };
}
/** Defers delegated external target interpretation to the attested Gateway boundary. */
function shouldDeferExternalMessageActionTargetResolution(ctx) {
	const prepared = prepareMessageActionReadContext(ctx);
	return isExternalDelegatedMessageActionRead(prepared) || Boolean(prepared?.assertReadAuthorityCurrent) || Boolean(prepared && ctx.messageActionAuthorization?.scheduled && isScheduledMessageWriteAction(prepared.actionContext.action));
}
function requiresTrustedRequesterSender(ctx, plugin) {
	return Boolean(plugin?.actions?.requiresTrustedRequesterSender?.({
		action: ctx.action,
		toolContext: ctx.toolContext
	}));
}
/**
* Runs a channel message action if the target plugin supports it.
*/
async function dispatchChannelMessageAction(ctx) {
	const prepared = prepareMessageActionReadContext(ctx);
	if (!prepared) return null;
	const scheduledWrite = prepareScheduledMessageWriteContext(ctx, prepared);
	const run = (actionContext) => withChannelReadAuthority(prepared.assertReadAuthorityCurrent, async () => {
		const { plugin } = prepared;
		const actions = plugin.actions;
		if (!actions?.handleAction) return null;
		const authorizedActionContext = attachExternalCurrentTargetSibling({
			ctx: actionContext,
			...prepared
		});
		const gateParams = {
			ctx: authorizedActionContext,
			...prepared
		};
		const match = scheduledWrite && SCHEDULED_MESSAGE_WRITE_POLICIES.get(actionContext.action) === "provider" ? true : resolveMessageActionConversationReadGate(gateParams);
		let matches;
		if (typeof match === "function") {
			prepared.assertAliasAuthorityCurrent();
			matches = await match();
			prepared.assertAliasAuthorityCurrent();
		} else matches = match;
		enforceMessageActionConversationReadMatch(gateParams, matches);
		if (requiresTrustedRequesterSender(authorizedActionContext, plugin) && !authorizedActionContext.requesterSenderId?.trim()) throw new Error(`Trusted sender identity is required for ${authorizedActionContext.channel}:${authorizedActionContext.action} in tool-driven contexts.`);
		if (actions.supportsAction && !actions.supportsAction({ action: authorizedActionContext.action })) return null;
		assertOutboundHandoffCurrent(authorizedActionContext.assertDirectAdapterHandoff);
		prepared.assertReadAuthorityCurrent?.();
		if (typeof match === "function") prepared.assertAliasAuthorityCurrent();
		return await actions.handleAction(authorizedActionContext);
	});
	if (!scheduledWrite) return await run(prepared.actionContext);
	return await withMessageActionWriteAuthority({
		context: scheduledWrite,
		run
	});
}
//#endregion
//#region src/infra/outbound/message-action-spec.ts
/**
* Target-parameter policy for each supported channel message action.
*/
const MESSAGE_ACTION_TARGET_MODE = {
	send: "to",
	broadcast: "none",
	poll: "to",
	"poll-vote": "to",
	react: "to",
	reactions: "to",
	read: "to",
	edit: "to",
	unsend: "to",
	reply: "to",
	sendWithEffect: "to",
	renameGroup: "to",
	setGroupIcon: "to",
	addParticipant: "to",
	removeParticipant: "to",
	leaveGroup: "to",
	sendAttachment: "to",
	delete: "to",
	pin: "to",
	unpin: "to",
	"list-pins": "to",
	permissions: "to",
	"thread-create": "to",
	"thread-list": "none",
	"thread-reply": "to",
	search: "none",
	sticker: "to",
	"sticker-search": "none",
	"member-info": "none",
	"role-info": "none",
	"emoji-list": "none",
	"emoji-upload": "none",
	"sticker-upload": "none",
	"role-add": "none",
	"role-remove": "none",
	"channel-info": "channelId",
	"channel-list": "none",
	"channel-create": "none",
	"conversation-open": "none",
	"channel-edit": "channelId",
	"channel-delete": "channelId",
	"channel-move": "channelId",
	"category-create": "none",
	"category-edit": "none",
	"category-delete": "none",
	"topic-create": "to",
	"topic-edit": "to",
	"voice-status": "none",
	"event-list": "none",
	"event-create": "none",
	timeout: "none",
	kick: "none",
	ban: "none",
	"set-profile": "none",
	"set-presence": "none",
	"download-file": "none",
	"upload-file": "to"
};
/** Maps canonical `target` into the legacy field required by the action implementation. */
function applyTargetToParams(params) {
	const target = normalizeOptionalString(params.args.target) ?? "";
	const hasLegacyTo = hasNonEmptyString(params.args.to);
	const hasLegacyChannelId = hasNonEmptyString(params.args.channelId);
	const mode = MESSAGE_ACTION_TARGET_MODE[params.action] ?? "none";
	if (mode !== "none") {
		if (hasLegacyTo || hasLegacyChannelId) throw new Error("Use `target` instead of `to`/`channelId`.");
	} else if (hasLegacyTo) throw new Error("Use `target` for actions that accept a destination.");
	if (!target) return;
	if (mode === "channelId") {
		params.args.channelId = target;
		return;
	}
	if (mode === "to") {
		params.args.to = target;
		return;
	}
	throw new Error(`Action ${params.action} does not accept a target.`);
}
function resolvePluginActionTargetAliasSpec(action, channel, selected) {
	return selected !== void 0 ? selected : getBootstrapChannelPlugin(channel)?.actions?.messageActionTargetAliases?.[action];
}
const ACTION_TARGET_ALIASES = {
	unsend: { aliases: ["messageId"] },
	edit: { aliases: ["messageId"] },
	react: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	renameGroup: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	setGroupIcon: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	addParticipant: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	removeParticipant: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	leaveGroup: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] }
};
function listActionTargetAliasSpecs(action, params, options) {
	const specs = [];
	const coreSpec = ACTION_TARGET_ALIASES[action];
	if (coreSpec) specs.push(coreSpec);
	const normalizedChannel = normalizeOptionalLowercaseString(options?.channel);
	if (!normalizedChannel || !hasPotentialPluginActionParam(params)) return specs;
	const channelSpec = resolvePluginActionTargetAliasSpec(action, normalizedChannel, options?.aliasSpec);
	if (channelSpec) specs.push(channelSpec);
	return specs;
}
/** Resolves a plugin-declared delivery alias into the shared target contract. */
function resolveActionDeliveryTargetAlias(action, params, options) {
	const channel = normalizeOptionalLowercaseString(options?.channel);
	if (!channel || !hasPotentialPluginActionParam(params)) return;
	const aliases = resolvePluginActionTargetAliasSpec(action, channel, options?.aliasSpec);
	const resolved = aliases?.resolveDeliveryTarget?.({ args: params });
	if (resolved !== void 0) return normalizeOptionalString(resolved);
	const targets = (aliases?.deliveryTargetAliases ?? []).map((alias) => normalizeOptionalStringifiedId(params[alias])).filter((value) => Boolean(value));
	if (new Set(targets).size > 1) throw new Error(`Action ${action} received conflicting delivery target aliases.`);
	return targets[0];
}
/** Reports whether a plugin alias identifies an existing resource rather than a conversation. */
function actionHasResourceReference(action, params, options) {
	const channel = normalizeOptionalLowercaseString(options?.channel);
	if (!channel || !hasPotentialPluginActionParam(params)) return false;
	const aliases = resolvePluginActionTargetAliasSpec(action, channel, options?.aliasSpec);
	if (!aliases?.deliveryTargetAliases) return false;
	const deliveryAliases = new Set(aliases.deliveryTargetAliases);
	return aliases.aliases.some((alias) => {
		if (deliveryAliases.has(alias)) return false;
		const value = params[alias];
		if (typeof value === "string") return Boolean(normalizeOptionalString(value));
		return typeof value === "number" && Number.isFinite(value);
	});
}
/**
* Reports whether an action normally needs a destination target.
*/
function actionRequiresTarget(action) {
	return MESSAGE_ACTION_TARGET_MODE[action] !== "none";
}
/**
* Detects whether an action invocation already carries a usable target.
*/
function actionHasTarget(action, params, options) {
	if (normalizeOptionalString(params.to) ?? "") return true;
	if (normalizeOptionalString(params.channelId) ?? "") return true;
	const specs = listActionTargetAliasSpecs(action, params, options);
	if (specs.length === 0) return false;
	return specs.some((spec) => spec.aliases.some((alias) => {
		const value = params[alias];
		if (typeof value === "string") return Boolean(normalizeOptionalString(value));
		if (typeof value === "number") return Number.isFinite(value);
		return false;
	}));
}
//#endregion
//#region src/infra/outbound/message-action-normalization.ts
function resolveImplicitMessageActionTarget(toolContext) {
	for (const value of [toolContext?.currentChannelId, toolContext?.currentMessagingTarget]) {
		const target = normalizeOptionalString(value);
		if (!target) continue;
		if (isInternalNonDeliveryChannel(target)) continue;
		if (parseAgentSessionKey(target.replace(/^channel:/i, ""))) continue;
		return target;
	}
}
/** Normalizes message-action args before target validation and dispatch. */
function normalizeMessageActionInput(params) {
	const normalizedArgs = { ...params.args };
	const { action, toolContext } = params;
	const explicitChannel = normalizeOptionalString(normalizedArgs.channel) ?? "";
	const inferredChannel = explicitChannel || normalizeMessageChannel(toolContext?.currentChannelProvider) || "";
	const explicitTarget = normalizeOptionalString(normalizedArgs.target) ?? "";
	const hasExplicitTargets = Object.hasOwn(normalizedArgs, "targets");
	const hasLegacyTargetFields = typeof normalizedArgs.to === "string" || typeof normalizedArgs.channelId === "string";
	const hasLegacyTarget = (normalizeOptionalString(normalizedArgs.to) ?? "").length > 0 || (normalizeOptionalString(normalizedArgs.channelId) ?? "").length > 0;
	const legacyTarget = normalizeOptionalString(normalizedArgs.to) ?? normalizeOptionalString(normalizedArgs.channelId) ?? "";
	const targetAliasOptions = {
		channel: inferredChannel,
		aliasSpec: params.targetAliasSpec
	};
	const deliveryAliasTarget = resolveActionDeliveryTargetAlias(action, normalizedArgs, targetAliasOptions);
	const hasResourceReference = actionHasResourceReference(action, normalizedArgs, targetAliasOptions);
	if (deliveryAliasTarget && explicitTarget && deliveryAliasTarget !== explicitTarget) throw new Error(`Action ${action} received conflicting target and delivery alias values.`);
	if (deliveryAliasTarget && legacyTarget && deliveryAliasTarget !== legacyTarget) throw new Error(`Action ${action} received conflicting target and delivery alias values.`);
	if (explicitTarget && hasLegacyTargetFields) {
		delete normalizedArgs.to;
		delete normalizedArgs.channelId;
	}
	if (!explicitTarget && !hasLegacyTarget && deliveryAliasTarget) normalizedArgs.target = deliveryAliasTarget;
	if (!explicitTarget && !hasExplicitTargets && !hasLegacyTarget && !deliveryAliasTarget && actionRequiresTarget(action) && (hasResourceReference || !actionHasTarget(action, normalizedArgs, targetAliasOptions))) {
		const inferredTarget = resolveImplicitMessageActionTarget(toolContext);
		if (inferredTarget) normalizedArgs.target = inferredTarget;
	}
	if (!explicitTarget && actionRequiresTarget(action) && hasLegacyTarget) {
		if (legacyTarget) {
			normalizedArgs.target = legacyTarget;
			delete normalizedArgs.to;
			delete normalizedArgs.channelId;
		}
	}
	if (!explicitChannel) {
		if (inferredChannel && isDeliverableMessageChannel(inferredChannel)) normalizedArgs.channel = inferredChannel;
	}
	applyTargetToParams({
		action,
		args: normalizedArgs
	});
	const hasCanonicalTarget = [
		normalizedArgs.target,
		normalizedArgs.to,
		normalizedArgs.channelId
	].some((value) => Boolean(normalizeOptionalString(value)));
	if (actionRequiresTarget(action) && (!actionHasTarget(action, normalizedArgs, targetAliasOptions) || hasResourceReference && !hasCanonicalTarget && !params.allowResourceOnly)) throw missingMessageActionTargetError(action);
	return normalizedArgs;
}
//#endregion
export { parseJsonMessageParam as _, resolveActionDeliveryTargetAlias as a, hasPotentialPluginActionParam as b, isScheduledMessageWriteAction as c, collectActionMediaSourceHints as d, collectAttachmentSources as f, parseInteractiveParam as g, normalizeSandboxMediaSource as h, actionRequiresTarget as i, prepareExternalMessageActionTargetForResolution as l, normalizeSandboxMediaParams as m, resolveImplicitMessageActionTarget as n, dispatchChannelMessageAction as o, hydrateAttachmentParamsForAction as p, actionHasTarget as r, isFencedProviderReadAction as s, normalizeMessageActionInput as t, shouldDeferExternalMessageActionTargetResolution as u, resolveAttachmentMediaPolicy as v, resolveExtraActionMediaSourceParamKeys as y };
