import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as formatUncaughtError, i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { S as safeFileURLToPath, v as assertNoWindowsNetworkPath } from "./fs-safe-aqmM_n6V.js";
import { r as openLocalFileSafely } from "./secure-temp-dir-XAWcZnE2.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { _ as scopeLegacySessionKeyToAgent, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { l as measureDiagnosticsTimelineSpan, s as emitDiagnosticsTimelineEvent, u as measureDiagnosticsTimelineSpanSync } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { a as hasGatewayClientCap, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-CcqJJIan.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CS3xdS-V.js";
import "./method-scopes-D5SEXRvS.js";
import { i as clearAgentRunContext, r as claimAgentRunContext, u as getAgentEventLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { a as getReplyPayloadMetadata, l as isReplyPayloadStatusNotice, o as getReplyPayloadTtsSupplement, r as buildTtsSupplementMediaPayload, u as isReplyPayloadTtsSupplement } from "./reply-payload-HLWc9ssO.js";
import { o as isAudioFileName } from "./mime-C8mVE2Bw.js";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.js";
import "./local-file-access-CBe_wA_B.js";
import { it as resolveSessionStoreKey, v as updateSessionStoreEntry } from "./store-DJ7wx5_V.js";
import { n as deliveryContextFromSession } from "./delivery-context.shared-D36KNc_D.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Z0pS5ykd.js";
import { a as resolveSessionFilePath } from "./paths-CHZBIGhF.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import { a as isOperatorUiClient, n as isGatewayCliClient, o as isWebchatClient } from "./message-channel-B4LS2Kcc.js";
import "./version-Bsehiavt.js";
import { b as persistSessionTranscriptTurn } from "./session-accessor-Dx6KDG0K.js";
import { n as estimateBase64DecodedBytes } from "./base64-l6yrCyHc.js";
import { i as deleteMediaBuffer, t as MEDIA_MAX_BYTES, u as saveMediaBuffer } from "./store-MjA3hYFB.js";
import { i as parseInboundMediaUri } from "./media-reference-zSHhNOuj.js";
import { t as resolveAgentTimeoutMs } from "./timeout-Drw0_zOv.js";
import { _ as readSessionTranscriptIndex, n as capArrayByJsonBytes, v as stripEnvelopeFromMessage } from "./session-utils.fs-CuEupzWa.js";
import "./sessions-gBZPP61K.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-BUJrk10q.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C14lActR.js";
import { s as normalizeInputProvenance } from "./input-provenance-CQSqbDss.js";
import { i as stripInlineDirectiveTagsForDisplay, n as sanitizeReplyDirectiveId, r as stripInlineDirectiveTagsForDelivery, t as parseInlineDirectives } from "./directive-tags-B64FytPi.js";
import { i as readSessionMessageByIdAsync, o as readSessionMessagesAsync, t as readRecentSessionMessagesAsync } from "./session-transcript-readers-B1Z-s_uS.js";
import { a as getSessionDefaults, b as resolveSessionModelRef, h as resolveGatewayModelSupportsImages, o as listAgentsForGateway, p as resolveDeletedAgentIdFromSessionKey, t as buildGatewaySessionInfo, u as loadSessionEntry } from "./session-utils-CWlrm3MP.js";
import { n as resolveSendPolicy } from "./send-policy-D_O9N501.js";
import { n as getSessionBindingService } from "./session-binding-service-QCvSH7Sy.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-CBQ2d2jT.js";
import { t as dispatchInboundMessage } from "./dispatch-DTGvZTqg.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C_j_aIUe.js";
import { r as getAgentScopedMediaLocalRoots, t as appendLocalMediaParentRoots } from "./local-roots-ChiBnsqP.js";
import { n as assertLocalMediaAllowed, t as LocalMediaAccessError } from "./local-media-access-DrwKPfBC.js";
import { f as createUserTurnTranscriptRecorder } from "./queue-DlJx-5Kf.js";
import { i as normalizeReplyPayloadsForDelivery } from "./payloads-DE8cWmMT.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { C as validateChatMessageGetParams, E as validateChatSendParams, S as validateChatInjectParams, T as validateChatMetadataParams, t as formatValidationErrors, x as validateChatHistoryParams, y as validateChatAbortParams } from "./src-CSp7rUPX.js";
import { a as ensureSandboxWorkspaceForSession } from "./sandbox-yDmlXhAz.js";
import { t as rewriteTranscriptEntriesInRuntimeTranscript } from "./transcript-rewrite-CO2KuAHs.js";
import { u as isPluginOwnedSessionBindingRecord } from "./conversation-binding-DNu8g4Ex.js";
import { s as augmentChatHistoryWithCliSessionImports } from "./attempt-execution.helpers-D6D1aACa.js";
import { n as createReplyMediaPathNormalizer } from "./reply-media-paths.runtime-rPkiRpjs.js";
import { n as createReplyDispatcher } from "./reply-dispatcher.types-frqf6trh.js";
import { n as isSuppressedControlReplyText } from "./control-reply-text-Ckvao2Hg.js";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-COF_MGQr.js";
import { a as isChatStopCommandText, c as resolveInFlightRunSnapshot, i as boundInFlightRunSnapshotForChatHistory, l as updateChatRunProvider, o as registerChatAbortController, t as abortChatRunById } from "./chat-abort-CHoKqMso.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-up_QEfXn.js";
import "./channel-outbound-BNKGCEf1.js";
import { t as logLargePayload } from "./diagnostic-payload-DUDXxbfn.js";
import { a as MAX_PAYLOAD_BYTES, c as getMaxChatHistoryMessagesBytes } from "./server-constants-BGwLM6XN.js";
import { t as formatForLog } from "./ws-log-UD7Od6QM.js";
import { n as modelCatalogBrowseRequiresFullDiscovery } from "./model-catalog-browse-CdLtLCA0.js";
import { a as projectChatDisplayMessage, c as resolveEffectiveChatHistoryMaxChars, i as dropPreSessionStartAnnouncePairs, r as augmentChatHistoryWithCanvasBlocks, s as projectRecentChatDisplayMessages } from "./session-transcript-path-CJD_TxuP.js";
import { t as stageSandboxMedia } from "./stage-sandbox-media-BV5Al7jr.js";
import { a as resolveChatAttachmentMaxBytes, i as parseMessageWithAttachments, n as MediaOffloadError, r as UnsupportedAttachmentError, t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-DgGXyLZs.js";
import { i as createManagedOutgoingImageBlocks, n as attachManagedOutgoingImagesToMessage, r as cleanupManagedOutgoingImageRecords } from "./managed-image-attachments-CGGY_hCy.js";
import { r as resolveSessionHistoryTailReadOptions } from "./session-history-state-CTnQJeqm.js";
import { i as persistGatewaySessionLifecycleEvent } from "./session-lifecycle-state-C07XOytp.js";
import { r as setGatewayDedupeEntry, t as emitSessionsChanged } from "./session-change-event-Cn2ZpuMQ.js";
import { n as startOptionalServerMethodModelCatalogLoad, t as loadOptionalServerMethodModelCatalog } from "./optional-model-catalog-lfLlMqV0.js";
import { n as hasTrackedActiveSessionRun } from "./session-event-payload-Bj2f4rz0.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/gateway/chat-input-sanitize.ts
/** Drop disallowed control characters while preserving tab and line breaks. */
function stripDisallowedChatControlChars(message) {
	let output = "";
	for (const char of message) {
		const code = char.charCodeAt(0);
		if (code === 9 || code === 10 || code === 13 || code >= 32 && code !== 127) output += char;
	}
	return output;
}
/** Normalize chat text and reject null bytes before routing to channels. */
function sanitizeChatSendMessageInput(message) {
	const normalized = message.normalize("NFC");
	if (normalized.includes("\0")) return {
		ok: false,
		error: "message must not contain null bytes"
	};
	return {
		ok: true,
		message: stripDisallowedChatControlChars(normalized)
	};
}
//#endregion
//#region src/gateway/server-methods/chat-reply-media.ts
function isDataUrlMedia(mediaUrl) {
	return mediaUrl.trim().toLowerCase().startsWith("data:");
}
function shouldPreserveDisplayMediaUrl(payload, mediaUrl) {
	if (isDataUrlMedia(mediaUrl)) return true;
	if (!isAudioFileName(mediaUrl)) return false;
	if (isPassThroughRemoteMediaSource(mediaUrl)) return true;
	return payload.trustedLocalMedia === true;
}
/** Normalize reply media paths for webchat display without leaking sensitive media. */
async function normalizeWebchatReplyMediaPathsForDisplay(params) {
	if (params.payloads.length === 0) return params.payloads;
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, params.agentId);
	if (!workspaceDir) return params.payloads;
	const normalizeMediaPaths = createReplyMediaPathNormalizer({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		workspaceDir,
		accountId: params.accountId
	});
	const normalized = [];
	for (const payload of params.payloads) {
		if (payload.sensitiveMedia === true) {
			normalized.push(payload);
			continue;
		}
		const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
		if (!mediaUrls.some((mediaUrl) => shouldPreserveDisplayMediaUrl(payload, mediaUrl))) {
			normalized.push(await normalizeMediaPaths(payload));
			continue;
		}
		if (!mediaUrls.some((mediaUrl) => !shouldPreserveDisplayMediaUrl(payload, mediaUrl))) {
			normalized.push(payload);
			continue;
		}
		const mergedMediaUrls = [];
		const text = payload.text;
		for (const mediaUrl of mediaUrls) {
			if (shouldPreserveDisplayMediaUrl(payload, mediaUrl)) {
				mergedMediaUrls.push(mediaUrl);
				continue;
			}
			const normalizedMediaUrls = resolveSendableOutboundReplyParts(await normalizeMediaPaths({
				...payload,
				mediaUrl,
				mediaUrls: [mediaUrl]
			})).mediaUrls;
			if (normalizedMediaUrls.length === 0) continue;
			mergedMediaUrls.push(...normalizedMediaUrls);
		}
		normalized.push({
			...payload,
			text,
			mediaUrl: mergedMediaUrls[0],
			mediaUrls: mergedMediaUrls
		});
	}
	return normalized;
}
//#endregion
//#region src/gateway/server-methods/chat-transcript-inject.ts
function resolveInjectedAssistantContent(params) {
	const labelPrefix = params.label ? `[${params.label}]\n\n` : "";
	if (params.content && params.content.length > 0) {
		if (!labelPrefix) return params.content;
		const first = params.content[0];
		if (first && typeof first === "object" && first.type === "text" && typeof first.text === "string") return [{
			...first,
			text: `${labelPrefix}${first.text}`
		}, ...params.content.slice(1)];
		return [{
			type: "text",
			text: labelPrefix.trim()
		}, ...params.content];
	}
	return [{
		type: "text",
		text: `${labelPrefix}${params.message}`
	}];
}
/** Append a gateway-authored assistant message while preserving transcript parent links. */
async function appendInjectedAssistantMessageToTranscript(params) {
	const now = params.now ?? Date.now();
	const messageBody = {
		role: "assistant",
		content: resolveInjectedAssistantContent({
			message: params.message,
			label: params.label,
			content: params.content
		}),
		timestamp: now,
		stopReason: "stop",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		api: "openai-responses",
		provider: "openclaw",
		model: "gateway-injected",
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...params.ttsSupplement ? { openclawTtsSupplement: params.ttsSupplement } : {},
		...params.abortMeta ? { openclawAbort: {
			aborted: true,
			origin: params.abortMeta.origin,
			runId: params.abortMeta.runId
		} } : {}
	};
	try {
		const appended = (await persistSessionTranscriptTurn({
			sessionFile: params.transcriptPath,
			sessionKey: params.sessionKey ?? "",
			...params.agentId ? { agentId: params.agentId } : {}
		}, {
			updateMode: "inline",
			...params.config ? { config: params.config } : {},
			messages: [{
				message: messageBody,
				now,
				useRawWhenLinear: true
			}]
		})).messages[0];
		if (!appended) return {
			ok: false,
			error: "gateway-injected assistant message was not appended"
		};
		return {
			ok: true,
			messageId: appended.messageId,
			message: appended.message
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
//#region src/gateway/server-methods/chat-webchat-media.ts
/** Cap local audio files exposed through assistant media. */
const MAX_WEBCHAT_AUDIO_BYTES = 15 * 1024 * 1024;
const MAX_WEBCHAT_IMAGE_DATA_URL_CHARS = 2e6;
const MAX_WEBCHAT_IMAGE_DATA_BYTES = 15e5;
const ALLOWED_WEBCHAT_DATA_IMAGE_MEDIA_TYPES = new Set([
	"image/apng",
	"image/avif",
	"image/bmp",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
const MIME_BY_EXT = {
	".aac": "audio/aac",
	".m4a": "audio/mp4",
	".mp3": "audio/mpeg",
	".oga": "audio/ogg",
	".ogg": "audio/ogg",
	".opus": "audio/opus",
	".wav": "audio/wav",
	".webm": "audio/webm"
};
/** Map `mediaUrl` strings to an absolute filesystem path for local embedding (plain paths or `file:` URLs). */
function resolveLocalMediaPathForEmbedding(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (/^data:/i.test(trimmed)) return null;
	if (/^https?:/i.test(trimmed)) return null;
	if (trimmed.startsWith("file:")) try {
		const p = safeFileURLToPath(trimmed);
		if (!path.isAbsolute(p)) return null;
		return p;
	} catch {
		return null;
	}
	if (!path.isAbsolute(trimmed)) return null;
	try {
		assertNoWindowsNetworkPath(trimmed, "Local media path");
	} catch {
		return null;
	}
	return trimmed;
}
async function readLocalAudioContentBlockForEmbedding(payload, raw, options) {
	if (payload.trustedLocalMedia !== true) return null;
	const resolved = resolveLocalMediaPathForEmbedding(raw);
	if (!resolved) return null;
	if (!isAudioFileName(resolved)) return null;
	let opened;
	try {
		await assertLocalMediaAllowed(resolved, options?.localRoots);
		opened = await openLocalFileSafely({ filePath: resolved });
		await assertLocalMediaAllowed(opened.realPath, options?.localRoots);
		if (opened.stat.size > MAX_WEBCHAT_AUDIO_BYTES) return null;
		return {
			path: opened.realPath,
			block: {
				type: "attachment",
				attachment: {
					url: opened.realPath,
					kind: "audio",
					label: path.basename(opened.realPath),
					mimeType: mimeTypeForPath(opened.realPath),
					...payload.audioAsVoice === true ? { isVoiceNote: true } : {}
				}
			}
		};
	} catch (err) {
		if (err instanceof LocalMediaAccessError) options?.onLocalAudioAccessDenied?.(err);
		return null;
	} finally {
		await opened?.handle.close().catch(() => {});
	}
}
async function resolveReplyMediaAudioEmbedding(payload, raw, seenAudio, options) {
	const url = raw.trim();
	if (!url) return null;
	const audio = await readLocalAudioContentBlockForEmbedding(payload, url, options);
	if (!audio || seenAudio.has(audio.path)) return { url };
	seenAudio.add(audio.path);
	return {
		url,
		audioBlock: audio.block
	};
}
function mimeTypeForPath(filePath) {
	return MIME_BY_EXT[normalizeLowercaseStringOrEmpty(path.extname(filePath))] ?? "audio/mpeg";
}
function isBase64DataPayload(value) {
	if (value.length === 0) return false;
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (!(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47 || code === 61) && !(code === 9 || code === 10 || code === 11 || code === 12 || code === 13 || code === 32)) return false;
	}
	return true;
}
function resolveEmbeddableImageUrl(url) {
	const trimmed = url.trim();
	if (!trimmed) return null;
	if (trimmed.length > MAX_WEBCHAT_IMAGE_DATA_URL_CHARS) return null;
	const commaIndex = trimmed.indexOf(",");
	if (commaIndex < 0) return null;
	const metadata = trimmed.slice(0, commaIndex);
	const match = /^data:(image\/[a-z0-9.+-]+);base64$/i.exec(metadata);
	const base64Data = trimmed.slice(commaIndex + 1);
	if (!match || !isBase64DataPayload(base64Data)) return null;
	const mediaType = normalizeLowercaseStringOrEmpty(match[1]);
	if (!ALLOWED_WEBCHAT_DATA_IMAGE_MEDIA_TYPES.has(mediaType)) return null;
	if (estimateBase64DecodedBytes(base64Data) > MAX_WEBCHAT_IMAGE_DATA_BYTES) return null;
	return trimmed;
}
function resolveReplyDirectivePrefix(payload) {
	const replyToId = sanitizeReplyDirectiveId(payload.replyToId);
	if (replyToId) return `[[reply_to:${replyToId}]]`;
	if (payload.replyToCurrent) return "[[reply_to_current]]";
	return "";
}
/**
* Build Control UI / transcript `content` blocks for local TTS (or other) audio files
* referenced by slash-command / agent replies when the webchat path only had text aggregation.
*/
async function buildWebchatAudioContentBlocksFromReplyPayloads(payloads, options) {
	const seen = /* @__PURE__ */ new Set();
	const blocks = [];
	for (const payload of payloads) {
		if (payload.isReasoning === true) continue;
		const parts = resolveSendableOutboundReplyParts(payload);
		for (const raw of parts.mediaUrls) {
			const media = await resolveReplyMediaAudioEmbedding(payload, raw, seen, options);
			if (!media?.audioBlock) continue;
			blocks.push(media.audioBlock);
		}
	}
	return blocks;
}
async function buildWebchatAssistantMessageFromReplyPayloads(payloads, options) {
	const content = [];
	const transcriptTextParts = [];
	const seenAudio = /* @__PURE__ */ new Set();
	const seenImages = /* @__PURE__ */ new Set();
	let hasAudio = false;
	let hasImage = false;
	for (const payload of payloads) {
		if (payload.isReasoning === true) continue;
		const visibleText = payload.text?.trim();
		const text = visibleText && !isSuppressedControlReplyText(visibleText) ? visibleText : void 0;
		const replyDirectivePrefix = resolveReplyDirectivePrefix(payload);
		let payloadHasAudio = false;
		let payloadHasImage = false;
		const payloadMediaBlocks = [];
		const parts = resolveSendableOutboundReplyParts(payload);
		for (const raw of parts.mediaUrls) {
			const media = await resolveReplyMediaAudioEmbedding(payload, raw, seenAudio, options);
			if (!media) continue;
			if (media.audioBlock) {
				payloadMediaBlocks.push(media.audioBlock);
				hasAudio = true;
				payloadHasAudio = true;
				continue;
			}
			const imageUrl = resolveEmbeddableImageUrl(media.url);
			if (!imageUrl || seenImages.has(imageUrl)) continue;
			seenImages.add(imageUrl);
			payloadMediaBlocks.push({
				type: "input_image",
				image_url: imageUrl
			});
			hasImage = true;
			payloadHasImage = true;
		}
		const syntheticText = payloadMediaBlocks.length > 0 && (!text || replyDirectivePrefix) && transcriptTextParts.length === 0 ? payloadHasAudio && payloadHasImage ? "Media reply" : payloadHasAudio ? "Audio reply" : "Image reply" : void 0;
		const blockText = text ?? syntheticText;
		if (blockText) {
			const fullText = replyDirectivePrefix ? `${replyDirectivePrefix}${blockText}` : blockText;
			transcriptTextParts.push(fullText);
			content.push({
				type: "text",
				text: fullText
			});
		} else if (replyDirectivePrefix) {
			transcriptTextParts.push(replyDirectivePrefix);
			content.push({
				type: "text",
				text: replyDirectivePrefix
			});
		}
		content.push(...payloadMediaBlocks);
	}
	if (!hasAudio && !hasImage) return null;
	const transcriptText = transcriptTextParts.join("\n\n").trim() || (hasAudio && hasImage ? "Media reply" : hasAudio ? "Audio reply" : "Image reply");
	if (transcriptTextParts.length === 0) content.unshift({
		type: "text",
		text: transcriptText
	});
	return {
		content,
		transcriptText
	};
}
//#endregion
//#region src/gateway/server-methods/chat.ts
function roundedChatSendTimingMs(value) {
	return Math.max(0, Math.round(value * 1e3) / 1e3);
}
function chatSendAckServerTimingAttributes(timing) {
	if (!timing) return {};
	return {
		serverReceivedToAckMs: timing.receivedToAckMs,
		serverLoadSessionMs: timing.loadSessionMs,
		...timing.prepareAttachmentsMs !== void 0 ? { serverPrepareAttachmentsMs: timing.prepareAttachmentsMs } : {}
	};
}
function shouldIncludeChatSendAckServerTiming(client) {
	return isOperatorUiClient(client);
}
const CONTROL_UI_RECONNECT_RESUME_PARAM = "__controlUiReconnectResume";
function resolveControlUiReconnectResumeParams(params, clientInfo) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return {
		params,
		resumeRequested: false
	};
	const record = params;
	if (!(record[CONTROL_UI_RECONNECT_RESUME_PARAM] === true && isOperatorUiClient(clientInfo))) return {
		params,
		resumeRequested: false
	};
	const validatedParams = { ...record };
	delete validatedParams[CONTROL_UI_RECONNECT_RESUME_PARAM];
	return {
		params: validatedParams,
		resumeRequested: true
	};
}
function emitOperatorChatSendServerTiming(params) {
	const connId = typeof params.client?.connId === "string" && params.client.connId.trim() ? params.client.connId.trim() : void 0;
	if (!connId || !isOperatorUiClient(params.client?.connect?.client)) return;
	const nowMs = performance.now();
	params.context.broadcastToConnIds("chat.send_timing", {
		phase: params.phase,
		runId: params.runId,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		ackToPhaseMs: roundedChatSendTimingMs(nowMs - params.ackedAtMs),
		receivedToPhaseMs: roundedChatSendTimingMs(nowMs - params.receivedAtMs),
		...params.dispatchStartedAtMs !== void 0 ? { dispatchStartedToPhaseMs: roundedChatSendTimingMs(nowMs - params.dispatchStartedAtMs) } : {},
		...params.extra
	}, new Set([connId]), { dropIfSlow: true });
}
async function handleChatMetadataRequest({ params, respond, context }) {
	if (!validateChatMetadataParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid chat.metadata params: ${formatValidationErrors(validateChatMetadataParams.errors)}`));
		return;
	}
	const metadataParams = params;
	const cfg = context.getRuntimeConfig();
	const requestedAgentId = typeof metadataParams.agentId === "string" && metadataParams.agentId.trim() ? normalizeAgentId(metadataParams.agentId) : resolveDefaultAgentId(cfg);
	if (!listAgentIds(cfg).includes(requestedAgentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${metadataParams.agentId}"`));
		return;
	}
	try {
		respond(true, await buildChatMetadataResult({
			cfg,
			context,
			agentId: requestedAgentId
		}));
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
	}
}
async function buildChatMetadataResult(params) {
	const [{ buildModelsListResult }, { buildCommandsListResult }] = await Promise.all([import("./models-list-result-DRUn8puT.js"), import("./commands-list-result-DkRmBzib.js")]);
	const [models, commands] = await Promise.all([buildModelsListResult({
		context: params.context,
		agentId: params.agentId,
		params: { view: "configured" },
		preloadedCatalog: params.preloadedModelCatalog
	}), Promise.resolve(buildCommandsListResult({
		cfg: params.cfg,
		agentId: params.agentId,
		includeArgs: true,
		scope: "text"
	}))]);
	return {
		...models,
		...commands
	};
}
async function buildChatStartupMetadataResult(params) {
	if (!params.modelCatalog) return;
	if (modelCatalogBrowseRequiresFullDiscovery({
		cfg: params.cfg,
		view: "configured"
	})) return;
	try {
		const { buildModelsListResult } = await import("./models-list-result-DRUn8puT.js");
		return await buildModelsListResult({
			context: params.context,
			agentId: params.agentId,
			params: { view: "configured" },
			preloadedCatalog: params.modelCatalog
		});
	} catch (err) {
		params.context.logGateway.debug(`chat.startup continuing without metadata: ${formatErrorMessage(err)}`);
		return;
	}
}
function normalizeUnknownText(value) {
	return typeof value === "string" ? normalizeOptionalText(value) : void 0;
}
/** True when a reply payload carries at least one media reference (mediaUrl or mediaUrls). */
function isMediaBearingPayload(payload) {
	if (payload.isReasoning === true) return false;
	if (payload.mediaUrl?.trim()) return true;
	if (payload.mediaUrls?.some((url) => url.trim())) return true;
	return false;
}
function stripVisibleTextFromTtsSupplement(payload) {
	return isReplyPayloadTtsSupplement(payload) ? buildTtsSupplementMediaPayload(payload) : payload;
}
function resolveTtsSupplementMarkerText(text) {
	const trimmed = text.trim();
	const projected = projectChatDisplayMessage({
		role: "assistant",
		content: [{
			type: "text",
			text: trimmed
		}]
	}, { maxChars: Number.MAX_SAFE_INTEGER });
	return extractAssistantDisplayTextFromContent(Array.isArray(projected?.content) ? projected.content : void 0) ?? (typeof projected?.text === "string" ? projected.text.trim() : void 0) ?? trimmed;
}
function buildTtsSupplementTranscriptMarker(payload) {
	const supplement = getReplyPayloadTtsSupplement(payload);
	if (!supplement) return;
	const visibleText = resolveTtsSupplementMarkerText(payload.text?.trim() || supplement.spokenText.trim());
	return { textSha256: createHash("sha256").update(visibleText).digest("hex") };
}
function buildMediaOnlyTtsSupplementTranscriptMarker(payload) {
	if (payload.text?.trim()) return;
	return buildTtsSupplementTranscriptMarker(payload);
}
function resolveWebchatPromptCacheKey(params) {
	return `openclaw-webchat-${createHash("sha256").update([
		"v1",
		params.provider.trim().toLowerCase(),
		params.model.trim(),
		normalizeAgentId(params.agentId),
		params.sessionKey
	].join("\0"), "utf8").digest("hex").slice(0, 32)}`;
}
async function buildWebchatAssistantMediaMessage(payloads, options) {
	return buildWebchatAssistantMessageFromReplyPayloads(payloads, {
		localRoots: options?.localRoots,
		onLocalAudioAccessDenied: (err) => {
			options?.onLocalAudioAccessDenied?.(formatForLog(err));
		}
	});
}
const CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES = 128 * 1024;
const CHAT_HISTORY_OVERSIZED_PLACEHOLDER = "[chat.history omitted: message too large]";
const CHAT_HISTORY_UNAVAILABLE_SENTINEL = "[chat.history unavailable: transcript too large to display; the full history is preserved on disk]";
/**
* A minimal, metadata-free notice returned when even a single oversized
* placeholder cannot fit the chat-history byte budget. Returning this instead
* of an empty array guarantees the dashboard never renders a blank transcript,
* which otherwise reads to the operator as total history loss.
*/
function buildChatHistoryUnavailableSentinel() {
	return {
		role: "assistant",
		timestamp: Date.now(),
		content: [{
			type: "text",
			text: CHAT_HISTORY_UNAVAILABLE_SENTINEL
		}]
	};
}
const CHAT_STARTUP_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS = 25;
const MANAGED_OUTGOING_IMAGE_PATH_PREFIX = "/api/chat/media/outgoing/";
let chatHistoryPlaceholderEmitCount = 0;
const chatHistoryManagedImageCleanupState = /* @__PURE__ */ new Map();
const CHANNEL_AGNOSTIC_SESSION_SCOPES = new Set([
	"main",
	"direct",
	"dm",
	"group",
	"channel",
	"cron",
	"run",
	"subagent",
	"acp",
	"thread",
	"topic"
]);
const CHANNEL_SCOPED_SESSION_SHAPES = new Set([
	"direct",
	"dm",
	"group",
	"channel"
]);
const ACTIVE_CHAT_SEND_DEDUPE_PREFIX = "chat:active-send";
function resolveActiveChatSendRunId(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const runId = value.runId;
	return typeof runId === "string" && runId.trim() ? runId : null;
}
function clearActiveChatSendDedupeRun(dedupe, key, runId) {
	if (!key || resolveActiveChatSendRunId(dedupe.get(key)?.payload) !== runId) return;
	dedupe.delete(key);
}
function buildAbortedChatSendPayload(params) {
	return {
		runId: params.runId,
		status: "timeout",
		summary: "aborted",
		...params.stopReason ? { stopReason: params.stopReason } : {},
		endedAt: params.endedAt
	};
}
function buildActiveChatSendDedupeKey(params) {
	const message = params.message.trim();
	if (!message || message.startsWith("/") || params.attachmentCount > 0 || params.explicitDeliverRoute || normalizeMessageChannel(params.originatingChannel) !== "webchat") return null;
	const dedupeParts = params.systemScope?.trim() ? [
		params.sessionKey,
		message,
		params.systemScope.trim()
	] : [params.sessionKey, message];
	return `${ACTIVE_CHAT_SEND_DEDUPE_PREFIX}:${createHash("sha256").update(JSON.stringify(dedupeParts)).digest("hex").slice(0, 32)}`;
}
function validateChatSelectedAgent(params) {
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	if (!agentId) return { ok: true };
	if (!listAgentIds(params.cfg).includes(agentId)) return {
		ok: false,
		error: `Unknown agent id "${params.agentId}"`
	};
	const requestedSessionKey = params.requestedSessionKey.trim();
	const parsed = parseAgentSessionKey(requestedSessionKey);
	if (parsed && normalizeAgentId(parsed.agentId) !== agentId) return {
		ok: false,
		error: `agentId "${params.agentId}" does not match session key "${params.requestedSessionKey}"`
	};
	if (requestedSessionKey.toLowerCase() === "global") return {
		ok: true,
		agentId
	};
	if (resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: requestedSessionKey
	}) === "global") return {
		ok: true,
		agentId
	};
	if (!parsed || normalizeAgentId(parsed.agentId) !== agentId) return {
		ok: false,
		error: `agentId "${params.agentId}" does not match session key "${params.requestedSessionKey}"`
	};
	return {
		ok: true,
		agentId
	};
}
function resolveRequestedChatAgentId(params) {
	const explicitAgentId = normalizeOptionalText(params.agentId);
	if (explicitAgentId) return normalizeAgentId(explicitAgentId);
	if (!params.cfg) return;
	const parsed = parseAgentSessionKey(params.requestedSessionKey.trim());
	if (!parsed?.agentId || resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: params.requestedSessionKey
	}) !== "global") return;
	return normalizeAgentId(parsed.agentId);
}
function resolveChatSendActiveScopeKey(params) {
	if (params.sessionKey !== "global" || !params.agentId) return params.sessionKey;
	return scopeLegacySessionKeyToAgent({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		mainKey: params.mainKey
	}) ?? params.sessionKey;
}
function formatAttachmentFailureForLog(err) {
	const primary = formatUncaughtError(err);
	const cause = err instanceof Error ? err.cause : void 0;
	if (cause === void 0) return primary;
	const causeText = formatUncaughtError(cause);
	if (!causeText || causeText === primary) return primary;
	return `${primary}\nCaused by: ${causeText}`;
}
function logAttachmentFailure(logGateway, label, err) {
	logGateway.error(label, {
		error: formatAttachmentFailureForLog(err),
		consoleMessage: `${label}: ${formatForLog(err)}`
	});
}
function buildTranscriptReplyText(payloads) {
	return payloads.map((payload) => {
		if (payload.isReasoning === true) return "";
		const parts = resolveSendableOutboundReplyParts(payload);
		const lines = [];
		const parsedText = payload.text?.includes("[[") ? parseInlineDirectives(payload.text) : void 0;
		const replyToId = sanitizeReplyDirectiveId(payload.replyToId) ?? sanitizeReplyDirectiveId(parsedText?.replyToExplicitId);
		if (replyToId) lines.push(`[[reply_to:${replyToId}]]`);
		else if (payload.replyToCurrent || parsedText?.replyToCurrent) lines.push("[[reply_to_current]]");
		const text = payload.text ? stripInlineDirectiveTagsForDelivery(payload.text).text.trim() : "";
		if (text && !isSuppressedControlReplyText(text)) lines.push(text);
		for (const mediaUrl of parts.mediaUrls) {
			if (payload.sensitiveMedia === true) continue;
			const trimmed = mediaUrl.trim();
			if (trimmed) lines.push(`Attachment: ${trimmed}`);
		}
		if ((payload.audioAsVoice || parsedText?.audioAsVoice) && parts.mediaUrls.some((mediaUrl) => isAudioFileName(mediaUrl))) lines.push("[[audio_as_voice]]");
		return lines.join("\n").trim();
	}).filter(Boolean).join("\n\n").trim();
}
function hasSensitiveMediaPayload(payloads) {
	return payloads.some((payload) => payload.sensitiveMedia === true && isMediaBearingPayload(payload));
}
function sanitizeAssistantDisplayText(value) {
	if (!value) return;
	const withoutEnvelope = stripEnvelopeFromMessage(value);
	return stripInlineDirectiveTagsForDisplay(typeof withoutEnvelope === "string" ? withoutEnvelope : value).text.trim() || void 0;
}
function extractAssistantDisplayTextFromContent(content) {
	if (!Array.isArray(content) || content.length === 0) return;
	const parts = content.map((block) => {
		if (block?.type !== "text" || typeof block.text !== "string") return "";
		return block.text.trim();
	}).filter(Boolean);
	return parts.length > 0 ? parts.join("\n\n") : void 0;
}
async function buildAssistantDisplayContentFromReplyPayloads(params) {
	const rawTextPayloadCount = params.payloads.filter((payload) => payload.isReasoning !== true && typeof payload.text === "string" && payload.text.trim().length > 0).length;
	const normalized = normalizeReplyPayloadsForDelivery(params.payloads);
	if (normalized.length === 0) return rawTextPayloadCount > 0 ? [{
		type: "text",
		text: ""
	}] : void 0;
	const content = [];
	let strippedTextPayloadCount = 0;
	for (const payload of normalized) {
		const text = sanitizeAssistantDisplayText(payload.text);
		if (text) content.push({
			type: "text",
			text
		});
		else if (typeof payload.text === "string" && payload.text.trim().length > 0) strippedTextPayloadCount += 1;
		if (params.includeSensitiveMedia === false && payload.sensitiveMedia === true) continue;
		const audioBlocks = await buildWebchatAudioContentBlocksFromReplyPayloads([payload], {
			localRoots: Array.isArray(params.managedImageLocalRoots) ? params.managedImageLocalRoots : void 0,
			onLocalAudioAccessDenied: (err) => {
				params.onLocalAudioAccessDenied?.(formatForLog(err));
			}
		});
		content.push(...audioBlocks);
		const mediaUrls = Array.from(new Set([...Array.isArray(payload.mediaUrls) ? payload.mediaUrls : [], ...typeof payload.mediaUrl === "string" ? [payload.mediaUrl] : []]));
		const imageBlocks = await createManagedOutgoingImageBlocks({
			sessionKey: params.sessionKey,
			...params.sessionKey === "global" && params.agentId ? { agentId: params.agentId } : {},
			mediaUrls,
			localRoots: params.managedImageLocalRoots,
			continueOnPrepareError: true,
			onPrepareError: (error) => {
				params.onManagedImagePrepareError?.(error.message);
			}
		});
		if (imageBlocks.length > 0) content.push(...imageBlocks);
	}
	if (content.length > 0) return content;
	return strippedTextPayloadCount > 0 ? [{
		type: "text",
		text: ""
	}] : void 0;
}
function replaceAssistantContentTextBlocks(content, transcriptMediaMessage) {
	const transcriptTextBlocks = (transcriptMediaMessage?.content ?? []).filter((block) => Boolean(block) && typeof block === "object" && block.type === "text" && typeof block.text === "string");
	if (transcriptTextBlocks.length === 0) return content ? [...content] : void 0;
	if (!content || content.length === 0) return [...transcriptTextBlocks];
	const merged = [];
	let transcriptTextIndex = 0;
	for (const block of content) {
		if (block?.type === "text" && typeof block.text === "string" && transcriptTextIndex < transcriptTextBlocks.length) {
			merged.push(transcriptTextBlocks[transcriptTextIndex++]);
			continue;
		}
		merged.push(block);
	}
	if (transcriptTextIndex < transcriptTextBlocks.length) merged.unshift(...transcriptTextBlocks.slice(transcriptTextIndex));
	return merged;
}
function isManagedOutgoingImageUrl(value) {
	if (typeof value !== "string" || !value.trim()) return false;
	try {
		return new URL(value, "http://localhost").pathname.startsWith(MANAGED_OUTGOING_IMAGE_PATH_PREFIX);
	} catch {
		return false;
	}
}
function stripManagedOutgoingAssistantContentBlocks(content) {
	if (!content || content.length === 0) return;
	const filtered = content.filter((block) => {
		if (block?.type !== "image") return true;
		return !(isManagedOutgoingImageUrl(block.url) || isManagedOutgoingImageUrl(block.openUrl));
	});
	return filtered.length > 0 ? filtered : void 0;
}
function extractAssistantDisplayText(content) {
	if (!content || content.length === 0) return;
	return content.map((block) => block?.type === "text" && typeof block.text === "string" ? block.text : "").filter(Boolean).join("\n\n").trim() || void 0;
}
function hasAssistantDisplayMediaContent(content) {
	return Boolean(content?.some((block) => block?.type !== "text"));
}
function hasVisibleAssistantFinalMessage(message) {
	if (!message) return false;
	if (typeof message.text === "string" && message.text.trim()) return true;
	return (Array.isArray(message.content) ? message.content : []).some((block) => {
		if (!block || typeof block !== "object") return false;
		const record = block;
		if (record.type === "text") return typeof record.text === "string" && record.text.trim().length > 0;
		return true;
	});
}
function hasManagedOutgoingAssistantContent(content) {
	return Boolean(content?.some((block) => block?.type === "image" && (isManagedOutgoingImageUrl(block.url) || isManagedOutgoingImageUrl(block.openUrl))));
}
function scheduleChatHistoryManagedImageCleanup(params) {
	const cleanupKey = params.sessionKey === "global" && params.agentId ? `agent:${params.agentId}:global` : params.sessionKey;
	if (chatHistoryManagedImageCleanupState.has(cleanupKey)) return;
	const pending = cleanupManagedOutgoingImageRecords({
		sessionKey: params.sessionKey,
		...params.sessionKey === "global" && params.agentId ? { agentId: params.agentId } : {}
	}).then(() => void 0).catch((error) => {
		params.context.logGateway.debug(`chat.history managed image cleanup skipped sessionKey=${JSON.stringify(params.sessionKey)} error=${formatForLog(error)}`);
	}).finally(() => {
		if (chatHistoryManagedImageCleanupState.get(cleanupKey) === pending) chatHistoryManagedImageCleanupState.delete(cleanupKey);
	});
	chatHistoryManagedImageCleanupState.set(cleanupKey, pending);
}
function resolveChatSendOriginatingRoute(params) {
	if (params.explicitOrigin?.originatingChannel && params.explicitOrigin.originatingTo) return {
		originatingChannel: params.explicitOrigin.originatingChannel,
		originatingTo: params.explicitOrigin.originatingTo,
		...params.explicitOrigin.accountId ? { accountId: params.explicitOrigin.accountId } : {},
		...params.explicitOrigin.messageThreadId ? { messageThreadId: params.explicitOrigin.messageThreadId } : {},
		explicitDeliverRoute: params.deliver === true
	};
	if (!(params.deliver === true)) return {
		originatingChannel: INTERNAL_MESSAGE_CHANNEL,
		explicitDeliverRoute: false
	};
	const sessionDeliveryContext = deliveryContextFromSession(params.entry);
	const routeChannelCandidate = normalizeMessageChannel(sessionDeliveryContext?.channel ?? params.entry?.lastChannel ?? params.entry?.origin?.provider);
	const routeToCandidate = sessionDeliveryContext?.to ?? params.entry?.lastTo;
	const routeAccountIdCandidate = sessionDeliveryContext?.accountId ?? params.entry?.lastAccountId ?? params.entry?.origin?.accountId ?? void 0;
	const routeThreadIdCandidate = sessionDeliveryContext?.threadId ?? params.entry?.lastThreadId ?? params.entry?.origin?.threadId;
	if (params.sessionKey.length > 512) return {
		originatingChannel: INTERNAL_MESSAGE_CHANNEL,
		explicitDeliverRoute: false
	};
	const sessionScopeParts = (parseAgentSessionKey(params.sessionKey)?.rest ?? params.sessionKey).split(":", 3).filter(Boolean);
	const sessionScopeHead = sessionScopeParts[0];
	const sessionChannelHint = normalizeMessageChannel(sessionScopeHead);
	const normalizedSessionScopeHead = (sessionScopeHead ?? "").trim().toLowerCase();
	const sessionPeerShapeCandidates = [sessionScopeParts[1], sessionScopeParts[2]].map((part) => (part ?? "").trim().toLowerCase()).filter(Boolean);
	const isChannelAgnosticSessionScope = CHANNEL_AGNOSTIC_SESSION_SCOPES.has(normalizedSessionScopeHead);
	const isChannelScopedSession = sessionPeerShapeCandidates.some((part) => CHANNEL_SCOPED_SESSION_SHAPES.has(part));
	const hasLegacyChannelPeerShape = !isChannelScopedSession && typeof sessionScopeParts[1] === "string" && sessionChannelHint === routeChannelCandidate;
	const isFromWebchatClient = isWebchatClient(params.client);
	const isFromGatewayCliClient = isGatewayCliClient(params.client);
	const hasClientMetadata = typeof params.client?.mode === "string" && params.client.mode.trim().length > 0 || typeof params.client?.id === "string" && params.client.id.trim().length > 0;
	const configuredMainKey = (params.mainKey ?? "main").trim().toLowerCase();
	const canInheritConfiguredMainRoute = normalizedSessionScopeHead.length > 0 && normalizedSessionScopeHead === configuredMainKey && params.hasConnectedClient && (isFromGatewayCliClient || !hasClientMetadata);
	if (!(Boolean(!isFromWebchatClient && sessionChannelHint && sessionChannelHint !== "webchat" && (!isChannelAgnosticSessionScope && (isChannelScopedSession || hasLegacyChannelPeerShape) || canInheritConfiguredMainRoute)) && routeChannelCandidate && routeChannelCandidate !== "webchat" && typeof routeToCandidate === "string" && routeToCandidate.trim().length > 0)) return {
		originatingChannel: INTERNAL_MESSAGE_CHANNEL,
		explicitDeliverRoute: false
	};
	return {
		originatingChannel: routeChannelCandidate,
		originatingTo: routeToCandidate,
		accountId: routeAccountIdCandidate,
		messageThreadId: routeThreadIdCandidate,
		explicitDeliverRoute: true
	};
}
function isAcpSessionKey(sessionKey) {
	return Boolean(sessionKey?.split(":").includes("acp"));
}
function explicitOriginTargetsAcpSession(origin) {
	if (!origin?.originatingChannel || !origin.originatingTo || !origin.accountId) return false;
	const channel = normalizeMessageChannel(origin.originatingChannel);
	if (!channel || channel === "webchat") return false;
	return isAcpSessionKey(getSessionBindingService().resolveByConversation({
		channel,
		accountId: origin.accountId,
		conversationId: origin.originatingTo
	})?.targetSessionKey);
}
function explicitOriginTargetsPluginBinding(origin) {
	if (!origin?.originatingChannel || !origin.originatingTo || !origin.accountId) return false;
	const channel = normalizeMessageChannel(origin.originatingChannel);
	if (!channel || channel === "webchat") return false;
	return isPluginOwnedSessionBindingRecord(getSessionBindingService().resolveByConversation({
		channel,
		accountId: origin.accountId,
		conversationId: origin.originatingTo
	}));
}
function normalizeOptionalChatSystemReceipt(value) {
	if (value == null) return { ok: true };
	if (typeof value !== "string") return {
		ok: false,
		error: "systemProvenanceReceipt must be a string"
	};
	const sanitized = sanitizeChatSendMessageInput(value);
	if (!sanitized.ok) return sanitized;
	return {
		ok: true,
		receipt: sanitized.message.trim() || void 0
	};
}
function isAcpBridgeClient(client) {
	const info = client?.connect?.client;
	return info?.id === GATEWAY_CLIENT_NAMES.CLI && info?.mode === GATEWAY_CLIENT_MODES.CLI && info?.displayName === "ACP" && info?.version === "acp";
}
function canInjectSystemProvenance(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
async function persistChatSendImages(params) {
	if (params.images.length === 0 && params.offloadedRefs.length === 0 || isAcpBridgeClient(params.client)) return [];
	const inlineSaved = [];
	for (const img of params.images) try {
		inlineSaved.push(await saveMediaBuffer(Buffer.from(img.data, "base64"), img.mimeType, "inbound"));
	} catch (err) {
		params.logGateway.warn(`chat.send: failed to persist inbound image (${img.mimeType}): ${formatForLog(err)}`);
	}
	const imageOffloadedSaved = [];
	const nonImageOffloadedSaved = [];
	for (const ref of params.offloadedRefs) {
		const entry = {
			id: ref.id,
			path: ref.path,
			size: 0,
			contentType: ref.mimeType
		};
		if (ref.mimeType.startsWith("image/")) imageOffloadedSaved.push(entry);
		else nonImageOffloadedSaved.push(entry);
	}
	if (params.imageOrder.length === 0) return [
		...inlineSaved,
		...imageOffloadedSaved,
		...nonImageOffloadedSaved
	];
	const saved = [];
	let inlineIndex = 0;
	let offloadedIndex = 0;
	for (const entry of params.imageOrder) {
		if (entry === "inline") {
			const inline = inlineSaved[inlineIndex++];
			if (inline) saved.push(inline);
			continue;
		}
		const offloaded = imageOffloadedSaved[offloadedIndex++];
		if (offloaded) saved.push(offloaded);
	}
	for (; inlineIndex < inlineSaved.length; inlineIndex++) {
		const inline = inlineSaved[inlineIndex];
		if (inline) saved.push(inline);
	}
	for (; offloadedIndex < imageOffloadedSaved.length; offloadedIndex++) {
		const offloaded = imageOffloadedSaved[offloadedIndex];
		if (offloaded) saved.push(offloaded);
	}
	for (const offloaded of nonImageOffloadedSaved) saved.push(offloaded);
	return saved;
}
function stripTrailingOffloadedMediaMarkers(message, refs) {
	if (refs.length === 0) return message;
	const removableRefs = new Set(refs.map((ref) => ref.mediaRef));
	const lines = message.split(/\r?\n/);
	while (lines.length > 0) {
		const last = lines[lines.length - 1]?.trim() ?? "";
		const match = /^\[media attached:\s*(media:\/\/inbound\/[^\]\s]+)\]$/.exec(last);
		if (!match?.[1] || !removableRefs.delete(match[1])) break;
		lines.pop();
	}
	return lines.join("\n").trimEnd();
}
function isPdfOffloadedRef(ref) {
	const mime = ref.mimeType.trim().toLowerCase();
	if (mime === "application/pdf" || mime.endsWith("+pdf")) return true;
	return path.extname(ref.path.split(/[?#]/u)[0] ?? "").toLowerCase() === ".pdf";
}
function isManagedInboundPdfOffloadRef(ref) {
	if (!isPdfOffloadedRef(ref)) return false;
	try {
		return parseInboundMediaUri(ref.mediaRef) !== null;
	} catch {
		return false;
	}
}
function shouldPassThroughManagedInboundPdfOffloadRef(ref) {
	return ref.sizeBytes > 5242880 && isManagedInboundPdfOffloadRef(ref);
}
async function prestageMediaPathOffloads(params) {
	const mediaPathRefs = params.offloadedRefs.filter((ref) => params.includeImageRefs || !ref.mimeType.startsWith("image/"));
	if (mediaPathRefs.length === 0) return {
		paths: [],
		types: []
	};
	const refsByManagedPath = (refs) => ({
		paths: refs.map((ref) => ref.path),
		types: refs.map((ref) => ref.mimeType)
	});
	const passThroughRefs = [];
	const refsToStage = [];
	for (const ref of mediaPathRefs) (shouldPassThroughManagedInboundPdfOffloadRef(ref) ? passThroughRefs : refsToStage).push(ref);
	if (refsToStage.length === 0) return refsByManagedPath(mediaPathRefs);
	try {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
		const sandbox = await ensureSandboxWorkspaceForSession({
			config: params.cfg,
			sessionKey: params.sessionKey,
			workspaceDir
		});
		if (!sandbox) return refsByManagedPath(mediaPathRefs);
		const oversizedForSandbox = refsToStage.filter((ref) => ref.sizeBytes > MEDIA_MAX_BYTES);
		if (oversizedForSandbox.length > 0) throw new UnsupportedAttachmentError("non-image-too-large-for-sandbox", `attachments exceed sandbox staging limit (${MEDIA_MAX_BYTES} bytes): ${oversizedForSandbox.map((ref) => `${ref.label} (${ref.sizeBytes} bytes)`).join(", ")}`);
		const stagingCtx = {
			MediaPath: refsToStage[0].path,
			MediaPaths: refsToStage.map((ref) => ref.path),
			MediaType: refsToStage[0].mimeType,
			MediaTypes: refsToStage.map((ref) => ref.mimeType)
		};
		let stageResult;
		try {
			stageResult = await stageSandboxMedia({
				ctx: stagingCtx,
				sessionCtx: stagingCtx,
				cfg: params.cfg,
				sessionKey: params.sessionKey,
				workspaceDir
			});
		} catch (stageErr) {
			if (refsToStage.some((ref) => !isManagedInboundPdfOffloadRef(ref))) throw stageErr;
			return refsByManagedPath(mediaPathRefs);
		}
		const stagedSources = stageResult.staged;
		const unstageable = refsToStage.filter((ref) => !stagedSources.has(ref.path)).filter((ref) => !isManagedInboundPdfOffloadRef(ref));
		if (unstageable.length > 0) throw new Error(`attachment staging incomplete: ${stagedSources.size}/${refsToStage.length} paths staged into sandbox workspace (missing: ${unstageable.map((ref) => ref.path).join(", ")})`);
		const stagedPaths = stagingCtx.MediaPaths ?? [];
		const stagedTypes = stagingCtx.MediaTypes ?? refsToStage.map((ref) => ref.mimeType);
		const resolvedByRef = /* @__PURE__ */ new Map();
		refsToStage.forEach((ref, index) => {
			resolvedByRef.set(ref, {
				path: stagedPaths[index] ?? ref.path,
				mimeType: stagedTypes[index] ?? ref.mimeType
			});
		});
		for (const ref of passThroughRefs) resolvedByRef.set(ref, {
			path: ref.path,
			mimeType: ref.mimeType
		});
		const ordered = mediaPathRefs.map((ref) => resolvedByRef.get(ref) ?? {
			path: ref.path,
			mimeType: ref.mimeType
		});
		return {
			paths: ordered.map((entry) => entry.path),
			types: ordered.map((entry) => entry.mimeType),
			workspaceDir: sandbox.workspaceDir
		};
	} catch (err) {
		await Promise.allSettled(params.offloadedRefs.map((ref) => deleteMediaBuffer(ref.id, "inbound")));
		if (err instanceof MediaOffloadError) throw err;
		if (err instanceof UnsupportedAttachmentError) throw err;
		throw new MediaOffloadError(`[Gateway Error] Failed to stage attachments into agent workspace: ${formatErrorMessage(err)}`, { cause: err });
	}
}
function resolveChatSendManagedMediaFields(savedImages) {
	const mediaPaths = savedImages.map((entry) => entry.path);
	if (mediaPaths.length === 0) return {};
	const mediaTypes = savedImages.map((entry) => entry.contentType ?? "application/octet-stream");
	return {
		MediaPath: mediaPaths[0],
		MediaPaths: mediaPaths,
		MediaType: mediaTypes[0],
		MediaTypes: mediaTypes
	};
}
function applyChatSendManagedMediaFields(ctx, fields) {
	if (!ctx.MediaStaged) {
		Object.assign(ctx, fields);
		return;
	}
	if (ctx.MediaPath === void 0 && fields.MediaPath !== void 0) ctx.MediaPath = fields.MediaPath;
	if (ctx.MediaPaths === void 0 && fields.MediaPaths !== void 0) ctx.MediaPaths = fields.MediaPaths;
	if (ctx.MediaType === void 0 && fields.MediaType !== void 0) ctx.MediaType = fields.MediaType;
	if (ctx.MediaTypes === void 0 && fields.MediaTypes !== void 0) ctx.MediaTypes = fields.MediaTypes;
}
function buildChatSendUserTurnMedia(savedMedia) {
	return savedMedia.map((entry) => ({
		path: entry.path,
		contentType: entry.contentType
	}));
}
function buildOversizedHistoryPlaceholder(message) {
	const role = message && typeof message === "object" && typeof message.role === "string" ? message.role : "assistant";
	const timestamp = message && typeof message === "object" && typeof message.timestamp === "number" ? message.timestamp : Date.now();
	const rawMetadata = message && typeof message === "object" ? message["__openclaw"] : void 0;
	const metadata = rawMetadata && typeof rawMetadata === "object" && !Array.isArray(rawMetadata) ? rawMetadata : {};
	const metadataId = typeof metadata.id === "string" ? metadata.id : void 0;
	const metadataSeq = typeof metadata.seq === "number" ? metadata.seq : void 0;
	return {
		role,
		timestamp,
		content: [{
			type: "text",
			text: CHAT_HISTORY_OVERSIZED_PLACEHOLDER
		}],
		__openclaw: {
			...metadataId ? { id: metadataId } : {},
			...metadataSeq !== void 0 ? { seq: metadataSeq } : {},
			truncated: true,
			reason: "oversized"
		}
	};
}
function replaceOversizedChatHistoryMessages(params) {
	const { messages, maxSingleMessageBytes } = params;
	if (messages.length === 0) return {
		messages,
		replacedCount: 0
	};
	let replacedCount = 0;
	const next = messages.map((message) => {
		if (jsonUtf8Bytes(message) <= maxSingleMessageBytes) return message;
		replacedCount += 1;
		return buildOversizedHistoryPlaceholder(message);
	});
	return {
		messages: replacedCount > 0 ? next : messages,
		replacedCount
	};
}
function enforceChatHistoryFinalBudget(params) {
	const { messages, maxBytes } = params;
	if (messages.length === 0) return {
		messages,
		placeholderCount: 0
	};
	if (jsonUtf8Bytes(messages) <= maxBytes) return {
		messages,
		placeholderCount: 0
	};
	const last = messages.at(-1);
	if (last && jsonUtf8Bytes([last]) <= maxBytes) return {
		messages: [last],
		placeholderCount: 0
	};
	const placeholder = buildOversizedHistoryPlaceholder(last);
	if (jsonUtf8Bytes([placeholder]) <= maxBytes) return {
		messages: [placeholder],
		placeholderCount: 1
	};
	return {
		messages: [buildChatHistoryUnavailableSentinel()],
		placeholderCount: 1
	};
}
function resolveTranscriptPath(params) {
	const { sessionId, storePath, sessionFile, agentId } = params;
	if (!storePath && !sessionFile) return null;
	try {
		const sessionsDir = storePath ? path.dirname(storePath) : void 0;
		return resolveSessionFilePath(sessionId, sessionFile ? { sessionFile } : void 0, sessionsDir || agentId ? {
			sessionsDir,
			agentId
		} : void 0);
	} catch {
		return null;
	}
}
function ensureTranscriptFile(params) {
	if (fs.existsSync(params.transcriptPath)) return { ok: true };
	try {
		fs.mkdirSync(path.dirname(params.transcriptPath), { recursive: true });
		const header = {
			type: "session",
			version: 3,
			id: params.sessionId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			cwd: process.cwd()
		};
		fs.writeFileSync(params.transcriptPath, `${JSON.stringify(header)}\n`, {
			encoding: "utf-8",
			mode: 384
		});
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : String(err)
		};
	}
}
async function findAssistantTranscriptMessageByIdempotencyKey(transcriptPath, idempotencyKey) {
	const trimmedIdempotencyKey = idempotencyKey.trim();
	if (!trimmedIdempotencyKey) return null;
	const target = (await readSessionTranscriptIndex(transcriptPath, { view: "all" }))?.entries.toReversed().find((entry) => {
		const message = entry.record.message;
		return message?.role === "assistant" && message.idempotencyKey === trimmedIdempotencyKey;
	});
	const message = target?.record.message;
	if (!target || !message) return null;
	return {
		messageId: target.id ?? trimmedIdempotencyKey,
		message
	};
}
async function findSourceReplyTranscriptMirrorByIdempotencyKey(transcriptPath, idempotencyKey) {
	const found = await findAssistantTranscriptMessageByIdempotencyKey(transcriptPath, idempotencyKey);
	if (found?.message.provider !== "openclaw" || found.message.model !== "delivery-mirror") return null;
	return found;
}
function extractAssistantTranscriptText(message) {
	const content = message.content;
	if (!Array.isArray(content)) return;
	return content.map((block) => block && typeof block === "object" && block.type === "text" && typeof block.text === "string" ? block.text.trim() ?? "" : "").filter(Boolean).join("\n").trim() || void 0;
}
async function findSourceReplyTranscriptMirrorByMetadata(params) {
	const byIdempotencyKey = await findSourceReplyTranscriptMirrorByIdempotencyKey(params.transcriptPath, params.idempotencyKey);
	if (byIdempotencyKey) return byIdempotencyKey;
	const expectedText = resolveMirroredTranscriptText({
		text: params.metadata?.text,
		mediaUrls: params.metadata?.mediaUrls
	});
	if (!expectedText) return null;
	const target = (await readSessionTranscriptIndex(params.transcriptPath, { view: "all" }))?.entries.toReversed().find((entry) => {
		const message = entry.record.message;
		return typeof entry.id === "string" && entry.id.trim().length > 0 && message?.role === "assistant" && message.provider === "openclaw" && message.model === "delivery-mirror" && extractAssistantTranscriptText(message) === expectedText;
	});
	const message = target?.record.message;
	if (!target?.id || !message) return null;
	return {
		messageId: target.id,
		message
	};
}
async function appendAssistantTranscriptMessage(params) {
	const transcriptPath = resolveTranscriptPath({
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		agentId: params.agentId
	});
	if (!transcriptPath) return {
		ok: false,
		error: "transcript path not resolved"
	};
	if (!fs.existsSync(transcriptPath)) {
		if (!params.createIfMissing) return {
			ok: false,
			error: "transcript file not found"
		};
		const ensured = ensureTranscriptFile({
			transcriptPath,
			sessionId: params.sessionId
		});
		if (!ensured.ok) return {
			ok: false,
			error: ensured.error ?? "failed to create transcript file"
		};
	}
	if (params.idempotencyKey) {
		const existing = await findAssistantTranscriptMessageByIdempotencyKey(transcriptPath, params.idempotencyKey);
		if (existing) return {
			ok: true,
			messageId: existing.messageId,
			message: existing.message
		};
	}
	const appended = await appendInjectedAssistantMessageToTranscript({
		transcriptPath,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		message: params.message,
		label: params.label,
		content: params.content,
		idempotencyKey: params.idempotencyKey,
		abortMeta: params.abortMeta,
		ttsSupplement: params.ttsSupplement,
		config: params.cfg
	});
	if (appended.ok) await advanceSessionTranscriptMarker({
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	});
	return appended;
}
async function advanceSessionTranscriptMarker(params) {
	if (!params.storePath) return;
	const transcriptMarkerUpdatedAt = Date.now();
	await updateSessionStoreEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		update: (current) => current.sessionId === params.sessionId ? { updatedAt: transcriptMarkerUpdatedAt } : null
	});
}
function collectSessionAbortPartials(params) {
	const out = [];
	for (const [runId, active] of params.chatAbortControllers) {
		if (!params.runIds.has(runId)) continue;
		const text = params.chatRunBuffers.get(runId);
		if (!text || !text.trim()) continue;
		out.push({
			runId,
			sessionId: active.sessionId,
			agentId: active.agentId,
			text,
			abortOrigin: params.abortOrigin
		});
	}
	return out;
}
async function persistAbortedPartials(params) {
	if (params.snapshots.length === 0) return;
	for (const snapshot of params.snapshots) {
		const sessionLoadOptions = params.sessionKey === "global" && snapshot.agentId ? { agentId: snapshot.agentId } : void 0;
		const { cfg, storePath, entry } = loadSessionEntry(params.sessionKey, sessionLoadOptions);
		const sessionId = entry?.sessionId ?? snapshot.sessionId ?? snapshot.runId;
		const appended = await appendAssistantTranscriptMessage({
			sessionKey: params.sessionKey,
			message: snapshot.text,
			sessionId,
			storePath,
			sessionFile: entry?.sessionFile,
			...snapshot.agentId ? { agentId: snapshot.agentId } : {},
			createIfMissing: true,
			idempotencyKey: `${snapshot.runId}:assistant`,
			cfg,
			abortMeta: {
				aborted: true,
				origin: snapshot.abortOrigin,
				runId: snapshot.runId
			}
		});
		if (!appended.ok) params.context.logGateway.warn(`chat.abort transcript append failed: ${appended.error ?? "unknown error"}`);
	}
}
function createChatAbortOps(context) {
	return {
		chatAbortControllers: context.chatAbortControllers,
		chatRunBuffers: context.chatRunBuffers,
		chatAbortedRuns: context.chatAbortedRuns,
		clearChatRunState: context.clearChatRunState,
		removeChatRun: context.removeChatRun,
		agentRunSeq: context.agentRunSeq,
		getRuntimeConfig: context.getRuntimeConfig,
		broadcast: context.broadcast,
		nodeSendToSession: context.nodeSendToSession
	};
}
function normalizeOptionalText(value) {
	return value?.trim() || void 0;
}
function normalizeExplicitChatSendOrigin(params) {
	const originatingChannel = normalizeOptionalText(params.originatingChannel);
	const originatingTo = normalizeOptionalText(params.originatingTo);
	const accountId = normalizeOptionalText(params.accountId);
	const messageThreadId = normalizeOptionalText(params.messageThreadId);
	if (!Boolean(originatingChannel || originatingTo || accountId || messageThreadId)) return { ok: true };
	const normalizedChannel = normalizeMessageChannel(originatingChannel);
	if (!normalizedChannel) return {
		ok: false,
		error: "originatingChannel is required when using originating route fields"
	};
	if (!originatingTo) return {
		ok: false,
		error: "originatingTo is required when using originating route fields"
	};
	return {
		ok: true,
		value: {
			originatingChannel: normalizedChannel,
			originatingTo,
			...accountId ? { accountId } : {},
			...messageThreadId ? { messageThreadId } : {}
		}
	};
}
function resolveChatAbortRequester(client) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	return {
		connId: normalizeOptionalText(client?.connId),
		deviceId: normalizeOptionalText(client?.connect?.device?.id),
		isAdmin: scopes.includes(ADMIN_SCOPE)
	};
}
function canRequesterAbortChatRun(entry, requester) {
	if (requester.isAdmin) return true;
	const ownerDeviceId = normalizeOptionalText(entry.ownerDeviceId);
	const ownerConnId = normalizeOptionalText(entry.ownerConnId);
	if (!ownerDeviceId && !ownerConnId) return true;
	if (ownerDeviceId && requester.deviceId && ownerDeviceId === requester.deviceId) return true;
	if (ownerConnId && requester.connId && ownerConnId === requester.connId) return true;
	return false;
}
function canRequesterAbortChatRunWithoutSessionMatch(entry, requester) {
	if (requester.isAdmin) return true;
	const ownerDeviceId = normalizeOptionalText(entry.ownerDeviceId);
	const ownerConnId = normalizeOptionalText(entry.ownerConnId);
	return Boolean(ownerDeviceId && requester.deviceId && ownerDeviceId === requester.deviceId || ownerConnId && requester.connId && ownerConnId === requester.connId);
}
function readPreRegisteredAgentDedupePayloadForSession(params) {
	if (!params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	if (!params.includeHidden && payload.controlUiVisible === false) return;
	const payloadRunId = normalizeUnknownText(payload.runId);
	if (payloadRunId && payloadRunId !== params.runId) return;
	if (normalizeUnknownText(payload.sessionKey) !== params.sessionKey) return;
	const agentId = normalizeOptionalText(params.agentId)?.toLowerCase();
	if (agentId) {
		const parsed = parseAgentSessionKey(params.sessionKey);
		const sessionAgentId = params.sessionKey === "global" ? resolveStoredGlobalRunAgentId(normalizeUnknownText(payload.agentId), params.defaultAgentId) : parsed?.agentId ? normalizeAgentId(parsed.agentId) : void 0;
		if (sessionAgentId && sessionAgentId !== agentId) return;
	}
	return payload;
}
function readPreRegisteredAgentRun(params) {
	if (!params.key.startsWith("agent:") || !params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	if (payload.controlUiVisible === false) return;
	const runId = normalizeUnknownText(payload.runId) ?? normalizeOptionalText(params.key.slice(6));
	const sessionKey = normalizeUnknownText(payload.sessionKey);
	if (!runId || !sessionKey) return;
	return {
		runId,
		sessionKey,
		payload
	};
}
function canRequesterAbortPreRegisteredAgentRun(payload, requester) {
	return canRequesterAbortChatRun({
		controller: new AbortController(),
		sessionId: "",
		sessionKey: normalizeUnknownText(payload.sessionKey) ?? "",
		startedAtMs: 0,
		expiresAtMs: 0,
		ownerConnId: normalizeUnknownText(payload.ownerConnId),
		ownerDeviceId: normalizeUnknownText(payload.ownerDeviceId),
		controlUiVisible: payload.controlUiVisible === false ? false : void 0,
		kind: "agent"
	}, requester);
}
function resolvePreRegisteredAgentDedupeKeys(payload, runId) {
	const keys = [`agent:${runId}`];
	const payloadKeys = Array.isArray(payload.dedupeKeys) ? payload.dedupeKeys : [];
	for (const key of payloadKeys) {
		const normalized = normalizeUnknownText(key);
		if (normalized?.startsWith("agent:")) keys.push(normalized);
	}
	return uniqueStrings(keys);
}
function resolveStoredGlobalRunAgentId(agentId, defaultAgentId) {
	return normalizeOptionalText(agentId)?.toLowerCase() ?? defaultAgentId.toLowerCase();
}
function writePreRegisteredAgentAbort(params) {
	const endedAt = params.endedAt ?? Date.now();
	const payloadAgentId = normalizeUnknownText(params.payload.agentId);
	for (const key of resolvePreRegisteredAgentDedupeKeys(params.payload, params.runId)) setGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		key,
		entry: {
			ts: endedAt,
			ok: true,
			payload: {
				runId: params.runId,
				sessionKey: params.sessionKey,
				...payloadAgentId ? { agentId: payloadAgentId } : {},
				...params.payload.controlUiVisible === false ? { controlUiVisible: false } : {},
				status: "timeout",
				summary: "aborted",
				stopReason: params.stopReason,
				endedAt
			}
		}
	});
}
function resolveAuthorizedPreRegisteredAgentRunsForSessionKeys(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => normalizeOptionalText(sessionKey)).filter((sessionKey) => Boolean(sessionKey)));
	const authorizedByRunId = /* @__PURE__ */ new Map();
	let matchedSessionRuns = 0;
	for (const [key, entry] of params.context.dedupe) {
		const run = readPreRegisteredAgentRun({
			key,
			entry
		});
		if (!run || !sessionKeys.has(run.sessionKey)) continue;
		if (params.context.chatAbortControllers.has(run.runId)) continue;
		const agentId = normalizeOptionalText(params.agentId)?.toLowerCase();
		if (agentId && run.sessionKey === "global" && resolveStoredGlobalRunAgentId(normalizeUnknownText(run.payload.agentId), params.defaultAgentId) !== agentId) continue;
		matchedSessionRuns += 1;
		if (canRequesterAbortPreRegisteredAgentRun(run.payload, params.requester)) authorizedByRunId.set(run.runId, run);
	}
	return {
		matchedSessionRuns,
		authorizedRuns: [...authorizedByRunId.values()]
	};
}
function resolveAuthorizedRunsForSessionKeys(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => normalizeOptionalText(sessionKey)).filter((sessionKey) => Boolean(sessionKey)));
	const sessionIds = new Set(Array.from(params.sessionIds ?? [], (sessionId) => normalizeOptionalText(sessionId)).filter((sessionId) => Boolean(sessionId)));
	const agentId = normalizeOptionalText(params.agentId)?.toLowerCase();
	const authorizedRuns = [];
	let matchedSessionRuns = 0;
	for (const [runId, active] of params.chatAbortControllers) {
		if (active.controlUiVisible === false) continue;
		if (!sessionKeys.has(active.sessionKey) && !sessionIds.has(active.sessionId)) continue;
		if (agentId && active.sessionKey === "global" && resolveStoredGlobalRunAgentId(active.agentId, params.defaultAgentId) !== agentId) continue;
		matchedSessionRuns += 1;
		if (canRequesterAbortChatRun(active, params.requester)) authorizedRuns.push({
			runId,
			sessionKey: active.sessionKey
		});
	}
	return {
		matchedSessionRuns,
		authorizedRuns
	};
}
async function abortChatRunsForSessionKeyWithPartials(params) {
	const sessionKeys = [params.sessionKey, ...params.sessionKeyAliases ?? []];
	const { matchedSessionRuns, authorizedRuns } = resolveAuthorizedRunsForSessionKeys({
		chatAbortControllers: params.context.chatAbortControllers,
		sessionKeys,
		sessionIds: [params.sessionId],
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester
	});
	const { matchedSessionRuns: matchedPendingAgentRuns, authorizedRuns: authorizedPendingAgentRuns } = resolveAuthorizedPreRegisteredAgentRunsForSessionKeys({
		context: params.context,
		sessionKeys,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester
	});
	if (authorizedRuns.length === 0 && authorizedPendingAgentRuns.length === 0) return {
		aborted: false,
		runIds: [],
		unauthorized: matchedSessionRuns > 0 || matchedPendingAgentRuns > 0
	};
	const authorizedRunIdSet = new Set(authorizedRuns.map((run) => run.runId));
	const snapshots = collectSessionAbortPartials({
		chatAbortControllers: params.context.chatAbortControllers,
		chatRunBuffers: params.context.chatRunBuffers,
		runIds: authorizedRunIdSet,
		abortOrigin: params.abortOrigin
	});
	const runIds = [];
	for (const { runId, sessionKey } of authorizedRuns) if (abortChatRunById(params.ops, {
		runId,
		sessionKey,
		stopReason: params.stopReason
	}).aborted) runIds.push(runId);
	const endedAt = Date.now();
	const stopReason = params.stopReason ?? "rpc";
	for (const { runId, sessionKey, payload } of authorizedPendingAgentRuns) {
		writePreRegisteredAgentAbort({
			context: params.context,
			runId,
			sessionKey,
			payload,
			stopReason,
			endedAt
		});
		runIds.push(runId);
	}
	const res = {
		aborted: runIds.length > 0,
		runIds,
		unauthorized: false
	};
	if (res.aborted) await persistAbortedPartials({
		context: params.context,
		sessionKey: params.persistSessionKey ?? params.sessionKey,
		snapshots
	});
	return res;
}
function nextChatSeq(context, runId) {
	const next = (context.agentRunSeq.get(runId) ?? 0) + 1;
	context.agentRunSeq.set(runId, next);
	return next;
}
function broadcastChatFinal(params) {
	const seq = nextChatSeq({ agentRunSeq: params.context.agentRunSeq }, params.runId);
	const payloadAgentId = params.sessionKey === "global" ? params.agentId : void 0;
	const payload = {
		runId: params.runId,
		sessionKey: params.sessionKey,
		...payloadAgentId ? { agentId: payloadAgentId } : {},
		seq,
		state: "final",
		message: projectChatDisplayMessage(params.message)
	};
	params.context.broadcast("chat", payload);
	sendGlobalAwareNodeChatPayload({
		context: params.context,
		sessionKey: params.sessionKey,
		agentId: payloadAgentId,
		event: "chat",
		payload
	});
	params.context.agentRunSeq.delete(params.runId);
}
function isBtwReplyPayload(payload) {
	return typeof payload?.btw?.question === "string" && payload.btw.question.trim().length > 0 && typeof payload.text === "string" && payload.text.trim().length > 0;
}
function broadcastSideResult(params) {
	const seq = nextChatSeq({ agentRunSeq: params.context.agentRunSeq }, params.payload.runId);
	const payloadAgentId = params.payload.sessionKey === "global" ? params.payload.agentId : void 0;
	const payload = {
		...params.payload,
		...payloadAgentId ? { agentId: payloadAgentId } : {},
		seq
	};
	params.context.broadcast("chat.side_result", payload);
	sendGlobalAwareNodeChatPayload({
		context: params.context,
		sessionKey: params.payload.sessionKey,
		agentId: payloadAgentId,
		event: "chat.side_result",
		payload
	});
}
function broadcastChatError(params) {
	const seq = nextChatSeq({ agentRunSeq: params.context.agentRunSeq }, params.runId);
	const payloadAgentId = params.sessionKey === "global" ? params.agentId : void 0;
	const errorText = params.errorMessage?.trim();
	const payload = {
		runId: params.runId,
		sessionKey: params.sessionKey,
		...payloadAgentId ? { agentId: payloadAgentId } : {},
		seq,
		state: "error",
		errorMessage: params.errorMessage,
		...errorText ? { message: {
			role: "assistant",
			content: [{
				type: "text",
				text: errorText.startsWith("⚠️") || errorText.startsWith("Error:") ? errorText : `Error: ${errorText}`
			}],
			timestamp: Date.now()
		} } : {}
	};
	params.context.broadcast("chat", payload);
	sendGlobalAwareNodeChatPayload({
		context: params.context,
		sessionKey: params.sessionKey,
		agentId: payloadAgentId,
		event: "chat",
		payload
	});
	params.context.agentRunSeq.delete(params.runId);
}
function sendGlobalAwareNodeChatPayload(params) {
	const deliveryKeys = resolveGlobalAwareNodeChatDeliveryKeys({
		cfg: params.context.getRuntimeConfig?.() ?? {},
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	for (const deliveryKey of deliveryKeys) params.context.nodeSendToSession(deliveryKey, params.event, params.payload);
}
function resolveGlobalAwareNodeChatDeliveryKeys(params) {
	if (params.sessionKey !== "global") return [params.sessionKey];
	const defaultAgentId = resolveDefaultAgentId(params.cfg);
	const scopedAgentId = params.agentId ?? defaultAgentId;
	const keys = [`agent:${scopedAgentId}:global`];
	if (scopedAgentId === defaultAgentId) keys.push("global");
	return keys;
}
function isSourceReplyTranscriptMirrorPayload(payload) {
	return Boolean(payload && getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror);
}
function readChatHistoryMessageId(message) {
	const metadata = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return typeof metadata?.id === "string" ? metadata.id : void 0;
}
async function isChatMessageIdVisibleAfterHistoryFilters(params) {
	if (params.sessionStartedAt === void 0) return true;
	return dropPreSessionStartAnnouncePairs(await readSessionMessagesAsync({
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, {
		mode: "full",
		reason: "chat.message.get visibility",
		...params.allowResetArchiveFallback === true ? { allowResetArchiveFallback: true } : {}
	}), params.sessionStartedAt).some((message) => readChatHistoryMessageId(message) === params.messageId);
}
function dropLocalHistoryOverreadContextMessage(messages, contextMessage) {
	if (contextMessage === void 0) return messages;
	const index = messages.indexOf(contextMessage);
	if (index < 0) return messages;
	return [...messages.slice(0, index), ...messages.slice(index + 1)];
}
async function handleChatHistoryRequest({ params, respond, context, method, includeAgentsList, includeMetadata }) {
	if (!validateChatHistoryParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(validateChatHistoryParams.errors)}`));
		return;
	}
	const { sessionKey, limit, maxChars } = params;
	const agentIdOverride = normalizeOptionalText(params.agentId);
	const requestedAgentId = resolveRequestedChatAgentId({
		cfg: context.getRuntimeConfig?.(),
		requestedSessionKey: sessionKey,
		agentId: agentIdOverride
	});
	const { cfg, storePath, store, entry, canonicalKey } = loadSessionEntry(sessionKey, requestedAgentId ? { agentId: requestedAgentId } : void 0);
	const selectedAgent = validateChatSelectedAgent({
		cfg,
		requestedSessionKey: sessionKey,
		agentId: requestedAgentId
	});
	if (!selectedAgent.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
		return;
	}
	const startupModelCatalogLoad = method === "chat.startup" ? startOptionalServerMethodModelCatalogLoad(context) : void 0;
	const modelCatalogPromise = measureDiagnosticsTimelineSpan(`gateway.${method}.model_catalog`, () => startupModelCatalogLoad ? loadOptionalServerMethodModelCatalog(context, method, {
		logOnceKey: "chat.startup",
		startedLoad: startupModelCatalogLoad,
		timeoutMs: CHAT_STARTUP_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS
	}) : loadOptionalServerMethodModelCatalog(context, method), {
		config: cfg,
		phase: method
	});
	if (startupModelCatalogLoad) modelCatalogPromise.catch(() => void 0);
	const sessionId = entry?.sessionId;
	const sessionAgentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		agentId: selectedAgent.agentId
	});
	const resolvedSessionModel = resolveSessionModelRef(cfg, entry, sessionAgentId);
	const max = Math.min(1e3, typeof limit === "number" ? limit : 200);
	const maxHistoryBytes = getMaxChatHistoryMessagesBytes();
	const rawHistoryWindow = resolveSessionHistoryTailReadOptions(max);
	const localHistoryReadOptions = {
		maxMessages: rawHistoryWindow.maxMessages + 1,
		maxLines: rawHistoryWindow.maxLines + 1
	};
	const localMessages = sessionId && storePath ? await readRecentSessionMessagesAsync({
		agentId: sessionAgentId,
		sessionEntry: entry,
		sessionId,
		sessionKey: canonicalKey,
		storePath
	}, {
		...localHistoryReadOptions,
		maxBytes: Math.max(maxHistoryBytes * 2, 1024 * 1024),
		allowResetArchiveFallback: true
	}) : [];
	const overreadContextMessage = localMessages.length > rawHistoryWindow.maxMessages ? localMessages[0] : void 0;
	const localMessagesWithBoundaryFilter = dropLocalHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(localMessages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
	const normalized = augmentChatHistoryWithCanvasBlocks(projectRecentChatDisplayMessages(dropPreSessionStartAnnouncePairs(augmentChatHistoryWithCliSessionImports({
		entry,
		provider: resolvedSessionModel.provider,
		localMessages: localMessagesWithBoundaryFilter
	}), typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), {
		maxChars: resolveEffectiveChatHistoryMaxChars(cfg, maxChars),
		maxMessages: max
	}));
	const replaced = replaceOversizedChatHistoryMessages({
		messages: normalized,
		maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, maxHistoryBytes)
	});
	scheduleChatHistoryManagedImageCleanup({
		sessionKey,
		...selectedAgent.agentId ? { agentId: selectedAgent.agentId } : {},
		context
	});
	const capped = capArrayByJsonBytes(replaced.messages, maxHistoryBytes).items;
	const bounded = enforceChatHistoryFinalBudget({
		messages: capped,
		maxBytes: maxHistoryBytes
	});
	const placeholderCount = replaced.replacedCount + bounded.placeholderCount;
	if (placeholderCount > 0) {
		chatHistoryPlaceholderEmitCount += placeholderCount;
		logLargePayload({
			surface: "gateway.chat.history",
			action: "truncated",
			bytes: jsonUtf8Bytes(normalized),
			limitBytes: maxHistoryBytes,
			count: placeholderCount,
			reason: "chat_history_budget"
		});
		context.logGateway.debug(`chat.history omitted oversized payloads placeholders=${placeholderCount} total=${chatHistoryPlaceholderEmitCount}`);
	}
	const modelCatalog = await modelCatalogPromise;
	const defaultAgentId = resolveDefaultAgentId(cfg);
	const startupMetadata = includeMetadata ? await buildChatStartupMetadataResult({
		cfg,
		context,
		agentId: sessionAgentId,
		modelCatalog
	}) : void 0;
	const sessionInfo = buildGatewaySessionInfo({
		cfg,
		storePath,
		store,
		key: canonicalKey,
		entry,
		agentId: selectedAgent.agentId,
		modelCatalog
	});
	const activeRunAgentId = canonicalKey === "global" ? selectedAgent.agentId ?? defaultAgentId : selectedAgent.agentId;
	sessionInfo.hasActiveRun = hasTrackedActiveSessionRun({
		context,
		requestedKey: sessionKey,
		canonicalKey,
		...activeRunAgentId ? { agentId: activeRunAgentId } : {},
		defaultAgentId
	});
	const defaults = getSessionDefaults(cfg, modelCatalog, { allowPluginNormalization: false });
	const thinkingLevel = sessionInfo.thinkingLevel ?? sessionInfo.thinkingDefault;
	const verboseLevel = entry?.verboseLevel ?? cfg.agents?.defaults?.verboseDefault;
	sessionInfo.verboseLevel = verboseLevel;
	const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
		snapshot: resolveInFlightRunSnapshot({
			chatAbortControllers: context.chatAbortControllers,
			chatRunBuffers: context.chatRunBuffers,
			requestedSessionKey: sessionKey,
			canonicalSessionKey: resolveSessionStoreKey({
				cfg,
				sessionKey
			}),
			agentId: activeRunAgentId,
			defaultAgentId
		}),
		messages: bounded.messages,
		maxBytes: maxHistoryBytes
	});
	respond(true, {
		sessionKey,
		sessionId,
		messages: bounded.messages,
		defaults,
		sessionInfo,
		thinkingLevel,
		fastMode: entry?.fastMode,
		verboseLevel,
		...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
		...includeAgentsList ? { agentsList: listAgentsForGateway(cfg, modelCatalog) } : {},
		...startupMetadata ? { metadata: startupMetadata } : {}
	});
}
const chatHandlers = {
	"chat.history": async (opts) => {
		await handleChatHistoryRequest({
			...opts,
			method: "chat.history"
		});
	},
	"chat.startup": async (opts) => {
		await handleChatHistoryRequest({
			...opts,
			method: "chat.startup",
			includeAgentsList: true,
			includeMetadata: true
		});
	},
	"chat.metadata": handleChatMetadataRequest,
	"chat.message.get": async ({ params, respond, context }) => {
		if (!validateChatMessageGetParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid chat.message.get params: ${formatValidationErrors(validateChatMessageGetParams.errors)}`));
			return;
		}
		const { sessionKey, messageId, maxChars } = params;
		const agentIdOverride = normalizeOptionalText(params.agentId);
		const requestedAgentId = resolveRequestedChatAgentId({
			cfg: context.getRuntimeConfig?.(),
			requestedSessionKey: sessionKey,
			agentId: agentIdOverride
		});
		const { cfg, storePath, entry } = loadSessionEntry(sessionKey, requestedAgentId ? { agentId: requestedAgentId } : void 0);
		const selectedAgent = validateChatSelectedAgent({
			cfg,
			requestedSessionKey: sessionKey,
			agentId: requestedAgentId
		});
		if (!selectedAgent.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
			return;
		}
		const sessionId = entry?.sessionId;
		if (!sessionId) {
			respond(true, {
				ok: false,
				unavailableReason: "not_found"
			});
			return;
		}
		const sessionAgentId = resolveSessionAgentId({
			sessionKey,
			config: cfg,
			agentId: selectedAgent.agentId
		});
		const resolved = await readSessionMessageByIdAsync({
			agentId: sessionAgentId,
			sessionEntry: entry,
			sessionId,
			sessionKey,
			storePath
		}, messageId, { allowResetArchiveFallback: true });
		if (!resolved.found) {
			respond(true, {
				ok: false,
				unavailableReason: "not_found"
			});
			return;
		}
		if (!await isChatMessageIdVisibleAfterHistoryFilters({
			sessionId,
			storePath,
			sessionEntry: entry,
			sessionKey,
			agentId: sessionAgentId,
			messageId,
			sessionStartedAt: typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0,
			allowResetArchiveFallback: true
		})) {
			respond(true, {
				ok: false,
				unavailableReason: "not_found"
			});
			return;
		}
		if (resolved.oversized) {
			respond(true, {
				ok: false,
				unavailableReason: "oversized"
			});
			return;
		}
		const effectiveMaxChars = typeof maxChars === "number" ? maxChars : Math.min(MAX_PAYLOAD_BYTES, 1e6);
		const projectedMessage = resolved.message ? projectChatDisplayMessage(resolved.message, { maxChars: effectiveMaxChars }) : void 0;
		const projected = projectedMessage ? augmentChatHistoryWithCanvasBlocks([projectedMessage])[0] : void 0;
		if (!projected) {
			respond(true, {
				ok: false,
				unavailableReason: "not_visible"
			});
			return;
		}
		respond(true, {
			ok: true,
			message: projected
		});
	},
	"chat.abort": async ({ params, respond, context, client }) => {
		if (!validateChatAbortParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid chat.abort params: ${formatValidationErrors(validateChatAbortParams.errors)}`));
			return;
		}
		const { sessionKey: rawSessionKey, runId } = params;
		const agentIdOverride = normalizeOptionalText(params.agentId);
		const abortCfg = context.getRuntimeConfig();
		const defaultAgentId = resolveDefaultAgentId(abortCfg);
		const parsedAbortSessionKey = parseAgentSessionKey(rawSessionKey);
		const abortSessionResolvesGlobal = resolveSessionStoreKey({
			cfg: abortCfg,
			sessionKey: rawSessionKey
		}) === "global";
		const inferredGlobalAgentId = !agentIdOverride && parsedAbortSessionKey && abortSessionResolvesGlobal ? normalizeAgentId(parsedAbortSessionKey.agentId) : void 0;
		const abortAgentId = agentIdOverride ?? inferredGlobalAgentId ?? (abortSessionResolvesGlobal ? defaultAgentId : void 0);
		if (agentIdOverride && parsedAbortSessionKey && normalizeAgentId(parsedAbortSessionKey.agentId) !== normalizeAgentId(agentIdOverride)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agentId "${agentIdOverride}" does not match session key "${rawSessionKey}"`));
			return;
		}
		const canonicalAbortSessionKey = abortAgentId && abortSessionResolvesGlobal ? "global" : rawSessionKey;
		const ops = createChatAbortOps(context);
		const requester = resolveChatAbortRequester(client);
		if (!runId) {
			const res = await abortChatRunsForSessionKeyWithPartials({
				context,
				ops,
				sessionKey: canonicalAbortSessionKey,
				sessionKeyAliases: canonicalAbortSessionKey === rawSessionKey ? void 0 : [rawSessionKey],
				agentId: abortAgentId,
				defaultAgentId,
				abortOrigin: "rpc",
				stopReason: "rpc",
				requester
			});
			if (res.unauthorized) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			respond(true, {
				ok: true,
				aborted: res.aborted,
				runIds: res.runIds
			});
			return;
		}
		const normalizedAgentIdOverride = abortAgentId?.toLowerCase();
		const active = context.chatAbortControllers.get(runId);
		if (!active) {
			const pendingAgentEntry = context.dedupe.get(`agent:${runId}`);
			const pendingAgentMatch = (() => {
				const canonicalMatch = readPreRegisteredAgentDedupePayloadForSession({
					entry: pendingAgentEntry,
					runId,
					sessionKey: canonicalAbortSessionKey,
					agentId: abortAgentId,
					defaultAgentId,
					includeHidden: true
				});
				if (canonicalMatch) return {
					sessionKey: canonicalAbortSessionKey,
					payload: canonicalMatch
				};
				if (rawSessionKey === canonicalAbortSessionKey) return;
				const aliasMatch = readPreRegisteredAgentDedupePayloadForSession({
					entry: pendingAgentEntry,
					runId,
					sessionKey: rawSessionKey,
					agentId: abortAgentId,
					defaultAgentId,
					includeHidden: true
				});
				return aliasMatch ? {
					sessionKey: rawSessionKey,
					payload: aliasMatch
				} : void 0;
			})();
			if (pendingAgentMatch) {
				const pendingAgentPayload = pendingAgentMatch.payload;
				if (!canRequesterAbortPreRegisteredAgentRun(pendingAgentPayload, requester)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
					return;
				}
				writePreRegisteredAgentAbort({
					context,
					runId,
					sessionKey: pendingAgentMatch.sessionKey,
					payload: pendingAgentPayload,
					stopReason: "rpc"
				});
				respond(true, {
					ok: true,
					aborted: true,
					runIds: [runId]
				});
				return;
			}
			respond(true, {
				ok: true,
				aborted: false,
				runIds: []
			});
			return;
		}
		if (!new Set([rawSessionKey, canonicalAbortSessionKey]).has(active.sessionKey) && !canRequesterAbortChatRunWithoutSessionMatch(active, requester)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match sessionKey"));
			return;
		}
		if (normalizedAgentIdOverride && active.sessionKey === "global" && resolveStoredGlobalRunAgentId(active.agentId, defaultAgentId) !== normalizedAgentIdOverride) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match agentId"));
			return;
		}
		if (!canRequesterAbortChatRun(active, requester)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return;
		}
		const partialText = context.chatRunBuffers.get(runId);
		const res = abortChatRunById(ops, {
			runId,
			sessionKey: active.sessionKey,
			stopReason: "rpc"
		});
		if (res.aborted && active.controlUiVisible !== false && partialText && partialText.trim()) await persistAbortedPartials({
			context,
			sessionKey: active.sessionKey,
			snapshots: [{
				runId,
				sessionId: active.sessionId,
				agentId: active.agentId,
				text: partialText,
				abortOrigin: "rpc"
			}]
		});
		respond(true, {
			ok: true,
			aborted: res.aborted,
			runIds: res.aborted ? [runId] : []
		});
	},
	"chat.send": async ({ params, respond, context, client }) => {
		const chatSendReceivedAtMs = performance.now();
		const clientInfo = client?.connect?.client;
		const controlUiReconnectResume = resolveControlUiReconnectResumeParams(params, clientInfo);
		if (!validateChatSendParams(controlUiReconnectResume.params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid chat.send params: ${formatValidationErrors(validateChatSendParams.errors)}`));
			return;
		}
		const p = controlUiReconnectResume.params;
		const suppressCommandInterpretation = p.suppressCommandInterpretation === true;
		const explicitOriginResult = normalizeExplicitChatSendOrigin({
			originatingChannel: p.originatingChannel,
			originatingTo: p.originatingTo,
			accountId: p.originatingAccountId,
			messageThreadId: p.originatingThreadId
		});
		if (!explicitOriginResult.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, explicitOriginResult.error));
			return;
		}
		if ((p.systemInputProvenance || p.systemProvenanceReceipt || suppressCommandInterpretation || explicitOriginResult.value) && !canInjectSystemProvenance(client)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, p.systemInputProvenance || p.systemProvenanceReceipt || suppressCommandInterpretation ? "system provenance fields require admin scope" : "originating route fields require admin scope"));
			return;
		}
		const sanitizedMessageResult = sanitizeChatSendMessageInput(p.message);
		if (!sanitizedMessageResult.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, sanitizedMessageResult.error));
			return;
		}
		const systemReceiptResult = normalizeOptionalChatSystemReceipt(p.systemProvenanceReceipt);
		if (!systemReceiptResult.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, systemReceiptResult.error));
			return;
		}
		const inboundMessage = sanitizedMessageResult.message;
		const systemInputProvenance = normalizeInputProvenance(p.systemInputProvenance);
		const systemProvenanceReceipt = systemReceiptResult.receipt;
		const systemDedupeScope = systemInputProvenance || systemProvenanceReceipt ? JSON.stringify([systemProvenanceReceipt ?? null, systemInputProvenance ?? null]) : void 0;
		const stopCommand = !suppressCommandInterpretation && isChatStopCommandText(inboundMessage);
		const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(p.attachments);
		const rawMessage = inboundMessage.trim();
		if (!rawMessage && normalizedAttachments.length === 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "message or attachment required"));
			return;
		}
		const rawSessionKey = p.sessionKey;
		const agentIdOverride = normalizeOptionalText(p.agentId);
		const clientRunId = p.idempotencyKey;
		const requestedAgentId = resolveRequestedChatAgentId({
			cfg: context.getRuntimeConfig?.(),
			requestedSessionKey: rawSessionKey,
			agentId: agentIdOverride
		});
		const sessionLoadOptions = requestedAgentId ? { agentId: requestedAgentId } : void 0;
		const sessionLoadStartedAtMs = performance.now();
		const sessionLoadResult = measureDiagnosticsTimelineSpanSync("gateway.chat_send.load_session", () => loadSessionEntry(rawSessionKey, sessionLoadOptions), {
			phase: "agent-turn",
			attributes: {
				runId: clientRunId,
				hasAttachments: normalizedAttachments.length > 0,
				hasExplicitOrigin: explicitOriginResult.value !== void 0
			}
		});
		const sessionLoadMs = roundedChatSendTimingMs(performance.now() - sessionLoadStartedAtMs);
		const { cfg, entry, canonicalKey: sessionKey, legacyKey } = sessionLoadResult;
		const selectedAgent = validateChatSelectedAgent({
			cfg,
			requestedSessionKey: rawSessionKey,
			agentId: requestedAgentId
		});
		if (!selectedAgent.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
			return;
		}
		const requestedSessionId = normalizeOptionalText(p.sessionId);
		const backingSessionId = entry?.sessionId ?? requestedSessionId;
		const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, sessionKey, entry, { acpMetadataSessionKey: legacyKey ?? sessionKey });
		if (deletedAgentId !== null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${deletedAgentId}" no longer exists in configuration`));
			return;
		}
		const agentId = resolveSessionAgentId({
			sessionKey,
			config: cfg,
			agentId: selectedAgent.agentId
		});
		const activeRunScopeKey = resolveChatSendActiveScopeKey({
			sessionKey,
			agentId: selectedAgent.agentId,
			mainKey: cfg.session?.mainKey
		});
		const resolvedSessionModel = resolveSessionModelRef(cfg, entry, agentId);
		const resolvedSessionAuthProvider = resolveProviderIdForAuth(resolvedSessionModel.provider, { config: cfg });
		let parsedMessage = inboundMessage;
		let parsedImages = [];
		let imageOrder = [];
		let offloadedRefs = [];
		let mediaPathOffloadPaths = [];
		let mediaPathOffloadTypes = [];
		let mediaPathOffloadWorkspaceDir;
		const timeoutMs = resolveAgentTimeoutMs({
			cfg,
			overrideMs: p.timeoutMs
		});
		const now = Date.now();
		if (resolveSendPolicy({
			cfg,
			entry,
			sessionKey,
			channel: entry?.channel,
			chatType: entry?.chatType
		}) === "deny") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
			return;
		}
		if (stopCommand) {
			const defaultAgentId = resolveDefaultAgentId(cfg);
			const stopAgentId = sessionKey === "global" ? selectedAgent.agentId ?? defaultAgentId : selectedAgent.agentId;
			const res = await abortChatRunsForSessionKeyWithPartials({
				context,
				ops: createChatAbortOps(context),
				sessionKey: rawSessionKey,
				sessionKeyAliases: sessionKey === rawSessionKey ? void 0 : [sessionKey],
				agentId: stopAgentId,
				sessionId: entry?.sessionId,
				persistSessionKey: sessionKey,
				defaultAgentId,
				abortOrigin: "stop-command",
				stopReason: "stop",
				requester: resolveChatAbortRequester(client)
			});
			if (res.unauthorized) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			respond(true, {
				ok: true,
				aborted: res.aborted,
				runIds: res.runIds
			});
			return;
		}
		const cached = context.dedupe.get(`chat:${clientRunId}`);
		if (cached) {
			respond(cached.ok, cached.payload, cached.error, { cached: true });
			return;
		}
		const abortMarker = context.chatAbortedRuns.get(clientRunId);
		if (abortMarker !== void 0) {
			const abortedAt = chatAbortMarkerTimestampMs(abortMarker);
			const payload = buildAbortedChatSendPayload({
				runId: clientRunId,
				endedAt: abortedAt
			});
			setGatewayDedupeEntry({
				dedupe: context.dedupe,
				key: `chat:${clientRunId}`,
				entry: {
					ts: abortedAt,
					ok: true,
					payload
				}
			});
			respond(true, payload, void 0, {
				cached: true,
				runId: clientRunId
			});
			return;
		}
		if (context.chatAbortControllers.get(clientRunId)) {
			respond(true, {
				runId: clientRunId,
				status: "in_flight"
			}, void 0, {
				cached: true,
				runId: clientRunId
			});
			return;
		}
		const chatSendTraceAttributes = {
			runId: clientRunId,
			sessionKey,
			agentId: selectedAgent.agentId ?? agentId,
			provider: resolvedSessionModel.provider,
			model: resolvedSessionModel.model,
			hasAttachments: normalizedAttachments.length > 0,
			hasExplicitOrigin: explicitOriginResult.value !== void 0,
			hasConnectedClient: client?.connect !== void 0
		};
		const originatingRoute = resolveChatSendOriginatingRoute({
			client: clientInfo,
			deliver: p.deliver,
			entry,
			explicitOrigin: explicitOriginResult.value,
			hasConnectedClient: client?.connect !== void 0,
			mainKey: cfg.session?.mainKey,
			sessionKey
		});
		const activeChatSendDedupeKey = buildActiveChatSendDedupeKey({
			attachmentCount: normalizedAttachments.length,
			explicitDeliverRoute: originatingRoute.explicitDeliverRoute,
			message: rawMessage,
			originatingChannel: originatingRoute.originatingChannel,
			sessionKey: activeRunScopeKey,
			systemScope: systemDedupeScope
		});
		if (activeChatSendDedupeKey) {
			const activeRunId = resolveActiveChatSendRunId(context.dedupe.get(activeChatSendDedupeKey)?.payload);
			if (activeRunId && context.chatAbortControllers.has(activeRunId)) {
				respond(true, {
					runId: activeRunId,
					status: "in_flight"
				}, void 0, {
					cached: true,
					runId: activeRunId
				});
				return;
			}
		}
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		const activeRunAbort = registerChatAbortController({
			chatAbortControllers: context.chatAbortControllers,
			runId: clientRunId,
			sessionId: backingSessionId ?? clientRunId,
			sessionKey,
			agentId: selectedAgent.agentId,
			timeoutMs,
			now,
			ownerConnId: normalizeOptionalText(client?.connId),
			ownerDeviceId: normalizeOptionalText(client?.connect?.device?.id),
			providerId: resolvedSessionModel.provider,
			authProviderId: resolvedSessionAuthProvider,
			kind: "chat-send",
			lifecycleGeneration
		});
		if (!activeRunAbort.registered) {
			respond(true, {
				runId: clientRunId,
				status: "in_flight"
			}, void 0, {
				cached: true,
				runId: clientRunId
			});
			return;
		}
		claimAgentRunContext(clientRunId, {
			sessionKey,
			sessionId: backingSessionId ?? clientRunId,
			lifecycleGeneration
		});
		if (activeChatSendDedupeKey) context.dedupe.set(activeChatSendDedupeKey, {
			ts: now,
			ok: true,
			payload: { runId: clientRunId }
		});
		const explicitOriginTargetsPlugin = explicitOriginTargetsPluginBinding(explicitOriginResult.value);
		let prepareAttachmentsMs;
		if (normalizedAttachments.length > 0) {
			const prepareAttachmentsStartedAtMs = performance.now();
			try {
				await measureDiagnosticsTimelineSpan("gateway.chat_send.prepare_attachments", async () => {
					const supportsSessionModelImages = await resolveGatewayModelSupportsImages({
						loadGatewayModelCatalog: context.loadGatewayModelCatalog,
						provider: resolvedSessionModel.provider,
						model: resolvedSessionModel.model
					});
					const explicitOriginSupportsInlineImages = explicitOriginTargetsAcpSession(explicitOriginResult.value) || explicitOriginTargetsPlugin;
					const supportsImages = supportsSessionModelImages || explicitOriginSupportsInlineImages;
					const routeImageOffloadsAsMediaPaths = !supportsImages;
					const parsed = await parseMessageWithAttachments(inboundMessage, normalizedAttachments, {
						maxBytes: resolveChatAttachmentMaxBytes(cfg),
						log: context.logGateway,
						supportsImages,
						acceptNonImage: true
					});
					parsedMessage = stripTrailingOffloadedMediaMarkers(parsed.message, routeImageOffloadsAsMediaPaths ? parsed.offloadedRefs.filter((ref) => ref.mimeType.startsWith("image/")) : []);
					parsedImages = parsed.images;
					imageOrder = routeImageOffloadsAsMediaPaths ? [] : parsed.imageOrder;
					offloadedRefs = parsed.offloadedRefs;
					({paths: mediaPathOffloadPaths, types: mediaPathOffloadTypes, workspaceDir: mediaPathOffloadWorkspaceDir} = await prestageMediaPathOffloads({
						offloadedRefs,
						includeImageRefs: routeImageOffloadsAsMediaPaths,
						cfg,
						sessionKey,
						agentId
					}));
				}, {
					phase: "agent-turn",
					config: cfg,
					attributes: {
						...chatSendTraceAttributes,
						attachmentCount: normalizedAttachments.length
					}
				});
				prepareAttachmentsMs = roundedChatSendTimingMs(performance.now() - prepareAttachmentsStartedAtMs);
			} catch (err) {
				activeRunAbort.cleanup({ force: true });
				clearAgentRunContext(clientRunId, lifecycleGeneration);
				clearActiveChatSendDedupeRun(context.dedupe, activeChatSendDedupeKey, clientRunId);
				logAttachmentFailure(context.logGateway, "chat.send attachment parse/stage failed", err);
				respond(false, void 0, errorShape(err instanceof MediaOffloadError ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, String(err)));
				return;
			}
		}
		if (activeRunAbort.controller.signal.aborted) {
			const stopReason = activeRunAbort.entry?.abortStopReason ?? "rpc";
			const endedAt = Date.now();
			const payload = buildAbortedChatSendPayload({
				runId: clientRunId,
				stopReason,
				endedAt
			});
			clearActiveChatSendDedupeRun(context.dedupe, activeChatSendDedupeKey, clientRunId);
			setGatewayDedupeEntry({
				dedupe: context.dedupe,
				key: `chat:${clientRunId}`,
				entry: {
					ts: endedAt,
					ok: true,
					payload
				}
			});
			respond(true, payload, void 0, { runId: clientRunId });
			return;
		}
		try {
			const serverTiming = shouldIncludeChatSendAckServerTiming(clientInfo) ? {
				receivedToAckMs: roundedChatSendTimingMs(performance.now() - chatSendReceivedAtMs),
				loadSessionMs: sessionLoadMs,
				...prepareAttachmentsMs !== void 0 ? { prepareAttachmentsMs } : {}
			} : void 0;
			const chatSendTiming = serverTiming && typeof client?.connId === "string" && client.connId.trim() ? {
				ackedAtMs: performance.now(),
				connId: client.connId.trim(),
				receivedAtMs: chatSendReceivedAtMs
			} : void 0;
			context.addChatRun(clientRunId, {
				sessionKey,
				agentId: selectedAgent.agentId,
				clientRunId,
				...chatSendTiming ? { chatSendTiming } : {}
			});
			const ackPayload = {
				runId: clientRunId,
				status: "started",
				...serverTiming ? { serverTiming } : {}
			};
			emitDiagnosticsTimelineEvent({
				type: "mark",
				name: "gateway.chat_send.ack_ready",
				phase: "agent-turn",
				attributes: {
					...chatSendTraceAttributes,
					ackStatus: ackPayload.status,
					...chatSendAckServerTimingAttributes(serverTiming)
				}
			}, { config: cfg });
			respond(true, ackPayload, void 0, { runId: clientRunId });
			const chatSendAckedAtMs = chatSendTiming?.ackedAtMs ?? performance.now();
			const persistedImagesPromise = persistChatSendImages({
				images: parsedImages,
				imageOrder,
				offloadedRefs,
				client,
				logGateway: context.logGateway
			});
			let persistedMediaForTranscript;
			const getPersistedMediaForTranscript = async () => {
				if (!persistedMediaForTranscript) persistedMediaForTranscript = await persistedImagesPromise;
				return persistedMediaForTranscript;
			};
			const preparedUserTurnMediaPromise = normalizedAttachments.length > 0 ? getPersistedMediaForTranscript() : Promise.resolve([]);
			const userTurnMediaPromise = preparedUserTurnMediaPromise.then(buildChatSendUserTurnMedia);
			const baseUserTurnInput = {
				text: rawMessage,
				timestamp: now,
				idempotencyKey: `${clientRunId}:user`,
				...systemInputProvenance ? { provenance: systemInputProvenance } : {}
			};
			const userTurnInputPromise = userTurnMediaPromise.then((media) => ({
				...baseUserTurnInput,
				...media.length > 0 ? {
					media,
					mediaOnlyText: "[User sent media without caption]"
				} : {}
			}));
			const pluginBoundMediaFieldsPromise = explicitOriginTargetsPlugin && parsedImages.length > 0 ? preparedUserTurnMediaPromise.then(resolveChatSendManagedMediaFields) : Promise.resolve({});
			const trimmedMessage = parsedMessage.trim();
			const commandBody = Boolean(p.thinking && trimmedMessage && !trimmedMessage.startsWith("/")) ? `/think ${p.thinking} ${parsedMessage}` : parsedMessage;
			const commandSource = !suppressCommandInterpretation && trimmedMessage.startsWith("/") ? "text" : void 0;
			const messageForAgent = systemProvenanceReceipt ? [systemProvenanceReceipt, parsedMessage].filter(Boolean).join("\n\n") : parsedMessage;
			const { originatingChannel, originatingTo, accountId, messageThreadId, explicitDeliverRoute } = originatingRoute;
			const ctx = {
				Body: messageForAgent,
				BodyForAgent: messageForAgent,
				BodyForCommands: commandBody,
				RawBody: parsedMessage,
				CommandBody: commandBody,
				InputProvenance: systemInputProvenance,
				SessionKey: sessionKey,
				AgentId: agentId,
				Provider: INTERNAL_MESSAGE_CHANNEL,
				Surface: INTERNAL_MESSAGE_CHANNEL,
				OriginatingChannel: originatingChannel,
				OriginatingTo: originatingTo,
				ExplicitDeliverRoute: explicitDeliverRoute,
				AccountId: accountId,
				MessageThreadId: messageThreadId,
				ChatType: "direct",
				...commandSource ? { CommandSource: commandSource } : {},
				CommandAuthorized: !suppressCommandInterpretation,
				CommandTurn: commandSource ? {
					kind: "text-slash",
					source: commandSource,
					authorized: true,
					body: commandBody
				} : {
					kind: "normal",
					source: "message",
					authorized: false,
					body: commandBody
				},
				MessageSid: clientRunId,
				ApprovalReviewerDeviceId: normalizeOptionalText(client?.connect?.device?.id),
				...!isOperatorUiClient(clientInfo) ? {
					SenderId: clientInfo?.id,
					SenderName: clientInfo?.displayName,
					SenderUsername: clientInfo?.displayName
				} : {},
				GatewayClientScopes: client?.connect?.scopes ?? []
			};
			const isInternalTextSlashCommandTurn = ctx.Provider === "webchat" && ctx.CommandSource === "text";
			if (mediaPathOffloadPaths.length > 0) {
				ctx.MediaPath = mediaPathOffloadPaths[0];
				ctx.MediaPaths = mediaPathOffloadPaths;
				ctx.MediaType = mediaPathOffloadTypes[0];
				ctx.MediaTypes = mediaPathOffloadTypes;
				ctx.MediaWorkspaceDir = mediaPathOffloadWorkspaceDir;
				ctx.MediaStaged = true;
			}
			const replyOptionImages = mediaPathOffloadTypes.some((type) => type.startsWith("image/")) ? void 0 : parsedImages.length > 0 ? parsedImages : void 0;
			const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
				cfg,
				agentId,
				channel: INTERNAL_MESSAGE_CHANNEL
			});
			const deliveredReplies = [];
			let appendedWebchatAgentMedia = false;
			let agentRunStarted = false;
			let pendingDispatchLifecycleError;
			const userTurnRecorder = createUserTurnTranscriptRecorder({
				input: baseUserTurnInput,
				resolveInput: () => userTurnInputPromise,
				target: () => {
					const { storePath: latestStorePath, store: latestStore, entry: latestEntry } = loadSessionEntry(sessionKey, sessionLoadOptions);
					const resolvedSessionId = latestEntry?.sessionId ?? backingSessionId;
					if (!resolvedSessionId) return;
					return {
						sessionId: resolvedSessionId,
						sessionKey,
						sessionEntry: latestEntry ?? entry,
						sessionStore: latestStore,
						storePath: latestStorePath,
						agentId,
						config: cfg
					};
				},
				errorContext: "gateway chat user turn transcript",
				beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
				onPersistenceError: (error) => {
					context.logGateway.warn(`gateway user transcript persistence failed: ${formatForLog(error)}`);
				}
			});
			const persistGatewayUserTurnTranscript = async () => {
				await measureDiagnosticsTimelineSpan("gateway.chat_send.persist_user_transcript", async () => {
					await userTurnRecorder.persistFallback();
				}, {
					phase: "agent-turn",
					config: cfg,
					attributes: chatSendTraceAttributes
				});
			};
			const persistGatewayUserTurnTranscriptBestEffort = async () => {
				await persistGatewayUserTurnTranscript().catch(() => void 0);
			};
			const appendWebchatAgentMediaTranscriptIfNeeded = async (payload) => {
				if (!agentRunStarted || appendedWebchatAgentMedia || !isMediaBearingPayload(payload)) return;
				if (isSourceReplyTranscriptMirrorPayload(payload)) return;
				const ttsSupplementMarker = buildTtsSupplementTranscriptMarker(payload);
				const [transcriptPayload] = await normalizeWebchatReplyMediaPathsForDisplay({
					cfg,
					sessionKey,
					agentId,
					accountId,
					payloads: [stripVisibleTextFromTtsSupplement(payload)]
				});
				if (!transcriptPayload) return;
				const { storePath: latestStorePath, entry: latestEntry } = loadSessionEntry(sessionKey, sessionLoadOptions);
				const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
				const resolvedTranscriptPath = resolveTranscriptPath({
					sessionId,
					storePath: latestStorePath,
					sessionFile: latestEntry?.sessionFile ?? entry?.sessionFile,
					agentId
				});
				const mediaLocalRoots = appendLocalMediaParentRoots(getAgentScopedMediaLocalRoots(cfg, agentId), resolvedTranscriptPath ? [resolvedTranscriptPath] : void 0);
				const assistantContent = await buildAssistantDisplayContentFromReplyPayloads({
					sessionKey,
					agentId,
					payloads: [transcriptPayload],
					managedImageLocalRoots: mediaLocalRoots,
					includeSensitiveMedia: transcriptPayload.sensitiveMedia !== true,
					onLocalAudioAccessDenied: (message) => {
						context.logGateway.warn(`webchat audio embedding denied local path: ${message}`);
					},
					onManagedImagePrepareError: (message) => {
						context.logGateway.warn(`webchat image embedding skipped attachment: ${message}`);
					}
				});
				const mediaMessage = await buildWebchatAssistantMediaMessage([transcriptPayload], {
					localRoots: mediaLocalRoots,
					onLocalAudioAccessDenied: (message) => {
						context.logGateway.warn(`webchat audio embedding denied local path: ${message}`);
					}
				});
				const persistedAssistantContent = replaceAssistantContentTextBlocks(assistantContent, mediaMessage);
				const persistedContentForAppend = hasAssistantDisplayMediaContent(persistedAssistantContent) ? persistedAssistantContent : void 0;
				if (!persistedContentForAppend?.length) return;
				const transcriptReply = mediaMessage?.transcriptText ?? extractAssistantDisplayTextFromContent(assistantContent) ?? buildTranscriptReplyText([transcriptPayload]);
				if (!transcriptReply && !persistedAssistantContent?.length && !assistantContent?.length) return;
				const appended = await appendAssistantTranscriptMessage({
					sessionKey,
					message: transcriptReply,
					...persistedContentForAppend?.length ? { content: persistedContentForAppend } : {},
					sessionId,
					storePath: latestStorePath,
					sessionFile: latestEntry?.sessionFile,
					agentId,
					createIfMissing: true,
					idempotencyKey: `${clientRunId}:assistant-media`,
					ttsSupplement: ttsSupplementMarker,
					cfg
				});
				if (appended.ok) {
					if (appended.messageId && assistantContent?.length) await attachManagedOutgoingImagesToMessage({
						messageId: appended.messageId,
						blocks: assistantContent
					});
					appendedWebchatAgentMedia = true;
					return;
				}
				context.logGateway.warn(`webchat transcript append failed for media reply: ${appended.error ?? "unknown error"}`);
			};
			const dispatcher = createReplyDispatcher({
				...replyPipeline,
				onError: (err) => {
					context.logGateway.warn(`webchat dispatch failed: ${formatForLog(err)}`);
				},
				deliver: async (payload, info) => {
					if (getReplyPayloadMetadata(payload)?.beforeAgentRunBlocked === true) userTurnRecorder.markBlocked();
					switch (info.kind) {
						case "block":
						case "final":
							deliveredReplies.push({
								payload,
								kind: info.kind
							});
							await appendWebchatAgentMediaTranscriptIfNeeded(payload);
							break;
						case "tool":
							if (isMediaBearingPayload(payload)) deliveredReplies.push({
								payload: {
									...payload,
									text: void 0
								},
								kind: "final"
							});
							break;
					}
				}
			});
			const emitServerTiming = (phase, extra, dispatchStartedAtMs) => {
				emitOperatorChatSendServerTiming({
					context,
					client,
					phase,
					runId: clientRunId,
					sessionKey,
					agentId,
					receivedAtMs: chatSendReceivedAtMs,
					ackedAtMs: chatSendAckedAtMs,
					dispatchStartedAtMs,
					extra
				});
			};
			const dispatchStartedAtMs = performance.now();
			if (chatSendTiming) chatSendTiming.dispatchStartedAtMs = dispatchStartedAtMs;
			emitServerTiming("dispatch-started");
			let firstAssistantServerTimingEmitted = false;
			const emitFirstAssistantServerTiming = () => {
				if (firstAssistantServerTimingEmitted || chatSendTiming?.firstAssistantEventSent) return;
				firstAssistantServerTimingEmitted = true;
				if (chatSendTiming) chatSendTiming.firstAssistantEventSent = true;
				emitServerTiming("first-assistant-event", void 0, dispatchStartedAtMs);
			};
			measureDiagnosticsTimelineSpan("gateway.chat_send.dispatch_inbound", async () => {
				applyChatSendManagedMediaFields(ctx, await pluginBoundMediaFieldsPromise);
				const dispatchResult = await dispatchInboundMessage({
					ctx,
					cfg,
					dispatcher,
					onSessionMetadataChanges: (changes) => {
						for (const change of changes) emitSessionsChanged(context, change);
					},
					replyOptions: {
						runId: clientRunId,
						...isOperatorUiClient(clientInfo) ? { promptCacheKey: resolveWebchatPromptCacheKey({
							agentId,
							provider: resolvedSessionModel.provider,
							model: resolvedSessionModel.model,
							sessionKey: activeRunScopeKey
						}) } : {},
						requestedSessionId,
						resumeRequestedSession: controlUiReconnectResume.resumeRequested,
						abortSignal: activeRunAbort.controller.signal,
						images: replyOptionImages,
						imageOrder: imageOrder.length > 0 ? imageOrder : void 0,
						thinkingLevelOverride: p.thinking,
						fastModeOverride: p.fastMode,
						userTurnTranscriptRecorder: userTurnRecorder,
						fastModeAutoOnSecondsOverride: p.fastAutoOnSeconds,
						onAgentRunStart: (runId) => {
							agentRunStarted = true;
							emitServerTiming("agent-run-started", runId !== clientRunId ? { agentRunId: runId } : void 0, dispatchStartedAtMs);
							const connId = typeof client?.connId === "string" ? client.connId : void 0;
							const wantsToolEvents = hasGatewayClientCap(client?.connect?.caps, GATEWAY_CLIENT_CAPS.TOOL_EVENTS);
							if (connId && wantsToolEvents) {
								context.registerToolEventRecipient(runId, connId);
								const defaultAgentId = resolveDefaultAgentId(cfg);
								const selectedGlobalAgentId = sessionKey === "global" ? selectedAgent.agentId ?? defaultAgentId : void 0;
								for (const [activeRunId, active] of context.chatAbortControllers) {
									const activeGlobalAgentId = active.sessionKey === "global" ? active.agentId ?? defaultAgentId : void 0;
									const sameSelectedGlobalAgent = sessionKey === "global" && selectedGlobalAgentId !== void 0 && activeGlobalAgentId === selectedGlobalAgentId;
									const sameSession = active.sessionKey === sessionKey && (sessionKey !== "global" || sameSelectedGlobalAgent);
									if (activeRunId !== runId && sameSession) context.registerToolEventRecipient(activeRunId, connId);
								}
							}
						},
						onModelSelected: (modelSelection) => {
							updateChatRunProvider(context.chatAbortControllers, {
								runId: clientRunId,
								providerId: modelSelection.provider,
								authProviderId: resolveProviderIdForAuth(modelSelection.provider, { config: cfg })
							});
							onModelSelected(modelSelection);
							emitServerTiming("model-selected", {
								provider: modelSelection.provider,
								model: modelSelection.model
							}, dispatchStartedAtMs);
						}
					}
				});
				if (dispatchResult.beforeAgentRunBlocked === true) userTurnRecorder.markBlocked();
				return dispatchResult;
			}, {
				phase: "agent-turn",
				config: cfg,
				attributes: chatSendTraceAttributes
			}).then(async () => {
				emitServerTiming("dispatch-completed", void 0, dispatchStartedAtMs);
				const postDispatchStartedAtMs = performance.now();
				await measureDiagnosticsTimelineSpan("gateway.chat_send.post_dispatch", async () => {
					const returnedAgentErrorPayloads = agentRunStarted ? deliveredReplies.map((entryInner) => entryInner.payload).filter((payload) => payload.isError) : [];
					const returnedAgentErrorMessage = returnedAgentErrorPayloads.map((payload) => payload.text?.trim()).filter((text) => Boolean(text)).join(" | ") || void 0;
					if (agentRunStarted && returnedAgentErrorPayloads.length > 0 && !userTurnRecorder.hasPersisted() && !userTurnRecorder.isBlocked()) await persistGatewayUserTurnTranscriptBestEffort();
					if (agentRunStarted && returnedAgentErrorPayloads.length === 0 && !userTurnRecorder.hasPersisted() && !userTurnRecorder.isBlocked() && userTurnRecorder.hasRuntimePersistencePending()) await persistGatewayUserTurnTranscriptBestEffort();
					let broadcastedSourceReplyFinal = false;
					if (!agentRunStarted) {
						const btwReplies = deliveredReplies.map((entryScoped) => entryScoped.payload).filter(isBtwReplyPayload);
						const btwText = btwReplies.map((payload) => payload.text.trim()).filter(Boolean).join("\n\n").trim();
						if (btwReplies.length > 0 && btwText) {
							broadcastSideResult({
								context,
								payload: {
									kind: "btw",
									runId: clientRunId,
									sessionKey,
									...sessionKey === "global" && agentId ? { agentId } : {},
									question: btwReplies[0].btw.question.trim(),
									text: btwText,
									isError: btwReplies.some((payload) => payload.isError),
									ts: Date.now()
								}
							});
							broadcastChatFinal({
								context,
								runId: clientRunId,
								sessionKey,
								agentId
							});
						} else {
							const finalPayloadEntries = deliveredReplies.filter((entryItem) => entryItem.kind === "final");
							const parseReplyInlineDirectives = (payload) => typeof payload.text === "string" && payload.text.includes("[[") ? parseInlineDirectives(payload.text) : void 0;
							const shouldFoldCommandBlocks = isInternalTextSlashCommandTurn;
							const commandBlockPayloadEntries = shouldFoldCommandBlocks ? deliveredReplies.filter((entryItem) => entryItem.kind === "block") : [];
							const replyMediaUrls = (payload) => resolveSendableOutboundReplyParts(payload).mediaUrls;
							const normalizeCommandMediaDedupeKey = (value) => {
								const trimmed = value.trim();
								if (!trimmed) return "";
								if (!trimmed.toLowerCase().startsWith("file://")) return path.isAbsolute(trimmed) ? path.normalize(trimmed) : trimmed;
								try {
									const parsed = new URL(trimmed);
									if (parsed.protocol === "file:") return path.normalize(fileURLToPath(parsed));
								} catch {}
								return trimmed.replace(/^file:\/\//iu, "");
							};
							const replyMediaDedupeKeys = (payload) => replyMediaUrls(payload).map((mediaUrl) => normalizeCommandMediaDedupeKey(mediaUrl));
							const canonicalizeReplyMedia = (payload) => {
								const mediaUrls = replyMediaUrls(payload);
								return {
									...payload,
									mediaUrl: void 0,
									mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0
								};
							};
							const mergeDefinedReplySemantics = (target, source) => {
								const sourceInlineDirectives = parseReplyInlineDirectives(source);
								const sourceReplyToId = sanitizeReplyDirectiveId(source.replyToId) ?? sanitizeReplyDirectiveId(sourceInlineDirectives?.replyToExplicitId);
								return {
									...target,
									...source.trustedLocalMedia === true || target.trustedLocalMedia === true ? { trustedLocalMedia: true } : {},
									...source.sensitiveMedia === true || target.sensitiveMedia === true ? { sensitiveMedia: true } : {},
									...source.presentation !== void 0 ? { presentation: source.presentation } : {},
									...source.delivery !== void 0 ? { delivery: source.delivery } : {},
									...source.interactive !== void 0 ? { interactive: source.interactive } : {},
									...sourceReplyToId !== void 0 ? { replyToId: sourceReplyToId } : {},
									...source.replyToTag === true || target.replyToTag === true ? { replyToTag: true } : {},
									...source.replyToCurrent === true || sourceInlineDirectives?.replyToCurrent === true || target.replyToCurrent === true ? { replyToCurrent: true } : {},
									...source.audioAsVoice === true || sourceInlineDirectives?.audioAsVoice === true || target.audioAsVoice === true ? { audioAsVoice: true } : {},
									...source.spokenText !== void 0 ? { spokenText: source.spokenText } : {},
									...source.ttsSupplement !== void 0 ? { ttsSupplement: source.ttsSupplement } : {},
									...source.isError === true || target.isError === true ? { isError: true } : {},
									...source.channelData !== void 0 ? { channelData: source.channelData } : {}
								};
							};
							const mergeMediaReplySemantics = (target, source) => {
								const sourceInlineDirectives = parseReplyInlineDirectives(source);
								return {
									...target,
									...source.trustedLocalMedia === true || target.trustedLocalMedia === true ? { trustedLocalMedia: true } : {},
									...source.sensitiveMedia === true || target.sensitiveMedia === true ? { sensitiveMedia: true } : {},
									...source.audioAsVoice === true || sourceInlineDirectives?.audioAsVoice === true || target.audioAsVoice === true ? { audioAsVoice: true } : {}
								};
							};
							const hasMergeableReplySemantics = (payload) => {
								const inlineDirectives = parseReplyInlineDirectives(payload);
								return Boolean(payload.trustedLocalMedia !== void 0 || payload.sensitiveMedia !== void 0 || payload.presentation || payload.delivery || payload.interactive || payload.replyToId || payload.replyToTag !== void 0 || payload.replyToCurrent !== void 0 || payload.audioAsVoice !== void 0 || inlineDirectives?.hasReplyTag || inlineDirectives?.hasAudioTag || payload.spokenText || payload.ttsSupplement || payload.isError !== void 0 || payload.channelData);
							};
							const hasUnmergedReplySemantics = (payload) => Boolean(payload.isReasoning || payload.isReasoningSnapshot || payload.isCompactionNotice || payload.isFallbackNotice || payload.isStatusNotice || payload.btw);
							const hasReplySemantics = (payload) => hasMergeableReplySemantics(payload) || hasUnmergedReplySemantics(payload);
							const mediaSetsMatch = (leftMediaUrls, rightMediaUrls) => {
								if (leftMediaUrls.length !== rightMediaUrls.length) return false;
								return leftMediaUrls.every((mediaUrl, index) => mediaUrl === rightMediaUrls[index]);
							};
							const replyDisplayText = (payload) => sanitizeAssistantDisplayText(payload.text) ?? "";
							const commandBlockPayloadEntriesForDelivery = commandBlockPayloadEntries.map((entryItem) => ({
								kind: entryItem.kind,
								payload: canonicalizeReplyMedia(entryItem.payload)
							}));
							const sensitiveMediaDedupeKeys = new Set(finalPayloadEntries.flatMap((entryItem) => entryItem.payload.sensitiveMedia === true ? replyMediaDedupeKeys(entryItem.payload).filter(Boolean) : []));
							if (sensitiveMediaDedupeKeys.size > 0) {
								for (const entryItem of commandBlockPayloadEntriesForDelivery) if (replyMediaDedupeKeys(entryItem.payload).some((key) => sensitiveMediaDedupeKeys.has(key))) entryItem.payload = {
									...entryItem.payload,
									sensitiveMedia: true
								};
							}
							const finalPayloadEntriesForDelivery = shouldFoldCommandBlocks ? finalPayloadEntries.flatMap((entryItem) => {
								const finalMediaUrls = replyMediaUrls(entryItem.payload);
								const finalMediaKeys = replyMediaDedupeKeys(entryItem.payload);
								const finalDisplayText = replyDisplayText(entryItem.payload);
								const matchingMediaBlockEntry = finalMediaUrls.length > 0 ? commandBlockPayloadEntriesForDelivery.find((candidate) => mediaSetsMatch(replyMediaDedupeKeys(candidate.payload), finalMediaKeys)) : void 0;
								const matchingTextBlockEntry = finalDisplayText ? commandBlockPayloadEntriesForDelivery.find((candidate) => replyDisplayText(candidate.payload) === finalDisplayText) : void 0;
								const matchingMediaAndTextBlockEntry = finalMediaUrls.length > 0 && finalDisplayText ? commandBlockPayloadEntriesForDelivery.find((candidate) => replyDisplayText(candidate.payload) === finalDisplayText && mediaSetsMatch(replyMediaDedupeKeys(candidate.payload), finalMediaKeys)) : void 0;
								const duplicateBlockEntry = finalMediaUrls.length > 0 ? finalDisplayText ? matchingMediaAndTextBlockEntry : matchingMediaBlockEntry : finalMediaUrls.length === 0 ? matchingTextBlockEntry : void 0;
								if (duplicateBlockEntry) duplicateBlockEntry.payload = mergeDefinedReplySemantics(duplicateBlockEntry.payload, entryItem.payload);
								else if (matchingMediaBlockEntry) matchingMediaBlockEntry.payload = mergeMediaReplySemantics(matchingMediaBlockEntry.payload, entryItem.payload);
								const remainingFinalMediaUrls = matchingMediaBlockEntry ? [] : finalMediaUrls;
								if (remainingFinalMediaUrls.length === 0 && (duplicateBlockEntry && !hasUnmergedReplySemantics(entryItem.payload) || !duplicateBlockEntry && !finalDisplayText && !hasReplySemantics(entryItem.payload))) return [];
								return [{
									...entryItem,
									payload: {
										...entryItem.payload,
										mediaUrl: void 0,
										mediaUrls: remainingFinalMediaUrls.length > 0 ? remainingFinalMediaUrls : void 0
									}
								}];
							}) : finalPayloadEntries;
							const finalPayloads = await normalizeWebchatReplyMediaPathsForDisplay({
								cfg,
								sessionKey,
								agentId,
								accountId,
								payloads: appendedWebchatAgentMedia ? [] : [...commandBlockPayloadEntriesForDelivery, ...finalPayloadEntriesForDelivery].map((entryCandidate) => entryCandidate.payload)
							});
							const { storePath: latestStorePath, entry: latestEntry } = loadSessionEntry(sessionKey, sessionLoadOptions);
							const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
							const resolvedTranscriptPath = resolveTranscriptPath({
								sessionId,
								storePath: latestStorePath,
								sessionFile: latestEntry?.sessionFile ?? entry?.sessionFile,
								agentId
							});
							const mediaLocalRoots = appendLocalMediaParentRoots(getAgentScopedMediaLocalRoots(cfg, agentId), resolvedTranscriptPath ? [resolvedTranscriptPath] : void 0);
							const assistantContent = await buildAssistantDisplayContentFromReplyPayloads({
								sessionKey,
								agentId,
								payloads: finalPayloads,
								managedImageLocalRoots: mediaLocalRoots,
								includeSensitiveMedia: false,
								onLocalAudioAccessDenied: (message) => {
									context.logGateway.warn(`webchat audio embedding denied local path: ${message}`);
								},
								onManagedImagePrepareError: (message) => {
									context.logGateway.warn(`webchat image embedding skipped attachment: ${message}`);
								}
							});
							const mediaMessage = await buildWebchatAssistantMediaMessage(finalPayloads, {
								localRoots: mediaLocalRoots,
								onLocalAudioAccessDenied: (message) => {
									context.logGateway.warn(`webchat audio embedding denied local path: ${message}`);
								}
							});
							const hasSensitiveMedia = hasSensitiveMediaPayload(finalPayloads);
							const ttsSupplementMarker = finalPayloads.map((payload) => buildMediaOnlyTtsSupplementTranscriptMarker(payload)).find((marker) => Boolean(marker));
							const persistedAssistantContent = replaceAssistantContentTextBlocks(hasSensitiveMedia ? await buildAssistantDisplayContentFromReplyPayloads({
								sessionKey,
								agentId,
								payloads: finalPayloads,
								managedImageLocalRoots: mediaLocalRoots,
								includeSensitiveMedia: false,
								onLocalAudioAccessDenied: (message) => {
									context.logGateway.warn(`webchat audio embedding denied local path: ${message}`);
								},
								onManagedImagePrepareError: (message) => {
									context.logGateway.warn(`webchat image embedding skipped attachment: ${message}`);
								}
							}) : assistantContent, mediaMessage);
							const persistedContentForAppend = hasAssistantDisplayMediaContent(persistedAssistantContent) ? persistedAssistantContent : void 0;
							const broadcastAssistantContent = hasAssistantDisplayMediaContent(assistantContent) ? assistantContent : hasAssistantDisplayMediaContent(mediaMessage?.content) ? mediaMessage?.content : assistantContent;
							const displayReply = extractAssistantDisplayTextFromContent(assistantContent) ?? buildTranscriptReplyText(finalPayloads);
							const transcriptDisplayReply = displayReply ? stripInlineDirectiveTagsForDisplay(displayReply).text.trim() : "";
							const transcriptReply = mediaMessage?.transcriptText || buildTranscriptReplyText(finalPayloads) || transcriptDisplayReply;
							let message;
							const shouldAppendAssistantTranscript = Boolean(transcriptReply || persistedContentForAppend?.length);
							if (shouldAppendAssistantTranscript) await persistGatewayUserTurnTranscriptBestEffort();
							else await persistGatewayUserTurnTranscriptBestEffort();
							if (shouldAppendAssistantTranscript) {
								const appended = await appendAssistantTranscriptMessage({
									sessionKey,
									message: transcriptReply,
									...persistedContentForAppend?.length ? { content: persistedContentForAppend } : {},
									sessionId,
									storePath: latestStorePath,
									sessionFile: latestEntry?.sessionFile,
									agentId,
									createIfMissing: true,
									idempotencyKey: clientRunId,
									ttsSupplement: ttsSupplementMarker,
									cfg
								});
								if (appended.ok) {
									if (appended.messageId && assistantContent?.length) await attachManagedOutgoingImagesToMessage({
										messageId: appended.messageId,
										blocks: assistantContent
									});
									message = broadcastAssistantContent?.length ? {
										...appended.message,
										content: broadcastAssistantContent
									} : appended.message;
								} else {
									context.logGateway.warn(`webchat transcript append failed: ${appended.error ?? "unknown error"}`);
									const fallbackAssistantContent = stripManagedOutgoingAssistantContentBlocks(persistedAssistantContent) ?? stripManagedOutgoingAssistantContentBlocks(assistantContent);
									const fallbackText = extractAssistantDisplayText(fallbackAssistantContent) ?? displayReply;
									const nowValue = Date.now();
									message = {
										role: "assistant",
										...fallbackAssistantContent?.length ? { content: fallbackAssistantContent } : fallbackText ? { content: [{
											type: "text",
											text: fallbackText
										}] } : {},
										...fallbackText ? { text: fallbackText } : {},
										timestamp: nowValue,
										...ttsSupplementMarker ? { openclawTtsSupplement: ttsSupplementMarker } : {},
										stopReason: "stop",
										usage: {
											input: 0,
											output: 0,
											totalTokens: 0
										}
									};
								}
							} else if (broadcastAssistantContent?.length) message = {
								role: "assistant",
								content: broadcastAssistantContent,
								text: extractAssistantDisplayText(broadcastAssistantContent) ?? "",
								timestamp: Date.now(),
								stopReason: "stop",
								usage: {
									input: 0,
									output: 0,
									totalTokens: 0
								}
							};
							if (hasVisibleAssistantFinalMessage(message)) emitFirstAssistantServerTiming();
							broadcastChatFinal({
								context,
								runId: clientRunId,
								sessionKey,
								agentId,
								message
							});
						}
					} else {
						const hasReturnedAgentErrorPayloads = returnedAgentErrorPayloads.length > 0;
						const agentRunReplyPayloads = deliveredReplies.filter((entryEntry) => entryEntry.kind === "final").map((entryResult) => entryResult.payload).filter((payload) => isSourceReplyTranscriptMirrorPayload(payload) || !hasReturnedAgentErrorPayloads && isReplyPayloadStatusNotice(payload));
						if (agentRunReplyPayloads.length > 0) {
							const hasSourceReplyTranscriptMirror = agentRunReplyPayloads.some(isSourceReplyTranscriptMirrorPayload);
							const finalPayloads = await normalizeWebchatReplyMediaPathsForDisplay({
								cfg,
								sessionKey,
								agentId,
								accountId,
								payloads: agentRunReplyPayloads
							});
							const { storePath: latestStorePath, entry: latestEntry } = loadSessionEntry(sessionKey, sessionLoadOptions);
							const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
							const resolvedTranscriptPath = resolveTranscriptPath({
								sessionId,
								storePath: latestStorePath,
								sessionFile: latestEntry?.sessionFile ?? entry?.sessionFile,
								agentId
							});
							const mediaLocalRoots = appendLocalMediaParentRoots(getAgentScopedMediaLocalRoots(cfg, agentId), resolvedTranscriptPath ? [resolvedTranscriptPath] : void 0);
							const buildReplyAssistantContent = async (payloads) => await buildAssistantDisplayContentFromReplyPayloads({
								sessionKey,
								agentId,
								payloads,
								managedImageLocalRoots: mediaLocalRoots,
								includeSensitiveMedia: false,
								onLocalAudioAccessDenied: (message) => {
									context.logGateway.warn(`webchat audio embedding denied local path: ${message}`);
								},
								onManagedImagePrepareError: (message) => {
									context.logGateway.warn(`webchat image embedding skipped attachment: ${message}`);
								}
							});
							const buildReplyMediaMessage = async (payloads) => await buildWebchatAssistantMediaMessage(payloads, {
								localRoots: mediaLocalRoots,
								onLocalAudioAccessDenied: (message) => {
									context.logGateway.warn(`webchat audio embedding denied local path: ${message}`);
								}
							});
							const combinedAssistantContent = agentRunReplyPayloads.length === 1 ? await buildReplyAssistantContent(finalPayloads) : void 0;
							const combinedMediaMessage = agentRunReplyPayloads.length === 1 ? await buildReplyMediaMessage(finalPayloads) : void 0;
							const sourceReplyContentStates = [];
							const sourceReplyBroadcastContent = [];
							for (const [replyIndex] of agentRunReplyPayloads.entries()) {
								const finalPayload = finalPayloads[replyIndex];
								if (!finalPayload) continue;
								const replyAssistantContent = agentRunReplyPayloads.length === 1 ? combinedAssistantContent : await buildReplyAssistantContent([finalPayload]);
								const replyMediaMessage = agentRunReplyPayloads.length === 1 ? combinedMediaMessage : await buildReplyMediaMessage([finalPayload]);
								const replyBroadcastContent = hasAssistantDisplayMediaContent(replyAssistantContent) ? replyAssistantContent : hasAssistantDisplayMediaContent(replyMediaMessage?.content) ? replyMediaMessage?.content : replyAssistantContent;
								const persistedContent = replaceAssistantContentTextBlocks(replyAssistantContent, replyMediaMessage ?? null);
								const state = {
									broadcastContent: replyBroadcastContent ? [...replyBroadcastContent] : [],
									persistedContent: persistedContent ? [...persistedContent] : [],
									hasManagedOutgoingContent: hasManagedOutgoingAssistantContent(persistedContent),
									backedManagedOutgoingContent: false
								};
								sourceReplyContentStates[replyIndex] = state;
								if (state.broadcastContent.length > 0) sourceReplyBroadcastContent.push(...state.broadcastContent);
							}
							const displayReply = extractAssistantDisplayTextFromContent(sourceReplyBroadcastContent) ?? buildTranscriptReplyText(finalPayloads);
							if (sourceReplyBroadcastContent.length || displayReply) {
								const sourceReplyPersistenceRequests = [];
								for (const [replyIndex, sourceReplyPayload] of agentRunReplyPayloads.entries()) {
									const state = sourceReplyContentStates[replyIndex];
									if (!state || !hasAssistantDisplayMediaContent(state.persistedContent)) continue;
									const mirrorMetadata = getReplyPayloadMetadata(sourceReplyPayload)?.sourceReplyTranscriptMirror;
									const mirrorIdempotencyKey = mirrorMetadata?.idempotencyKey;
									if (typeof mirrorIdempotencyKey !== "string" || mirrorIdempotencyKey.trim().length === 0) continue;
									if (!state.hasManagedOutgoingContent) state.backedManagedOutgoingContent = true;
									sourceReplyPersistenceRequests.push({
										idempotencyKey: mirrorIdempotencyKey,
										metadata: mirrorMetadata,
										state
									});
								}
								const attachSourceReplyManagedImages = async (paramsLocal) => {
									if (!paramsLocal.request.state.hasManagedOutgoingContent) {
										paramsLocal.request.state.backedManagedOutgoingContent = true;
										return;
									}
									if (!paramsLocal.messageId) return;
									await attachManagedOutgoingImagesToMessage({
										messageId: paramsLocal.messageId,
										blocks: paramsLocal.request.state.persistedContent
									});
									paramsLocal.request.state.backedManagedOutgoingContent = true;
								};
								if (resolvedTranscriptPath && sourceReplyPersistenceRequests.length > 0) {
									const allowedSourceReplyMirrorIds = /* @__PURE__ */ new Set();
									for (const [replyIndex, sourceReplyPayload] of agentRunReplyPayloads.entries()) {
										if (!sourceReplyContentStates[replyIndex]) continue;
										const mirrorIdempotencyKey = getReplyPayloadMetadata(sourceReplyPayload)?.sourceReplyTranscriptMirror?.idempotencyKey;
										const mirrorMetadata = getReplyPayloadMetadata(sourceReplyPayload)?.sourceReplyTranscriptMirror;
										if (typeof mirrorIdempotencyKey !== "string" || mirrorIdempotencyKey.trim().length === 0 || !mirrorMetadata) continue;
										const target = await findSourceReplyTranscriptMirrorByMetadata({
											transcriptPath: resolvedTranscriptPath,
											idempotencyKey: mirrorIdempotencyKey,
											metadata: mirrorMetadata
										});
										if (target) allowedSourceReplyMirrorIds.add(target.messageId);
									}
									const rewriteTargets = [];
									for (const request of sourceReplyPersistenceRequests) {
										const target = await findSourceReplyTranscriptMirrorByMetadata({
											transcriptPath: resolvedTranscriptPath,
											idempotencyKey: request.idempotencyKey,
											metadata: request.metadata
										});
										if (target) rewriteTargets.push({
											request,
											...target
										});
									}
									if (rewriteTargets.length > 0) {
										const rewriteTargetIds = new Set(rewriteTargets.map((target) => target.messageId));
										const rewriteIndex = await readSessionTranscriptIndex(resolvedTranscriptPath, { view: "all" });
										const firstRewriteEntryIndex = rewriteIndex?.entries.findIndex((entryValue) => typeof entryValue.id === "string" && rewriteTargetIds.has(entryValue.id)) ?? -1;
										if (firstRewriteEntryIndex >= 0 && rewriteIndex?.entries.slice(firstRewriteEntryIndex).every((entryLocal) => typeof entryLocal.id !== "string" || allowedSourceReplyMirrorIds.has(entryLocal.id)) === true) {
											if ((await rewriteTranscriptEntriesInRuntimeTranscript({
												scope: {
													sessionId,
													sessionKey,
													sessionFile: resolvedTranscriptPath,
													agentId,
													...latestStorePath ? { storePath: latestStorePath } : {}
												},
												request: {
													allowedRewriteSuffixEntryIds: [...allowedSourceReplyMirrorIds],
													replacements: rewriteTargets.map((target) => ({
														entryId: target.messageId,
														message: {
															...target.message,
															idempotencyKey: target.request.idempotencyKey,
															content: target.request.state.persistedContent
														}
													}))
												},
												config: cfg
											})).changed) {
												await advanceSessionTranscriptMarker({
													storePath: latestStorePath,
													sessionKey,
													sessionId
												});
												for (const target of rewriteTargets) await attachSourceReplyManagedImages({
													messageId: (await findSourceReplyTranscriptMirrorByIdempotencyKey(resolvedTranscriptPath, target.request.idempotencyKey))?.messageId,
													request: target.request
												});
											}
										}
									}
								}
								const sourceReplyContent = sourceReplyContentStates.flatMap((state) => {
									if (state.hasManagedOutgoingContent && !state.backedManagedOutgoingContent) {
										const stripped = stripManagedOutgoingAssistantContentBlocks(state.broadcastContent);
										return stripped?.length ? stripped : [{
											type: "text",
											text: "Media reply could not be displayed."
										}];
									}
									return state.broadcastContent;
								}).filter((block) => Boolean(block));
								const sourceReplyText = extractAssistantDisplayTextFromContent(sourceReplyContent) ?? (sourceReplyContent.length === 0 ? displayReply : void 0);
								const nowLocal = Date.now();
								const message = {
									role: "assistant",
									...sourceReplyContent?.length ? { content: sourceReplyContent } : sourceReplyText ? { content: [{
										type: "text",
										text: sourceReplyText
									}] } : {},
									...sourceReplyText ? { text: sourceReplyText } : {},
									timestamp: nowLocal,
									stopReason: "stop",
									usage: {
										input: 0,
										output: 0,
										totalTokens: 0
									}
								};
								if (hasVisibleAssistantFinalMessage(message)) emitFirstAssistantServerTiming();
								broadcastChatFinal({
									context,
									runId: clientRunId,
									sessionKey,
									agentId,
									message
								});
								broadcastedSourceReplyFinal = hasSourceReplyTranscriptMirror;
							}
						}
					}
					const shouldBroadcastAgentError = returnedAgentErrorPayloads.length > 0 && !broadcastedSourceReplyFinal;
					if (shouldBroadcastAgentError) broadcastChatError({
						context,
						runId: clientRunId,
						sessionKey,
						agentId,
						errorMessage: returnedAgentErrorMessage
					});
					if (!context.chatAbortedRuns.has(clientRunId)) {
						const returnedAgentError = shouldBroadcastAgentError ? errorShape(ErrorCodes.UNAVAILABLE, returnedAgentErrorMessage ?? "agent returned an error payload") : void 0;
						setGatewayDedupeEntry({
							dedupe: context.dedupe,
							key: `chat:${clientRunId}`,
							entry: {
								ts: Date.now(),
								ok: !shouldBroadcastAgentError,
								payload: shouldBroadcastAgentError ? {
									runId: clientRunId,
									status: "error",
									summary: returnedAgentErrorMessage ?? "agent returned an error payload"
								} : {
									runId: clientRunId,
									status: "ok"
								},
								...returnedAgentError ? { error: returnedAgentError } : {}
							}
						});
					}
				}, {
					phase: "agent-turn",
					config: cfg,
					attributes: chatSendTraceAttributes
				});
				emitServerTiming("post-dispatch-completed", { postDispatchMs: roundedChatSendTimingMs(performance.now() - postDispatchStartedAtMs) }, dispatchStartedAtMs);
			}).catch(async (err) => {
				const errorMessage = String(err);
				await (userTurnRecorder.hasPersisted() || userTurnRecorder.isBlocked() ? Promise.resolve() : persistGatewayUserTurnTranscript()).catch((transcriptErr) => {
					context.logGateway.warn(`webchat user transcript update failed after error: ${formatForLog(transcriptErr)}`);
				});
				if (!agentRunStarted && !activeRunAbort.controller.signal.aborted && !context.chatAbortedRuns.has(clientRunId)) pendingDispatchLifecycleError = {
					endedAt: Date.now(),
					error: errorMessage,
					sessionId: activeRunAbort.entry?.sessionId ?? backingSessionId ?? clientRunId,
					startedAt: activeRunAbort.entry?.startedAtMs ?? now
				};
				const error = errorShape(ErrorCodes.UNAVAILABLE, errorMessage);
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `chat:${clientRunId}`,
					entry: {
						ts: Date.now(),
						ok: false,
						payload: {
							runId: clientRunId,
							status: "error",
							summary: errorMessage
						},
						error
					}
				});
				broadcastChatError({
					context,
					runId: clientRunId,
					sessionKey,
					agentId,
					errorMessage
				});
			}).finally(() => {
				activeRunAbort.cleanup();
				clearAgentRunContext(clientRunId, lifecycleGeneration);
				clearActiveChatSendDedupeRun(context.dedupe, activeChatSendDedupeKey, clientRunId);
				context.removeChatRun(clientRunId, clientRunId, sessionKey);
				if (!pendingDispatchLifecycleError) return;
				const persistDispatchLifecycleError = async () => {
					const dispatchError = pendingDispatchLifecycleError;
					if (!dispatchError) return;
					if (hasTrackedActiveSessionRun({
						context,
						requestedKey: rawSessionKey,
						canonicalKey: sessionKey,
						...sessionKey === "global" && agentId ? { agentId } : {},
						defaultAgentId: resolveDefaultAgentId(cfg)
					})) return;
					try {
						await persistGatewaySessionLifecycleEvent({
							sessionKey,
							...sessionKey === "global" && agentId ? { agentId } : {},
							event: {
								runId: clientRunId,
								sessionId: dispatchError.sessionId,
								lifecycleGeneration,
								ts: dispatchError.endedAt,
								data: {
									phase: "error",
									startedAt: dispatchError.startedAt,
									endedAt: dispatchError.endedAt,
									error: dispatchError.error
								}
							}
						});
						emitSessionsChanged(context, {
							sessionKey,
							...agentId ? { agentId } : {},
							reason: "chat.dispatch-error"
						});
					} catch (persistErr) {
						context.logGateway.warn(`webchat session lifecycle persist failed after error: ${formatForLog(persistErr)}`);
					}
				};
				persistDispatchLifecycleError();
			});
		} catch (err) {
			activeRunAbort.cleanup({ force: true });
			clearAgentRunContext(clientRunId, lifecycleGeneration);
			clearActiveChatSendDedupeRun(context.dedupe, activeChatSendDedupeKey, clientRunId);
			context.removeChatRun(clientRunId, clientRunId, sessionKey);
			const error = errorShape(ErrorCodes.UNAVAILABLE, String(err));
			const payload = {
				runId: clientRunId,
				status: "error",
				summary: String(err)
			};
			setGatewayDedupeEntry({
				dedupe: context.dedupe,
				key: `chat:${clientRunId}`,
				entry: {
					ts: Date.now(),
					ok: false,
					payload,
					error
				}
			});
			respond(false, payload, error, {
				runId: clientRunId,
				error: formatForLog(err)
			});
			broadcastChatError({
				context,
				runId: clientRunId,
				sessionKey,
				agentId,
				errorMessage: String(err)
			});
		}
	},
	"chat.inject": async ({ params, respond, context }) => {
		if (!validateChatInjectParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid chat.inject params: ${formatValidationErrors(validateChatInjectParams.errors)}`));
			return;
		}
		const p = params;
		const rawSessionKey = p.sessionKey;
		const requestedAgentId = resolveRequestedChatAgentId({
			cfg: context.getRuntimeConfig?.(),
			requestedSessionKey: rawSessionKey,
			agentId: p.agentId
		});
		const { cfg, storePath, entry, canonicalKey: sessionKey } = loadSessionEntry(rawSessionKey, requestedAgentId ? { agentId: requestedAgentId } : void 0);
		const selectedAgent = validateChatSelectedAgent({
			cfg,
			requestedSessionKey: rawSessionKey,
			agentId: requestedAgentId
		});
		if (!selectedAgent.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
			return;
		}
		const sessionId = entry?.sessionId;
		if (!sessionId || !storePath) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session not found"));
			return;
		}
		const agentId = resolveSessionAgentId({
			sessionKey,
			config: cfg,
			agentId: selectedAgent.agentId
		});
		const appended = await appendAssistantTranscriptMessage({
			sessionKey,
			message: p.message,
			label: p.label,
			sessionId,
			storePath,
			sessionFile: entry?.sessionFile,
			agentId,
			createIfMissing: true,
			cfg
		});
		if (!appended.ok || !appended.messageId || !appended.message) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `failed to write transcript: ${appended.error ?? "unknown error"}`));
			return;
		}
		const message = projectChatDisplayMessage(appended.message, { maxChars: resolveEffectiveChatHistoryMaxChars(cfg) });
		const chatPayload = {
			runId: `inject-${appended.messageId}`,
			sessionKey,
			...sessionKey === "global" && agentId ? { agentId } : {},
			seq: 0,
			state: "final",
			message
		};
		context.broadcast("chat", chatPayload);
		sendGlobalAwareNodeChatPayload({
			context,
			sessionKey,
			agentId,
			event: "chat",
			payload: chatPayload
		});
		respond(true, {
			ok: true,
			messageId: appended.messageId
		});
	}
};
//#endregion
export { replaceOversizedChatHistoryMessages as a, enforceChatHistoryFinalBudget as i, buildOversizedHistoryPlaceholder as n, sanitizeChatSendMessageInput as o, chatHandlers as r, CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES as t };
