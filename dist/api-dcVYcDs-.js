import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { s as stringEnum } from "./typebox-B_TbP7xZ.js";
import "./error-runtime-CDUW9C58.js";
import "./channel-actions-BCdRlnH7.js";
import "./setup-core-D9JVwI25.js";
import { n as parseZalouserOutboundTarget } from "./channel-D3_qvYfA.js";
import "./security-audit-DC5CKVvi.js";
import { i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, t as checkZaloAuthenticated } from "./zalo-js-KpI7E8rI.js";
import "./setup-surface-CaGPOSFZ.js";
import "./channel.setup-BzJG4yUD.js";
import { i as sendMessageZalouser, n as sendImageZalouser, r as sendLinkZalouser } from "./send-Cs8q4nAW.js";
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
async function executeZalouserTool(_toolCallId, params, _signal, _onUpdate, context) {
	try {
		switch (params.action) {
			case "send": {
				const target = resolveZalouserSendTarget(params, context);
				if (!target.threadId || !params.message) throw new Error("threadId and message required for send action");
				const result = await sendMessageZalouser(target.threadId, params.message, {
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
					profile: params.profile,
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
			case "friends": return jsonResult(await listZaloFriendsMatching(params.profile, params.query));
			case "groups": return jsonResult(await listZaloGroupsMatching(params.profile, params.query));
			case "me": return jsonResult(await getZaloUserInfo(params.profile) ?? { error: "Not authenticated" });
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
