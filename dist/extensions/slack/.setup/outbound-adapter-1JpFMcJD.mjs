import { d as resolveSlackMarkdownOptions, f as resolveSlackOperationToken, s as resolveSlackAccount } from "./accounts-EaPP0fFY.mjs";
import { a as parseSlackTarget } from "./target-parsing-DwYAP3ts.mjs";
import { T as assertSlackDetachedTargetAllowed, Z as resolveSlackQuestionActionIds, _t as SLACK_PRESENTATION_CAPABILITIES, wt as SLACK_TEXT_LIMIT } from "./probe-BHqvMbno.mjs";
import { r as resolveSlackThreadTsValue } from "./thread-ts-47Au2-Yn.mjs";
import { a as resolveSlackReplyBlockResolution, d as resolveSlackAuthoredTextPlacement, r as normalizeSlackReplyPayload, s as resolveSlackReplyDeliveryMessages } from "./reply-blocks-CFy-O-2B.mjs";
import { t as mergeSlackSendResults } from "./send-results-Bm6V1ekL.mjs";
import { t as registerSlackQuestionDelivery } from "./question-delivery-BGwm5Zmr.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeMessagePresentation, resolveLegacyInteractiveTextFallback } from "openclaw/plugin-sdk/interactive-runtime";
import { resolvePayloadMediaUrls, sendPayloadMediaSequenceAndFinalize, sendTextMediaPayload } from "openclaw/plugin-sdk/reply-payload";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { createHmac, randomBytes } from "node:crypto";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { attachChannelToResult } from "openclaw/plugin-sdk/channel-send-result";
// extensions/slack/src/outbound-adapter.ts
function toSlackOutboundResult(result) {
	const { channelId, ...delivery } = result;
	return attachChannelToResult("slack", channelId === void 0 ? delivery : {
		...delivery,
		target: {
			kind: "channel",
			id: channelId
		}
	});
}
const SLACK_RENDERED_PRESENTATION_PROVENANCE_KEY = randomBytes(32);
function createSlackRenderedPresentationProvenance(resolution) {
	return createHmac("sha256", SLACK_RENDERED_PRESENTATION_PROVENANCE_KEY).update(JSON.stringify([resolution.authoredTextPlacement, resolution.segments])).digest("base64url");
}
function readSlackRenderedPresentation(slackData) {
	const provenance = slackData?.renderedPresentationProvenance;
	if (typeof provenance !== "string") return;
	try {
		const segments = slackData?.renderedPresentationSegments;
		const authoredTextPlacement = slackData?.authoredTextPlacement;
		if (!segments || !authoredTextPlacement) return;
		const resolution = {
			authoredTextPlacement,
			segments
		};
		return safeEqualSecret(provenance, createSlackRenderedPresentationProvenance(resolution)) ? resolution : void 0;
	} catch {
		return;
	}
}
const loadSlackSendRuntime = createLazyRuntimeModule(() => import("./send-kGJWQtLk.mjs").then((n) => n.n));
function resolveSlackSendIdentity(identity) {
	if (!identity) return;
	const username = normalizeOptionalString(identity.name);
	const iconUrl = normalizeOptionalString(identity.avatarUrl);
	const rawEmoji = normalizeOptionalString(identity.emoji);
	const iconEmoji = !iconUrl ? rawEmoji : void 0;
	if (!username && !iconUrl && !iconEmoji) return;
	return {
		username,
		iconUrl,
		iconEmoji
	};
}
function resolveSlackOutboundBlockResolution(payload, options) {
	const slackData = payload.channelData?.slack;
	const presentation = normalizeMessagePresentation(payload.presentation);
	if (!Boolean(slackData?.blocks !== void 0 || presentation || payload.interactive?.blocks.length)) return {
		authoredTextPlacement: resolveSlackAuthoredTextPlacement(payload),
		segments: []
	};
	return resolveSlackReplyBlockResolution(payload, {
		...options,
		materializeAuthoredText: true
	});
}
function withSlackRenderedPresentation(payload, slackData, resolution) {
	const { authoredPresentationText: _authoredPresentationText, authoredTextPlacement: _authoredTextPlacement, blocks: _blocks, renderedPresentationProvenance: _renderedPresentationProvenance, renderedPresentationSegments: _renderedPresentationSegments, ...preservedSlackData } = slackData ?? {};
	return {
		...payload,
		channelData: {
			...payload.channelData,
			slack: {
				...preservedSlackData,
				authoredTextPlacement: resolution.authoredTextPlacement,
				renderedPresentationProvenance: createSlackRenderedPresentationProvenance(resolution),
				renderedPresentationSegments: resolution.segments
			}
		}
	};
}
async function prepareSlackOutboundSend(ctx) {
	const account = resolveSlackAccount({
		cfg: ctx.cfg,
		accountId: ctx.accountId
	});
	const target = parseSlackTarget(ctx.to, { defaultKind: "channel" });
	assertSlackDetachedTargetAllowed(account.accountId, target?.teamId);
	const send = resolveOutboundSendDep(ctx.deps, "slack") ?? (await loadSlackSendRuntime()).sendMessageSlack;
	const token = resolveSlackOperationToken(account, "write");
	const botToken = account.botToken?.trim();
	const tokenOverride = token && token !== botToken ? token : void 0;
	return async (params) => {
		const slackIdentity = resolveSlackSendIdentity(params.identity);
		const threadTs = resolveSlackThreadTsValue(params);
		const sendOptions = {
			cfg: params.cfg,
			...tokenOverride ? { token: tokenOverride } : {},
			threadTs,
			accountId: params.accountId ?? void 0,
			...params.mediaUrl ? {
				mediaUrl: params.mediaUrl,
				mediaAccess: params.mediaAccess,
				mediaLocalRoots: params.mediaLocalRoots,
				mediaReadFile: params.mediaReadFile,
				...params.forceDocument ? { forceDocument: true } : {}
			} : {},
			...params.blocks ? { blocks: params.blocks } : {},
			...params.authoredTextPlacement ? { authoredTextPlacement: params.authoredTextPlacement } : {},
			...Object.hasOwn(params, "nativeDataFallbackBaseText") ? { nativeDataFallbackBaseText: params.nativeDataFallbackBaseText } : {},
			...params.textIsSlackPlainText ? { textIsSlackPlainText: true } : {},
			...params.literalText ? { literalText: true } : {},
			...slackIdentity ? { identity: slackIdentity } : {},
			...params.deliveryQueueId ? { deliveryQueueId: params.deliveryQueueId } : {},
			...params.onPlatformSendDispatch ? { onPlatformSendDispatch: params.onPlatformSendDispatch } : {},
			...params.assertDirectAdapterHandoff ? { assertDirectAdapterHandoff: params.assertDirectAdapterHandoff } : {},
			...params.onDeliveryResult ? { onDeliveryResult: async (progress) => {
				await params.onDeliveryResult?.(toSlackOutboundResult(progress));
			} } : {}
		};
		return await send(params.to, params.text, sendOptions);
	};
}
const slackOutbound = {
	deliveryMode: "direct",
	chunker: null,
	textChunkLimit: SLACK_TEXT_LIMIT,
	presentationCapabilities: SLACK_PRESENTATION_CAPABILITIES,
	normalizePayload: ({ payload }) => normalizeSlackReplyPayload(payload),
	renderPresentation: ({ payload, ctx }) => {
		const slackData = payload.channelData?.slack;
		const renderPayload = payload.presentationTextMode === "fallback" ? {
			...payload,
			text: payload.text ?? slackData?.authoredPresentationText
		} : payload;
		const resolution = resolveSlackOutboundBlockResolution(renderPayload, resolveSlackMarkdownOptions(ctx));
		return resolution.segments.length > 0 ? withSlackRenderedPresentation(renderPayload, slackData, resolution) : null;
	},
	sendPayload: async (ctx) => {
		const send = await prepareSlackOutboundSend(ctx);
		const { mediaUrl: _mediaUrl, ...commonCtx } = ctx;
		const preparedCtx = {
			...commonCtx,
			replyToId: resolveSlackThreadTsValue(ctx),
			threadId: null,
			deliveryQueueId: void 0
		};
		const payload = {
			...preparedCtx.payload,
			text: resolveLegacyInteractiveTextFallback({
				text: preparedCtx.payload.text,
				interactive: preparedCtx.payload.interactive
			}) ?? ""
		};
		const slackData = payload.channelData?.slack;
		const resolution = readSlackRenderedPresentation(slackData) ?? resolveSlackOutboundBlockResolution(payload, resolveSlackMarkdownOptions(ctx));
		if (resolution.segments.length === 0) {
			const sendPart = async (part) => toSlackOutboundResult(await send({
				...part,
				literalText: slackData?.literalText === true
			}));
			return await sendTextMediaPayload({
				channel: "slack",
				ctx: {
					...preparedCtx,
					payload
				},
				adapter: {
					sendText: sendPart,
					sendMedia: sendPart
				}
			});
		}
		const mediaUrls = resolvePayloadMediaUrls(payload);
		const deliveryMessages = resolveSlackReplyDeliveryMessages({
			authoredTextPlacement: resolution.authoredTextPlacement,
			segments: resolution.segments,
			text: payload.text
		});
		const sentResults = [];
		return toSlackOutboundResult(await sendPayloadMediaSequenceAndFinalize({
			text: "",
			mediaUrls,
			send: async ({ text, mediaUrl }) => await send({
				...preparedCtx,
				text,
				mediaUrl
			}),
			onResult: (result) => {
				sentResults.push(result);
			},
			finalize: async () => {
				for (const message of deliveryMessages) sentResults.push(await send({
					...preparedCtx,
					...message
				}));
				return mergeSlackSendResults(sentResults);
			}
		}));
	},
	afterDeliverPayload: async ({ cfg, target, payload, results }) => {
		const questionId = questionGatewayRuntime.readAskUserQuestionId(payload);
		const slackData = payload.channelData?.slack;
		if (!questionId) return;
		const resolution = readSlackRenderedPresentation(slackData);
		if (!resolution) return;
		const deliveryMessage = resolveSlackReplyDeliveryMessages({
			authoredTextPlacement: resolution.authoredTextPlacement,
			segments: resolution.segments,
			text: payload.text
		}).find((message) => resolveSlackQuestionActionIds(message.blocks, questionId).length > 0);
		const questionActionIds = resolveSlackQuestionActionIds(deliveryMessage?.blocks, questionId);
		const result = results.find(({ channel, meta }) => channel === "slack" && Array.isArray(meta?.slackQuestionActionIds) && meta.slackQuestionActionIds.some((actionId) => typeof actionId === "string" && questionActionIds.includes(actionId)));
		if (!deliveryMessage || !result?.messageId) return;
		const channelId = result.target?.kind === "channel" ? result.target.id : void 0;
		if (!channelId) return;
		const teamId = parseSlackTarget(target.to, { defaultKind: "channel" })?.teamId;
		registerSlackQuestionDelivery({
			questionId,
			accountId: target.accountId ?? void 0,
			result: {
				...result,
				channelId,
				meta: result.meta
			},
			text: deliveryMessage.text,
			update: async (message) => {
				const { updateMessageSlack } = await loadSlackSendRuntime();
				await updateMessageSlack({
					cfg,
					accountId: target.accountId ?? void 0,
					teamId,
					...message
				});
			}
		});
	},
	sendText: async (ctx) => {
		return toSlackOutboundResult(await (await prepareSlackOutboundSend(ctx))(ctx));
	},
	sendMedia: async (ctx) => {
		return toSlackOutboundResult(await (await prepareSlackOutboundSend(ctx))({
			...ctx,
			deliveryQueueId: void 0
		}));
	}
};
export { slackOutbound };
