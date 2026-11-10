import { l as resolveZalouserAccountSync, n as createZalouserSetupWizardProxy, r as zalouserSetupAdapter } from "./.setup/shared-BrhVdA-C.mjs";
import { n as parseZalouserOutboundTarget, t as zalouserPlugin } from "./.setup/channel-D90hoq2j.mjs";
import { n as isZalouserMutableGroupEntry, t as collectZalouserSecurityAuditFindings } from "./.setup/security-audit-DrvGAayb.mjs";
import { s as normalizeZalouserCredentialProfile } from "./.setup/session-state-fejZKa1r.mjs";
import { h as sendZaloLink, i as listZaloFriendsMatching, n as getZaloUserInfo, s as listZaloGroupsMatching, t as checkZaloAuthenticated } from "./.setup/zalo-js-Bu9ojNUf.mjs";
import { n as zalouserSetupWizard } from "./.setup/setup-surface-e3KfVOUQ.mjs";
import { t as zalouserSetupPlugin } from "./.setup/channel.setup-BN3xjhBW.mjs";
import { n as sendMessageZalouser, t as sendImageZalouser } from "./.setup/send-B24acSlE.mjs";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { stringEnum } from "openclaw/plugin-sdk/channel-actions";
import { isChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
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
async function executeZalouserTool(params, signal, context) {
	try {
		switch (params.action) {
			case "send":
			case "image":
			case "link": {
				const target = resolveZalouserSendTarget(params, context);
				const content = params.action === "send" ? params.message : params.url;
				if (!target.threadId || !content) {
					const required = params.action === "image" ? target.threadId ? "url" : "threadId" : params.action === "send" ? "threadId and message" : "threadId and url";
					throw new Error(`${required} required for ${params.action} action`);
				}
				const result = await (params.action === "send" ? sendMessageZalouser : params.action === "image" ? sendImageZalouser : sendZaloLink)(target.threadId, content, {
					signal,
					profile: params.profile,
					...params.action === "image" ? { mediaMaxBytes: resolveToolMediaMaxBytes(params.profile, context) } : {},
					...params.action !== "send" ? { caption: params.message } : {},
					isGroup: target.isGroup
				});
				if (!result.ok) {
					const kind = params.action === "send" ? "message" : params.action;
					throw new Error(result.error || `Failed to send ${kind}`);
				}
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
		return jsonResult({
			error: formatErrorMessage(err),
			...isChannelPartialDeliveryError(err) ? {
				ok: false,
				deliveryStatus: "partial_failed",
				sentBeforeError: true,
				result: err.deliveryResult
			} : {}
		});
	}
}
function createZalouserTool(context) {
	return {
		name: "zalouser",
		label: "Zalo Personal",
		description: "Send messages and access data via Zalo personal account. Actions: send (text message), image (send image URL), link (send link), friends (list/search friends), groups (list groups), me (profile info), status (auth check).",
		parameters: ZalouserToolSchema,
		execute: async (_toolCallId, params, signal) => await executeZalouserTool(params, signal, context)
	};
}
//#endregion
export { collectZalouserSecurityAuditFindings, createZalouserSetupWizardProxy, createZalouserTool, isZalouserMutableGroupEntry, zalouserPlugin, zalouserSetupAdapter, zalouserSetupPlugin, zalouserSetupWizard };
