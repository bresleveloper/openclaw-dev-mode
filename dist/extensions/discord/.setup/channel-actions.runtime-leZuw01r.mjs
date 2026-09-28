import { C as withDiscordRequestAuthority } from "./discord-BXpHW-cu.mjs";
import { i as buildDiscordPresentationComponents, m as coerceDiscordComponentParam, r as buildDiscordInteractiveComponents } from "./components-yBEb75bB.mjs";
import { b as resolveDiscordChannelId, g as matchesDiscordToolContextTarget, y as parseDiscordTarget } from "./retry-BEYkDy0P.mjs";
import "./targets-CvemhN3i.mjs";
import { a as readDiscordAutoArchiveDurationParam, t as handleDiscordAction } from "./runtime-B8lJfyrA.mjs";
import "../action-runtime-api.js";
import { b as discordInboundEventDelivery, i as isDiscordComponentSpecWithinMessageLimit, n as DISCORD_PRESENTATION_CAPABILITIES } from "./outbound-session-route-VulUE0yV.mjs";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "./handle-action.guild-admin-DcFa8NwA.mjs";
import { n as notifyDiscordActiveTurnThreadCreated, r as notifyDiscordActiveTurnThreadReplyDelivered } from "./active-turn-thread-route-fmHl1HNd.mjs";
import { normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { adaptMessagePresentationForChannel, normalizeLegacyInteractiveReply, normalizeMessagePresentation, renderMessagePresentationFallbackText } from "openclaw/plugin-sdk/interactive-runtime";
import { resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { readPositiveIntegerParam as readPositiveIntegerParam$1, readStringArrayParam as readStringArrayParam$1, readStringParam as readStringParam$1 } from "openclaw/plugin-sdk/agent-runtime";
//#region extensions/discord/src/actions/handle-action.ts
const providerId = "discord";
function withCurrentSourceReplyRoute(result) {
	const details = result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : {};
	return {
		...result,
		details: {
			...details,
			sourceReplyRoute: "current-source"
		}
	};
}
function readCurrentDiscordTarget(toolContext) {
	const provider = toolContext?.currentChannelProvider?.trim().toLowerCase();
	if (provider && provider !== providerId) return;
	return toolContext?.currentChannelId?.trim() || void 0;
}
async function handleDiscordMessageAction(ctx) {
	ctx.assertDirectAdapterHandoff?.();
	return await withDiscordRequestAuthority(ctx.assertDirectAdapterHandoff, () => dispatchDiscordMessageAction(ctx));
}
async function dispatchDiscordMessageAction(ctx) {
	const { action, params, cfg } = ctx;
	const accountId = ctx.accountId ?? readStringParam$1(params, "accountId");
	const readContext = ctx.requesterAccountId && ctx.toolContext?.currentChannelProvider && ctx.toolContext.currentChannelId ? {
		requesterAccountId: ctx.requesterAccountId,
		currentChannelProvider: ctx.toolContext.currentChannelProvider,
		currentChannelId: ctx.toolContext.currentChannelId,
		currentChatType: ctx.toolContext.currentChatType,
		currentMessagingTarget: ctx.toolContext.currentMessagingTarget
	} : void 0;
	const readPolicyOptions = ctx.conversationReadOrigin || readContext ? {
		...ctx.conversationReadOrigin ? { conversationReadOrigin: ctx.conversationReadOrigin } : {},
		...readContext ? { readContext } : {}
	} : void 0;
	const actionOptions = {
		mediaAccess: ctx.mediaAccess,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile,
		...ctx.reply ? { reply: ctx.reply } : {},
		...ctx.progressSnapshot ? { progressSnapshot: ctx.progressSnapshot } : {},
		...readPolicyOptions
	};
	const notifyVisibleOutbound = (result, to, fallbackSessionKey) => {
		if ((result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : void 0)?.ok !== true) return;
		discordInboundEventDelivery.notify({
			sessionKey: ctx.sessionKey ?? fallbackSessionKey ?? void 0,
			to,
			accountId,
			inboundEventKind: ctx.inboundEventKind
		});
	};
	const withAdoptedThreadReplyRoute = (result, to, fallbackSessionKey) => {
		if ((result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : void 0)?.ok !== true) return result;
		let target;
		try {
			target = parseDiscordTarget(to, { defaultKind: "channel" });
		} catch {
			return result;
		}
		if (target?.kind === "channel" && notifyDiscordActiveTurnThreadReplyDelivered({
			sessionKey: ctx.sessionKey ?? fallbackSessionKey,
			accountId,
			threadId: target.id
		})) return withCurrentSourceReplyRoute(result);
		return result;
	};
	const readTarget = () => {
		const target = readStringParam$1(params, "channelId") ?? readStringParam$1(params, "to") ?? readCurrentDiscordTarget(ctx.toolContext);
		if (!target) throw new Error("Discord channel target is required (use channel:<id>).");
		return target;
	};
	const resolveChannelId = () => resolveDiscordChannelId(readTarget());
	const readSendTarget = () => {
		const target = readStringParam$1(params, "to") ?? readStringParam$1(params, "target") ?? readCurrentDiscordTarget(ctx.toolContext);
		if (!target) throw new Error("Discord channel target is required (use channel:<id>).");
		return target;
	};
	if (action === "send") {
		const to = readSendTarget();
		const asVoice = readBooleanParam(params, "asVoice") === true;
		const mediaUrl = readStringParam$1(params, "media", { trim: false }) ?? readStringParam$1(params, "path", { trim: false }) ?? readStringParam$1(params, "filePath", { trim: false });
		const content = readStringParam$1(params, "message", {
			allowEmpty: true,
			trim: false
		});
		const explicitComponents = coerceDiscordComponentParam(params.components);
		const presentation = explicitComponents == null ? normalizeMessagePresentation(params.presentation) : void 0;
		const adaptedPresentation = presentation ? adaptMessagePresentationForChannel({
			presentation,
			capabilities: DISCORD_PRESENTATION_CAPABILITIES
		}) : void 0;
		const generatedPresentationComponents = buildDiscordPresentationComponents(adaptedPresentation);
		const presentationComponents = generatedPresentationComponents && isDiscordComponentSpecWithinMessageLimit({
			spec: generatedPresentationComponents,
			fallbackText: content,
			includesMedia: Boolean(mediaUrl)
		}) ? generatedPresentationComponents : void 0;
		const presentationFellBack = Boolean(generatedPresentationComponents && !presentationComponents);
		const rawComponents = presentationFellBack ? void 0 : explicitComponents ?? presentationComponents ?? buildDiscordInteractiveComponents(normalizeLegacyInteractiveReply(params.interactive));
		const components = Boolean(rawComponents) && (typeof rawComponents === "function" || typeof rawComponents === "object") ? rawComponents : void 0;
		const rawEmbeds = params.embeds;
		const embeds = Array.isArray(rawEmbeds) ? rawEmbeds : void 0;
		const deliveryContent = presentationFellBack && presentation ? renderMessagePresentationFallbackText({
			text: content,
			presentation
		}) : content;
		const filename = readStringParam$1(params, "filename");
		const replyTo = readStringParam$1(params, "replyTo");
		const silent = readBooleanParam(params, "silent") === true;
		const suppressEmbeds = readBooleanParam(params, "suppressEmbeds");
		const sessionKey = readStringParam$1(params, "__sessionKey");
		const agentId = readStringParam$1(params, "__agentId");
		const threadName = readStringParam$1(params, "threadName");
		const result = await handleDiscordAction({
			action: "sendMessage",
			accountId: accountId ?? void 0,
			to,
			content: deliveryContent,
			...threadName ? { threadName } : {},
			mediaUrl: mediaUrl ?? void 0,
			filename: filename ?? void 0,
			replyTo: replyTo ?? void 0,
			components,
			embeds,
			asVoice,
			silent,
			...suppressEmbeds === void 0 ? {} : { suppressEmbeds },
			__sessionKey: sessionKey ?? void 0,
			__agentId: agentId ?? void 0
		}, cfg, actionOptions);
		notifyVisibleOutbound(result, to, sessionKey);
		return withAdoptedThreadReplyRoute(result, to, sessionKey);
	}
	if (action === "upload-file") {
		const to = readSendTarget();
		const mediaUrl = readStringParam$1(params, "filePath", { trim: false }) ?? readStringParam$1(params, "path", { trim: false }) ?? readStringParam$1(params, "media", { trim: false });
		if (!mediaUrl) {
			if (readStringParam$1(params, "buffer", { trim: false })) throw new Error("Use action: \"send\" for base64 buffer attachments; upload-file requires filePath, path, or media.");
			throw new Error("upload-file requires filePath, path, or media.");
		}
		const content = readStringParam$1(params, "message", {
			allowEmpty: true,
			trim: false
		}) ?? readStringParam$1(params, "content", {
			allowEmpty: true,
			trim: false
		}) ?? readStringParam$1(params, "caption", {
			allowEmpty: true,
			trim: false
		});
		const filename = readStringParam$1(params, "filename");
		const replyTo = readStringParam$1(params, "replyTo");
		const silent = readBooleanParam(params, "silent") === true;
		const suppressEmbeds = readBooleanParam(params, "suppressEmbeds");
		const sessionKey = readStringParam$1(params, "__sessionKey");
		const agentId = readStringParam$1(params, "__agentId");
		const result = await handleDiscordAction({
			action: "sendMessage",
			accountId: accountId ?? void 0,
			to,
			content: content ?? "",
			mediaUrl,
			filename: filename ?? void 0,
			replyTo: replyTo ?? void 0,
			silent,
			...suppressEmbeds === void 0 ? {} : { suppressEmbeds },
			__sessionKey: sessionKey ?? void 0,
			__agentId: agentId ?? void 0
		}, cfg, actionOptions);
		notifyVisibleOutbound(result, to, sessionKey);
		return withAdoptedThreadReplyRoute(result, to, sessionKey);
	}
	if (action === "react") {
		const messageIdRaw = resolveReactionMessageId({
			args: params,
			toolContext: ctx.toolContext
		});
		const messageId = normalizeOptionalStringifiedId(messageIdRaw) ?? "";
		if (!messageId) throw new Error("messageId required. Provide messageId explicitly or react to the current inbound message.");
		const emoji = readStringParam$1(params, "emoji", { allowEmpty: true });
		const remove = readBooleanParam(params, "remove");
		return await handleDiscordAction({
			action: "react",
			accountId: accountId ?? void 0,
			channelId: readTarget(),
			messageId,
			emoji,
			remove
		}, cfg, actionOptions);
	}
	if (action === "reactions") {
		const messageId = readStringParam$1(params, "messageId", { required: true });
		const limit = readPositiveIntegerParam$1(params, "limit");
		return await handleDiscordAction({
			action: "reactions",
			accountId: accountId ?? void 0,
			channelId: readTarget(),
			messageId,
			limit
		}, cfg, actionOptions);
	}
	if (action === "read") {
		const limit = readPositiveIntegerParam$1(params, "limit");
		return await handleDiscordAction({
			action: "readMessages",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			limit,
			before: readStringParam$1(params, "before"),
			after: readStringParam$1(params, "after"),
			around: readStringParam$1(params, "around"),
			messageId: readStringParam$1(params, "messageId")
		}, cfg, actionOptions);
	}
	if (action === "edit" || action === "delete") {
		const messageId = readStringParam$1(params, "messageId", { required: true });
		const target = readTarget();
		const currentDmChannel = action === "edit" && ctx.progressSnapshot && ctx.toolContext?.currentChatType === "direct" && parseDiscordTarget(target, { defaultKind: "channel" })?.kind === "user" && matchesDiscordToolContextTarget({
			target,
			toolContext: ctx.toolContext
		}) ? readCurrentDiscordTarget(ctx.toolContext) : void 0;
		return await handleDiscordAction({
			action: action === "edit" ? "editMessage" : "deleteMessage",
			accountId: accountId ?? void 0,
			channelId: resolveDiscordChannelId(currentDmChannel ?? target),
			messageId,
			...action === "edit" ? { content: params.message } : {}
		}, cfg, actionOptions);
	}
	if (action === "pin" || action === "unpin" || action === "list-pins") {
		const messageId = action === "list-pins" ? void 0 : readStringParam$1(params, "messageId", { required: true });
		return await handleDiscordAction({
			action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			messageId
		}, cfg, actionOptions);
	}
	if (action === "permissions") return await handleDiscordAction({
		action: "permissions",
		accountId: accountId ?? void 0,
		channelId: resolveChannelId()
	}, cfg, actionOptions);
	if (action === "thread-create") {
		const name = readStringParam$1(params, "threadName", { required: true });
		const messageId = readStringParam$1(params, "messageId");
		const content = readStringParam$1(params, "message", { trim: false });
		const autoArchiveMinutes = readDiscordAutoArchiveDurationParam(params, "autoArchiveMin");
		const appliedTags = readStringArrayParam$1(params, "appliedTags");
		const result = await handleDiscordAction({
			action: "threadCreate",
			accountId: accountId ?? void 0,
			channelId: resolveChannelId(),
			name,
			messageId,
			content,
			autoArchiveMinutes,
			appliedTags: appliedTags ?? void 0
		}, cfg, actionOptions);
		const details = result.details && typeof result.details === "object" && !Array.isArray(result.details) ? result.details : void 0;
		if (details?.ok === true) {
			const threadId = typeof details.thread?.id === "string" ? details.thread.id : void 0;
			await notifyDiscordActiveTurnThreadCreated({
				sessionKey: ctx.sessionKey,
				accountId,
				sourceChannelId: resolveChannelId(),
				sourceMessageId: messageId,
				threadId
			});
		}
		notifyVisibleOutbound(result, resolveChannelId());
		return result;
	}
	if (action === "sticker") {
		const to = readStringParam$1(params, "to", { required: true });
		const stickerIds = readStringArrayParam$1(params, "stickerId", {
			required: true,
			label: "sticker-id"
		}) ?? [];
		const result = await handleDiscordAction({
			action: "sticker",
			accountId: accountId ?? void 0,
			to,
			stickerIds,
			content: readStringParam$1(params, "message", { trim: false }),
			...readBooleanParam(params, "silent") === true ? { silent: true } : {}
		}, cfg, actionOptions);
		notifyVisibleOutbound(result, to);
		return result;
	}
	if (action === "set-presence") return await handleDiscordAction({
		action: "setPresence",
		accountId: accountId ?? void 0,
		status: readStringParam$1(params, "status"),
		activityType: readStringParam$1(params, "activityType"),
		activityName: readStringParam$1(params, "activityName"),
		activityUrl: readStringParam$1(params, "activityUrl"),
		activityState: readStringParam$1(params, "activityState")
	}, cfg, actionOptions);
	const adminResult = await tryHandleDiscordMessageActionGuildAdmin({
		ctx,
		resolveChannelId,
		readPolicyOptions,
		actionOptions
	});
	if (adminResult !== void 0) {
		if (action === "thread-reply") {
			const threadId = readStringParam$1(params, "threadId") ?? readTarget();
			notifyVisibleOutbound(adminResult, threadId);
			return withAdoptedThreadReplyRoute(adminResult, threadId);
		}
		return adminResult;
	}
	throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
}
//#endregion
export { handleDiscordMessageAction };
