import { c as readDiscordChannelMoveParams, n as isDiscordModerationAction, o as readDiscordChannelCreateParams, r as readDiscordModerationCommand, s as readDiscordChannelEditParams, t as handleDiscordAction } from "./runtime-CESTexGn.mjs";
import "../action-runtime-api.js";
import { y as isTrustedRequesterGuildAdminAction } from "./outbound-session-route-BvBH4LC6.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { readNonNegativeIntegerParam, readPositiveIntegerParam, readStringArrayParam, readStringParam } from "openclaw/plugin-sdk/param-readers";
//#region extensions/discord/src/actions/handle-action.guild-admin.ts
const guildMetadataReads = {
	"member-info": {
		action: "memberInfo",
		requiredParams: ["userId", "guildId"]
	},
	"role-info": {
		action: "roleInfo",
		requiredParams: ["guildId"]
	},
	"channel-info": {
		action: "channelInfo",
		requiredParams: ["channelId"]
	},
	"channel-list": {
		action: "channelList",
		requiredParams: ["guildId"]
	},
	"voice-status": {
		action: "voiceStatus",
		requiredParams: ["guildId", "userId"]
	},
	"event-list": {
		action: "eventList",
		requiredParams: ["guildId"]
	}
};
const channelMutation = {
	"channel-create": {
		action: "channelCreate",
		read: readDiscordChannelCreateParams
	},
	"channel-edit": {
		action: "channelEdit",
		read: readDiscordChannelEditParams
	},
	"channel-move": {
		action: "channelMove",
		read: readDiscordChannelMoveParams
	}
};
function readDiscordRequesterSenderId(ctx) {
	const currentProvider = normalizeOptionalString(ctx.toolContext?.currentChannelProvider);
	if (currentProvider?.toLowerCase() === "discord") return normalizeOptionalString(ctx.requesterSenderId);
	if (ctx.action === "channel-edit" && !currentProvider && ctx.senderIsOwner === false && ctx.assertDirectAdapterHandoff && ctx.accountId && ctx.requesterAccountId === ctx.accountId) {
		ctx.assertDirectAdapterHandoff();
		const requester = normalizeOptionalString(ctx.requesterSenderId);
		if (requester) return requester;
	}
	if (isTrustedRequesterGuildAdminAction(ctx.action) && (currentProvider || ctx.senderIsOwner !== true)) throw new Error("Discord guild admin actions require a trusted Discord sender identity." + (ctx.action === "channel-edit" && !currentProvider ? " Recreate an automation without recorded execution authorization from a fresh authenticated Discord turn that can manage automations." : ""));
}
function senderParam(senderUserId) {
	return senderUserId ? { senderUserId } : {};
}
async function tryHandleDiscordMessageActionGuildAdmin(params) {
	const { ctx, resolveChannelId, readPolicyOptions, actionOptions } = params;
	const { action, params: actionParams, cfg } = ctx;
	const accountId = ctx.accountId ?? readStringParam(actionParams, "accountId");
	const senderUserId = readDiscordRequesterSenderId(ctx);
	const runAction = (runtimeAction, values, options) => handleDiscordAction({
		action: runtimeAction,
		accountId: accountId ?? void 0,
		...values
	}, cfg, options);
	const metadataRead = guildMetadataReads[action];
	if (metadataRead) {
		const values = Object.fromEntries(metadataRead.requiredParams.map((key) => [key, readStringParam(actionParams, key, { required: true })]));
		return await runAction(metadataRead.action, values, readPolicyOptions);
	}
	if (action === "emoji-list") {
		const guildId = readStringParam(actionParams, "guildId");
		const limit = readPositiveIntegerParam(actionParams, "limit");
		return await runAction("emojiList", {
			...guildId ? { guildId } : { channelId: resolveChannelId() },
			...limit ? { limit } : {}
		}, readPolicyOptions);
	}
	if (action === "emoji-upload") return await runAction("emojiUpload", {
		guildId: readStringParam(actionParams, "guildId", { required: true }),
		name: readStringParam(actionParams, "emojiName", { required: true }),
		mediaUrl: readStringParam(actionParams, "media", {
			required: true,
			trim: false
		}),
		roleIds: readStringArrayParam(actionParams, "roleIds"),
		...senderParam(senderUserId)
	}, actionOptions);
	if (action === "sticker-upload") return await runAction("stickerUpload", {
		guildId: readStringParam(actionParams, "guildId", { required: true }),
		name: readStringParam(actionParams, "stickerName", { required: true }),
		description: readStringParam(actionParams, "stickerDesc", { required: true }),
		tags: readStringParam(actionParams, "stickerTags", { required: true }),
		mediaUrl: readStringParam(actionParams, "media", {
			required: true,
			trim: false
		}),
		...senderParam(senderUserId)
	}, actionOptions);
	if (action === "role-add" || action === "role-remove") return await runAction(action === "role-add" ? "roleAdd" : "roleRemove", {
		guildId: readStringParam(actionParams, "guildId", { required: true }),
		userId: readStringParam(actionParams, "userId", { required: true }),
		roleId: readStringParam(actionParams, "roleId", { required: true }),
		...senderParam(senderUserId)
	});
	if (action === "channel-create" || action === "channel-edit" || action === "channel-move") {
		const mutation = channelMutation[action];
		return await runAction(mutation.action, {
			...mutation.read(actionParams),
			...senderParam(senderUserId)
		});
	}
	if (action === "channel-delete") return await runAction("channelDelete", {
		channelId: readStringParam(actionParams, "channelId", { required: true }),
		...senderParam(senderUserId)
	});
	if (action === "category-create" || action === "category-edit" || action === "category-delete") {
		const creating = action === "category-create";
		const categoryId = readStringParam(actionParams, creating ? "guildId" : "categoryId", { required: true });
		const fields = action === "category-delete" ? {} : {
			name: readStringParam(actionParams, "name", { required: creating }),
			position: readNonNegativeIntegerParam(actionParams, "position")
		};
		return await runAction(creating ? "categoryCreate" : action === "category-edit" ? "categoryEdit" : "categoryDelete", {
			...creating ? { guildId: categoryId } : { categoryId },
			...fields,
			...senderParam(senderUserId)
		});
	}
	if (action === "event-create") return await runAction("eventCreate", {
		guildId: readStringParam(actionParams, "guildId", { required: true }),
		name: readStringParam(actionParams, "eventName", { required: true }),
		startTime: readStringParam(actionParams, "startTime", { required: true }),
		endTime: readStringParam(actionParams, "endTime"),
		description: readStringParam(actionParams, "desc"),
		channelId: readStringParam(actionParams, "channelId"),
		location: readStringParam(actionParams, "location"),
		entityType: readStringParam(actionParams, "eventType"),
		image: readStringParam(actionParams, "image", { trim: false }),
		...senderParam(senderUserId)
	}, actionOptions);
	if (isDiscordModerationAction(action)) {
		const moderation = readDiscordModerationCommand(action, {
			...actionParams,
			durationMinutes: readNonNegativeIntegerParam(actionParams, "durationMin"),
			deleteMessageDays: readNonNegativeIntegerParam(actionParams, "deleteDays", {
				max: 7,
				message: "deleteDays must be an integer from 0 to 7"
			})
		});
		return await runAction(moderation.action, {
			...moderation,
			senderUserId
		});
	}
	if (action === "thread-list") return await runAction("threadList", {
		guildId: readStringParam(actionParams, "guildId", { required: true }),
		channelId: readStringParam(actionParams, "channelId"),
		includeArchived: typeof actionParams.includeArchived === "boolean" ? actionParams.includeArchived : void 0,
		before: readStringParam(actionParams, "before"),
		limit: readPositiveIntegerParam(actionParams, "limit")
	}, readPolicyOptions);
	if (action === "thread-reply") {
		const content = readStringParam(actionParams, "message", {
			required: true,
			trim: false
		});
		const mediaUrl = readStringParam(actionParams, "media", { trim: false }) ?? readStringParam(actionParams, "path", { trim: false }) ?? readStringParam(actionParams, "filePath", { trim: false });
		const replyTo = readStringParam(actionParams, "replyTo");
		return await runAction("threadReply", {
			channelId: readStringParam(actionParams, "threadId") ?? resolveChannelId(),
			content,
			mediaUrl: mediaUrl ?? void 0,
			replyTo: replyTo ?? void 0,
			...readBooleanParam(actionParams, "silent") === true ? { silent: true } : {}
		}, actionOptions);
	}
	if (action === "search") {
		const guildId = readStringParam(actionParams, "guildId");
		const query = readStringParam(actionParams, "query") ?? readStringParam(actionParams, "content");
		if (!query) throw new Error("Discord search requires query text. Provide query or content.");
		const explicitChannelIds = readStringArrayParam(actionParams, "channelIds");
		const channelId = readStringParam(actionParams, "channelId") ?? (!guildId && !explicitChannelIds?.length && ctx.toolContext?.currentChannelProvider?.trim().toLowerCase() === "discord" ? ctx.toolContext?.currentChannelId?.trim() || void 0 : void 0);
		return await runAction("searchMessages", {
			...guildId ? { guildId } : {},
			content: query,
			channelId,
			channelIds: explicitChannelIds,
			authorId: readStringParam(actionParams, "authorId"),
			authorIds: readStringArrayParam(actionParams, "authorIds"),
			limit: readPositiveIntegerParam(actionParams, "limit")
		}, readPolicyOptions);
	}
}
//#endregion
export { tryHandleDiscordMessageActionGuildAdmin as t };
