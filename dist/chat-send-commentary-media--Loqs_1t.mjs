import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as openLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { o as readSessionTranscriptRunId, r as onInternalSessionTranscriptUpdate } from "./transcript-events-DUHAZLVw.mjs";
import { E as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-Ce3gllsX.mjs";
import { c as runWithOwnedSessionTranscriptWrite, i as captureOwnedTranscriptWriteAssertion, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { n as isCloudWorkerPlacementState } from "./session-placement-state-BsPYZ8PU.mjs";
import { o as isAudioFileName, u as mimeTypeFromFilePath } from "./mime-CGDYrRzL.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-CU53EX1R.mjs";
import { s as readAssistantTextBlocksForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { u as rewriteTranscriptMessageAtAnchor } from "./session-accessor-cUVSaeKy.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { i as parseInlineDirectives, s as sanitizeReplyDirectiveId } from "./directive-tags-CHfxUaYi.mjs";
import { n as recordAssistantManagedMediaUrls } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { i as withChannelReadAuthority, t as captureChannelReadAuthority } from "./channel-read-authority-CyorchNP.mjs";
import { n as splitMediaFromOutput } from "./reply-directives-Ciui4dZv.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-RF8yW6z7.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-BtASEhL4.mjs";
import "./reply-payload-DEDOYf-L.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BdNs7xa2.mjs";
import { r as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { n as getAgentScopedMediaLocalRoots, t as appendLocalMediaParentRoots } from "./local-roots-D6JiS64U.mjs";
import { s as getMediaDir } from "./store-A0dMc8iV.mjs";
import { n as LocalMediaAccessError, r as assertLocalMediaAllowed } from "./local-media-access-BBHmTniP.mjs";
import { n as resolveAgentScopedOutboundMediaAccess } from "./read-capability-BtubP49K.mjs";
import { t as WEBCHAT_LOCAL_MEDIA_MAX_BYTES } from "./configured-max-bytes-CtwRSse3.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-98j7PlVT.mjs";
import { r as isSuppressedControlReplyText } from "./control-reply-text-w0dVwMAz.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-BX-eWQU_.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-BvtSgErM.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { a as createManagedOutgoingMediaBlocks, c as prepareOutgoingMediaFromReplyPayload, n as attachManagedOutgoingMediaToMessage, r as buildManagedMediaFailureBlock, u as removeManagedOutgoingMediaBlocks } from "./managed-image-attachments-pHKAEYu_.mjs";
import { n as buildAssistantReplyContentFromInputs, u as sanitizeAssistantDisplayText } from "./chat-assistant-content-RxDjGl2a.mjs";
import { a as publishAssistantTranscriptRewrite } from "./chat-transcript-persistence-DtRxBrt-.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { assertNoWindowsNetworkPath, safeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/gateway/server-methods/chat-send-command-replies.ts
function readChatSendReplyPayload(input) {
	return input.kind === "raw" ? input.payload : input.plan.payload;
}
function replaceChatSendReplyPayload(input, payload) {
	return input.kind === "raw" ? [{
		kind: "raw",
		payload
	}] : createStructuredOutboundPayloadPlan([payload]).map((plan) => ({
		kind: "prepared",
		plan
	}));
}
function parseReplyInlineDirectives(payload) {
	return typeof payload.text === "string" && payload.text.includes("[[") ? parseInlineDirectives(payload.text) : void 0;
}
function replyMediaDedupeKeys(payload) {
	return resolveSendableOutboundReplyParts(payload).mediaUrls.map((mediaUrl) => normalizeMediaReferenceForComparison(mediaUrl));
}
function canonicalizeReplyMedia(payload) {
	const { mediaUrls } = resolveSendableOutboundReplyParts(payload);
	return copyReplyPayloadMetadata(payload, {
		...payload,
		mediaUrl: void 0,
		mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0
	});
}
function mergeDefinedReplySemantics(target, source) {
	const sourceInlineDirectives = parseReplyInlineDirectives(source);
	const sourceReplyToId = sanitizeReplyDirectiveId(source.replyToId) ?? sanitizeReplyDirectiveId(sourceInlineDirectives?.replyToExplicitId);
	const mergedMedia = mergeMediaReplySemantics(target, source, sourceInlineDirectives);
	return copyReplyPayloadMetadata(mergedMedia, {
		...mergedMedia,
		...source.presentation !== void 0 ? { presentation: source.presentation } : {},
		...source.delivery !== void 0 ? { delivery: source.delivery } : {},
		...source.interactive !== void 0 ? { interactive: source.interactive } : {},
		...sourceReplyToId !== void 0 ? { replyToId: sourceReplyToId } : {},
		...source.replyToTag === true || target.replyToTag === true ? { replyToTag: true } : {},
		...source.replyToCurrent === true || sourceInlineDirectives?.replyToCurrent === true || target.replyToCurrent === true ? { replyToCurrent: true } : {},
		...source.spokenText !== void 0 ? { spokenText: source.spokenText } : {},
		...source.ttsSupplement !== void 0 ? { ttsSupplement: source.ttsSupplement } : {},
		...source.isError === true || target.isError === true ? { isError: true } : {},
		...source.channelData !== void 0 ? { channelData: source.channelData } : {}
	});
}
function mergeMediaReplySemantics(target, source, sourceInlineDirectives = parseReplyInlineDirectives(source)) {
	let attachments = target.attachments;
	if (source.attachments?.length) {
		const sourceAttachments = /* @__PURE__ */ new Map();
		for (const { url, attachment } of collectReplyMediaEntries(source)) {
			const key = normalizeMediaReferenceForComparison(url);
			if (attachment && !sourceAttachments.has(key)) sourceAttachments.set(key, attachment);
		}
		attachments = collectReplyMediaEntries(target).map(({ url, attachment }) => {
			const sourceAttachment = sourceAttachments.get(normalizeMediaReferenceForComparison(url));
			if (!sourceAttachment) return attachment ?? {};
			const merged = Object.assign({}, attachment, sourceAttachment);
			for (const field of [
				"path",
				"url",
				"mediaUrl",
				"filePath"
			]) if (merged[field] !== void 0) merged[field] = url;
			return merged;
		});
	}
	return copyReplyPayloadMetadata(target, {
		...target,
		...attachments ? { attachments } : {},
		...source.trustedLocalMedia === true || target.trustedLocalMedia === true ? { trustedLocalMedia: true } : {},
		...source.sensitiveMedia === true || target.sensitiveMedia === true ? { sensitiveMedia: true } : {},
		...source.audioAsVoice === true || sourceInlineDirectives?.audioAsVoice === true || target.audioAsVoice === true ? { audioAsVoice: true } : {}
	});
}
function hasMergeableReplySemantics(payload) {
	const inlineDirectives = parseReplyInlineDirectives(payload);
	return Boolean(payload.trustedLocalMedia !== void 0 || payload.sensitiveMedia !== void 0 || payload.presentation || payload.delivery || payload.interactive || payload.replyToId || payload.replyToTag !== void 0 || payload.replyToCurrent !== void 0 || payload.audioAsVoice !== void 0 || inlineDirectives?.hasReplyTag || inlineDirectives?.hasAudioTag || payload.spokenText || payload.ttsSupplement || payload.isError !== void 0 || payload.channelData);
}
function hasUnmergedReplySemantics(payload) {
	return Boolean(payload.isReasoning || payload.isReasoningSnapshot || payload.isCompactionNotice || payload.isFallbackNotice || payload.isStatusNotice || payload.btw);
}
function mediaSetsMatch(leftMediaUrls, rightMediaUrls) {
	return leftMediaUrls.length === rightMediaUrls.length && leftMediaUrls.every((mediaUrl, index) => mediaUrl === rightMediaUrls[index]);
}
function replyDisplayText(payload) {
	return sanitizeAssistantDisplayText(payload.text) ?? "";
}
/** Folds raw command replies while preserving each prepared reply's ownership. */
function selectChatSendFinalReplyInputs(params) {
	const { deliveredReplies, foldCommandBlocks, suppressReplies } = params;
	const finalInputs = deliveredReplies.filter((entry) => entry.kind === "final").map((entry) => entry.input);
	let commandBlockInputs = foldCommandBlocks ? deliveredReplies.filter((entry) => entry.kind === "block").map(({ input }) => input.kind === "raw" ? {
		kind: "raw",
		payload: canonicalizeReplyMedia(input.payload)
	} : input) : [];
	const sensitiveMediaDedupeKeys = new Set(finalInputs.flatMap((input) => {
		const payload = readChatSendReplyPayload(input);
		return payload.sensitiveMedia === true ? replyMediaDedupeKeys(payload).filter(Boolean) : [];
	}));
	if (sensitiveMediaDedupeKeys.size > 0) commandBlockInputs = commandBlockInputs.flatMap((input) => {
		const payload = readChatSendReplyPayload(input);
		if (!replyMediaDedupeKeys(payload).some((key) => sensitiveMediaDedupeKeys.has(key))) return [input];
		const sensitivePayload = {
			...payload,
			sensitiveMedia: true
		};
		return replaceChatSendReplyPayload(input, copyReplyPayloadMetadata(payload, sensitivePayload));
	});
	const finalInputsForDelivery = foldCommandBlocks ? finalInputs.flatMap((input) => {
		if (input.kind === "prepared") return [input];
		const payload = input.payload;
		const { mediaUrls: finalMediaUrls } = resolveSendableOutboundReplyParts(payload);
		const finalMediaKeys = replyMediaDedupeKeys(payload);
		const finalDisplayText = replyDisplayText(payload);
		const matchingMediaBlock = finalMediaUrls.length > 0 ? commandBlockInputs.find((candidate) => candidate.kind === "raw" && mediaSetsMatch(replyMediaDedupeKeys(candidate.payload), finalMediaKeys)) : void 0;
		const duplicateBlock = finalDisplayText ? commandBlockInputs.find((candidate) => candidate.kind === "raw" && replyDisplayText(candidate.payload) === finalDisplayText && (finalMediaUrls.length === 0 || mediaSetsMatch(replyMediaDedupeKeys(candidate.payload), finalMediaKeys))) : matchingMediaBlock;
		if (duplicateBlock?.kind === "raw") duplicateBlock.payload = mergeDefinedReplySemantics(duplicateBlock.payload, payload);
		else if (matchingMediaBlock?.kind === "raw") matchingMediaBlock.payload = mergeMediaReplySemantics(matchingMediaBlock.payload, payload);
		const remainingFinalMediaUrls = matchingMediaBlock ? [] : finalMediaUrls;
		if (remainingFinalMediaUrls.length === 0 && (duplicateBlock && !hasUnmergedReplySemantics(payload) || !duplicateBlock && !finalDisplayText && !hasMergeableReplySemantics(payload) && !hasUnmergedReplySemantics(payload))) return [];
		return [{
			kind: "raw",
			payload: copyReplyPayloadMetadata(payload, {
				...payload,
				mediaUrl: void 0,
				mediaUrls: remainingFinalMediaUrls.length > 0 ? remainingFinalMediaUrls : void 0
			})
		}];
	}) : finalInputs;
	if (suppressReplies) return [];
	return [...commandBlockInputs, ...finalInputsForDelivery];
}
//#endregion
//#region src/gateway/server-methods/chat-webchat-media.ts
/** Cap local audio files exposed through assistant media. */
const MAX_WEBCHAT_AUDIO_BYTES = 15728640;
const MAX_WEBCHAT_IMAGE_DATA_URL_CHARS = 2e6;
const MAX_WEBCHAT_IMAGE_DATA_BYTES = 15e5;
const ALLOWED_WEBCHAT_DATA_IMAGE_MEDIA_TYPES = /* @__PURE__ */ new Set([
	"image/apng",
	"image/avif",
	"image/bmp",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
/** Map `mediaUrl` strings to an absolute filesystem path for local embedding (plain paths or `file:` URLs). */
function resolveLocalMediaPathForEmbedding(raw) {
	const trimmed = raw.trim();
	if (!trimmed || /^(?:data|https?):/i.test(trimmed)) return null;
	if (/^file:/iu.test(trimmed)) try {
		const p = safeFileURLToPath(trimmed);
		return path.isAbsolute(p) ? p : null;
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
		options?.assertCurrent?.();
		await assertLocalMediaAllowed(resolved, options?.localRoots);
		options?.assertCurrent?.();
		opened = await openLocalFileSafely({ filePath: resolved });
		await assertLocalMediaAllowed(opened.realPath, options?.localRoots);
		options?.assertCurrent?.();
		if (opened.stat.size > MAX_WEBCHAT_AUDIO_BYTES) return null;
		return {
			path: opened.realPath,
			block: {
				type: "attachment",
				attachment: {
					url: opened.realPath,
					kind: "audio",
					label: path.basename(opened.realPath),
					mimeType: mimeTypeFromFilePath(opened.realPath) ?? "audio/mpeg",
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
function resolveEmbeddableImageUrl(url) {
	const trimmed = url.trim();
	if (!trimmed) return null;
	if (trimmed.length > MAX_WEBCHAT_IMAGE_DATA_URL_CHARS) return null;
	const commaIndex = trimmed.indexOf(",");
	if (commaIndex < 0) return null;
	const metadata = trimmed.slice(0, commaIndex);
	const match = /^data:(image\/[a-z0-9.+-]+);base64$/i.exec(metadata);
	const base64Data = trimmed.slice(commaIndex + 1);
	if (!match || !base64Data || /[^A-Za-z0-9+/=\t\n\v\f\r ]/u.test(base64Data)) return null;
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
function mediaReplyText(hasAudio, hasImage) {
	return hasAudio && hasImage ? "Media reply" : hasAudio ? "Audio reply" : "Image reply";
}
async function buildWebchatAssistantMessageFromReplyPayloads(payloads, options) {
	const content = [];
	const transcriptTextParts = [];
	const payloadTexts = [];
	const seenAudio = /* @__PURE__ */ new Set();
	const seenImages = /* @__PURE__ */ new Set();
	for (const [payloadIndex, payload] of payloads.entries()) {
		if (payload.isReasoning === true) continue;
		const visibleText = payload.text?.trim();
		const text = visibleText && !isSuppressedControlReplyText(visibleText) ? visibleText : void 0;
		const replyDirectivePrefix = resolveReplyDirectivePrefix(payload);
		let payloadHasAudio = false;
		let payloadHasImage = false;
		const payloadMediaBlocks = [];
		const parts = resolveSendableOutboundReplyParts(payload);
		for (const raw of parts.mediaUrls) {
			const url = raw.trim();
			if (!url) continue;
			const audio = await readLocalAudioContentBlockForEmbedding(payload, url, options);
			if (audio && !seenAudio.has(audio.path)) {
				seenAudio.add(audio.path);
				payloadMediaBlocks.push(audio.block);
				payloadHasAudio = true;
				continue;
			}
			const imageUrl = resolveEmbeddableImageUrl(url);
			if (!imageUrl || seenImages.has(imageUrl)) continue;
			seenImages.add(imageUrl);
			payloadMediaBlocks.push({
				type: "input_image",
				image_url: imageUrl
			});
			payloadHasImage = true;
		}
		const syntheticText = payloadMediaBlocks.length > 0 && (!text || replyDirectivePrefix) && transcriptTextParts.length === 0 ? mediaReplyText(payloadHasAudio, payloadHasImage) : void 0;
		const fullText = replyDirectivePrefix + (text ?? syntheticText ?? "");
		if (fullText) {
			transcriptTextParts.push(fullText);
			payloadTexts[payloadIndex] = fullText;
			content.push({
				type: "text",
				text: fullText
			});
		}
		content.push(...payloadMediaBlocks);
	}
	if (seenAudio.size === 0 && seenImages.size === 0) return null;
	const transcriptText = transcriptTextParts.join("\n\n").trim() || mediaReplyText(seenAudio.size > 0, seenImages.size > 0);
	if (transcriptTextParts.length === 0) content.unshift({
		type: "text",
		text: transcriptText
	});
	return {
		content,
		transcriptText,
		payloadTexts
	};
}
//#endregion
//#region src/gateway/server-methods/chat-reply-media.ts
function resolveRequesterPolicyContext(requester) {
	return {
		requesterSenderId: requester?.SenderId,
		requesterSenderName: requester?.SenderName,
		requesterSenderUsername: requester?.SenderUsername,
		requesterSenderE164: requester?.SenderE164,
		groupChannel: requester?.GroupChannel,
		groupSpace: requester?.GroupSpace,
		messageProvider: requester?.Surface ?? requester?.Provider
	};
}
/** Bind reads to the source session; reread its owner after every awaited file operation. */
function captureWebchatReplyMediaScope(params) {
	const readEntry = () => loadGatewaySessionEntry(params.sessionKey, params.sessionLoadOptions).entry;
	const sessionEntry = readEntry();
	const scope = {
		...params,
		sessionEntry: sessionEntry ? { ...sessionEntry } : void 0
	};
	const authority = (entry) => {
		const currentScope = {
			...scope,
			sessionEntry: entry
		};
		const workspace = resolveWebchatReplyWorkspace(currentScope);
		return JSON.stringify([
			entry?.sessionId,
			entry?.lifecycleRevision,
			entry?.permissionMode,
			entry?.execNode,
			entry?.repositoryWorkspaceId,
			workspace.remote,
			workspace.workspaceDir,
			resolveWebchatReplyWorkspaceOnly(currentScope)
		]);
	};
	const expected = authority(scope.sessionEntry);
	return {
		...scope,
		assertCurrent: () => {
			params.assertCurrent?.();
			if (authority(readEntry()) !== expected) throw new Error("Session media access changed before attachment delivery.");
		}
	};
}
/** Keep normalization and grouped content preparation inside one media custody scope. */
async function withPreparedWebchatReplyMedia(params, prepare) {
	const scope = params.scope;
	const sourcePayloads = params.inputs.map(readChatSendReplyPayload);
	const hasMedia = sourcePayloads.some((payload) => resolveSendableOutboundReplyParts(payload).mediaUrls.length > 0);
	return await withChannelReadAuthority(scope.assertCurrent, async () => {
		const payloads = await normalizeWebchatReplyMediaPathsForDisplay({
			...scope,
			payloads: sourcePayloads
		});
		const inputsByIndex = params.inputs.map((input, index) => {
			const payload = payloads[index];
			return payload ? replaceChatSendReplyPayload(input, payload) : [];
		});
		const localRoots = getWebchatReplyMediaLocalRoots({
			...scope,
			storePath: params.storePath
		});
		return prepare({
			payloads,
			inputsByIndex,
			buildContent: async (inputs) => {
				const mediaMessage = await buildWebchatAssistantMessageFromReplyPayloads(inputs.map(readChatSendReplyPayload), {
					localRoots,
					assertCurrent: captureChannelReadAuthority(),
					onLocalAudioAccessDenied: params.onLocalAudioAccessDenied
				});
				return {
					...await buildAssistantReplyContentFromInputs({
						sessionKey: params.transcriptTarget?.sessionKey ?? scope.sessionKey,
						agentId: params.transcriptTarget?.agentId ?? scope.agentId,
						inputs,
						transcriptMediaMessage: mediaMessage,
						managedMediaLocalRoots: localRoots,
						assertCurrent: scope.assertCurrent,
						abortSignal: params.abortSignal,
						includeSensitiveMedia: params.includeSensitiveMedia,
						includeSensitiveDisplay: params.includeSensitiveDisplay,
						onManagedMediaPrepareError: params.onManagedMediaPrepareError,
						onSensitiveDisplayPrepareError: params.onSensitiveDisplayPrepareError
					}),
					mediaMessage
				};
			}
		});
	}, hasMedia ? params.abortSignal : void 0);
}
async function prepareWebchatReplyMediaForDisplay(params) {
	return withPreparedWebchatReplyMedia(params, async ({ payloads, inputsByIndex, buildContent }) => {
		const inputs = inputsByIndex.flat();
		return {
			...await buildContent(inputs),
			inputs,
			payloads
		};
	});
}
function resolveWebchatReplyWorkspace(params) {
	const entry = params.sessionEntry;
	const placement = entry?.sessionId && !entry.execNode && !entry.repositoryWorkspaceId ? resolveSessionWorkerPlacementContext().workerSessionPlacementService?.getMany([entry.sessionId]).get(entry.sessionId) : void 0;
	const remote = Boolean(entry?.execNode || entry?.repositoryWorkspaceId || isCloudWorkerPlacementState(placement?.state));
	return {
		remote,
		workspaceDir: !remote && entry ? entry.sessionRoot ?? resolveSessionWorkspaceRoots(params.cfg, params.agentId, entry).root : resolveAgentWorkspaceDir(params.cfg, params.agentId)
	};
}
function resolveWebchatReplyWorkspaceOnly(params) {
	const mode = params.sessionEntry?.permissionMode;
	return mode ? resolveSessionPermissionCoreToolPolicy({ mode }).workspaceOnly : resolveEffectiveToolFsWorkspaceOnly(params);
}
/** Trusted audio bypasses staging, but its reader must use the same session workspace. */
function getWebchatReplyMediaLocalRoots(params) {
	const { remote, workspaceDir } = resolveWebchatReplyWorkspace(params);
	if (remote) return [getMediaDir()];
	const workspaceRoots = getAgentScopedMediaLocalRoots(params.cfg, params.agentId, workspaceDir);
	const roots = resolveWebchatReplyWorkspaceOnly(params) ? workspaceRoots : [.../* @__PURE__ */ new Set([...getAgentScopedMediaLocalRoots(params.cfg, params.agentId), ...workspaceRoots])];
	return resolveAgentScopedOutboundMediaAccess({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		accountId: params.accountId,
		workspaceDir,
		workspaceOnly: resolveWebchatReplyWorkspaceOnly(params),
		mediaAccess: { localRoots: appendLocalMediaParentRoots(roots, params.storePath ? [params.storePath] : void 0) },
		...resolveRequesterPolicyContext(params.requesterContext)
	}).localRoots ?? [];
}
function shouldPreserveDisplayMediaUrl(payload, mediaUrl) {
	if (mediaUrl.trim().toLowerCase().startsWith("data:")) return true;
	if (!isAudioFileName(mediaUrl)) return false;
	if (isPassThroughRemoteMediaSource(mediaUrl)) return true;
	return payload.trustedLocalMedia === true;
}
/** Normalize reply media paths for webchat display without leaking sensitive media. */
async function normalizeWebchatReplyMediaPathsForDisplay(params) {
	return await withChannelReadAuthority(params.assertCurrent, async () => {
		if (params.payloads.every((payload) => payload.sensitiveMedia === true || resolveSendableOutboundReplyParts(payload).mediaUrls.every((url) => shouldPreserveDisplayMediaUrl(payload, url)))) return params.payloads;
		const { remote, workspaceDir } = resolveWebchatReplyWorkspace(params);
		if (!workspaceDir) return params.payloads;
		const assertCurrent = captureChannelReadAuthority();
		const { createReplyMediaPathNormalizer } = await import("./reply-media-paths.runtime.js");
		assertCurrent?.();
		const workspaceOnly = resolveWebchatReplyWorkspaceOnly(params);
		const normalizeMediaPaths = createReplyMediaPathNormalizer({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			workspaceDir,
			sessionWorkspaceDir: workspaceOnly && !remote ? workspaceDir : void 0,
			workspaceOnly,
			allowHostWorkspace: !remote,
			accountId: params.accountId,
			...resolveRequesterPolicyContext(params.requesterContext),
			localMediaMaxBytes: WEBCHAT_LOCAL_MEDIA_MAX_BYTES
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
			const mergedAttachments = [];
			const previousMediaFailures = getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? [];
			const mediaFailures = [...previousMediaFailures];
			let text = payload.text;
			for (const { url: mediaUrl, attachment } of collectReplyMediaEntries(payload, mediaUrls)) {
				if (shouldPreserveDisplayMediaUrl(payload, mediaUrl)) {
					mergedMediaUrls.push(mediaUrl);
					mergedAttachments.push(attachment ?? {});
					continue;
				}
				const normalizedPayload = await normalizeMediaPaths(copyReplyPayloadMetadata(payload, {
					...payload,
					text,
					mediaUrl,
					mediaUrls: [mediaUrl],
					attachments: attachment ? [attachment] : void 0
				}));
				const normalizedMediaUrls = resolveSendableOutboundReplyParts(normalizedPayload).mediaUrls;
				mediaFailures.push(...(getReplyPayloadMetadata(normalizedPayload)?.assistantMediaFailures ?? []).slice(previousMediaFailures.length));
				text = normalizedPayload.text;
				if (normalizedMediaUrls.length === 0) continue;
				mergedMediaUrls.push(...normalizedMediaUrls);
				mergedAttachments.push(...normalizedPayload.attachments ?? normalizedMediaUrls.map(() => ({})));
			}
			const merged = copyReplyPayloadMetadata(payload, {
				...payload,
				text,
				mediaUrl: mergedMediaUrls[0],
				mediaUrls: mergedMediaUrls,
				attachments: mergedAttachments
			});
			normalized.push(mediaFailures.length > 0 ? setReplyPayloadMetadata(merged, { assistantMediaFailures: mediaFailures }) : merged);
		}
		return normalized;
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-commentary-media.ts
/** Own authored progress attachments while the caller retains its admitted run. */
function createAssistantCommentaryMediaCustody(params) {
	let preparingTranscript = false;
	let lastRewrite;
	const prepareAssistantTranscriptMessage = (message, sourceText) => {
		if (!preparingTranscript || !params.isCurrent() || params.abortSignal?.aborted || !sourceText) return message;
		const prepared = recordAssistantManagedMediaUrls(message, splitMediaFromOutput(sourceText).mediaUrls);
		return params.prepareAssistantTranscriptMessage?.(prepared, sourceText) ?? prepared;
	};
	return {
		prepareAssistantTranscriptMessage,
		get lastRewrite() {
			return lastRewrite;
		},
		async run(operation) {
			lastRewrite = void 0;
			preparingTranscript = true;
			const observer = observeChatSendCommentaryMedia(params);
			try {
				return await operation();
			} finally {
				preparingTranscript = false;
				lastRewrite = await observer.close();
			}
		}
	};
}
/** Materialize committed progress attachments within the same admitted Gateway run. */
function observeChatSendCommentaryMedia(params) {
	const { session } = params;
	const seen = /* @__PURE__ */ new Set();
	let pending = Promise.resolve();
	let lastRewrite;
	const reportPreparationFailure = (error) => {
		if (!(error instanceof SessionTranscriptWriterClaimReboundError)) params.logGateway.warn(`webchat commentary media preparation failed: ${formatForLog(error)}`);
	};
	const unsubscribe = onInternalSessionTranscriptUpdate((update) => {
		const message = asOptionalRecord(update.message);
		const target = update.target;
		const messageId = update.messageId;
		if (!target || target.sessionKey !== session.sessionKey || target.agentId !== session.agentId || !messageId || message?.role !== "assistant" || readSessionTranscriptRunId(message) !== params.getRunId() || !params.isCurrent() || !Array.isArray(message.content) || Array.isArray(message["openclawDisplayContent"])) return;
		const delivery = asOptionalRecord(message.openclawDelivery);
		const authoredMedia = new Set(Array.isArray(delivery?.mediaUrls) ? delivery.mediaUrls.filter((url) => typeof url === "string") : []);
		const commentaryBlocks = new Set(readAssistantTextBlocksForPhase(message, "commentary"));
		const commentaryIndexes = /* @__PURE__ */ new Set();
		const mediaUrls = Array.from(new Set(message.content.flatMap((value, index) => {
			const block = asOptionalRecord(value);
			if (commentaryBlocks.has(value)) commentaryIndexes.add(index);
			return block && commentaryIndexes.has(index) && typeof block.text === "string" ? (splitMediaFromOutput(block.text).mediaUrls ?? []).filter((url) => authoredMedia.has(url)) : [];
		})));
		const key = `${target.sessionId}:${messageId}`;
		if (mediaUrls.length === 0 || seen.has(key)) return;
		seen.add(key);
		const runId = params.getRunId();
		const current = loadGatewaySessionEntry(session.sessionKey, session.sessionLoadOptions);
		if (current.entry?.sessionId !== target.sessionId) return;
		const lifecycleRevision = current.entry.lifecycleRevision;
		const scope = {
			...target,
			storePath: current.storePath
		};
		const assertOwned = captureOwnedTranscriptWriteAssertion(scope);
		const assertCurrent = () => {
			assertOwned();
			const latest = loadGatewaySessionEntry(session.sessionKey, session.sessionLoadOptions);
			if (!params.isCurrent() || params.abortSignal?.aborted || params.getRunId() !== runId || latest.entry?.sessionId !== scope.sessionId || latest.entry.lifecycleRevision !== lifecycleRevision) throw new SessionTranscriptWriterClaimReboundError();
		};
		const originalContent = structuredClone(message.content);
		const previous = pending;
		pending = runWithOwnedSessionTranscriptWrite({ sessionTarget: scope }, () => previous.then(async () => {
			assertCurrent();
			let anchor = readActiveTranscriptEntryAnchor({
				...scope,
				entryId: messageId
			});
			if (!anchor) {
				const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
				await waitForSessionTranscriptProjection(scope, params.abortSignal);
				assertCurrent();
				anchor = readActiveTranscriptEntryAnchor({
					...scope,
					entryId: messageId
				});
			}
			if (!anchor) return;
			const managedMedia = /* @__PURE__ */ new Map();
			let committed = false;
			try {
				const mediaScope = captureWebchatReplyMediaScope({
					requesterContext: params.requesterContext,
					cfg: session.cfg,
					sessionKey: scope.sessionKey,
					agentId: scope.agentId,
					sessionLoadOptions: session.sessionLoadOptions,
					accountId: params.accountId,
					assertCurrent
				});
				await withChannelReadAuthority(mediaScope.assertCurrent, async () => {
					const payloads = await normalizeWebchatReplyMediaPathsForDisplay({
						...mediaScope,
						payloads: mediaUrls.map((url) => ({ mediaUrls: [url] }))
					});
					assertCurrent();
					for (const [index, payload] of payloads.entries()) {
						const blocks = await createManagedOutgoingMediaBlocks({
							sessionKey: scope.sessionKey,
							agentId: scope.agentId,
							items: prepareOutgoingMediaFromReplyPayload(payload),
							localRoots: getWebchatReplyMediaLocalRoots(mediaScope),
							continueOnPrepareError: true,
							assertCurrent: mediaScope.assertCurrent,
							abortSignal: params.abortSignal
						});
						blocks.push(...(getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? []).map(buildManagedMediaFailureBlock));
						managedMedia.set(mediaUrls[index], blocks);
						assertCurrent();
					}
				});
				const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
				await waitForSessionTranscriptProjection(scope, params.abortSignal);
				assertCurrent();
				const rewritten = await rewriteTranscriptMessageAtAnchor(anchor, (value) => {
					assertCurrent();
					const active = readActiveTranscriptEntryAnchor({
						...scope,
						entryId: messageId
					});
					const currentMessage = asOptionalRecord(value);
					if (active?.rawSeq !== anchor.rawSeq || !currentMessage || readSessionTranscriptRunId(currentMessage) !== runId || !isDeepStrictEqual(currentMessage.content, originalContent)) return;
					const displayContent = [];
					for (const [index, raw] of originalContent.entries()) {
						const block = asOptionalRecord(raw);
						if (!block || !commentaryIndexes.has(index) || typeof block.text !== "string") {
							displayContent.push(raw);
							continue;
						}
						const segments = splitMediaFromOutput(block.text).segments ?? [{
							type: "text",
							text: block.text
						}];
						displayContent.push({
							...block,
							text: ""
						});
						for (const segment of segments) if (segment.type === "text") displayContent.push({
							...block,
							text: segment.text
						});
						else displayContent.push(...managedMedia.get(segment.url) ?? [{
							...block,
							text: `MEDIA:${segment.url}`
						}]);
					}
					return {
						...currentMessage,
						[ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent
					};
				});
				if (rewritten) {
					committed = true;
					lastRewrite = {
						sessionId: scope.sessionId,
						generation: rewritten.generation
					};
					const mediaBlocks = [...managedMedia.values()].flat().filter((block) => block.type === "image" || block.type === "audio" || block.type === "video" || block.type === "attachment");
					if (mediaBlocks.length > 0 && !await attachManagedOutgoingMediaToMessage({
						messageId,
						blocks: mediaBlocks
					})) throw new Error("Webchat commentary media ownership could not be persisted");
					await publishAssistantTranscriptRewrite({
						scope,
						rewritten: [{ messageId }]
					});
				}
			} finally {
				if (!committed) await removeManagedOutgoingMediaBlocks({
					blocks: [...managedMedia.values()].flat(),
					messageId: null
				});
			}
		}).catch(reportPreparationFailure)).catch(reportPreparationFailure);
	});
	return { async close() {
		unsubscribe();
		await pending;
		return lastRewrite;
	} };
}
//#endregion
export { readChatSendReplyPayload as a, withPreparedWebchatReplyMedia as i, captureWebchatReplyMediaScope as n, replaceChatSendReplyPayload as o, prepareWebchatReplyMediaForDisplay as r, selectChatSendFinalReplyInputs as s, createAssistantCommentaryMediaCustody as t };
