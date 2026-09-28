import "./setup-surface-BqN86eDL.mjs";
import { l as resolveZalouserAccountSync } from "./shared-Dv-QbpZj.mjs";
import { n as parseZalouserOutboundTarget } from "./channel-I-deAQj9.mjs";
import "./security-audit-DrvGAayb.mjs";
import { i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, t as checkZaloAuthenticated } from "./zalo-js-Cyn1CmVB.mjs";
import { s as normalizeZalouserCredentialProfile } from "./session-state-C2RwsaRK.mjs";
import "./channel.setup-B7KxhArC.mjs";
import { i as sendMessageZalouser, n as sendImageZalouser, r as sendLinkZalouser } from "./send-DmxUI20x.mjs";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { stringEnum } from "openclaw/plugin-sdk/channel-actions";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { Type } from "typebox";
//#region extensions/zalouser/src/tool.ts
const ACTIONS = [
	"send",
	"image",
	"link",
	"friends",
	"groups",
	"me",
	"status"
];
const ZalouserToolSchema = Type.Object({
	action: stringEnum(ACTIONS, { description: `Action to perform: ${ACTIONS.join(", ")}` }),
	threadId: Type.Optional(Type.String({ description: "Thread ID for messaging" })),
	message: Type.Optional(Type.String({ description: "Message text" })),
	isGroup: Type.Optional(Type.Boolean({ description: "Is group chat" })),
	profile: Type.Optional(Type.String({ description: "Profile name" })),
	query: Type.Optional(Type.String({ description: "Search query" })),
	url: Type.Optional(Type.String({ description: "URL for media/link" }))
}, { additionalProperties: false });
function resolveToolMediaMaxBytes(profile, context) {
	const cfg = context?.getRuntimeConfig?.() ?? context?.runtimeConfig ?? context?.config ?? {};
	const route = context?.deliveryContext;
	if (route?.channel === "zalouser" && route.accountId) {
		const account = resolveZalouserAccountSync({
			cfg,
			accountId: route.accountId
		});
		if (normalizeZalouserCredentialProfile(account.profile) === normalizeZalouserCredentialProfile(profile)) return account.mediaMaxBytes;
	}
	return resolveChannelMediaMaxBytes({
		cfg,
		resolveChannelLimitMb: () => (cfg.channels?.zalouser)?.mediaMaxMb
	});
}
function resolveAmbientZalouserTarget(context) {
	const deliveryContext = context?.deliveryContext;
	const rawTarget = deliveryContext?.to;
	if ((deliveryContext?.channel === void 0 || deliveryContext.channel === "zalouser") && typeof rawTarget === "string" && rawTarget.trim()) try {
		return parseZalouserOutboundTarget(rawTarget);
	} catch {}
	if (deliveryContext?.channel && deliveryContext.channel !== "zalouser") return {};
	const ambientThreadId = deliveryContext?.threadId;
	if (typeof ambientThreadId === "string" && ambientThreadId.trim()) return { threadId: ambientThreadId.trim() };
	if (typeof ambientThreadId === "number" && Number.isFinite(ambientThreadId)) return { threadId: String(ambientThreadId) };
	return {};
}
function resolveZalouserSendTarget(params, context) {
	const explicitThreadId = typeof params.threadId === "string" ? params.threadId.trim() : "";
	const ambientTarget = resolveAmbientZalouserTarget(context);
	return {
		threadId: explicitThreadId || ambientTarget.threadId,
		isGroup: typeof params.isGroup === "boolean" ? params.isGroup : ambientTarget.isGroup
	};
}
async function executeZalouserTool(_toolCallId, params, signal, _onUpdate, context) {
	try {
		switch (params.action) {
			case "send": {
				const target = resolveZalouserSendTarget(params, context);
				if (!target.threadId || !params.message) throw new Error("threadId and message required for send action");
				const result = await sendMessageZalouser(target.threadId, params.message, {
					signal,
					profile: params.profile,
					isGroup: target.isGroup
				});
				if (!result.ok) throw new Error(result.error || "Failed to send message");
				return jsonResult({
					success: true,
					messageId: result.messageId
				});
			}
			case "image": {
				const target = resolveZalouserSendTarget(params, context);
				if (!target.threadId) throw new Error("threadId required for image action");
				if (!params.url) throw new Error("url required for image action");
				const result = await sendImageZalouser(target.threadId, params.url, {
					signal,
					profile: params.profile,
					mediaMaxBytes: resolveToolMediaMaxBytes(params.profile, context),
					caption: params.message,
					isGroup: target.isGroup
				});
				if (!result.ok) throw new Error(result.error || "Failed to send image");
				return jsonResult({
					success: true,
					messageId: result.messageId
				});
			}
			case "link": {
				const target = resolveZalouserSendTarget(params, context);
				if (!target.threadId || !params.url) throw new Error("threadId and url required for link action");
				const result = await sendLinkZalouser(target.threadId, params.url, {
					signal,
					profile: params.profile,
					caption: params.message,
					isGroup: target.isGroup
				});
				if (!result.ok) throw new Error(result.error || "Failed to send link");
				return jsonResult({
					success: true,
					messageId: result.messageId
				});
			}
			case "friends": {
				const rows = await listZaloFriendsMatching(params.profile, params.query);
				return jsonResult(rows);
			}
			case "groups": {
				const rows = await listZaloGroupsMatching(params.profile, params.query);
				return jsonResult(rows);
			}
			case "me": {
				const info = await getZaloUserInfo(params.profile);
				return jsonResult(info ?? { error: "Not authenticated" });
			}
			case "status": {
				const authenticated = await checkZaloAuthenticated(params.profile);
				return jsonResult({
					authenticated,
					output: authenticated ? "authenticated" : "not authenticated"
				});
			}
			default:
				params.action;
				throw new Error(`Unknown action: ${String(params.action)}. Valid actions: send, image, link, friends, groups, me, status`);
		}
	} catch (err) {
		return jsonResult({ error: formatErrorMessage(err) });
	}
}
function createZalouserTool(context) {
	return {
		name: "zalouser",
		label: "Zalo Personal",
		description: "Send messages and access data via Zalo personal account. Actions: send (text message), image (send image URL), link (send link), friends (list/search friends), groups (list groups), me (profile info), status (auth check).",
		parameters: ZalouserToolSchema,
		execute: async (toolCallId, params, signal, onUpdate) => await executeZalouserTool(toolCallId, params, signal, onUpdate, context)
	};
}
//#endregion
export { createZalouserTool as t };
