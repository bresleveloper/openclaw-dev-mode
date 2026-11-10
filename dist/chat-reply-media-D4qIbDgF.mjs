import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { u as openLocalFileSafely } from "./fs-safe-6Z4UiMS4.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as isCloudWorkerPlacementState } from "./session-placement-state-BsPYZ8PU.mjs";
import { D as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { i as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-orsENUww.mjs";
import { o as isAudioFileName, u as mimeTypeFromFilePath } from "./mime-C3j3dfQb.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as combineNonStreamingReplyParts } from "./text-projection-mdP9TY8k.mjs";
import { i as parseInlineDirectives, l as stripInlineDirectiveTagsForDelivery, s as sanitizeReplyDirectiveId } from "./directive-tags-DmdxLrNX.mjs";
import { S as isSuppressedControlReplyText } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-CU53EX1R.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-B41MzEkm.mjs";
import { i as loadIncognitoGatewaySessionEntryReadOnly } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-OPzI_0T6.mjs";
import "./reply-payload-79LnOCyy.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { i as withChannelReadAuthority, t as captureChannelReadAuthority } from "./channel-read-authority-DeXfvJjt.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BdNs7xa2.mjs";
import { n as getAgentScopedMediaLocalRoots, t as appendLocalMediaParentRoots } from "./local-roots-B-x-73co.mjs";
import { s as getMediaDir } from "./store-BOkrav0N.mjs";
import { n as LocalMediaAccessError, r as assertLocalMediaAllowed } from "./local-media-access-D8o0XeaK.mjs";
import { n as resolveAgentScopedOutboundMediaAccess } from "./read-capability-DeAXXMuF.mjs";
import { t as WEBCHAT_LOCAL_MEDIA_MAX_BYTES } from "./configured-max-bytes-BaCve0jk.mjs";
import { l as readSessionWorkerPlacementAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-DJzLYZPW.mjs";
import "./session-utils-CGx9I2of.mjs";
import { i as hasAssistantDisplayMediaContent, l as sanitizeAssistantDisplayText, n as buildAssistantReplyContentFromInputs } from "./chat-assistant-content-D60Lu4da.mjs";
import path from "node:path";
import { assertNoWindowsNetworkPath, safeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/gateway/server-methods/chat-send-command-replies.ts
function readChatSendReplyPayload(input) {
	return input.kind === "raw" ? input.payload : input.plan.payload;
}
function buildTranscriptReplyTextFromInputs(inputs) {
	const chunks = inputs.map((input) => {
		const payload = readChatSendReplyPayload(input);
		if (payload.isReasoning === true) return "";
		const parts = input.kind === "prepared" ? input.plan.parts : resolveSendableOutboundReplyParts(payload);
		const lines = [];
		const parsedText = input.kind === "raw" && payload.text?.includes("[[") ? parseInlineDirectives(payload.text) : void 0;
		const replyToId = sanitizeReplyDirectiveId(payload.replyToId) ?? sanitizeReplyDirectiveId(parsedText?.replyToExplicitId);
		if (replyToId) lines.push(`[[reply_to:${replyToId}]]`);
		else if (payload.replyToCurrent || parsedText?.replyToCurrent) lines.push("[[reply_to_current]]");
		const text = input.kind === "raw" && payload.text ? stripInlineDirectiveTagsForDelivery(payload.text).text : payload.text ?? "";
		if (text.trim() && (input.kind === "prepared" || !isSuppressedControlReplyText(text))) lines.push(text);
		for (const mediaUrl of parts.mediaUrls) {
			if (payload.sensitiveMedia === true) continue;
			const trimmed = mediaUrl.trim();
			if (trimmed) lines.push(`Attachment: ${trimmed}`);
		}
		if ((payload.audioAsVoice || parsedText?.audioAsVoice) && parts.mediaUrls.some((mediaUrl) => isAudioFileName(mediaUrl))) lines.push("[[audio_as_voice]]");
		return lines.join("\n");
	}).filter(Boolean);
	return combineNonStreamingReplyParts(chunks);
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
	try {
		if (/^file:/iu.test(trimmed)) {
			const p = safeFileURLToPath(trimmed);
			return path.isAbsolute(p) ? p : null;
		}
		if (!path.isAbsolute(trimmed)) return null;
		assertNoWindowsNetworkPath(trimmed, "Local media path");
		return trimmed;
	} catch {
		return null;
	}
}
async function readLocalAudioContentBlockForEmbedding(payload, raw, options) {
	if (payload.trustedLocalMedia !== true) return null;
	const resolved = resolveLocalMediaPathForEmbedding(raw);
	if (!resolved || !isAudioFileName(resolved)) return null;
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
	if (!trimmed || trimmed.length > MAX_WEBCHAT_IMAGE_DATA_URL_CHARS) return null;
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
function webchatReplyMediaAuthority(scope, placement) {
	const entry = scope.sessionEntry;
	const workspace = resolveWebchatReplyWorkspace(scope, placement);
	return {
		workspace,
		key: JSON.stringify([
			entry?.sessionId,
			entry?.lifecycleRevision,
			entry?.permissionMode,
			entry?.execNode,
			entry?.repositoryWorkspaceId,
			workspace.remote,
			workspace.workspaceDir,
			resolveWebchatReplyWorkspaceOnly(scope)
		])
	};
}
/** Retain one policy snapshot for both prepared reads and their live custody checks. */
function captureWebchatReplyMediaAuthority(scope, placement) {
	const expected = webchatReplyMediaAuthority(scope, placement);
	return {
		workspace: expected.workspace,
		matches: (sessionEntry, currentPlacement, cfg = scope.cfg) => webchatReplyMediaAuthority({
			...scope,
			sessionEntry,
			cfg
		}, currentPlacement).key === expected.key
	};
}
/** Keep the selected media policy current through the session writer's receipts. */
async function captureWebchatReplyMediaScope(params) {
	const readPlacement = (entry) => entry?.sessionId && !entry.execNode && !entry.repositoryWorkspaceId ? resolveSessionWorkerPlacementContext().workerSessionPlacementService?.getMany([entry.sessionId]).get(entry.sessionId) : void 0;
	let retained;
	let active = true;
	const release = () => {
		active = false;
		retained?.release();
	};
	try {
		const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: params.cfg,
			key: params.sessionKey,
			...params.sessionLoadOptions,
			agentId: params.sessionLoadOptions?.agentId ?? params.agentId,
			onSelected: (target) => {
				const entry = findCanonicalStoreMatch(target.store, target.storeKeys)?.entry;
				retained?.release();
				const selectedAuthority = captureWebchatReplyMediaAuthority({
					...params,
					sessionEntry: entry
				}, void 0);
				const source = target.capturedReadSource;
				if (typeof source?.databaseIdentity === "string") retained = retainPreparedSessionEntryPredicate({
					databaseIdentity: `file:${source.databaseIdentity}`,
					sessionKey: target.canonicalKey,
					entry,
					matches: (_before, after) => selectedAuthority.matches(after, void 0)
				});
			}
		});
		const sessionEntry = loaded.entry;
		const scope = {
			...params,
			sessionEntry,
			readSource: loaded.capturedReadSource
		};
		const selectedAuthority = captureWebchatReplyMediaAuthority(scope, sessionEntry?.sessionId && !sessionEntry.execNode && !sessionEntry.repositoryWorkspaceId ? await readSessionWorkerPlacementAsync({
			context: resolveSessionWorkerPlacementContext(),
			sessionId: sessionEntry.sessionId
		}) : void 0);
		return {
			...scope,
			workspace: selectedAuthority.workspace,
			release,
			prepareRead: () => retained?.prepareRead(),
			assertCurrent: () => {
				params.assertCurrent?.();
				const current = isIncognitoSessionKey(params.sessionKey) ? loadIncognitoGatewaySessionEntryReadOnly(params.sessionKey, params.sessionLoadOptions, params.cfg).entry : sessionEntry;
				if (!active || retained && !retained.isCurrent() || !selectedAuthority.matches(current, readPlacement(current))) throw new Error("Session media access changed before attachment delivery.");
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
/** Keep normalization and grouped content preparation inside one media custody scope. */
async function withPreparedWebchatReplyMedia(params, prepare) {
	const scope = params.scope;
	const sourcePayloads = params.inputs.map(readChatSendReplyPayload);
	const hasMedia = sourcePayloads.some((payload) => resolveSendableOutboundReplyParts(payload).mediaUrls.length > 0);
	const publication = scope.prepareRead();
	if (publication) await publication;
	return await withChannelReadAuthority(scope.assertCurrent, async () => {
		const payloads = await normalizeWebchatReplyMediaPathsForDisplay({
			...scope,
			payloads: sourcePayloads
		});
		const inputsByIndex = params.inputs.map((input, index) => {
			const payload = payloads[index];
			return payload ? replaceChatSendReplyPayload(input, payload) : [];
		});
		const localRoots = hasMedia ? getWebchatReplyMediaLocalRoots({
			...scope,
			storePath: params.storePath
		}) : [];
		return prepare({
			payloads,
			inputsByIndex,
			buildContent: async (inputs) => {
				let managedMediaPrepareFailed = false;
				const mediaMessage = await buildWebchatAssistantMessageFromReplyPayloads(inputs.map(readChatSendReplyPayload), {
					localRoots,
					assertCurrent: captureChannelReadAuthority(),
					onLocalAudioAccessDenied: (err) => {
						params.logGateway?.warn(`webchat audio embedding denied local path: ${formatForLog(err)}`);
					}
				});
				const content = await buildAssistantReplyContentFromInputs({
					sessionKey: params.transcriptTarget?.sessionKey ?? scope.sessionKey,
					agentId: params.transcriptTarget?.agentId ?? scope.agentId,
					inputs,
					transcriptMediaMessage: mediaMessage,
					managedMediaLocalRoots: localRoots,
					assertCurrent: scope.assertCurrent,
					abortSignal: params.abortSignal,
					includeSensitiveMedia: params.includeSensitiveMedia,
					includeSensitiveDisplay: params.includeSensitiveDisplay,
					onManagedMediaPrepareError: (message) => {
						managedMediaPrepareFailed = true;
						params.logGateway?.warn(`webchat media embedding skipped attachment: ${message}`);
					},
					onSensitiveDisplayPrepareError: (message) => {
						params.logGateway?.warn(`webchat sensitive display skipped attachment: ${message}`);
					}
				});
				const broadcastContent = hasAssistantDisplayMediaContent(content.assistantContent) ? content.assistantContent : hasAssistantDisplayMediaContent(mediaMessage?.content) ? mediaMessage?.content : content.assistantContent;
				return {
					...content,
					mediaMessage,
					broadcastContent,
					managedMediaPrepareFailed
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
function resolveWebchatReplyWorkspace(params, placement) {
	const entry = params.sessionEntry;
	const remote = Boolean(entry?.execNode || entry?.deviceFolder || entry?.repositoryWorkspaceId || isCloudWorkerPlacementState(placement?.state));
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
	const { remote, workspaceDir } = params.workspace;
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
	return mediaUrl.trim().toLowerCase().startsWith("data:") || isAudioFileName(mediaUrl) && (isPassThroughRemoteMediaSource(mediaUrl) || payload.trustedLocalMedia === true);
}
/** Normalize reply media paths for webchat display without leaking sensitive media. */
async function normalizeWebchatReplyMediaPathsForDisplay(params) {
	return await withChannelReadAuthority(params.assertCurrent, async () => {
		if (params.payloads.every((payload) => payload.sensitiveMedia === true || resolveSendableOutboundReplyParts(payload).mediaUrls.every((url) => shouldPreserveDisplayMediaUrl(payload, url)))) return params.payloads;
		const { remote, workspaceDir } = params.workspace;
		if (!workspaceDir) return params.payloads;
		const assertCurrent = captureChannelReadAuthority();
		const { createReplyMediaPathNormalizer } = await import("./reply-media-paths-Bt24XrWC.mjs");
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
		}, params.readSource);
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
			const sourceUrls = new Map(getReplyPayloadMetadata(payload)?.replyMediaSourceUrls);
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
				for (const [url, sources] of getReplyPayloadMetadata(normalizedPayload)?.replyMediaSourceUrls ?? []) sourceUrls.set(url, sources);
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
			normalized.push(setReplyPayloadMetadata(merged, {
				replyMediaSourceUrls: sourceUrls,
				...mediaFailures.length > 0 ? { assistantMediaFailures: mediaFailures } : {}
			}));
		}
		return normalized;
	});
}
//#endregion
export { prepareWebchatReplyMediaForDisplay as a, readChatSendReplyPayload as c, normalizeWebchatReplyMediaPathsForDisplay as i, replaceChatSendReplyPayload as l, captureWebchatReplyMediaScope as n, withPreparedWebchatReplyMedia as o, getWebchatReplyMediaLocalRoots as r, buildTranscriptReplyTextFromInputs as s, captureWebchatReplyMediaAuthority as t, selectChatSendFinalReplyInputs as u };
