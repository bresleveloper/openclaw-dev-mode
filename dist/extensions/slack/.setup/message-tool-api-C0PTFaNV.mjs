import { r as listSlackAccountIds } from "./accounts-BBHvg0pY.mjs";
import { t as inspectSlackAccount } from "./account-inspect-DP1Bcwj4.mjs";
import { r as resolveSlackThreadTsValue, t as normalizeSlackThreadTsCandidate } from "./thread-ts-CukseRVL.mjs";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { Type } from "typebox";
//#region extensions/slack/src/message-actions.ts
function listSlackMessageActions(cfg, accountId) {
	const accounts = (accountId ? [inspectSlackAccount({
		cfg,
		accountId
	})] : listSlackAccountIds(cfg).map((listedAccountId) => inspectSlackAccount({
		cfg,
		accountId: listedAccountId
	}))).filter((account) => account.enabled && (account.identity === "user" ? account.userTokenStatus === "available" : account.botTokenStatus === "available"));
	if (accounts.length === 0) return [];
	const isActionEnabled = (key, defaultValue = true) => {
		for (const account of accounts) if (createActionGate(account.actions ?? cfg.channels?.slack?.actions)(key, defaultValue)) return true;
		return false;
	};
	const actions = /* @__PURE__ */ new Set(["send"]);
	if (isActionEnabled("reactions")) {
		actions.add("react");
		actions.add("reactions");
	}
	if (isActionEnabled("messages")) {
		actions.add("conversation-open");
		actions.add("read");
		actions.add("edit");
		actions.add("delete");
		actions.add("download-file");
		actions.add("upload-file");
	}
	if (isActionEnabled("pins")) {
		actions.add("pin");
		actions.add("unpin");
		actions.add("list-pins");
	}
	if (isActionEnabled("memberInfo")) actions.add("member-info");
	if (isActionEnabled("emojiList")) actions.add("emoji-list");
	return Array.from(actions);
}
function extractSlackToolSend(args) {
	const action = args.action;
	if (action !== "sendMessage" && action !== "uploadFile" && action !== "send" && action !== "upload-file") return null;
	const extracted = extractToolSend(args, action);
	if (!extracted) return null;
	const nativeThreadTs = typeof args.threadTs === "string" ? normalizeSlackThreadTsCandidate(args.threadTs) : void 0;
	const replyTo = typeof args.replyTo === "string" ? normalizeSlackThreadTsCandidate(args.replyTo) : void 0;
	const threadTs = action === "send" ? resolveSlackThreadTsValue({
		replyToId: replyTo,
		threadId: extracted.threadId
	}) : action === "upload-file" ? normalizeSlackThreadTsCandidate(extracted.threadId) ?? replyTo : nativeThreadTs ?? normalizeSlackThreadTsCandidate(extracted.threadId);
	const threadSuppressed = extracted.threadSuppressed === true || args.topLevel === true || args.threadTs === null;
	return {
		...extracted,
		threadId: threadTs ?? extracted.threadId,
		...!threadTs && !extracted.threadId && !threadSuppressed ? { threadImplicit: true } : {},
		...threadSuppressed ? { threadSuppressed: true } : {}
	};
}
//#endregion
//#region extensions/slack/src/message-tool-api.ts
const SLACK_MESSAGE_ID_ACTIONS = [
	"react",
	"reactions",
	"edit",
	"delete",
	"pin",
	"unpin"
];
function createSlackFileActionSchema() {
	return { fileId: Type.Optional(Type.String({ description: "Slack file id, starting with \"F\" (for example F0B0LTT8M36). Required for action=\"download-file\". Read it from inbound Slack file metadata at event.files[].id. This is not the Slack message timestamp/messageId." })) };
}
function createSlackReactionEmojiSchema(emojiListAvailable) {
	const discoveryHint = emojiListAvailable ? " Discover workspace custom emoji with action:\"emoji-list\"." : "";
	return { emoji: Type.Optional(Type.String({ description: "Slack standard or workspace custom emoji shortcode (for example \"white_check_mark\" or \"+1\") or common emoji character (for example \"✅\"). Colons are optional." + discoveryHint })) };
}
function createSlackForcedMediaSchema() {
	const description = "Preserve original image bytes without image optimization. Slack still uploads a regular file; this does not convert it into a Slack document.";
	return {
		forceDocument: Type.Optional(Type.Boolean({ description })),
		asDocument: Type.Optional(Type.Boolean({ description: `Alias for forceDocument. ${description}` }))
	};
}
function createSlackMessageIdActionSchema() {
	const description = "Slack message timestamp/message id (for example \"1777423717.666499\"). Used by react, reactions, edit, delete, pin, and unpin actions. React defaults to the current inbound message when available. Not used by download-file, which requires fileId from event.files[].id.";
	return {
		messageId: Type.Optional(Type.String({ description })),
		message_id: Type.Optional(Type.String({ description: `${description} Alias for messageId.` }))
	};
}
function createSlackSendActionSchema() {
	return {
		...createSlackForcedMediaSchema(),
		topLevel: Type.Optional(Type.Boolean({ description: "Slack-only opt-out for action=\"send\" from a threaded same-channel context. Set true to post a new parent-channel message instead of inheriting the current Slack thread. `threadId: null` is accepted as the same top-level request." })),
		replyBroadcast: Type.Optional(Type.Boolean({ description: "Slack-only opt-in for action=\"send\" thread replies. Set true with threadId or replyTo on text/block sends to also broadcast the reply to the parent channel. Not supported for media or upload-file." }))
	};
}
function createSlackTopLevelActionSchema() {
	return {
		...createSlackForcedMediaSchema(),
		topLevel: Type.Optional(Type.Boolean({ description: "Slack-only opt-out from threaded same-channel context. Set true to post at the channel root instead of inheriting the current Slack thread." }))
	};
}
function describeSlackMessageTool({ cfg, accountId }) {
	const actions = listSlackMessageActions(cfg, accountId);
	const capabilities = /* @__PURE__ */ new Set();
	const schema = [];
	if (actions.includes("conversation-open")) schema.push({
		actions: ["conversation-open"],
		visibility: "all-configured",
		properties: { userIds: Type.Optional(Type.Array(Type.String({ pattern: "^[UW][A-Z0-9]+$" }), {
			minItems: 1,
			maxItems: 8,
			uniqueItems: true,
			description: "Slack conversation-open: 1-8 other member IDs. One opens a DM; multiple open or reuse a group DM. Exclude the calling account. Use the returned target with action=\"send\". teamId defaults to the trusted current workspace for the selected account; detached Enterprise operations require it."
		})) }
	});
	if (actions.includes("send")) capabilities.add("presentation");
	if (actions.includes("download-file")) schema.push({
		properties: createSlackFileActionSchema(),
		actions: ["download-file"]
	});
	if (actions.includes("send")) schema.push({
		properties: createSlackSendActionSchema(),
		actions: ["send"]
	});
	if (actions.includes("upload-file")) schema.push({
		properties: createSlackTopLevelActionSchema(),
		actions: ["upload-file"]
	});
	if (actions.includes("react")) schema.push({
		properties: createSlackReactionEmojiSchema(actions.includes("emoji-list")),
		actions: ["react", "reactions"]
	});
	const messageIdActions = [];
	for (const action of SLACK_MESSAGE_ID_ACTIONS) if (actions.includes(action)) messageIdActions.push(action);
	if (messageIdActions.length > 0) schema.push({
		properties: createSlackMessageIdActionSchema(),
		actions: messageIdActions
	});
	return {
		actions,
		capabilities: Array.from(capabilities),
		schema: schema.length > 0 ? schema : null
	};
}
//#endregion
export { extractSlackToolSend as n, listSlackMessageActions as r, describeSlackMessageTool as t };
