import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as writeExternalFileWithinRoot } from "./fs-safe-RNq3oO57.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { r as getChildLogger } from "./logger-DPps3u8A.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { r as withTempWorkspace } from "./private-temp-workspace-BrSGWjaU.js";
import { r as extensionForMime } from "./mime-BaK8UYea.js";
import { t as redactIdentifier } from "./redact-identifier-CRU-WC7p.js";
import { E as MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS, w as runFfmpeg } from "./media-services-n09-22kU.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { i as sanitizeAssistantVisibleTextWithProfile, n as sanitizeAssistantVisibleText, u as stripToolCallXmlTags } from "./assistant-visible-text-oprKkPEf.js";
import { n as loadWebMedia } from "./web-media-CJF7B-0e.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import "./logging-core-w7LEX8Sa.js";
import "./media-runtime-DIRKCpVy.js";
import "./temp-path-bur_3WeJ.js";
import { t as sanitizeForPlainText } from "./sanitize-text-D2brBHVs.js";
import "./runtime-env-Ds0QYZS5.js";
import "./security-runtime-B2x5tet5.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import { t as convertMarkdownTables } from "./tables-Dsnw_rPw.js";
import "./core-BsEPrOqQ.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-BTfQ1TTG.js";
import { t as resolveApprovalApprovers } from "./approval-approvers-Rslf6S0G.js";
import { t as createResolvedApproverActionAuthAdapter } from "./approval-auth-helpers-Xdjt6p1L.js";
import { c as createApprovalReactionTargetStore, d as listApprovalReactionBindings, m as resolveApprovalReactionTarget } from "./approval-reaction-runtime-Dimop4P0.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-DqLEI0ep.js";
import "./channel-outbound-BopAOIGF.js";
import "./web-media-Ck9m7h3N.js";
import "./media-mime-CMow-3uR.js";
import "./cli-runtime-DJOXyIoh.js";
import "./markdown-table-runtime-BGOZnmrt.js";
import { r as resolveDefaultWhatsAppAccountId } from "./account-ids-BxNCpOFt.js";
import { a as resolveWhatsAppAccount, s as resolveWhatsAppMediaMaxBytes } from "./accounts-CTXNcJZ8.js";
import { c as normalizeWhatsAppTarget, n as isWhatsAppNewsletterJid } from "./normalize-target-CBY3N6Mg.js";
import "./normalize-CcFHT6pX.js";
import { t as getOptionalWhatsAppRuntime } from "./runtime-BRPL03_u.js";
import { t as getRegisteredWhatsAppConnectionController } from "./connection-controller-registry-TSX_udJp.js";
import { t as formatError } from "./session-errors-BAj9D2La.js";
import { r as isWhatsAppSocketOperationTimeoutError } from "./socket-timing-nmoE1btQ.js";
import { i as markdownToWhatsApp, s as toWhatsappJid } from "./targets-runtime-C-jSLN54.js";
import "./text-runtime-CEV-_K9a.js";
import path from "node:path";
//#region extensions/whatsapp/src/approval-auth.ts
function normalizeWhatsAppApproverId(value) {
	const normalized = normalizeWhatsAppTarget(String(value));
	if (!normalized || normalized.endsWith("@g.us")) return;
	return normalized;
}
function normalizeWhatsAppApproverEntry(value) {
	return String(value).trim() === "*" ? "*" : normalizeWhatsAppApproverId(value);
}
function getWhatsAppApprovalApprovers(params) {
	return resolveApprovalApprovers({
		allowFrom: resolveWhatsAppAccount({
			cfg: params.cfg,
			accountId: params.accountId
		}).allowFrom,
		normalizeApprover: normalizeWhatsAppApproverEntry
	});
}
const whatsappResolvedApproverAuth = createResolvedApproverActionAuthAdapter({
	channelLabel: "WhatsApp",
	resolveApprovers: ({ cfg, accountId }) => getWhatsAppApprovalApprovers({
		cfg,
		accountId
	}),
	normalizeSenderId: (value) => normalizeWhatsAppApproverId(value)
});
const whatsappApprovalAuth = { authorizeActorAction({ cfg, accountId, senderId, approvalKind }) {
	if (getWhatsAppApprovalApprovers({
		cfg,
		accountId
	}).includes("*")) return { authorized: true };
	return whatsappResolvedApproverAuth.authorizeActorAction({
		cfg,
		accountId,
		senderId,
		action: "approve",
		approvalKind
	});
} };
//#endregion
//#region extensions/whatsapp/src/approval-reactions.ts
const PERSISTENT_NAMESPACE = "whatsapp.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 1440 * 60 * 1e3;
const resolverRuntimeLoader = createLazyRuntimeModule(() => import("./approval-resolver-svTUk95d.js"));
const whatsappApprovalReactionTargets = createApprovalReactionTargetStore({
	namespace: PERSISTENT_NAMESPACE,
	maxEntries: PERSISTENT_MAX_ENTRIES,
	defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
	openStore: (storeParams) => getOptionalWhatsAppRuntime()?.state.openKeyedStore(storeParams),
	logPersistentError: reportPersistentApprovalReactionError,
	readPersistedTarget
});
const loadApprovalResolver = resolverRuntimeLoader;
function buildReactionTargetKey(params) {
	const accountId = params.accountId.trim();
	const remoteJid = params.remoteJid.trim();
	const messageId = params.messageId.trim();
	if (!accountId || !remoteJid || !messageId) return null;
	return `${accountId}:${remoteJid}:${messageId}`;
}
function addCandidateRemoteJid(target, value) {
	const remoteJid = value?.trim();
	if (remoteJid && !target.includes(remoteJid)) target.push(remoteJid);
}
function reportPersistentApprovalReactionError(error) {
	try {
		getOptionalWhatsAppRuntime()?.logging.getChildLogger({
			plugin: "whatsapp",
			feature: "approval-reaction-state"
		}).warn("WhatsApp persistent approval reaction state failed", { error: String(error) });
	} catch {}
}
function readPersistedTarget(target) {
	const value = target;
	if (!value || typeof value.approvalId !== "string" || !Array.isArray(value.allowedDecisions)) return null;
	return {
		approvalId: value.approvalId,
		...value.approvalKind === "exec" || value.approvalKind === "plugin" ? { approvalKind: value.approvalKind } : {},
		allowedDecisions: value.allowedDecisions
	};
}
function listWhatsAppApprovalReactionBindings(allowedDecisions) {
	return listApprovalReactionBindings({ allowedDecisions });
}
function normalizeApprovalDecision(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "always") return "allow-always";
	if (normalized === "allow-once" || normalized === "allow-always" || normalized === "deny") return normalized;
	return null;
}
const APPROVAL_ID_LINE_RE = /^\s*ID:\s*([A-Za-z0-9][A-Za-z0-9._:-]*)\s*$/i;
const APPROVE_COMMAND_LINE_RE = /\/approve(?:@[^\s]+)?\s+([A-Za-z0-9][A-Za-z0-9._:-]*)\s+(.+)$/i;
function extractWhatsAppApprovalPromptBinding(text) {
	const lines = text.split(/\r?\n/);
	const idHeaderMatch = lines.map((line) => line.match(APPROVAL_ID_LINE_RE)).find((match) => Boolean(match));
	if (!idHeaderMatch) return null;
	const approvalId = idHeaderMatch[1];
	const allowedDecisions = [];
	for (const line of lines) {
		const match = line.match(APPROVE_COMMAND_LINE_RE);
		if (!match || match[1] !== approvalId) continue;
		for (const decisionText of match[2].split(/[\s|,]+/)) {
			const decision = normalizeApprovalDecision(decisionText);
			if (decision && !allowedDecisions.includes(decision)) allowedDecisions.push(decision);
		}
	}
	return allowedDecisions.length > 0 ? {
		approvalId,
		allowedDecisions
	} : null;
}
function registerWhatsAppApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params);
	const approvalId = params.approvalId.trim();
	const allowedDecisions = listWhatsAppApprovalReactionBindings(params.allowedDecisions).map((binding) => binding.decision);
	if (!key || !approvalId || allowedDecisions.length === 0) return null;
	const target = {
		approvalId,
		approvalKind: approvalId.startsWith("plugin:") ? "plugin" : "exec",
		allowedDecisions
	};
	whatsappApprovalReactionTargets.register(key, target, { ttlMs: params.ttlMs });
	return target;
}
function registerWhatsAppApprovalReactionTargetForOutboundMessage(params) {
	const binding = extractWhatsAppApprovalPromptBinding(params.text);
	if (!binding) return false;
	return Boolean(registerWhatsAppApprovalReactionTarget({
		accountId: params.accountId,
		remoteJid: params.remoteJid,
		messageId: params.messageId,
		approvalId: binding.approvalId,
		allowedDecisions: binding.allowedDecisions,
		ttlMs: params.ttlMs
	}));
}
function unregisterWhatsAppApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params);
	if (!key) return;
	whatsappApprovalReactionTargets.delete(key);
}
function resolveTarget(params) {
	const resolved = resolveApprovalReactionTarget({
		target: params.target,
		reactionKey: params.reactionKey
	});
	return resolved ? {
		approvalId: resolved.approvalId,
		decision: resolved.decision
	} : null;
}
async function resolveWhatsAppApprovalReactionTargetWithPersistence(params) {
	const key = buildReactionTargetKey(params);
	if (!key) return null;
	return resolveTarget({
		target: await whatsappApprovalReactionTargets.lookup(key),
		reactionKey: params.reactionKey
	});
}
async function resolveWhatsAppApprovalReactionTargetFromCandidates(params) {
	const candidateRemoteJids = [];
	for (const observedRemoteJid of params.observedRemoteJids) {
		addCandidateRemoteJid(candidateRemoteJids, observedRemoteJid);
		try {
			for (const candidate of await params.resolveReactionTargetJids?.(observedRemoteJid) ?? []) addCandidateRemoteJid(candidateRemoteJids, candidate);
		} catch (error) {
			params.logVerboseMessage?.(`whatsapp: approval reaction target JID mapping failed for ${observedRemoteJid}: ${String(error)}`);
		}
	}
	for (const remoteJid of candidateRemoteJids) {
		const target = await resolveWhatsAppApprovalReactionTargetWithPersistence({
			accountId: params.accountId,
			remoteJid,
			messageId: params.messageId,
			reactionKey: params.reactionKey
		});
		if (target) return {
			...target,
			remoteJid
		};
	}
	return null;
}
function readWhatsAppApprovalReactionEvent(params) {
	const msg = params.msg;
	const reaction = msg.message?.reactionMessage;
	const reactionKey = reaction?.text?.trim() ?? "";
	const messageId = reaction?.key?.id?.trim() ?? "";
	const remoteJids = [];
	addCandidateRemoteJid(remoteJids, reaction?.key?.remoteJid);
	addCandidateRemoteJid(remoteJids, msg.key?.remoteJid);
	const actorJid = msg.key?.participant?.trim() || (msg.key?.fromMe ? params.selfLid?.trim() ?? params.selfJid?.trim() ?? "" : msg.key?.remoteJid?.trim() ?? "");
	if (!reactionKey || !messageId || remoteJids.length === 0 || !actorJid) return null;
	return {
		remoteJids,
		messageId,
		actorJid,
		reactionKey
	};
}
async function maybeResolveWhatsAppApprovalReaction(params) {
	const event = readWhatsAppApprovalReactionEvent({
		msg: params.msg,
		selfJid: params.selfJid,
		selfLid: params.selfLid
	});
	if (!event) return false;
	const target = await resolveWhatsAppApprovalReactionTargetFromCandidates({
		accountId: params.accountId,
		observedRemoteJids: event.remoteJids,
		messageId: event.messageId,
		reactionKey: event.reactionKey,
		resolveReactionTargetJids: params.resolveReactionTargetJids,
		logVerboseMessage: params.logVerboseMessage
	});
	if (!target) return false;
	const actorId = await params.resolveInboundJid(event.actorJid);
	if (!actorId) {
		params.logVerboseMessage?.(`whatsapp: approval reaction ignored for ${target.approvalId}; missing actor identity`);
		return true;
	}
	const approvalKind = target.approvalId.startsWith("plugin:") ? "plugin" : "exec";
	if (getWhatsAppApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	}).length === 0) {
		params.logVerboseMessage?.(`whatsapp: approval reaction denied id=${target.approvalId}; reactions require explicit approvers`);
		return true;
	}
	if (!whatsappApprovalAuth.authorizeActorAction({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: actorId,
		action: "approve",
		approvalKind
	}).authorized) {
		params.logVerboseMessage?.(`whatsapp: approval reaction denied id=${target.approvalId} sender=${actorId}`);
		return true;
	}
	const { isApprovalNotFoundError, resolveWhatsAppApproval } = await loadApprovalResolver();
	try {
		await resolveWhatsAppApproval({
			cfg: params.cfg,
			approvalId: target.approvalId,
			decision: target.decision,
			senderId: actorId,
			gatewayUrl: params.gatewayUrl
		});
		params.logVerboseMessage?.(`whatsapp: approval reaction resolved id=${target.approvalId} sender=${actorId} decision=${target.decision}`);
		return true;
	} catch (error) {
		if (isApprovalNotFoundError(error)) {
			unregisterWhatsAppApprovalReactionTarget({
				accountId: params.accountId,
				remoteJid: target.remoteJid,
				messageId: event.messageId
			});
			params.logVerboseMessage?.(`whatsapp: approval reaction ignored for expired approval id=${target.approvalId} sender=${actorId}`);
			return true;
		}
		params.logVerboseMessage?.(`whatsapp: approval reaction failed id=${target.approvalId} sender=${actorId}: ${String(error)}`);
		return true;
	}
}
//#endregion
//#region extensions/whatsapp/src/document-filename.ts
const WHATSAPP_DEFAULT_DOCUMENT_FILE_NAME = "file";
function resolveWhatsAppDefaultDocumentFileName(mimetype) {
	const extension = extensionForMime(mimetype);
	return extension ? `${WHATSAPP_DEFAULT_DOCUMENT_FILE_NAME}${extension}` : WHATSAPP_DEFAULT_DOCUMENT_FILE_NAME;
}
function resolveWhatsAppDocumentFileName(params) {
	const fallbackName = resolveWhatsAppDefaultDocumentFileName(params.mimetype);
	return stripAsciiControlCharacters(params.fileName ?? "").trim() || fallbackName;
}
function stripAsciiControlCharacters(value) {
	let stripped = "";
	for (const char of value) {
		const code = char.charCodeAt(0);
		if (code > 31 && code !== 127) stripped += char;
	}
	return stripped;
}
//#endregion
//#region extensions/whatsapp/src/outbound-media-contract.ts
const WHATSAPP_VOICE_FILE_NAME = "voice.ogg";
const WHATSAPP_VOICE_SAMPLE_RATE_HZ = 48e3;
const WHATSAPP_VOICE_BITRATE = "64k";
const WHATSAPP_VOICE_MIMETYPE = "audio/ogg; codecs=opus";
function stripWhatsAppPluralToolXml(text) {
	return stripToolCallXmlTags(text, { stripFunctionCallsXmlPayloads: true });
}
function finalizeWhatsAppVisibleText(text) {
	return sanitizeForPlainText(stripWhatsAppPluralToolXml(text));
}
function normalizeWhatsAppPayloadText(text) {
	return finalizeWhatsAppVisibleText(sanitizeAssistantVisibleText(text ?? "")).trimStart();
}
function stripLeadingBlankLines(text) {
	return text.replace(/^(?:[ \t]*\r?\n)+/, "");
}
function normalizeWhatsAppPayloadTextPreservingIndentation(text) {
	const normalized = stripLeadingBlankLines(finalizeWhatsAppVisibleText(sanitizeAssistantVisibleTextWithProfile(stripLeadingBlankLines(text ?? ""), "history")));
	return normalized.trim() ? normalized : "";
}
function resolveWhatsAppOutboundMediaUrls(payload) {
	return uniqueStrings([payload.mediaUrl?.trim(), ...(payload.mediaUrls ? [...payload.mediaUrls] : []).map((entry) => entry.trim()).filter((entry) => Boolean(entry))].filter((entry) => Boolean(entry)));
}
function normalizeWhatsAppOutboundPayload(payload, options) {
	const mediaUrls = resolveWhatsAppOutboundMediaUrls(payload);
	const normalizeText = options?.normalizeText ?? normalizeWhatsAppPayloadText;
	return {
		...payload,
		text: normalizeText(payload.text),
		mediaUrl: mediaUrls[0],
		mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0
	};
}
function inferWhatsAppMediaKind(media) {
	if (media.kind === "image" || media.kind === "audio" || media.kind === "video" || media.kind === "document") return media.kind;
	const contentType = normalizeContentType(media.contentType);
	if (contentType.startsWith("image/")) return "image";
	if (contentType.startsWith("audio/")) return "audio";
	if (contentType.startsWith("video/")) return "video";
	return "document";
}
function normalizeWhatsAppLoadedMedia(media, mediaUrl) {
	const kind = inferWhatsAppMediaKind(media);
	const mimetype = kind === "audio" && isWhatsAppNativeVoiceAudio({
		contentType: media.contentType,
		mediaUrl
	}) ? WHATSAPP_VOICE_MIMETYPE : media.contentType ?? "application/octet-stream";
	const fileName = kind === "document" ? resolveWhatsAppDocumentFileName({
		fileName: media.fileName ?? deriveWhatsAppDocumentFileName(mediaUrl),
		mimetype
	}) : media.fileName;
	return {
		buffer: media.buffer,
		kind,
		mimetype,
		...fileName ? { fileName } : {}
	};
}
async function prepareWhatsAppOutboundMedia(media, mediaUrl) {
	const normalized = normalizeWhatsAppLoadedMedia(media, mediaUrl);
	if (normalized.kind !== "audio") return normalized;
	if (isWhatsAppNativeVoiceAudio({
		contentType: media.contentType,
		fileName: media.fileName,
		mediaUrl
	})) return normalized;
	return {
		buffer: await transcodeToWhatsAppVoiceOpus({
			buffer: media.buffer,
			fileName: media.fileName ?? deriveWhatsAppDocumentFileName(mediaUrl) ?? "audio"
		}),
		kind: "audio",
		mimetype: WHATSAPP_VOICE_MIMETYPE
	};
}
function normalizeContentType(value) {
	return value?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
}
function isWhatsAppNativeVoiceAudio(params) {
	const contentType = normalizeContentType(params.contentType);
	if (contentType === "audio/ogg" || contentType === "audio/opus") return true;
	const fileName = params.fileName ?? deriveWhatsAppDocumentFileName(params.mediaUrl) ?? "";
	const ext = path.extname(fileName).toLowerCase();
	return ext === ".ogg" || ext === ".opus";
}
async function transcodeToWhatsAppVoiceOpus(params) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "whatsapp-voice-"
	}, async (workspace) => {
		const ext = path.extname(params.fileName).toLowerCase();
		const inputExt = ext && ext.length <= 12 ? ext : ".audio";
		const inputPath = await workspace.write(`input${inputExt}`, params.buffer);
		await writeExternalFileWithinRoot({
			rootDir: workspace.dir,
			path: WHATSAPP_VOICE_FILE_NAME,
			write: async (outputPath) => {
				await runFfmpeg([
					"-hide_banner",
					"-loglevel",
					"error",
					"-y",
					"-i",
					inputPath,
					"-vn",
					"-sn",
					"-dn",
					"-t",
					String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
					"-ar",
					String(WHATSAPP_VOICE_SAMPLE_RATE_HZ),
					"-ac",
					"1",
					"-c:a",
					"libopus",
					"-b:a",
					WHATSAPP_VOICE_BITRATE,
					"-f",
					"ogg",
					outputPath
				]);
			}
		});
		return await workspace.read(WHATSAPP_VOICE_FILE_NAME);
	});
}
function deriveWhatsAppDocumentFileName(mediaUrl) {
	if (!mediaUrl) return;
	try {
		const parsed = new URL(mediaUrl);
		const fileName = path.posix.basename(parsed.pathname);
		return fileName ? decodeURIComponent(fileName) : void 0;
	} catch {
		return (mediaUrl.split(/[?#]/, 1)[0] ?? "").split(/[\\/]/).pop() || void 0;
	}
}
function isRetryableWhatsAppOutboundError(error) {
	if (isWhatsAppSocketOperationTimeoutError(error)) return false;
	return /closed|reset|timed\s*out|disconnect/i.test(formatError(error));
}
async function sendWhatsAppOutboundWithRetry(params) {
	const maxAttempts = params.maxAttempts ?? 3;
	let lastError;
	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
		return await params.send();
	} catch (error) {
		lastError = error;
		const errorText = formatError(error);
		const isLastAttempt = attempt === maxAttempts;
		if (!isRetryableWhatsAppOutboundError(error) || isLastAttempt) throw error;
		const backoffMs = 500 * attempt;
		await params.onRetry?.({
			attempt,
			maxAttempts,
			backoffMs,
			error,
			errorText
		});
		await sleep(backoffMs);
	}
	throw lastError;
}
//#endregion
//#region extensions/whatsapp/src/outbound-media.runtime.ts
async function loadOutboundMediaFromUrl(mediaUrl, options = {}) {
	const readFile = options.mediaAccess?.readFile ?? options.mediaReadFile;
	const localRoots = options.mediaAccess?.localRoots?.length && options.mediaAccess.localRoots.length > 0 ? options.mediaAccess.localRoots : options.mediaLocalRoots && options.mediaLocalRoots.length > 0 ? options.mediaLocalRoots : void 0;
	const sharedOptions = {
		...options.maxBytes !== void 0 ? { maxBytes: options.maxBytes } : {},
		...options.optimizeImages !== void 0 ? { optimizeImages: options.optimizeImages } : {}
	};
	return await loadWebMedia(mediaUrl, readFile ? {
		...sharedOptions,
		localRoots: "any",
		readFile,
		hostReadCapability: true
	} : {
		...sharedOptions,
		...localRoots ? { localRoots } : {}
	});
}
//#endregion
//#region extensions/whatsapp/src/send.ts
const outboundLog = createSubsystemLogger("gateway/channels/whatsapp").child("outbound");
function supportsForcedDocumentDelivery(kind) {
	return kind === "image" || kind === "video";
}
function buildWhatsAppMediaSendState(params) {
	const { media, caption } = params;
	const forceDocumentDelivery = Boolean(params.forceDocument && supportsForcedDocumentDelivery(media.kind));
	let text = caption ?? "";
	let documentFileName = media.kind === "document" ? media.fileName : void 0;
	let visibleTextAfterVoice;
	if (media.kind === "audio" && caption) {
		visibleTextAfterVoice = caption;
		text = "";
	}
	if (forceDocumentDelivery) documentFileName ??= resolveWhatsAppDocumentFileName({
		fileName: media.fileName,
		mimetype: media.mimetype
	});
	return {
		mediaBuffer: media.buffer,
		mediaType: media.mimetype,
		text,
		forceDocumentDelivery,
		...documentFileName ? { documentFileName } : {},
		...visibleTextAfterVoice ? { visibleTextAfterVoice } : {}
	};
}
function resolveOutboundWhatsAppAccountId(params) {
	const explicitAccountId = params.accountId?.trim();
	if (explicitAccountId) return explicitAccountId;
	return resolveDefaultWhatsAppAccountId(params.cfg);
}
function requireOutboundActiveWebListener(params) {
	const resolvedAccountId = resolveOutboundWhatsAppAccountId(params) ?? resolveDefaultWhatsAppAccountId(params.cfg);
	const listener = getRegisteredWhatsAppConnectionController(resolvedAccountId)?.getActiveListener() ?? null;
	if (!listener) throw new Error(`No active WhatsApp Web listener (account: ${resolvedAccountId}). Start the gateway, then link WhatsApp with: ${formatCliCommand(`openclaw channels login --channel whatsapp --account ${resolvedAccountId}`)}.`);
	return {
		accountId: resolvedAccountId,
		listener
	};
}
function resolveActualSentRemoteJid(result, fallbackJid) {
	if (!result || typeof result !== "object") return fallbackJid;
	const rawKeys = result.keys;
	const keys = Array.isArray(rawKeys) ? rawKeys : [];
	for (const key of keys) if (typeof key?.remoteJid === "string" && key.remoteJid.trim()) return key.remoteJid.trim();
	return fallbackJid;
}
async function sendMessageWhatsApp(to, body, options) {
	let text = options.preserveLeadingWhitespace ? body : normalizeWhatsAppPayloadText(body);
	const jid = toWhatsappJid(to);
	const mediaUrls = resolveWhatsAppOutboundMediaUrls(options);
	const mediaPayload = options.mediaPayload;
	const primaryMediaUrl = mediaUrls[0] ?? mediaPayload?.fileName;
	const hasMedia = Boolean(mediaPayload || primaryMediaUrl);
	if (!text && !hasMedia) return {
		messageId: "",
		toJid: jid
	};
	const correlationId = generateSecureUuid();
	const startedAt = Date.now();
	const cfg = requireRuntimeConfig(options.cfg, "WhatsApp send");
	const { listener: active, accountId: resolvedAccountId } = requireOutboundActiveWebListener({
		cfg,
		accountId: options.accountId
	});
	const account = resolveWhatsAppAccount({
		cfg,
		accountId: resolvedAccountId ?? options.accountId
	});
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "whatsapp",
		accountId: resolvedAccountId ?? options.accountId
	});
	text = convertMarkdownTables(text ?? "", tableMode);
	text = markdownToWhatsApp(text);
	const redactedTo = redactIdentifier(to);
	const logger = getChildLogger({
		module: "web-outbound",
		correlationId,
		to: redactedTo
	});
	try {
		const redactedJid = redactIdentifier(jid);
		let mediaBuffer;
		let mediaType;
		let documentFileName;
		let visibleTextAfterVoice;
		let forceDocumentDelivery = false;
		let media;
		if (mediaPayload) media = await prepareWhatsAppOutboundMedia(mediaPayload, primaryMediaUrl);
		else if (primaryMediaUrl) media = await prepareWhatsAppOutboundMedia(await loadOutboundMediaFromUrl(primaryMediaUrl, {
			maxBytes: resolveWhatsAppMediaMaxBytes(account),
			optimizeImages: options.forceDocument ? false : void 0,
			mediaAccess: options.mediaAccess,
			mediaLocalRoots: options.mediaLocalRoots,
			mediaReadFile: options.mediaReadFile
		}), primaryMediaUrl);
		if (media) {
			const mediaSendState = buildWhatsAppMediaSendState({
				media,
				caption: text || void 0,
				forceDocument: options.forceDocument
			});
			mediaBuffer = mediaSendState.mediaBuffer;
			mediaType = mediaSendState.mediaType;
			documentFileName = mediaSendState.documentFileName;
			visibleTextAfterVoice = mediaSendState.visibleTextAfterVoice;
			forceDocumentDelivery = mediaSendState.forceDocumentDelivery;
			text = mediaSendState.text;
		}
		outboundLog.info(`Sending message -> ${redactedJid}${hasMedia ? " (media)" : ""}`);
		logger.info({
			jid: redactedJid,
			hasMedia
		}, "sending message");
		if (!isWhatsAppNewsletterJid(jid)) {
			await active.assertSendReady?.(to);
			await active.sendComposingTo(to);
		}
		const accountId = Boolean(options.accountId?.trim()) ? resolvedAccountId : void 0;
		const sendOptions = options.gifPlayback || forceDocumentDelivery || accountId || documentFileName || options.quotedMessageKey ? {
			...options.gifPlayback ? { gifPlayback: true } : {},
			...forceDocumentDelivery ? { asDocument: true } : {},
			...documentFileName ? { fileName: documentFileName } : {},
			...options.quotedMessageKey ? { quotedMessageKey: options.quotedMessageKey } : {},
			accountId
		} : void 0;
		const result = sendOptions ? await active.sendMessage(to, text, mediaBuffer, mediaType, sendOptions) : await active.sendMessage(to, text, mediaBuffer, mediaType);
		const messageId = result?.messageId ?? "unknown";
		const sentRemoteJid = resolveActualSentRemoteJid(result, jid);
		if (visibleTextAfterVoice) {
			await options.onDeliveryResult?.({
				messageId,
				toJid: sentRemoteJid
			});
			const captionResult = sendOptions ? await active.sendMessage(to, visibleTextAfterVoice, void 0, void 0, sendOptions) : await active.sendMessage(to, visibleTextAfterVoice, void 0, void 0);
			await options.onDeliveryResult?.({
				messageId: captionResult?.messageId ?? "unknown",
				toJid: resolveActualSentRemoteJid(captionResult, jid)
			});
		}
		if (messageId && messageId !== "unknown" && text) registerWhatsAppApprovalReactionTargetForOutboundMessage({
			accountId: resolvedAccountId,
			remoteJid: sentRemoteJid,
			messageId,
			text
		});
		const durationMs = Date.now() - startedAt;
		outboundLog.info(`Sent message ${messageId} -> ${redactedJid}${hasMedia ? " (media)" : ""} (${durationMs}ms)`);
		logger.info({
			jid: redactedJid,
			messageId
		}, "sent message");
		return {
			messageId,
			toJid: sentRemoteJid
		};
	} catch (err) {
		logger.error({
			err: String(err),
			to: redactedTo,
			hasMedia
		}, "failed to send via web session");
		throw err;
	}
}
async function sendTypingWhatsApp(to, options) {
	const { listener: active } = requireOutboundActiveWebListener({
		cfg: requireRuntimeConfig(options.cfg, "WhatsApp typing send"),
		accountId: options.accountId
	});
	if (!isWhatsAppNewsletterJid(toWhatsappJid(to))) {
		await active.assertSendReady?.(to);
		await active.sendComposingTo(to);
	}
}
async function sendReactionWhatsApp(chatJid, messageId, emoji, options) {
	const correlationId = generateSecureUuid();
	const { listener: active } = requireOutboundActiveWebListener({
		cfg: requireRuntimeConfig(options.cfg, "WhatsApp reaction"),
		accountId: options.accountId
	});
	const redactedChatJid = redactIdentifier(chatJid);
	const logger = getChildLogger({
		module: "web-outbound",
		correlationId,
		chatJid: redactedChatJid,
		messageId
	});
	try {
		const redactedJid = redactIdentifier(toWhatsappJid(chatJid));
		outboundLog.info(`Sending reaction "${emoji}" -> message ${messageId}`);
		logger.info({
			chatJid: redactedJid,
			messageId,
			emoji
		}, "sending reaction");
		await active.sendReaction(chatJid, messageId, emoji, options.fromMe ?? false, options.participant);
		outboundLog.info(`Sent reaction "${emoji}" -> message ${messageId}`);
		logger.info({
			chatJid: redactedJid,
			messageId,
			emoji
		}, "sent reaction");
	} catch (err) {
		logger.error({
			err: String(err),
			chatJid: redactedChatJid,
			messageId,
			emoji
		}, "failed to send reaction via web session");
		throw err;
	}
}
async function sendPollWhatsApp(to, poll, options) {
	const correlationId = generateSecureUuid();
	const startedAt = Date.now();
	const { listener: active } = requireOutboundActiveWebListener({
		cfg: requireRuntimeConfig(options.cfg, "WhatsApp poll"),
		accountId: options.accountId
	});
	const redactedTo = redactIdentifier(to);
	const logger = getChildLogger({
		module: "web-outbound",
		correlationId,
		to: redactedTo
	});
	try {
		const jid = toWhatsappJid(to);
		const redactedJid = redactIdentifier(jid);
		const normalized = normalizePollInput(poll, { maxOptions: 12 });
		outboundLog.info(`Sending poll -> ${redactedJid}`);
		logger.info({
			jid: redactedJid,
			optionCount: normalized.options.length,
			maxSelections: normalized.maxSelections
		}, "sending poll");
		if (!isWhatsAppNewsletterJid(jid)) await active.assertSendReady?.(to);
		const messageId = (await active.sendPoll(to, normalized))?.messageId ?? "unknown";
		const durationMs = Date.now() - startedAt;
		outboundLog.info(`Sent poll ${messageId} -> ${redactedJid} (${durationMs}ms)`);
		logger.info({
			jid: redactedJid,
			messageId
		}, "sent poll");
		return {
			messageId,
			toJid: jid
		};
	} catch (err) {
		logger.error({
			err: String(err),
			to: redactedTo
		}, "failed to send poll via web session");
		throw err;
	}
}
//#endregion
export { normalizeWhatsAppOutboundPayload as a, prepareWhatsAppOutboundMedia as c, maybeResolveWhatsAppApprovalReaction as d, registerWhatsAppApprovalReactionTarget as f, whatsappApprovalAuth as h, sendTypingWhatsApp as i, sendWhatsAppOutboundWithRetry as l, getWhatsAppApprovalApprovers as m, sendPollWhatsApp as n, normalizeWhatsAppPayloadText as o, unregisterWhatsAppApprovalReactionTarget as p, sendReactionWhatsApp as r, normalizeWhatsAppPayloadTextPreservingIndentation as s, sendMessageWhatsApp as t, resolveWhatsAppDocumentFileName as u };
