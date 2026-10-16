import { r as matrixPresentationCapabilities } from "./channel-CeRXEAEP.mjs";
import { i as sendPollMatrix, r as sendMessageMatrix } from "./send-B1Y2L4wj.mjs";
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
				extraContent: { [MATRIX_OPENCLAW_PRESENTATION_KEY]: {
					...params.presentation,
					version: 1,
					type: MATRIX_OPENCLAW_PRESENTATION_TYPE
				} }
			}
		}
	};
}
function prepareMatrixReplyPayload(payload) {
	return renderPresentationForDelivery({
		presentationCapabilities: matrixPresentationCapabilities,
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
async function sendMatrixOutbound(ctx, media) {
	const result = await (resolveOutboundSendDep(ctx.deps, "matrix") ?? sendMessageMatrix)(ctx.to, ctx.text, {
		cfg: ctx.cfg,
		...media,
		replyToId: ctx.replyToId ?? void 0,
		threadId: ctx.threadId != null ? String(ctx.threadId) : void 0,
		accountId: ctx.accountId ?? void 0,
		audioAsVoice: ctx.audioAsVoice,
		deliveryQueueId: ctx.deliveryQueueId,
		deliveryPartIndex: ctx.deliveryPartIndex,
		...ctx.deliveryQueueId !== void 0 ? { deliveryPartCount: ctx.deliveryPartCount } : {},
		signal: ctx.signal,
		assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
		onPlatformSendDispatch: ctx.onPlatformSendDispatch,
		onDeliveryResult: resolveMatrixDeliveryProgress(ctx.onDeliveryResult)
	});
	return attachChannelToResult("matrix", toMatrixOutboundResult(result));
}
const matrixOutbound = {
	deliveryMode: "direct",
	chunker: chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: 4e3,
	presentationCapabilities: matrixPresentationCapabilities,
	renderPresentation: renderMatrixPresentationPayload,
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
		const sendOptions = {
			cfg,
			mediaAccess,
			mediaLocalRoots,
			mediaReadFile,
			threadId: resolvedThreadId,
			accountId: accountId ?? void 0,
			deliveryQueueId,
			signal,
			assertDirectAdapterHandoff,
			onPlatformSendDispatch
		};
		if (urls.length > 0) {
			const sentResults = [];
			const lastResult = await sendPayloadMediaSequence({
				text: payloadText,
				mediaUrls: urls,
				send: async ({ text, mediaUrl, index, isFirst }) => await send(to, text, {
					...sendOptions,
					mediaUrl,
					replyToId: resolveReplyToId(),
					audioAsVoice: payload.audioAsVoice ?? audioAsVoice,
					deliveryPartIndex: index,
					deliveryPartCount: urls.length,
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
			...sendOptions,
			replyToId: resolveReplyToId(),
			audioAsVoice: payload.audioAsVoice ?? audioAsVoice,
			deliveryPartIndex: 0,
			deliveryPartCount: 1,
			extraContent: resolveMatrixExtraContent(payload),
			onDeliveryResult: resolveMatrixDeliveryProgress(onDeliveryResult)
		});
		return attachChannelToResult("matrix", toMatrixOutboundResult(result));
	},
	sendText: (ctx) => sendMatrixOutbound(ctx),
	sendMedia: (ctx) => sendMatrixOutbound(ctx, {
		mediaUrl: ctx.mediaUrl,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile,
		mediaAccess: ctx.mediaAccess
	}),
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
