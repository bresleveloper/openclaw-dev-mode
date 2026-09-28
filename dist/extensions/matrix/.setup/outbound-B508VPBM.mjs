import { i as sendPollMatrix, r as sendMessageMatrix } from "./send-aVdC5NJO.mjs";
import { createMessageReceiptFromOutboundResults, createReplyToFanout, resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { attachChannelToResult } from "openclaw/plugin-sdk/channel-send-result";
import { renderMessagePresentationFallbackText, renderPresentationForDelivery } from "openclaw/plugin-sdk/interactive-runtime";
import { resolveSendableOutboundReplyParts, sendPayloadMediaSequence } from "openclaw/plugin-sdk/reply-payload";
//#region extensions/matrix/src/outbound.ts
const MATRIX_OPENCLAW_PRESENTATION_KEY = "com.openclaw.presentation";
const MATRIX_OPENCLAW_PRESENTATION_TYPE = "message.presentation";
const MATRIX_EMPTY_PRESENTATION_FALLBACK_TEXT = "---";
const MATRIX_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	divider: true,
	limits: { text: {
		markdownDialect: "markdown",
		supportsEdit: true
	} }
};
function toMatrixOutboundResult(result) {
	const { roomId, ...delivery } = result;
	return {
		...delivery,
		target: {
			kind: "room",
			id: roomId
		}
	};
}
function resolveMatrixChannelData(payload) {
	const raw = asOptionalRecord(payload.channelData)?.matrix;
	return asOptionalRecord(raw) ?? {};
}
function buildMatrixPresentationContent(presentation) {
	return {
		...presentation,
		version: 1,
		type: MATRIX_OPENCLAW_PRESENTATION_TYPE
	};
}
function resolveMatrixPresentationContent(payload) {
	const extraContent = asOptionalRecord(resolveMatrixChannelData(payload).extraContent);
	const presentation = asOptionalRecord(extraContent?.[MATRIX_OPENCLAW_PRESENTATION_KEY]);
	if (!presentation || presentation.version !== 1 || presentation.type !== MATRIX_OPENCLAW_PRESENTATION_TYPE) return;
	return presentation;
}
function renderMatrixPresentationPayload(params) {
	const matrixData = resolveMatrixChannelData(params.payload);
	const fallbackText = renderMessagePresentationFallbackText({
		text: params.payload.text,
		presentation: params.presentation,
		emptyFallback: MATRIX_EMPTY_PRESENTATION_FALLBACK_TEXT
	});
	return {
		...params.payload,
		text: fallbackText,
		channelData: {
			...params.payload.channelData,
			matrix: {
				...matrixData,
				extraContent: { [MATRIX_OPENCLAW_PRESENTATION_KEY]: buildMatrixPresentationContent(params.presentation) }
			}
		}
	};
}
function prepareMatrixReplyPayload(payload) {
	return renderPresentationForDelivery({
		presentationCapabilities: MATRIX_PRESENTATION_CAPABILITIES,
		renderPresentation: (prepared) => renderMatrixPresentationPayload({
			payload: prepared,
			presentation: prepared.presentation
		})
	}, payload);
}
function resolveMatrixPayloadText(payload) {
	const text = payload.text ?? "";
	if (text.trim() || !resolveMatrixPresentationContent(payload)) return text;
	return MATRIX_EMPTY_PRESENTATION_FALLBACK_TEXT;
}
/** Matrix event fields a reply carries beyond its body, currently its presentation. */
function resolveMatrixExtraContent(payload) {
	const presentation = resolveMatrixPresentationContent(payload);
	return presentation ? { [MATRIX_OPENCLAW_PRESENTATION_KEY]: presentation } : void 0;
}
function resolveMatrixDeliveryProgress(onDeliveryResult) {
	return onDeliveryResult ? async (result) => {
		await onDeliveryResult(attachChannelToResult("matrix", toMatrixOutboundResult(result)));
	} : void 0;
}
const matrixOutbound = {
	deliveryMode: "direct",
	chunker: chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: 4e3,
	presentationCapabilities: MATRIX_PRESENTATION_CAPABILITIES,
	renderPresentation: ({ payload, presentation }) => renderMatrixPresentationPayload({
		payload,
		presentation
	}),
	sendPayload: async ({ cfg, to, payload, mediaLocalRoots, mediaReadFile, mediaAccess, deps, replyToId, replyToIdSource, replyToMode, threadId, accountId, audioAsVoice, deliveryQueueId, signal, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) => {
		const send = resolveOutboundSendDep(deps, "matrix") ?? sendMessageMatrix;
		const resolvedThreadId = threadId !== void 0 && threadId !== null ? String(threadId) : void 0;
		const resolveReplyToId = createReplyToFanout({
			...replyToId != null ? { replyToId } : {},
			...replyToIdSource !== void 0 ? { replyToIdSource } : {},
			...replyToMode !== void 0 ? { replyToMode } : {}
		});
		const urls = resolveSendableOutboundReplyParts(payload).mediaUrls;
		const payloadText = resolveMatrixPayloadText(payload);
		if (urls.length > 0) {
			const sentResults = [];
			const lastResult = await sendPayloadMediaSequence({
				text: payloadText,
				mediaUrls: urls,
				send: async ({ text, mediaUrl, index, isFirst }) => await send(to, text, {
					cfg,
					mediaUrl,
					mediaAccess,
					mediaLocalRoots,
					mediaReadFile,
					replyToId: resolveReplyToId(),
					threadId: resolvedThreadId,
					accountId: accountId ?? void 0,
					audioAsVoice: payload.audioAsVoice ?? audioAsVoice,
					deliveryQueueId,
					deliveryPartIndex: index,
					deliveryPartCount: urls.length,
					signal,
					assertDirectAdapterHandoff,
					onPlatformSendDispatch,
					extraContent: isFirst ? resolveMatrixExtraContent(payload) : void 0,
					onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
				}),
				onResult: (result) => {
					sentResults.push(result);
				}
			});
			if (lastResult !== void 0) {
				const receipt = createMessageReceiptFromOutboundResults({ results: sentResults });
				receipt.parts = receipt.parts.map((part, index) => ({
					...part,
					index
				}));
				return attachChannelToResult("matrix", toMatrixOutboundResult({
					...lastResult,
					primaryMessageId: receipt.primaryPlatformMessageId,
					receipt,
					content: sentResults.map((result) => result.content).join("\n")
				}));
			}
		}
		const result = await send(to, payloadText, {
			cfg,
			mediaAccess,
			mediaLocalRoots,
			mediaReadFile,
			replyToId: resolveReplyToId(),
			threadId: resolvedThreadId,
			accountId: accountId ?? void 0,
			audioAsVoice: payload.audioAsVoice ?? audioAsVoice,
			deliveryQueueId,
			deliveryPartIndex: 0,
			deliveryPartCount: 1,
			signal,
			assertDirectAdapterHandoff,
			onPlatformSendDispatch,
			extraContent: resolveMatrixExtraContent(payload),
			onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
		});
		return attachChannelToResult("matrix", toMatrixOutboundResult(result));
	},
	sendText: async ({ cfg, to, text, deps, replyToId, threadId, accountId, audioAsVoice, deliveryQueueId, deliveryPartIndex, deliveryPartCount, signal, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) => {
		const result = await (resolveOutboundSendDep(deps, "matrix") ?? sendMessageMatrix)(to, text, {
			cfg,
			replyToId: replyToId ?? void 0,
			threadId: threadId !== void 0 && threadId !== null ? String(threadId) : void 0,
			accountId: accountId ?? void 0,
			audioAsVoice,
			deliveryQueueId,
			deliveryPartIndex,
			...deliveryQueueId !== void 0 ? { deliveryPartCount } : {},
			signal,
			assertDirectAdapterHandoff,
			onPlatformSendDispatch,
			onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
		});
		return attachChannelToResult("matrix", toMatrixOutboundResult(result));
	},
	sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, mediaReadFile, mediaAccess, deps, replyToId, threadId, accountId, audioAsVoice, deliveryQueueId, deliveryPartIndex, deliveryPartCount, signal, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) => {
		const result = await (resolveOutboundSendDep(deps, "matrix") ?? sendMessageMatrix)(to, text, {
			cfg,
			mediaUrl,
			mediaLocalRoots,
			mediaReadFile,
			mediaAccess,
			replyToId: replyToId ?? void 0,
			threadId: threadId !== void 0 && threadId !== null ? String(threadId) : void 0,
			accountId: accountId ?? void 0,
			audioAsVoice,
			deliveryQueueId,
			deliveryPartIndex,
			...deliveryQueueId !== void 0 ? { deliveryPartCount } : {},
			signal,
			assertDirectAdapterHandoff,
			onPlatformSendDispatch,
			onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
		});
		return attachChannelToResult("matrix", toMatrixOutboundResult(result));
	},
	sendPoll: async ({ cfg, to, poll, threadId, accountId }) => {
		const result = await sendPollMatrix(to, poll, {
			cfg,
			threadId: threadId !== void 0 && threadId !== null ? threadId : void 0,
			accountId: accountId ?? void 0
		});
		return {
			channel: "matrix",
			messageId: result.eventId,
			roomId: result.roomId,
			pollId: result.eventId
		};
	}
};
//#endregion
export { prepareMatrixReplyPayload as n, resolveMatrixExtraContent as r, matrixOutbound as t };
