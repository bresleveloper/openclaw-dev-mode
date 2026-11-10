import { G as withDiscordRequestAuthority } from "./discord-BMD-JiVS.mjs";
import { u as matchesDiscordToolContextTarget } from "./send.receipt-C18khRYH.mjs";
import { n as resolveDiscordChannelId, t as parseDiscordTarget } from "./target-parsing-C-HyNxcE.mjs";
import "./targets-UWWZ6gF7.mjs";
import { a as readDiscordAutoArchiveDurationParam, t as handleDiscordAction } from "./runtime-RWnuJgWB.mjs";
import { i as buildDiscordPresentationComponents, m as coerceDiscordComponentParam, r as buildDiscordInteractiveComponents } from "./components-Du9NhD8h.mjs";
import "../action-runtime-api.js";
import { C as discordInboundEventDelivery, i as isDiscordComponentSpecWithinMessageLimit, n as DISCORD_PRESENTATION_CAPABILITIES } from "./outbound-session-route-BtUpGBTb.mjs";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "./handle-action.guild-admin-B6g31cwt.mjs";
import { n as notifyDiscordActiveTurnThreadCreated, r as notifyDiscordActiveTurnThreadReplyDelivered } from "./active-turn-thread-route-C4tp9noA.mjs";
import { asOptionalRecord, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { adaptMessagePresentationForChannel, normalizeLegacyInteractiveReply, normalizeMessagePresentation, renderMessagePresentationFallbackText } from "openclaw/plugin-sdk/interactive-runtime";
import { readPositiveIntegerParam as readPositiveIntegerParam$1, readStringArrayParam as readStringArrayParam$1, readStringParam as readStringParam$1 } from "openclaw/plugin-sdk/agent-runtime";
//#region extensions/discord/src/actions/handle-action.ts
const providerId = "discord";
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
	const runAction = (payload) => handleDiscordAction({
		accountId,
		...payload
	}, cfg, actionOptions);
	const completeOutbound = (result, to, fallbackSessionKey) => {
		const details = asOptionalRecord(result.details);
		if (details?.ok !== true) return result;
		discordInboundEventDelivery.notify({
			sessionKey: ctx.sessionKey ?? fallbackSessionKey ?? void 0,
			to,
			accountId,
			inboundEventKind: ctx.inboundEventKind
		});
		if (action !== "send" && action !== "upload-file" && action !== "thread-reply") return result;
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
		})) return {
			...result,
			details: {
				...details,
				sourceReplyRoute: "current-source"
			}
		};
		return result;
	};
	const readTarget = ([firstKey, secondKey] = ["channelId", "to"]) => {
		const target = readStringParam$1(params, firstKey) ?? readStringParam$1(params, secondKey) ?? readCurrentDiscordTarget(ctx.toolContext);
		if (!target) throw new Error("Discord channel target is required (use channel:<id>).");
		return target;
	};
	const resolveChannelId = () => resolveDiscordChannelId(readTarget());
	if (action === "send" || action === "upload-file") {
		const to = readTarget(["to", "target"]);
		const asVoice = action === "send" ? readBooleanParam(params, "asVoice") === true : void 0;
		const [firstMediaKey, lastMediaKey] = action === "send" ? ["media", "filePath"] : ["filePath", "media"];
		const mediaUrl = readStringParam$1(params, firstMediaKey, { trim: false }) ?? readStringParam$1(params, "path", { trim: false }) ?? readStringParam$1(params, lastMediaKey, { trim: false });
		if (action === "upload-file" && !mediaUrl) {
			if (readStringParam$1(params, "buffer", { trim: false })) throw new Error("Use action: \"send\" for base64 buffer attachments; upload-file requires filePath, path, or media.");
			throw new Error("upload-file requires filePath, path, or media.");
		}
		const content = readStringParam$1(params, "message", {
			allowEmpty: true,
			trim: false
		}) ?? (action === "upload-file" ? readStringParam$1(params, "content", {
			allowEmpty: true,
			trim: false
		}) ?? readStringParam$1(params, "caption", {
			allowEmpty: true,
			trim: false
		}) ?? "" : void 0);
		const explicitComponents = action === "send" ? coerceDiscordComponentParam(params.components) : void 0;
		const presentation = action === "send" && explicitComponents == null ? normalizeMessagePresentation(params.presentation) : void 0;
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
		const rawComponents = action !== "send" || presentationFellBack ? void 0 : explicitComponents ?? presentationComponents ?? buildDiscordInteractiveComponents(normalizeLegacyInteractiveReply(params.interactive));
		const components = Boolean(rawComponents) && (typeof rawComponents === "function" || typeof rawComponents === "object") ? rawComponents : void 0;
		const rawEmbeds = action === "send" ? params.embeds : void 0;
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
		const threadName = action === "send" ? readStringParam$1(params, "threadName") : void 0;
		return completeOutbound(await runAction({
			action: "sendMessage",
			to,
			content: deliveryContent,
			...threadName ? { threadName } : {},
			mediaUrl: mediaUrl ?? void 0,
			filename: filename ?? void 0,
			replyTo: replyTo ?? void 0,
			...action === "send" ? {
				components,
				embeds,
				asVoice
			} : {},
			silent,
			...suppressEmbeds === void 0 ? {} : { suppressEmbeds },
			__sessionKey: sessionKey ?? void 0,
			__agentId: agentId ?? void 0
		}), to, sessionKey);
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
		return await runAction({
			action: "react",
			channelId: readTarget(),
			messageId,
			emoji,
			remove
		});
	}
	if (action === "reactions") {
		const messageId = readStringParam$1(params, "messageId", { required: true });
		const limit = readPositiveIntegerParam$1(params, "limit");
		return await runAction({
			action: "reactions",
			channelId: readTarget(),
			messageId,
			limit
		});
	}
	if (action === "read") {
		const limit = readPositiveIntegerParam$1(params, "limit");
		return await runAction({
			action: "readMessages",
			channelId: resolveChannelId(),
			limit,
			before: readStringParam$1(params, "before"),
			after: readStringParam$1(params, "after"),
			around: readStringParam$1(params, "around"),
			messageId: readStringParam$1(params, "messageId")
		});
	}
	if (action === "edit" || action === "delete") {
		const messageId = readStringParam$1(params, "messageId", { required: true });
		const target = readTarget();
		const currentDmChannel = action === "edit" && ctx.progressSnapshot && ctx.toolContext?.currentChatType === "direct" && parseDiscordTarget(target, { defaultKind: "channel" })?.kind === "user" && matchesDiscordToolContextTarget({
			target,
			toolContext: ctx.toolContext
		}) ? readCurrentDiscordTarget(ctx.toolContext) : void 0;
		return await runAction({
			action: action === "edit" ? "editMessage" : "deleteMessage",
			channelId: resolveDiscordChannelId(currentDmChannel ?? target),
			messageId,
			...action === "edit" ? { content: params.message } : {}
		});
	}
	if (action === "pin" || action === "unpin" || action === "list-pins") {
		const messageId = action === "list-pins" ? void 0 : readStringParam$1(params, "messageId", { required: true });
		return await runAction({
			action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
			channelId: resolveChannelId(),
			messageId
		});
	}
	if (action === "permissions") return await runAction({
		action: "permissions",
		channelId: resolveChannelId()
	});
	if (action === "thread-create") {
		const name = readStringParam$1(params, "threadName", { required: true });
		const messageId = readStringParam$1(params, "messageId");
		const content = readStringParam$1(params, "message", { trim: false });
		const autoArchiveMinutes = readDiscordAutoArchiveDurationParam(params, "autoArchiveMin");
		const appliedTags = readStringArrayParam$1(params, "appliedTags");
		const result = await runAction({
			action: "threadCreate",
			channelId: resolveChannelId(),
			name,
			messageId,
			content,
			autoArchiveMinutes,
			appliedTags: appliedTags ?? void 0
		});
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
		return completeOutbound(result, resolveChannelId());
	}
	if (action === "sticker") {
		const to = readStringParam$1(params, "to", { required: true });
		return completeOutbound(await runAction({
			action: "sticker",
			to,
			stickerIds: readStringArrayParam$1(params, "stickerId", {
				required: true,
				label: "sticker-id"
			}) ?? [],
			content: readStringParam$1(params, "message", { trim: false }),
			...readBooleanParam(params, "silent") === true ? { silent: true } : {}
		}), to);
	}
	if (action === "set-presence") return await runAction({
		action: "setPresence",
		status: readStringParam$1(params, "status"),
		activityType: readStringParam$1(params, "activityType"),
		activityName: readStringParam$1(params, "activityName"),
		activityUrl: readStringParam$1(params, "activityUrl"),
		activityState: readStringParam$1(params, "activityState")
	});
	const adminResult = await tryHandleDiscordMessageActionGuildAdmin({
		ctx,
		resolveChannelId,
		readPolicyOptions,
		actionOptions
	});
	if (adminResult !== void 0) {
		if (action === "thread-reply") return completeOutbound(adminResult, readStringParam$1(params, "threadId") ?? readTarget());
		return adminResult;
	}
	throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
}
//#endregion
export { handleDiscordMessageAction };
